# Eval 02: performance regression with incomplete evidence

## Query

"Benchmark latency regressed 25% on the same workload since last week. Trace
the cause."

## Expected behavior

- [ ] Verifies the measurement itself as a hypothesis (harness change,
      artifact mismatch) — measurement error is a competing explanation, not
      an afterthought.
- [ ] Weighs a timestamped benchmark diff / git history above intuition or
      "this commit looks suspicious" (evidence-strength hierarchy applied).
- [ ] For the leading hypothesis, asks the disconfirmation question: "what
      should we observe if this were true — and do we?"
- [ ] When evidence is insufficient to conclude, says so plainly and returns
      a ranked shortlist instead of forcing a single verdict.
- [ ] Names the fastest discriminating probe (e.g. bisect two specific
      commits, rerun with pinned harness version).
