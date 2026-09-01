"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createBooking } from "@/lib/local-store";
import {
  emptyCustomRepairCatalog,
  findManagedRepair,
  mergeRepairBrands,
  readCustomRepairCatalog,
  repairsForDevice,
  subscribeCustomRepairCatalog,
  type CustomRepairCatalog
} from "@/lib/custom-repair-catalog";
import {
  findBrand,
  findDevice,
  repairBrands,
  type RepairBrand,
  type RepairChoice,
  type RepairDevice,
  type RepairOption
} from "@/lib/repair-flow-data";

type ServiceMethod = "mail" | "pickup" | "visit";
type SelectedRepairItem = {
  key: string;
  option: RepairOption;
  choice?: RepairChoice;
  price: number;
};

const serviceMethods = [
  {
    id: "mail" as const,
    title: "Mail-in your device",
    icon: "BOX",
    text: "Send from anywhere in Australia. We repair and mail it back securely.",
    fee: 0
  },
  {
    id: "pickup" as const,
    title: "We pick up",
    icon: "PIN",
    text: "Book a local pickup and return after repair. Admin confirms timing.",
    fee: 50
  },
  {
    id: "visit" as const,
    title: "Visit Casey Repairs",
    icon: "SHOP",
    text: "Come to our service point. Address will be updated before launch.",
    fee: 0
  }
];

const repairIconLabels: Record<string, string> = {
  screen: "LCD",
  battery: "BAT",
  charging: "USB",
  "back-glass": "GLS",
  diagnose: "CHK",
  water: "H2O",
  data: "DAT",
  motherboard: "PCB",
  camera: "CAM",
  speaker: "AUD",
  software: "OS"
};

const repairVisuals: Record<string, string> = {
  screen: "📱",
  battery: "🔋",
  charging: "🔌",
  "back-glass": "▧",
  diagnose: "🔎",
  water: "💧",
  data: "▤",
  motherboard: "▣",
  camera: "◉",
  speaker: "◒",
  software: "↻"
};

const repairPartImages: Record<string, string> = {
  screen: "/repair-parts/3d/screen.png",
  battery: "/repair-parts/3d/battery.png",
  charging: "/repair-parts/3d/charging.png",
  "back-glass": "/repair-parts/3d/back-glass.png",
  diagnose: "/repair-parts/3d/diagnostic.png",
  water: "/repair-parts/3d/water.png",
  data: "/repair-parts/3d/data.png",
  motherboard: "/repair-parts/3d/motherboard.png",
  camera: "/repair-parts/3d/camera.png",
  speaker: "/repair-parts/3d/speaker.png",
  software: "/repair-parts/3d/software.png"
};

function money(value: number | null | undefined) {
  if (value == null) return "Quote";
  return `$${value.toLocaleString("en-AU", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

function stars(count: number) {
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function priceForRepair(repair: RepairOption, choice?: RepairChoice) {
  return choice?.price ?? repair.price ?? 39;
}

function repairKey(option: RepairOption, choice?: RepairChoice) {
  return `${option.id}:${choice?.id || "standard"}`;
}

export function RepairFlow({
  initialBrand,
  initialDevice,
  initialRepair,
  home = false
}: {
  initialBrand?: string;
  initialDevice?: string;
  initialRepair?: string;
  home?: boolean;
}) {
  const [customCatalog, setCustomCatalog] = useState<CustomRepairCatalog>(emptyCustomRepairCatalog);
  const managedBrands = useMemo(() => mergeRepairBrands(repairBrands, customCatalog), [customCatalog]);
  const startingBrand = findBrand(initialBrand);
  const startingDevice = findDevice(initialDevice);
  const startingRepair = findManagedRepair(initialRepair, customCatalog);
  const startingChoice = startingRepair?.choices?.[0];
  const [brand, setBrand] = useState<RepairBrand>(startingBrand);
  const [deviceType, setDeviceType] = useState<RepairDevice["type"]>(startingDevice?.type || startingBrand.deviceTypes[0]);
  const [device, setDevice] = useState<RepairDevice | undefined>(startingDevice);
  const [repair, setRepair] = useState<RepairOption | undefined>(undefined);
  const [choice, setChoice] = useState<RepairChoice | undefined>(startingChoice);
  const [selectedRepairs, setSelectedRepairs] = useState<SelectedRepairItem[]>(
    startingRepair
      ? [{ key: repairKey(startingRepair, startingChoice), option: startingRepair, choice: startingChoice, price: priceForRepair(startingRepair, startingChoice) }]
      : []
  );
  const [openRepairId, setOpenRepairId] = useState<string | undefined>(startingRepair?.id);
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState<ServiceMethod>("mail");
  const [shippingLabel, setShippingLabel] = useState(true);
  const [location, setLocation] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    suburb: "",
    postcode: "",
    passcode: "",
    notes: ""
  });

  useEffect(() => {
    setCustomCatalog(readCustomRepairCatalog());
    return subscribeCustomRepairCatalog(() => setCustomCatalog(readCustomRepairCatalog()));
  }, []);

  const activeBrand = useMemo(
    () => managedBrands.find((item) => item.slug === brand.slug) || managedBrands[0],
    [brand.slug, managedBrands]
  );
  const managedRepairOptions = useMemo(() => repairsForDevice(device, customCatalog), [device, customCatalog]);
  const step = device && repair ? 3 : device ? 2 : 1;
  const visibleSeries = activeBrand.series
    .map((series) => ({ ...series, models: series.models.filter((item) => item.type === deviceType) }))
    .filter((series) => series.models.length > 0);

  const visibleModels = useMemo(() => {
    const models = visibleSeries.flatMap((series) => series.models);
    const needle = query.trim().toLowerCase();
    if (!needle) return models;
    return models.filter((item) => `${item.name} ${item.brand} ${item.type}`.toLowerCase().includes(needle));
  }, [query, visibleSeries]);

  const repairsSubtotal = selectedRepairs.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = selectedRepairs.length > 1 ? selectedRepairs.length - 1 : 0;
  const selectedPrice = Math.max(0, repairsSubtotal - bundleDiscount);
  const serviceFee = serviceMethods.find((item) => item.id === method)?.fee || 0;
  const labelFee = method === "mail" && shippingLabel ? 19.95 : 0;
  const serviceTotal = repair ? serviceFee + labelFee : 0;
  const total = selectedPrice + serviceTotal;
  const seoDeviceUrl = device ? `/repair/${device.brandSlug}/${device.slug}` : "/repair";

  function selectBrand(next: RepairBrand) {
    setBrand(next);
    setDeviceType(next.deviceTypes[0]);
    setDevice(undefined);
    setRepair(undefined);
    setChoice(undefined);
    setSelectedRepairs([]);
    setOpenRepairId(undefined);
    setQuery("");
  }

  function selectDevice(next: RepairDevice) {
    setDevice(next);
    setRepair(undefined);
    setChoice(undefined);
    setSelectedRepairs([]);
    setOpenRepairId(undefined);
  }

  function queryForSeries(seriesName: string) {
    if (seriesName === "Series Ultra") return "Ultra";
    if (seriesName === "Series SE") return "Apple Watch SE";
    if (seriesName === "1st Gen") return "1st generation";
    if (seriesName.startsWith("Series ")) return seriesName;
    return seriesName.replace(/ Series$/, "");
  }

  function selectRepair(next: RepairOption, nextChoice?: RepairChoice) {
    const nextSelectedChoice = nextChoice || next.choices?.[0];
    const key = repairKey(next, nextSelectedChoice);
    setSelectedRepairs((current) => {
      // Only one quality tier per repair option (e.g. one screen, not aftermarket + genuine at once) -
      // drop any existing selection for this option before adding the newly chosen tier.
      const withoutThisOption = current.filter((item) => item.option.id !== next.id);
      return [...withoutThisOption, { key, option: next, choice: nextSelectedChoice, price: priceForRepair(next, nextSelectedChoice) }];
    });
    setChoice(nextSelectedChoice);
    setOpenRepairId(next.choices ? next.id : undefined);
  }

  function removeRepair(key: string) {
    setSelectedRepairs((current) => current.filter((item) => item.key !== key));
  }

  function startFinalize() {
    if (!selectedRepairs.length) return;
    setRepair(selectedRepairs[0].option);
    setChoice(selectedRepairs[0].choice);
  }

  function confirmBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!device || !selectedRepairs.length || !details.name || !details.email || !details.phone) return;
    const methodLabel = serviceMethods.find((item) => item.id === method)?.title || "Mail-in your device";
    const issueSummary = selectedRepairs.map((item) => item.choice ? `${item.option.title} - ${item.choice.title}` : item.option.title).join(", ");
    const booking = createBooking({
      customerName: details.name,
      email: details.email,
      phone: details.phone,
      device: device.name,
      issue: issueSummary,
      preferredDate: new Date().toISOString().slice(0, 10),
      preferredTime: method === "visit" ? "9:00 AM - 12:00 PM" : "To be confirmed",
      serviceType: method === "pickup" ? "Door-to-door pickup" : method === "visit" ? "Workshop booking" : "Pickup and return",
      address: details.address,
      suburb: details.suburb,
      postcode: details.postcode,
      accessNotes: details.notes,
      quotedPrice: money(total),
      depositAmount: money(total),
      balanceAmount: "$0",
      paymentStatus: "Fully paid",
      adminNotes: `Repair flow booking. Service: ${methodLabel}. Location search: ${location || "Not provided"}. Shipping label: ${shippingLabel ? "Requested" : "Customer ships themselves"}. Passcode/pattern provided: ${details.passcode ? "Yes" : "No"}.`,
      customerNotification: `Payment received for ${device.name}. Casey Repairs will confirm ${methodLabel.toLowerCase()} details and keep you updated.`
    });
    setOrderReference(booking.id);
  }

  return (
    <section className={`repair-flow ${home ? "home-repair-flow" : ""} ${device ? "repair-flow-device" : ""} ${repair ? "repair-flow-final" : ""}`}>
      <div className="repair-promo">
        <span>Online repair booking</span>
        <strong>Simple device selection, clear prices and guided mail-in or local service.</strong>
        <label>
          <span>PIN</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Enter suburb or postcode..." />
        </label>
      </div>

      <div className="container">
        <div className="repair-flow-shell">
          <div className="repair-brand-row">
            {managedBrands.map((item) => (
              <button className={brand.slug === item.slug ? "active" : ""} key={item.slug} type="button" onClick={() => selectBrand(item)}>
                {item.name}
              </button>
            ))}
          </div>

          <div className="repair-stepper">
            {["Select device", "Select repair", "Finalize booking"].map((label, index) => (
              <div className={step > index ? "active" : ""} key={label}>
                <span>{step > index + 1 ? "OK" : index + 1}</span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>

          <div className="repair-flow-grid">
            <div className="repair-main-panel">
              {!device && (
                <>
                  <div className="repair-picker-head">
                    <div>
                      <p className="eyebrow">Choose your device</p>
                      <h2>{activeBrand.name} repairs</h2>
                    </div>
                    <label className="repair-model-search">
                      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search model" />
                      <span>⌕</span>
                    </label>
                  </div>

                  <div className="repair-type-tabs">
                    {activeBrand.deviceTypes.map((type) => (
                      <button className={deviceType === type ? "active" : ""} key={type} type="button" onClick={() => setDeviceType(type)}>
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="repair-series-row">
                    {visibleSeries.map((series) => (
                      <button key={series.name} type="button" onClick={() => setQuery(queryForSeries(series.name))}>
                        <img src={series.models[0]?.image} alt="" />
                        <strong>{series.name}</strong>
                        <span>{series.models.length} models</span>
                      </button>
                    ))}
                  </div>

                  <div className="repair-device-grid">
                    {visibleModels.map((model) => (
                      <Link
                        href={`/repair/${model.brandSlug}/${model.slug}`}
                        key={model.slug}
                        onClick={(event) => {
                          if (customCatalog.models.some((item) => item.slug === model.slug)) {
                            event.preventDefault();
                          }
                          selectDevice(model);
                        }}
                      >
                        <img src={model.image} alt={model.name} loading="lazy" />
                        <span>{model.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {device && !repair && (
                <>
                  <div className="repair-selected-head">
                    <div className="repair-selected-top">
                      <button className="repair-back-btn" type="button" onClick={() => setDevice(undefined)} aria-label="Back to device selection">
                        <span>←</span>
                      </button>
                      <img src={device.image} alt={device.name} />
                      <div>
                        <p className="eyebrow">{device.type} repair</p>
                        <h1>{device.name} Repair</h1>
                        <p className="repair-selected-copy">Choose the repair you need. You will see the exact booking steps after selecting an option.</p>
                      </div>
                    </div>
                    <div className="repair-trust-strip">
                      <span className="repair-trust-rating">
                        <b>4.9</b>
                        <em>★★★★★</em>
                      </span>
                      <span className="repair-trust-copy">
                        <strong>Trusted local repairs</strong>
                        <small>Rated by Casey area customers - warranty backed on every job</small>
                      </span>
                      <span className="repair-trust-warranty">1 Year Warranty</span>
                    </div>
                  </div>
                  <div className="repair-device-note">
                    <span>Clear prices before booking</span>
                    <span>Mail-in, pickup or visit</span>
                    <span>Track every update</span>
                  </div>
                  <div className="repair-selection-guide">
                    <div>
                      <p className="eyebrow">Build your repair</p>
                      <h2>Select one or more services</h2>
                      <span>Pick everything your device needs. Your repair list and total update on the right.</span>
                    </div>
                    <strong>{selectedRepairs.length ? `${selectedRepairs.length} selected` : "Multi-select enabled"}</strong>
                  </div>
                  <div className="repair-card-grid">
                    {managedRepairOptions.map((option) => (
                      <article className={`repair-option-card ${selectedRepairs.some((item) => item.option.id === option.id) ? "selected" : ""}`} key={option.id}>
                        <button
                          className="repair-option-link"
                          type="button"
                          onClick={() => option.choices ? setOpenRepairId(openRepairId === option.id ? undefined : option.id) : selectRepair(option)}
                        >
                          <span className={`repair-visual repair-visual-${option.id}`}>
                            {option.image || repairPartImages[option.id] ? (
                              <img src={option.image || repairPartImages[option.id]} alt="" loading="lazy" />
                            ) : (
                              <b>{repairVisuals[option.id] || option.icon}</b>
                            )}
                            <em className="repair-visual-tag">{repairIconLabels[option.id] || option.icon}</em>
                          </span>
                          <div>
                            <h3>{option.title}</h3>
                            <em>{option.warranty}</em>
                          </div>
                          <p className="repair-option-summary">{option.summary}</p>
                          <strong>{option.badge && <small>{option.badge}</small>}{money(option.price)}</strong>
                          <span className="repair-card-action">
                            {selectedRepairs.some((item) => item.option.id === option.id) ? "Added" : option.choices ? "Choose options" : "Add repair"}
                          </span>
                        </button>
                        {option.choices && openRepairId === option.id && (
                          <div className="repair-choice-drawer">
                            {option.choices.map((item) => {
                              const key = repairKey(option, item);
                              const isSelected = selectedRepairs.some((repairItem) => repairItem.key === key);
                              return (
                                <button className={`repair-choice-card ${isSelected ? "active" : ""}`} key={item.id} type="button" onClick={() => selectRepair(option, item)}>
                                  <span className="repair-choice-card-top">
                                    <strong>{item.title}</strong>
                                    <b>{money(item.price)}</b>
                                  </span>
                                  <p>{item.text}</p>
                                  <em className="repair-choice-stars">{stars(item.rating)}</em>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>

                  <div className="repair-why-us">
                    <article>
                      <span>CRT</span>
                      <div>
                        <strong>Certified technicians</strong>
                        <p>Every repair handled by a trained tech, not a call centre.</p>
                      </div>
                    </article>
                    <article>
                      <span>PRC</span>
                      <div>
                        <strong>Fair, upfront pricing</strong>
                        <p>The price you see is the price you pay - no surprise fees.</p>
                      </div>
                    </article>
                    <article>
                      <span>WTY</span>
                      <div>
                        <strong>1 year warranty</strong>
                        <p>Every repair on this page is covered for 12 months.</p>
                      </div>
                    </article>
                    <article>
                      <span>FST</span>
                      <div>
                        <strong>Fast turnaround</strong>
                        <p>Most repairs completed same-day once your device arrives.</p>
                      </div>
                    </article>
                  </div>
                </>
              )}

              {device && repair && (
                <form className="repair-final-panel" id="finalize" onSubmit={confirmBooking}>
                  <button className="repair-back-button" type="button" onClick={() => setRepair(undefined)}>Back to repairs</button>
                  <div>
                    <p className="eyebrow">Select service option</p>
                    <h2>How should we handle your repair?</h2>
                  </div>
                  <div className="repair-final-repairs">
                    <h3>Selected repairs</h3>
                    {selectedRepairs.map((item) => (
                      <div key={item.key}>
                        <span>{item.choice?.title || item.option.title}</span>
                        <strong>{money(item.price)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="repair-service-options">
                    {serviceMethods.map((item) => (
                      <button className={method === item.id ? "active" : ""} key={item.id} type="button" onClick={() => setMethod(item.id)}>
                        <span>{item.icon}</span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.text}</p>
                        </div>
                        <em>{item.fee ? `+${money(item.fee)}` : "Free"}</em>
                      </button>
                    ))}
                  </div>

                  {method === "mail" && (
                    <div className="mail-assist-panel">
                      <h3>Mail-in assistance</h3>
                      <p>We can generate a postage-label request for Australia Post style shipping. Real label API connection can be added later.</p>
                      <label>
                        <input type="checkbox" checked={shippingLabel} onChange={(event) => setShippingLabel(event.target.checked)} />
                        Provide me with a shipping label (+$19.95)
                      </label>
                      <div className="mail-address-card">
                        <strong>Australia-wide mail-in location</strong>
                        <span>Casey Phone & Tech Repairs, address to be added</span>
                      </div>
                    </div>
                  )}

                  {method === "visit" && (
                    <div className="mail-assist-panel">
                      <h3>Visit guidance</h3>
                      <p>{location ? `We will guide customers from ${location} to your final Casey Repairs address once added.` : "Enter a suburb or postcode above and customers can be guided to the nearest Casey location."}</p>
                      <div className="mail-address-card">
                        <strong>Workshop hours</strong>
                        <span>Available 9:00 AM to 12:00 PM. Address will be updated later.</span>
                      </div>
                    </div>
                  )}

                  <div className="repair-customer-form">
                    <label>Full name<input required value={details.name} onChange={(event) => setDetails((current) => ({ ...current, name: event.target.value }))} /></label>
                    <label>Email<input required type="email" value={details.email} onChange={(event) => setDetails((current) => ({ ...current, email: event.target.value }))} /></label>
                    <label>Mobile<input required value={details.phone} onChange={(event) => setDetails((current) => ({ ...current, phone: event.target.value }))} /></label>
                    <label>Suburb<input value={details.suburb} onChange={(event) => setDetails((current) => ({ ...current, suburb: event.target.value }))} /></label>
                    <label className="wide">Address<input value={details.address} onChange={(event) => setDetails((current) => ({ ...current, address: event.target.value }))} placeholder={method === "visit" ? "Optional for store visit" : "Street address"} /></label>
                    <label>Postcode<input value={details.postcode} onChange={(event) => setDetails((current) => ({ ...current, postcode: event.target.value }))} /></label>
                    <label>Device passcode, optional<input value={details.passcode} onChange={(event) => setDetails((current) => ({ ...current, passcode: event.target.value }))} placeholder="Only if needed for testing" /></label>
                    <label className="wide">Notes<textarea value={details.notes} onChange={(event) => setDetails((current) => ({ ...current, notes: event.target.value }))} placeholder="Colour, symptoms, best time, accessories included..." /></label>
                  </div>

                  <button className="button primary repair-pay-button" type="submit">
                    Pay and confirm booking
                  </button>
                  {orderReference && (
                    <div className="repair-confirm-box">
                      <strong>Booking confirmed: {orderReference}</strong>
                      <span>Your order is now visible in Admin Bookings.</span>
                    </div>
                  )}
                </form>
              )}
            </div>

            <aside className="repair-summary-card">
              <h2>Booking information</h2>
              {device ? (
                <div className="summary-device">
                  <img src={device.image} alt="" />
                  <div><strong>{device.name}</strong><span>{device.type}</span></div>
                </div>
              ) : (
                <p className="muted">Select a device to begin.</p>
              )}
              {repair && (
                <>
                  <div className="summary-line">
                    <span>Selected repairs</span>
                    <strong>{selectedRepairs.length}</strong>
                  </div>
                </>
              )}
              {device && selectedRepairs.length > 0 && (
                <div className="summary-repair-list">
                  {selectedRepairs.map((item, index) => (
                    <div key={item.key}>
                      <button type="button" onClick={() => removeRepair(item.key)}>x</button>
                      <span>
                        <strong>{item.choice?.title || item.option.title}</strong>
                        {index > 0 && <em>$1 off bundle</em>}
                      </span>
                      <b>{money(index > 0 ? item.price - 1 : item.price)}</b>
                    </div>
                  ))}
                </div>
              )}
              {selectedRepairs.length > 1 && (
                <div className="summary-bundle">
                  <span>Repair bundle discount</span>
                  <strong>-{money(bundleDiscount)}</strong>
                </div>
              )}
              {repair && (
                <div className="summary-line">
                  <span>Service</span>
                  <strong>{serviceMethods.find((item) => item.id === method)?.title}</strong>
                </div>
              )}
              <div className="summary-total">
                <span>Total incl. GST</span>
                <strong>{money(selectedRepairs.length ? total : 0)}</strong>
              </div>
              <div className="summary-payments">
                <span className="pay-badge pay-afterpay"><strong>afterpay</strong><small>4 payments of {money((selectedRepairs.length ? total : 0) / 4)}</small></span>
                <span className="pay-badge pay-klarna"><strong>Klarna.</strong><small>4 payments of {money((selectedRepairs.length ? total : 0) / 4)}</small></span>
                <span className="pay-badge pay-zip"><strong>zip</strong><small>from $10 a week</small></span>
              </div>
              {device && !selectedRepairs.length && (
                <div className="summary-empty-guide">
                  <strong>Select repair services</strong>
                  <span>You can add screen, battery, charging and other repairs together before booking.</span>
                </div>
              )}
              {device && !repair && (
                <button className="button dark" disabled={!selectedRepairs.length} type="button" onClick={startFinalize}>
                  {selectedRepairs.length ? "Continue booking" : "Select a repair first"}
                </button>
              )}
              {device && repair && <a className="button dark" href="#finalize">Finalize booking</a>}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
