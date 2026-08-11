/**
 * Checks the booking setup and says, in plain terms, what is missing.
 *
 * Exists because the raw failures are unhelpful: an unfilled `.env.local`
 * surfaces as `ENOTFOUND aws-0-REGION.pooler.supabase.com`, and drizzle-kit
 * against a bad URL prints nothing at all and exits cleanly, which reads as
 * success. This turns both into a sentence.
 *
 * Run it BEFORE `drizzle-kit migrate` and before the seed.
 *
 * Usage: node scripts/check-db.mjs
 */
import { readFile } from "node:fs/promises";

const envPath = new URL("../.env.local", import.meta.url);
const problems = [];
const notes = [];

let raw = "";
try {
  raw = await readFile(envPath, "utf8");
} catch {
  console.log("\n=== PODEŠAVANJE ===\n");
  console.log("FAIL  site/.env.local ne postoji.");
  console.log("      cp .env.example .env.local   — pa popuni vrednosti.");
  process.exit(1);
}

/* Parse every assignment, keeping duplicates: the loaders take the FIRST value
   for a key, so a leftover placeholder above a real line wins silently. */
const seen = new Map();
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (!m) continue;
  const [, key, value] = m;
  if (!seen.has(key)) seen.set(key, []);
  seen.get(key).push(value.replace(/^["']|["']$/g, ""));
}

for (const [key, values] of seen) {
  if (values.length > 1) {
    problems.push(
      `${key} je naveden ${values.length}× — koristi se PRVI. Obriši viškove.`
    );
  }
}

const get = (k) => seen.get(k)?.[0] ?? "";

// ── DATABASE_URL ───────────────────────────────────────────────────────────
const url = get("DATABASE_URL");
const placeholders = ["PROJECT", "REGION", "PASSWORD", "YOUR-PASSWORD", "xxxx"];

if (!url) {
  problems.push("DATABASE_URL nije podešen.");
} else if (placeholders.some((p) => url.includes(p))) {
  problems.push(
    "DATABASE_URL je i dalje šablon iz .env.example — zameni ga pravim stringom\n" +
      "      iz Supabase → Connect → Direct → Session pooler (port 5432)."
  );
} else {
  try {
    const u = new URL(url);
    if (u.port === "6543") {
      problems.push(
        "DATABASE_URL koristi TRANSACTION pooler (port 6543).\n" +
          "      Mora SESSION pooler (5432) — inače zaključavanje dana pada usred\n" +
          "      transakcije i dvoje gostiju može uzeti istu poslednju ležaljku."
      );
    } else if (u.port !== "5432") {
      notes.push(`Neuobičajen port ${u.port}; očekivan je 5432.`);
    }
    if (!u.hostname.includes("pooler.supabase.com")) {
      notes.push(
        `Host je ${u.hostname} — direktna veza radi lokalno, ali pooler je\n      ono što preživi serverless na Vercelu.`
      );
    }
    if (/[^%](%[^0-9A-Fa-f]|%$)/.test(u.password ?? "")) {
      notes.push("Lozinka sadrži '%' koji ne izgleda kao URL-enkodovanje.");
    }
  } catch {
    problems.push("DATABASE_URL nije ispravan URL — proveri da nisi izgubio deo stringa.");
  }
}

// ── e-mail (optional) ──────────────────────────────────────────────────────
const key = get("RESEND_API_KEY");
const owner = get("OWNER_EMAIL");
const emailReady =
  key && !key.includes("xxx") && owner && !owner.includes("example.com");

// ── report ─────────────────────────────────────────────────────────────────
console.log("\n=== PODEŠAVANJE ===\n");

if (problems.length) {
  for (const p of problems) console.log(`FAIL  ${p}`);
  console.log("\nBaza nije spremna. Popravi gore navedeno, pa pokreni ponovo.");
  process.exit(1);
}
for (const n of notes) console.log(`UPOZ  ${n}`);
console.log("PASS  DATABASE_URL izgleda ispravno.");

// ── live connection ────────────────────────────────────────────────────────
const { default: postgres } = await import("postgres");
const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 15 });

try {
  const [{ now }] = await sql`SELECT now()`;
  console.log(`PASS  veza sa bazom radi (server kaže: ${now.toISOString()}).`);

  const tables = await sql`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename IN ('bookings', 'day_capacity')
  `;
  const names = tables.map((t) => t.tablename);

  if (names.length === 2) {
    const [{ count: b }] = await sql`SELECT count(*)::int AS count FROM bookings`;
    const [{ count: d }] = await sql`SELECT count(*)::int AS count FROM day_capacity`;
    console.log(`PASS  tabele postoje — ${b} rezervacija, ${d} dana sa kapacitetom.`);

    const rls = await sql`
      SELECT relname, relrowsecurity FROM pg_class
      WHERE relname IN ('bookings', 'day_capacity')
    `;
    const open = rls.filter((r) => !r.relrowsecurity).map((r) => r.relname);
    if (open.length) {
      console.log(
        `UPOZ  RLS NIJE uključen na: ${open.join(", ")}.\n` +
          "      Supabase izlaže public tabele preko anon ključa — pokreni migraciju."
      );
    } else {
      console.log("PASS  RLS je uključen — anon ključ ne vidi podatke gostiju.");
    }

    console.log(
      b === 0
        ? "\nSledeće: node scripts/seed-bookings.mjs"
        : "\nSve je spremno. Testiraj na /book."
    );
  } else {
    console.log(
      `UPOZ  tabele još ne postoje (nađeno: ${names.join(", ") || "nijedna"}).\n` +
        "\nSledeće: npx drizzle-kit migrate"
    );
  }
} catch (err) {
  console.log(`FAIL  veza sa bazom ne radi: ${err.message}`);
  if (String(err.message).includes("password authentication")) {
    console.log("      Lozinka je pogrešna, ili sadrži znak koji treba URL-enkodovati.");
    console.log("      Najlakše: Supabase → Settings → Database → Reset database password.");
  }
  if (String(err.code) === "ENOTFOUND") {
    console.log("      Host ne postoji — proveri da si kopirao ceo string iz Supabase.");
  }
  await sql.end({ timeout: 1 });
  process.exit(1);
}

console.log(
  emailReady
    ? "PASS  e-mail je podešen (RESEND_API_KEY + OWNER_EMAIL)."
    : "UPOZ  e-mail nije podešen — rezervacije rade i upisuju se, poruke ne odlaze."
);

await sql.end({ timeout: 1 });
