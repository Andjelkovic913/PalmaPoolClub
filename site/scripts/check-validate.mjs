/**
 * Proves the server-side validation, with no database and no server.
 *
 * `src/lib/validate.ts` is import-free for the same reason
 * `src/lib/availability.ts` is: it can be loaded straight into Node (which
 * strips the types) and every branch exercised offline. This is the code that
 * decides what a stranger on the internet is allowed to write into the
 * venue's database, so it gets tested rather than trusted.
 *
 * Usage: node scripts/check-validate.mjs
 */
const { validateBooking, isIsoDate, isEmail } = await import(
  new URL("../src/lib/validate.ts", import.meta.url).href
);

const TODAY = "2026-08-10";
const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

const base = {
  visitDate: "2026-08-20",
  ticket: "day",
  arrival: "full",
  adults: 2,
  children: 0,
  under4: 0,
  guestName: "Marko Marković",
  phone: "060 111 2233",
  email: "marko@example.com",
};
const run = (over = {}) => validateBooking({ ...base, ...over }, TODAY);

const ok = (name, over) => check(name, run(over).ok === true, JSON.stringify(run(over).errors ?? []));
const bad = (name, over) => check(name, run(over).ok === false);

// ── the happy path ─────────────────────────────────────────────────────────
ok("a normal request passes", {});
ok("email is optional", { email: "" });
ok("today itself is bookable", { visitDate: TODAY });
ok("children alone are a valid party", { adults: 0, children: 2 });
ok("under-4s ride along", { adults: 1, children: 0, under4: 3 });

// ── dates ──────────────────────────────────────────────────────────────────
bad("yesterday is refused", { visitDate: "2026-08-09" });
bad("a malformed date is refused", { visitDate: "20.08.2026" });
bad("a missing date is refused", { visitDate: null });
bad("31 February is refused", { visitDate: "2026-02-31" });
bad("month 13 is refused", { visitDate: "2026-13-01" });
check("isIsoDate rejects a non-string", isIsoDate(20260820) === false);
check("isIsoDate accepts a leap day", isIsoDate("2028-02-29") === true);
check("isIsoDate rejects a non-leap 29 Feb", isIsoDate("2026-02-29") === false);

// ── party size ─────────────────────────────────────────────────────────────
bad("nobody paying is not a booking", { adults: 0, children: 0 });
bad("under-4s alone cannot book", { adults: 0, children: 0, under4: 2 });
bad("negative counts are refused", { adults: -1 });
bad("absurd counts are refused", { adults: 999 });
bad("fractional counts are refused", { adults: 1.5 });
bad("a non-numeric count is refused", { adults: "dva" });

// ── contact ────────────────────────────────────────────────────────────────
bad("an empty name is refused", { guestName: "  " });
bad("a one-letter name is refused", { guestName: "M" });
bad("an oversized name is refused", { guestName: "M".repeat(200) });
bad("a phone with too few digits is refused", { phone: "123" });
bad("a missing phone is refused", { phone: "" });
ok("a phone with spaces and + is accepted", { phone: "+381 60 331 8255" });
bad("a malformed email is refused", { email: "marko@@example" });
bad("an email with spaces is refused", { email: "mar ko@example.com" });
check("isEmail rejects a bare domain", isEmail("example.com") === false);

// ── normalisation ──────────────────────────────────────────────────────────
const v = run({ email: "  MARKO@Example.COM  ", guestName: "  Ana Anić  " }).value;
check("email is trimmed and lowercased", v.email === "marko@example.com", v.email);
check("name is trimmed", v.guestName === "Ana Anić", v.guestName);
check("blank email becomes null, not an empty string", run({ email: "   " }).value.email === null);

// ── enum coercion: unknown values fall back, never crash ───────────────────
check("an unknown ticket type falls back to day", run({ ticket: "vip" }).value.ticket === "day");
check("an unknown arrival falls back to full", run({ arrival: "midnight" }).value.arrival === "full");
check("matine is preserved", run({ ticket: "matine" }).value.ticket === "matine");
check("afternoon is preserved", run({ arrival: "afternoon" }).value.arrival === "afternoon");

// ── the total is NOT taken from input ──────────────────────────────────────
check(
  "a client-supplied total is ignored entirely",
  !("totalRsd" in run({ totalRsd: 1 }).value)
);

// ── errors are reported all at once ────────────────────────────────────────
const many = run({ visitDate: "nope", adults: 0, children: 0, guestName: "", phone: "" });
check("every problem is reported, not just the first", many.errors.length >= 4, `${many.errors.length}`);

console.log("\n=== VALIDATION ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  — " + r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
