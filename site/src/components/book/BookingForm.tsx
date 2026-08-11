"use client";

import { useActionState, useId, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Minus, Plus } from "lucide-react";
import { submitBooking, type BookingState } from "@/app/book/actions";
import { Button } from "../Button";
import { business } from "@/content/business";
import { upcomingEvents } from "@/content/events";
import {
  din,
  priceFor,
  type Arrival,
  type TicketType,
} from "@/lib/price";

/**
 * The booking form.
 *
 * Submitting writes a real row and emails the venue; capacity is checked under
 * a lock so a full day is refused immediately with an alternative date offered.
 * The flow, the guard rails and the reasons are documented in
 * `src/app/book/actions.ts` and `src/db/bookings.ts`.
 *
 * ── WHAT THIS SCREEN PROMISES, EXACTLY ─────────────────────────────────────
 * A submitted request is **pending**, not confirmed. The owner answers with one
 * click and the guest gets a second email with the real answer. Nothing here
 * may say "potvrđeno" — that word belongs only to a booking the owner has
 * accepted, and `scripts/check-price.mjs` asserts this page never claims it.
 *
 * The price shown is the same `priceFor()` the server re-runs on submit, so
 * the guest cannot be quoted one number and charged another — but the server's
 * result is the one that is stored. The client displays a price; it never sets
 * one.
 */

const MAX = 20;

export function BookingForm() {
  const ids = useId();
  const f = (name: string) => `${ids}-${name}`;

  const [state, formAction] = useActionState<BookingState, FormData>(
    submitBooking,
    { status: "idle" }
  );

  /* Both known Matine dates are in the past, so this is empty today and the
     Matine option does not render. Never offer a ticket to an event that does
     not exist — same rule as /events. */
  const upcoming = upcomingEvents();
  const matineAvailable = upcoming.length > 0;

  const [date, setDate] = useState("");
  const [ticket, setTicket] = useState<TicketType>("day");
  const [arrival, setArrival] = useState<Arrival>("full");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [under4, setUnder4] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const price = useMemo(
    () =>
      priceFor({
        date,
        ticket,
        arrival,
        party: { adults, children4to12: children, under4 },
      }),
    [date, ticket, arrival, adults, children, under4]
  );

  const missing: string[] = [];
  if (!date) missing.push("datum");
  if (price.sunbeds < 1) missing.push("bar jedan gost koji plaća");
  if (!name.trim()) missing.push("ime");
  if (!phone.trim()) missing.push("telefon");
  const ready = missing.length === 0;

  const field =
    "mt-1.5 w-full rounded-sm border border-border bg-surface-raised px-4 py-3 text-text transition-colors duration-200 focus-visible:border-accent";
  const label = "eyebrow text-text-muted";

  return (
    <form
      action={formAction}
      className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start"
    >
      {/* Honeypot. Hidden from people, irresistible to bots — a filled value
          makes the server drop the request silently. `tabIndex={-1}` and
          `aria-hidden` keep it out of the keyboard path and the a11y tree, so
          it never traps a screen-reader user. */}
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor={f("website")}>Ne popunjavajte ovo polje</label>
        <input
          id={f("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-8">
        {/* ---- Datum i tip karte ---------------------------------------- */}
        <fieldset className="space-y-5">
          <legend className="font-display text-xl">Termin</legend>

          <div>
            <label htmlFor={f("date")} className={label}>
              Datum
            </label>
            <input
              id={f("date")}
              name="datum"
              type="date"
              required
              /* Season end is unknown, so only the past is blocked. */
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`tabular ${field}`}
            />
            {date && (
              <p className="tabular mt-2 text-sm text-text-muted">
                {price.isWeekend ? "Vikend cena" : "Cena za radne dane"}
              </p>
            )}
          </div>

          {matineAvailable && (
            <div>
              <span className={label}>Tip karte</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {(
                  [
                    ["day", "Dnevna karta"],
                    ["matine", "Matine ulaznica"],
                  ] as [TicketType, string][]
                ).map(([value, text]) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-sm border px-4 py-2.5 transition-colors duration-200 ${
                      ticket === value
                        ? "border-accent bg-accent/10 font-semibold"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tip"
                      value={value}
                      checked={ticket === value}
                      onChange={() => setTicket(value)}
                      className="sr-only"
                    />
                    {text}
                  </label>
                ))}
              </div>
            </div>
          )}

          {ticket === "day" && (
            <div>
              <span className={label}>Dolazak</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {(
                  [
                    ["full", "Ceo dan — od 10:00"],
                    ["afternoon", "Od 15:00 — 50% popusta"],
                  ] as [Arrival, string][]
                ).map(([value, text]) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-sm border px-4 py-2.5 transition-colors duration-200 ${
                      arrival === value
                        ? "border-accent bg-accent/10 font-semibold"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dolazak"
                      value={value}
                      checked={arrival === value}
                      onChange={() => setArrival(value)}
                      className="sr-only"
                    />
                    {text}
                  </label>
                ))}
              </div>
            </div>
          )}
        </fieldset>

        {/* ---- Gosti ----------------------------------------------------- */}
        <fieldset className="space-y-4">
          <legend className="font-display text-xl">Gosti</legend>

          <Counter
            id={f("adults")}
            name="odrasli"
            label="Odrasli"
            value={adults}
            onChange={setAdults}
          />
          <Counter
            id={f("children")}
            name="deca4do12"
            label="Deca od 4 do 12 godina"
            hint="50% od cene za odrasle"
            value={children}
            onChange={setChildren}
          />
          <Counter
            id={f("under4")}
            name="decaDo4"
            label="Deca do 4 godine"
            hint="Besplatno — ne zauzimaju ležaljku"
            value={under4}
            onChange={setUnder4}
          />
        </fieldset>

        {/* ---- Kontakt --------------------------------------------------- */}
        <fieldset className="space-y-5">
          <legend className="font-display text-xl">Kontakt</legend>

          <div>
            <label htmlFor={f("name")} className={label}>
              Ime i prezime
            </label>
            <input
              id={f("name")}
              name="ime"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor={f("phone")} className={label}>
              Telefon
            </label>
            <input
              id={f("phone")}
              name="telefon"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`tabular ${field}`}
            />
          </div>

          <div>
            <label htmlFor={f("email")} className={label}>
              E-mail <span className="normal-case">(nije obavezno)</span>
            </label>
            <input
              id={f("email")}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
        </fieldset>
      </div>

      {/* ---- Cena + slanje ---------------------------------------------- */}
      <aside
        className="rounded-sm border border-border bg-surface p-6 lg:sticky lg:top-24"
        aria-labelledby={f("summary-heading")}
      >
        <h2 id={f("summary-heading")} className="font-display text-2xl">
          Vaša rezervacija
        </h2>

        {/* The live total. `aria-live` so a screen-reader user hears the price
            change as they adjust the party, instead of having to hunt for it. */}
        <div className="mt-5" aria-live="polite">
          {price.lines.length === 0 ? (
            <p className="text-text-muted">Izaberite broj gostiju.</p>
          ) : (
            <dl className="space-y-2">
              {price.lines.map((l) => (
                <div key={l.label} className="flex items-baseline gap-3">
                  <dt className="text-sm text-text-muted">
                    {l.label} × {l.count}
                  </dt>
                  <span
                    aria-hidden
                    className="min-w-4 grow translate-y-[-4px] border-b border-dotted border-border"
                  />
                  <dd className="tabular shrink-0 font-semibold">
                    {l.total === 0 ? "Besplatno" : `${din(l.total)} din`}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {price.halfDay && (
            <p className="mt-3 text-sm text-accent">
              Poludnevna karta — 50% popusta primenjeno.
            </p>
          )}

          <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-display text-xl">Ukupno</span>
            <span className="tabular text-2xl font-semibold">
              {din(price.total)} din
            </span>
          </div>

          {price.sunbeds > 0 && (
            <p className="tabular mt-2 text-sm text-text-muted">
              {price.sunbeds} ležaljki · {price.guests} gostiju
            </p>
          )}
        </div>

        <p className="mt-6 text-sm text-text-muted">
          Plaćanje na licu mesta. Bez online plaćanja.
        </p>

        {/* Deliberately "Pošalji zahtev", not "Rezerviši": the request is
            pending until the venue answers. See the note at the top. */}
        <SubmitButton
          disabled={!ready}
          onGuard={() => setTouched(true)}
        />

        {touched && !ready && (
          <p role="alert" className="mt-3 text-sm text-float-red">
            Popunite još: {missing.join(", ")}.
          </p>
        )}

        <Outcome state={state} />

        <p className="mt-4 text-center text-sm text-text-muted">
          Ili nas pozovite:{" "}
          <a
            href={`tel:${business.phone.href}`}
            className="tabular cursor-pointer underline-offset-4 hover:text-accent hover:underline"
          >
            {business.phone.display}
          </a>
        </p>
      </aside>
    </form>
  );
}

/**
 * Submit, aware of the in-flight request.
 *
 * `useFormStatus` has to read from a child of the <form>, which is why this is
 * its own component. Disabling while pending is what stops a double-tap on a
 * slow connection from creating two bookings for the same party.
 */
function SubmitButton({
  disabled,
  onGuard,
}: {
  disabled: boolean;
  onGuard: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      /* No `opacity` for the disabled state — scripts/shoot.mjs counts anything
         below 0.99 as a possibly-unfired <Reveal>. Colour instead. The hover
         lift is suppressed too, so a dead button does not animate as if live. */
      className="mt-6 w-full disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-none"
      disabled={disabled || pending}
      onClick={onGuard}
    >
      {pending ? (
        "Šaljemo…"
      ) : (
        <>
          <Check size={16} aria-hidden />
          Pošalji zahtev
        </>
      )}
    </Button>
  );
}

/**
 * What came back.
 *
 * Three outcomes, and the wording of each is load-bearing:
 *
 *   pending — the request is IN, not confirmed. Says so plainly, because the
 *             owner still has to answer and a guest must not set off for
 *             Kosmaj on the strength of this screen.
 *   full    — refused before anything was promised, with the next free date so
 *             the guest has somewhere to go rather than a dead end.
 *   error   — validation or a configuration problem; always leaves the phone
 *             number as a way through.
 */
function Outcome({ state }: { state: BookingState }) {
  if (state.status === "idle") return null;

  if (state.status === "error") {
    return (
      <div role="alert" className="mt-4 rounded-sm border border-float-red/60 bg-float-red/5 p-4">
        <ul className="space-y-1 text-sm text-float-red">
          {state.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (state.status === "full") {
    return (
      <div role="status" className="mt-4 rounded-sm border border-border bg-surface-raised p-5">
        <p className="font-display text-xl">Termin je popunjen</p>
        <p className="tabular mt-2 text-sm text-text-muted">
          Za taj datum je slobodno još {state.free} ležaljki, a tražili ste{" "}
          {state.requested}.
        </p>
        <p className="mt-3">
          {state.nextFree ? (
            <>
              Prvi sledeći slobodan termin:{" "}
              <span className="tabular font-semibold">
                {srDate(state.nextFree)}
              </span>
            </>
          ) : (
            "U narednih mesec dana nemamo termin sa dovoljno mesta za vašu grupu. Pozovite nas i naći ćemo rešenje."
          )}
        </p>
        {state.emailed && (
          <p className="mt-3 text-sm text-text-muted">
            Poslali smo vam i e-mail sa ovim predlogom.
          </p>
        )}
      </div>
    );
  }

  return (
    <div role="status" className="mt-4 rounded-sm border border-accent/40 bg-accent/5 p-5">
      <p className="font-display text-xl">Zahtev je primljen</p>
      <p className="mt-2">
        Za {srDate(state.visitDate)} — ukupno{" "}
        <span className="tabular font-semibold">{din(state.total)} din</span>.
      </p>
      <p className="mt-3 text-sm text-text-muted">
        {state.emailed
          ? "Potvrdu šaljemo na vaš e-mail čim odobrimo zahtev."
          : "Javljamo vam se telefonom čim odobrimo zahtev."}
      </p>
    </div>
  );
}

function srDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
}

/**
 * Number stepper.
 *
 * A plain `<input type="number">` on mobile gives a fiddly spinner and pops a
 * full keyboard for a value between 0 and 20. The buttons are the primary
 * control; the input stays a real number input so it is still typeable and
 * still announces its value.
 */
function Counter({
  id,
  name,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const clamp = (n: number) => Math.min(MAX, Math.max(0, n));

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="block">
          {label}
        </label>
        {hint && <p className="text-sm text-text-muted">{hint}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <StepButton
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= 0}
          aria-label={`Smanji: ${label}`}
        >
          <Minus size={16} aria-hidden />
        </StepButton>
        <input
          id={id}
          name={name}
          type="number"
          min={0}
          max={MAX}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="tabular w-14 rounded-sm border border-border bg-surface-raised py-2 text-center"
        />
        <StepButton
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= MAX}
          aria-label={`Povećaj: ${label}`}
        >
          <Plus size={16} aria-hidden />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  children,
  ...rest
}: React.ComponentProps<"button"> & { "aria-label": string }) {
  return (
    <button
      type="button"
      /* Disabled is shown with COLOUR, not `opacity`: scripts/shoot.mjs counts
         anything below opacity 0.99 as a possibly-unfired <Reveal>, and a
         permanently dimmed control would sit in that check as false noise. */
      className="cursor-pointer rounded-sm border border-border p-2.5 transition-colors duration-200 hover:border-accent disabled:cursor-not-allowed disabled:border-border/60 disabled:text-border disabled:hover:border-border/60"
      {...rest}
    >
      {children}
    </button>
  );
}
