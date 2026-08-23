# Claude Code Handoff Prompt - Leading Law

Copy this prompt into Claude Code when continuing this project.

---

You are continuing development on a Next.js web application called **Leading Law**.

The project is a legal marketplace for India that connects consumers with a verified advocate. The current product direction is to make the site live quickly with minimal investment: consumer-only flow, no database, no authentication, no server-side storage, no video calling, and all advocate communication handled through WhatsApp. Payment should be handled through a simple Razorpay/Juspay/payment-link style handoff unless the owner later chooses deeper integration.

## Absolute Project Path

The repository is located at:

`/Users/akshaythakur/Documents/Analysis`

GitHub remote:

`https://github.com/Akshay01Thakur/Leading-Law-Git.git`

The last local browser URL used by the owner was:

`http://127.0.0.1:3022/consumer`

## Important Current State

Before editing, run:

```bash
cd /Users/akshaythakur/Documents/Analysis
git status -sb
git log --oneline --decorate -8
npm run typecheck
npm run build
```

There is a stable committed consumer UI at commit:

`d1993b4 Refine consumer page labels`

There are also uncommitted minimal-launch changes in progress. Do not blindly reset them. Inspect the diff first:

```bash
git diff --stat
git diff
```

If the owner says "revert to http://127.0.0.1:3022/consumer", clarify whether they mean the last committed stable UI or the current running local page. Do not run destructive commands like `git reset --hard` unless the owner explicitly asks for that.

Ignore unrelated untracked files beginning with `loop-engineering`.

## Product Goal

Build **Leading Law**, a trustworthy legal-tech consumer intake and consultation booking site for India.

The flow should feel serious, clean, and conversion-focused:

1. Consumer explains their legal concern.
2. Consumer instantly sees relevant legal knowledge-library answers.
3. Consumer sees a single featured verified advocate: Adv. Vivek Yadav.
4. Consumer selects a 3-hour consultation window.
5. Consumer pays a small platform fee / advocate fee through a payment link.
6. Consumer continues to WhatsApp where the advocate receives booking details.

No database should be required for the first live version. Data can pass through URL query parameters and WhatsApp prefilled messages. Avoid pretending persistence exists.

## Current Business Rules

- Brand name: **Leading Law**.
- Primary market: India.
- Primary user: consumer seeking legal help.
- Advocate shown everywhere: **Adv. Vivek Yadav**.
- Advocate display:
  - Name: `Adv. Vivek Yadav`
  - Practice: `Property | RERA | Consumer | Civil Litigation`
  - Courts: `Delhi High Court • District Courts • Delhi NCR`
  - Rating: `4.9 Rating`
  - Satisfaction: `98% Client Satisfaction`
  - Experience: `5-10 Years Experience`
  - Consultations: `350+ Consultations`
  - Verification: `Verified Bar Registration`
- Advocate title in card: `Leading Law Verified Advocate`
- Card badge: `Featured Advocate`
- Practice areas:
  - Property & Real Estate
  - RERA
  - Consumer Disputes
  - Civil Litigation
  - Commercial Recovery
  - Banking & Finance
  - Documentation & Agreements
- The site must avoid lawyer advertising language that violates Indian legal ethics. Prefer "legal information", "verified advocate", "consultation", and "consumer legal help". Add disclaimers that knowledge-library content is general guidance and not legal advice.

## Minimal Integration Requirements Needed From Owner

Ask only for these to go live:

1. Live advocate WhatsApp number in international format without plus sign.
   - Example env key: `NEXT_PUBLIC_ADVOCATE_WHATSAPP=91XXXXXXXXXX`
2. Payment link from Razorpay/Juspay or preferred payment provider.
   - Example env key: `NEXT_PUBLIC_PAYMENT_LINK=https://...`
3. Payment provider label.
   - Example env key: `NEXT_PUBLIC_PAYMENT_PROVIDER_LABEL=Razorpay`
4. Production domain or hosting choice.
   - Vercel is the easiest for this Next.js app.
5. Business email/support phone to show in Support and footer.
6. Final consultation fee and platform fee.

No database, no auth provider, no file storage, no calendar API, and no LLM API are required for the minimal launch.

## Key File Map

### App Shell and Routing

- `/Users/akshaythakur/Documents/Analysis/app/layout.tsx`
  - Global metadata and root layout.
  - Ensure metadata says Leading Law.

- `/Users/akshaythakur/Documents/Analysis/app/page.tsx`
  - Home page.
  - In the minimal version, this should route users toward the consumer flow only.
  - Avoid role-switching CTAs if the product is consumer-only.

- `/Users/akshaythakur/Documents/Analysis/app/consumer/page.tsx`
  - Consumer landing/intake page.
  - It renders the consumer funnel component.

- `/Users/akshaythakur/Documents/Analysis/app/questions/page.tsx`
  - Legal knowledge/Q&A listing page.
  - Should be usable by consumers.
  - Category CTAs should open category-level Q&A views.

- `/Users/akshaythakur/Documents/Analysis/app/questions/[slug]/page.tsx`
  - Individual Q&A answer page.
  - "Book Consultation" CTA must route to the consultation/booking flow with relevant query params.

- `/Users/akshaythakur/Documents/Analysis/app/lawyer/[slug]/page.tsx`
  - Public advocate profile page for Adv. Vivek Yadav.
  - Keep this as a consumer-facing profile page, not a lawyer dashboard.

- `/Users/akshaythakur/Documents/Analysis/app/consultation/[mode]/page.tsx`
  - Consultation booking page.
  - In minimal version, keep only WhatsApp-coordinated phone consultation.
  - It should collect name, phone, optional email, category, city, language, urgency, and slot.
  - It should generate a continuation to the payment page.

- `/Users/akshaythakur/Documents/Analysis/app/payment/page.tsx`
  - Payment handoff page.
  - Should not store payment state.
  - Should show payment summary and either link to payment provider or ask user to request payment link on WhatsApp.
  - Should generate a WhatsApp message with appointment details.

- `/Users/akshaythakur/Documents/Analysis/app/support/page.tsx`
  - Support page.
  - Should focus on WhatsApp support, payment link help, reschedule support, and consultation queries.

- `/Users/akshaythakur/Documents/Analysis/app/mock/page.tsx`
  - Generic mock page used by older CTAs.
  - If the minimal flow no longer uses it, either leave harmlessly or remove only after ensuring no active links point to it.

### Components

- `/Users/akshaythakur/Documents/Analysis/app/components/ConsumerFunnel.tsx`
  - Main consumer intake and conversion funnel.
  - Includes issue textarea, category selection, language/city/urgency, trust badges, legal answer matching, and featured advocate card.
  - Check all CTAs here. They must route correctly.
  - The current user-facing copy requested:
    - Headline: `Where Legal Needs Meet Legal Excellence.`
    - Textarea label: `Describe your legal query`
    - Placeholder: `Write your query here`
    - CTA: `Find Legal Answers`
    - Trust badges: `Verified Advocates`, `Secure & Confidential`, `Trusted by Thousands`, `No Hidden Charges`
    - Social proof: `Trusted by 10,000+ consumers`
    - Estimated speed: `Find similar answers in seconds`
    - Disclaimer at bottom: knowledge library is general guidance and not legal advice.

- `/Users/akshaythakur/Documents/Analysis/app/components/QuestionBoard.tsx`
  - Q&A/category listing UI.
  - If continuing minimal consumer-only version, remove or hide lawyer/admin actions and role-specific views.
  - Similar questions must link to actual question pages, not inert buttons.

- `/Users/akshaythakur/Documents/Analysis/app/components/RoleShell.tsx`
  - Navigation/sidebar wrapper.
  - For minimal launch, consumer navigation should be:
    - Home
    - Legal Knowledge
    - Support
  - Remove switch-role CTA and any broken links to removed dashboards.

- `/Users/akshaythakur/Documents/Analysis/app/components/BackButton.tsx`
  - Client-side back button.
  - Back behavior should return to the previous page, not always to the first issue page.

### Data and Knowledge Library

- `/Users/akshaythakur/Documents/Analysis/app/data.ts`
  - Central data for roles, legal categories, advocate profile, mock slots, city/language options, fee values, and support copy.
  - Current minimal flow should keep only what is required by consumer flow.
  - Check advocate profile values match Adv. Vivek Yadav details above.

- `/Users/akshaythakur/Documents/Analysis/app/legalKnowledge.ts`
  - Generated/static knowledge library.
  - The user previously asked for many Q&A items by category, with specific answers and category pages.
  - If expanding it, keep answers specific, practical, and India-oriented.
  - Do not mention "LLM", "fallback", or "Google-type search" in user-facing UI.

### Styling

- `/Users/akshaythakur/Documents/Analysis/app/globals.css`
  - Main CSS.
  - Check mobile and desktop responsiveness.
  - Avoid overlapping tags/cards. Previous issue: similar Q&A answer-by text and tags overlapped.
  - Keep the design serious, trustworthy, legal-tech, and not overly decorative.

### Configuration and Docs

- `/Users/akshaythakur/Documents/Analysis/package.json`
  - Scripts and dependencies.
  - Validate with `npm run typecheck` and `npm run build`.

- `/Users/akshaythakur/Documents/Analysis/package-lock.json`
  - Lockfile.

- `/Users/akshaythakur/Documents/Analysis/tsconfig.json`
  - TypeScript config.

- `/Users/akshaythakur/Documents/Analysis/next-env.d.ts`
  - Next.js generated typing file.

- `/Users/akshaythakur/Documents/Analysis/.env.example`
  - Environment variable template.
  - For minimal live version, should include:
    - `NEXT_PUBLIC_SITE_URL`
    - `NEXT_PUBLIC_ADVOCATE_WHATSAPP`
    - `NEXT_PUBLIC_PAYMENT_LINK`
    - `NEXT_PUBLIC_PAYMENT_PROVIDER_LABEL`

- `/Users/akshaythakur/Documents/Analysis/README.md`
  - Deployment and setup instructions.
  - It may be outdated if it still mentions databases, admin/lawyer dashboards, LLMs, appointment API webhooks, or calendar sync. Update it to match the minimal launch direction.

- `/Users/akshaythakur/Documents/Analysis/CODEX_MEMORY.md`
  - Previous Codex handoff memory file.
  - It may describe the older, fuller version. Update it after major changes so future Codex/Claude sessions know the current direction.

- `/Users/akshaythakur/Documents/Analysis/CLAUDE_CODE_PROMPT.md`
  - This handoff file.

## Deleted or Possibly Removed Files

The current uncommitted minimal-flow attempt deleted these files:

- `/Users/akshaythakur/Documents/Analysis/app/admin/page.tsx`
- `/Users/akshaythakur/Documents/Analysis/app/lawyer/page.tsx`
- `/Users/akshaythakur/Documents/Analysis/app/bookings/page.tsx`
- `/Users/akshaythakur/Documents/Analysis/app/api/appointments/notify/route.ts`
- `/Users/akshaythakur/Documents/Analysis/app/components/AdminConsole.tsx`
- `/Users/akshaythakur/Documents/Analysis/app/components/LawyerWorkbench.tsx`

If continuing the minimal launch, verify no navigation or CTA still links to these deleted pages. If restoring the fuller app, recover them carefully from git rather than rewriting from memory.

## Known Follow-Up Tasks

1. Decide baseline:
   - Continue the uncommitted minimal-launch version, or
   - Restore/selectively revert to the stable committed UI at `d1993b4`.
2. Remove broken dashboard/admin/lawyer links if staying consumer-only.
3. Make all CTAs route to a real page:
   - Consumer issue CTA -> Q&A/result section.
   - Q&A Book Consultation -> consultation page.
   - Advocate card Book Consultation -> consultation page.
   - Payment CTA -> payment provider link or WhatsApp request.
   - Support CTA -> WhatsApp/support page.
4. Confirm there is no visible wording like:
   - "no LLM"
   - "fallback"
   - "Google-type search"
   - "mock" in production-facing flows.
5. Confirm Q&A answer pages show:
   - `Answered by Adv. Vivek Yadav`
   - Category tags without overlap.
6. Confirm the advocate card shows:
   - `Featured Advocate`
   - `Leading Law Verified Advocate`
   - Updated profile details.
7. Update `.env.example`, `README.md`, and `CODEX_MEMORY.md`.
8. Run:

```bash
npm run typecheck
npm run build
```

9. Start dev server:

```bash
npm run dev
```

Use whatever port Next.js chooses if `3000` is busy, then share the local URL.

## Deployment Notes

Recommended minimal deployment:

- Host on Vercel.
- Add environment variables in Vercel:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_ADVOCATE_WHATSAPP`
  - `NEXT_PUBLIC_PAYMENT_LINK`
  - `NEXT_PUBLIC_PAYMENT_PROVIDER_LABEL`
- No database setup.
- No auth setup.
- No server storage.
- No external LLM setup.

If pushing to GitHub fails, the likely reason is missing local GitHub authentication. The remote already exists, but the owner may need to authenticate with GitHub CLI or a credential manager.

## Coding Preferences

- Keep changes scoped and production-facing.
- Do not add a database unless the owner explicitly changes direction.
- Do not add authentication for the minimal launch.
- Do not add video consultation for the minimal launch.
- Do not commit secrets or `.env.local`.
- Use environment variables for public payment/WhatsApp configuration.
- Keep UI mobile-responsive and conversion-oriented.
- Treat Indian legal advertising restrictions seriously: use careful wording and clear disclaimers.

