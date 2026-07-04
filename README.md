# LegalSeva

LegalSeva is a Next.js marketplace prototype for Indian legal consultations. The app includes consumer, lawyer and admin views, a large legal Q&A library, consultation booking, mocked checkout, WhatsApp appointment notification handoff and Google Calendar add-link generation.

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

## Deployment Checklist

Set these environment variables in the hosting platform, not in source code.

```text
LEGALSEVA_ANSWER_MODE=knowledge-library
NEXT_PUBLIC_SITE_URL=https://your-domain.com

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

JUSPAY_MERCHANT_ID=
JUSPAY_API_KEY=
JUSPAY_WEBHOOK_SECRET=

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_TOKEN=
WHATSAPP_APPOINTMENT_TEMPLATE=legalseva_new_appointment_v1

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALENDAR_ID=
```

## What Is Needed For Real Integrations

Razorpay:
- Activated Razorpay merchant account with KYC completed.
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- Webhook secret for payment success, failure and refund events.
- Production callback URL and webhook URL from the deployed LegalSeva domain.
- Business details, GST details if applicable, refund/cancellation policy and settlement bank account.

Juspay:
- Juspay merchant account and production MID.
- API key, webhook secret and configured return/callback URLs.
- Payment methods to enable, such as UPI, cards, netbanking and wallets.
- Production domain whitelisting and webhook event mapping.

WhatsApp notifications:
- Meta Business account with WhatsApp Business Platform access.
- Verified WhatsApp Business phone number and Phone Number ID.
- Permanent system-user access token stored only in environment secrets.
- Approved message template such as `legalseva_new_appointment_v1`.
- Consent from lawyers to receive appointment notifications on WhatsApp.
- Webhook endpoint for delivery/read status if tracking is needed.

Google Calendar:
- Google Cloud project with OAuth consent configured.
- OAuth client ID and secret.
- Redirect URI for the deployed app.
- Lawyer OAuth consent for calendar event insert, or a workspace service-account flow if LegalSeva manages a shared calendar.
- Calendar ID for the lawyer or LegalSeva consultation calendar.

## Current Prototype Behavior

- Checkout lets the user choose Razorpay or Juspay.
- Payment confirmation is mocked.
- Booking is saved in browser local storage.
- A notification endpoint returns a WhatsApp deep link for Adv Vivek Yadav.
- The notification includes a Google Calendar add-event link.

## Production Notes

- Move bookings, payments and notifications from local storage to a database.
- Confirm payment through Razorpay/Juspay webhooks before creating a confirmed booking.
- Send WhatsApp templates server-side through Meta's API after payment success.
- Store lawyer calendar connection tokens securely and refresh them server-side.
- Keep advocate marketing compliant with Bar Council of India rules: Q&A should remain informational and avoid solicitation or guaranteed outcomes.
