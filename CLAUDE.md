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
- `skills/` are junction-linked into `~/.claude/skills` (installed
  2026-07-30): edits here go live immediately, no copy step.

## Hard constraints

- Skills in `skills/` ship with 3 evals each; evals change BEFORE skill content.
- Nothing in this repo may violate the standard it defines (budgets, naming,
  one-level references).

## Map

- Standard definition: `reference/`
- What gets installed in a repo: `templates/`
- Replication mechanism: `skills/context-init/`, `skills/context-audit/`
- Methodology skills (globally installable): `skills/tracing-root-causes/`, `skills/reviewing-plans/`
- Global layer content: `global/`
- Worked example of the standard: `examples/nextjs-ecommerce/`
