---
name: context-audit
description: Audits a repository's Claude context files (CLAUDE.md, AGENTS.md, skills, docs structure) against the context-engineering standard and reports a score with concrete fixes. Use when checking context quality, after running context-init, when a repo's context feels bloated or outdated, or before migrating a repo to the new standard.
---

# Context audit

Measures a repo against the context-engineering standard and reports what to
fix. **Report-only by default** — apply fixes only when the user explicitly
asks ("audit and fix", "apply the fixes").

## Workflow

Copy this checklist and tick items off:

```
Audit progress:
- [ ] 1. Inventory context files
- [ ] 2. Load the checklist
- [ ] 3. Evaluate every check
- [ ] 4. Emit the report
- [ ] 5. Fixes (ONLY if requested)
```

**1. Inventory.** Find the repo's context surface: root CLAUDE.md, AGENTS.md,
any per-tool adapters (CODEX.md, GEMINI.md), nested/per-app CLAUDE.md or
AGENTS.md, `.claude/skills/` and `skills/`, `docs/` tree. Note line counts.
If the Context-Engineering repo is available, run its
`scripts/context-lint.mjs <repo-path>` first — it settles the mechanical
checks (budgets, adapters, read orders, links, command drift) so the audit
can spend judgment on the rest.

**2. Load** [references/checklist.md](references/checklist.md) — the full
check table with pass conditions and severities.

**3. Evaluate every check.** Read the actual files; never guess from names.
For "commands verified", cross-check claimed commands against lockfiles and
script definitions. For "dead docs", grep for references to each doc from
entrypoints, indexes, and skills.

**4. Emit the report** in exactly this format:

```markdown
## Context audit: <repo>

Score: N/10

| Severity | File | Finding | Fix |
|---|---|---|---|
| high | ... | ... | ... |
```

Most severe first. Scoring: start at 10; −2 per high, −1 per medium, −0.5 per
low; floor 0. A clean repo still gets the report (score + "no findings").

**5. Fixes — only if requested.** Apply exactly the fixes listed in the
report, nothing else. Genuine content (real gotchas, hard constraints) is
MOVED to its correct place, never deleted. Re-run the audit afterward and
report the new score.

## Judgment notes

- ADRs and specs are rich references — never bloat, regardless of count.
- A Map block is a signal (allowed); a read order is a toll (violation).
- When unsure whether a rule is "genuine safety", ask: does violating it
  cause real damage? If not, it's taste — flag it.
