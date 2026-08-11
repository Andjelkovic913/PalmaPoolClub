import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { getDb } from "./index";
import { bookings, dayCapacity, type BookingRow } from "./schema";
import {
  DEFAULT_CAPACITY,
  HOLDING_STATUSES,
  NEXT_FREE_HORIZON_DAYS,
  RATE_LIMIT_PER_HOUR,
} from "@/content/booking";
import { addDays, decide, nextFreeDate, type DayLoad } from "@/lib/availability";

/**
 * Everything that touches the bookings tables.
 *
 * The decisions themselves live in `src/lib/availability.ts` as pure functions
 * — this file only fetches rows, holds the lock, and writes. That split is what
 * lets the risky arithmetic be tested with no database
 * (`scripts/check-availability.mjs`), which matters because there is no
 * Postgres on the build machine.
 */

export type CreateBookingInput = {
  visitDate: string;
  ticket: "day" | "matine";
  arrival: "full" | "afternoon";
  adults: number;
  children: number;
  under4: number;
  /** Recomputed on the server before it reaches here. Never the client's number. */
  totalRsd: number;
  guestName: string;
  phone: string;
  email: string | null;
  ip: string | null;
  decisionToken: string;
};

export type CreateResult =
  | { outcome: "pending"; booking: BookingRow }
  | { outcome: "full"; free: number; requested: number; nextFree: string | null };

/**
 * Takes a booking request, or refuses it because the day is full.
 *
 * ── THE LOCK ───────────────────────────────────────────────────────────────
 * Everything below happens in ONE transaction, and the first thing it does is
 * take `FOR UPDATE` on the `day_capacity` row for the requested date. That
 * serialises every concurrent request for that day and nothing else: two
 * guests booking the last two sunbeds in the same second are ordered, the
 * second one sees the first one's row, and the venue cannot oversell.
 *
 * Without it both requests read "2 free", both write, and 42 people arrive to
 * 40 sunbeds. Read-then-write without a lock is the whole bug.
 *
 * ── WHY PENDING HOLDS A BED ────────────────────────────────────────────────
 * `HOLDING_STATUSES` counts `pending` as well as `confirmed`. A request the
 * owner has not answered yet is holding a sunbed; if it did not count, the
 * venue could accept more requests than it has beds and only discover the
 * clash at approval time, after every guest had been told their request was in.
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateResult> {
  const db = getDb();
  const requested = input.adults + input.children;

  return db.transaction(async (tx) => {
    // Make sure a row exists to lock. `onConflictDoNothing` is safe under
    // concurrency — whoever loses the race still finds the row on the select.
    await tx
      .insert(dayCapacity)
      .values({ day: input.visitDate, capacity: DEFAULT_CAPACITY })
      .onConflictDoNothing();

    const [day] = await tx
      .select()
      .from(dayCapacity)
      .where(eq(dayCapacity.day, input.visitDate))
      .for("update");

    const capacity = day?.capacity ?? DEFAULT_CAPACITY;

    const [taken] = await tx
      .select({ sum: sql<number>`coalesce(sum(${bookings.sunbeds}), 0)::int` })
      .from(bookings)
      .where(
        and(
          eq(bookings.visitDate, input.visitDate),
          inArray(bookings.status, HOLDING_STATUSES)
        )
      );

    const load: DayLoad = {
      date: input.visitDate,
      capacity,
      taken: taken?.sum ?? 0,
    };
    const verdict = decide(requested, load);

    if (!verdict.ok) {
      // Refused inside the same transaction, so the alternative date offered is
      // consistent with the state that caused the refusal.
      const horizon = await loadDays(
        tx,
        addDays(input.visitDate, 1),
        addDays(input.visitDate, NEXT_FREE_HORIZON_DAYS)
      );
      return {
        outcome: "full" as const,
        free: verdict.free,
        requested,
        nextFree: nextFreeDate({
          from: input.visitDate,
          requested,
          days: horizon,
          capacity: DEFAULT_CAPACITY,
          horizonDays: NEXT_FREE_HORIZON_DAYS,
        }),
      };
    }

    const [row] = await tx
      .insert(bookings)
      .values({
        visitDate: input.visitDate,
        ticket: input.ticket,
        arrival: input.arrival,
        adults: input.adults,
        children: input.children,
        under4: input.under4,
        sunbeds: requested,
        totalRsd: input.totalRsd,
        guestName: input.guestName,
        phone: input.phone,
        email: input.email,
        status: "pending",
        decisionToken: input.decisionToken,
        ip: input.ip,
      })
      .returning();

    return { outcome: "pending" as const, booking: row };
  });
}

/** Capacity + load for a date range, for the "next free date" search. */
async function loadDays(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0],
  from: string,
  to: string
): Promise<DayLoad[]> {
  const caps = await tx
    .select()
    .from(dayCapacity)
    .where(and(gte(dayCapacity.day, from), lte(dayCapacity.day, to)));

  const loads = await tx
    .select({
      day: bookings.visitDate,
      taken: sql<number>`coalesce(sum(${bookings.sunbeds}), 0)::int`,
    })
    .from(bookings)
    .where(
      and(
        gte(bookings.visitDate, from),
        lte(bookings.visitDate, to),
        inArray(bookings.status, HOLDING_STATUSES)
      )
    )
    .groupBy(bookings.visitDate);

  const takenBy = new Map(loads.map((l) => [l.day, l.taken]));
  const capBy = new Map(caps.map((c) => [c.day, c.capacity]));

  const dates = new Set([...takenBy.keys(), ...capBy.keys()]);
  return [...dates].map((d) => ({
    date: d,
    capacity: capBy.get(d) ?? DEFAULT_CAPACITY,
    taken: takenBy.get(d) ?? 0,
  }));
}

/**
 * How full one day is, right now.
 *
 * The owner needs this to answer a request: the email and the decision page
 * both state it. Capacity is already enforced before they ever see a request —
 * anything that does not fit is auto-refused and never reaches them — so this
 * is context for the judgement call ("do we want this booking?"), not a sum
 * they have to do themselves.
 *
 * Read live rather than frozen into the email, because other bookings can
 * arrive between the email being sent and the owner opening it.
 */
export async function loadForDay(day: string): Promise<DayLoad> {
  const db = getDb();

  const [cap] = await db
    .select()
    .from(dayCapacity)
    .where(eq(dayCapacity.day, day))
    .limit(1);

  const [taken] = await db
    .select({ sum: sql<number>`coalesce(sum(${bookings.sunbeds}), 0)::int` })
    .from(bookings)
    .where(
      and(eq(bookings.visitDate, day), inArray(bookings.status, HOLDING_STATUSES))
    );

  return {
    date: day,
    capacity: cap?.capacity ?? DEFAULT_CAPACITY,
    taken: taken?.sum ?? 0,
  };
}

/** The booking behind an owner decision link. */
export async function findByToken(token: string): Promise<BookingRow | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.decisionToken, token))
    .limit(1);
  return row ?? null;
}

export type DecideResult =
  | { outcome: "confirmed"; booking: BookingRow }
  | { outcome: "rejected"; booking: BookingRow; nextFree: string | null }
  | { outcome: "already"; booking: BookingRow }
  | { outcome: "notfound" };

/**
 * The owner's answer.
 *
 * Idempotent by design: re-opening the decision page and clicking again — or a
 * double submit — returns `already` instead of sending the guest a second,
 * contradictory email. The status check happens inside the transaction so two
 * clicks in flight at once cannot both win.
 */
export async function decideBooking(
  token: string,
  answer: "confirmed" | "rejected"
): Promise<DecideResult> {
  const db = getDb();

  return db.transaction(async (tx) => {
    const [row] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.decisionToken, token))
      .for("update")
      .limit(1);

    if (!row) return { outcome: "notfound" as const };
    if (row.status !== "pending") {
      return { outcome: "already" as const, booking: row };
    }

    const [updated] = await tx
      .update(bookings)
      .set({ status: answer, decidedAt: new Date() })
      .where(eq(bookings.id, row.id))
      .returning();

    if (answer === "confirmed") {
      return { outcome: "confirmed" as const, booking: updated };
    }

    const horizon = await loadDays(
      tx,
      addDays(updated.visitDate, 1),
      addDays(updated.visitDate, NEXT_FREE_HORIZON_DAYS)
    );
    return {
      outcome: "rejected" as const,
      booking: updated,
      nextFree: nextFreeDate({
        from: updated.visitDate,
        requested: updated.sunbeds,
        days: horizon,
        capacity: DEFAULT_CAPACITY,
        horizonDays: NEXT_FREE_HORIZON_DAYS,
      }),
    };
  });
}

/**
 * Crude but effective abuse guard.
 *
 * This endpoint sends email and writes rows on behalf of an anonymous
 * visitor, so it needs a ceiling. Counted from the bookings table rather than
 * a separate store because serverless instances share no memory — an
 * in-process counter would reset on every cold start and guard nothing.
 */
export async function recentCountForIp(ip: string): Promise<number> {
  const db = getDb();
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(bookings)
    .where(and(eq(bookings.ip, ip), gte(bookings.createdAt, since)));
  return row?.n ?? 0;
}

export function isRateLimited(count: number): boolean {
  return count >= RATE_LIMIT_PER_HOUR;
}

/* ── owner console (/admin) ─────────────────────────────────────────────── */

/** Every booking on a day, newest first. Cancelled and rejected included. */
export async function bookingsForDay(day: string): Promise<BookingRow[]> {
  const db = getDb();
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.visitDate, day))
    .orderBy(desc(bookings.createdAt));
}

/**
 * A booking the owner took on the phone.
 *
 * Inserted as `confirmed`, not `pending`: it was agreed on the call, there is
 * nothing left to approve, and it must occupy a sunbed immediately. Still
 * goes through the same locked transaction as an online request, so a phone
 * entry and a web request racing each other cannot together exceed capacity.
 *
 * Returns `null` when the day cannot take it — the owner is told rather than
 * silently overbooking. They can raise that day's capacity and retry.
 */
export async function addManualBooking(input: {
  visitDate: string;
  arrival: "full" | "afternoon";
  adults: number;
  children: number;
  under4: number;
  totalRsd: number;
  guestName: string;
  phone: string;
  note: string | null;
  decisionToken: string;
}): Promise<{ ok: true; booking: BookingRow } | { ok: false; free: number }> {
  const db = getDb();
  const requested = input.adults + input.children;

  return db.transaction(async (tx) => {
    await tx
      .insert(dayCapacity)
      .values({ day: input.visitDate, capacity: DEFAULT_CAPACITY })
      .onConflictDoNothing();

    const [day] = await tx
      .select()
      .from(dayCapacity)
      .where(eq(dayCapacity.day, input.visitDate))
      .for("update");

    const [taken] = await tx
      .select({ sum: sql<number>`coalesce(sum(${bookings.sunbeds}), 0)::int` })
      .from(bookings)
      .where(
        and(
          eq(bookings.visitDate, input.visitDate),
          inArray(bookings.status, HOLDING_STATUSES)
        )
      );

    const load: DayLoad = {
      date: input.visitDate,
      capacity: day?.capacity ?? DEFAULT_CAPACITY,
      taken: taken?.sum ?? 0,
    };
    const verdict = decide(requested, load);
    if (!verdict.ok) return { ok: false as const, free: verdict.free };

    const [row] = await tx
      .insert(bookings)
      .values({
        visitDate: input.visitDate,
        ticket: "day",
        arrival: input.arrival,
        adults: input.adults,
        children: input.children,
        under4: input.under4,
        sunbeds: requested,
        totalRsd: input.totalRsd,
        guestName: input.guestName,
        phone: input.phone,
        email: null,
        status: "confirmed",
        source: "phone",
        note: input.note,
        decisionToken: input.decisionToken,
      })
      .returning();

    return { ok: true as const, booking: row };
  });
}

/** Set (or clear) a day's capacity. `0` closes the day. */
export async function setDayCapacity(
  day: string,
  capacity: number,
  note: string | null
): Promise<void> {
  const db = getDb();
  await db
    .insert(dayCapacity)
    .values({ day, capacity, note })
    .onConflictDoUpdate({
      target: dayCapacity.day,
      set: { capacity, note },
    });
}

/**
 * Release a booking's sunbeds.
 *
 * Marked `cancelled` rather than deleted: the venue keeps a record of what was
 * agreed and with whom, which matters when a guest turns up insisting.
 */
export async function cancelBooking(id: string): Promise<void> {
  const db = getDb();
  await db
    .update(bookings)
    .set({ status: "cancelled", decidedAt: new Date() })
    .where(eq(bookings.id, id));
}

/** Recent bookings, for the seed script and manual inspection. */
export async function recentBookings(limit = 20): Promise<BookingRow[]> {
  const db = getDb();
  return db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(limit);
}
