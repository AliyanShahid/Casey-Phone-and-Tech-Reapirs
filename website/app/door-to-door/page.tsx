import { DoorToDoorForm } from "@/components/door-to-door-form";
import type { CSSProperties } from "react";

export const metadata = {
  title: "Door-to-Door Mobile Repairs",
  description: "Book mobile phone repair pickup, onsite help, and return service with Casey Phone & Tech Repairs."
};

const steps = [
  ["01", "Send request", "Tell us the device, issue, address and preferred time."],
  ["02", "Admin confirms", "We review the repair, area, timing and required parts."],
  ["03", "Pickup or onsite", "A mobile repair visit or pickup is arranged after approval."],
  ["04", "Track handover", "Your booking reference can be tracked from request to completion."]
];

const serviceCards = [
  ["Pickup repair", "We collect the device, repair it through the workshop process, then arrange handover."],
  ["Onsite mobile help", "For suitable jobs, a technician can inspect or complete simple repairs at your location."],
  ["Business visits", "Useful for teams, shops and offices with multiple phones or laptops needing attention."],
  ["Secure approval", "No repair starts until admin confirms the scope, estimate and next step with the customer."]
];

export default function DoorToDoorPage() {
  return (
    <main className="door-page">
      <section className="door-hero">
        <div className="container door-hero-grid">
          <div>
            <p className="eyebrow">Door-to-door repairs</p>
            <h1>Mobile repair service that comes to the customer.</h1>
            <p>
              Book phone, tablet, laptop and tech repair pickup or onsite support.
              Every request is sent into the admin booking panel for approval,
              pricing, notes and tracking.
            </p>
            <div className="door-hero-actions">
              <a className="button primary" href="#door-request">Book mobile service</a>
              <a className="button ghost light" href="/track-repair">Track request</a>
            </div>
          </div>
          <div className="door-visual" aria-hidden="true">
            <span className="route-pin start">CASEY</span>
            <span className="route-line" />
            <span className="route-pin end">HOME</span>
            <div className="repair-device">
              <span />
              <strong>ETA</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="door-flow">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Built for a real mobile repair workflow</h2>
            </div>
            <p className="muted">Clear request, admin approval, confirmed visit, trackable handover.</p>
          </div>
          <div className="door-step-grid">
            {steps.map(([number, title, copy], index) => (
              <article className="door-step" key={title} style={{ "--delay": `${index * 80}ms` } as CSSProperties}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="door-panel-section" id="door-request">
        <div className="container door-panel-grid">
          <aside className="door-service-panel">
            <p className="eyebrow">Service options</p>
            <h2>Pickup, onsite or return</h2>
            <div className="door-service-list">
              {serviceCards.map(([title, copy], index) => (
                <article key={title} style={{ "--delay": `${index * 70}ms` } as CSSProperties}>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </aside>
          <DoorToDoorForm />
        </div>
      </section>
    </main>
  );
}
