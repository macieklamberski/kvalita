import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

export type Layout = {
  files: Array<string>
  workspaces: Array<string>
  // Undefined when the repository has no tsconfig.json.
  includes: Array<string> | undefined
  bunfig: string
}

const hoistedLinkerRegex = /^\s*linker\s*=\s*"hoisted"/m
const globSpecialRegex = /[.+^${}()|[\]\\]/g
const trailingSlashRegex = /\/+$/
const doubleStarRegex = /\*\*/g
const singleStarRegex = /\*/g
const placeholderRegex = /\0/g

const globToRegex = (glob: string): RegExp => {
  const pattern = glob
    .replace(trailingSlashRegex, '')
    .replace(globSpecialRegex, '\\$&')
    .replace(doubleStarRegex, '\0')
    .replace(singleStarRegex, '[^/]*')
    .replace(placeholderRegex, '.*')

  return new RegExp(`^${pattern}(?:/|$)`)
}

// Two layouts break a fresh install while CI, which installs more by hand, stays green: a nested
// package the root tsconfig reaches that is not a workspace, so its dependencies are never
// installed, and workspaces without the hoisted linker, which installs each package in isolation
// and drops the tools kvalita supplies as peer dependencies.
export const findLayoutProblems = (layout: Layout): Array<string> => {
  const problems: Array<string> = []
  // With no include, tsc takes every file under the project.
  const includes = layout.includes ?? []
  const packageDirs = layout.files
    .filter((file) => file.endsWith('/package.json'))
    .map((file) => file.slice(0, -'/package.json'.length))

  for (const dir of packageDirs) {
    const isWorkspace = layout.workspaces.some((glob) => globToRegex(glob).test(dir))
    // A file inside the folder stands for its code, so a folder include and a file glob both count.
    const isIncluded = includes.some((glob) => globToRegex(glob).test(`${dir}/index.ts`))

    if (isIncluded && !isWorkspace) {
      problems.push(
        `${dir}/package.json is reached by tsconfig.json but is not a workspace: add it to "workspaces" or leave it out of "include"`,
      )
    }
  }

  if (layout.workspaces.length && !hoistedLinkerRegex.test(layout.bunfig)) {
    problems.push(
      'package.json declares workspaces but bunfig.toml does not set [install] linker = "hoisted"',
    )
  }

  return problems
}

const readLayout = (): Layout => {
  const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n')
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const workspaces = packageJson.workspaces?.packages ?? packageJson.workspaces ?? []
  const tsconfig = existsSync('tsconfig.json')
    ? Bun.JSONC.parse(readFileSync('tsconfig.json', 'utf8'))
    : undefined

  return {
    files,
    workspaces,
    includes: tsconfig ? (tsconfig.include ?? ['**']) : undefined,
    bunfig: existsSync('bunfig.toml') ? readFileSync('bunfig.toml', 'utf8') : '',
  }
}

const run = (): void => {
  const problems = findLayoutProblems(readLayout())

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
