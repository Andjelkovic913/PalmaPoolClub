/**
 * Static guards on the owner console.
 *
 * `/admin` shows every guest's name, phone and email, and can create and
 * cancel bookings. The failure that matters is not a broken layout — it is a
 * server action that forgot to check who is calling it. A server action is a
 * public HTTP endpoint: rendering its button behind a login screen protects
 * nothing at all.
 *
 * Usage: node scripts/check-admin.mjs      (no server, no credentials)
 */
import { readFile } from "node:fs/promises";

const actions = await readFile(
  new URL("../src/app/admin/actions.ts", import.meta.url),
  "utf8"
);
const auth = await readFile(
  new URL("../src/lib/admin-auth.ts", import.meta.url),
  "utf8"
);
const page = await readFile(
  new URL("../src/app/admin/page.tsx", import.meta.url),
  "utf8"
);

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

// ── every mutating action must gate on requireAdmin() ──────────────────────
const bodies = [
  ...actions.matchAll(
    /export async function (\w+)\([\s\S]*?\n\}\n/g
  ),
].map((m) => ({ name: m[1], body: m[0] }));

check("actions were parsed", bodies.length >= 4, `${bodies.length} found`);

/* `login` is the way IN, so it cannot require being in already; `logout` only
   clears a cookie. Everything else mutates venue data. */
const exempt = new Set(["login", "logout"]);
for (const { name, body } of bodies) {
  if (exempt.has(name)) continue;
  check(
    `${name}() calls requireAdmin() before doing anything`,
    /await requireAdmin\(\);/.test(body) &&
      body.indexOf("requireAdmin") < body.indexOf("formData.get"),
    "requireAdmin must come first"
  );
}

// ── the page itself must gate ──────────────────────────────────────────────
check("the page checks isAdmin()", /await isAdmin\(\)/.test(page));
check(
  "an unconfigured password locks everyone OUT, not in",
  /if \(!isAdminConfigured\(\)\)/.test(page) &&
    /if \(!secret \|\| !expected\) return false;/.test(auth)
);
check("the page is noindex", /robots:\s*\{\s*index:\s*false/.test(page));

// ── the cookie ─────────────────────────────────────────────────────────────
check("session cookie is httpOnly", /httpOnly:\s*true/.test(auth));
check("session cookie is sameSite", /sameSite:\s*"lax"/.test(auth));
check(
  "session cookie is secure in production",
  /secure:\s*process\.env\.NODE_ENV === "production"/.test(auth)
);
check(
  "the cookie carries a signature, never the password",
  /createHmac\("sha256", secret\)/.test(auth) &&
    !/cookies\(\)\)\.set\([^)]*secret/.test(auth)
);
check(
  "comparisons are timing-safe",
  /timingSafeEqual/.test(auth) && !/password === secret/.test(auth)
);
check(
  "a wrong password reveals nothing about configuration",
  /Pogrešna lozinka\./.test(actions) &&
    !/nije podešen/i.test(actions.match(/export async function login[\s\S]*?\n\}/)?.[0] ?? "")
);

// ── prices are never taken from the form ───────────────────────────────────
check(
  "phone bookings are priced by priceFor(), not by the operator",
  /priceFor\(\{/.test(actions) && !/formData\.get\("(cena|total|iznos)"\)/.test(actions)
);

console.log("\n=== ADMIN ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  — " + r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
