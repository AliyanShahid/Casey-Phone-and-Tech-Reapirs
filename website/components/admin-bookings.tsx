"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteBooking, getStore, subscribeStore, updateBooking, type Booking, type RepairStatus, type StoreState } from "@/lib/local-store";

type BookingDraft = Pick<Booking, "status" | "depositAmount" | "balanceAmount" | "pickupEta" | "returnEta" | "quotedPrice" | "adminNotes" | "customerNotification" | "paymentLink">;

const dispatchStatuses: RepairStatus[] = [
  "Pending Approval",
  "Deposit Requested",
  "Deposit Paid",
  "Pickup Booked",
  "On Route to Customer",
  "Device Received",
  "Repairing",
  "Fixed - Return Scheduled",
  "Out for Delivery",
  "Delivered - Balance Due",
  "Paid and Collected",
  "Cancelled"
];

function money(value?: string, fallback = "$50") {
  const clean = (value || "").trim();
  if (!clean) return fallback;
  return clean.startsWith("$") ? clean : `$${clean}`;
}

function moneyValue(value?: string) {
  const parsed = Number((value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function moneyFromNumber(value: number) {
  return `$${Math.max(0, value).toFixed(value % 1 === 0 ? 0 : 2)}`;
}

function remainingBalance(total?: string, deposit?: string) {
  return moneyFromNumber(moneyValue(total) - moneyValue(deposit));
}

function defaultPaymentLink(booking: Booking, amount: string) {
  const encodedRef = encodeURIComponent(`${booking.id} ${booking.device} ${amount}`);
  return `https://buy.stripe.com/test_casey_deposit?client_reference_id=${encodedRef}`;
}

function displayEta(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function draftFromBooking(booking: Booking): BookingDraft {
  return {
    status: booking.status,
    depositAmount: booking.depositAmount || "$50",
    balanceAmount: booking.balanceAmount || remainingBalance(booking.quotedPrice, booking.depositAmount || "$50"),
    pickupEta: booking.pickupEta || "",
    returnEta: booking.returnEta || "",
    quotedPrice: booking.quotedPrice || "",
    adminNotes: booking.adminNotes || "",
    paymentLink: booking.paymentLink || defaultPaymentLink(booking, booking.depositAmount || "$50"),
    customerNotification: booking.customerNotification || "Request received. Casey Repairs will review and confirm the next step."
  };
}

function messageFor(booking: Booking, draft: BookingDraft) {
  const deposit = money(draft.depositAmount);
  const balance = remainingBalance(draft.quotedPrice, draft.depositAmount);
  const pickup = draft.pickupEta || `${booking.preferredDate} ${booking.preferredTime}`;
  const returned = draft.returnEta || "to be confirmed";
  const pickupDisplay = displayEta(pickup) || pickup;
  const returnDisplay = displayEta(returned) || returned;

  switch (draft.status) {
    case "Deposit Requested":
      return `Your ${booking.device} request is approved. Please pay the ${deposit} deposit using the secure Stripe link to confirm your mobile repair booking.`;
    case "Pickup Booked":
      return `Your pickup/onsite visit is booked for ${pickupDisplay}. If anything changes, call the contact number on your booking.`;
    case "On Route to Customer":
      return `Casey Repairs is on the way for your device pickup/visit. Estimated time: ${pickupDisplay}.`;
    case "Device Received":
      return "Your device has been received by Casey Repairs and is safely in our care.";
    case "Repairing":
      return "Repair work has started. We will contact you before any extra cost or unexpected repair is approved.";
    case "Fixed - Return Scheduled":
      return `Your device is fixed. Return or handover ETA is ${returnDisplay}.`;
    case "Out for Delivery":
      return `Your device is on the way back. Return or handover ETA is ${returnDisplay}.`;
    case "Delivered - Balance Due":
      return `Your device is ready for handover. Please pay the remaining balance of ${balance} before collection/delivery is completed.`;
    case "Paid and Collected":
      return "Payment is complete and the device has been collected/delivered. Thank you for choosing Casey Repairs.";
    default:
      return draft.customerNotification || "Your booking has been updated by Casey Repairs.";
  }
}

function paymentStatusFor(status: RepairStatus, current?: Booking["paymentStatus"]) {
  if (status === "Deposit Requested") return "Deposit requested";
  if (status === "Deposit Paid") return "Deposit paid";
  if (status === "Delivered - Balance Due") return "Balance requested";
  if (status === "Paid and Collected") return "Fully paid";
  return current || "No payment requested";
}

export function AdminBookings() {
  const [state, setState] = useState<StoreState>({ bookings: [], quotes: [], queries: [], prices: [], users: [], deletedPriceIds: [] });
  const [drafts, setDrafts] = useState<Record<string, BookingDraft>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});

  useEffect(() => {
    setState(getStore());
    return subscribeStore(() => setState(getStore()));
  }, []);

  const bookingDrafts = useMemo(() => {
    const next = { ...drafts };
    state.bookings.forEach((booking) => {
      if (!next[booking.id]) next[booking.id] = draftFromBooking(booking);
    });
    return next;
  }, [drafts, state.bookings]);

  function setDraft(id: string, changes: Partial<BookingDraft>) {
    setDrafts((current) => ({ ...current, [id]: { ...bookingDrafts[id], ...changes } }));
  }

function updateDetails(booking: Booking) {
    const draft = bookingDrafts[booking.id];
    const balanceAmount = remainingBalance(draft.quotedPrice, draft.depositAmount);
    updateBooking(booking.id, {
      ...draft,
      balanceAmount,
      paymentStatus: paymentStatusFor(draft.status, booking.paymentStatus),
      paymentLink: draft.paymentLink || defaultPaymentLink(booking, draft.depositAmount || "$50")
    });
    setSaved((current) => ({ ...current, [booking.id]: "Details updated. Review, then send to customer." }));
  }

function sendToCustomer(booking: Booking) {
    const draft = bookingDrafts[booking.id];
    const balanceAmount = remainingBalance(draft.quotedPrice, draft.depositAmount);
    const message = messageFor(booking, { ...draft, balanceAmount });
    updateBooking(booking.id, {
      ...draft,
      balanceAmount,
      customerNotification: message,
      paymentStatus: paymentStatusFor(draft.status, booking.paymentStatus),
      paymentLink: draft.paymentLink || defaultPaymentLink(booking, draft.depositAmount || "$50"),
      notificationStatus: "SMTP not configured",
      lastNotifiedAt: new Date().toISOString()
    });
    setSaved((current) => ({ ...current, [booking.id]: "Sent to customer website. Email will send when SMTP is connected." }));
  }

  return (
    <div className="record-list">
      {state.bookings.length === 0 ? (
        <p className="muted">No bookings yet.</p>
      ) : (
        state.bookings.map((booking) => {
          const draft = bookingDrafts[booking.id] || draftFromBooking(booking);
          return (
            <article className="card admin-booking-card" key={booking.id}>
              <div className="record-head">
                <div>
                  <p className="eyebrow">{booking.id}</p>
                  <h3>{booking.device}</h3>
                </div>
                <span className="status-pill">{booking.status}</span>
              </div>

              <p>{booking.customerName} | {booking.phone} | {booking.email}</p>
              {booking.serviceType && <p><strong>{booking.serviceType}</strong></p>}
              {booking.address && <p className="muted">{booking.address}, {booking.suburb} {booking.postcode}{booking.accessNotes ? ` | ${booking.accessNotes}` : ""}</p>}
              <p className="muted">{booking.preferredDate} {booking.preferredTime} | {booking.issue}</p>
              {booking.photoNames && booking.photoNames.length > 0 && <p className="muted">Photos added: {booking.photoNames.join(", ")}</p>}

              <div className="booking-flow-panel">
                <div><span>Total</span><strong>{booking.quotedPrice || "Not set"}</strong></div>
                <div><span>Deposit</span><strong>{booking.depositAmount || "Not set"}</strong></div>
                <div><span>Remaining</span><strong>{booking.balanceAmount || remainingBalance(booking.quotedPrice, booking.depositAmount)}</strong></div>
                <div><span>Customer notice</span><strong>{booking.notificationStatus || "Not sent"}</strong></div>
              </div>

              <div className="admin-controls door-admin-controls">
                <select value={draft.status} onChange={(event) => setDraft(booking.id, { status: event.target.value as RepairStatus, customerNotification: messageFor(booking, { ...draft, status: event.target.value as RepairStatus }) })}>
                  {dispatchStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
                <input placeholder="Total amount, e.g. $129" value={draft.quotedPrice || ""} onChange={(event) => setDraft(booking.id, { quotedPrice: event.target.value, balanceAmount: remainingBalance(event.target.value, draft.depositAmount) })} />
                <input placeholder="Deposit, e.g. $50" value={draft.depositAmount || ""} onChange={(event) => setDraft(booking.id, { depositAmount: event.target.value, balanceAmount: remainingBalance(draft.quotedPrice, event.target.value) })} />
                <input readOnly value={`Remaining: ${remainingBalance(draft.quotedPrice, draft.depositAmount)}`} />
                <label className="admin-date-field">
                  Pickup ETA
                  <input type="datetime-local" value={draft.pickupEta || ""} onChange={(event) => setDraft(booking.id, { pickupEta: event.target.value })} />
                </label>
                <label className="admin-date-field">
                  Drop-off ETA
                  <input type="datetime-local" value={draft.returnEta || ""} onChange={(event) => setDraft(booking.id, { returnEta: event.target.value })} />
                </label>
                <input placeholder="Stripe payment link" value={draft.paymentLink || ""} onChange={(event) => setDraft(booking.id, { paymentLink: event.target.value })} />
                <input placeholder="Admin notes" value={draft.adminNotes || ""} onChange={(event) => setDraft(booking.id, { adminNotes: event.target.value })} />
              </div>

              <textarea className="admin-notification-box" value={draft.customerNotification || ""} onChange={(event) => setDraft(booking.id, { customerNotification: event.target.value })} rows={3} />

              <div className="admin-send-actions">
                <button className="button ghost" type="button" onClick={() => updateDetails(booking)}>Update details</button>
                <button className="button primary" type="button" onClick={() => sendToCustomer(booking)}>Send to customer</button>
                <button className="button danger" type="button" onClick={() => deleteBooking(booking.id)}>Delete request</button>
                {saved[booking.id] && <span>{saved[booking.id]}</span>}
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
