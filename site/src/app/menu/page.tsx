import type { Metadata } from "next";
import { Info } from "lucide-react";
import { MenuLegend, MenuMarker } from "@/components/MenuMarker";
import { Photo } from "@/components/Photo";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { menuNotes } from "@/content/copy";
import {
  drinks,
  drinksLegend,
  food,
  foodLegend,
  type MenuItem,
  type MenuSection as Section_,
} from "@/content/menu";

export const metadata: Metadata = {
  title: "Meni — Palma Pool Club, hrana i piće na Kosmaju",
  description:
    "Ceo meni Palma Pool Cluba: burgeri, wrap i salate, snacks za deljenje, deserti, kafe, sokovi i koktela. Hrana se priprema u Palma Pool Cafe food trucku na terasi.",
};

const din = (n: number) => n.toLocaleString("sr-RS");

function Item({ item }: { item: MenuItem }) {
  const inner = (
    <>
      <div className="flex items-baseline gap-2">
        <h3 className="font-display text-lg leading-snug">{item.name}</h3>
        {item.markers?.map((m) => <MenuMarker key={m} marker={m} />)}
        <span
          aria-hidden
          className="min-w-4 grow translate-y-[-4px] border-b border-dotted border-border"
        />
        <span className="tabular shrink-0 font-semibold">
          {din(item.price)} din
        </span>
      </div>
      {item.description && (
        <p className="mt-1 max-w-prose text-sm text-text-muted">
          {item.description}
        </p>
      )}
    </>
  );

  // Box Combo gets its own boxed treatment, as the printed card does.
  if (item.featured) {
    return (
      <li className="rounded-sm border border-accent/40 bg-accent/5 p-4">
        {inner}
      </li>
    );
  }
  return <li className="py-3">{inner}</li>;
}

function MenuBlock({ section }: { section: Section_ }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="eyebrow border-b border-border pb-2 text-accent">
        {section.title}
      </h2>
      <ul className="mt-2 space-y-1">
        {section.items.map((i) => (
          <Item key={i.name} item={i} />
        ))}
      </ul>
    </section>
  );
}

export default function MenuPage() {
  return (
    <main>
      <Section className="border-b border-border">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Eyebrow>Meni</Eyebrow>
            <SectionHeading>Hrana i piće</SectionHeading>
            <p className="mt-4 max-w-xl text-lg text-text-muted">
              {menuNotes.foodTruck}
            </p>
            <p className="mt-3 flex items-start gap-2 text-sm text-text-muted">
              <Info size={18} className="mt-0.5 shrink-0 text-teak" aria-hidden />
              {menuNotes.payAtBar}
            </p>
          </div>
          {/* Fixed 4:3 box. The source is a 941×1670 portrait; at natural
              aspect it made this header ~750px tall with dead space beside it.
              The focal point in the manifest keeps the truck in frame. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Photo
              id="foodtruck-golden-hour"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
        </div>
      </Section>

      {/* HRANA */}
      <Section>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <SectionHeading>Hrana</SectionHeading>
          <MenuLegend markers={foodLegend} />
        </div>
        <div className="mt-8 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {food.map((s) => (
            <MenuBlock key={s.title} section={s} />
          ))}
        </div>
      </Section>

      {/* PIĆE — note this card carries a DIFFERENT legend from the food card. */}
      <Section className="border-t border-border bg-surface">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <SectionHeading>Piće</SectionHeading>
          <MenuLegend markers={drinksLegend} />
        </div>
        <div className="mt-8 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {drinks.map((s) => (
            <MenuBlock key={s.title} section={s} />
          ))}
        </div>

        <p className="mt-10 font-display text-xl text-accent">
          {menuNotes.hydration}
        </p>
      </Section>
    </main>
  );
}
