# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Palma Pool Club
**Generated:** 2026-08-10 13:09:46
**Category:** Hotel/Hospitality

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#18181B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#27272A` | `--color-secondary` |
| Accent/CTA | `#F8FAFC` | `--color-accent` |
| Background | `#000000` | `--color-background` |
| Foreground | `#FAFAFA` | `--color-foreground` |
| Muted | `#181818` | `--color-muted` |
| Border | `#3F3F46` | `--color-border` |
| Destructive | `#EF4444` | `--color-destructive` |
| Ring | `#18181B` | `--color-ring` |

**Color Notes:** Pure black + white contrast

### Typography

- **Heading Font:** Playfair Display SC
- **Body Font:** Karla
- **Mood:** restaurant, menu, culinary, elegant, foodie, hospitality
- **Google Fonts:** [Playfair Display SC + Karla](https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700&family=Playfair+Display+SC:wght@400;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700&family=Playfair+Display+SC:wght@400;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #F8FAFC;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #18181B;
  border: 2px solid #18181B;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #000000;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #18181B;
  outline: none;
  box-shadow: 0 0 0 3px #18181B20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Liquid Glass

**Keywords:** Flowing glass, morphing, smooth transitions, fluid effects, translucent, animated blur, iridescent, chromatic aberration

**Best For:** Premium SaaS, high-end e-commerce, creative platforms, branding experiences, luxury portfolios

**Key Effects:** Morphing elements (SVG/CSS), fluid animations (400-600ms curves), dynamic blur (backdrop-filter), color transitions

### Page Pattern

**Pattern Name:** Hero-Centric + Social Proof

- **CTA Placement:** Above fold
- **Section Order:** Hero > Features > CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Poor photos
- ❌ Complex booking

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

---

# Brand Overrides

Everything above this line is generator output. Everything below **wins** where
the two conflict, per `BUILD_PROMPT.md` §1 ("the brand constraints in §2 win…
but you must write the deviation and the reason into MASTER.md").

This project has an unusually strong brand input: a real venue with its own
photography, its own printed price cards and its own DJ flyer artwork. The
generator was working from a generic "hotel/hospitality" category and could not
see any of it. Most of its visual output is therefore discarded.

## 1. Colour — REPLACED ENTIRELY

**Generator proposed:** pure black `#000000` background, `#18181B` primary,
`#F8FAFC` accent. "Pure black + white contrast."

**Rejected because:** the palette is not a free choice here. `BUILD_PROMPT.md`
§2 specifies colours sampled from the venue's own photographs — the actual
pool water, the actual limestone deck, the brand gold off their menus. A
monochrome scheme would describe a different business.

**Also:** the generator's own `.btn-primary` spec sets `background: #F8FAFC`
with `color: white` — white text on near-white. Unusable as written.

**Shipping instead** (`src/app/globals.css` `@theme`):

| Token | Value | Sampled from |
|---|---|---|
| `--color-pool` | `#1BA5C4` | pool water, midday drone shots |
| `--color-pool-deep` | `#0E6E86` | deep end / shadowed water |
| `--color-sand` | `#EDE4D6` | limestone pool deck |
| `--color-cream` | `#FAF6EF` | page background |
| `--color-teak` | `#B07B4B` | composite wood decking |
| `--color-brass` | `#C89B4A` | brand gold from menus & flyers |
| `--color-ink` | `#241C16` | body text |
| `--color-float-red` | `#D6362F` | mushroom float — punctuation accent only |

Night mode (`/events` only), taken off the real DJ flyers: `--color-night`
`#0B0906`, `--color-gold` `#C9A24B`, `--color-gold-bright` `#E8C877`,
`--color-night-text` `#F2EBDD`.

**Measured contrast** — computed, not estimated, and rendered live on
`/styleguide` so it cannot silently drift:

| Pair | Ratio | Body ≥4.5 | Large ≥3 |
|---|---|---|---|
| `ink` on `cream` | 15.56:1 | ✓ | ✓ |
| `ink` on `sand` | 13.31:1 | ✓ | ✓ |
| `ink` on `brass` (primary CTA) | 6.58:1 | ✓ | ✓ |
| muted `#6B5C4F` on `cream` | 5.96:1 | ✓ | ✓ |
| `cream` on `pool-deep` | 5.42:1 | ✓ | ✓ |
| `night-text` on `night` | 16.77:1 | ✓ | ✓ |
| `gold` on `night` | 8.29:1 | ✓ | ✓ |
| `gold-bright` on `night` | 12.27:1 | ✓ | ✓ |
| `night` on `gold-bright` (night CTA) | 12.27:1 | ✓ | ✓ |

**Three colours fail as text and are therefore restricted:**

- **`pool` `#1BA5C4` on `cream` — 2.70:1. Fails body AND large.** It is a
  water colour, not a text colour. Use it for fills, rules, icon strokes and
  graphic accents only. **Never for type on a light ground.** Where a teal
  *text* colour is wanted, use `pool-deep` `#0E6E86` (5.42:1).
- **`teak` `#B07B4B` on `cream` — 3.37:1.** Large text (≥24px) only.
- **`float-red` `#D6362F` on `cream` — 4.40:1.** Just short of body. Large
  text and graphic marks only — which matches its brief anyway: §2 says the
  mushroom-float red is "a punctuation accent only".

Note this means the night palette is comfortably the *safer* of the two. Gold
on near-black passes body text outright at 8.29:1, so `--color-gold-bright`
is not needed as a rescue for body copy — it is there for emphasis, and for
any small or thin type where 8.29:1 is cutting it fine.

## 2. Style — REJECTED

**Generator proposed:** "Liquid Glass" — translucent panels, animated blur,
`backdrop-filter`, iridescence, chromatic aberration. Its own rating for the
style: *Performance ⚠ Moderate-Poor, Accessibility ⚠ Text contrast.*

**Rejected because** `BUILD_PROMPT.md` §2 lists glassmorphism as an explicit
anti-pattern for this project, and the page must hit Lighthouse mobile ≥90
performance. Blur over photography would also fight the one genuine asset this
brand has — its aerial drone material.

**Shipping instead:** photography-led editorial layout. Large real photographs,
warm neutral ground, generous whitespace, motion limited to parallax and
staggered reveals.

## 3. Typography — REPLACED, and verified against the font binaries

**Generator proposed:** Playfair Display SC / Karla.

**Rejected because:** Playfair Display **SC** is a small-caps face — unusable
for the mixed-case Serbian headings this site needs. Karla is a grotesque, not
the humanist sans §2 calls for.

**Shipping instead:** **Fraunces** (display) + **Source Sans 3** (body), both
self-hosted via `next/font` with the `latin-ext` subset.

Fraunces was chosen over Playfair Display because its `SOFT` axis rounds the
terminals — warm, which suits sun-and-water, where Playfair's high-contrast
Didone feel is cold and fashion-led.

**Verified by reading the actual downloaded woff2 files**
(`scripts/check-fonts.mjs`, `scripts/check-digits.mjs`), not by assumption:

- **Serbian diacritics: PASS.** All of `č ć ž š đ Č Ć Ž Š Đ` are real glyphs in
  both faces. `Đ` U+0110 specifically confirmed present — §2 warns that several
  otherwise-good Google fonts drop it.
- **Tabular figures: `tnum` is ABSENT from both faces.** Google's build of
  Source Sans 3 ships `pnum` but no `tnum`, so
  `font-variant-numeric: tabular-nums` is a **no-op** here.
- **It does not matter, because Source Sans 3's default figures are already
  tabular** — measured: all ten digits advance exactly `472/1000em`. Price
  columns align with no feature settings at all. Never apply `pnum`.
- **Fraunces digits are proportional** — measured: 9 distinct widths across the
  ten digits (512–731/1000em). **Never set a price, a time or any numeric
  column in the display face.** Numerals always go in the sans.

Re-run both scripts after any font change. They need a `npm run build` first,
since they read `.next/static/media`.

## 4. Page pattern — PARTIALLY REJECTED

**Generator proposed:** Hero → Features → CTA, "Hero-Centric + Social Proof".

**Kept:** hero-first with the CTA above the fold.

**Rejected:** the three-section shape. `PRD.md` §5 chose a multi-page site
specifically so `/pricing` and `/menu` each get an indexable URL — that is the
fix for problem #3, pricing and menu currently being trapped in JPEGs. Home
follows `BUILD_PROMPT.md` §9 Phase 2 instead: hero, quick facts, amenities,
pricing teaser, gallery teaser, Matine teaser, reviews, map.

**"Social proof" carries a caveat:** no real reviews exist. Nothing usable
appears anywhere in the 35 scraped Instagram posts. The reviews component ships
with visibly-labelled placeholder data. See `OPEN_QUESTIONS.md` #8.

## 5. Motion — STRENGTHENED

**Generator proposed:** 400–600ms fluid curves.

**Overridden to 150–300ms ease-out** per §2, which is also what the generator's
own pre-delivery checklist demands — its style recommendation contradicted its
own checklist.

Required: parallax on hero imagery, staggered scroll reveals, hover states that
*move* (lift + 1.02 scale + shadow). Every one gated behind
`prefers-reduced-motion: reduce` — enforced twice, in `globals.css` globally
and in `Reveal.tsx` in JS, so a reduced-motion user never even starts an
observer.

### One documented exception: the burger → ✕ morph, 450ms

`.burger` in `globals.css` runs at **450ms**, outside the band above. Owner-
approved after reviewing it at 300ms and finding it too fast to read.

The reason it needs longer than anything else on the site: it is not a state
change, it is a **three-phase movement** — the bars shrink to dots and spread
onto a diagonal, the dots rotate into that diagonal, then they grow out along
it into the cross. Compressed into 300ms each phase gets 100ms and the whole
thing reads as a flicker; the shape of the motion, which is the entire point,
is lost.

The 150–300ms band still governs **everything else**. This is the only
exception, it applies to one 22px icon, and it is still a transform-only
animation gated by the global reduced-motion rule — under
`prefers-reduced-motion` it collapses to an instant swap.

Do not read this as licence to slow other motion down. If a second exception
is ever wanted, it gets written here too, with its own reason.

## 6. Dark mode — FORBIDDEN

Night mode is a **per-page brand decision** (`data-mode="night"` on `/events`),
not a user preference. There is no toggle and no `prefers-color-scheme`
switching anywhere. Each page has exactly one fixed look. The
`prefers-color-scheme` block that `create-next-app` scaffolds into
`globals.css` was removed.

## 7. Additional anti-patterns for this project

Beyond the generator's list, reject on sight: purple/pink AI gradients ·
glassmorphism · neon · generic resort stock photography · a centred hero with a
full-bleed gradient wash swallowing the photo · carousel as the primary gallery
pattern · emoji as UI icons (emoji is allowed only inside quoted marketing
copy, e.g. the brand's own `☀️🌴`).

## 8. Two hard project rules the generator has no concept of

1. **No invented content.** Every price, date, phone number and line of Serbian
   prose traces to `src/content/copy.ts` (scraped captions), a menu/pricing/
   flyer card, or a visible `TODO:` logged in `OPEN_QUESTIONS.md`.
2. **No stock or AI imagery, ever.** All photography is the venue's own, routed
   through the typed manifest in `src/content/images.ts`. A slot with no real
   photo renders `<ImageSlot>` — a visible warm-sand block printing its slot
   ID. Never a gradient, never Unsplash.

## 9. Photography constraint the generator could not know

Its anti-pattern list says "❌ Poor photos". Agreed in principle, but the real
set is thin and the layout has to survive it:

- 5 tall drone shots at 941×1670 — the only images strong enough for full-width
- 4 landscape shots at **~511×290** — video frame grabs, small tiles only
- **zero** dusk, night, DJ-booth or crowd photography

Consequences, enforced via `maxRenderWidth` in `src/content/images.ts`: no
gallery hero row, no full-bleed landscape, and the `/events` photo strip is
flyers plus `<ImageSlot>`. See `OPEN_QUESTIONS.md` #10.
