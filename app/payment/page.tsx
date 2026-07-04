"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BackButton } from "../components/BackButton";
import { consultationSlots, getLawyer, icons, lawyers } from "../data";

type PaymentProvider = "razorpay" | "juspay";

type LawyerNotification = {
  status: string;
  channel: string;
  template: string;
  to: string;
  toMasked: string;
  calendarUrl: string;
  whatsappUrl: string;
  messagePreview: string;
};

const paymentProviderLabels: Record<PaymentProvider, string> = {
  razorpay: "Razorpay",
  juspay: "Juspay",
};

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
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>("razorpay");
  const [notification, setNotification] = useState<LawyerNotification | null>(null);
  const [notificationError, setNotificationError] = useState("");
  const platformFee = 50;
  const total = lawyer.fixed + platformFee;
  const meetingCode = `meet.google.com/legalseva-${lawyer.slug.slice(0, 3)}-${slot.id}`;
  const paymentProviderLabel = paymentProviderLabels[paymentProvider];

  async function confirmBooking() {
    setIsConfirming(true);
    setNotificationError("");
    const bookingId = `LS-${Date.now().toString().slice(-6)}`;
    const booking = {
      id: bookingId,
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
      paymentProvider: paymentProviderLabel,
      calendarAddUrl: "",
      whatsappNotificationUrl: "",
      lawyerWhatsAppMasked: "",
    };

    try {
      const response = await fetch("/api/appointments/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          lawyerName: lawyer.name,
          lawyerWhatsApp: lawyer.whatsapp,
          category,
          mode,
          date: slot.date,
          start: slot.start,
          end: slot.end,
          meetingCode,
          amount: total,
          paymentProvider: paymentProviderLabel,
        }),
      });

      if (!response.ok) throw new Error("Notification route failed");

      const nextNotification = (await response.json()) as LawyerNotification;
      const confirmedBooking = {
        ...booking,
        calendarAddUrl: nextNotification.calendarUrl,
        whatsappNotificationUrl: nextNotification.whatsappUrl,
        lawyerWhatsAppMasked: nextNotification.toMasked,
      };
      localStorage.setItem("legalseva:lastBooking", JSON.stringify(confirmedBooking));
      localStorage.setItem("legalseva:lastLawyerNotification", JSON.stringify(nextNotification));
      setNotification(nextNotification);
    } catch {
      localStorage.setItem("legalseva:lastBooking", JSON.stringify(booking));
      setNotificationError("Appointment saved. WhatsApp alert will retry from the production notification worker.");
    } finally {
      setBooked(true);
      setIsConfirming(false);
    }
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
            <span>Checkout</span>
          </div>
        </div>
        <div className="button-row top-back-row">
          <BackButton fallbackHref={`/consultation/${mode === "video" ? "video" : "call"}?lawyer=${lawyer.slug}&category=${encodeURIComponent(category)}`} />
        </div>

        <div className="payment-layout">
          <div className="payment-summary">
            <p className="eyebrow">Payment</p>
            <h1>{booked ? "Booking confirmed" : `Confirm ${mode === "video" ? "Google Meet" : "direct call"} consultation`}</h1>
            <p>
              {booked
                ? `Your booking is saved and the appointment alert for ${lawyer.name} includes a Google Calendar add link.`
                : "Choose Razorpay or Juspay for the checkout path. In production, booking confirmation should happen after the gateway webhook confirms payment success."}
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
                <strong>Gateway</strong>
                <span>{paymentProviderLabel}</span>
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

            {booked && notification && (
              <div className="notification-card">
                <icons.MessageSquareText size={28} />
                <div>
                  <strong>WhatsApp alert queued for {notification.to}</strong>
                  <span>{notification.toMasked} · Google Calendar link included</span>
                  <div className="button-row">
                    <a className="secondary-action" href={notification.whatsappUrl} target="_blank" rel="noreferrer">Open WhatsApp alert</a>
                    <a className="secondary-action" href={notification.calendarUrl} target="_blank" rel="noreferrer">Add to Google Calendar</a>
                  </div>
                </div>
              </div>
            )}

            {booked && notificationError && (
              <div className="notification-card warning">
                <icons.MessageSquareText size={28} />
                <span>{notificationError}</span>
              </div>
            )}
          </div>

          <aside className="checkout-box">
            <h2>Secure checkout</h2>
            <div className="payment-provider-list">
              {(["razorpay", "juspay"] as PaymentProvider[]).map((provider) => (
                <label className={paymentProvider === provider ? "provider-option active" : "provider-option"} key={provider}>
                  <input
                    checked={paymentProvider === provider}
                    disabled={booked || isConfirming}
                    name="payment-provider"
                    onChange={() => setPaymentProvider(provider)}
                    type="radio"
                    value={provider}
                  />
                  <span>
                    <strong>{paymentProviderLabels[provider]}</strong>
                    <small>{provider === "razorpay" ? "UPI, cards, netbanking" : "UPI orchestration, cards, wallets"}</small>
                  </span>
                </label>
              ))}
            </div>
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
              <button className="primary-action wide" disabled={isConfirming} onClick={confirmBooking}>
                {isConfirming ? "Confirming booking..." : `Pay with ${paymentProviderLabel} and book`}
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
