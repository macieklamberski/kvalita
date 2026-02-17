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

## 9. JSX

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
