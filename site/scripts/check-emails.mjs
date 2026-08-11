/**
 * Static guards on the email layer. No network, no credentials, nothing sent.
 *
 * Two things must stay true about `src/lib/email.ts` and
 * `src/content/emails.ts`, and both are the kind of thing a well-meaning edit
 * quietly breaks:
 *
 * 1. IT IS NOT AN OPEN RELAY. The booking endpoint is public. Every recipient
 *    must be either the address submitted with the booking or the venue's own
 *    `OWNER_EMAIL` — never a value assembled from anything else, and never a
 *    cc/bcc. Guest-supplied text must be escaped before it reaches HTML.
 *
 * 2. NO EMAIL STATES A COMMERCIAL TERM. Same rule as the drafted FAQ answers,
 *    and it matters more here: the guest keeps the email. There is still no
 *    cancellation policy (OPEN_QUESTIONS.md #3), so no message may promise a
 *    refund, a deadline or a guarantee.
 *
 * Usage: node scripts/check-emails.mjs
 */
import { readFile } from "node:fs/promises";

const emailLib = await readFile(new URL("../src/lib/email.ts", import.meta.url), "utf8");
const copy = await readFile(new URL("../src/content/emails.ts", import.meta.url), "utf8");

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

// ── 1. recipients ──────────────────────────────────────────────────────────
const recipients = [...emailLib.matchAll(/\bsend\(\s*([A-Za-z0-9_.]+)\s*,/g)].map((m) => m[1]);
check("every send() call has a recipient", recipients.length > 0, `${recipients.length} found`);
check(
  "recipients are only the guest's address or OWNER_EMAIL",
  recipients.every((r) => r === "b.email" || r === "to"),
  recipients.join(", ")
);
check(
  "the owner address comes from the environment, not from input",
  /const to = process\.env\.OWNER_EMAIL/.test(emailLib)
);
check("no cc", !/\bcc\s*:/.test(emailLib));
check("no bcc", !/\bbcc\s*:/.test(emailLib));
check(
  "reply-to is never taken from the form",
  !/reply_?[Tt]o\s*:\s*(b\.|input|form)/.test(emailLib)
);
check(
  "guest mail is skipped when no address was given",
  (emailLib.match(/if \(!b\.email\) return;/g) ?? []).length >= 3,
  "each guest-facing send must guard on b.email"
);

// ── escaping ───────────────────────────────────────────────────────────────
check("an escaping helper exists", /function esc\(/.test(emailLib));
check("it escapes angle brackets", /replaceAll\("<", "&lt;"\)/.test(emailLib));
check("it escapes quotes", /replaceAll\('"', "&quot;"\)/.test(emailLib));

// Every interpolation inside an HTML template literal must be esc(...) — or a
// nested template that has already been escaped.
const htmlChunks = emailLib.match(/`<[\s\S]*?`/g) ?? [];
const unescaped = [];
for (const chunk of htmlChunks) {
  for (const m of chunk.matchAll(/\$\{([^}]+)\}/g)) {
    const expr = m[1].trim();
    const safe =
      expr.startsWith("esc(") ||
      expr === "table" ||
      expr === "extra ?? ''" ||
      expr.startsWith("rows") ||
      expr.startsWith("paragraphs") ||
      expr.startsWith("closing ?") ||
      expr.startsWith("extra ?");
    if (!safe) unescaped.push(expr);
  }
}
check(
  "no unescaped interpolation in an HTML template",
  unescaped.length === 0,
  unescaped.join(" | ")
);

// ── 2. no commercial terms ─────────────────────────────────────────────────
const forbidden = [
  [/\bbesplatn\w*\s+otkaziv/i, "free cancellation"],
  [/\botkaziv\w*[^.]{0,40}\b\d+\s*(h|sat|sati|časa|dana)\b/i, "a cancellation deadline"],
  [/\b(povraćaj|refundac)\w*/i, "a refund"],
  [/\bvra[cć]amo\s+novac\b/i, "money back"],
  [/\bgarantujemo\b/i, "a guarantee"],
  [/\bnadoknad\w*/i, "compensation"],
];
for (const [re, label] of forbidden) {
  check(`email copy never promises ${label}`, !re.test(copy), String(re));
}

// The pending message must not read as a confirmation.
// Scoped to the guestPending block itself — an unbounded search would run on
// into guestConfirmed, which is *supposed* to say "potvrđena".
const pendingBlock =
  copy.match(/export const guestPending = \{[\s\S]*?\n\};/)?.[0] ?? "";
check("the guestPending block was found", pendingBlock.length > 0);
check(
  "the 'request received' email does not claim the booking is confirmed",
  pendingBlock.length > 0 && !/potvr[đd]ena|potvr[đd]eno/i.test(pendingBlock),
  pendingBlock.split("\n").find((l) => /potvr/i.test(l)) ?? ""
);

console.log("\n=== EMAIL ===");
let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : "  — " + r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
