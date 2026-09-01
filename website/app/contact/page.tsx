import Link from "next/link";
import { ContactForm } from "@/components/contact-form";

export const metadata = { title: "Contact" };

const contactRoutes = [
  {
    title: "Visit Casey Repairs",
    text: "Workshop availability is 9:00 AM to 12:00 PM. Address will be added soon.",
    href: "/book-repair",
    label: "Book a visit"
  },
  {
    title: "We come to you",
    text: "Book door-to-door pickup or mobile repair at your selected date and time.",
    href: "/door-to-door",
    label: "Door-to-door"
  },
  {
    title: "Insurance quote",
    text: "Upload photos and request a final itemised repair quote PDF.",
    href: "/insurance-quote",
    label: "Start quote"
  }
];

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero-grid">
          <div>
            <p className="eyebrow">Contact Casey Repairs</p>
            <h1>Tell us what happened. We will guide the next step.</h1>
            <p>
              Whether you want to visit us, need pickup, or need an insurance quote,
              send the details and Casey Repairs will keep the repair path clear.
            </p>
            <div className="contact-hero-actions">
              <Link className="button primary" href="/book-repair">Book visit</Link>
              <Link className="button ghost" href="/door-to-door">Book pickup</Link>
            </div>
          </div>
          <div className="contact-status-card">
            <span className="live-dot" />
            <p className="eyebrow">Availability</p>
            <h2>9:00 AM - 12:00 PM</h2>
            <p>Workshop visit window. Address and phone number will be added before launch.</p>
          </div>
        </div>
      </section>

      <section className="contact-body">
        <div className="container contact-layout">
          <aside className="contact-side-panel">
            <p className="eyebrow">Choose a path</p>
            <h2>Fast ways to reach us</h2>
            <div className="contact-route-list">
              {contactRoutes.map((route) => (
                <Link className="contact-route-card" href={route.href} key={route.title}>
                  <div>
                    <strong>{route.title}</strong>
                    <p>{route.text}</p>
                  </div>
                  <span>{route.label}</span>
                </Link>
              ))}
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
