import type { Metadata } from "next";
import { Eyebrow, Section, SectionHeading } from "@/components/Section";
import { isDbConfigured } from "@/db";
import { bookingsForDay, loadForDay } from "@/db/bookings";
import { statusLabels, type BookingStatus } from "@/content/booking";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { din } from "@/lib/price";
import { LoginForm } from "./LoginForm";
import { DayConsole } from "./DayConsole";

export const metadata: Metadata = {
  title: "Pregled rezervacija — Palma Pool Club",
  robots: { index: false, follow: false },
};

/** Always live — the owner is about to act on these numbers. */
export const dynamic = "force-dynamic";

function todayIso() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * The owner's console.
 *
 * Exists to close the gap that made the capacity figure untrustworthy: the
 * venue has always taken bookings by phone, and those never reached the
 * database — so the site could read "28 of 40" while the real number was 38,
 * and happily accept twelve more guests. Entering phone bookings here makes
 * the database the single source of truth and retires the paper notebook.
 *
 * Authorisation is checked HERE and again inside every action — see
 * `src/lib/admin-auth.ts`. Hiding the UI is not access control.
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ dan?: string }>;
}) {
  if (!isAdminConfigured()) {
    return (
      <main>
        <Section>
          <SectionHeading>Pregled nije podešen</SectionHeading>
          <p className="mt-4 max-w-xl text-text-muted">
            Postavite <code className="font-mono text-sm">OWNER_PASSWORD</code> u{" "}
            <code className="font-mono text-sm">.env.local</code> i restartujte
            server. Vidi <code className="font-mono text-sm">site/SETUP.md</code>.
          </p>
        </Section>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main>
        <Section>
          <Eyebrow>Pregled rezervacija</Eyebrow>
          <SectionHeading>Prijava</SectionHeading>
          <LoginForm />
        </Section>
      </main>
    );
  }

  if (!isDbConfigured()) {
    return (
      <main>
        <Section>
          <SectionHeading>Baza nije podešena</SectionHeading>
          <p className="mt-4 text-text-muted">
            Nedostaje <code className="font-mono text-sm">DATABASE_URL</code>.
          </p>
        </Section>
      </main>
    );
  }

  const { dan } = await searchParams;
  const day = dan && /^\d{4}-\d{2}-\d{2}$/.test(dan) ? dan : todayIso();

  const [load, rows] = await Promise.all([loadForDay(day), bookingsForDay(day)]);
  const free = Math.max(0, load.capacity - load.taken);

  return (
    <main>
      <Section className="border-b border-border">
        <Eyebrow>Pregled rezervacija</Eyebrow>
        <SectionHeading>Dan po dan</SectionHeading>
      </Section>

      <Section>
        <DayConsole
          day={day}
          capacity={load.capacity}
          taken={load.taken}
          free={free}
          bookings={rows.map((r) => ({
            id: r.id,
            guestName: r.guestName,
            phone: r.phone,
            email: r.email,
            adults: r.adults,
            children: r.children,
            under4: r.under4,
            sunbeds: r.sunbeds,
            arrival: r.arrival,
            totalRsd: r.totalRsd,
            total: `${din(r.totalRsd)} din`,
            status: r.status as BookingStatus,
            statusLabel: statusLabels[r.status as BookingStatus] ?? r.status,
            source: r.source,
            note: r.note,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      </Section>
    </main>
  );
}
