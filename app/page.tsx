import Link from "next/link";
import { icons } from "./data";

export default function Home() {
  return (
    <main className="gateway">
      <section className="gateway-hero">
        <div className="brand-block">
          <div className="brand-mark">
            <icons.Scale size={28} />
          </div>
          <div>
            <strong>Leading Law</strong>
            <span>Trust-first legal access for India</span>
          </div>
        </div>
        <div className="gateway-copy">
          <p className="eyebrow">Role-based production funnel</p>
          <h1>Review common legal questions first. Book a certified advocate only when you choose escalation.</h1>
          <p>
            Leading Law separates consumer, lawyer and admin experiences so every workflow has the right permissions,
            language, compliance posture and product intent.
          </p>
        </div>
      </section>

      <section className="role-grid">
        <Link className="role-card" href="/consumer">
          <icons.LayoutDashboard size={26} />
          <h2>Consumer</h2>
          <p>Start with reviewed answers, source links, legal-aid pre-check, then one Leading Law certified lawyer.</p>
          <span>Open consumer funnel</span>
        </Link>
        <Link className="role-card" href="/lawyer">
          <icons.BriefcaseBusiness size={26} />
          <h2>Lawyer</h2>
          <p>Manage consultations, answer public questions, build profile reputation through helpful upvoted answers.</p>
          <span>Open lawyer desk</span>
        </Link>
        <Link className="role-card" href="/admin?role=admin">
          <icons.ShieldCheck size={26} />
          <h2>Admin</h2>
          <p>Review advocates, Q&A content, payments, audit trails and compliance controls.</p>
          <span>Open admin console</span>
        </Link>
      </section>

      <section className="gateway-strip">
        <div>
          <strong>Shared Q&A</strong>
          <span>Consumers read and upvote. Lawyers answer. Admins moderate. Every answer links back to the lawyer profile.</span>
        </div>
        <Link className="secondary-action" href="/questions?role=consumer">View Q&A</Link>
      </section>
    </main>
  );
}
