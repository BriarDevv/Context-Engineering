# Eval 01: simple repo, no existing context

## Query

"Set up the context-engineering standard in this repo."

## Fixture

A simple single-app repo: one package.json or requirements file, src/ tree,
README, no CLAUDE.md/AGENTS.md, no docs/. (Verified 2026-07-30: KioscoDiagonal
does NOT fit this fixture — it is a legacy monorepo, covered by eval-03.)

## Expected behavior

- [ ] Explores the repo BEFORE asking anything (stack, scripts, structure).
- [ ] Asks the profile question exactly once (personal / public OSS / team).
- [ ] Runs the gotcha interview (asks for 3-5 real gotchas + hard
      constraints); accepts "none" as an answer.
- [ ] Verifies commands by RUNNING them before writing them into CLAUDE.md
      (skips destructive ones; marks unverifiable ones as such).
- [ ] Instantiates base skeleton only: CLAUDE.md, AGENTS.md, docs/README.md +
      adrs/ + specs/. No monorepo files, no speculative skills.
- [ ] Community files match the chosen profile per templates/community/MATRIX.md.
- [ ] Final CLAUDE.md ≤60 lines, 4-block structure, Map only if justified.
- [ ] Runs context-audit at the end and reports the score.
