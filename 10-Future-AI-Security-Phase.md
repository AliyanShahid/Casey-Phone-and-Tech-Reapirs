# Software House — AI & Security Company (Phase 2) — Early Notes

**Last updated:** 2026-07-03
**Status:** Deferred — not active build work yet, but this is the confirmed next phase (not a maybe). This file captures the thesis and open questions now; gets built into a real plan once Phase 1 exit criteria in [00-Master-Plan.md](00-Master-Plan.md) are close.

## The Plan
Phase 1 (garage repairs) is explicitly a means to an end: generate revenue and learn business/automation technique. There is **no storefront and no technician-hiring step** in between — the direct next move after garage repairs is opening a **software house** focused on AI and security.

## Why This Makes Sense (thesis)
Years of hands-on hardware/software repair, especially motherboard-level and data-handling work, builds exactly the kind of technical trust and low-level device knowledge that a security/automation company needs. Running the repair business also forces the founder to learn real business operations — pricing, customer handling, cash flow, and automation (n8n workflows) — all directly transferable skills for running a software company. It's a bootstrap + apprenticeship model, not a "repair business that grows into a shop."

## Rough Direction Ideas (unrefined — expand later)
- **Device security hardening** for consumers/small businesses (post-repair security checkups, malware removal, secure setup)
- **SMB cybersecurity consulting** — many small local businesses have zero real security posture
- **Managed IT/security services** for small businesses — recurring revenue
- **AI automation products** — productize the n8n/agent tooling built to run the repair business ([09-Agents-Automation.md](09-Agents-Automation.md)) into something sellable to other small/trade businesses
- **Software development services** — a software house could also take on contract/consulting dev work as an early revenue path while the AI/security product line matures
- **Device diagnostics / auto-intake SaaS (leading candidate, 2026-08-16)** — plug a phone into USB at a repair shop's counter and auto-pull IMEI, serial, model, battery health, storage, lock/blacklist status straight into whatever screen is open (repair ticket, trade-in valuation, protection-plan quote) instead of a tech typing it by hand. Removes IMEI/model typos and speeds up intake for repair booking, buy-back/trade-in, and protection-plan sales. Technical shape: a local desktop agent (required — USB access can't be cloud-only) built on `libimobiledevice`/`adb`, plus a paid third-party lookup (Phonecheck-style) for the Activation-Lock/blacklist piece Apple doesn't expose publicly. Full technical breakdown lives in the session that originated this (2026-08-16). **Deliberately sequenced as internal-tool-first**: build and prove it as a Casey Phone & Tech Repairs internal tool during Phase 1, *then* generalize into multi-tenant SaaS (accounts/billing/POS integrations) as a Phase 2 candidate first product — not built as SaaS from day one. See [05-Development.md](05-Development.md) for the build log.

## What NOT to do yet
- Don't spend Phase 1 time/budget building the software house before the repair business is actually generating solid, consistent revenue — Phase 1's job is to fund and train for this, not run in parallel
- Don't advertise or promise security services before there's real capability and credentials behind it
- Don't skip building genuine security/software expertise or certifications when the time comes — the repair reputation and automation experience get the founder in the door, but the software house needs its own real competence

## Prep Work That's Already Happening (passively, via Phase 1 work)
- Internal automation tooling (n8n workflows) — direct technical seed for the software house
- Data handling discipline from [08-Legal-Compliance.md](08-Legal-Compliance.md) privacy practices
- Motherboard/hardware-level expertise from repair work
- General business operating skills (pricing, cash flow, customer comms) — the actual stated Phase 1 goal, not just a side effect

## Open Questions (revisit as Phase 1 progresses)
- What does the software house build/sell first — a specific product, or consulting/contract dev work to fund product R&D? (Leading candidate as of 2026-08-16: the device diagnostics/auto-intake SaaS above, born out of an internal Phase 1 tool — still not a final decision.)
- Certifications/qualifications needed before offering security services
- Whether this becomes a separate legal entity/brand or stays under Casey Phone & Tech Repairs
- Target customer: consumer vs SMB vs enterprise
- What happens to the repair business once the software house is running — kept as a passive revenue stream or wound down (explicitly undecided, see [00-Master-Plan.md](00-Master-Plan.md))
- Capital needs vs. what Phase 1 profits can realistically fund

## Update Log
- **2026-07-03** — Initial placeholder created, framed as a deferred Phase 3.
- **2026-07-03** — Reframed as the confirmed Phase 2 (not a maybe-someday Phase 3): no storefront/technician path, garage repairs leads directly here.
- **2026-08-16** — Added device diagnostics/auto-intake SaaS as the leading candidate first Phase 2 product, discovered via a discussion about automating repair/trade-in/protection-plan intake. User chose to build it internal-tool-first (Phase 1, own shop only) and generalize into SaaS later, rather than building multi-tenant from day one.
