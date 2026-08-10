import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import "./globals.css";

/**
 * Display serif. Warm rather than Didone-cold — the SOFT axis rounds the
 * terminals, which suits a sun-and-water brand better than a high-contrast
 * fashion serif would.
 *
 * `latin-ext` is required for Serbian: č ć ž š đ Đ. Verified on /styleguide.
 */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

/**
 * Humanist sans for body and all numeric/tabular content. Source Sans 3 has
 * genuine tabular figures (`tnum`), which the pricing and menu tables need.
 * Verified on /styleguide — do not swap without re-checking that test.
 */
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Palma Pool Club — Bazen na Kosmaju",
  description:
    "Palma Pool Club je bazen sa predivnim pogledom, u mirnom predelu Kosmaja, na nekih 30 minuta od Beograda.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="sr"
      data-mode="day"
      className={`${fraunces.variable} ${sourceSans.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Nav />
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
