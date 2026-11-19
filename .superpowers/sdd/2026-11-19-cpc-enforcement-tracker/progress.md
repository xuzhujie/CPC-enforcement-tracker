# SDD ledger — plan: docs/superpowers/plans/2026-11-19-cpc-enforcement-tracker.md

Ruling: the current workspace is not a Git repository, so work proceeds in this already-isolated project directory without worktree/task-brief scripts or commit steps; the spec and plan remain the source of truth and all verification is recorded here.

Pre-flight: Task 1 produces the shared TypeScript contract consumed by Tasks 2–4; Task 2 produces the data/metrics interfaces consumed by Tasks 3–4; Task 3 produces presentational component props consumed by Task 4; Task 5 styles the class names emitted by Tasks 3–4; Task 6 validates the complete output. No conflicting interfaces found.

Task 1: Ruling: the initial metrics test intentionally remains red after the scaffold because `src/lib/metrics.ts` is Task 2's implementation; Task 1's green gate is the scaffold build, while Task 2 owns the RED→GREEN transition for this shared test.

Task 1: Ruling: Vite and Vitest resolve different Vite type trees in the installed dependency set, so build config and test config are split into `vite.config.ts` and `vitest.config.ts`; this preserves the same scripts and runtime behavior at the cost of one extra config file.

Task 1: complete (no git commit; tests: initial `npm test -- --run src/lib/metrics.test.ts` → expected missing-module RED; `npm run build` → PASS)

Task 2: complete (no git commit; tests: `npm test -- --run` → 4 passed; `npm run build` → PASS)

Task 3: Ruling: the icon set uses wrapped inline SVG fragments for multi-node icons and `SourceHealth` avoids `Array.at()` so the approved ES2020 target remains buildable; no product behavior changed.

Task 3: complete (no git commit; tests: `npm test -- --run` → 7 passed; `npm run build` → PASS)

Task 4: Ruling: the browser preview step is deferred until Task 5 creates the imported stylesheet; the complete functional workflow is covered by SSR tests now, and browser verification will run against the styled app before Task 6 closes the plan.

Task 4: complete (no git commit; tests: `npm test -- --run` → 10 passed)

Task 5: Ruling: the approved IAB preview exposed the desktop tab and scrollable lower sections but no viewport-override API, so responsive CSS is implemented and inspected in source while mobile screenshot verification remains a documented limitation for Task 6.

Task 5: complete (no git commit; tests: `npm test -- --run` → 10 passed; `npm run build` → PASS; Browser/IAB desktop preview → loaded and interacted)

Task 6: Ruling: the final review found no Critical issues. Important findings were fixed in one pass: month/year date precision is preserved, source titles are searchable, select labels retain screen-reader semantics and visible focus, the year filter remains available on mobile CSS, the mobile drawer uses the viewport width, theme bars are keyboard-operable and route into Cases, and the drawer moves focus in, traps Tab, handles Escape, and restores focus.

Task 6: Ruling: mobile screenshot verification remains unavailable because the IAB control surface has no viewport override in this session; responsive rules are present at the <=720px breakpoint and desktop browser verification passed. Cost if wrong: an undetected mobile regression, not a hidden change to the desktop workflow.

Task 6: Ruling: exhaustive legal/source completeness is outside this build scope; the tracker is explicitly a dated snapshot of four official European Commission entry points, with direct source links and a manual-review boundary. Cost if wrong: omitted or stale public-source coverage, not fabricated enforcement outcomes.

Task 6: Ruling: deployment posture and dependency vulnerability remediation are outside this build scope; local production build passed, while an audit endpoint check was unavailable due registry DNS. Cost if wrong: unknown hosting/dependency posture, not a failing application build.

Task 6: deferred minor review items: review queue ordering still follows seed order; the case table has no sortable headers; outcome copy does not yet spell out every case-vs-record denominator. These are follow-up refinements, not blockers for the approved snapshot tracker.

Task 6: complete (no git commit; tests: `npm test -- --run` → 15 passed; `npm run build` → PASS; Browser/IAB → source-title search, reset, theme-to-Cases navigation, drawer opening, focus transfer, Escape close, and Overview restoration verified; deliverable tab marked)
