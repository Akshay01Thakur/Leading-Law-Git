# Codex Memory: Leading Law

Use this file as the handoff context when opening this folder in another Codex/Claude account.

## Project Snapshot

- Product name: Leading Law.
- Workspace path used during development: `/Users/akshaythakur/Documents/Analysis`.
- App type: Next.js app using the App Router.
- Primary market: India.
- Product concept: **consumer-only, no-payment callback flow**, built for a fast (2-day) launch. Consumer describes an issue, sees matching knowledge-library answers, reviews a generic "trusted experts" panel (no single named advocate on this path), and books by sharing name + mobile number only. No slot picker, no payment step. Team calls back within 3 hours; the advocate is notified of the new appointment via a WhatsApp button the consumer taps.
- Internal advocate/WhatsApp routing contact: Adv. Vivek Yadav (`app/data.ts`, `lawyers[0]`) — his WhatsApp number is where "Notify Advocate" sends the message, but his name is **not** shown to the consumer on the booking path anymore (see "Important History" below).
- GitHub remote: `https://github.com/Akshay01Thakur/Leading-Law-Git.git`.
- Local branch: `main`.

## Important History

The app was initially named LegalSeva, then renamed to Leading Law. No user-facing LegalSeva references should remain.

It was originally built as a three-role marketplace (consumer / lawyer / admin) with mocked checkout, local-storage bookings, and mock WhatsApp/Google Calendar notification endpoints. That version was replaced in two passes:

**Pass 1 — minimal-launch consumer-only flow** (removed role switching, added payment-link + WhatsApp handoff):
- Removed: `app/admin/`, `app/lawyer/page.tsx` (lawyer desk), `app/bookings/`, `app/components/AdminConsole.tsx`, `app/components/LawyerWorkbench.tsx`, `app/api/appointments/notify/`, `app/api/ai/triage/` (unused dead route), `app/mock/` (unused after cleanup).
- `RoleShell` and `QuestionBoard` no longer take a `role` prop — the site is consumer-only.

**Pass 2 — remove payment and slots, go fully generic on advocate identity** (2-day launch deadline):
- Removed `app/payment/page.tsx` entirely — there is no payment step anymore.
- Removed slot selection from `app/consultation/[mode]/page.tsx` — booking now only collects name + mobile number.
- Removed `app/lawyer/[slug]/page.tsx` (public advocate profile) — nothing links to it anymore since the funnel no longer names one advocate.
- Removed 4 unused phantom `lawyers` entries (`meera-sanyal`, `arjun-rao`, `farah-khan`, `r-narayanan`) and the dead `qaTopics`/`QuestionTopic`/`scoreLawyer` legacy data from `app/data.ts` — none of it was reachable from any page.
- `ConsumerFunnel`'s Step 3 advocate card no longer names Adv. Vivek Yadav or links to a profile — it shows generic "Our trusted experts, 5-20 years experience" copy instead.
- `app/legalKnowledge.ts` Q&A answers are now attributed to a **different advocate name per legal category** (mix of North/South Indian names, see "Category Attribution" below) instead of always "Adv. Vivek Yadav." The `questionStyles` guidance text that hardcoded "Vivek" was reworded to "your advocate."
- `QuestionBoard` and `questions/[slug]/page.tsx` "Answered by" cards are now plain (non-clickable) badges — they no longer link to a lawyer profile page, since names vary by category and there's no longer a matching profile per name.
- `app/consultation/[mode]/page.tsx` now has two states: a name+phone form, then (after "Book Appointment") a confirmation message ("Our verified legal expert will call you within the next 3 hours") plus a **"Notify Advocate on WhatsApp"** button. This button opens `wa.me/<NEXT_PUBLIC_ADVOCATE_WHATSAPP>` with a prefilled message — the consumer must tap Send themselves; WhatsApp does not allow silent auto-send from a browser without the (unapproved, backend-requiring) WhatsApp Business API.
- Removed `NEXT_PUBLIC_PAYMENT_LINK` / `NEXT_PUBLIC_PAYMENT_PROVIDER_LABEL` env vars — no longer used.

If asked to "restore the fuller app" or "bring back payment/slots," recover the deleted files from git history rather than rewriting from memory — check `git log` for the relevant commit before this pass.

## How To Run

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Default local URL:

```text
http://127.0.0.1:3000
```

If the port is busy, Next.js will pick another one automatically — share whatever URL it prints.

## Key Files

- `app/page.tsx`: home page, routes straight into the consumer flow (no role switcher).
- `app/consumer/page.tsx`: consumer funnel entry.
- `app/components/ConsumerFunnel.tsx`: issue intake, category/city/language/urgency selection, knowledge-library matching, generic "trusted experts" panel, hands off to `/consultation/call`.
- `app/components/QuestionBoard.tsx`: Q&A library UI with category filtering (consumer-only, no role branching, no profile links).
- `app/legalKnowledge.ts`: static legal Q&A source library, category/public-count logic, and `categoryAdvocateNames` map (per-category attribution).
- `app/questions/[slug]/page.tsx`: individual answer page.
- `app/consultation/[mode]/page.tsx`: name + mobile number form → booking confirmation → "Notify Advocate on WhatsApp" button. No slots, no payment.
- `app/support/page.tsx`: WhatsApp/callback support info.
- `app/components/RoleShell.tsx`: shared shell/nav, consumer-only.
- `app/data.ts`: single advocate record (Vivek, used only for internal WhatsApp routing), categories, cities, languages.
- `.env.example`: required environment variable template.
- `README.md`: setup and integration notes.

## Current Product Behavior

- Single role: consumer. No lawyer/admin views, no public advocate profile page.
- Booking flow: issue → knowledge-library answer → generic trusted-experts panel → name + mobile number form → "Book Appointment" → confirmation message → "Notify Advocate on WhatsApp" button (opens `wa.me` deep link, consumer taps Send).
- No booking is stored anywhere; the WhatsApp message is the only record, and only once the consumer actually sends it.
- No fee is shown or collected online in this flow — fee discussion (if any) happens on the callback.

## Category Attribution

`app/legalKnowledge.ts` has a `categoryAdvocateNames` map assigning one advocate name per category (used in `answeredBy` and in-answer "Adv. X's view:" text):

```text
Family / Divorce      → Adv. Ananya Iyer
Property / RERA       → Adv. Rohan Malhotra
Criminal / Bail        → Adv. Karthik Subramaniam
Cyber Fraud            → Adv. Priya Sharma
Consumer Complaint     → Adv. Deepika Menon
Cheque Bounce          → Adv. Arjun Mehta
Employment / Labour    → Adv. Lakshmi Narayanan
Startup / Compliance   → Adv. Aditya Kapoor
NRI Property           → Adv. Sneha Reddy
Recovery Case          → Adv. Vikram Singh
Arbitration            → Adv. Meera Pillai
```

These are display-only names for Q&A attribution; none of them have profile pages or WhatsApp numbers. The one real contact number in the system is Vivek's, used solely for the "Notify Advocate" button regardless of category.

## Branding Rules

Use `Leading Law` / `leading-law` / `LEADING_LAW`. Never reintroduce `LegalSeva` / `legalseva` / `Legal Seva` / `legalsewa`.

Avoid user-facing wording like "mock", "prototype", "fallback", or "LLM" in production-facing copy.

## Environment Variables

See `.env.example`. `.env.local` is git-ignored and must never be committed or pasted into chat/source.

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADVOCATE_WHATSAPP=91XXXXXXXXXX
```

## Deployment Notes

- Recommended host: Vercel (no database, no auth, no server storage needed).
- Add the two env vars above in the hosting platform.
- If deeper integration is ever wanted (server-confirmed bookings, automatic WhatsApp Business API sends without a manual tap, online payment), that requires a backend, database, and Meta/payment-provider approval — a deliberate scope change from this minimal-launch direction. Confirm with the owner before adding it.

## Safety Notes

- Do not commit `.env.local` or paste WhatsApp/other secrets into chat or source files.
- Keep Indian advocate marketing restrictions in mind: Q&A should stay informational, avoid solicitation and guaranteed-outcome language, and carry the "general guidance, not legal advice" disclaimer.
