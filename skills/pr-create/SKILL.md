---
name: pr-create
description: Author, open, and watch a pull request through to green in any repo using kvalita's CI conventions, published packages and private monorepos alike. Use when opening or creating a PR (draft), slicing work into separate PRs, branching for a change, or watching a PR's CI checks and Codecov coverage report. Covers branch/commit/draft discipline and polling the Codecov coverage comment after CI.
---

# PR create & watch

Two phases: author and open the PR, then watch it through CI and the Codecov coverage report.

Applies to every repo on these CI conventions. For a published package that means branching off the active prerelease integration branch; for a private repo that publishes nothing, it means branching off `main`. The branch differs, everything else below does not.

## A. Author & open

- **Branch off the integration branch**, never commit to it directly. That is `rc` in a published package while a 2.x/3.x prerelease line is active (the branch was named `beta` until it was renamed on 2026-07-05), and `main` in a private repo:
  ```bash
  git checkout rc && git pull && git checkout -b feat/<name>
  ```
- **Switch the checkout in place; do not reach for a worktree by default.** Parallel copies of a repo cost disk and drift out of sync, and review happens through PRs anyway. The exception is a second writer in the same checkout: someone is working on another branch there, or another agent is operating in it and you see the working tree or current branch change under you. Then isolate with a worktree in a dedicated directory outside the repo, never a sibling of it and never under a temp directory that cleanup may remove; symlink or install `node_modules` inside it so tests run, and delete it when done. Either way, check `git status` for in-flight work that is not yours before any branch switch.
- **Commit conventions:** sentence-case subjects (commitlint enforces it). `test:` for test-only changes. A spec-alignment change is `fix:` (not `feat:`, not breaking) and skips migration docs. In the published packages, breaking, `feat:`, `fix:` and `perf:` cut a release and `refactor:` does not, so a PR that is all refactor commits needs an empty `fix:` commit to release.
- **Slice independent changes into separate PRs.** Add an explicit "PR slicing" note listing each PR's scope when a plan spans several. Implement them one after another in the same checkout unless one of the worktree exceptions above applies.
- **Open as draft:**
  ```bash
  gh pr create --draft --base rc --title "<type>: <Sentence-case title>" --body "<concise summary>"
  ```
  `--base` is whatever you branched off: `rc` in a published package during a prerelease line, `main` in a private repo. Body is concise. **No "Test plan" section.**

  **Before running `gh pr create` or `gh pr edit --body`, check the text for prior-art framing and remove it.** Never present a change as taken from elsewhere: no "inspired by X", no "reference patterns: X", no link to another project's source as the justification. Naming a project is fine where it is not offered as the source of the idea, such as a declared dependency or a platform whose markup is handled. Justify the change on the measurement, the markup and the mechanism. The same applies to commit messages and to anything that ships. No references to internal plan/research docs: the description stands alone. The `pr-message` skill owns the rest of what a description contains, how long it is and how it reads. Solo-project mechanical chores (deletions, renames, lockfile bumps) may land on `main` directly without a PR; but once a package has a published release, features go via PR.

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

**A PR is not finished until this is green.** Check it roughly a minute after pushing, and if either CI or the coverage report is red, fix it in the same session rather than reporting the PR as open and moving on.

### Resolving a patch-coverage failure

Read the uncovered lines out of the comment (or `coverage/lcov.info` locally), then pick one of two fixes per line, never a coverage-threshold change:

- **Cover it** when the line is reachable. Add the test for the input that reaches it.
- **Delete it** when it is not. The usual culprit is a defensive guard copied from a sibling file that nothing can reach in this one; it only shows up because the patch made it new. Writing a test for unreachable code is the wrong repair, and it fails the testing skill's rule against tests that pin authoring rather than behavior. Remove the guard.

**Gotchas**
- Wait on the **comment**, not a `codecov/*` status — Codecov is comment-only here, so a status poll waits forever.
- The comment author is `codecov-commenter` (match the `codecov` substring to stay robust).
- **Pre-push local mirror:** `bun test <file> --coverage --coverage-reporter=lcov`, then grep `coverage/lcov.info` for `DA:<line>` (e.g. `grep "^DA:773" coverage/lcov.info`) to confirm specific lines are hit before pushing.
