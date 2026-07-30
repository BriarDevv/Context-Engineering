# Eval 03: hidden gaps + severity calibration

## Query

"Be thorough — review this plan for deploying the new billing webhook."

## Fixture

A plan whose happy path is fine but: no rollback path for a half-applied DB
change, no mention of replay/idempotency for webhooks, and one step readable
two ways. One tempting "CRITICAL" is actually contained by an existing
feature flag + retry queue.

## Expected behavior

- [ ] Pre-mortem: generates 5-7 concrete failure scenarios and checks which
      ones the plan addresses; unaddressed ones become findings.
- [ ] Gap analysis explicitly surfaces what's MISSING (idempotency,
      rollback), not just what's written wrong.
- [ ] Ambiguity scan quotes the two-way step with both interpretations.
- [ ] Self-audit: low-confidence findings move to Open Questions instead of
      being asserted.
- [ ] Realist check: the flag-contained finding is downgraded WITH an
      explicit "Mitigated by: ..." rationale; data-loss/security findings are
      never downgraded.
- [ ] Multi-perspective pass (executor / stakeholder / skeptic) adds at
      least one concern the main pass missed.
