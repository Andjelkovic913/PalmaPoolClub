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
| ⛔ Blocks publishing (needs the owner) | 2 FAQ · 3 cancellation · 4 amenity copy · 5 capacity |
| 🎨 Open design work | 18 hero |
| 🔧 Operational, not blocking | 6 booking engine · 7 domain · 8 reviews · 9 vector logo · 10 photography · 11 tagline · 17 đakuzi spelling |
| ✅ Decided, do not reopen | 12 Matine date · 13 "pogledom" · 14 under-4 free · 15 pricing model · 16 map |

---

## Blocks publishing — needs an answer from the business owner

### 2. FAQ answers — all seven

No caption, flyer or menu card touches any of these. All seven render as `TODO:`.

- Da li ima parkinga?
- Da li je pogodno za decu?
- Šta da ponesem?
- Da li mogu da rezervišem telefonom?
- Šta ako pada kiša?
- Kako funkcioniše otkazivanje rezervacije?
- Da li su ležaljke uključene u cenu? *(only this one is answerable — "Ležaljke su uključene u cenu" is on the pricing card)*

### 3. Cancellation policy

Must be surfaced at the point of booking. No source anywhere. `PRD.md` §8
suggests "e.g. free cancellation up to 24h before" — that is a placeholder in
the PRD, not a real policy. Do not publish it as fact.

### 4. Amenity descriptions

The amenities are real and confirmed (two pools, jacuzzi, food truck, table
tennis, billiards, free parking, panoramic view) but the business has **never
described any of them** in any caption. Labels ship; the one-line descriptions
under each are unsourced and render as `TODO:`.

### 5. Daily sunbed capacity

Not visible in any Instagram data. Needed before a booking engine can enforce a
daily cap.

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

### 6. Booking engine choice
SimplyBook.me or equivalent, not yet chosen. `/book` ships as a styled form
shell with an isolated `<BookingWidget>` boundary for the embed to drop into.

### 7. Domain registration
Name decided (**Palma Pool Club**, no "Kosmaj" suffix). `.rs` / `.com` shortlist
still to be proposed.

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
| Landscape shots (4) | **511×290** — video frame grabs, small tiles only |
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
