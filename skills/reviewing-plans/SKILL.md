---
name: reviewing-plans
description: Adversarial review of plans, specs, and proposals before execution — verifies references, extracts and rates assumptions, runs a pre-mortem, hunts what's missing, then pressure-tests its own findings for confidence and real-world severity. Use before executing an implementation plan, when asked to review a spec or proposal, or as the quality gate after writing-plans.
---

# Reviewing plans

<!-- Methodology distilled from OMC's critic + analyst agents (MIT), 2026-07-30.
     See docs/adrs/ADR-002-omc-salvage.md for provenance. -->

A false approval costs 10-100x a false rejection — but manufactured outrage
destroys the reviewer's signal. Both discipline and calibration.

## Protocol

1. **Pre-commit.** Before reading in detail, predict the 3-5 most likely
   problem areas for this kind of plan. Investigate those specifically —
   deliberate search beats passive reading.
2. **Verify everything.** Extract every file reference, function name, and
   technical claim; check each against the actual codebase (Read/Grep/git).
   An assertion you didn't verify is not evidence.
3. **Rate the assumptions.** List explicit AND implicit assumptions; rate
   each VERIFIED (evidence exists) / REASONABLE (plausible, untested) /
   FRAGILE (could easily be wrong). Fragile ones are the priority targets.
4. **Pre-mortem.** "This plan was executed exactly as written and failed."
   Generate 5-7 concrete failure scenarios; every scenario the plan doesn't
   address is a finding. Include rollback: if step N dies midway, what's the
   documented recovery?
5. **Scan for ambiguity.** Per step: "could two competent developers
   interpret this differently?" If yes, quote it, state both readings and
   the cost of the wrong one.
6. **Hunt what's MISSING.** The biggest differentiator. Load
   [references/gap-taxonomy.md](references/gap-taxonomy.md) and walk its six
   categories. Simulate executing every task: where does the executor hit an
   undocumented wall?
7. **Change perspective.** Re-read as the EXECUTOR ("can I do each step with
   only what's written?"), the STAKEHOLDER ("does this solve the stated
   problem with measurable success criteria?"), the SKEPTIC ("what's the
   strongest argument this fails, and was the rejected alternative
   hand-waved?").
8. **Self-audit (mandatory).** Per CRITICAL/MAJOR finding: confidence
   HIGH/MEDIUM/LOW; could the author refute it with context I lack?; flaw or
   preference? LOW confidence or refutable-without-evidence → Open Questions
   (unscored). Preference → minor or gone.
9. **Realist check (mandatory).** Per surviving CRITICAL/MAJOR: realistic
   worst case (not theoretical max), existing mitigations (tests, flags,
   monitoring, retries), detection speed, and "am I inflating severity
   because I'm in hunting mode?". Downgrades REQUIRE an explicit
   "Mitigated by: ..." rationale. Never downgrade data-loss, security, or
   financial-impact findings.

## Verdict

**REJECT / REVISE / ACCEPT-WITH-RESERVATIONS / ACCEPT**, with: findings by
severity (CRITICAL blocks execution, MAJOR causes rework, MINOR suboptimal),
each with evidence (file:line or backtick-quoted excerpt) + concrete fix;
What's Missing; Ambiguity Risks; Open Questions (unscored). If the work is
genuinely solid, say ACCEPT plainly — a clean bill from a hard reviewer
carries real signal.

## Judgment notes

- Escalate when you find 1 CRITICAL, 3+ MAJOR, or a systemic pattern: assume
  more problems are hiding, widen scope to adjacent steps, re-check claims
  you'd initially trusted. Report that you escalated and why.
- Never review your own authorship in the same context — a fresh reviewer
  (subagent or separate pass) is the gate.
