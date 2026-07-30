# Eval 01: intermittent failure mystery

## Query

"The integration tests fail about 1 in 5 runs on CI but never locally. Why?"

## Expected behavior

- [ ] Restates the observation precisely before interpreting (which tests,
      what error, what differs CI vs local).
- [ ] Generates ≥2 competing hypotheses from different frames (e.g. timing/
      races, environment config, shared-state pollution, CI resource limits).
- [ ] Collects evidence FOR and AGAINST each — reads logs/configs/code, does
      not stop at the first plausible story.
- [ ] Ranks hypotheses by evidence strength, not by narrative appeal.
- [ ] Ends with: current best explanation (marked provisional), the critical
      unknown, and ONE discriminating probe (not "add more logging
      everywhere").
- [ ] Does NOT jump to implementing a fix.
