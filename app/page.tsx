import Link from "next/link";
import { icons } from "./data";
import { legalCategoryGuides, questionLibraryStats } from "./legalKnowledge";

const categoryIcons: Record<string, keyof typeof icons> = {
  "Family / Divorce": "ShieldCheck",
  "Property / RERA": "Building2",
  "Criminal / Bail": "Gavel",
  "Cyber Fraud": "LockKeyhole",
  "Consumer Complaint": "CheckCircle2",
  "Cheque Bounce": "IndianRupee",
  "Employment / Labour": "BriefcaseBusiness",
  "Startup / Compliance": "FileCheck2",
  "NRI Property": "Globe2",
  "Recovery Case": "CalendarClock",
  Arbitration: "Scale",
};

const howItWorks = [
  ["01", "Ask your legal query", "Describe your issue in your own words, no legal jargon needed."],
  ["02", "See reviewed answers instantly", "Get a matched answer from our knowledge library in seconds, with source links."],
  ["03", "Meet our verified experts", "Our trusted advocates, with 20+ years of experience, review your query and domain."],
  ["04", "Pay and get confirmed", "Pay the consultation fee by UPI. Once verified, your appointment is confirmed and we call within 3 hours."],
];

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-header">
        <Link className="brand-block brand-link" href="/">
          <div className="brand-mark">
            <icons.Scale size={26} />
          </div>
          <div>
            <strong>Leading Law</strong>
            <span>Trust-first legal access for India</span>
          </div>
        </Link>
        <nav className="landing-nav">
          <a href="#practice-areas">Practice Areas</a>
          <a href="#how-it-works">How It Works</a>
          <Link href="/questions">Legal Knowledge</Link>
        </nav>
        <Link className="primary-action" href="/consumer">Get Legal Help</Link>
      </header>

      <section className="landing-hero">
        <p className="eyebrow">Consumer legal help, India</p>
        <h1>Where Legal Needs Meet Legal Excellence.</h1>
        <p>
          Get clear, reviewed legal answers in seconds, then book a consultation with our verified advocate
          team. No account needed.
        </p>

        <form className="hero-query-form" action="/consumer" method="GET">
          <icons.BookOpenCheck size={20} />
          <input
            type="text"
            name="issue"
            placeholder="Ask your legal query, e.g. My builder is delaying possession of my flat..."
            aria-label="Ask your legal query"
          />
          <button className="primary-action" type="submit">Ask Your Legal Query</button>
        </form>

        <div className="trust-badge-grid landing-trust-badges">
          {["Verified Advocates", "Secure & Confidential", "Trusted by Thousands", "No Hidden Charges"].map((item) => (
            <span key={item}><icons.CheckCircle2 size={16} /> {item}</span>
          ))}
        </div>
      </section>

      <section className="landing-stats">
        <div>
          <strong>10,000+</strong>
          <span>Consumers helped</span>
        </div>
        <div>
          <strong>4.9</strong>
          <span>Average rating</span>
        </div>
        <div>
          <strong>350+</strong>
          <span>Consultations handled</span>
        </div>
        <div>
          <strong>20+</strong>
          <span>Years of combined experience</span>
        </div>
      </section>

      <section id="practice-areas" className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">What we cover</p>
          <h2>Practice Areas</h2>
          <p>Reviewed legal guidance across the issues Indian consumers face most.</p>
        </div>
        <div className="practice-area-grid">
          {legalCategoryGuides.map((guide) => {
            const Icon = icons[categoryIcons[guide.name] ?? "BookOpenCheck"];
            return (
              <Link key={guide.name} className="practice-area-card" href={`/consumer?category=${encodeURIComponent(guide.name)}`}>
                <Icon size={24} />
                <h3>{guide.name}</h3>
                <p>{guide.explanation}</p>
                <span>Get help in {guide.name} →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <div className="section-heading">
          <p className="eyebrow">Simple, fast, transparent</p>
          <h2>How Leading Law Works</h2>
        </div>
        <div className="landing-steps">
          {howItWorks.map(([number, title, detail]) => (
            <div className="landing-step" key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gateway-strip landing-strip">
        <div>
          <strong>Legal knowledge library</strong>
          <span>{questionLibraryStats.total}+ reviewed answers across {questionLibraryStats.categories.length} legal categories.</span>
        </div>
        <Link className="secondary-action" href="/questions">Browse Q&A</Link>
      </section>

      <footer className="landing-footer">
        <div className="brand-block">
          <div className="brand-mark">
            <icons.Scale size={22} />
          </div>
          <div>
            <strong>Leading Law</strong>
            <span>Trust-first legal access for India</span>
          </div>
        </div>
        <p className="landing-disclaimer-note">
          Leading Law is a legal information and consultation-booking platform. Nothing on this website
          constitutes legal advice, and nothing here should be construed as advertisement or solicitation by
          Leading Law or its associated advocates under the Bar Council of India Rules.
        </p>
        <div className="footer-links">
          <Link href="/questions">Legal Knowledge</Link>
        </div>
        <span className="footer-copyright">© 2026 Leading Law. All rights reserved.</span>
      </footer>
    </main>
  );
}
