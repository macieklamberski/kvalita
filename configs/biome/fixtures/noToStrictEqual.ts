import { expect, it } from 'bun:test'

it('should compare the parsed value', () => {
  const value = { name: 'Ada' }
  const expected = { name: 'Ada' }

  expect(value).toStrictEqual(expected) // flag
  expect(value).toEqual(expected)
})
