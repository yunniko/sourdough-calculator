# D001 · Total flour includes the starter's flour; verified algebraically
Date: 2026-09-07 · Goal: G-001 · Status: active
Context: Baker's percentages with a preferment (Hamelman's *Bread* convention — corrected citation, D006).
Decision: `flourInMix = F − flourInStarter`, `waterInMix = totalWater − waterInStarter`; total dough = `F × (1 + H + S)` regardless of starter split, asserted by a unit test.
Rejected: adding the starter on top.
Consequence: Re-run `tests/unit/recipe-scaler.spec.ts` after any formula change.
Evidence: `lib/recipe-scaler.ts`.
