"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import {
  addManualBooking,
  cancelBooking,
  setDayCapacity,
} from "@/db/bookings";
import { DEFAULT_CAPACITY } from "@/content/booking";
import { requireAdmin, signIn, signOut } from "@/lib/admin-auth";
import { priceFor } from "@/lib/price";
import { isIsoDate } from "@/lib/validate";

/**
 * Owner console actions.
 *
 * EVERY ONE OF THESE CALLS `requireAdmin()` FIRST. A server action is a public
 * HTTP endpoint — the fact that its button only renders behind a login screen
 * protects nothing. `requireAdmin` throws, so an action that forgets to handle
 * the result still cannot continue.
 */

export type AdminState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string };

export async function login(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  const ok = await signIn(String(formData.get("password") ?? ""));
  if (!ok) {
    // Deliberately vague: no hint about whether a password is even configured.
    return { status: "error", message: "Pogrešna lozinka." };
  }
  revalidatePath("/admin");
  return { status: "ok", message: "Dobrodošli." };
}

export async function logout(): Promise<void> {
  await signOut();
  revalidatePath("/admin");
}

/** A booking taken over the phone. Priced on the server like any other. */
export async function addPhoneBooking(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const visitDate = String(formData.get("datum") ?? "");
  if (!isIsoDate(visitDate)) {
    return { status: "error", message: "Datum nije ispravan." };
  }

  const num = (name: string) => {
    const n = Number(formData.get(name) ?? 0);
    return Number.isInteger(n) && n >= 0 && n <= 40 ? n : null;
  };
  const adults = num("odrasli");
  const children = num("deca4do12");
  const under4 = num("decaDo4");
  if (adults === null || children === null || under4 === null) {
    return { status: "error", message: "Broj gostiju nije ispravan." };
  }
  if (adults + children < 1) {
    return { status: "error", message: "Potreban je bar jedan gost koji plaća." };
  }

  const guestName = String(formData.get("ime") ?? "").trim();
  if (guestName.length < 2) {
    return { status: "error", message: "Unesite ime gosta." };
  }
  const phone = String(formData.get("telefon") ?? "").trim();
  const arrival = formData.get("dolazak") === "afternoon" ? "afternoon" : "full";
  const note = String(formData.get("napomena") ?? "").trim() || null;

  /* Same pricing function as the public form — a phone guest and a web guest
     must never be quoted different numbers for the same party. */
  const price = priceFor({
    date: visitDate,
    ticket: "day",
    arrival,
    party: { adults, children4to12: children, under4 },
  });

  const result = await addManualBooking({
    visitDate,
    arrival,
    adults,
    children,
    under4,
    totalRsd: price.total,
    guestName,
    phone,
    note,
    decisionToken: randomBytes(24).toString("base64url"),
  });

  revalidatePath("/admin");

  if (!result.ok) {
    return {
      status: "error",
      message: `Nema dovoljno mesta — slobodno je još ${result.free}. Povećajte kapacitet tog dana ako želite da ipak upišete.`,
    };
  }
  return {
    status: "ok",
    message: `Upisano: ${guestName}, ${adults + children} ležaljki, ${price.total} din.`,
  };
}

/** Change how many sunbeds a given day has. `0` closes it. */
export async function updateCapacity(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const day = String(formData.get("datum") ?? "");
  if (!isIsoDate(day)) return { status: "error", message: "Datum nije ispravan." };

  const capacity = Number(formData.get("kapacitet") ?? DEFAULT_CAPACITY);
  if (!Number.isInteger(capacity) || capacity < 0 || capacity > 500) {
    return { status: "error", message: "Kapacitet mora biti između 0 i 500." };
  }

  const note = String(formData.get("napomena") ?? "").trim() || null;
  await setDayCapacity(day, capacity, note);
  revalidatePath("/admin");

  return {
    status: "ok",
    message:
      capacity === 0
        ? "Dan je označen kao zatvoren."
        : `Kapacitet za taj dan je sada ${capacity}.`,
  };
}

/** Free a booking's sunbeds. Kept as a row, marked cancelled. */
export async function cancel(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { status: "error", message: "Rezervacija nije pronađena." };

  await cancelBooking(id);
  revalidatePath("/admin");
  return { status: "ok", message: "Rezervacija je otkazana i mesta su oslobođena." };
}
