import { Resend } from "resend";
import { business } from "@/content/business";
import {
  emailFrom,
  emailLabels as L,
  guestConfirmed,
  guestPending,
  guestRejected,
  ownerNotice,
} from "@/content/emails";
import { din } from "./price";

/**
 * Transactional email.
 *
 * ── THIS IS NOT AN OPEN RELAY ──────────────────────────────────────────────
 * The booking endpoint is public and unauthenticated, so the one thing that
 * must never be true is "an anonymous visitor can make this server send mail
 * to an address of their choosing with content of their choosing". Two rules
 * enforce that, and both are asserted in scripts/check-emails.mjs:
 *
 *   1. Every message goes to EITHER the address submitted with the booking, OR
 *      the venue's own inbox from `OWNER_EMAIL`. Nothing else, ever. No cc, no
 *      bcc, no reply-to that a visitor controls.
 *   2. Bodies are assembled here from `src/content/emails.ts` plus validated,
 *      escaped booking fields. No visitor string is ever concatenated into
 *      HTML unescaped.
 *
 * Rate limiting lives in `src/db/bookings.ts` — this module refuses nothing.
 *
 * ── DELIVERABILITY ─────────────────────────────────────────────────────────
 * Until a domain is registered and verified (OPEN_QUESTIONS.md #7), Resend's
 * shared sender only delivers to the Resend account owner's own address. The
 * whole flow still runs; guest mail simply will not arrive elsewhere. Set
 * `RESEND_FROM` once the domain is verified — no code changes.
 */

let resend: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.OWNER_EMAIL);
}

function client(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY nije podešen — vidi site/SETUP.md.");
  }
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

/** Minimal HTML escaping. Every guest-supplied value passes through this. */
function esc(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** dd.mm.yyyy. — the way a date is written and read aloud in Serbian. */
export function dateSr(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}.${y}.` : iso;
}

export type BookingSummary = {
  visitDate: string;
  ticket: string;
  arrival: string;
  adults: number;
  children: number;
  under4: number;
  sunbeds: number;
  totalRsd: number;
  guestName: string;
  phone: string;
  email: string | null;
};

function detailRows(b: BookingSummary): [string, string][] {
  const rows: [string, string][] = [
    [L.date, dateSr(b.visitDate)],
    [L.ticket, b.ticket === "matine" ? L.ticketMatine : L.ticketDay],
  ];
  if (b.ticket === "day") {
    rows.push([
      L.arrival,
      b.arrival === "afternoon" ? L.arrivalAfternoon : L.arrivalFull,
    ]);
  }
  if (b.adults > 0) rows.push([L.adults, String(b.adults)]);
  if (b.children > 0) rows.push([L.children, String(b.children)]);
  if (b.under4 > 0) rows.push([L.under4, `${b.under4} — ${L.free}`]);
  rows.push([L.sunbeds, String(b.sunbeds)]);
  rows.push([L.total, `${din(b.totalRsd)} din`]);
  return rows;
}

function shell({
  heading,
  paragraphs,
  rows,
  extra,
  closing,
  sign,
}: {
  heading: string;
  paragraphs: string[];
  rows?: [string, string][];
  extra?: string;
  closing?: string;
  sign: string;
}): string {
  const table = rows
    ? `<table style="border-collapse:collapse;margin:24px 0;width:100%;max-width:420px">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 0;color:#6B5C4F;font-size:14px">${esc(k)}</td>` +
            `<td style="padding:6px 0;text-align:right;font-weight:600">${esc(v)}</td></tr>`
        )
        .join("")}</table>`
    : "";

  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#FAF6EF;color:#241C16;padding:32px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #DDD0BD;border-radius:4px;padding:32px">
    <p style="letter-spacing:.18em;text-transform:uppercase;font-size:12px;color:#C89B4A;margin:0 0 8px">${esc(business.name)}</p>
    <h1 style="font-size:26px;margin:0 0 20px">${esc(heading)}</h1>
    ${paragraphs.map((p) => `<p style="line-height:1.6;margin:0 0 12px">${esc(p)}</p>`).join("")}
    ${table}
    ${extra ?? ""}
    ${closing ? `<p style="margin:24px 0 0;color:#C89B4A;font-size:18px">${esc(closing)}</p>` : ""}
    <hr style="border:none;border-top:1px solid #DDD0BD;margin:28px 0 16px">
    <p style="white-space:pre-line;color:#6B5C4F;font-size:13px;margin:0">${esc(sign)}</p>
  </div>
</div>`;
}

async function send(to: string, subject: string, html: string) {
  const from = process.env.RESEND_FROM || emailFrom.fallback;
  return client().emails.send({ from, to: [to], subject, html });
}

/** Guest — request received, awaiting the venue's answer. */
export async function sendGuestPending(b: BookingSummary) {
  if (!b.email) return;
  await send(
    b.email,
    guestPending.subject,
    shell({
      heading: guestPending.heading,
      paragraphs: guestPending.body,
      rows: detailRows(b),
      closing: guestPending.closing,
      sign: guestPending.sign,
    })
  );
}

/** Guest — confirmed by the venue. */
export async function sendGuestConfirmed(b: BookingSummary) {
  if (!b.email) return;
  await send(
    b.email,
    guestConfirmed.subject,
    shell({
      heading: guestConfirmed.heading,
      paragraphs: guestConfirmed.body,
      rows: detailRows(b),
      closing: guestConfirmed.closing,
      sign: guestConfirmed.sign,
    })
  );
}

/** Guest — the day is full. Carries an alternative date when one exists. */
export async function sendGuestRejected(
  b: BookingSummary,
  nextFree: string | null
) {
  if (!b.email) return;
  const paragraphs = [...guestRejected.body];
  paragraphs.push(
    nextFree
      ? `${guestRejected.nextFreeLead} ${dateSr(nextFree)}`
      : guestRejected.noNextFree
  );

  await send(
    b.email,
    guestRejected.subject,
    shell({
      heading: guestRejected.heading,
      paragraphs,
      rows: detailRows(b),
      closing: guestRejected.closing,
      sign: guestRejected.sign,
    })
  );
}

/**
 * The venue — with the decision link.
 *
 * Goes ONLY to `OWNER_EMAIL`, never to an address from the form.
 */
export async function sendOwnerNotice(
  b: BookingSummary,
  decisionUrl: string,
  /** Day load INCLUDING this request, so the owner can judge at a glance. */
  load?: { taken: number; capacity: number }
) {
  const to = process.env.OWNER_EMAIL;
  if (!to) throw new Error("OWNER_EMAIL nije podešen — vidi site/SETUP.md.");

  const contact: [string, string][] = [
    [L.name, b.guestName],
    [L.phone, b.phone],
    ...(b.email ? ([[L.email, b.email]] as [string, string][]) : []),
  ];

  const loadRow: [string, string][] = load
    ? [[ownerNotice.loadLabel, `${load.taken} / ${load.capacity}`]]
    : [];

  await send(
    to,
    ownerNotice.subject(dateSr(b.visitDate), b.guestName),
    shell({
      heading: ownerNotice.heading,
      paragraphs: load
        ? [ownerNotice.loadLine(load.taken, load.capacity), ownerNotice.fits]
        : [ownerNotice.fits],
      rows: [...detailRows(b), ...loadRow, ...contact],
      extra: `<p style="margin:24px 0 8px"><a href="${esc(decisionUrl)}" style="display:inline-block;background:#C89B4A;color:#241C16;text-decoration:none;padding:14px 24px;border-radius:4px;font-weight:600">${esc(ownerNotice.cta)}</a></p>
      <p style="color:#6B5C4F;font-size:13px;margin:0">${esc(ownerNotice.note)}</p>`,
      sign: business.name,
    })
  );
}
