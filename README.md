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

Create a `release.json` file in your project root:

```json
{
  "extends": "kvalita/semantic-release"
}
```

This configuration uses the `conventionalcommits` preset, which supports the `feat!:` syntax for breaking changes.

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
