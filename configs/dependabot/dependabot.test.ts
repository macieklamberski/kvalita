import { describe, expect, it } from 'bun:test'
import { detectEcosystems, type Ecosystem, type ReadFile, renderConfig } from './dependabot.ts'

const workflows: Record<string, string> = {
  '.github/workflows/test.yml': `
jobs:
  test:
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
`,
  '.github/workflows/lint.yml': `
jobs:
  lint:
    uses: macieklamberski/kvalita/.github/workflows/shared-lint.yml@main
  package:
    uses: ./.github/workflows/package.yml
`,
}

const readFile: ReadFile = (path) => workflows[path] ?? ''

const monorepoConfig = `version: 2

updates:
  - package-ecosystem: bun
    directory: /
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
    groups:
      minor-and-patch:
        update-types:
          - minor
          - patch

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
    groups:
      actions:
        patterns:
          - '*'

  - package-ecosystem: docker-compose
    directory: /.docker
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
    groups:
      minor-and-patch:
        update-types:
          - minor
          - patch

  - package-ecosystem: docker
    directories:
      - /apps/backend/.docker
      - /apps/frontend/.docker
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
    groups:
      minor-and-patch:
        group-by: dependency-name
        update-types:
          - minor
          - patch
`

describe('detectEcosystems', () => {
  it('should detect bun from its lockfile', () => {
    const expected: Array<Ecosystem> = [
      {
        name: 'bun',
        directories: ['/'],
      },
    ]

    expect(detectEcosystems(['bun.lock'], readFile)).toEqual(expected)
  })

  it('should detect actions pinned in a workflow', () => {
    const expected: Array<Ecosystem> = [
      {
        name: 'github-actions',
        directories: ['/'],
      },
    ]

    expect(detectEcosystems(['.github/workflows/test.yml'], readFile)).toEqual(expected)
  })

  it('should skip actions when workflows only call shared and local workflows', () => {
    expect(detectEcosystems(['.github/workflows/lint.yml'], readFile)).toEqual([])
  })

  it('should map a root Dockerfile to the root directory', () => {
    const expected: Array<Ecosystem> = [
      {
        name: 'docker',
        directories: ['/'],
      },
    ]

    expect(detectEcosystems(['Dockerfile'], readFile)).toEqual(expected)
  })

  it('should list each directory holding a Dockerfile once', () => {
    const files = [
      'apps/backend/.docker/Dockerfile.dev',
      'apps/backend/.docker/Dockerfile.prod',
      'apps/frontend/.docker/Dockerfile.prod',
    ]
    const expected: Array<Ecosystem> = [
      {
        name: 'docker',
        directories: ['/apps/backend/.docker', '/apps/frontend/.docker'],
      },
    ]

    expect(detectEcosystems(files, readFile)).toEqual(expected)
  })

  it('should detect compose files', () => {
    const expected: Array<Ecosystem> = [
      {
        name: 'docker-compose',
        directories: ['/.docker'],
      },
    ]

    expect(detectEcosystems(['.docker/docker-compose.prod.yml'], readFile)).toEqual(expected)
  })
})

describe('renderConfig', () => {
  it('should render every ecosystem with the shared schedule, cooldown and groups', () => {
    const ecosystems: Array<Ecosystem> = [
      {
        name: 'bun',
        directories: ['/'],
      },
      {
        name: 'github-actions',
        directories: ['/'],
      },
      {
        name: 'docker-compose',
        directories: ['/.docker'],
      },
      {
        name: 'docker',
        directories: ['/apps/backend/.docker', '/apps/frontend/.docker'],
      },
    ]

    expect(renderConfig(ecosystems)).toBe(monorepoConfig)
  })
})
