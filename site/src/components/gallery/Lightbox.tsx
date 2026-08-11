"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { images, type ImageSlotId } from "@/content/images";

/**
 * Accessible image viewer. Explicitly NOT a carousel (MASTER.md anti-patterns,
 * BUILD_PROMPT.md §9 Phase 5): it does not exist until a visitor asks for it,
 * it never advances on its own, and it has no dots.
 *
 * What "accessible" has to mean here, all four verified by keyboard:
 *
 *   - `role="dialog"` + `aria-modal` + a label, so a screen reader announces a
 *     layer rather than reading the page underneath.
 *   - Focus MOVES IN on open and is TRAPPED: Tab cycles the three controls and
 *     cannot escape to the page behind. On close it goes back to the thumbnail
 *     that opened it — the caller passes `onClose`, which restores it.
 *   - Esc closes; ArrowLeft/ArrowRight step. Both are the documented gestures
 *     and neither requires a pointer.
 *   - Background scroll is locked while open, otherwise the page behind drifts
 *     under the overlay.
 *
 * Navigation WRAPS. With no dots there is no position indicator, so a hard
 * stop at either end is silent and reads as a broken key.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  /** Every image in the gallery, in display order. */
  items: ImageSlotId[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const entry = images[items[index]];
  const many = items.length > 1;

  const step = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange]
  );

  // Move focus in. The close button is the safest landing point — it is the
  // one control every user needs and it states what the layer is.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Lock the page behind. Same approach as the nav drawer.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && many) {
        e.preventDefault();
        step(-1);
        return;
      }
      if (e.key === "ArrowRight" && many) {
        e.preventDefault();
        step(1);
        return;
      }

      // The trap. Querying on each Tab rather than caching the list keeps it
      // correct when the prev/next buttons are absent (a single-image gallery).
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])"
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [many, onClose, step]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Pregled fotografije"
      className="fixed inset-0 z-[60] flex flex-col bg-night/95 p-4 md:p-8"
      /* Clicking the backdrop closes. The figure below stops propagation, so
         clicking the photograph itself does not. */
      onClick={onClose}
    >
      <div className="flex shrink-0 items-center justify-between gap-4">
        <p className="tabular text-sm text-night-text/70">
          {index + 1} / {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Zatvori pregled"
          className="cursor-pointer rounded-sm p-2 text-night-text transition-colors duration-200 hover:text-gold-bright"
        >
          <X size={24} aria-hidden />
        </button>
      </div>

      <figure
        className="flex min-h-0 grow flex-col items-center justify-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          /* `entry.src` is non-null: content/gallery.ts filters empty slots
             out before they can reach this component. */
          src={entry.src as string}
          alt={entry.alt}
          width={entry.width}
          height={entry.height}
          sizes="100vw"
          className="max-h-[75vh] w-auto object-contain"
        />
        <figcaption className="max-w-2xl text-center text-sm text-night-text/80">
          {entry.alt}
        </figcaption>
      </figure>

      {many && (
        <div
          className="flex shrink-0 items-center justify-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Prethodna fotografija"
            className="cursor-pointer rounded-sm border border-gold/40 p-3 text-night-text transition-colors duration-200 hover:border-gold-bright hover:text-gold-bright"
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Sledeća fotografija"
            className="cursor-pointer rounded-sm border border-gold/40 p-3 text-night-text transition-colors duration-200 hover:border-gold-bright hover:text-gold-bright"
          >
            <ChevronRight size={22} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
