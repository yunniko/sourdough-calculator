# Handover — sourdough-calculator

Read this before touching the project. Goal in `GOALS.md` (G-001).
Parent initiative: `E:\CLAUDE\projects\svc-lab\`. Company-wide standards
in `E:\CLAUDE\COMPANY\`.

## Current state

M1 done and verified locally 2026-09-07: 24 Vitest unit tests, 5
Playwright e2e tests (real Chromium browser), ESLint clean, `npm run
build` succeeds with every route statically prerendered. Not yet
deployed (M2).

## How things fit together

- `lib/hydration.ts` — simple flour/water/hydration% relationships.
- `lib/recipe-scaler.ts` — the real substance: full baker's-percentage
  math that treats the starter's own flour/water as already part of the
  total-flour/total-water baseline rather than adding it on top (see D1
  for the derivation). Supports scaling from either a total flour
  weight or a target total dough weight.
- `lib/starter-feeding.ts` — independent of the recipe scaler; answers
  "how much to add to my starter," not "how much starter to use in a
  recipe."
- Each tool has its own client-component form
  (`app/_components/*-form.tsx`) and its own route/page with distinct
  metadata and FAQ content, matching the pattern in `fraction-calculator`
  and `yarn-gauge-converter`.

## Decision record

**D1 — Baker's percentages: total flour includes the flour inside the
starter, and this is derived/verified algebraically, not assumed.**
Given total flour F, hydration ratio H, salt ratio S, starter weight as
a fraction of F, and the starter's own water:flour ratio Lh: the
starter's flour/water are subtracted out of what's added at final mix
(`flourInMix = F - flourInStarter`, `waterInMix = totalWater -
waterInStarter`) rather than added on top. Verified this doesn't
double-count anything: `flourInMix + waterInMix + starterWeight + salt`
algebraically reduces to exactly `F + F×H + F×S` — i.e. total dough
weight is just `F × (1 + H + S)`, independent of how the starter itself
is split into flour/water. This identity is checked directly in
`tests/unit/recipe-scaler.spec.ts` ("never double-counts the starter's
own flour/water"), not just asserted in a comment.

**D2 — Two independent starting points for the recipe scaler (total
flour vs. total dough weight), verified to round-trip.** A baker often
knows one or the other (a recipe's usual flour amount, or "I need 900g
for this basket"). `scaleRecipe`'s `basis` field picks which; the
`doughWeight` case solves `F = amount / (1 + H + S)` first, then runs
the same computation. Tested that scaling by flour and then by that
result's dough weight recovers the same total flour (round-trip test).

**D3 — Starter feeding calculator is a separate tool from the recipe
scaler, not a "starter percent" mode of it.** They answer genuinely
different questions: the recipe scaler asks "how much starter (as % of
a recipe) do I use," the feeding calculator asks "how much do I add to
the starter jar I already have." Conflating them into one form would
have made both more confusing to use, for no shared computation (they
don't call each other).

**D4 — Feeding calculator assumes the existing starter is at a steady
state matching the feed ratio.** It can't know the starter's actual
current flour:water split without being told, so `ratioHydrationPercent`
is presented as "this ratio's hydration," not claimed as the exact
resulting hydration of old+new combined — stated explicitly in the FAQ
copy on `/starter-feeding` to avoid overclaiming precision.

**D5 — Data/formulas came from working through the math directly, not
from an external source, unlike `yarn-gauge-converter`'s reference
tables.** Baker's-percentage math is a well-established, unambiguous
technique (not a "several sources disagree" situation like yarn naming
conventions) — the derivation in D1 is the source of truth, checked by
tests, rather than something needing a citation.

## Next steps and open questions

- Deploy (M2) following the standard pattern (see
  `E:\CLAUDE\COMPANY\INFRASTRUCTURE_DEPLOY.md`), port 30060.
- Monetization not yet live — blocked on the Owner (see
  `svc-lab/HANDOVER.md`'s Owner action list).
