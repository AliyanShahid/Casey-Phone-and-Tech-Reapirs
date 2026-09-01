"use client";

import { useEffect, useState } from "react";
import { getStore, subscribeStore, type StoreState } from "@/lib/local-store";

export function AdminUsers() {
  const [state, setState] = useState<StoreState>({ bookings: [], quotes: [], queries: [], prices: [], users: [], deletedPriceIds: [] });
  useEffect(() => {
    setState(getStore());
    return subscribeStore(() => setState(getStore()));
  }, []);

  return (
    <div className="record-list">
      {state.users.length === 0 ? <p className="muted">No users yet.</p> : state.users.map((user) => (
        <article className="card" key={user.id}>
          <div className="record-head">
            <div><p className="eyebrow">{user.id}</p><h3>{user.email}</h3></div>
            <span className="status-pill">{user.phone || "No phone"}</span>
          </div>
          <p className="muted">Created {new Date(user.createdAt).toLocaleString()}{user.lastLoginAt ? ` · Last login ${new Date(user.lastLoginAt).toLocaleString()}` : ""}</p>
        </article>
      ))}
    </div>
  );
}
