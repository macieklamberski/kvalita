import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

export type SourceFile = {
  path: string
  text: string
}

const sourceRegex = /\.[cm]?[jt]sx?$/
const blockCommentRegex = /^\/\*(?!\*)/
const backtickRegex = /(?<!\\)`/g
const regexConstRegex = /^(export )?const \w+Regex(: RegExp)? = (\/|new RegExp)/
const continuationRegex = /^(\s|[)\]}])/
const jsdocTagRegex = /@(deprecated|internal)\b/
const testPathRegex = /\.(test|spec)\.[cm]?[jt]sx?$|\/__tests__\//
const misnamedTestRegex = /\.spec\.[cm]?[jt]sx?$|\/__tests__\//
// A reason is a sentence after a colon, such as the stock one, This is for testing purposes.
const expectErrorRegex = /^\s*\/\/\s*@ts-expect-error(?!: [A-Z].*\.\s*$)/
const importStartRegex = /^import\s/
const reexportStartRegex = /^export\s+(type\s+)?[*{]/
const moduleEndRegex = /(^import\s+|\bfrom\s*)['"][^'"]*['"]/
const localExportEndRegex = /^\}\s*;?$/
const directiveRegex = /^(#!|['"]use \w+['"];?$)/

// The lines that follow the import block, or a re-export block, with no blank line between. The
// scan stops at the first statement that is neither, so a template string holding an import is
// never read.
export const findImportGaps = (lines: Array<string>): Array<number> => {
  const gaps: Array<number> = []
  let ended: string | undefined
  let index = 0

  const findEnd = (start: number): number | undefined => {
    for (let other = start; other < lines.length; other++) {
      const line = lines[other].trim()

      if (moduleEndRegex.test(line)) {
        return other
      }

      if (!line || localExportEndRegex.test(line)) {
        return
      }
    }
  }

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      ended = undefined
      index += 1
      continue
    }

    if (directiveRegex.test(line)) {
      ended = undefined
      index += 1
      continue
    }

    let kind: string | undefined

    if (importStartRegex.test(line)) {
      kind = 'import'
    }

    if (reexportStartRegex.test(line)) {
      kind = 'reexport'
    }

    const end = kind ? findEnd(index) : undefined

    if (ended && (end === undefined || kind !== ended)) {
      gaps.push(index)
    }

    if (end === undefined) {
      break
    }

    ended = kind
    index = end + 1
  }

  return gaps
}

// The indexes where a module-level regex block needs a blank line inserted, to stand apart from
// the statements around it. A comment above a regex belongs to its block.
export const findRegexBlockGaps = (lines: Array<string>): Array<number> => {
  const gaps: Array<number> = []

  const isNeighbour = (line: string | undefined): boolean => {
    if (!line?.trim()) {
      return false
    }

    return !regexConstRegex.test(line) && !line.startsWith('//')
  }

  for (const [index, line] of lines.entries()) {
    if (!regexConstRegex.test(line)) {
      continue
    }

    let end = index

    while (end + 1 < lines.length && continuationRegex.test(lines[end + 1])) {
      end += 1
    }

    if (isNeighbour(lines[index - 1])) {
      gaps.push(index)
    }

    if (isNeighbour(lines[end + 1])) {
      gaps.push(end + 1)
    }
  }

  return gaps
}

// Biome keeps blank lines as they are, and its GritQL plugins see neither comments nor blank lines
// outside a function body, so these formatting and testing skill rules are checked on the text.
export const findStyleProblems = (files: Array<SourceFile>): Array<string> => {
  const problems: Array<string> = []

  for (const file of files) {
    const lines = file.text.split('\n')
    const isTest = testPathRegex.test(file.path)
    // A line inside a template literal is a string, such as CSS in a markup fixture.
    let isInTemplate = false

    if (misnamedTestRegex.test(file.path)) {
      problems.push(`${file.path} name the test file *.test.ts beside its source`)
    }

    for (const [index, line] of lines.entries()) {
      const trimmed = line.trim()

      if (!isInTemplate && blockCommentRegex.test(trimmed)) {
        problems.push(`${file.path}:${index + 1} write the comment as a run of // lines`)
      }

      if (!isInTemplate && trimmed.startsWith('/**')) {
        const end = lines.slice(index).findIndex((other) => other.includes('*/'))
        const jsdoc = lines.slice(index, end === -1 ? undefined : index + end + 1).join('\n')

        if (!jsdocTagRegex.test(jsdoc)) {
          problems.push(
            `${file.path}:${index + 1} keep JSDoc for @deprecated or @internal, write the rest as // lines`,
          )
        }
      }

      if (isTest && expectErrorRegex.test(line)) {
        problems.push(
          `${file.path}:${index + 1} give the directive its reason as a sentence, // @ts-expect-error: This is for testing purposes.`,
        )
      }

      if ((line.match(backtickRegex) ?? []).length % 2 === 1) {
        isInTemplate = !isInTemplate
      }
    }

    for (const index of findImportGaps(lines)) {
      problems.push(`${file.path}:${index + 1} leave a blank line after the imports`)
    }

    for (const index of findRegexBlockGaps(lines)) {
      problems.push(`${file.path}:${index + 1} leave a blank line around the regex block`)
    }
  }

  return problems
}

const readSources = (): Array<SourceFile> => {
  const paths = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split('\n')
    .filter((path) => sourceRegex.test(path))

  return paths.map((path) => {
    return { path, text: readFileSync(path, 'utf8') }
  })
}

const run = (): void => {
  const problems = findStyleProblems(readSources())

  for (const problem of problems) {
    console.error(problem)
  }

  if (problems.length) {
    process.exitCode = 1
  }
}

if (import.meta.main) {
  run()
}
