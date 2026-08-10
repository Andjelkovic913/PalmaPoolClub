/**
 * `tnum` is absent from both fonts, but Source Sans 3 exposes `pnum`.
 * That usually means the DEFAULT figures are already tabular and `pnum` is the
 * opt-in to proportional. Decide it by measuring the advance width of each
 * digit: if all ten are identical, the default figures are tabular and the
 * pricing tables align with no feature settings at all.
 */
import * as fontkit from "fontkit";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const dir = "c:/Users/RoPe/PalmaPoolClub/site/.next/static/media";
const files = (await readdir(dir)).filter((f) => f.endsWith(".woff2"));

const byFamily = new Map();

for (const f of files) {
  let font;
  try {
    font = fontkit.openSync(join(dir, f));
  } catch {
    continue;
  }
  if (!font.hasGlyphForCodePoint(48)) continue; // needs digits

  const family = (font.familyName ?? "?").replace(
    /\s+(Thin|ExtraLight|Light|Regular|Medium|SemiBold|Bold|ExtraBold|Black)$/,
    ""
  );
  // keep the richest file per family
  const prev = byFamily.get(family);
  if (prev && prev.font.numGlyphs >= font.numGlyphs) continue;
  byFamily.set(family, { font, f });
}

for (const [family, { font, f }] of byFamily) {
  const upm = font.unitsPerEm;
  const widths = [];
  for (let d = 0; d <= 9; d++) {
    const g = font.glyphForCodePoint(48 + d);
    widths.push(Math.round((g.advanceWidth / upm) * 1000));
  }
  const uniq = [...new Set(widths)];
  console.log(`\n=== ${family} ===  (${f})`);
  console.log(`  digit widths (per 1000em): ${widths.join(" ")}`);
  console.log(
    `  ${uniq.length === 1 ? `TABULAR BY DEFAULT — all digits ${uniq[0]}` : `PROPORTIONAL BY DEFAULT — ${uniq.length} distinct widths: ${uniq.sort((a, b) => a - b).join(", ")}`}`
  );
}
