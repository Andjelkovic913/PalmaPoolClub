/**
 * Shoots each <section> of a page separately.
 *
 * A full-page capture of a long page is thousands of pixels tall and becomes
 * illegible once scaled down for review. Per-section shots stay readable.
 *
 * Usage: node scripts/shoot-sections.mjs /styleguide [width]
 */
import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const route = process.argv[2] ?? "/";
const width = Number(process.argv[3] ?? 1440);
const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
const OUT = `screenshots/sections-${slug}-${width}`;

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(BASE + route, { waitUntil: "networkidle" });

// Fire every scroll reveal before capturing.
await page.evaluate(async () => {
  await new Promise((r) => {
    let y = 0;
    const step = () => {
      y += window.innerHeight;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(step, 60);
      else {
        window.scrollTo(0, 0);
        setTimeout(r, 300);
      }
    };
    step();
  });
});

// The sticky header paints over whatever element Playwright scrolls to the top
// of the viewport, so every section shot loses its eyebrow and heading behind
// the nav. Hide it — the nav is reviewed in the full-page captures instead.
await page.addStyleTag({ content: "header{display:none !important}" });

const sections = page.locator("main > section");
const n = await sections.count();

for (let i = 0; i < n; i++) {
  const s = sections.nth(i);
  const heading =
    (await s.locator("h1, h2").first().textContent().catch(() => null)) ?? `sec${i}`;
  const name = `${String(i).padStart(2, "0")}-${heading
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 30)
    .replace(/^-|-$/g, "")}`;
  await s.screenshot({ path: `${OUT}/${name}.png` });
  const box = await s.boundingBox();
  console.log(`${name.padEnd(36)} ${Math.round(box.width)}x${Math.round(box.height)}`);
}

await browser.close();
console.log(`\n${n} sections -> ${OUT}/`);
