import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading, Eyebrow } from "@/components/Section";
import { DecisionButtons } from "./DecisionButtons";
import { isDbConfigured } from "@/db";
import { findByToken, loadForDay } from "@/db/bookings";
import { statusLabels, type BookingStatus } from "@/content/booking";
import { emailLabels as L } from "@/content/emails";
import { din } from "@/lib/price";

/** Never indexed, never followed — it is a one-off link to one booking. */
export const metadata: Metadata = {
  title: "Zahtev za rezervaciju — Palma Pool Club",
  robots: { index: false, follow: false },
};

/** Always live: the owner must see the current status, not a cached one. */
export const dynamic = "force-dynamic";

function dateSr(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
}

/**
 * The page the owner's email link opens.
 *
 * READ-ONLY. It renders the request and two buttons; nothing changes until one
 * is pressed, and the press is a POST (see actions.ts). This is the half of
 * the "one click to approve" flow that keeps a mail scanner from approving
 * bookings on the owner's behalf.
 */
export default async function DecisionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!isDbConfigured()) notFound();
  const booking = await findByToken(token);
  if (!booking) notFound();

  const status = booking.status as BookingStatus;
  const decided = status !== "pending";

  /* Read live, not carried over from the email: other bookings may have
     arrived since it was sent, and the owner is about to act on this number. */
  const load = await loadForDay(booking.visitDate);
  const free = Math.max(0, load.capacity - load.taken);

  const rows: [string, string][] = [
    [L.date, dateSr(booking.visitDate)],
    [L.ticket, booking.ticket === "matine" ? L.ticketMatine : L.ticketDay],
    ...(booking.ticket === "day"
      ? ([
          [
            L.arrival,
            booking.arrival === "afternoon" ? L.arrivalAfternoon : L.arrivalFull,
          ],
        ] as [string, string][])
      : []),
    ...(booking.adults > 0
      ? ([[L.adults, String(booking.adults)]] as [string, string][])
      : []),
    ...(booking.children > 0
      ? ([[L.children, String(booking.children)]] as [string, string][])
      : []),
    ...(booking.under4 > 0
      ? ([[L.under4, `${booking.under4} — ${L.free}`]] as [string, string][])
      : []),
    [L.sunbeds, String(booking.sunbeds)],
    [L.total, `${din(booking.totalRsd)} din`],
    [L.name, booking.guestName],
    [L.phone, booking.phone],
    ...(booking.email ? ([[L.email, booking.email]] as [string, string][]) : []),
  ];

  return (
    <main>
      <Section className="border-b border-border">
        <Eyebrow>Zahtev za rezervaciju</Eyebrow>
        <SectionHeading>{dateSr(booking.visitDate)}</SectionHeading>
        <p className="mt-4 text-lg text-text-muted">
          Status: {statusLabels[status] ?? status}
        </p>

        {/* The whole reason the owner can answer without opening Supabase.
            Capacity was already enforced before this request was created, so
            this is context for the judgement, not a sum to do. */}
        <div className="mt-6 max-w-md rounded-sm border border-border bg-surface p-5">
          <p className="eyebrow text-text-muted">Popunjenost tog dana</p>
          <p className="tabular mt-2 text-2xl font-semibold">
            {load.taken} / {load.capacity} ležaljki
          </p>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border"
            role="img"
            aria-label={`Zauzeto ${load.taken} od ${load.capacity} ležaljki`}
          >
            <div
              className="h-full bg-accent"
              style={{
                width: `${Math.min(100, Math.round((load.taken / Math.max(1, load.capacity)) * 100))}%`,
              }}
            />
          </div>
          <p className="tabular mt-3 text-sm text-text-muted">
            {load.capacity === 0
              ? "Taj dan je označen kao zatvoren."
              : `Slobodno još ${free}. Ovaj zahtev je već uračunat.`}
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-xl">
          <dl className="divide-y divide-border border-y border-border">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-4 py-3">
                <dt className="text-sm text-text-muted">{k}</dt>
                <span
                  aria-hidden
                  className="min-w-4 grow translate-y-[-4px] border-b border-dotted border-border"
                />
                <dd className="tabular shrink-0 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          {decided ? (
            <p className="mt-8 rounded-sm border border-border bg-surface px-5 py-4">
              Na ovaj zahtev je već odgovoreno: {statusLabels[status]}.
            </p>
          ) : (
            <DecisionButtons token={token} />
          )}

          <p className="mt-6 text-sm text-text-muted">
            Gost dobija e-mail sa vašim odgovorom. Ako je zahtev odbijen, u
            poruci mu se nudi prvi sledeći slobodan termin.
          </p>
        </div>
      </Section>
    </main>
  );
}
