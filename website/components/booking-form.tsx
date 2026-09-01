"use client";

import { useState } from "react";
import Link from "next/link";
import { createBooking, type Booking } from "@/lib/local-store";

export function BookingForm() {
  const [created, setCreated] = useState<Booking | null>(null);

  function submit(formData: FormData) {
    const booking = createBooking({
      customerName: String(formData.get("customerName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      device: String(formData.get("device") || ""),
      preferredDate: String(formData.get("preferredDate") || ""),
      preferredTime: String(formData.get("preferredTime") || ""),
      issue: String(formData.get("issue") || ""),
      serviceType: "Workshop booking",
      address: "Casey workshop address coming soon",
      accessNotes: String(formData.get("accessNotes") || ""),
      customerNotification: "Booking request received. Casey Repairs will confirm your workshop visit time."
    });

    setCreated(booking);
  }

  return (
    <div className="booking-form-card">
      {created ? (
        <div className="booking-success">
          <p className="eyebrow">Booking submitted</p>
          <h2>{created.id}</h2>
          <p className="muted">
            Your request is now visible in the admin panel. Use this reference on the tracking page.
          </p>
          <div className="booking-success-actions">
            <a className="button primary" href={`/track-repair`}>Track repair</a>
            <button className="button ghost" type="button" onClick={() => setCreated(null)}>
              Create another booking
            </button>
          </div>
        </div>
      ) : (
        <form action={submit} className="booking-form">
          <div className="booking-form-head">
            <p className="eyebrow">Start here</p>
            <h2>Book your repair</h2>
          </div>

          <div className="booking-choice-toggle" role="group" aria-label="Booking type">
            <button className="active" type="button">
              <strong>Visit us</strong>
              <span>9 AM - 12 PM</span>
            </button>
            <Link href="/door-to-door">
              <strong>Come to me</strong>
              <span>Door-to-door repair</span>
            </Link>
          </div>

          <div className="booking-mode-note">
            You can come to Casey Repairs between 9:00 AM and 12:00 PM. Address will be updated soon.
          </div>

          <div className="booking-form-grid">
            <label>Full name<input name="customerName" autoComplete="name" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Mobile<input name="phone" inputMode="tel" autoComplete="tel" placeholder="04xx xxx xxx" required /></label>
            <label>Device<input name="device" placeholder="iPhone 14 Pro, MacBook, Samsung..." required /></label>
            <label>Preferred date<input name="preferredDate" type="date" required /></label>
            <label>
              Preferred time
              <input name="preferredTime" type="time" min="09:00" max="12:00" required />
            </label>
          </div>

          <label className="booking-wide-label">
            What needs fixing?
            <textarea name="issue" rows={4} placeholder="Cracked screen, battery, charging, no power, laptop issue..." required />
          </label>

          <label className="booking-wide-label">
            Extra notes
            <textarea name="accessNotes" rows={3} placeholder="Anything we should know before you visit..." />
          </label>

          <button className="button primary" type="submit">
            Submit booking request
          </button>
        </form>
      )}
    </div>
  );
}
