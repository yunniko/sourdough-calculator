<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# sourdough-calculator — project conventions

Read `HANDOVER.md` first: current state, decision record (especially D1's
baker's-percentage derivation), next steps. Goal in `GOALS.md` (G-001).
Parent initiative in `E:\CLAUDE\projects\svc-lab\`; company-wide standards
in `E:\CLAUDE\COMPANY\`.

- Stack: Next.js App Router, TypeScript, Tailwind. No database, no auth,
  no accounts.
- `lib/recipe-scaler.ts` is the one non-trivial module — don't change its
  formulas without re-reading HANDOVER D1 and re-running
  `tests/unit/recipe-scaler.spec.ts`'s double-counting/round-trip checks.
- `npm install`/`npm ci` need `--legacy-peer-deps` (a live npm/arborist
  bug, not specific to this project — see `svc-lab/HANDOVER.md`).
- Two test layers: `npx vitest run` (unit — hand-verified baker's-
  percentage numbers) and `npx playwright test` (e2e — real browser
  flows). Both must pass before calling a change done; also run
  `npm run build` — it catches server/client boundary bugs that `next
  dev`, ESLint, and TypeScript don't (see `yarn-gauge-converter/
  HANDOVER.md` D1 for a real example from a sibling project).
- Live at https://sourdough.svc.julienika.cz — see
  `E:\CLAUDE\COMPANY\INFRASTRUCTURE_DEPLOY.md` for the redeploy command.
