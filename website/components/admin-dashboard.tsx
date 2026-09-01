"use client";

import { useEffect, useMemo, useState } from "react";
import {
  deletePrice,
  getStore,
  subscribeStore,
  updateBooking,
  updateQuote,
  upsertPrice,
  type PriceItem,
  type RepairStatus,
  type StoreState
} from "@/lib/local-store";

const statuses: RepairStatus[] = [
  "Submitted",
  "Pending Approval",
  "Approved",
  "Deposit Requested",
  "Deposit Paid",
  "Pickup Booked",
  "On Route to Customer",
  "Device Picked Up",
  "Device Received",
  "Repairing",
  "Fixed - Return Scheduled",
  "Out for Delivery",
  "Delivered - Balance Due",
  "Paid and Collected",
  "Awaiting Payment",
  "In Progress",
  "Ready",
  "Completed",
  "Cancelled"
];

const emptyPrice: Omit<PriceItem, "id"> = {
  device: "",
  repair: "",
  priceRange: "",
  time: "",
  warranty: "90 days",
  availability: "Available"
};

export function AdminDashboard() {
  const [state, setState] = useState<StoreState>({ bookings: [], quotes: [], queries: [], prices: [], users: [], deletedPriceIds: [] });
  const [priceForm, setPriceForm] = useState<Omit<PriceItem, "id"> & { id?: string }>(emptyPrice);

  useEffect(() => {
    setState(getStore());
    return subscribeStore(() => setState(getStore()));
  }, []);

  const stats = useMemo(() => {
    const openBookings = state.bookings.filter((item) => !["Completed", "Cancelled"].includes(item.status)).length;
    const openQuotes = state.quotes.filter((item) => !["Completed", "Cancelled"].includes(item.status)).length;
    const completed = [...state.bookings, ...state.quotes].filter((item) => item.status === "Completed").length;
    return { openBookings, openQuotes, completed, prices: state.prices.length, users: state.users.length };
  }, [state]);

  function savePrice(formData: FormData) {
    upsertPrice({
      id: priceForm.id,
      device: String(formData.get("device") || ""),
      repair: String(formData.get("repair") || ""),
      priceRange: String(formData.get("priceRange") || ""),
      time: String(formData.get("time") || ""),
      warranty: String(formData.get("warranty") || ""),
      availability: String(formData.get("availability") || "Available") as PriceItem["availability"]
    });
    setPriceForm(emptyPrice);
  }

  return (
    <div className="admin-stack">
      <div className="admin-tabs">
        {["Analytics", "Users", "Bookings", "Quotes", "Pricing"].map((item) => (
          <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>
        ))}
      </div>

      <section id="analytics" className="card-grid">
        <article className="card"><h3>Open bookings</h3><p className="metric">{stats.openBookings}</p></article>
        <article className="card"><h3>Open quotes</h3><p className="metric">{stats.openQuotes}</p></article>
        <article className="card"><h3>Completed</h3><p className="metric">{stats.completed}</p></article>
        <article className="card"><h3>Users</h3><p className="metric">{stats.users}</p></article>
      </section>

      <section id="users" className="admin-section">
        <div className="section-head"><div><p className="eyebrow">Users</p><h2>Registered customers</h2></div></div>
        {state.users.length === 0 ? (
          <p className="muted">No users yet. A user appears here after OTP verification.</p>
        ) : (
          <div className="record-list">
            {state.users.map((user) => (
              <article className="card" key={user.id}>
                <div className="record-head">
                  <div><p className="eyebrow">{user.id}</p><h3>{user.email}</h3></div>
                  <span className="status-pill">{user.phone || "No phone"}</span>
                </div>
                <p className="muted">
                  Created {new Date(user.createdAt).toLocaleString()}
                  {user.lastLoginAt ? ` · Last login ${new Date(user.lastLoginAt).toLocaleString()}` : ""}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="bookings" className="admin-section">
        <div className="section-head"><div><p className="eyebrow">Bookings</p><h2>Customer repair bookings</h2></div></div>
        {state.bookings.length === 0 ? (
          <p className="muted">No bookings yet. Create one from the Book Repair page.</p>
        ) : (
          <div className="record-list">
            {state.bookings.map((booking) => (
              <article className="card" key={booking.id}>
                <div className="record-head">
                  <div><p className="eyebrow">{booking.id}</p><h3>{booking.device}</h3></div>
                  <span className="status-pill">{booking.status}</span>
                </div>
                <p>{booking.customerName} · {booking.phone} · {booking.email}</p>
                <p className="muted">{booking.preferredDate} {booking.preferredTime} · {booking.issue}</p>
                {booking.serviceType && <p><strong>{booking.serviceType}</strong></p>}
                {booking.address && (
                  <p className="muted">
                    {booking.address}, {booking.suburb} {booking.postcode}
                    {booking.accessNotes ? ` | ${booking.accessNotes}` : ""}
                  </p>
                )}
                <div className="admin-controls">
                  <select value={booking.status} onChange={(event) => updateBooking(booking.id, { status: event.target.value as RepairStatus })}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <input placeholder="Quoted price" value={booking.quotedPrice || ""} onChange={(event) => updateBooking(booking.id, { quotedPrice: event.target.value })} />
                  <input placeholder="Admin notes" value={booking.adminNotes || ""} onChange={(event) => updateBooking(booking.id, { adminNotes: event.target.value })} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="quotes" className="admin-section">
        <div className="section-head"><div><p className="eyebrow">Quotes</p><h2>Repair quote requests</h2></div></div>
        {state.quotes.length === 0 ? (
          <p className="muted">No quotes yet. Create one from the Request Quote page.</p>
        ) : (
          <div className="record-list">
            {state.quotes.map((quote) => (
              <article className="card" key={quote.id}>
                <div className="record-head">
                  <div><p className="eyebrow">{quote.id}</p><h3>{quote.device}</h3></div>
                  <span className="status-pill">{quote.status}</span>
                </div>
                <p>{quote.customerName} · {quote.phone} · {quote.email}</p>
                <p className="muted">{quote.repairNeeded} · {quote.issueDetails}</p>
                <div className="admin-controls">
                  <select value={quote.status} onChange={(event) => updateQuote(quote.id, { status: event.target.value as RepairStatus })}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <input placeholder="Quoted price" value={quote.quotedPrice || ""} onChange={(event) => updateQuote(quote.id, { quotedPrice: event.target.value })} />
                  <input placeholder="Admin notes" value={quote.adminNotes || ""} onChange={(event) => updateQuote(quote.id, { adminNotes: event.target.value })} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="pricing" className="admin-section">
        <div className="section-head"><div><p className="eyebrow">Pricing</p><h2>Repair price management</h2></div></div>
        <form action={savePrice} className="admin-price-form">
          <input name="device" placeholder="Device" value={priceForm.device} onChange={(event) => setPriceForm({ ...priceForm, device: event.target.value })} required />
          <input name="repair" placeholder="Repair" value={priceForm.repair} onChange={(event) => setPriceForm({ ...priceForm, repair: event.target.value })} required />
          <input name="priceRange" placeholder="Price range" value={priceForm.priceRange} onChange={(event) => setPriceForm({ ...priceForm, priceRange: event.target.value })} required />
          <input name="time" placeholder="Time" value={priceForm.time} onChange={(event) => setPriceForm({ ...priceForm, time: event.target.value })} required />
          <input name="warranty" placeholder="Warranty" value={priceForm.warranty} onChange={(event) => setPriceForm({ ...priceForm, warranty: event.target.value })} required />
          <select name="availability" value={priceForm.availability} onChange={(event) => setPriceForm({ ...priceForm, availability: event.target.value as PriceItem["availability"] })}>
            <option>Available</option>
            <option>Order required</option>
            <option>Diagnostic only</option>
          </select>
          <button className="button primary" type="submit">{priceForm.id ? "Update price" : "Add price"}</button>
        </form>

        <div className="record-list">
          {state.prices.map((price) => (
            <article className="card" key={price.id}>
              <div className="record-head">
                <div><p className="eyebrow">{price.id}</p><h3>{price.device}</h3></div>
                <span className="status-pill">{price.availability}</span>
              </div>
              <p>{price.repair} · {price.priceRange} · {price.time} · {price.warranty}</p>
              <div className="admin-controls two">
                <button className="button ghost" type="button" onClick={() => setPriceForm(price)}>Edit</button>
                <button className="button dark" type="button" onClick={() => deletePrice(price.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
