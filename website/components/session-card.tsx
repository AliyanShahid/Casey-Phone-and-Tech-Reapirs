"use client";

import { useEffect, useState } from "react";
import { getSession, logout, subscribeStore, type LocalSession } from "@/lib/local-store";

export function SessionCard() {
  const [session, setSession] = useState<LocalSession | undefined>();

  useEffect(() => {
    setSession(getSession());
    return subscribeStore(() => setSession(getSession()));
  }, []);

  if (!session) {
    return (
      <article className="card">
        <h3>Not logged in</h3>
        <p className="muted">Use email OTP login to access customer actions.</p>
      </article>
    );
  }

  return (
    <article className="card">
      <p className="eyebrow">Logged in</p>
      <h3>{session.email}</h3>
      {session.phone && <p>{session.phone}</p>}
      <p className="muted">Session started {new Date(session.loggedInAt).toLocaleString()}.</p>
      <button className="button ghost" type="button" onClick={logout}>
        Logout
      </button>
    </article>
  );
}
