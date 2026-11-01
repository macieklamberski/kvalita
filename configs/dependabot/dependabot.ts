import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export type Ecosystem = {
  name: string
  directory: string
}

const configPath = '.github/dependabot.yml'

const dockerfileRegex = /(^|\/)Dockerfile[^/]*$/
const composeRegex = /(^|\/)(docker-)?compose[^/]*\.ya?ml$/

// A glob matching no file fails the update job on every run, so these entries need a file to exist.
export const detectEcosystems = (files: Array<string>): Array<Ecosystem> => {
  const ecosystems: Array<Ecosystem> = [
    {
      name: 'bun',
      directory: '/',
    },
    {
      name: 'github-actions',
      directory: '/',
    },
  ]

  if (files.some((file) => composeRegex.test(file))) {
    ecosystems.push({
      name: 'docker-compose',
      directory: '/**/*',
    })
  }

  if (files.some((file) => dockerfileRegex.test(file))) {
    ecosystems.push({
      name: 'docker',
      directory: '/**/*',
    })
  }

  return ecosystems
}

const renderEcosystem = (ecosystem: Ecosystem): string => {
  // A glob is only accepted under `directories`.
  const location =
    ecosystem.directory === '/'
      ? `    directory: ${ecosystem.directory}`
      : `    directories: ['${ecosystem.directory}']`

  return `  - package-ecosystem: ${ecosystem.name}\n${location}\n    patterns: ['*']\n    multi-ecosystem-group: dependencies\n`
}

export const renderConfig = (ecosystems: Array<Ecosystem>): string => {
  const group =
    'multi-ecosystem-groups:\n  dependencies:\n    schedule:\n      interval: weekly\n    cooldown:\n      default-days: 7\n'

  return `version: 2\n\n${group}\nupdates:\n${ecosystems.map(renderEcosystem).join('\n')}`
}

const run = (): void => {
  const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n')
  const expected = renderConfig(detectEcosystems(files))

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
