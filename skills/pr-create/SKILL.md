---
name: pr-create
description: Author, open, and watch a pull request through to green for a TypeScript package using kvalita's CI conventions. Use when opening or creating a PR (draft), slicing work into separate PRs, branching for a change, or watching a PR's CI checks and Codecov coverage report. Covers branch/commit/draft discipline and polling the Codecov coverage comment after CI. For cutting a release once merged, see the package-release skill.
---

# PR create & watch

Two phases: author and open the PR, then watch it through CI and the Codecov coverage report.

## A. Author & open

- **Branch off the prerelease integration branch** (currently `beta`), never commit to it directly:
  ```bash
  git checkout beta && git pull && git checkout -b feat/<name>
  ```
- **Commit conventions:** sentence-case subjects (commitlint enforces it). `test:` for test-only changes. A spec-alignment change is `fix:` (not `feat:`, not breaking) and skips migration docs. (Which types trigger a release: see the package-release skill.)
- **Slice independent changes into separate PRs**, one git worktree each so they can be implemented in parallel (`Agent isolation: "worktree"`). Add an explicit "PR slicing" note listing each PR's scope when a plan spans several.
- **Open as draft:**
  ```bash
  gh pr create --draft --base beta --title "<type>: <Sentence-case title>" --body "<concise summary>"
  ```
  Body is concise. **No "Test plan" section.** No references to internal plan/research docs — the description stands alone. Solo-project mechanical chores (deletions, renames, lockfile bumps) may land on `main` directly without a PR; but once a package has a published release, features go via PR.

## B. Watch through (CI + Codecov)

Consuming repos run `bun test --coverage --coverage-reporter=lcov` and upload `./coverage/lcov.info` via `codecov/codecov-action@v5` on `pull_request` (drafts included) and main/release pushes.

**Codecov here posts a PR comment, not a status/check** — there is no `codecov/project`/`codecov/patch` context and `gh api repos/{o}/{r}/statuses/{sha}` is empty. So watch the CI job, then poll for the comment.

```bash
# 1. Resolve the PR for the current branch
pr=$(gh pr view --json number -q .number)

# 2. Watch CI to completion (the job is named "test")
gh pr checks "$pr" --watch

# 3. Poll for the Codecov comment — it lags the test job by a few seconds.
#    Do NOT wait on a codecov/* status (it never appears).
for i in $(seq 1 10); do
  body=$(gh pr view "$pr" --json comments \
    -q '.comments[] | select(.author.login|test("codecov")) | .body')
  [ -n "$body" ] && break
  sleep 5
done
printf '%s\n' "$body"
```

Surface the coverage summary from the comment — e.g. "✅ All modified and coverable lines are covered by tests", or the patch/project coverage % and delta.

**Gotchas**
- Wait on the **comment**, not a `codecov/*` status — Codecov is comment-only here, so a status poll waits forever.
- The comment author is `codecov-commenter` (match the `codecov` substring to stay robust).
- **Pre-push local mirror:** `bun test <file> --coverage --coverage-reporter=lcov`, then grep `coverage/lcov.info` for `DA:<line>` (e.g. `grep "^DA:773" coverage/lcov.info`) to confirm specific lines are hit before pushing.
