import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Database client.
 *
 * `DATABASE_URL` is Supabase's **session pooler** connection string (port 5432
 * / the "Session" tab, not the transaction pooler on 6543). The booking path
 * uses `SELECT … FOR UPDATE` inside a transaction, and the transaction pooler
 * does not hold a session across statements — the lock would be released mid-
 * transaction and two guests could take the same last sunbed.
 *
 * Lazily created so that importing anything from `src/db` does not throw at
 * build time. `next build` prerenders pages that touch these modules, and the
 * build machine has no credentials.
 */

let client: ReturnType<typeof postgres> | null = null;
let instance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** True when the app is configured to talk to a database at all. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL nije podešen. Vidi site/SETUP.md — bez baze /book ne može da primi rezervaciju."
    );
  }
  if (!instance) {
    client = postgres(process.env.DATABASE_URL, {
      // Supabase terminates idle connections; keep the pool small on serverless.
      max: 4,
      idle_timeout: 20,
      prepare: false,
    });
    instance = drizzle(client, { schema });
  }
  return instance;
}

export { schema };
