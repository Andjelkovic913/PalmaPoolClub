"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import {
  createBooking,
  isRateLimited,
  loadForDay,
  recentCountForIp,
} from "@/db/bookings";
import { isDbConfigured } from "@/db";
import {
  isEmailConfigured,
  sendGuestPending,
  sendGuestRejected,
  sendOwnerNotice,
  type BookingSummary,
} from "@/lib/email";
import { priceFor } from "@/lib/price";
import { validateBooking } from "@/lib/validate";

/**
 * The booking request handler.
 *
 * Order matters here, and every step exists because of a specific failure:
 *
 *   1. validate      — nothing from the browser is trusted, including the total
 *   2. RE-PRICE      — the server computes the money, the client only displayed it
 *   3. rate limit    — this endpoint writes rows and sends mail for anonymous users
 *   4. transaction   — capacity is checked and the row written under a lock
 *   5. email         — and a send failure never loses a booking that was written
 */

export type BookingState =
  | { status: "idle" }
  | { status: "error"; errors: string[] }
  | { status: "pending"; total: number; visitDate: string; emailed: boolean }
  | {
      status: "full";
      free: number;
      requested: number;
      nextFree: string | null;
      emailed: boolean;
    };

export async function submitBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  if (!isDbConfigured()) {
    return {
      status: "error",
      errors: [
        "Rezervacije trenutno nisu dostupne. Pozovite nas i rado ćemo vam pomoći.",
      ],
    };
  }

  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  /* Field names are the Serbian ones the form actually renders — the DOM is
     the user-facing surface and stays in the site's language. */
  const parsed = validateBooking(
    {
      visitDate: formData.get("datum"),
      ticket: formData.get("tip"),
      arrival: formData.get("dolazak"),
      adults: formData.get("odrasli"),
      children: formData.get("deca4do12"),
      under4: formData.get("decaDo4"),
      guestName: formData.get("ime"),
      phone: formData.get("telefon"),
      email: formData.get("email"),
    },
    todayIso
  );

  // Honeypot: a field hidden from humans. Bots fill everything.
  if (String(formData.get("website") ?? "")) {
    // Silently accept and do nothing. Telling a bot it was detected only helps
    // it try again differently.
    return { status: "pending", total: 0, visitDate: todayIso, emailed: false };
  }

  if (!parsed.ok) return { status: "error", errors: parsed.errors };
  const v = parsed.value;

  /* THE PRICE IS COMPUTED HERE, from validated fields. The number the browser
     rendered never reaches the database. */
  const price = priceFor({
    date: v.visitDate,
    ticket: v.ticket,
    arrival: v.arrival,
    party: { adults: v.adults, children4to12: v.children, under4: v.under4 },
  });

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    null;

  if (ip && isRateLimited(await recentCountForIp(ip))) {
    return {
      status: "error",
      errors: [
        "Previše zahteva sa ove veze. Pokušajte ponovo kasnije ili nas pozovite.",
      ],
    };
  }

  const result = await createBooking({
    visitDate: v.visitDate,
    ticket: v.ticket,
    arrival: v.arrival,
    adults: v.adults,
    children: v.children,
    under4: v.under4,
    totalRsd: price.total,
    guestName: v.guestName,
    phone: v.phone,
    email: v.email,
    ip,
    decisionToken: randomBytes(32).toString("base64url"),
  });

  const summary: BookingSummary = {
    visitDate: v.visitDate,
    ticket: v.ticket,
    arrival: v.arrival,
    adults: v.adults,
    children: v.children,
    under4: v.under4,
    sunbeds: v.adults + v.children,
    totalRsd: price.total,
    guestName: v.guestName,
    phone: v.phone,
    email: v.email,
  };

  if (result.outcome === "full") {
    const emailed = await safeSend("gostu", () =>
      sendGuestRejected(summary, result.nextFree)
    );
    return {
      status: "full",
      free: result.free,
      requested: result.requested,
      nextFree: result.nextFree,
      emailed,
    };
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${hdrs.get("host") ?? "localhost:3000"}`;
  const decisionUrl = `${origin}/rezervacija/${result.booking.decisionToken}`;

  /* Read AFTER the insert, so the figure the owner sees already includes this
     request — "28 od 40" rather than "25 od 40 and one more pending". */
  const load = await loadForDay(v.visitDate).catch(() => null);

  /* SENT INDEPENDENTLY, and the venue's copy goes first.
     These two fail for completely different reasons: the guest's address can
     be a typo, or refused while the sending domain is unverified, while the
     venue's is a constant. Sending them in one try/catch meant a bad guest
     address made the whole thing report failure even though the owner had
     already been notified — so the guest was told nobody had heard from them
     when in fact the venue had. */
  const ownerEmailed = await safeSend("vlasniku", () =>
    sendOwnerNotice(
      summary,
      decisionUrl,
      load ? { taken: load.taken, capacity: load.capacity } : undefined
    )
  );
  const guestEmailed = await safeSend("gostu", () => sendGuestPending(summary));

  if (!ownerEmailed) {
    // Not fatal — the booking is stored and visible on /admin — but it is the
    // one failure that stalls the whole flow, so make it loud in the logs.
    console.error(
      "[booking] VLASNIK NIJE OBAVEŠTEN o rezervaciji",
      result.booking.id
    );
  }

  return {
    status: "pending",
    total: price.total,
    visitDate: v.visitDate,
    emailed: guestEmailed,
  };
}

/**
 * A booking that is already in the database must not be reported as failed
 * because the mail provider had a bad minute. The guest is told whether the
 * email went out; the reservation itself stands either way, and the venue can
 * still see it in Supabase.
 */
async function safeSend(
  who: string,
  fn: () => Promise<unknown>
): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  try {
    await fn();
    return true;
  } catch (err) {
    console.error(`[booking] slanje mejla ${who} nije uspelo:`, err);
    return false;
  }
}
