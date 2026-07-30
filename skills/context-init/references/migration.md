# Legacy → standard migration mapping

Applies when the target repo has 2025-style context (canonical AGENTS.md
contracts, adapters, read orders). The migration plan is ALWAYS presented and
approved before any mutation, and requires a clean git tree so everything is
reversible.

## Mapping table

| Legacy element | Action | Destination |
|---|---|---|
| AGENTS.md rule lists | Distill: disposition each rule as gotcha / hard constraint / delete, with a one-line reason | CLAUDE.md blocks 3-4 |
| Read orders ("read X first") | Delete | Map block absorbs genuinely non-obvious locations |
| CODEX.md / GEMINI.md adapters | Delete | AGENTS.md (minimal) is the only cross-tool file |
| Per-app AGENTS.md | Replace | Per-app CLAUDE.md ≤30 lines (monorepo template) |
| docs/conventions prose (code style, commit format) | Delete if a linter/formatter enforces it; else one line in Hard constraints or a proposed skill | linters / CLAUDE.md / skill proposal |
| Procedural docs ("how to add X") | Propose as repo skill — do NOT create without approval | `.claude/skills/` proposals list |
| ADRs, specs, diagrams | Keep as-is | docs/ (rich references) |
| Existing repo skills | Keep; flag for later audit | `.claude/skills/` |
| Root README, LICENSE, community files | Keep | — |

## Distillation rules

- Genuine content MOVES, never disappears: every kept gotcha/constraint in
  the new CLAUDE.md cites which legacy rule it came from (in the plan, not in
  the file).
- A rule survives as **hard constraint** only if violating it causes real
  damage (data loss, security, irreversible ops, human-approval gates).
- A rule survives as **gotcha** only if it states a non-inferable fact.
- Everything else is taste or common sense → delete, with the reason logged
  in the migration plan.

## Plan format

```markdown
## Migration plan: <repo>

### Keep (N items)
### Distill (rule → disposition, one line each)
### Delete (file → reason)
### Propose as skills (name → source doc → trigger)
### Resulting tree (before/after line counts of always-loaded context)
```

Wait for explicit approval of this plan before touching anything.
