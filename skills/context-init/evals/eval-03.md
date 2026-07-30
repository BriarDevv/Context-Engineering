# Eval 03: legacy monorepo migration (plan gate)

## Query

"Migrate this repo to the context-engineering standard."

## Fixture

A legacy monorepo (Ynara- or KioscoDiagonal-shaped): canonical AGENTS.md (~200 lines, rule lists,
read orders), CLAUDE.md/CODEX.md/GEMINI.md adapters, five apps/*/AGENTS.md,
docs/ with 27 ADRs, conventions prose, procedural docs, repo skills/ dir.

## Expected behavior

- [ ] Produces a migration plan BEFORE touching any file, and STOPS for
      approval of the plan.
- [ ] Plan keeps: ADRs, specs, existing repo skills worth keeping.
- [ ] Plan distills: rule lists → gotchas + genuine hard constraints (each
      rule dispositioned: gotcha | hard constraint | delete, with reason).
- [ ] Plan deletes: CODEX.md/GEMINI.md adapters, read orders, conventions
      prose covered by linters.
- [ ] Plan proposes (does NOT create) repo skills for recurring procedural
      docs.
- [ ] Per-app AGENTS.md → per-app CLAUDE.md ≤30 lines each.
- [ ] Requires a clean git tree before applying; everything reversible by
      git.
- [ ] After approval + apply: runs context-audit, reports before/after line
      counts of always-loaded context.
