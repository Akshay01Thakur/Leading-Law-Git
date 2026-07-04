# Codex Memory: Leading Law

Use this file as the handoff context when opening this folder in another Codex account.

## Project Snapshot

- Product name: Leading Law.
- Workspace path used during development: `/Users/akshaythakur/Documents/Analysis`.
- App type: Next.js app using the App Router.
- Primary market: India.
- Product concept: consumer-to-lawyer legal marketplace with a reviewed Q&A first layer, then lawyer escalation.
- Current lawyer of the week: Adv Vivek Yadav.
- Current GitHub remote: `https://github.com/Akshay01Thakur/Leading-Law-Git.git`.
- Current local branch: `main`.
- Latest local commit at handoff: `9911782` (`Rename app to Leading Law`).

## Important History

The app was initially named LegalSeva, then renamed everywhere to Leading Law. There should be no user-facing LegalSeva references left in source/docs.

Commit history at handoff:

```text
9911782 Rename app to Leading Law
bcd51bf Add payment and appointment notifications
3563874 Build LegalSeva marketplace app
```

The GitHub push was attempted but blocked by local authentication:

- HTTPS push failed because Git could not read a GitHub username/token.
- SSH push failed because no accepted GitHub public key was available.
- GitHub connector write failed with `Resource not accessible by integration`.

To push from a machine/account with GitHub auth:

```bash
cd /Users/akshaythakur/Documents/Analysis
git push -u origin main
```

If the folder is moved to another machine, update the `cd` path accordingly.

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

If port 3000 is busy:

```bash
npm run dev -- --port 3021
```

Validation completed before this memory file:

```text
npm run typecheck
npm run build
```

Both passed after the Leading Law rename.

## Key Files

- `app/page.tsx`: role gateway.
- `app/consumer/page.tsx`: consumer funnel entry.
- `app/lawyer/page.tsx`: lawyer desk.
- `app/admin/page.tsx`: admin console.
- `app/components/QuestionBoard.tsx`: Q&A library UI with category filtering and clickable category cards.
- `app/legalKnowledge.ts`: legal Q&A source library and category/public-count logic.
- `app/questions/[slug]/page.tsx`: individual answer page.
- `app/consultation/[mode]/page.tsx`: call/video slot booking flow.
- `app/payment/page.tsx`: Razorpay/Juspay style checkout mock and booking confirmation.
- `app/bookings/page.tsx`: saved bookings, reschedule, WhatsApp/calendar handoff display.
- `app/api/ai/triage/route.ts`: knowledge-library matching API.
- `app/api/appointments/notify/route.ts`: appointment notification API mock that returns WhatsApp and Google Calendar links.
- `app/data.ts`: lawyers, categories, consultation slots, court blocks, sample data.
- `.env.example`: required environment variable template.
- `README.md`: deployment and integration checklist.

## Current Product Behavior

Role separation:

- Consumer desk only for consumers.
- Lawyer desk only for lawyers.
- Admin area for admin governance.
- SEO/Q&A is shared but renders different actions by role.

Consumer funnel:

- User starts with legal category/issue.
- First response layer uses the reviewed Q&A knowledge library, not live LLM output.
- Answers include source/citation references.
- Escalation shows one Leading Law certified lawyer card.
- Lawyer card is always Adv Vivek Yadav.
- Booking goes to call/video consultation flow.

Q&A:

- Large generated library: 500 question variants per category internally.
- Public category counts are intentionally randomized near 400+.
- Category cards on Q&A page are clickable and set URL state such as `?role=consumer&category=Recovery+Case`.
- Similar question links open individual Q&A pages.
- Answer cards show `Answered by Adv.Vivek Yadav`.
- Upvotes are displayed as profile-linked answer upvotes.

Booking:

- Call and video consultations use 3-hour slots.
- Direct call mode tells the user Leading Law will call both sides in the selected window.
- Video mode creates a mock Google Meet link.
- Court-blocked slots are disabled.
- One-time reschedule is available in My Bookings.
- Platform fee is Rs 50.

Payments:

- Checkout offers Razorpay and Juspay options.
- Payment is currently mocked in the prototype.
- Production should confirm booking only after Razorpay/Juspay webhook success.

Notifications:

- On booking confirmation, `app/api/appointments/notify/route.ts` returns:
  - WhatsApp deep link for Adv Vivek Yadav.
  - Google Calendar add-event link.
  - Message preview.
- In production, replace this with server-side WhatsApp Business API template delivery after payment success.

## Branding Rules

Use:

```text
Leading Law
leading-law
LEADING_LAW
leading_law_new_appointment_v1
```

Do not reintroduce:

```text
LegalSeva
legalseva
LEGALSEVA
Legal Seva
legalsewa
```

Current package name:

```json
"name": "leading-law"
```

## Lawyer Details

Primary/lawyer-of-the-week profile:

```text
Name: Adv Vivek Yadav
Experience: 2-5 years
Years numeric: 4
Courts: Delhi High Court, District Courts and all Delhi NCR courts
City: Delhi NCR
Languages: English, Hindi
Fixed consultation hold: Rs 999
Platform fee: Rs 50
```

Q&A attribution must remain:

```text
Answered by Adv.Vivek Yadav
```

## Categories

Current legal categories:

```text
Family / Divorce
Property / RERA
Criminal / Bail
Cyber Fraud
Consumer Complaint
Cheque Bounce
Employment / Labour
Startup / Compliance
NRI Property
Recovery Case
Arbitration
```

Recovery Case and Arbitration were specifically requested and added.

## Integration Requirements From User

For Razorpay:

- Activated Razorpay merchant account with KYC complete.
- `RAZORPAY_KEY_ID`.
- `RAZORPAY_KEY_SECRET`.
- `RAZORPAY_WEBHOOK_SECRET`.
- Production callback URL and webhook URL from the deployed Leading Law domain.
- Refund/cancellation policy and settlement bank account.

For Juspay:

- Juspay merchant account and production MID.
- `JUSPAY_MERCHANT_ID`.
- `JUSPAY_API_KEY`.
- `JUSPAY_WEBHOOK_SECRET`.
- Enabled payment methods.
- Production domain whitelisting and callback/webhook mapping.

For WhatsApp:

- Meta Business account.
- WhatsApp Business Platform access.
- Verified phone number.
- Phone Number ID.
- Permanent system-user access token.
- Approved template, currently named `leading_law_new_appointment_v1`.
- Consent from lawyers to receive appointment notifications.

For Google Calendar:

- Google Cloud project.
- OAuth consent screen.
- OAuth client ID and secret.
- Redirect URI for deployed app.
- Lawyer OAuth consent for calendar insertion, or a workspace/service account strategy.
- Calendar ID for lawyer/Leading Law consultation calendar.

## Environment Variables

See `.env.example`.

Important: `.env.local` is intentionally ignored by Git. It may contain secrets from development and must not be committed or shared casually.

Current env template:

```text
LEADING_LAW_ANSWER_MODE=knowledge-library
NEXT_PUBLIC_SITE_URL=http://localhost:3000

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

JUSPAY_MERCHANT_ID=
JUSPAY_API_KEY=
JUSPAY_WEBHOOK_SECRET=

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_TOKEN=
WHATSAPP_APPOINTMENT_TEMPLATE=leading_law_new_appointment_v1

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALENDAR_ID=
```

## Deployment Notes

This app is ready for a normal Next.js deployment target such as Vercel or another Node-compatible host.

Expected deployment steps:

1. Push `main` to `Akshay01Thakur/Leading-Law-Git`.
2. Connect the GitHub repo to the deployment provider.
3. Add environment variables from `.env.example`.
4. Run build command:

```bash
npm run build
```

5. For production payments, implement real payment create/order APIs and webhook verification before marking booking as confirmed.
6. For production notifications, send WhatsApp template messages server-side after payment success.
7. Move bookings/payments/notifications out of local storage into a database.

## Current Known Limitations

- Payment is mocked.
- Booking storage is browser local storage.
- WhatsApp notification is a deep link/mock response, not actual Meta API sending.
- Google Calendar uses add-event links, not OAuth event insertion.
- No production database is wired yet.
- GitHub push requires authentication in the target Codex/machine.

## Useful Commands For Next Codex Account

Check project state:

```bash
git status -sb
git log --oneline --decorate -5
git remote -v
rg -n "LegalSeva|legalseva|LEGALSEVA|Legal Seva|legalsewa" .
```

Validate:

```bash
npm run typecheck
npm run build
```

Push when authenticated:

```bash
git push -u origin main
```

If origin is missing after folder transport:

```bash
git remote add origin https://github.com/Akshay01Thakur/Leading-Law-Git.git
git push -u origin main
```

## Safety Notes

- Do not commit `.env.local`.
- Do not paste payment, WhatsApp, Google, or OpenRouter secrets into chat or source files.
- Keep Indian advocate marketing restrictions in mind: Q&A should stay informational, avoid solicitation, avoid guaranteed outcomes, and use source/citation links.
- Any real legal answer generation should be reviewed and should clearly separate general legal information from lawyer advice.
