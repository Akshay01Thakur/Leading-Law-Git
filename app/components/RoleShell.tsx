import Link from "next/link";
import { ReactNode } from "react";
import { icons } from "../data";

const consumerNav = [
  { href: "/", label: "Home", emoji: "🏠", icon: icons.LayoutDashboard },
  { href: "/questions", label: "Legal Knowledge", emoji: "📚", icon: icons.BookOpenCheck },
];

export function RoleShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand-block brand-link" href="/">
          <div className="brand-mark">
            <icons.Scale size={25} strokeWidth={2.2} />
          </div>
          <div>
            <strong>Leading Law</strong>
            <span>Get Legal Help in Minutes</span>
          </div>
        </Link>

        <nav className="nav-list" aria-label="Main navigation">
          {consumerNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link className="nav-link" key={item.href} href={item.href}>
                {item.emoji ? <span className="nav-emoji">{item.emoji}</span> : <Icon size={19} />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="trust-panel">
          <icons.ShieldCheck size={20} />
          <p>Leading Law connects you with a verified advocate for practical, first consultation guidance.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{kicker}</p>
            <h1>{title}</h1>
          </div>
          <div className="top-actions">
            <span className="pill"><icons.Globe2 size={15} /> India</span>
            <span className="pill"><icons.Languages size={15} /> 11 languages</span>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
