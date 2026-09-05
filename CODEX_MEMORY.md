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
- `ConsumerFunnel`'s Step 3 advocate card no longer names Adv. Vivek Yadav or links to a profile — it shows generic "Our trusted experts, 20+ years experience" copy instead.
- `app/legalKnowledge.ts` Q&A answers are now attributed to a **different advocate name per legal category** (mix of North/South Indian names, see "Category Attribution" below) instead of always "Adv. Vivek Yadav." The `questionStyles` guidance text that hardcoded "Vivek" was reworded to "your advocate."
- `QuestionBoard` and `questions/[slug]/page.tsx` "Answered by" cards are now plain (non-clickable) badges — they no longer link to a lawyer profile page, since names vary by category and there's no longer a matching profile per name.
- `app/consultation/[mode]/page.tsx` now has two states: a name+phone form, then (after "Book Appointment") a confirmation message ("Our verified legal expert will call you within the next 3 hours") plus a **"Notify Advocate on WhatsApp"** button. This button opens `wa.me/<NEXT_PUBLIC_ADVOCATE_WHATSAPP>` with a prefilled message — the consumer must tap Send themselves; WhatsApp does not allow silent auto-send from a browser without the (unapproved, backend-requiring) WhatsApp Business API.
- Removed `NEXT_PUBLIC_PAYMENT_LINK` / `NEXT_PUBLIC_PAYMENT_PROVIDER_LABEL` env vars — no longer used.

**Pass 3 — marketing landing page, disclaimer gate, support removal, experience bump:**
- `app/page.tsx` is now a full marketing landing page (header/nav, hero with an "Ask Your Legal Query" search-bar-style form that GETs to `/consumer?issue=...`, trust stats, a Practice Areas grid linking to `/consumer?category=...`, a How It Works strip, a knowledge-library teaser, footer) instead of the old minimal role-gateway page.
- Added `app/components/LegalDisclaimerGate.tsx`, wired into `app/layout.tsx` — a full-site, BCI-compliant disclaimer modal shown once per browser (persisted via `localStorage`) before any content is usable, modeled on the pattern used by Indian law firm sites (e.g. khaitanco.com).
- `app/consumer/page.tsx` reads `issue`/`category` from `searchParams` **server-side** (async page component) and passes them as props into `ConsumerFunnel` — do not switch this back to `useSearchParams()` + `Suspense` inside `ConsumerFunnel`; that pattern caused a real bug where both the empty Suspense fallback and the real prefilled form mounted simultaneously in the DOM and the empty one won. Keep the server-side-props pattern.
- Removed the Support page and every link to it (`app/support/`, plus nav/footer/CTA links in `RoleShell`, `app/page.tsx`, `ConsumerFunnel`, and the consultation page) — there is no support route in the app anymore.
- Experience copy is now "20+ Years Experience" everywhere (was "5-20 Years Experience" / "5-10 Years Experience" on Vivek's internal record) — keep all advocate-experience mentions consistent at 20+.

**Pass 4 — real advocate WhatsApp number + customer confirmation loop (deploy-day fix):**
- Replaced the placeholder fallback WhatsApp number (`919999000111`) with the real advocate number (`918700843886`) in `app/data.ts` and `defaultAdvocateWhatsApp` in `app/consultation/[mode]/page.tsx` — the primary source of truth is still `NEXT_PUBLIC_ADVOCATE_WHATSAPP`, this is just a safety net for a misconfigured deploy.
- Added a **customer confirmation loop**, still with no backend: the "Notify Advocate on WhatsApp" message now includes a link to `/confirm?name=...&phone=...&category=...&city=...&language=...&urgency=...&issue=...` (built from `NEXT_PUBLIC_SITE_URL`, which must be set for this link to be included — see `README.md`). The advocate taps that link, reviews the details on `app/confirm/page.tsx`, and taps "Confirm Appointment on WhatsApp," which opens `wa.me/<customer number>` prefilled with a confirmation message. The advocate taps Send, closing the loop.
- Added `app/lib/phone.ts` (`toWhatsAppNumber`) — converts a raw 10-digit Indian mobile number into the `91XXXXXXXXXX` format `wa.me` needs. Used only in `app/confirm/page.tsx` to build the link back to the customer; keep this separate from the `normalizePhone`/`phonePattern` validation logic already in the consultation page, which serves a different purpose (validating the customer's typed input).
- Updated the customer-facing booking confirmation copy to set the right expectation: "You will get a WhatsApp confirmation ... once our advocate confirms," not an immediate confirmation.

**Pass 5 — post-deploy fixes: auto-open WhatsApp + disclaimer checkbox bug:**
- `handleBooking` in `app/consultation/[mode]/page.tsx` now calls `window.open(whatsappUrl, "_blank", "noopener,noreferrer")` synchronously right after a successful submit, so WhatsApp opens automatically addressed to the advocate — the customer no longer has to find and tap the "Notify Advocate" button themselves, just Send in the WhatsApp window that opens. The manual "Notify Advocate on WhatsApp" button is **kept** as a fallback (labelled "Didn't see WhatsApp open automatically?") in case a browser's popup blocker still intercepts it or the customer accidentally closes that window. Both paths point at the exact same `whatsappUrl` — don't let them drift.
- Fixed a real CSS bug in `app/globals.css`: the global `select, input, textarea { width: 100%; min-height: 42px; border: ...; }` rule (meant for real text-entry fields) was also matching the disclaimer's `<input type="checkbox">` since it's nested in a `<label>` like the real form fields — it rendered as a huge blank bordered box (~390px wide) next to "I have read and accept the above," which is what looked like "text outside the box." Fixed by scoping that rule to `input:not([type="checkbox"]):not([type="radio"])` and giving `.disclaimer-checkbox input` an explicit `18px` size. If a new checkbox/radio is ever added anywhere on the site, it needs the same treatment or it will inherit the same oversized-box bug.

**Pass 6 — UPI payment + passcode-gated confirmation (post-launch):**
- **Payment is back** (deliberately — this reverses Pass 2's "no payment" direction; do not "restore" the no-payment flow without asking). `/consultation/[mode]` now has three stages: `form` → `payment` → `notified`. The payment stage shows the fee, the UPI ID with a copy button, and a `upi://pay?pa=...&am=...` deep link that opens GPay/PhonePe/Paytm prefilled.
- The UPI URL is built with `encodeURIComponent`, **not** `URLSearchParams` — the latter encodes spaces as `+`, which some UPI apps render literally in the payee name. Keep it that way.
- **`/confirm` is now passcode-gated.** Why this matters: the confirm link rides inside a WhatsApp message the *customer* sends, so the customer can see and open it — without a gate they could confirm their own appointment as paid. Gating on "enter Vivek's phone number" would be useless (the customer knows that number). So: `app/api/advocate-auth/route.ts` compares a posted passcode against the **server-only** `ADVOCATE_PASSCODE` env var using `timingSafeEqual`. **Never rename that var to `NEXT_PUBLIC_ADVOCATE_PASSCODE`** — that would ship the secret in the browser bundle and completely defeat the gate.
- `app/confirm/page.tsx` is now a thin server component that reads `searchParams` and hands them to `app/confirm/ConfirmClient.tsx` (client) which owns the gate. The client stores the *passcode itself* in localStorage and re-verifies it server-side on every load — deliberately **not** an "already verified" boolean, which a customer could set by hand in devtools.
- Payment verification is **manual by design**: UPI deep links have no callback, so the site cannot know payment succeeded. Vivek checks his UPI account, then confirms. The confirm page shows a "Check payment first: Rs N" warning. Automatic verification would need a gateway (Razorpay) + backend webhooks + persistence — a real scope change, confirm with the owner first.
- Copy across the site was updated to stop saying "no payment required" (landing page hero + how-it-works step 04, ConsumerFunnel step 4 and flow rail).

If asked to "restore the fuller app" or "bring back slots/support," recover the deleted files from git history rather than rewriting from memory — check `git log` for the relevant commit before the relevant pass.

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

- `app/page.tsx`: marketing landing page — hero query form, practice areas, how-it-works, footer. Entry point of the site.
- `app/layout.tsx`: root layout, mounts `LegalDisclaimerGate` above `{children}` so it gates every page.
- `app/components/LegalDisclaimerGate.tsx`: full-site disclaimer modal, `localStorage`-persisted.
- `app/consumer/page.tsx`: async server component; reads `issue`/`category` from `searchParams` and passes to `ConsumerFunnel` as props.
- `app/components/ConsumerFunnel.tsx`: issue intake, category/city/language/urgency selection, knowledge-library matching, generic "trusted experts" panel, hands off to `/consultation/call`. Accepts `initialIssue`/`initialCategory` props (no internal `useSearchParams`).
- `app/components/QuestionBoard.tsx`: Q&A library UI with category filtering (consumer-only, no role branching, no profile links).
- `app/legalKnowledge.ts`: static legal Q&A source library, category/public-count logic, and `categoryAdvocateNames` map (per-category attribution).
- `app/questions/[slug]/page.tsx`: individual answer page.
- `app/consultation/[mode]/page.tsx`: name + mobile number form → booking confirmation → "Notify Advocate on WhatsApp" button (message includes a `/confirm` link). No slots, no payment, no support link.
- `app/confirm/page.tsx`: advocate-facing page — reviews appointment details from `searchParams`, then "Confirm Appointment on WhatsApp" opens `wa.me/<customer number>` with a prefilled confirmation message.
- `app/lib/phone.ts`: `toWhatsAppNumber` — formats a raw phone into `91XXXXXXXXXX` for `wa.me` links.
- `app/components/RoleShell.tsx`: shared shell/nav for `/consumer` and `/questions` (Home, Legal Knowledge only — no Support).
- `app/data.ts`: single advocate record (Vivek, used only for internal WhatsApp routing), categories, cities, languages.
- `.env.example`: required environment variable template.
- `README.md`: setup and integration notes.

## Current Product Behavior

- Single role: consumer. No lawyer/admin views, no public advocate profile page.
- Booking flow: issue → knowledge-library answer → generic trusted-experts panel → name + mobile number form → "Book Appointment" → confirmation message → "Notify Advocate on WhatsApp" button (opens `wa.me` deep link, consumer taps Send).
- Confirmation loop: advocate receives the message (with a `/confirm` link) → opens it → taps "Confirm Appointment on WhatsApp" → opens `wa.me/<customer>` prefilled → advocate taps Send → customer gets their confirmation.
- No booking is stored anywhere; every WhatsApp message is the only record, and only exists once a human actually taps Send on it. There is no way to programmatically know whether a confirmation was actually sent — that's a real limitation of the no-backend approach, not a bug.
- No fee is shown or collected online in this flow — fee discussion (if any) happens on the callback.

## Category Attribution

`app/legalKnowledge.ts` used to have a `categoryAdvocateNames` map assigning one fixed name per category. **This was replaced** with a `shuffledAdvocateNames` list (owner-provided, 12 names) that's cycled through by a global running index across every generated question in `buildQuestionLibrary` (`answerIndex % shuffledAdvocateNames.length`), so attribution varies question-by-question rather than being fixed per category. The list, in the exact order it cycles:

```text
Adv. Shubham Tripathi
Adv. Vivek Yadav
Adv. Kelvin Kamal
Adv. Prashant Sahaniya
Adv. Vikrant Kumar Singh
Adv. Vishal Singh
Adv. Ram Vashisht
Adv. Anmol Bansal
Adv. Lalman Yadav
Adv. Munilal Yadav
Adv. Saurabh Dhama
Adv. Akash G Shrivastava
```

The assignment is deterministic (same question always shows the same name — it's assigned once at module load, not re-randomized per request) but not tied to category, so within any single category all 12 names appear roughly equally often. `composeHumanAnswer` takes the assigned name as a parameter now instead of deriving it from the category. These are display-only names for Q&A attribution; none of them have profile pages or WhatsApp numbers. The one real contact number in the system is Vivek's (`app/data.ts`), used solely for the "Notify Advocate" button regardless of category or which name a given answer is attributed to.

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
