import { describe, expect, it } from 'bun:test'
import lint from '@commitlint/lint'
import load from '@commitlint/load'

const config = await load({}, { file: 'configs/commitlint.json' })

// The rule reads KVALITA_ALLOW_BREAKING when it runs, the way the commit hook passes it through.
const isValid = async (message: string, allowBreaking?: string) => {
  // biome-ignore lint/style/noProcessEnv: The rule under test reads its escape from the environment.
  const env = process.env

  env.KVALITA_ALLOW_BREAKING = allowBreaking ?? ''

  try {
    const { valid } = await lint(message, config.rules, {
      parserOpts: config.parserPreset?.parserOpts,
      plugins: config.plugins,
    })

    return valid
  } finally {
    env.KVALITA_ALLOW_BREAKING = ''
  }
}

describe('kvalita/no-breaking-change', () => {
  it('should accept a commit with no breaking marker', async () => {
    const value = 'feat: Add a helper\n\nIt reads the query string.'

    expect(await isValid(value)).toBe(true)
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

  it('should accept a ! after the type when the escape is set', async () => {
    const value = 'feat!: Drop the legacy export'

    expect(await isValid(value, '1')).toBe(true)
  })

  it('should accept a BREAKING CHANGE footer when the escape is set', async () => {
    const value = 'feat: Drop the legacy export\n\nBREAKING CHANGE: The export is gone.'

    expect(await isValid(value, '1')).toBe(true)
  })

  it('should reject a breaking commit when the escape is not 1', async () => {
    const value = 'feat!: Drop the legacy export'

    expect(await isValid(value, 'true')).toBe(false)
  })
})
