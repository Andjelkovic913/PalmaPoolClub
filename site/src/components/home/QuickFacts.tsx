import { CarFront, Clock, CircleParking, Phone } from "lucide-react";
import { business } from "@/content/business";

/**
 * Quick-facts strip under the hero. Everything here is verified from the
 * captions; the phone is a real click-to-call.
 */
export function QuickFacts() {
  const facts = [
    { Icon: Clock, label: "Radno vreme", value: "10:00–19:00, svaki dan" },
    { Icon: CarFront, label: "Udaljenost", value: business.distance.display },
    { Icon: CircleParking, label: "Parking", value: "Veliki, besplatan" },
  ];

  return (
    <section className="border-y border-border bg-surface px-5 py-8 md:px-10">
      <ul className="mx-auto grid w-full max-w-[1280px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(({ Icon, label, value }) => (
          <li key={label} className="flex items-start gap-3">
            <Icon size={22} className="mt-0.5 shrink-0 text-teak" aria-hidden />
            <span>
              <span className="eyebrow block text-text-muted">{label}</span>
              <span className="tabular mt-0.5 block">{value}</span>
            </span>
          </li>
        ))}
        <li className="flex items-start gap-3">
          <Phone size={22} className="mt-0.5 shrink-0 text-teak" aria-hidden />
          <span>
            <span className="eyebrow block text-text-muted">Rezervacije</span>
            <a
              href={`tel:${business.phone.href}`}
              className="tabular mt-0.5 block cursor-pointer font-semibold underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
            >
              {business.phone.display}
            </a>
          </span>
        </li>
      </ul>
    </section>
  );
}
