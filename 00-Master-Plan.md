# Casey Phone & Tech Repairs — Master Plan

**Status:** Phase 1 — Garage Startup
**Location:** 14 Gingera Street, Clyde North VIC 3978, Australia (City of Casey — name chosen to match the local government area for SEO, see [04-SEO.md](04-SEO.md))
**Last updated:** 2026-07-03 (revised: 2-phase plan, no storefront/technician path; added address + solo-first operating model)

This is the master roadmap. Each department has its own file (01–09 below) — this file ties them together and tracks which phase we're in. Whenever a major decision or milestone happens, update the relevant department file AND the "Phase Log" at the bottom of this one.

## The Big Picture — Two Phases

No storefront and no technician hiring plan — that path is explicitly ruled out. The garage repair business is the training ground (revenue + business/automation skills), and the direct next step is a **software house**, not a bigger repair operation.

### Phase 1: Garage Repairs (now → until revenue + skills are ready)
Solo operation, home garage as workshop (14 Gingera Street, Clyde North VIC 3978), all-comers device repair: phones, laptops, tablets, motherboard-level work. Goal is threefold, in this order of importance:
1. **Generate real revenue** — prove the business can sustain itself and fund what's next
2. **Learn business automation and technique** — use this business as the live testbed for the systems, workflows (n8n), and operating discipline that the software house will run on
3. **Build technical/reputation capital** — reviews, hands-on hardware/software depth, and enough of a cash buffer to fund the jump

**Founder is currently employed as a technician at another mobile repair shop.** This business runs alongside that job at the start — capacity is limited, so early operations should be lean and not over-promise turnaround times. Check the employment contract for any conflict-of-interest/moonlighting clause — see [08-Legal-Compliance.md](08-Legal-Compliance.md).

**Operating model within Phase 1 — solo-manual first, then agent-assisted:**
- **1a. Solo-manual (now):** Founder handles everything personally — repairs, customer communication, bookings, quoting, admin — to learn the real workflow before automating anything. Don't build agents for a process that hasn't been proven by hand yet.
- **1b. Agent-assisted (once the manual process is smooth and repeatable):** Hand off the back-office/technical-admin work (booking confirmations, status updates, review requests, quote drafting) to n8n agents — see [09-Agents-Automation.md](09-Agents-Automation.md). This frees the founder to focus entirely on the hands-on work: fixing devices and serving customers face-to-face. Agents support the business, they don't do the repairs.

**Exit criteria to move to Phase 2:**
- Consistent, healthy revenue (not just break-even — real margin banked)
- Automation/workflow systems (booking, comms, review requests — see [09-Agents-Automation.md](09-Agents-Automation.md)) actually built and running, proving out the operating skills needed to run a software company
- Enough capital runway to fund the software house build without the repair business needing to prop it up week-to-week
- Founder has clarity on what the software house actually builds/sells first (see [10-Future-AI-Security-Phase.md](10-Future-AI-Security-Phase.md))

**What happens to the repair business at that point:** not decided yet. Could keep running lean in the background as a revenue stream, or be wound down once the software house is self-sustaining — revisit this call when Phase 2 is actually close, don't pre-commit now.

### Phase 2: Software House — AI & Security Company (next major phase, no fixed date)
Pivot/expand from "we fix your device" into a software company building AI-driven automation and security products/services. Leverages the technical trust and hands-on hardware/software depth built in Phase 1, plus the automation tooling (n8n workflows, structured data, quoting logic) built while running the repair business. Likely directions: device/SMB security services, AI automation products (productizing the internal tooling built in Phase 1), managed security/IT for small businesses. Full detail lives in [10-Future-AI-Security-Phase.md](10-Future-AI-Security-Phase.md) — that file gets built out for real once Phase 1 exit criteria are close.

## Current Snapshot (fill in / keep current)

| Item | Status |
|---|---|
| Company registered (ABN) | ✅ Done |
| Business/trading name confirmed | Casey Phone & Tech Repairs |
| Tools ordered | ✅ Some ordered — detail in [07-Operations.md](07-Operations.md) |
| Workshop location | Garage — 14 Gingera Street, Clyde North VIC 3978 |
| GST registered | ❓ TBD — see [06-Finance.md](06-Finance.md) |
| Insurance in place | ❓ TBD — see [08-Legal-Compliance.md](08-Legal-Compliance.md) |
| Google Business Profile live | ❓ TBD — see [02-Marketing.md](02-Marketing.md) |
| First paying customer | ❓ Not yet |
| Notion Operations Hub | ❌ Scrapped 2026-07-04 — rebuilding from scratch, see [11-Execution-Plan.md](11-Execution-Plan.md) |
| Marketing website | 🟡 Phase 1 foundation started 2026-07-05 — Next.js project in `website/` |
| Customer portal app | ❌ Scrapped 2026-07-04 — rebuilding from scratch |
| Execution Plan checklist | ✅ Live in Notion — see [11-Execution-Plan.md](11-Execution-Plan.md) for the link |

## Department Files
- [01-Executive.md](01-Executive.md) — vision, mission, values, org structure
- [02-Marketing.md](02-Marketing.md) — brand, local marketing, socials, GBP
- [03-Sales.md](03-Sales.md) — service menu, pricing, sales process
- [04-SEO.md](04-SEO.md) — local search strategy
- [05-Development.md](05-Development.md) — website, booking system, internal tooling
- [06-Finance.md](06-Finance.md) — costs, pricing math, GST, bookkeeping
- [07-Operations.md](07-Operations.md) — repair workflow, tools, suppliers, warranty
- [08-Legal-Compliance.md](08-Legal-Compliance.md) — ABN/structure, ACL, e-waste, privacy, insurance
- [09-Agents-Automation.md](09-Agents-Automation.md) — n8n workflows / AI agents roadmap
- [10-Future-AI-Security-Phase.md](10-Future-AI-Security-Phase.md) — Phase 2 (software house) early notes
- [11-Execution-Plan.md](11-Execution-Plan.md) — the live, tickable execution plan (Notion) — **start here for what to do next**

## Immediate Next Actions (Phase 1 kickoff)
See [11-Execution-Plan.md](11-Execution-Plan.md) — that's now the single tickable source of truth for next actions, replacing the numbered list that used to live here.

## Phase Log
*(Append short dated entries here whenever something material changes — a decision, a milestone hit, a pivot.)*

- **2026-07-03** — Company plan created. Phase 1 (Garage Repairs) kicked off. ABN registered, initial tools ordered.
- **2026-07-03** — Plan corrected from 3 phases to 2: no storefront, no technician hiring. Garage repairs (Phase 1) goes directly to a software house / AI & Security company (Phase 2). Fate of the repair business once Phase 2 starts left undecided on purpose.
- **2026-07-03** — Added workshop address (14 Gingera Street, Clyde North VIC 3978 — inside City of Casey, confirming the name choice for local SEO). Noted founder currently works as a technician at another mobile shop alongside this business. Confirmed operating model: solo-manual first to prove the process, then hand back-office/admin work to agents once smooth — founder stays focused on hands-on repairs and customer service.
- **2026-07-04** — Scrapped the Notion Operations Hub, marketing website, and customer portal app — not what was wanted, starting execution from scratch. Deleted the code (website + portal folders) and emptied the old Notion hub page. Replaced the old static "Immediate Next Actions" list with a live, tickable execution plan in Notion — see [11-Execution-Plan.md](11-Execution-Plan.md). Strategy/plan files (this one and 01–10) were kept as-is; only the built artifacts were removed.
- **2026-07-05** — Started the new website build in `website/` as a phased Next.js/TypeScript project. Phase 1 foundation includes public pages, customer/admin dashboard foundations, auth screens, API placeholders, SEO basics, and documentation. This is a fresh build after the 2026-07-04 reset, not a restoration of the scrapped site.
