import { serviceCards } from "@/lib/site-data";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <main>
      <section className="services-hero">
        <div className="container services-hero-grid">
          <div>
            <p className="eyebrow">Repair services</p>
            <h1>Device repair, refurbished tech and IT support under one local roof.</h1>
            <p>
              Built for everyday fixes, complex diagnostics, replacement-device options,
              and practical tech support for homes and small businesses across Casey.
            </p>
          </div>
          <div className="service-orbit" aria-hidden="true">
            <span className="orbit-ring one" />
            <span className="orbit-ring two" />
            <span className="orbit-core">⚡</span>
            <span className="orbit-chip phone">Phone</span>
            <span className="orbit-chip laptop">Laptop</span>
            <span className="orbit-chip it">IT</span>
          </div>
        </div>
      </section>
      <section className="services-section">
        <div className="container services-grid">
          {serviceCards.map((service, index) => (
            <article className="service-card" key={service.title} style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
              <div className="service-number">{String(index + 1).padStart(2, "0")}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="service-card-glow" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
