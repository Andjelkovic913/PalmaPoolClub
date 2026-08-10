"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "./Button";
import { PalmMark } from "./Logo";
import { bookingCta, navLinks } from "@/content/nav";

/**
 * Sticky nav. On mobile the links collapse into a full-screen drawer, but the
 * "Rezerviši" CTA stays visible in the bar itself — booking is the one action
 * that must never be a tap away (BUILD_PROMPT.md §9 Phase 2).
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll and allow Esc while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
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
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
            className="cursor-pointer rounded-sm p-2 text-text transition-colors duration-200 hover:text-accent lg:hidden"
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-drawer"
          className="fixed inset-x-0 top-[61px] bottom-0 z-40 overflow-y-auto bg-bg px-5 py-8 lg:hidden"
        >
          <nav aria-label="Glavna navigacija (mobilna)">
            <ul className="flex flex-col gap-1">
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
                      className={`block cursor-pointer border-b border-border py-4 font-display text-2xl transition-colors duration-200 hover:text-accent ${
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
        </div>
      )}
    </header>
  );
}
