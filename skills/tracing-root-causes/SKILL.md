---
name: tracing-root-causes
description: Disciplined causal analysis for explaining observed outcomes — competing hypotheses, evidence ranked by strength, active disconfirmation, and a discriminating next probe. Use when investigating why something happened (intermittent failures, regressions, production incidents, surprising benchmark results) BEFORE proposing fixes, especially when a "obvious culprit" is tempting.
---

# Tracing root causes

<!-- Methodology distilled from OMC's tracer agent (MIT), 2026-07-30.
     See docs/adrs/ADR-002-omc-salvage.md for provenance. -->

Explain outcomes through evidence, not narrative. The failure mode this
prevents: jumping from symptom to favorite explanation, then collecting only
confirming evidence.

## The discipline

1. **Observe before interpreting.** Restate exactly what was observed —
   which artifact, what behavior, when. If you catch yourself rewriting the
   observation to fit a theory, stop.
2. **Compete the hypotheses.** Under ambiguity, hold ≥2 explanations from
   deliberately different frames: code path, config/environment, measurement
   artifact, external dependency, timing. "The measurement is wrong" is
   always a candidate.
3. **Rank evidence by strength.** From strongest to weakest:
   controlled repro / discriminating experiment → primary artifact with tight
   provenance (timestamped logs, git history, file:line behavior) →
   independent sources converging → single-source inference that fits →
   circumstantial (naming, temporal proximity, stack position) → intuition.
   When tiers conflict, the higher tier wins; never treat support as flat.
4. **Seek disconfirmation.** For each serious hypothesis ask: "what should we
   observe if this were true — do we?" and "what observation would be hard to
   explain if this were true?". A hypothesis that survives only because
   nobody looked for counter-evidence keeps LOW confidence.
5. **Run a rebuttal round.** Let the strongest remaining alternative
   challenge the leader with its best contrary evidence before you conclude.
   Down-rank explanations that need fresh unverified assumptions to survive,
   and don't merge hypotheses that merely sound alike (fake convergence).
6. **End with a probe, not a shrug.** Name the critical unknown — the single
   missing fact behind most of the remaining uncertainty — and the ONE probe
   that best discriminates between the top hypotheses. Prefer probes that
   separate hypotheses over probes that gather more of the same support.

## Output shape

Ranked hypothesis table (confidence + evidence strength + why it survives),
evidence for AND against each, current best explanation (explicitly
provisional when evidence is incomplete), critical unknown, discriminating
probe. If asked to also fix: finish the trace first, then fix.

## Judgment notes

- Temporal proximity ("it broke right after X") is bottom-tier evidence.
  Resist framing pressure to confirm it without primary artifacts.
- Blocked by missing evidence? Deliver the ranked shortlist + probe — that
  IS the deliverable, not a failure.
- This complements superpowers:systematic-debugging: that skill governs the
  fix loop; this one governs the causal explanation that precedes it.
