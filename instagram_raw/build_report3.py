# -*- coding: utf-8 -*-
import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = r"C:\Users\RoPe\AppData\Local\Temp\claude\C--Users-RoPe\bc06a868-a909-4466-9212-3618dfc180b4\scratchpad\palma_report.html"

def read(name):
    with open(os.path.join(BASE, name), encoding="utf-8") as f:
        return f.read()

FONTS_CSS = read("_fonts_css_final.txt")
POST_ROWS = read("_post_rows.html")
GALLERY_HTML = read("_gallery.html")

TEMPLATE = r"""<title>Palma Pool Club &mdash; Content &amp; Business Audit</title>
<style>
__FONTS_CSS__

:root{
  --bg:#EDE6D8;
  --surface:#F7F3EA;
  --surface-2:#E2D8C3;
  --ink:#211C16;
  --ink-soft:#5B5346;
  --ink-faint:#8A8171;
  --teal:#0E7A82;
  --teal-deep:#0B5F66;
  --brass:#A9812E;
  --terracotta:#B5563A;
  --line:rgba(33,28,22,0.14);
  --line-strong:rgba(33,28,22,0.28);
  --shadow: 0 1px 2px rgba(33,28,22,0.06), 0 8px 24px rgba(33,28,22,0.06);
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#171310;
    --surface:#1F1A15;
    --surface-2:#2A2318;
    --ink:#F3ECDF;
    --ink-soft:#C7BBA6;
    --ink-faint:#8D8371;
    --teal:#3FBEC6;
    --teal-deep:#2B9BA3;
    --brass:#D9AF54;
    --terracotta:#E37456;
    --line:rgba(243,236,223,0.14);
    --line-strong:rgba(243,236,223,0.26);
    --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.35);
  }
}
:root[data-theme="dark"]{
  --bg:#171310;
  --surface:#1F1A15;
  --surface-2:#2A2318;
  --ink:#F3ECDF;
  --ink-soft:#C7BBA6;
  --ink-faint:#8D8371;
  --teal:#3FBEC6;
  --teal-deep:#2B9BA3;
  --brass:#D9AF54;
  --terracotta:#E37456;
  --line:rgba(243,236,223,0.14);
  --line-strong:rgba(243,236,223,0.26);
  --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.35);
}

*{box-sizing:border-box;}
html{-webkit-text-size-adjust:100%;}
body{
  margin:0;
  background:var(--bg);
  color:var(--ink);
  font-family:'Public Sans', system-ui, sans-serif;
  font-size:16px;
  line-height:1.6;
}
::selection{ background: var(--teal); color: var(--surface); }

.wrap{ max-width: 920px; margin: 0 auto; padding: 0 24px 120px; }

/* ---------- masthead ---------- */
.masthead{
  padding: 64px 0 40px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 48px;
}
.eyebrow{
  font-family:'Public Sans', sans-serif;
  font-weight:600;
  font-size:0.72rem;
  letter-spacing:0.14em;
  text-transform:uppercase;
  color: var(--teal-deep);
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:18px;
}
.eyebrow::before{
  content:"";
  width:22px; height:1px;
  background: var(--teal-deep);
  display:inline-block;
}
h1.title{
  font-family:'Fraunces', Georgia, serif;
  font-weight:600;
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  line-height:1.02;
  margin: 0 0 14px;
  text-wrap: balance;
  color: var(--ink);
}
.subhead{
  font-size:1.08rem;
  color: var(--ink-soft);
  max-width: 62ch;
  margin: 0 0 28px;
}
.meta-line{
  font-size:0.9rem;
  color: var(--ink-faint);
  margin-bottom:32px;
}
.meta-line b{ color: var(--ink-soft); font-weight:600; }

.stat-strip{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1px;
  background:var(--line);
  border:1px solid var(--line);
  border-radius:10px;
  overflow:hidden;
}
.stat{
  background:var(--surface);
  padding:18px 16px;
}
.stat .num{
  font-family:'Fraunces', Georgia, serif;
  font-weight:600;
  font-size:1.7rem;
  font-variant-numeric: tabular-nums;
  color: var(--teal-deep);
  display:block;
}
.stat .lbl{
  font-size:0.74rem;
  color:var(--ink-faint);
  text-transform:uppercase;
  letter-spacing:0.06em;
}

/* ---------- sections ---------- */
section{ margin: 72px 0; }
.sec-head{ margin-bottom: 28px; }
.sec-eyebrow{
  font-family:'Public Sans', sans-serif;
  font-weight:600;
  font-size:0.72rem;
  letter-spacing:0.14em;
  text-transform:uppercase;
  color:var(--brass);
  margin-bottom:8px;
  display:block;
}
h2.sec-title{
  font-family:'Fraunces', Georgia, serif;
  font-weight:600;
  font-size:1.9rem;
  margin:0 0 6px;
  text-wrap:balance;
  color:var(--ink);
}
.sec-dek{
  color:var(--ink-soft);
  max-width:66ch;
  font-size:1rem;
}

h3.sub-title{
  font-family:'Fraunces', Georgia, serif;
  font-weight:600;
  font-size:1.2rem;
  margin: 32px 0 12px;
  color:var(--ink);
}

/* ---------- overview grid ---------- */
.overview-grid{
  display:grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 20px;
  margin-bottom: 28px;
}
@media (max-width:720px){ .overview-grid{ grid-template-columns:1fr; } }
.fact-card{
  background:var(--surface);
  border:1px solid var(--line);
  border-radius:12px;
  padding:22px 24px;
  box-shadow: var(--shadow);
}
.fact-row{
  display:flex;
  justify-content:space-between;
  gap:16px;
  padding:9px 0;
  border-bottom:1px solid var(--line);
  font-size:0.95rem;
}
.fact-row:last-child{ border-bottom:none; }
.fact-row .k{ color:var(--ink-faint); }
.fact-row .v{ color:var(--ink); font-weight:600; text-align:right; }

.tagline-card{
  background: linear-gradient(155deg, var(--teal-deep), var(--teal));
  color:#F3ECDF;
  border-radius:12px;
  padding:26px 26px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  box-shadow: var(--shadow);
}
.tagline-card .tl-label{
  font-size:0.7rem;
  text-transform:uppercase;
  letter-spacing:0.12em;
  opacity:0.75;
  margin-bottom:10px;
}
.tagline-card .tl-sr{
  font-family:'Fraunces', Georgia, serif;
  font-style:italic;
  font-weight:500;
  font-size:1.5rem;
  margin:0 0 6px;
}
.tagline-card .tl-en{
  font-size:0.92rem;
  opacity:0.85;
}

/* ---------- pricing / menu tables ---------- */
.table-scroll{ overflow-x:auto; border:1px solid var(--line); border-radius:12px; background:var(--surface); box-shadow:var(--shadow); }
table{ width:100%; border-collapse:collapse; font-size:0.92rem; min-width:480px; }
thead th{
  text-align:left;
  font-size:0.7rem;
  text-transform:uppercase;
  letter-spacing:0.08em;
  color:var(--ink-faint);
  font-weight:600;
  padding:12px 16px;
  border-bottom:1px solid var(--line-strong);
  background:var(--surface-2);
}
tbody td{ padding:11px 16px; border-bottom:1px solid var(--line); vertical-align:top; }
tbody tr:last-child td{ border-bottom:none; }
tbody tr:hover{ background: var(--surface-2); }
td.num, th.num{ text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
.menu-two{ display:grid; grid-template-columns:1fr 1fr; gap:20px; }
@media (max-width:720px){ .menu-two{ grid-template-columns:1fr; } }
.item-name{ font-weight:600; }
.item-note{ display:block; color:var(--ink-faint); font-size:0.82rem; margin-top:2px; }
.star{ color:var(--brass); }

/* ---------- callouts ---------- */
.callout{
  border-left:3px solid var(--terracotta);
  background:var(--surface);
  border-radius:0 10px 10px 0;
  padding:16px 20px;
  margin:22px 0;
  font-size:0.95rem;
  color:var(--ink);
  box-shadow: var(--shadow);
}
.callout b{ color:var(--terracotta); }
.callout.teal{ border-left-color:var(--teal); }
.callout.teal b{ color:var(--teal-deep); }

/* ---------- content audit stats ---------- */
.audit-stats{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px;
  margin-bottom:24px;
}
@media (max-width:720px){ .audit-stats{ grid-template-columns:repeat(2,1fr); } }
.audit-stat{
  background:var(--surface);
  border:1px solid var(--line);
  border-radius:10px;
  padding:16px;
}
.audit-stat .num{ font-family:'Fraunces',Georgia,serif; font-weight:600; font-size:1.5rem; font-variant-numeric:tabular-nums; }
.audit-stat .lbl{ font-size:0.78rem; color:var(--ink-faint); margin-top:2px; }

.tag{ font-size:0.72rem; padding:3px 8px; border-radius:20px; font-weight:600; }
.tag-reel{ background:rgba(14,122,130,0.14); color:var(--teal-deep); }
.tag-post{ background:rgba(169,129,46,0.16); color:var(--brass); }
.c-cap{ max-width:340px; color:var(--ink-soft); }
.c-date{ white-space:nowrap; font-variant-numeric:tabular-nums; }

.post-table-wrap{ max-height:520px; overflow-y:auto; }
.post-table-wrap table{ min-width:640px; }
.post-table-wrap thead th{ position:sticky; top:0; z-index:1; }

/* ---------- gallery ---------- */
.gallery{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  gap:14px;
}
@media (max-width:820px){ .gallery{ grid-template-columns:repeat(3,1fr); } }
@media (max-width:560px){ .gallery{ grid-template-columns:repeat(2,1fr); } }
.g-item{ margin:0; }
.g-frame{
  aspect-ratio: 3/4;
  border-radius:10px;
  overflow:hidden;
  background:var(--surface-2);
  box-shadow:var(--shadow);
}
.g-frame img{ width:100%; height:100%; object-fit:cover; display:block; }
.g-item figcaption{ padding-top:8px; display:flex; flex-direction:column; gap:1px; }
.g-title{ font-size:0.82rem; font-weight:600; color:var(--ink); }
.g-sub{ font-size:0.74rem; color:var(--ink-faint); }

/* ---------- signals list ---------- */
.signals{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:14px; }
.signals li{
  display:grid;
  grid-template-columns: 28px 1fr;
  gap:14px;
  padding:16px 18px;
  background:var(--surface);
  border:1px solid var(--line);
  border-radius:10px;
  font-size:0.95rem;
  box-shadow:var(--shadow);
}
.signals .mark{ color:var(--teal-deep); font-family:'Fraunces',Georgia,serif; font-weight:600; }

/* ---------- footer ---------- */
footer{
  margin-top:80px;
  padding-top:24px;
  border-top:1px solid var(--line);
  font-size:0.82rem;
  color:var(--ink-faint);
  display:flex;
  justify-content:space-between;
  gap:20px;
  flex-wrap:wrap;
}
footer code{
  background:var(--surface-2);
  padding:2px 6px;
  border-radius:4px;
  font-size:0.8rem;
}

@media (prefers-reduced-motion: no-preference){
  .fact-card, .g-frame, .audit-stat, .signals li{ transition: transform .18s ease, box-shadow .18s ease; }
}
</style>

<div class="wrap">

  <header class="masthead">
    <div class="eyebrow">Field Report &mdash; Social Content &amp; Business Audit</div>
    <h1 class="title">Palma Pool Club</h1>
    <p class="subhead">Everything the business's only online presence &mdash; Instagram <strong>@palmapoolclub</strong> &mdash; reveals about the venue, its offerings, and how it talks to guests. Compiled as the reference base for the upcoming website.</p>
    <div class="meta-line">Kosmaj, Serbia &middot; Prepared <b>10 August 2026</b> &middot; <b>35 of 36</b> posts recovered &middot; No website found</div>
    <div class="stat-strip">
      <div class="stat"><span class="num">~3,490</span><span class="lbl">Followers</span></div>
      <div class="stat"><span class="num">35 / 36</span><span class="lbl">Posts analyzed</span></div>
      <div class="stat"><span class="num">7 wks</span><span class="lbl">Jun 18 &ndash; Aug 7</span></div>
      <div class="stat"><span class="num">4,024</span><span class="lbl">Total likes</span></div>
    </div>
  </header>

  <section id="overview">
    <div class="sec-head">
      <span class="sec-eyebrow">01 &mdash; The Business</span>
      <h2 class="sec-title">Overview</h2>
      <p class="sec-dek">Core facts, pulled from captions, bio, and the venue's own price-list graphic.</p>
    </div>

    <div class="overview-grid">
      <div class="fact-card">
        <div class="fact-row"><span class="k">Location</span><span class="v">Kralja Petra Prvog b.b., Sopot &mdash; Kosmaj</span></div>
        <div class="fact-row"><span class="k">Distance from Belgrade</span><span class="v">~43&nbsp;km / ~30&nbsp;min</span></div>
        <div class="fact-row"><span class="k">Hours</span><span class="v">10:00&ndash;19:00, daily</span></div>
        <div class="fact-row"><span class="k">Reservations</span><span class="v">Phone only &mdash; +381 60 3318 255</span></div>
        <div class="fact-row"><span class="k">Booking / ordering online</span><span class="v">None found</span></div>
        <div class="fact-row"><span class="k">Website</span><span class="v">None found</span></div>
      </div>
      <div class="tagline-card">
        <div class="tl-label">Brand tagline</div>
        <div class="tl-sr">&ldquo;Sunce. Palma. Pogled.&rdquo;</div>
        <div class="tl-en">Sun. Palm. View. &mdash; used consistently across the logo, menus, and price list.</div>
      </div>
    </div>

    <h3 class="sub-title">Pricing (Ulaznice)</h3>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Ticket</th><th class="num">Weekday</th><th class="num">Weekend</th></tr></thead>
        <tbody>
          <tr><td>Adult</td><td class="num">2,500 RSD</td><td class="num">3,500 RSD</td></tr>
          <tr><td>Child, 4&ndash;12</td><td class="num">1,250 RSD</td><td class="num">1,750 RSD</td></tr>
          <tr><td>Child, under 4</td><td class="num">Free</td><td class="num">Free</td></tr>
          <tr><td>Half-day ticket (from 15:00)</td><td class="num" colspan="2" style="text-align:center;">50% off regular price</td></tr>
        </tbody>
      </table>
    </div>
    <p class="sec-dek" style="margin-top:10px; font-size:0.88rem;">Sunbeds are included in the ticket price. Pricing is identical to the numbers repeated in nearly every Instagram caption &mdash; confirmed consistent across the whole season.</p>
  </section>

  <section id="menu">
    <div class="sec-head">
      <span class="sec-eyebrow">02 &mdash; On-Site Menu</span>
      <h2 class="sec-title">Food &amp; Drink</h2>
      <p class="sec-dek">Transcribed from the venue's own menu graphics. Orders and payment happen at the bar &mdash; no table service implied.</p>
    </div>
    <div class="menu-two">
      <div>
        <h3 class="sub-title" style="margin-top:0;">Food</h3>
        <div class="table-scroll"><table>
          <tbody>
            <tr><td><span class="item-name">Palma Signature Burger <span class="star">&#9733;</span></span><span class="item-note">Dry-aged beef, brioche, cheddar, caramelized onion</span></td><td class="num">1,420</td></tr>
            <tr><td><span class="item-name">Chicken burger &amp; fries</span></td><td class="num">1,050</td></tr>
            <tr><td><span class="item-name">Chicken Caesar wrap</span></td><td class="num">1,050</td></tr>
            <tr><td><span class="item-name">Caesar salad</span></td><td class="num">1,150</td></tr>
            <tr><td><span class="item-name">Box combo (for sharing)</span></td><td class="num">1,700</td></tr>
            <tr><td><span class="item-name">Golden chicken fingers <span class="star">&#9733;</span></span></td><td class="num">820</td></tr>
            <tr><td><span class="item-name">Crispy nuggets</span></td><td class="num">780</td></tr>
            <tr><td><span class="item-name">Palma wings basket &#127798;</span></td><td class="num">850</td></tr>
            <tr><td><span class="item-name">Mozzarella sticks <span class="star">&#9733;</span></span></td><td class="num">850</td></tr>
            <tr><td><span class="item-name">Fries / flatbread</span></td><td class="num">250 / 160</td></tr>
            <tr><td><span class="item-name">Palma dessert <span class="star">&#9733;</span></span></td><td class="num">450</td></tr>
            <tr><td><span class="item-name">Tropical fruit plate <span class="star">&#9733;</span></span></td><td class="num">850</td></tr>
          </tbody>
        </table></div>
      </div>
      <div>
        <h3 class="sub-title" style="margin-top:0;">Drinks</h3>
        <div class="table-scroll"><table>
          <tbody>
            <tr><td><span class="item-name">Espresso / cappuccino</span></td><td class="num">230&ndash;290</td></tr>
            <tr><td><span class="item-name">Ice cafe <span class="star">&#9733;</span></span></td><td class="num">430</td></tr>
            <tr><td><span class="item-name">Soft drinks (Coke, Fanta, Sprite&hellip;)</span></td><td class="num">260</td></tr>
            <tr><td><span class="item-name">Rosa water, still / sparkling</span></td><td class="num">220</td></tr>
            <tr><td><span class="item-name">Red Bull</span></td><td class="num">540</td></tr>
            <tr><td><span class="item-name">Heineken</span></td><td class="num">360</td></tr>
            <tr><td><span class="item-name">Mohito / Pi&ntilde;a Colada / Blue Lagoon <span class="star">&#9733;</span></span></td><td class="num">580</td></tr>
            <tr><td><span class="item-name">Sex on the Beach <span class="star">&#9733;</span></span></td><td class="num">580</td></tr>
            <tr><td><span class="item-name">Jack Daniels <span class="star">&#9733;</span></span></td><td class="num">580</td></tr>
            <tr><td><span class="item-name">Stobi wine <span class="star">&#9733;</span></span></td><td class="num">540</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
    <p class="sec-dek" style="margin-top:10px; font-size:0.88rem;">All prices RSD. <span class="star">&#9733;</span> = house recommendation on the original menu.</p>
  </section>

  <section id="audit">
    <div class="sec-head">
      <span class="sec-eyebrow">03 &mdash; Content Audit</span>
      <h2 class="sec-title">The Instagram Feed</h2>
      <p class="sec-dek">Every recoverable post this season, chronologically. Instaloader was blocked by Instagram's rate limiting; this dataset was collected via a script run inside an authenticated browser session instead.</p>
    </div>

    <div class="audit-stats">
      <div class="audit-stat"><span class="num">31 / 4</span><span class="lbl">Reels vs. photo posts</span></div>
      <div class="audit-stat"><span class="num">6&ndash;1,041</span><span class="lbl">Likes range per post</span></div>
      <div class="audit-stat"><span class="num">115</span><span class="lbl">Average likes</span></div>
      <div class="audit-stat"><span class="num">126</span><span class="lbl">Total comments, all posts</span></div>
    </div>

    <div class="callout">
      <b>Caption reuse.</b> 31 of 35 posts (89%) reuse one of just two near-identical stock captions &mdash; the standard pool-info blurb or the "season is open" variant. Only the two Matine DJ-event announcements (4 posts total) carry unique copy.
    </div>
    <div class="callout teal">
      <b>Engagement is front-loaded.</b> The three highest-liked posts (1,041 / 586 / 386 likes) all landed during the season-opening week, June 21&ndash;24. Everyday posts since then sit mostly in the 10&ndash;70 like range.
    </div>

    <h3 class="sub-title">Full post log</h3>
    <div class="table-scroll post-table-wrap">
      <table>
        <thead><tr><th>Date</th><th>Type</th><th class="num">Likes</th><th class="num">Comments</th><th>Caption</th></tr></thead>
        <tbody>
__POST_ROWS__
        </tbody>
      </table>
    </div>
  </section>

  <section id="visuals">
    <div class="sec-head">
      <span class="sec-eyebrow">04 &mdash; Visual Assets</span>
      <h2 class="sec-title">Curated Real Photography</h2>
      <p class="sec-dek">18 images selected from the 35 recovered posts plus the venue's saved menu graphics &mdash; real photography only, no AI-generated substitutes. Full set of 35 lives in <code>instagram_raw/images/</code>; this shortlist in <code>selected/</code>.</p>
    </div>
    <div class="gallery">
__GALLERY__
    </div>
  </section>

  <section id="signals">
    <div class="sec-head">
      <span class="sec-eyebrow">05 &mdash; Signals for Discussion</span>
      <h2 class="sec-title">Observed, Not Yet Interpreted</h2>
      <p class="sec-dek">Factual patterns from the data above &mdash; raw material for deciding pain points and site structure together, not conclusions.</p>
    </div>
    <ul class="signals">
      <li><span class="mark">&mdash;</span><span>No website anywhere; Instagram is the sole online presence, and all bookings go through a single phone number.</span></li>
      <li><span class="mark">&mdash;</span><span>Full pricing and both menus exist only as static image graphics &mdash; not typed text anywhere online, so they're unsearchable and can't be updated without a designer.</span></li>
      <li><span class="mark">&mdash;</span><span>Two ticketed "Matine" DJ/nightlife events ran this season &mdash; a distinct product line layered on top of ordinary daytime pool access.</span></li>
      <li><span class="mark">&mdash;</span><span>Content is heavily templated: 89% of posts reuse one of two stock captions, mostly repurposing the same handful of drone/pool clips.</span></li>
      <li><span class="mark">&mdash;</span><span>Engagement peaked at season opening (up to 1,041 likes) and has settled much lower since &mdash; no re-engagement mechanism (email, SMS list, loyalty) is visible anywhere.</span></li>
      <li><span class="mark">&mdash;</span><span>Amenities beyond the pool itself &mdash; billiards, table tennis, DJ sets, a food &amp; drink menu &mdash; appear in the content but aren't organized or explained anywhere as a single offering.</span></li>
    </ul>
  </section>

  <footer>
    <div>Sources: @palmapoolclub Instagram (browser-session capture, 10 Aug 2026) &middot; 3 owner-saved menu images.</div>
    <div>Data: <code>PalmaPoolClub\instagram_raw\post_log.json</code> &middot; Images: <code>PalmaPoolClub\selected\</code></div>
  </footer>

</div>
"""

html_out = TEMPLATE.replace("__FONTS_CSS__", FONTS_CSS).replace("__POST_ROWS__", POST_ROWS).replace("__GALLERY__", GALLERY_HTML)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html_out)

print("Wrote", OUT, "size:", len(html_out), "chars")
