/**
 * High-DPI crop of a single element, for judging glyph shapes and fine detail.
 * Usage: node scripts/zoom.mjs / "text=Palma Pool Cafe" out.png
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://localhost:3000";
const [route, selector, out = "zoom.png"] = process.argv.slice(2);

await mkdir("screenshots", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 4,
});
await page.goto(BASE + route, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  await new Promise((r) => {
    let y = 0;
    const step = () => {
      y += window.innerHeight;
      window.scrollTo(0, y);
      if (y < document.body.scrollHeight) setTimeout(step, 50);
      else {
        window.scrollTo(0, 0);
        setTimeout(r, 250);
      }
    };
    step();
  });
});

await page.locator(selector).first().screenshot({ path: `screenshots/${out}` });
await browser.close();
console.log(`screenshots/${out}`);
