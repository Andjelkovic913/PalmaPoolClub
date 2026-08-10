# Palma Pool Club — Website PRD

**Status:** Draft v1 — ready for Stitch design prompt
**Prepared:** 10 August 2026
**Owner/builder:** Building solo with Claude Code

---

## 1. Background

Palma Pool Club (Kosmaj, Serbia) is a seasonal pool venue whose *only* online presence is Instagram (@palmapoolclub, ~3,490 followers). A full content/business audit (35 of 36 posts, pricing/menu images, and 15 clean photos) surfaced six concrete problems this site needs to solve. Full audit: `PalmaPoolClub/instagram_raw/` and the published audit report.

## 2. Problems This Site Solves (v1 scope)

1. **No website** — nothing exists outside Instagram for search, maps, or link-sharing.
2. **Phone-only reservations** — no online booking, no availability visibility.
3. **Pricing & menu are static images** — not text, not searchable, can't be updated without a graphic designer.
4. **Daytime pool visits and "Matine" DJ events are blurred together** — different products, same undifferentiated feed.
5. Way-finding depends on opening Instagram first (map link lives in bio).
6. Real amenities (2 pools, jacuzzi, Palma Pool Cafe food truck, billiards, table tennis) are never presented as a coherent offering anywhere.

**Explicitly out of scope for v1:** online payment (reserve-now-pay-at-venue instead), email/SMS retention list, live Instagram feed embed, bilingual content, dark mode, large-group/private-event booking flow, analytics/ad tracking.

## 3. Target Users

- **Day visitors** (families, groups of friends) from Belgrade (~30 min away) booking a sunbed for the day.
- **Nightlife visitors** booking a ticketed Matine DJ event — a distinct, younger-skewing audience.
- Both segments currently only reachable via Instagram algorithm exposure; the site must be discoverable via Google search (local intent: "bazen Kosmaj", "bazen Beograd") and shareable via a real URL.

## 4. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js + Tailwind CSS** | Chosen over Astro for ecosystem/flexibility as features grow. |
| Content | Local Markdown/JSON in-repo | No headless CMS — owner (you) edits content directly via Claude Code, not the business owner. |
| Booking | **Embedded third-party booking engine** (SimplyBook.me or equivalent capacity-based engine) | Must support: daily capacity cap, weekday/weekend price rules, half-day (15:00+) discount, child/under-4 tiers, separate "event" product type for Matine tickets. Reserve-now-pay-at-venue — no payment gateway needed for v1. |
| Notifications | SMS (primary) + email + on-screen confirmation | Matches how the business already operates (phone-first). |
| Hosting | Vercel | Free-tier friendly, trivial custom domain. |
| Domain | TBD — shortlist `.rs` / `.com` options for "Palma Pool Club" (name decided: **"Palma Pool Club"**, no "Kosmaj" suffix). |
| Analytics | None for v1 | Explicitly skipped per scope decision. |

## 5. Site Structure (multi-page)

Chosen over single-scroll specifically for SEO — pricing and menu each need their own indexable URL.

| Page | Route | Purpose |
|---|---|---|
| Home | `/` | Hero, quick facts, amenities overview, teasers → other pages, map teaser |
| Pricing | `/pricing` | Full ticket table, sunbeds-included note, Book Now CTA |
| Menu | `/menu` | Food + drinks as real text, house-recommendation stars, food truck note |
| Events | `/events` | Matine explainer, upcoming dates, DJ flyers, ticket pricing, Book Now CTA |
| Gallery | `/gallery` | Curated real photo grid, grouped (Pool & Views / Amenities & Food / Events) |
| FAQ | `/faq` | Parking, kids policy, what to bring, weather/rain policy, cancellation policy |
| Location & Contact | `/location` | Map embed, address, directions from Belgrade, click-to-call, Instagram link, hours |
| Book Now | `/book` | Booking widget — day-pass and event tickets |

Nav: Home · Pricing · Menu · Events · Gallery · FAQ · Location — persistent **Book Now** CTA button.

## 6. Visual Direction

- **Two visual modes, shifting by section** (matches how Palma already presents itself): Home/Pricing/Menu/Gallery/FAQ/Location = bright daytime mode (teal pool blue + warm sand/stone neutrals, drawn from real photos). Events/Matine page = gold-on-black nightlife mode (drawn directly from their actual DJ flyer branding).
- **One fixed look, no dark-mode toggle.**
- **More expressive motion**: parallax/scroll-driven reveals, hover micro-interactions — a more premium feel is explicitly wanted, not minimal-only.
- **Brand assets**: tagline "Sunce. Palma. Pogled." (Sun. Palm. View.), palm-tree logo mark — recreate cleanly from existing menu/flyer imagery (no vector original available).
- **Reference sites** (both scraped and reviewed):
  - **Skyfall Belgrade** (skyfallbelgrade.com) — warm terracotta accent on white, editorial sans + cursive script accents for personality, big hero photo, simple day/night gallery toggle. *Closest match for the daytime mode's warmth and the day/night duality concept.*
  - **Infinity Pool House** (infinitypoolhouse.rs) — teal minimalism, elegant dotted-leader menu typography. *Useful specifically for how to typeset the pricing/menu pages cleanly.*
  - Palma's site should feel more premium/photography-forward than either — it has stronger real imagery (aerial drone shots) than both references.

## 7. Content Requirements

All real content already collected — no placeholder copy needed except reviews (see below).

- **Pricing**: exact RSD figures for adult/child/under-4 × weekday/weekend, half-day 50% rule, sunbeds-included note. Source: `selected/menu_pricing.jpg`, cross-confirmed across ~30 captions.
- **Menu**: full food + drinks line items and prices. Source: `selected/menu_food.jpg`, `menu_drinks.jpg`.
- **Photography**: 15 clean, play-button-free images in `PalmaPoolClub/selected/` — includes 4 true landscape shots, aerial/drone shots, the food truck, and full-res DJ event flyer.
- **Copy voice**: Serbian only. Match their existing tone — short, sunny, direct ("☀️🌴 Palma Pool Club je bazen sa predivnim pogledom...").
- **Events**: two confirmed Matine dates this season (18 Jun, 1 Aug), DJ names (Byedov, Misictoma), format (10:00–18:00 or 15:00–20:00, ticket = regular day price).
- **Reviews**: section designed now with **placeholder content** — real Google/Instagram reviews to be swapped in later (not yet sourced).
- **FAQ content**: needs to be authored (parking, kids policy, what-to-bring, weather/rain policy, cancellation policy) — not sourced from Instagram, will need reasonable assumptions or a follow-up with the business owner.

## 8. Booking System Requirements

- Enforce a **maximum daily capacity** per day (exact sunbed count TBD with owner — not in the Instagram data).
- Price rules: weekday 2,500 RSD / weekend 3,500 RSD (adult), weekday 1,250 / weekend 1,750 (child 4–12), free under 4, 50% off half-day tickets from 15:00.
- Separate **event ticket product** for Matine nights (flat 3,500 RSD per the confirmed second Matine).
- Confirmation via **SMS + email**, plus on-screen confirmation.
- **Cancellation policy**: simple rule to be defined (e.g. free cancellation up to 24h before) and surfaced at booking time.
- No group/private-event special flow for v1 — same booking flow for everyone; large parties handled manually by phone as they arise today.

## 9. SEO Requirements

- Target real local search intent: "bazen Kosmaj", "bazen Beograd", "bazen Sopot", "palma pool club cena/cenovnik", "palma pool club meni".
- Pricing and Menu pages must be real indexable text (directly fixes problem #3).
- Standard on-page SEO: meta titles/descriptions per page, structured data (LocalBusiness schema with address/hours/phone), sitemap.

## 10. Open Items / Follow-ups Before Build

- [ ] Confirm actual daily sunbed/capacity limit with the business owner (not visible in any Instagram data).
- [ ] Register domain (shortlist to be proposed).
- [ ] Choose and set up the booking engine account (SimplyBook.me or alternative) — requires the business owner's info (SMS sender, business hours config).
- [ ] Source real Google reviews when available (placeholder in v1).
- [ ] Author FAQ answers (parking, kids, weather policy, cancellation policy) — needs real answers, not scraped data.
- [ ] Obtain a clean vector logo if the owner has one; otherwise proceed with the recreated version.

---
*Data sources: `PalmaPoolClub/instagram_raw/post_log.json` (35 posts), `PalmaPoolClub/selected/` (15 curated images), owner-saved menu/pricing screenshots, reference sites skyfallbelgrade.com and infinitypoolhouse.rs.*
