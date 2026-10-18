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
    "eslint/prefer-const": "error",

    // Biome's recommended set, from the style and restriction categories, which are pick lists.
    "eslint/default-case-last": "error",
    // `== null` is the null-or-undefined idiom.
    "eslint/eqeqeq": ["error", "always", { null: "ignore" }],
    "eslint/no-extra-label": "error",
    "eslint/no-label-var": "error",
    "eslint/no-labels": ["error", { allowLoop: true, allowSwitch: true }],
    "eslint/no-lone-blocks": "error",
    "eslint/no-nested-ternary": "error",
    "eslint/no-proto": "error",
    "eslint/no-regex-spaces": "error",
    "eslint/no-return-assign": "error",
    "eslint/no-script-url": "error",
    "eslint/no-sequences": "error",
    "eslint/no-template-curly-in-string": "error",
    "eslint/object-shorthand": "error",
    "eslint/operator-assignment": "error",
    "eslint/prefer-arrow-callback": "error",
    "eslint/prefer-exponentiation-operator": "error",
    "eslint/prefer-numeric-literals": "error",
    "eslint/prefer-regex-literals": "error",
    "eslint/prefer-rest-params": "error",
    "eslint/prefer-template": "error",
    // Autofix reorders keys; suppress it where key order is serialized output.
    "eslint/sort-keys": ["error", "asc", { caseSensitive: false, natural: true }],
    "typescript/adjacent-overload-signatures": "error",
    "typescript/consistent-type-imports": "error",
    "typescript/no-array-constructor": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-inferrable-types": "error",
    "typescript/no-invalid-void-type": "error",
    "typescript/prefer-function-type": "error",
    "unicorn/numeric-separators-style": "error",
    "unicorn/prefer-array-index-of": "error",
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-number-properties": "error",

    // Size and shape limits second-guess a capable model's own judgment.
    "eslint/max-classes-per-file": "off",
    "eslint/max-lines": "off",
    "eslint/max-lines-per-function": "off",
    "eslint/no-await-in-loop": "off",
    "import/max-dependencies": "off",
    // Spreading a record inside map is the immutable update the codebase wants.
    "oxc/no-map-spread": "off",
    // Conflicts with unicorn/no-useless-undefined; tsconfig noImplicitReturns covers missing returns.
    "typescript/consistent-return": "off",
    // Deep readonly across inferred schema and API parameters is not a blanket convention.
    "typescript/prefer-readonly-parameter-types": "off",
    // Untyped: flags BigNumber/Decimal toFixed(), where no argument means the exact value.
    "unicorn/require-number-to-fixed-digits-argument": "off",
    // Duplicates of typescript/require-await and unicorn/no-negated-condition.
    "eslint/require-await": "off",
    "eslint/no-negated-condition": "off",
  },
  overrides: [
    {
      files: ["*.config.{ts,mts,js,mjs}", "**/*.config.{ts,mts,js,mjs}"],
      rules: { "import/no-default-export": "off" },
    },
  ],
};
