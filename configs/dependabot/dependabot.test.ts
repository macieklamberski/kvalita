import { describe, expect, it } from 'bun:test'
import { detectEcosystems, type Ecosystem, renderConfig } from './dependabot.ts'

const fullConfig = `version: 2

multi-ecosystem-groups:
  dependencies:
    schedule:
      interval: weekly
    cooldown:
      default-days: 7

updates:
  - package-ecosystem: bun
    directory: /
    patterns:
      - '*'
    multi-ecosystem-group: dependencies

  - package-ecosystem: github-actions
    directory: /
    patterns:
      - '*'
    multi-ecosystem-group: dependencies

  - package-ecosystem: docker-compose
    directories:
      - /**/*
    patterns:
      - '*'
    multi-ecosystem-group: dependencies

  - package-ecosystem: docker
    directories:
      - /**/*
    patterns:
      - '*'
    multi-ecosystem-group: dependencies
`

describe('detectEcosystems', () => {
  it('should include bun and actions in a repo without Docker files', () => {
    const expected: Array<Ecosystem> = [
      {
        name: 'bun',
        directory: '/',
      },
      {
        name: 'github-actions',
        directory: '/',
      },
    ]

    expect(detectEcosystems(['bun.lock', 'src/index.ts'])).toEqual(expected)
  })

  it('should add docker when a Dockerfile exists', () => {
    const expected: Array<Ecosystem> = [
      {
        name: 'bun',
        directory: '/',
      },
      {
        name: 'github-actions',
        directory: '/',
      },
      {
        name: 'docker',
        directory: '/**/*',
      },
    ]

    expect(detectEcosystems(['bun.lock', 'docs/.docker/Dockerfile'])).toEqual(expected)
  })

  it('should add docker-compose when a compose file exists', () => {
    const expected: Array<Ecosystem> = [
      {
        name: 'bun',
        directory: '/',
      },
      {
        name: 'github-actions',
        directory: '/',
      },
      {
        name: 'docker-compose',
        directory: '/**/*',
      },
      {
        name: 'docker',
        directory: '/**/*',
      },
    ]
    const files = ['.docker/docker-compose.prod.yml', 'apps/backend/.docker/Dockerfile.prod']

    expect(detectEcosystems(files)).toEqual(expected)
  })
})

describe('renderConfig', () => {
  it('should render every ecosystem into the shared group', () => {
    const files = ['.docker/docker-compose.prod.yml', 'apps/backend/.docker/Dockerfile.prod']

    expect(renderConfig(detectEcosystems(files))).toBe(fullConfig)
  })
})
