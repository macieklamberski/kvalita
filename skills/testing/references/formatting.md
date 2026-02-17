# Test Formatting Rules

Generic test formatting and style guide for maintaining consistency across all test files.

## A. Test Structure

**A1.** One `describe` block per function being tested, with the function name as the label
```typescript
describe('functionName', () => {})
```

**A2.** Test names start with "should" and use format: `'should [action] [context]'`
```typescript
it('should return transformed data when input is valid', () => {})
```

---

## B. Variable Naming

**B1.** Use `value` for input data being tested. Use `values` (plural) when testing with an array of test cases.

**B2.** Use `expected` for expected output result

**B3.** Use `expectedFull` for complete objects defined at top of describe block (when reused across multiple tests)

**B4.** Use `throwing` for functions expected to throw errors
```typescript
// Sync — pass function reference (don't call it)
const throwing = () => processData(value)

expect(throwing).toThrow('Input validation failed')

// Async — call the function to get the promise, use .rejects (no await in Bun)
const throwing = () => asyncFn(value)

expect(throwing()).rejects.toThrow('error message')
```

**B5.** Use `options` for function options/configuration parameters
```typescript
it('should preserve www when stripWww is false', () => {
  const value = 'https://www.example.com/feed'
  const options = { ...defaultOptions, stripWww: false }
  const expected = 'www.example.com/feed'

  expect(normalizeUrl(value, options)).toBe(expected)
})
```

**B6.** Use `value1`/`value2` for comparison functions that take two inputs
```typescript
it('should return true for matching URLs', () => {
  const value1 = 'http://example.com/feed'
  const value2 = 'https://example.com/feed'

  expect(isSimilarUrl(value1, value2)).toBe(true)
})
```

---

## C. Spacing & Blank Lines

**C1.** One blank line between variable declarations and expect statement
```typescript
const value = { prop: 'val' }
const expected = { result: 'val' }

expect(fn(value)).toEqual(expected)
```

**C2.** No blank lines between related variable declarations

**C3.** One blank line between consecutive `it` blocks

**C4.** No blank line after opening `describe(` or before closing `})`

**C5.** Reusable test data (like `expectedFull`) defined at top of describe with one blank line after them

---

## D. Test Order (Standard Sequence)

**D1.** Complete/full/happy path tests first (valid input with all properties)

**D2.** Partial/subset tests second (valid input with some properties)

**D3.** Edge case tests third (boundary conditions, special characters, type coercion)

**D4.** Empty/invalid input tests fourth (empty strings, whitespace, empty objects)

**D5.** Type mismatch tests last (null, undefined, wrong types)

---

## E. Common Test Names

**E1.** Positive cases:
- `'should [action] with all properties'`
- `'should [action] with minimal properties'`
- `'should [action] when [specific condition]'`

**E2.** Edge cases:
- `'should handle [special character type] in [field] content'`
- `'should handle empty strings'`
- `'should handle whitespace-only strings'`
- `'should handle [boundary condition]'`

**E3.** Invalid inputs:
- `'should return undefined for empty object'`
- `'should return undefined for non-object input'`
- `'should handle empty object'`
- `'should handle non-object inputs'`

---

## F. Comments

**F1.** Use `// @ts-expect-error: This is for testing purposes.` when intentionally testing invalid types

**F2.** Place the comment on the line immediately before the offending code

**F3.** No other comments in test code (tests are self-documenting through descriptive names)

---

## G. Assertions

**G1.** Use `.toEqual()` for objects and arrays

**G2.** Use `.toBe()` for primitives and booleans

**G3.** Use `.toBeUndefined()` for undefined returns

**G4.** Multiple assertions in one test are acceptable for testing same function with multiple similar inputs (e.g., null, undefined, string, number)

**G5.** ALWAYS assert the whole return object at once using `expected` + `.toEqual()` — NEVER assert individual properties separately. For complex or non-deterministic parts of the object, use `expect.any()`, `expect.objectContaining()`, `expect.stringContaining()`, `expect.arrayContaining()`, etc. When a type exists that represents the expected value, annotate `expected` with it (e.g. `const expected: FetchFeedResult = { ... }`).
```typescript
// CORRECT - assert the whole object, typed when a matching type exists
const expected: FetchResult = {
  url: 'https://example.com/feed.xml',
  status: 200,
  statusText: 'OK',
  headers: expect.any(Headers),
  body: 'feed content',
}

expect(fetchFeed(value)).toEqual(expected)

// WRONG - never split into separate property assertions
const result = fetchFeed(value)
expect(result.url).toBe('https://example.com/feed.xml')
expect(result.status).toBe(200)
expect(result.statusText).toBe('OK')
expect(result.headers.get('content-type')).toBe('application/rss+xml')
expect(result.body).toBe('feed content')
```

When a specific sub-value needs a precise check that matchers can't express (e.g. `headers.get('content-type')`), add ONE extra assertion after the full-object assert — but the full-object assert must still come first.

**G6.** Inline simple function calls directly in expect() - no intermediate `result` variable needed
```typescript
// Good - inlined
expect(resolveFeedProtocol(value)).toBe(expected)

// Avoid - unnecessary result variable
const result = resolveFeedProtocol(value)
expect(result).toBe(expected)
```

**G7.** When expected value is a boolean, inline it directly in `.toBe()` - no `expected` variable needed

**G8.** Do NOT use `await` with `expect(...).rejects.toThrow()` in Bun tests — Bun handles promise-based assertions automatically
```typescript
// Good - no await needed in Bun
const throwing = () => asyncFn(value)

expect(throwing()).rejects.toThrow('error message')

// Wrong - unnecessary await
await expect(throwing()).rejects.toThrow('error message')
```
```typescript
// Good - boolean inlined
expect(isSimilarUrl(value1, value2)).toBe(true)
expect(isValid(value)).toBe(false)

// Avoid - unnecessary expected variable for booleans
const expected = true
expect(isSimilarUrl(value1, value2)).toBe(expected)
```

---

## H. Object Formatting

**H1.** Always use trailing commas in multi-line objects

**H2.** One property per line for objects with 2+ properties

**H3.** Opening brace on same line: `const value = {`

**H4.** Use consistent 2-space indentation for nested objects

---

## I. Special Cases

**I1.** When testing functions with strict type signatures, use `@ts-expect-error` for each invalid type assertion:
```typescript
// @ts-expect-error: This is for testing purposes.
expect(fn('string')).toBeUndefined()
// @ts-expect-error: This is for testing purposes.
expect(fn(null)).toBeUndefined()
```

**I2.** When testing functions that accept `unknown` or `any`, no `@ts-expect-error` needed for type mismatch tests

---

## J. Data-Driven Tests

**J1.** Use `it.each` or loop-based patterns for testing many inputs against the same logic:
```typescript
// Using it.each
it.each(Object.entries(validCases))('should parse valid date %s', (value, expected) => {
  expect(resolveDate(value)?.toISOString()).toBe(expected)
})

// Using for loop
for (const url of safeUrls) {
  it(`should allow safe public URL: ${url}`, () => {
    expect(isSafePublicUrl(url)).toBe(true)
  })
}
```

**J2.** Use data-driven patterns only when all test cases share identical assertion logic. If assertions differ, use separate `it` blocks.

---

**Note:** Import order and formatting is handled by auto-formatters (Biome/Prettier) and should not be manually enforced in these guidelines.
