# canon

Shared baseline for personal Bun/TypeScript projects: `tsconfig.json`, `oxlint.mjs`,
`oxfmt.mjs`, the conventions in `typescript.md`, the `canon init` CLI, and the `canon`
skill in `skill/` (linked from `~/.agents/skills/canon` and `~/.claude/skills/canon`).

- Never name or special-case an adopting project here. A project-specific need belongs in
  that project's own config or AGENTS.md.
- Only write rules a current model would not follow by default; delete anything the
  configs already enforce.
- Configs ship as `.mjs` plus `.d.mts`, not `.ts`: they are loaded from `node_modules`.
- Verify a change by packing (`bun pm pack`) and installing into a scratch project, then
  tag a release. Adopting repositories update by bumping their pinned tag.
