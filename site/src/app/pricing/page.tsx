import type { Metadata } from "next";
import { Clock, Info } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { Photo } from "@/components/Photo";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { pricing } from "@/content/business";
import { blurb, pricingCard } from "@/content/copy";

export const metadata: Metadata = {
  title: "Cenovnik — Palma Pool Club, bazen na Kosmaju",
  description:
    "Cene ležaljki: radnim danima 2.500 din, vikendom 3.500 din. Deca od 4 do 12 godina 50% manje, deca do 4 godine besplatno. Poludnevna karta od 15:00 — 50% popusta. Ležaljke su uključene u cenu.",
};

const din = (n: number) => n.toLocaleString("sr-RS");

type Row = {
  label: string;
  weekday: string;
  weekend: string;
  note?: string;
};

/**
 * Figures cross-verified two ways — the printed card states the absolute
 * numbers, and all 31 Instagram captions state the same numbers plus the
 * "50% manje" child rule. They agree exactly.
 */
const rows: Row[] = [
  {
    label: pricingCard.adult,
    weekday: `${din(pricing.adult.weekday)} din`,
    weekend: `${din(pricing.adult.weekend)} din`,
  },
  {
    label: pricingCard.child,
    weekday: `${din(pricing.child4to12.weekday)} din`,
    weekend: `${din(pricing.child4to12.weekend)} din`,
    note: "50% od cene za odrasle",
  },
  {
    label: pricingCard.toddler,
    weekday: pricingCard.free,
    weekend: pricingCard.free,
    note: "Ne zauzimaju ležaljku",
  },
];

export default function PricingPage() {
  return (
    <main>
      <Section className="border-b border-border">
        <Eyebrow>Cenovnik</Eyebrow>
        <SectionHeading>Ulaznice</SectionHeading>
        <p className="mt-4 max-w-xl text-lg text-text-muted">
          {pricingCard.note} {blurb.halfDay}
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            {/* Desktop: three columns with dotted leaders.
                Under 640px this collapses to stacked weekday/weekend rows —
                the table must never scroll sideways (§5). */}
            <div className="hidden grid-cols-[1fr_auto_auto] gap-x-10 border-b border-border pb-3 sm:grid">
              <span className="eyebrow text-text-muted">Karta</span>
              <span className="eyebrow w-28 text-right text-text-muted">
                {pricingCard.weekday}
              </span>
              <span className="eyebrow w-28 text-right text-text-muted">
                {pricingCard.weekend}
              </span>
            </div>

            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.label} className="py-5">
                  <div className="sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-baseline sm:gap-x-10">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-xl">{r.label}</span>
                      <span
                        aria-hidden
                        className="hidden min-w-4 grow translate-y-[-4px] border-b border-dotted border-border sm:block"
                      />
                    </div>

                    {/* Stacked, mobile only. */}
                    <div className="mt-3 space-y-1 sm:hidden">
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-text-muted">
                          {pricingCard.weekday}
                        </span>
                        <span className="tabular font-semibold">
                          {r.weekday}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-text-muted">
                          {pricingCard.weekend}
                        </span>
                        <span className="tabular font-semibold">
                          {r.weekend}
                        </span>
                      </div>
                    </div>

                    <span className="tabular hidden w-28 text-right text-lg font-semibold sm:block">
                      {r.weekday}
                    </span>
                    <span className="tabular hidden w-28 text-right text-lg font-semibold sm:block">
                      {r.weekend}
                    </span>
                  </div>

                  {r.note && (
                    <p className="mt-2 text-sm text-text-muted">{r.note}</p>
                  )}
                </li>
              ))}
            </ul>

            {/* Half-day rule — on the card as its own boxed row. */}
            <div className="mt-8 flex items-start gap-4 rounded-sm border border-accent/40 bg-accent/5 p-5">
              <Clock size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="font-display text-xl">
                  {pricingCard.halfDayLabel}
                </p>
                <p className="mt-1 text-text-muted">
                  {pricingCard.halfDayValue}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 text-sm text-text-muted">
              <Info size={18} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              <p>{blurb.prices}</p>
            </div>

            <p className="mt-10 font-display text-2xl text-accent">
              {pricingCard.closing}
            </p>

            <ButtonLink href="/book" className="mt-8">
              Rezerviši ležaljku
            </ButtonLink>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-sm">
              <Photo
                id="pool-panorama-loungers"
                sizes="(max-width: 1024px) 100vw, 400px"
                className="h-auto w-full"
              />
            </div>
            <p className="mt-4 text-sm text-text-muted">{pricingCard.note}</p>
          </aside>
        </div>
      </Section>
    </main>
  );
}
