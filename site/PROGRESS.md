# Build progress

**Last updated:** 10 Aug 2026, after Phase 5.

Read `../CLAUDE.md` first for the rules, then this for where things stand.
Phases follow `../BUILD_PROMPT.md` §9.

**Git:** one repository, rooted at the parent (`PalmaPoolClub/`), not here.
Commit from there, not from `site/`. Vercel Root Directory = `site`.
Last commit: `56ffd75` — phases 0–3, 166 files.

---

## Status

| Phase | Scope | State |
|---|---|---|
| 0 | Scaffold, images, `copy.ts`, `OPEN_QUESTIONS.md` | ✅ done |
| 1 | Design system, tokens, fonts, primitives, nav/footer, `/styleguide` | ✅ done |
| 2 | Home `/` | ✅ done — **hero unresolved, see #18** |
| 3 | `/pricing` and `/menu` | ✅ done — `/menu` revised, see below |
| 4 | `/events` — night mode | ✅ done |
| 5 | `/gallery` — masonry + accessible lightbox | ✅ done |
| 6 | `/faq` and `/location` | ✅ done |
| 7 | `/book` — price calculator + widget boundary | ✅ done |
| 8 | SEO, JSON-LD, sitemap, a11y sweep, acceptance checklist | ⬜ **next** |
| — | Revisit the hero (`OPEN_QUESTIONS.md` #18) | ⬜ |

`<PagePlaceholder>` is no longer used by any route. Every page is real.

---

## What Phase 7 settled — READ BEFORE TOUCHING `/book`

**`/book` is a real booking system.** Owner-directed, after an earlier phone-
handoff version was built and reviewed. **Read `site/SETUP.md` first** — it is
the only part of the site that needs credentials.

```
Supabase Postgres (Drizzle)  ·  Resend  ·  Next server actions
```

**Flow:** guest submits → server validates → **re-prices on the server** →
transaction locks the day, sums holdings, compares to capacity → either
`pending` (venue emailed a decision link, guest emailed "zahtev primljen") or
refused on the spot with the next free date. The owner opens the link, presses
Prihvati/Odbij, and the guest gets the final answer by email.

**Six things that are load-bearing. Do not undo any of them:**

1. **Capacity is 40/day** (`src/content/booking.ts`) — owner-confirmed, closes
   #5. Per-date overrides live in `day_capacity`; a row of `0` means CLOSED.
2. **`pending` holds a sunbed.** Otherwise the venue accepts more requests than
   it has beds and finds out at approval time, after telling everyone yes.
3. **`SELECT … FOR UPDATE` on the day row**, inside the transaction. Without it
   two simultaneous requests both read "2 free" and 42 people arrive to 40 beds.
   This is why `DATABASE_URL` must be the **session** pooler (5432), never the
   transaction pooler (6543) — the latter drops the lock mid-transaction.
4. **The price is recomputed server-side.** The browser displays a price; it
   never sets one. `validateBooking()` does not even read a client total.
5. **The decision link opens a PAGE; the decision is a POST.** Gmail, Outlook
   and Safe Links prefetch URLs to scan them — a GET that confirmed a booking
   would be triggered by the scanner, not the owner.
6. **RLS is enabled with no policies** (in the migration). Supabase exposes
   `public` tables through PostgREST and the anon key is public; without this,
   that key reads every guest's name, phone and email. The app connects as
   `postgres`, which bypasses RLS. **The absence of policies is the lock.**

**No email ever states a commercial term** — no refund, deadline or guarantee.
#3 is still open and the guest keeps the email. `check-emails.mjs` fails on it.

### `/admin` — the owner console, and why it is not optional

The venue has always taken bookings **by telephone**. Those never reached the
database, so the capacity figure was only half the truth: the site could read
"28 of 40" while the real number was 38, and cheerfully accept twelve more
guests. The transaction lock protects against two *online* requests racing —
it knows nothing about a paper notebook.

`/admin` closes that. For any date the owner sees the load, the full booking
list (marked online vs phone), and can enter a phone booking, change that day's
capacity (`0` = closed), or cancel a booking to free the sunbeds.

- **Phone bookings go through the same locked transaction** and are priced by
  the same `priceFor()` — a phone guest and a web guest are never quoted
  different numbers, and a phone entry racing a web request cannot together
  exceed capacity.
- **Phone rows are inserted `confirmed`**, not `pending`: the owner agreed them
  on the call, there is nothing to approve.
- **Auth is one password** (`OWNER_PASSWORD`) with an HMAC-signed httpOnly
  cookie. **Unset password = nobody gets in**, never the reverse.
- **Every server action calls `requireAdmin()` first.** An action is a public
  HTTP endpoint; hiding its button is not access control.
  `scripts/check-admin.mjs` asserts all of this — 14 checks.

The owner's email and the decision page both state the day's load, so the
approve/reject click never requires opening Supabase.

**Four pricing rules were confirmed by the owner, not read off a card:**

| Rule | Decision |
|---|---|
| What counts as weekend | **Saturday + Sunday.** Friday is a weekday rate. |
| Half-day 50% on the child rate | **Yes** — Sat afternoon child = 1.750 × 0,5 = **875** |
| Cancellation at point of booking | Same line as the FAQ — routes to the phone, states no terms |
| Daily capacity | **40 sunbeds** |

The first two appear on no printed material. `src/lib/price.ts` marks which
figures are printed and which are derived — keep that comment.

**`src/lib/price.ts`, `availability.ts` and `validate.ts` are import-free on
purpose.** There is no Postgres on the build machine, so the three modules
where being wrong costs real money are pure and loaded directly by their check
scripts (Node strips the types). **Adding an import to any of them breaks its
test** — pass config in instead.

**`priceFor()` is deliberately isolated** in `src/lib/price.ts`. It is the only
code on the site producing a number a guest pays against.
`scripts/check-price.mjs` drives the **real form in a browser** (not the
exported function — a correct function wired to the wrong input is still
wrong): 10 pricing cases, the disabled/empty states, the no-false-confirmation
assertions, and a full Tab path through every field. **30 assertions.**

**Date parsing gotcha, already paid for:** `isWeekendDate()` splits the
`YYYY-MM-DD` string by hand instead of `new Date(iso)`, which parses as UTC
midnight — in any timezone behind UTC `getDay()` returns the previous day and
would bill a Saturday at the weekday rate.

**`<BookingWidget>` is still the swap point** if a third-party engine ever
replaces this. `src/app/book/page.tsx` does not change either way.

**Matine tickets are driven by `upcomingEvents()`** — the ticket-type control
does not render at all while no event is upcoming, so the site can never sell
a ticket to an event that does not exist. Both known dates are past, so it is
absent today.

**Without `DATABASE_URL` the page still works** — it prices correctly and tells
the guest reservations are unavailable, pointing at the phone. Asserted in
`check-price.mjs`, which runs in exactly that state on this machine.

⚠️ **Not verified end-to-end.** There is no Postgres or Docker here, so the
transaction, the emails and the owner decision page have never run against a
real database. The pure logic is proven (24 + 37 + 19 assertions), the wiring
is not. **Follow SETUP.md, run `node scripts/seed-bookings.mjs`, and walk the
three cases it prints before trusting this with a guest.**

---

## `/menu` revision — food/drinks tabs

Two things, asked for after Phase 6.

**The colour clash is fixed structurally.** The drinks card used to sit on
`bg-surface` — the same sand as the Footer — so the bottom of the menu ran
straight into the footer with no edge. Both cards now live in ONE `<Section>`
on the food card's cream ground, and the footer reads as a separate band again.
Don't reintroduce a background on either panel.

**⚠️ BOTH PANELS MUST STAY IN THE DOM.** `MenuTabs` hides the inactive panel
with the `hidden` attribute and **never unmounts it**. `PRD.md` problem #3 is
that this venue's menu and prices exist only as JPEGs; conditionally rendering
one panel would strip the drinks card out of the HTML source and out of the
index — silently undoing the point of the project. `scripts/check-menu.mjs`
asserts this against the **raw** server response, before any JS runs, so the
regression cannot hide behind hydration.

Also verified there: full ARIA tab pattern (roving tabindex, arrows move and
follow focus, Home/End, `aria-selected`), and that a hidden panel really leaves
the accessibility tree while keeping its prices in the DOM. **24 assertions.**

**It survives without JavaScript.** The server renders the drinks panel already
`hidden`, so there is no hydration flash and no layout shift; a `<noscript>`
rule un-hides both panels and drops the tabs. The page a guest is most likely
to open on a bad mobile connection stays complete either way.

**Known, not fixed:** the `/menu` header uses `lg:items-end`, which bottom-aligns
the heading against a 4:3 photo and leaves visible dead space above it at
≥1024px. Pre-existing, unrelated to the tabs, and a judgment call — raise it
with the owner rather than silently restyling.

---

## What Phase 6 settled — READ THIS BEFORE TOUCHING `/faq`

**The FAQ contains three DRAFTED answers. This is a deliberate exception to
hard rule 1, made by the owner, not a lapse.**

The owner's first proposal was to stand up PostgreSQL and seed the FAQ with
invented data. That was argued against — a `<Todo>` badge shouts, a seeded row
looks like content, and these seven answers are operational commitments a guest
quotes back when asking for money. The owner then instructed that the answers
be written anyway. Their call; it is their business.

What the review DID change: on checking sources, **four of the seven answer
from verified material**, so only three are drafted. See `OPEN_QUESTIONS.md` #2
for the table.

**The one line the drafts do not cross.** A drafted answer may describe, but it
must never state a commercial term. "Šta ako pada kiša" and "Kako funkcioniše
otkazivanje" therefore route to the phone instead of inventing a refund window.
`PRD.md` §8's "free cancellation up to 24h before" is an example in the brief,
**not a policy**, and must never be published as fact — #3 is still open.

**`scripts/check-faq.mjs` enforces this.** It prints which answers are sourced
and which are drafted, and **exits non-zero** if a drafted answer ever contains
refund / deadline / guarantee wording. Run it before launch. Provenance also
lives in the data as a `verified` flag on every item in `src/content/faq.ts` —
do not drop that field to tidy the type.

**Get the owner to confirm all three wordings before the site goes live.**

`/location` needed no such compromise — everything on it was already sourced.
The map is embedded by lat/lng (never the "BB" address — see #16) and verified
with `node scripts/check-map.mjs /location`.

---

## What Phase 5 settled — read before touching `/gallery`

**SHIPPING: uniform cropped grid, 12 photographs, no groups.**
`<GalleryGrid groups={gallerySingle} layout="grid" />`. Three layouts were
built and compared on screen before this was chosen:

| | 1440 | 375 | |
|---|---|---|---|
| 3 groups, masonry | 5304px | 9290px | 19 cells, 5 empty |
| 1 section, masonry | 3814px | 7247px | 14, nothing cropped |
| **1 section, cropped grid** | **2080px** | **2228px** | **12, uniform 3:2** |

`GalleryGrid` supports both `layout="masonry"` (CSS columns, natural aspect
ratios) and `layout="grid"` (uniform 3:2 cells, `object-cover` aimed by the
manifest's `focal`). Both are live code; switching is one prop.

**What the crop costs, measured on the real files** — fraction of frame kept in
a 3:2 cell: 0.56 drone shots **37%**, 0.75–0.80 **50–53%**, 1.74–1.80 **86%**.
Photographs survive it: the subject is central and `focal` aims every cell.

**The two flyers do NOT survive it, which is why they are not in the gallery.**
Cropping `flyer-byedov` to 3:2 leaves "DJ BYEDOV / SUBOTA 18. JUL" and throws
away the set time, the phone number and both slogans — roughly half the
poster's information. A poster is a document, not a texture. Both flyers
already appear uncropped at full height on `/events`. Gallery = photographs,
`/events` = artwork.

**12 is load-bearing.** It divides exactly by 2, 3 and 4, so there is no ragged
last row at any breakpoint. Adding or removing one photograph brings the rag
back — legal, but look at it before shipping.

In masonry mode, column width tops out around 390px at 1440; in grid mode a
cell is ~290px at 1440. Both keep the four 511px frame grabs under
`maxRenderWidth`. **Re-check that before changing the column counts.** In
masonry mode each child must carry `break-inside-avoid` or a tall photo splits
across a column boundary.

**Grouping is dropped for now, not rejected.** `galleryGroups` (Bazen & Pogled
/ Sadržaji & Hrana / Matine Žurke, per `BUILD_PROMPT.md` §9) stays in
`src/content/gallery.ts`, fully working. It cannot ship yet: five of its
nineteen cells are `<ImageSlot>`, and all five fall in the two groups meant to
sell the venue. Short groups also give the layout nothing to balance.

The trigger is recorded in `OPEN_QUESTIONS.md` #10 — when photos of the
billiards table, the table tennis, the parking and one Matine night arrive,
switch `src/app/gallery/page.tsx` back to `galleryGroups`.

Where an empty slot IS shown (in the grouped layout, and on `/events`) it is
**not** wrapped in a button — there is nothing to enlarge. No photograph is
ever moved into a group it doesn't belong to in order to pad it out.

**Lightbox focus contract.** Focus returns to the thumbnail of the image being
*viewed*, which equals the invoking element only if the arrow keys were never
used. The usual "restore to invoker" rule would fight the visitor after they
arrow from image 3 to 14 — focus would disagree with the viewport and scroll
the page back up. Both directions are asserted in `scripts/check-lightbox.mjs`.

**`scripts/check-lightbox.mjs` is new.** It exercises what no screenshot can
show — focus movement, the Tab trap in both directions, Esc, arrow stepping,
wrap-around, scroll lock, focus restoration, and that no empty slot is
clickable. 16 assertions. Run it after touching the gallery or the lightbox.

---

## What Phase 4 settled — read before touching `/events`

**Night mode reaches the chrome via CSS, not JS.** Only the root layout renders
`<html>` (Next 16), so a route segment cannot flip `data-mode` on it. The page
declares `data-mode="night"` on its own `<main>`, and one rule in `globals.css`
redefines the tokens on `<body>`:

```css
[data-mode="night"],
:root:has(main[data-mode="night"]) body { … }
```

From `<body>` they inherit into Nav, main and Footer at once. Nav and Footer
needed **no** changes — both already used only semantic tokens. Verified: no
leak onto `/`, `/pricing` or `/menu`, and the night *section* inside the day
home page still works, because the selector requires `main`.

**The empty state is what ships.** Both Matine dates are past, so
`upcomingEvents()` is empty and the page leads with `emptyStateCopy` plus two
real actions — Instagram (where the next date gets announced) and the phone
number. There is no "Rezerviši kartu" button while nothing is on sale; that
branch exists in the JSX and lights up the moment a future date is added to
`src/content/events.ts`. Adding a date is a data edit, nothing more.

**"Šta je Matine?" is facts, not prose.** No caption, flyer or card has ever
described the event, so the section states only verbatim announcement facts —
price, `ticketNote`, `first.note`, opening hours. **Zero `<Todo>` on this page.**
Do not "improve" it with a descriptive sentence.

**Dates and times never take the display face.** `EventCard`'s heading is the
sans, deliberately — `displayDate` carries a day number and a year, and
Fraunces figures are proportional. Weight and size carry the heading instead.

**Dim with colour, not `opacity`.** The archive cards use `text-text-muted` and
a lighter border rather than `opacity-80`, because `scripts/shoot.mjs` counts
anything below opacity 0.99 as a possibly-unfired `<Reveal>`. A decorative fade
sits in that count forever as false noise.

**Placeholders are now mode-aware.** `<ImageSlot>` and `<Todo>` carry
`image-slot` / `todo-marker` styling hooks that `globals.css` uses to keep them
legible on black — dark ground, gold dashed border, and Todo's text bumped to
`night-text` because float-red is only ~3.8:1 there. Day rendering unchanged.
Keep those class names when editing either component.

Contrast measured on black: body `#F2EBDD` 16.77:1, `gold` 8.29:1,
`gold-bright` 12.27:1. `BUILD_PROMPT.md` §9 says to "bump to gold-bright where
it fails" — plain gold does **not** fail. Footer's `teak` icons were checked at
4× and read fine on `#141009`; they are decorative and were left alone.

There is still **no night photography of this venue**. The photo strip is the
two real flyers plus two `<ImageSlot>`s, whose manifest dimensions were set to
1100×1400 so the strip does not mix tall posters with stubby 3:2 boxes. Do not
darken a daytime photo to fake it (OPEN_QUESTIONS.md #10).

---

## Architecture

```
src/
  app/            route segments; each page owns its own `metadata`
  components/     Button, Section, Photo, ImageSlot, Reveal, Logo, Nav,
                  Footer, Todo, MenuMarker, Hero, home/*, events/EventCard,
                  gallery/{GalleryGrid,Lightbox}
  content/        ALL data and copy. No Serbian prose inline in components.
    copy.ts       canonical captions, each with its Instagram shortcode
    business.ts   address, geo, hours, phone, price rules
    images.ts     typed image manifest — src, dims, alt, focal, maxRenderWidth
    menu.ts       food + drinks, transcribed from the printed cards
    events.ts     Matine events + upcoming/past helpers
    gallery.ts    gallery groups + the flat real-photo list the lightbox walks
    faq.ts        7 Q&A, each carrying a `verified` flag — 4 sourced, 3 drafted
    amenities.ts  amenity cards (descriptions are all TODO — unsourced)
    reviews.ts    ⚠ placeholder data only
    nav.ts        nav links
  db/             schema, client, and the booking transaction (Supabase)
  lib/contrast.ts WCAG contrast maths, rendered live on /styleguide
  lib/price.ts    priceFor() — the ONLY money maths. Printed vs derived
                  figures are marked in the comment; keep it.
  lib/availability.ts  capacity + next-free-date. Import-free — see above.
  lib/validate.ts server-side input rules. Import-free — see above.
  lib/email.ts    Resend. Never mails anyone but the guest and OWNER_EMAIL.
drizzle/          committed SQL migration, incl. the RLS lockdown
SETUP.md          the only setup that needs credentials. Read before /book.
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

1. **Confirm the three drafted FAQ answers** — *šta da ponesem*, *šta ako pada
   kiša*, *otkazivanje*. They are live on `/faq`; run `node scripts/check-faq.mjs`
   to print them.
2. Cancellation policy — a real one, with terms. The drafted FAQ answer only
   asks the guest to call, and `/book` (Phase 7) needs something concrete at
   the point of payment.
3. Amenity one-liners — six of them, never described in any caption.
   Four ordinary phone photos (billiards, table tennis, parking, one Matine
   night) would also restore the grouped `/gallery` layout — OPEN_QUESTIONS #10.
4. Daily sunbed capacity.
5. Real reviews — nothing usable exists in the 35 posts.
6. Booking engine choice, domain.
7. A wide photograph showing the pool *with* the valley — would fix the hero.

A free Google Business Profile would fix the map pin, the JSON-LD `geo`, and
supply the real reviews in one move.

---

## Health check

Last run, after Phase 5:

```
npm run build              clean, 12 static routes
eslint (new files)         clean — see the pre-existing failures noted below
all 8 built routes          375 / 768 / 1024 / 1440 — no overflow, no console errors
reduced-motion             transitions >1ms: 0, elements still faded: 0 everywhere
check-lightbox.mjs         16/16 (count-agnostic — it derives N from the page)
check-faq.mjs              4 sourced / 3 drafted, no commercial terms — PASS
check-menu.mjs             24/24 — both menu cards in the RAW HTML, tabs
                           keyboard-operable, hidden panel keeps its prices
check-price.mjs            32/32 — 10 pricing cases through the real form,
                           disabled states, no false confirmation, Tab path,
                           honeypot, graceful degradation with no database
check-availability.mjs     24/24 — capacity + next-free-date, no DB needed
check-validate.mjs         37/37 — server-side input rules, no DB needed
check-emails.mjs           19/19 — not an open relay, states no commercial terms
check-admin.mjs            14/14 — /admin locked, actions gated, prices server-side
check-image-scale.mjs      99 placements across 7 routes — none upscaled
npx tsc --noEmit           clean
check-map.mjs /location    pin lands on the venue (the pink marker beside it is
                           the neighbouring hotel — expected, see #16)
prices in HTML source      1.420 / 1.050 / 1.700 / 2.500 / 3.500 / Besplatno — all FOUND
/events HTML source        3.500 din · 18. jul 2026 · 1. avgust 2026 ·
                           "Sledeći datumi uskoro" · "Ležaljke, odnosno ulaz" — all FOUND
/events todo-marker count  0
lightbox backdrop          measured, not eyeballed: bg-night/95 composites to
                           RGB 11–23 behind content. It looks lighter than that
                           in a downscaled screenshot preview. Do not "fix" it.
```

⚠️ **`npm run lint` has three PRE-EXISTING failures** — `react-hooks/
set-state-in-effect` in `Hero.tsx:37`, `Nav.tsx:21` and `Reveal.tsx:31`, all
from phases 1–2 and none touched since. Lint the files you changed
(`npx eslint <paths>`) until someone decides to address them.

The price lines are the point of the whole project — PRD problem #3 was that
prices and the menu existed only as JPEGs. Re-check after touching any of these
pages. `shoot.mjs` wipes `screenshots/` on every run, so pass all the routes you
care about in one invocation.

⚠️ **Run the scripts from PowerShell, not Git Bash.** Git Bash rewrites a
leading-slash argument into a Windows path, so `node scripts/shoot.mjs /events`
tries to navigate to `http://localhost:3000C:/Program Files/Git/events`.
