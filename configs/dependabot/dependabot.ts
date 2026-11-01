import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export type Ecosystem = {
  name: string
  directories: Array<string>
}

export type ReadFile = (path: string) => string

const configPath = '.github/dependabot.yml'
const lockfiles = ['bun.lock', 'bun.lockb']
// Workflows calling these at a branch pin nothing Dependabot could bump.
const ignoredActionPrefixes = ['./', 'docker://', 'macieklamberski/kvalita/']

const dockerfileRegex = /(^|\/)Dockerfile[^/]*$/
const composeRegex = /(^|\/)(docker-)?compose[^/]*\.ya?ml$/
const workflowRegex = /^\.github\/workflows\/[^/]+\.ya?ml$/
const usesRegex = /^\s*-?\s*uses:\s*['"]?([^\s'"]+)/gm

const toDirectory = (file: string): string => {
  const directory = dirname(file)

  if (directory === '.') {
    return '/'
  }

  return `/${directory}`
}

const toDirectories = (files: Array<string>, regex: RegExp): Array<string> => {
  const directories = files.filter((file) => regex.test(file)).map(toDirectory)

  return [...new Set(directories)].sort((left, right) => left.localeCompare(right))
}

const hasPinnedActions = (files: Array<string>, readFile: ReadFile): boolean => {
  for (const file of files) {
    if (!workflowRegex.test(file)) {
      continue
    }

    for (const match of readFile(file).matchAll(usesRegex)) {
      const action = match[1] ?? ''

      if (!ignoredActionPrefixes.some((prefix) => action.startsWith(prefix))) {
        return true
      }
    }
  }

  return false
}

export const detectEcosystems = (files: Array<string>, readFile: ReadFile): Array<Ecosystem> => {
  const ecosystems: Array<Ecosystem> = []
  const composeDirectories = toDirectories(files, composeRegex)
  const dockerDirectories = toDirectories(files, dockerfileRegex)

  if (lockfiles.some((lockfile) => files.includes(lockfile))) {
    ecosystems.push({
      name: 'bun',
      directories: ['/'],
    })
  }

  if (hasPinnedActions(files, readFile)) {
    ecosystems.push({
      name: 'github-actions',
      directories: ['/'],
    })
  }

  if (composeDirectories.length > 0) {
    ecosystems.push({
      name: 'docker-compose',
      directories: composeDirectories,
    })
  }

  if (dockerDirectories.length > 0) {
    ecosystems.push({
      name: 'docker',
      directories: dockerDirectories,
    })
  }

  return ecosystems
}

const renderEcosystem = (ecosystem: Ecosystem): string => {
  const lines = [`  - package-ecosystem: ${ecosystem.name}`]
  const isMultiDirectory = ecosystem.directories.length > 1

  if (isMultiDirectory) {
    lines.push(
      '    directories:',
      ...ecosystem.directories.map((directory) => `      - ${directory}`),
    )
  } else {
    lines.push(`    directory: ${ecosystem.directories[0]}`)
  }

  lines.push(
    '    schedule:',
    '      interval: weekly',
    '    cooldown:',
    '      default-days: 7',
    '    groups:',
  )

  if (ecosystem.name === 'github-actions') {
    lines.push('      actions:', '        patterns:', "          - '*'")

    return `${lines.join('\n')}\n`
  }

  lines.push('      minor-and-patch:')

  // Without it, a group spanning several directories opens one PR per directory.
  if (isMultiDirectory) {
    lines.push('        group-by: dependency-name')
  }

  lines.push('        update-types:', '          - minor', '          - patch')

  return `${lines.join('\n')}\n`
}

export const renderConfig = (ecosystems: Array<Ecosystem>): string => {
  return `version: 2\n\nupdates:\n${ecosystems.map(renderEcosystem).join('\n')}`
}

const run = (): void => {
  const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n')
  const readFile: ReadFile = (path) => readFileSync(path, 'utf8')
  const expected = renderConfig(detectEcosystems(files, readFile))

  if (process.argv.includes('--write')) {
    mkdirSync(dirname(configPath), { recursive: true })
    writeFileSync(configPath, expected)

    return
  }

  if (existsSync(configPath) && readFileSync(configPath, 'utf8') === expected) {
    return
  }

  console.error(
    `${configPath} differs from the config kvalita generates for this repo. Write it with \`bun node_modules/kvalita/configs/dependabot/dependabot.ts --write\` and commit it.\n\nExpected:\n\n${expected}`,
  )
  process.exitCode = 1
}

if (import.meta.main) {
  run()
}
