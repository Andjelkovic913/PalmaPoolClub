import json
import re
import os
from datetime import datetime
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
RAW_PATH = os.path.join(BASE, "palmapoolclub_posts_raw.json")
IMAGES_DIR = os.path.join(BASE, "images")

with open(RAW_PATH, "r", encoding="utf-8") as f:
    posts = json.load(f)

DESC_RE = re.compile(
    r'^([\d,]+) likes?, ([\d,]+) comments? - palmapoolclub on ([A-Za-z]+ \d{1,2}(?:, \d{4})?): "(.*)"\.?\s*$',
    re.DOTALL,
)

MONTHS = {m: i for i, m in enumerate(
    ["January","February","March","April","May","June","July","August","September","October","November","December"], start=1)}

def parse_date(date_str, default_year=2026):
    m = re.match(r"([A-Za-z]+) (\d{1,2})(?:, (\d{4}))?", date_str)
    if not m:
        return None
    month_name, day, year = m.groups()
    month = MONTHS.get(month_name)
    if not month:
        return None
    year = int(year) if year else default_year
    return f"{year:04d}-{month:02d}-{int(day):02d}"

structured = []
for p in posts:
    shortcode = p["path"].split("/")[-1]
    kind = "reel" if p["path"].startswith("reel/") else "post"
    og_desc = p.get("og_description") or ""
    m = DESC_RE.match(og_desc.strip())
    likes = comments = date_iso = caption = None
    if m:
        likes = int(m.group(1).replace(",", ""))
        comments = int(m.group(2).replace(",", ""))
        date_iso = parse_date(m.group(3))
        caption = m.group(4).strip()
    entry = {
        "shortcode": shortcode,
        "type": kind,
        "url": p["url"],
        "date": date_iso,
        "likes": likes,
        "comments": comments,
        "caption": caption,
        "image_url": p.get("image_url"),
        "image_file": None,
    }
    structured.append(entry)

# sort chronologically
structured.sort(key=lambda e: (e["date"] or "", e["shortcode"]))

# download images
os.makedirs(IMAGES_DIR, exist_ok=True)
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
for e in structured:
    if not e["image_url"]:
        continue
    fname = f'{e["date"] or "unknown"}_{e["shortcode"]}.jpg'
    fpath = os.path.join(IMAGES_DIR, fname)
    try:
        req = urllib.request.Request(e["image_url"], headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp, open(fpath, "wb") as out:
            out.write(resp.read())
        e["image_file"] = fname
        print(f"OK  {fname}")
    except Exception as ex:
        print(f"FAIL {fname}: {ex}")

with open(os.path.join(BASE, "post_log.json"), "w", encoding="utf-8") as f:
    json.dump(structured, f, ensure_ascii=False, indent=2)

print(f"\nDone. {len(structured)} posts processed, log written to post_log.json")
