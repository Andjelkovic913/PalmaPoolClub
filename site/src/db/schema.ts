import {
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Booking storage.
 *
 * Supabase Postgres, driven through Drizzle. Supabase was chosen over a bare
 * Postgres host for one concrete reason: the owner gets a table editor to see
 * and correct bookings without anyone building an admin UI. Drizzle is used
 * for the logic rather than the Supabase JS client because the accept/reject
 * path needs a REAL TRANSACTION with row locking — see `src/db/bookings.ts`.
 * Two people booking the last two sunbeds in the same second must not both
 * succeed.
 *
 * Personal data lives here: name, phone, optional email. Keep it to what the
 * venue actually needs to hold a sunbed, and do not add fields casually.
 */

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    /** The day of the visit, `YYYY-MM-DD`. Not a timestamp — the venue sells days. */
    visitDate: date("visit_date").notNull(),
    /** 'day' | 'matine' — see src/lib/price.ts */
    ticket: text("ticket").notNull().default("day"),
    /** 'full' | 'afternoon' */
    arrival: text("arrival").notNull().default("full"),

    adults: integer("adults").notNull(),
    children: integer("children").notNull(),
    under4: integer("under4").notNull(),

    /**
     * adults + children. Denormalised on purpose: this is the unit capacity is
     * counted in, and it is summed on every availability check. Under-4s are
     * excluded — they are free and take no sunbed (OPEN_QUESTIONS.md #15).
     */
    sunbeds: integer("sunbeds").notNull(),

    /**
     * Price in RSD, RECOMPUTED ON THE SERVER at insert time. Never the figure
     * the browser sent — that is user input, not a price.
     */
    totalRsd: integer("total_rsd").notNull(),

    guestName: text("guest_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),

    /** 'pending' | 'confirmed' | 'rejected' | 'cancelled' — src/content/booking.ts */
    status: text("status").notNull().default("pending"),

    /**
     * 'online' | 'phone'.
     *
     * The venue has always taken bookings by telephone, and those never
     * touched this database — so the day count was only ever half the truth
     * and the site could accept guests for a day that was really full. The
     * owner now enters phone bookings on /admin, which is what makes the
     * capacity figure trustworthy. Phone rows are inserted as `confirmed`:
     * the owner agreed them on the call, there is nothing left to approve.
     */
    source: text("source").notNull().default("online"),

    /** Free-text, owner-only. Never shown to a guest. */
    note: text("note"),

    /**
     * Single-use secret in the owner's decision link.
     *
     * The link opens a PAGE; it never mutates on GET. Mail clients and security
     * scanners prefetch links, and a GET that approved a booking would let
     * Gmail's scanner confirm reservations on its own.
     */
    decisionToken: text("decision_token").notNull().unique(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),

    /** For rate limiting only. */
    ip: text("ip"),
  },
  (t) => [
    // Every availability check filters by date and status.
    index("bookings_visit_date_idx").on(t.visitDate),
    index("bookings_created_at_idx").on(t.createdAt),
  ]
);

/**
 * Per-date capacity.
 *
 * A row exists only for days someone has touched; anything else uses
 * `DEFAULT_CAPACITY` (40, owner-confirmed). A row set explicitly to 0 means
 * CLOSED — early closing, private hire, end of season — and refuses everything.
 *
 * This table is also the lock target: the booking transaction takes `FOR
 * UPDATE` on the row for the requested date, which serialises every concurrent
 * booking for that day and nothing else.
 */
export const dayCapacity = pgTable("day_capacity", {
  day: date("day").primaryKey(),
  capacity: integer("capacity").notNull(),
  note: text("note"),
});

export type BookingRow = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
