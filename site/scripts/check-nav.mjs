/**
 * Proves the mobile drawer actually shows its links.
 *
 * It once did not, and the failure was invisible in code review: the header
 * carries `backdrop-blur-sm`, and `backdrop-filter` makes an element a
 * containing block for `position: fixed` DESCENDANTS. A drawer nested inside
 * the header was therefore positioned against the 61px header instead of the
 * viewport, so `top-[61px] bottom-0` resolved to zero height. The markup was
 * correct, the classes were correct, and the menu opened to nothing.
 *
 * So this does not check classes. It opens the drawer in a real phone-sized
 * browser and, for every link, asks the browser **what element is actually at
 * that point** — `elementFromPoint`. A link that is present, sized and on
 * screen but painted over by the page fails here, which is exactly what
 * happened before.
 *
 * Usage: node scripts/check-nav.mjs      (needs the dev server)
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SIZES = [
  [360, 640, "mali Android"],
  [375, 667, "iPhone SE"],
  [390, 844, "iPhone 14"],
  [430, 932, "iPhone Pro Max"],
];

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

const browser = await chromium.launch();

for (const [w, h, label] of SIZES) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const opener = page.locator('button[aria-label="Otvori meni"]');
  check(`${label} — burger je vidljiv`, await opener.isVisible());

  await opener.click();
  await page.waitForTimeout(400);

  const m = await page.evaluate(() => {
    const d = document.getElementById("mobile-drawer");
    if (!d) return null;
    const box = d.getBoundingClientRect();
    const links = [...d.querySelectorAll("a")];

    /* A link counts as reachable if a finger can get to it — which includes
       scrolling the panel, since the panel is legitimately scrollable. What
       must NOT happen is a link that is on screen but painted over, which is
       the bug this script exists for. So each link is scrolled into view
       first, then asked whether it is the element at its own centre. */
    const reachable = links.filter((a) => {
      a.scrollIntoView({ block: "center", behavior: "instant" });
      const r = a.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      if (r.bottom < 0 || r.top > window.innerHeight) return false;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(hit && hit.closest("#mobile-drawer"));
    });

    const withoutScrolling = links.filter((a) => {
      const r = a.getBoundingClientRect();
      return r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
    }).length;

    return {
      drawerHeight: Math.round(box.height),
      viewportHeight: window.innerHeight,
      total: links.length,
      reachable: reachable.length,
      withoutScrolling,
      // The bug's signature: a drawer far shorter than the screen.
      collapsed: box.height < window.innerHeight * 0.5,
    };
  });

  if (!m) {
    check(`${label} — drawer se otvara`, false, "#mobile-drawer nije u DOM-u");
    await ctx.close();
    continue;
  }

  check(`${label} — drawer se otvara`, true);
  check(
    `${label} — drawer pokriva ekran`,
    !m.collapsed,
    `visina ${m.drawerHeight}px na ekranu od ${m.viewportHeight}px`
  );
  check(
    `${label} — svih ${m.total} linkova je dohvatljivo prstom`,
    m.reachable === m.total,
    `${m.reachable}/${m.total} — ostali su prekriveni ili nemaju veličinu`
  );
  // Not a failure — scrolling is legitimate — but worth seeing at a glance.
  check(
    `${label} — ${m.withoutScrolling}/${m.total} vidljivo bez skrolovanja`,
    true
  );

  // Esc must close it: a drawer with no way out traps a visitor.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check(
    `${label} — Esc zatvara`,
    (await page.locator("#mobile-drawer").count()) === 0
  );

  /* The burger morph must run on EVERY press, not just the first.
     Opening and closing share one set of keyframes with the direction
     flipped, and a browser only restarts an animation when the animation
     NAME changes — flipping `animation-direction` on a finished animation
     does nothing. That shipped: the icon animated once per page load and
     every click after it was dead until a refresh.
     `getAnimations()` is the browser's own account of what is running, so
     this cannot be satisfied by CSS that merely looks correct. */
  /* Not `opener` — its aria-label flips to "Zatvori meni" once open, so a
     locator bound to the label only matches every other press. */
  const toggle = page.locator('button[aria-controls="mobile-drawer"]');
  let everyPressAnimates = true;
  for (let i = 0; i < 4; i++) {
    await toggle.click();
    await page.waitForTimeout(60);
    const running = await page.evaluate(() =>
      [...document.querySelectorAll(".burger span")]
        .flatMap((el) => el.getAnimations())
        .filter((a) => a.playState === "running").length
    );
    if (running < 3) everyPressAnimates = false;
    await page.waitForTimeout(500);
  }
  check(
    `${label} — burger se animira pri SVAKOM pritisku, ne samo prvom`,
    everyPressAnimates,
    "animacija se ne restartuje — proveri `key` na .burger u Nav.tsx"
  );

  await ctx.close();
}

await browser.close();

console.log("\n=== MOBILNA NAVIGACIJA ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  — " + r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
