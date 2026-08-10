/**
 * ⚠️ PLACEHOLDER DATA — NOT REAL REVIEWS.
 *
 * No usable review text exists anywhere in the 35 scraped Instagram posts, and
 * no Google reviews have been sourced yet. See OPEN_QUESTIONS.md #8.
 *
 * These exist so the component can be built and reviewed. Every one renders
 * with a visible "placeholder" badge so it cannot be mistaken for real
 * testimony, and `isPlaceholder` gates that badge — flip it to false only when
 * an entry is replaced with a genuine, attributable review.
 */

export type Review = {
  quote: string;
  author: string;
  source: string;
  rating: number;
  isPlaceholder: boolean;
};

export const reviews: Review[] = [
  {
    quote:
      "TODO: zameniti stvarnom recenzijom sa Google Maps profila. Ovaj tekst je popuna.",
    author: "TODO — ime gosta",
    source: "Google",
    rating: 5,
    isPlaceholder: true,
  },
  {
    quote:
      "TODO: zameniti stvarnom recenzijom. Nijedna recenzija nije pronađena u prikupljenim Instagram objavama.",
    author: "TODO — ime gosta",
    source: "Google",
    rating: 5,
    isPlaceholder: true,
  },
  {
    quote:
      "TODO: zameniti stvarnom recenzijom kada vlasnik dostavi pristup Google profilu.",
    author: "TODO — ime gosta",
    source: "Instagram",
    rating: 5,
    isPlaceholder: true,
  },
];

/** True while any review is still placeholder — used to warn in the UI. */
export const hasPlaceholderReviews = reviews.some((r) => r.isPlaceholder);
