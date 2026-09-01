# Development — Casey Phone & Tech Repairs

**Last updated:** 2026-07-05

This file covers digital/technical infrastructure for the business itself (website, booking, internal tools) — not customer repair work (that's [07-Operations.md](07-Operations.md)). This is also where the seeds of the Phase 2 software house tooling will come from — see [09-Agents-Automation.md](09-Agents-Automation.md).

## Confirmed Tool Stack (2026-07-03)
All connected and tied to aliyansatti98@gmail.com — nothing left to add for Phase 1a, just start using them:

| Tool | Role in this business |
|---|---|
| **Notion** | Operations hub: device intake log, price list, SOPs (repair workflow, warranty policy), supplier list. This is the "Record Keeping" system below. |
| **Gmail** | Customer inquiries, quotes, warranty confirmations, GBP review requests (manual for now) |
| **Google Calendar** | Booking slots — drop-off, pickup, diagnostics |
| **Stripe** | Payments — in-person or payment link, feeds revenue tracking in [06-Finance.md](06-Finance.md) |
| **Figma** | Logo, brand identity, flyers, social graphics (Instagram/TikTok per [02-Marketing.md](02-Marketing.md)), later a website mockup |
| **n8n** | Automation engine — held back deliberately until Phase 1b (see [09-Agents-Automation.md](09-Agents-Automation.md)); Stripe/Notion/Gmail/Calendar all have APIs n8n can wire together once the manual process is proven |

## Phase 1a Priorities (manual, using the stack above)

### 1. Record Keeping — Notion
- ❌ **Scrapped 2026-07-04** — the first attempt at an Operations Hub (Repair Jobs database + SOP pages) wasn't what was wanted. Emptied in Notion, rebuilding from scratch — see [11-Execution-Plan.md](11-Execution-Plan.md) for the live checklist tracking this rebuild.

### 2. Booking / Intake — Google Calendar + Gmail
- Booking confirmed manually via Gmail, slot placed on Google Calendar — no separate booking form needed yet at this volume
- Manually send status update emails at each stage (received, quote ready, complete) — same messages that become the Status Update Agent later

### 3. Payments / POS — Stripe
- **Decision (2026-07-03):** Stripe Tap to Pay on phone — no hardware to buy, uses the phone's NFC + the already-connected Stripe account (`acct_1SbEmFS9k5o3RB9t`)
- Send payment links for remote/mail-in jobs instead of cash-only, so revenue is tracked automatically and feeds [06-Finance.md](06-Finance.md)

### 4. Brand Basics — Figma
- Logo + simple flyer/business card once time allows — not blocking on this to start taking jobs

### 5. Website (marketing site + management system foundation)
- 🟡 **Rebuild started 2026-07-05** — new phased Next.js/TypeScript project lives at `website/` inside this planning folder. Phase 1 foundation includes the homepage, public service pages, booking/quote entry pages, auth screens, customer/admin dashboard foundations, API placeholders, SEO basics (`robots.ts`, `sitemap.ts`), and project documentation.
- 🟢 **Local MVP interaction added 2026-07-05** — booking requests, quote requests, tracking, admin status updates, admin notes, quoted prices, and editable repair pricing now work in browser local storage. This makes the site testable before the production database/auth layer is built.
- 🟢 **Auth simplified 2026-07-05** — customer login is now passwordless email OTP only. New and returning customers both enter email, receive/verify OTP, and get logged in. Local MVP displays the OTP on screen until SMTP is connected.
- Domain decision still stands: buy a proper `.com.au` domain, eligible via the ABN.
- Keep website changes tracked in `website/CHANGELOG.md` and major business-level changes in this file + `CHANGELOG.md`.

### 6. Customer Portal (app)
- ❌ **Scrapped 2026-07-04** — the first build (Next.js + Supabase + Claude chat, email OTP, quote flow, admin panel) wasn't what was wanted. Deleted from `C:\Users\aliya\Claude_n8n\casey-portal\`. Rebuild tracked in [11-Execution-Plan.md](11-Execution-Plan.md) — talk through what's actually wanted before rebuilding.

**Facts worth keeping from the scrapped attempt** (still true, not undone by the deletion):
- The `&` in `D:\Casey Phone & Tech Repairs\` breaks Windows Node.js tooling entirely (confirmed by testing) — any future code project needs to live in a clean path like `C:\Users\aliya\Claude_n8n\`, not the D: folder
- "Insurance quote" was clarified to mean: a proper itemized repair quote the customer submits to their *own* insurer for their claim — not selling insurance, no licensing needed
- Email OTP (not SMS) was the deliberate choice to avoid per-message costs
- Decided POS = Stripe Tap to Pay on phone (no hardware purchase) — see [06-Finance.md](06-Finance.md)

## Execution Plan
The old static "Website / POS / Google Business Profile" table that used to live here has been replaced by a live, tickable execution plan in Notion — see [11-Execution-Plan.md](11-Execution-Plan.md). Update that (not this file) as day-to-day steps get done; use this file for durable decisions and architecture notes.

## Phase 1b Roadmap (once manual workflow is proven — see [09-Agents-Automation.md](09-Agents-Automation.md))
- n8n wires Notion + Gmail + Calendar + Stripe together: booking confirmations, status updates, review requests, quote drafts
- Real booking system with live availability
- Customer portal (repair status lookup)
- Internal dashboard: revenue, repair volume, turnaround time, parts inventory

## Device Diagnostics / Auto-Intake Tool (started 2026-08-16)
Plug a phone into USB at the counter and auto-pull IMEI, serial, model, battery health, storage, and lock/blacklist status — feeds directly into repair-ticket intake, trade-in/buy-back valuation, and protection-plan quoting, so nobody hand-types an IMEI or model number again.
- **Sequencing decision:** build as a plain internal tool for this shop first (no accounts, no billing, one Windows machine), prove it on real repairs/trade-ins, *then* generalize into the multi-tenant SaaS product noted in [10-Future-AI-Security-Phase.md](10-Future-AI-Security-Phase.md) — not built SaaS-first.
- **Architecture:** local desktop app (Electron, Windows) using `libimobiledevice` (iPhone) / `adb` (Android) for USB read-out, plus a paid third-party lookup (Phonecheck-style API) for Activation Lock/blacklist status, which Apple only exposes to Authorized Service Providers.
- **Build order:** (1) bare script proving USB read-out works on this machine, (2) real app window, (3) add the paid lock/blacklist lookup, (4) build the three intake screens (repair/trade-in/protection-plan) around the same data, (5) add a one-tap touch/camera/mic test screen.
- Requires **Apple Mobile Device Support** installed on the Windows machine (bundled with iTunes or the Apple Devices Microsoft Store app) before any iPhone USB read-out will work.
- Code lives at `C:\Users\aliya\Claude_n8n\` per the standing `&`-breaks-Windows-tooling rule, not in this D: folder.

## Phase 2 Seed
Everything built here (Notion's structured customer/device data, n8n automation, Stripe payment flows, quoting logic) becomes reusable infrastructure for the future software house — e.g. automated security assessment intake could reuse the same booking/quoting patterns built for repairs.

## Update Log
- **2026-07-03** — Initial development plan drafted; n8n identified as the automation backbone from day one.
- **2026-07-03** — Confirmed full tool stack already connected (Notion, Gmail, Google Calendar, Stripe, Figma, n8n) under aliyansatti98@gmail.com. Rewrote Phase 1a plan around actually using these tools manually before any automation.
- **2026-07-03** — Built the Notion Operations Hub: Repair Jobs database + Repair Workflow, Pricing Sheet, Warranty Policy, and Supplier List pages. This is now the live daily tool — see link in [00-Master-Plan.md](00-Master-Plan.md).
- **2026-07-03** — Decided POS = Stripe Tap to Pay on phone (no hardware purchase), website = real coded site on a paid `.com.au` domain. Added full execution plan with division of labor across website, POS/payments, and Google Business Profile.
- **2026-07-03** — Built and locally tested the website (`website/index.html`, `website/style.css`) — services, why-us/differentiator, service area, contact section, LocalBusiness schema markup for SEO. Verified desktop and mobile rendering via preview. Still needs: real phone number, hosting deploy, and the domain purchase.
- **2026-07-03** — Built the full customer portal app (Next.js 16 + Supabase + Claude): email OTP auth, guided quote request flow with photo upload, insurance-claim quote documents, status tracking, and an admin approval panel, plus a site-wide AI chat assistant. Lives at `C:\Users\aliya\Claude_n8n\casey-portal\` — deliberately outside the `D:\Casey Phone & Tech Repairs\` folder because its `&` breaks Node.js tooling on Windows (confirmed by testing). Setup steps requiring the owner (Supabase project, Anthropic API key) documented in `casey-portal/SETUP.md`.
- **2026-07-04** — Scrapped the website, portal app, and Notion Operations Hub — not what was wanted. Deleted the code, emptied the Notion page. Kept the durable facts/decisions (the `&` path gotcha, insurance-quote definition, email-OTP choice, Stripe Tap to Pay decision). Replaced the static execution table with a live tickable checklist in Notion — see [11-Execution-Plan.md](11-Execution-Plan.md).
- **2026-07-05** — Started the new website build in `website/` as a phased Next.js/TypeScript project based on the full business management website brief. Phase 1 foundation added public pages, auth/customer/admin UI shells, API placeholders, SEO basics, and documentation. Note: because this folder contains `&`, if Node tooling fails here, keep the source tracked in this folder but run a working copy from a clean path such as `C:\Users\aliya\Claude_n8n\casey-website`.
- **2026-07-05** — Responded to static-site issue by adding a functional local MVP layer: customer booking/quote submission, tracking by reference, admin booking/quote management, status updates, quoted prices, notes, and editable repair pricing. Still local-only until PostgreSQL/auth are implemented.
- **2026-07-05** — Simplified customer auth to passwordless OTP: no password, no separate create-account flow, no forgot-password flow. Existing emails and new emails both use OTP verification to log in. Current local version shows the OTP on screen for testing; production needs SMTP delivery.
- **2026-08-16** — Scoped a device diagnostics/auto-intake tool: plug a phone into USB, auto-fill IMEI/serial/battery/lock-status into repair tickets, trade-in valuation, and protection-plan quotes. Decided to build it as a plain internal tool for this shop first, then generalize into the SaaS product candidate logged in [10-Future-AI-Security-Phase.md](10-Future-AI-Security-Phase.md). Not started yet — next step is a proof-of-concept USB read-out script.
