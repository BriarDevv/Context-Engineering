---
name: context-init
description: Installs the context-engineering standard in a repository or migrates legacy context architectures (canonical AGENTS.md contracts, per-tool adapters, mandatory read orders) to it. Use when setting up Claude context for a new or existing repo, when a repo lacks CLAUDE.md, or when modernizing an outdated context setup.
---

# Context init

Instantiates the per-repo skeleton from the Context-Engineering templates,
adapted to the target repo. Ask only what cannot be inferred; verify before
writing; never touch a legacy repo without an approved migration plan.

Templates live in the Context-Engineering repo: `templates/repo/`,
`templates/monorepo/`, `templates/community/` (locate it at
`C:/Briar/repos/mine/Context-Engineering` or ask if moved).

## Workflow

Copy this checklist and tick items off:

```
Init progress:
- [ ] 1. Explore the target repo
- [ ] 2. Detect profile (ask only the gaps)
- [ ] 3. Gotcha interview
- [ ] 4. Verify commands by running them
- [ ] 5. Migration plan gate (legacy repos only)
- [ ] 6. Instantiate, audit, report
```

**1. Explore.** Stack and tooling (lockfiles, manifests, scripts), layout
(single app vs monorepo — multiple app/package manifests ⇒ monorepo), existing
context files (CLAUDE.md, AGENTS.md, adapters, docs/, repo skills), README.

**2. Detect profile.** personal / public OSS / team. Infer from the query and
repo signals (remote, contributors, license) when possible; otherwise ask
ONCE. Community files follow `templates/community/MATRIX.md` exactly — public
OSS also picks a license (MIT default).

**3. Gotcha interview.** Ask the user for the 3-5 real gotchas and hard
constraints — owner knowledge is not inferable. Accept "none". Never invent
filler to make blocks look complete; empty blocks are valid.

**4. Verify commands.** Run each build/test/run/lint command before writing it
into CLAUDE.md. Skip destructive or long-running ones — mark them
`# not verified` instead. A command that fails does not go in.

**5. Migration plan gate.** If ANY legacy context exists, load
[references/migration.md](references/migration.md), produce the migration plan
in its format, and STOP for explicit approval. Requires a clean git tree
before applying. Skip this step entirely for repos with no legacy context.

**6. Instantiate.** Fill `{{PLACEHOLDER}}` markers from what steps 1-4
produced; delete optional sections that have no content (e.g. Map). Monorepo:
one `app-CLAUDE.md.template` per app, ≤30 lines. Keep existing README/LICENSE.
Then run the `context-audit` skill as the final gate and report: files
created, files deleted (migrations), audit score, and before/after line counts
of always-loaded context when migrating.

## Judgment notes

- Degrees of freedom: templates are defaults, not law — adapt structure to
  the repo, never violate budgets (CLAUDE.md ≤60/100, per-app ≤30).
- No speculative skills: propose repo skills only for workflows evidenced in
  the repo (procedural docs, CI scripts) and let the user opt in.
- When the repo already complies, say so and change nothing.
