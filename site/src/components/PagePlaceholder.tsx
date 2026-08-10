import { ButtonLink } from "./Button";
import { Eyebrow, Section, SectionHeading } from "./Section";

/**
 * Temporary stub for routes that are built in a later phase.
 *
 * Exists so the nav and the Home teasers do not 404 during review. Every one
 * of these is replaced by real content in Phases 3–7 — none of this ships.
 */
export function PagePlaceholder({
  title,
  phase,
}: {
  title: string;
  phase: string;
}) {
  return (
    <Section className="min-h-[50vh]">
      <Eyebrow>U izradi</Eyebrow>
      <SectionHeading>{title}</SectionHeading>
      <p className="mt-4 max-w-xl text-text-muted">
        Ova stranica se gradi u {phase}.
      </p>
      <ButtonLink href="/" variant="secondary" className="mt-8">
        Nazad na početnu
      </ButtonLink>
    </Section>
  );
}
