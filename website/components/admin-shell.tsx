import { CaseyLogo } from "@/components/casey-logo";

const adminLinks = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/queries", label: "Queries" },
  { href: "/admin/pricing", label: "Pricing" }
];

export function AdminShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <CaseyLogo compact admin />
        <nav className="admin-side-links">
          {adminLinks.map((link) => (
            <a href={link.href} key={link.href}>{link.label}</a>
          ))}
        </nav>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          <a className="button ghost" href="/">View site</a>
        </header>
        <div className="admin-content">{children}</div>
      </section>
    </main>
  );
}
