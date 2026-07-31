# Audit checklist

Every check derives from `reference/` in the Context-Engineering repo
(principles.md, claude-md.md, skills.md). Severities: **high** = wastes
attention budget or fights model judgment; **medium** = budget/quality drift;
**low** = cosmetic.

## Contents

- CLAUDE.md checks
- Duplication checks
- Structure checks
- Skills checks
- Docs checks
- Design checks

## CLAUDE.md checks

| Check | Pass condition | Severity |
|---|---|---|
| Line budget | Repo ≤60 (cap 100); per-app ≤30; global ≤40 | medium |
| Inferable content | No file trees, framework explanations, facts derivable from code/filesystem | high |
| Rules vs judgment | No taste rules ("clean code", comment style); constraints are genuine safety only | high |
| Block structure | Summary → Commands → Gotchas → Hard constraints → optional Map | low |
| Commands verified | Commands plausible for the repo (lockfiles/scripts exist that match) | medium |
| Map discipline | ≤8 lines, non-obvious locations only, phrased as signal not required reading | medium |
| Memory content | No session-learned facts hand-written in (auto-memory owns those) | medium |

## Duplication checks

| Check | Pass condition | Severity |
|---|---|---|
| Per-tool adapters | No CODEX.md / GEMINI.md / similar | high |
| Skill list in CLAUDE.md | Repo skills NOT enumerated there (descriptions auto-load) | high |
| Cross-file repetition | No instruction appears in >1 of CLAUDE.md / AGENTS.md / skills | high |
| AGENTS.md scope | ≤~12 lines, entry-point only, points to CLAUDE.md | medium |

## Structure checks

| Check | Pass condition | Severity |
|---|---|---|
| Read orders | No "read X before doing anything" anywhere | high |
| Procedural prose | No how-to workflows in CLAUDE.md/AGENTS.md/docs that recur (those are skills) | medium |
| Naming | ADR-NNN-<topic>.md, SPEC-<feature>.md | low |
| docs/ index | docs/README.md exists, one line per area, no content of its own | low |
| Monorepo | Per-app CLAUDE.md (not AGENTS.md), ≤30 lines each | medium |

## Skills checks (`.claude/skills/` or `skills/`)

| Check | Pass condition | Severity |
|---|---|---|
| Description quality | Third person; states what AND when (triggers) | medium |
| Body budget | SKILL.md <500 lines | medium |
| Reference depth | All references one level from SKILL.md | medium |
| Speculative skills | Every skill maps to a real recurring workflow | medium |
| TOC | Reference files >100 lines start with contents list | low |

## Docs checks

| Check | Pass condition | Severity |
|---|---|---|
| Dead docs | Every doc is referenced by an entrypoint/index/skill OR is a rich reference (ADR, spec, test, rubric) | medium |
| ADRs | Never flag ADRs/specs as bloat — they are rich references by design | — |
| Prose conventions | No CODE-STYLE.md-type prose that a linter/formatter enforces | medium |
| Diagrams | Mermaid, encoding non-inferable topology only; no folder-structure diagrams | medium |

## Design checks (only for repos/apps with UI)

| Check | Pass condition | Severity |
|---|---|---|
| DESIGN.md presence | Every app with UI carries one (root or app root) | medium |
| Token consumption | Components use generated tokens; no raw hex/px duplicating an existing token | medium |
| Decisions honored | No `## Decisions` entry contradicted by current code | high |
| Compilation | Tokens edited only in frontmatter; `design.tokens.css` regenerated (lint `design-drift` clean) | medium |
| Mode discipline | Theme variants live in frontmatter `modes` with selectors; components consume semantic tokens, never branch on theme | medium |
