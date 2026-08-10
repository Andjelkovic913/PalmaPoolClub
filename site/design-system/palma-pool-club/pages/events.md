# Page Override — `/events` (Matine)

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file
> (`design-system/palma-pool-club/MASTER.md`).

Written by hand. The generator's `--page events` run was skipped because
`MASTER.md` already existed, and its output would have been rejected anyway:
it proposed "Vibrant & Block-based" with an amber `#F59E0B` primary on a
`#FFFBEB` cream ground. This page is gold-on-black, taken directly off the
venue's real DJ flyer artwork. Amber-on-cream would be a different brand.

---

## What this page is

Matine is a daytime-into-evening DJ pool party — a **different product** from a
day pass, sold to a different, younger audience. `PRD.md` problem #4 is that
Instagram blurs the two together. This page exists to visually separate them.
The mode switch is the whole point: it is the signal that you have crossed from
"family pool day" into "night out".

## Mode

`data-mode="night"` on the page root. Every semantic token flips; no component
needs a night-specific variant.

| Token | Value |
|---|---|
| `--bg` | `#0B0906` |
| `--surface` | `#141009` |
| `--text` | `#F2EBDD` |
| `--text-muted` | `#B3A892` |
| `--accent` / `--primary` | `#E8C877` (`gold-bright`) |
| `--on-accent` | `#0B0906` |
| `--border` | `#3A301F` |

**Measured contrast on this page** (see MASTER.md §1):

- body `#F2EBDD` on `#0B0906` — **16.77:1**
- `gold` `#C9A24B` on `#0B0906` — **8.29:1** (passes body outright)
- `gold-bright` `#E8C877` on `#0B0906` — **12.27:1**
- CTA `#0B0906` on `#E8C877` — **12.27:1**

`BUILD_PROMPT.md` §9 Phase 4 says to "bump to `--gold-bright` where it fails".
Measured, plain `gold` does **not** fail — it clears body text at 8.29:1. Use
`gold-bright` for emphasis and for small or thin type, not as a rescue.

## Typography

Same two faces as the rest of the site — the mode change carries the shift, not
a font change. **MATINE** is set large in Fraunces.

Reminder from MASTER.md §3: **Fraunces digits are proportional.** Event dates,
times and the 3.500 din price all go in Source Sans 3 with `.tabular`.

## Voice

Nightlife copy comes off the flyers, not from the daytime blurb. Verbatim,
sourced in `src/content/copy.ts` as `flyerVoice`:

- "Feel the vibe. Live the moment."
- "Chill. Music. Sun. Good vibes."
- "Tvoj vikend počinje ovde."
- "Pool. People. Palma."

## The state that actually ships: EMPTY

Both known Matine dates are **in the past** relative to the build date
(10 Aug 2026):

| Datum | DJ | Vreme | Cena |
|---|---|---|---|
| subota, 18. jul 2026. | @byedov | 15:00–20:00 | 3.500 din |
| subota, 1. avgust 2026. | @misictoma | 10:00–18:00 | 3.500 din |

So the empty state is not an edge case — **it is the live state**. Build and
review it as the primary case:

> Sledeći datumi uskoro — pratite nas na Instagramu

Past events go to an archive block below it. Everything is driven by
`src/content/events.ts`, never hardcoded JSX, so adding a date is a data edit.

On the 18 July vs 18 June date, see `OPEN_QUESTIONS.md` #12 — settled, the
flyer is correct.

## Photography

**There is no night photography of this venue.** No DJ booth, no crowd, no
dusk, nothing. The photo strip is therefore:

- `flyer-byedov` (1087×1447) — real gold-on-black artwork
- `flyer-matine` (1123×1400) — real poster
- `<ImageSlot id="event-dj-booth" />` and `<ImageSlot id="event-crowd-dusk" />`

Do not substitute a daytime pool photo darkened with an overlay, and do not
substitute stock nightlife imagery. See `OPEN_QUESTIONS.md` #10.

## Inherited from MASTER.md unchanged

Motion (150–300ms, reduced-motion gated), Lucide icons only, `cursor-pointer`
on everything clickable, visible focus rings, the 375/768/1024/1440 sweep, and
both hard project rules — no invented content, no stock or AI imagery.
