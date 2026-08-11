/**
 * Lists every FAQ answer that is DRAFTED rather than sourced.
 *
 * Why this exists: the site's whole discipline is that unverified content is
 * visibly unverified. On `/faq` the owner asked for finished answers instead
 * of `<Todo>` badges, which is their call — but it removes the on-page signal.
 * This script puts the signal back where it cannot be missed by the next
 * session or by whoever does the pre-launch pass.
 *
 * It also enforces the one line the drafts must not cross: a drafted answer
 * may describe, but it may NOT state a commercial term. Anything that reads
 * like a refund, a deadline or a free-cancellation window is flagged as a
 * failure, not a warning — those are the answers a guest quotes back when
 * asking for money.
 *
 * Usage: node scripts/check-faq.mjs        (no dev server needed)
 */
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("../src/content/faq.ts", import.meta.url), "utf8");

/* Parsed from source rather than imported: this file is plain Node with no
   TypeScript loader, and the shape here is simple and stable. */
const entries = [...src.matchAll(/question:\s*"([^"]+)"[\s\S]*?answer:\s*\n?\s*"([^"]+)"[\s\S]*?verified:\s*(true|false)/g)]
  .map((m) => ({ question: m[1], answer: m[2], verified: m[3] === "true" }));

if (entries.length === 0) {
  console.error("FAIL  parsed 0 FAQ entries — has the shape of faq.ts changed?");
  process.exit(1);
}

/* Terms that would commit the business to something it has never agreed to.
   PRD.md §8's "free cancellation up to 24h before" is an EXAMPLE in the brief,
   not a policy — if a phrase like it ever reaches an answer, that is a bug. */
const forbidden = [
  /\bbesplatn\w*\s+otkaziv/i,
  /\botkaziv\w*[^.]{0,40}\b\d+\s*(h|sat|sati|časa|dana)\b/i,
  /\b(povraćaj|refundac)\w*/i,
  /\bvra[cć]amo\s+novac\b/i,
  /\bgarantujemo\b/i,
  /\bnadoknad\w*/i,
];

const drafted = entries.filter((e) => !e.verified);
const violations = [];
for (const e of drafted) {
  for (const re of forbidden) {
    if (re.test(e.answer)) violations.push({ ...e, re: String(re) });
  }
}

console.log("=== FAQ PROVENANCE ===");
console.log(`${entries.length} answers — ${entries.length - drafted.length} sourced, ${drafted.length} drafted\n`);

for (const e of entries) {
  console.log(`${e.verified ? "sourced " : "DRAFTED "} ${e.question}`);
}

if (drafted.length) {
  console.log("\nDrafted answers still awaiting the owner's confirmation");
  console.log("(tracked in OPEN_QUESTIONS.md #2 and #3):");
  for (const e of drafted) console.log(`  · ${e.question}\n      "${e.answer}"`);
}

if (violations.length) {
  console.log("\n=== FAIL ===");
  for (const v of violations) {
    console.log(`A drafted answer states a commercial term: "${v.question}"`);
    console.log(`  matched ${v.re}`);
    console.log(`  "${v.answer}"`);
  }
  console.log("\nDrafted answers must route to the phone, not invent terms.");
  process.exit(1);
}

console.log("\nPASS  no drafted answer states a commercial term.");
