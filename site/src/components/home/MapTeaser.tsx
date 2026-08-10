import { ArrowRight, ExternalLink, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "../Button";
import { Reveal } from "../Reveal";
import { Eyebrow, Section, SectionHeading } from "../Section";
import { business } from "@/content/business";

/**
 * Map teaser. The iframe sits in a fixed-aspect box so it reserves its space
 * and cannot shift layout as it loads — the acceptance checklist calls this
 * out specifically.
 *
 * `loading="lazy"` keeps the Google tiles off the critical path; the Home LCP
 * must stay the hero image.
 */
export function MapTeaser() {
  /**
   * Embed by lat/lng, never by the address string.
   *
   * "Kralja Petra Prvog BB" is *bez broja* — no house number — so it geocodes
   * to a road midpoint and drops no marker at all, leaving a neighbouring
   * hotel as the only labelled place on screen. Coordinates come from the map
   * link in the venue's own Instagram bio and do pin correctly.
   */
  const { lat, lng } = business.geo;
  const query = `${lat},${lng}`;

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <Eyebrow>Lokacija</Eyebrow>
          <SectionHeading>Na 30 minuta od Beograda</SectionHeading>

          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              <span>{business.address.full}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={20} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              <a
                href={`tel:${business.phone.href}`}
                className="tabular cursor-pointer underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
              >
                {business.phone.display}
              </a>
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={business.geo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Otvori u Google Mapama
              <ExternalLink size={16} aria-hidden />
            </ButtonLink>
            <ButtonLink href="/location" variant="secondary">
              Kako do nas
              <ArrowRight size={16} aria-hidden />
            </ButtonLink>
          </div>
        </div>

        <Reveal>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-sm border border-border sm:aspect-[16/10]">
            <iframe
              title={`Mapa — ${business.name}, ${business.address.full}`}
              src={`https://www.google.com/maps?q=${query}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
