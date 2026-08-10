/**
 * Confirms the map on the page actually drops a pin on the venue.
 *
 * The Google embed refuses to render outside an iframe ("The Google Maps Embed
 * API must be used in an iframe"), so it has to be checked in situ. The iframe
 * is also lazy-loaded, so it needs scrolling into view and a real settle.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const route = process.argv[2] ?? "/";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await page.goto(BASE + route, { waitUntil: "networkidle" });

const frame = page.locator("iframe").first();
await frame.scrollIntoViewIfNeeded();
// Google tiles stream in well after networkidle.
await page.waitForTimeout(6000);

await frame.screenshot({ path: "screenshots/map-direct.png" });
await browser.close();
console.log("screenshots/map-direct.png");
