import { describe, expect, it } from 'bun:test'
import lint from '@commitlint/lint'
import load from '@commitlint/load'

const config = await load({}, { file: 'configs/commitlint.json' })

const isValid = async (message: string): Promise<boolean> => {
  const { valid } = await lint(message, config.rules, {
    parserOpts: config.parserPreset?.parserOpts,
    plugins: config.plugins,
  })

  return valid
}

describe('commitlint config', () => {
  it('should accept a single-line commit', async () => {
    const value = 'feat: Add a helper'

    expect(await isValid(value)).toBe(true)
  })

  it('should reject a commit with a body', async () => {
    const value = 'feat: Add a helper\n\nIt reads the query string.'

    expect(await isValid(value)).toBe(false)
  })

  it('should reject a ! after the type', async () => {
    const value = 'feat!: Drop the legacy export'

    expect(await isValid(value)).toBe(false)
  })

  it('should reject a ! after the scope', async () => {
    const value = 'fix(api)!: Drop the legacy export'

    expect(await isValid(value)).toBe(false)
  })

  it('should reject a BREAKING CHANGE footer', async () => {
    const value = 'feat: Drop the legacy export\n\nBREAKING CHANGE: The export is gone.'

    expect(await isValid(value)).toBe(false)
  })

  it('should reject a BREAKING-CHANGE footer', async () => {
    const value = 'feat: Drop the legacy export\n\nBREAKING-CHANGE: The export is gone.'

    expect(await isValid(value)).toBe(false)
  })

  it('should accept the revert git writes', async () => {
    const value =
      'Revert "feat: Add a helper"\n\nThis reverts commit 96da4aed1d0312db5b5f952dff524a1535bdb64c.'

    expect(await isValid(value)).toBe(true)
  })

  it('should accept the merge commit GitHub writes', async () => {
    const value = 'Merge pull request #101 from example/feat/helper\n\nAdd a helper'

    expect(await isValid(value)).toBe(true)
  })
})
