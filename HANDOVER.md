# Handover — sourdough-calculator
Last verified: 2026-09-12 at e0a0dc8

> **SUSPENDED (Owner, 2026-09-27)** — part of the svc-lab family, suspended because it did not work out as expected.
> No new work; security upkeep only while anything of it is live. Treat its code, formulas and
> decisions as a **lower-reliability reference**: they may or may not still work, so re-verify before
> reusing anything. Rules: `E:\CLAUDE\COMPANY\GOALS.md` → "Suspended projects".

svc-lab service #3. Goal: `GOALS.md` G-001. Shared conventions: `E:\CLAUDE\projects\svc-lab\`;
charter: `E:\CLAUDE\COMPANY\`.

## Current state

- **Live** at https://sourdough.svc.julienika.cz (deployed 2026-09-07, port 30060; HTTP 200
  re-checked 2026-09-12).
- Three tools, no database: hydration, baker's-percentage recipe scaler (starter flour/water
  counted inside totals, prefermented-flour % shown), starter feeding.
- Verification on 2026-09-12: `npm run test:unit` 25/25. e2e (5 specs) last green 2026-09-08.
- Domain-expert review done 2026-09-08 (D006). Git tree clean.

## How things fit together

- `lib/hydration.ts`, `lib/recipe-scaler.ts` (the substance; two bases, round-trip tested),
  `lib/starter-feeding.ts` (independent).
- One form per tool in `app/_components/`, one page per route with its own FAQ.

## Rules in force

- Don't change `recipe-scaler.ts` without re-reading D001/D006 and re-running its
  double-counting and round-trip tests.
- "Starter %" always means % of total flour; keep the label and warning (D006).
- `npm ci --legacy-peer-deps`; run unit, e2e and `npm run build` before calling work done.

## Next steps and open questions

- Discard/current-jar awareness for the feeding calculator (or an inverse "I need N g of ripe
  levain" mode) — real feature work.
- AdSense per-domain approval unconfirmed (portfolio-wide).

## Deploy log

| Date | Commit | What changed | Verified how |
|---|---|---|---|
| 2026-09-07 | — | First deploy (port 30060) | Real browser computation on `/recipe-scaler` matched unit-tested numbers |
| 2026-09-08 | e0a0dc8 | Domain-review fixes (D006–D008) | Suite re-run; routes 200 |
| 2026-09-27 | dfc1640 | Security: next 16.3.1 → 16.3.6 (critical RCE advisories) | lint, unit 25/25, e2e 5/5, build; container reports 16.3.6; all 4 routes 200 in a browser; other containers untouched |

## Decisions

`docs/decisions/README.md` (D001–D008).
