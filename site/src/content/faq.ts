/**
 * FAQ content.
 *
 * The seven questions are from `PRD.md` §8 / `OPEN_QUESTIONS.md` #2.
 *
 * ── PROVENANCE ─────────────────────────────────────────────────────────────
 * `verified: true`  — the answer traces to a real source: the pricing card,
 *                     one of the 31 Instagram captions, or a fact confirmed in
 *                     PRD.md §2 / BUILD_PROMPT.md §8. Same standard as the
 *                     rest of the site.
 * `verified: false` — DRAFTED. The business has never answered this anywhere.
 *                     Written on the owner's explicit instruction to fill the
 *                     page rather than ship visible TODOs.
 *
 * The flag is not decoration. `scripts/check-faq.mjs` lists every unverified
 * answer so this cannot quietly become indistinguishable from sourced copy,
 * and OPEN_QUESTIONS.md #2 tracks them until the owner confirms the wording.
 *
 * ── ONE RULE THE DRAFTS STILL KEEP ────────────────────────────────────────
 * A drafted answer may describe, but it must NEVER invent a commercial term.
 * "Šta ako pada kiša" and "Kako funkcioniše otkazivanje" are the two questions
 * a guest quotes back when asking for money, and `PRD.md` §8's own
 * "e.g. free cancellation up to 24h before" is a placeholder, not a policy.
 * Both are therefore answered by routing to the phone — complete, useful, and
 * committing the business to nothing it has not agreed to. See
 * OPEN_QUESTIONS.md #3.
 */

export type FaqItem = {
  question: string;
  answer: string;
  verified: boolean;
  /** Where the answer comes from, or why it is a draft. */
  note: string;
};

export const faq: FaqItem[] = [
  {
    question: "Da li su ležaljke uključene u cenu?",
    answer: "Jesu. Ležaljke su uključene u cenu ulaznice.",
    verified: true,
    note: "menu_pricing.jpg — 'Ležaljke su uključene u cenu.'",
  },
  {
    question: "Da li mogu da rezervišem telefonom?",
    answer: "Možete. Pozovite +381 60 3318255 i rezervišite ležaljke.",
    verified: true,
    note: "All 31 captions — 'Za rezervacije, pozovite na broj +381 60 3318255'.",
  },
  {
    question: "Da li ima parkinga?",
    answer: "Ima. Ispred kluba je veliki besplatan parking.",
    verified: true,
    note: "Confirmed amenity, PRD.md §2 / BUILD_PROMPT.md §8. Already stated in the home QuickFacts strip.",
  },
  {
    question: "Da li je pogodno za decu?",
    answer:
      "Jeste. Deca do 4 godine ne plaćaju ništa, a deca od 4 do 12 godina plaćaju 50% manje.",
    verified: true,
    note:
      "All 31 captions + the pricing card. Deliberately answers only the price tiers — nothing about pool depth or supervision is sourced anywhere, so nothing is claimed.",
  },
  {
    question: "Šta da ponesem?",
    answer:
      "Kupaći kostim, peškir i kremu za sunčanje. Ležaljke i suncobrani vas čekaju na terasi.",
    verified: false,
    note:
      "DRAFTED. The second sentence is sourced (sunbeds are in the price; umbrellas are a confirmed amenity); the first is generic and commits to nothing.",
  },
  {
    question: "Šta ako pada kiša?",
    answer:
      "Ako je vreme neizvesno, pozovite nas na +381 60 3318255 pre nego što krenete.",
    verified: false,
    note:
      "DRAFTED. No rain policy exists in any source. Routes to the phone on purpose — inventing a refund or rescheduling rule here would commit the business to terms it never set.",
  },
  {
    question: "Kako funkcioniše otkazivanje rezervacije?",
    answer:
      "Za otkazivanje ili izmenu rezervacije pozovite nas na +381 60 3318255, što ranije možete.",
    verified: false,
    note:
      "DRAFTED. See OPEN_QUESTIONS.md #3 — no cancellation policy exists. PRD.md §8's '24h' is an example in the brief, not a real term, and must not be published as fact.",
  },
];

/** The drafted entries, for the verification script and the handover docs. */
export const unverifiedFaq = faq.filter((f) => !f.verified);

/**
 * Page furniture. Authored, like `matinePage` in copy.ts — kept out of the
 * component because no Serbian prose is typed into JSX, whatever its source.
 * Neither line makes a claim about the business.
 */
export const faqPage = {
  asideTitle: "Niste našli odgovor?",
  asideBody: "Pozovite nas — najbrže je.",
} as const;
