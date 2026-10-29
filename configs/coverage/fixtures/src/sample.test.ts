import { describe, expect, it } from 'bun:test'
import { clampAge, describeCount, greet, readLabel } from './sample'

describe('describeCount', () => {
  it('should pluralize when count is above one', () => {
    expect(describeCount(3)).toBe('3 items')
  })
})

describe('readLabel', () => {
  it('should return the label when present', () => {
    expect(readLabel('Inbox')).toBe('Inbox')
  })
})

describe('clampAge', () => {
  it('should return the age when it is not negative', () => {
    expect(clampAge(30)).toBe(30)
  })
})

describe('greet', () => {
  it('should greet by name', () => {
    expect(greet('Ada')).toBe('Hello, Ada')
  })
})
