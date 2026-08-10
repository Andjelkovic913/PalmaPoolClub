import type { ImageSlotId } from "./images";

/**
 * Amenity cards for Home.
 *
 * The amenities themselves are confirmed (PRD.md §2, BUILD_PROMPT.md §8), but
 * **the business has never described any of them** in any of the 35 scraped
 * captions, on the menus, or on the flyers. So every `description` below is
 * unsourced and marked `TODO`. They render with a visible TODO badge rather
 * than inventing plausible hospitality copy. See OPEN_QUESTIONS.md #4.
 *
 * `icon` names map to lucide-react exports, resolved in the component.
 */

export type Amenity = {
  title: string;
  /** null = no verified description exists. Renders a visible TODO. */
  description: string | null;
  icon: "Waves" | "Bath" | "Truck" | "Dices" | "Disc3" | "CircleParking";
  /**
   * Required, not optional. Every card needs a media area or it collapses to a
   * fraction of its neighbours' height and leaves a hole in the grid row.
   * Where no photo exists, point at a null-src slot and let <ImageSlot> fill it.
   */
  photo: ImageSlotId;
  href?: string;
};

export const amenities: Amenity[] = [
  {
    title: "Dva bazena",
    description: null,
    icon: "Waves",
    photo: "aerial-top-down",
  },
  {
    title: "Jacuzzi sa pogledom",
    description: null,
    icon: "Bath",
    photo: "pool-jacuzzi-overhead",
  },
  {
    title: "Palma Pool Cafe",
    description: null,
    icon: "Truck",
    photo: "foodtruck-golden-hour",
    href: "/menu",
  },
  {
    title: "Stoni tenis i bilijar",
    description: null,
    icon: "Dices",
    photo: "amenity-billiards",
  },
  {
    title: "Matine DJ žurke",
    description: null,
    icon: "Disc3",
    photo: "flyer-byedov",
    href: "/events",
  },
  {
    title: "Veliki besplatan parking",
    description: null,
    icon: "CircleParking",
    photo: "amenity-parking",
  },
];
