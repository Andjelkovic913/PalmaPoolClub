import { images, type ImageSlotId } from "./images";

/**
 * Gallery grouping.
 *
 * Labels are verbatim from BUILD_PROMPT.md §9 Phase 5 ("Grouped grid with
 * subtle labels: Bazen & Pogled · Sadržaji & Hrana · Matine Žurke"). They
 * render through `.eyebrow`, which uppercases, so their title-casing never
 * reaches the screen.
 *
 * ORDER MATTERS. The grid is a CSS multi-column masonry, which balances column
 * heights from a single source order, so tall (0.56) and wide (1.76) entries
 * are interleaved rather than listed by kind — a run of five portraits in a row
 * leaves one column far longer than the others.
 *
 * EMPTY SLOTS ARE SHOWN, and only where that group genuinely lacks coverage.
 * No photograph is ever placed in a group it does not belong to in order to
 * pad it out: `Sadržaji & Hrana` holds the food truck and the café terrace
 * because those ARE the food and the café, and then admits with three
 * `<ImageSlot>`s that the billiards table, the table tennis and the parking
 * have never been photographed. Same for the two missing Matine shots. This is
 * the visible form of OPEN_QUESTIONS.md #10 — dropping a photo in here later
 * is a one-line edit to this file.
 */

export type GalleryGroup = {
  /** Anchor id — the section is linkable. */
  id: string;
  /** `null` renders no eyebrow — used by the single-section variant. */
  label: string | null;
  items: ImageSlotId[];
};

export const galleryGroups: GalleryGroup[] = [
  {
    id: "bazen-i-pogled",
    label: "Bazen & Pogled",
    items: [
      "hero-aerial-wide", // 0.56
      "pool-panorama-loungers", // 1.76
      "deck-loungers-valley", // 0.80
      "mushroom-float", // 1.77
      "aerial-terrace-valley", // 0.56
      "terrace-rooftops", // 1.77
      "pool-umbrellas-roof", // 0.80
      "deck-umbrellas", // 1.80
      "pool-jacuzzi-overhead", // 0.56
      "aerial-top-down", // 0.56
    ],
  },
  {
    id: "sadrzaji-i-hrana",
    label: "Sadržaji & Hrana",
    items: [
      "foodtruck-golden-hour", // 0.56 — the Palma Pool Cafe truck itself
      "terrace-cafe-frontage", // 1.74 — the café frontage and terrace
      "amenity-billiards", // no photo exists
      "amenity-table-tennis", // no photo exists
      "amenity-parking", // no photo exists
    ],
  },
  {
    /** Real gold-on-black flyer artwork. There is no night photography. */
    id: "matine-zurke",
    label: "Matine Žurke",
    items: [
      "flyer-byedov",
      "flyer-matine",
      "event-dj-booth", // no photo exists
      "event-crowd-dusk", // no photo exists
    ],
  },
];

/**
 * THE LAYOUT THAT SHIPS: one ungrouped section, twelve photographs, rendered
 * as a uniform cropped grid (`layout="grid"` on <GalleryGrid>).
 *
 * TWELVE, NOT FOURTEEN — the two flyers are deliberately absent.
 *
 * A 3:2 cell keeps only ~50% of a 0.75 poster, and measured on the real thing
 * that half is the wrong half: cropping `flyer-byedov` leaves "DJ BYEDOV /
 * SUBOTA 18. JUL" and discards the set time, the phone number and both flyer
 * slogans. A poster is a document, not a texture — it cannot be cropped the
 * way a landscape can. Both flyers already appear UNCROPPED at full height on
 * `/events`, which is where the artwork belongs. So the gallery is
 * photographs, and `/events` carries the artwork.
 *
 * The count is load-bearing: 12 divides exactly by 2, 3 and 4, so the grid has
 * no ragged last row at any breakpoint. Adding or removing one photograph
 * brings the rag back — not a bug, but check the shots before shipping it.
 *
 * Photographs survive the crop; that was checked, not assumed. A 0.56 drone
 * shot keeps 37% of its frame and still reads, because the subject is central
 * and the `focal` positions in the manifest aim every cell.
 *
 * Order still interleaves tall with wide, which costs nothing here and keeps
 * the masonry variants below usable without a re-sort.
 */
export const gallerySingle: GalleryGroup[] = [
  {
    id: "sve-fotografije",
    label: null,
    items: [
      "hero-aerial-wide", // 0.56
      "pool-panorama-loungers", // 1.76
      "deck-loungers-valley", // 0.80
      "mushroom-float", // 1.77
      "aerial-terrace-valley", // 0.56
      "terrace-cafe-frontage", // 1.74
      "pool-umbrellas-roof", // 0.80
      "deck-umbrellas", // 1.80
      "foodtruck-golden-hour", // 0.56
      "terrace-rooftops", // 1.77
      "pool-jacuzzi-overhead", // 0.56
      "aerial-top-down", // 0.56
    ],
  },
];

/**
 * The lightbox's list: every image in the given layout that has an actual
 * file, in display order.
 *
 * Derived from whichever layout is rendered rather than hardcoded to one of
 * them — the viewer indexes into this, so a mismatch would open the wrong
 * photograph. Arrow keys walk the whole gallery rather than dead-ending at a
 * group boundary, and an empty slot is never in the list because there would
 * be nothing to enlarge.
 */
export function flattenGallery(groups: GalleryGroup[]): ImageSlotId[] {
  return groups
    .flatMap((g) => g.items)
    .filter((id) => images[id].src !== null);
}
