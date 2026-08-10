# Palma Pool Club — project context

**This file loads automatically at the start of every session.**

## Do this before writing any code

The build is handed off between sessions, so assume you know nothing about the
current state until you have read these:

1. **`site/PROGRESS.md`** — imported below, so it is already in context. It says
   which phase is next and what that phase needs to know.
2. **`site/OPEN_QUESTIONS.md`** — read it. Numbered entries are stable IDs
   referenced from code comments. Check it before asking the owner anything or
   "fixing" something that was already decided deliberately.
3. **`site/design-system/palma-pool-club/MASTER.md`** — read the
   `## Brand Overrides` section at the bottom. It supersedes everything above it.
4. If the phase has a page override in
   `site/design-system/palma-pool-club/pages/`, read that too — it beats MASTER.
5. Start the dev server (`cd site && npm run dev`) — the verification scripts
   need it.

Then work the phase, and **stop at the end of it and show the result**
(`BUILD_PROMPT.md` §9). Do not build several pages before the owner has seen one.

@site/PROGRESS.md

Building a production website for Palma Pool Club — a seasonal outdoor pool
venue on Kosmaj, ~30 min from Belgrade. The business has no website; its only
online presence is Instagram (@palmapoolclub, 3,490 followers).

---

## Where everything is

| Path | What |
|---|---|
| `site/` | **The Next.js app.** All build work happens here. Vercel root = `site/`. |
| `site/PROGRESS.md` | **Phase-by-phase status. Read this second.** |
| `site/OPEN_QUESTIONS.md` | Every unresolved question + every decision already made. Check before asking the owner anything. |
| `site/design-system/palma-pool-club/MASTER.md` | Design system. The `## Brand Overrides` section at the bottom is the real source of truth. |
| `site/design-system/palma-pool-club/pages/events.md` | Overrides MASTER.md for `/events`. |
| `PRD.md` | Original product brief. **Contains two known errors** — see OPEN_QUESTIONS #12, #15. |
| `BUILD_PROMPT.md` | The build spec. §5/§6 content is verified accurate. |
| `instagram_raw/post_log.json` | 35 scraped posts — the canonical source for all Serbian copy. |
| `selected/`, `*.png` in root | Source photography and the menu/price cards. Reference only, not shipped. |
| `stitch_exported/` | Abandoned Stitch mockups. **Ignore entirely.** |

---

## Hard rules — these are not style preferences

1. **Never invent content.** Every price, date, phone number and line of Serbian
   prose must trace to `src/content/copy.ts` (scraped captions), a menu/price/
   flyer card, or a visible `<Todo>` logged in `OPEN_QUESTIONS.md`. A
   plausible-sounding guess is the worst possible outcome here.
2. **Never use stock or AI imagery.** All photography is the venue's own,
   routed through `src/content/images.ts`. A slot with no photo renders
   `<ImageSlot>` — a visible warm-sand block. Never a gradient, never Unsplash.
3. **Serbian only** (Latin script), matching their voice: short, sunny, direct.
4. **No emoji as UI icons.** Lucide SVG only. Emoji is allowed *inside quoted
   marketing copy* (their own `☀️🌴`).
5. **Prices and numerals always in the sans, never the display face.** Measured:
   Fraunces digits are proportional (9 distinct widths); Source Sans 3 digits
   are tabular by default (all ten at 472/1000em).
6. **No dark-mode toggle, no `prefers-color-scheme`.** Night mode is a
   per-page brand decision via `data-mode="night"`, used only on `/events`.

---

## Verify by running, not by reading

There is a headless browser installed. **Use it** — it has caught real bugs
that were invisible in code review (an 11px logo, a gallery grid with holes, a
collapsed card, a hero scrim crushing the subject).

```bash
cd site
npm run dev                      # must be running for the scripts below

node scripts/shoot.mjs / /menu   # screenshots at 375/768/1024/1440,
                                 # + overflow detection + reduced-motion check
node scripts/shoot-sections.mjs / 1440   # per-section shots, legible
node scripts/zoom.mjs / "h1" out.png     # 4x detail crop
node scripts/check-map.mjs       # confirms the map pins the venue
node scripts/check-fonts.mjs     # diacritics + OpenType features (needs a build)
node scripts/check-digits.mjs    # proves digit widths are tabular
node scripts/import-images.mjs   # converts new source photos into public/images
```

Then **look at the PNG** in `site/screenshots/` with the Read tool. Do not
report a page as done without having seen it.

---

## Gotchas already paid for

- **Next.js 16 + Tailwind v4.** Tokens live in `@theme` inside
  `src/app/globals.css`. There is **no `tailwind.config.js`**.
- **Lucide has removed all brand icons.** No `Instagram` export exists — see
  `src/components/icons/InstagramIcon.tsx`.
- **`python3` and `python` on this machine hit the Microsoft Store stub and
  fail.** Use `py -3`.
- **Embed maps by lat/lng, never by the address string.** "Kralja Petra Prvog
  BB" is *bez broja* and geocodes to a road midpoint with no pin, showing a
  neighbouring hotel instead. Coordinates are in `business.geo`.
- **`Section` takes `className` (outer) and `innerClassName` (content).**
  Layout classes passed to `className` silently do nothing to the children.
- **Cell shape must follow source orientation.** The photo set spans 0.56
  portrait to 1.80 landscape. Forcing a portrait into a wide cell produces a
  meaningless letterboxed slice. Every image carries a `focal` object-position.
- **The four `511×290` images are video frame grabs.** Never render them wider
  than ~511px — check `maxRenderWidth` in the manifest.

---

## Working style that has worked here

- Verify claims instead of asserting them. The font, contrast and digit-width
  facts in this project were all *measured*, and two of the initial assumptions
  were wrong.
- Stop at each phase and show the result. `BUILD_PROMPT.md` §9 asks for this.
- When a visual judgment call comes up, render the options and let the owner
  choose rather than guessing. Guessing cost several rounds on the hero.
