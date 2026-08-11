import { BookingForm } from "./BookingForm";

/**
 * The swap point for a third-party booking engine.
 *
 * `BUILD_PROMPT.md` §9 Phase 7 asks for "a clearly isolated <BookingWidget>
 * boundary component that the third-party embed drops into later". This is it,
 * and the isolation is the whole value: when SimplyBook.me (or whatever wins
 * OPEN_QUESTIONS.md #6) is chosen, the embed replaces the body of THIS file.
 * `src/app/book/page.tsx` — its heading, its price explainer, its cancellation
 * note, its metadata — does not change.
 *
 * Two things the future embed must not silently lose, both of which the
 * current form provides:
 *
 *   1. **The live price.** PRD.md problem #3 is that this venue's prices exist
 *      only as JPEGs. If an embed cannot show a running total, keep the
 *      calculator above it rather than dropping the number.
 *   2. **Honesty about confirmation.** The venue's daily sunbed capacity is
 *      unknown (#5), so nothing here may claim a booking is confirmed until
 *      something real is checking availability.
 *
 * Kept as a server component with no props: it is a seam, not a layer. Adding
 * configuration here is a sign the page is reaching through it.
 */
export function BookingWidget() {
  return <BookingForm />;
}
