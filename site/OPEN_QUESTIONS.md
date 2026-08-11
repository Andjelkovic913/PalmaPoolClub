# Open Questions — Palma Pool Club website

Anything the build could not answer from verified source material. Per
`BUILD_PROMPT.md` §0 rule 1: nothing here gets a plausible-sounding guess.
Unanswered items render as a visible `TODO:` on the page.

**Sources consulted:** `PRD.md`, `BUILD_PROMPT.md`, `instagram_raw/post_log.json`
(35 posts), `selected/menu_pricing.jpg`, `selected/menu_food.jpg`,
`selected/menu_drinks.jpg`, the DJ Byedov flyer, the Matine flyer, `logo.jpg`,
`radnidaninotekst.png`, `radnovremenotekst.png`, `vikendcenovniknotekst.png`,
the Instagram bio.

**Numbers are stable IDs — code comments reference them. Never renumber.**

| Status | Items |
|---|---|
| ⛔ Blocks publishing (needs the owner) | 2 FAQ *(3 drafted answers to confirm)* · 3 cancellation · 4 amenity copy · **7 domain** *(now also blocks guest email)* |
| 🎨 Open design work | 18 hero |
| 🔧 Operational, not blocking | 8 reviews · 9 vector logo · 10 photography · 11 tagline · 17 đakuzi spelling · 19 confirmed pricing rules |
| ✅ Decided, do not reopen | 5 capacity = 40 · 6 booking built in-house · 12 Matine date · 13 "pogledom" · 14 under-4 free · 15 pricing model · 16 map |

---

## Blocks publishing — needs an answer from the business owner

### 2. FAQ answers — 4 sourced, 3 DRAFTED and awaiting confirmation

Originally logged as "all seven unanswerable". That was wrong: on review, four
answer directly from verified material. `/faq` ships all seven filled —
**the owner chose finished answers over visible `TODO:` badges** — so the
provenance lives in `src/content/faq.ts` (`verified` flag) and in
`scripts/check-faq.mjs`, which prints the drafted ones on demand.

| Question | Status |
|---|---|
| Da li su ležaljke uključene u cenu? | ✅ pricing card |
| Da li mogu da rezervišem telefonom? | ✅ all 31 captions |
| Da li ima parkinga? | ✅ confirmed amenity, PRD §2 / BUILD_PROMPT §8 |
| Da li je pogodno za decu? | ✅ captions + card (price tiers only) |
| Šta da ponesem? | ⚠️ DRAFTED |
| Šta ako pada kiša? | ⚠️ DRAFTED |
| Kako funkcioniše otkazivanje rezervacije? | ⚠️ DRAFTED — see #3 |

**"Da li je pogodno za decu?" deliberately answers only the price tiers.**
Nothing about pool depth, a shallow area or supervision is sourced anywhere,
so nothing is claimed.

**The two policy questions route to the phone instead of stating terms.**
That is the one line the drafts do not cross: a drafted answer may describe,
but it may not commit the business to a refund, a deadline or a cancellation
window it has never agreed to. `check-faq.mjs` fails the build-time check if
such wording ever appears. **Get the owner to confirm all three wordings
before launch.**

### 3. Cancellation policy — STILL UNANSWERED

Must be surfaced at the point of booking. No source anywhere. `PRD.md` §8
suggests "e.g. free cancellation up to 24h before" — that is a placeholder in
the PRD, not a real policy. **Do not publish it as fact.**

`/faq` now carries a drafted answer for the question, but it states no terms —
it asks the guest to call. That is a holding pattern, not a policy: `/book`
(Phase 7) has to surface something concrete at the point of payment, and there
is still nothing to surface. This remains a publishing blocker.

### 4. Amenity descriptions

The amenities are real and confirmed (two pools, jacuzzi, food truck, table
tennis, billiards, free parking, panoramic view) but the business has **never
described any of them** in any caption. Labels ship; the one-line descriptions
under each are unsourced and render as `TODO:`.

### 5. Daily sunbed capacity — RESOLVED: **40**

Not visible in any Instagram data; supplied by the owner. Lives as
`DEFAULT_CAPACITY` in `src/content/booking.ts` and is what the booking
transaction compares against. Individual days can differ via the
`day_capacity` table; a row set to `0` means the venue is closed that day.

This was the last thing blocking a real reservation flow — see #6.

### 19. Pricing rules confirmed by the owner, not printed anywhere

Both are live in `src/lib/price.ts` and asserted in `scripts/check-price.mjs`.
Logged because a future reader will look for them on the price card and not
find them:

- **"Vikendom" means Saturday and Sunday.** Friday is charged as a weekday
  (2.500). The card names no days.
- **The half-day 50% applies to the child rate too**, so a 4–12 child on a
  Saturday afternoon is 1.750 × 0,5 = **875 din**. That figure is on no card;
  it follows from "50% popusta na redovnu cenu".

**Also unconfirmed and not yet reachable:** the Matine child rate. Both
announcements state a single entry price (3.500) and never mention children, so
`priceFor()` charges it per paying guest with no child discount. The ticket
option does not render while no Matine is upcoming, so nothing depends on this
yet — **resolve it before adding a future Matine date to `events.ts`.**

---

## Open design work — no owner input needed

### 18. Hero treatment — PARKED, not settled

The owner is not happy with the hero and it has been reverted to the state it
was in when the gallery was signed off. Deliberately parked so the remaining
pages get built; revisit at the end.

**Current state:** desktop `terrace-cafe-frontage`, mobile `hero-aerial-wide`,
two light directional scrims, a 5% parallax anchored bottom.

**What was tried and rejected:**

| Attempt | Outcome |
|---|---|
| Heavy bottom scrim (`black/85`) | Crushed the café frontage and valley — the best part of the frame |
| `scale(1.12)` parallax from centre | Cropped ~11% off the bottom, losing the building and view |
| Desktop `aerial-terrace-valley` (drone band) | Rejected on look |
| Pinned sticky runway + vertical pan | Worked technically (332px travel over 747px of scroll, reduced-motion safe) but rejected on look |

**The underlying constraint.** No photograph in the set is both wide and
subject-filling. `terrace-cafe-frontage` is the only true landscape (1.74) and
it is ~60% sky with no pool visible. Everything else is 0.56–0.80 portrait, so
a wide hero crop keeps only 31–44% of the frame and needs a 1.28–1.53× upscale.

**What would actually fix it:** one wide photograph, ≥1600px, showing the pool
*with* the valley behind it — subject in the lower two-thirds. That does not
exist in the current set. Related to #10.

---

## Operational — does not block the build

### 17. "Jacuzzi" vs "đakuzi" — which spelling?

`BUILD_PROMPT.md` §8 lists the amenity as *"jacuzzi sa pogledom"*. The
Instagram bio writes it in Serbian transliteration: *"Dva bazena, đakuzi sa
pogledom"*.

The bio is the brand's own voice and should normally win, but the exact
diacritic is not legible with confidence from a screenshot (đakuzi / džakuzi).
Currently shipping BUILD_PROMPT's "Jacuzzi sa pogledom". One-word answer needed.

---

### 6. Booking engine — RESOLVED: built in-house

No third party. Calendly and Google Calendar were both assessed and rejected:
Calendly sells time slots, not "N sunbeds on a date", and owns the confirmation
email — it cannot say *8.750 din, 2 odrasla + 1 dete* in Serbian, nor offer the
next free date. Google Calendar has no transaction, so two simultaneous
bookings can both take the last bed.

Shipping instead: **Supabase Postgres + Drizzle + Resend**, with the
accept/reject decision inside one locked transaction. Setup in `site/SETUP.md`.
The `<BookingWidget>` boundary is kept in case a third party is ever wanted.

**Still to do before a guest uses it:** run the migration, seed, and walk the
three cases — none of it has run against a real database yet (no Postgres on
the build machine).

### 7. Domain registration — NOW BLOCKS GUEST EMAIL
Name decided (**Palma Pool Club**, no "Kosmaj" suffix). `.rs` / `.com` shortlist
still to be proposed.

**This is no longer cosmetic.** Resend only delivers to arbitrary addresses
from a *verified domain*; until one exists, its shared sender reaches only the
Resend account owner's own inbox. The whole booking flow runs and every row is
written — guests simply will not receive their confirmation. Register the
domain, verify it in Resend, set `RESEND_FROM`. No code changes.

### 8. Real reviews
**Nothing usable exists in the scrape** — no review text anywhere in the 35
posts. The reviews section ships with visibly-labelled placeholder data in
`src/content/reviews.ts`.

### 9. Vector logo
No vector original. `logo.jpg` is 150×150 — unusable at any real size. The mark
is recreated as inline SVG from `logo.jpg` and the DJ Byedov poster: gold palm
in a thin circle over a sun arc and two wave rules, `PALMA` in wide-tracked
caps, `POOL CLUB` in a small tracked label between rules.

### 10. Higher-resolution photography
Current set:

| | |
|---|---|
| Tall drone shots (5) | 941×1670 — usable full-width |
| **Eye-level landscape (2)** | **1122×740** — harvested from marketing graphics, see below |
| Landscape shots (4) | **511×290** — video frame grabs, small tiles only. `scripts/check-image-scale.mjs` now fails the build if one is rendered larger; `/pricing` had shipped one at `100vw`. |
| Missing entirely | dusk, night, DJ booth, crowd, jacuzzi-at-night, billiards, table tennis |

**Harvested crops.** `radnidani.png` and `radnovreme.png` are marketing
graphics with text over real photographs. Cropping strictly inside the text
bands yielded two clean 1122×740 eye-level shots — `deck-loungers-valley` and
`terrace-cafe-frontage` — at more than double the resolution of the frame grabs,
and the only ground-level perspective in the whole set. Reproducible via
`scripts/make-crops.mjs`.

`VikendCenovnik.png` was **not** harvested: the two closed umbrellas carry a
third-party supplier's logo across the centre of frame.

Consequences: no gallery hero row, no full-bleed landscape. The `/events` photo
strip is flyers plus `<ImageSlot>`. Swap-in later needs no component changes —
everything routes through the typed manifest in `src/content/images.ts`.

**This is now also costing `/gallery` its structure.** `BUILD_PROMPT.md` §9
Phase 5 asks for a grouped grid — *Bazen & Pogled · Sadržaji & Hrana · Matine
Žurke* — and that layout was built and reviewed. It cannot ship yet: five of
its nineteen cells are `<ImageSlot>`, and all five fall in the two groups meant
to sell the venue. `/gallery` therefore ships as one ungrouped section of the
14 real photographs.

**Four photographs would restore it**, and they are ordinary phone shots:

| Missing | Slot |
|---|---|
| The billiards table | `amenity-billiards` |
| The table tennis table | `amenity-table-tennis` |
| The car park | `amenity-parking` |
| One Matine night — DJ booth or the crowd | `event-dj-booth` / `event-crowd-dusk` |

When they arrive: add them to `src/content/images.ts` and switch
`src/app/gallery/page.tsx` from `gallerySingle` back to `galleryGroups` — one
identifier; the grouped layout is kept working in `src/content/gallery.ts`.

**Separately, the two flyers are deliberately not in `/gallery` at all.** It
ships as a uniform cropped grid, and a 3:2 crop of `flyer-byedov` keeps only
"DJ BYEDOV / SUBOTA 18. JUL" — the set time, the phone number and both slogans
fall outside the cell. A poster is a document, not a texture. They appear
uncropped at full height on `/events`, which is the right home for artwork.
This is not a photography gap and needs nothing from the owner.

### 11. Tagline variant
- `menu_pricing.jpg` and the Byedov poster: **"Sunce. Palma. Pogled."**
- `brand_tagline_sky.jpg`: *"sunce. palme. pogled."* (lowercase, plural)

Shipping the former — it is the official logo lockup. Confirm.

---

## Decided on evidence — do not reopen

### 12. Matine #1 is **18 July 2026**, not 18 June

`PRD.md` §7 says 18 June. The flyer says **SUBOTA 18. JUL**. The caption says
"18.6.2026" — but that caption was **posted on 14 July**, announcing an upcoming
Saturday. 18 June 2026 was a Thursday and a month in the past; 18 July 2026 was
a Saturday, four days after the post. The business typo'd its own caption and
`PRD.md` inherited the typo. **The flyer is correct.**

### 13. "predivnim pogledom" ships corrected

All 31 captions read *"predivnim **poglednom**"*. Correct Serbian is
*"pogledom"*. `BUILD_PROMPT.md` §0 already quotes it corrected. This is a typo,
not the brand's voice. Do not change it back.

### 14. "Deca do 4 godine — besplatno" ships

Absent from the pricing card, but stated in all 31 captions: *"Deca do 4 godine
ne plaćaju ništa."* Caption evidence is sufficient.

### 16. Map location — RESOLVED

Coordinates supplied from the map link in the venue's own Instagram bio
(`maps.app.goo.gl/AaSFopphDQj5fLSR9`):

```
44.5369706, 20.5598241     (44°32'13.1"N 20°33'35.4"E)
Plus code: GHP5+QWP Sopot
```

Stored as `business.geo` in `src/content/business.ts`. **Verified**: the embed
drops a pin on the venue itself.

**Always embed by lat/lng, never by the address string.** "Kralja Petra Prvog
BB" is *bez broja* — no house number — so it geocodes to a road midpoint and
drops no marker, leaving the neighbouring Alexander Hotel Kosmaj as the only
labelled place on screen. Querying the business name returns a blank map
because no Google Business listing exists.

Feeds the `LocalBusiness` JSON-LD `geo` property in Phase 8.

**Still worth doing (not blocking):** create a free Google Business Profile.
It would put the venue on Maps under its own name, and supply the real reviews
that #8 needs.

### 15. Pricing model — RESOLVED, count by head

Originally logged as the one blocking question. Now settled.

The price cards state the unit as the sunbed:

> **ODRASLI: 2500 din/ležaljka** · DECA OD 4 DO 12 GODINA: 1250 din/ležaljka
> **ODRASLI: 3500 din/ležaljka** · DECA OD 4 DO 12 GODINA: 1750 din/ležaljka

…and all 31 captions agree (*"cene ležaljki su 2500 dinara **po ležaljci**"*),
as do both Matine posts (*"**Ležaljke, odnosno ulaz**"* — the sunbed *is* the
entry).

**In practice the two units coincide, and `/book` counts people, not sunbeds**
(confirmed by the owner). Every paying guest occupies exactly one sunbed, so a
head count and a sunbed count are the same number. `ODRASLI` and
`DECA OD 4 DO 12. GODINA` on the `ULAZNICE` card are rate tiers for a person.

**Children under 4 are free and do not take a sunbed** — they are with their
parents. This matches the captions: *"Deca do 4 godine ne plaćaju ništa."*
The edge case is closed; nothing further needed from the owner.

**The model `/book` implements:**

```
total = odrasli        × rate.adult
      + deca4do12      × rate.child
      + decaDo4        × 0
```

…where `rate` is the weekday or weekend column, derived from the chosen date,
halved when the start time is 15:00 or later. Under-4s are still collected as a
field — the venue needs the head count even though it costs nothing.

Maths stays isolated in `priceFor()` in case the rules ever change.

---

## Verified — no follow-up needed

- All pricing figures. The card states absolute numbers; the captions state the
  same numbers plus the "50% manje" child rule. 50% of 2.500 = 1.250 and 50% of
  3.500 = 1.750 — the two sources agree exactly.
- "Ležaljke su uključene u cenu" — pricing card.
- "Hvala što ste deo naše palme!" — pricing card.
- Phone `+381 60 3318255` — all 31 captions and the flyer.
- Matine #2: **subota, 1. avgust 2026**, DJ `@misictoma`, 10:00–18:00, 3.500 din.
- Matine #1: DJ `@byedov`, 15:00–20:00, 3.500 din.
- Flyer voice: "Feel the vibe. Live the moment." / "Chill. Music. Sun. Good
  vibes." / "Tvoj vikend počinje ovde." / "Pool. People. Palma."
- Opening hours 10:00–19:00 daily — all 31 captions, and the `radnovreme.png`
  graphic. ⚠️ One reel outside the scraped set reads *"Svakog dana od 10 do
  20h"* and another *"Otvaranje sezone 27.05.2026"*, both inconsistent with the
  31 captions and with the 18 Jun season-opening post. Shipping 10–19h on the
  weight of evidence; worth one confirmation from the owner.
- Season opened 18 Jun 2026; last post 7 Aug 2026.

## Menu cross-check — DONE

`menu_food.jpg` and `menu_drinks.jpg` have now been read directly (they are
byte-for-byte the same cards as `istaknutiStoriji2.jpg` and
`istaknutiStoriji3.jpg`). **`BUILD_PROMPT.md` §6 is accurate** — every item and
every price matches the cards. Three corrections to apply when building `/menu`:

1. **"GOLDEN ĆHICKEN FINGERS"** — the card really does read `Ć`, not `C`.
   **Decision: correct it silently**, same treatment as the "poglednom" typo
   (#13). `/menu` ships "Golden Chicken Fingers". Note this means the site and
   the printed card differ by one character; not worth surfacing to the owner.
2. **Ice Cafe carries ❄ only, not ★.** §6 gives it both.
3. **The drinks card has its own legend**, which §6 does not document:
   ★ preporuka kuće · ❄ hladna pića · 🍸 cocktail. The cocktails each carry a
   glass marker. So `/menu` needs **two legends**, not one — food uses
   ★ / 🌶 / 👥, drinks use ★ / ❄ / 🍸.

Also: "Next Buci" is **five separate line items** on the card (breskva, jabuka,
jagoda, narandža, šumsko voće), not one grouped row as §6 writes it.

Section order on the food card is two columns — left: Burgeri, Wrap & Salate,
Deserti; right: Snacks & Sharing (with Box Combo boxed at the top). Preserve
that grouping rather than §6's linear order.
