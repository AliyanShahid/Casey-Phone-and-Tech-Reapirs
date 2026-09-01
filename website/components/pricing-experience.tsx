"use client";

import { useEffect, useMemo, useState } from "react";
import { createQuery, getStore, subscribeStore, type CustomerQuery, type PriceItem } from "@/lib/local-store";

const filters = ["All", "Screen", "Battery", "Charging", "Motherboard", "Water", "Diagnostic"];
const pageSize = 12;

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const synonyms: Record<string, string[]> = {
  speaker: ["loud speaker", "earpiece speaker", "ear peace"],
  earpiece: ["earpiece", "ear peace"],
  backglass: ["back glass"],
  port: ["charging port"],
  charge: ["charging", "charging port", "charging ic"],
  data: ["data recovery"],
  power: ["power button", "no power"],
  camera: ["rear camera", "front camera", "camera glass"]
};

export function PricingExperience() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [unknownResult, setUnknownResult] = useState<CustomerQuery | null>(null);

  useEffect(() => {
    setPrices(getStore().prices);
    return subscribeStore(() => setPrices(getStore().prices));
  }, []);

  const filtered = useMemo(() => {
    const q = normalise(query);
    const expandedTerms = q
      ? q.split(" ").flatMap((term) => [term, ...(synonyms[term] || [])]).map(normalise)
      : [];
    return prices.filter((price) => {
      const haystack = normalise(`${price.device} ${price.repair} ${price.availability}`);
      const matchesQuery = !q || expandedTerms.every((term) => haystack.includes(term) || term.includes(haystack));
      const matchesFilter =
        filter === "All" ||
        haystack.includes(filter.toLowerCase()) ||
        (filter === "Diagnostic" && price.availability === "Diagnostic only");
      return matchesQuery && matchesFilter;
    });
  }, [prices, query, filter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateFilter(value: string) {
    setFilter(value);
    setPage(1);
  }

  function submitUnknownQuote(formData: FormData) {
    const issue = String(formData.get("issue") || "");
    const visibleInfo = String(formData.get("visibleInfo") || "");
    const query = createQuery({
      customerName: String(formData.get("customerName") || "Pricing page customer"),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      device: String(formData.get("device") || "Unknown device"),
      issue: issue || "Unknown repair",
      visibleInfo: visibleInfo || "Not provided"
    });
    setUnknownResult(query);
  }

  return (
    <main className="repair-cost-page">
      <section className="repair-cost-shell">
        <div className="container">
          <div className="repair-cost-panel">
            <div className="repair-cost-hero">
              <div>
                <p className="eyebrow">Repair Cost Pricing</p>
                <h1>Find repair cost estimates in one place.</h1>
                <p>
                  Search device repair costs, compare estimated turnaround, check warranty,
                  and see whether the job needs diagnostic approval before work starts.
                </p>
              </div>
              <div className="cost-scanner" aria-hidden="true">
                <span className="scanner-ring one" />
                <span className="scanner-ring two" />
                <div className="scanner-core">
                  <strong>LIVE</strong>
                  <span>cost scanner</span>
                </div>
              </div>
            </div>

            <div className="cost-search-bar">
              <div className="cost-search-input">
                <span>Search</span>
                <input
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Try: Oppo Reno screen, S8 battery, S26 Ultra charging, backglass, data recovery..."
              />
              </div>
              <div className="price-filters">
                {filters.map((item) => (
                  <button
                    className={filter === item ? "active" : ""}
                    key={item}
                    type="button"
                  onClick={() => updateFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="cost-layout">
              <aside className="cost-sidebar">
                <h3>Pricing rules</h3>
                <p>These are estimates only. Final price is confirmed after inspection.</p>
                <ul>
                  <li>No repair starts without approval.</li>
                  <li>Warranty is confirmed before handover.</li>
                  <li>Board-level faults need diagnostic review.</li>
                </ul>
                <div className="model-help">
                  <h3>Don’t know your model?</h3>
                  <p>Try these quick checks:</p>
                  <ol>
                    <li>iPhone: Settings → General → About → Model Name.</li>
                    <li>Samsung/Android: Settings → About phone → Model name.</li>
                    <li>If the phone won’t turn on, check the box, receipt, SIM tray, or back cover.</li>
                  </ol>
                </div>
              </aside>

              <section className="cost-results">
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    <h3>No matching prices yet</h3>
                    <p>Add or edit prices from the admin dashboard.</p>
                  </div>
                ) : (
                  paginated.map((price, index) => (
                    <article
                      className="cost-card"
                      key={price.id}
                      style={{ "--delay": `${index * 55}ms` } as React.CSSProperties}
                    >
                      <div>
                        <p className="eyebrow">{price.device}</p>
                        <h3>{price.repair}</h3>
                        <span>{price.time} · {price.warranty}</span>
                      </div>
                      <div className="cost-price">
                        <strong className={price.availability.includes("Diagnostic") ? "diagnostic-price" : ""}>{price.priceRange}</strong>
                        <em className={price.availability.includes("Diagnostic") ? "diagnostic-badge" : ""}>{price.availability}</em>
                      </div>
                    </article>
                  ))
                )}
              </section>
            </div>
            <div className="pagination-bar">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
              </span>
              <div>
                <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
                <strong>Page {currentPage} of {totalPages}</strong>
                <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
              </div>
            </div>
            <section className="unknown-device-panel">
              <div>
                <p className="eyebrow">Can’t find it?</p>
                <h2>Request a custom repair cost check</h2>
                <p>
                  If the device or issue is not listed, send the details here. Admin will
                  review it and reply with a proper estimate.
                </p>
                <p className="call-placeholder">
                  If you don’t know anything about the device, give us a call:
                  <strong> Phone number coming soon</strong>
                </p>
              </div>
              {unknownResult ? (
                <div className="auth-alert success">
                  <span>Query sent: {unknownResult.id}. Email notification is queued for SMTP setup.</span>
                </div>
              ) : (
                <form action={submitUnknownQuote} className="unknown-device-form">
                  <input name="customerName" placeholder="Name" required />
                  <input name="email" type="email" placeholder="Email" required />
                  <input name="phone" placeholder="Australian mobile" required />
                  <input name="device" placeholder="Device if known, e.g. black Samsung" />
                  <input name="issue" placeholder="Issue, e.g. not charging, cracked screen" required />
                  <textarea name="visibleInfo" rows={3} placeholder="What can you see? Brand logo, model code, IMEI, colour, screen size, anything on the back..." />
                  <button className="button primary" type="submit">Request custom estimate</button>
                </form>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
