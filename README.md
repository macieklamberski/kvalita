# Kvalita

[![npm version](https://img.shields.io/npm/v/kvalita.svg)](https://www.npmjs.com/package/kvalita)
[![license](https://img.shields.io/npm/l/kvalita.svg)](https://github.com/macieklamberski/kvalita/blob/main/LICENSE)

Shared linter configurations for TypeScript projects.

Kvalita provides reusable, opinionated configurations for maintaining consistent code quality across TypeScript projects.

## Installation

```bash
bun add -d kvalita
```

This will automatically install all required dependencies.

> [!NOTE]
> All tools are installed together for simplicity, even if you only use some of the configurations. This ensures all CLIs and configs work correctly and avoids resolution issues.

## Usage

### [Biome](https://github.com/biomejs/biome) Configuration

Create a `biome.json` file in your project root:

```json
{
  "extends": ["kvalita/biome"]
}
```

The config also runs GritQL plugins. Most of them target Bun tests:

- A callback written inline in `expect(() => fn()).toThrow()`, which reads better as `const throwing = () => fn()`.
- `const expected = value`, where asserting against `value` says the input comes back unchanged.
- `const expected = true` or `false`, where the boolean reads better inline in `toBe()`.
- `toBe(undefined)` and `toEqual(undefined)`, where `toBeUndefined()` says it directly.
- A test title that doesn't start with "should".
- A table written inline in `it.each(...)`, which reads better as a typed const above the call.

The rest apply to all code:

- `as unknown as`, which skips the type check entirely.
- An object literal cast with `as Type`, where an annotation checks every field. `as const` is fine.
- `.catch()` chained on a promise, where try/catch around an `await` is the house style. A fire-and-forget call behind `void` keeps its `.catch()`.
- Two or more `===` comparisons of one variable against literals, which read better as a named array and `.includes()`. A property such as `parsed.kind` is left alone, since a chain on it can narrow a union that `.includes()` cannot.
- A regex constant whose name doesn't end with `Regex`.

The plugins load from `node_modules/kvalita`, so the config expects kvalita installed at the project root.

### [Commitlint](https://github.com/conventional-changelog/commitlint) Configuration

Create a `commitlint.json` file in your project root:

```json
{
  "extends": ["./node_modules/kvalita/configs/commitlint.json"]
}
```

### [Semantic Release](https://github.com/semantic-release/semantic-release) Configuration

Use the `--extends` flag in your CI workflow:

```yaml
- name: Release
  run: bunx semantic-release --extends kvalita/semantic-release
```

This configuration includes:
- Branches: `main`, `rc` (prerelease), `beta` (prerelease), `alpha` (prerelease), and maintenance branches named `N.x` or `N.N.x`, which publish to the `release-N.x` dist-tag
- `conventionalcommits` preset with `feat!:` syntax for breaking changes
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements) (requires `id-token: write` permission)

### [Lefthook](https://github.com/evilmartians/lefthook) Configuration

Create a `lefthook.json` file in your project root and extend the hooks you need:

```json
{
  "extends": [
    "node_modules/kvalita/configs/lefthook-biome.json",
    "node_modules/kvalita/configs/lefthook-typescript.json",
    "node_modules/kvalita/configs/lefthook-commitlint.json"
  ]
}
```

**Available hooks:**
- `lefthook-biome.json` - Lints and formats staged files with Biome (pre-commit)
- `lefthook-typescript.json` - Type checks TypeScript files (pre-commit)
- `lefthook-commitlint.json` - Validates commit messages (commit-msg)

### Shared Workflows

Call them instead of copying the job into every repo. `secrets: inherit` passes `CODECOV_TOKEN` and `NPM_TOKEN` through.

```yaml
# .github/workflows/test.yml
name: Test
on:
  push:
    branches: [main, alpha, beta, rc]
  pull_request:
jobs:
  test:
    uses: macieklamberski/kvalita/.github/workflows/shared-test.yml@main
    secrets: inherit
```

```yaml
# .github/workflows/release.yml
name: Release
on:
  workflow_dispatch:
    inputs:
      branch:
        description: Branch to release
        required: true
        default: main
        type: choice
        options: [main, rc, beta, alpha]
jobs:
  release:
    uses: macieklamberski/kvalita/.github/workflows/shared-release.yml@main
    with:
      branch: ${{ inputs.branch }}
      build: true
    secrets: inherit
```

`shared-release` takes `branch`, `build`, `config` and `bun-version`; `shared-test` takes `bun-version` and `ref`. Every one has a default, so a repo on the common setup passes nothing. Start the release from the branch it releases, and pass that branch as `branch`. npm's provenance names the branch the run started on, so a run started on `main` can't publish another branch. Pass the same branch as `ref` to any gate job, such as `shared-test`, so the gates check the code being released.

`shared-package` checks the package the way a consumer gets it. It builds the package, installs it into an empty project with `npm install --install-links`, so only the published files land there, and loads every entry point in `exports`: through `import`, and through `require()` where a `require` condition exists. It does that on every even Node.js major from the floor in `engines.node`, or 18 when it isn't set, up to the latest release. On the latest one, it also turns off syntax detection and `require()` of ESM files, which older versions don't have. Optional peers get installed too, since an entry point built on one needs it.

A second job checks the same entry points the way TypeScript and bundler users reach them. It type-checks them from an ESM and a CommonJS project under each module resolution (`node10`, `node16`, `nodenext` and `bundler`) with `strict` and `skipLibCheck: false`, and fails only on errors in the package's own types. It also bundles them with Vite as a server build. With `browser: true`, it bundles them for the browser as well. Every setup only imports what the package claims: CommonJS files only use entry points with a `require` condition, and `node10` only checks the root entry, when the package has a top-level `types`.

It takes `ref`, `bun-version` and `browser`:

```yaml
# .github/workflows/package.yml
name: Package
on:
  push:
    branches: [main, alpha, beta, rc]
  pull_request:
  workflow_call:
    inputs:
      ref:
        type: string
        default: ''
jobs:
  package:
    uses: macieklamberski/kvalita/.github/workflows/shared-package.yml@main
    with:
      ref: ${{ inputs.ref }}
```

The `workflow_call` trigger lets the release workflow run it as a gate with `ref: ${{ inputs.branch }}`, next to `shared-test`.

### Ignore File Templates

Copy the templates into your project root, then add whatever the project itself produces:

```bash
cp node_modules/kvalita/configs/gitignore .gitignore
cp node_modules/kvalita/configs/dockerignore .dockerignore
```

The Docker entries carry a `**/` prefix because Docker matches from the build context root, not at any depth like git. `**` also matches zero directories, so the one spelling works in a flat project and a monorepo alike.
