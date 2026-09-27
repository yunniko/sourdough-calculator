# D002 · Scale from total flour or total dough weight; round-trip tested
Date: 2026-09-07 · Goal: G-001 · Status: active
Context: Bakers know one or the other.
Decision: `basis` picks; dough-weight solves `F = amount / (1 + H + S)` first.
Rejected: —
Consequence: —
Evidence: `tests/unit/recipe-scaler.spec.ts`.
