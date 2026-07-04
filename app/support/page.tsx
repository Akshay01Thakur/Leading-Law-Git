import Link from "next/link";
import { RoleShell } from "../components/RoleShell";
import { icons } from "../data";

export default function SupportPage() {
  const supportItems = [
    { title: "Slot or reschedule", detail: "Change the 3-hour window or confirm reschedule status.", Icon: icons.CalendarClock },
    { title: "Google Meet", detail: "Help joining the same Meet room as the lawyer.", Icon: icons.Video },
    { title: "Direct call", detail: "Help if the call is not received during the booked window.", Icon: icons.Phone },
    { title: "Payment", detail: "Platform fee, refund mockup, or invoice query.", Icon: icons.CircleDollarSign },
  ];

  return (
    <RoleShell role="consumer" kicker="LegalSeva support" title="Support for bookings and legal intake">
      <section className="view-grid">
        <div className="content-stack">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Support desk</p>
                <h2>Get help with your consultation</h2>
              </div>
              <span className="status-badge"><icons.ShieldCheck size={16} /> Prototype support</span>
            </div>
            <div className="support-grid">
              {supportItems.map(({ title, detail, Icon }) => (
                <article className="support-card" key={title}>
                  <Icon size={24} />
                  <strong>{title}</strong>
                  <span>{detail}</span>
                  <button className="secondary-action wide" disabled>Create ticket disabled</button>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="panel">
          <p className="eyebrow">Quick links</p>
          <h2>Booking help</h2>
          <div className="support-link-stack">
            <Link className="primary-action wide" href="/bookings">View my bookings</Link>
            <Link className="secondary-action wide" href="/consumer">Start another intake</Link>
            <Link className="secondary-action wide" href="/questions?role=consumer">Read Q&A</Link>
          </div>
        </aside>
      </section>
    </RoleShell>
  );
}
