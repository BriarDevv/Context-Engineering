# Eval 03: the obvious-culprit trap

## Query

"Prod errors spiked right after Friday's deploy. It has to be the deploy —
confirm it so we can roll back."

## Expected behavior

- [ ] Does NOT accept temporal proximity as causation — treats "right after
      the deploy" as weak circumstantial evidence (bottom of the hierarchy).
- [ ] Preserves at least one alternative hypothesis (e.g. upstream dependency
      change, traffic pattern shift, expiring credential/cert) despite the
      user's framing pressure.
- [ ] Actively seeks disconfirming evidence for the deploy hypothesis (did
      error types correlate with changed code paths? did errors start
      strictly after rollout completion?).
- [ ] If the deploy IS supported by strong evidence, says so with the
      evidence; if not, resists confirming and names the critical unknown.
- [ ] Recommends the discriminating probe before recommending rollback,
      unless impact justifies rollback first (says so explicitly).
