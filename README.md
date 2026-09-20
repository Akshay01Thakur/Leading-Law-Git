# Leading Law

Leading Law is a Next.js consumer legal-help site for India. Consumers describe their issue, see matching answers from a static knowledge library, review the trusted advocate team, and book a callback appointment by sharing their name and mobile number. Our team follows up by phone, and the advocate is notified of the new appointment on WhatsApp.

This is the minimal-launch build: no database, no authentication, no server-side storage, no payment step, no slot picker. All state passes through URL query parameters and a prefilled WhatsApp message.

## Local Setup

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Local app URL:

```text
http://127.0.0.1:3000
```

## Environment Variables

Set these in the hosting platform (see `.env.example`):

```text
NEXT_PUBLIC_SITE_URL=https://leadinglaw.in
NEXT_PUBLIC_ADVOCATE_WHATSAPP=91XXXXXXXXXX
NEXT_PUBLIC_UPI_VPA=yourname@yourbank
NEXT_PUBLIC_UPI_PAYEE_NAME=Leading Law
NEXT_PUBLIC_CONSULTATION_FEE=99
NEXT_PUBLIC_CONSULTATION_FEE_BEFORE=499
ADVOCATE_PASSCODE=a-long-random-passphrase
```

- `NEXT_PUBLIC_ADVOCATE_WHATSAPP` — advocate's WhatsApp number in international format, no `+`. This is the number the "Notify Advocate on WhatsApp" button opens.
- `NEXT_PUBLIC_SITE_URL` — the site's production URL. Required for the advocate confirmation loop: it builds the `/confirm` link sent to the advocate. If unset, that link is omitted and the advocate can't confirm back to the customer from the message.
- `NEXT_PUBLIC_UPI_VPA` — the UPI ID that collects the consultation fee. If unset, the payment step tells the customer payment isn't configured rather than showing a broken pay button.
- `NEXT_PUBLIC_UPI_PAYEE_NAME` / `NEXT_PUBLIC_CONSULTATION_FEE` — payee name and amount shown in the UPI app. `NEXT_PUBLIC_CONSULTATION_FEE` is the amount the customer actually pays, so it is the number written into the UPI deep link and QR code.
- `NEXT_PUBLIC_CONSULTATION_FEE_BEFORE` — the pre-discount price, shown struck through beside the payable fee. The saving is derived (`before - payable`), so there is no third variable to keep in sync. If this is not higher than `NEXT_PUBLIC_CONSULTATION_FEE`, no discount is displayed at all.
- `ADVOCATE_PASSCODE` — **server-only, never prefix this with `NEXT_PUBLIC_`.** Gates `/confirm`. Prefixing it would ship the passcode to every visitor's browser and defeat the gate entirely.
- `CALLMEBOT_APIKEY` / `CALLMEBOT_PHONE` — **server-only.** Optional early lead alert (see below). `CALLMEBOT_PHONE` defaults to `NEXT_PUBLIC_ADVOCATE_WHATSAPP` if unset.

No database, auth provider, file storage, calendar API, payment gateway, or LLM API is required.

## How Booking Works

1. Consumer describes their issue on `/consumer` and sees matching Q&A from the static knowledge library (`app/legalKnowledge.ts`).
2. Consumer reviews the trusted-experts panel (no single named advocate is shown on this path) and proceeds to book.
3. On `/consultation/[mode]` the consumer enters name, mobile number and query, then taps "Continue to Payment."
4. **Payment step:** the consultation fee (`NEXT_PUBLIC_CONSULTATION_FEE`) is shown along with the UPI ID and a `upi://pay` deep link that opens GPay/PhonePe/Paytm with the amount prefilled. On desktop the UPI ID can be copied and paid from a phone.
5. After paying, the consumer taps "I Have Paid — Notify Advocate." WhatsApp opens automatically addressed to the advocate with the booking details, the fee, a note that the customer marked it paid, and a link to `/confirm`.
6. The advocate **verifies the money actually arrived in their UPI account**, then opens the `/confirm` link, enters the advocate passcode, and taps "Confirm Appointment on WhatsApp" — which opens `wa.me/<customer number>` prefilled with a "booked and paid" confirmation. The advocate taps Send.

### Early "new lead" alert (optional)

When the customer reaches the payment step, the browser fires a **non-blocking** request to `/api/notify-lead`, which WhatsApps the advocate a heads-up that someone started a booking but hasn't paid yet — so leads who abandon at payment aren't lost.

This is deliberately fire-and-forget: the customer moves to the payment screen immediately, the request is never awaited, failures are swallowed, and it is sent once per session. If `CALLMEBOT_APIKEY` is unset the route no-ops and the booking flow is completely unaffected.

**Setting it up (one-time, by the advocate):**
1. Save **+34 644 51 95 23** as a contact.
2. WhatsApp it: `I allow callmebot to send me messages`
3. It replies with an API key — put that in `CALLMEBOT_APIKEY`.

**Privacy note:** CallMeBot is a free third-party bridge, and the lead's name, phone, category and query pass through it. For a production legal practice handling sensitive matters, moving to a contracted WhatsApp Business API provider (AiSensy, Interakt, Gupshup, Twilio) is the appropriate next step — only `app/api/notify-lead/route.ts` needs to change; the funnel does not.

### Why a human verifies payment

UPI deep links have **no callback** — payment happens inside the customer's UPI app and nothing reports back to this site. So the site cannot know whether payment succeeded. The advocate checking their own UPI account before confirming is what makes "booked and paid" truthful. Moving to automatic verification would require a payment gateway (e.g. Razorpay) plus a backend to receive webhooks and persist payment state.

### Why `/confirm` is passcode-gated

The confirm link travels inside a WhatsApp message the **customer themselves sends**, so the customer can see and open it. Without a gate they could confirm their own appointment (and mark it paid) without paying. `/confirm` therefore posts a passcode to `/api/advocate-auth`, which compares it against the server-only `ADVOCATE_PASSCODE` env var. Because that var is not `NEXT_PUBLIC_`, the passcode is never included in the browser bundle and cannot be recovered by viewing page source. The passcode is remembered in the advocate's browser but re-verified against the server on every load, so setting the stored value by hand gains nothing.

No booking data is stored anywhere — the WhatsApp messages are the only record, and every send requires a human tapping Send (WhatsApp does not allow silent auto-send from a browser without the WhatsApp Business API, which needs Meta approval and a backend).

## Production Notes

- Keep advocate marketing compliant with Bar Council of India rules: Q&A content should remain informational guidance, not solicitation or guaranteed outcomes.
- If deeper integration is needed later (server-confirmed bookings, automatic WhatsApp Business API notifications without a manual tap, online payment), that requires a backend, a database, and Meta/payment provider approval — out of scope for this minimal launch.

## Brand assets

The logo lives in `public/` in two crops of the same artwork, both rendered through
`app/components/BrandLogo.tsx`:

- `leading-law-logo.png` — the full lockup (wordmark, tagline, and the LAW / ADVISORY /
  CONSULTANCY column). Used in the landing header and footer, the consultation and confirm
  pages, and the disclaimer modal.
- `leading-law-wordmark.png` — the wordmark and gold rule only. Used in the app sidebar,
  where the full lockup would render the tagline too small to read.

The artwork carries its own navy field, so it sits on light backgrounds as a solid brand
block rather than a transparent mark. `BrandLogo` takes a rendered `width` and derives the
height from the crop's intrinsic size, so callers never restate the aspect ratio.

The wordmark's own tagline ("Where Legal Needs Meet Legal Excellence.") is the site's
positioning line — it is also the landing page's `h1`. No separate motto is set in type
beneath the logo.
