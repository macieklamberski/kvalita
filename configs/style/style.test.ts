import { describe, expect, it } from 'bun:test'
import { findStyleProblems, type SourceFile } from './style.ts'

describe('findStyleProblems', () => {
  it('should pass a file with a blank line after the imports and // comments', () => {
    const value: Array<SourceFile> = [
      {
        path: 'src/a.ts',
        text: "import { b } from './b.ts'\n\n// A note.\nexport const a = b\n",
      },
    ]

    expect(findStyleProblems(value)).toEqual([])
  })

  it('should flag code directly after the imports', () => {
    const value: Array<SourceFile> = [
      {
        path: 'src/a.ts',
        text: "import { b } from './b.ts'\nexport const a = b\n",
      },
    ]
    const expected = ['src/a.ts:2 leave a blank line after the imports']

    expect(findStyleProblems(value)).toEqual(expected)
  })

  it('should flag code directly after a multi-line import', () => {
    const value: Array<SourceFile> = [
      {
        path: 'src/a.ts',
        text: "import {\n  b,\n  c,\n} from './b.ts'\nexport const a = b + c\n",
      },
    ]
    const expected = ['src/a.ts:5 leave a blank line after the imports']

    expect(findStyleProblems(value)).toEqual(expected)
  })

  it('should flag a block comment', () => {
    const value: Array<SourceFile> = [
      {
        path: 'src/a.ts',
        text: '/* A note\n   continued. */\nexport const a = 1\n',
      },
    ]
    const expected = ['src/a.ts:1 write the comment as a run of // lines']

    expect(findStyleProblems(value)).toEqual(expected)
  })

  it('should pass a JSDoc comment', () => {
    const value: Array<SourceFile> = [
      {
        path: 'src/a.ts',
        text: '/** @deprecated Use b instead. */\nexport const a = 1\n',
      },
    ]

    expect(findStyleProblems(value)).toEqual([])
  })

  it('should pass a block comment inside a template literal', () => {
    const value: Array<SourceFile> = [
      {
        path: 'src/a.test.ts',
        text: 'const value = `\n  <style>\n    /* a { color: red; } */\n  </style>\n`\n',
      },
    ]

    expect(findStyleProblems(value)).toEqual([])
  })
})
