import { afterAll } from 'bun:test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { CoverageMapData } from 'istanbul-lib-coverage'
import { createInstrumenter } from 'istanbul-lib-instrument'
import { generateLcov } from './lcov'

type CoverageGlobal = typeof globalThis & {
  __coverage__?: CoverageMapData
}

const root = process.cwd()
// Every .ts and .tsx under src, minus test files and declarations.
const sourceRegex = new RegExp(
  `^${RegExp.escape(join(root, 'src'))}/(?!.*\\.(?:test\\.tsx?|d\\.ts)$).*\\.tsx?$`,
)
const instrumenters = {
  ts: createInstrumenter({
    esModules: true,
    compact: false,
    produceSourceMap: false,
    parserPlugins: ['typescript'],
  }),
  tsx: createInstrumenter({
    esModules: true,
    compact: false,
    produceSourceMap: false,
    parserPlugins: ['typescript', 'jsx'],
  }),
}

const writeCoverage = (): void => {
  // biome-ignore lint/nursery/noDanglingUnderscore: The name is Istanbul's own coverage variable.
  const coverage = (globalThis as CoverageGlobal).__coverage__

  if (!coverage) {
    return
  }

  mkdirSync(join(root, 'coverage'), { recursive: true })
  writeFileSync(join(root, 'coverage/lcov.info'), generateLcov(coverage, root))
}

Bun.plugin({
  name: 'kvalita-coverage',
  setup: (build) => {
    build.onLoad({ filter: sourceRegex }, async ({ path }) => {
      const source = await Bun.file(path).text()
      const loader = path.endsWith('.tsx') ? 'tsx' : 'ts'

      return { contents: instrumenters[loader].instrumentSync(source, path), loader }
    })
  },
})

afterAll(writeCoverage)
