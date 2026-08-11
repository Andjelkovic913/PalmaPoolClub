import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { gallerySingle } from "@/content/gallery";
import { blurb } from "@/content/copy";

export const metadata: Metadata = {
  title: "Galerija — Palma Pool Club, bazen na Kosmaju",
  description:
    "Fotografije Palma Pool Cluba: dva bazena, jacuzzi, terasa sa ležaljkama, Palma Pool Cafe food truck i pogled na Kosmaj.",
};

export default function GalleryPage() {
  return (
    <main>
      <Section className="border-b border-border">
        <Eyebrow>Galerija</Eyebrow>
        <SectionHeading>Kako izgleda kod nas</SectionHeading>
        <p className="mt-4 max-w-xl text-lg text-text-muted">{blurb.intro}</p>
      </Section>

      {/* THE ONE SWITCH between the two layouts, both defined in
          content/gallery.ts:
            gallerySingle  — one ungrouped section, 14 real photos, no gaps
            galleryGroups  — Bazen & Pogled / Sadržaji & Hrana / Matine Žurke,
                             with <ImageSlot> where a group has no coverage
          Nothing else differs; the grid and the lightbox read whichever they
          are handed. Under review by the owner — see PROGRESS.md. */}
      <GalleryGrid groups={gallerySingle} layout="grid" />

      <Section innerClassName="text-center">
        {/* No closing blurb here on purpose: any sentence about the gallery
            would be authored prose, and nothing in copy.ts covers it. Buttons
            are UI labels, which is a different thing. */}
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/book">Rezerviši ležaljku</ButtonLink>
          <ButtonLink href="/events" variant="secondary">
            Matine žurke
          </ButtonLink>
        </div>
      </Section>
    </main>
  );
}
