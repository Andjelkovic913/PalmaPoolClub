import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../Button";
import { PalmMark } from "../Logo";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Eyebrow, Section } from "../Section";
import { flyerVoice } from "@/content/copy";
import { emptyStateCopy, upcomingEvents } from "@/content/events";
import { business } from "@/content/business";

/**
 * The one section that breaks the daytime palette on purpose — the visual
 * hook from a family pool day toward the nightlife product (PRD.md problem #4).
 *
 * `data-mode="night"` flips every semantic token inside; no night-specific
 * component variants are needed.
 */
export function MatineTeaser() {
  const next = upcomingEvents()[0] ?? null;

  return (
    <Section mode="night" className="border-y border-border">
      <Reveal>
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <PalmMark className="w-12 text-accent" />
            <Eyebrow>Matine</Eyebrow>
            <h2 className="mt-1 font-display text-4xl leading-none tracking-tight md:text-6xl">
              DJ žurke pored bazena
            </h2>
            <p className="mt-5 max-w-md text-lg text-text-muted">
              {flyerVoice.vibe} {flyerVoice.weekend}
            </p>

            {next ? (
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                <div>
                  <dt className="eyebrow text-text-muted">Datum</dt>
                  <dd className="tabular mt-1 text-lg">{next.displayDate}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-text-muted">DJ</dt>
                  <dd className="mt-1 text-lg">{next.dj}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-text-muted">Vreme</dt>
                  <dd className="tabular mt-1 text-lg">
                    {next.startTime}–{next.endTime}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-8 rounded-sm border border-border px-4 py-3 text-text-muted">
                {emptyStateCopy}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/events">
                {next ? "Rezerviši kartu" : "Pogledaj Matine"}
                <ArrowRight size={16} aria-hidden />
              </ButtonLink>
              <ButtonLink
                href={business.instagram.url}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {business.instagram.handle}
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-sm md:max-w-none">
            <Photo
              id="flyer-byedov"
              sizes="(max-width: 768px) 320px, 33vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
