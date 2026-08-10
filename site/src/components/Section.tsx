import type { ReactNode } from "react";

/**
 * Page section with consistent vertical rhythm and an optional mode switch.
 *
 * `mode` is what lets a single gold-on-black Matine card sit inside an
 * otherwise daytime page — set it on the section, and every semantic token
 * inside flips.
 */
export function Section({
  children,
  className = "",
  innerClassName = "",
  mode,
  id,
  as: Tag = "section",
}: {
  children: ReactNode;
  /** Outer element — background, borders, vertical rhythm. */
  className?: string;
  /**
   * The max-width content wrapper — this is what actually contains the
   * children, so any layout (flex, grid, text-align) belongs here, not in
   * `className`. Passing layout classes to `className` styles the full-bleed
   * outer element and silently does nothing to the content.
   */
  innerClassName?: string;
  mode?: "day" | "night";
  id?: string;
  as?: "section" | "div" | "header" | "footer";
}) {
  return (
    <Tag
      id={id}
      data-mode={mode}
      /* scroll-mt keeps an anchored section clear of the sticky nav — without
         it, jumping to #id parks the heading underneath the header. */
      className={`px-5 py-16 md:px-10 md:py-24 ${id ? "scroll-mt-20" : ""} ${mode ? "bg-bg text-text" : ""} ${className}`}
    >
      <div className={`mx-auto w-full max-w-[1280px] ${innerClassName}`}>
        {children}
      </div>
    </Tag>
  );
}

/** Uppercase tracked label that sits above a section heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow text-accent">{children}</p>;
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-3xl leading-tight tracking-tight md:text-5xl ${className}`}
    >
      {children}
    </h2>
  );
}
