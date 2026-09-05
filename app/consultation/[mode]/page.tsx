"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { categories, getLawyer, icons, lawyers } from "../../data";

const defaultAdvocateWhatsApp = "918700843886";
const phonePattern = /^[6-9]\d{9}$/;

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={<ConsultationShell lawyerSlug="vivek-yadav" category="Property / RERA" city="Delhi NCR" language="English" urgency="This Week" issue="" />}>
      <ConsultationContent />
    </Suspense>
  );
}

function ConsultationContent() {
  const searchParams = useSearchParams();
  const lawyerSlug = searchParams.get("lawyer") ?? "vivek-yadav";
  const category = searchParams.get("category") ?? "Property / RERA";
  const city = searchParams.get("city") ?? "Delhi NCR";
  const language = searchParams.get("language") ?? "English";
  const urgency = searchParams.get("urgency") ?? "This Week";
  const issue = searchParams.get("issue") ?? "";

  return <ConsultationShell lawyerSlug={lawyerSlug} category={category} city={city} language={language} urgency={urgency} issue={issue} />;
}

function ConsultationShell({
  lawyerSlug,
  category,
  city,
  language,
  urgency,
  issue,
}: {
  lawyerSlug: string;
  category: string;
  city: string;
  language: string;
  urgency: string;
  issue: string;
}) {
  const lawyer = getLawyer(lawyerSlug) ?? lawyers[0];
  const [selectedCategory, setSelectedCategory] = useState(categories.includes(category) ? category : categories[0]);
  const [queryText, setQueryText] = useState(issue);
  const [consumerName, setConsumerName] = useState("");
  const [consumerPhone, setConsumerPhone] = useState("");
  const [stage, setStage] = useState<"form" | "payment" | "notified">("form");
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);

  const advocateWhatsApp = process.env.NEXT_PUBLIC_ADVOCATE_WHATSAPP ?? lawyer.whatsapp ?? defaultAdvocateWhatsApp;
  const upiVpa = process.env.NEXT_PUBLIC_UPI_VPA ?? "";
  const upiPayeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Leading Law";
  const fee = process.env.NEXT_PUBLIC_CONSULTATION_FEE ?? "499";

  const upiNote = `Leading Law consultation ${consumerName}`.slice(0, 50);
  // Built with encodeURIComponent rather than URLSearchParams: the latter encodes
  // spaces as "+", which some UPI apps render literally in the payee name.
  const upiUrl = upiVpa
    ? "upi://pay?" +
      [
        `pa=${encodeURIComponent(upiVpa)}`,
        `pn=${encodeURIComponent(upiPayeeName)}`,
        `am=${encodeURIComponent(fee)}`,
        "cu=INR",
        `tn=${encodeURIComponent(upiNote)}`,
      ].join("&")
    : "";

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const confirmUrl = siteUrl
    ? `${siteUrl}/confirm?${new URLSearchParams({
        name: consumerName,
        phone: consumerPhone,
        category: selectedCategory,
        city,
        language,
        urgency,
        issue: queryText,
        fee,
      }).toString()}`
    : "";

  const whatsappMessage = [
    "Hello, a new Leading Law appointment has been booked.",
    `Name: ${consumerName}`,
    `Phone: ${consumerPhone}`,
    `Category: ${selectedCategory}`,
    `City: ${city}`,
    `Preferred language: ${language}`,
    `Urgency: ${urgency}`,
    `Query: ${queryText}`,
    `Consultation fee: ₹${fee} — customer has marked this as paid via UPI.`,
    "Please check that the payment has arrived before confirming.",
    ...(confirmUrl ? [`Once verified, tap here to confirm and notify the customer: ${confirmUrl}`] : []),
  ].join("\n");
  const whatsappUrl = `https://wa.me/${advocateWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;

  function handleBooking(event: FormEvent) {
    event.preventDefault();
    if (!consumerName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!phonePattern.test(normalizePhone(consumerPhone))) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!queryText.trim()) {
      setFormError("Please describe your legal query.");
      return;
    }
    setFormError("");
    setStage("payment");
  }

  function notifyAdvocate() {
    setStage("notified");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(upiVpa);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the ID is shown on screen anyway */
    }
  }

  return (
    <main className="mock-page consultation-page">
      <section className="mock-card consultation-card wide-consultation-card">
        <ConsultationBrand />
        <div className="button-row top-back-row">
          <BackButton fallbackHref="/consumer" />
        </div>

        <div className="consultation-layout">
          <section className="slot-panel">
            {stage === "form" && (
              <>
                <p className="eyebrow">Book your appointment</p>
                <h1>Tell Us About Your Case</h1>
                <p>
                  Confirm your legal category and query, then share your contact details. The consultation fee is
                  ₹{fee}, payable by UPI on the next step.
                </p>

                <form className="consumer-detail-form" onSubmit={handleBooking}>
                  <h2>Your query</h2>
                  <div className="form-grid">
                    <label>
                      Legal category
                      <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                        {categories.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </label>
                  </div>
                  <label>
                    Describe your legal query
                    <textarea
                      placeholder="Write your query here"
                      value={queryText}
                      onChange={(event) => setQueryText(event.target.value)}
                    />
                  </label>

                  <h2>Your details</h2>
                  <div className="form-grid">
                    <label>
                      Full name
                      <input value={consumerName} onChange={(event) => setConsumerName(event.target.value)} placeholder="Enter your name" />
                    </label>
                    <label>
                      Mobile number
                      <input value={consumerPhone} onChange={(event) => setConsumerPhone(event.target.value)} inputMode="tel" placeholder="Enter your 10-digit mobile number" />
                    </label>
                  </div>
                  {formError && <p className="field-note error">{formError}</p>}
                  <button className="primary-action wide" type="submit">
                    Continue to Payment
                  </button>
                </form>
              </>
            )}

            {stage === "payment" && (
              <>
                <p className="eyebrow">Step 2 of 2</p>
                <h1>Pay ₹{fee} to Confirm</h1>
                <p>
                  Pay the consultation fee by UPI, then tap the notify button so our advocate can verify the
                  payment and confirm your appointment.
                </p>

                {upiVpa ? (
                  <div className="consumer-detail-form">
                    <h2>Pay by UPI</h2>

                    <div className="fee-breakdown">
                      <div>
                        <span>Consultation fee</span>
                        <strong>₹{fee}</strong>
                      </div>
                    </div>

                    <div className="upi-id-row">
                      <div>
                        <small>UPI ID</small>
                        <strong>{upiVpa}</strong>
                      </div>
                      <button className="secondary-action" onClick={copyUpiId} type="button">
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <a className="primary-action wide" href={upiUrl}>
                      Pay ₹{fee} in UPI App
                    </a>
                    <p className="field-note">
                      On a phone this opens GPay, PhonePe, Paytm or any UPI app with the amount filled in. On a
                      laptop, copy the UPI ID above and pay from your phone.
                    </p>

                    <h2>After paying</h2>
                    <button className="primary-action wide" onClick={notifyAdvocate} type="button">
                      I Have Paid — Notify Advocate
                    </button>
                  </div>
                ) : (
                  <p className="field-note error">
                    Online payment is not configured for this site yet, so this booking cannot be completed.
                    Please contact us directly.
                  </p>
                )}
              </>
            )}

            {stage === "notified" && (
              <div className="booking-confirmation">
                <icons.CheckCircle2 size={28} />
                <div>
                  <strong>Payment sent — awaiting confirmation</strong>
                  <span>
                    We&apos;ve opened WhatsApp to notify our advocate. Once your ₹{fee} payment is verified,
                    you&apos;ll get a WhatsApp confirmation on {consumerPhone} that your {selectedCategory}{" "}
                    appointment is booked and paid, followed by a call within 3 hours.
                  </span>
                </div>
              </div>
            )}
          </section>

          <aside className="consultation-confirm">
            <div className="payment-lawyer">
              <span className="avatar"><icons.ShieldCheck size={20} /></span>
              <div>
                <strong>Leading Law Verified Expert</strong>
                <span>{selectedCategory} · {language} · {city}</span>
              </div>
            </div>

            {queryText && (
              <div className="aid-box">
                <icons.BookOpenCheck size={28} />
                <p><strong>Your query: </strong>{queryText}</p>
              </div>
            )}

            <div className="aid-box">
              <icons.IndianRupee size={28} />
              <p>
                <strong>Consultation fee: ₹{fee}</strong> — a one-time fee paid by UPI. Your appointment is
                confirmed once our advocate verifies the payment.
              </p>
            </div>

            {stage === "notified" && (
              <a className="primary-action wide" href={whatsappUrl} target="_blank" rel="noreferrer">
                Notify Advocate on WhatsApp
              </a>
            )}
            {stage === "notified" && (
              <p className="field-note">
                Didn&apos;t see WhatsApp open automatically? Tap the button above to notify our advocate yourself.
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function ConsultationBrand() {
  return (
    <div className="brand-block">
      <div className="brand-mark">
        <icons.Scale size={26} />
      </div>
      <div>
        <strong>Leading Law</strong>
        <span>Get Legal Help in Minutes</span>
      </div>
    </div>
  );
}
