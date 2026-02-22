---
name: formatting
description: Code formatting and style rules not handled by auto-formatters (Biome/Prettier). Use when writing or modifying code files. Covers function declarations, exports, types, comments, JSX, and naming conventions.
---

# Code Formatting Rules

Style guide for code formatting decisions not handled by auto-formatters (Biome/Prettier).

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

**Function name prefixes:**
- `parse*` for parsing operations
- `generate*` for generation operations
- `get*` / `fetch*` for retrieval operations
- `is*` / `has*` for boolean checks
- `validate*` for validation operations

---

## 8. Comments

**Write comments as sentences:**
```typescript
// This is a proper sentence with capitalization and punctuation.
const value = process()
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
