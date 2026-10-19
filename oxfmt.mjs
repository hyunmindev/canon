/** Shared Oxfmt baseline. Spread it into a project's oxfmt.config.ts. */
export default {
  jsdoc: true,
  // perfectionist/sort-imports in oxlint owns import order.
  sortImports: false,
  sortPackageJson: { sortScripts: true },
};
