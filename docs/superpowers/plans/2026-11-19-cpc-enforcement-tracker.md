# CPC Enforcement Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive React + Vite CPC enforcement intelligence dashboard for EU consumer-protection cases across apps, ecommerce/marketplaces, subscriptions, payments, and advertising.

**Architecture:** A single-page React application owns view state, filters, the selected case, and the detail drawer. Reviewed public-source records live in a typed data module; pure metric/filter functions live separately so KPI, charts, table, and sources use one filtered population. The UI uses native CSS/SVG primitives and no backend or heavy component library.

**Tech Stack:** React 18+, TypeScript, Vite, Vitest, native CSS, inline SVG icons.

**Spec:** `docs/superpowers/specs/2026-11-19-cpc-enforcement-tracker-design.md`

## Global Constraints

- Use the four European Commission entry pages and directly linked official Commission PDFs as the first-source snapshot.
- One `CaseRecord` represents one public CPC action/enforcement track, not one company-wide profile.
- Keep `coordinatedActions[]`, `commitments[]`, and `finalPenalties[]` independent; a case may contain multiple records of each.
- Never render an unknown final-fine amount as `0`; distinguish no recorded public fine from an explicitly undisclosed amount.
- Active coordinated action means `status` is `investigating`/`ongoing`, or any coordinated action has one of those statuses.
- KPI and filter behavior must use the same filtered case population; theme counts count each case at most once per theme.
- Do not invent legal conclusions, participant countries, dates, amounts, branding, risk scores, or unsupported claims.
- Keep the default view as an operational dashboard: metrics, review queue, theme distribution, outcome split, and source health before detail exploration.
- Preserve accessible focus states, keyboard-openable case details, mobile drawer behavior, readable tables, and text alternatives for charts.

## Review Focus

- **Missing fine data:** a case with no `finalPenalties[]` shows “暂无公开罚款记录”, while a penalty with `disclosure: 'not_disclosed'` shows “金额未披露” and never `€0`; test in `src/lib/metrics.test.ts` and `src/components/CaseDrawer.test.tsx`.
- **Mixed outcomes:** a case can have an ongoing coordinated action plus commitments; the overview and row badges show both independently; test in `src/lib/metrics.test.ts`.
- **Filter denominator consistency:** search/model/theme/status/year filters change KPI, charts, and table together; test `filterCases()` and `computeOverview()` in `src/lib/metrics.test.ts`.
- **Unknown dates:** missing dates render “未披露” and year filtering uses `lastUpdate` then `firstAction`; test `getCaseYear()` and date formatting.
- **Responsive detail workflow:** selecting a row opens a keyboard-accessible drawer on desktop and full-screen detail on small viewports, with source links preserved; test with browser verification after unit tests.

## File Map

- Create `package.json`: scripts and React/Vite/Vitest dependencies.
- Create `index.html`: root document and metadata.
- Create `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: strict TypeScript and Vite/Vitest setup.
- Create `src/main.tsx`: React root mount.
- Create `src/types.ts`: `CaseRecord`, source, result, filter, metric, and view types shared by data and UI.
- Create `src/data/sources.ts`: official source registry, checked date, title, and scope notes.
- Create `src/data/cases.ts`: source-backed seed records for the required app/ecommerce/subscription/advertising coverage.
- Create `src/lib/metrics.ts`: pure filtering, active-state, KPI, theme, outcome, and timeline helpers.
- Create `src/lib/format.ts`: stable date, amount, status, theme, business-model, and disclosure labels.
- Create `src/lib/metrics.test.ts`: deterministic tests for the data/metric contract.
- Create `src/components/Icon.tsx`: a small inline SVG icon set with accessible labels.
- Create `src/components/StatusBadge.tsx`: reusable status/result/theme badges.
- Create `src/components/KpiCard.tsx`: top-level metric card with semantic delta/context copy.
- Create `src/components/Filters.tsx`: search, single-select filters, clear action, and result count.
- Create `src/components/ThemeBars.tsx`: accessible horizontal theme distribution visualization.
- Create `src/components/OutcomeSplit.tsx`: distinct action/commitment/fine result summary.
- Create `src/components/SourceHealth.tsx`: source coverage, checked date, and data-boundary note.
- Create `src/components/CaseTable.tsx`: sortable/filter-ready case table and keyboard row actions.
- Create `src/components/CaseDrawer.tsx`: selected-case summary, outcomes, timeline, evidence, and source links.
- Create `src/App.tsx`: shell, view navigation, filter state, derived metrics, table/drawer composition.
- Create `src/styles.css`: tokens, layout, responsive rules, focus states, charts, table, drawer, and motion.

### Task 1: Scaffold the typed Vite app and data contract

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/types.ts`

**Interfaces:**
- Produces: `CaseRecord`, `SourceRecord`, `FilterState`, `OverviewMetrics`, `ThemeCount`, `OutcomeCount`, and `AppView` exported from `src/types.ts`.

- [ ] **Step 1: Write the failing type/metric test harness**

Create `src/lib/metrics.test.ts` with imports from `src/lib/metrics.ts` and one test that calls `filterCases()` and `computeOverview()` against a two-record fixture. The test should fail because the modules do not exist yet.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/lib/metrics.test.ts`  
Expected: FAIL because the Vite/Vitest project and metric module are not yet defined.

- [ ] **Step 3: Implement the minimal Vite/TypeScript scaffold**

Add the scripts `dev`, `build`, `preview`, and `test`; configure strict TypeScript and Vitest with the jsdom environment. Mount a placeholder `<div id="root">` from `src/main.tsx`. Define the shared literal unions and interfaces in `src/types.ts`, including `timeline` and `finalPenalties[]` exactly as the spec requires.

- [ ] **Step 4: Install dependencies and run the scaffold test**

Run: `npm install && npm test -- --run src/lib/metrics.test.ts`  
Expected: the test now reaches the missing implementation assertion rather than a toolchain/configuration failure.

### Task 2: Add the reviewed public-source snapshot and pure data helpers

**Files:**
- Create: `src/data/sources.ts`
- Create: `src/data/cases.ts`
- Create: `src/lib/metrics.ts`
- Create: `src/lib/format.ts`
- Modify: `src/lib/metrics.test.ts`

**Interfaces:**
- Consumes: types from `src/types.ts`.
- Produces: `sources`, `cases`, `filterCases(cases, filters)`, `isActiveCase(record)`, `getCaseYear(record)`, `computeOverview(records)`, `getThemeCounts(records)`, and `getOutcomeCounts(records)`.

- [ ] **Step 1: Complete failing tests for the data contract**

Pin tests for: an active investigation counting as active, a commitment-only case not counting as active, a mixed action+commitment case returning both outcomes, one case appearing once per selected theme, a disclosed fine counting separately from a missing fine, and year fallback from `lastUpdate` to `firstAction`.

- [ ] **Step 2: Run the focused tests and verify the expected failures**

Run: `npm test -- --run src/lib/metrics.test.ts`  
Expected: FAIL on the unimplemented helpers and missing fixture data.

- [ ] **Step 3: Implement `src/data/sources.ts` and `src/data/cases.ts`**

Register the four official Commission page URLs from the spec with `checkedAt: '2026-11-19'`. Seed one action-track record each for SHEIN, Apple, Temu, Vinted, viagogo, PayPal, Shopify, Amazon Prime, Tinder, recurring subscription payments, and selected advertising/social-media records. Use only dates and claims supported by the source summaries; leave unsupported dates/authorities empty. Include practice tags for dark patterns, subscription renewal/cancellation, misleading discounts, reviews/ratings, and advertising. Keep `finalPenalties` empty unless the source explicitly supports a final penalty; do not fabricate an amount.

- [ ] **Step 4: Implement pure metrics and formatting helpers**

Implement `filterCases(cases: CaseRecord[], filters: FilterState): CaseRecord[]` with AND semantics across search/model/status/theme/year; `isActiveCase(record: CaseRecord): boolean`; `getCaseYear(record: CaseRecord): number | null`; `computeOverview(records: CaseRecord[]): OverviewMetrics`; `getThemeCounts(records: CaseRecord[]): ThemeCount[]`; and `getOutcomeCounts(records: CaseRecord[]): OutcomeCount[]`. Keep counts deterministic and based on the documented denominators. Put user-facing labels and `formatDate(value?: string): string` in `src/lib/format.ts`, returning `未披露` for absent dates.

- [ ] **Step 5: Run the metric tests to verify they pass**

Run: `npm test -- --run src/lib/metrics.test.ts`  
Expected: PASS for filtering, active status, mixed outcomes, theme de-duplication, fine disclosure, and year fallback.

### Task 3: Build the reusable dashboard visual primitives

**Files:**
- Create: `src/components/Icon.tsx`
- Create: `src/components/StatusBadge.tsx`
- Create: `src/components/KpiCard.tsx`
- Create: `src/components/Filters.tsx`
- Create: `src/components/ThemeBars.tsx`
- Create: `src/components/OutcomeSplit.tsx`
- Create: `src/components/SourceHealth.tsx`
- Modify: `src/lib/metrics.test.ts` only if component-facing labels need a stable fixture.

**Interfaces:**
- Consumes: typed metrics from Task 2 and callback props from `App.tsx`.
- Produces: presentational components with explicit props, no direct mutation of data or filter state.

- [ ] **Step 1: Implement icon and badge variants**

Create `Icon({ name, size, label })` with inline SVG paths for search, chevron, close, arrow-up-right, filter, grid, list, layers, and alert; use `currentColor`, focus-safe button wrappers, and adjacent text when meaning matters. Create `StatusBadge` variants for the documented status, result type, theme, and disclosure labels.

- [ ] **Step 2: Implement the KPI and source-health components**

`KpiCard` accepts `{ label, value, helper, tone }` and renders one prominent number plus a factual helper; `SourceHealth` accepts `{ sources, recordCount }` and renders the checked date, source count, record count, and “公开来源快照，需人工复核” note without inventing freshness.

- [ ] **Step 3: Implement filter controls**

`Filters` accepts `{ filters, onChange, onClear, resultCount }` and emits `FilterState` updates for search, business model, status, theme, and year. Include an explicit “清除筛选” action and make all controls keyboard/focus accessible.

- [ ] **Step 4: Implement theme and outcome visuals**

`ThemeBars` accepts `ThemeCount[]` and renders labelled CSS/SVG bars with `aria-label` text; `OutcomeSplit` accepts `OutcomeCount[]` and renders separate action, commitment, and disclosed-fine summaries with their distinct denominators.

- [ ] **Step 5: Run typecheck/build before composing the page**

Run: `npm run build`  
Expected: PASS with reusable components type-checking even before App wiring is complete; if the placeholder app is necessary, keep it minimal and non-final.

### Task 4: Compose the shell, case table, and detail drawer

**Files:**
- Create: `src/components/CaseTable.tsx`
- Create: `src/components/CaseDrawer.tsx`
- Create: `src/App.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `cases`, `sources`, metric helpers, and all visual primitives from Tasks 2–3.
- Produces: local-state app behavior: view switching, filter updates, selected case, drawer close, and source-link navigation.

- [ ] **Step 1: Implement `CaseTable({ cases, onSelect })`**

Render company, business model, themes, status, result badges, last update, lead authority, and source count. Keep row selection keyboard-accessible with `Enter`/`Space`; use stable IDs and a visible empty state when filters produce no matches.

- [ ] **Step 2: Implement `CaseDrawer({ record, onClose, sources })`**

Render the case summary, independent coordinated actions, commitments, final-penalty state, timeline, evidence summaries, and source links. Render “暂无公开罚款记录” for an empty `finalPenalties[]`; render “金额未披露” without an amount when disclosure is `not_disclosed`. Support `Escape`, close button, focus-visible styles, and `aria-modal`/labeling.

- [ ] **Step 3: Compose `App.tsx` state and derived view model**

Keep `activeView`, `filters`, and `selectedCaseId` in React state. Derive `filteredCases`, `overview`, `themeCounts`, and `outcomeCounts` with the pure helpers. Render the Overview default with shell, header, filters, KPI row, review queue, theme bars, outcome split, source health, and table; render Cases/Themes/Sources as focused alternate states using the same records and filter logic.

- [ ] **Step 4: Verify the core interactions in a running dev server**

Run: `npm run dev -- --host 127.0.0.1` and open the local URL in the built-in browser. Verify search, each filter, clear filters, case row selection, drawer close, source link, sidebar view changes, and empty-state recovery. Record any visual or interaction mismatch before styling polish.

### Task 5: Implement the visual system and responsive behavior

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx` only for semantic/aria attributes exposed by CSS states.

**Interfaces:**
- Consumes: existing component class names and design tokens from the approved design document.
- Produces: the accepted dashboard visual system at desktop, tablet, and mobile widths.

- [ ] **Step 1: Add base tokens and desktop layout**

Define the cold grey-white background, white surfaces, ink text, muted text, fine borders, coral risk accent, teal improvement accent, compact radii, spacing scale, system font stack, and subtle motion. Build the left rail, top header, KPI row, open content sections, table, and right-side drawer without nested card spam.

- [ ] **Step 2: Add controls, charts, table, and drawer states**

Style focused inputs/selects, active navigation, selected rows, badge variants, semantic bar colors, table overflow, empty states, source links, timeline markers, and drawer overlay. Keep chart text readable and never rely on color alone.

- [ ] **Step 3: Add responsive rules and reduced-motion behavior**

At tablet width, allow table overflow and wrap summary regions; at mobile width, collapse the nav to a top row, stack KPI cards, convert the table to a readable list layout, and make the drawer full-screen. Add `@media (prefers-reduced-motion: reduce)` to disable nonessential transitions.

- [ ] **Step 4: Run build and focused tests**

Run: `npm test -- --run && npm run build`  
Expected: PASS with no TypeScript/build errors.

### Task 6: Verify against the approved design and source contract

**Files:**
- Modify: any implementation file with verified issues found in the checks below.
- Optional Create: `qa/` only if a temporary screenshot or comparison artifact is needed; remove temporary QA artifacts before handoff.

**Interfaces:**
- Consumes: the complete running app and approved design document.
- Produces: a verified local build with no material source/interaction/layout mismatches.

- [ ] **Step 1: Inspect the source and data semantics**

Run: `npm test -- --run`  
Expected: all unit tests pass; manually reconcile the number of records, source URLs, practice tags, active statuses, commitment counts, and the empty disclosed-fine count against `src/data/cases.ts`.

- [ ] **Step 2: Verify browser interactions at desktop size**

Use Browser/IAB first. Check the first viewport hierarchy, filter results, mixed-outcome detail, no-fine state, all navigation views, source links, keyboard close, and visible focus states.

- [ ] **Step 3: Verify mobile layout**

Use a mobile-sized viewport and check no horizontal overflow outside the intentionally scrollable table, stacked KPI/filters, readable case rows, full-screen drawer, and preserved source actions.

- [ ] **Step 4: Capture implementation screenshot and inspect visual fidelity**

Capture the latest browser screenshot at the design concept's native size when practical. Compare copy, layout, palette, typography, spacing, badges, table density, drawer treatment, and responsive behavior; fix material mismatches rather than documenting avoidable drift.

- [ ] **Step 5: Run final verification**

Run: `npm test -- --run && npm run build`  
Expected: PASS. Final handoff states the source snapshot date, Browser/IAB verification method, inspected desktop/mobile sizes, core workflow tested, and any intentional limitation (no automatic refresh/backend).

## Self-Review Coverage

The plan covers all spec sections: intent and scope in the default shell; distinct action/commitment/fine outcomes in `types.ts`, `metrics.ts`, `OutcomeSplit`, and `CaseDrawer`; five required practice themes in seeded data and `ThemeBars`; source provenance in `sources.ts` and `SourceHealth`; the full review workflow in `App.tsx`; responsive behavior in `styles.css`; and build/source/interaction verification in Tasks 2 and 6. No separate plan is needed because the request is one tightly coupled dashboard surface whose data, metrics, and UI are meant to ship together.

The current folder is not a Git repository, so the plan intentionally omits commit steps; implementation should preserve the spec/plan files and leave the working directory runnable without introducing Git metadata.
