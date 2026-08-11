# Podešavanje rezervacija

Sve ostalo na sajtu radi bez ijedne lozinke. Ovo je jedini deo kome trebaju
nalozi — baza i slanje mejlova.

Dok `DATABASE_URL` nije podešen, `/book` radi normalno i računa cenu, ali na
slanje odgovara porukom da rezervacije trenutno nisu dostupne i upućuje na
telefon. Ništa ne puca.

---

## 1. Supabase

1. [supabase.com](https://supabase.com) → **New project**. Zapamti lozinku baze,
   prikazuje se samo jednom.
2. **Connect** → tab **Session pooler** → kopiraj connection string.

> ⚠️ **Mora session pooler (port 5432), ne transaction pooler (6543).**
> Rezervacija koristi `SELECT … FOR UPDATE` unutar transakcije. Transaction
> pooler ne drži sesiju kroz više naredbi, pa bi se zaključavanje otpustilo
> usred transakcije i dvoje gostiju bi moglo da uzme istu poslednju ležaljku.

3. `cp .env.example .env.local` i upiši `DATABASE_URL`.

## 2. Tabele

**Prvo proveri podešavanje** — `drizzle-kit` protiv pogrešnog URL-a ne prijavi
grešku, samo ne uradi ništa, što liči na uspeh:

```bash
cd site
node scripts/check-db.mjs
```

Kaže tačno šta fali: nepopunjen šablon, pogrešan pooler, loša lozinka,
duplirani ključ u `.env.local`. Kad prođe:

```bash
npx drizzle-kit migrate
node scripts/check-db.mjs   # potvrdi da tabele i RLS postoje
```

Napravi `bookings` i `day_capacity`, i **zaključa ih od Supabase javnog API-ja**.

> Supabase izlaže svaku tabelu iz `public` šeme preko PostgREST-a, a anon ključ
> je po definiciji javan. Bez tog zaključavanja bi se tim ključem pročitala
> imena, telefoni i mejlovi svih gostiju. Migracija uključuje RLS **bez ijedne
> politike** — aplikacija se povezuje kao `postgres`, koja RLS zaobilazi, pa
> ona i dalje ima pun pristup. Odsustvo politika **jeste** brava.

## 3. Resend

1. [resend.com](https://resend.com) → **API Keys** → novi ključ (dovoljno je
   slanje) → upiši u `RESEND_API_KEY`.
2. `OWNER_EMAIL` — adresa na koju stižu zahtevi za odobrenje.

> **Dok domen nije registrovan** (OPEN_QUESTIONS #7), Resend šalje samo na
> adresu vlasnika Resend naloga. Ceo tok radi; mejl gostu prosto neće stići na
> tuđu adresu. Kad domen stigne: verifikuj ga u Resendu i postavi
> `RESEND_FROM`. **Nijedna linija koda se ne menja.**

## 4. Pregled za vlasnika (`/admin`)

Postavi `OWNER_PASSWORD` u `.env.local` — bilo šta dugačko. Bez toga `/admin`
ne pušta nikoga (nikad se ne otvara sam).

Na `/admin` vlasnik za bilo koji dan vidi popunjenost, listu rezervacija (sa
oznakom da li su stigle sa sajta ili telefonom), i može da:

- **upiše telefonsku rezervaciju** — cena se računa istom funkcijom kao na sajtu
- **promeni kapacitet tog dana** — `0` zatvara dan
- **otkaže rezervaciju** i oslobodi mesta

> ⚠️ **Telefonske rezervacije MORAJU da se upisuju ovde.** Venue prima
> rezervacije telefonom i te rezervacije ne postoje u bazi same od sebe. Dok se
> ne upišu, baza kaže npr. 28/40 a stvarno stanje je 38/40 — i sajt će mirno
> primiti još dvanaest gostiju. Zaključavanje transakcije štiti samo od dva
> *online* zahteva u istoj sekundi; ne zna za svesku.

## 5. Testni podaci

```bash
node scripts/seed-bookings.mjs
```

Napravi namerno nezgodnu nedelju:

| Dan | Stanje |
|---|---|
| danas +2 | popunjen, 40/40 |
| danas +3 | skoro popunjen, 38/40 |
| danas +4 | **zatvoren**, kapacitet 0 |
| danas +5 | pola, 20/40 |
| danas +6 | prazan (nema reda — važi podrazumevanih 40) |

Šta probati na `/book`:

- **+3 sa 2 gosta** → prihvaćeno, stiže zahtev na `OWNER_EMAIL`
- **+3 sa 3 gosta** → odbijeno; ponuđeni sledeći termin **preskače zatvoreni +4**
  i nudi +5
- **+4 bilo koliko** → odbijeno, dan je zatvoren

`node scripts/seed-bookings.mjs --reset` briše testne redove (prepoznaju se po
telefonu `000000000`) i ne dira prave rezervacije.

## 6. Vercel

Root Directory = `site`. U **Settings → Environment Variables** unesi
`DATABASE_URL`, `RESEND_API_KEY`, `OWNER_EMAIL`, `OWNER_PASSWORD`,
`NEXT_PUBLIC_SITE_URL`
(produkcijski URL) i `RESEND_FROM` kad domen bude spreman.

---

## Kako tok radi

```
gost popuni /book
      ↓
server: validacija → CENA SE PONOVO RAČUNA (klijent je samo prikazuje)
      ↓
transakcija: zaključa dan → sabere zauzeto → uporedi sa kapacitetom
      ↓
   ┌──────────────┴───────────────┐
 ima mesta                    nema mesta
   ↓                              ↓
status "pending"             odmah odbijeno
mejl vlasniku sa linkom      mejl gostu + prvi slobodan termin
mejl gostu "zahtev primljen"
   ↓
vlasnik otvori link → stranica → dugme Prihvati / Odbij
   ↓
mejl gostu sa konačnim odgovorom
```

**Kapacitet je 40 ležaljki dnevno** (`src/content/booking.ts`), potvrđeno od
vlasnika. Pojedinačan dan se menja redom u `day_capacity`; kapacitet `0` znači
zatvoreno.

**Zahtev koji čeka odgovor drži ležaljku.** Da ne drži, venue bi mogao da primi
više zahteva nego što ima mesta i to otkrije tek pri odobravanju — pošto je
svima već rekao da je zahtev primljen.

**Link iz mejla ne menja ništa sam.** Otvara stranicu; promena se dešava tek na
pritisak dugmeta. Gmail i Outlook unapred otvaraju linkove iz poruka da bi ih
skenirali — da je odobravanje na GET, skener bi potvrđivao rezervacije umesto
vlasnika.

## Provere

```bash
node scripts/check-db.mjs             # .env.local, veza, tabele, RLS
node scripts/check-availability.mjs   # kapacitet i sledeći slobodan termin
node scripts/check-validate.mjs       # šta se sme upisati
node scripts/check-emails.mjs         # nije otvoreni relej, ne obećava uslove
node scripts/check-admin.mjs          # /admin je zaključan, cena se ne veruje formi
node scripts/check-price.mjs          # cene kroz pravu formu (treba dev server)
```

Sve osim `check-db` i `check-price` rade bez ijednog ključa i bez servera.
