/**
 * Capacity arithmetic, as pure functions over plain rows.
 *
 * Deliberately knows nothing about the database — and, equally deliberately,
 * NOTHING ABOUT CONFIGURATION: it has no imports at all, so the capacity is
 * always passed in. This is the code that decides whether a guest is told
 * "mesto vas čeka", it has to be provable, and there is no Postgres on the
 * build machine. Being import-free means `scripts/check-availability.mjs` can
 * load this file directly (Node strips the types) and exercise every branch
 * with no credentials, no network and no build step.
 *
 * The DB layer supplies rows and makes no decisions, which is what makes that
 * test meaningful rather than a stub.
 *
 * Same reasoning as `src/lib/price.ts`: both places where being wrong costs the
 * venue real money are isolated and tested.
 */

export type DayLoad = {
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** Sunbeds available that day. */
  capacity: number;
  /**
   * Sunbeds already spoken for.
   *
   * PENDING BOOKINGS COUNT. A request awaiting the owner's approval is holding
   * a sunbed — if it did not count, the venue could accept more requests than
   * it has beds and only discover the conflict at approval time, after guests
   * have been told their request is in.
   */
  taken: number;
};

export type Decision = {
  ok: boolean;
  /** Sunbeds still free before this request. Never negative. */
  free: number;
  /** Sunbeds requested. */
  requested: number;
};

/** Free sunbeds on a day. Clamped: over-booked history must not read negative. */
export function freeOn(day: DayLoad): number {
  return Math.max(0, day.capacity - day.taken);
}

/**
 * Can this party be taken on this day?
 *
 * A day with no capacity row is NOT treated as unlimited — the caller supplies
 * `DEFAULT_CAPACITY`, and a day explicitly set to 0 is closed.
 */
export function decide(requested: number, day: DayLoad): Decision {
  const free = freeOn(day);
  return {
    ok: requested > 0 && requested <= free,
    free,
    requested,
  };
}

/**
 * The first day at or after `from` that could take `requested` sunbeds.
 *
 * This is what the rejection email offers instead of a dead end. `days` must be
 * sorted ascending and cover the horizon being searched; days missing from the
 * list are treated as having `DEFAULT_CAPACITY` and nothing booked, because an
 * empty far-future date has no row until someone books it.
 *
 * Returns null when nothing in the horizon fits — a party larger than the
 * venue's whole capacity, for instance, which no later date can ever absorb.
 */
export function nextFreeDate({
  from,
  requested,
  days,
  capacity,
  horizonDays = 30,
}: {
  from: string;
  requested: number;
  days: DayLoad[];
  /** Capacity for dates with no row of their own. Passed in, never imported. */
  capacity: number;
  horizonDays?: number;
}): string | null {
  if (requested <= 0 || requested > capacity) return null;

  const byDate = new Map(days.map((d) => [d.date, d]));

  for (let i = 1; i <= horizonDays; i++) {
    const date = addDays(from, i);
    const day = byDate.get(date) ?? { date, capacity, taken: 0 };
    if (decide(requested, day).ok) return date;
  }
  return null;
}

/**
 * Adds days to an ISO date.
 *
 * Built from the string parts, like `isWeekendDate` in price.ts — `new
 * Date(iso)` parses as UTC midnight, so in any timezone behind UTC the result
 * lands on the previous day. Here that would offer the guest the wrong date.
 */
export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}
