/**
 * Converts source photography into /public/images as JPEG.
 *
 * PNG is the wrong container for photographs — the sources are 1.8–2.8 MB
 * each and next/image re-encodes to WebP on delivery anyway, so shipping PNG
 * only bloats the repo and slows builds. Quality 92 mozjpeg is visually
 * indistinguishable at these sizes.
 *
 * Re-run after dropping new originals into the project root.
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";

const SRC = "c:/Users/RoPe/PalmaPoolClub";
const OUT = "c:/Users/RoPe/PalmaPoolClub/site/public/images";

/** source file -> slot id */
const jobs = [
  // Owner-supplied originals, text-free. These replace the earlier
  // machine-cropped versions — better framing, higher resolution.
  ["radnovremenotekst.png", "terrace-cafe-frontage"],
  ["radnidaninotekst.png", "deck-loungers-valley"],
  ["vikendcenovniknotekst.png", "pool-umbrellas-roof"],
];

for (const [src, slot] of jobs) {
  const from = `${SRC}/${src}`;
  const to = `${OUT}/${slot}.jpg`;
  const before = (await stat(from)).size;
  const info = await sharp(from)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(to);
  console.log(
    `${src.padEnd(28)} -> ${slot.padEnd(24)} ${info.width}x${info.height}  ${(before / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`
  );
}
