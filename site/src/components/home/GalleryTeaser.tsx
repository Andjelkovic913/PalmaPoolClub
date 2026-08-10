import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../Button";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Eyebrow, Section, SectionHeading } from "../Section";
import type { ImageSlotId } from "@/content/images";

/**
 * Cell shape follows the SOURCE ORIENTATION — that is the whole trick here.
 *
 * The set splits cleanly in two: five tall drone shots at ~0.56, and the
 * landscapes at 1.5–1.8. Earlier versions picked a layout first and let
 * `object-cover` absorb the mismatch, which put a 941×1670 portrait into a
 * 3.7:1 letterbox, and a sky-heavy 1.52 crop into a 1.78 feature cell where it
 * read as mostly sky.
 *
 *   row 1  four TALL cells   308×352 → 0.875   holds the 0.56 portraits
 *   row 2  four WIDE cells   308×170 → 1.81    holds the 1.5–1.8 landscapes
 *
 * Each image now loses ~35% of its long edge instead of ~85%, and every crop
 * is aimed by the `focal` object-position in the manifest.
 *
 * 4 cols × 3 rows = 12 cells; 4 tall (2 each) + 4 wide (1 each) = 12. Exact.
 *
 * A single cell is ~308px at 1440, so the four 511px frame grabs are never
 * upscaled — check `maxRenderWidth` before moving one into a tall cell.
 */
/** Portraits. The two 0.80 eye-level shots fit a 0.875 cell almost exactly. */
const tallTiles: ImageSlotId[] = [
  "deck-loungers-valley", // 0.80
  "foodtruck-golden-hour", // 0.56
  "pool-umbrellas-roof", // 0.80
  "aerial-top-down", // 0.56
];

/** Landscapes, all within 1.74–1.80 against a 1.81 cell. Near-exact fits. */
const wideTiles: ImageSlotId[] = [
  "mushroom-float", // 1.77
  "pool-panorama-loungers", // 1.76
  "terrace-rooftops", // 1.77
  "deck-umbrellas", // 1.80
];

function Tile({
  id,
  tall,
  delay,
}: {
  id: ImageSlotId;
  tall?: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className={tall ? "row-span-2" : "row-span-1"}>
      <div className="group relative h-full w-full overflow-hidden rounded-sm">
        <Photo
          id={id}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:scale-105"
        />
      </div>
    </Reveal>
  );
}

export function GalleryTeaser() {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Galerija</Eyebrow>
          <SectionHeading>Kako izgleda kod nas</SectionHeading>
        </div>
        <ButtonLink href="/gallery" variant="ghost">
          Pogledaj galeriju
          <ArrowRight size={16} aria-hidden />
        </ButtonLink>
      </div>

      <div className="mt-10 grid auto-rows-[110px] grid-flow-row-dense grid-cols-2 gap-3 sm:auto-rows-[140px] sm:grid-cols-4 lg:auto-rows-[170px]">
        {tallTiles.map((id, i) => (
          <Tile key={id} id={id} tall delay={i * 50} />
        ))}
        {wideTiles.map((id, i) => (
          <Tile key={id} id={id} delay={(i + 4) * 50} />
        ))}
      </div>
    </Section>
  );
}
