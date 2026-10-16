/** Shared Oxlint baseline. Spread it into a project's oxlint.config.ts; `extends` drops categories and options. */
export default {
  plugins: ["typescript", "unicorn", "oxc", "import", "promise"],
  categories: {
    correctness: "error",
    suspicious: "error",
    pedantic: "error",
    perf: "error",
  },
  options: {
    typeAware: true,
    reportUnusedDisableDirectives: "error",
  },
  rules: {
    "typescript/no-unsafe-type-assertion": "error",
    "typescript/consistent-type-assertions": [
      "error",
      { assertionStyle: "as", objectLiteralTypeAssertions: "never", arrayLiteralTypeAssertions: "never" },
    ],
    "typescript/no-non-null-assertion": "error",
    "typescript/no-explicit-any": "error",
    "typescript/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
    "typescript/consistent-type-definitions": ["error", "interface"],
    "typescript/switch-exhaustiveness-check": "error",
    "import/extensions": ["error", "ignorePackages", { ts: "always", tsx: "always" }],
    "import/no-default-export": "error",

    // Pedantic rules that every adopting project turned off.
    "eslint/max-lines": "off",
    "eslint/max-lines-per-function": "off",
    "eslint/no-await-in-loop": "off",
    "import/max-dependencies": "off",
  },
  overrides: [
    {
      files: ["*.config.{ts,mts,js,mjs}", "**/*.config.{ts,mts,js,mjs}"],
      rules: { "import/no-default-export": "off" },
    },
  ],
};
