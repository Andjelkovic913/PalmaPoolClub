/**
 * WCAG relative-luminance contrast, used to PROVE the palette passes rather
 * than assert it. The styleguide renders these numbers, and the acceptance
 * checklist requires body text at 4.5:1 in both day and night mode.
 */

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastVerdict = {
  ratio: number;
  /** Normal-size body text. */
  passesAA: boolean;
  /** ≥24px, or ≥18.66px bold. */
  passesAALarge: boolean;
};

export function judge(fg: string, bg: string): ContrastVerdict {
  const ratio = contrast(fg, bg);
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAALarge: ratio >= 3,
  };
}
