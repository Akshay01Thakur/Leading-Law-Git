"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { icons } from "../data";

export function AdminConsole() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") === "lawyer" ? "lawyer" : "admin";

  return (
    <div className="view-grid">
      <section className="panel wide-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{role === "lawyer" ? "Lawyer-access review" : "Admin governance"}</p>
            <h2>{role === "lawyer" ? "Quality and safety queue" : "Marketplace control room"}</h2>
          </div>
          <span className="status-badge"><icons.ShieldCheck size={16} /> Available to admins and lawyers</span>
        </div>
        <div className="admin-grid">
          {[
            ["Advocate verification", "18 pending", "Check enrollment, identity, court declarations"],
            ["AI answer audit", "7 flagged", "Citation mismatch, jurisdiction ambiguity, urgency escalation"],
            ["Content moderation", "24 pending", "Remove personal data and promotional claims"],
            ["Payment reconciliation", "12 items", "Wallet minutes, fixed slots, refunds"],
          ].map(([title, count, detail]) => (
            <article className="admin-card" key={title}>
              <span>{count}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
              <Link className="secondary-action" href={`/mock?feature=${encodeURIComponent(title.toLowerCase().replaceAll(" ", "-"))}`}>Open</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Role boundary</p>
            <h2>Access policy</h2>
          </div>
        </div>
        <p>Consumers never see this console. Lawyers can access quality and safety review. Admins additionally manage marketplace, verification and policy settings.</p>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Neutral ranking</p>
            <h2>No paid preference</h2>
          </div>
        </div>
        <p>Sorting uses response rate, portal activity, years of experience and user feedback while avoiding “best,” “top,” guarantees and outcome marketing.</p>
      </section>
    </div>
  );
}
