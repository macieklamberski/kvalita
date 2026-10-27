import { expect } from 'bun:test'
declare const fn: () => void
expect(() => fn()).toThrow() // flag
expect(() => fn()).not.toThrow() // flag
const throwing = () => fn()
expect(throwing).toThrow()
expect(throwing).not.toThrow()
