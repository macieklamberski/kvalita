import { afterAll } from 'bun:test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { CoverageMapData } from 'istanbul-lib-coverage'
import { createInstrumenter } from 'istanbul-lib-instrument'
import { generateLcov } from './lcov'

type CoverageGlobal = typeof globalThis & {
  kvalitaCoverage?: CoverageMapData
}

const root = process.cwd()
// Every .ts and .tsx under the cwd, minus node_modules, test files and declarations.
const sourceRegex = new RegExp(
  `^${RegExp.escape(root)}/(?!(?:.*/)?node_modules/)(?!.*\\.(?:test\\.tsx?|d\\.ts)$).*\\.tsx?$`,
)
const instrumenters = {
  ts: createInstrumenter({
    coverageVariable: 'kvalitaCoverage',
    esModules: true,
    compact: false,
    produceSourceMap: false,
    parserPlugins: ['typescript'],
  }),
  tsx: createInstrumenter({
    coverageVariable: 'kvalitaCoverage',
    esModules: true,
    compact: false,
    produceSourceMap: false,
    parserPlugins: ['typescript', 'jsx'],
  }),
}

const writeCoverage = (): void => {
  const coverage = (globalThis as CoverageGlobal).kvalitaCoverage

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
