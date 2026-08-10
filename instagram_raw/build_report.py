# -*- coding: utf-8 -*-
import json, os, html

BASE = os.path.dirname(os.path.abspath(__file__))
SELECTED = r"C:\Users\RoPe\PalmaPoolClub\selected"
FONTS = r"C:\Users\RoPe\AppData\Local\Temp\claude\C--Users-RoPe\bc06a868-a909-4466-9212-3618dfc180b4\scratchpad\fonts"
OUT = r"C:\Users\RoPe\AppData\Local\Temp\claude\C--Users-RoPe\bc06a868-a909-4466-9212-3618dfc180b4\scratchpad\palma_report.html"

def read_b64(path):
    with open(path, "r", encoding="ascii") as f:
        return f.read().strip()

def font_face(family, weight, style, lat_ext_b64, lat_b64):
    return f"""
@font-face {{
  font-family: '{family}';
  font-style: {style};
  font-weight: {weight};
  font-display: swap;
  src: url(data:font/woff2;base64,{lat_ext_b64}) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}}
@font-face {{
  font-family: '{family}';
  font-style: {style};
  font-weight: {weight};
  font-display: swap;
  src: url(data:font/woff2;base64,{lat_b64}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}}"""

fonts_css = ""
fonts_css += font_face("Fraunces", 600, "normal", read_b64(os.path.join(FONTS, "fr600-ext.b64")), read_b64(os.path.join(FONTS, "fr600-lat.b64")))
fonts_css += font_face("Fraunces", 500, "italic", read_b64(os.path.join(FONTS, "fr500i-ext.b64")), read_b64(os.path.join(FONTS, "fr500i-lat.b64")))
fonts_css += font_face("Public Sans", 400, "normal", read_b64(os.path.join(FONTS, "ps400-ext.b64")), read_b64(os.path.join(FONTS, "ps400-lat.b64")))
fonts_css += font_face("Public Sans", 600, "normal", read_b64(os.path.join(FONTS, "ps600-ext.b64")), read_b64(os.path.join(FONTS, "ps600-lat.b64")))

def img_uri(name):
    return f"data:image/jpeg;base64,{read_b64(os.path.join(SELECTED, 'b64', name + '.b64'))}"

with open(os.path.join(BASE, "post_log.json"), encoding="utf-8") as f:
    posts = json.load(f)

print("Loaded", len(posts), "posts. Fonts CSS length:", len(fonts_css))

with open(os.path.join(BASE, "_fonts_css.txt"), "w", encoding="utf-8") as f:
    f.write(fonts_css)

print("done stage 1")
