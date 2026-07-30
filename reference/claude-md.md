# Writing CLAUDE.md files

Sources: [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)
(2026-07-24); `principles.md` in this directory. Retrieved 2026-07-30.

## Budgets

| File | Target | Hard cap |
|---|---|---|
| Repo CLAUDE.md | ≤60 lines | 100 |
| Per-app CLAUDE.md (monorepo) | ≤30 lines | 30 |
| Global ~/.claude/CLAUDE.md | ≤40 lines | 40 |

## The 4-block structure (fixed order)

### 1. Title + summary (2-3 lines)
What the repo is and its main stack. Nothing the filesystem already says.
- Good: "On-prem personal assistant with in-house 3-store memory. FastAPI +
  Next.js 16 + Postgres/pgvector, local LLM serving via Ollama."
- Bad: "This repository contains source code organized in folders." (inferable)

### 2. `## Commands`
Build / test / run / lint — only the ones that matter, **verified by running
them** before they are written here.
- Good: `pnpm test:integration  # needs Docker running`
- Bad: ten aliases nobody uses, or commands copied from a README untested.

### 3. `## Gotchas`
Only non-inferable facts.
- Good: "First boot takes ~40s while models load; don't assume a hang."
- Bad: "Write clean code and follow existing patterns." (common sense)

### 4. `## Hard constraints`
Only genuine safety rules — if violating it doesn't hurt, it doesn't belong.
- Good: "Memory-store migrations require explicit human OK before applying."
- Bad: "Never write multi-line comments." (taste masquerading as a rule)

### 5. `## Map` (optional, ≤8 lines)
Only non-obvious locations, as signals: "Business logic: `app/services/`".
Delete the section if nothing qualifies. A map is consultable — never phrase
it as required reading.

## What never goes in CLAUDE.md

- A list of the repo's skills (their descriptions auto-load — duplication).
- Session-learned facts (auto-memory owns those).
- Procedural workflows ("how to add an endpoint") — those are skills.
- Anything passing the "Claude is already smart" test (see `principles.md`).

## Legacy anti-patterns (Ynara-style, 2025 era)

| Anti-pattern | Why it fails now | Replacement |
|---|---|---|
| Per-tool adapters (CODEX.md, GEMINI.md) | Triple maintenance, drift | One minimal AGENTS.md |
| Mandatory read orders ("read these 4 files first") | Burns attention budget upfront | Just-in-time discovery + Map |
| "10 non-negotiable rules" lists | Rules-as-taste conflict with model judgment | Distill to gotchas + genuine hard constraints |
| Prose conventions docs (CODE-STYLE.md) | Restates what linters/code already enforce | Linters, or a skill if truly procedural |
| Per-app AGENTS.md files | Duplicates root contract | Per-app CLAUDE.md ≤30 lines |

## Monorepo variant

Root CLAUDE.md as above. Each app gets its own CLAUDE.md (≤30 lines): that
app's commands and gotchas only — nothing shared with the root. Claude Code
loads them automatically when working in the app directory.

## AGENTS.md (companion file)

~10 lines: repo summary + core commands + "Claude Code is the primary tool;
see CLAUDE.md". It is an entry point for non-Claude tools, not a contract.
