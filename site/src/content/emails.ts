import { business } from "./business";

/**
 * Every word the booking system sends by email.
 *
 * Same rule as the rest of the site: no Serbian prose typed inside a component
 * or an action. These are authored (nothing scraped covers transactional
 * email), and they are held to the same limit as the drafted FAQ answers —
 * **they state no commercial terms.** No refund window, no cancellation
 * deadline, no guarantee beyond "the sunbed is held for you". OPEN_QUESTIONS.md
 * #3 is still open and an email is the worst possible place to invent a policy,
 * because the guest keeps it.
 *
 * `scripts/check-emails.mjs` fails if that ever stops being true.
 */

export const emailFrom = {
  /**
   * Overridden by RESEND_FROM once a domain is verified. Until then Resend's
   * shared sender only delivers to the account owner's own address — see
   * SETUP.md and OPEN_QUESTIONS.md #7.
   */
  fallback: "Palma Pool Club <onboarding@resend.dev>",
  replyTo: business.phone.display,
};

const sign = `${business.name}\n${business.address.full}\n${business.phone.display}\n${business.instagram.url}`;

/** Sent to the guest the moment a request is accepted into the queue. */
export const guestPending = {
  subject: "Primili smo vaš zahtev — Palma Pool Club",
  heading: "Zahtev je primljen",
  body: [
    "Hvala vam! Primili smo zahtev za rezervaciju i javljamo se čim ga potvrdimo.",
    "Potvrdu dobijate na ovu adresu.",
  ],
  closing: "Hvala što ste deo naše palme!",
  sign,
};

/** Sent to the guest when the owner accepts. */
export const guestConfirmed = {
  subject: "Rezervacija je potvrđena — Palma Pool Club",
  heading: "Vidimo se!",
  body: [
    "Vaša rezervacija je potvrđena. Ležaljke vas čekaju na izabrani datum.",
    "Plaćanje je na licu mesta.",
  ],
  closing: "Hvala što ste deo naše palme!",
  sign,
};

/**
 * Sent when the day is full — either refused straight away, or refused by the
 * owner. Always carries an alternative when one exists inside the horizon.
 */
export const guestRejected = {
  subject: "Nažalost, termin je popunjen — Palma Pool Club",
  heading: "Termin je popunjen",
  body: [
    "Hvala na interesovanju. Nažalost, za izabrani datum nemamo dovoljno slobodnih ležaljki.",
  ],
  /** Followed by the date. Kept as a fragment so the date can be formatted. */
  nextFreeLead: "Prvi sledeći slobodan termin za vaš broj gostiju je",
  noNextFree:
    "U narednih mesec dana nemamo termin sa dovoljno slobodnih ležaljki za vašu grupu. Pozovite nas i naći ćemo rešenje.",
  closing: "Radujemo se vašoj poseti.",
  sign,
};

/**
 * Sent to the venue. This is the one with the decision link.
 *
 * It states how full the day already is, because otherwise the owner is being
 * asked to decide with no information — the whole point of the approval step
 * is judgement, and judgement needs context. Note the framing of `fits`:
 * capacity has ALREADY been enforced, so the answer is never "is there room",
 * only "do we want this booking".
 */
export const ownerNotice = {
  subject: (date: string, name: string) =>
    `Nova rezervacija — ${date} — ${name}`,
  heading: "Novi zahtev za rezervaciju",
  cta: "Otvori i odgovori",
  note: "Link otvara stranicu na kojoj potvrđujete ili odbijate zahtev.",
  /** e.g. "Za taj dan: 28 od 40 ležaljki (uključujući ovaj zahtev)." */
  loadLine: (taken: number, capacity: number) =>
    `Za taj dan: ${taken} od ${capacity} ležaljki, uključujući ovaj zahtev.`,
  fits: "Mesto postoji — sistem je to već proverio. Odlučujete samo da li prihvatate gosta.",
  loadLabel: "Popunjenost dana",
};

/** Field labels shared by every message, so the guest and the venue see the same words. */
export const emailLabels = {
  date: "Datum",
  ticket: "Tip karte",
  arrival: "Dolazak",
  adults: "Odrasli",
  children: "Deca od 4 do 12 godina",
  under4: "Deca do 4 godine",
  sunbeds: "Ležaljke",
  total: "Ukupno",
  name: "Ime i prezime",
  phone: "Telefon",
  email: "E-mail",
  free: "Besplatno",
  ticketDay: "Dnevna karta",
  ticketMatine: "Matine ulaznica",
  arrivalFull: "Ceo dan — od 10:00",
  arrivalAfternoon: "Od 15:00 — poludnevna",
};
