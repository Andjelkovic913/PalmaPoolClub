/**
 * Test data for the booking flow.
 *
 * Creates a deliberately awkward week so every branch can be exercised by hand
 * against a real database:
 *
 *   +2 days   FULL           40/40 — any request is refused outright
 *   +3 days   NEARLY FULL    38/40 — a party of 2 fits, a party of 3 does not
 *   +4 days   CLOSED         capacity 0 — refused whatever the load
 *   +5 days   HALF           20/40
 *   +6 days   EMPTY          no rows at all — the default 40 applies
 *
 * Booking a party of 3 on the "+3 days" date is the interesting case: it is
 * refused, and the alternative offered should skip the closed day and land on
 * "+5 days".
 *
 * Usage:
 *   node scripts/seed-bookings.mjs          insert the fixtures
 *   node scripts/seed-bookings.mjs --reset  delete ALL seeded rows first
 *
 * Needs DATABASE_URL. Seeded rows are marked with a phone of 000000000 so
 * --reset can remove them without touching a real booking.
 */
import { randomBytes } from "node:crypto";
import postgres from "postgres";
import { readFile } from "node:fs/promises";

const SEED_PHONE = "000000000";

// .env.local is not loaded automatically in a plain Node script.
try {
  const env = await readFile(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  /* No .env.local — fall back to the ambient environment. */
}

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL nije podešen.\nVidi site/SETUP.md — bez baze nema šta da se puni."
  );
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 2, prepare: false });

const iso = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

if (process.argv.includes("--reset")) {
  const gone = await sql`DELETE FROM bookings WHERE phone = ${SEED_PHONE} RETURNING id`;
  console.log(`Obrisano testnih rezervacija: ${gone.length}`);
}

/** [offset, capacity, sunbeds already taken, label] */
const days = [
  [2, 40, 40, "POPUNJEN"],
  [3, 40, 38, "SKORO POPUNJEN"],
  [4, 0, 0, "ZATVOREN"],
  [5, 40, 20, "POLA"],
];

for (const [offset, capacity, taken, label] of days) {
  const day = iso(offset);

  await sql`
    INSERT INTO day_capacity (day, capacity, note)
    VALUES (${day}, ${capacity}, ${`seed: ${label}`})
    ON CONFLICT (day) DO UPDATE SET capacity = ${capacity}, note = ${`seed: ${label}`}
  `;

  // One booking per day carrying the whole load, so the numbers are obvious
  // in the Supabase table editor.
  if (taken > 0) {
    await sql`
      INSERT INTO bookings (
        visit_date, ticket, arrival, adults, children, under4,
        sunbeds, total_rsd, guest_name, phone, email, status, decision_token
      ) VALUES (
        ${day}, 'day', 'full', ${taken}, 0, 0,
        ${taken}, ${taken * 2500}, ${`TEST — ${label}`}, ${SEED_PHONE},
        null, 'confirmed', ${randomBytes(24).toString("base64url")}
      )
    `;
  }

  console.log(`${day}  ${String(label).padEnd(16)} kapacitet ${capacity}, zauzeto ${taken}`);
}

console.log(`${iso(6)}  PRAZAN            nema reda — važi podrazumevanih 40`);

const [{ count }] = await sql`SELECT count(*)::int AS count FROM bookings`;
console.log(`\nUkupno rezervacija u bazi: ${count}`);
console.log(
  `\nProbaj na /book:\n  ${iso(3)} sa 3 gosta  → odbijeno, nudi ${iso(5)}\n  ${iso(3)} sa 2 gosta  → prihvaćeno\n  ${iso(4)} bilo koliko  → odbijeno (zatvoreno)`
);

await sql.end();
