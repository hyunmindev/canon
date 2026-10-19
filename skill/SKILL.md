---
name: canon
description: Set up, adopt, or update @hyunmin/canon, the shared tsconfig, Oxlint, Oxfmt, and TypeScript conventions for personal Bun projects. Use when creating a new TypeScript project, migrating an existing personal repository onto canon, or bumping a repository's canon version. Do not add canon to a repository that does not already use it unless asked.
---

# canon

Source: `github:hyunmindev/canon`, local checkout `~/Workspaces/canon`. Releases are git
tags and each project pins one.

## New project

```bash
bun init -y
bun add -d github:hyunmindev/canon#<tag> oxlint oxlint-tsgolint typescript @types/bun
bun add -d --exact oxfmt     # formatter output changes between releases
bunx canon init --force   # replaces bun init's tsconfig.json
bun run fmt               # init output is not pre-sorted
```

`bun init` also writes a CLAUDE.md. While any CLAUDE.md exists, Claude Code skips
AGENTS.md, so delete it and keep project instructions in AGENTS.md with
`TypeScript conventions: @node_modules/@hyunmin/canon/typescript.md`. Claude Code expands
the import; other agents follow the path.

## Existing repository

- Type-aware rules need TypeScript 7. Upgrade first. A framework that type-checks through
  the TypeScript JS API at build time (Next.js) must be verified on 7 before switching.
- `canon init` never overwrites. Fold the project's real differences (framework plugins,
  ignore patterns, deliberate opt-outs with a reason) into the generated configs, then
  delete the legacy configs it lists.
- Cut the project's TypeScript doc down to rules canon does not own.
- Keep the migration commit free of runtime behaviour changes. Existing narrowing
  assertions get a reasoned suppression; fixing them is separate work.

## Updating canon

Commit and tag canon, then in each adopting repository
(`grep -l @hyunmin/canon ~/Workspaces/*/package.json`) edit the tag in package.json and
run `bun install` (`bun add` with a new git tag fails with DependencyLoop). Remove any
project override the new canon now provides, run the project's verification, and commit. Bump oxfmt in its own commit together
with `bun run fmt`.
