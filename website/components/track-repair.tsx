"use client";

import { useState } from "react";
import { findRepair, updateBooking, updateQuote, type Booking, type QuoteRequest } from "@/lib/local-store";

const customerSteps = [
  "Request sent",
  "Deposit",
  "Pickup booked",
  "Device with Casey",
  "Repair",
  "Return",
  "Complete"
];

function isBooking(result: ReturnType<typeof findRepair> | null): result is Booking {
  return Boolean(result && "preferredDate" in result);
}

function isQuote(result: ReturnType<typeof findRepair> | null): result is QuoteRequest {
  return Boolean(result && "repairNeeded" in result && !("preferredDate" in result));
}

function activeStep(status: string) {
  if (["Pending Approval", "Submitted"].includes(status)) return "Request sent";
  if (["Deposit Requested", "Deposit Paid"].includes(status)) return "Deposit";
  if (["Pickup Booked", "On Route to Customer", "Device Picked Up"].includes(status)) return "Pickup booked";
  if (status === "Device Received") return "Device with Casey";
  if (status === "Repairing") return "Repair";
  if (["Fixed - Return Scheduled", "Out for Delivery", "Delivered - Balance Due"].includes(status)) return "Return";
  if (["Paid and Collected", "Completed"].includes(status)) return "Complete";
  return "Request sent";
}

function moneyValue(value?: string) {
  const parsed = Number((value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function moneyFromNumber(value: number) {
  return `$${Math.max(0, value).toFixed(value % 1 === 0 ? 0 : 2)}`;
}

function remainingBalance(result: Booking) {
  return result.balanceAmount || moneyFromNumber(moneyValue(result.quotedPrice) - moneyValue(result.depositAmount));
}

function displayEta(value?: string) {
  if (!value) return "To be confirmed";
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

function pdfEscape(value?: string) {
  return (value || "").replace(/[\\()]/g, "\\$&").replace(/\r?\n/g, " ");
}

function money(value?: string) {
  const clean = (value || "").trim();
  return clean.startsWith("$") ? clean : clean ? `$${clean}` : "$0";
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

function parseRepairItems(value?: string, fallbackPart?: string, fallbackCost?: string) {
  const items = (value || "")
    .split(/\r?\n/)
    .map(parseRepairLine)
    .filter((item) => item.part);

  if (items.length > 0) return items;
  if (fallbackPart || fallbackCost) return [{ part: fallbackPart || "Assessed device repair", cost: fallbackCost || "$0" }];
  return [];
}

function repairItemsTotal(items: { cost: string }[], fallback?: string) {
  const total = items.reduce((sum, item) => sum + moneyValue(item.cost), 0);
  return total > 0 ? moneyFromNumber(total) : money(fallback || "0");
}

function pdfDate(value?: string) {
  if (!value) return "";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-AU");
}

function downloadInsurancePdf(quote: QuoteRequest) {
  const issued = quote.invoiceIssuedAt ? new Date(quote.invoiceIssuedAt) : new Date();
  const issuedText = issued.toLocaleDateString("en-AU");
  const invoiceNo = quote.invoiceNumber || `INV-${quote.id.replace(/\D/g, "").slice(-6)}`;
  const validUntil = pdfDate(quote.quoteValidUntil) || "30 days from issue";
  const allRepairItems = parseRepairItems(quote.repairItems, quote.repairNeeded || "Assessed device repair", quote.quotedPrice || "0");
  const repairItems = allRepairItems.slice(0, 5);
  const amount = repairItemsTotal(allRepairItems, quote.quotedPrice);
  const lines: string[] = [];
  const draw = (cmd: string) => lines.push(cmd);
  const text = (x: number, y: number, value: string, size = 10, font = "F1", color = "0 0 0") => {
    draw(`${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${pdfEscape(value)}) Tj ET`);
  };
  const rect = (x: number, y: number, w: number, h: number, color: string) => draw(`${color} rg ${x} ${y} ${w} ${h} re f`);
  const strokeRect = (x: number, y: number, w: number, h: number, color = "0.86 0.88 0.91") => draw(`${color} RG ${x} ${y} ${w} ${h} re S`);
  const circle = (x: number, y: number, r: number, color: string) => {
    const c = r * 0.5522847498;
    draw(`${color} rg ${x + r} ${y} m ${x + r} ${y + c} ${x + c} ${y + r} ${x} ${y + r} c ${x - c} ${y + r} ${x - r} ${y + c} ${x - r} ${y} c ${x - r} ${y - c} ${x - c} ${y - r} ${x} ${y - r} c ${x + c} ${y - r} ${x + r} ${y - c} ${x + r} ${y} c f`);
  };
  const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
    const c = r * 0.5522847498;
    return `${x + r} ${y} m ${x + w - r} ${y} l ${x + w - r + c} ${y} ${x + w} ${y + r - c} ${x + w} ${y + r} c ${x + w} ${y + h - r} l ${x + w} ${y + h - r + c} ${x + w - r + c} ${y + h} ${x + w - r} ${y + h} c ${x + r} ${y + h} l ${x + r - c} ${y + h} ${x} ${y + h - r + c} ${x} ${y + h - r} c ${x} ${y + r} l ${x} ${y + r - c} ${x + r - c} ${y} ${x + r} ${y} c`;
  };

  rect(0, 748, 595, 94, "1 1 1");
  rect(0, 740, 595, 8, "0.64 0.90 0.13");
  circle(64, 795, 32, "0.12 0.12 0.14");
  draw(`1 1 1 RG 2.7 w ${roundedRectPath(54.7, 779, 18.7, 32, 6.7)} S`);
  draw("0.64 0.90 0.13 rg 66 803 m 58.7 791 l 64 791 l 61.3 781.7 l 70.7 795.7 l 65.3 795.7 l 66 803 l f");
  text(108, 804, "CASEY", 28, "F2", "0.08 0.08 0.11");
  text(110, 784, "PHONE & TECH REPAIRS", 10, "F2", "0.38 0.43 0.51");
  rect(392, 780, 160, 34, "0.08 0.08 0.11");
  rect(392, 776, 160, 4, "0.64 0.90 0.13");
  text(408, 798, "INSURANCE QUOTE", 12, "F2", "1 1 1");
  text(408, 785, `Invoice ${invoiceNo}`, 8, "F1", "0.82 0.86 0.92");

  text(42, 710, "Final Itemized Repair Quote", 20, "F2");
  text(42, 692, "Prepared from submitted device photos and claim details", 10, "F1", "0.38 0.43 0.51");
  rect(392, 672, 160, 52, "0.95 0.98 0.91");
  strokeRect(392, 672, 160, 52, "0.75 0.88 0.46");
  text(408, 704, "Final repair total", 10, "F2", "0.24 0.32 0.13");
  text(408, 682, amount, 24, "F2", "0.08 0.08 0.11");

  const leftRows = [
    ["Reference", quote.id],
    ["Issued", issuedText],
    ["Valid until", validUntil],
    ["Payment status", "Paid / confirmed"]
  ];
  const rightRows = [
    ["Business", "Casey Phone & Tech Repairs"],
    ["ABN", "To be added"],
    ["Address", "To be added"],
    ["Email", "To be added"]
  ];
  text(42, 640, "Document details", 13, "F2");
  text(316, 640, "Business details", 13, "F2");
  leftRows.forEach(([label, value], index) => {
    const y = 616 - index * 22;
    text(42, y, label, 9, "F2", "0.38 0.43 0.51");
    text(140, y, value, 10);
  });
  rightRows.forEach(([label, value], index) => {
    const y = 616 - index * 22;
    text(316, y, label, 9, "F2", "0.38 0.43 0.51");
    text(392, y, value, 10);
  });

  rect(42, 506, 511, 24, "0.95 0.98 0.91");
  text(54, 513, "CUSTOMER AND DEVICE", 11, "F2", "0.24 0.32 0.13");
  const detailRows = [
    ["Customer", quote.customerName],
    ["Phone", quote.phone],
    ["Email", quote.email],
    ["Address", quote.address || "Not provided"],
    ["Device", quote.device],
    ["IMEI", quote.imei || "Not provided"],
    ["Serial", quote.serialNumber || "Not provided"]
  ];
  detailRows.forEach(([label, value], index) => {
    const y = 482 - index * 20;
    text(54, y, label, 9, "F2", "0.38 0.43 0.51");
    text(150, y, value.slice(0, 58), 10);
  });

  rect(42, 320, 511, 24, "0.95 0.98 0.91");
  text(54, 327, "DAMAGE ASSESSMENT", 11, "F2", "0.24 0.32 0.13");
  text(54, 296, "Reported damage", 9, "F2", "0.38 0.43 0.51");
  text(170, 296, (quote.accidentDescription || quote.issueDetails || "Not provided").slice(0, 72), 10);
  text(54, 272, "Assessment notes", 9, "F2", "0.38 0.43 0.51");
  text(170, 272, (quote.assessmentNotes || "Assessment based on submitted customer details and device images.").slice(0, 72), 10);
  text(54, 248, "Photos supplied", 9, "F2", "0.38 0.43 0.51");
  text(170, 248, quote.photoNames?.length ? `${quote.photoNames.length} image file(s)` : "Not supplied", 10);

  rect(42, 214, 511, 26, "0.08 0.08 0.11");
  rect(42, 210, 511, 4, "0.64 0.90 0.13");
  text(54, 223, "ITEMIZED FINAL REPAIR QUOTE", 11, "F2", "1 1 1");
  rect(42, 188, 511, 22, "0.95 0.98 0.91");
  text(54, 195, "Part / repair required", 9, "F2", "0.24 0.32 0.13");
  text(462, 195, "Cost", 9, "F2", "0.24 0.32 0.13");
  repairItems.forEach((item, index) => {
    const y = 170 - index * 16;
    strokeRect(42, y - 5, 511, 16, index % 2 === 0 ? "0.90 0.92 0.95" : "0.95 0.96 0.98");
    text(54, y, item.part.slice(0, 56), 9);
    text(462, y, money(item.cost), 9, "F2");
  });
  rect(42, 78, 511, 40, "0.08 0.08 0.11");
  rect(42, 78, 6, 40, "0.64 0.90 0.13");
  text(60, 101, "FINAL REPAIR TOTAL", 9, "F2", "1 1 1");
  text(456, 96, amount, 18, "F2", "0.64 0.90 0.13");

  text(42, 54, "Declaration", 11, "F2");
  text(42, 39, "This is Casey Phone & Tech Repairs' final repair assessment based on submitted device photos and details.", 7, "F1", "0.38 0.43 0.51");
  text(42, 27, "Prepared for insurance claim review. This document is not an insurer approval.", 7, "F1", "0.38 0.43 0.51");
  text(350, 27, "Authorised signature: ______________________", 7);

  const content = lines.join("\n");
  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj ${stream} endobj`,
    "6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj"
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quote.id}-insurance-quote.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

function InsuranceItemizedBreakdown({ quote }: { quote: QuoteRequest }) {
  const items = parseRepairItems(quote.repairItems, quote.repairNeeded || "Assessed device repair", quote.quotedPrice || "0");
  const total = repairItemsTotal(items, quote.quotedPrice);

  return (
    <div className="insurance-itemized-panel">
      <div className="record-head">
        <div>
          <p className="eyebrow">Final assessment</p>
          <h3>Parts and repair cost</h3>
        </div>
        <strong>{total}</strong>
      </div>
      <div className="insurance-itemized-list">
        {items.map((item, index) => (
          <div key={`${item.part}-${index}`}>
            <span>{item.part}</span>
            <strong>{money(item.cost)}</strong>
          </div>
        ))}
        <div className="insurance-itemized-total">
          <span>Final repair total</span>
          <strong>{total}</strong>
        </div>
      </div>
      <p className="muted">This final assessment is prepared from the submitted device photos and details.</p>
    </div>
  );
}

export function TrackRepair() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<ReturnType<typeof findRepair> | null | undefined>();

  function track() {
    setResult(findRepair(reference));
  }

  function payAndReturn(type: "deposit" | "balance") {
    if (!isBooking(result)) return;
    if (result.paymentLink) {
      window.open(result.paymentLink, "_blank", "noopener,noreferrer");
    }
    const changes =
      type === "deposit"
        ? {
            status: "Deposit Paid" as const,
            paymentStatus: "Deposit paid" as const,
            notificationStatus: "Website updated" as const,
            customerNotification: "Deposit payment received. Casey Repairs will confirm pickup/onsite timing next."
          }
        : {
            status: "Paid and Collected" as const,
            paymentStatus: "Fully paid" as const,
            notificationStatus: "Website updated" as const,
            customerNotification: "Final payment received. Your repair workflow is complete."
          };
    updateBooking(result.id, changes);
    setResult(findRepair(result.id));
  }

  function payInsuranceQuote(quote: QuoteRequest) {
    if (quote.paymentLink) {
      window.open(quote.paymentLink, "_blank", "noopener,noreferrer");
    }
    updateQuote(quote.id, {
      quotePaymentStatus: "Payment submitted",
      status: "Awaiting Payment",
      invoiceStatus: "Website updated",
      paymentSubmittedAt: new Date().toISOString(),
      customerNotification: "Payment submitted. Casey Repairs will confirm receipt and then release your formal insurance quote PDF."
    });
    setResult(findRepair(quote.id));
  }

  return (
    <div className="auth-card track-card-shell">
      <div className="form-grid">
        <div className="field light-field">
          <label>Repair or quote reference</label>
          <input placeholder="CPTR-123456 or QUOTE-123456" value={reference} onChange={(event) => setReference(event.target.value)} />
        </div>
        <button className="button primary" type="button" onClick={track}>Track repair</button>
      </div>

      {result === null && <p className="muted">No matching repair found in this browser.</p>}
      {result && (
        <article className="card tracking-card">
          <div className="record-head">
            <div>
              <p className="eyebrow">{result.id}</p>
              <h3>{result.device}</h3>
            </div>
            <span className="status-pill">{result.status}</span>
          </div>
          {"quotedPrice" in result && result.quotedPrice && <p><strong>Quote:</strong> {result.quotedPrice}</p>}
          {result.adminNotes && <p><strong>Notes:</strong> {result.adminNotes}</p>}

          {isBooking(result) && (
            <>
              <div className="customer-alert">
                <strong>Latest update</strong>
                <p>{result.customerNotification || "Your request is with Casey Repairs. The next update will appear here."}</p>
                {result.notificationStatus && <small>{result.notificationStatus}</small>}
              </div>

              <div className="tracking-meta-grid">
                <div><span>Service</span><strong>{result.serviceType || "Workshop booking"}</strong></div>
                <div><span>Pickup ETA</span><strong>{displayEta(result.pickupEta)}</strong></div>
                <div><span>Drop-off ETA</span><strong>{displayEta(result.returnEta)}</strong></div>
                <div><span>Payment</span><strong>{result.paymentStatus || "No payment requested"}</strong></div>
              </div>

              <div className="customer-balance-panel">
                <div><span>Total repair amount</span><strong>{result.quotedPrice || "Waiting for admin"}</strong></div>
                <div><span>Deposit</span><strong>{result.depositAmount || "$50"}</strong></div>
                <div><span>Remaining balance</span><strong>{remainingBalance(result)}</strong></div>
              </div>

              <div className="customer-progress">
                {customerSteps.map((step) => (
                  <span className={step === activeStep(result.status) ? "active" : ""} key={step}>{step}</span>
                ))}
              </div>

              {result.paymentStatus === "Deposit requested" && (
                <div className="payment-panel">
                  <div>
                    <p className="eyebrow">Deposit required</p>
                    <h3>{result.depositAmount || "$50"}</h3>
                    <p>Pay the deposit to confirm the booking. Remaining balance after deposit: {remainingBalance(result)}.</p>
                  </div>
                  <button className="button primary" type="button" onClick={() => payAndReturn("deposit")}>
                    Pay deposit with Stripe
                  </button>
                </div>
              )}

              {result.paymentStatus === "Balance requested" && (
                <div className="payment-panel">
                  <div>
                    <p className="eyebrow">Final balance</p>
                    <h3>{remainingBalance(result)}</h3>
                    <p>Pay the remaining balance before delivery completion or collection handover.</p>
                  </div>
                  <button className="button primary" type="button" onClick={() => payAndReturn("balance")}>
                    Pay balance with Stripe
                  </button>
                </div>
              )}

              {result.photoNames && result.photoNames.length > 0 && <p className="muted">Photos attached: {result.photoNames.join(", ")}</p>}
            </>
          )}
          {isQuote(result) && result.quoteType === "Insurance quote" && (
            <div className="insurance-track-panel">
              <div className="customer-alert">
                <strong>Insurance quote update</strong>
                <p>{result.customerNotification || "Your insurance quote request is being reviewed."}</p>
                {result.invoiceStatus && <small>{result.invoiceStatus}</small>}
              </div>
              <div className="tracking-meta-grid">
                <div><span>Quote fee</span><strong>{result.quoteFee || "$39"}</strong></div>
                <div><span>Payment</span><strong>{result.quotePaymentStatus || "Not requested"}</strong></div>
                <div><span>Document</span><strong>{result.quotePaymentStatus === "Paid" ? "Ready" : "Pending"}</strong></div>
                <div><span>Reference</span><strong>{result.id}</strong></div>
              </div>
              <InsuranceItemizedBreakdown quote={result} />
              {result.quotePaymentStatus === "Payment requested" && (
                <div className="payment-panel">
                  <div><p className="eyebrow">Payment required</p><h3>{result.quoteFee || "$39"}</h3><p>Pay the quote fee, then submit it for admin confirmation.</p></div>
                  <button className="button primary" type="button" onClick={() => payInsuranceQuote(result)}>Pay / submit payment</button>
                </div>
              )}
              {result.quotePaymentStatus === "Payment submitted" && (
                <div className="customer-alert">
                  <strong>Waiting for payment confirmation</strong>
                  <p>Admin will confirm payment received before the PDF is released.</p>
                </div>
              )}
              {result.quotePaymentStatus === "Paid" && (
                <button className="button primary" type="button" onClick={() => downloadInsurancePdf(result)}>Download insurance quote PDF</button>
              )}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
