"use client";

import Link from "next/link";
import { useState } from "react";
import {
  findUserByEmail,
  isValidEmail,
  isValidPhone,
  requestOtp,
  verifyOtp,
  type OtpChallenge
} from "@/lib/local-store";

type AlertState = {
  type: "warning" | "success";
  text: string;
  actionHref?: string;
  actionLabel?: string;
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const isLogin = mode === "login";

  function sendOtp() {
    const normalEmail = email.trim().toLowerCase();
    const existingUser = findUserByEmail(normalEmail);

    if (!isValidEmail(normalEmail)) {
      setAlert({ type: "warning", text: "Enter a valid email address." });
      return;
    }

    if (isLogin && !existingUser) {
      setAlert({
        type: "warning",
        text: "This email is not registered.",
        actionHref: "/register",
        actionLabel: "Register first"
      });
      setChallenge(null);
      return;
    }

    if (!isLogin && existingUser) {
      setAlert({
        type: "warning",
        text: "This email is already registered.",
        actionHref: "/login",
        actionLabel: "Login instead"
      });
      setChallenge(null);
      return;
    }

    if (!isLogin && !isValidPhone(phone)) {
      setAlert({
        type: "warning",
        text: "Enter a valid Australian mobile number, for example 04xx xxx xxx or +61 4xx xxx xxx."
      });
      return;
    }

    const nextChallenge = requestOtp(normalEmail, isLogin ? existingUser?.phone || "" : phone, mode);
    setChallenge(nextChallenge);
    setAlert({
      type: "success",
      text: "OTP generated. Email sending will be connected when SMTP is configured."
    });
  }

  function verify() {
    const result = verifyOtp(email, code);
    setAlert({ type: result.ok ? "success" : "warning", text: result.message });

    if (result.ok) {
      window.location.href = "/";
    }
  }

  return (
    <div className="auth-card">
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <p className="muted">
        {isLogin
          ? "Enter your registered email to receive an OTP."
          : "Register with your email and mobile number, then verify OTP to login."}
      </p>

      <div className="form-grid">
        <div className="field light-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setChallenge(null);
            }}
            placeholder="customer@example.com"
          />
        </div>

        {!isLogin && (
          <div className="field light-field">
            <label>Mobile number</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="04xx xxx xxx"
            />
          </div>
        )}

        <button className="button primary" type="button" onClick={sendOtp}>
          Send OTP
        </button>

        {challenge && (
          <>
            <div className="local-otp">
              <p className="eyebrow">Local test OTP</p>
              <strong>{challenge.code}</strong>
              <p className="muted">
                In production this will be emailed to {challenge.email}. It expires in 10
                minutes.
              </p>
            </div>
            <div className="field light-field">
              <label>Enter OTP</label>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                placeholder="6 digit code"
              />
            </div>
            <button className="button dark" type="button" onClick={verify}>
              Verify and login
            </button>
          </>
        )}

        {alert && (
          <div className={`auth-alert ${alert.type}`} role="alert">
            <span>{alert.text}</span>
            {alert.actionHref && alert.actionLabel && (
              <Link href={alert.actionHref}>{alert.actionLabel}</Link>
            )}
          </div>
        )}
        <p className="muted">
          {isLogin ? (
            <>New customer? <Link href="/register">Register first</Link></>
          ) : (
            <>Already registered? <Link href="/login">Login</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
