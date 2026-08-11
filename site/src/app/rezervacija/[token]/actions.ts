"use server";

import { revalidatePath } from "next/cache";
import { decideBooking } from "@/db/bookings";
import {
  sendGuestConfirmed,
  sendGuestRejected,
  type BookingSummary,
} from "@/lib/email";

export type DecisionState =
  | { status: "idle" }
  | { status: "done"; answer: "confirmed" | "rejected"; emailed: boolean }
  | { status: "already" }
  | { status: "notfound" }
  | { status: "error"; message: string };

/**
 * The venue's answer, as a POST.
 *
 * Never a GET. Mail clients and corporate security appliances prefetch links
 * to scan them — Gmail, Outlook and Safe Links all do — so a URL that
 * confirmed a booking on GET would be triggered by the scanner before the
 * owner ever read the message. The emailed link opens a read-only page; this
 * action runs only on a real button press.
 */
export async function decide(
  _prev: DecisionState,
  formData: FormData
): Promise<DecisionState> {
  const token = String(formData.get("token") ?? "");
  const answer = formData.get("answer") === "confirmed" ? "confirmed" : "rejected";
  if (!token) return { status: "notfound" };

  try {
    const result = await decideBooking(token, answer);

    if (result.outcome === "notfound") return { status: "notfound" };
    if (result.outcome === "already") return { status: "already" };

    const b = result.booking;
    const summary: BookingSummary = {
      visitDate: b.visitDate,
      ticket: b.ticket,
      arrival: b.arrival,
      adults: b.adults,
      children: b.children,
      under4: b.under4,
      sunbeds: b.sunbeds,
      totalRsd: b.totalRsd,
      guestName: b.guestName,
      phone: b.phone,
      email: b.email,
    };

    let emailed = false;
    try {
      if (result.outcome === "confirmed") {
        await sendGuestConfirmed(summary);
      } else {
        await sendGuestRejected(summary, result.nextFree);
      }
      emailed = true;
    } catch (err) {
      // The decision is already committed. Say so honestly rather than
      // pretending it failed and inviting a second, contradictory click.
      console.error("[booking] slanje odgovora gostu nije uspelo:", err);
    }

    revalidatePath(`/rezervacija/${token}`);
    return { status: "done", answer: result.outcome, emailed };
  } catch (err) {
    console.error("[booking] odluka nije uspela:", err);
    return {
      status: "error",
      message: "Greška pri upisu. Osvežite stranicu i pokušajte ponovo.",
    };
  }
}
