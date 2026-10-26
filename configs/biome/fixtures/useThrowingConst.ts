import { expect } from 'bun:test'
declare const fn: () => void
expect(() => fn()).toThrow() // flag
const throwing = () => fn()
expect(throwing).toThrow()
