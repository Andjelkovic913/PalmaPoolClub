/**
 * Exercises the /gallery lightbox from the keyboard only.
 *
 * Everything asserted here is invisible in a screenshot: focus movement, the
 * trap, Esc, arrow stepping, wrap-around, and focus restoration to the exact
 * thumbnail that opened the viewer.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + "/gallery", { waitUntil: "networkidle" });

const results = [];
const check = (name, pass, detail = "") =>
  results.push({ name, pass, detail });

const dialog = page.locator('[role="dialog"]');
const label = () => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName);

// --- open from a thumbnail -------------------------------------------------
const thumbs = page.locator("main button[aria-label^='Otvori fotografiju']");
const N = await thumbs.count();
// Derived, not hardcoded: the gallery's size is a content decision that has
// already changed twice. The assertions below are about behaviour, not count.
check("thumbnails are buttons", N >= 3, `${N} found`);

const third = thumbs.nth(2);
const thirdLabel = await third.getAttribute("aria-label");
await third.click();
await dialog.waitFor({ state: "visible" });
check("dialog opens", true);

check("aria-modal set", (await dialog.getAttribute("aria-modal")) === "true");

// --- focus moved in --------------------------------------------------------
check("focus moved to close button", (await label()) === "Zatvori pregled", await label());

// --- counter reflects the clicked thumbnail --------------------------------
const counter = () =>
  page.locator('[role="dialog"] p').first().textContent().then((t) => t?.trim());
check("counter starts at the clicked image", (await counter()) === `3 / ${N}`, await counter());

// --- arrow keys step -------------------------------------------------------
await page.keyboard.press("ArrowRight");
check("ArrowRight advances", (await counter()) === `4 / ${N}`, await counter());
await page.keyboard.press("ArrowLeft");
await page.keyboard.press("ArrowLeft");
check("ArrowLeft steps back", (await counter()) === `2 / ${N}`, await counter());

// --- wrap-around at the start ----------------------------------------------
await page.keyboard.press("ArrowLeft");
await page.keyboard.press("ArrowLeft");
check("wraps past the first image", (await counter()) === `${N} / ${N}`, await counter());

// --- focus trap: Tab must never leave the dialog ----------------------------
let escaped = false;
for (let i = 0; i < 8; i++) {
  await page.keyboard.press("Tab");
  const inside = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return !!d && d.contains(document.activeElement);
  });
  if (!inside) escaped = true;
}
check("Tab is trapped (8 presses)", !escaped);

let escapedBack = false;
for (let i = 0; i < 8; i++) {
  await page.keyboard.press("Shift+Tab");
  const inside = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return !!d && d.contains(document.activeElement);
  });
  if (!inside) escapedBack = true;
}
check("Shift+Tab is trapped (8 presses)", !escapedBack);

// --- background scroll locked ----------------------------------------------
check(
  "body scroll locked while open",
  (await page.evaluate(() => document.body.style.overflow)) === "hidden"
);

// --- Esc closes, focus follows the image being viewed -----------------------
// Contract (see the comment on `close` in GalleryGrid.tsx): focus returns to
// the thumbnail of the image ON SCREEN, which is the invoking one only when
// the arrow keys were never used. Both directions are asserted.
const viewedLabel = await page.evaluate(() => {
  const fig = document.querySelector('[role="dialog"] figure img');
  return fig?.getAttribute("alt") ?? null;
});
await page.keyboard.press("Escape");
await dialog.waitFor({ state: "detached" });
check("Esc closes", true);
check(
  "after arrowing, focus follows the viewed image",
  (await label()) === `Otvori fotografiju: ${viewedLabel}`,
  `got: ${await label()}`
);
check(
  "body scroll released",
  (await page.evaluate(() => document.body.style.overflow)) !== "hidden"
);

// --- open and close WITHOUT navigating: classic invoking-element restore ----
await third.click();
await dialog.waitFor({ state: "visible" });
await page.keyboard.press("Escape");
await dialog.waitFor({ state: "detached" });
check(
  "without arrowing, focus returns to the invoking thumbnail",
  (await label()) === thirdLabel,
  `got: ${await label()}`
);

// --- empty slots are not openable ------------------------------------------
const slotButtons = await page.evaluate(() =>
  [...document.querySelectorAll(".image-slot")].filter((el) => el.closest("button")).length
);
check("empty slots are not buttons", slotButtons === 0, `${slotButtons} wrapped in a button`);

// --- and leave a picture of it, at both ends of the range -------------------
await mkdir("screenshots", { recursive: true });
for (const width of [375, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/gallery", { waitUntil: "networkidle" });
  await p.locator("main button[aria-label^='Otvori fotografiju']").nth(2).click();
  await p.locator('[role="dialog"]').waitFor({ state: "visible" });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `screenshots/lightbox-${width}.png` });
  await ctx.close();
}

await browser.close();

console.log("\n=== LIGHTBOX ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  — " + r.detail : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
