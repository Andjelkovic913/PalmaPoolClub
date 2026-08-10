"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "./Button";
import { images } from "@/content/images";
import { blurb, brand } from "@/content/copy";

/**
 * Art-directed hero.
 *
 * Each orientation gets an image actually shot for it:
 *   desktop → terrace-cafe-frontage (1653×951, 1.74)
 *   mobile  → hero-aerial-wide      (942×1670, 0.56)
 *
 * terrace-cafe-frontage is the only true wide landscape in the set and the
 * highest-resolution source available, so it fills a 1440-wide hero without
 * upscaling — a desktop hero is ~1.82 and this is 1.74, so it barely crops.
 *
 * Parallax is a small transform on the image only, driven by rAF, and is
 * skipped entirely under prefers-reduced-motion — no listener is attached.
 * `transform-origin: bottom` means the 5% scale-up crops sky off the top
 * rather than trimming the café frontage and valley off the bottom.
 *
 * NOTE: the hero treatment is not settled — see OPEN_QUESTIONS.md #18.
 * Parked deliberately so the remaining pages can be built.
 */
export function Hero() {
  const desktop = images["terrace-cafe-frontage"];
  const mobile = images["hero-aerial-wide"];

  const imgRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = imgRef.current;
        if (!el) return;
        const offset = Math.min(window.scrollY * 0.2, 50);
        el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden md:min-h-[92vh]">
      <div
        ref={imgRef}
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ transformOrigin: "bottom center" }}
      >
        {/* Mobile: the tall drone shot. */}
        <Image
          src={mobile.src!}
          alt={mobile.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: mobile.focal }}
          className="object-cover md:hidden"
        />
        {/* Desktop: the eye-level terrace landscape. */}
        <Image
          src={desktop.src!}
          alt={desktop.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: desktop.focal }}
          className="hidden object-cover md:block"
        />
      </div>

      {/* Two light directional scrims. A single heavy bottom wash crushed the
          café frontage, the loungers and the valley — the reason the
          photograph works. These darken only where the text sits. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-1/2 bg-gradient-to-r from-black/45 via-black/10 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1280px] px-5 pb-16 md:px-10 md:pb-24">
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
          {brand.tagline}
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
          {blurb.intro}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/book">Rezerviši ležaljku</ButtonLink>
          <ButtonLink
            href="/pricing"
            variant="secondary"
            className="border-white/70 text-white hover:bg-white/15"
          >
            Pogledaj cenovnik
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
