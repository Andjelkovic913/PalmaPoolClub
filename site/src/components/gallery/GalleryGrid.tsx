"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ImageSlot } from "../ImageSlot";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Eyebrow, Section } from "../Section";
import { Lightbox } from "./Lightbox";
import { flattenGallery, type GalleryGroup } from "@/content/gallery";
import { images } from "@/content/images";

/**
 * Grouped masonry, CSS multi-column.
 *
 * Multi-column rather than a row-span grid because this set spans a 3× aspect
 * range (0.56 portrait to 1.80 landscape) and the group sizes are 10 / 2 / 2.
 * A uniform grid has to crop every cell to a chosen shape AND needs its cell
 * count to divide exactly, or it renders holes — a bug this project has
 * already paid for once. Columns balance any count and let every photograph
 * keep its true aspect ratio, so nothing is cropped and the `focal` positions
 * in the manifest are not even needed here.
 *
 * Column width tops out around 390px at 1440 (1280 wrapper − padding − gaps,
 * ÷3), which keeps the four 511px frame grabs under their `maxRenderWidth`
 * at every breakpoint. Check that again before moving to two columns.
 */
export function GalleryGrid({
  groups,
  layout = "masonry",
}: {
  groups: GalleryGroup[];
  /**
   * `masonry` — CSS columns, natural aspect ratios, nothing cropped.
   * `grid`    — uniform 3:2 cells, `object-cover` aimed by the manifest's
   *             `focal`. Tidier edges, but see the cost noted on `cellClass`.
   */
  layout?: "masonry" | "grid";
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const isGrid = layout === "grid";

  /* Derived from the groups actually being rendered, not imported as a fixed
     list: the viewer indexes into this, so a list built from a different
     layout would open the wrong photograph. */
  const flat = useMemo(() => flattenGallery(groups), [groups]);

  /* Thumbnails keyed by their index in the flat list. Losing focus to <body>
     on close strands a keyboard user at the top of the document. */
  const triggers = useRef<Record<number, HTMLButtonElement | null>>({});

  /**
   * Focus returns to the thumbnail of the image being VIEWED, which is the
   * opening one only if the visitor never used the arrow keys.
   *
   * The usual dialog rule is "restore to the invoking element", and that is
   * what happens in the common case. But once someone has arrowed from image 3
   * to image 14, dropping them back on 3 fights them twice: focus disagrees
   * with what they were just looking at, and the browser scrolls the page back
   * up to a thumbnail they had navigated away from. Focus is not lost either
   * way — it lands on a real, related control — so the tie goes to keeping
   * focus and viewport in step. Asserted both ways in scripts/check-lightbox.mjs.
   */
  const close = useCallback(() => {
    setOpenAt((current) => {
      if (current !== null) triggers.current[current]?.focus();
      return null;
    });
  }, []);

  return (
    <>
      {groups.map((group) => (
        <Section key={group.id} id={group.id} className="border-b border-border">
          {group.label && <Eyebrow>{group.label}</Eyebrow>}

          {/* masonry: `columns-*`, and each child MUST carry
                `break-inside-avoid` or a tall photo splits across a column
                boundary and renders as two halves.
              grid: uniform 3:2 cells. A ragged last row is fine — items flow
                left to right, so 14 items in 4 columns simply end early. This
                is not the row-span layout that produced holes before. */}
          <div
            className={`${
              isGrid
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                : "gap-4 columns-1 sm:columns-2 lg:columns-3"
            } ${group.label ? "mt-6" : ""}`}
          >
            {group.items.map((id, i) => {
              const flatIndex = flat.indexOf(id);
              const entry = images[id];

              /* In grid mode the cell dictates the shape and the photo is
                 cropped into it by `object-cover`, aimed by the manifest's
                 `focal`. That is the whole trade: a 0.56 portrait keeps only
                 ~37% of its frame in a 1.5 cell. See PROGRESS.md. */
              const wrapClass = isGrid ? "" : "mb-4 break-inside-avoid";

              /* A slot with no file is NOT a button: there is nothing to
                 enlarge, and offering a control that opens an empty viewer is
                 worse than showing the gap plainly. It still occupies a cell,
                 which is the entire point — the gap is the message. */
              if (!entry.src) {
                return (
                  <Reveal
                    key={id}
                    delay={Math.min(i, 4) * 50}
                    className={wrapClass}
                  >
                    {isGrid ? (
                      <div className="relative aspect-3/2 overflow-hidden rounded-sm">
                        <ImageSlot id={id} fill />
                      </div>
                    ) : (
                      <ImageSlot id={id} className="rounded-sm" />
                    )}
                  </Reveal>
                );
              }

              return (
                <Reveal
                  key={id}
                  delay={Math.min(i, 4) * 50}
                  className={wrapClass}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      triggers.current[flatIndex] = el;
                    }}
                    onClick={() => setOpenAt(flatIndex)}
                    aria-label={`Otvori fotografiju: ${entry.alt}`}
                    className={`group block w-full cursor-pointer overflow-hidden rounded-sm ${
                      isGrid ? "relative aspect-3/2" : ""
                    }`}
                  >
                    <Photo
                      id={id}
                      fill={isGrid}
                      sizes={
                        isGrid
                          ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      }
                      className={`transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:scale-105 ${
                        isGrid ? "" : "h-auto w-full"
                      }`}
                    />
                  </button>
                </Reveal>
              );
            })}
          </div>
        </Section>
      ))}

      {openAt !== null && (
        <Lightbox
          items={flat}
          index={openAt}
          onClose={close}
          onIndexChange={setOpenAt}
        />
      )}
    </>
  );
}
