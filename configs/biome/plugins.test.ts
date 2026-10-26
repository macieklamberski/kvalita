import { describe, expect, it } from 'bun:test'
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const pluginsDir = import.meta.dir
const root = join(pluginsDir, '../..')
const biome = join(root, 'node_modules/.bin/biome')
const gritRegex = /\.grit$/
const flagRegex = /\/\/ flag$/

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

describe.each(plugins)('%s', (plugin) => {
  it('should flag the marked fixture lines and no others', () => {
    const flagged = readFlaggedLines(plugin)

    expect(flagged.length).toBeGreaterThan(0)
    expect(lintFixture(plugin)).toEqual(flagged)
  })
})
