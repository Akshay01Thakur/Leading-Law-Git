"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleShell } from "../components/RoleShell";
import { consultationSlots, icons } from "../data";

type SavedBooking = {
  id: string;
  lawyer: string;
  lawyerSlug: string;
  mode: string;
  category: string;
  date: string;
  start: string;
  end: string;
  amount: number;
  platformFee: number;
  meetingCode: string;
  status: string;
  reschedulesLeft: number;
};

export default function BookingsPage() {
  const [booking, setBooking] = useState<SavedBooking | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const availableSlots = consultationSlots.filter((slot) => slot.status === "available");

  useEffect(() => {
    const stored = localStorage.getItem("legalseva:lastBooking");
    if (!stored) return;

    try {
      setBooking(JSON.parse(stored) as SavedBooking);
    } catch {
      localStorage.removeItem("legalseva:lastBooking");
    }
  }, []);

  function reschedule(slotId: string) {
    if (!booking || booking.reschedulesLeft < 1) return;
    const slot = availableSlots.find((item) => item.id === slotId);
    if (!slot) return;

    const updated = {
      ...booking,
      date: slot.date,
      start: slot.start,
      end: slot.end,
      reschedulesLeft: 0,
    };
    localStorage.setItem("legalseva:lastBooking", JSON.stringify(updated));
    setBooking(updated);
    setShowReschedule(false);
  }

  return (
    <RoleShell role="consumer" kicker="Consumer bookings" title="My bookings">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Booked consultations</p>
            <h2>Your LegalSeva consultation window</h2>
          </div>
          <Link className="secondary-action" href="/support">Support</Link>
        </div>

        {booking ? (
          <div className="booking-detail-card">
            <div className="booking-detail-head">
              <span className="avatar">{booking.lawyer.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
              <div>
                <strong>{booking.lawyer}</strong>
                <span>{booking.category} · Booking {booking.id}</span>
              </div>
              <em>{booking.status}</em>
            </div>

            <div className="booking-info-grid">
              <div>
                <icons.CalendarClock size={23} />
                <strong>{booking.date}</strong>
                <span>{booking.start} - {booking.end}</span>
              </div>
              <div>
                {booking.mode === "video" ? <icons.Video size={23} /> : <icons.Phone size={23} />}
                <strong>{booking.mode === "video" ? "Google Meet" : "Direct call"}</strong>
                <span>
                  {booking.mode === "video"
                    ? booking.meetingCode
                    : "LegalSeva will call both parties in the selected window."}
                </span>
              </div>
              <div>
                <icons.CircleDollarSign size={23} />
                <strong>Rs {booking.amount}</strong>
                <span>Includes Rs {booking.platformFee} platform fee</span>
              </div>
            </div>

            <div className="booking-action-grid">
              {booking.mode === "video" ? (
                <Link className="primary-action" href="/mock?feature=google-meet-room">Join Google Meet</Link>
              ) : (
                <button className="primary-action" disabled>Direct call scheduled</button>
              )}
              <button className="secondary-action" disabled={booking.reschedulesLeft < 1} onClick={() => setShowReschedule((value) => !value)}>
                {booking.reschedulesLeft > 0 ? "Reschedule once" : "Reschedule used"}
              </button>
              <Link className="secondary-action" href="/support">Raise support query</Link>
            </div>

            {showReschedule && (
              <div className="reschedule-picker">
                <h3>Choose another 3-hour slot</h3>
                <div className="slot-grid">
                  {availableSlots.map((slot) => (
                    <button key={slot.id} className="slot-card" onClick={() => reschedule(slot.id)}>
                      <span>{slot.day}</span>
                      <strong>{slot.date}</strong>
                      <small>{slot.start} - {slot.end}</small>
                      <em>{slot.label}</em>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <icons.CalendarClock size={42} />
            <p>No consultation is booked yet.</p>
            <Link className="primary-action" href="/consumer">Start legal intake</Link>
          </div>
        )}
      </section>
    </RoleShell>
  );
}
