"use client";

import { useState } from "react";
import { createQuery, type CustomerQuery } from "@/lib/local-store";

export function ContactForm() {
  const [sent, setSent] = useState<CustomerQuery | null>(null);

  function submit(formData: FormData) {
    const query = createQuery({
      customerName: String(formData.get("customerName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      device: String(formData.get("device") || "General enquiry"),
      issue: String(formData.get("topic") || "Contact enquiry"),
      visibleInfo: String(formData.get("message") || "")
    });
    setSent(query);
  }

  return (
    <div className="contact-form-card">
      {sent ? (
        <div className="contact-success">
          <p className="eyebrow">Message received</p>
          <h2>{sent.id}</h2>
          <p className="muted">
            Your enquiry is now in the admin Queries section. Email sending will be connected when SMTP is configured.
          </p>
          <button className="button primary" type="button" onClick={() => setSent(null)}>
            Send another message
          </button>
        </div>
      ) : (
        <form action={submit} className="contact-form">
          <div className="contact-form-head">
            <p className="eyebrow">Send details</p>
            <h2>How can we help?</h2>
          </div>
          <div className="contact-form-grid">
            <label>Name<input name="customerName" autoComplete="name" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Mobile<input name="phone" inputMode="tel" autoComplete="tel" placeholder="04xx xxx xxx" required /></label>
            <label>Device<input name="device" placeholder="iPhone, Samsung, MacBook..." /></label>
            <label className="wide">
              What do you need?
              <select name="topic" defaultValue="Repair help">
                <option>Repair help</option>
                <option>Door-to-door pickup</option>
                <option>Insurance quote</option>
                <option>Repair status</option>
                <option>Business / IT support</option>
              </select>
            </label>
            <label className="wide">
              Message
              <textarea name="message" rows={5} placeholder="Tell us the fault, model if known, and whether you want to visit or need pickup." required />
            </label>
          </div>
          <div className="form-reassurance">
            <span>Admin query saved</span>
            <span>Photo review available on booking pages</span>
            <span>No repair starts without approval</span>
          </div>
          <button className="button primary" type="submit">Send message</button>
        </form>
      )}
    </div>
  );
}
