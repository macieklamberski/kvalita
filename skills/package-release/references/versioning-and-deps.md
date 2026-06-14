# Versioning & prerelease dependencies

## Prerelease ladder

`alpha < beta < rc` < GA. semver compares prerelease identifiers alphabetically, so the channel names sort in maturity order. The old `next` channel is **deprecated** — it sorted between `beta` and `rc` and blocked progression; kvalita ≥ 1.14.0 adds `rc` and keeps `next` only for transitional support.

## The semver precedence trap (renaming a channel)

`2.0.0-beta.N < 2.0.0-next.M` alphabetically. So if a package's prerelease branch is renamed `next` → `beta`, a caret range like `^2.0.0-beta.1` resolves to the **already-published** `2.0.0-next.*` versions, not the new betas.

- **Consumers must exact-pin** the dependency (`"2.0.0-beta.N"`, no caret) until the `2.0.0` GA ships.
- **Peer ranges** can stay `^2.0.0-beta.1` (they only need to be satisfiable); only top-level resolution needs the exact pin.

## Breaking changes within a pre-GA major

Inside a pre-GA `2.x` beta line, breaking changes are allowed freely with **no** back-compat shims or re-exports (e.g. drop a removed export outright rather than re-exporting it).

## Peer-dependency floors

When choosing `peerDependencies` ranges, pin to `^X.0.0` of the **major the package itself develops against** (check its own `devDependencies`), not the historical minimum that technically works. Going lower implies a maintenance contract that isn't intended. Widen only when wider compatibility is explicitly wanted — flag the choice and ask (e.g. Biome pinned `^2.2.7` because the rules only need 2.2.7+ and the 2.x user spread is wide).

## Migration docs & changelogs

- Before adding a `v(N-1)→vN.md` migration doc, check whether `v(N-1)` actually shipped: `package.json` version, `git tag --sort=-v:refname | head`. A breaking rename inside an **unshipped** major is just part of that major — it goes in the existing `v(N-2)→v(N-1).md` (or none), not a new file.
- Changelogs / release summaries list only what actually **ships and is enabled end-to-end**, not everything in the git log. Verify a feature is on the shipping branch (`git branch --contains`, `git merge-base --is-ancestor`) and, for dependency-driven features, in the **installed** version (`node_modules/<pkg>` + the dep range), not just the library's repo HEAD.
