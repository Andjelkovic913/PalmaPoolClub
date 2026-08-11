/**
 * Proves the capacity arithmetic without a database.
 *
 * There is no Postgres on this machine, and the decision "mesto vas čeka" must
 * be provable anyway — so `src/lib/availability.ts` is pure, import-free, and
 * loaded here DIRECTLY (Node ≥22 strips the types). No regex de-typing, no
 * bundler, no stub: this runs the exact code that ships.
 *
 * That is also why `availability.ts` must stay import-free. If someone adds an
 * import to it, this script fails loudly on the path alias rather than
 * silently testing a copy.
 *
 * Usage: node scripts/check-availability.mjs      (no server, no credentials)
 */
const { freeOn, decide, nextFreeDate, addDays } = await import(
  new URL("../src/lib/availability.ts", import.meta.url).href
);

/** Matches DEFAULT_CAPACITY in src/content/booking.ts — owner-confirmed. */
const CAPACITY = 40;

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });
const eq = (name, got, want) =>
  check(name, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

const day = (date, taken, capacity = CAPACITY) => ({ date, capacity, taken });

// ── free sunbeds ───────────────────────────────────────────────────────────
eq("empty day is fully free", freeOn(day("2026-08-20", 0)), 40);
eq("partly booked", freeOn(day("2026-08-20", 33)), 7);
eq("exactly full", freeOn(day("2026-08-20", 40)), 0);
eq("historic over-booking never reads negative", freeOn(day("2026-08-20", 47)), 0);
eq("a day explicitly set to 0 is closed", freeOn(day("2026-08-20", 0, 0)), 0);

// ── the accept / reject decision ───────────────────────────────────────────
check("fits comfortably", decide(3, day("2026-08-20", 10)).ok === true);
check("takes the very last bed", decide(1, day("2026-08-20", 39)).ok === true);
check("fills the day exactly", decide(7, day("2026-08-20", 33)).ok === true);
check("one over the limit is refused", decide(8, day("2026-08-20", 33)).ok === false);
check("full day refuses everything", decide(1, day("2026-08-20", 40)).ok === false);
check("closed day refuses everything", decide(1, day("2026-08-20", 0, 0)).ok === false);
check("a request for zero is not a booking", decide(0, day("2026-08-20", 0)).ok === false);
check("party larger than the venue is refused", decide(41, day("2026-08-20", 0)).ok === false);

// ── next free date ─────────────────────────────────────────────────────────
const busy = [day("2026-08-20", 40), day("2026-08-21", 40), day("2026-08-22", 38)];

eq(
  "skips full days and offers the first that fits",
  nextFreeDate({ from: "2026-08-19", requested: 2, days: busy, capacity: CAPACITY }),
  "2026-08-22"
);
eq(
  "a bigger party skips a day that only just fills",
  nextFreeDate({ from: "2026-08-19", requested: 3, days: busy, capacity: CAPACITY }),
  "2026-08-23"
);
eq(
  "days with no row are treated as empty",
  nextFreeDate({ from: "2026-08-19", requested: 40, days: busy, capacity: CAPACITY }),
  "2026-08-23"
);
eq(
  // Starts the search the day AFTER the refused one, and settles on a day that
  // is only partly free rather than skipping to the next empty date.
  "never offers back the date that was just refused",
  nextFreeDate({ from: "2026-08-20", requested: 2, days: busy, capacity: CAPACITY }),
  "2026-08-22"
);
eq(
  "a party larger than the venue gets no date, ever",
  nextFreeDate({ from: "2026-08-19", requested: 41, days: busy, capacity: CAPACITY }),
  null
);
eq(
  "nothing inside the horizon means null, not a wrong date",
  nextFreeDate({
    from: "2026-08-19",
    requested: 1,
    days: Array.from({ length: 40 }, (_, i) => day(addDays("2026-08-19", i + 1), 40)),
    capacity: CAPACITY,
  }),
  null
);

// ── date maths (the UTC trap) ──────────────────────────────────────────────
eq("adds a day", addDays("2026-08-19", 1), "2026-08-20");
eq("crosses a month boundary", addDays("2026-08-31", 1), "2026-09-01");
eq("crosses a year boundary", addDays("2026-12-31", 1), "2027-01-01");
eq("handles a leap day", addDays("2028-02-28", 1), "2028-02-29");
eq("zero is a no-op", addDays("2026-08-19", 0), "2026-08-19");

console.log("\n=== AVAILABILITY ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  — " + r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
