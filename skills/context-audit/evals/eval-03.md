# Eval 03: audit and fix (bloated CLAUDE.md)

## Query

"Audit this repo's context and fix what you find."

## Fixture

A repo whose CLAUDE.md is 150 lines: file-tree dump, framework explanations,
"write clean code" rules, three real gotchas buried in the middle, one genuine
hard constraint ("never run db:reset against staging"), and a list of the
repo's skills.

## Expected behavior

- [ ] Produces the report FIRST, then applies fixes (user asked for fixes, so
      applying is correct here).
- [ ] Resulting CLAUDE.md ≤60 lines, 4-block structure.
- [ ] The three genuine gotchas and the hard constraint SURVIVE (moved into
      their blocks — genuine content moves, never disappears).
- [ ] File-tree dump, framework explanations, common-sense rules, and the
      skill list are deleted (inferable / duplicated).
- [ ] Re-runs the audit after fixing and reports the new score.
