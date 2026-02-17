# Testing Best Practices

Actionable principles for writing effective tests in JS/TS. Distilled from Goldberg, Kent C. Dodds, Martin Fowler, Google Testing Blog, and Codepipes.

## 1. Test Behavior, Not Implementation

Test through the public API. Never access internal state, private methods, or internal data structures directly.

- If behavior doesn't change, tests shouldn't break. Refactoring internals (renaming state, restructuring code) must not cause test failures.
- If private logic is complex enough to warrant its own tests, extract it into a separate module with a public API — test that module independently.
- Don't export internal functions solely for testing (`_calculateDiscount`). This widens the API surface and couples tests to internals.
- Organize tests around behaviors ("should reject withdrawal when balance is insufficient"), not methods ("test withdraw()").

**Litmus test:** Could the implementation be completely rewritten with the same observable behavior without breaking any test? If yes, the tests are well-designed.

---

## 2. Mocking Strategy

### Mock at system boundaries only

- **DO mock:** External HTTP services, payment gateways, email/SMS providers, message queues, third-party APIs.
- **DO NOT mock:** Your own database (use a real one), your own internal modules, your own business logic layers.

### Don't mock types you don't own

Don't directly mock third-party library internals (Stripe, HTTP clients, ORMs). Instead, create a thin wrapper/adapter around the library. Mock the wrapper in tests. Test the wrapper itself with real implementations in a small number of integration tests.

### Prefer state verification over behavior verification

```typescript
// Prefer: check the result (state verification)
const result = await createOrder(data)
expect(result.status).toBe('confirmed')

// Avoid: check what was called (behavior verification)
expect(mockDb.insert).toHaveBeenCalledWith('orders', data)
```

Behavior verification (checking mock calls) couples tests to implementation. State verification (checking results) tests actual outcomes.

### Too many mocks = design smell

If a test needs 5+ mocks to set up, the production code likely violates Single Responsibility Principle. Refactor the production code to reduce dependencies rather than adding more mocks.

### Use stubs and spies, not strict mocks

- **Stub:** Returns predetermined data. Test checks the result.
- **Spy:** Records calls. Test checks both result and side effects.
- **Strict mock:** Pre-programmed with call expectations. Brittle — breaks on any internal change.

---

## 3. Test Isolation

### Each test must be self-contained

- Never rely on test execution order. Tests must pass when run individually, in parallel, or in any order.
- Never depend on data created by a previous test ("Generous Leftovers" anti-pattern).

### Setup/teardown rules

- **beforeAll:** Expensive read-only setup (DB connections, server startup). Runs once per suite.
- **beforeEach:** Anything that must be reset per test (mocks, state, test data). Ensures isolation.
- **Rule of thumb:** If two tests could interfere with each other through shared setup, use beforeEach.

### Mock cleanup

Always reset mocks between tests. Shared mock state across tests causes flaky, order-dependent failures:

```typescript
beforeEach(() => {
  mockFn.mockClear()
})
```

### Deep-clone shared fixtures

If tests import shared constants or fixtures, deep-clone them per test to prevent mutation leaking between tests.

---

## 4. Test Data

### Use realistic, production-like data

Don't use `"foo"`, `"bar"`, `123`. Use realistic values (`"alice@example.com"`, `"https://example.com/feed.xml"`). Unrealistic data hides bugs that appear with real-world values (encoding issues, length limits, special characters).

### Include only relevant data

Each test should set up only the data relevant to the behavior it tests. Don't load massive JSON fixtures — this hides what actually matters for the test.

### Hard-code expected values

Never compute expected values in test code. Logic in tests (string concatenation, arithmetic, conditionals) can contain the same bug as the production code:

```typescript
// Bad — hides a double-slash bug
const expected = baseUrl + '/path'

// Good — bug is immediately visible
const expected = 'https://example.com/path'
```

### Factory pattern for complex objects

Use factory functions with sensible defaults so each test only specifies what matters:

```typescript
const createUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Alice',
  email: 'alice@example.com',
  ...overrides,
})

// Test only specifies what it cares about
const value = createUser({ email: '' })
```

---

## 5. What NOT to Test

### Skip these

- **Framework/language behavior:** Don't test that `Array.map` works or that your ORM inserts rows.
- **Trivial code:** Simple getters, pass-through functions, one-line wrappers with no logic.
- **Implementation details:** Internal state, private methods, call counts on internal functions.

### Prioritize by risk

Not all code deserves equal test coverage. Focus testing effort on:

1. **Critical business logic** (payments, auth, data integrity) — target thorough coverage.
2. **Code that breaks often** or changes frequently — high value regression tests.
3. **Complex algorithms** with many code paths — unit test exhaustively.

Skip trivial code even if it lowers coverage percentage. 20% coverage targeting critical code is better than 80% covering trivial code.

### Code coverage is necessary but insufficient

Coverage tells you which lines were executed, not whether behavior was verified. A test with zero assertions achieves coverage while testing nothing. Use coverage to find untested areas, not as a quality metric.

---

## 6. Anti-Patterns

### The Liar

Test appears to pass but never actually asserts anything. Common with async code where the test exits before assertions run:

```typescript
// Bad — if callback never fires, test passes with 0 assertions
it('fetches data', () => {
  fetchData((data) => {
    expect(data).toBe('result')  // may never execute
  })
})

// Good — async/await ensures assertion runs
it('fetches data', async () => {
  const data = await fetchData()
  expect(data).toBe('result')
})
```

### The Giant

One test with many assertions spanning dozens of lines, verifying multiple unrelated behaviors. When it fails, impossible to know which behavior broke. Split into focused tests, each verifying one behavior.

### The Mockery

So many mocks that the system under test isn't being tested. The mock setup is what's actually verified. If you need 10+ mocks, refactor the production code.

### Logic in Tests

Tests containing conditionals, loops, or computed expected values. These can mask bugs — the test "correctly" computes the same wrong answer as the production code. Always hard-code expected values.

### Snapshot Overuse

`toMatchSnapshot()` is a change-detector, not a bug-detector. Any output change — intentional or not — causes failure. Developers learn to rubber-stamp `--updateSnapshot` without examining diffs. Use explicit assertions targeting specific behaviors instead.

### Generous Leftovers

Test B depends on data created by Test A. If Test A runs later or not at all, Test B fails. Each test must create its own data and clean up after itself.

### Excessive Setup

Tests requiring dozens of lines of mock/fixture setup before the first assertion. Usually signals the code under test has too many dependencies (SRP violation). Refactor the production code rather than adding more setup.

### The Free Ride

Adding unrelated assertions to an existing test because the setup is convenient. If the first assertion fails, subsequent ones never execute — hiding additional bugs. Each distinct behavior deserves its own test.

---

## 7. Backend Testing: Verify All Exit Doors

Every backend operation produces observable outcomes through multiple channels. Don't just check the response — verify all affected outputs:

1. **Response** — correct data, status code, schema.
2. **Persisted state** — query the DB after the operation to confirm changes were saved (not just returned).
3. **External service calls** — verify outbound HTTP calls, emails, SMS were triggered correctly (via spies/interceptors).
4. **Message queues** — validate messages published for downstream processing.
5. **Error handling** — verify errors are thrown/logged appropriately, not silently swallowed.
