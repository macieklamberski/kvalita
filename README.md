# Kvalita

[![npm version](https://img.shields.io/npm/v/kvalita.svg)](https://www.npmjs.com/package/kvalita)
[![license](https://img.shields.io/npm/l/kvalita.svg)](https://github.com/macieklamberski/kvalita/blob/main/LICENSE)

Shared linter configurations for TypeScript projects.

Kvalita provides reusable, opinionated configurations for maintaining consistent code quality across TypeScript projects.

## Installation

```bash
npm install --save-dev kvalita
```

### Peer Dependencies

The following packages need to be installed separately depending on which configurations you use:

```bash
# For Biome configuration
npm install -D @biomejs/biome
# For commitlint configuration
npm install -D @commitlint/cli @commitlint/config-conventional
```

## Usage

### Biome Configuration

Create a `biome.json` file in your project root:

```json
{
  "extends": ["kvalita/biome"]
}
```

### Commitlint Configuration

Create a `commitlint.json` file in your project root:

```json
{
  "extends": ["kvalita/commitlint"]
}
```
