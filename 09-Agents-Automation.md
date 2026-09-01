# Agents & Automation — Casey Phone & Tech Repairs

**Last updated:** 2026-07-03

This file tracks the AI agents / n8n workflows we build to run the business, and doubles as the early groundwork for the Phase 2 software house (see [10-Future-AI-Security-Phase.md](10-Future-AI-Security-Phase.md)).

## Philosophy
**Solo-manual first, agents second.** The founder runs the entire business by hand at the start — repairs, customer comms, bookings, quoting, admin — to learn and prove the real workflow before automating any of it. Building an agent for a process that hasn't been done manually and repeatably yet just automates guesswork.

Once the manual process is smooth (see [00-Master-Plan.md](00-Master-Plan.md) Phase 1a/1b), automate the repetitive, low-judgment back-office parts first (booking confirmations, review requests, status updates) so the founder's time goes entirely to the physical/hands-on work — fixing devices and serving customers face-to-face — not admin. Every workflow built here is also a rehearsal for the automation-heavy business we're building toward in Phase 2.

**Trigger to start building agents:** once the founder has personally run the full repair workflow ([07-Operations.md](07-Operations.md)) enough times that the steps, timing, and messaging are consistent and no longer changing week to week. Don't start earlier — there's nothing stable to automate yet.

## Toolset
- **n8n** — primary automation/workflow engine, already connected and available

## Planned Agents / Workflows (build in this rough order, once basic booking exists)

### 1. Booking Confirmation Agent
- Trigger: new booking form submission
- Action: send confirmation (SMS/email/WhatsApp) with drop-off details, add to calendar
- Status: Not started

### 2. Status Update Agent
- Trigger: repair status change (received → diagnosed → in progress → ready)
- Action: notify customer automatically at each stage
- Status: Not started

### 3. Review Request Agent
- Trigger: repair marked "handed over" + X hours delay
- Action: send a friendly review request (Google Business Profile link) — directly supports [02-Marketing.md](02-Marketing.md) and [04-SEO.md](04-SEO.md) goals
- Status: Not started

### 4. Quote Assistant
- Trigger: inbound inquiry describing device + issue
- Action: draft a rough price range from the price list ([03-Sales.md](03-Sales.md)) for founder to review/send — human-in-the-loop, not fully automated (matches "honesty over upsell" value)
- Status: Not started

### 5. Follow-Up / Win-Back Agent (later)
- Trigger: X months since last visit
- Action: light-touch check-in / referral reminder
- Status: Not started (Phase 2)

## Data Foundation Needed
These agents need structured data to work from — this is exactly the record-keeping system described in [05-Development.md](05-Development.md) (device intake, status, customer contact). Build that first; agents plug into it.

## Update Log
- **2026-07-03** — Agent roadmap drafted. None built yet — next step is standing up basic booking/record-keeping data first, then wiring the first (Booking Confirmation) agent in n8n.
