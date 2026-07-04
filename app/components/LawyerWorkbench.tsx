import Link from "next/link";
import { courtBlocks, icons, lawyers } from "../data";

export function LawyerWorkbench() {
  const lawyer = lawyers[2];

  return (
    <div className="view-grid">
      <section className="panel wide-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Lawyer-only workspace</p>
            <h2>Today&apos;s consultations</h2>
          </div>
          <span className="status-badge"><icons.Activity size={16} /> {lawyer.activity}% portal activity</span>
        </div>
        <div className="queue-list">
          {[
            ["Cyber fraud account freeze", "Hindi", "High", "Call in 8 min"],
            ["Builder delay possession", "English", "Medium", "Video at 4:30 PM"],
            ["Mutual divorce documents", "Punjabi", "Low", "Chat reply due"],
          ].map(([matter, language, risk, action]) => (
            <div className="queue-row" key={matter}>
              <div>
                <strong>{matter}</strong>
                <span>{language} · {risk} risk · question brief attached</span>
              </div>
              <Link className="secondary-action" href={`/mock?feature=consultation-action&matter=${encodeURIComponent(matter)}`}>{action}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Answer reputation</p>
            <h2>Profile-linked Q&A</h2>
          </div>
        </div>
        <p>Helpful public answers collect upvotes on the answer and roll into the lawyer profile. They do not become outcome claims or advertisements.</p>
        <div className="button-row">
          <Link className="primary-action" href="/questions?role=lawyer">Answer questions</Link>
          <Link className="secondary-action" href={`/lawyer/${lawyer.slug}`}>View profile</Link>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Shared with admin</p>
            <h2>Quality review</h2>
          </div>
        </div>
        <ul className="clean-list strong-list">
          <li>Flag incorrect question category</li>
          <li>Request source-link refresh</li>
          <li>Report PII or unsafe public question</li>
          <li>Review profile verification status</li>
        </ul>
        <Link className="secondary-action wide" href="/admin?role=lawyer">Open review queue</Link>
      </section>

      <section className="panel wide-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Calendar automation</p>
            <h2>e-Courts sync and automatic court blocks</h2>
          </div>
          <Link className="primary-action" href="/mock?feature=e-courts-calendar-integration">Connect e-Courts</Link>
        </div>
        <div className="calendar-sync-layout">
          <div className="sync-explainer">
            <icons.CalendarClock size={30} />
            <p>
              Lawyers can connect an e-Courts portal feed so listed hearings and existing cases block consultation
              slots automatically. The consumer only sees available call/video windows.
            </p>
          </div>
          <div className="court-block-list">
            {courtBlocks.map((block) => (
              <div className="court-block" key={block.caseNo}>
                <strong>{block.caseNo}</strong>
                <span>{block.matter}</span>
                <small>{block.court} · {block.date} · {block.time}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
