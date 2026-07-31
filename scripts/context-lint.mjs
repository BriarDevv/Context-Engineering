#!/usr/bin/env node
// context-lint — mechanical checks for the context-engineering standard.
// Automates the countable subset of skills/context-audit: budgets, per-tool
// adapters, read orders, block structure, broken local links, docs naming,
// skill hygiene, and static command drift. Judgment checks (inferable
// content, rules-vs-taste) remain in the context-audit skill.
// A CLAUDE.md titled "# Global instructions" is checked against the
// global-layer canon (≤40 lines, free-form sections) instead of the repo one.
//
// Usage: node scripts/context-lint.mjs [path] [options]
//   --budget N     root CLAUDE.md target lines (default 60)
//   --cap N        root CLAUDE.md hard cap (default 100)
//   --ignore a,b   extra dir names to skip (any depth); defaults always
//                  skipped: node_modules .git .next dist build coverage
//   --json         machine-readable output
//
// Line counts are raw file lines, blanks included, trailing newline ignored.
// Exit code: 1 when any high or medium finding, 0 otherwise.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { generate, parseDesignMd } from "./design-md-gen.mjs";

// ---------- args ----------
const argv = process.argv.slice(2);
let root = ".";
// Budget defaults mirror reference/claude-md.md — change both together.
let budget = 60;
let cap = 100;
let json = false;
const ignore = new Set(["node_modules", ".git", ".next", "dist", "build", "coverage"]);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--budget") budget = Number(argv[++i]);
  else if (a === "--cap") cap = Number(argv[++i]);
  else if (a === "--ignore") argv[++i].split(",").forEach((d) => ignore.add(d.trim()));
  else if (a === "--json") json = true;
  else root = a;
}
root = resolve(root);
if (!existsSync(root)) {
  console.error(`context-lint: path not found: ${root}`);
  process.exit(2);
}

// ---------- walk ----------
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(root, full).replaceAll("\\", "/");
    if (rel.split("/").some((seg) => ignore.has(seg))) continue;
    if (statSync(full).isDirectory()) walk(full);
    else files.push(rel);
  }
})(root);

const findings = [];
const add = (severity, code, file, message) => findings.push({ severity, code, file, message });
const read = (rel) => readFileSync(join(root, rel), "utf8");
const fileLines = (rel) => read(rel).split(/\r?\n/);
const rawCount = (rel) => {
  const l = fileLines(rel);
  return l.at(-1) === "" ? l.length - 1 : l.length;
};

// ---------- per-tool adapters ----------
const ADAPTERS = new Set([
  "CODEX.md", "GEMINI.md", "CURSOR.md", "COPILOT.md", "CLINE.md", "WINDSURF.md",
  ".cursorrules", ".windsurfrules", ".clinerules",
]);
for (const f of files) {
  if (ADAPTERS.has(basename(f)))
    add("high", "adapter", f, "per-tool adapter file — one minimal AGENTS.md replaces these");
}

// ---------- CLAUDE.md budgets ----------
// A CLAUDE.md titled "# Global instructions" is the global layer (~/.claude):
// its canon is ≤40 lines with free-form sections (reference/global-vs-repo.md),
// not the repo 4-block structure.
const claudes = files.filter((f) => basename(f) === "CLAUDE.md");
const globals = new Set(claudes.filter((f) => fileLines(f)[0]?.trim() === "# Global instructions"));
for (const f of claudes) {
  const n = rawCount(f);
  if (globals.has(f)) {
    if (n > 40) add("medium", "budget", f, `${n} lines — global CLAUDE.md cap is 40`);
  } else if (f === "CLAUDE.md") {
    if (n > cap) add("high", "budget-cap", f, `${n} lines — over the hard cap (${cap})`);
    else if (n > budget) add("medium", "budget", f, `${n} lines — over target (${budget})`);
  } else {
    if (n > 60) add("high", "budget-cap", f, `${n} lines — nested CLAUDE.md far over the per-app cap (30)`);
    else if (n > 30) add("medium", "budget", f, `${n} lines — over the per-app cap (30)`);
  }
}

// ---------- AGENTS.md ----------
const agents = files.filter((f) => basename(f) === "AGENTS.md");
for (const f of agents) {
  if (f !== "AGENTS.md")
    add("medium", "per-app-agents", f, "per-app AGENTS.md — use a per-app CLAUDE.md (≤30 lines) instead");
  const n = rawCount(f);
  if (n > 40) add("high", "agents-size", f, `${n} lines — AGENTS.md is an entry point, not a contract (~12)`);
  else if (n > 15) add("medium", "agents-size", f, `${n} lines — target ~12`);
}

// ---------- read orders ----------
const READ_ORDER = [
  /\bread\b[^.\n]{0,50}\bbefore\b/i,
  /\bbefore (doing|starting|touching) anything\b/i,
  /\b(must|always) read\b/i,
  /\bstart by reading\b/i,
  /\bfirst,? read\b/i,
];
for (const f of [...claudes, ...agents]) {
  fileLines(f).forEach((line, i) => {
    if (READ_ORDER.some((re) => re.test(line)))
      add("high", "read-order", `${f}:${i + 1}`, `mandatory read order: "${line.trim().slice(0, 60)}"`);
  });
}

// ---------- block structure ----------
const CANON = ["Commands", "Gotchas", "Hard constraints", "Map"];
for (const f of claudes.filter((f) => !globals.has(f))) {
  const h2 = fileLines(f)
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3).trim());
  for (const u of h2.filter((h) => !CANON.includes(h)))
    add("low", "structure", f, `non-canonical section "## ${u}"`);
  const known = h2.filter((h) => CANON.includes(h));
  const sorted = [...known].sort((a, b) => CANON.indexOf(a) - CANON.indexOf(b));
  if (known.join() !== sorted.join()) add("low", "structure", f, "canonical sections out of order");
}

// ---------- broken local links ----------
for (const f of files.filter((f) => /(^|\/)(CLAUDE|AGENTS|README)\.md$/.test(f))) {
  for (const m of read(f).matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    if (!existsSync(join(root, dirname(f), target.split("#")[0])))
      add("medium", "broken-link", f, `link target missing: ${target}`);
  }
}

// ---------- docs index + naming ----------
if (files.some((f) => f.startsWith("docs/")) && !files.includes("docs/README.md"))
  add("low", "docs-index", "docs/", "docs/ has no README.md index");
for (const f of files) {
  if (/^docs\/adrs\/(?!README\.md$)/.test(f) && !/^docs\/adrs\/ADR-\d{3}-[a-z0-9-]+\.md$/.test(f))
    add("low", "naming", f, "expected ADR-NNN-<topic>.md");
  if (/^docs\/specs\/(?!README\.md$)/.test(f) && !/^docs\/specs\/SPEC-[A-Za-z0-9-]+\.md$/.test(f))
    add("low", "naming", f, "expected SPEC-<feature>.md");
}

// ---------- skills ----------
for (const f of files.filter((f) => basename(f) === "SKILL.md")) {
  const n = rawCount(f);
  if (n >= 500) add("medium", "skill-size", f, `${n} lines — SKILL.md must stay <500`);
  if (!/^---[\s\S]{0,400}?\bdescription:/.test(read(f)))
    add("medium", "skill-frontmatter", f, "missing frontmatter description (what + when)");
}

// ---------- DESIGN.md checks (reference/design-md.md) ----------
const DESIGN_SECTIONS = ["Overview", "Colors", "Typography", "Layout", "Elevation & Depth", "Shapes", "Components", "Do's and Don'ts"];
for (const f of files.filter((f) => basename(f) === "DESIGN.md")) {
  const parsed = parseDesignMd(read(f));
  const fm = parsed.frontmatter;
  const refErrors = parsed.errors.filter((e) => e.includes("reference"));
  if (parsed.errors.length > refErrors.length || !fm.name)
    add("medium", "design-frontmatter", f, "frontmatter missing/unparseable or lacks `name`");
  for (const e of refErrors) add("medium", "design-ref", f, e);
  const knownIdx = parsed.sections.filter((s) => DESIGN_SECTIONS.includes(s.title)).map((s) => DESIGN_SECTIONS.indexOf(s.title));
  if (knownIdx.some((v, i) => i > 0 && v < knownIdx[i - 1]))
    add("low", "design-sections", f, "known sections out of spec order");
  const titles = parsed.sections.map((s) => s.title);
  for (const dup of new Set(titles.filter((t, i) => titles.indexOf(t) !== i)))
    add("high", "design-sections", f, `duplicate section "## ${dup}"`);
  for (const d of parsed.decisions)
    if (!/^- \d{4}-\d{2}-\d{2} — /.test(d.text))
      add("medium", "design-decisions", `${f}:${d.lineNo}`, "Decisions entry without a leading YYYY-MM-DD date");
  const genRel = join(dirname(f), "design.tokens.css").replaceAll("\\", "/");
  const hasTokens = ["colors", "typography", "spacing", "rounded", "components"].some((g) => fm[g] && Object.keys(fm[g]).length);
  if (!files.includes(genRel)) {
    if (hasTokens) add("medium", "design-ungenerated", f, "frontmatter has tokens but no adjacent design.tokens.css");
  } else if (!parsed.errors.length) {
    const genText = read(genRel);
    const m = genText.match(/GENERATED from DESIGN\.md \(target: (\w+)\)/);
    let fresh = null;
    try { fresh = m ? generate(fm, m[1]) : null; } catch { /* unknown target */ }
    const norm = (s) => s.replaceAll("\r\n", "\n");
    if (!fresh) add("high", "design-drift", genRel, "missing or unknown GENERATED header target");
    else if (norm(fresh) !== norm(genText))
      add("high", "design-drift", genRel, "design.tokens.css differs from a fresh generation — regenerate");
  }
}

// ---------- static command drift (root CLAUDE.md, ## Commands) ----------
if (files.includes("CLAUDE.md")) {
  const ls = fileLines("CLAUDE.md");
  const start = ls.findIndex((l) => l.trim() === "## Commands");
  if (start !== -1) {
    let end = ls.findIndex((l, i) => i > start && l.startsWith("## "));
    if (end === -1) end = ls.length;
    const pkg = files.includes("package.json") ? JSON.parse(read("package.json")) : null;
    const deps = pkg ? { ...pkg.dependencies, ...pkg.devDependencies } : {};
    const COMPOSE = ["docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"];
    for (let i = start; i < end; i++) {
      for (const m of ls[i].matchAll(/`([^`]+)`/g)) {
        const cmd = m[1].trim();
        const at = `CLAUDE.md:${i + 1}`;
        let mm;
        if ((mm = cmd.match(/^(?:npm|pnpm|yarn|bun) run (\S+)/))) {
          if (!pkg) add("medium", "cmd-drift", at, `"${cmd}" but repo has no package.json`);
          else if (!pkg.scripts?.[mm[1]]) add("medium", "cmd-drift", at, `npm script "${mm[1]}" not in package.json`);
        } else if ((mm = cmd.match(/^(?:npm|pnpm|yarn|bun) (test|start)\b/))) {
          if (!pkg?.scripts?.[mm[1]]) add("medium", "cmd-drift", at, `npm script "${mm[1]}" not in package.json`);
        } else if ((mm = cmd.match(/^npx (\S+)/))) {
          if (pkg && !deps[mm[1]] && !Object.keys(deps).some((d) => d.endsWith(`/${mm[1]}`)))
            add("medium", "cmd-drift", at, `npx package "${mm[1]}" not in dependencies`);
        } else if ((mm = cmd.match(/^node (\S+)/))) {
          if (!existsSync(join(root, mm[1]))) add("medium", "cmd-drift", at, `file not found: ${mm[1]}`);
        } else if (/^docker compose\b/.test(cmd)) {
          if (!COMPOSE.some((c) => files.includes(c)))
            add("medium", "cmd-drift", at, "no compose file in repo root");
        }
      }
    }
  }
}

// ---------- report ----------
const order = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file));
const count = (s) => findings.filter((f) => f.severity === s).length;
const fail = count("high") + count("medium") > 0;
if (json) {
  console.log(JSON.stringify({ root, findings, fail }, null, 2));
} else {
  console.log(`context-lint ${root}`);
  for (const f of findings)
    console.log(`  ${f.severity.toUpperCase().padEnd(6)} ${f.file}  ${f.message}  [${f.code}]`);
  console.log(`${count("high")} high, ${count("medium")} medium, ${count("low")} low — ${fail ? "FAIL" : "PASS"}`);
}
process.exit(fail ? 1 : 0);
