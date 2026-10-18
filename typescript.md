# TypeScript (canon)

Decisions the configs cannot express.

- A narrowing `as` is fine where the module controls both the write and the read, or
  where a library type cannot express an invariant already established; suppress
  `typescript/no-unsafe-type-assertion` on that line. External input is parsed, never
  asserted. Do not add a guard, wrapper, or discriminator only to remove such an
  assertion; when callers keep repeating a cast, fix the boundary.
- Every `oxlint-disable` and every rule a project config turns off says why.
