"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Globe, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import {
  addPhoneBooking,
  cancel,
  logout,
  updateCapacity,
  type AdminState,
} from "./actions";

type Row = {
  id: string;
  guestName: string;
  phone: string;
  email: string | null;
  adults: number;
  children: number;
  under4: number;
  sunbeds: number;
  arrival: string;
  total: string;
  status: string;
  statusLabel: string;
  source: string;
  note: string | null;
  createdAt: string;
};

const idle: AdminState = { status: "idle" };

/**
 * One day, everything about it.
 *
 * Deliberately a single screen rather than a menu: the owner's actual question
 * is always "what is happening on <date>", and every answer and every action
 * belongs to that one date.
 */
export function DayConsole({
  day,
  capacity,
  taken,
  free,
  bookings,
}: {
  day: string;
  capacity: number;
  taken: number;
  free: number;
  bookings: Row[];
}) {
  const router = useRouter();
  const pct = Math.min(100, Math.round((taken / Math.max(1, capacity)) * 100));

  const [addState, addAction] = useActionState(addPhoneBooking, idle);
  const [capState, capAction] = useActionState(updateCapacity, idle);
  const [cancelState, cancelAction] = useActionState(cancel, idle);

  const field =
    "mt-1.5 w-full rounded-sm border border-border bg-surface-raised px-3 py-2.5 focus-visible:border-accent";
  const label = "eyebrow text-text-muted";

  const shift = (delta: number) => {
    const [y, m, d] = day.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + delta);
    const p = (n: number) => String(n).padStart(2, "0");
    router.push(
      `/admin?dan=${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`
    );
  };

  const srDate = (() => {
    const [y, m, d] = day.split("-");
    return `${d}.${m}.${y}.`;
  })();

  return (
    <div className="space-y-10">
      {/* ---- day picker + load ------------------------------------------ */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label htmlFor="day-picker" className={label}>
            Datum
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => shift(-1)}
              aria-label="Prethodni dan"
            >
              ←
            </Button>
            <input
              id="day-picker"
              type="date"
              value={day}
              onChange={(e) => router.push(`/admin?dan=${e.target.value}`)}
              className="tabular rounded-sm border border-border bg-surface-raised px-4 py-3"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => shift(1)}
              aria-label="Sledeći dan"
            >
              →
            </Button>
          </div>
        </div>

        <form action={logout}>
          <Button type="submit" variant="ghost">
            <LogOut size={16} aria-hidden />
            Odjavi se
          </Button>
        </form>
      </div>

      <div className="rounded-sm border border-border bg-surface p-6">
        <p className="eyebrow text-text-muted">Popunjenost — {srDate}</p>
        <p className="tabular mt-2 text-3xl font-semibold">
          {taken} / {capacity} ležaljki
        </p>
        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-border"
          role="img"
          aria-label={`Zauzeto ${taken} od ${capacity}`}
        >
          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <p className="tabular mt-3 text-sm text-text-muted">
          {capacity === 0 ? "Dan je zatvoren." : `Slobodno još ${free}.`}
        </p>
      </div>

      {/* ---- bookings ---------------------------------------------------- */}
      <div>
        <h2 className="font-display text-2xl">Rezervacije</h2>
        {bookings.length === 0 ? (
          <p className="mt-4 text-text-muted">Za ovaj dan nema rezervacija.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {bookings.map((b) => {
              const holds = b.status === "pending" || b.status === "confirmed";
              return (
                <li key={b.id} className="flex flex-wrap items-start gap-4 py-4">
                  <div className="min-w-0 grow">
                    <div className="flex flex-wrap items-center gap-2">
                      {b.source === "phone" ? (
                        <Phone size={14} className="shrink-0 text-teak" aria-label="Telefonom" />
                      ) : (
                        <Globe size={14} className="shrink-0 text-teak" aria-label="Preko sajta" />
                      )}
                      <span className="font-semibold">{b.guestName}</span>
                      <span
                        className={`rounded-sm border px-2 py-0.5 text-xs ${
                          holds
                            ? "border-accent/50 text-accent"
                            : "border-border text-text-muted"
                        }`}
                      >
                        {b.statusLabel}
                      </span>
                    </div>
                    <p className="tabular mt-1 text-sm text-text-muted">
                      {b.sunbeds} ležaljki
                      {b.under4 > 0 && ` · ${b.under4} do 4 g.`}
                      {b.arrival === "afternoon" && " · od 15:00"}
                      {" · "}
                      {b.phone}
                      {b.email && ` · ${b.email}`}
                    </p>
                    {b.note && (
                      <p className="mt-1 text-sm text-text-muted">{b.note}</p>
                    )}
                  </div>

                  <span className="tabular shrink-0 font-semibold">{b.total}</span>

                  {holds && (
                    <form action={cancelAction} className="shrink-0">
                      <input type="hidden" name="id" value={b.id} />
                      <button
                        type="submit"
                        className="cursor-pointer rounded-sm border border-border p-2 text-text-muted transition-colors duration-200 hover:border-float-red hover:text-float-red"
                        aria-label={`Otkaži rezervaciju: ${b.guestName}`}
                      >
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <Message state={cancelState} />
      </div>

      {/* ---- add a phone booking ---------------------------------------- */}
      <div className="rounded-sm border border-border p-6">
        <h2 className="font-display text-2xl">Upiši telefonsku rezervaciju</h2>
        <p className="mt-2 text-sm text-text-muted">
          Rezervacije primljene telefonom moraju ući ovde — inače sajt ne zna za
          njih i može da primi goste za dan koji je zapravo pun.
        </p>

        <form action={addAction} className="mt-6 grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="datum" value={day} />

          <div className="sm:col-span-2">
            <label htmlFor="pb-ime" className={label}>Ime gosta</label>
            <input id="pb-ime" name="ime" type="text" required className={field} />
          </div>

          <div>
            <label htmlFor="pb-tel" className={label}>Telefon</label>
            <input id="pb-tel" name="telefon" type="tel" className={`tabular ${field}`} />
          </div>

          <div>
            <label htmlFor="pb-dolazak" className={label}>Dolazak</label>
            <select id="pb-dolazak" name="dolazak" className={field} defaultValue="full">
              <option value="full">Ceo dan — od 10:00</option>
              <option value="afternoon">Od 15:00 — 50% popusta</option>
            </select>
          </div>

          <div>
            <label htmlFor="pb-odrasli" className={label}>Odrasli</label>
            <input id="pb-odrasli" name="odrasli" type="number" min={0} max={40} defaultValue={2} className={`tabular ${field}`} />
          </div>

          <div>
            <label htmlFor="pb-deca" className={label}>Deca 4–12</label>
            <input id="pb-deca" name="deca4do12" type="number" min={0} max={40} defaultValue={0} className={`tabular ${field}`} />
          </div>

          <div>
            <label htmlFor="pb-tots" className={label}>Deca do 4</label>
            <input id="pb-tots" name="decaDo4" type="number" min={0} max={40} defaultValue={0} className={`tabular ${field}`} />
          </div>

          <div>
            <label htmlFor="pb-napomena" className={label}>Napomena</label>
            <input id="pb-napomena" name="napomena" type="text" className={field} />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit">Upiši rezervaciju</Button>
          </div>
        </form>
        <Message state={addState} />
      </div>

      {/* ---- capacity ---------------------------------------------------- */}
      <div className="rounded-sm border border-border p-6">
        <h2 className="font-display text-2xl">Kapacitet za {srDate}</h2>
        <p className="mt-2 text-sm text-text-muted">
          Podrazumevano je 40. Unesite <strong>0</strong> da zatvorite dan — tada
          se odbija svaka rezervacija.
        </p>

        <form action={capAction} className="mt-6 flex flex-wrap items-end gap-3">
          <input type="hidden" name="datum" value={day} />
          <div>
            <label htmlFor="cap-n" className={label}>Ležaljki</label>
            <input id="cap-n" name="kapacitet" type="number" min={0} max={500} defaultValue={capacity} className={`tabular ${field} w-28`} />
          </div>
          <div className="grow">
            <label htmlFor="cap-note" className={label}>Razlog (opciono)</label>
            <input id="cap-note" name="napomena" type="text" className={field} />
          </div>
          <Button type="submit" variant="secondary">Sačuvaj</Button>
        </form>
        <Message state={capState} />
      </div>
    </div>
  );
}

function Message({ state }: { state: AdminState }) {
  if (state.status === "idle") return null;
  const bad = state.status === "error";
  return (
    <p
      role={bad ? "alert" : "status"}
      className={`mt-4 rounded-sm border px-4 py-3 text-sm ${
        bad
          ? "border-float-red/60 bg-float-red/5 text-float-red"
          : "border-accent/50 bg-accent/5"
      }`}
    >
      {state.message}
    </p>
  );
}
