"use client";

import { useEffect, useState } from "react";
import { getStore, subscribeStore, type PriceItem } from "@/lib/local-store";

export function LivePricing() {
  const [prices, setPrices] = useState<PriceItem[]>([]);

  useEffect(() => {
    setPrices(getStore().prices);
    return subscribeStore(() => setPrices(getStore().prices));
  }, []);

  return (
    <table className="price-table">
      <thead>
        <tr>
          <th>Device</th>
          <th>Repair</th>
          <th>Estimated price</th>
          <th>Time</th>
          <th>Warranty</th>
          <th>Availability</th>
        </tr>
      </thead>
      <tbody>
        {prices.map((price) => (
          <tr key={price.id}>
            <td>{price.device}</td>
            <td>{price.repair}</td>
            <td>{price.priceRange}</td>
            <td>{price.time}</td>
            <td>{price.warranty}</td>
            <td>{price.availability}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
