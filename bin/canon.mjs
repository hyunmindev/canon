#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import canonLint from "../oxlint.mjs";

const files = {
  "tsconfig.json": `{
  "extends": "@hyunmin/canon/tsconfig.json",
  "compilerOptions": { "types": ["bun"] }
}
`,
  "oxlint.config.ts": `import canon from "@hyunmin/canon/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  ...canon,
  rules: { ...canon.rules },
});
`,
  "oxfmt.config.ts": `import canon from "@hyunmin/canon/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig({ ...canon });
`,
};

const scripts = {
  typecheck: "tsc --noEmit",
  lint: "oxlint",
  "lint:fix": "oxlint --fix",
  fmt: "oxfmt",
  "fmt:check": "oxfmt --check",
};

// TypeScript 7 defaults, or implied by canon's verbatimModuleSyntax and strict.
const implied = {
  esModuleInterop: true,
  forceConsistentCasingInFileNames: true,
  isolatedModules: true,
  noPropertyAccessFromIndexSignature: false,
  noUncheckedSideEffectImports: true,
  useUnknownInCatchVariables: true,
};
// Reported twice when also on in tsconfig: oxlint's no-unused-vars covers both.
const overlapping = ["noUnusedLocals", "noUnusedParameters"];

const canonTsconfig = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../tsconfig.json"), "utf8"),
);

/** Strips comments and trailing commas so tsconfig-style JSONC parses. */
function parseJsonc(text) {
  const stripped = text.replaceAll(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (_, string) => string ?? "");
  return JSON.parse(stripped.replaceAll(/,(\s*[}\]])/g, "$1"));
}

const same = (a, b) => a !== undefined && JSON.stringify(a).toLowerCase() === JSON.stringify(b).toLowerCase();

function reportTsconfig(root) {
  const path = join(root, "tsconfig.json");
  if (!existsSync(path)) {
    return;
  }
  const options = parseJsonc(readFileSync(path, "utf8")).compilerOptions ?? {};
  for (const [name, value] of Object.entries(options)) {
    if (same(canonTsconfig.compilerOptions[name], value)) {
      console.log(`extra  tsconfig ${name} (canon sets the same value)`);
    } else if (name in implied && implied[name] === value) {
      console.log(`extra  tsconfig ${name} (already the effective value)`);
    } else if (overlapping.includes(name) && value === true) {
      console.log(`extra  tsconfig ${name} (oxlint no-unused-vars already reports it)`);
    }
  }
}

function reportOxlint(root) {
  const path = join(root, "oxlint.config.ts");
  if (!existsSync(path)) {
    return;
  }
  const text = readFileSync(path, "utf8");
  const bare = (rule) => rule.replace(/^eslint\//, "");
  for (const rule of Object.keys(canonLint.rules)) {
    if (new RegExp(`["']((eslint/)?${bare(rule)})["']\\s*:`).test(text)) {
      console.log(`extra  oxlint ${rule} (canon sets it; drop unless the project deliberately differs)`);
    }
  }
}

const replaced = [".oxlintrc.json", ".oxlintrc.jsonc", ".oxfmtrc.json", ".oxfmtrc.jsonc", "biome.json", "biome.jsonc"];

function init(root, force) {
  for (const [name, content] of Object.entries(files)) {
    const path = join(root, name);
    if (existsSync(path) && !force) {
      console.log(`skip   ${name} (exists; merge canon by hand or pass --force)`);
    } else {
      writeFileSync(path, content);
      console.log(`write  ${name}`);
    }
  }

  const manifestPath = join(root, "package.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.scripts ??= {};
  for (const [name, command] of Object.entries(scripts)) {
    if (manifest.scripts[name] === undefined) {
      manifest.scripts[name] = command;
      console.log(`script ${name}`);
    } else if (manifest.scripts[name] !== command) {
      console.log(`skip   script ${name} (exists: ${manifest.scripts[name]})`);
    }
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, undefined, 2)}\n`);

  reportTsconfig(root);
  reportOxlint(root);

  for (const name of replaced.filter((file) => existsSync(join(root, file)))) {
    console.log(`legacy ${name} (fold project-specific settings into the canon config, then delete)`);
  }
}

const [command, ...flags] = process.argv.slice(2);
if (command === "init") {
  init(process.cwd(), flags.includes("--force"));
} else {
  console.error("usage: canon init [--force]");
  process.exitCode = 1;
}
