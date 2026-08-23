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
          <p className="eyebrow">Consumer legal help</p>
          <h1>Where Legal Needs Meet Legal Excellence.</h1>
          <p>
            Start with reviewed legal answers, share your name and number, and our verified legal expert team will call you back.
          </p>
          <Link className="primary-action" href="/consumer">Start legal help</Link>
        </div>
      </section>

      <section className="role-grid single-role-grid">
        <Link className="role-card" href="/consumer">
          <icons.LayoutDashboard size={26} />
          <h2>Find legal answers</h2>
          <p>No account required. No payment upfront. Share your details and we call you back within 3 hours.</p>
          <span>Open consumer flow</span>
        </Link>
      </section>

      <section className="gateway-strip">
        <div>
          <strong>Legal knowledge library</strong>
          <span>Reviewed answers across every category, written by our verified advocate team.</span>
        </div>
        <Link className="secondary-action" href="/questions">View Q&A</Link>
      </section>
    </main>
  );
}
