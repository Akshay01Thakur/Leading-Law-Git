"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BackButton } from "../components/BackButton";
import { consultationSlots, getLawyer, icons, lawyers } from "../data";

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentMock lawyerSlug="farah-khan" mode="call" slotId={consultationSlots[1].id} category="Property / RERA" />}>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const lawyerSlug = searchParams.get("lawyer") ?? "farah-khan";
  const mode = searchParams.get("mode") ?? "call";
  const slotId = searchParams.get("slot") ?? consultationSlots[1].id;
  const category = searchParams.get("category") ?? "Property / RERA";
  return <PaymentMock lawyerSlug={lawyerSlug} mode={mode} slotId={slotId} category={category} />;
}

function PaymentMock({ lawyerSlug, mode, slotId, category }: { lawyerSlug: string; mode: string; slotId: string; category: string }) {
  const lawyer = getLawyer(lawyerSlug) ?? lawyers[0];
  const slot = consultationSlots.find((item) => item.id === slotId) ?? consultationSlots[1];
  const [booked, setBooked] = useState(false);
  const platformFee = 50;
  const total = lawyer.fixed + platformFee;
  const meetingCode = `meet.google.com/legalseva-${lawyer.slug.slice(0, 3)}-${slot.id}`;

  function confirmBooking() {
    const booking = {
      id: `LS-${Date.now().toString().slice(-6)}`,
      lawyer: lawyer.name,
      lawyerSlug: lawyer.slug,
      mode,
      category,
      date: slot.date,
      start: slot.start,
      end: slot.end,
      amount: total,
      platformFee,
      meetingCode,
      status: "Booked",
      reschedulesLeft: 1,
    };
    localStorage.setItem("legalseva:lastBooking", JSON.stringify(booking));
    setBooked(true);
  }

  return (
    <main className="mock-page payment-page">
      <section className="mock-card payment-card">
        <div className="brand-block">
          <div className="brand-mark">
            <icons.Scale size={26} />
          </div>
          <div>
            <strong>LegalSeva</strong>
            <span>Mock checkout</span>
          </div>
        </div>
        <div className="button-row top-back-row">
          <BackButton fallbackHref={`/consultation/${mode === "video" ? "video" : "call"}?lawyer=${lawyer.slug}&category=${encodeURIComponent(category)}`} />
        </div>

        <div className="payment-layout">
          <div className="payment-summary">
            <p className="eyebrow">Payment mockup</p>
            <h1>{booked ? "Booking confirmed" : `Confirm ${mode === "video" ? "Google Meet" : "direct call"} consultation`}</h1>
            <p>
              {booked
                ? "Your booking is saved locally in this prototype. Use My Bookings for the consultation link, direct-call window, reschedule and support."
                : "This page shows the future Razorpay-style checkout state. Payment is mocked, but booking confirmation creates a local prototype booking."}
            </p>

            <div className="payment-lawyer">
              <span className="avatar">{lawyer.initials}</span>
              <div>
                <strong>{lawyer.name}</strong>
                <span>{category} · {lawyer.languages.join(", ")}</span>
              </div>
            </div>

            <div className="mock-grid">
              <div>
                <strong>Slot</strong>
                <span>{slot.date}, {slot.start} - {slot.end}</span>
              </div>
              <div>
                <strong>Connect</strong>
                <span>{mode === "video" ? "Google Meet" : "Direct call"}</span>
              </div>
              <div>
                <strong>Reschedule</strong>
                <span>1 time after booking</span>
              </div>
            </div>

            {booked && (
              <div className="booking-confirmation">
                <icons.CheckCircle2 size={28} />
                <div>
                  <strong>{mode === "video" ? meetingCode : "Direct call scheduled"}</strong>
                  <span>
                    {mode === "video"
                      ? "Both consumer and lawyer use this same mock Google Meet room."
                      : "LegalSeva will call both sides during the selected 3-hour window."}
                  </span>
                </div>
              </div>
            )}
          </div>

          <aside className="checkout-box">
            <h2>Secure checkout</h2>
            <div className="checkout-row">
              <span>Consultation hold</span>
              <strong>Rs {lawyer.fixed}</strong>
            </div>
            <div className="checkout-row">
              <span>Platform fee</span>
              <strong>Rs {platformFee}</strong>
            </div>
            <div className="checkout-row total">
              <span>Total</span>
              <strong>Rs {total}</strong>
            </div>
            {!booked ? (
              <button className="primary-action wide" onClick={confirmBooking}>
                Mock pay Rs {total} and book
              </button>
            ) : (
              <>
                <Link className="primary-action wide" href="/bookings">View my bookings</Link>
                <Link className="secondary-action wide" href="/support">Need help? Contact support</Link>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
