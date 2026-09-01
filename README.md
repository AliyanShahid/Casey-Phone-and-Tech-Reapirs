# Casey Phone & Tech Repairs

This folder is the single source of truth for the business plan and current website build.

Start here:
- `00-Master-Plan.md` for the business roadmap.
- `11-Execution-Plan.md` for next actions.
- `WEBSITE_PROGRESS_SNAPSHOT.md` for current website progress and file map.
- `website/` for the Next.js website source.

## Folder Index

| File / Folder | Covers |
|---|---|
| `00-Master-Plan.md` | Roadmap, phase log, current snapshot |
| `01-Executive.md` | Vision, mission, values, milestones |
| `02-Marketing.md` | Brand, channels, local marketing |
| `03-Sales.md` | Service menu, pricing, sales process |
| `04-SEO.md` | Local search strategy, keywords |
| `05-Development.md` | Website, booking, internal tooling |
| `06-Finance.md` | Costs, pricing, bookkeeping |
| `07-Operations.md` | Repair workflow, tools, warranty |
| `08-Legal-Compliance.md` | ACL, privacy, insurance, compliance |
| `09-Agents-Automation.md` | n8n workflows and AI agents |
| `10-Future-AI-Security-Phase.md` | Future software/security phase |
| `11-Execution-Plan.md` | Next actions |
| `CHANGELOG.md` | Running change timeline |
| `WEBSITE_PROGRESS_SNAPSHOT.md` | Current website build summary |
| `website/` | Next.js website source |

## Website Quick Start

Primary source:

`D:\Casey Phone & Tech Repairs\website`

Runnable clean copy:

`C:\Users\aliya\Claude_n8n\casey-website`

Run locally from the clean copy:

```bash
cd C:\Users\aliya\Claude_n8n\casey-website
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Open:

`http://127.0.0.1:3000`

## Sync Website Changes

After editing source:

```bash
robocopy "D:\Casey Phone & Tech Repairs\website" "C:\Users\aliya\Claude_n8n\casey-website" /E /XD node_modules .next
```

Robocopy exit code `1` usually means files copied successfully.

## Verify Website

From:

`C:\Users\aliya\Claude_n8n\casey-website`

```bash
npm.cmd run typecheck
npm.cmd run build
```

## Working Notes

- Keep major website progress in `WEBSITE_PROGRESS_SNAPSHOT.md`.
- Keep business-wide changes in `CHANGELOG.md`.
- Use Casey brand direction: black, white, and lime green.
