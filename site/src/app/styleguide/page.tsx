import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { Logo, PalmMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { judge } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Styleguide — Palma Pool Club",
  robots: { index: false, follow: false },
};

/* Raw palette values, kept in sync with globals.css @theme. */
const DAY = {
  pool: "#1BA5C4",
  poolDeep: "#0E6E86",
  sand: "#EDE4D6",
  cream: "#FAF6EF",
  teak: "#B07B4B",
  brass: "#C89B4A",
  ink: "#241C16",
  floatRed: "#D6362F",
  textMuted: "#6B5C4F",
};

const NIGHT = {
  night: "#0B0906",
  gold: "#C9A24B",
  goldBright: "#E8C877",
  nightText: "#F2EBDD",
  textMuted: "#B3A892",
};

const contrastChecks: {
  label: string;
  fg: string;
  bg: string;
  size: "body" | "large";
}[] = [
  { label: "Dan — telo teksta: ink na cream", fg: DAY.ink, bg: DAY.cream, size: "body" },
  { label: "Dan — telo teksta: ink na sand", fg: DAY.ink, bg: DAY.sand, size: "body" },
  { label: "Dan — prigušen tekst: muted na cream", fg: DAY.textMuted, bg: DAY.cream, size: "body" },
  { label: "Dan — CTA: ink na brass", fg: DAY.ink, bg: DAY.brass, size: "body" },
  { label: "Dan — dugme: cream na pool-deep", fg: DAY.cream, bg: DAY.poolDeep, size: "body" },
  { label: "Dan — link/akcenat: pool-deep na cream", fg: DAY.poolDeep, bg: DAY.cream, size: "body" },
  // Restricted colours. `pool` fails even as large text — it is a fill colour,
  // never a text colour on a light ground. Shown here so the failure stays visible.
  { label: "Dan — pool na cream ⛔ nije boja za tekst", fg: DAY.pool, bg: DAY.cream, size: "large" },
  { label: "Dan — teak na cream (samo veliki tekst)", fg: DAY.teak, bg: DAY.cream, size: "large" },
  { label: "Dan — float-red na cream (samo akcenat)", fg: DAY.floatRed, bg: DAY.cream, size: "large" },
  { label: "Noć — telo teksta: night-text na night", fg: NIGHT.nightText, bg: NIGHT.night, size: "body" },
  { label: "Noć — prigušen tekst: muted na night", fg: NIGHT.textMuted, bg: NIGHT.night, size: "body" },
  { label: "Noć — gold na night ⚠", fg: NIGHT.gold, bg: NIGHT.night, size: "body" },
  { label: "Noć — gold-bright na night", fg: NIGHT.goldBright, bg: NIGHT.night, size: "body" },
  { label: "Noć — CTA: night na gold-bright", fg: NIGHT.night, bg: NIGHT.goldBright, size: "body" },
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-16 w-full rounded-sm border border-black/10"
        style={{ background: hex }}
      />
      <code className="text-xs">{name}</code>
      <code className="text-xs opacity-60">{hex}</code>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main>
      <Section>
        <Eyebrow>Interno</Eyebrow>
        <SectionHeading>Styleguide</SectionHeading>
        <p className="mt-4 max-w-2xl text-text-muted">
          Provera temelja pre nego što se izgradi ijedna stranica: tipografska
          skala, obe palete sa izmerenim kontrastom, stanja dugmadi, srpski
          dijakritički znaci i tabelarne cifre.
        </p>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>01 — Logo</Eyebrow>
        <SectionHeading>Znak</SectionHeading>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-3 rounded-sm bg-cream p-8">
            <Logo className="w-52 text-brass" />
            <code className="text-xs text-ink/50">brass na cream (dan)</code>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-sm bg-night p-8">
            <Logo className="w-52 text-gold" />
            <code className="text-xs text-night-text/50">gold na black (noć)</code>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-6">
          <PalmMark className="w-16 text-brass" />
          <PalmMark className="w-10 text-brass" />
          <PalmMark className="w-7 text-brass" />
          <code className="text-xs text-text-muted">
            znak bez natpisa — 64 / 40 / 28 px
          </code>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>02 — Tipografija</Eyebrow>
        <SectionHeading>Skala</SectionHeading>

        <div className="mt-8 space-y-6">
          <div>
            <code className="text-xs text-text-muted">display / 60px</code>
            <p className="font-display text-6xl leading-none tracking-tight">
              Sunce. Palma. Pogled.
            </p>
          </div>
          <div>
            <code className="text-xs text-text-muted">display / 40px</code>
            <p className="font-display text-4xl leading-tight">
              Bazen sa predivnim pogledom
            </p>
          </div>
          <div>
            <code className="text-xs text-text-muted">display / 28px</code>
            <p className="font-display text-2xl">Šta je Matine žurka?</p>
          </div>
          <div>
            <code className="text-xs text-text-muted">eyebrow / 12px tracked</code>
            <p className="eyebrow text-accent">Cenovnik i radno vreme</p>
          </div>
          <div>
            <code className="text-xs text-text-muted">body / 18px</code>
            <p className="max-w-2xl text-lg">
              Palma Pool Club je bazen sa predivnim pogledom, u mirnom predelu
              Kosmaja, na nekih 30 minuta od Beograda.
            </p>
          </div>
          <div>
            <code className="text-xs text-text-muted">body small / 14px muted</code>
            <p className="max-w-2xl text-sm text-text-muted">
              Radno vreme bazena je od 10 do 19h svaki dan. Ležaljke su
              uključene u cenu.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>03 — Provera</Eyebrow>
        <SectionHeading>Srpski dijakritički znaci</SectionHeading>
        <p className="mt-3 max-w-2xl text-text-muted">
          Nekoliko inače dobrih Google fontova nema <strong>Đ</strong>. Ako se
          ispod prikaže prazan pravougaonik ili se slovo vidno razlikuje po
          stilu od susednih, font je pao na zamenski — promeni font, ne ovaj
          test.
        </p>

        <div className="mt-8 space-y-8">
          <div>
            <code className="text-xs text-text-muted">
              Fraunces (display) — velika i mala slova
            </code>
            <p className="font-display text-5xl">Č Ć Ž Š Đ · č ć ž š đ</p>
            <p className="font-display text-3xl">
              Đorđe je došao na ručak — šljive, žito, ćevapi.
            </p>
          </div>
          <div>
            <code className="text-xs text-text-muted">
              Source Sans 3 (body) — velika i mala slova
            </code>
            <p className="text-5xl">Č Ć Ž Š Đ · č ć ž š đ</p>
            <p className="text-2xl">
              Đorđe je došao na ručak — šljive, žito, ćevapi.
            </p>
          </div>
          <div className="rounded-sm bg-surface p-5">
            <code className="text-xs text-text-muted">
              Reči koje se stvarno pojavljuju na sajtu
            </code>
            <p className="mt-2 text-xl">
              Ležaljke · Poludnevna karta · Događaji · Česta pitanja · Piće ·
              Hrana · Žurke · Sadržaji · Otkazivanje · Đubre
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>04 — Provera</Eyebrow>
        <SectionHeading>Tabelarne cifre</SectionHeading>
        <p className="mt-3 max-w-2xl text-text-muted">
          Cenovnik i meni traže cifre jednake širine.{" "}
          <code>font-variant-numeric: tabular-nums</code> ćutke ne radi ništa
          ako font nema <code>tnum</code>. U <em>tabelarnoj</em> koloni ispod
          sve tri linije moraju biti <strong>identične širine</strong>. Ako
          nisu, font nema tabelarne cifre.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <code className="text-xs text-text-muted">
              .tabular — širine moraju biti jednake
            </code>
            <div className="mt-2 space-y-1 text-2xl">
              <div className="tabular inline-block border-r-2 border-float-red bg-surface">
                1111111111
              </div>
              <div className="tabular inline-block border-r-2 border-float-red bg-surface">
                0000000000
              </div>
              <div className="tabular inline-block border-r-2 border-float-red bg-surface">
                2583174690
              </div>
            </div>
          </div>
          <div>
            <code className="text-xs text-text-muted">
              bez .tabular — za poređenje
            </code>
            <div className="mt-2 space-y-1 text-2xl">
              <div className="inline-block border-r-2 border-teak bg-surface">
                1111111111
              </div>
              <div className="inline-block border-r-2 border-teak bg-surface">
                0000000000
              </div>
              <div className="inline-block border-r-2 border-teak bg-surface">
                2583174690
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-md">
          <code className="text-xs text-text-muted">
            Kako to izgleda u cenovniku — cifre moraju stajati u koloni
          </code>
          <dl className="mt-2 space-y-2">
            {[
              ["Odrasli", "3.500"],
              ["Deca od 4 do 12 godina", "1.750"],
              ["Pomfrit", "250"],
              ["Palma Signature Burger", "1.420"],
            ].map(([label, price]) => (
              <div key={label} className="flex items-baseline gap-3">
                <dt className="shrink-0">{label}</dt>
                <span className="min-w-4 grow border-b border-dotted border-border" />
                <dd className="tabular shrink-0 text-right">{price} din</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>05 — Paleta</Eyebrow>
        <SectionHeading>Dan</SectionHeading>
        <p className="mt-3 text-text-muted">
          Uzorkovano sa fotografija samog objekta.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {Object.entries(DAY)
            .filter(([k]) => k !== "textMuted")
            .map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} />
            ))}
        </div>

        <SectionHeading className="mt-14">Noć</SectionHeading>
        <p className="mt-3 text-text-muted">
          Preuzeto direktno sa njihovih DJ plakata. Samo stranica{" "}
          <code>/events</code>.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(NIGHT)
            .filter(([k]) => k !== "textMuted")
            .map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} />
            ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>06 — Provera</Eyebrow>
        <SectionHeading>Kontrast (WCAG)</SectionHeading>
        <p className="mt-3 max-w-2xl text-text-muted">
          Izračunato, ne procenjeno. Telo teksta mora imati najmanje 4.5:1;
          veliki tekst (24px+) najmanje 3:1.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-semibold">Kombinacija</th>
                <th className="py-2 pr-4 font-semibold">Uzorak</th>
                <th className="py-2 pr-4 text-right font-semibold">Odnos</th>
                <th className="py-2 font-semibold">Rezultat</th>
              </tr>
            </thead>
            <tbody>
              {contrastChecks.map((c) => {
                const v = judge(c.fg, c.bg);
                const ok = c.size === "body" ? v.passesAA : v.passesAALarge;
                return (
                  <tr key={c.label} className="border-b border-border/50">
                    <td className="py-2 pr-4">{c.label}</td>
                    <td className="py-2 pr-4">
                      <span
                        className="inline-block rounded-sm px-3 py-1"
                        style={{ background: c.bg, color: c.fg }}
                      >
                        Ležaljke 3.500
                      </span>
                    </td>
                    <td className="tabular py-2 pr-4 text-right">
                      {v.ratio.toFixed(2)}:1
                    </td>
                    <td className="py-2 font-semibold">
                      {ok ? (
                        <span className="text-pool-deep">PROLAZI</span>
                      ) : (
                        <span className="text-float-red">PADA</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>07 — Komponente</Eyebrow>
        <SectionHeading>Dugmad</SectionHeading>
        <p className="mt-3 max-w-2xl text-text-muted">
          Pređi mišem: dugme se podiže i blago uvećava (150–300ms). Tabom kroz
          njih — fokus mora biti jasno vidljiv. Uključi{" "}
          <code>prefers-reduced-motion</code> i pokret mora nestati.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button variant="primary">Rezerviši ležaljku</Button>
          <Button variant="secondary">Pogledaj cenovnik</Button>
          <Button variant="ghost">Saznaj više</Button>
          <ButtonLink href="/styleguide" variant="primary">
            Kao link
          </ButtonLink>
          <Button variant="primary" disabled className="opacity-40">
            Nedostupno
          </Button>
        </div>

        <div
          data-mode="night"
          className="mt-8 flex flex-wrap items-center gap-4 rounded-sm bg-bg p-8"
        >
          <Button variant="primary">Rezerviši kartu</Button>
          <Button variant="secondary">Detaljnije</Button>
          <Button variant="ghost">Saznaj više</Button>
          <code className="text-xs text-text-muted">
            iste komponente, data-mode=&quot;night&quot;
          </code>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-border">
        <Eyebrow>08 — Komponente</Eyebrow>
        <SectionHeading>ImageSlot i Reveal</SectionHeading>
        <p className="mt-3 max-w-2xl text-text-muted">
          Slot bez fotografije nikada ne prikazuje slomljenu sliku niti stock
          fotografiju — prikazuje ovo.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ImageSlot id="event-dj-booth" />
          <ImageSlot id="amenity-billiards" />
          <ImageSlot id="event-crowd-dusk" />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[0, 80, 160].map((d) => (
            <Reveal key={d} delay={d}>
              <div className="rounded-sm bg-surface p-6">
                <code className="text-xs text-text-muted">delay {d}ms</code>
                <p className="mt-1">Sadržaj se pojavljuje pri skrolovanju.</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  );
}
