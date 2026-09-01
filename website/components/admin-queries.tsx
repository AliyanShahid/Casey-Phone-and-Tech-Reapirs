"use client";

import { useEffect, useState } from "react";
import { getStore, subscribeStore, updateQuery, type CustomerQuery, type StoreState } from "@/lib/local-store";

const statuses: CustomerQuery["status"][] = ["New", "Reviewed", "Replied"];

export function AdminQueries() {
  const [state, setState] = useState<StoreState>({
    bookings: [],
    quotes: [],
    queries: [],
    prices: [],
    users: [],
    deletedPriceIds: []
  });

  useEffect(() => {
    setState(getStore());
    return subscribeStore(() => setState(getStore()));
  }, []);

  return (
    <div className="record-list">
      {state.queries.length === 0 ? (
        <p className="muted">No customer queries yet.</p>
      ) : (
        state.queries.map((query) => (
          <article className="card" key={query.id}>
            <div className="record-head">
              <div>
                <p className="eyebrow">{query.id}</p>
                <h3>{query.issue}</h3>
              </div>
              <span className="status-pill">{query.status}</span>
            </div>
            <p>{query.customerName} · {query.phone} · {query.email}</p>
            <p className="muted">Device: {query.device || "Unknown device"}</p>
            <p className="muted">Visible info: {query.visibleInfo}</p>
            <p className="muted">Email notification: {query.emailStatus}</p>
            <div className="admin-controls two">
              <select value={query.status} onChange={(event) => updateQuery(query.id, { status: event.target.value as CustomerQuery["status"] })}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
              <a className="button ghost" href={`mailto:${query.email}?subject=Casey Phone %26 Tech Repairs - ${query.id}`}>
                Reply email
              </a>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
