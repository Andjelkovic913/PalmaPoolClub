import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

/**
 * Hover states MOVE — lift, slight scale, shadow — not just recolour (§2).
 * All transitions sit in the 150–300ms band; `prefers-reduced-motion` is
 * handled globally in globals.css.
 */
const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-wide " +
  "transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-[var(--ease-out-soft)] " +
  "hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--ring)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent shadow-sm hover:shadow-lg hover:shadow-black/10",
  secondary:
    "border border-accent bg-transparent text-text hover:bg-accent/10 hover:shadow-md",
  ghost:
    "px-2 py-1 text-text underline-offset-4 hover:underline hover:shadow-none",
};

type BaseProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
