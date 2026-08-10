import { images, type ImageSlotId } from "@/content/images";

/**
 * Placeholder for a photo that does not exist yet.
 *
 * Deliberately visible and slightly ugly — a warm-sand block printing its own
 * slot ID. It must never be mistaken for a design element, and it must never
 * be quietly replaced with stock or AI imagery (BUILD_PROMPT.md §0 rule 2).
 */
export function ImageSlot({
  id,
  className = "",
  fill = false,
}: {
  id: ImageSlotId;
  className?: string;
  /** Match <Photo fill> — stretch to a positioned parent instead of setting
      its own aspect ratio, so a missing photo leaves no hole in a grid. */
  fill?: boolean;
}) {
  const entry = images[id];
  const ratio = `${entry.width} / ${entry.height}`;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed border-teak/50 bg-sand p-4 text-center ${fill ? "absolute inset-0" : ""} ${className}`}
      style={fill ? undefined : { aspectRatio: ratio }}
      role="img"
      aria-label={entry.alt}
    >
      <span className="eyebrow text-teak">Nema fotografije</span>
      <code className="font-mono text-xs text-ink/60">{id}</code>
    </div>
  );
}
