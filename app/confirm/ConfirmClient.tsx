"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { icons } from "../data";
import { toWhatsAppNumber } from "../lib/phone";

const STORAGE_KEY = "leading-law:advocate-passcode";

type Booking = {
  name: string;
  phone: string;
  category: string;
  city: string;
  language: string;
  urgency: string;
  issue: string;
  fee: string;
};

type GateState = "checking" | "locked" | "unlocked" | "unavailable";

async function verifyPasscode(passcode: string) {
  const response = await fetch("/api/advocate-auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode }),
  });
  if (response.status === 503) return "unavailable" as const;
  const data = (await response.json()) as { ok?: boolean };
  return data.ok ? ("ok" as const) : ("bad" as const);
}

export function ConfirmClient({ booking }: { booking: Booking }) {
  const [gate, setGate] = useState<GateState>("checking");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Always re-verify against the server on load. The stored value is the passcode
  // itself, never a "already verified" flag — so setting localStorage by hand
  // gains nothing without knowing the real passcode.
  const checkStored = useCallback(async () => {
    let stored = "";
    try {
      stored = window.localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      stored = "";
    }
    if (!stored) {
      setGate("locked");
      return;
    }
    try {
      const result = await verifyPasscode(stored);
      if (result === "ok") setGate("unlocked");
      else if (result === "unavailable") setGate("unavailable");
      else {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setGate("locked");
      }
    } catch {
      setGate("locked");
    }
  }, []);

  useEffect(() => {
    void checkStored();
  }, [checkStored]);

  async function handleUnlock(event: FormEvent) {
    event.preventDefault();
    if (!passcode.trim()) {
      setError("Enter the advocate passcode.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await verifyPasscode(passcode.trim());
      if (result === "ok") {
        try {
          window.localStorage.setItem(STORAGE_KEY, passcode.trim());
        } catch {
          /* ignore */
        }
        setGate("unlocked");
      } else if (result === "unavailable") {
        setGate("unavailable");
      } else {
        setError("Incorrect passcode.");
      }
    } catch {
      setError("Could not verify right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (gate === "checking") {
    return (
      <section className="mock-card consultation-card">
        <ConfirmBrand />
        <p>Checking access…</p>
      </section>
    );
  }

  if (gate === "unavailable") {
    return (
      <section className="mock-card consultation-card">
        <ConfirmBrand />
        <h1>Confirmation unavailable</h1>
        <p className="field-note error">
          The advocate passcode has not been configured for this site yet, so appointments cannot be confirmed
          from this page.
        </p>
      </section>
    );
  }

  if (gate === "locked") {
    return (
      <section className="mock-card consultation-card">
        <ConfirmBrand />
        <p className="eyebrow">Advocate access only</p>
        <h1>Enter Advocate Passcode</h1>
        <p>This confirmation page is restricted to Leading Law advocates.</p>
        <form className="consumer-detail-form" onSubmit={handleUnlock}>
          <label>
            Advocate passcode
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              placeholder="Enter passcode"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="field-note error">{error}</p>}
          <button className="primary-action wide" type="submit" disabled={submitting}>
            {submitting ? "Checking…" : "Unlock"}
          </button>
        </form>
      </section>
    );
  }

  const { name, phone, category, city, language, urgency, issue, fee } = booking;
  const hasCustomerPhone = phone.trim().length > 0;
  const confirmationMessage = [
    `Hi ${name || "there"}, your Leading Law consultation${category ? ` for ${category}` : ""} is confirmed.`,
    fee ? `We have received your payment of ₹${fee}. Your appointment is booked and paid.` : "Your appointment is booked.",
    "Our advocate will call you shortly on this number to discuss your query.",
    "Thank you for choosing Leading Law.",
  ].join(" ");
  const confirmUrl = `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(confirmationMessage)}`;

  return (
    <section className="mock-card consultation-card">
      <ConfirmBrand />

      <p className="eyebrow">Appointment details</p>
      <h1>Confirm This Appointment</h1>
      <p>Review the details below, then tap Confirm to send a WhatsApp confirmation to the customer.</p>

      {fee && (
        <div className="aid-box">
          <icons.IndianRupee size={28} />
          <p>
            <strong>Check payment first: ₹{fee}</strong> — the customer marked this as paid by UPI. Confirm
            the amount has actually arrived in your UPI account before tapping Confirm, because the message
            tells them their appointment is booked and paid.
          </p>
        </div>
      )}

      <div className="mock-grid">
        <div>
          <strong>Name</strong>
          <span>{name || "Not provided"}</span>
        </div>
        <div>
          <strong>Phone</strong>
          <span>{phone || "Not provided"}</span>
        </div>
        <div>
          <strong>Category</strong>
          <span>{category || "Not specified"}</span>
        </div>
        <div>
          <strong>City</strong>
          <span>{city || "Not specified"}</span>
        </div>
        <div>
          <strong>Language</strong>
          <span>{language || "Not specified"}</span>
        </div>
        <div>
          <strong>Urgency</strong>
          <span>{urgency || "Not specified"}</span>
        </div>
      </div>

      {issue && (
        <div className="aid-box">
          <icons.BookOpenCheck size={28} />
          <p>
            <strong>Query: </strong>
            {issue}
          </p>
        </div>
      )}

      {hasCustomerPhone ? (
        <a className="primary-action wide" href={confirmUrl} target="_blank" rel="noreferrer">
          Confirm Appointment on WhatsApp
        </a>
      ) : (
        <p className="field-note error">
          No customer phone number was included in this link, so a confirmation message cannot be sent.
        </p>
      )}
    </section>
  );
}

function ConfirmBrand() {
  return (
    <div className="brand-block">
      <div className="brand-mark">
        <icons.Scale size={26} />
      </div>
      <div>
        <strong>Leading Law</strong>
        <span>Advocate confirmation</span>
      </div>
    </div>
  );
}
