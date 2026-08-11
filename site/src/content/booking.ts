/**
 * Booking configuration and status vocabulary.
 *
 * Copy for the emails lives in `src/content/emails.ts`; this file is the
 * numbers and the state machine.
 */

/**
 * Sunbeds available per day — **40**, confirmed by the owner.
 *
 * This resolves OPEN_QUESTIONS.md #5, which blocked the whole accept/reject
 * decision. A per-date override lives in the `day_capacity` table for days the
 * venue closes early, hosts a Matine, or opens extra beds; this is the value
 * used when no row exists for a date.
 *
 * A day whose row explicitly says 0 is CLOSED, not unlimited.
 */
export const DEFAULT_CAPACITY = 40;

/** How far ahead a rejection email looks for an alternative date. */
export const NEXT_FREE_HORIZON_DAYS = 30;

/** Max booking requests accepted from one IP per hour. */
export const RATE_LIMIT_PER_HOUR = 5;

/**
 * Booking lifecycle.
 *
 * `pending` HOLDS CAPACITY. A request the owner has not yet answered is
 * occupying a sunbed as far as availability is concerned — otherwise the venue
 * could take more requests than it has beds and only find out at approval time,
 * with guests already told their request was received.
 */
export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "rejected",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Statuses that occupy a sunbed. */
export const HOLDING_STATUSES: BookingStatus[] = ["pending", "confirmed"];

/** Human labels, for the owner's decision page. */
export const statusLabels: Record<BookingStatus, string> = {
  pending: "Čeka odgovor",
  confirmed: "Potvrđena",
  rejected: "Odbijena",
  cancelled: "Otkazana",
};
