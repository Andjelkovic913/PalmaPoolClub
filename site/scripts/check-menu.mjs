/**
 * Guards the two things the /menu tabs could quietly break.
 *
 * 1. BOTH cards must stay in the server-rendered HTML.
 *    `PRD.md` problem #3 is that this venue's menu and prices exist only as
 *    JPEGs, and this site is the fix. The food/drinks switch hides the
 *    inactive panel with the `hidden` attribute — it must never start
 *    conditionally rendering, which would strip the drinks card out of the
 *    source and out of the index. This checks the RAW response, before any
 *    JavaScript runs, so a regression cannot hide behind hydration.
 *
 * 2. The tabs must work from the keyboard.
 *    Full ARIA tab pattern: roving tabindex, arrows move and follow focus,
 *    Home/End jump, aria-selected tracks, and the inactive panel is really
 *    hidden from the accessibility tree.
 *
 * Usage: node scripts/check-menu.mjs      (needs the dev server)
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

// ── 1. raw HTML, no JS ──────────────────────────────────────────────────────
const res = await fetch(BASE + "/menu");
const html = await res.text();

// Sampled from both cards. Prices render through toLocaleString("sr-RS"),
// which groups thousands with a dot.
const mustAppear = [
  ["food item", "Palma Signature Burger"],
  ["food price", "1.420"],
  ["food item", "Cezar salata"],
  ["drink item", "Espreso"],
  ["drink price", "230"],
  ["drink item", "Koka Kola"],
  ["drinks legend", "cocktail"],
  ["drinks closing line", "Hidracija je ključ"],
];

for (const [what, needle] of mustAppear) {
  check(`raw HTML contains ${what}: "${needle}"`, html.includes(needle));
}

// The drinks panel must be PRESENT but HIDDEN in the server response.
check(
  'drinks panel is server-rendered with `hidden`',
  /id="panel-pice"[^>]*\shidden/.test(html) || /hidden[^>]*id="panel-pice"/.test(html),
  "panel-pice should carry the hidden attribute in SSR output"
);
check(
  "food panel is server-rendered visible",
  /id="panel-hrana"(?![^>]*\shidden)/.test(html)
);
check("noscript fallback is present", html.includes("data-menu-panel"));

// ── 2. keyboard ─────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + "/menu", { waitUntil: "networkidle" });

const tabs = page.locator('[role="tab"]');
check("two tabs", (await tabs.count()) === 2, `${await tabs.count()} found`);

const foodTab = page.locator("#tab-hrana");
const drinkTab = page.locator("#tab-pice");
const drinkPanel = page.locator("#panel-pice");
const foodPanel = page.locator("#panel-hrana");

check("food tab selected by default", (await foodTab.getAttribute("aria-selected")) === "true");
check("drinks panel hidden by default", await drinkPanel.isHidden());
check(
  "roving tabindex: only the selected tab is reachable",
  (await foodTab.getAttribute("tabindex")) === "0" &&
    (await drinkTab.getAttribute("tabindex")) === "-1"
);

// Arrow right moves selection AND focus.
await foodTab.focus();
await page.keyboard.press("ArrowRight");
check("ArrowRight selects drinks", (await drinkTab.getAttribute("aria-selected")) === "true");
check(
  "ArrowRight moves focus with the selection",
  (await page.evaluate(() => document.activeElement?.id)) === "tab-pice"
);
check("drinks panel now visible", await drinkPanel.isVisible());
check("food panel now hidden", await foodPanel.isHidden());

// Wrap-around and Home/End.
await page.keyboard.press("ArrowRight");
check("ArrowRight wraps to food", (await foodTab.getAttribute("aria-selected")) === "true");
await page.keyboard.press("End");
check("End jumps to the last tab", (await drinkTab.getAttribute("aria-selected")) === "true");
await page.keyboard.press("Home");
check("Home jumps to the first tab", (await foodTab.getAttribute("aria-selected")) === "true");

// A hidden panel must be gone from the a11y tree, not just visually gone.
await drinkTab.click();
check(
  "hidden panel is out of the accessibility tree",
  (await page.evaluate(() => {
    const p = document.getElementById("panel-hrana");
    return p ? getComputedStyle(p).display === "none" && p.hasAttribute("hidden") : false;
  }))
);

// ...but its text is still in the DOM, which is the whole point.
check(
  "hidden panel keeps its prices in the DOM",
  await page.evaluate(() =>
    (document.getElementById("panel-hrana")?.textContent ?? "").includes("1.420")
  )
);

await page.screenshot({ path: "screenshots/menu-tab-pice.png", fullPage: true });
await browser.close();

console.log("\n=== MENU ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  — " + r.detail : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
