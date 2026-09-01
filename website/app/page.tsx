import Link from "next/link";
import { HomeRepairFinder } from "@/components/home-repair-finder";

export default function HomePage() {
  const trustSignals = [
    { label: "Clear prices", detail: "Before booking" },
    { label: "Mail-in repair", detail: "Australia wide" },
    { label: "Local pickup", detail: "Casey area" },
    { label: "Track updates", detail: "After booking" }
  ];

  const servicePaths = [
    { href: "/repair", title: "Book a repair", text: "Choose device, issue and service option." },
    { href: "/door-to-door", title: "We come to you", text: "Pickup or onsite support for local customers." },
    { href: "/insurance-quote", title: "Insurance quote", text: "Upload photos and receive a formal quote." }
  ];

  return (
    <main className="home-page repair-home-page">
      <section className="clean-home-hero">
        <div className="container clean-home-grid">
          <div className="clean-home-copy">
            <p className="eyebrow">Casey phone & tech repairs</p>
            <h1>Fast phone and tech repairs, made simple.</h1>
            <p>
              Pick your device, see the repair cost, then choose mail-in,
              pickup or visit. Clean booking, clear updates and no confusing
              back-and-forth.
            </p>
            <div className="clean-home-actions">
              <a className="button primary" href="#start-repair">Start repair</a>
              <Link className="button ghost" href="/track-repair">Track repair</Link>
            </div>
            <div className="clean-home-trust" aria-label="Repair benefits">
              {trustSignals.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.detail}</strong>
                </div>
              ))}
            </div>
          </div>
          <HomeRepairFinder mode="hero" />
        </div>
      </section>
      <section className="home-service-strip" aria-label="Repair service choices">
        <div className="container home-service-paths">
          {servicePaths.map((item) => (
            <Link className="home-service-path" href={item.href} key={item.href}>
              <span>{item.title}</span>
              <strong>{item.text}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
