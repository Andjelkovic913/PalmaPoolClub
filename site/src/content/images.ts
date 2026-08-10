/**
 * Typed image manifest. Every photo on this site is referenced by slot ID —
 * never by raw path in a component. Swapping in higher-resolution originals
 * later means editing this file only.
 *
 * All photography is the venue's own. There is no stock imagery and no
 * AI-generated imagery anywhere in this project (BUILD_PROMPT.md §0 rule 2).
 *
 * A slot with no file yet has `src: null` and renders <ImageSlot>, never a
 * broken image.
 */

export type ImageSlotId = keyof typeof images;

export type ImageEntry = {
  /** Path under /public, or null when no real photo exists yet. */
  src: string | null;
  width: number;
  height: number;
  /** Serbian alt text — required for SEO and a11y. */
  alt: string;
  /**
   * Hard ceiling on sensible render width in CSS px. The four landscape
   * shots are ~511px video frame-grabs; rendering them wider than this
   * visibly softens. Grids must respect it. `null` = no practical limit.
   */
  maxRenderWidth: number | null;
  /**
   * CSS `object-position` — where the subject actually is.
   *
   * This set spans a 3× aspect range (0.56 portrait to 1.80 landscape), so any
   * uniform tile grid has to crop hard. Without a focal point the browser keeps
   * the centre, which on a tall photo means a horizontal band of whatever
   * happens to be halfway down — for the food truck, the deck instead of the
   * truck. Set this to keep the subject in frame.
   */
  focal: string;
  /** What this is, for whoever maintains the manifest. */
  note?: string;
};

export const images = {
  /* --- Tall drone shots: 941×1670. The only imagery strong enough to carry
     full-width layout. ---------------------------------------------------- */

  "hero-aerial-wide": {
    src: "/images/hero-aerial-wide.jpg",
    focal: "50% 50%",
    width: 942,
    height: 1670,
    alt: "Pogled iz vazduha na Palma Pool Club — dva bazena, terasa sa ležaljkama, objekat sa solarnim panelima i šuma Kosmaja u pozadini",
    maxRenderWidth: null,
    note: "Home hero. The LCP image — must carry priority.",
  },

  "aerial-top-down": {
    src: "/images/aerial-top-down.jpg",
    focal: "50% 45%",
    width: 941,
    height: 1672,
    alt: "Snimak dronom iz ptičje perspektive: dva bazena sa ležaljkama, crvena pečurka fontana u vodi i solarni paneli na krovu",
    maxRenderWidth: null,
  },

  "aerial-terrace-valley": {
    src: "/images/aerial-terrace-valley.jpg",
    focal: "50% 55%",
    width: 941,
    height: 1670,
    alt: "Pogled sa terase Palma Pool Cluba preko oba bazena sa ležaljkama i suncobranima, na krovove sela i brda Kosmaja",
    maxRenderWidth: null,
  },

  "pool-jacuzzi-overhead": {
    src: "/images/pool-jacuzzi-overhead.jpg",
    focal: "50% 50%",
    width: 941,
    height: 1672,
    alt: "Bazen za plivanje i okrugli jacuzzi snimljeni odozgo, plivač u vodi, drvene ležaljke i pogled na dolinu",
    maxRenderWidth: null,
  },

  "foodtruck-golden-hour": {
    src: "/images/foodtruck-golden-hour.jpg",
    focal: "50% 35%",
    width: 941,
    height: 1670,
    alt: "Žuti Palma Pool Cafe food truck na terasi, drvene stolice i sunčeva svetlost",
    maxRenderWidth: null,
  },

  /* --- Eye-level photography, owner-supplied text-free originals. The only
     ground-level shots in the set; everything else is drone or a 511px frame
     grab. Imported by scripts/import-images.mjs. ---------------------------- */

  "terrace-cafe-frontage": {
    src: "/images/terrace-cafe-frontage.jpg",
    focal: "50% 50%",
    width: 1653,
    height: 951,
    alt: "Terasa Palma Pool Cluba sa nadstrešnicom, staklenom fasadom kafea, ležaljkama i pogledom na Kosmaj",
    maxRenderWidth: null,
    note: "1.74 — the ONLY true wide landscape, and the highest-resolution source in the project. Desktop hero.",
  },

  "deck-loungers-valley": {
    src: "/images/deck-loungers-valley.jpg",
    focal: "50% 50%",
    width: 1122,
    height: 1402,
    alt: "Ivica bazena sa nizom ležaljki, suncobranom i pogledom na polja i brda Kosmaja",
    maxRenderWidth: null,
    note: "0.80 portrait. Strongest ground-level photograph in the set.",
  },

  "pool-umbrellas-roof": {
    src: "/images/pool-umbrellas-roof.jpg",
    focal: "50% 45%",
    width: 1124,
    height: 1399,
    alt: "Ugao bazena sa belim suncobranima, ležaljkama i kućom sa crvenim krovom u pozadini",
    maxRenderWidth: null,
    note: "0.80 portrait. The untouched original has no third-party branding — an earlier machine crop had caught a supplier logo.",
  },

  /* --- Landscape shots: ~511×290 video frame-grabs. Small tiles only.
     Never a gallery hero row, never full-bleed. See OPEN_QUESTIONS.md #10. -- */

  "pool-panorama-loungers": {
    src: "/images/pool-panorama-loungers.jpg",
    focal: "50% 50%",
    width: 511,
    height: 291,
    alt: "Bazen sa ležaljkama i pergolom, široko nebo i pogled na dolinu",
    maxRenderWidth: 511,
    note: "LOW RES — frame grab. Tile only.",
  },

  "mushroom-float": {
    src: "/images/mushroom-float.jpg",
    focal: "52% 50%",
    width: 512,
    height: 290,
    alt: "Crvena pečurka fontana sa belim tačkama u bazenu Palma Pool Cluba",
    maxRenderWidth: 512,
    note: "LOW RES — frame grab. The recurring playful accent.",
  },

  "deck-umbrellas": {
    src: "/images/deck-umbrellas.jpg",
    focal: "50% 50%",
    width: 510,
    height: 284,
    alt: "Terasa sa suncobranima i ležaljkama pored bazena, pečurka fontana u vodi",
    maxRenderWidth: 510,
    note: "LOW RES — frame grab. Daylight, NOT dusk. There is no dusk photo.",
  },

  "terrace-rooftops": {
    src: "/images/terrace-rooftops.jpg",
    focal: "50% 55%",
    width: 511,
    height: 288,
    alt: "Bazeni i terasa Palma Pool Cluba sa krovovima okolnih kuća i brdima u pozadini",
    maxRenderWidth: 511,
    note: "LOW RES — frame grab. Tile only.",
  },

  /* --- Event flyers: the venue's real gold-on-black artwork. --------------- */

  "flyer-byedov": {
    src: "/images/flyer-byedov.jpg",
    focal: "50% 22%",
    width: 1087,
    height: 1447,
    alt: "Plakat za Palma Pool Club Matine sa DJ-em Byedov, subota 18. jul, od 15 do 20 časova",
    maxRenderWidth: null,
  },

  "flyer-matine": {
    src: "/images/flyer-matine.jpg",
    focal: "50% 28%",
    width: 1123,
    height: 1400,
    alt: "Plakat za Palma Pool Club Matine — subota, 1. avgust 2026.",
    maxRenderWidth: null,
  },

  /* --- Slots with no photo yet. These render <ImageSlot>. ------------------
     The venue has never published night, dusk, DJ-booth or crowd photography.
     See OPEN_QUESTIONS.md #10. --------------------------------------------- */

  "event-dj-booth": {
    src: null,
    focal: "50% 50%",
    width: 1200,
    height: 800,
    alt: "DJ pult tokom Matine žurke pored bazena",
    maxRenderWidth: null,
    note: "NO PHOTO EXISTS. Needs a real shot from a Matine night.",
  },

  "event-crowd-dusk": {
    src: null,
    focal: "50% 50%",
    width: 1200,
    height: 800,
    alt: "Gosti pored bazena u sumrak tokom Matine žurke",
    maxRenderWidth: null,
    note: "NO PHOTO EXISTS. Needs a real shot from a Matine night.",
  },

  "amenity-billiards": {
    src: null,
    focal: "50% 50%",
    width: 1200,
    height: 800,
    alt: "Bilijar sto u Palma Pool Clubu",
    maxRenderWidth: null,
    note: "NO PHOTO EXISTS.",
  },

  "amenity-table-tennis": {
    src: null,
    focal: "50% 50%",
    width: 1200,
    height: 800,
    alt: "Sto za stoni tenis u Palma Pool Clubu",
    maxRenderWidth: null,
    note: "NO PHOTO EXISTS.",
  },

  "amenity-parking": {
    src: null,
    focal: "50% 50%",
    width: 1200,
    height: 900,
    alt: "Besplatan parking ispred Palma Pool Cluba",
    maxRenderWidth: null,
    note: "NO PHOTO EXISTS. Parking is visible in the drone shots but there is no dedicated photo.",
  },
} as const satisfies Record<string, ImageEntry>;

/** Look a slot up by ID. Throws at build time on a typo'd ID. */
export function getImage(id: ImageSlotId): ImageEntry {
  return images[id];
}
