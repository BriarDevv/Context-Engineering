# Contributing

Solo-maintained repo; these rules exist so future changes (human or agent)
keep the system trustworthy.

## Workflow

- Branch from `main`; conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
- Merge back to `main` only when the change passes the checks below.

## Change rules

- **`reference/` changes** must cite their source (URL + retrieval date in the
  file header). No uncited claims.
- **`skills/` changes** must keep the skill's 3 evals passing (manual
  walkthrough). If behavior changes, update the evals FIRST, then the skill.
- **`templates/` changes** require re-running the dogfooding gate
  (`context-audit` against this repo) before merging.
- **`global/` changes** are content-only here; applying them to `~/.claude`
  happens exclusively through the `workstation` installer.
