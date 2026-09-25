// Helpers for the shared package workflow, which installs a package the way npm publishes it and
// loads every entry point it exports on each supported Node version.
//
// node package-check.mjs versions <package-dir>
//   Prints the Node majors to test as a JSON array: every even major from the floor in
//   engines.node, or 18 when it is not set, up to the latest release.
// node package-check.mjs entries <package-dir> <consumer-dir>
//   Writes one file per exported entry point and condition into <consumer-dir>/entries.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const defaultFloor = 18
const majorRegex = /\d+/

const readPackage = (packageDir) => {
  return JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'))
}

// The lowest major any alternative of the range allows, so `^18 || >=20` starts at 18.
const getFloor = (range) => {
  if (!range) {
    return defaultFloor
  }

  const majors = range.split('||').map((alternative) => Number(alternative.match(majorRegex)?.[0]))

  return Math.min(...majors.filter((major) => !Number.isNaN(major)))
}

const getVersions = async (packageDir) => {
  const floor = getFloor(readPackage(packageDir).engines?.node)
  const response = await fetch('https://nodejs.org/dist/index.json')
  const releases = await response.json()
  const latest = Math.max(
    ...releases.map((release) => Number(release.version.match(majorRegex)[0])),
  )
  const versions = []

  // Odd majors never become LTS, so only the latest one is worth testing.
  for (let major = floor; major <= latest; major++) {
    if (major % 2 === 0 || major === latest) {
      versions.push(major)
    }
  }

  return versions
}

// Every condition name used anywhere in an export target, including nested ones like node.import.
const getConditions = (target) => {
  if (typeof target === 'string') {
    return ['default']
  }

  if (Array.isArray(target)) {
    return target.flatMap(getConditions)
  }

  if (target && typeof target === 'object') {
    return Object.entries(target).flatMap(([key, value]) => [key, ...getConditions(value)])
  }

  return []
}

const getSubpaths = (pkg) => {
  const exports = pkg.exports ?? pkg.main ?? './index.js'

  if (typeof exports === 'object' && Object.keys(exports).some((key) => key.startsWith('.'))) {
    return exports
  }

  return { '.': exports }
}

const getEntries = (pkg) => {
  const entries = []

  for (const [subpath, target] of Object.entries(getSubpaths(pkg))) {
    // Patterns have no single file to load, and JSON needs an import attribute old Node lacks.
    if (subpath.includes('*') || subpath.endsWith('.json')) {
      continue
    }

    const specifier = subpath === '.' ? pkg.name : `${pkg.name}${subpath.slice(1)}`
    const conditions = getConditions(target)

    if (conditions.some((condition) => ['import', 'default'].includes(condition))) {
      entries.push({ specifier, kind: 'import' })
    }

    if (conditions.includes('require')) {
      entries.push({ specifier, kind: 'require' })
    }
  }

  return entries
}

const writeEntries = (packageDir, consumerDir) => {
  const entriesDir = join(consumerDir, 'entries')
  const entries = getEntries(readPackage(packageDir))

  mkdirSync(entriesDir, { recursive: true })

  entries.forEach(({ specifier, kind }, index) => {
    const name = `${String(index).padStart(2, '0')}-${kind}`
    const code =
      kind === 'import'
        ? `import * as entry from '${specifier}'\n`
        : `const entry = require('${specifier}')\n`

    writeFileSync(join(entriesDir, `${name}.${kind === 'import' ? 'mjs' : 'cjs'}`), code)
    console.log(`${name}: ${kind} ${specifier}`)
  })
}

const [command, packageDir, consumerDir] = process.argv.slice(2)

if (command === 'versions') {
  console.log(JSON.stringify(await getVersions(packageDir)))
} else if (command === 'entries') {
  writeEntries(packageDir, consumerDir)
} else {
  console.error(
    'Usage: package-check.mjs versions <package-dir> | entries <package-dir> <consumer-dir>',
  )
  process.exit(1)
}
