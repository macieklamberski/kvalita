# Kvalita

[![npm version](https://img.shields.io/npm/v/kvalita.svg)](https://www.npmjs.com/package/kvalita)
[![license](https://img.shields.io/npm/l/kvalita.svg)](https://github.com/macieklamberski/kvalita/blob/main/LICENSE)

Shared linter configurations for TypeScript projects.

Kvalita provides reusable, opinionated configurations for maintaining consistent code quality across TypeScript projects.

## Installation

```bash
bun add -d kvalita
```

Each configuration can be used independently - install only what your project needs.

## Usage

### Biome Configuration

Install the required dependencies:

```bash
bun add -d @biomejs/biome
```

Create a `biome.json` file in your project root:

```json
{
  "extends": ["kvalita/biome"]
}
```

### Commitlint Configuration

Install the required dependencies:

```bash
bun add -d @commitlint/cli @commitlint/config-conventional
```

Create a `commitlint.json` file in your project root:

```json
{
  "extends": ["kvalita/commitlint"]
}
```
