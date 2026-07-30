# ADR-002: Salvage OMC methodologies as skills

Date: 2026-07-30
Status: Accepted

## Context

A full audit of OMC's 19 agent definitions (2,570 lines) found well-crafted
but definitively 2025-era artifacts: every rule stated three times, taste
encoded as law, stale data baked in (hardcoded "Opus 4.7 house style" hex
palettes, another repo's JS conventions shipped as universal rules,
references to nonexistent tools like `lsp_diagnostics`/`python_repl`, tmux
dependence on a Windows box without tmux). Nearly all duplicate native agent
types, plugins, or superpowers flows. Two contain genuinely excellent
methodology buried in enforcement: tracer (evidence-ranked causal analysis)
and critic (calibrated adversarial plan review), plus analyst's compact gap
taxonomy.

## Decision

Distill the methodologies into two skills owned by this repo —
`tracing-root-causes` (from tracer) and `reviewing-plans` (from critic +
analyst's gap taxonomy as a reference file) — written to this repo's
standard (judgment over rules, <120-line bodies, evals first). Drop all 19
agent files with the OMC uninstall; no custom agents are recreated
(methodology is skill-shaped; nothing required a distinct tool restriction
per `reference/agents.md`).

## Consequences

- The two best ideas in OMC survive in ~180 always-relevant lines instead of
  2,570 always-loaded-when-spawned ones.
- These skills serve any agent (including natives) instead of being locked
  to OMC's roster.
- Harder: OMC's XML agent template (good/bad examples, failure-mode
  catalogs) is lost as a pattern library; acceptable — it is the style the
  standard retires.

## Alternatives considered

- Keep tracer/critic as custom agents — rejected: fails the
  `reference/agents.md` two-condition test (no distinct tool restriction
  needed; read-only reviewer discipline is expressible in a skill + subagent
  choice).
- Salvage more (verifier evidence tables, code-reviewer severity split) —
  rejected: marginal over superpowers' existing verification/review skills.
