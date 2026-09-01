"use client";

import { type FormEvent, useState } from "react";
import { createQuote, type QuoteRequest } from "@/lib/local-store";

export function InsuranceQuoteForm() {
  const [created, setCreated] = useState<QuoteRequest | null>(null);
  const [damage, setDamage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const photos = formData.getAll("photos").filter((item): item is File => item instanceof File && item.name.length > 0);
    const deviceBrand = String(formData.get("deviceBrand") || "");
    const deviceModel = String(formData.get("deviceModel") || "");
    const quote = createQuote({
      quoteType: "Insurance quote",
      customerName: String(formData.get("customerName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || ""),
      device: [deviceBrand, deviceModel].filter(Boolean).join(" ") || "Unknown device",
      deviceBrand,
      deviceModel,
      imei: String(formData.get("imei") || ""),
      serialNumber: String(formData.get("serialNumber") || ""),
      repairNeeded: "Insurance assessment",
      issueDetails: damage || String(formData.get("accidentDescription") || ""),
      accidentDescription: String(formData.get("accidentDescription") || damage),
      photoNames: photos.map((photo) => photo.name),
      quotePaymentStatus: "Not requested",
      invoiceStatus: "Not sent",
      customerNotification: "Insurance quote request received. Casey Repairs will inspect the details and confirm the quote fee before issuing the document."
    });
    setCreated(quote);
    setDamage("");
    event.currentTarget.reset();
  }

  if (created) {
    return (
      <div className="insurance-success">
        <p className="eyebrow">Request submitted</p>
        <h2>{created.id}</h2>
        <p>Track this reference to see approval, payment and document status.</p>
        <a className="button primary" href="/track-repair">Track insurance quote</a>
      </div>
    );
  }

  return (
    <form className="insurance-form" onSubmit={submit}>
      <div className="insurance-form-head">
        <p className="eyebrow">Claim document request</p>
        <h2>Send the basics. We prepare the formal quote.</h2>
      </div>

      <div className="insurance-section">
        <span>1</span>
        <div>
          <h3>Contact</h3>
          <div className="insurance-grid">
            <label>Name<input name="customerName" autoComplete="name" required /></label>
            <label>Mobile<input name="phone" inputMode="tel" autoComplete="tel" required /></label>
            <label className="wide">Email<input name="email" type="email" autoComplete="email" required /></label>
            <label className="wide">Address<input name="address" autoComplete="street-address" placeholder="Address for the quote document" required /></label>
          </div>
        </div>
      </div>

      <div className="insurance-section">
        <span>2</span>
        <div>
          <h3>Device</h3>
          <div className="insurance-grid">
            <label>Brand<input name="deviceBrand" placeholder="Apple, Samsung, Oppo..." required /></label>
            <label>Model<input name="deviceModel" placeholder="iPhone 15 Pro, S23 Ultra..." /></label>
            <label>IMEI<input name="imei" placeholder="If available" /></label>
            <label>Serial number<input name="serialNumber" placeholder="If available" /></label>
          </div>
        </div>
      </div>

      <div className="insurance-section">
        <span>3</span>
        <div>
          <h3>Damage</h3>
          <div className="insurance-chips">
            {["Cracked screen", "Back glass", "Liquid damage", "Won't power on", "Camera damage", "Charging issue"].map((item) => (
              <button className={damage.includes(item) ? "active" : ""} key={item} type="button" onClick={() => setDamage((current) => current.includes(item) ? current.replace(item, "").replace(/^, |, $/g, "") : [current, item].filter(Boolean).join(", "))}>{item}</button>
            ))}
          </div>
          <label>Accident description<textarea name="accidentDescription" rows={3} value={damage} onChange={(event) => setDamage(event.target.value)} placeholder="Short description of what happened" required /></label>
          <label className="insurance-upload">
            <input name="photos" type="file" accept="image/*" multiple />
            <strong>Add device photos</strong>
            <small>Front, back, damage, IMEI/box label if available</small>
          </label>
        </div>
      </div>

      <button className="button primary" type="submit">Request insurance quote</button>
    </form>
  );
}
