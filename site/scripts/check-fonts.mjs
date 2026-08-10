/**
 * Proves two claims about the chosen fonts that BUILD_PROMPT.md §2 requires,
 * by reading the actual woff2 files next/font downloaded:
 *   1. full Serbian Latin diacritics (č ć ž š đ Đ) exist as real glyphs
 *   2. the sans exposes tabular numerals (`tnum`)
 *
 * next/font emits ONE FILE PER SUBSET, so a family's coverage is the union
 * across its files — a latin-only file legitimately lacks č/ć/ž/š/đ.
 */
import * as fontkit from "fontkit";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const dir = "c:/Users/RoPe/PalmaPoolClub/site/.next/static/media";
const SERBIAN = [..."čćžšđČĆŽŠĐ"];
const files = (await readdir(dir)).filter((f) => f.endsWith(".woff2"));

/** family -> { covered:Set<string>, features:Set<string>, files:[] } */
const fam = new Map();

for (const f of files) {
  let font;
  try {
    font = fontkit.openSync(join(dir, f));
  } catch {
    continue;
  }
  // Normalise "Source Sans 3 ExtraLight" -> "Source Sans 3"
  const family = (font.familyName ?? "?").replace(
    /\s+(Thin|ExtraLight|Light|Regular|Medium|SemiBold|Bold|ExtraBold|Black)$/,
    ""
  );

  if (!fam.has(family))
    fam.set(family, { covered: new Set(), features: new Set(), files: [] });
  const rec = fam.get(family);

  const present = SERBIAN.filter((ch) =>
    font.hasGlyphForCodePoint(ch.codePointAt(0))
  );
  present.forEach((c) => rec.covered.add(c));
  (font.availableFeatures ?? []).forEach((x) => rec.features.add(x));
  rec.files.push({ f, n: font.numGlyphs, present: present.length });
}

let ok = true;
for (const [family, r] of fam) {
  const missing = SERBIAN.filter((c) => !r.covered.has(c));
  const diaOk = missing.length === 0;
  if (!diaOk) ok = false;

  console.log(`\n=== ${family} === (${r.files.length} subset files)`);
  for (const x of r.files)
    console.log(`    ${x.f}  glyphs=${x.n}  serbian=${x.present}/10`);
  console.log(
    `  DIACRITICS  ${diaOk ? "PASS — all of čćžšđ ČĆŽŠĐ present" : "FAIL — missing " + missing.join(" ")}`
  );
  console.log(`  tnum        ${r.features.has("tnum") ? "PRESENT" : "ABSENT"}`);
  console.log(`  lnum        ${r.features.has("lnum") ? "present" : "absent"}`);
  console.log(
    `  features    ${[...r.features].sort().join(", ") || "(none)"}`
  );
}

console.log(`\nDIACRITICS OVERALL: ${ok ? "PASS" : "FAIL"}`);
