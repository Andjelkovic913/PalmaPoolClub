/**
 * Verified business facts. Source: BUILD_PROMPT.md §8, cross-checked against
 * the Instagram captions and the DJ Byedov flyer.
 *
 * Used for the footer, /location, click-to-call links and JSON-LD schema.
 */

export const business = {
  name: "Palma Pool Club",
  alternateName: "Palma Pool Club Kosmaj",

  address: {
    street: "Kralja Petra Prvog BB",
    locality: "Sopot",
    region: "Kosmaj",
    country: "Srbija",
    /** Single-line form for display. */
    full: "Kralja Petra Prvog BB, Sopot, Srbija",
  },

  /**
   * Exact coordinates, from the map link in the Instagram bio
   * (maps.app.goo.gl/AaSFopphDQj5fLSR9 → 44°32'13.1"N 20°33'35.4"E).
   *
   * These are load-bearing: the street address is "BB" (bez broja, no house
   * number) and geocodes to a road midpoint with no pin, which left the map
   * labelling a neighbouring hotel instead of this venue. Always embed the
   * map by lat/lng, never by the address string.
   *
   * Also feeds the LocalBusiness JSON-LD `geo` property in Phase 8.
   */
  geo: {
    lat: 44.5369706,
    lng: 20.5598241,
    /** Google Plus Code — a usable fallback in nav apps. */
    plusCode: "GHP5+QWP Sopot",
    /** Short link straight from the Instagram bio. */
    mapsUrl: "https://maps.app.goo.gl/AaSFopphDQj5fLSR9",
  },

  phone: {
    /** E.164 — for the tel: href. Source: all 31 captions. */
    href: "+381603318255",
    /** As the captions write it. */
    display: "+381 60 3318255",
    /** As the flyer writes it. Source: brand_dj_byedov_poster_clean.jpg */
    flyerDisplay: "060 331 8255",
  },

  /**
   * Source: all 31 captions ("od 10 do 19h svaki dan"), the `radnovreme.png`
   * graphic, and the Instagram bio ("Radno vreme: 10:00-19:00").
   * A stray reel outside the scraped set says "do 20h" — outvoted, and the bio
   * is the most authoritative surface the business controls.
   */
  hours: {
    opens: "10:00",
    closes: "19:00",
    display: "Svaki dan 10:00–19:00",
    /**
     * Season ran 18 Jun 2026 (first "Sezona je zvanično otvorena!" post)
     * to at least 7 Aug 2026 (last scraped post). Exact closing date unknown.
     */
    seasonNote: "Sezonski — bazen radi tokom letnje sezone.",
  },

  instagram: {
    handle: "@palmapoolclub",
    url: "https://www.instagram.com/palmapoolclub/",
  },

  /** Source: all 31 captions — "na nekih 30 minuta od Beograda". */
  distance: {
    km: 43,
    minutes: 30,
    display: "~43 km / ~30 minuta od Beograda",
    short: "30 min od Beograda",
  },

  /**
   * Amenities are REAL (listed in PRD.md §2 and BUILD_PROMPT.md §8) but the
   * business has never described any of them in a caption. Labels only —
   * the one-line descriptions are unsourced and must render as TODO.
   * See OPEN_QUESTIONS.md #4.
   */
  amenities: [
    "Dva bazena",
    "Jacuzzi sa pogledom",
    "Ležaljke i suncobrani",
    "Palma Pool Cafe food truck",
    "Stoni tenis",
    "Bilijar",
    "Veliki besplatan parking",
    "Panoramski pogled na Kosmaj",
  ],
} as const;

/**
 * Price rules. Figures cross-verified two ways: the pricing card
 * (menu_pricing.jpg) states the absolute numbers, and all 31 captions state
 * the same numbers plus the "50% manje" child rule. They agree.
 *
 * UNIT: charged per person. The price cards word it as "din/ležaljka" and the
 * captions say "po ležaljci", but the two units coincide — every paying guest
 * occupies exactly one sunbed, so a head count and a sunbed count are the same
 * number. `/book` therefore collects people, which is what a guest actually
 * knows when booking. Children under 4 are free and take no sunbed; they are
 * with their parents. Owner-confirmed. See OPEN_QUESTIONS.md #15.
 */
export const pricing = {
  currency: "RSD",
  currencyShort: "din",

  /** Per adult. One adult = one sunbed. */
  adult: { weekday: 2500, weekend: 3500 },
  /** 50% of the adult price, per the captions. Matches the card exactly. */
  child4to12: { weekday: 1250, weekend: 1750 },
  /**
   * Free, and takes no sunbed — under-4s are with their parents.
   * Still collected as a booking field: the venue needs the head count.
   * Source: all 31 captions, "Deca do 4 godine ne plaćaju ništa."
   */
  under4: { weekday: 0, weekend: 0 },

  /** Half-day tickets from 15:00 are 50% off. Source: card + captions. */
  halfDay: { fromHour: 15, discount: 0.5 },

  /** Matine tickets — flat regular weekend price. Source: both announcements. */
  matine: 3500,

  /**
   * Booking is counted per person. Each paying guest occupies one sunbed, so
   * this is also the sunbed count — which is how the price cards word it.
   */
  countBy: "person" as const,
} as const;
