// Helpers for the shared package workflow, which installs a package the way npm publishes it and
// loads every entry point it exports on each supported Node version.
//
// node package-check.mjs versions <package-dir>
//   Prints the Node majors to test as a JSON array: every even major from the floor in
//   engines.node, or 18 when it is not set, up to the latest release.
// node package-check.mjs peers <package-dir>
//   Prints each optional peer dependency as name@range, one per line. npm skips optional peers,
//   but an entry point built on one needs it installed to load.
// node package-check.mjs entries <package-dir> <consumer-dir>
//   Writes one file per exported entry point and condition into <consumer-dir>/entries.
// node package-check.mjs setups <package-dir> <consumer-dir> [--browser]
//   Writes one TypeScript project per module type and resolution, and one Vite SSR project per
//   module format, plus browser ones with --browser, each importing every entry point that setup
//   can reach, and prints their paths.
// node package-check.mjs typecheck <package-dir> <setup-dir>
//   Runs tsc on one TypeScript setup, failing only on errors in it or in the package's own types.

import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const defaultFloor = 18
const majorRegex = /\d+/
const ownerRegex = /node_modules\/((?:@[^/]+\/)?[^/]+)\//g

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

// Strict consumer settings, with skipLibCheck off so errors in the package's own types surface.
const compilerOptions = {
  target: 'ES2023',
  strict: true,
  esModuleInterop: true,
  skipLibCheck: false,
  noEmit: true,
}

// The module setting each resolution pairs with, per module type of the consumer package.
const modules = {
  node10: { esm: 'esnext', cjs: 'commonjs' },
  node16: { esm: 'node16', cjs: 'node16' },
  nodenext: { esm: 'nodenext', cjs: 'nodenext' },
  bundler: { esm: 'esnext', cjs: 'esnext' },
}

const toExports = (specifiers) => {
  return specifiers.map((specifier, index) => `export * as entry${index} from '${specifier}'\n`)
}

const writeProject = (dir, files) => {
  mkdirSync(dir, { recursive: true })

  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), typeof content === 'string' ? content : JSON.stringify(content))
  }
}

// Each file only imports the entries its module format can reach: import-able ones from ESM, and
// ones with a require condition from CommonJS. node10 ignores exports, so it gets the root entry
// only, and only when the package points at its types the old way.
const getTypeScriptFiles = (pkg, type, resolution) => {
  const entries = getEntries(pkg)
  const esm = entries.filter(({ kind }) => kind === 'import').map(({ specifier }) => specifier)
  const cjs = entries.filter(({ kind }) => kind === 'require').map(({ specifier }) => specifier)

  if (resolution === 'node10') {
    return pkg.types || pkg.typings ? { 'index.ts': toExports([pkg.name]).join('') } : {}
  }

  if (resolution === 'bundler') {
    return { 'index.ts': toExports(esm).join('') }
  }

  const files = {
    'index.ts': toExports(type === 'esm' ? esm : cjs).join(''),
    'index.mts': toExports(esm).join(''),
    'index.cts': toExports(cjs).join(''),
  }

  return Object.fromEntries(Object.entries(files).filter(([, content]) => content))
}

// An SSR build bundles the package in, the way Vite users with ssr.noExternal load it on a server.
// A browser build bundles everything for the browser, for packages that claim to run there.
const viteConfig = (input, target, name) => {
  const build =
    target === 'ssr'
      ? `{ ssr: true, rollupOptions: { input: fileURLToPath(new URL('./${input}', import.meta.url)) } }`
      : `{ rollupOptions: { input: fileURLToPath(new URL('./${input}', import.meta.url)) } }`
  const ssr = target === 'ssr' ? `, ssr: { noExternal: ['${name}'] }` : ''

  return [
    "import { fileURLToPath } from 'node:url'",
    '',
    `export default { build: ${build}${ssr} }`,
    '',
  ].join('\n')
}

const writeSetups = (packageDir, consumerDir, browser) => {
  const pkg = readPackage(packageDir)
  const entries = getEntries(pkg)

  for (const type of ['esm', 'cjs']) {
    for (const [resolution, module] of Object.entries(modules)) {
      const files = getTypeScriptFiles(pkg, type, resolution)

      if (Object.values(files).every((content) => !content)) {
        continue
      }

      const dir = join(consumerDir, 'typescript', `${type}-${resolution}`)

      writeProject(dir, {
        ...files,
        'package.json': { private: true, type: type === 'esm' ? 'module' : 'commonjs' },
        'tsconfig.json': {
          compilerOptions: {
            ...compilerOptions,
            module: module[type],
            moduleResolution: resolution,
          },
          include: Object.keys(files),
        },
      })
      console.log(`typescript/${type}-${resolution}`)
    }
  }

  const imports = entries.filter(({ kind }) => kind === 'import')
  const requires = entries.filter(({ kind }) => kind === 'require')
  const formats = {
    esm: {
      specifiers: imports,
      input: 'index.mjs',
      line: (specifier, index) => `export * as entry${index} from '${specifier}'\n`,
    },
    cjs: {
      specifiers: requires,
      input: 'index.cjs',
      line: (specifier, index) => `exports.entry${index} = require('${specifier}')\n`,
    },
  }

  for (const target of browser ? ['ssr', 'browser'] : ['ssr']) {
    for (const [format, { specifiers, input, line }] of Object.entries(formats)) {
      if (!specifiers.length) {
        continue
      }

      writeProject(join(consumerDir, 'vite', `${target}-${format}`), {
        'package.json': { private: true, type: 'module' },
        [input]: specifiers.map(({ specifier }, index) => line(specifier, index)).join(''),
        'vite.config.mjs': viteConfig(input, target, pkg.name),
      })
      console.log(`vite/${target}-${format}`)
    }
  }
}

// Type-checks one setup and fails only on errors a consumer would hit: in the generated files or in
// the package's own types. Errors inside the types of other packages it pulls in are printed but
// ignored, as they are not the package's to fix.
const typecheck = (packageDir, setupDir) => {
  const { name } = readPackage(packageDir)
  const { status, stdout } = spawnSync('npx', ['tsc', '-p', setupDir], { encoding: 'utf8' })
  const errors = stdout.split('\n').filter((line) => line.includes('error TS'))
  // The package a file belongs to is the one after the last node_modules in its path.
  const isRelevant = (line) => {
    const owner = [...line.matchAll(ownerRegex)].at(-1)?.[1]

    return !owner || owner === name
  }

  for (const line of errors) {
    console.log(isRelevant(line) ? line : `ignored: ${line}`)
  }

  return status === 0 || (errors.length > 0 && !errors.some(isRelevant))
}

const getOptionalPeers = (packageDir) => {
  const { peerDependencies = {}, peerDependenciesMeta = {} } = readPackage(packageDir)

  return Object.entries(peerDependencies)
    .filter(([name]) => peerDependenciesMeta[name]?.optional)
    .map(([name, range]) => `${name}@${range}`)
}

const [command, packageDir, consumerDir, flag] = process.argv.slice(2)

if (command === 'versions') {
  console.log(JSON.stringify(await getVersions(packageDir)))
} else if (command === 'peers') {
  for (const peer of getOptionalPeers(packageDir)) {
    console.log(peer)
  }
} else if (command === 'entries') {
  writeEntries(packageDir, consumerDir)
} else if (command === 'setups') {
  writeSetups(packageDir, consumerDir, flag === '--browser')
} else if (command === 'typecheck') {
  process.exit(typecheck(packageDir, consumerDir) ? 0 : 1)
} else {
  console.error(
    'Usage: package-check.mjs versions|peers <package-dir> | entries|setups|typecheck <package-dir> <dir>',
  )
  process.exit(1)
}
