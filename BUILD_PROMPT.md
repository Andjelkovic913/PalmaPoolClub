# Palma Pool Club — Build Prompt (Claude Code + ui-ux-pro-max)

> Paste this whole file into Claude Code as your first message in the project repo.
> Prerequisite (run yourself, once, before pasting):
> ```
> npm install -g ui-ux-pro-max-cli
> uipro init --ai claude
> python3 --version   # must be 3.x
> ```

---

## 0. Role and rules of engagement

You are building a production website for **Palma Pool Club**, a seasonal outdoor pool venue on Kosmaj hill, ~30 min from Belgrade, Serbia. Stack: **Next.js (App Router) + Tailwind CSS**, deployed to Vercel.

Hard rules for this build:

1. **Do not invent content.** Every price, menu item, date, phone number and address in this document is real and verified. Anything not in this document that you need, add to `OPEN_QUESTIONS.md` and use a clearly-marked `TODO:` placeholder — never a plausible-sounding guess.
2. **Do not generate or use stock/AI imagery.** All photography comes from `/public/images/` (see §4). Where a photo does not exist yet, render a `<ImageSlot>` component: a neutral warm-sand block with the slot ID printed in it. Never a Unsplash URL, never a gradient standing in for a photo.
3. **Serbian copy only** (Latin script). Tone: short, sunny, direct — match the brand's own voice: *"☀️🌴 Palma Pool Club je bazen sa predivnim pogledom, u mirnom predelu Kosmaja, na nekih 30 minuta od Beograda."* No corporate hospitality-speak, no "Discover luxury".
4. **No emoji as UI icons.** Use Lucide React SVG icons. Emoji is allowed only inside quoted marketing copy.
5. Work in the order given in §9. Stop and show me the running result after each phase — do not build all 8 pages before I've seen one.

---

## 1. FIRST STEP — generate and persist the design system

Before writing any component, run the ui-ux-pro-max reasoning engine and persist the output. Run these exactly:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "outdoor pool club venue booking hospitality photography-forward premium leisure" \
  --design-system --persist -p "Palma Pool Club"

python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "outdoor pool club venue booking" --design-system --persist \
  -p "Palma Pool Club" --page "events"

python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "reservation booking flow capacity date picker" --domain ux --json

python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "responsive layout image-heavy hero" --stack nextjs
```

Then **read `design-system/MASTER.md`** and reconcile it with §2 below. The brand constraints in §2 win where they conflict with the generator's recommendation — but you must write the deviation and the reason into MASTER.md under a `## Brand Overrides` heading, so the file stays the single source of truth. Also create `design-system/pages/events.md` capturing the nightlife-mode override.

Every subsequent page you build: read `design-system/MASTER.md` first, then `design-system/pages/<page>.md` if it exists (page file overrides master).

Run the generator's **pre-delivery checklist** against every page before you call that page done.

---

## 2. Brand constraints (these override generator output)

### Two visual modes, by section — not a user toggle

**Daytime mode** — Home, Pricing, Menu, Gallery, FAQ, Location, Book.
Palette is sampled from the venue's own photographs, not chosen abstractly:

| Token | Value | Sampled from |
|---|---|---|
| `--pool` (primary) | `#1BA5C4` | pool water, midday drone shots |
| `--pool-deep` | `#0E6E86` | deep end / shadowed water |
| `--sand` (base surface) | `#EDE4D6` | limestone pool deck |
| `--cream` (page bg) | `#FAF6EF` | — |
| `--teak` | `#B07B4B` | composite wood decking |
| `--brass` (accent/CTA) | `#C89B4A` | brand gold from menus & flyers |
| `--ink` (text) | `#241C16` | — |
| `--float-red` | `#D6362F` | the polka-dot mushroom float (use sparingly, as a punctuation accent only) |

**Nightlife mode** — `/events` only. Taken directly from the real DJ flyers:

| Token | Value |
|---|---|
| `--night` (bg) | `#0B0906` |
| `--gold` | `#C9A24B` |
| `--gold-bright` | `#E8C877` |
| `--night-text` | `#F2EBDD` |

Implement both as CSS custom properties on a `data-mode="day" | "night"` attribute at the section/page level. **No dark-mode toggle. No `prefers-color-scheme` switching.** One fixed look per page.

### Typography

Warm display serif for headings + clean humanist sans for body and all numeric/tabular content. Pull the specific pairing from the generator's typography output, but it must satisfy: full **Serbian Latin diacritics** (č ć ž š đ) in both faces, and **tabular numerals** available on the sans for the pricing and menu tables. Verify the diacritics render — check `Đ` and `ž` specifically, several otherwise-good Google fonts drop them. Uppercase tracked labels for section eyebrows.

### Logo

Recreate as inline SVG (no vector original exists): palm-tree silhouette inside a thin circular badge over a sun/wave motif; `PALMA` wordmark below in a confident geometric sans; `POOL CLUB` beneath in a small tracked-out label. Two color variants: brass-on-cream (day), gold-on-black (night). Tagline lockup: **"Sunce. Palma. Pogled."**

### Motion

Premium and alive, not minimal. Required: parallax on hero imagery, scroll-triggered section reveals (staggered, subtle), hover states that *move* (lift + 1.02 scale + shadow) not just recolor. All transitions 150–300ms, ease-out. **Every motion effect must be gated behind `prefers-reduced-motion: reduce`** — no exceptions.

### Anti-patterns for this project (reject if the generator suggests them)

Purple/pink AI gradients · glassmorphism · neon · dark mode as a global theme · generic resort stock photography · centered-everything hero with a full-bleed gradient overlay swallowing the photo · carousel as the primary gallery pattern · emoji icons.

---

## 3. Reference sites (read for structure, do not clone)

- **skyfallbelgrade.com** — warm accent on cream, editorial photography-forward hero, day/night duality. Closest match for daytime warmth.
- **infinitypoolhouse.rs** — teal minimalism, dotted-leader price typography. Use specifically as the model for how `/pricing` and `/menu` are typeset.

Palma should read as **more premium and more photography-led than both** — its aerial drone material is stronger than anything on either reference site.

---

## 4. Image manifest

Real photos live in `/public/images/`. Build `src/content/images.ts` as a typed manifest — every image referenced by slot ID, never by raw path in a component. Serbian `alt` text is required on all of them (SEO + a11y).

| Slot ID | Content | Orientation | Used on |
|---|---|---|---|
| `hero-aerial-wide` | High drone shot: both pools, deck, café building with solar roof, forest + parking | portrait/tall crop | Home hero |
| `aerial-top-down` | Straight-down drone: two pools, loungers, mushroom float, solar panels | tall | Home amenities, Gallery |
| `aerial-terrace-valley` | Drone over deck toward village rooftops + hills, blue sky | tall | Gallery, Location |
| `pool-jacuzzi-overhead` | Overhead: long pool + round jacuzzi, swimmer, teak chairs, valley beyond | tall | Amenities — "Jacuzzi sa pogledom" |
| `pool-panorama-loungers` | Wide landscape: pool, loungers, pergola, big sky, valley | landscape | Gallery hero row |
| `foodtruck-golden-hour` | Yellow "PALMA POOL CAFE" truck on deck, wooden chairs, sun flare | tall | Menu page header |
| `mushroom-float` | Red-and-white polka-dot mushroom fountain in the pool | landscape | Recurring playful accent |
| `deck-evening` | Deck + umbrellas, dusk light | landscape | Gallery |
| `flyer-byedov` | Gold-on-black DJ Byedov flyer | portrait | Events |
| `flyer-matine` | "MATINE BAZEN" poster over deck/jacuzzi photo | portrait | Events |
| `card-price-weekday` | "RADNI DANI" price card photo | portrait | do **not** ship as pricing — reference only |
| `card-price-weekend` | "VIKEND" price card photo | portrait | reference only |

Rules:

- Use `next/image` everywhere with explicit `width`/`height`, `sizes`, and `priority` only on the Home hero. Everything else lazy.
- **The pricing and menu card images must never be shipped as the pricing or menu content** — that is problem #3 in the PRD. They are source-of-truth references for the text in §5 and §6 only. Real HTML text, always.
- Only 4 true landscape shots exist. Design grids that survive a portrait-heavy set — do not build a layout that needs eight 16:9 images.
- Any slot without a file yet renders `<ImageSlot id="..." />`, not a broken image.

---

## 5. Pricing content (verbatim — `/pricing`)

Ležaljke su uključene u cenu.

| Karta | Radnim danima | Vikendom |
|---|---|---|
| Odrasli | 2.500 din | 3.500 din |
| Deca 4–12 godina | 1.250 din | 1.750 din |
| Deca do 4 godine | Besplatno | Besplatno |
| Poludnevna karta (od 15:00) | 50% popusta | 50% popusta |

Closing line from their own material: *"Hvala što ste deo naše palme!"*

Typeset with dotted leaders / ruled rows, tabular numerals, right-aligned figures. Mobile: do not horizontally scroll a table — restructure to stacked weekday/weekend groups under 640px.

---

## 6. Menu content (verbatim — `/menu`)

Header note: *"Molimo goste da narudžbine i plaćanje izvrše na šanku."* Sub-note: hrana se priprema u Palma Pool Cafe food trucku na terasi.
Markers: ★ = preporuka kuće, 🌶 = ljuto, 👥 = za deljenje. Render these as **SVG icons with a legend**, not as literal characters.

### Hrana

**Burgeri**
- ★ Palma Signature Burger — 1.420 din — *Sočna dry aged junetina u brioche pecivu, cheddar sir, karamelizovani luk, sveži dodaci i domaći sos.*
- Pileći burger sa pomfritom — 1.050 din — *Hrskavi pileći file, zelena salata, paradajz, domaći sos i pomfrit.*

**Wrap & Salate**
- Pileći Cezar wrap — 1.050 din — *Grilovana piletina, parmezan, zelena salata i cezar dresing u tortilji.*
- Cezar salata — 1.150 din — *Piletina, zelena salata, parmezan, krutoni i cezar dresing.*

**Snacks & Sharing**
- 👥 Box combo — 1.700 din — *Savršen izbor za deljenje – kombinacija najpopularnijih zalogaja iz ponude.* (featured — give this its own boxed treatment, as their menu does)
- ★ Golden Chicken Fingers — 820 din — *Hrskavi pileći štapići uz sos po izboru.*
- Crispy Nuggets — 780 din — *Zlatno pečeni pileći zalogaji.*
- 🌶 Palma Wings Basket — 850 din — *Hrskava pileća krilca u posebnom sosu, servirana uz pomfrit.*
- ★ Mozzarella Sticks — 850 din — *Pohovana mozzarella sa sosom.*
- Mediterraneo Sticks — 920 din — *Mozzarella obmotana pršutom, hrskavo pečena.*
- Onion Rings — 450 din — *Hrskavi kolutovi crnog luka.*
- ★ Pomfrit — 250 din — *Sveže pripremljen zlatni pomfrit.*
- Lepinja — 160 din — *Sveža domaća lepinja.*

**Deserti**
- ★ Palma desert — 450 din — *Kremasti desert po izboru našeg šefa.*
- Sladoled (kugla) — 150 din — *Izbor ukusa – pitajte osoblje.*
- ★ Tropski voćni tanjir — 850 din — *Selekcija svežeg sezonskog voća.*

### Piće

**Kafe** — Espreso 230 · Dupli espreso 570 · Espreso sa mlekom 260 · Capucino 290 · ★❄ Ice cafe 430 · Nes cafe 280

**Sokovi** — Koka Kola 260 · Kola Zero 260 · Fanta 260 · Sprite 260 · Sveps Tonic 260 · Sveps Biter Lemon 260 · Next Buci (breskva / jabuka / jagoda / narandža / šumsko voće) 200 · ★ Redbull 540

**Voda** — Rosa 220 · Rosa gazirana 220 — note: *"Hidracija je ključ. Uživajte i osvežite se!"*

**Alkoholna pića** — Hajniken 360 · ★ Mohito 580 · ★ Blue Lagon 580 · ★ Pina Colada 580 · ★ Stobi vino 540 · ★ Sex on the Beach 580 · ★ Jack Daniels 580

Two-column layout on desktop (Hrana / Piće), single column stacked on mobile, dotted leaders throughout, prices in tabular numerals. Every item is real indexable text — this page is an SEO target ("palma pool club meni").

---

## 7. Events content (`/events` — nightlife mode)

Matine = daytime-into-evening DJ pool party. Flyer voice: **"Feel the vibe. Live the moment." / "Chill. Music. Sun. Good vibes. Tvoj vikend počinje ovde." / "Pool. People. Palma."**

Confirmed events:

| Datum | DJ | Vreme | Cena |
|---|---|---|---|
| Subota, 18. jul | DJ Byedov | 15:00–20:00 | cena redovne dnevne karte |
| Subota, 1. avgust 2026. | Misictoma | 10:00–18:00 | 3.500 din |

⚠️ **Flag for me, don't resolve silently:** the PRD says the first Matine was *18 June*, the actual flyer says *subota 18. jul*. Put this in `OPEN_QUESTIONS.md` and render the flyer date. Also note both dates are in the past relative to the build date — build the events page to handle **empty state ("Sledeći datumi uskoro — pratite nas na Instagramu")** and past-events archive, driven by data in `src/content/events.ts`, not hardcoded JSX.

Reservations line on flyers: **060 331 8255**.

---

## 8. Business facts (used across pages + schema)

- **Adresa:** Kralja Petra Prvog BB, Sopot, Srbija (Kosmaj)
- **Telefon:** +381 60 3318255 — always `tel:` click-to-call
- **Radno vreme:** svaki dan 10:00–19:00 (seasonal — surface a season note)
- **Instagram:** @palmapoolclub
- **Udaljenost:** ~43 km / ~30 minuta od Beograda
- **Sadržaji:** dva bazena, jacuzzi sa pogledom, ležaljke i suncobrani, Palma Pool Cafe food truck, stoni tenis, bilijar, veliki besplatan parking, panoramski pogled na Kosmaj
- **Tagline:** Sunce. Palma. Pogled.

---

## 9. Build order — stop for review after each phase

**Phase 1 — Foundation.** Next.js App Router + Tailwind scaffold. Tokens from §2 wired into `tailwind.config` (semantic names: `pool`, `sand`, `brass`, `night`, `gold` — not `blue-500`). Fonts self-hosted via `next/font` with Serbian subset. `design-system/MASTER.md` written. `<ImageSlot>`, `<Section>`, `<Button>` (primary/secondary/ghost, all with `cursor-pointer` + visible focus ring), `<Reveal>` motion wrapper honoring reduced-motion. Sticky nav + footer.
→ Show me: a bare page rendering the type scale, palette, and button states.

**Phase 2 — Home (`/`).**
Sticky nav (logo left · Početna, Cenovnik, Meni, Događaji, Galerija, FAQ, Lokacija · filled **"Rezerviši"** brass CTA right; mobile = full-screen drawer, CTA stays visible in the bar).
Hero: full-bleed `hero-aerial-wide` with parallax, "Sunce. Palma. Pogled." in display serif, one-line subhead, two CTAs — **"Rezerviši ležaljku"** (primary) / **"Pogledaj cenovnik"** (secondary). Keep the photo readable: a bottom-weighted scrim, not a full overlay wash.
Quick-facts strip: radno vreme 10–19h · 30 min od Beograda · besplatan parking · telefon (click-to-call).
Amenities: 5–6 cards — Dva bazena · Jacuzzi sa pogledom · Palma Pool Cafe · Stoni tenis & bilijar · Matine DJ žurke · Parking. Lucide icon + one short line each; photo crop where a real photo exists.
Pricing teaser → `/pricing`. Gallery teaser (4–6 tiles) → `/gallery`.
Matine teaser: a deliberately **gold-on-black** card breaking the daytime palette — the visual hook toward `/events`.
Reviews section: build the component with clearly-labeled placeholder data from `src/content/reviews.ts` (real Google reviews pending — note in `OPEN_QUESTIONS.md`).
Map teaser + footer.

**Phase 3 — `/pricing` and `/menu`.** Content from §5 and §6, verbatim, as text. These two carry the SEO weight — get the heading hierarchy and the mobile reflow right.

**Phase 4 — `/events`.** Full nightlife mode, `data-mode="night"`. Hero: near-black, gold palm mark, **MATINE** in large display, subhead *"DJ žurke pored bazena."* Event cards from `src/content/events.ts` with empty and past states. "Šta je Matine?" explainer. Photo strip: flyers + dusk deck shots. CTA **"Rezerviši kartu"** in gold. Contrast check gold-on-black at 4.5:1 for body text — bump to `--gold-bright` where it fails.

**Phase 5 — `/gallery`.** Grouped grid with subtle labels: *Bazen & Pogled · Sadržaji & Hrana · Matine Žurke*. Masonry that tolerates a portrait-heavy set. Accessible lightbox: keyboard nav, focus trap, Esc to close, arrow keys. Not a carousel.

**Phase 6 — `/faq` and `/location`.**
FAQ: accordion (real `<details>`/disclosure semantics, keyboard operable). Questions: *Da li ima parkinga? · Da li je pogodno za decu? · Šta da ponesem? · Da li mogu da rezervišem telefonom? · Šta ako pada kiša? · Kako funkcioniše otkazivanje rezervacije? · Da li su ležaljke uključene u cenu?* — **answers are not yet authored.** Write `TODO:` drafts, mark each visibly in the code, and list them in `OPEN_QUESTIONS.md` for the owner to confirm. Do not publish invented policy.
Location: map embed, address, click-to-call, Instagram, hours, "Kako do nas" with drive time from Belgrade, parking note.

**Phase 7 — `/book`.** Booking engine (SimplyBook.me or equivalent) is **not yet chosen** — build the page as a styled card-based form shell with a clearly isolated `<BookingWidget>` boundary component that the third-party embed drops into later. Form fields: datum, tip karte (dnevna karta / Matine ulaznica), broj odraslih, broj dece 4–12, broj dece do 4, ime, telefon, e-mail. Show the applicable price live as fields change, using the §5 rules (weekday/weekend detection from the chosen date, 50% off when start time ≥ 15:00). Surface the cancellation policy at the point of booking (`TODO:` — needs owner). Success state: palm/sun motif, *"Potvrda stiže putem SMS-a."* No payment step — reserve now, pay at venue.

**Phase 8 — SEO, a11y, polish.** Per-page `metadata` (title/description in Serbian) targeting: *bazen Kosmaj, bazen Beograd, bazen Sopot, palma pool club cenovnik, palma pool club meni*. JSON-LD `LocalBusiness` (+ `Restaurant` for the café, `Event` for each Matine) with address, geo, hours, phone, priceRange. `sitemap.xml`, `robots.txt`, OG images per page. Then run the ui-ux-pro-max pre-delivery checklist plus §10 across every page.

---

## 10. Acceptance checklist — verify before calling it done

- [ ] `design-system/MASTER.md` exists, is current, and every component's colors trace to a token in it
- [ ] Pricing and menu are **real selectable text**, present in the HTML source, not images
- [ ] Zero AI-generated or stock photos anywhere; unfilled slots render `<ImageSlot>`
- [ ] All copy is Serbian with correct diacritics; no lorem ipsum; every invented fact instead sits in `OPEN_QUESTIONS.md`
- [ ] Contrast ≥ 4.5:1 for body text in **both** day and night modes (test the gold-on-black separately)
- [ ] Visible focus states on every interactive element; full keyboard path through nav, accordion, lightbox, booking form
- [ ] `prefers-reduced-motion: reduce` disables parallax and reveals — verify by toggling it, not by reading the code
- [ ] `cursor-pointer` on everything clickable; hover states move, 150–300ms
- [ ] Clean at 375 / 768 / 1024 / 1440 px; no horizontal scroll on the pricing or menu tables at 375
- [ ] Lighthouse mobile ≥ 90 performance / 100 accessibility; LCP image is the hero and is `priority`
- [ ] Every `tel:` and Instagram link works; map loads without layout shift
- [ ] `OPEN_QUESTIONS.md` lists: sunbed capacity, booking engine choice, domain, FAQ answers, cancellation policy, real reviews, 18 Jun vs 18 Jul discrepancy, vector logo

---

## 11. Out of scope for v1 — do not build

Online payment · email/SMS marketing list · live Instagram feed embed · English or any second language · dark-mode toggle · separate large-group/private-event booking flow · analytics or ad tracking · headless CMS.
