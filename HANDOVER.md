# Handover — sourdough-calculator

Read this before touching the project. Goal in `GOALS.md` (G-001).
Parent initiative: `E:\CLAUDE\projects\svc-lab\`. Company-wide standards
in `E:\CLAUDE\COMPANY\`.

## Current state

**Live at https://sourdough.svc.julienika.cz** (deployed 2026-09-07).
M1 and M2 both done and verified: 24 Vitest unit tests, 5 Playwright e2e
tests, ESLint, and `npm run build` all pass locally; in production,
verified a real browser computation on `/recipe-scaler` that matched
the unit-tested numbers exactly, and confirmed every other container on
the shared VPS kept its prior uptime.

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
from an external source.** *(Corrected 2026-09-08 — see D6: this
entry's original claim that baker's-percentage math is "unambiguous...
not a 'several sources disagree' situation" turned out to be wrong. The
arithmetic is unambiguous; the naming conventions around it are not —
kept here for the record, not deleted, per the charter's append-only
correction rule.)* The derivation in D1 is algebraically self-verifying
regardless — that part of this entry's reasoning holds.

**D6 — Domain-expert review (2026-09-08) found real issues; several
fixed same day.** Per `COMPANY\STANDARDS.md`'s "Domain depth" guidance,
a `domain-expert` subagent reviewed this project's baking convention
against real professional/community sources (Hamelman's *Bread*, The
Perfect Loaf, The Sourdough Journey, published microbiology on
starter fermentation). Full findings in `docs/domain-reference.md`.
Headline result: **the core `recipe-scaler.ts` math is real professional
convention, verified against a published TPL formula's actual gram
weights to within 0.04 percentage points** — not invented. But the
review also found:
- **A misattributed citation** (fixed): the header comment credited "The
  Perfect Loaf" and "The Sourdough Journey" with using the
  subtract-the-preferment convention by default. TPL's own explainer
  article says the opposite for its default guidance. Hamelman's *Bread*
  is the accurate citation — corrected in `lib/recipe-scaler.ts`'s header.
- **A real, unlabeled ambiguity in what "Starter %" means** (fixed): TPL
  itself prints "levain %" against two different denominators on the
  same recipe page (mix flour in one place, total flour in another) —
  someone typing a recipe's percentage into this tool's `starterPercent`
  field (always % of total flour) can get meaningfully more or less
  starter than intended (the review's worked example: a ~35% relative
  over-inoculation, real enough to noticeably shorten bulk fermentation).
  Fixed by relabeling the field "Starter % (of total flour)", adding an
  explicit warning in the form's own copy, and surfacing PFF
  (prefermented flour %, `flourInStarter / totalFlour` — the figure
  professional formulas actually print) as its own output stat so a
  user can cross-check against a recipe that quotes PFF directly.
- **Missing baking-loss caveat** (fixed): `totalDoughWeight` is raw dough
  weight; a baked loaf loses roughly 10-20% more from oven moisture loss.
  Added as an explicit step in `scaleRecipe`'s output.
- **An overclaim on the hydration page** (fixed) — see D7.
- **The starter-feeding FAQ's "first feed or two" claim understated for
  low ratios** (fixed) — see D8.
- **The feeding calculator's real gap isn't the steady-state assumption
  (that one's fine, see D4) — it's that it has no discard/current-jar
  awareness** (documented, not built — real feature work, out of scope
  for this pass): a user with 200g already in the jar entering 200g at
  1:5:5 gets told to add a full kilo of flour and water on top, with no
  prompt to discard first. Left as an open item below.

**D7 — Hydration page's claim that hydration is "the single number that
most determines" dough feel was an overclaim; softened.** The review
noted flour composition (whole wheat/rye vs. white, milling) changes
dough feel and crumb at least as much as hydration does at a fixed
percentage — the two-scalar hydration model can't express flour type at
all. Fixed the copy on `/hydration` to stop asserting hydration is the
single dominant factor.

**D8 — Starter-feeding FAQ's "first feed or two won't be exact" claim
was only accurate for higher feed ratios.** The review quantified
convergence toward steady-state hydration: for a 1:5:5 (or higher)
ratio, "one or two feeds" is right. For a 1:1:1 ratio, convergence is
much slower (roughly four to five feeds from a starter well off its
steady state) because each feed only dilutes about a third of the prior
composition rather than most of it. Fixed the FAQ copy to note this
varies by ratio rather than stating a single number.

## Next steps and open questions

- Give the starter-feeding calculator discard/current-jar-size awareness
  (D6's last finding) — e.g. "you have X g, keep Y g, discard the rest,
  then add..." — or an inverse mode ("I need N g of ripe levain at this
  ratio, tell me the seed/flour/water"), matching what The Perfect
  Loaf's own starter calculator does. Real feature work, not a quick fix.
- Monetization not yet live — blocked on the Owner (see
  `svc-lab/HANDOVER.md`'s Owner action list).
