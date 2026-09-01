"use client";

import { type FormEvent, useState } from "react";
import { createBooking, type Booking } from "@/lib/local-store";

export function DoorToDoorForm() {
  const [created, setCreated] = useState<Booking | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showModelHelp, setShowModelHelp] = useState(false);
  const [issue, setIssue] = useState("");
  const [deviceLook, setDeviceLook] = useState("");
  const [deviceCondition, setDeviceCondition] = useState("");
  const [visibleInfo, setVisibleInfo] = useState("");

  function toggleText(current: string, value: string, setter: (next: string) => void) {
    const parts = current.split(", ").filter(Boolean);
    setter(parts.includes(value) ? parts.filter((part) => part !== value).join(", ") : [...parts, value].join(", "));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const photos = formData.getAll("photos").filter((item): item is File => item instanceof File && item.name.length > 0);
    const booking = createBooking({
      customerName: String(formData.get("customerName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      device: String(formData.get("device") || "Unknown device"),
      preferredDate: String(formData.get("preferredDate") || ""),
      preferredTime: String(formData.get("preferredTime") || ""),
      issue: String(formData.get("issue") || ""),
      serviceType: "Door-to-door pickup",
      address: String(formData.get("address") || ""),
      suburb: String(formData.get("suburb") || ""),
      postcode: String(formData.get("postcode") || ""),
      accessNotes: String(formData.get("accessNotes") || ""),
      deviceClues: [
        `Brand/model if known: ${String(formData.get("device") || "Not sure")}`,
        `Colour/back details: ${String(formData.get("deviceLook") || "Not provided")}`,
        `Power/screen condition: ${String(formData.get("deviceCondition") || "Not provided")}`,
        `Numbers or text visible: ${String(formData.get("visibleInfo") || "Not provided")}`
      ].join(" | "),
      photoNames: photos.map((photo) => photo.name)
    });
    setCreated(booking);
    event.currentTarget.reset();
    setIssue("");
    setDeviceLook("");
    setDeviceCondition("");
    setVisibleInfo("");
  }

  if (created) {
    return (
      <div className="door-success">
        <p className="eyebrow">Request received</p>
        <h2>{created.id}</h2>
        <p>
          Your mobile service request is now in the admin booking list. Keep this
          reference for tracking and approval updates.
        </p>
        <div className="door-success-actions">
          <a className="button dark" href="/track-repair">Track request</a>
          <button className="button primary" type="button" onClick={() => setCreated(null)}>
            Create another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="door-form" onSubmit={submit}>
      <div className="door-form-head">
        <p className="eyebrow">Mobile repair request</p>
        <h2>Broken device? We’ll help.</h2>
        <p>Choose the easiest option. You do not need to know the exact model.</p>
      </div>

      <div className="contact-choice-grid">
        <a className="contact-choice-card call" href="tel:+61000000000">
          <span>Fastest</span>
          <strong>Give us a call</strong>
          <small>Best for urgent jobs or if you feel stuck.</small>
        </a>
        <button className="contact-choice-card" type="button" onClick={() => setShowForm(true)}>
          <span>Online</span>
          <strong>Send quick request</strong>
          <small>Takes about one minute. We confirm price before repair.</small>
        </button>
      </div>

      <div className="form-reassurance">
        <span>Exact model not required</span>
        <span>Photos optional</span>
        <span>Admin confirms price first</span>
      </div>

      {!showForm && (
        <button className="button primary show-form-button" type="button" onClick={() => setShowForm(true)}>
          Continue with quick form
        </button>
      )}

      {showForm && (
        <div id="quick-request" className="quick-request-area">
          <div className="door-form-section">
            <div className="mini-section-head"><span>1</span><strong>Contact</strong></div>
            <div className="door-form-grid compact">
              <label>Name<input name="customerName" autoComplete="name" required /></label>
              <label>Mobile<input name="phone" inputMode="tel" autoComplete="tel" placeholder="04xx xxx xxx" required /></label>
              <label className="wide">Email<input name="email" type="email" autoComplete="email" required /></label>
            </div>
          </div>

          <div className="door-form-section">
            <div className="mini-section-head"><span>2</span><strong>Device and issue</strong></div>
            <label className="simple-field">
              Device
              <input name="device" placeholder="iPhone, Samsung, laptop, or not sure" />
            </label>

            <div className="quick-chip-group">
              {["Screen", "Battery", "Charging", "No power", "Water", "Back glass", "Speaker", "Data"].map((item) => (
                <button className={issue.includes(item) ? "active" : ""} key={item} type="button" onClick={() => toggleText(issue, item, setIssue)}>
                  {item}
                </button>
              ))}
            </div>

            <label className="simple-field">
              Short note
              <textarea name="issue" rows={2} value={issue} onChange={(event) => setIssue(event.target.value)} placeholder="Example: screen broken, phone still rings" required />
            </label>

            <button className="model-help-toggle" type="button" onClick={() => setShowModelHelp((value) => !value)}>
              {showModelHelp ? "Hide model help" : "I don’t know the model"}
            </button>
          </div>

          {showModelHelp && (
            <div className="door-form-section soft">
              <div className="mini-section-head"><span>?</span><strong>Quick clues</strong></div>
              <div className="quick-chip-group">
                {["Black", "White", "3 cameras", "Apple logo", "Samsung logo", "Oppo logo", "Won't turn on", "Screen black", "Touch works"].map((item) => (
                  <button
                    className={`${deviceLook.includes(item) || deviceCondition.includes(item) ? "active" : ""}`}
                    key={item}
                    type="button"
                    onClick={() => item.includes("turn") || item.includes("Screen") || item.includes("Touch") ? toggleText(deviceCondition, item, setDeviceCondition) : toggleText(deviceLook, item, setDeviceLook)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="door-form-grid compact">
                <label>Look<input name="deviceLook" value={deviceLook} onChange={(event) => setDeviceLook(event.target.value)} placeholder="Colour, logo, cameras" /></label>
                <label>Condition<input name="deviceCondition" value={deviceCondition} onChange={(event) => setDeviceCondition(event.target.value)} placeholder="Turns on? screen visible?" /></label>
                <label className="wide">Code or label<textarea name="visibleInfo" rows={2} value={visibleInfo} onChange={(event) => setVisibleInfo(event.target.value)} placeholder="IMEI box label, model code, sticker" /></label>
              </div>
            </div>
          )}

          <div className="door-form-section">
            <div className="mini-section-head"><span>3</span><strong>Pickup</strong></div>
            <div className="door-form-grid compact">
              <label className="wide">Address<input name="address" placeholder="Street address" required /></label>
              <label>Suburb<input name="suburb" required /></label>
              <label>Postcode<input name="postcode" inputMode="numeric" pattern="[0-9]{4}" placeholder="3977" required /></label>
              <label>Date<input name="preferredDate" type="date" required /></label>
              <label>Time<input name="preferredTime" type="time" required /></label>
            </div>
          </div>

          <div className="door-form-section optional-line">
            <div className="mini-section-head"><span>+</span><strong>Optional</strong></div>
            <label className="file-drop">
              <input name="photos" type="file" accept="image/*" multiple />
              <strong>Add photos</strong>
              <span>Damage, label, box, or error screen</span>
            </label>
            <label className="simple-field">
              Access notes
              <textarea name="accessNotes" rows={2} placeholder="Parking, apartment entry, urgent timing" />
            </label>
          </div>

          <button className="button primary" type="submit">Send request</button>
        </div>
      )}
    </form>
  );
}
