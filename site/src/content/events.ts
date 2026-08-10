import type { ImageSlotId } from "./images";

/**
 * Matine events — data, never hardcoded JSX.
 *
 * These are the only two events the business has ever announced, and **both
 * are in the past** relative to the build date (10 Aug 2026). The empty state
 * is therefore the state that actually ships. See design-system/…/pages/events.md.
 *
 * On the first date: the announcement caption reads "18.6.2026" but was posted
 * on 14 July, announcing an upcoming Saturday. 18 June 2026 was a Thursday and
 * a month in the past; 18 July 2026 was a Saturday, four days after the post.
 * The flyer reads "SUBOTA 18. JUL" and is correct. See OPEN_QUESTIONS.md #12.
 */

export type MatineEvent = {
  /** ISO date, used for sorting, <time> and JSON-LD. */
  date: string;
  /** As it should read in Serbian. */
  displayDate: string;
  dj: string;
  /** Instagram handle without the @, or null. */
  djHandle: string | null;
  startTime: string;
  endTime: string;
  priceRsd: number;
  flyer: ImageSlotId | null;
  /** Extra line from the announcement, verbatim. */
  note: string | null;
  /** Instagram post this came from. */
  source: string;
};

export const events: MatineEvent[] = [
  {
    date: "2026-07-18",
    displayDate: "Subota, 18. jul 2026.",
    dj: "DJ Byedov",
    djHandle: "byedov",
    startTime: "15:00",
    endTime: "20:00",
    priceRsd: 3500,
    flyer: "flyer-byedov",
    note: "Pre matinea bazen radi normalno.",
    source: "DaxeIJsM1iO",
  },
  {
    date: "2026-08-01",
    displayDate: "Subota, 1. avgust 2026.",
    dj: "Misictoma",
    djHandle: "misictoma",
    startTime: "10:00",
    endTime: "18:00",
    priceRsd: 3500,
    flyer: "flyer-matine",
    note: null,
    source: "DbWIhJXNwaH",
  },
];

/** Events still to come, soonest first. */
export function upcomingEvents(now: Date = new Date()): MatineEvent[] {
  const today = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Events already held, most recent first. */
export function pastEvents(now: Date = new Date()): MatineEvent[] {
  const today = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Shown wherever there is no upcoming date. */
export const emptyStateCopy =
  "Sledeći datumi uskoro — pratite nas na Instagramu.";
