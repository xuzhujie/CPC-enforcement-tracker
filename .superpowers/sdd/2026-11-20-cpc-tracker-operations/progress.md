# SDD ledger — plan: docs/superpowers/plans/2026-11-20-cpc-tracker-operations.md

Ruling: the existing dashboard is the source artifact and this plan extends it in place; no second UI scaffold or backend is introduced before the update cadence and source-connection contract are known.

Pre-flight: Task 1 produces `CaseReview` and `SnapshotManifest`, consumed by Task 2's workflow/export helpers and Task 3's acceptance checks. Task 2's UI contract is consumed by Task 3's browser/release verification. No conflicting interfaces found.

Task 1: Ruling: operational ownership is intentionally `待分配` and review dates are clearly labeled as operational fields, not source facts; active cases receive a high priority and a one-week follow-up, while commitment-monitoring cases use the snapshot cadence. Cost if wrong: queue urgency may need team-specific tuning, but no legal fact is fabricated.

Task 1: complete (no git commit; tests: `npm test -- --run` → 18 passed; `npm run data:check` → expected to reuse the same 3 data-quality tests; source health now exposes checked and next-review dates)

Task 2: complete (no git commit; tests: `npm test -- --run` → 24 passed; `npm run build` → PASS; workflow now prioritizes active cases, supports sortable review/date columns, shows owner and next review metadata, and exports the current register as source-aware CSV)
