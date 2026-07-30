# Context-Engineering System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Context-Engineering repo: distilled reference, replicable per-repo skeleton templates, the `context-init` and `context-audit` skills (eval-first), and the global-layer content (global CLAUDE.md + OMC decision ADR).

**Architecture:** A source-of-truth repo whose two skills replicate and enforce an Anthropic-2026 context standard across repos. Skills load short reference distillations progressively; templates carry the skeleton; `global/` holds canonical global-layer content applied later via the workstation installer.

**Tech Stack:** Markdown + Claude Code skill format (SKILL.md with YAML frontmatter). No build system. Git for versioning.

## Global Constraints

- All context files in technical English (chat with user in rioplatense Spanish — global rule, not per-file).
- CLAUDE.md targets: repo ≤60 lines (hard cap 100); per-app ≤30; global ≤40.
- SKILL.md body <500 lines; references exactly one level deep from SKILL.md; forward slashes in all paths.
- Skill `description`: third person, states what it does AND when to use it (triggers), ≤1024 chars. Skill `name`: lowercase-hyphen.
- Evals written BEFORE skill content (3 per skill, `skills/<name>/evals/eval-NN.md`).
- Reference files: distillations with source + date cited at top; ≤120 lines each.
- Naming: `ADR-NNN-<topic>.md`, `SPEC-<feature>.md`, `eval-NN.md`.
- Every commit: conventional commit + Co-Authored-By Claude Fable 5 + Claude-Session trailer.
- Phase 3 (installing skills into ~/.claude, migrating real repos, applying global layer, uninstalling OMC pieces) is OUT of this plan — requires explicit user approval.
- Spec: `docs/specs/SPEC-context-engineering-system.md` (committed, 46cd482). On any conflict, spec wins.

---

### Task 1: Repo hygiene + root context files

**Files:**
- Create: `.gitattributes`, `.gitignore`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `CONTRIBUTING.md`

**Interfaces:**
- Produces: the repo's own exemplar context files; later tasks' templates must match this style. Line budget check used again in Task 8.

- [ ] **Step 1: Write `.gitattributes` and `.gitignore`**

`.gitattributes` (fixes the CRLF warning seen on first commit):
```
* text=auto eol=lf
```

`.gitignore`:
```
.omc/
*.local.*
```

- [ ] **Step 2: Write `CLAUDE.md`** (exemplar; must be ≤60 lines)

```markdown
# Context-Engineering

Source of truth for the context-engineering standard applied to all repos:
distilled Anthropic guidance (`reference/`), per-repo skeleton (`templates/`),
the skills that replicate it (`skills/`), and canonical global-layer content
(`global/`). Everything here must itself pass `context-audit` (dogfooding).

## Commands

No build. Verification = run the context-audit checklist against this repo
(see `skills/context-audit/SKILL.md`).

## Gotchas

- `reference/` files are distillations with source+date headers — refresh them
  from the cited sources when Anthropic publishes new guidance; never let them
  grow past ~120 lines.
- `templates/` files use `{{PLACEHOLDER}}` markers; they are instantiated by
  `context-init`, never copied verbatim.
- `global/` is content only. It is applied to `~/.claude` by the `workstation`
  repo installer — never edit `~/.claude` directly from here.

## Hard constraints

- Skills in `skills/` ship with 3 evals each; evals change BEFORE skill content.
- Nothing in this repo may violate the standard it defines (budgets, naming,
  one-level references).

## Map

- Standard definition: `reference/`
- What gets installed in a repo: `templates/`
- Replication mechanism: `skills/context-init/`, `skills/context-audit/`
- Global layer content: `global/`
```

- [ ] **Step 3: Write `AGENTS.md`**

```markdown
# Context-Engineering

Source-of-truth repo for mateo's context-engineering standard: reference
distillations, per-repo skeleton templates, and the Claude Code skills that
replicate them. Markdown only; no build or test commands.

Claude Code is the primary tool for this repo. Full context: `CLAUDE.md`.
Start at `README.md` for a human overview.
```

- [ ] **Step 4: Write `README.md`**

Content requirements (human-facing, ~60-80 lines): what the system is (one paragraph, the six-shifts paradigm in two sentences); the repo layout table (one line per top dir); how to use it (run `/context-init` in a target repo; run `/context-audit` to check compliance); how the global layer flows (Context-Engineering → workstation installer → `~/.claude`); grounding sources (the three URLs from the spec); status section (phases, what's done).

- [ ] **Step 5: Write `CONTRIBUTING.md`** (dogfooding the community pack, ~25 lines)

Content: solo-maintained repo; branch from `main`, conventional commits; every change to `reference/` must cite its source; every change to `skills/` must keep evals passing (manual run); templates changes require re-running the Task 8 dogfooding gate.

- [ ] **Step 6: Verify budgets**

Run: `wc -l CLAUDE.md AGENTS.md`
Expected: CLAUDE.md ≤60, AGENTS.md ≤12.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add repo hygiene and exemplar root context files"
```

### Task 2: reference/principles.md + reference/claude-md.md

**Files:**
- Create: `reference/principles.md`, `reference/claude-md.md`

**Interfaces:**
- Produces: the normative core both skills cite. `context-audit`'s checklist (Task 6) derives every check from these two files — each rule stated here must be checkable.

- [ ] **Step 1: Write `reference/principles.md`** (≤120 lines)

Header: sources = claude.com/blog "The new rules of context engineering for Claude 5 generation models" (2026-07-24); anthropic.com/engineering "Effective context engineering for AI agents". Retrieved 2026-07-30.

Must contain, as short normative sections: (1) attention budget — smallest set of high-signal tokens; context is a finite public good. (2) The six shifts, each as one "then → now" line pair: rules→judgment, examples→interface design, upfront→progressive disclosure, duplicated instructions→single source in tool/skill definitions, manual memory→auto-memory, prose specs→rich references (tests/mockups/rubrics). (3) Right altitude — specific enough to guide, flexible enough for heuristics; hard rules reserved for genuine safety. (4) Just-in-time retrieval — folder hierarchy and naming as signals; no mandatory read orders. (5) Sub-agents/compaction/note-taking one-liners (when long-horizon work appears). (6) "Claude is already smart" test: challenge every line — can the model infer this from the filesystem?

- [ ] **Step 2: Write `reference/claude-md.md`** (≤120 lines)

Must contain: the 4-block CLAUDE.md structure + optional Map (copy exact block spec from the spec file, "The per-repo skeleton" section); line budgets (60/100/30/40); what belongs in each block with one good + one bad example per block; the anti-pattern catalog labeled "legacy (Ynara-style)": per-tool adapters, mandatory read orders, rule lists restating common sense, prose conventions docs, listing repo skills inside CLAUDE.md (duplication — descriptions auto-load); monorepo variant rule (per-app CLAUDE.md ≤30 lines, commands+gotchas only).

- [ ] **Step 3: Verify** — `wc -l reference/*.md` all ≤120; each file's first 5 lines cite source + retrieval date.

- [ ] **Step 4: Commit** — `git commit -m "feat: add core reference distillations (principles, claude-md)"`

### Task 3: reference/skills.md + reference/agents.md + reference/global-vs-repo.md

**Files:**
- Create: `reference/skills.md`, `reference/agents.md`, `reference/global-vs-repo.md`

**Interfaces:**
- Produces: authoring rules consumed by Task 6/7 SKILL.md files and by `context-audit` checks on skills.

- [ ] **Step 1: Write `reference/skills.md`** (≤120 lines)

Source: platform.claude.com/docs skill authoring best practices, retrieved 2026-07-30. Must contain: frontmatter rules (name ≤64 lowercase-hyphen, description ≤1024 third-person what+when); conciseness ("Claude is already smart" — only non-inferable content); SKILL.md <500 lines; progressive disclosure patterns (overview→references, domain split, conditional details); one-level-deep references; TOC for reference files >100 lines; degrees of freedom ladder (high=text heuristics, medium=pseudocode/templates, low=exact scripts) with the bridge/field analogy; workflow checklists + feedback loops (validate→fix→repeat); eval-driven development (3 evals before content, eval = query + expected-behavior checklist); anti-patterns (Windows paths, too many options, time-sensitive info, deep nesting).

- [ ] **Step 2: Write `reference/agents.md`** (≤100 lines)

Must contain: decision rule for custom agents — create one only when (a) a recurring role needs a distinct system prompt/tool restriction that skills can't express, AND (b) no native agent type covers it; prefer native subagents + skills first; sub-agent architecture principle (isolated context, condensed return); inventory pointer: custom agents live in `~/.claude/agents/*.md` (global) or `.claude/agents/` (repo); note that OMC currently populates the global set and its fate is decided in `global/OMC-DECISION.md`.

- [ ] **Step 3: Write `reference/global-vs-repo.md`** (≤80 lines)

Must contain the placement criterion: global (`~/.claude`) = facts about the USER and how they work everywhere (tone/language, cross-project safety, universal preferences) + skills usable from any repo; repo = facts about the PROJECT (commands, gotchas, constraints, project workflows); auto-memory handles session-learned facts — never hand-write memory content into CLAUDE.md; duplication test: if the same line would appear in >1 repo's CLAUDE.md, it belongs global (or nowhere); if it only matters to one project, it never goes global.

- [ ] **Step 4: Verify** — budgets + source headers as in Task 2. Commit: `git commit -m "feat: add skills, agents, and global-vs-repo reference distillations"`

### Task 4: templates/repo/ (base skeleton)

**Files:**
- Create: `templates/repo/CLAUDE.md.template`, `templates/repo/AGENTS.md.template`, `templates/repo/docs/README.md.template`, `templates/repo/docs/adrs/ADR-template.md`, `templates/repo/docs/specs/SPEC-template.md`

**Interfaces:**
- Consumes: block structure from `reference/claude-md.md` (Task 2).
- Produces: `{{PLACEHOLDER}}`-marked templates instantiated by `context-init` (Task 7). Placeholder names used verbatim there: `{{REPO_NAME}}`, `{{REPO_SUMMARY}}`, `{{STACK}}`, `{{COMMANDS}}`, `{{GOTCHAS}}`, `{{HARD_CONSTRAINTS}}`, `{{MAP}}`.

- [ ] **Step 1: Write `CLAUDE.md.template`**

```markdown
# {{REPO_NAME}}

{{REPO_SUMMARY}}
<!-- 2-3 lines: what + stack. Nothing the filesystem already says. -->

## Commands

{{COMMANDS}}
<!-- build / test / run / lint. Only ones that matter. VERIFIED by running them. -->

## Gotchas

{{GOTCHAS}}
<!-- Only non-inferable facts. If Claude could discover it by reading code, delete it. -->

## Hard constraints

{{HARD_CONSTRAINTS}}
<!-- Only genuine safety rules. If violating it doesn't hurt, it doesn't belong here. -->

## Map

{{MAP}}
<!-- OPTIONAL, ≤8 lines, only non-obvious locations. Delete section if nothing qualifies. -->
```

- [ ] **Step 2: Write `AGENTS.md.template`**

```markdown
# {{REPO_NAME}}

{{REPO_SUMMARY}}

Core commands:
{{COMMANDS}}

Claude Code is the primary tool for this repo; the maintained context file is
`CLAUDE.md`. This file exists as a minimal entry point for other AI tools.
```

- [ ] **Step 3: Write `docs/README.md.template`** — title + one-line-per-area table with the two prescribed rows (`adrs/` — architecture decisions; `specs/` — feature specs with rich references) + comment instructing to add one line per additional area, never content.

- [ ] **Step 4: Write `ADR-template.md`** (lightweight MADR): Title `# ADR-{{NNN}}: {{TITLE}}`; fields Date / Status (Proposed|Accepted|Superseded by ADR-NNN); sections Context (3-6 lines), Decision (imperative, 1-3 lines), Consequences (bullets, includes what becomes easier/harder), Alternatives considered (one line each with rejection reason).

- [ ] **Step 5: Write `SPEC-template.md`**: Title `# SPEC: {{FEATURE}}`; Date/Status; Purpose (≤5 lines); Rich references section FIRST (links to defining tests, mockups/HTML artifacts, rubrics — with instruction "prefer executable/inspectable references over prose"); Requirements (numbered, testable); Out of scope.

- [ ] **Step 6: Commit** — `git commit -m "feat: add base repo skeleton templates"`

### Task 5: templates/monorepo/ + templates/community/

**Files:**
- Create: `templates/monorepo/app-CLAUDE.md.template`, `templates/community/LICENSE-MIT.template`, `templates/community/SECURITY.md.template`, `templates/community/CONTRIBUTING.md.template`, `templates/community/CODE_OF_CONDUCT.md.template`, `templates/community/.github/ISSUE_TEMPLATE/bug_report.md`, `templates/community/.github/ISSUE_TEMPLATE/feature_request.md`, `templates/community/.github/PULL_REQUEST_TEMPLATE.md`, `templates/community/CODEOWNERS.template`, `templates/community/MATRIX.md`

**Interfaces:**
- Consumes: profile matrix from spec ("Community-health matrix").
- Produces: `MATRIX.md` — the machine-readable profile→files table `context-init` reads to decide what to instantiate.

- [ ] **Step 1: Write `app-CLAUDE.md.template`** — same 4 blocks as repo template minus Map, header comment: "Per-app context, ≤30 lines. Only THIS app's commands and gotchas. Root CLAUDE.md covers everything shared."

- [ ] **Step 2: Write community files** — LICENSE-MIT with `{{YEAR}}`/`{{OWNER}}`; SECURITY.md (~15 lines: private disclosure via `{{SECURITY_CONTACT}}`, response expectation, no hall-of-fame boilerplate); CONTRIBUTING.md.template (~30 lines: branch-from-main, conventional commits, what runs before PR = `{{PR_GATE}}`, merge strategy `{{MERGE_STRATEGY}}`); CODE_OF_CONDUCT (Contributor Covenant 2.1 short adoption: link + enforcement contact `{{CONDUCT_CONTACT}}`); bug_report (repro/expected/actual/env), feature_request (problem/proposal/alternatives), PR template (what/why/how-verified checklist); CODEOWNERS (`* {{DEFAULT_OWNER}}`).

- [ ] **Step 3: Write `MATRIX.md`** — copy the profile matrix table from the spec verbatim (personal / public OSS / team rows), plus one line: "context-init asks the profile once and instantiates exactly this set."

- [ ] **Step 4: Commit** — `git commit -m "feat: add monorepo and community-health templates"`

### Task 6: context-audit skill (evals first)

**Files:**
- Create: `skills/context-audit/evals/eval-01.md`, `eval-02.md`, `eval-03.md`, `skills/context-audit/SKILL.md`, `skills/context-audit/references/checklist.md`

**Interfaces:**
- Consumes: rules from `reference/principles.md`, `reference/claude-md.md`, `reference/skills.md`.
- Produces: the audit checklist + report format `context-init` (Task 7) invokes as its final gate, and Task 8 runs against this repo. Report format: `## Context audit: <repo>` + score `N/10` + findings table (severity | file | finding | fix), most severe first.

- [ ] **Step 1: Write the 3 evals** (before SKILL.md — hard constraint). Format per eval: `## Query` (the user request verbatim) + `## Expected behavior` (checklist).
  - eval-01: query "Run a context audit on this repo" against a fixture description of a legacy repo (Ynara-shaped: adapters, read orders, 200-line AGENTS.md). Expected: flags adapters as duplication, flags read orders, flags rule-lists, proposes skill extraction for procedural prose, does NOT flag `docs/adrs/`, produces findings table with severities, changes nothing.
  - eval-02: query against a compliant repo (this repo). Expected: score ≥9/10, no false-positive findings on Map block or docs/README.md index, confirms budgets.
  - eval-03: query "audit and fix" on a repo with a 150-line CLAUDE.md full of inferable content. Expected: report first, then applies only the fixes listed, resulting CLAUDE.md ≤60 lines, no loss of genuine gotchas/hard constraints (they move, never disappear).

- [ ] **Step 2: Write `references/checklist.md`** — every check derived from reference files, each with: what to inspect, pass condition (exact numbers where they exist: 60/100/30/40/500 lines, one-level refs), severity (high = duplication, rules-as-common-sense, inferable content; medium = budgets exceeded, weak skill descriptions; low = naming drift). Include the dead-docs check (file unreferenced by any entrypoint/skill AND not a rich reference → flag).

- [ ] **Step 3: Write `SKILL.md`** (<200 lines). Frontmatter: `name: context-audit`; description: "Audits a repository's Claude context files (CLAUDE.md, AGENTS.md, skills, docs structure) against the context-engineering standard and reports a score with concrete fixes. Use when checking context quality, after context-init, when a repo's context feels bloated, or before migrating a repo to the new standard." Body: workflow checklist (1 read target repo context files; 2 load `references/checklist.md`; 3 evaluate each check; 4 emit report in the format above; 5 apply fixes ONLY if user asked — report-only is default), plus the report format spec.

- [ ] **Step 4: Verify** — description third-person + triggers; body <500 lines; refs one level deep. Manually walk eval-02 against this repo; fix skill (not eval) on mismatch.

- [ ] **Step 5: Commit** — `git commit -m "feat: add context-audit skill with evals"`

### Task 7: context-init skill (evals first)

**Files:**
- Create: `skills/context-init/evals/eval-01.md`, `eval-02.md`, `eval-03.md`, `skills/context-init/SKILL.md`, `skills/context-init/references/migration.md`

**Interfaces:**
- Consumes: templates + `{{PLACEHOLDER}}` names (Task 4/5), `MATRIX.md` (Task 5), `context-audit` as gate (Task 6).

- [ ] **Step 1: Write the 3 evals** (queries mirror Phase-3 pilots; all dry-run/report-only):
  - eval-01 (simple repo, KioscoDiagonal-shaped): Expected: explores first; asks profile question exactly once; asks gotcha interview (3-5 items); runs commands before writing them into CLAUDE.md; instantiates base skeleton only (no monorepo files, no speculative skills); final CLAUDE.md ≤60 lines; runs context-audit at end.
  - eval-02 (personal repo, Portafolio-shaped): Expected: community pack = README only (personal profile); no CONTRIBUTING/LICENSE created; docs/ created with README index + empty adrs/ specs/.
  - eval-03 (legacy monorepo, Ynara-shaped): Expected: produces migration plan BEFORE touching anything; plan keeps ADRs, distills rules→gotchas/hard constraints, deletes adapters + read orders, proposes (not creates) repo skills for procedural docs, per-app CLAUDE.md replaces per-app AGENTS.md; waits for approval of the plan.
- [ ] **Step 2: Write `references/migration.md`** — the legacy→new mapping table: AGENTS.md rule lists → distill (gotcha | hard constraint | delete); CODEX/GEMINI adapters → delete; read orders → delete (Map absorbs non-obvious locations); docs/conventions prose → linters or repo skill proposal; per-app AGENTS.md → per-app CLAUDE.md; ADRs/specs → keep as-is. Plus the rule: migration plan is ALWAYS presented before any mutation; keep a `git stash`-clean tree requirement before applying.

- [ ] **Step 3: Write `SKILL.md`** (<250 lines). Frontmatter: `name: context-init`; description: "Installs the context-engineering standard in a repository or migrates legacy context architectures (AGENTS.md contracts, per-tool adapters, read orders) to it. Use when setting up Claude context for a repo, when a repo lacks CLAUDE.md, or when modernizing an existing context setup." Body: the 6-step checklist workflow from the spec (explore → profile detection, ask only non-inferable → gotcha interview → verify commands by running → migration plan gate when legacy exists → instantiate from templates + run context-audit + report created/deleted). Reference `../../templates/` paths and `MATRIX.md` explicitly.

- [ ] **Step 4: Verify** — same checks as Task 6 Step 4; walk eval-01 mentally against KioscoDiagonal's real structure (read-only `ls`).

- [ ] **Step 5: Commit** — `git commit -m "feat: add context-init skill with evals"`

### Task 8: Dogfooding gate

**Files:**
- Modify: whatever the audit flags (expected: none or minor).

- [ ] **Step 1: Execute `skills/context-audit/SKILL.md` manually against this repo** — full checklist, produce the report in-session.
- [ ] **Step 2: Fix every finding of severity high/medium.** Re-run until score ≥9/10 with zero high findings.
- [ ] **Step 3: Record the final report** in `docs/adrs/ADR-001-dogfooding-gate.md` (Status: Accepted; Consequences: repo passes its own standard; report embedded).
- [ ] **Step 4: Commit** — `git commit -m "chore: pass dogfooding gate (context-audit on self)"`

### Task 9: global/CLAUDE.md

**Files:**
- Create: `global/CLAUDE.md`

**Interfaces:**
- Consumes: placement criterion from `reference/global-vs-repo.md`.
- Produces: canonical content the workstation installer will place at `~/.claude/CLAUDE.md` in Phase 3 (outside this plan). Must preserve an `OMC:START`/`OMC:END` compatibility note until OMC-DECISION resolves.

- [ ] **Step 1: Write it (≤40 lines).** Content: identity/tone (chat in rioplatense Spanish; all technical artifacts — code, commits, context files — in English); safety (never expose/commit credentials or populated .env; resolve exact targets before destructive ops; no success claims without running verification); working style (smallest coherent change; evidence over assumption; preserve unrelated dirty-worktree changes); one line: "Project specifics live in each repo's CLAUDE.md — never duplicate them here." Explicit note: procedural workflows belong in skills, not this file. Footer comment (non-content): current `~/.claude/CLAUDE.md` carries an OMC block between markers; installer must preserve it until `global/OMC-DECISION.md` is resolved and approved.

- [ ] **Step 2: Verify** — `wc -l global/CLAUDE.md` ≤40 (comment lines included).
- [ ] **Step 3: Commit** — `git commit -m "feat: add canonical global CLAUDE.md content"`

### Task 10: global/OMC-DECISION.md (evidence-based ADR) — STOP POINT

**Files:**
- Create: `global/OMC-DECISION.md`

- [ ] **Step 1: Gather evidence (read-only).** Inventory `~/.claude/agents/*.md` (19 OMC agents), `~/.claude/skills/` (OMC skill dirs), hooks in `~/.claude/settings.json`, and the OMC block in `~/.claude/CLAUDE.md`. For usage evidence: grep `~/.claude/history.jsonl` for OMC skill invocations (`autopilot`, `ralph`, `ultrawork`, `team`, `omc-`), count hits.

- [ ] **Step 2: Build the keep/drop/replace matrix.** For every component, three columns of evidence: (a) native-2026 duplicate? (compare against: native agent types available in-session, plugins already installed — superpowers, /doctor, auto-memory, native tasks/loop/schedule); (b) used? (history hit count); (c) paradigm conflict? (rule-heavy prompt injection, hook reminders). Verdict per row: keep / drop / replace-with-native.

- [ ] **Step 3: Write the ADR** in the Task 4 ADR format (`ADR` numbering local to global/: this is the OMC decision record, Status: Proposed). Decision section states the recommended end-state (expected shape: keep unique loop orchestration if used; drop agents duplicating native types; slim the CLAUDE.md block), the migration path, and the rollback (OMC reinstall via `omc setup --force-hooks` per existing memory note).

- [ ] **Step 4: Commit** — `git commit -m "docs: add evidence-based OMC decision ADR (proposed)"`

- [ ] **Step 5: STOP.** Present the ADR + full build report to the user. Phase 3 (any change to the live `~/.claude`, any repo migration) proceeds only on explicit approval.

## Self-review (done at write time)

Spec coverage: architecture→T1-5, skills→T6-7, dogfooding→T8, global→T9-10, verification→evals in T6/T7 + gate T8. Phase-3 items intentionally absent (out of scope per spec). Placeholders: none — every file has full content or exact content requirements with sources. Type consistency: `{{PLACEHOLDER}}` names match between T4 and T7; report format defined in T6 = format consumed in T7/T8; ADR template (T4) used by T8/T10.
