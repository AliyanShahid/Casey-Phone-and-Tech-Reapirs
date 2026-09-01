import { BookingForm } from "@/components/booking-form";
import type { CSSProperties } from "react";

export const metadata = { title: "Book Repair" };

const bookingOptions = [
  ["Visit Casey", "Come to us between 9:00 AM and 12:00 PM. Address will be added soon."],
  ["We come to you", "Choose a date and time for pickup, onsite help or handover."],
  ["Track every step", "After booking, use your reference to see updates from admin."]
];

export default function BookRepairPage() {
  return (
    <main className="booking-page">
      <section className="booking-hero">
        <div className="container booking-hero-grid">
          <div>
            <p className="eyebrow">Book repair</p>
            <h1>Choose how you want Casey Repairs to help.</h1>
            <p>
              Visit us during workshop hours or book a mobile repair request and
              we can come to you at the selected date and time.
            </p>
            <div className="booking-hero-actions">
              <a className="button primary" href="#booking-form">Start booking</a>
              <a className="button ghost" href="/door-to-door">Door-to-door details</a>
            </div>
          </div>
          <div className="booking-option-stack">
            {bookingOptions.map(([title, text], index) => (
              <article key={title} style={{ "--delay": `${index * 80}ms` } as CSSProperties}>
                <span>{index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="booking-body" id="booking-form">
        <div className="container booking-layout">
          <aside className="booking-info-panel">
            <p className="eyebrow">Your options</p>
            <h2>Visit us or book us to come to you.</h2>
            <div className="booking-info-list">
              <div>
                <strong>Visit Casey Repairs</strong>
                <p>Available 9:00 AM to 12:00 PM. The final address will be added here later.</p>
              </div>
              <div>
                <strong>Mobile repair request</strong>
                <p>Send your address and preferred time. Admin confirms the visit before payment or pickup.</p>
              </div>
              <div>
                <strong>After you submit</strong>
                <p>You receive a reference number. Track it online while admin confirms details.</p>
              </div>
            </div>
          </aside>
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
