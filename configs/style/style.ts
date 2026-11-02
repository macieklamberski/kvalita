import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

export type SourceFile = {
  path: string
  text: string
}

const sourceRegex = /\.[cm]?[jt]sx?$/
const blockCommentRegex = /^\/\*(?!\*)/
const backtickRegex = /(?<!\\)`/g
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

// Biome keeps blank lines as they are, and its GritQL plugins see neither comments nor blank lines
// outside a function body, so these two formatting skill rules are checked on the text.
export const findStyleProblems = (files: Array<SourceFile>): Array<string> => {
  const problems: Array<string> = []

  for (const file of files) {
    const lines = file.text.split('\n')
    // A line inside a template literal is a string, such as CSS in a markup fixture.
    let isInTemplate = false

    for (const [index, line] of lines.entries()) {
      if (!isInTemplate && blockCommentRegex.test(line.trim())) {
        problems.push(`${file.path}:${index + 1} write the comment as a run of // lines`)
      }

      if ((line.match(backtickRegex) ?? []).length % 2 === 1) {
        isInTemplate = !isInTemplate
      }
    }

    for (const index of findImportGaps(lines)) {
      problems.push(`${file.path}:${index + 1} leave a blank line after the imports`)
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
