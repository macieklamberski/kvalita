import { relative } from 'node:path'
import { type CoverageMapData, createCoverageMap } from 'istanbul-lib-coverage'

// Writes the map as lcov with BRDA rows, one per branch arm, so a consumer reads which arm of a
// ternary, a `??` chain or a guard no test reached, on a line that counts as covered otherwise.
export const generateLcov = (data: CoverageMapData, root: string): string => {
  const map = createCoverageMap(data)
  const lines: Array<string> = []

  const paths = map.files().sort((left, right) => left.localeCompare(right))

  for (const path of paths) {
    const file = map.fileCoverageFor(path)
    const summary = file.toSummary()
    const functions = Object.entries(file.fnMap)

    lines.push(`SF:${relative(root, path)}`)

    for (const [, meta] of functions) {
      lines.push(`FN:${meta.decl.start.line},${meta.name}`)
    }

    for (const [key, meta] of functions) {
      lines.push(`FNDA:${file.f[key]},${meta.name}`)
    }

    lines.push(`FNF:${summary.functions.total}`, `FNH:${summary.functions.covered}`)

    for (const [line, count] of Object.entries(file.getLineCoverage())) {
      lines.push(`DA:${line},${count}`)
    }

    lines.push(`LF:${summary.lines.total}`, `LH:${summary.lines.covered}`)

    for (const [key, meta] of Object.entries(file.branchMap)) {
      const counts = file.b[key] ?? []
      const isReached = counts.some((count) => count > 0)

      for (const [index, count] of counts.entries()) {
        lines.push(`BRDA:${meta.loc.start.line},${key},${index},${isReached ? count : '-'}`)
      }
    }

    lines.push(`BRF:${summary.branches.total}`, `BRH:${summary.branches.covered}`, 'end_of_record')
  }

  return `${lines.join('\n')}\n`
}
