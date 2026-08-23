import Link from "next/link";
import { RoleShell } from "../components/RoleShell";
import { icons } from "../data";

export default function SupportPage() {
  const supportItems = [
    { title: "Callback query", detail: "Ask about your appointment status if you haven't received a call yet.", Icon: icons.Phone },
    { title: "WhatsApp handoff", detail: "Open WhatsApp with your appointment details prefilled for our advocate team.", Icon: icons.MessageSquareText },
    { title: "General help", detail: "Any other question about the knowledge library or how the flow works.", Icon: icons.MessageSquareText },
  ];

  return (
    <RoleShell kicker="Leading Law support" title="Support for legal intake">
      <section className="view-grid">
        <div className="content-stack">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Support desk</p>
                <h2>Get help with your consultation</h2>
              </div>
              <span className="status-badge"><icons.ShieldCheck size={16} /> Minimal live flow</span>
            </div>
            <div className="support-grid">
              {supportItems.map(({ title, detail, Icon }) => (
                <article className="support-card" key={title}>
                  <Icon size={24} />
                  <strong>{title}</strong>
                  <span>{detail}</span>
                  <Link className="secondary-action wide" href="/consumer">Return to flow</Link>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="panel">
          <p className="eyebrow">Quick links</p>
          <h2>Need help now?</h2>
          <div className="support-link-stack">
            <Link className="secondary-action wide" href="/consumer">Start another intake</Link>
            <Link className="secondary-action wide" href="/questions">Read Q&A</Link>
          </div>
        </aside>
      </section>
    </RoleShell>
  );
}
