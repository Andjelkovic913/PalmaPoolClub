import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";
import { Logo } from "./Logo";
import { business } from "@/content/business";
import { brand } from "@/content/copy";
import { navLinks } from "@/content/nav";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 py-14 md:px-10">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 md:grid-cols-[auto_1fr_1fr]">
        <div>
          <Logo className="w-44 text-accent" />
          <p className="mt-4 font-display text-lg">{brand.tagline}</p>
        </div>

        <div>
          <h2 className="eyebrow text-accent">Kontakt</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              <span>{business.address.full}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              <a
                href={`tel:${business.phone.href}`}
                className="tabular cursor-pointer underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
              >
                {business.phone.display}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              <span>
                <span className="tabular">{business.hours.display}</span>
                <br />
                <span className="text-text-muted">{business.hours.seasonNote}</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <InstagramIcon size={18} className="mt-0.5 shrink-0 text-teak" />
              <a
                href={business.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
              >
                {business.instagram.handle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-accent">Stranice</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="cursor-pointer underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[1280px] border-t border-border pt-6 text-xs text-text-muted">
        <p>
          © {new Date().getFullYear()} {business.name}. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
}
