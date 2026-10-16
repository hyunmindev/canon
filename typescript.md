# TypeScript (canon)

Choices that `oxlint.mjs` and `tsconfig.json` cannot fully express. Anything those files
enforce is not repeated here.

- A narrowing `as` is allowed only where the module controls both the write and the read,
  or a library type cannot express an invariant already established. Suppress
  `typescript/no-unsafe-type-assertion` on that line with `-- <reason>`. External input
  is parsed, never asserted.
- Do not add a guard, wrapper, or propagated discriminator only to remove one justified
  assertion. When callers repeatedly need the same cast, fix the boundary instead.
- Every `oxlint-disable` and `@ts-expect-error` carries `-- <reason>`. A rule turned off
  in a project's `oxlint.config.ts` carries a comment saying why.
