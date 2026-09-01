"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { allRepairDevices, repairOptions, type RepairDevice } from "@/lib/repair-flow-data";

const popularDeviceSlugs = [
  "apple-iphone-16-pro-max",
  "apple-iphone-15-pro",
  "apple-iphone-14",
  "samsung-galaxy-s24-ultra",
  "samsung-galaxy-s23",
  "apple-macbook-pro"
];

const popularDevices = popularDeviceSlugs
  .map((slug) => allRepairDevices.find((device) => device.slug === slug))
  .filter((device): device is RepairDevice => Boolean(device))
  .slice(0, 6);

const quickRepairs = repairOptions
  .filter((repair) => ["screen-repair", "battery-repair", "charging-port-repair", "diagnostic"].includes(repair.slug))
  .slice(0, 4);

export function HomeRepairFinder({ mode = "section" }: { mode?: "section" | "hero" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [attemptedSearch, setAttemptedSearch] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(quickRepairs[0]?.slug || "screen-repair");

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return mode === "hero" ? popularDevices.slice(0, 4) : popularDevices;
    }

    return allRepairDevices
      .filter((device) => device.name.toLowerCase().includes(value) || device.brand.toLowerCase().includes(value))
      .slice(0, mode === "hero" ? 4 : 6);
  }, [mode, query]);

  function openRepair(device?: (typeof allRepairDevices)[number]) {
    if (!device || !query.trim()) {
      setAttemptedSearch(true);
      return;
    }

    router.push(`/repair/${device.brandSlug}/${device.slug}`);
  }

  const noMatch = attemptedSearch && query.trim().length > 0 && suggestions.length === 0;

  const finderBox = (
    <div className="home-finder-box">
      <div className="home-finder-live">
        <span />
        <strong>Repair finder</strong>
      </div>
      <label className="home-finder-search">
        <span>Device or model</span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setAttemptedSearch(false);
          }}
          placeholder="Try iPhone 15 Pro, S24 Ultra, MacBook..."
        />
      </label>

      <div className="home-quick-repairs" aria-label="Common repair type">
        {quickRepairs.map((repair) => (
          <button
            className={selectedRepair === repair.slug ? "active" : ""}
            key={repair.slug}
            type="button"
            onClick={() => setSelectedRepair(repair.slug)}
          >
            {repair.title.replace(" Repair", "")}
          </button>
        ))}
      </div>

      <div className="home-device-suggestions">
        {suggestions.map((device) => (
          <a key={device.slug} href={`/repair/${device.brandSlug}/${device.slug}`}>
            <img src={device.image} alt="" />
            <span>{device.name}</span>
            <strong>Book now</strong>
          </a>
        ))}
      </div>

      {noMatch && (
        <div className="home-no-match">
          <strong>No exact match found.</strong>
          <span>Try the model number, brand name, or use “Show all devices”.</span>
        </div>
      )}

      <div className="home-finder-actions">
        <button type="button" className="button primary" onClick={() => openRepair(suggestions[0])}>
          Search repair
        </button>
        <button type="button" className="button ghost" onClick={() => router.push("/repair")}>
          Not sure? Show all devices
        </button>
      </div>
    </div>
  );

  if (mode === "hero") {
    return (
      <div className="home-hero-finder" id="start-repair">
        {finderBox}
      </div>
    );
  }

  return (
    <section className="home-finder-section">
      <div className="container">
        <div className="home-finder-panel">
          <div className="home-finder-copy">
            <p className="eyebrow">Start here</p>
            <h2>Find your repair in seconds.</h2>
            <p>
              Search your phone, tablet or laptop. Pick a common issue and we
              will take you straight to the repair booking screen.
            </p>
          </div>

          {finderBox}
        </div>

        <div className="home-service-paths" aria-label="Repair service choices">
          <LinkCard href="/repair" title="Book a repair" text="Choose device, repair and service option." />
          <LinkCard href="/door-to-door" title="We come to you" text="Pickup or onsite support for local customers." />
          <LinkCard href="/insurance-quote" title="Insurance quote" text="Upload photos and receive a formal quote." />
        </div>
      </div>
    </section>
  );
}

function LinkCard({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <a className="home-service-path" href={href}>
      <span>{title}</span>
      <strong>{text}</strong>
    </a>
  );
}
