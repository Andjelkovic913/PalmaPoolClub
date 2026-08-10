import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Amenities } from "@/components/home/Amenities";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { MapTeaser } from "@/components/home/MapTeaser";
import { MatineTeaser } from "@/components/home/MatineTeaser";
import { PricingTeaser } from "@/components/home/PricingTeaser";
import { QuickFacts } from "@/components/home/QuickFacts";
import { Reviews } from "@/components/home/Reviews";

export const metadata: Metadata = {
  title: "Palma Pool Club — Bazen na Kosmaju, 30 minuta od Beograda",
  description:
    "Bazen sa predivnim pogledom u mirnom predelu Kosmaja, na 30 minuta od Beograda. Dva bazena, jacuzzi, ležaljke i Palma Pool Cafe. Radno vreme 10–19h svaki dan.",
};

/**
 * The events teaser depends on today's date, so the page must not be baked
 * once at build time and served stale forever. Revalidating hourly is ample
 * for a date that changes at midnight.
 */
export const revalidate = 3600;

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickFacts />
      <Amenities />
      <PricingTeaser />
      <GalleryTeaser />
      <MatineTeaser />
      <Reviews />
      <MapTeaser />
    </main>
  );
}
