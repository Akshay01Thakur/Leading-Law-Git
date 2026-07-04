"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { BackButton } from "../../components/BackButton";
import { consultationSlots, getLawyer, icons, lawyers } from "../../data";

type Mode = "call" | "video";

export default function ConsultationPage() {
  return (
    <Suspense fallback={<ConsultationShell mode="call" lawyerSlug="arjun-rao" category="Property / RERA" />}>
      <ConsultationContent />
    </Suspense>
  );
}

function ConsultationContent() {
  const params = useParams<{ mode: string }>();
  const searchParams = useSearchParams();
  const mode = params.mode === "video" ? "video" : "call";
  const lawyerSlug = searchParams.get("lawyer") ?? "arjun-rao";
  const category = searchParams.get("category") ?? "Property / RERA";

  return <ConsultationShell mode={mode} lawyerSlug={lawyerSlug} category={category} />;
}

function ConsultationShell({ mode, lawyerSlug, category }: { mode: Mode; lawyerSlug: string; category: string }) {
  const lawyer = getLawyer(lawyerSlug) ?? lawyers[0];
  const firstAvailable = useMemo(() => consultationSlots.find((slot) => slot.status === "available") ?? consultationSlots[0], []);
  const [selectedSlotId, setSelectedSlotId] = useState(firstAvailable.id);
  const selectedSlot = consultationSlots.find((slot) => slot.id === selectedSlotId) ?? firstAvailable;
  const isVideo = mode === "video";
  const meetingCode = `meet.google.com/legalseva-${lawyer.slug.slice(0, 3)}-${selectedSlot.id}`;

  return (
    <main className="mock-page consultation-page">
      <section className="mock-card consultation-card wide-consultation-card">
        <ConsultationBrand label={isVideo ? "Google Meet consultation" : "Direct call booking"} />
        <div className="button-row top-back-row">
          <BackButton fallbackHref="/questions?role=consumer" />
        </div>

        <div className="consultation-layout">
          <section className="slot-panel">
            <p className="eyebrow">{isVideo ? "Google Meet calendar" : "Phone call calendar"}</p>
            <h1>{isVideo ? "Choose a 3-hour Meet slot" : "Choose a 3-hour call slot"}</h1>
            <p>
              Court-blocked slots are disabled after e-Courts sync. LegalSeva uses 3-hour windows so both
              consumer and lawyer have a realistic connection range.
            </p>

            <div className="slot-grid">
              {consultationSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={selectedSlot.id === slot.id ? "slot-card active" : "slot-card"}
                  disabled={slot.status !== "available"}
                  onClick={() => setSelectedSlotId(slot.id)}
                >
                  <span>{slot.day}</span>
                  <strong>{slot.date}</strong>
                  <small>{slot.start} - {slot.end}</small>
                  <em>{slot.status === "available" ? slot.label : slot.reason}</em>
                </button>
              ))}
            </div>
          </section>

          <aside className="consultation-confirm">
            <div className="payment-lawyer">
              <span className="avatar">{lawyer.initials}</span>
              <div>
                <strong>{lawyer.name}</strong>
                <span>{category} · {lawyer.languages.join(", ")}</span>
              </div>
            </div>

            {isVideo && (
              <div className="video-stage">
                <div className="video-tile primary">
                  <icons.Video size={34} />
                  <span>Google Meet room</span>
                </div>
                <div className="video-tile">
                  <span>Both parties join same link</span>
                </div>
              </div>
            )}

            <div className="time-window">
              <icons.CalendarClock size={24} />
              <div>
                <strong>{selectedSlot.date}: {selectedSlot.start} - {selectedSlot.end}</strong>
                <span>
                  {isVideo
                    ? `Google Meet link: ${meetingCode}`
                    : "LegalSeva will place a direct call to the consumer and lawyer during this window."}
                </span>
                <span>Prior 30 minutes intimation will be sent before the consultation window starts.</span>
              </div>
            </div>

            <div className="fee-breakdown">
              <div>
                <span>Consultation hold</span>
                <strong>Rs {lawyer.fixed}</strong>
              </div>
              <div>
                <span>Platform fee</span>
                <strong>Rs 50</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>Rs {lawyer.fixed + 50}</strong>
              </div>
            </div>

            <div className="reschedule-grid">
              <div>
                <strong>One-time reschedule</strong>
                <span>Customer can request another available 3-hour slot after booking.</span>
                <button className="secondary-action wide" disabled>Request reschedule</button>
              </div>
              <div>
                <strong>Support available</strong>
                <span>Booking confirmation includes a support link for slot, call or payment queries.</span>
                <Link className="secondary-action wide" href="/support">Open support</Link>
              </div>
            </div>

            <Link className="primary-action wide" href={`/payment?lawyer=${lawyer.slug}&mode=${mode}&slot=${selectedSlot.id}&category=${encodeURIComponent(category)}`}>
              Continue to payment
            </Link>
            <div className="button-row">
              <Link className="secondary-action" href="/bookings">My bookings</Link>
              <Link className="secondary-action" href="/support">Support</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ConsultationBrand({ label }: { label: string }) {
  return (
    <div className="brand-block">
      <div className="brand-mark">
        <icons.Scale size={26} />
      </div>
      <div>
        <strong>LegalSeva</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
