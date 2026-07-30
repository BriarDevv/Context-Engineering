# Context-Engineering

A replicable context-engineering system for all of my repos, built on
Anthropic's Claude 5-era guidance. The core idea: modern models need
**judgment, interfaces, and just-in-time context** — not rule lists, mandatory
read orders, or per-tool adapter files. This repo is the source of truth for
that standard and ships the tooling that replicates it.

## Layout

| Directory | What it is |
|---|---|
| `reference/` | Distilled Anthropic guidance (short, high-signal, sources cited) |
| `templates/` | The per-repo skeleton: CLAUDE.md, AGENTS.md, docs/, community files |
| `skills/` | `context-init` (installs/migrates a repo) and `context-audit` (compliance check) |
| `global/` | Canonical content for the global layer (`~/.claude`) |
| `docs/` | This repo's own ADRs, specs, and plans |

## How to use it

1. **New or existing repo** → run `/context-init` inside it. The skill explores
   the repo, asks only what it cannot infer (profile, gotchas), verifies
   commands by running them, and instantiates the skeleton. Legacy context
   (AGENTS.md contracts, adapters, read orders) gets a migration plan before
   anything is touched.
2. **Check compliance** → run `/context-audit`. Report with score and concrete
   fixes; it only applies fixes when asked.
3. **Global layer** → content lives in `global/`; the `workstation` repo's
   installer applies it to `~/.claude`. Never edit `~/.claude` by hand from here.

## The standard in one paragraph

A repo carries a CLAUDE.md of at most ~60 lines (what the repo is, verified
commands, real gotchas, genuine hard constraints, optional map), a minimal
AGENTS.md for non-Claude tools, repo skills only for real recurring workflows,
and a `docs/` tree with ADRs and rich-reference specs indexed by a one-line-per-
area README. Everything else the model discovers just-in-time from the
filesystem. Anything a model could infer by reading the code does not belong in
context files.

## Grounding sources

- [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) (2026-07)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

## Status

- Phase 1 — repo core (reference, templates, skills, dogfooding): in progress
- Phase 2 — global layer content (global CLAUDE.md, OMC decision ADR): pending
- Phase 3 — rollout (install skills, pilot repos, Ynara migration, apply
  global layer): gated on explicit approval, tracked outside this repo
