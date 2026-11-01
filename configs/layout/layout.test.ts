import { describe, expect, it } from 'bun:test'
import { findLayoutProblems, type Layout } from './layout.ts'

const hoisted = '[install]\nlinker = "hoisted"\n'

describe('findLayoutProblems', () => {
  it('should pass a repo with no nested packages', () => {
    const value: Layout = {
      files: ['package.json', 'src/index.ts'],
      workspaces: [],
      includes: ['src'],
      bunfig: '',
    }

    expect(findLayoutProblems(value)).toEqual([])
  })

  it('should pass a nested package that is a hoisted workspace', () => {
    const value: Layout = {
      files: ['package.json', 'check/package.json'],
      workspaces: ['check'],
      includes: ['src', 'check'],
      bunfig: hoisted,
    }

    expect(findLayoutProblems(value)).toEqual([])
  })

  it('should pass a nested package left out of the tsconfig', () => {
    const value: Layout = {
      files: ['package.json', 'benchmarks/package.json'],
      workspaces: [],
      includes: ['src'],
      bunfig: '',
    }

    expect(findLayoutProblems(value)).toEqual([])
  })

  it('should pass a nested package when there is no tsconfig', () => {
    const value: Layout = {
      files: ['package.json', 'docs/package.json'],
      workspaces: [],
      includes: undefined,
      bunfig: '',
    }

    expect(findLayoutProblems(value)).toEqual([])
  })

  it('should flag a nested package the tsconfig includes by folder', () => {
    const value: Layout = {
      files: ['package.json', 'examples/package.json'],
      workspaces: [],
      includes: ['src', 'examples'],
      bunfig: '',
    }
    const expected = [
      'examples/package.json is reached by tsconfig.json but is not a workspace: add it to "workspaces" or leave it out of "include"',
    ]

    expect(findLayoutProblems(value)).toEqual(expected)
  })

  it('should flag a nested package the tsconfig includes by file glob', () => {
    const value: Layout = {
      files: ['package.json', 'check/package.json'],
      workspaces: [],
      includes: ['**/*.ts'],
      bunfig: '',
    }
    const expected = [
      'check/package.json is reached by tsconfig.json but is not a workspace: add it to "workspaces" or leave it out of "include"',
    ]

    expect(findLayoutProblems(value)).toEqual(expected)
  })

  it('should match workspaces given as a glob', () => {
    const value: Layout = {
      files: ['package.json', 'apps/web/package.json'],
      workspaces: ['apps/*'],
      includes: ['**'],
      bunfig: hoisted,
    }

    expect(findLayoutProblems(value)).toEqual([])
  })

  it('should flag workspaces without the hoisted linker', () => {
    const value: Layout = {
      files: ['package.json', 'check/package.json'],
      workspaces: ['check'],
      includes: ['src', 'check'],
      bunfig: '[install]\nlinker = "isolated"\n',
    }
    const expected = [
      'package.json declares workspaces but bunfig.toml does not set [install] linker = "hoisted"',
    ]

    expect(findLayoutProblems(value)).toEqual(expected)
  })
})
