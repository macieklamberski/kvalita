import { describe, expect, it } from 'bun:test'
import { readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const preloadPath = join(import.meta.dir, 'preload.ts')
const fixtureDir = join(import.meta.dir, 'fixtures')
const lcovPath = join(fixtureDir, 'coverage/lcov.info')

const runFixtureTests = (preload: string): string => {
  const command = [process.execPath, 'test', '--preload', preload, './src']

  rmSync(lcovPath, { force: true })

  const result = Bun.spawnSync(command, { cwd: fixtureDir, stdout: 'pipe', stderr: 'pipe' })

  if (result.exitCode !== 0) {
    throw new Error(`bun test failed in the fixture project:\n${result.stdout}${result.stderr}`)
  }

  return readFileSync(lcovPath, 'utf8')
}

describe('preload', () => {
  const expectedFull = `SF:src/sample.ts
FN:1,(anonymous_0)
FN:5,(anonymous_1)
FN:9,(anonymous_2)
FN:17,(anonymous_3)
FN:21,(anonymous_4)
FNDA:1,(anonymous_0)
FNDA:1,(anonymous_1)
FNDA:1,(anonymous_2)
FNDA:1,(anonymous_3)
FNDA:0,(anonymous_4)
FNF:5
FNH:4
DA:1,1
DA:2,1
DA:5,1
DA:6,1
DA:9,1
DA:10,1
DA:11,0
DA:14,1
DA:17,1
DA:18,1
DA:21,1
DA:22,0
LF:12
LH:10
BRDA:2,0,0,0
BRDA:2,0,1,1
BRDA:6,1,0,1
BRDA:6,1,1,0
BRDA:10,2,0,0
BRDA:10,2,1,1
BRDA:22,3,0,-
BRDA:22,3,1,-
BRF:8
BRH:3
end_of_record
`

  it('should write every branch arm of the fixture sources as lcov', () => {
    expect(runFixtureTests(preloadPath)).toBe(expectedFull)
  })

  it('should resolve as kvalita/coverage through node_modules', () => {
    expect(runFixtureTests('kvalita/coverage')).toBe(expectedFull)
  })
})
