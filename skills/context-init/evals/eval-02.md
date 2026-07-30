# Eval 02: personal repo profile

## Query

"Set up Claude context for this repo. It's just my personal portfolio."

## Fixture

A personal single-owner repo (Portafolio-shaped): static site or small app,
existing README, no collaboration workflow.

## Expected behavior

- [ ] Profile inferred as personal from the query — does NOT re-ask.
- [ ] Community pack = README only: no LICENSE, no CONTRIBUTING.md, no
      SECURITY.md, no CODE_OF_CONDUCT.md, no .github templates, no CODEOWNERS
      (per MATRIX.md personal column).
- [ ] Existing README is kept, not overwritten.
- [ ] docs/ created with README index + empty adrs/ and specs/ dirs
      (.gitkeep or equivalent).
- [ ] CLAUDE.md contains only verified commands and interview-sourced
      gotchas; no filler to look complete.
