import { readFileSync } from "node:fs";
import type { Config } from "drizzle-kit";

/**
 * Drizzle Kit config.
 *
 * `generate` writes SQL from the schema and needs no database — that is why
 * the migration in `drizzle/` is committed and reviewable. `migrate`/`push`
 * need `DATABASE_URL`; see SETUP.md.
 *
 * drizzle-kit is its own CLI, not Next.js, so it does NOT read `.env.local`.
 * Without this loader `npx drizzle-kit migrate` fails with an empty connection
 * string even though the app itself is configured correctly — a confusing five
 * minutes for anyone following SETUP.md.
 */
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(new URL(file, import.meta.url), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* Not present — fall back to the ambient environment. */
  }
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
