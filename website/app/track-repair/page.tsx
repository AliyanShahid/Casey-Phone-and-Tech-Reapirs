import { TrackRepair } from "@/components/track-repair";

export const metadata = { title: "Track Repair" };

export default function TrackRepairPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Repair tracking</p>
          <h1>Track your repair status.</h1>
          <p>Look up bookings and quote requests created in this local MVP.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <TrackRepair />
        </div>
      </section>
    </main>
  );
}
