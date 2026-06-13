# Biome v2.5 rules — adoption decisions

Audit of the 7 consuming projects (feedstand, feedsweep, feedsmith, feedcanon, feedscout, feedmatch, urlpurify) against the rules introduced or promoted to stable in Biome 2.5. Each rule was force-run with `--only` on every codebase; the counts below are the violations found.

## Prerequisite

Consumers currently resolve Biome 2.4.x transitively (peer `^2.2.7` historically). The new rules only take effect once each project installs Biome 2.5.x. Upgrade order: bump kvalita → release → bump each project to Biome 2.5 → fix the violations listed under "Enabled with pending fixes" → green.

## Enabled (added to configs/biome.json)

Zero violations everywhere — pure ratchet, nothing to fix:

- `suspicious/noProto`, `suspicious/noDuplicatedSpreadProps`, `suspicious/noParametersOnlyUsedInRecursion`
- `style/noMultilineString`, `style/noMultiAssign`, `style/noExcessiveClassesPerFile`, `style/useConsistentEnumValueType`, `style/useSpreadOverApply`
- `complexity/noRedundantDefaultExport`
- `security/noScriptUrl`, `performance/noSyncScripts`, `a11y/noAmbiguousAnchorText`

## Enabled with pending fixes (clean up per project during the 2.5 upgrade)

Few, localized, and all genuine improvements. Counts are per project.

- `suspicious/useArraySortCompare` — feedmatch 1 (test).
- `suspicious/noReturnAssign` — feedstand 1.
- `suspicious/noForIn` — feedsmith 13 (all in `src/common/utils.ts`); extends the existing `useForOf`.
- `style/useConsistentMethodSignatures` — feedsweep 2.
- `style/useErrorCause` — feedstand 5.
- `style/useGlobalThis` — feedstand 7, feedscout 2.
- `complexity/useArrayFind` — feedscout 1 (`libsyn.ts`).
- `complexity/noUselessReturn` — urlpurify 4, feedcanon 4, feedsweep 2, feedstand 1, feedscout 4 (all auto-fixable).
- `correctness/noUnusedInstantiation` — feedstand 4 (`apps/backend/helpers/encoding.ts`), feedscout 1 (`discourse.ts`). Inspect these — a discarded `new` is often a latent bug.

## Rejected — do NOT enable (conflicts with documented style or high-friction)

- `suspicious/noEqualsToNull` — conflicts with the deliberate `value != null` idiom (formatting skill §6) used in every `isPresent`-style guard. Violations: smith 2, match 6, sweep 1, stand 25, scout 1.
- `style/noTernary` — single ternaries are intentionally allowed (only `noNestedTernary` is enforced). Violations: purify 8, canon 22, match 10, sweep 39, stand 254, scout 76.
- `style/noContinue` — used for guard-in-loop throughout. Violations: canon 4, match 15, sweep 90, stand 16, scout 3.
- `style/noIncrementDecrement` — stylistic, not aligned. Violations: canon 1, match 6, sweep 17, stand 62, scout 10.
- `style/useDestructuring` — high-count, debatable. Violations: purify 2, canon 6, sweep 20, stand 17, scout 111.
- `style/noExcessiveLinesPerFile` — violations are almost entirely large colocated test files (e.g. 7403-line `classifier.test.ts`); enforcing punishes the testing style. Violations: canon 5, match 6, sweep 8, stand 36, scout 20.
- `suspicious/noShadow` — defensible but a large lift and noisy. Violations: smith 457, sweep 33, stand 64, scout 4, others ≤1.
- `suspicious/noUnnecessaryConditions` — type-aware and noisy; revisit as a standalone cleanup, not config hygiene. Violations: stand 22, sweep 7, scout 5, canon 3, smith 1.

## Deferred — no-ops without configuration

- `nursery/noUndeclaredClasses`, `nursery/noUnusedClasses` — Tailwind-hostile today (1110 false positives in feedstand). Skip until the parser handles utility classes.
- `nursery/noRestrictedDependencies` — does nothing until a restricted-deps list is configured.
- `suspicious/noUndeclaredEnvVars` — 0 everywhere, but a natural fit for the constants-module pattern (formatting skill §15) if wired up later with an env declaration.
