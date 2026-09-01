"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getStore, subscribeStore, type PriceItem } from "@/lib/local-store";

const quickProblems = [
  { label: "Screen", value: "Screen replacement" },
  { label: "Battery", value: "Battery replacement" },
  { label: "Charging", value: "Charging port repair" },
  { label: "No power", value: "No power diagnostic" },
  { label: "Water", value: "Liquid damage diagnostic" },
  { label: "Laptop", value: "Laptop screen replacement" }
];

const repairWays = [
  {
    title: "Visit us",
    text: "Come between 9 AM and 12 PM.",
    href: "/book-repair",
    label: "Book visit"
  },
  {
    title: "We come to you",
    text: "Pickup or mobile repair at your place.",
    href: "/door-to-door",
    label: "Book pickup"
  },
  {
    title: "Post it in",
    text: "Send the device after we confirm details.",
    href: "/contact",
    label: "Get postage help"
  }
];

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreText(source: string, query: string) {
  const cleanSource = normalise(source);
  const cleanQuery = normalise(query);
  if (!cleanQuery) return 0;
  if (cleanSource === cleanQuery) return 100;
  if (cleanSource.includes(cleanQuery)) return 82;
  return cleanQuery.split(" ").reduce((score, term) => score + (cleanSource.includes(term) ? 14 : 0), 0);
}

function isLaptopQuery(value: string) {
  return /\b(laptop|macbook|surface|dell|hp|lenovo|acer|asus|gaming|keyboard)\b/i.test(value);
}

function issueFromText(value: string) {
  if (/screen|glass|crack|display|lcd/i.test(value)) return "Screen replacement";
  if (/battery|dies|drain|health/i.test(value)) return "Battery replacement";
  if (/charge|charging|port|cable/i.test(value)) return "Charging port repair";
  if (/water|wet|liquid/i.test(value)) return "Liquid damage diagnostic";
  if (/data|photos|backup|recover/i.test(value)) return "Data recovery assessment";
  if (/power|dead|black|turn/i.test(value)) return "No power diagnostic";
  if (/keyboard|key/i.test(value)) return "Keyboard replacement";
  if (/software|virus|slow|reset/i.test(value)) return "Software repair";
  return value || "Screen replacement";
}

export function HomeCostChecker() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [deviceInput, setDeviceInput] = useState("iPhone 13");
  const [problemInput, setProblemInput] = useState("cracked screen");
  const issue = issueFromText(problemInput);

  useEffect(() => {
    setPrices(getStore().prices);
    return subscribeStore(() => setPrices(getStore().prices));
  }, []);

  const devices = useMemo(() => Array.from(new Set(prices.map((item) => item.device))), [prices]);
  const deviceSuggestions = useMemo(() => {
    const ranked = devices
      .filter((device) => device !== "All supported phones")
      .map((device) => ({ device, score: scoreText(device, deviceInput) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.device);

    if (ranked.length > 0) return ranked;
    return isLaptopQuery(deviceInput)
      ? ["MacBook Pro", "Windows laptop", "Dell laptop", "Gaming laptop"]
      : ["iPhone 15 Pro", "Samsung Galaxy S24", "Oppo Reno 10", "Unknown Android"];
  }, [deviceInput, devices]);

  const matchedDevice = useMemo(() => {
    const best = devices
      .filter((device) => device !== "All supported phones")
      .map((device) => ({ device, score: scoreText(device, deviceInput) }))
      .sort((a, b) => b.score - a.score)[0];

    if (best?.score >= 28) return best.device;
    if (isLaptopQuery(deviceInput)) return "Windows laptop";
    if (/android|oppo|vivo|realme|xiaomi|redmi|poco/i.test(deviceInput)) return "Generic Android - midrange model";
    return "";
  }, [deviceInput, devices]);

  const selected = useMemo(() => {
    const issueScore = (item: PriceItem) => scoreText(item.repair, issue);
    const exact = prices
      .filter((item) => item.device === matchedDevice)
      .map((item) => ({ item, score: issueScore(item) }))
      .sort((a, b) => b.score - a.score)[0];

    if (exact?.score > 0) return exact.item;

    const diagnostic = prices
      .filter((item) => item.device === "All supported phones")
      .map((item) => ({ item, score: issueScore(item) }))
      .sort((a, b) => b.score - a.score)[0];

    if (diagnostic?.score > 0) return diagnostic.item;
    return undefined;
  }, [issue, matchedDevice, prices]);

  const unknownDevice = !matchedDevice && deviceInput.trim().length > 2;
  const priceText = selected?.priceRange || (unknownDevice ? "Custom estimate" : "From $39 inspection");
  const displayDevice = matchedDevice || deviceInput.trim() || "your device";
  const resultText = selected
    ? `${selected.repair} for ${displayDevice}`
    : "Not sure? Send a photo or any visible model detail and Casey will guide you.";

  return (
    <div className="repair-starter" aria-label="Quick repair starter">
      <div className="starter-head">
        <div className="starter-agent" aria-hidden="true">
          <span />
        </div>
        <div>
          <p className="eyebrow">Search, book, fix</p>
          <h2>Start your repair in seconds.</h2>
        </div>
      </div>

      <div className="starter-search">
        <label>
          Device
          <input
            value={deviceInput}
            onChange={(event) => setDeviceInput(event.target.value)}
            placeholder="Search your device e.g. iPhone 15, Galaxy S24, MacBook"
          />
        </label>
        <div className="starter-suggestions">
          {deviceSuggestions.map((item) => (
            <button key={item} type="button" onClick={() => setDeviceInput(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="starter-problem">
        <label>
          Problem
          <input
            value={problemInput}
            onChange={(event) => setProblemInput(event.target.value)}
            placeholder="cracked screen, not charging, water damage..."
          />
        </label>
        <div className="starter-problem-row">
          {quickProblems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={issue === item.value ? "active" : ""}
              onClick={() => setProblemInput(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`starter-estimate ${unknownDevice ? "unknown" : ""}`}>
        <span>{selected?.availability || (unknownDevice ? "Photo check" : "Estimate")}</span>
        <strong>{priceText}</strong>
        <p>{resultText}</p>
      </div>

      <div className="starter-ways">
        {repairWays.map((way) => (
          <Link href={way.href} key={way.title}>
            <strong>{way.title}</strong>
            <span>{way.text}</span>
            <em>{way.label}</em>
          </Link>
        ))}
      </div>
    </div>
  );
}
