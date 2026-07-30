# Eval 02: compliant repo (no false positives)

## Query

"Run a context audit on this repo."

## Fixture

The Context-Engineering repo itself (compliant by construction): CLAUDE.md
~34 lines with 4 blocks + Map, AGENTS.md 8 lines, docs/ with specs+plans,
reference/ ≤120-line distillations with source headers, skills with evals.

## Expected behavior

- [ ] Score ≥9/10, zero high-severity findings.
- [ ] Does NOT flag the Map block (signals are allowed; only mandatory read
      orders are violations).
- [ ] Does NOT flag docs/README.md-style indexes (one-line-per-area is the
      prescribed pattern).
- [ ] Confirms budgets explicitly (CLAUDE.md ≤60, SKILL.md <500, reference
      ≤120).
- [ ] Report produced in the standard format even when clean.
