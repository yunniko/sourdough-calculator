# Goals — sourdough-calculator

Owner writes goals here; The Company plans, executes, and logs against them.
Statuses: `DRAFT` · `ACTIVE` · `BLOCKED` · `DONE`.
Parent initiative: `E:\CLAUDE\projects\svc-lab\` (same milestone-gate waiver
and standing deploy pre-approval apply here). Template/numbering
conventions in `E:\CLAUDE\COMPANY\GOALS.md`.

## Active goals

### G-001 · Sourdough baking calculators — ACTIVE
- **What:** Three tools at `sourdough.svc.julienika.cz`: a hydration
  calculator (`/hydration`), a full recipe scaler using baker's
  percentages (`/recipe-scaler`), and a starter feeding calculator
  (`/starter-feeding`). No database, no accounts.
- **Why:** svc-lab idea #4 — a large, search-heavy hobbyist baking
  audience, and the underlying math (baker's percentages accounting for
  a starter's own flour/water) is genuinely fiddly enough that people
  search for a calculator rather than doing it by hand.
- **Acceptance criteria:** All three tools compute correctly
  (unit-tested against hand-verified numbers), a real browser flow
  verified (e2e-tested), live and reachable over HTTPS, sitemap present.
- **Constraints:** No database, no accounts, no paid dependencies.

**Milestones:**
- [x] M1 — Build: baker's-percentage recipe scaler (derived and verified
      algebraically — total dough weight reduces to flour × (1 + hydration
      + salt) with no double-counting of the starter's own flour/water),
      hydration calculator, starter feeding calculator, 3 tool pages, 24
      Vitest unit tests, 5 Playwright e2e tests. All verified locally
      (`npm run build`, `npx vitest run`, `npx playwright test`,
      `npx eslint .` all clean). ✔ 2026-09-07.
- [ ] M2 — Deploy: git repo, push, clone to VPS, docker compose up,
      `julai-new-vhost`, verify live over HTTPS, confirm no other site on
      the host was affected.
- [ ] M3 — Monetization once an ad/payment account exists (blocked on
      Owner, same as the other svc-lab services).

**Progress log** (newest first):
- 2026-09-07 — M1 complete, verified locally. See HANDOVER.md for the
  baker's-percentage derivation. No build/lint issues this time; e2e
  caught one ambiguous test selector (fixed in the test, not the app).
