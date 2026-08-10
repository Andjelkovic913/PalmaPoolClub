import Link from "next/link";
import { Bath, CircleParking, Dices, Disc3, Truck, Waves } from "lucide-react";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";
import { Eyebrow, Section, SectionHeading } from "../Section";
import { Todo } from "../Todo";
import { amenities, type Amenity } from "@/content/amenities";

const icons = { Waves, Bath, Truck, Dices, Disc3, CircleParking };

function Card({ item, delay }: { item: Amenity; delay: number }) {
  const Icon = icons[item.icon];

  const inner = (
    <>
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-sm">
        <Photo
          id={item.photo}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-center gap-2.5">
        <Icon size={20} className="shrink-0 text-teak" aria-hidden />
        <h3 className="font-display text-xl">{item.title}</h3>
      </div>
      <div className="mt-2">
        {item.description ? (
          <p className="text-sm text-text-muted">{item.description}</p>
        ) : (
          <Todo>opis nije potvrđen — nijedna objava ne opisuje ovaj sadržaj</Todo>
        )}
      </div>
    </>
  );

  const classes =
    "group block h-full rounded-sm border border-border bg-surface-raised p-4 transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5";

  return (
    <Reveal delay={delay} className="h-full">
      {item.href ? (
        <Link href={item.href} className={`${classes} cursor-pointer`}>
          {inner}
        </Link>
      ) : (
        <div className={classes}>{inner}</div>
      )}
    </Reveal>
  );
}

export function Amenities() {
  return (
    <Section id="sadrzaji">
      <Eyebrow>Sadržaji</Eyebrow>
      <SectionHeading>Šta vas čeka</SectionHeading>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((a, i) => (
          <Card key={a.title} item={a} delay={i * 60} />
        ))}
      </div>
    </Section>
  );
}
