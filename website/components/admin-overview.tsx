"use client";

import { useEffect, useMemo, useState } from "react";
import { getStore, subscribeStore, type StoreState } from "@/lib/local-store";

export function AdminOverview() {
  const [state, setState] = useState<StoreState>({ bookings: [], quotes: [], queries: [], prices: [], users: [], deletedPriceIds: [] });

  useEffect(() => {
    setState(getStore());
    return subscribeStore(() => setState(getStore()));
  }, []);

  const stats = useMemo(() => {
    const openBookings = state.bookings.filter((item) => !["Completed", "Cancelled"].includes(item.status)).length;
    const openQuotes = state.quotes.filter((item) => !["Completed", "Cancelled"].includes(item.status)).length;
    const completed = [...state.bookings, ...state.quotes].filter((item) => item.status === "Completed").length;
    return { openBookings, openQuotes, completed, users: state.users.length, prices: state.prices.length, queries: state.queries.length };
  }, [state]);

  return (
    <div className="admin-stack">
      <section className="card-grid">
        <article className="card"><h3>Open bookings</h3><p className="metric">{stats.openBookings}</p></article>
        <article className="card"><h3>Open quotes</h3><p className="metric">{stats.openQuotes}</p></article>
        <article className="card"><h3>Queries</h3><p className="metric">{stats.queries}</p></article>
        <article className="card"><h3>Users</h3><p className="metric">{stats.users}</p></article>
      </section>
      <section className="admin-quick-grid">
        <a href="/admin/users">Manage users</a>
        <a href="/admin/bookings">Manage bookings</a>
        <a href="/admin/quotes">Manage quotes</a>
        <a href="/admin/queries">Manage queries</a>
        <a href="/admin/pricing">Manage pricing</a>
      </section>
    </div>
  );
}
