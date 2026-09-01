"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { createBooking } from "@/lib/local-store";
import type { RefurbishedDevice } from "@/lib/refurbished-stock";

type CheckoutDetails = {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: "Delivery" | "Pickup";
  address: string;
  suburb: string;
  postcode: string;
  notes: string;
};

const addOns = [
  { id: "glass", title: "Glass screen protector", price: 25, text: "Fitted before handover." },
  { id: "cover", title: "Protective cover", price: 29, text: "Matched to the device where available." },
  { id: "charger", title: "Charging kit", price: 35, text: "Cable and wall adapter option." },
  { id: "setup", title: "Data transfer setup", price: 39, text: "Help moving photos, contacts and apps." }
];

const pageSize = 12;

function dollars(value: number) {
  return `$${value.toLocaleString("en-AU")}`;
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function RefurbishedShop({ devices }: { devices: RefurbishedDevice[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<RefurbishedDevice | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [orderReference, setOrderReference] = useState("");
  const [details, setDetails] = useState<CheckoutDetails>({
    name: "",
    email: "",
    phone: "",
    deliveryMethod: "Delivery",
    address: "",
    suburb: "",
    postcode: "",
    notes: ""
  });

  const categories = useMemo(() => ["All", ...Array.from(new Set(devices.map((device) => device.category)))], [devices]);
  const conditions = useMemo(() => ["All", ...Array.from(new Set(devices.map((device) => device.condition))).slice(0, 8)], [devices]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return devices.filter((device) => {
      const matchesCategory = category === "All" || device.category === category;
      const matchesCondition = condition === "All" || device.condition === condition;
      const matchesQuery =
        !needle ||
        [device.title, device.brand, device.condition, device.sku, device.category].some((value) =>
          value.toLowerCase().includes(needle)
        );
      return matchesCategory && matchesCondition && matchesQuery;
    });
  }, [category, condition, devices, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleDevices = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selectedAddOnItems = addOns.filter((item) => selectedAddOns.includes(item.id));
  const addOnTotal = selectedAddOnItems.reduce((total, item) => total + item.price, 0);
  const checkoutTotal = (selected?.caseyPrice || 0) + addOnTotal;

  function updateFilter(next: () => void) {
    next();
    setPage(1);
  }

  function openCheckout(device: RefurbishedDevice) {
    setSelected(device);
    setCheckoutStep(1);
    setSelectedAddOns([]);
    setOrderReference("");
  }

  function toggleAddOn(id: string) {
    setSelectedAddOns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function confirmOrder(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!selected || !details.name || !details.email || !details.phone) return;
    const booking = createBooking({
      customerName: details.name,
      email: details.email,
      phone: details.phone,
      device: selected.title,
      issue: `Refurbished device purchase${selectedAddOnItems.length ? ` with ${selectedAddOnItems.map((item) => item.title).join(", ")}` : ""}`,
      preferredDate: new Date().toISOString().slice(0, 10),
      preferredTime: "Online order",
      serviceType: details.deliveryMethod === "Delivery" ? "Pickup and return" : "Workshop booking",
      address: details.address,
      suburb: details.suburb,
      postcode: details.postcode,
      accessNotes: details.notes,
      quotedPrice: dollars(checkoutTotal),
      paymentStatus: "Fully paid",
      depositAmount: dollars(checkoutTotal),
      balanceAmount: "$0",
      paymentLink: "Stripe checkout will be connected before launch",
      adminNotes: `Refurbished order. Device source cost ${dollars(selected.sourcePrice)}. Casey margin $50. Add-ons: ${selectedAddOnItems.map((item) => item.title).join(", ") || "None"}.`,
      customerNotification: `Payment received for ${selected.title}. Casey Repairs will confirm stock, prepare the device and update delivery or pickup timing.`
    });
    setOrderReference(booking.id);
    setCheckoutStep(3);
  }

  return (
    <section className="refurb-shop-section">
      <div className="container">
        <div className="refurb-shop-head">
          <div>
            <p className="eyebrow">Ready to buy</p>
            <h2>Choose a checked device and complete the order in minutes.</h2>
          </div>
          <div className="refurb-shop-metrics">
            <strong>{devices.length}</strong>
            <span>devices imported</span>
          </div>
        </div>

        <div className="refurb-shop-toolbar">
          <label className="refurb-search">
            <span>Search stock</span>
            <input
              value={query}
              onChange={(event) => updateFilter(() => setQuery(event.target.value))}
              placeholder="iPhone 13, Samsung, MacBook, iPad..."
            />
          </label>
          <div className="refurb-toolbar-filters">
            <select value={category} onChange={(event) => updateFilter(() => setCategory(event.target.value))}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={condition} onChange={(event) => updateFilter(() => setCondition(event.target.value))}>
              {conditions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="refurb-chip-row">
          {["iPhone", "Samsung", "Google Pixel", "iPad", "MacBook", "Laptop"].map((item) => (
            <button key={item} type="button" onClick={() => updateFilter(() => setQuery(item))}>{item}</button>
          ))}
        </div>

        <div className="refurb-result-line">
          <span>Showing {visibleDevices.length} of {filtered.length} matching devices</span>
          <span>Every listed price includes Casey setup support and a $50 handling margin.</span>
        </div>

        <div className="refurb-product-grid refurb-shop-grid">
          {visibleDevices.map((device, index) => (
            <article
              className="refurb-product-card refurb-shop-card"
              key={device.id}
              style={{ "--delay": `${index * 35}ms` } as CSSProperties}
            >
              <div className="refurb-product-image">
                <img src={device.image} alt={device.title} loading="lazy" />
                <span>{device.category}</span>
              </div>
              <div className="refurb-product-body">
                <div className="refurb-card-kicker">
                  <p className="eyebrow">{device.condition}</p>
                  <small>{device.stock}</small>
                </div>
                <h3>{device.title}</h3>
                <div className="refurb-price-row">
                  <div>
                    <span>Casey price</span>
                    <strong>{dollars(device.caseyPrice)}</strong>
                  </div>
                  <div>
                    <span>Warranty</span>
                    <strong>{device.warranty}</strong>
                  </div>
                </div>
                <p className="muted">Checked, prepared and ready for pickup or delivery after stock confirmation.</p>
                <button className="button primary" type="button" onClick={() => openCheckout(device)}>
                  Buy now
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="refurb-pagination">
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
            Next
          </button>
        </div>
      </div>

      {selected && (
        <div className="shop-drawer-backdrop" role="dialog" aria-modal="true" aria-label="Refurbished checkout">
          <div className="shop-drawer">
            <div className="shop-drawer-head">
              <div>
                <p className="eyebrow">Checkout</p>
                <h2>{selected.title}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close checkout">Close</button>
            </div>

            <div className="shop-stepper">
              {["Extras", "Delivery", "Confirm"].map((item, index) => (
                <span className={checkoutStep === index + 1 ? "active" : ""} key={item}>{item}</span>
              ))}
            </div>

            {checkoutStep === 1 && (
              <div className="shop-step-panel">
                <div className="shop-selected-device">
                  <img src={selected.image} alt="" />
                  <div>
                    <strong>{dollars(selected.caseyPrice)}</strong>
                    <span>{selected.condition} · {selected.warranty}</span>
                  </div>
                </div>
                <h3>Add protection or skip.</h3>
                <div className="shop-addon-grid">
                  {addOns.map((item) => (
                    <button
                      className={selectedAddOns.includes(item.id) ? "selected" : ""}
                      key={item.id}
                      type="button"
                      onClick={() => toggleAddOn(item.id)}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                      <em>+{dollars(item.price)}</em>
                    </button>
                  ))}
                </div>
                <div className="shop-drawer-actions">
                  <button className="button ghost" type="button" onClick={() => setSelectedAddOns([])}>Skip extras</button>
                  <button className="button primary" type="button" onClick={() => setCheckoutStep(2)}>Continue to delivery</button>
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              <form className="shop-step-panel" onSubmit={confirmOrder}>
                <h3>Delivery details</h3>
                <div className="shop-method-toggle">
                  {(["Delivery", "Pickup"] as const).map((item) => (
                    <button
                      className={details.deliveryMethod === item ? "selected" : ""}
                      key={item}
                      type="button"
                      onClick={() => setDetails((current) => ({ ...current, deliveryMethod: item }))}
                    >
                      {item === "Delivery" ? "Deliver to me" : "I will pick up"}
                    </button>
                  ))}
                </div>
                <div className="shop-form-grid">
                  <label>Full name<input required value={details.name} onChange={(event) => setDetails((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label>Email<input required type="email" value={details.email} onChange={(event) => setDetails((current) => ({ ...current, email: event.target.value }))} /></label>
                  <label>Phone<input required value={details.phone} onChange={(event) => setDetails((current) => ({ ...current, phone: event.target.value }))} /></label>
                  <label>Suburb<input value={details.suburb} onChange={(event) => setDetails((current) => ({ ...current, suburb: event.target.value }))} /></label>
                  <label className="wide">Delivery address<input disabled={details.deliveryMethod === "Pickup"} value={details.address} onChange={(event) => setDetails((current) => ({ ...current, address: event.target.value }))} placeholder={details.deliveryMethod === "Pickup" ? "Pickup address will be added later" : "Street address"} /></label>
                  <label>Postcode<input value={details.postcode} onChange={(event) => setDetails((current) => ({ ...current, postcode: event.target.value }))} /></label>
                  <label className="wide">Notes<textarea value={details.notes} onChange={(event) => setDetails((current) => ({ ...current, notes: event.target.value }))} placeholder="Preferred delivery time, setup help, colour preference..." /></label>
                </div>
                <div className="shop-total-panel">
                  <div><span>Device</span><strong>{dollars(selected.caseyPrice)}</strong></div>
                  <div><span>Extras</span><strong>{dollars(addOnTotal)}</strong></div>
                  <div><span>Total</span><strong>{dollars(checkoutTotal)}</strong></div>
                </div>
                <div className="shop-drawer-actions">
                  <button className="button ghost" type="button" onClick={() => setCheckoutStep(1)}>Back</button>
                  <button className="button primary" type="submit">Pay and confirm order</button>
                </div>
              </form>
            )}

            {checkoutStep === 3 && (
              <div className="shop-step-panel shop-confirmation">
                <div className="confirmation-mark">{initials(selected.title)}</div>
                <h3>Order confirmed.</h3>
                <p>Your payment has been recorded in this local checkout flow. Casey Repairs will confirm stock and prepare delivery or pickup.</p>
                <div className="shop-total-panel">
                  <div><span>Reference</span><strong>{orderReference || "Pending"}</strong></div>
                  <div><span>Total paid</span><strong>{dollars(checkoutTotal)}</strong></div>
                  <div><span>Balance</span><strong>$0</strong></div>
                </div>
                <button className="button primary" type="button" onClick={() => setSelected(null)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
