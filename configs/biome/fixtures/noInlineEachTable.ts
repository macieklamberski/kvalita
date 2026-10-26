import { it } from 'bun:test'
declare const cases: Array<[number, number]>
it.each([[1, 2]])('should add', () => {}) // flag
it.each(cases)('should add', () => {})
