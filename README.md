# The Anxious Patient Experience™: website

GYA build for Dr Lorna Gladwin. Five pages (Home, Understanding the Experience, Meet the Team, Book Now, FAQs) plus
the global header, footer and health disclaimer, built word for word from the approved copy doc (29 Sep 2026,
kept in `docs/approved-copy.md`).

Stack: Next.js 15.4 App Router, TypeScript, deployed to Vercel from a private GitHub repo. Next is pinned to
15.4.11 on purpose: it is the range Payload 3.9x accepts, so the GYA client dashboard can be added later without
a framework upgrade.

---

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
npm run build && npm start
```

Checks (run against a started server):

```bash
npm run qa:copy -- http://localhost:3000     # every approved line appears on the right page, meta included
npm run qa:dashes -- http://localhost:3000   # no em or en dashes in source, content or rendered pages
npm run typecheck
```

## Deploy (Vercel)

1. Push this folder to a new private GitHub repo.
2. Vercel, Add New Project, import the repo. Framework preset: Next.js. No build settings to change.
3. Environment variables (Production and Preview):

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://[domain]` | Canonical tags, sitemap and share images. Placeholder until the domain is confirmed. |
| `BOOKING_PROVIDER` | `mock` | Only provider built so far. See Booking integration. |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | | Only when the live payment integration is built. |

4. Deploy. Any `*.vercel.app` address is sent `X-Robots-Tag: noindex` from `next.config.mjs`, so staging never
   competes with the live site.
5. Go-live: add the domain in Vercel, point DNS at Vercel, apex as primary with www 308 redirecting to it.

---

## Where things live

```
src/
  site.config.ts          Site settings and feature flags: contact details, nav, booking product,
                          mock APE sessions, tracking IDs, future-module switches
  content/pages/*.json    Page copy, one file per page, word for word from the approved doc
  content/types.ts        Shared content types (link, image slot, team member)
  app/(frontend)/         Public pages and the shared header/footer layout
  app/api/booking/        Booking API: availability, hold, deposit (the integration point)
  lib/booking/            Provider contract (types.ts), mock provider, provider switch (index.ts)
  lib/text.tsx            Renders copy: typographic quotes, [placeholder] highlighting
  lib/seo.ts              Meta tags per page, organisation schema
  components/             Header, Footer, BookingFlow, Accordion, VideoSection, shared UI
  fonts/                  Playfair Display and Figtree, self-hosted (SIL OFL)
docs/
  approved-copy.md        The approved copy doc, as supplied
  FUTURE-MODULES.md       How member areas, courses, search and the directory slot in later
scripts/                  qa:copy and qa:dashes
```

**Copy rule.** Every visible line comes from `src/content/pages/*.json`, which matches the doc exactly (the doc's
straight quotes are kept in the files and typeset as curly quotes when rendered; switch off with
`typography.smartQuotes`). Section names and dev notes from the doc are not published. The only text on the
pages that is not in the doc is listed under "UI labels not in the copy doc" below.

## Feature flags (`src/site.config.ts`)

| Flag | Default | What it does |
|---|---|---|
| `features.walkthroughVideo` | `false` | Phase 2 "See it for yourself" block on Home and Understanding. Set `walkthroughVideo.src` and `poster` when the videos exist. Tested on and off. |
| `features.memberArea`, `courses`, `practitionerDirectory`, `practitionerSearch` | `false` | Reserved. Nothing is built. See `docs/FUTURE-MODULES.md`. |
| `typography.smartQuotes` | `true` | Curly quotes at render. |

---

## Booking integration

**What is built.** The full Book Now journey: appointment card, "Choose a time", the four steps as a progress
indicator, a slot picker showing APE sessions only, the details form, the deposit and cancellation policy directly
above the payment button with a required checkbox (the button stays disabled until it is ticked, and the API
refuses a deposit request without it), and the confirmation screen. It runs on a **mock provider**: sample APE
sessions (Tuesdays and Thursdays at 9am, 11am and 2pm, Sydney time, 48 hours' minimum notice, set in
`booking.mockSessions`) and no payment is taken. A yellow "Test mode" note shows under the payment button while
the mock is active.

**The integration point.** The page only talks to `/api/booking/availability`, `/api/booking/hold` and
`/api/booking/deposit`. Those call a `BookingProvider` (`src/lib/booking/types.ts`) chosen by `BOOKING_PROVIDER`.
Connecting the live system means writing one provider file and registering it in `src/lib/booking/index.ts`; the
pages do not change. A hosted payment page returns the patient to `/book-now/?confirmed=1&ref=...`, which shows
the confirmation screen.

**What is needed to connect it:**

1. **Where APE availability comes from.** Either the practice booking system (confirm it can expose a dedicated
   APE appointment type on designated days and clinicians, with capacity the practice controls, through an API or
   an online booking link) or APE sessions managed by GYA in the site dashboard, with reception entering each
   booking into the practice system. This decision drives the rest.
2. **The real APE days, times, clinicians and capacity**, and the practice location for these appointments.
3. **Payment gateway.** Stripe (recommended: Checkout for the $100 deposit, refunds from the Stripe dashboard) or
   the practice's existing gateway via GYA/SmileOx. For Stripe: the practice's Stripe account, test keys first,
   then live keys and a webhook endpoint (`/api/booking/webhook`, to be added with the provider).
4. **Who is notified.** Booking emails through SMTP2GO to reception, the SmileOx intake address and
   rowayne@gyaclients.com, from an SMTP2GO-verified domain, plus the patient confirmation email ("Your
   appointment details have been sent to your email" is already on the confirmation screen).
5. **Deposit accounting** (from the copy doc's open items): whether the $100 comes off the $350 fee, and how
   transfers and refunds are handled.

---

## Placeholders (square brackets, highlighted yellow on the site)

| Placeholder | Where |
|---|---|
| `[Surname]` | Meet the Team, Alex's name |
| `[Phone]`, `[Email]`, `[Practice address]` | Footer contact block, on every page |
| `[Practice address]` | Booking location for APE sessions (`booking.mockSessions.location`) |
| `[domain]` | `NEXT_PUBLIC_SITE_URL` |
| `[Privacy policy ...]` | `/privacy-policy/` (placeholder page so the footer link works; noindex) |
| Talk to Alex | Every "Talk to Alex" button goes to the footer contact block (`#contact`) until Alex's contact method is confirmed. Change `contact.talkToAlexHref` once. |
| Images | Alex's portrait, shown as a labelled placeholder. Lorna's portrait and both Understanding images are in place. |
| Logo | The navy tile is a CSS stand-in. Drop the real logo file in and swap `LogoTile` in `components/Header.tsx`. |

## UI labels not in the copy doc (for sign-off)

Kept to what the booking flow and accessibility need:

- Booking form labels, from Lorna's Canva concept: "Your name", "Email address", "Phone number (optional)",
  "What would you like support with? (optional)".
- Booking flow: "Continue", "Back", "Loading available times", "No appointments are available right now.",
  "Please enter your name.", "Please enter a valid email address.", and the test-mode note (mock only).
- "Skip to content" (keyboard users), "Open menu" / "Close menu" (screen readers), "Page not found" and "Home" on
  the 404 page.

## Changes from the homepage prototype (v2)

Copy that was in the prototype but is not in the approved doc has been removed: "Anxiety does not need to be
something you face alone.", the paragraph under it, the hero caption "A slower, more supported way forward.",
the "Three ways to begin feeling more supported" section, the "Designed around your experience" section, the
pathway card link labels, the footer column headings and extra links, and the "Website by Generate Your Audience"
credit. The lamp, sofa and waiting-nook photos are kept (Home hero, Home heart section, Book Now hero).

---

## Not in this release

- **Client dashboard.** The GYA standard (Payload at `/cms`, the practice dashboard at `/admin`, Neon + Blob) is
  added as a retrofit, following `gya-site-kit/cms-retrofit-static-sites.md`. The content is already one JSON file
  per page and `site.config.ts` is already the defaults object, which is the shape that retrofit expects.
- **SMTP2GO relay.** There is no enquiry form on the approved pages; the booking provider will send the emails.

## Go-live checklist

- [ ] Every yellow placeholder replaced (search the site for `[`)
- [ ] Phone, email, address and APE location confirmed against the brief
- [ ] Booking provider connected and tested end to end in test mode, then live
- [ ] Deposit and cancellation policy wording re-checked with Lorna on the live flow
- [ ] Alex's portrait and remaining images supplied as WebP under `public/images/`
- [ ] Name on Lorna's scrubs in her portrait reads "Godwin": confirm the spelling with Lorna (the site uses Gladwin)
- [ ] Lorna's profile never uses the word "specialist" (general dentist with a special interest)
- [ ] Real logo file in place
- [ ] Privacy policy supplied (Australian Privacy Principles, covers booking and deposit data)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain; sitemap and canonical tags checked
- [ ] Organisation schema: add phone, address and hours once confirmed (`lib/seo.ts` skips placeholders)
- [ ] GA4 and Meta Pixel IDs added in `site.config.ts` if wanted
- [ ] `npm run qa:copy` and `npm run qa:dashes` pass against production
- [ ] DNS: apex primary, www 308 to apex
