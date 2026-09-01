"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, logout, subscribeStore, type LocalSession } from "@/lib/local-store";

export function AuthNav() {
  const [session, setSession] = useState<LocalSession | undefined>();

  useEffect(() => {
    setSession(getSession());
    return subscribeStore(() => setSession(getSession()));
  }, []);

  if (session) {
    return (
      <button className="button ghost" type="button" onClick={logout}>
        Logout
      </button>
    );
  }

  return (
    <Link className="button ghost" href="/login">
      Login
    </Link>
  );
}

export function RegisterNav() {
  const [session, setSession] = useState<LocalSession | undefined>();

  useEffect(() => {
    setSession(getSession());
    return subscribeStore(() => setSession(getSession()));
  }, []);

  if (session) {
    return null;
  }

  return (
    <Link className="button ghost" href="/register">
      Register
    </Link>
  );
}
