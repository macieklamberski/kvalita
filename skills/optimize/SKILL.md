---
name: optimize
description: Benchmark-driven optimization of TypeScript/JavaScript functions. Prepares multiple implementation variants, verifies correctness differentially, benchmarks them with hyperfine on realistic inputs, and reports per-scenario results with an honest worth-it verdict. Use when asked to optimize functions, make code faster or more memory efficient, compare implementation alternatives, or benchmark variants. Report-only — never applies changes to source.
---

# Optimize

Find functions with real performance headroom, write faster variants, prove them correct, measure them honestly, and tell the user whether the gain is worth the code complication. This skill produces a report and throwaway benchmark scripts — it never edits the target source. The user decides what lands.

## Prerequisites

- **hyperfine**: `which hyperfine` (install: `brew install hyperfine`)
- **bun** and **node**: timing runs on both runtimes; memory measurements use bun.

## Workflow

### Step 1: Triage — don't optimize "each function"

Inventory the target functions (from arguments, changed files, or the whole `src/` for small libraries) and score headroom. Most functions have none — skip them with a one-line reason each.

Headroom signals:

- Intermediate allocations: `.split().filter()`, `.map` chained inside loops, spread in loops, arrays built only to be scanned once.
- Regex misuse: patterns recreated per call, unanchored `$`-suffix patterns (scan from position 0), unicode property escapes (`\p{...}`) on hot paths.
- Invariant work inside per-item callbacks: `pattern.toLowerCase()` inside `.some`, closures allocated per call.
- Missing early exits: full scans where the first match suffices, work done before cheap disqualifying checks.
- Repeated expensive checks in a frequency-blind order (e.g. checking the rare type first).

Skip without benchmarking: one-line `typeof` guards, promise/timer wrappers, I/O-bound functions, cold paths (startup config, error formatting).

Also mine prior art: `git log --oneline --all -i --grep='perf'` in the target repo and its ecosystem siblings. Past commits show what was already tried — including directions that were later reverted.

### Step 2: Mine real inputs

"Realistic" means measured from actual usage, not invented. Grep call sites in the repo and downstream dependents to learn argument shapes, then build scenario datasets:

- Happy path (~90% of the mix): the shapes the function actually sees.
- Large inputs: the size class where differences become pronounced (e.g. a 1 MB string, a 10k-item array).
- Hit vs miss, match-early vs match-late: early-exit variants only shine on one side.
- Edge shapes: unicode whitespace, empty values, mixed types.

Keep scenarios separate — a variant often wins on large inputs and loses on small ones, and an aggregate number hides that.

Include at least one scenario *designed to make each variant lose* — the full-scan miss, the pathological large input, the case with no early exit. The >5% regression flag in Step 6 is only as good as the adversarial scenario that could trigger it (trial-verified: a manual-scan variant that won 1.5–2× on typical inputs lost 2–3× to the regex engine on whitespace-only strings).

### Step 3: Write variants

2–4 variants per function, consulting [references/patterns.md](references/patterns.md) for candidates. Rules:

- Variants must stay straightforward and easily understandable. A variant that needs a paragraph of explanation is already suspect — write it anyway if the gain might be large, but flag the readability cost in the report.
- Keep the exact same signature and semantics as the baseline. Semantic traps are common: `trim()` and `\p{White_Space}` disagree on which characters are whitespace.
- Patterns are candidate generators, not verdicts. The same function has been optimized in opposite directions at different times (manual scan → regex and back). Measure, don't assume.

### Step 4: Correctness gate

Before any timing, run every variant differentially against the baseline over the full input dataset — outputs must be identical. If the target has a test suite, also run it with the variant swapped in. A variant that fails dies here; a fast wrong answer is worthless.

### Step 5: Benchmark

Use the harness templates in [references/harness.md](references/harness.md). The non-negotiables:

- **Subprocess isolation**: one process per variant per run, orchestrated by hyperfine, so each measurement starts with a clean JIT and GC state. No in-process A/B harnesses.
- **Calibrated inner loop**: the workload inside each process must run 300 ms–1 s, so runtime startup and multi-tier JIT warmup do not dominate.
- **hyperfine flags**: `--shell=none --warmup 3 --min-runs 10 --export-json` (`--shell=none` because shell-spawn correction is itself a noise source for fast commands).
- **Varied inputs, printed sink**: a dataset of varied inputs defeats loop-invariant hoisting; printing an accumulated checksum defeats dead-code elimination. Both hazards silently invalidate benchmarks of side-effect-free code.
- **Both runtimes for time**: bun (JSC) and node (V8) rank variants differently; a variant that wins on one can lose on the other. Report both.
- **Memory on bun**: heap delta around the workload with `Bun.gc(true)`, plus peak RSS via `/usr/bin/time -l` (macOS) / `-v` (Linux).

Benchmark scripts are throwaway — write them to the scratchpad, not the repo.

### Step 5b: Macro gate — validate micro-wins end-to-end

Micro-wins in pipeline libraries are often macro-invisible: a function can get 40% faster while whole-pipeline throughput moves 0% because a dependency (XML parser, DOM, network) dominates. Trial-verified: two feedsmith variants won 1.4–2× in micro-benchmarks and produced 1.00 ± 0.02 end-to-end.

For any variant winning its micro-benchmark by >10% in a library with a larger pipeline around it: create two git worktrees (pristine + patched, symlink `node_modules`), run the library's main public entry over real inputs via hyperfine A/B, and run the target's test suite against the patched worktree. A micro-win with a ~1.00× macro result gets verdict "not worth it" regardless of the micro table. Standalone utilities whose public API *is* the measured function skip this step.

### Step 6: Report with an honest verdict

Per function, a per-scenario table (baseline vs each variant, both runtimes, memory) followed by a verdict:

- **Adopt** — clear win, no readability cost.
- **Worth it only if hot** — real win, but the code gets uglier; only justified on a measured hot path.
- **Not worth it** — gain below noise, or the complication outweighs it. Say so plainly.

Calibration: a mean speedup under ~10% on the realistic mix is noise — recommend keeping the baseline. Any scenario regressing more than ~5% must be flagged even if the aggregate wins. For each recommended variant, state the pros and cons honestly: what it costs in readability, what assumptions it bakes in, on which inputs it loses. The user's standing rule: optimizations should be straightforward and easily understandable for humans — a 2× win that turns 3 lines into 30 is usually a bad trade, and the report should say that.

Never apply the changes. End with the report and the variant code; the user picks what to adopt.
