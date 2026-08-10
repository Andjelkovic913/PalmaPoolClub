/**
 * Canonical Serbian copy — the ONLY source of brand prose on this site.
 *
 * Every string here is lifted verbatim from material the business itself
 * published. Nothing is invented, nothing is paraphrased. Each export names
 * the Instagram shortcode or the image file it came from, so any sentence
 * rendered on the site can be traced back to a real source.
 *
 * Source of truth: ../../../instagram_raw/post_log.json (35 scraped posts)
 *
 * RULE: do not write Serbian prose inline in a component. Add it here with a
 * source, or render a visible TODO and log it in OPEN_QUESTIONS.md.
 *
 * ONE DELIBERATE CORRECTION: all 31 captions read "predivnim poglednom".
 * The correct Serbian is "predivnim pogledom". This is a typo in their copy,
 * not their voice — we ship it corrected. Do not "fix" it back.
 * See OPEN_QUESTIONS.md #13.
 */

/**
 * The canonical blurb. Posted essentially verbatim 31 times between
 * 2026-06-18 and 2026-08-07. This is the brand's voice — short, sunny,
 * direct. Split into fragments so pages can use the part they need.
 *
 * Source: DZu3iApjPFY, DaNUtD-jEMT, Db02CdCNHnK + 28 others
 */
export const blurb = {
  /** Opening emoji pair as they use it. Marketing copy only — never a UI icon. */
  sunEmoji: "☀️🌴",

  /** Source: every one of the 31 posts. "poglednom" -> "pogledom" corrected. */
  intro:
    "Palma Pool Club je bazen sa predivnim pogledom, u mirnom predelu Kosmaja, na nekih 30 minuta od Beograda.",

  /** Source: every one of the 31 posts. */
  hours: "Radno vreme bazena je od 10 do 19h svaki dan.",

  /**
   * Source: every one of the 31 posts.
   * NOTE the wording: "po ležaljci" — per sunbed, not per person. This
   * conflicts with the pricing card's "ODRASLI" row label.
   * See OPEN_QUESTIONS.md #1 — unresolved, blocks /book.
   */
  prices:
    "Cene ležaljki su 2500 dinara po ležaljci radnim danima, a 3500 dinara vikendom.",

  /** Source: every one of the 31 posts. Confirms the free-under-4 tier. */
  children:
    "Deca do 4 godine ne plaćaju ništa, a deca od 4 do 12 godina plaćaju 50% manje.",

  /** Source: every one of the 31 posts. */
  halfDay: "Poludnevne karte (od 15h) koštaju 50% manje.",

  /** Source: every one of the 31 posts. */
  reservations: "Za rezervacije, pozovite na broj +381 60 3318255",

  /** Source: DZu3iApjPFY (2026-06-18, season opening) + 10 others. */
  seasonOpen: "Sezona je zvanično otvorena!",
} as const;

/**
 * Brand lockup copy, from the pricing card and the DJ Byedov poster.
 * Source: menu_pricing.jpg, brand_dj_byedov_poster_clean.jpg
 */
export const brand = {
  name: "Palma Pool Club",
  /** Instagram account display name — used as schema alternateName. */
  alternateName: "Palma Pool Club Kosmaj",
  /**
   * Source: menu_pricing.jpg and the Byedov poster, both of which set it
   * under the wordmark. A third variant "sunce. palme. pogled." appears on
   * brand_tagline_sky.jpg — see OPEN_QUESTIONS.md #11.
   */
  tagline: "Sunce. Palma. Pogled.",
  wordmark: "PALMA",
  wordmarkSub: "POOL CLUB",
} as const;

/**
 * Pricing card copy, verbatim.
 * Source: menu_pricing.jpg (also radnidani.png / VikendCenovnik.png)
 */
export const pricingCard = {
  title: "ULAZNICE",
  note: "Ležaljke su uključene u cenu.",
  weekday: "Radnim danima",
  weekend: "Vikendom",
  adult: "Odrasli",
  child: "Deca od 4 do 12 godina",
  /** Not on the card, but stated in all 31 captions. See OPEN_QUESTIONS.md #14. */
  toddler: "Deca do 4 godine",
  free: "Besplatno",
  halfDayLabel: "Poludnevna karta od 15:00",
  halfDayValue: "50% popusta na redovnu cenu",
  /** Their own closing line. */
  closing: "Hvala što ste deo naše palme!",
} as const;

/**
 * Matine event announcements, verbatim from the two posts that announced them.
 * These are the only two events the business has ever announced.
 */
export const matineAnnouncements = {
  /**
   * Source: DaxeIJsM1iO (posted 2026-07-14) and Da0qM3-tYV0 (2026-07-15).
   *
   * The caption reads "18.6.2026" but was posted on 14 July announcing an
   * upcoming Saturday. 18 June 2026 was a Thursday, a month in the past;
   * 18 July 2026 was a Saturday, four days after the post. The flyer reads
   * "SUBOTA 18. JUL". The caption is a typo by the business and PRD.md
   * inherited it. We render the flyer date. See OPEN_QUESTIONS.md #12.
   */
  first: {
    raw: "U subotu, 18.6.2026. organizujemo prvi palma pool matine 🥳\n\nDJ je @byedov i matine traje od 15 do 20h.\n\nLežaljke, odnosno ulaz, se naplaćuju po regularnoj ceni od 3500 dinara, a pre matinea će bazen raditi normalno.\n\nVidimo se! ☀️🌴",
    note: "Pre matinea bazen radi normalno.",
  },

  /** Source: DbWIhJXNwaH (2026-07-27) and DbV6xPssd09 (2026-07-28). */
  second: {
    raw: "U subotu, 1.8.2026. organizujemo drugi palma pool matine\n\nDJ je @misictoma i matine traje od 10 do 18h.\n\nLežaljke, odnosno ulaz, se naplaćuju po regularnoj ceni od 3500 dinara.\n\nVidimo se!",
  },

  /** Shared across both announcements. */
  ticketNote: "Ležaljke, odnosno ulaz, se naplaćuju po regularnoj ceni.",
  signoff: "Vidimo se!",
} as const;

/**
 * Nightlife voice — lifted from the DJ Byedov flyer artwork.
 * Source: brand_dj_byedov_poster_clean.jpg / dj.png
 * Used only on /events, in nightlife mode.
 */
export const flyerVoice = {
  headline: "Feel the vibe. Live the moment.",
  vibe: "Chill. Music. Sun. Good vibes.",
  weekend: "Tvoj vikend počinje ovde.",
  signoff: "Pool. People. Palma.",
  reservationsLabel: "Rezervacije na broj",
} as const;

/**
 * Menu header notes, verbatim.
 * Source: menu_food.jpg, menu_drinks.jpg (transcribed in BUILD_PROMPT.md §6)
 */
export const menuNotes = {
  payAtBar: "Molimo goste da narudžbine i plaćanje izvrše na šanku.",
  foodTruck:
    "Hrana se priprema u Palma Pool Cafe food trucku na terasi.",
  hydration: "Hidracija je ključ. Uživajte i osvežite se!",
  legend: {
    recommended: "Preporuka kuće",
    spicy: "Ljuto",
    sharing: "Za deljenje",
  },
} as const;
