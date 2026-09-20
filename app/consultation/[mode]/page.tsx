"use client";

import { useSearchParams } from "next/navigation";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { FormEvent, Suspense, useRef, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { categories, getLawyer, icons, lawyers } from "../../data";
import { BrandLogo } from "../../components/BrandLogo";
import {
  consultationFee,
  consultationFeeBefore,
  consultationSaving,
  hasConsultationDiscount,
} from "../../lib/pricing";

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
  const [shared, setShared] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);
  const leadNotified = useRef(false);

  const advocateWhatsApp = process.env.NEXT_PUBLIC_ADVOCATE_WHATSAPP ?? lawyer.whatsapp ?? defaultAdvocateWhatsApp;
  const upiVpa = process.env.NEXT_PUBLIC_UPI_VPA ?? "";
  const upiPayeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Leading Law";
  const fee = consultationFee;

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
    notifyNewLead();
  }

  // Fire-and-forget early alert so the advocate sees leads who never reach the
  // payment step. Deliberately not awaited and errors are swallowed: the customer
  // moves to the payment screen immediately whether or not this succeeds.
  // keepalive lets it complete even if they navigate away straight after.
  function notifyNewLead() {
    if (leadNotified.current) return;
    leadNotified.current = true;
    try {
      void fetch("/api/notify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: consumerName,
          phone: consumerPhone,
          category: selectedCategory,
          city,
          urgency,
          issue: queryText,
        }),
        keepalive: true,
      }).catch(() => {
        /* never surface a failed alert to the customer */
      });
    } catch {
      /* never block the booking flow */
    }
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

  // Saves the QR as a PNG. Renders from an off-screen canvas at 4x the displayed
  // size so the saved image stays sharp if it is printed or re-shared. Uses a blob
  // rather than a data URL because iOS Safari handles blob downloads more reliably.
  function downloadQr() {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `leading-law-upi-${fee}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2500);
    }, "image/png");
  }

  // Lets someone pay on another person's behalf — e.g. a senior citizen sending
  // the details to a family member. Native share sheet where available (so it can
  // go straight to WhatsApp), clipboard fallback everywhere else.
  async function sharePaymentDetails() {
    const text = [
      `Leading Law consultation fee: ₹${fee}`,
      `Pay to UPI ID: ${upiVpa}`,
      `Or tap to pay: ${upiUrl}`,
    ].join("\n");
    const nav = navigator as Navigator & { share?: (data: { title?: string; text?: string }) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: "Leading Law payment", text });
        return;
      } catch {
        /* user dismissed the share sheet — fall through to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      /* nothing more we can do; details are visible on screen */
    }
  }

  // Repeated under every payment option rather than sitting once at the foot of
  // the page. Someone who pays by scanning the QR is done at option 1 and has no
  // reason to keep scrolling, so a single notify button at the bottom was easy to
  // miss — and missing it means the advocate never learns the payment happened.
  const paidStep = (
    <div className="paid-step">
      <button className="primary-action wide" onClick={notifyAdvocate} type="button">
        <icons.CheckCircle2 size={18} /> I&apos;ve Paid — Notify Advocate
      </button>
      <p className="pay-help">
        Tap this once your payment is done. It tells our advocate to check the payment and confirm your
        appointment on WhatsApp.
      </p>
    </div>
  );

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
                  Confirm your legal category and query, then share your contact details. Your first
                  consultation is ₹{fee}, payable by UPI on the next step.
                </p>
                {hasConsultationDiscount && (
                  <p className="fee-inline-offer">
                    <s>₹{consultationFeeBefore}</s>
                    <strong>₹{fee}</strong>
                    <span className="fee-save-tag">₹{consultationSaving} off first consultation</span>
                  </p>
                )}

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
                  Pay the consultation fee by UPI in whichever way suits you, then tap
                  <strong> I&apos;ve Paid</strong> — it sits under every option — so our advocate can verify
                  the payment and confirm your appointment.
                </p>

                {upiVpa ? (
                  <div className="consumer-detail-form">
                    <div className="pay-amount-banner">
                      <span>Amount to pay</span>
                      <strong>
                        {hasConsultationDiscount && <s>₹{consultationFeeBefore}</s>}₹{fee}
                      </strong>
                      {hasConsultationDiscount && (
                        <em className="fee-save-tag">₹{consultationSaving} off first consultation</em>
                      )}
                    </div>

                    <div className="pay-option">
                      <h2><span className="pay-step-num">1</span> Scan this QR code to pay</h2>
                      <div className="qr-holder">
                        <QRCodeSVG value={upiUrl} size={208} level="M" marginSize={2} />
                      </div>
                      <p className="pay-help">
                        Open any UPI app — <strong>GPay, PhonePe, Paytm, BHIM</strong> or your bank app — tap
                        the scan button, and point your camera at this code. The amount fills in automatically.
                      </p>
                      <button className="secondary-action wide" onClick={downloadQr} type="button">
                        {downloaded ? "QR code saved" : "Download QR Code"}
                      </button>
                      <p className="pay-help">
                        Saves the code as an image. Handy if you want to pay from another phone, send it to
                        someone, or keep it for later.
                      </p>

                      {/* Off-screen high-resolution copy, used only as the download source. */}
                      <div className="qr-download-source" ref={qrCanvasRef} aria-hidden="true">
                        <QRCodeCanvas value={upiUrl} size={832} level="M" marginSize={2} />
                      </div>

                      {paidStep}
                    </div>

                    <div className="pay-divider"><span>or</span></div>

                    <div className="pay-option">
                      <h2><span className="pay-step-num">2</span> Paying on this phone?</h2>
                      <a className="primary-action wide" href={upiUrl}>
                        Tap to Pay ₹{fee}
                      </a>
                      <p className="pay-help">Opens your UPI app directly with the amount already filled in.</p>

                      {paidStep}
                    </div>

                    <div className="pay-divider"><span>or</span></div>

                    <div className="pay-option">
                      <h2><span className="pay-step-num">3</span> Pay to this UPI ID</h2>
                      <div className="upi-id-row">
                        <div>
                          <small>UPI ID</small>
                          <strong>{upiVpa}</strong>
                        </div>
                        <button className="secondary-action" onClick={copyUpiId} type="button">
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <button className="secondary-action wide" onClick={sharePaymentDetails} type="button">
                        {shared ? "Copied — paste to share" : "Share payment details"}
                      </button>
                      <p className="pay-help">
                        Want someone else to pay for you? Share these details with a family member and they can
                        pay from their own phone.
                      </p>

                      {paidStep}
                    </div>
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
                <strong>
                  First consultation: {hasConsultationDiscount && <s>₹{consultationFeeBefore}</s>}₹{fee}
                </strong>{" "}
                — a one-time fee paid by UPI. Your appointment is confirmed once our advocate verifies the
                payment.
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
    <BrandLogo width={228} />
  );
}
