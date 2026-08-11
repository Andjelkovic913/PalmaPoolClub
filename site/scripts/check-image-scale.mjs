/**
 * Catches photographs rendered wider than their source can carry.
 *
 * Four images in the manifest are ~511px video frame grabs with a
 * `maxRenderWidth` of 511. CLAUDE.md warns about them explicitly, and one still
 * reached production: `/pricing` rendered `pool-panorama-loungers` at `100vw`,
 * so on a 375px phone at 2× DPR it was upscaled to roughly 750px of device
 * pixels from a 511px source. It looked exactly as bad as that sounds, and it
 * was invisible in code review because the CSS said "100vw", not "2× upscale".
 *
 * This measures what the browser actually laid out and compares it against the
 * manifest, at the narrow widths where `100vw` bites hardest.
 *
 * Usage: node scripts/check-image-scale.mjs      (needs the dev server)
 */
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const ROUTES = ["/", "/pricing", "/menu", "/events", "/gallery", "/location", "/book"];
const WIDTHS = [375, 768, 1440];

/* Parse the manifest for `src` → `maxRenderWidth`, so this needs no build. */
const manifest = await readFile(
  new URL("../src/content/images.ts", import.meta.url),
  "utf8"
);
const limits = new Map();
for (const m of manifest.matchAll(
  /"([a-z0-9-]+)":\s*\{[\s\S]*?src:\s*"([^"]+)"[\s\S]*?maxRenderWidth:\s*(null|\d+)/g
)) {
  limits.set(m[2], { id: m[1], max: m[3] === "null" ? null : Number(m[3]) });
}
if (limits.size === 0) {
  console.error("FAIL  parsed 0 entries — has images.ts changed shape?");
  process.exit(1);
}

const browser = await chromium.launch();
const problems = [];
let measured = 0;

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    // Phones are the worst case: CSS pixels are multiplied by the DPR.
    deviceScaleFactor: width === 375 ? 2 : 1,
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    // Walk the page so lazy images below the fold actually lay out.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);

    const shots = await page.evaluate(() =>
      [...document.querySelectorAll("img")].map((img) => ({
        src: img.currentSrc || img.src,
        css: Math.round(img.getBoundingClientRect().width),
      }))
    );

    for (const shot of shots) {
      if (shot.css === 0) continue;
      // next/image rewrites the URL; the original path survives in `url=`.
      const raw = decodeURIComponent(shot.src);
      const entry = [...limits.entries()].find(([path]) => raw.includes(path));
      if (!entry) continue;

      const [, { id, max }] = entry;
      measured++;
      if (max === null) continue;

      const dpr = width === 375 ? 2 : 1;
      const devicePx = shot.css * dpr;
      if (devicePx > max + 1) {
        problems.push(
          `${route} @${width}  ${id}  laid out ${shot.css}css × ${dpr}dpr = ${devicePx}px from a ${max}px source`
        );
      }
    }
  }
  await ctx.close();
}

await browser.close();

console.log("\n=== IMAGE SCALE ===");
console.log(`${measured} image placements measured across ${ROUTES.length} routes\n`);

if (problems.length === 0) {
  console.log("PASS  no photograph is rendered beyond its maxRenderWidth.");
  process.exit(0);
}

for (const p of problems) console.log(`FAIL  ${p}`);
console.log(
  `\n${problems.length} upscaled placement(s). Either pick a higher-resolution slot from the manifest, or narrow the cell / the \`sizes\` attribute.`
);
process.exit(1);
