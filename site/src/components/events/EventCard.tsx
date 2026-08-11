import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "../icons/InstagramIcon";
import { Photo } from "../Photo";
import type { MatineEvent } from "@/content/events";
import { pricing } from "@/content/business";

/**
 * One Matine, in both the tenses the page needs.
 *
 * Deliberately one component rather than an "upcoming" and a "past" card: the
 * archive and the next date show the same five facts off the same record, and
 * two components would drift the moment one of them gains a field.
 *
 * Everything here comes from `src/content/events.ts`. Nothing about an event
 * is ever typed into JSX — adding a date is a data edit, per
 * design-system/palma-pool-club/pages/events.md.
 */
export function EventCard({
  event,
  past = false,
}: {
  event: MatineEvent;
  /** Archive treatment: dimmed, no ticket price emphasis. */
  past?: boolean;
}) {
  const postUrl = `https://www.instagram.com/p/${event.source}/`;

  return (
    /* The archive is dimmed with COLOUR, not with `opacity`: scripts/shoot.mjs
       flags any element below opacity 0.99 as a possibly-unfired <Reveal>, and
       a decorative fade would sit in that count forever as false noise. */
    <article
      className={`flex gap-5 rounded-sm border p-5 transition-[border-color] duration-200 hover:border-accent/60 ${
        past ? "border-border/70 text-text-muted" : "border-border bg-surface"
      }`}
    >
      {event.flyer && (
        /* The flyers are the only real night imagery that exists — 1087×1447
           and 1123×1400, so a fixed narrow column, never stretched. */
        <div className="w-24 shrink-0 self-start overflow-hidden rounded-sm sm:w-32">
          <Photo
            id={event.flyer}
            sizes="(max-width: 640px) 96px, 128px"
            className="h-auto w-full"
          />
        </div>
      )}

      <div className="min-w-0 grow">
        {/* NOT font-display, despite being the card's heading: `displayDate`
            carries a day number and a year, and Fraunces figures are
            proportional — measured, 9 distinct widths (MASTER.md §3). Every
            numeral on this site sets in the sans. Weight and size carry the
            heading instead of the face. */}
        <h3 className="tabular text-xl leading-tight font-semibold tracking-tight text-text md:text-2xl">
          {event.displayDate}
        </h3>

        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-3">
          <div>
            <dt className="eyebrow text-text-muted">DJ</dt>
            <dd className="mt-1">
              {event.djHandle ? (
                <a
                  href={`https://www.instagram.com/${event.djHandle}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-1.5 underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
                >
                  {event.dj}
                  <InstagramIcon size={14} className="shrink-0" />
                </a>
              ) : (
                event.dj
              )}
            </dd>
          </div>

          <div>
            <dt className="eyebrow text-text-muted">Vreme</dt>
            <dd className="tabular mt-1">
              {event.startTime}–{event.endTime}
            </dd>
          </div>

          <div>
            <dt className="eyebrow text-text-muted">Ulaznica</dt>
            <dd
              className={`tabular mt-1 ${past ? "" : "font-semibold text-accent"}`}
            >
              {event.priceRsd.toLocaleString("sr-RS")} {pricing.currencyShort}
            </dd>
          </div>
        </dl>

        {/* Verbatim from the announcement caption, when that event had one. */}
        {event.note && (
          <p className="mt-4 text-sm text-text-muted">{event.note}</p>
        )}

        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm text-text-muted underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
        >
          Najava na Instagramu
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
    </article>
  );
}
