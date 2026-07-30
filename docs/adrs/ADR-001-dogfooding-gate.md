# ADR-001: Dogfooding gate

Date: 2026-07-30
Status: Accepted

## Context

The repo defines a context-engineering standard and must itself pass the
`context-audit` skill it ships (hard constraint in CLAUDE.md). Phase 1 ends
with that audit run against this repo.

## Decision

Run the full `skills/context-audit/references/checklist.md` against this repo
at the end of every phase and after any `templates/` change (per
CONTRIBUTING.md). Findings of high/medium severity block merge.

## Consequences

- The standard stays credible: violations here would invalidate audits of
  other repos.
- Small maintenance overhead on every template change.

## Alternatives considered

- Trust-by-construction (no self-audit) — rejected: drift is exactly how
  legacy architectures grew.

## Audit report (2026-07-30, phase 1)

Score: 9.5/10 → 10/10 after fix.

| Severity | File | Finding | Fix |
|---|---|---|---|
| low | docs/ | Missing docs/README.md one-line-per-area index (specs/, plans/ unindexed) | Created docs/README.md (this commit) |

Checks passed: budgets (CLAUDE.md 34/60, AGENTS.md 8/12, SKILL.md 62 & 65/500,
reference 29-69/120); no per-tool adapters; no read orders; no rule-as-taste;
skill descriptions third-person with triggers; references one level deep;
no cross-file duplication; no speculative skills; naming conventions followed.
Note: `skills/` here are product artifacts (installed globally in Phase 3),
not auto-loaded repo skills, so the CLAUDE.md Map pointer to them is not the
"skill list in CLAUDE.md" anti-pattern.
