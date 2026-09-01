import { TrackRepair } from "@/components/track-repair";
import { SessionCard } from "@/components/session-card";

export const metadata = { title: "Customer Dashboard" };

const customerItems = ["Profile", "Bookings", "Repair history", "Payments", "Invoices", "Insurance quotes", "Notifications", "Upload images"];

export default function CustomerDashboardPage() {
  return (
    <main>
      <section className="page-hero"><div className="container"><p className="eyebrow">Customer portal</p><h1>Your repairs and quotes.</h1><p>Protected dashboard foundation for Phase 1.</p></div></section>
      <section className="section">
        <div className="container dashboard-grid">
          <nav className="side-nav">{customerItems.map((item) => <a key={item}>{item}</a>)}</nav>
          <div className="admin-stack">
            <SessionCard />
            <TrackRepair />
          </div>
        </div>
      </section>
    </main>
  );
}
