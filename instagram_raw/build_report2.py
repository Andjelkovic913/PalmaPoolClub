# -*- coding: utf-8 -*-
import json, os, html

BASE = os.path.dirname(os.path.abspath(__file__))
SELECTED = r"C:\Users\RoPe\PalmaPoolClub\selected"
FONTS_TXT = r"C:\Users\RoPe\AppData\Local\Temp\claude\C--Users-RoPe\bc06a868-a909-4466-9212-3618dfc180b4\scratchpad\fonts\_fonts_css_src.txt"
OUT = r"C:\Users\RoPe\AppData\Local\Temp\claude\C--Users-RoPe\bc06a868-a909-4466-9212-3618dfc180b4\scratchpad\palma_report.html"

with open(os.path.join(BASE, "_fonts_css.txt"), encoding="utf-8") as f:
    FONTS_CSS = f.read()

def img_uri(name):
    for ext, mime in ((".jpg", "image/jpeg"), (".png", "image/png")):
        p = os.path.join(SELECTED, "b64", name + ext + ".b64")
        if os.path.exists(p):
            with open(p, "r", encoding="ascii") as f:
                return f"data:{mime};base64,{f.read().strip()}"
    raise FileNotFoundError(name)

with open(os.path.join(BASE, "post_log.json"), encoding="utf-8") as f:
    posts = json.load(f)

MONTH_ABBR = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"}
def fmt_date(iso):
    y,m,d = iso.split("-")
    return f"{int(d)} {MONTH_ABBR[int(m)]}"

def esc(s):
    return html.escape(s or "")

# ---- post log table rows ----
rows = []
for p in posts:
    cap = (p["caption"] or "").replace("\n", " ")
    cap_short = cap[:92] + ("…" if len(cap) > 92 else "")
    ptype = "Reel" if p["type"] == "reel" else "Photo"
    rows.append(f"""<tr>
      <td class="c-date">{fmt_date(p['date'])}</td>
      <td class="c-type"><span class="tag tag-{p['type']}">{ptype}</span></td>
      <td class="c-num">{p['likes']}</td>
      <td class="c-num">{p['comments']}</td>
      <td class="c-cap" title="{esc(cap)}">{esc(cap_short)}</td>
    </tr>""")
POST_ROWS = "\n".join(rows)

# ---- gallery ----
GALLERY_ITEMS = [
    ("landscape_aerial_terrace", "Aerial terrace, landscape", "Full pool deck from above, widescreen"),
    ("landscape_loungers_pergola_view", "Loungers &amp; pergola", "Widescreen, valley view from the terrace"),
    ("landscape_pool_umbrellas_mushroom", "Pool &amp; umbrellas", "Widescreen, signature mushroom float"),
    ("landscape_mushroom_fountain_detail", "Mushroom fountain, detail", "Signature photo-op piece, water jets"),
    ("aerial_full_property_clean", "Full property, aerial", "Both pools, solar roof, parking, grounds"),
    ("aerial_pool_swimmer_clean", "Pool complex, aerial", "Elevated angle, full deck layout"),
    ("aerial_lap_pool_swimmer", "Lap pool, aerial", "Swimmer, jacuzzi, hillside view"),
    ("hero_pool_wide_clean", "Pool, wide shot", "Ground-level, sky and deck"),
    ("food_truck_palma_cafe", "Palma Pool Cafe", "Branded food trailer, on-site kitchen"),
    ("brand_dj_byedov_poster_clean", "DJ Byedov poster", "Full-resolution event flyer, gold-on-black"),
    ("brand_tagline_sky", "Brand tagline", "\u201csunce. palme. pogled.\u201d over the terrace"),
    ("event_matine_flyer", "Matine event flyer", "\u201cPalma Pool Club Matine\u201d invite graphic"),
    ("menu_pricing", "Official price list", "Ulaznice \u2014 weekday/weekend, child rates"),
    ("menu_food", "Food menu", "Burgers, wraps, snacks, desserts"),
    ("menu_drinks", "Drink menu", "Coffee, soft drinks, cocktails"),
]
gallery_html = []
for fname, title, sub in GALLERY_ITEMS:
    gallery_html.append(f"""<figure class="g-item">
      <div class="g-frame"><img src="{img_uri(fname)}" alt="{esc(title)}" loading="lazy"/></div>
      <figcaption><span class="g-title">{esc(title)}</span><span class="g-sub">{esc(sub)}</span></figcaption>
    </figure>""")
GALLERY_HTML = "\n".join(gallery_html)

print("Rows:", len(rows), "Gallery items:", len(gallery_html))

with open(os.path.join(BASE, "_post_rows.html"), "w", encoding="utf-8") as f:
    f.write(POST_ROWS)
with open(os.path.join(BASE, "_gallery.html"), "w", encoding="utf-8") as f:
    f.write(GALLERY_HTML)
with open(os.path.join(BASE, "_fonts_css_final.txt"), "w", encoding="utf-8") as f:
    f.write(FONTS_CSS)

print("stage 2 done")
