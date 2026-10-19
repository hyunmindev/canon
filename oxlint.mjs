import { fileURLToPath } from "node:url";

import perfectionist from "eslint-plugin-perfectionist";

/**
 * Shared Oxlint baseline. Spread it into a project's oxlint.config.ts: `extends` does not carry `env`,
 * `globals`, or `ignorePatterns`, and its option merging is undocumented.
 */
export default {
  plugins: ["typescript", "unicorn", "oxc", "import", "promise"],
  // Resolved here so adopting projects need not install the plugin themselves.
  jsPlugins: [fileURLToPath(import.meta.resolve("eslint-plugin-perfectionist"))],
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
    // All ordering (imports, keys, types, members) belongs to perfectionist; oxfmt does not sort imports.
    ...perfectionist.configs["recommended-natural"].rules,

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
    // The rule's own docs defer to tsconfig noImplicitReturns, which canon sets.
    "typescript/consistent-return": "off",
    // Bans the bare `return;` that noImplicitReturns needs once unicorn/no-useless-undefined forbids `return undefined`.
    "eslint/no-useless-return": "off",
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
      files: ["**/*.config.{ts,mts,js,mjs}"],
      rules: { "import/no-default-export": "off" },
    },
    {
      files: ["**/*.test.{ts,tsx}", "**/tests/**", "**/__tests__/**"],
      rules: {
        // bun-types declares `expect(p).rejects/resolves` matchers as void (oven-sh/bun#23420).
        "typescript/await-thenable": "off",
        "typescript/no-confusing-void-expression": "off",
        // Asymmetric matchers such as expect.any() are typed any.
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-assignment": "off",
        // Fakes are async to satisfy Promise-typed ports without awaiting.
        "typescript/require-await": "off",
      },
    },
  ],
};
