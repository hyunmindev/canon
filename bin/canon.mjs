#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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
