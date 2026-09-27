# sourdough-calculator

> **SUSPENDED (Owner, 2026-09-27)** — part of the svc-lab family, suspended because it did not work out as expected.
> No new work; security upkeep only while anything of it is live. Treat its code, formulas and
> decisions as a **lower-reliability reference**: they may or may not still work, so re-verify before
> reusing anything. Rules: `E:\CLAUDE\COMPANY\GOALS.md` → "Suspended projects".

Three tools for sourdough bakers: a hydration calculator, a full recipe
scaler using baker's percentages (accounting for the flour/water inside
your starter), and a starter feeding calculator. Part of the `svc-lab`
portfolio (see `E:\CLAUDE\projects\svc-lab\`).

## Running it

```
npm install --legacy-peer-deps
npm run dev
```

Production build/run: `docker compose --profile app up -d --build`
(no database — stateless).

## Tests

```
npx vitest run        # unit tests — lib/*.ts baker's-percentage math
npx playwright test   # e2e — real browser flows for all three tools
```

## Current state

Built and verified locally 2026-09-07 (24 unit tests + 5 e2e tests
passing, production build succeeds). See `HANDOVER.md` for the
baker's-percentage derivation and architecture notes, `GOALS.md` for
deploy status.
