/**
 * A visible, deliberately unmissable marker for content that has no verified
 * source yet.
 *
 * BUILD_PROMPT.md §0 rule 1: never a plausible-sounding guess. Where a fact is
 * missing this renders instead, and the same item is listed in
 * OPEN_QUESTIONS.md for the owner to answer.
 *
 * If any of these reach production, that is the bug — not the missing copy.
 */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-start gap-1.5 rounded-sm border border-dashed border-float-red/60 bg-float-red/5 px-2 py-1 text-xs leading-snug text-float-red">
      <strong className="shrink-0 font-semibold tracking-wide">TODO</strong>
      <span className="text-ink/70">{children}</span>
    </span>
  );
}
