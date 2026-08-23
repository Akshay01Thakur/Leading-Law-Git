"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { getLawyer, icons, lawyers } from "../../data";

const defaultAdvocateWhatsApp = "919999000111";

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
  const [consumerName, setConsumerName] = useState("");
  const [consumerPhone, setConsumerPhone] = useState("");
  const [booked, setBooked] = useState(false);
  const [formError, setFormError] = useState("");

  const advocateWhatsApp = process.env.NEXT_PUBLIC_ADVOCATE_WHATSAPP ?? lawyer.whatsapp ?? defaultAdvocateWhatsApp;
  const whatsappMessage = [
    "Hello, a new Leading Law appointment has been booked.",
    `Name: ${consumerName}`,
    `Phone: ${consumerPhone}`,
    `Category: ${category}`,
    `City: ${city}`,
    `Preferred language: ${language}`,
    `Urgency: ${urgency}`,
    `Issue: ${issue || "Customer will share details on the call."}`,
  ].join("\n");
  const whatsappUrl = `https://wa.me/${advocateWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;

  function handleBooking(event: FormEvent) {
    event.preventDefault();
    if (!consumerName.trim() || !consumerPhone.trim()) {
      setFormError("Please enter your name and mobile number.");
      return;
    }
    setFormError("");
    setBooked(true);
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
            <h1>Share Your Details</h1>
            <p>
              Just your name and mobile number. Our verified legal expert team will call you back within 3 hours.
            </p>

            {!booked ? (
              <form className="consumer-detail-form" onSubmit={handleBooking}>
                <h2>Your details</h2>
                <div className="form-grid">
                  <label>
                    Full name
                    <input value={consumerName} onChange={(event) => setConsumerName(event.target.value)} placeholder="Enter your name" />
                  </label>
                  <label>
                    Mobile number
                    <input value={consumerPhone} onChange={(event) => setConsumerPhone(event.target.value)} inputMode="tel" placeholder="Enter your mobile number" />
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
                  <strong>Your appointment is booked</strong>
                  <span>Our verified legal expert will call {consumerName} on {consumerPhone} within the next 3 hours.</span>
                </div>
              </div>
            )}
          </section>

          <aside className="consultation-confirm">
            <div className="payment-lawyer">
              <span className="avatar"><icons.ShieldCheck size={20} /></span>
              <div>
                <strong>Leading Law Verified Expert</strong>
                <span>{category} · {language} · {city}</span>
              </div>
            </div>

            <div className="aid-box">
              <icons.MessageSquareText size={28} />
              <p>No account, no password and no payment is required for this launch version. Coordination happens directly on WhatsApp.</p>
            </div>

            {booked && (
              <a className="primary-action wide" href={whatsappUrl} target="_blank" rel="noreferrer">
                Notify Advocate on WhatsApp
              </a>
            )}
            <Link className="secondary-action wide" href="/support">Support</Link>
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
