import type { Metadata } from "next";
import { Clock, ExternalLink, MapPin, Navigation, Phone } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { Photo } from "@/components/Photo";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { business } from "@/content/business";
import { blurb } from "@/content/copy";

export const metadata: Metadata = {
  title: "Lokacija — Palma Pool Club, Kosmaj kod Sopota",
  description:
    "Palma Pool Club se nalazi na Kosmaju, kod Sopota — oko 43 km i 30 minuta od Beograda. Adresa, koordinate i besplatan parking.",
};

export default function LocationPage() {
  /**
   * Embed and link by lat/lng, never by the address string.
   *
   * "Kralja Petra Prvog BB" is *bez broja* — no house number — so it geocodes
   * to a road midpoint, drops no marker, and leaves a neighbouring hotel as the
   * only labelled place on screen. Querying the business name returns a blank
   * map because no Google Business listing exists. Coordinates come from the
   * map link in the venue's own Instagram bio and do pin correctly.
   * See OPEN_QUESTIONS.md #16, and verify with scripts/check-map.mjs /location.
   */
  const { lat, lng, plusCode, mapsUrl } = business.geo;
  const query = `${lat},${lng}`;

  const facts = [
    { Icon: MapPin, label: "Adresa", value: business.address.full },
    { Icon: Navigation, label: "Udaljenost", value: business.distance.display },
    { Icon: Clock, label: "Radno vreme", value: business.hours.display },
  ];

  return (
    <main>
      <Section className="border-b border-border">
        <Eyebrow>Lokacija</Eyebrow>
        <SectionHeading>Na 30 minuta od Beograda</SectionHeading>
        <p className="mt-4 max-w-xl text-lg text-text-muted">{blurb.intro}</p>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <dl className="divide-y divide-border border-y border-border">
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 py-5">
                  <Icon
                    size={20}
                    className="mt-0.5 shrink-0 text-teak"
                    aria-hidden
                  />
                  <div>
                    <dt className="eyebrow text-text-muted">{label}</dt>
                    <dd className="tabular mt-1">{value}</dd>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 py-5">
                <Phone
                  size={20}
                  className="mt-0.5 shrink-0 text-teak"
                  aria-hidden
                />
                <div>
                  <dt className="eyebrow text-text-muted">Rezervacije</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${business.phone.href}`}
                      className="tabular cursor-pointer font-semibold underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
                    >
                      {business.phone.display}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            {/* The Plus Code is the fallback that actually works in a nav app
                when the street address resolves to nothing useful. */}
            <p className="mt-6 text-sm text-text-muted">
              Plus kod: <span className="tabular">{plusCode}</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Otvori u Google Mapama
                <ExternalLink size={16} aria-hidden />
              </ButtonLink>
              <ButtonLink
                href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                Navigacija
                <Navigation size={16} aria-hidden />
              </ButtonLink>
            </div>
          </div>

          {/* Fixed aspect so the iframe reserves its space and cannot shift
              layout as the tiles stream in. */}
          <div className="aspect-4/3 w-full overflow-hidden rounded-sm border border-border sm:aspect-16/10">
            <iframe
              title={`Mapa — ${business.name}, ${business.address.full}`}
              src={`https://www.google.com/maps?q=${query}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* A LANDSCAPE deliberately: this sits beside an eight-item list, and
              the 0.56 drone shots run ~780px tall at this width, leaving the
              text column stranded at the top of a half-empty row. */}
          <div className="overflow-hidden rounded-sm">
            <Photo
              id="terrace-cafe-frontage"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-auto w-full"
            />
          </div>
          <div>
            <SectionHeading>Šta vas čeka po dolasku</SectionHeading>
            <ul className="mt-6 space-y-3 text-lg text-text-muted">
              {business.amenities.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {a}
                </li>
              ))}
            </ul>
            <ButtonLink href="/book" className="mt-8">
              Rezerviši ležaljku
            </ButtonLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
