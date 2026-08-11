"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { ButtonLink } from "./Button";
import { InstagramIcon } from "./icons/InstagramIcon";
import { PalmMark } from "./Logo";
import { business } from "@/content/business";
import { bookingCta, navLinks } from "@/content/nav";

/**
 * Sticky nav. On mobile the links collapse into a full-screen drawer, but the
 * "Rezerviši" CTA stays visible in the bar itself — booking is the one action
 * that must never be a tap away (BUILD_PROMPT.md §9 Phase 2).
 */
/** Must match the drawer animation duration in globals.css. */
const DRAWER_MS = 400;

export function Nav() {
  /* `open` means "in the DOM". `closing` means "in the DOM but on its way
     out". Both are needed because a drawer that unmounts the instant it is
     dismissed has nothing left to animate — it just disappears, which is
     exactly what it used to do. Keeping it mounted for one animation gives
     the exit somewhere to happen. */
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  /* Set the first time the button is pressed, and never unset. The closing
     animation is gated on it — otherwise it would play on first paint and the
     burger would assemble itself in front of someone who never touched it. */
  const [touched, setTouched] = useState(false);
  const pathname = usePathname();

  /** True while the drawer is open AND not already leaving. Drives the burger
      and `aria-expanded`, so the ✕ unfolds as the panel slides away rather
      than waiting for it to finish. */
  const shown = open && !closing;

  const closeDrawer = useCallback(() => {
    setClosing(true);
  }, []);

  /* Unmount once the slide-out has finished. `onAnimationEnd` does this in the
     normal case; this timer is the backstop for when it never fires — a
     background tab, or an interrupted animation. Without it the drawer could
     sit closing forever and the page would stay scroll-locked. */
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, DRAWER_MS + 120);
    return () => clearTimeout(t);
  }, [closing]);

  /* Close on navigation. Cut, not animated: the page underneath is already
     changing, so sliding a panel off a screen that is being replaced reads as
     lag rather than polish. */
  useEffect(() => {
    setOpen(false);
    setClosing(false);
  }, [pathname]);

  // Lock scroll and allow Esc while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeDrawer]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 py-3 md:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-accent"
          aria-label="Palma Pool Club — početna"
        >
          <PalmMark className="w-9" />
          <span className="font-display text-lg tracking-wide text-text">
            Palma
          </span>
        </Link>

        <nav aria-label="Glavna navigacija" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`cursor-pointer text-sm transition-colors duration-200 hover:text-accent ${
                      active
                        ? "text-accent underline decoration-2 underline-offset-8"
                        : "text-text"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Stays in the bar at every breakpoint. */}
          <ButtonLink href={bookingCta.href} className="px-4 py-2 text-xs md:px-6 md:py-3 md:text-sm">
            {bookingCta.label}
          </ButtonLink>

          <button
            type="button"
            onClick={() => {
              setTouched(true);
              if (shown) closeDrawer();
              else {
                setClosing(false);
                setOpen(true);
              }
            }}
            aria-expanded={shown}
            aria-controls="mobile-drawer"
            aria-label={shown ? "Zatvori meni" : "Otvori meni"}
            className="cursor-pointer rounded-sm p-2 text-text transition-colors duration-200 hover:text-accent lg:hidden"
          >
            {/* Animated in CSS rather than swapped between two Lucide glyphs —
                the bars converge and rotate into the cross. See `.burger` in
                globals.css. The button keeps its aria-label, so what a screen
                reader announces does not depend on the drawing. */}
            <span
              /**
               * `key` FORCES A REMOUNT ON EVERY TOGGLE, and it is load-bearing.
               *
               * Opening and closing run the same keyframes, one of them
               * reversed. A browser only restarts a CSS animation when the
               * animation-NAME changes — flipping `animation-direction` on an
               * animation that has already finished does nothing at all. So
               * the morph played once per page load and every click after that
               * was dead until a refresh.
               *
               * Remounting three empty spans is cheap and keeps one set of
               * keyframes; the alternative was duplicating every keyframe
               * block under a second name purely to make the name differ.
               */
              key={String(shown)}
              className="burger"
              data-open={shown}
              data-touched={touched}
              aria-hidden
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      </header>

      {/**
       * RENDERED OUTSIDE <header> ON PURPOSE. Do not move it back in.
       *
       * The header carries `backdrop-blur-sm`, and `backdrop-filter` makes an
       * element a containing block for its `position: fixed` descendants. A
       * drawer nested inside it was therefore positioned against the 61px-tall
       * header instead of the viewport, so `top-[61px] bottom-0` resolved to
       * ZERO height — the links spilled out of a collapsed, scroll-clipped box
       * and the page painted straight over them. On a phone the menu looked
       * like it opened to nothing.
       *
       * Out here it is positioned against the viewport, which is what
       * `fixed inset-0` was always meant to do. `z-40` keeps it below the
       * sticky header (`z-50`) so the bar with the ✕ stays on top of it, and
       * `pt-24` clears that bar so the first link is never hidden behind it.
       */}
      {open && (
        <>
          {/* Scrim. Tapping it closes — the gesture people already expect from
              a side panel, and it means the page behind stays visible so the
              menu reads as a layer rather than a different screen. */}
          <div
            className="drawer-scrim fixed inset-0 z-30 lg:hidden"
            data-closing={closing}
            onClick={closeDrawer}
            aria-hidden
          />

          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Glavna navigacija"
            data-closing={closing}
            /* The panel is the last thing to finish moving, so it is what
               decides the drawer is gone. The timer in the effect above is
               only the backstop for when this never fires. */
            onAnimationEnd={() => {
              if (closing) {
                setOpen(false);
                setClosing(false);
              }
            }}
            /* `pt-20` clears the sticky bar; the tighter spacing is what makes
               all nine rows fit on a 360×640 Android without scrolling. The
               panel still scrolls if a link is ever added. */
            className="drawer-panel fixed top-0 right-0 bottom-0 z-40 flex w-[82%] max-w-[340px] flex-col overflow-y-auto border-l border-border bg-bg px-6 pt-20 pb-6 lg:hidden"
          >
            <nav aria-label="Glavna navigacija (mobilna)">
              <ul className="flex flex-col">
                {navLinks.map((l) => {
                  const active =
                    l.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={`block cursor-pointer border-b border-border py-3.5 font-display text-2xl transition-colors duration-200 hover:text-accent ${
                          active ? "text-accent" : "text-text"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Pushed to the bottom of the panel. The phone is how this venue
                has always taken bookings — all 31 captions say so — and on a
                phone it is one tap. It belonged in here from the start. */}
            <div className="mt-auto pt-8">
              <a
                href={`tel:${business.phone.href}`}
                className="flex cursor-pointer items-center gap-3 text-lg transition-colors duration-200 hover:text-accent"
              >
                <Phone size={18} className="shrink-0 text-teak" aria-hidden />
                <span className="tabular">{business.phone.display}</span>
              </a>
              <a
                href={business.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex cursor-pointer items-center gap-3 text-lg transition-colors duration-200 hover:text-accent"
              >
                <InstagramIcon size={18} className="shrink-0 text-teak" />
                {business.instagram.handle}
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
