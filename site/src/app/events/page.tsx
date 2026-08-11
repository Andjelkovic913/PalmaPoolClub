import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { EventCard } from "@/components/events/EventCard";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { ImageSlot } from "@/components/ImageSlot";
import { PalmMark } from "@/components/Logo";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { business, pricing } from "@/content/business";
import { flyerVoice, matineAnnouncements, matinePage } from "@/content/copy";
import { emptyStateCopy, pastEvents, upcomingEvents } from "@/content/events";

export const metadata: Metadata = {
  title: "Matine — DJ žurke pored bazena | Palma Pool Club",
  description:
    "Palma Pool Club Matine — DJ žurke pored bazena na Kosmaju. Ležaljke, odnosno ulaz, se naplaćuju po regularnoj ceni od 3.500 dinara. Sledeći datumi uskoro.",
};

/**
 * The one page in night mode.
 *
 * `data-mode="night"` on <main> flips every semantic token inside — and, via
 * the `:root:has(main[data-mode="night"])` rule in globals.css, the Nav and
 * Footer with it, so the whole viewport reads as "night out". That mode switch
 * is the entire point of the page: it is the signal that you have crossed from
 * the family pool day into a different product (PRD.md problem #4).
 *
 * BOTH known Matine dates are in the past, so `upcomingEvents()` is empty and
 * the empty state is not an edge case — it is the state that ships. See
 * design-system/palma-pool-club/pages/events.md.
 */
export default function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();

  return (
    <main data-mode="night" className="bg-bg text-text">
      {/* ---- Hero ---------------------------------------------------------- */}
      <Section className="border-b border-border">
        <Reveal>
          <PalmMark className="w-14 text-accent" />
          <Eyebrow>{matinePage.title}</Eyebrow>
          {/* MATINE large in Fraunces, per BUILD_PROMPT §9 Phase 4. No digits
              in the display face anywhere on this page. */}
          <h1 className="mt-2 font-display text-6xl leading-[0.9] tracking-tight uppercase md:text-8xl">
            {matinePage.title}
          </h1>
          <p className="mt-5 font-display text-2xl text-text-muted md:text-3xl">
            {matinePage.subhead}
          </p>
          {/* Flyer voice, verbatim off the DJ Byedov artwork. */}
          <p className="mt-8 max-w-md text-lg text-accent">
            {flyerVoice.headline}
          </p>
        </Reveal>
      </Section>

      {/* ---- Next date, or the empty state that actually ships -------------- */}
      <Section className="border-b border-border">
        <Reveal>
          <SectionHeading>Sledeći termin</SectionHeading>

          {upcoming.length > 0 ? (
            <>
              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {upcoming.map((e) => (
                  <EventCard key={e.date} event={e} />
                ))}
              </div>
              <ButtonLink href="/book" className="mt-8">
                Rezerviši kartu
              </ButtonLink>
            </>
          ) : (
            <>
              <p className="mt-8 max-w-xl rounded-sm border border-border bg-surface px-5 py-6 text-lg">
                {emptyStateCopy}
              </p>
              {/* With no date on sale there is nothing to book. The two actions
                  that ARE real: the account where the next date gets announced,
                  and the phone number from all 31 captions. */}
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink
                  href={business.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon size={16} />
                  {business.instagram.handle}
                </ButtonLink>
                <ButtonLink
                  href={`tel:${business.phone.href}`}
                  variant="secondary"
                  className="tabular"
                >
                  <Phone size={16} aria-hidden />
                  {business.phone.display}
                </ButtonLink>
              </div>
            </>
          )}
        </Reveal>
      </Section>

      {/* ---- Šta je Matine? — verbatim facts only ---------------------------
          The business has never described Matine in any caption, flyer or
          card. So this section states only what the two announcements state,
          word for word. Nothing here is a paraphrase. */}
      <Section className="border-b border-border">
        <Reveal>
          <Eyebrow>Šta je Matine?</Eyebrow>
          <SectionHeading className="mt-1">
            {matinePage.subhead}
          </SectionHeading>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <dl className="divide-y divide-border border-y border-border">
              <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="eyebrow pt-1 text-text-muted">Ulaznica</dt>
                <dd className="tabular text-lg font-semibold text-accent">
                  {pricing.matine.toLocaleString("sr-RS")}{" "}
                  {pricing.currencyShort}
                </dd>
              </div>
              <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="eyebrow pt-1 text-text-muted">Cena</dt>
                <dd className="text-lg">{matineAnnouncements.ticketNote}</dd>
              </div>
              <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="eyebrow pt-1 text-text-muted">Pre matinea</dt>
                <dd className="text-lg">{matineAnnouncements.first.note}</dd>
              </div>
              <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="eyebrow pt-1 text-text-muted">Radno vreme</dt>
                <dd className="tabular text-lg">{business.hours.display}</dd>
              </div>
            </dl>

            {/* Their own flyer lines, presented as the quotes they are. */}
            <blockquote className="rounded-sm border border-border bg-surface p-6">
              <p className="font-display text-2xl leading-snug">
                {flyerVoice.vibe}
              </p>
              <p className="mt-3 font-display text-2xl leading-snug text-accent">
                {flyerVoice.weekend}
              </p>
              <footer className="mt-5 text-sm text-text-muted">
                {business.name} — {business.distance.short}
              </footer>
            </blockquote>
          </div>
        </Reveal>
      </Section>

      {/* ---- Photo strip ---------------------------------------------------
          There is NO night photography of this venue — no DJ booth, no crowd,
          no dusk. The two flyers are real gold-on-black artwork; the other two
          cells are honest <ImageSlot>s. Never a darkened daytime photo, never
          stock nightlife. OPEN_QUESTIONS.md #10. */}
      <Section className="border-b border-border">
        <Reveal>
          <Eyebrow>Sa naših žurki</Eyebrow>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="overflow-hidden rounded-sm">
              <Photo
                id="flyer-byedov"
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden rounded-sm">
              <Photo
                id="flyer-matine"
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="h-auto w-full"
              />
            </div>
            <ImageSlot id="event-dj-booth" className="rounded-sm" />
            <ImageSlot id="event-crowd-dusk" className="rounded-sm" />
          </div>
        </Reveal>
      </Section>

      {/* ---- Archive -------------------------------------------------------- */}
      {past.length > 0 && (
        <Section className="border-b border-border">
          <Reveal>
            <Eyebrow>Arhiva</Eyebrow>
            <SectionHeading className="mt-1">Prošli matinei</SectionHeading>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {past.map((e) => (
                <EventCard key={e.date} event={e} past />
              ))}
            </div>
          </Reveal>
        </Section>
      )}

      {/* ---- Sign-off ------------------------------------------------------- */}
      <Section innerClassName="text-center">
        <Reveal>
          <PalmMark className="mx-auto w-12 text-accent" />
          <p className="mt-4 font-display text-3xl md:text-4xl">
            {flyerVoice.signoff}
          </p>
          <p className="mt-6 text-text-muted">
            {flyerVoice.reservationsLabel}{" "}
            <a
              href={`tel:${business.phone.href}`}
              className="tabular cursor-pointer text-accent underline-offset-4 transition-colors duration-200 hover:underline"
            >
              {business.phone.display}
            </a>
          </p>
        </Reveal>
      </Section>
    </main>
  );
}
