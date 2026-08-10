import { Star } from "lucide-react";
import { Reveal } from "../Reveal";
import { Eyebrow, Section, SectionHeading } from "../Section";
import { Todo } from "../Todo";
import { hasPlaceholderReviews, reviews } from "@/content/reviews";

/**
 * Reviews.
 *
 * ⚠️ Every entry is currently placeholder — no real review text exists in any
 * source material. Each card is visibly badged and the section carries a
 * standing warning, so this cannot be mistaken for real testimony if it ships
 * by accident. See OPEN_QUESTIONS.md #8.
 */
export function Reviews() {
  return (
    <Section className="border-t border-border bg-surface">
      <Eyebrow>Utisci gostiju</Eyebrow>
      <SectionHeading>Šta kažu gosti</SectionHeading>

      {hasPlaceholderReviews && (
        <div className="mt-5">
          <Todo>
            cela sekcija koristi lažne recenzije — nijedna prava recenzija nije
            pronađena ni u jednoj od 35 objava. Zameniti pre objavljivanja.
          </Todo>
        </div>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={i} delay={i * 70} className="h-full">
            <figure className="flex h-full flex-col rounded-sm border border-border bg-surface-raised p-6">
              <div
                className="flex gap-0.5 text-accent"
                aria-label={`Ocena ${r.rating} od 5`}
              >
                {Array.from({ length: r.rating }).map((_, s) => (
                  <Star key={s} size={16} fill="currentColor" aria-hidden />
                ))}
              </div>

              <blockquote className="mt-4 grow text-text-muted italic">
                “{r.quote}”
              </blockquote>

              <figcaption className="mt-5 border-t border-border pt-4 text-sm">
                <span className="font-semibold">{r.author}</span>
                <span className="ml-2 text-text-muted">{r.source}</span>
                {r.isPlaceholder && (
                  <span className="ml-2 rounded-sm bg-float-red/10 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-float-red">
                    PLACEHOLDER
                  </span>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
