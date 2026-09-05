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
  const [booked, setBooked] = useState(false);
  const [formError, setFormError] = useState("");

  const advocateWhatsApp = process.env.NEXT_PUBLIC_ADVOCATE_WHATSAPP ?? lawyer.whatsapp ?? defaultAdvocateWhatsApp;
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
    ...(confirmUrl ? [`Tap to confirm and notify the customer: ${confirmUrl}`] : []),
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
    setBooked(true);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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
            <p className="eyebrow">Book your appointment</p>
            <h1>Tell Us About Your Case</h1>
            <p>
              Confirm your legal category and query, then share your contact details. Our verified legal expert team will call you back within 3 hours.
            </p>

            {!booked ? (
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
                  Book Appointment
                </button>
              </form>
            ) : (
              <div className="booking-confirmation">
                <icons.CheckCircle2 size={28} />
                <div>
                  <strong>Your appointment request is received</strong>
                  <span>
                    We've opened WhatsApp to notify our advocate. You will get a WhatsApp confirmation on{" "}
                    {consumerPhone} once our advocate confirms your {selectedCategory} consultation, and a call
                    within the next 3 hours.
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
              <icons.MessageSquareText size={28} />
              <p>No account or payment needed. Coordination happens directly on WhatsApp once your appointment is booked.</p>
            </div>

            {booked && (
              <>
                <a className="primary-action wide" href={whatsappUrl} target="_blank" rel="noreferrer">
                  Notify Advocate on WhatsApp
                </a>
                <p className="field-note">
                  Didn't see WhatsApp open automatically? Tap the button above to notify our advocate yourself.
                </p>
              </>
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
