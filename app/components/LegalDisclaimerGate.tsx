"use client";

import { useEffect, useState } from "react";
import { icons } from "../data";

const STORAGE_KEY = "leading-law:disclaimer-accepted";

export function LegalDisclaimerGate() {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem(STORAGE_KEY) === "true";
    if (!accepted) setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [visible]);

  function proceed() {
    if (!checked) return;
    window.localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="disclaimer-overlay" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
      <div className="disclaimer-card">
        <div className="brand-block">
          <div className="brand-mark">
            <icons.Scale size={24} />
          </div>
          <div>
            <strong>Leading Law</strong>
            <span>Disclaimer</span>
          </div>
        </div>
        <h2 id="disclaimer-title">Before you continue</h2>
        <p>
          The Bar Council of India does not permit advocates or law firms to advertise their services or solicit
          work in any form or manner. By accessing this website, you acknowledge and confirm the following:
        </p>
        <ul className="clean-list">
          <li>
            You are seeking information about Leading Law and its associated advocates entirely of your own
            accord, and there has been no advertisement, solicitation, invitation or inducement of any kind by
            Leading Law or its advocates to solicit work through this website.
          </li>
          <li>
            All content on this website, including the knowledge library, is provided for general informational
            purposes only and must not be construed as legal advice or relied upon as a substitute for
            consultation with a qualified advocate.
          </li>
          <li>
            Leading Law and its associated advocates shall not be liable for any consequence arising from any
            action taken by relying on material or information provided on this website.
          </li>
          <li>
            No advocate-client relationship is created merely by browsing this website or submitting a query
            through it.
          </li>
        </ul>
        <label className="disclaimer-checkbox">
          <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
          I have read and accept the above.
        </label>
        <button className="primary-action wide" disabled={!checked} onClick={proceed} type="button">
          Proceed to Website
        </button>
      </div>
    </div>
  );
}
