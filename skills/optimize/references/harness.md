# Benchmark Harness Templates

Layout in the scratchpad (throwaway — never committed to the target repo). The runner, gate, and memory scripts are shared; each function contributes a directory with its variants and inputs:

```
bench/
  run.mjs         # Subprocess entry: <functionDir> <variant> <scenario> <iterations>.
  verify.mjs      # Differential correctness gate: <functionDir>.
  memory.mjs      # Peak-RSS / heap measurement: <functionDir> <scenario>.
  tabulate.mjs    # hyperfine JSON exports → per-scenario markdown tables.
  bench.sh        # hyperfine orchestration for all functions and scenarios.
  <functionName>/
    variants.mjs  # baseline + variants, identical signatures.
    inputs.mjs    # Scenario datasets + call/sink adapters.
```

Write plain `.mjs` JavaScript, not TypeScript — the same file then runs unmodified on bun and node (node 22 LTS has no native type stripping, and `--experimental-strip-types` adds a variable the benchmark doesn't need).

Each `inputs.mjs` exports two adapters alongside the datasets, so the shared scripts stay function-agnostic and multi-argument functions work without special cases:

```javascript
export const call = (variant, input, scenarioName) => {
  return variant(input.value, input.patterns)
}

export const sink = (result) => {
  return result ? 1 : 0
}
```

## variants.ts

```typescript
// The baseline is copied verbatim from the target source.
export const baseline = (value: string): boolean => {
  // ...
}

export const manualScan = (value: string): boolean => {
  // ...
}

export const variants: Record<string, (value: string) => boolean> = {
  baseline,
  manualScan,
}
```

## inputs.ts

```typescript
// Scenarios stay separate — never merge into one aggregate dataset.
export const scenarios: Record<string, Array<string>> = {
  typical: [
    // ~90% shapes mined from real call sites.
  ],
  large: [
    // The size class where differences become pronounced.
  ],
  miss: [
    // Inputs where the function returns early / finds nothing.
  ],
}
```

Build invisible-character edge cases (NEL, BOM, NBSP, ideographic space) programmatically with `String.fromCharCode(0x0085)` etc. — literal invisible characters get silently mangled by editors and tooling, and a vanished probe looks like a passing gate.

## verify.ts

```typescript
import { scenarios } from './inputs.ts'
import { variants } from './variants.ts'

for (const [variantName, variant] of Object.entries(variants)) {
  for (const inputs of Object.values(scenarios)) {
    for (const input of inputs) {
      const expected = JSON.stringify(variants.baseline(input))
      const actual = JSON.stringify(variant(input))

      if (actual !== expected) {
        throw new Error(`${variantName} diverges on: ${input.slice(0, 80)}`)
      }
    }
  }
}

console.log('All variants match baseline.')
```

Run `bun verify.ts` before any timing. If the target repo has a test suite, additionally swap the variant into the source, run the suite, and revert.

## run.ts

```typescript
import { scenarios } from './inputs.ts'
import { variants } from './variants.ts'

const [, , variantName, scenarioName, iterationsArg] = process.argv
const variant = variants[variantName]
const inputs = scenarios[scenarioName]

if (!variant || !inputs) {
  console.error(`Unknown variant or scenario: ${variantName} / ${scenarioName}`)
  process.exit(1)
}

// Calibrate so the loop runs 300ms–1s; otherwise process startup dominates.
const iterations = Number(iterationsArg)

// The sink defeats dead-code elimination — always print it. Iterating over a dataset of
// varied inputs (never a single constant) defeats loop-invariant hoisting, where the JIT
// computes a constant-input call once and reuses the result across iterations.
let sink = 0

for (let iteration = 0; iteration < iterations; iteration++) {
  for (const input of inputs) {
    sink += variant(input) ? 1 : 0
  }
}

console.log(sink)
```

Calibration: run `time bun run.ts baseline <scenario> <n>` and adjust `n` until the baseline takes 300 ms–1 s. Use the same `n` for every variant of that scenario.

## bench.sh

```bash
#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN="$SCRIPT_DIR/run.ts"

# One hyperfine comparison per scenario; both runtimes in the same table.
run_benchmark() {
  local scenario=$1
  local iterations=$2
  shift 2

  local args=()
  for variant in "$@"; do
    args+=(--command-name "$variant (bun)" "bun $RUN $variant $scenario $iterations")
    args+=(--command-name "$variant (node)" "node $RUN $variant $scenario $iterations")
  done

  echo ""
  echo "Scenario: $scenario"
  hyperfine --shell=none --warmup 3 --min-runs 10 --export-json "$SCRIPT_DIR/results-$scenario.json" "${args[@]}"
}

run_benchmark typical 2000 baseline manualScan
run_benchmark large 50 baseline manualScan
run_benchmark miss 2000 baseline manualScan
```

With `--command-name`, hyperfine's JSON export stores the display name in the `command` field — parse that in the tabulation step.

`--shell=none` matters: hyperfine by default runs each command through a shell and corrects for the shell's spawn time, and for fast commands that correction itself becomes a significant noise source. Our commands are direct binary invocations, so always bypass the shell.

This harness answers "which variant is faster on this realistic workload" — the decision-relevant number. It does not produce trustworthy per-operation nanosecond figures: process startup and multi-tier JIT warmup are folded into every measurement by design. When per-op precision genuinely matters (variants within ~10% of each other on sub-microsecond functions), escalate to an in-process run with [mitata](https://github.com/evanwashere/mitata) — wrap results in `do_not_optimize(...)`, feed inputs via computed parameters, and leave its GC control at the default — then confirm the winner still holds in the subprocess harness. Treat mitata as a tiebreaker, not the primary verdict.

## Memory

Peak RSS per variant is the primary memory metric — it captures transient allocation churn, which is what these optimizations usually remove:

```bash
for variant in baseline variantA variantB; do
  rss=$(/usr/bin/time -l bun run.mjs <fn> "$variant" <scenario> <n> 2>&1 >/dev/null | grep 'maximum resident' | awk '{print $1}')
  echo "$variant: $((rss / 1024 / 1024)) MB peak RSS"
done
# Linux: /usr/bin/time -v … | grep 'Maximum resident' (reports KB, not bytes).
```

Do NOT rely on `Bun.gc(true)` + `heapUsed` deltas around the workload: that measures only *retained* memory, and for functions whose cost is transient garbage (intermediate arrays, lowered strings) it reads 0 for every variant — the collector has already swept the churn you're trying to observe. Trial-verified failure mode.

## Report format

Per function, one table per scenario:

```markdown
### isJsonLike — scenario: large (10 × 1MB documents)

| Variant    | bun (mean ± σ) | node (mean ± σ) | vs baseline | Heap delta |
| ---------- | -------------- | --------------- | ----------- | ---------- |
| baseline   | 412 ms ± 8     | 530 ms ± 12     | —           | 2.1 MB     |
| manualScan | 71 ms ± 3      | 95 ms ± 4       | 5.8× / 5.6× | 0 B        |

**Verdict: adopt.** Pros: no allocation, wins on every scenario. Cons: 8 lines instead of 3; charCode whitespace check must mirror `\s` exactly (verified).
```
