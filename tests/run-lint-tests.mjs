#!/usr/bin/env node
// Runs context-lint against the fixtures and the clean example, asserting
// expected finding codes and pass/fail per case. Zero deps.
// Usage: node tests/run-lint-tests.mjs

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const lint = join(here, "..", "scripts", "context-lint.mjs");

const cases = [
  {
    name: "clean example passes",
    path: join(here, "..", "examples", "nextjs-ecommerce"),
    fail: false,
    expect: [],
    forbid: ["adapter", "read-order", "cmd-drift", "budget-cap", "budget", "broken-link", "agents-size"],
  },
  {
    name: "bloated CLAUDE.md fails",
    path: join(here, "fixtures", "bloated"),
    fail: true,
    expect: ["budget-cap", "cmd-drift", "structure"],
  },
  {
    name: "per-tool adapters fail",
    path: join(here, "fixtures", "adapters"),
    fail: true,
    expect: ["adapter", "agents-size"],
  },
  {
    name: "read order + broken link fail",
    path: join(here, "fixtures", "read-order"),
    fail: true,
    expect: ["read-order", "broken-link"],
  },
  {
    name: "global-layer CLAUDE.md passes its own canon",
    path: join(here, "fixtures", "global-layer"),
    fail: false,
    expect: [],
    forbid: ["budget", "budget-cap", "structure"],
  },
];

let failed = 0;
for (const c of cases) {
  const r = spawnSync(process.execPath, [lint, c.path, "--json"], { encoding: "utf8" });
  let out;
  try {
    out = JSON.parse(r.stdout);
  } catch {
    failed++;
    console.log(`FAIL ${c.name}\n  lint did not emit JSON (exit ${r.status}):\n  ${r.stderr || r.stdout}`);
    continue;
  }
  const codes = new Set(out.findings.map((f) => f.code));
  const problems = [];
  if (out.fail !== c.fail) problems.push(`expected fail=${c.fail}, got ${out.fail}`);
  for (const e of c.expect) if (!codes.has(e)) problems.push(`missing expected finding "${e}"`);
  for (const e of c.forbid ?? []) if (codes.has(e)) problems.push(`unexpected finding "${e}"`);
  if (problems.length) {
    failed++;
    console.log(`FAIL ${c.name}\n  ${problems.join("\n  ")}`);
  } else {
    console.log(`ok   ${c.name}`);
  }
}
console.log(failed ? `${failed}/${cases.length} cases failed` : `all ${cases.length} cases passed`);
process.exit(failed ? 1 : 0);
