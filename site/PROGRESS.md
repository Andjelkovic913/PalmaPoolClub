# Build progress

**Last updated:** 10 Aug 2026, after Phase 3.

Read `../CLAUDE.md` first for the rules, then this for where things stand.
Phases follow `../BUILD_PROMPT.md` §9.

---

## Status

| Phase | Scope | State |
|---|---|---|
| 0 | Scaffold, images, `copy.ts`, `OPEN_QUESTIONS.md` | ✅ done |
| 1 | Design system, tokens, fonts, primitives, nav/footer, `/styleguide` | ✅ done |
| 2 | Home `/` | ✅ done — **hero unresolved, see #18** |
| 3 | `/pricing` and `/menu` | ✅ done |
| 4 | `/events` — night mode | ⬜ **next** |
| 5 | `/gallery` — masonry + accessible lightbox | ⬜ |
| 6 | `/faq` and `/location` | ⬜ |
| 7 | `/book` — price calculator + widget boundary | ⬜ |
| 8 | SEO, JSON-LD, sitemap, a11y sweep, acceptance checklist | ⬜ |
| — | Revisit the hero (`OPEN_QUESTIONS.md` #18) | ⬜ |

Routes `/events`, `/gallery`, `/faq`, `/location`, `/book` currently render
`<PagePlaceholder>` so navigation doesn't 404. Replace, don't extend.

---

## What Phase 4 needs to know

`/events` is the one page in night mode. Read
`design-system/palma-pool-club/pages/events.md` before starting — it overrides
MASTER.md.

**The empty state is the state that actually ships.** Both known Matine dates
(18 Jul 2026, 1 Aug 2026) are in the past relative to the build date, so
`upcomingEvents()` returns nothing. Build and review the empty state as the
primary case, with a past-events archive below it. Data is in
`src/content/events.ts` — never hardcode an event in JSX.

Measured contrast on black: body `#F2EBDD` 16.77:1, `gold` 8.29:1,
`gold-bright` 12.27:1. §9 Phase 4 says to "bump to gold-bright where it fails" —
measured, plain gold does **not** fail. Use gold-bright for emphasis, not rescue.

There is **no night photography of this venue at all**. The photo strip is the
two real flyers plus `<ImageSlot>`. Do not darken a daytime photo to fake it.

---

## Architecture

```
src/
  app/            route segments; each page owns its own `metadata`
  components/     Button, Section, Photo, ImageSlot, Reveal, Logo, Nav,
                  Footer, Todo, MenuMarker, Hero, home/*
  content/        ALL data and copy. No Serbian prose inline in components.
    copy.ts       canonical captions, each with its Instagram shortcode
    business.ts   address, geo, hours, phone, price rules
    images.ts     typed image manifest — src, dims, alt, focal, maxRenderWidth
    menu.ts       food + drinks, transcribed from the printed cards
    events.ts     Matine events + upcoming/past helpers
    amenities.ts  amenity cards (descriptions are all TODO — unsourced)
    reviews.ts    ⚠ placeholder data only
    nav.ts        nav links
  lib/contrast.ts WCAG contrast maths, rendered live on /styleguide
scripts/          verification tooling — see ../CLAUDE.md
```

**Conventions**

- Copy comes from `content/`, never typed inline. Each export names its source.
- Images go through `<Photo id="...">`, never a raw path.
- Unsourced content renders `<Todo>` and gets an `OPEN_QUESTIONS.md` entry.
- `.tabular` on any numeric column.
- Motion: 150–300ms, and gated on `prefers-reduced-motion` **twice** — globally
  in `globals.css` and in JS inside `Reveal` / `Hero`.

---

## Decisions already made — don't relitigate

Full reasoning in `OPEN_QUESTIONS.md`. Summary:

- **Matine #1 is 18 July 2026**, not 18 June. `PRD.md` inherited a typo from a
  caption that was posted a month *after* the date it claims. The flyer is right.
- **"predivnim pogledom"** ships corrected; all 31 captions have "poglednom".
- **"Deca do 4 godine — besplatno"** ships on caption evidence, though it is
  absent from the printed card.
- **Booking counts people, not sunbeds.** Every paying guest occupies one
  sunbed so the two coincide; under-4s are free and take no sunbed.
- **"Golden Chicken Fingers"** ships corrected (card reads "ĆHICKEN").
- **Opening hours are 10:00–19:00** — captions, the graphic, and the Instagram
  bio all agree; one stray reel saying 20h is outvoted.
- **Fonts: Fraunces + Source Sans 3.** Diacritics verified against the actual
  woff2 files, `Đ` included.
- **Stitch export is ignored.** AI stock imagery, Material-3 palette, English.

---

## Still blocked on the owner

Nothing blocks building. These block *publishing*:

1. FAQ answers — all seven. Zero source.
2. Cancellation policy.
3. Amenity one-liners — six of them, never described in any caption.
4. Daily sunbed capacity.
5. Real reviews — nothing usable exists in the 35 posts.
6. Booking engine choice, domain.
7. A wide photograph showing the pool *with* the valley — would fix the hero.

A free Google Business Profile would fix the map pin, the JSON-LD `geo`, and
supply the real reviews in one move.

---

## Health check

Last run, after Phase 3:

```
npm run build          clean
/, /pricing, /menu     375 / 768 / 1024 / 1440 — no overflow, no console errors
reduced-motion         transitions >1ms: 0, no Reveal left faded
prices in HTML source  1.420 / 1.050 / 1.700 / 2.500 / 3.500 / Besplatno — all FOUND
```

That last line is the point of the whole project — PRD problem #3 was that
prices and the menu existed only as JPEGs. Re-check it after touching either page.
