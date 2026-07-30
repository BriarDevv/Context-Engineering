# SPEC: Context-Engineering System

Date: 2026-07-30
Status: Approved (design validated interactively; sections 3-5 finalized by delegated judgment)

## Purpose

A replicable context-engineering system for all of mateo's repos, built on Anthropic's
Claude 5-era guidance. It replaces the 2025-style architecture exemplified by the Ynara
repo (canonical AGENTS.md + per-tool adapters + mandatory read orders + rule lists) with
a Claude Code-first system based on judgment over rules, progressive disclosure, and
rich references.

Deliverable form: a source-of-truth repo (`Context-Engineering`) containing two skills
that replicate and enforce the standard, templates, and distilled reference material.

## Grounding sources

- The new rules of context engineering for Claude 5 generation models (claude.com/blog, 2026-07-24)
- Effective context engineering for AI agents (anthropic.com/engineering)
- Skill authoring best practices (platform.claude.com/docs)

Key principles adopted: six shifts (rules→judgment, examples→interfaces, upfront→progressive
disclosure, dedup into tool/skill definitions, manual memory→auto-memory, prose specs→rich
references); attention budget (smallest set of high-signal tokens); just-in-time retrieval
with folder/naming conventions as signals; SKILL.md < 500 lines, references one level deep,
third-person descriptions with triggers; evaluation-driven skill development.

## Decisions (fixed)

1. Deliverable: skeleton + installer skill. Replication = running `/context-init` in a
   target repo. No copy-paste process, no versioned sync tooling (YAGNI at 7 repos).
2. Scope: both layers designed together. Repo layer (skeleton) + global layer
   (`~/.claude` content + OMC decision). `Context-Engineering` owns *content*;
   the existing `workstation` repo remains the *installation mechanism*.
3. Claude Code-first. A minimal AGENTS.md is kept as cross-tool entry point.
   No CODEX.md/GEMINI.md adapters.
4. Language: all context files in technical English; chat with the user always in
   rioplatense Spanish (rule lives in global CLAUDE.md).
5. `Context-Engineering` is its own git repo at `C:\Briar\repos\mine\Context-Engineering`,
   separate from `workstation`.

## Architecture: the Context-Engineering repo

```
Context-Engineering/
├── CLAUDE.md            # Exemplar: must itself pass context-audit (dogfooding gate)
├── AGENTS.md            # Minimal cross-tool entry (~10 lines)
├── README.md            # Human entry point: what the system is, how to use it
├── CONTRIBUTING.md      # Dogfooding of the community-health pack
├── skills/
│   ├── context-init/    # SKILL.md + references/ + evals/
│   └── context-audit/   # SKILL.md + references/ + evals/
├── templates/
│   ├── repo/            # Base skeleton (CLAUDE.md, AGENTS.md, docs/, .claude/)
│   ├── monorepo/        # Deltas: per-app CLAUDE.md template
│   └── community/       # LICENSE, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md,
│                        # .github/ISSUE_TEMPLATE/, PULL_REQUEST_TEMPLATE.md, CODEOWNERS
├── reference/           # Distilled guidance (short, high-signal, source+date cited)
│   ├── principles.md    # Six shifts, attention budget, right altitude
│   ├── claude-md.md     # How to write CLAUDE.md now; Ynara-style anti-patterns
│   ├── skills.md        # Skill authoring distilled
│   ├── agents.md        # When to create custom agents vs use native ones
│   └── global-vs-repo.md# What belongs in ~/.claude vs each repo
└── global/
    ├── CLAUDE.md        # Canonical source for ~/.claude/CLAUDE.md (≤40 lines)
    └── OMC-DECISION.md  # ADR: evidence-based keep/drop/replace decision on OMC
```

Rules: reference files are distillations, not copies; each cites source and date.
Skills load reference files progressively (one level deep from SKILL.md). The
`context-init` and `context-audit` skills are installed into `~/.claude/skills/`
via the workstation installer so they can run from any repo.

## The per-repo skeleton (result of /context-init)

```
target-repo/
├── CLAUDE.md            # 4 blocks + optional Map; target ≤60 lines, hard cap 100
├── AGENTS.md            # ~10 lines: repo summary + core commands + "see CLAUDE.md"
├── README.md            # human entry point
├── LICENSE, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md,
│   .github/…, CODEOWNERS        # per repo profile, see matrix below
├── .claude/skills/      # EMPTY by default; skills only for real, recurring workflows
└── docs/
    ├── README.md        # one-line-per-area index (docs tree entry point)
    ├── adrs/            # ADR-NNN-<topic>.md (lightweight template provided)
    └── specs/           # SPEC-<feature>.md with rich references (tests, mockups, rubrics)
```

CLAUDE.md block structure (fixed order):

1. Title + 2-3 lines: what the repo is, main stack. Nothing the filesystem already says.
2. `## Commands` — build/test/run/lint, verified working before being written.
3. `## Gotchas` — only non-inferable facts ("integration tests need Docker running").
4. `## Hard constraints` — only genuine safety rules ("memory migrations need human OK",
   "never commit .env"). If violating it doesn't hurt, it doesn't belong here.
5. `## Map` (optional, ≤8 lines) — only non-obvious locations. A signal, not a toll.

Repo skills are NOT listed in CLAUDE.md (skill descriptions auto-load; listing = duplication).

Community-health matrix (context-init asks one question: personal / public OSS / team):

| File | Personal | Public OSS | Team |
|---|---|---|---|
| README.md | yes | yes | yes |
| LICENSE | no | yes (MIT default, selectable) | case by case |
| SECURITY.md | no | yes | yes |
| CONTRIBUTING.md | no | yes | yes |
| CODE_OF_CONDUCT.md | no | yes | optional |
| .github templates | no | yes | yes |
| CODEOWNERS | no | optional | yes |

Monorepo variant: root files identical; plus one per-app `CLAUDE.md` (≤30 lines,
commands + gotchas of that app only). Replaces Ynara's five per-app AGENTS.md.

Deliberately absent: per-tool adapters, mandatory read orders, prose conventions docs
(conventions live in linters and code), rules restating common sense, "required reading".

AI-friendly entrypoints are implemented as signals: the Map block, docs/README.md index,
and naming conventions (ADR-NNN-<topic>, SPEC-<feature>) — discoverable, never mandatory.

## The skills

### context-init

Third-person description with triggers (e.g. "Installs or migrates a repo to the
context-engineering standard. Use when setting up Claude context for a repo, when a repo
has no CLAUDE.md, or when migrating legacy AGENTS.md/adapter architectures.").

Checklist workflow:

1. Explore target repo: stack, structure, existing context files (CLAUDE.md, AGENTS.md,
   adapters, docs/). Detect simple vs monorepo.
2. Detect profile; ask only what cannot be inferred (personal/OSS/team; license choice).
3. Gotcha interview: ask the user for the 3-5 real gotchas and hard constraints
   (owner knowledge, not inferable).
4. Verify commands by running them before writing them into CLAUDE.md.
5. Migration plan (only when legacy context exists): ADRs kept; rules distilled into
   gotchas/hard constraints; adapters and read orders deleted; procedural prose proposed
   as repo skills. Plan is presented BEFORE any file is touched.
6. Instantiate templates; run context-audit as final quality gate; report created/deleted.

Degrees of freedom: medium — templates are defaults, model judgment adapts them
(open field, not narrow bridge).

### context-audit

Report mode by default; applies fixes only on request. Checklist derived from reference/:

- CLAUDE.md ≤60 lines? Content inferable from filesystem? Rules that should be judgment?
- Duplication across CLAUDE.md / AGENTS.md / skills?
- Procedural prose that should be a skill?
- Dead docs (unreferenced, not rich references)?
- Skill descriptions: third person, triggers present, discoverable? SKILL.md <500 lines?
- References more than one level deep?
- Naming conventions followed (ADR-NNN, SPEC-*)?

Output: score + concrete fix list, most severe first.

## Global layer and OMC

`global/CLAUDE.md` (≤40 lines): identity/tone (rioplatense chat, English technical files),
cross-project safety (credentials, destructive ops, no unverified success claims),
minimal working style. Nothing procedural — that moves to global skills or dies.

`global/OMC-DECISION.md` (ADR): per OMC component (agents, skills, hooks, CLAUDE.md block),
evaluate: (1) duplicates a native Claude Code 2026 capability (native subagents, plugins,
auto-memory, /doctor, tasks)? (2) actually used (evidence from usage history)?
(3) conflicts with the judgment-over-rules paradigm? Output: keep/drop/replace matrix
and a recommendation. NOT applied to the live environment without explicit user approval.

## Verification

- Evaluation-driven: 3 evals per skill written BEFORE skill content, as
  `skills/*/evals/eval-NN.md` (query + expected behavior checklist).
- context-init evals run against three real repo shapes: KioscoDiagonal (simple),
  Portafolio (personal), Ynara (monorepo hard case). Dry-run/report only during evals.
- Dogfooding gate: Context-Engineering itself passes context-audit clean.
- Token measurement: chars/tokens of always-loaded context in Ynara before vs after
  migration, reported in the rollout phase.

## Phases

1. **Repo core**: reference/, templates/, both skills + evals, repo's own
   CLAUDE.md/AGENTS.md/README/CONTRIBUTING. Dogfooding gate passes.
2. **Global content**: global/CLAUDE.md + OMC-DECISION.md (content only, nothing applied).
3. **Rollout** (each step gated on user approval): install skills via workstation;
   pilot /context-init on one simple repo; Ynara migration; apply global layer.

## Out of scope

Versioned sync/update tooling across repos; automatic OMC uninstall; changes to the
live ~/.claude during phases 1-2; CI for the evals (manual runs suffice at this scale).
