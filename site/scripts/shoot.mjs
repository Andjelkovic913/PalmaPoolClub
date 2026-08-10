/**
 * Renders pages in a real browser so they can actually be looked at, and runs
 * the checks BUILD_PROMPT.md §10 says must be *verified*, not read:
 *
 *   - full-page screenshots at 375 / 768 / 1024 / 1440
 *   - horizontal-overflow detection (the "no horizontal scroll" criterion)
 *   - prefers-reduced-motion emulated, to prove animation actually stops
 *
 * Usage:  node scripts/shoot.mjs /styleguide /
 *         node scripts/shoot.mjs            (defaults to /)
 *
 * Output: screenshots/<page>-<width>.png
 */
import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "screenshots";
const WIDTHS = [375, 768, 1024, 1440];

const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const route of routes) {
  const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");

  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();

    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("pageerror", (e) => consoleErrors.push(String(e)));

    const resp = await page.goto(BASE + route, { waitUntil: "networkidle" });

    // Let reveals and lazy images settle, then walk the page so anything
    // observer-driven has fired before we shoot.
    await page.evaluate(async () => {
      await new Promise((r) => {
        let y = 0;
        const step = () => {
          y += window.innerHeight;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 60);
          else {
            window.scrollTo(0, 0);
            setTimeout(r, 250);
          }
        };
        step();
      });
    });

    // The "no horizontal scroll" acceptance criterion, measured.
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const scrollW = de.scrollWidth;
      const clientW = de.clientWidth;
      const offenders = [];
      if (scrollW > clientW + 1) {
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.right > clientW + 1 || r.left < -1) {
            offenders.push(
              `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : ""} [${Math.round(r.left)}..${Math.round(r.right)}]`
            );
          }
          if (offenders.length > 8) break;
        }
      }
      return { scrollW, clientW, overflowing: scrollW > clientW + 1, offenders };
    });

    await page.screenshot({
      path: `${OUT}/${slug}-${width}.png`,
      fullPage: true,
    });

    results.push({
      route,
      width,
      status: resp?.status(),
      overflow,
      consoleErrors,
    });

    await ctx.close();
  }

  // Reduced motion: prove the reveals render in their final state and that
  // nothing is left mid-transition.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  const motion = await page.evaluate(() => {
    const els = [...document.querySelectorAll("*")];
    let longTransitions = 0;
    let hidden = 0;
    for (const el of els) {
      const cs = getComputedStyle(el);
      const dur = cs.transitionDuration
        .split(",")
        .map((s) => parseFloat(s) * (s.includes("ms") ? 1 : 1000));
      if (dur.some((d) => d > 1)) longTransitions++;
      // A Reveal that never fired would sit at opacity 0.
      if (parseFloat(cs.opacity) < 0.99 && el.getBoundingClientRect().height > 0)
        hidden++;
    }
    return { longTransitions, hidden };
  });
  await page.screenshot({ path: `${OUT}/${slug}-reducedmotion.png`, fullPage: true });
  results.push({ route, width: "reduced-motion", motion });
  await ctx.close();
}

await browser.close();

console.log("\n=== RESULTS ===");
for (const r of results) {
  if (r.motion) {
    const ok = r.motion.longTransitions === 0;
    console.log(
      `${r.route.padEnd(14)} reduced-motion   transitions>1ms: ${r.motion.longTransitions} ${ok ? "PASS" : "FAIL"}   elements still faded: ${r.motion.hidden}`
    );
    continue;
  }
  const o = r.overflow;
  const flag = o.overflowing ? `OVERFLOW ${o.scrollW}>${o.clientW}` : "ok";
  console.log(
    `${r.route.padEnd(14)} ${String(r.width).padEnd(5)} http ${r.status}  ${flag}${r.consoleErrors.length ? "  console errors: " + r.consoleErrors.length : ""}`
  );
  if (o.overflowing) o.offenders.forEach((x) => console.log(`      -> ${x}`));
  r.consoleErrors.slice(0, 3).forEach((e) => console.log(`      !! ${e.slice(0, 160)}`));
}
console.log(`\nScreenshots in ${OUT}/`);
