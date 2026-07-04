# Optimization Pattern Catalog

Candidate generators for variants — not verdicts. Every pattern here has to survive Step 4 (correctness) and Step 5 (measurement) on the actual inputs and runtimes. Provenance: mined from feedsmith's `perf:` commit history (~50 accepted optimizations on real feed-parsing hot paths), plus engine internals verified against primary sources (deep research, 2026 — see the sources section at the bottom).

## Engine behavior (verified against primary sources)

V8 (node) and JavaScriptCore (bun) share the same optimization architecture — hidden classes/shapes plus inline caches feeding tiered speculative JIT compilers — so these rules transfer across both engines:

- **Same properties, same order.** Objects constructed with identical property sets in identical order share a shape; `{x, y}` and `{y, x}` are different shapes. Build result objects identically on every code path, fully initialized at creation.
- **Keep hot call sites monomorphic.** An inline cache that sees one shape/type is fastest; up to ~4 shapes stays polymorphic and acceptable; beyond that the site goes megamorphic and falls off a cliff. For type guards and coercions this means the *callers'* input mix matters: a utility fed stable types stays fast, one fed everything degrades every call site inside it.
- **Small, fully-initialized objects win.** In-object properties are the fastest storage; adding properties after construction or using `delete` risks dictionary mode, which disables inline caching for that object.
- **Keep hot numbers in Smi range (V8).** Counters, lengths, indices, and char codes within 31-bit integer range avoid checked operations and deoptimization; type-unstable numbers (int → float on some iterations) trigger deopts.
- **Warmup differs per engine.** V8 tiers through Ignition → Sparkplug → Maglev → TurboFan; JSC through LLInt → Baseline → DFG → FTL, with different tier-up timing. Identical harness settings capture different tier mixes on node vs bun — one more reason per-engine measurement is mandatory.
- **String building vs scanning is a per-engine cliff zone.** `+=` concatenation is cheap on JSC (rope strings), but build-then-slice/scan patterns have had pathological behavior (O(n²) rope slicing, fixed upstream in the JSC shipped with Bun ≥ 1.3.10); V8 uses its own distinct cons/sliced-string representations. Benchmark string-heavy variants on both engines and pin runtime versions in the report.
- **GC models differ.** JSC uses a non-moving conservative collector, V8 a moving precise generational one — allocation-reduction and pooling patterns pay off differently per runtime.

Shared principles do not imply identical cliffs: dictionary-mode thresholds, IC polymorphism limits, and `delete` handling all differ between the engines in the details.

## Hoist invariants out of hot paths

- **Regex literals to module scope.** A regex literal inside a function body is re-created (or at least re-fetched) per call; a module-level `const` is compiled once. (feedsmith `5a0933a6`)
- **Pre-construct objects at module load.** Expression objects, lookup tables, normalizers — build once, reuse per call. (feedsmith `dd9f4225`, `35191f75`)
- **Invariant work out of per-item callbacks.** `pattern.toLowerCase().trim()` inside a `.some` callback runs per item per call; precompute the lowered list once before the loop.

## Avoid allocations

- **Return the original when there's nothing to change.** Scan first with a cheap loop; only build a new object/array when the input actually needs modification. (feedsmith `7181d892` — `trimObject` returns the input untouched when nothing trims)
- **Fuse chained array methods into one loop.** `.split().filter()`, `.filter().map()` each allocate an intermediate array; a single indexed loop allocates one.
- **Lazy iteration with early exit instead of split-then-scan.** `value.split(/\s+/)` materializes every word before `.some` looks at the first one; a manual scan can return on the first match without allocating the array.
- **Eliminate Maps/objects used only as transient scratch.** Plain locals or arrays are often enough. (feedsmith `378ef09c`)
- **Don't allocate the empty result eagerly.** Create the result container only on first write.

## Cheap checks first

- **Order type checks by input frequency.** Check the type that actually arrives 90% of the time first — mine call sites to learn the distribution. (feedsmith: number-before-string in `parseNumber` callers)
- **`charCodeAt(0) === code` over `startsWith`/`indexOf === 0`** for single-character prefix checks — no string allocation, no call overhead. (feedsmith `0eda2d29`)
- **Cheap pre-detection to skip expensive work.** Test whether the expensive transform is needed at all (`indexOf('<![CDATA[')` before running CDATA stripping; length check before regex). (feedsmith: CDATA/entity detection)
- **Length and first/last-char checks before regex.** `value.length < 2` disqualifies before any regex runs; `charCodeAt` scans from both ends beat unanchored `$`-suffix regexes, which scan from position 0.

## Memoize

- **Memoize repeated key/shape work.** Seen-key sets turned `detectNamespaces` 10× faster; make the memo conditional so cold paths don't pay for it. (feedsmith `61c4b5f1`)

## Micro (engine-dependent — always measure both runtimes)

- Unary plus (`+value`) over `Number(value)`.
- Loose `== null` covers both null and undefined in one check.
- `indexOf` vs `startsWith`/`includes`: has flipped winners across engine versions.
- **Regex vs manual scan flips both ways.** feedsmith optimized `parseBoolean` away from regex once, then back to regex later ("more robust and faster") — the winner depends on engine, input length, and unicode requirements. Never assume; benchmark both directions.

## Semantic traps (correctness gate catches these — know them anyway)

- `trim()` / `\s` / `\p{White_Space}` disagree on which characters count as whitespace.
- `toLowerCase()` vs case-insensitive regex differ on locale-sensitive characters.
- `+value` and `Number(value)` agree, but both differ from `parseFloat` on trailing garbage.
- Early-exit variants must exit with the same answer the full scan would produce for duplicate/overlapping matches.

## Refuted folklore and measure-only territory

Adversarial verification against primary sources killed some widely-circulated claims and left whole areas without verified guidance. Treat these accordingly:

- **Refuted: exact JSC tier-up thresholds** (15 points per call, 500/1000/100000 point tier boundaries) circulating in older material. Never cite numeric engine-internal constants without checking current engine source — they rot.
- **Refuted: V8 pointer-tagging bit-layout details** as described in secondary sources. Same lesson.
- **No verified guidance exists** for CPU-level mechanical sympathy in JS (typed arrays vs plain arrays, SoA vs AoS layout, branch prediction effects) or for regex-engine internals (V8 Irregexp vs JSC YARR, when hand-rolled scanning beats a regex). These are measure-only territory: propose the variant, benchmark it on both engines, and never justify it by folklore reasoning alone.

## When to stop

- The function is I/O-bound or already dominated by a dependency call — micro-optimizing the wrapper is noise.
- The win requires assumptions about inputs the signature doesn't guarantee.
- The variant needs a comment longer than the baseline to justify itself, and the measured gain is under ~10% on the realistic mix.

## Primary sources

- V8 blog: [fast-properties](https://v8.dev/blog/fast-properties), [hidden-classes](https://v8.dev/docs/hidden-classes), [maglev](https://v8.dev/blog/maglev), [leaving-the-sea-of-nodes](https://v8.dev/blog/leaving-the-sea-of-nodes)
- JSC: [Speculation in JavaScriptCore](https://webkit.org/blog/10308/speculation-in-javascriptcore/) (Pizlo), [Riptide GC](https://webkit.org/blog/7122/introducing-riptide-webkits-retreating-wavefront-concurrent-garbage-collector/)
- Cross-engine: [Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics) (Bynens/Meurer)
- Benchmarking: [mitata](https://github.com/evanwashere/mitata), [hyperfine](https://github.com/sharkdp/hyperfine), mraleph's [microbenchmarks-are-experiments](https://mrale.ph/blog/2024/11/27/microbenchmarks-are-experiments.html), Meurer's [the truth about traditional JS benchmarks](https://benediktmeurer.de/2016/12/16/the-truth-about-traditional-javascript-benchmarks/)
