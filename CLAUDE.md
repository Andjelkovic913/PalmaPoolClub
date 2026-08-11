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

**One git repository, rooted here** — not in `site/`. The research material is
versioned alongside the app because it cannot be reconstructed if lost: these
are the venue's only copies of its photography, the scraped captions that are
the source of every Serbian sentence on the site, and the price and menu cards
that all typed pricing derives from.

On Vercel, set **Root Directory = `site`**.

Not versioned: `stitch_exported/` (abandoned mockups) and `.claude/` (a tool
install — regenerate with `npm i -g ui-ux-pro-max-cli && uipro init --ai claude`).

| Path | What |
|---|---|
| `site/` | **The Next.js app.** All build work happens here. |
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

   **One authorised exception: three `/faq` answers are DRAFTED**, on the
   owner's explicit instruction, rather than shown as `<Todo>`. Do not revert
   them and do not extend the exception anywhere else. They carry
   `verified: false` in `src/content/faq.ts`, `scripts/check-faq.mjs` reports
   them, and `OPEN_QUESTIONS.md` #2 tracks them. Even inside that exception a
   drafted answer must never state a commercial term — no refund, deadline or
   cancellation window. The check script fails the build on such wording.
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
node scripts/check-lightbox.mjs  # /gallery viewer: focus trap, Esc, arrows,
                                 # wrap, scroll lock, focus restore — 16 checks
node scripts/check-faq.mjs       # which FAQ answers are sourced vs DRAFTED;
                                 # fails if a draft states a commercial term
node scripts/check-menu.mjs      # both menu cards present in the RAW HTML +
                                 # ARIA tab keyboard pattern — 24 checks
node scripts/check-price.mjs     # /book prices, through the real form
node scripts/check-image-scale.mjs  # no photo rendered beyond maxRenderWidth,
                                 # measured at 375/768/1440 incl. phone DPR

node scripts/check-db.mjs        # diagnoses .env.local, the connection, the
                                 # tables and RLS — run BEFORE drizzle-kit
node scripts/check-admin.mjs     # /admin stays locked and every action gates

# These three need NO server and NO credentials:
node scripts/check-availability.mjs  # capacity + next-free-date — 24 checks
node scripts/check-validate.mjs      # server-side input rules — 37 checks
node scripts/check-emails.mjs        # not an open relay, no commercial terms
node scripts/seed-bookings.mjs       # test days in the DB (needs DATABASE_URL)
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
- **Run the verification scripts from PowerShell, not Git Bash.** Git Bash
  converts a leading-slash argument to a Windows path, so
  `node scripts/shoot.mjs /events` navigates to
  `http://localhost:3000C:/Program Files/Git/events` and throws.
- **`shoot.mjs` wipes `screenshots/` on every run.** Pass every route you want
  to compare in one invocation, not one call per page.
- **Night mode reaches Nav and Footer through CSS, not JS.** Only the root
  layout renders `<html>`, so a page sets `data-mode="night"` on its own
  `<main>` and `:root:has(main[data-mode="night"]) body` in `globals.css`
  redefines the tokens one level up, from where they inherit into the chrome.
  The selector requires `main` on purpose — that is what stops a night
  *section* (the home page's Matine teaser) from dragging the whole site dark.
- **Embed maps by lat/lng, never by the address string.** "Kralja Petra Prvog
  BB" is *bez broja* and geocodes to a road midpoint with no pin, showing a
  neighbouring hotel instead. Coordinates are in `business.geo`.
- **`Section` takes `className` (outer) and `innerClassName` (content).**
  Layout classes passed to `className` silently do nothing to the children.
- **Cell shape must follow source orientation.** The photo set spans 0.56
  portrait to 1.80 landscape. Forcing a portrait into a wide cell produces a
  meaningless letterboxed slice. Every image carries a `focal` object-position.
- **The four `511×290` images are video frame grabs.** Never render them wider
  than ~511px — check `maxRenderWidth` in the manifest. **`node
  scripts/check-image-scale.mjs` now enforces this**, because the warning alone
  did not: `/pricing` shipped one at `100vw`, which on a phone meant 670 device
  pixels from a 511px source. The `sizes` attribute is where this hides — CSS
  reading `100vw` does not look like an upscale in review.
- **Dim things with colour, never `opacity`.** `shoot.mjs` counts any element
  below opacity 0.99 as a possibly-unfired `<Reveal>`, so a decorative fade
  parks itself in that check permanently as false noise.
- **`/menu`'s tabs hide a panel, they never unmount it.** Both cards must stay
  in the server-rendered HTML — conditionally rendering one would take the
  drinks card out of the source and out of the index, which is exactly the
  problem this project exists to fix. `scripts/check-menu.mjs` guards it.
- **`bg-surface` is the Footer's colour.** A page section that ends on
  `bg-surface` runs into the footer with no visible edge. This already had to
  be undone once on `/menu`.
- **Telephone bookings must be entered on `/admin`.** The venue takes them by
  phone and the database cannot see them; until they are recorded, the capacity
  figure is half the truth and the site will accept guests for a full day. The
  transaction lock only orders concurrent *online* requests.
- **Every `/admin` server action calls `requireAdmin()` as its first line.** A
  server action is a public HTTP endpoint — the login screen hides the button,
  not the endpoint. `scripts/check-admin.mjs` fails the build otherwise.
- **`/book` writes to a real database. Read `site/SETUP.md` before touching
  it.** Four things there are load-bearing and easy to undo by accident:
  `DATABASE_URL` must be Supabase's **session** pooler (5432 — the transaction
  pooler drops the `FOR UPDATE` lock mid-transaction); pending bookings hold a
  sunbed; the owner's decision link opens a page and decides on POST (mail
  scanners prefetch links); and the migration enables RLS **with no policies**,
  which is what keeps the public anon key from reading every guest's phone and
  email.
- **`lib/price.ts`, `lib/availability.ts` and `lib/validate.ts` have no
  imports, on purpose.** There is no Postgres on this machine, so the three
  modules where a mistake costs money are pure and their check scripts load
  them directly (Node strips the types). Adding an import breaks the test —
  pass config in as an argument instead.

---

## Working style that has worked here

- Verify claims instead of asserting them. The font, contrast and digit-width
  facts in this project were all *measured*, and two of the initial assumptions
  were wrong.
- Stop at each phase and show the result. `BUILD_PROMPT.md` §9 asks for this.
- When a visual judgment call comes up, render the options and let the owner
  choose rather than guessing. Guessing cost several rounds on the hero.
