/**
 * Proves the /book calculator charges the right amount.
 *
 * Driven through the REAL form in a real browser, not against the exported
 * function: this is the only number on the site a guest hands over money
 * against, and a correct `priceFor()` wired to the wrong input would still be
 * wrong. Testing the page tests the wiring too.
 *
 * Every expectation below is derived from the printed price card
 * (menu_pricing.jpg) plus the two rules the owner confirmed — weekend means
 * Saturday and Sunday, and the half-day 50% applies to the child rate as well.
 * See src/lib/price.ts.
 *
 * Usage: node scripts/check-price.mjs      (needs the dev server)
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";

/* Anchored on known weekdays. 1 Aug 2026 is a Saturday — the venue's own
   Matine flyer says so — which fixes the rest of the month. */
const SAT = "2026-08-15";
const SUN = "2026-08-16";
const MON = "2026-08-17";
const FRI = "2026-08-21";

const cases = [
  { name: "weekday, 2 adults", date: MON, adults: 2, kids: 0, tots: 0, half: false, expect: "5.000" },
  { name: "Saturday, 2 adults", date: SAT, adults: 2, kids: 0, tots: 0, half: false, expect: "7.000" },
  { name: "Sunday counts as weekend", date: SUN, adults: 2, kids: 0, tots: 0, half: false, expect: "7.000" },
  { name: "FRIDAY is a weekday (owner-confirmed)", date: FRI, adults: 2, kids: 0, tots: 0, half: false, expect: "5.000" },
  { name: "Saturday, 2 adults + 1 child", date: SAT, adults: 2, kids: 1, tots: 0, half: false, expect: "8.750" },
  { name: "under-4s are free", date: SAT, adults: 2, kids: 1, tots: 2, half: false, expect: "8.750" },
  { name: "half-day halves the adult rate", date: SAT, adults: 2, kids: 0, tots: 0, half: true, expect: "3.500" },
  { name: "half-day halves the CHILD rate too", date: SAT, adults: 0, kids: 2, tots: 0, half: true, expect: "1.750" },
  { name: "weekday half-day, mixed party", date: MON, adults: 2, kids: 2, tots: 1, half: true, expect: "3.750" },
  { name: "children only, weekday", date: MON, adults: 0, kids: 3, tots: 0, half: false, expect: "3.750" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(BASE + "/book", { waitUntil: "networkidle" });

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

const setCounter = async (fieldName, value) => {
  const input = page.locator(`input[name="${fieldName}"]`);
  await input.fill(String(value));
  await input.dispatchEvent("change");
};

const total = () =>
  page.locator("aside .tabular.text-2xl").first().textContent().then((t) => t?.trim());

for (const c of cases) {
  await page.locator('input[name="datum"]').fill(c.date);
  await page.locator(`input[name="dolazak"][value="${c.half ? "afternoon" : "full"}"]`)
    .dispatchEvent("click");
  await setCounter("odrasli", c.adults);
  await setCounter("deca4do12", c.kids);
  await setCounter("decaDo4", c.tots);
  await page.waitForTimeout(60);

  const got = await total();
  check(c.name, got === `${c.expect} din`, `expected ${c.expect} din, got ${got}`);
}

// ── the empty / invalid states ──────────────────────────────────────────────
await setCounter("odrasli", 0);
await setCounter("deca4do12", 0);
await setCounter("decaDo4", 0);
await page.waitForTimeout(60);
check("no paying guests totals 0", (await total()) === "0 din", await total());
check(
  "submit is disabled with no paying guests",
  await page.locator('button[type="submit"]').isDisabled()
);

await page.locator('input[name="datum"]').fill("");
await setCounter("odrasli", 2);
await page.waitForTimeout(60);
check(
  "submit is disabled without a date",
  await page.locator('button[type="submit"]').isDisabled()
);

// ── the promise the page must not make ──────────────────────────────────────
const body = (await page.locator("main").textContent()) ?? "";
for (const forbidden of ["Potvrđeno", "potvrđena", "Rezervacija primljena"]) {
  check(`page never claims a confirmed booking: "${forbidden}"`, !body.includes(forbidden));
}
check(
  "payment-at-venue is stated",
  body.includes("Plaćanje na licu mesta")
);

// ── Matine is not offered when no event is upcoming ─────────────────────────
check(
  "no Matine ticket option while no event is upcoming",
  (await page.locator('input[name="tip"]').count()) === 0
);

// ── keyboard path through the whole form ───────────────────────────────────
// §10's acceptance list asks for a "full keyboard path through … booking form".
await page.locator('input[name="datum"]').fill(SAT);
await setCounter("odrasli", 2);
await setCounter("deca4do12", 1);
await page.locator('input[name="ime"]').fill("Marko Marković");
await page.locator('input[name="telefon"]').fill("060 111 2233");
await page.waitForTimeout(60);

check("submit enables once the form is complete", await page.locator('button[type="submit"]').isEnabled());

const reachable = new Set();
await page.locator('input[name="datum"]').focus();
for (let i = 0; i < 25; i++) {
  const id = await page.evaluate(() => {
    const el = document.activeElement;
    return el?.getAttribute("name") ?? el?.getAttribute("aria-label") ?? el?.textContent?.trim().slice(0, 24) ?? "";
  });
  if (id) reachable.add(id);
  await page.keyboard.press("Tab");
}
for (const want of ["datum", "odrasli", "deca4do12", "decaDo4", "ime", "telefon", "email"]) {
  check(`Tab reaches "${want}"`, reachable.has(want), [...reachable].join(" | "));
}
check(
  "Tab reaches the arrival radio group",
  [...reachable].some((r) => r === "dolazak")
);

// ── the honeypot must not be in anyone's way ───────────────────────────────
check(
  "honeypot exists but is out of the keyboard path",
  await page.evaluate(() => {
    const el = document.querySelector('input[name="website"]');
    return !!el && el.tabIndex === -1 && !!el.closest("[aria-hidden]");
  })
);
check("honeypot was not reachable by Tab", !reachable.has("website"));

// ── degrading without a database ───────────────────────────────────────────
// The dev server here has no DATABASE_URL, which is exactly the state the site
// is in before SETUP.md is followed. Submitting must fail politely and point
// at the phone — never a stack trace, and never a fake confirmation.
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(1200);
const after = (await page.locator("main").textContent()) ?? "";

if (process.env.DATABASE_URL) {
  check("database is configured — submit produced an outcome", /primljen|popunjen/i.test(after), after.slice(0, 120));
} else {
  check(
    "with no database, submit says so instead of crashing",
    after.includes("Rezervacije trenutno nisu dostupne"),
    after.slice(-200)
  );
  check(
    "…and still never claims a confirmed booking",
    !/Potvr[đd]eno|potvr[đd]ena/.test(after)
  );
  check(
    "…and still offers the phone number",
    after.includes("+381 60 3318255")
  );
}

await page.screenshot({ path: "screenshots/book-filled.png", fullPage: true });
await browser.close();

console.log("\n=== PRICE ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  — " + r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
