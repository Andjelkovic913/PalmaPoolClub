import type { Metadata } from "next";
import { Clock, Info, Phone } from "lucide-react";
import { BookingWidget } from "@/components/book/BookingWidget";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { business } from "@/content/business";
import { blurb, pricingCard } from "@/content/copy";
import { faq } from "@/content/faq";

export const metadata: Metadata = {
  title: "Rezervacija — Palma Pool Club, bazen na Kosmaju",
  description:
    "Rezervišite ležaljku u Palma Pool Clubu. Izračunajte cenu za vaš datum i broj gostiju — radnim danima 2.500 din, vikendom 3.500 din, poludnevna karta od 15:00 50% jeftinije.",
};

export default function BookPage() {
  /* The cancellation line comes from the FAQ rather than being typed again, so
     the two surfaces can never drift apart. No cancellation policy exists —
     OPEN_QUESTIONS.md #3 — so this routes to the phone and states no terms.
     Do not replace it with a deadline or a refund rule. */
  const cancellation = faq.find((f) =>
    f.question.toLowerCase().includes("otkaziv")
  );

  return (
    <main>
      <Section className="border-b border-border">
        <Eyebrow>Rezervacija</Eyebrow>
        <SectionHeading>Rezervišite ležaljku</SectionHeading>
        <p className="mt-4 max-w-xl text-lg text-text-muted">
          {pricingCard.note} {blurb.halfDay}
        </p>
      </Section>

      <Section className="border-b border-border">
        {/* Everything inside this boundary is replaceable by a booking-engine
            embed without touching this page. See BookingWidget.tsx. */}
        <BookingWidget />
      </Section>

      <Section>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Clock size={20} className="mt-0.5 shrink-0 text-teak" aria-hidden />
            <div>
              <h2 className="eyebrow text-text-muted">Radno vreme</h2>
              <p className="tabular mt-1">{business.hours.display}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={20} className="mt-0.5 shrink-0 text-teak" aria-hidden />
            <div>
              <h2 className="eyebrow text-text-muted">Rezervacije</h2>
              <a
                href={`tel:${business.phone.href}`}
                className="tabular mt-1 block cursor-pointer font-semibold underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
              >
                {business.phone.display}
              </a>
            </div>
          </div>

          {cancellation && (
            <div className="flex items-start gap-3">
              <Info size={20} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              <div>
                <h2 className="eyebrow text-text-muted">Otkazivanje</h2>
                <p className="mt-1 text-text-muted">{cancellation.answer}</p>
              </div>
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
