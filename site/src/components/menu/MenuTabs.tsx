"use client";

import { useRef, useState, type ReactNode } from "react";

type TabKey = "hrana" | "pice";

const TABS: { key: TabKey; label: string }[] = [
  { key: "hrana", label: "Hrana" },
  { key: "pice", label: "Piće" },
];

/**
 * Food / drinks switch for `/menu`.
 *
 * ── BOTH PANELS ARE ALWAYS IN THE DOM ──────────────────────────────────────
 * The inactive panel is hidden with the `hidden` attribute, never unmounted.
 * This is not a detail: `PRD.md` problem #3 is that this venue's prices and
 * menu exist only as JPEGs, and the whole project is the fix. Conditionally
 * rendering one panel would strip half the menu out of the HTML source —
 * breaking the price grep in PROGRESS.md's health check, and taking the drinks
 * card back out of the index it was built to enter.
 *
 * ── IT ALSO WORKS WITHOUT JAVASCRIPT ───────────────────────────────────────
 * The server renders the drinks panel already `hidden`, so there is no
 * hydration flash and no layout shift. If JS never arrives, the <noscript>
 * rule below un-hides both panels and drops the (now useless) tabs, leaving a
 * plain stacked menu. The one page a guest is most likely to open on a bad
 * mobile connection stays complete either way.
 *
 * ── KEYBOARD ───────────────────────────────────────────────────────────────
 * Full ARIA tab pattern: roving tabindex, Left/Right to move between tabs,
 * Home/End to jump. Only the active tab is in the tab sequence, so Tab moves
 * from the tablist into the panel rather than through every tab.
 */
export function MenuTabs({
  panels,
}: {
  /** Server-rendered content, passed through — the menu itself stays RSC. */
  panels: Record<TabKey, ReactNode>;
}) {
  const [active, setActive] = useState<TabKey>("hrana");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.key === active);
    let next: number | null = null;

    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;

    e.preventDefault();
    const key = TABS[next].key;
    setActive(key);
    // Follow-focus: the pattern expects focus to move with the selection.
    tabRefs.current[key]?.focus();
  };

  return (
    <>
      <noscript>
        {/* Without JS the buttons cannot switch anything, so show everything
            and hide the controls rather than trapping the drinks card. */}
        <style>{`
          [data-menu-panel] { display: block !important; }
          [data-menu-tablist] { display: none !important; }
        `}</style>
      </noscript>

      <div
        role="tablist"
        aria-label="Meni — hrana ili piće"
        data-menu-tablist
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {TABS.map(({ key, label }) => {
          const selected = key === active;
          return (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[key] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={selected}
              aria-controls={`panel-${key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(key)}
              className={`cursor-pointer rounded-sm px-6 py-3 font-display text-lg tracking-wide transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-out-soft)] ${
                selected
                  ? "bg-accent text-on-accent shadow-sm"
                  : "border border-border bg-transparent text-text-muted hover:border-accent hover:text-text"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {TABS.map(({ key }) => (
        <div
          key={key}
          id={`panel-${key}`}
          role="tabpanel"
          aria-labelledby={`tab-${key}`}
          data-menu-panel
          hidden={key !== active}
          /* Focusable so keyboard users reach the panel content directly
             after leaving the tablist. */
          tabIndex={0}
          className="mt-10 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {panels[key]}
        </div>
      ))}
    </>
  );
}
