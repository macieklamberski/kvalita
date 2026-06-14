---
name: package-release
description: Cut and publish a release for a TypeScript package that uses kvalita's shared semantic-release/commitlint config. Use when releasing a new version, deciding which commit type triggers which bump, working with the alpha/beta/rc prerelease channels, dispatching the release workflow, or pinning prerelease dependency versions. For authoring/opening the PR itself, see the pr-create skill.
---

# Package release

How a release is cut for a package consuming kvalita's shared configs (`kvalita/semantic-release`, `kvalita/commitlint`). Releases are **semantic-release driven** — there's no manual version bump; the merged commit types decide the version.

## How a release is cut

A `Release` GitHub Actions workflow runs semantic-release on a channel branch:

```bash
gh workflow run release.yml -f branch=<channel> --ref <channel>
```

semantic-release reads `release.json` (which extends `kvalita/semantic-release`), computes the next version from the commits since the last tag on that branch, publishes to npm (with provenance), and creates the GitHub release.

**The dispatch gotcha (load-bearing):** always pass `--ref <branch>` matching the `branch` input. Without it the workflow checks out the branch but env-ci still reports `main`, and semantic-release dies with:

```
git tag --merged main
fatal: malformed object name main
```

## What triggers a release

kvalita's `releaseRules` (conventionalcommits preset):

| Commit | Bump |
|---|---|
| `feat!:` / `BREAKING CHANGE:` | major |
| `feat:` | minor |
| `fix:` | patch |
| `perf:` | patch |
| `refactor:` / `chore:` / `test:` / `docs:` | **no release** |

A merged PR containing only non-releasing types (e.g. all `refactor:`) won't cut a release — add an empty `fix:` commit to force one.

Commit-type nuance: a **spec-alignment** change is a `fix:`, not `feat:` and not breaking — the package's contract is "match the spec", so if it was wrong before, correcting it is a fix (patch), and it needs no migration doc.

Commit messages are sentence-case (commitlint `subject-case`). The branch / draft-PR / commit-authoring discipline lives in the **pr-create** skill.

## Channels

Prerelease ladder `alpha < beta < rc` → then GA on `main`. Channel branches: `alpha`, `beta`, `rc`, plus the deprecated `next`. See `references/versioning-and-deps.md` for the semver-precedence trap, exact-pinning prerelease deps, peer-dep floors, and migration-doc/changelog rules.
