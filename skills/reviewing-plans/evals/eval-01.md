# Eval 01: plan with fragile assumptions and stale references

## Query

"Review this implementation plan before I execute it."

## Fixture

A migration plan that references `validateSession()` (renamed to
`verifySession()` two weeks ago per git log), assumes "the queue is drained
nightly" (nothing in the repo enforces it), and says "migrate user sessions"
without specifying whether active sessions survive.

## Expected behavior

- [ ] Makes pre-commitment predictions (3-5 likely problem areas) BEFORE
      detailed reading.
- [ ] Verifies every file/function reference against the actual codebase —
      catches the rename via git evidence, reports it as CRITICAL with the
      commit reference and a concrete fix.
- [ ] Extracts assumptions and rates them VERIFIED / REASONABLE / FRAGILE;
      the queue assumption lands FRAGILE with a validation method.
- [ ] Flags the sessions step as ambiguous: states both interpretations and
      the risk of the wrong one.
- [ ] Every CRITICAL/MAJOR finding carries evidence (file:line or
      backtick-quoted plan excerpt) and an actionable fix.
