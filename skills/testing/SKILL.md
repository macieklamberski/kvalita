---
name: testing
description: Guide for writing comprehensive, well-structured tests with full coverage. Use when creating test files, adding tests to existing files, reviewing test coverage, or when asked to write, fix, or expand tests. Covers test organization (flat vs nested), coverage categories (happy/sad/edge), .todo patterns for planned tests, and formatting conventions.
---

# Test Writing Guide

Detect the test library from project (bun:test, vitest, jest, etc.) and use its idioms. Never assume a specific framework.

For general code formatting rules (arrow functions, naming, exports, etc.), see the `formatting` skill.

## File Conventions

- Test files use `*.test.ts` naming (not `*.spec.ts`)
- Co-locate tests next to their source file (not in `__tests__/` directories)
- Example: `helpers/urls.ts` → `helpers/urls.test.ts`

## Structure: Flat vs Nested

**Flat** — for pure/simple functions (parsers, validators, formatters):

```typescript
describe('functionName', () => {
  it('should return X with valid input', () => {})
  it('should return undefined for empty string', () => {})
})
```

**Nested 3-category** — for complex functions (DB operations, API handlers, side effects):

```typescript
describe('functionName', () => {
  describe('happy paths', () => {
    it('should create record with all fields', () => {})
    it('should create record with minimal fields', () => {})
  })

  describe('sad paths', () => {
    it('should throw NotFoundError when record missing', () => {})
  })

  describe('edge cases', () => {
    it('should handle duplicate operation idempotently', () => {})
  })
})
```

**When to use which:**
- Side effects, external deps, DB, API calls → nested
- Pure transformation, parser, validator → flat
- Flat file growing beyond ~15 tests → consider switching to nested

## Coverage Categories

**Happy paths** — normal successful operations:
- Success with full/complete input
- Success with minimal/partial input
- Expected return values and side effects

**Sad paths** — expected failures:
- Thrown exceptions (NotFoundError, ValidationError, etc.)
- Validation failures on invalid input
- Unauthorized/wrong-user access
- Missing required data or dependencies

**Edge cases** — boundary conditions:
- Idempotency (repeating the same operation)
- Pagination and cursor handling
- Null, empty, or zero values
- Concurrent or conflicting operations
- Already-existing data (upsert behavior)
- Computed/derived fields and timestamps

## Coverage Checklist

For every function, consider:
1. What does success look like with full input?
2. What does success look like with minimal input?
3. What errors can this function throw?
4. What happens with unauthorized/wrong-user access?
5. What are the boundary conditions?
6. What if the operation is repeated (idempotent)?
7. What if related data is missing or empty?

Implement the most critical tests first (happy paths). Use `.todo` for the rest.

## Principles

- **Test behavior, not implementation** — test through public API. If behavior doesn't change, tests shouldn't break. If private logic is complex, extract it into its own module and test that.
- **Mock at boundaries only** — mock external services (HTTP, email, payment), never your own DB or internal modules. Prefer stubs/spies over mocks (verify state, not calls).
- **Each test is self-contained** — never rely on test execution order. No shared mutable state. Reset mocks in beforeEach.
- **Hard-code expected values** — never compute them with string concat, loops, or conditionals in test code.
- **Use realistic data** — not `"foo"`/`"bar"`. Include only data relevant to the specific test.
- **One behavior per test** — no piggyback assertions testing unrelated things.
- **Convert production bugs to regression tests** — every bug gets a test before fixing.

For detailed guidance on mocking, isolation, data patterns, and common anti-patterns, see [references/best-practices.md](references/best-practices.md).

## The .todo Pattern

Use `it.todo` for planned but unimplemented tests. Every `.todo` MUST include a comment inside the callback body explaining the scenario:

```typescript
// Simple scenario — single sentence.
it.todo('should preserve existing title when feed title is null', () => {
  // Feed has null title — channel should keep its existing title.
})

// Complex scenario — multi-line with setup and expected behavior.
it.todo('should timeout when headers delayed beyond maxTimeout', () => {
  // Server delays sending headers for 16+ seconds (> maxTimeout: 15s).
  // Expected: ETIMEDOUT error after ~15 seconds, retry triggered,
  // after 3 retries throw UnreachableUrlError.
})
```

Use `describe.todo` for entire groups of planned tests:

```typescript
describe.todo('error handling', () => {
  it.todo('should throw on invalid URL', () => {
    // Pass malformed URL like 'not-a-url' or 'ht!tp://bad'.
    // Expected: URL parse error before safety check runs.
  })
})
```

**Guidelines:**
- Never leave a `.todo` without a comment
- Comments go inside the callback, not above `it.todo`
- Implement happy paths first, `.todo` sad paths and edge cases when not immediately critical

## Formatting Reference

For detailed rules on variable naming, spacing, assertions, object formatting, and test ordering, see [references/formatting.md](references/formatting.md).
