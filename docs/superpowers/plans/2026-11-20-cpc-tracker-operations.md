# CPC Tracker Operations and Release Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing CPC enforcement snapshot dashboard into a maintainable operational tracker with review ownership metadata, prioritized/sortable case workflow, CSV handoff, and a verified release package suitable for private internal hosting.

**Architecture:** Keep the current React/Vite dashboard and official European Commission snapshot as the source of truth. Add a typed snapshot manifest and validation layer for update hygiene, a pure workflow/sorting/export layer for operational actions, and a small release README plus production-preview verification rather than introducing a backend before the data lifecycle is agreed.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, jsdom, CSS.

**Spec:** `docs/superpowers/specs/2026-11-19-cpc-enforcement-tracker-design.md`

## Global Constraints

- Preserve the separation between coordinated actions, company commitments, and final penalties.
- Treat the current data as a dated public-source snapshot; never present it as a live official database.
- Keep official European Commission URLs and source checked dates attached to records.
- Preserve the existing light dashboard visual language and keyboard-accessible case drawer.
- Do not invent disclosed fines or legal conclusions.
- Keep the app local-first and private by default when preparing hosting.

## Review Focus

- Missing or malformed review metadata must fail the data check rather than silently entering the operational queue.
- Source references and penalty disclosure semantics must remain valid when new cases are added.
- Priority and next-review sorting must be deterministic and must not mutate the filtered input.
- CSV export must escape commas, quotes, and line breaks without losing case/source fields.
- The production build must preserve the opening hierarchy, keyboard paths, and responsive rules at 320–768px widths.

### Task 1: Snapshot manifest and data-quality gate

**Files:**
- Create: `src/data/snapshot.ts`
- Create: `src/lib/dataQuality.ts`
- Create: `src/lib/dataQuality.test.ts`
- Modify: `src/types.ts`, `src/data/cases.ts`, `src/components/SourceHealth.tsx`, `src/App.tsx`, `src/components/components.test.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces `SnapshotManifest`, `CaseReview`, `snapshotManifest`, and `validateSnapshot(records, sources, snapshot)` for Tasks 2–3.

- [ ] Write failing tests for a valid reviewed snapshot, missing review metadata, unknown source references, duplicate IDs, and invalid penalty disclosure fields.
- [ ] Run the focused data-quality test and confirm RED for the missing implementation/exports.
- [ ] Add the manifest, required case review fields, validation function, `data:check` script, and source-health display for checked/next-review dates.
- [ ] Run focused and full tests; confirm GREEN with no warnings.

### Task 2: Operational case workflow and handoff

**Files:**
- Create: `src/lib/caseWorkflow.ts`
- Create: `src/lib/caseWorkflow.test.ts`
- Create: `src/lib/export.ts`
- Create: `src/lib/export.test.ts`
- Modify: `src/components/CaseTable.tsx`, `src/components/CaseDrawer.tsx`, `src/components/OutcomeSplit.tsx`, `src/components/StatusBadge.tsx`, `src/App.tsx`, `src/styles.css`
- Modify: `src/components/workflow.test.tsx`, `src/components/components.test.tsx`

**Interfaces:**
- Consumes `CaseReview` and `SnapshotManifest` from Task 1.
- Produces deterministic `sortCases`, `getReviewQueue`, and `casesToCsv` behavior for the dashboard and release handoff.

- [ ] Write failing tests for priority/next-review queue ordering, stable sort behavior, and CSV escaping.
- [ ] Run focused tests and confirm RED.
- [ ] Implement review-priority badges, sortable table headers, due-date/owner columns, drawer review metadata, a deterministic review queue, and current-case CSV export.
- [ ] Run focused and full tests; confirm GREEN with no warnings.

### Task 3: Release documentation, production preview, and private publication readiness

**Files:**
- Create: `README.md`
- Create: `scripts/acceptance-check.mjs`
- Modify: `package.json`, `.gitignore` (if needed), `index.html`

**Interfaces:**
- Consumes the data check, workflow tests, and Vite build from Tasks 1–2.
- Produces a documented local/production runbook and a bounded acceptance command for build, data, and responsive source checks.

- [ ] Write failing acceptance tests/checks for required scripts, manifest presence, responsive breakpoints, and accessible dashboard anchors.
- [ ] Run the acceptance command and confirm RED before the release documentation/check script exists.
- [ ] Implement the runbook and acceptance check; keep publishing private by default and avoid claiming a live refresh path.
- [ ] Run `npm run data:check`, `npm test -- --run`, `npm run build`, `npm run acceptance`, and a production-preview browser pass.
- [ ] If the Sites connector is available, initialize a private Site only after the compiled artifact and local acceptance pass; otherwise retain the verified local release and report the hosting blocker.
