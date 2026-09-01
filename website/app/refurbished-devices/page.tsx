import Link from "next/link";
import type { CSSProperties } from "react";
import { refurbishedDevices } from "@/lib/refurbished-stock";
import { RefurbishedShop } from "@/components/refurbished-shop";

export const metadata = { title: "Refurbished Devices" };

const deviceTypes = [
  ["Refurbished phones", "Checked phones for customers who need a reliable replacement without buying brand new."],
  ["Refurbished laptops", "Practical laptops for study, work and everyday use, checked before handover."],
  ["Trade-in guidance", "If repair cost is too high, Casey Repairs can help compare repair vs replacement."],
  ["Data transfer help", "Move contacts, photos, files and accounts from the old device to the replacement."]
];

const checks = [
  "Battery and charging check",
  "Screen and body condition check",
  "Camera, speaker and microphone check",
  "Software reset and setup support",
  "Warranty terms confirmed before purchase"
];

export default function RefurbishedDevicesPage() {
  return (
    <main className="specialty-page">
      <section className="specialty-hero refurb-hero">
        <div className="container specialty-hero-grid">
          <div>
            <p className="eyebrow">Refurbished devices</p>
            <h1>Checked phones and laptops when repair is not the best option.</h1>
            <p>
              Customers can ask about refurbished mobiles and laptops, compare repair
              cost against replacement, and get help setting up the next device.
            </p>
            <div className="specialty-actions">
              <Link className="button primary" href="/contact">Ask what is available</Link>
              <Link className="button ghost" href="/pricing">Compare repair cost</Link>
            </div>
          </div>
          <div className="specialty-visual refurb-visual">
            <span className="visual-pulse" />
            <strong>QC</strong>
            <p>Checked before handover</p>
          </div>
        </div>
      </section>

      <section className="specialty-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Replacement options</p>
              <h2>Help customers make the sensible choice.</h2>
            </div>
            <p>If repair is too expensive or parts are not practical, show customers a cleaner path to a checked replacement device.</p>
          </div>
          <div className="specialty-grid four">
            {deviceTypes.map(([title, text], index) => (
              <article className="specialty-card" key={title} style={{ "--delay": `${index * 60}ms` } as CSSProperties}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RefurbishedShop devices={refurbishedDevices} />

      <section className="specialty-band">
        <div className="container specialty-band-grid">
          <div>
            <p className="eyebrow">Before handover</p>
            <h2>Each device should feel ready, not risky.</h2>
            <p>Final stock, pricing and warranty terms can be updated later. The page is ready for customer interest now.</p>
          </div>
          <div className="refurb-check-list">
            {checks.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
