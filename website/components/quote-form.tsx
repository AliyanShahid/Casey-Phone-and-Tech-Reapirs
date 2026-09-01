"use client";

import { useState } from "react";
import { createQuote, type QuoteRequest } from "@/lib/local-store";

export function QuoteForm() {
  const [created, setCreated] = useState<QuoteRequest | null>(null);

  function submit(formData: FormData) {
    const quote = createQuote({
      customerName: String(formData.get("customerName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      device: String(formData.get("device") || ""),
      repairNeeded: String(formData.get("repairNeeded") || ""),
      issueDetails: String(formData.get("issueDetails") || "")
    });

    setCreated(quote);
  }

  return (
    <div className="auth-card">
      {created ? (
        <div>
          <p className="eyebrow">Quote requested</p>
          <h2>{created.id}</h2>
          <p className="muted">
            This quote is now visible in the admin dashboard. Use this reference on the
            tracking page.
          </p>
          <button className="button primary" type="button" onClick={() => setCreated(null)}>
            Request another quote
          </button>
        </div>
      ) : (
        <form action={submit} className="form-grid">
          <div className="field light-field"><label>Full name</label><input name="customerName" required /></div>
          <div className="field light-field"><label>Email</label><input name="email" type="email" required /></div>
          <div className="field light-field"><label>Phone</label><input name="phone" required /></div>
          <div className="field light-field"><label>Device</label><input name="device" placeholder="iPhone 14 Pro" required /></div>
          <div className="field light-field"><label>Repair needed</label><input name="repairNeeded" placeholder="Screen, battery, no power..." required /></div>
          <div className="field light-field"><label>Issue details</label><textarea name="issueDetails" rows={5} required /></div>
          <button className="button primary" type="submit">Request quote</button>
        </form>
      )}
    </div>
  );
}
