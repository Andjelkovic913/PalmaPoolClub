/**
 * Menu content — transcribed directly from the venue's own printed cards.
 *
 * Sources: `selected/menu_food.jpg` and `selected/menu_drinks.jpg` (identical
 * to `istaknutiStoriji2.jpg` / `istaknutiStoriji3.jpg`). Cross-checked against
 * BUILD_PROMPT.md §6, which is accurate.
 *
 * This page is the fix for PRD problem #3 — the menu currently exists only as
 * a JPEG and is therefore invisible to search. Every item below must render as
 * real, selectable HTML text. It is also an SEO target ("palma pool club meni").
 *
 * THREE CORRECTIONS applied against the cards, all logged in OPEN_QUESTIONS.md:
 *  1. The card reads "GOLDEN ĆHICKEN FINGERS" — a typo in their artwork.
 *     Shipped corrected as "Chicken", per the owner's decision.
 *  2. Ice Cafe carries ❄ only on the card, not ★. §6 gave it both.
 *  3. The drinks card has its OWN legend (★ / ❄ / cocktail), different from
 *     the food card's (★ / 🌶 / 👥). Both are rendered.
 *
 * Markers are rendered as Lucide SVG icons with a legend, never as literal
 * characters (BUILD_PROMPT.md §0 rule 4, §6).
 */

export type Marker = "recommended" | "spicy" | "sharing" | "cold" | "cocktail";

export type MenuItem = {
  name: string;
  /** Dinars. Rendered with tabular numerals. */
  price: number;
  /** Card description, verbatim. Drinks have none. */
  description?: string;
  markers?: Marker[];
  /** Boxed treatment, as the card gives Box Combo. */
  featured?: boolean;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

/** Legend labels, verbatim from each card. */
export const markerLabels: Record<Marker, string> = {
  recommended: "Preporuka kuće",
  spicy: "Ljuto",
  sharing: "Za deljenje",
  cold: "Hladna pića",
  cocktail: "Koktel",
};

/** The food card's legend. */
export const foodLegend: Marker[] = ["recommended", "spicy", "sharing"];

/** The drinks card's legend — a different set. */
export const drinksLegend: Marker[] = ["recommended", "cold", "cocktail"];

/* ------------------------------------------------------------------ HRANA */

export const food: MenuSection[] = [
  {
    title: "Burgeri",
    items: [
      {
        name: "Palma Signature Burger",
        price: 1420,
        markers: ["recommended"],
        description:
          "Sočna dry aged junetina u brioche pecivu, cheddar sir, karamelizovani luk, sveži dodaci i domaći sos.",
      },
      {
        name: "Pileći burger sa pomfritom",
        price: 1050,
        description:
          "Hrskavi pileći file, zelena salata, paradajz, domaći sos i pomfrit.",
      },
    ],
  },
  {
    title: "Wrap & Salate",
    items: [
      {
        name: "Pileći Cezar wrap",
        price: 1050,
        description:
          "Grilovana piletina, parmezan, zelena salata i cezar dresing u tortilji.",
      },
      {
        name: "Cezar salata",
        price: 1150,
        description:
          "Piletina, zelena salata, parmezan, krutoni i cezar dresing.",
      },
    ],
  },
  {
    title: "Deserti",
    items: [
      {
        name: "Palma desert",
        price: 450,
        markers: ["recommended"],
        description: "Kremasti desert po izboru našeg šefa.",
      },
      {
        name: "Sladoled (kugla)",
        price: 150,
        description: "Izbor ukusa – pitajte osoblje.",
      },
      {
        name: "Tropski voćni tanjir",
        price: 850,
        markers: ["recommended"],
        description: "Selekcija svežeg sezonskog voća.",
      },
    ],
  },
  {
    title: "Snacks & Sharing",
    items: [
      {
        name: "Box combo",
        price: 1700,
        markers: ["sharing"],
        featured: true,
        description:
          "Savršen izbor za deljenje – kombinacija najpopularnijih zalogaja iz ponude.",
      },
      {
        name: "Golden Chicken Fingers",
        price: 820,
        markers: ["recommended"],
        description: "Hrskavi pileći štapići uz sos po izboru.",
      },
      {
        name: "Crispy Nuggets",
        price: 780,
        description: "Zlatno pečeni pileći zalogaji.",
      },
      {
        name: "Palma Wings Basket",
        price: 850,
        markers: ["spicy"],
        description:
          "Hrskava pileća krilca u posebnom sosu, servirana uz pomfrit.",
      },
      {
        name: "Mozzarella Sticks",
        price: 850,
        markers: ["recommended"],
        description: "Pohovana mozzarella sa sosom.",
      },
      {
        name: "Mediterraneo Sticks",
        price: 920,
        description: "Mozzarella obmotana pršutom, hrskavo pečena.",
      },
      {
        name: "Onion Rings",
        price: 450,
        description: "Hrskavi kolutovi crnog luka.",
      },
      {
        name: "Pomfrit",
        price: 250,
        markers: ["recommended"],
        description: "Sveže pripremljen zlatni pomfrit.",
      },
      {
        name: "Lepinja",
        price: 160,
        description: "Sveža domaća lepinja.",
      },
    ],
  },
];

/* -------------------------------------------------------------------- PIĆE */

export const drinks: MenuSection[] = [
  {
    title: "Kafe",
    items: [
      { name: "Espreso", price: 230 },
      { name: "Dupli espreso", price: 570 },
      { name: "Espreso sa mlekom", price: 260 },
      { name: "Capucino", price: 290 },
      { name: "Ice cafe", price: 430, markers: ["cold"] },
      { name: "Nes cafe", price: 280 },
    ],
  },
  {
    title: "Sokovi",
    items: [
      { name: "Koka Kola", price: 260 },
      { name: "Kola Zero", price: 260 },
      { name: "Fanta", price: 260 },
      { name: "Sveps Tonic", price: 260 },
      { name: "Sveps Biter Lemon", price: 260 },
      { name: "Sprite", price: 260 },
      // The card lists all five Next Buci flavours as separate lines.
      { name: "Next Buci breskva", price: 200 },
      { name: "Next Buci jabuka", price: 200 },
      { name: "Next Buci jagoda", price: 200 },
      { name: "Next Buci narandža", price: 200 },
      { name: "Next Buci šumsko voće", price: 200 },
      { name: "Redbull", price: 540, markers: ["recommended"] },
    ],
  },
  {
    title: "Voda",
    items: [
      { name: "Rosa", price: 220 },
      { name: "Rosa gazirana", price: 220 },
    ],
  },
  {
    title: "Alkoholna pića",
    items: [
      { name: "Hajniken", price: 360, markers: ["cocktail"] },
      { name: "Mohito", price: 580, markers: ["recommended", "cocktail"] },
      { name: "Blue Lagon", price: 580, markers: ["recommended", "cocktail"] },
      { name: "Pina Colada", price: 580, markers: ["recommended", "cocktail"] },
      { name: "Stobi vino", price: 540, markers: ["recommended", "cocktail"] },
      {
        name: "Sex on the Beach",
        price: 580,
        markers: ["recommended", "cocktail"],
      },
      { name: "Jack Daniels", price: 580, markers: ["recommended", "cocktail"] },
    ],
  },
];
