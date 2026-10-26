import { expect } from 'bun:test'
declare const value: unknown
expect(value).toBe(undefined) // flag
expect(value).toBeUndefined()
