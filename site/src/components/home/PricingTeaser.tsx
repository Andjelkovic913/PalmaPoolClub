import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../Button";
import { Reveal } from "../Reveal";
import { Eyebrow, Section, SectionHeading } from "../Section";
import { pricingCard } from "@/content/copy";
import { pricing } from "@/content/business";

const fmt = (n: number) => n.toLocaleString("sr-RS");

const rows = [
  {
    label: pricingCard.adult,
    weekday: `${fmt(pricing.adult.weekday)} din`,
    weekend: `${fmt(pricing.adult.weekend)} din`,
  },
  {
    label: pricingCard.child,
    weekday: `${fmt(pricing.child4to12.weekday)} din`,
    weekend: `${fmt(pricing.child4to12.weekend)} din`,
  },
  {
    label: pricingCard.toddler,
    weekday: pricingCard.free,
    weekend: pricingCard.free,
  },
];

export function PricingTeaser() {
  return (
    <Section className="border-t border-border bg-surface">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <Eyebrow>Cenovnik</Eyebrow>
          <SectionHeading>Ležaljke su uključene u cenu</SectionHeading>
          <p className="mt-4 max-w-md text-text-muted">
            {pricingCard.halfDayLabel} — {pricingCard.halfDayValue.toLowerCase()}.
          </p>
          <ButtonLink href="/pricing" variant="secondary" className="mt-8">
            Pun cenovnik
            <ArrowRight size={16} aria-hidden />
          </ButtonLink>
        </div>

        <Reveal>
          <div className="rounded-sm border border-border bg-surface-raised p-5 md:p-8">
            {/* Header row hidden under 640px; each row restates the labels
                there instead, so nothing scrolls sideways. */}
            <div className="hidden grid-cols-[1fr_auto_auto] gap-x-8 border-b border-border pb-3 sm:grid">
              <span className="eyebrow text-text-muted">Karta</span>
              <span className="eyebrow text-right text-text-muted">
                {pricingCard.weekday}
              </span>
              <span className="eyebrow text-right text-text-muted">
                {pricingCard.weekend}
              </span>
            </div>

            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li
                  key={r.label}
                  className="py-4 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-baseline sm:gap-x-8"
                >
                  <span className="block font-medium">{r.label}</span>

                  {/* Stacked layout under 640px. */}
                  <span className="mt-2 flex justify-between gap-4 sm:hidden">
                    <span className="text-sm text-text-muted">
                      {pricingCard.weekday}
                    </span>
                    <span className="tabular font-medium">{r.weekday}</span>
                  </span>
                  <span className="mt-1 flex justify-between gap-4 sm:hidden">
                    <span className="text-sm text-text-muted">
                      {pricingCard.weekend}
                    </span>
                    <span className="tabular font-medium">{r.weekend}</span>
                  </span>

                  <span className="tabular hidden text-right sm:block">
                    {r.weekday}
                  </span>
                  <span className="tabular hidden text-right sm:block">
                    {r.weekend}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-display text-lg text-accent">
              {pricingCard.closing}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
