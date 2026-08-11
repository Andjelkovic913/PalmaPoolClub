/**
 * Server-side validation of a booking request.
 *
 * Everything arriving from the browser is treated as hostile, including the
 * total: the client shows a price, it never sets one. The server recomputes it
 * with the same `priceFor()` the form uses. A request claiming 2 adults cost
 * 1 dinar is simply priced correctly and stored correctly.
 *
 * Hand-rolled rather than pulled from a schema library: seven fields with
 * simple rules, and every branch is covered by scripts/check-validate.mjs.
 * No imports here on purpose, so that script can load this file directly.
 */

export const MAX_PER_FIELD = 20;
export const MAX_NAME = 80;
export const MAX_PHONE = 32;
export const MAX_EMAIL = 160;

export type ValidBooking = {
  visitDate: string;
  ticket: "day" | "matine";
  arrival: "full" | "afternoon";
  adults: number;
  children: number;
  under4: number;
  guestName: string;
  phone: string;
  email: string | null;
};

export type ValidationResult =
  | { ok: true; value: ValidBooking }
  | { ok: false; errors: string[] };

/** `YYYY-MM-DD`, and a real calendar date — 2026-02-31 is rejected. */
export function isIsoDate(v: unknown): v is string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

/**
 * Deliberately permissive: one @, no whitespace, a dot in the domain.
 * Over-strict email regexes reject valid addresses, and the real proof that an
 * address works is that the confirmation arrives at it.
 */
export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= MAX_EMAIL;
}

function intInRange(v: unknown, max: number): number | null {
  const n = typeof v === "number" ? v : Number(String(v ?? "").trim());
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > max) {
    return null;
  }
  return n;
}

/**
 * `today` is injected rather than read from the clock so the check script can
 * test the past-date rule without depending on the day it runs.
 */
export function validateBooking(
  raw: Record<string, unknown>,
  today: string
): ValidationResult {
  const errors: string[] = [];

  const visitDate = isIsoDate(raw.visitDate) ? raw.visitDate : null;
  if (!visitDate) errors.push("Datum nije ispravan.");
  else if (visitDate < today) errors.push("Datum je u prošlosti.");

  const ticket = raw.ticket === "matine" ? "matine" : "day";
  const arrival = raw.arrival === "afternoon" ? "afternoon" : "full";

  const adults = intInRange(raw.adults, MAX_PER_FIELD);
  const children = intInRange(raw.children, MAX_PER_FIELD);
  const under4 = intInRange(raw.under4, MAX_PER_FIELD);
  if (adults === null || children === null || under4 === null) {
    errors.push("Broj gostiju nije ispravan.");
  } else if (adults + children < 1) {
    errors.push("Potreban je bar jedan gost koji plaća.");
  }

  const guestName = String(raw.guestName ?? "").trim();
  if (guestName.length < 2) errors.push("Unesite ime i prezime.");
  else if (guestName.length > MAX_NAME) errors.push("Ime je predugačko.");

  const phoneRaw = String(raw.phone ?? "").trim();
  const digits = phoneRaw.replace(/\D/g, "");
  if (digits.length < 6) errors.push("Unesite ispravan broj telefona.");
  else if (phoneRaw.length > MAX_PHONE) errors.push("Broj telefona je predugačak.");

  const emailRaw = String(raw.email ?? "").trim();
  let email: string | null = null;
  if (emailRaw) {
    if (!isEmail(emailRaw)) errors.push("E-mail adresa nije ispravna.");
    else email = emailRaw.toLowerCase();
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      visitDate: visitDate as string,
      ticket,
      arrival,
      adults: adults as number,
      children: children as number,
      under4: under4 as number,
      guestName,
      phone: phoneRaw,
      email,
    },
  };
}
