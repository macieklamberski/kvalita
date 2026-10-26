import { describe, expect, it } from 'bun:test'
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const pluginsDir = import.meta.dir
const root = join(pluginsDir, '../..')
const biome = join(root, 'node_modules/.bin/biome')
const gritRegex = /\.grit$/
const flagRegex = /\/\/ flag$/

const byName = (left: string | undefined, right: string | undefined): number => {
  return (left ?? '').localeCompare(right ?? '')
}

type Diagnostic = {
  location: {
    start: {
      line: number
    }
  }
}

const plugins = readdirSync(pluginsDir)
  .filter((name) => gritRegex.test(name))
  .map((name) => name.replace(gritRegex, ''))
// Every plugin ships in exactly one config: the shared one, or the opt-in one for trousse projects.
const configs = ['shared.json', 'trousse.json']

const readRegistered = (config: string): Array<string | undefined> => {
  const source = readFileSync(join(pluginsDir, config), 'utf8')
  const { plugins } = JSON.parse(source) as { plugins: Array<string> }

  return plugins.map((path) => path.split('/').at(-1)?.replace(gritRegex, ''))
}

const registered = configs.flatMap(readRegistered)

// One plugin at a time, through a config of its own, so a fixture line is attributed to the
// plugin under test and not to a neighbour that happens to match it too.
const lintFixture = (plugin: string): Array<number> => {
  const prefix = join(tmpdir(), 'kvalita-plugin-')
  const configDir = mkdtempSync(prefix)
  const config = {
    plugins: [join(pluginsDir, `${plugin}.grit`)],
    linter: { rules: { recommended: false } },
    formatter: { enabled: false },
  }

  writeFileSync(join(configDir, 'biome.json'), JSON.stringify(config))

  const command = [
    biome,
    'lint',
    `--config-path=${configDir}`,
    '--only=plugin',
    '--reporter=json',
    '--max-diagnostics=none',
    `configs/biome/fixtures/${plugin}.ts`,
  ]
  const result = Bun.spawnSync(command, { cwd: root, stdout: 'pipe', stderr: 'pipe' })
  const json = `${result.stdout}`.split('\n').find((line) => line.startsWith('{'))

  if (!json) {
    throw new Error(
      `Biome reported no diagnostics for ${plugin}:\n${result.stdout}${result.stderr}`,
    )
  }

  const { diagnostics } = JSON.parse(json) as { diagnostics: Array<Diagnostic> }
  const lines = diagnostics.map((diagnostic) => diagnostic.location.start.line)

  return [...new Set(lines)].sort((left, right) => left - right)
}

const readFlaggedLines = (plugin: string): Array<number> => {
  const source = readFileSync(join(pluginsDir, `fixtures/${plugin}.ts`), 'utf8')
  const flagged: Array<number> = []

  for (const [index, line] of source.split('\n').entries()) {
    if (flagRegex.test(line)) {
      flagged.push(index + 1)
    }
  }

  return flagged
}

describe('configs', () => {
  it('should register every plugin in the folder once and nothing else', () => {
    expect(registered.toSorted(byName)).toEqual(plugins.toSorted(byName))
  })
})

describe.each(plugins)('%s', (plugin) => {
  it('should flag the marked fixture lines and no others', () => {
    const flagged = readFlaggedLines(plugin)

    expect(flagged.length).toBeGreaterThan(0)
    expect(lintFixture(plugin)).toEqual(flagged)
  })
})
