import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata = { title: "IT Services" };

const supportItems = [
  ["Computer setup", "New laptop or desktop setup, account sign-in, updates, printer setup and everyday software."],
  ["Email and cloud help", "Gmail, Outlook, OneDrive, Google Drive, iCloud and file backup support for home or business."],
  ["Slow device cleanup", "Performance checks, storage cleanup, startup issues, virus checks and practical advice."],
  ["Small business support", "Simple tech help for local shops, tradies and teams that need devices working quickly."],
  ["Wi-Fi and network help", "Basic troubleshooting for connection issues, routers, printers and shared devices."],
  ["Data transfer", "Move files, photos and documents from old devices to new phones, laptops or storage."]
];

const plans = [
  ["Quick help", "For one issue", "From $59"],
  ["Setup visit", "New device or account setup", "From $99"],
  ["Business support", "Multiple devices or recurring help", "Quote first"]
];

export default function ItServicesPage() {
  return (
    <main className="specialty-page">
      <section className="specialty-hero it-hero">
        <div className="container specialty-hero-grid">
          <div>
            <p className="eyebrow">IT services</p>
            <h1>Practical tech support for homes and small businesses.</h1>
            <p>
              Get help with laptops, email, cloud files, printers, Wi-Fi, software,
              backups and everyday tech problems without confusing jargon.
            </p>
            <div className="specialty-actions">
              <Link className="button primary" href="/contact">Request IT help</Link>
              <Link className="button ghost" href="/door-to-door">Book mobile visit</Link>
            </div>
          </div>
          <div className="specialty-visual">
            <span className="visual-pulse" />
            <strong>IT</strong>
            <p>Setup, support and troubleshooting</p>
          </div>
        </div>
      </section>

      <section className="specialty-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">How we help</p>
              <h2>Clear support for common tech problems.</h2>
            </div>
            <p>Choose the support type and send the details. Admin can confirm visit timing or quote before work starts.</p>
          </div>
          <div className="specialty-grid">
            {supportItems.map(([title, text], index) => (
              <article className="specialty-card" key={title} style={{ "--delay": `${index * 55}ms` } as CSSProperties}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="specialty-band">
        <div className="container specialty-band-grid">
          <div>
            <p className="eyebrow">Simple pricing</p>
            <h2>Start small, confirm before work begins.</h2>
            <p>Every job is reviewed first. If the job needs more time or parts, Casey Repairs confirms the next step before continuing.</p>
          </div>
          <div className="specialty-plan-grid">
            {plans.map(([title, text, price]) => (
              <article key={title}>
                <span>{title}</span>
                <strong>{price}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
