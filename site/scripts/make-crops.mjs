/**
 * SUPERSEDED — kept only as a record of how the first pass was done.
 *
 * The original approach cropped clean photography out of the marketing
 * graphics (`radnidani.png`, `radnovreme.png`) by cutting inside their text
 * bands. That worked, but it guessed the framing and it threw away most of
 * each frame — the terrace shot came out 1122×740 when the real photograph is
 * 1653×951, and the loungers shot came out as a 1.52 landscape slice when the
 * actual image is a 0.80 portrait with a completely different composition.
 *
 * The owner then supplied the untouched originals:
 *
 *   radnovremenotekst.png       1653×951   terrace, canopy, cafe frontage
 *   radnidaninotekst.png        1122×1402  pool edge, loungers, valley
 *   vikendcenovniknotekst.png   1124×1399  pool corner, umbrellas, roof
 *
 * Those are what ship. `scripts/import-images.mjs` converts them.
 * Do not run this file.
 */
throw new Error(
  "make-crops.mjs is superseded by the owner-supplied originals. See scripts/import-images.mjs."
);
