import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { business } from "@/content/business";
import { faq, faqPage } from "@/content/faq";

export const metadata: Metadata = {
  title: "Česta pitanja — Palma Pool Club, bazen na Kosmaju",
  description:
    "Odgovori na česta pitanja: parking, deca, rezervacije telefonom, ležaljke i cene u Palma Pool Clubu na Kosmaju.",
};

/**
 * Turns the phone number inside an answer into a real click-to-call link.
 *
 * Three of the seven answers end in "pozovite nas na +381 60 3318255", which
 * is the action the answer exists to prompt. Leaving it as plain text makes a
 * phone user copy a number by hand from the one page written for people who
 * could not find what they needed.
 *
 * Splits on the canonical display string from business.ts, so it cannot drift
 * from however the number is written elsewhere on the site.
 */
function withPhoneLink(text: string) {
  const number = business.phone.display;
  const parts = text.split(number);
  if (parts.length === 1) return text;

  return parts.map((part, i) => (
    <span key={i}>
      {i > 0 && (
        <a
          href={`tel:${business.phone.href}`}
          className="tabular cursor-pointer font-semibold text-text underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
        >
          {number}
        </a>
      )}
      {part}
    </span>
  ));
}

/**
 * Answers are rendered open, not in an accordion.
 *
 * Seven short items do not need progressive disclosure, and a collapsed answer
 * is one more tap between a guest and the thing they came for. Everything is
 * in the DOM either way, so nothing is gained for SEO by hiding it.
 *
 * `<dl>` rather than headings: this is a question/answer set, which is what a
 * description list is for, and it gives screen readers the pairing for free.
 */
export default function FaqPage() {
  return (
    <main>
      <Section className="border-b border-border">
        <Eyebrow>Česta pitanja</Eyebrow>
        <SectionHeading>Pitanja i odgovori</SectionHeading>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <dl className="divide-y divide-border border-y border-border">
            {faq.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-display text-xl leading-snug md:text-2xl">
                  {item.question}
                </dt>
                <dd className="mt-3 text-lg text-text-muted">
                  {withPhoneLink(item.answer)}
                </dd>
              </div>
            ))}
          </dl>

          <aside className="rounded-sm border border-border bg-surface p-6 lg:sticky lg:top-24">
            <p className="font-display text-2xl leading-snug">
              {faqPage.asideTitle}
            </p>
            <p className="mt-3 text-text-muted">{faqPage.asideBody}</p>
            <ButtonLink
              href={`tel:${business.phone.href}`}
              className="tabular mt-6 w-full"
            >
              <Phone size={16} aria-hidden />
              {business.phone.display}
            </ButtonLink>
            <p className="tabular mt-4 text-sm text-text-muted">
              {business.hours.display}
            </p>
          </aside>
        </div>
      </Section>
    </main>
  );
}
