import Link from "next/link";
import { ReactNode } from "react";
import { icons, Role } from "../data";

const roleNav = {
  consumer: [
    { href: "/", label: "Home", emoji: "🏠", icon: icons.LayoutDashboard },
    { href: "/consumer", label: "Find Legal Help", emoji: "📝", icon: icons.FileCheck2 },
    { href: "/questions?role=consumer", label: "Legal Knowledge", emoji: "📚", icon: icons.BookOpenCheck },
    { href: "/bookings", label: "My Consultations", emoji: "👨‍⚖️", icon: icons.CalendarClock },
    { href: "/support", label: "Support", emoji: "💬", icon: icons.MessageSquareText },
  ],
  lawyer: [
    { href: "/lawyer", label: "Lawyer Desk", icon: icons.BriefcaseBusiness },
    { href: "/questions?role=lawyer", label: "Answer Q&A", icon: icons.MessageSquareText },
    { href: "/admin?role=lawyer", label: "Review Queue", icon: icons.ShieldCheck },
  ],
  admin: [
    { href: "/admin?role=admin", label: "Admin Console", icon: icons.ShieldCheck },
    { href: "/questions?role=admin", label: "Q&A Review", icon: icons.MessageSquareText },
  ],
};

const roleLabel = {
  consumer: "Get Legal Help in Minutes",
  lawyer: "Lawyer access",
  admin: "Admin access",
};

export function RoleShell({
  role,
  kicker,
  title,
  children,
}: {
  role: Role;
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
            <span>{roleLabel[role]}</span>
          </div>
        </Link>

        <nav className="nav-list" aria-label={`${role} navigation`}>
          {roleNav[role].map((item) => {
            const Icon = item.icon;
            return (
              <Link className="nav-link" key={item.href} href={item.href}>
                {"emoji" in item && item.emoji ? <span className="nav-emoji">{item.emoji}</span> : <Icon size={19} />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="trust-panel">
          <icons.ShieldCheck size={20} />
          <p>Role boundaries are deliberate: consumers get intake and Q&A; lawyers get workbench, answer queue and review controls; admins get governance.</p>
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
            <Link className="primary-action" href="/">Switch role</Link>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
