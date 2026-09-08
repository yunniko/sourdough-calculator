# Domain reference: sourdough baking convention

Reviewed 2026-09-08 by a `domain-expert` subagent per
`COMPANY\STANDARDS.md`'s "Domain depth" guidance. This is the saved
findings summary; see `HANDOVER.md` D5-D8 for what was fixed as a
result.

## What real sources say

**Baker's percentage** = every ingredient as a % of total flour weight,
flour = 100%. Universal in professional baking (The Perfect Loaf).
Jeffrey Hamelman's *Bread* — the standard professional reference —
structures a formula as Overall Formula → Preferment build → Final
Dough: percentages are taken against total flour *including*
prefermented flour, and the final dough is derived by subtracting the
preferment's own flour/water back out. Hamelman prints "Prefermented
Flour %" (PFF) above every formula.

Verified against a real published formula (The Perfect Loaf's
"Beginner's Sourdough Bread"): total flour 1,014g, mix-step flour 938g,
levain-build flour 76g. 938 + 76 = 1,014 exactly; PFF printed as 7.5% =
76 ÷ 1,014. **The subtract-don't-add-on-top method this project's
`recipe-scaler.ts` implements is exactly this professional convention.**

**Important nuance**: TPL's own explainer article says the *opposite* of
what it does in its actual recipes — it treats the starter as "a single,
cohesive unit" by default and offers full flour/water inclusion only as
an opt-in "if you wish to be 100% correct." And the same TPL recipe page
prints two different percentages against two different denominators
(levain % against mix flour; the seed's % against total flour) — a real
source of the "Starter %" ambiguity this project's UI now warns about.

**Hydration** = total water ÷ total flour × 100 (TPL, King Arthur
Baking, The Sourdough Journey). The convention ignores flour's own
~13-14.5% moisture; bakers adjust water empirically instead.

**Feed ratio notation** is carryover (retained) starter : flour : water,
by weight (The Sourdough Journey). Temperature dominates ratio for peak
timing: "a change of 15°F/8°C in temperature will double or halve the
rise/peak time" (TSJ) — a bigger lever than the feed ratio itself.
Sourdough lactobacilli favor ~32-33°C, *Candida milleri* yeast ~27°C
(Gänzle et al. 1998), so temperature also shifts the microbial balance,
not just speed.

**Convergence to steady state**: quantified by the review — feeding
1:5:5 to a starter at a different hydration reaches ~99.6% of the way
to the new steady state within two feeds; feeding 1:1:1 only dilutes
about a third of the old composition per feed, taking four to five
feeds to converge similarly.

**What every professional reference ignores** (standard practice, not a
shortcut unique to this tool): real dry-matter loss during fermentation
(~2-4% of flour, from CO2 off-gassing) and baking loss (~10-20% dough
weight → baked loaf, via oven moisture loss) are both real but
universally treated as outside the baker's-percentage model itself.

## Findings against this project's code (2026-09-08)

| # | Finding | Severity | Fixed? |
|---|---|---|---|
| 1 | `recipe-scaler.ts`'s core subtract-the-preferment model | N/A — confirmed correct, real professional convention | No change needed |
| 2 | Header comment misattributed the convention to TPL/TSJ, which don't use it by default | Unfounded citation | ✅ Fixed (now cites Hamelman) |
| 3 | "Starter %" denominator is genuinely ambiguous and unlabeled — real ~35% relative over-inoculation risk if a user copies the wrong recipe percentage | Highest practical stakes | ✅ Fixed (relabeled, warned, PFF surfaced) |
| 4 | "Starter" vs. "levain" conflation (no separate seed/build stages) | Acceptable simplification, was unlabeled | Documented, not restructured (real feature work) |
| 5 | Recipe scaler ignores flour type (whole wheat/rye absorb more water at the same %) | Missing depth; hydration page overstated its importance as a result | ✅ Page copy softened |
| 6 | `totalDoughWeight` doesn't mention baking loss (~10-20%) for someone targeting a finished loaf weight | Missing caveat | ✅ Fixed (added as an output step) |
| 7 | `hydration.ts` | N/A — confirmed correct and honestly scoped | No change needed |
| 8 | Steady-state assumption in feeding calculator | N/A — the code doesn't actually depend on the seed's real composition; well-handled already | No change needed |
| 9 | "First feed or two" convergence claim only accurate for higher ratios (≥1:2:2); much slower at 1:1:1 | Real inaccuracy for a real use case | ✅ Fixed |
| 10 | Feeding calculator has no discard/current-jar-size awareness — biggest practical gap in that tool | Real gap, could cause real waste | Documented in FAQ, not built (real feature work) |
| 11 | Feeding FAQ's "higher ratio slows fermentation" claim didn't mention temperature dominates | Missing depth | ✅ Fixed |
| 12 | HANDOVER D5's claim that baker's-percentage convention is "unambiguous... not a several-sources-disagree situation" | Factually wrong as written | ✅ Corrected (append-only per charter) |

## Confidence and gaps (from the review)

- High confidence: the recipe-scaler's core method, the hydration
  definition, the feeding-ratio math.
- The 20.3%-vs-938g-denominator finding was derived by the reviewer from
  TPL's own published gram weights (not quoted directly from TPL's
  prose) — matched to within 0.04 percentage points. A human should
  eyeball one more TPL recipe to confirm the pattern generalizes before
  treating it as certain.
- Hamelman's *Bread* pp. 442-446 could not be read directly (paywalled/
  print) — claims come from Fresh Loaf forum discussions that quote and
  work through it. Worth verifying against the book directly if it's on
  hand.
- Thin/contradictory sourcing, not used as fact anywhere in the app: the
  stiff-vs-liquid starter → acetic-vs-lactic acid claim is craft
  consensus with weak primary backing; the ~2-4% fermentation dry-matter
  loss figure is forum-measured, not peer-reviewed.
