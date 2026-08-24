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
- Branches: `main`, `rc` (prerelease), `beta` (prerelease), `alpha` (prerelease)
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

`shared-release` takes `branch`, `build`, `config` and `bun-version`; `shared-test` takes `bun-version`. Every one has a default, so a repo on the common setup passes nothing.

### Ignore File Templates

Copy the templates into your project root, then add whatever the project itself produces:

```bash
cp node_modules/kvalita/configs/gitignore .gitignore
cp node_modules/kvalita/configs/dockerignore .dockerignore
```

The Docker entries carry a `**/` prefix because Docker matches from the build context root, not at any depth like git. `**` also matches zero directories, so the one spelling works in a flat project and a monorepo alike.
