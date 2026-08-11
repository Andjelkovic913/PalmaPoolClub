import { pricing } from "@/content/business";

/**
 * The booking price rules, isolated in one pure function.
 *
 * Kept out of the form deliberately: this is the only code on the site that
 * produces a number a guest will hand over money against, and the rules have
 * already been re-read twice (OPEN_QUESTIONS.md #15). When they change, they
 * change here and `scripts/check-price.mjs` re-proves them.
 *
 * ── WHAT IS PRINTED vs WHAT IS DERIVED ─────────────────────────────────────
 * Printed on the price card and repeated in all 31 captions:
 *   adults 2.500 weekday / 3.500 weekend · children 4–12 1.250 / 1.750 ·
 *   under 4 free · "Poludnevna karta (od 15:00) — 50% popusta".
 *
 * DERIVED, and confirmed by the owner rather than read off a card:
 *   · "Vikend" means SATURDAY AND SUNDAY. Friday is charged as a weekday.
 *     The card only says "Radnim danima" / "Vikendom" and never names the days.
 *   · The half-day 50% applies to the CHILD rate too, so a 4–12 child on a
 *     Saturday afternoon is 1.750 × 0,5 = 875. That figure appears on no
 *     printed material — it follows from "50% popusta na redovnu cenu".
 *
 * ── UNIT ───────────────────────────────────────────────────────────────────
 * Per person. The cards word it as "din/ležaljka" and the captions say "po
 * ležaljci", but every paying guest occupies exactly one sunbed so the two
 * counts coincide. Under-4s are free AND take no sunbed — they are with their
 * parents — so they are collected as a head count and priced at zero.
 */

export type TicketType = "day" | "matine";
export type Arrival = "full" | "afternoon";

export type Party = {
  adults: number;
  children4to12: number;
  under4: number;
};

export type PriceLine = {
  label: string;
  count: number;
  /** Per-person price actually applied, after any half-day discount. */
  unit: number;
  total: number;
};

export type PriceResult = {
  lines: PriceLine[];
  total: number;
  isWeekend: boolean;
  /** Half-day pricing was applied. Never true for a Matine ticket. */
  halfDay: boolean;
  /** Everyone present, including the under-4s who pay nothing. */
  guests: number;
  /** Paying guests — and therefore the number of sunbeds occupied. */
  sunbeds: number;
};

/**
 * Saturday or Sunday, in the venue's own local terms.
 *
 * Takes a `YYYY-MM-DD` string and splits it by hand rather than passing it to
 * `new Date(iso)`. That constructor parses a bare date as UTC midnight, so in
 * any timezone behind UTC `getDay()` returns the PREVIOUS day — which would
 * quietly bill a Saturday at the weekday rate. Building from the parts gives a
 * local date and cannot shift.
 */
export function isWeekendDate(iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return false;
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6;
}

export function priceFor({
  date,
  ticket = "day",
  arrival = "full",
  party,
}: {
  /** ISO `YYYY-MM-DD`. An empty or malformed value prices as a weekday. */
  date: string;
  ticket?: TicketType;
  arrival?: Arrival;
  party: Party;
}): PriceResult {
  const weekend = isWeekendDate(date);

  const adults = Math.max(0, Math.trunc(party.adults));
  const children = Math.max(0, Math.trunc(party.children4to12));
  const under4 = Math.max(0, Math.trunc(party.under4));

  /* Matine is a flat entry price and has fixed event hours, so the half-day
     rule cannot apply to it. See the note in OPEN_QUESTIONS.md about the
     child rate for Matine — the announcements state one price only. */
  const halfDay = ticket === "day" && arrival === "afternoon";
  const factor = halfDay ? pricing.halfDay.discount : 1;

  const adultBase =
    ticket === "matine"
      ? pricing.matine
      : weekend
        ? pricing.adult.weekend
        : pricing.adult.weekday;

  const childBase =
    ticket === "matine"
      ? pricing.matine
      : weekend
        ? pricing.child4to12.weekend
        : pricing.child4to12.weekday;

  const adultUnit = Math.round(adultBase * factor);
  const childUnit = Math.round(childBase * factor);

  const lines: PriceLine[] = [];
  if (adults > 0) {
    lines.push({
      label: "Odrasli",
      count: adults,
      unit: adultUnit,
      total: adults * adultUnit,
    });
  }
  if (children > 0) {
    lines.push({
      label: "Deca od 4 do 12 godina",
      count: children,
      unit: childUnit,
      total: children * childUnit,
    });
  }
  if (under4 > 0) {
    lines.push({
      label: "Deca do 4 godine",
      count: under4,
      unit: 0,
      total: 0,
    });
  }

  return {
    lines,
    total: lines.reduce((sum, l) => sum + l.total, 0),
    isWeekend: weekend,
    halfDay,
    guests: adults + children + under4,
    sunbeds: adults + children,
  };
}

/** Serbian thousands grouping, matching every other price on the site. */
export const din = (n: number) => n.toLocaleString("sr-RS");
