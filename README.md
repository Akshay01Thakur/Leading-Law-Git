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
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADVOCATE_WHATSAPP=91XXXXXXXXXX
```

- `NEXT_PUBLIC_ADVOCATE_WHATSAPP` — advocate's WhatsApp number in international format, no `+`. This is the number the "Notify Advocate on WhatsApp" button opens.
- `NEXT_PUBLIC_SITE_URL` — the site's production URL. Required for the advocate confirmation loop below: it's used to build the `/confirm` link sent to the advocate. If unset, that link is omitted from the WhatsApp message and the advocate can't send a confirmation back to the customer from it.

No database, auth provider, file storage, calendar API, payment gateway, or LLM API is required.

## How Booking Works

1. Consumer describes their issue on `/consumer` and sees matching Q&A from the static knowledge library (`app/legalKnowledge.ts`).
2. Consumer reviews the trusted-experts panel (no single named advocate is shown on this path) and proceeds to book.
3. On `/consultation/[mode]`, the consumer enters only their name and mobile number and taps "Book Appointment."
4. The page immediately confirms: "You will get a WhatsApp confirmation once our advocate confirms your consultation, and a call within the next 3 hours."
5. A "Notify Advocate on WhatsApp" button opens `wa.me/<advocate number>` with a prefilled message containing the consumer's name, phone, category, city, language, urgency, issue summary, and a link to `/confirm` with the same details. The consumer taps Send to notify the advocate (WhatsApp does not allow silent auto-send from a browser).
6. The advocate opens that `/confirm` link, reviews the details, and taps "Confirm Appointment on WhatsApp" — this opens `wa.me/<customer number>` prefilled with a confirmation message. The advocate taps Send, and the customer receives their confirmation on WhatsApp.

No booking data is stored anywhere — the WhatsApp messages are the only record, and every step requires a human tapping Send (WhatsApp does not allow silent auto-send from a browser without the WhatsApp Business API, which needs Meta approval and a backend — out of scope here).

## Production Notes

- Keep advocate marketing compliant with Bar Council of India rules: Q&A content should remain informational guidance, not solicitation or guaranteed outcomes.
- If deeper integration is needed later (server-confirmed bookings, automatic WhatsApp Business API notifications without a manual tap, online payment), that requires a backend, a database, and Meta/payment provider approval — out of scope for this minimal launch.
