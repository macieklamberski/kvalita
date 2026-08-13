---
name: formatting
description: Code formatting and style rules not handled by auto-formatters (Biome/Prettier). Use when writing or modifying code files. Covers function declarations, exports, types, comments, JSX, and naming conventions.
---

# Code Formatting Rules

Style guide for code formatting decisions not handled by auto-formatters (Biome/Prettier).

For PR and MR descriptions specifically, the `pr-message` skill builds on these rules and covers what belongs in one.

## 1. Function Declaration Style

Use arrow functions with explicit types:
```typescript
// Correct
export const functionName: FunctionType = (params) => {}

// Avoid
export function functionName(params): ReturnType {}
```

---

## 2. Export Patterns

Named exports only - no default exports:
```typescript
// Correct
export const processData = () => {}
export type DataType = {}

// Avoid
export default processData
```

---

## 3. Early Returns

Use early returns for validation:
```typescript
export const processData = (input) => {
  // Early return for validation.
  if (!isValid(input)) {
    return
  }

  const result = {
    property1: transform(input.field1),
    property2: transform(input.field2),
  }

  return cleanObject(result)
}
```

**The same applies inside loops:** use early `break`/`continue` instead of `else if`/`else` chains, so the loop body stays flat:
```typescript
// Correct
for (const entry of entries) {
  if (entry.isTerminator) {
    break
  }

  if (!entry.value) {
    continue
  }

  results.push(transform(entry.value))
}

// Avoid
for (const entry of entries) {
  if (entry.isTerminator) {
    break
  } else if (entry.value) {
    results.push(transform(entry.value))
  }
}
```

---

## 4. Type Definitions

**Use types over interfaces:**
```typescript
// Correct
export type User = {
  name?: string
}

// Avoid
export interface User {
  name?: string
}
```

**Use namespaces for related types:**
```typescript
export namespace UserModule {
  export type Profile = {
    bio: string
  }
}
```

**Generic types:**
```typescript
export type Record<TDate extends DateLike> = {
  createdAt?: TDate
}
```

**Union types for flexible required fields:**
```typescript
export type Document = {
  title?: string
  content?: string
} & ({ title: string } | { content: string })
```

---

## 5. File Structure

Standard file order:
1. Import statements
2. Type definitions or exported functions
3. Helper functions
4. Main exported functions

---

## 6. Curly Braces

Always use curly braces for arrow functions:
```typescript
// Correct
export const fn = (value) => {
  return value != null
}

// Even for single expressions
export const fn = (value) => {
  return processValue(value)
}
```

Important: This rule can be ignored if similar code near this fragment uses different formatting (eg. no curly braces). This is more for newly created code.

For simple one-expression callbacks (`.map`, `.flatMap`, `.filter`, etc.) a bare implicit-return arrow is fine **only when the whole arrow fits on one line**. The moment it would wrap — the arrow and its expression body splitting across two lines — switch to a block body with an explicit `return`:
```typescript
// Correct - fits on one line, implicit return
const data = pages.flatMap((page) => page.data)

// Correct - would wrap, so use a block + return
const items = transforms.flatMap((transform) => {
  return transform === target ? [transform, ...extras] : [transform]
})

// Avoid - implicit-return arrow whose body wraps onto its own line
const items = transforms.flatMap((transform) =>
  transform === target ? [transform, ...extras] : [transform],
)
```

---

## 7. Variable Naming

Use full words - avoid abbreviations and shorthands:
```typescript
// Correct
const error = new Error()
const length = array.length
const value = getValue()

// Avoid
const err = new Error()
const len = array.length
const val = getValue()
```

**camelCase every `const`, including lookup tables and configuration:**
```typescript
// Correct
const secondsPerPeriod = { hourly: 3600, daily: 86400 }

// Avoid
const SECONDS_PER_PERIOD = { hourly: 3600, daily: 86400 }
```
There is no SCREAMING_SNAKE_CASE tier, however constant the value feels. Uppercase only when an external API forces the name.

**Function name prefixes:**
- `parse*` for parsing operations
- `generate*` for generation operations
- `get*` / `fetch*` for retrieval operations
- `is*` / `has*` for boolean checks
- `validate*` for validation operations

**Boolean variables take the same prefixes as boolean functions:** `is`, `has`, `does`. A bare adjective or past participle is not a boolean name:
```typescript
// Correct
const isReconciled = compare(left, right)
const hasMatch = candidates.length > 0

// Avoid
const reconciled = compare(left, right)
const match = candidates.length > 0
```

---

## 8. Comments

**Comment only when strictly necessary:**
The default is no comment. Before writing one, name what it tells a reader that the code does not. If you cannot, delete it. Restating the line below, narrating the flow, or explaining an obvious branch all fail that test. What passes: a constraint that lives outside the file, a quirk of the data being parsed, why an obvious alternative was rejected, or a bound whose exact value matters. Prefer a clearer name or a smaller function over a comment explaining an unclear one.

**Never explain the diff in code.** A comment that exists to walk the reviewer through the change ("a third dialect adds …", "this now also handles …") is addressed to the wrong reader: it describes the delta, and once merged the delta has no referent. That explanation belongs in the PR description; the code carries only what the next reader of the final state needs.
```typescript
// Avoid: restates the code and the branch above it
if (!product) {
}

// Ads without photos carry no Product block at all, so the title, description and price are
// read from the page itself and only the images come from the structured data.
const title = readTitle(document)

// Correct: the code already says this, so nothing is written
const title = readTitle(document)

// Correct: records a constraint the code cannot show
// The feed serves these gzipped despite the header, so the body is sniffed rather than trusted.
const body = decode(response)
```

**Leave commented-out code alone:**
Do not delete commented-out code as part of an unrelated edit. It is kept deliberately, often as a quick toggle for a dev-only guard. Remove it only when asked to.

**Write comments as sentences:**
```typescript
// This is a proper sentence with capitalization and punctuation.
const value = process()
```

**Comments sound human, not mechanical:**
Write them the way you would explain the code to a colleague: plain and natural, a rhetorical question is fine. Avoid stiff, robotic narration that mechanically enumerates each branch:
```typescript
// Correct
// Few pages? Show them all.

// Avoid - mechanical branch enumeration
// Compact (<= 3 pages) shows every page; otherwise anchor on first, current and last and
// bridge the gaps.
```

**No wrapped continuation-indent block comments:**
A comment is either one line (a one-line block or a trailing inline comment) or a run of `//` lines (or the JSDoc asterisk style). Never the `/* line one` + indented continuation form:
```typescript
// Correct
// Multi-line rationale as a run of slash lines, each a sentence,
// wrapping at the formatter width.

// Avoid
/* Multi-line rationale crammed into one block comment
   with a continuation indent. */
```

**Use plain language — no invented jargon:**
Describe what the code does in simple, direct words. Avoid abstract or academic vocabulary ("verdict", "mirror", "pairwise", "consistently with", "domain") when a concrete description says the same thing. If a sentence needs the reader to decode a metaphor, rewrite it. Don't repeat the same phrase for two different facts (e.g. "the same way" twice in one comment) — repetition either signals redundancy or hides a distinction; give each sentence its own concrete statement. This applies to comments, test names, and PR descriptions alike:
```typescript
// Avoid
// Optional: when absent, pairwise comparisons mirror the incoming item's verdict instead.

// Correct
// Optional: when absent, the stored item's enclosure is treated the same way as
// the incoming item's one.
```

**Structure long comments as prose - what first, mechanism second, history never:**
A comment longer than a few lines follows the same shape as good prose. It opens with what the code does and why it exists, in plain causal language. The mechanism comes after, one idea per paragraph, separated by an empty `//` line. What the code replaced or how it used to work is history: it belongs in the commit message, not the comment. An aside that is not needed to understand this function gets cut, even if true.
```typescript
// Avoid - opens with history, one dense block, narrates parser internals
// Canonicalizes prefixes while parsing, replacing the post-parse tree walk. The parser
// hands out tag names before it reads the tag's own attributes, but in document order
// every ancestor's attributes stream by first, so a declaration map filled by the
// attribute hook is ready when descendant names come through, and stop nodes therefore
// match canonical names for any prefix a feed uses (outside stop-node content, which
// stays raw).

// Correct - what and why first, then the mechanism, one idea per paragraph
// Renames namespace prefixes to their canonical form while the document is being parsed,
// so stop nodes can match `a10:title` as `atom:title`. Renaming after parsing would be
// too late: stop nodes fire during it.
//
// Document order is what makes this work. By the time the parser hands over an element's
// name, it has already read every ancestor's attributes, including their `xmlns:`
// declarations, so the element can be renamed right away.
```

**Never use em-dashes:**
Reach for a colon, a period or a comma instead, in that order. A colon when what follows explains what came before, a period when the two halves are separate statements, a comma for a simple aside. Only if none of those fit, use a plain hyphen with spaces around it. This applies to comments, commit messages, PR descriptions and any other prose:
```typescript
// Avoid
// The parent directory varies per board — the directory name is the stable part.
// A sprite renders nothing — an unmapped one still becomes the text the author typed.

// Correct
// The parent directory varies per board: the directory name is the stable part.
// A sprite renders nothing. An unmapped one still becomes the text the author typed.
```

**Place comments above the subject:**
```typescript
// Correct
// Calculate the total value.
const total = sum(values)

// Avoid
const total = sum(values) // Calculate the total value.
```

**Exception - inline comments for arrays, properties, types:**
```typescript
const apiUrls = {
  production: [
    'https://api.example.com/v1', // Primary endpoint.
    'https://api.example.com/v2',
  ],
}

export type User = {
  name?: string // The user's display name.
}
```

**Use JSDoc sparingly - avoid creating full API references:**
```typescript
// Correct - minimal JSDoc
/** @deprecated Use `updatedProperty` instead. */
legacyProperty?: string

/** @internal */
export type InternalConfig = {}

// Avoid - excessive documentation
/**
 * Processes the input data and returns result
 * @param input - The data to process
 * @returns The processed result or undefined
 * @example
 * const result = processData({ name: 'John' })
 */
export const processData = (input) => {}
```

**Lint-suppression comments:**
The reason after a `biome-ignore` (or similar) directive is a normal comment sentence — sentence case, ending with a period. The rule identifier is metadata, not the start of the sentence:
```typescript
// Correct
// biome-ignore lint/suspicious/noForIn: Plain object; avoids per-call Object.keys allocation.
for (const key in object) {
}

// Avoid - lowercase reason
// biome-ignore lint/suspicious/noForIn: plain object; avoids per-call Object.keys allocation.
```

**CSS comments:**
Single-line comments stay on one line with `/* ... */`. Multi-line comments use the starred block form, with each line prefixed by ` * ` and the opening `/*` and closing `*/` on their own lines:
```css
/* A single-line comment stays inline. */
.button {
  color: red;
}

/*
 * A comment that spans more than one line opens and closes on its own lines,
 * with every line prefixed by an asterisk.
 */
.card {
  padding: 1rem;
}
```

---

## 9. Array Type Syntax

Use `Array<T>` generic syntax, not `T[]` shorthand:
```typescript
// Correct
const items: Array<string> = []
export type Record = { tags: Array<Tag> }

// Avoid
const items: string[] = []
export type Record = { tags: Tag[] }
```

---

## 10. Nullish Coalescing Over Logical OR

Use `??` for defaults, never `||`:
```typescript
// Correct
const host = process.env.HOST ?? 'localhost'
const title = item.title ?? 'Untitled'

// Avoid
const host = process.env.HOST || 'localhost'
```

---

## 11. Template Literals Only

Use template literals for string composition, never `+` concatenation:
```typescript
// Correct
const message = `${prefix}: ${error.message}`
const url = `https://${host}/api/${version}`

// Avoid
const message = prefix + ': ' + error.message
```

---

## 12. Bare `return` (Never `return undefined`)

When a function returns `| undefined`, use bare `return`:
```typescript
// Correct
export const findUser = (id: string): User | undefined => {
  if (!isValid(id)) {
    return
  }
  // ...
}

// Avoid
if (!isValid(id)) {
  return undefined
}
```

---

## 13. `void` Prefix for Fire-and-Forget

Prefix intentionally non-awaited async calls with `void`:
```typescript
// Correct
void sendNotification(user.id)
void analytics.track('page_view', { url })

// Avoid — looks like a forgotten await
sendNotification(user.id)
```

---

## 14. Empty `catch {}` for Expected Failures

When failure is acceptable (URL parsing, JSON parse, DNS), use empty `catch {}` and return a safe default:
```typescript
export const extractDomain = (url: string): string | undefined => {
  try {
    return new URL(url).hostname
  } catch {}
}

export const parseJson = (raw: string): unknown | undefined => {
  try {
    return JSON.parse(raw)
  } catch {}
}
```

---

## 15. Config via Constants Modules

Isolate all `process.env` access in dedicated constants files. Business logic never touches `process.env` directly:
```typescript
// constants/database.ts
export const host = process.env.DATABASE_HOST ?? 'localhost'
export const port = process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432

// Consumers use the constants, not process.env
import * as databaseConstants from './constants/database.ts'
```

---

## 16. JSX

Place event handlers (`on*` attributes) last:
```tsx
// Correct
<Button type="submit" disabled={isLoading} className="btn" onClick={handleClick}>
  Submit
</Button>

<input id="name" value={name} placeholder="Enter name" onChange={handleChange} />

// Avoid
<Button onClick={handleClick} type="submit" disabled={isLoading}>
  Submit
</Button>
```

---

## 17. Regex Constants

**Use the `*Regex` suffix** for regex-valued constants, not `*Pattern`:
```typescript
// Correct
const footnoteClassRegex = /footnote/i
const permalinkLabelRegex = /^[#¶§❡]+$/u

// Avoid
const footnotePattern = /footnote/i
```

**Keep consecutive regex declarations together** — no blank line between them — so a run of patterns reads as one block. A comment starts a new group:
```typescript
// Correct
const footnoteClassRegex = /footnote/i
const bracketedNumberRegex = /^\[\d+\]$/
const whitespaceRegex = /\s+/

// Avoid - blank lines splitting the block
const footnoteClassRegex = /footnote/i

const bracketedNumberRegex = /^\[\d+\]$/
```

---

## 18. HTML Attribute Wrapping

An element with **one attribute** keeps it inline with the tag. **Two or more, and the attributes go on their own lines**, whatever the line length. Length is an independent trigger, so a one-attribute element whose url makes the line 140 characters splits too. This applies to HTML in template literals (e.g. `html` test fixtures), not just JSX.

The threshold is two because that is where a fixture stops being scannable: with attributes stacked one per line, a reader compares two fixtures by eye and sees exactly which attribute differs, and a diff marks that one line rather than rewriting the whole element. Inline attributes hide the difference inside a long string.

**Splitting only helps when there is something to distribute.** The trigger is length, but the fix is spreading attributes or elements across lines, so it does nothing for a line that is long because of one unbreakable value. A single element with one attribute holding a 200-character url stays on one line: splitting it yields the same long line plus an orphaned closing tag, which is worse than what it replaced. Ask what goes on the second line before splitting, and if the answer is only `</tag>`, leave it.

**A long fixture is a `html` template, not a quoted string.** A test fixture that has outgrown one line moves to the `html` tag with its attributes stacked, rather than staying a single long `'…'` literal that wraps in the editor. The point is that the shape of the markup under test is readable at a glance, which is the whole reason the fixture exists.

```typescript
// Correct - one attribute stays on the tag
html`<div class="callout"></div>`

// Correct - two attributes, so they stack
html`
  <div
    class="player"
    data-video-id="abc123"
  ></div>
`

// Correct - several attributes, split for readability
html`
  <div
    class="player"
    data-src="https://example.com/embed/abc123"
    data-id="abc123"
    data-query="feature=oembed"
  ></div>
`

// Correct - one attribute, but the line ran long, so it splits
html`
  <blockquote
    cite="https://example.com/some/quite/long/path/to/the/quoted/document/123"
  >
    <p>The quoted text.</p>
  </blockquote>
`

// Avoid - a short element exploded across lines
html`
  <div
    class="callout"
  ></div>
`

// Avoid - a long fixture kept as a quoted string
const value =
  '<blockquote cite="https://example.com/some/quite/long/path/to/the/quoted/document/123" class="quote-card"><p>The quoted text.</p></blockquote>'
```

---

## 19. Extract Large Inline Data Arrays

A multi-row data array (or object) passed directly into a call — most commonly a `it.each` / `test.each` table — goes in its own named `const` above, not inlined into the call. The call site should read as one line of intent; the data lives separately with a type annotation and, where helpful, a comment describing the row shape.
```typescript
// Correct
// Each case is [CDN label, wrapped input URL, expected inner-source key].
const imageProxyCases: Array<[string, string, string]> = [
  ['Cloudflare image', 'https://.../cdn-cgi/image/w=1080/https://cdn.example.com/photo.jpg', 'cdn.example.com/photo.jpg'],
  ['Next.js image', 'https://x.com/_next/image?url=https%3A%2F%2Fx.com%2Fphoto.jpg', 'x.com/photo.jpg'],
]

it.each(imageProxyCases)('should unwrap the %s image proxy', (_name, url, expected) => {
  expect(getImageFingerprint(url)).toBe(expected)
})

// Avoid - a long table literal wedged into the it.each() call
it.each([
  ['Cloudflare image', 'https://.../cdn-cgi/image/w=1080/https://cdn.example.com/photo.jpg', 'cdn.example.com/photo.jpg'],
  ['Next.js image', 'https://x.com/_next/image?url=https%3A%2F%2Fx.com%2Fphoto.jpg', 'x.com/photo.jpg'],
])('should unwrap the %s image proxy', (_name, url, expected) => {
  expect(getImageFingerprint(url)).toBe(expected)
})
```

---

## 20. Name the Intermediate Instead of Wrapping the Call

When an argument is long enough that the formatter breaks the call across lines, pull it into a named `const` above instead. Both fit the width, but only the name says what the value is — a wrapped call buries that in the middle of an expression.
```typescript
// Correct
const codepoints = stem.split(separatorRegex).map((part) => Number.parseInt(part, 16))
const glyph = String.fromCodePoint(...codepoints)

// Avoid - the wrap tells the reader nothing about what is being spread
const glyph = String.fromCodePoint(
  ...stem.split(separatorRegex).map((part) => Number.parseInt(part, 16)),
)
```

This applies when the intermediate has a real name. If the only name available restates the call (`result`, `output`, `args`), the extraction adds a line and says nothing, so leave the wrap.

Naming an intermediate is the only kind of compression worth reaching for. Do not shorten code by folding logic into a functional chain: a `flatMap` with a ternary inside, or a `filter` whose predicate has a side effect, replaces lines with cleverness and costs more to read than it saves. Keep the loop, the guard and the explicit variable. Where a file genuinely is too long, tighten spacing and cut exports, not the logic.

---

## 21. try/catch Over `.catch()`

Handle async errors in a `try`/`catch` block, never by chaining `.catch()` onto the call:
```typescript
// Correct
try {
  const response = await fetchFeed(url)
  return parseFeed(response)
} catch (error) {
  logger.warn(error)
}

// Avoid
const response = await fetchFeed(url).catch((error) => logger.warn(error))
```
The empty-`catch` form in section 14 is still the right shape when the failure itself is expected and nothing needs handling.

---

## 22. Quote Nesting

Single quotes outside, double quotes inside. When a string contains a quoted token, keep the outer pair single and quote the inner token with double quotes rather than flipping the whole literal:
```typescript
// Correct
it.todo('should return "existing" when the alias short-circuits', () => {})
describe('when chooseFeedUrl returns "existing"', () => {})

// Avoid
it.todo("should return 'existing' when the alias short-circuits", () => {})
```
This follows the Biome config, which sets `singleQuote: true`; flipping the outer pair makes the file inconsistent with everything around it.

---

## 23. No Non-Null Assertion

Never use the `!` non-null assertion. Narrow with a guard clause instead, which is also what Biome's `noNonNullAssertion` asks for:
```typescript
// Correct
const entry = index.get(key)

if (!entry) {
  return
}

return entry.value

// Avoid
return index.get(key)!.value
```
The same goes for array indexing and any other lookup that types as possibly undefined: the guard states what happens when the value is missing, while `!` only silences the question.

---

## 24. Partial-Object Assertions in Tests

When a test checks one or more properties of a returned object, assert with `toMatchObject` on the whole result, not by reaching into a property and comparing it with `toBe`. Write the expected object multiline, one property per line, even when it has a single property:

```typescript
// Correct
expect(await extract(value)).toMatchObject({
  icon: 'https://example.com/author.png',
})

// Avoid - property access + toBe
expect((await extract(value))?.icon).toBe('https://example.com/author.png')

// Avoid - single-line object literal
expect(await extract(value)).toMatchObject({ icon: 'https://example.com/author.png' })
```

Full-object `toEqual(expected)` assertions stay as they are; this rule is for the subset case.

---

## 25. CSS Token Naming

Name CSS variables and theme tokens for what the value is used for, in everyday words. No design-system jargon (`surface`, `scrim`, `elevated`, `foreground`) and no palette-scale names (`neutral-600`) at usage sites:
```css
/* Correct */
--bg
--sidebar-bg
--backdrop-bg
--text-primary
--text-muted

/* Avoid */
--surface
--scrim
--foreground-secondary
--neutral-600
```
A palette scale may exist as a lower layer, but anything a component style references is named by its role.
