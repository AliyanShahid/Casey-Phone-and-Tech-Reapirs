"use client";

import { useEffect, useState } from "react";
import { getStore, subscribeStore, updateQuote, type RepairStatus, type StoreState } from "@/lib/local-store";

const statuses: RepairStatus[] = ["Submitted", "Approved", "Awaiting Payment", "Completed", "Cancelled"];

function defaultQuoteLink(id: string, amount: string) {
  return `https://buy.stripe.com/test_casey_insurance_quote?client_reference_id=${encodeURIComponent(`${id} ${amount}`)}`;
}

function invoiceNumber(id: string) {
  return `INV-${id.replace(/\D/g, "").slice(-6) || String(Date.now()).slice(-6)}`;
}

function moneyValue(value?: string) {
  const parsed = Number((value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function moneyFromNumber(value: number) {
  return `$${Math.max(0, value).toFixed(value % 1 === 0 ? 0 : 2)}`;
}

function formatCost(value?: string) {
  const amount = moneyValue(value);
  return amount > 0 ? moneyFromNumber(amount) : "";
}

function parseRepairLine(line: string) {
  const clean = line.trim();
  if (!clean) return { part: "", cost: "" };

  if (clean.includes("|")) {
    const [part, cost] = clean.split("|").map((item) => item.trim());
    return { part: part || clean, cost: formatCost(cost) };
  }

  const match = clean.match(/(?:\$?\s*\d+(?:\.\d{1,2})?\s*\$?)$/);
  if (!match) return { part: clean, cost: "" };

  const cost = formatCost(match[0]);
  const part = clean
    .slice(0, match.index)
    .replace(/[-:,\s]+$/, "")
    .trim();
  return { part: part || clean, cost };
}

function parseRepairItems(value?: string) {
  return (value || "")
    .split(/\r?\n/)
    .map(parseRepairLine)
    .filter((item) => item.part);
}

function repairItemsTotal(value?: string) {
  const total = parseRepairItems(value).reduce((sum, item) => sum + moneyValue(item.cost), 0);
  return total > 0 ? moneyFromNumber(total) : "";
}

export function AdminQuotes() {
  const [state, setState] = useState<StoreState>({ bookings: [], quotes: [], queries: [], prices: [], users: [], deletedPriceIds: [] });

  useEffect(() => {
    setState(getStore());
    return subscribeStore(() => setState(getStore()));
  }, []);

  return (
    <div className="record-list">
      {state.quotes.length === 0 ? <p className="muted">No quotes yet.</p> : state.quotes.map((quote) => {
        const isInsurance = quote.quoteType === "Insurance quote";
        const quoteFee = quote.quoteFee || "$39";
        const itemTotal = repairItemsTotal(quote.repairItems);
        return (
          <article className="card admin-quote-card" key={quote.id}>
            <div className="record-head">
              <div><p className="eyebrow">{quote.id}</p><h3>{quote.device}</h3></div>
              <span className="status-pill">{quote.status}</span>
            </div>
            <p>{quote.customerName} | {quote.phone} | {quote.email}</p>
            {quote.address && <p className="muted">{quote.address}</p>}
            <p className="muted">{quote.repairNeeded} | {quote.issueDetails}</p>
            {quote.photoNames && quote.photoNames.length > 0 && <p className="muted">Photos: {quote.photoNames.join(", ")}</p>}

            {isInsurance && (
              <div className="quote-admin-summary">
                <div><span>Invoice</span><strong>{quote.invoiceNumber || invoiceNumber(quote.id)}</strong></div>
                <div><span>Quote fee</span><strong>{quoteFee}</strong></div>
                <div><span>Repair total</span><strong>{itemTotal || quote.quotedPrice || "Set items"}</strong></div>
                <div><span>Payment</span><strong>{quote.quotePaymentStatus || "Not requested"}</strong></div>
                <div><span>Document</span><strong>{quote.invoiceStatus || "Not sent"}</strong></div>
              </div>
            )}

            <div className="admin-controls quote-admin-controls">
              <select value={quote.status} onChange={(event) => updateQuote(quote.id, { status: event.target.value as RepairStatus })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
              <input placeholder="Repair total / insured amount" value={quote.quotedPrice || ""} onChange={(event) => updateQuote(quote.id, { quotedPrice: event.target.value })} />
              <input placeholder="Quote fee, e.g. $39" value={quoteFee} onChange={(event) => updateQuote(quote.id, { quoteFee: event.target.value })} />
              <input placeholder="Stripe payment link" value={quote.paymentLink || defaultQuoteLink(quote.id, quoteFee)} onChange={(event) => updateQuote(quote.id, { paymentLink: event.target.value })} />
              <input placeholder="Invoice number" value={quote.invoiceNumber || invoiceNumber(quote.id)} onChange={(event) => updateQuote(quote.id, { invoiceNumber: event.target.value })} />
              <input placeholder="Assessment notes" value={quote.assessmentNotes || ""} onChange={(event) => updateQuote(quote.id, { assessmentNotes: event.target.value })} />
              <input placeholder="Valid until" type="date" value={quote.quoteValidUntil || ""} onChange={(event) => updateQuote(quote.id, { quoteValidUntil: event.target.value })} />
            </div>

            {isInsurance && (
              <div className="quote-item-editor">
                <label>Final repair parts and costs</label>
                <p className="muted">Type one repair per line. A normal space before the price is enough.</p>
                <textarea
                  className="admin-notification-box itemized-repairs-box"
                  rows={5}
                  placeholder={"One item per line, for example:\nScreen assembly 299\nBattery 120\nBack glass 149"}
                  value={quote.repairItems || ""}
                  onChange={(event) => {
                    const repairItems = event.target.value;
                    const total = repairItemsTotal(repairItems);
                    updateQuote(quote.id, {
                      repairItems,
                      quotedPrice: total || quote.quotedPrice
                    });
                  }}
                />
                <div className="quote-item-list">
                  {parseRepairItems(quote.repairItems).length > 0 ? parseRepairItems(quote.repairItems).map((item, index) => (
                    <div key={`${item.part}-${index}`}>
                      <span>{item.part}</span>
                      <strong>{item.cost || "Add cost"}</strong>
                    </div>
                  )) : <p className="muted">Add the exact parts and costs that should appear on the customer PDF.</p>}
                  {itemTotal && <div className="quote-item-total"><span>Final repair total</span><strong>{itemTotal}</strong></div>}
                </div>
              </div>
            )}

            <textarea
              className="admin-notification-box"
              rows={3}
              placeholder="Customer notification"
              value={quote.customerNotification || ""}
              onChange={(event) => updateQuote(quote.id, { customerNotification: event.target.value })}
            />

            {isInsurance ? (
              <div className="admin-send-actions">
                <button className="button ghost" type="button" onClick={() => updateQuote(quote.id, {
                  status: "Awaiting Payment",
                  quotePaymentStatus: "Payment requested",
                  paymentLink: quote.paymentLink || defaultQuoteLink(quote.id, quoteFee),
                  invoiceNumber: quote.invoiceNumber || invoiceNumber(quote.id),
                  invoiceIssuedAt: quote.invoiceIssuedAt || new Date().toISOString(),
                  invoiceStatus: "SMTP not configured",
                  customerNotification: `Your insurance quote request has been approved. Please pay the ${quoteFee} quote fee. We will confirm payment and then release your final itemized repair quote PDF.`
                })}>Approve + request payment</button>
                <button className="button primary" type="button" disabled={quote.quotePaymentStatus !== "Payment submitted" && quote.quotePaymentStatus !== "Paid"} onClick={() => updateQuote(quote.id, {
                  status: "Completed",
                  quotePaymentStatus: "Paid",
                  invoiceStatus: "Website updated",
                  invoiceNumber: quote.invoiceNumber || invoiceNumber(quote.id),
                  paymentConfirmedAt: new Date().toISOString(),
                  pdfReleasedAt: new Date().toISOString(),
                  customerNotification: "Payment received. Your formal insurance quote PDF is ready to download."
                })}>Confirm payment + release PDF</button>
              </div>
            ) : (
              <div className="admin-controls">
                <input placeholder="Admin notes" value={quote.adminNotes || ""} onChange={(event) => updateQuote(quote.id, { adminNotes: event.target.value })} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
