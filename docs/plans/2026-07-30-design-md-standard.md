# DESIGN.md Standard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add DESIGN.md (Google Labs format + `## Decisions` extension) to the context-engineering standard as a compiled token source, with generator, lint/audit enforcement, and the `designing-consistently` skill.

**Architecture:** Tokens live only in DESIGN.md frontmatter and compile to `design.tokens.css` via a zero-dep generator; context-lint imports the generator to detect drift; the skill (skills repo) enforces the read-consume-record loop. Spec: `docs/specs/SPEC-design-md.md`.

**Tech Stack:** Node ESM zero-dep scripts (like context-lint), markdown artifacts, Git.

## Global Constraints

- All artifacts in English; chat in rioplatense Spanish.
- Conventional commits; every commit ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Branch from `main`, ff-merge back, delete branch (CE and skills repos).
- reference/ files cite source + retrieval date, ≤120 lines. Repo CLAUDE.md ≤60 lines. SKILL.md <500 lines; evals change BEFORE skill content.
- Never claim a step done without running its verification command.
- Repos: `C:\Briar\repos\mine\Context-Engineering` (CE), `C:\Briar\repos\mine\skills`.

---

### Task 1: reference/design-md.md

**Files:**
- Create: `C:\Briar\repos\mine\Context-Engineering\reference\design-md.md`

**Interfaces:**
- Produces: the distilled convention every later task implements; cited by template, lint comments, and the skill.

- [ ] **Step 1: Write the file** (exactly this content):

```markdown
# DESIGN.md: compiled design source

Sources: [DESIGN.md draft spec](https://github.com/google-labs-code/design.md)
(Google Labs, Apache 2.0); this repo's `docs/specs/SPEC-design-md.md`.
Retrieved 2026-07-30.

## What it is

One DESIGN.md per app with UI: machine-readable design tokens in YAML
frontmatter + human-readable design rules in prose. Tokens are edited ONLY
here and compiled into code (`design.tokens.css`) by
`scripts/design-md-gen.mjs` — code never hand-defines a token. Placement:
repo root (single app) or each app root (monorepo).

## Format (Google spec + one extension)

- Frontmatter: `name` (required); `colors`, `typography`, `spacing`,
  `rounded`, `components`; `{path.to.token}` references resolve across
  groups; component state variants use related keys (`button-primary-hover`).
  Hex colors must be quoted — YAML reads a bare `#` as a comment.
- Prose sections, in this order when present: Overview, Colors, Typography,
  Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
- Extension `## Decisions`: `### <surface>` (route/screen) subheadings,
  entries `- YYYY-MM-DD — <decision>`. One line per decision; longer
  rationale lives in the prose sections. Entries are standing decisions:
  removing one is an explicit, discussed edit — never a silent drop.
- Spec-compliant consumers preserve unknown sections, so the extension keeps
  the file valid for any DESIGN.md-aware tool.

## Compilation

`node scripts/design-md-gen.mjs <DESIGN.md> --target tailwind4|cssvars`
writes `design.tokens.css` next to the source with a DO-NOT-EDIT header that
records the target. Mapping: `colors.X` → `--color-X`; `spacing.N` →
`--spacing-N`; `rounded.N` → `--radius-N`; `typography.T` → `--font-T`
(fontFamily), `--text-T` (fontSize), `--text-T--<kebab-prop>` (other props);
`components.C.prop` → `--C-<kebab-prop>`, references resolved. An
unresolved reference is a hard error.

## Enforcement

context-lint, only when a DESIGN.md exists: frontmatter parses and has
`name`, known sections in order, references resolve, Decisions entries
dated, generated file present and drift-free (in-memory regeneration).
context-audit adds the judgment rows: UI app without DESIGN.md, raw values
duplicating tokens, Decisions contradicted by code. The
`designing-consistently` skill (skills repo) owns the workflow: read before
building, consume instead of inventing, record decisions as a gated step.
```

- [ ] **Step 2: Verify budget and commit** (on branch `feat/design-md`, created here, reused through Task 5):

```powershell
cd C:\Briar\repos\mine\Context-Engineering; git switch -c feat/design-md
(Get-Content reference\design-md.md).Count   # expect ≤120
git add reference/design-md.md; git commit -m "docs: distill the DESIGN.md convention (Google spec + Decisions extension)"
```

---

### Task 2: templates/repo/DESIGN.md.template

**Files:**
- Create: `C:\Briar\repos\mine\Context-Engineering\templates\repo\DESIGN.md.template`

**Interfaces:**
- Consumes: conventions from Task 1.
- Produces: the file context-init instantiates (Task 5 wires the offer).

- [ ] **Step 1: Write the template** (exactly this content):

```markdown
---
name: {{APP_NAME}}
colors:
  {{COLOR_TOKENS}}
typography:
  {{TYPE_TOKENS}}
spacing:
  {{SPACING_TOKENS}}
rounded:
  {{ROUNDED_TOKENS}}
components:
  {{COMPONENT_TOKENS}}
---

## Overview

{{BRAND_INTENT}}
<!-- Brand personality and emotional intent. 2-4 lines. -->

## Colors

{{COLOR_PROSE}}
<!-- Semantic roles, not hex restatements. -->

## Typography

{{TYPE_PROSE}}

## Layout

{{LAYOUT_PROSE}}

## Components

{{COMPONENT_PROSE}}
<!-- Style guidance for buttons, inputs, cards. Elevation & Depth / Shapes
     sections may be added before this one when the system needs them. -->

## Do's and Don'ts

{{GUARDRAILS}}

## Decisions

<!-- `### <surface>` per route/screen; entries `- YYYY-MM-DD — <decision>`.
     One line each. Removing one is an explicit, discussed edit. -->
```

- [ ] **Step 2: Commit**

```powershell
git add templates/repo/DESIGN.md.template
git commit -m "feat: add DESIGN.md template to the repo skeleton"
```

---

### Task 3: Generator + its fixture tests

**Files:**
- Create: `C:\Briar\repos\mine\Context-Engineering\scripts\design-md-gen.mjs`
- Create: `C:\Briar\repos\mine\Context-Engineering\tests\fixtures\design-clean\DESIGN.md`
- Create: `C:\Briar\repos\mine\Context-Engineering\tests\fixtures\design-clean\design.tokens.css` (generated, committed)
- Create: `C:\Briar\repos\mine\Context-Engineering\tests\fixtures\design-clean\expected-cssvars.css`
- Create: `C:\Briar\repos\mine\Context-Engineering\tests\run-gen-tests.mjs`
- Modify: `C:\Briar\repos\mine\Context-Engineering\CLAUDE.md` (Commands: add gen self-test line)

**Interfaces:**
- Produces: ESM exports `parseDesignMd(text)` → `{frontmatter, sections, decisions, errors}` and `generate(frontmatter, target)` → css string; Task 4's lint imports BOTH from `./design-md-gen.mjs`. CLI: `node scripts/design-md-gen.mjs <file> --target tailwind4|cssvars` (exit 2 on usage error, exit 1 on parse/reference error, writes `design.tokens.css` next to input).

- [ ] **Step 1: Write the failing test fixture.** `tests/fixtures/design-clean/DESIGN.md` (exactly):

```markdown
---
name: fixture
colors:
  paper: "#F6F4EF"
  ink: "#1E1B16"
  accent: "oklch(0.55 0.15 250)"
typography:
  display:
    fontFamily: "'Fraunces', serif"
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: 1rem
    lineHeight: 1.5
spacing:
  1: 4px
  2: 8px
rounded:
  md: 8px
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "{spacing.2}"
---

## Overview

Fixture system.

## Decisions

### checkout

- 2026-07-30 — Back button top-left on every step.
```

- [ ] **Step 2: Write `tests/run-gen-tests.mjs`** — same zero-dep style as run-lint-tests: import `parseDesignMd`/`generate` from `../scripts/design-md-gen.mjs`, run against the fixture, byte-compare `tailwind4` output with `design-clean/design.tokens.css` and `cssvars` output with `design-clean/expected-cssvars.css`; also assert `parseDesignMd` reports an error for input containing `{colors.missing}`. Print `ok`/`FAIL` per case, exit 1 on any failure.

- [ ] **Step 3: Run it to fail** — `node tests/run-gen-tests.mjs` → expect module-not-found failure.

- [ ] **Step 4: Implement `scripts/design-md-gen.mjs`.** Requirements the tests pin down:
  - Frontmatter parser: token-schema YAML subset — 2-space indentation, `key: value` scalars, nested maps, single/double-quoted strings (quotes stripped), bare scalars kept verbatim. Not full YAML; say so in the header comment.
  - Reference resolution: `{group.token}` and `{group.token.prop}` lookups; unresolved → collected in `errors`, CLI exits 1 listing them.
  - Emission order: source insertion order. Variable mapping exactly as in reference/design-md.md (Task 1); camelCase props → kebab-case.
  - Header (first two lines of output, target interpolated):
    `/* GENERATED from DESIGN.md (target: tailwind4) — do not edit.`
    `   Regenerate: node scripts/design-md-gen.mjs DESIGN.md --target tailwind4 */`
  - `tailwind4` wraps variables in `@theme {`…`}`; `cssvars` in `:root {`…`}`; two-space indent, one var per line, trailing newline.

  Expected `tailwind4` body for the fixture (this IS the byte contract, after the two header lines):

```css
@theme {
  --color-paper: #F6F4EF;
  --color-ink: #1E1B16;
  --color-accent: oklch(0.55 0.15 250);
  --font-display: 'Fraunces', serif;
  --text-display: 2.25rem;
  --text-display--font-weight: 600;
  --text-display--line-height: 1.1;
  --font-body: 'Inter', sans-serif;
  --text-body: 1rem;
  --text-body--line-height: 1.5;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --radius-md: 8px;
  --button-primary-background-color: #1E1B16;
  --button-primary-text-color: #F6F4EF;
  --button-primary-rounded: 8px;
  --button-primary-padding: 8px;
}
```

- [ ] **Step 5: Generate the committed artifacts** — run the CLI on the fixture for `tailwind4` (produces `design-clean/design.tokens.css`), copy the `cssvars` run's output to `design-clean/expected-cssvars.css`.

- [ ] **Step 6: Run tests to pass** — `node tests/run-gen-tests.mjs` → all cases `ok`, exit 0.

- [ ] **Step 7: Add the command to CLAUDE.md** — in `## Commands`, after the lint self-test line, add:

```markdown
- `node tests/run-gen-tests.mjs` — DESIGN.md generator self-test
```

Verify: `(Get-Content CLAUDE.md).Count` ≤60.

- [ ] **Step 8: Commit**

```powershell
git add scripts/design-md-gen.mjs tests/run-gen-tests.mjs tests/fixtures/design-clean CLAUDE.md
git commit -m "feat: add design-md-gen — compiles DESIGN.md tokens to design.tokens.css"
```

---

### Task 4: context-lint design checks

**Files:**
- Modify: `C:\Briar\repos\mine\Context-Engineering\scripts\context-lint.mjs`
- Create: `C:\Briar\repos\mine\Context-Engineering\tests\fixtures\design-bad-a\DESIGN.md` + `design.tokens.css`
- Create: `C:\Briar\repos\mine\Context-Engineering\tests\fixtures\design-bad-b\DESIGN.md`
- Modify: `C:\Briar\repos\mine\Context-Engineering\tests\run-lint-tests.mjs`

**Interfaces:**
- Consumes: `parseDesignMd`, `generate` imported from `./design-md-gen.mjs` (Task 3).
- Produces: finding codes `design-frontmatter`, `design-sections`, `design-ref`, `design-decisions`, `design-drift`, `design-ungenerated`.

- [ ] **Step 1: Write fixture `design-bad-a`** (drift + undated decision + out-of-order sections). `DESIGN.md`:

```markdown
---
name: bad-a
colors:
  ink: "#1E1B16"
---

## Typography

Out of order on purpose.

## Colors

Ink.

## Decisions

### checkout

- Back button top-left, entry without a date.
```

`design.tokens.css` (stale on purpose — value differs from a fresh generation):

```css
/* GENERATED from DESIGN.md (target: cssvars) — do not edit.
   Regenerate: node scripts/design-md-gen.mjs DESIGN.md --target cssvars */
:root {
  --color-ink: #000000;
}
```

- [ ] **Step 2: Write fixture `design-bad-b`** (dangling ref + tokens without generated file). `DESIGN.md`:

```markdown
---
name: bad-b
colors:
  ink: "#1E1B16"
components:
  button-primary:
    textColor: "{colors.missing}"
---

## Overview

Fixture with a dangling reference and no generated file.
```

- [ ] **Step 3: Add the test cases** to `tests/run-lint-tests.mjs` after the global-layer case:

```js
  {
    name: "clean DESIGN.md passes",
    path: join(here, "fixtures", "design-clean"),
    fail: false,
    expect: [],
    forbid: ["design-frontmatter", "design-sections", "design-ref", "design-decisions", "design-drift", "design-ungenerated"],
  },
  {
    name: "drifted/undated DESIGN.md fails",
    path: join(here, "fixtures", "design-bad-a"),
    fail: true,
    expect: ["design-decisions", "design-sections", "design-drift"],
  },
  {
    name: "dangling-ref/ungenerated DESIGN.md fails",
    path: join(here, "fixtures", "design-bad-b"),
    fail: true,
    expect: ["design-ref", "design-ungenerated"],
  },
```

- [ ] **Step 4: Run to fail** — `node tests/run-lint-tests.mjs` → the three new cases FAIL (codes not produced yet).

- [ ] **Step 5: Implement the checks** in `context-lint.mjs`, new section after the skills checks, header comment citing `reference/design-md.md`:
  - Discover `files.filter(basename === "DESIGN.md")`; skip everything when none.
  - `import { parseDesignMd, generate } from "./design-md-gen.mjs";` at top.
  - Per file: parse → no frontmatter or missing `name` → `design-frontmatter` (medium). Parse errors from references → `design-ref` (medium, one per unresolved ref).
  - Known prose sections `["Overview","Colors","Typography","Layout","Elevation & Depth","Shapes","Components","Do's and Don'ts"]`: out of order → `design-sections` (low); duplicate heading → `design-sections` (high).
  - Lines starting `- ` under `## Decisions` not matching `/^- \d{4}-\d{2}-\d{2} — /` → `design-decisions` (medium, with line number).
  - Adjacent `design.tokens.css`: absent while frontmatter has any token group → `design-ungenerated` (medium). Present → read target from the header line, regenerate in memory (skip when refs failed — already reported) and byte-compare → mismatch or unreadable header → `design-drift` (high).

- [ ] **Step 6: Run to pass** — `node tests/run-lint-tests.mjs` → all 8 cases; `node tests/run-gen-tests.mjs` still green; self-lint `node scripts/context-lint.mjs . --ignore examples,tests` still PASS.

- [ ] **Step 7: Commit**

```powershell
git add scripts/context-lint.mjs tests/
git commit -m "feat: lint the DESIGN.md convention (structure, decisions, drift)"
```

---

### Task 5: Audit rows + context-init offer

**Files:**
- Modify: `C:\Briar\repos\mine\Context-Engineering\skills\context-audit\references\checklist.md`
- Modify: `C:\Briar\repos\mine\Context-Engineering\skills\context-init\SKILL.md`

- [ ] **Step 1: Append to checklist.md** (new section at the end; add `- Design checks` to its Contents list):

```markdown
## Design checks (only for repos/apps with UI)

| Check | Pass condition | Severity |
|---|---|---|
| DESIGN.md presence | Every app with UI carries one (root or app root) | medium |
| Token consumption | Components use generated tokens; no raw hex/px duplicating an existing token | medium |
| Decisions honored | No `## Decisions` entry contradicted by current code | high |
| Compilation | Tokens edited only in frontmatter; `design.tokens.css` regenerated (lint `design-drift` clean) | medium |
```

- [ ] **Step 2: Wire the offer into context-init SKILL.md.** In step 6 (Instantiate), after the sentence ending "Keep existing README/LICENSE.", insert:

```markdown
UI stack detected in step 1 (frontend framework in the manifests): offer
`DESIGN.md.template` per app — opt-in, per `reference/design-md.md`.
```

- [ ] **Step 3: Walk the three context-init evals** (`skills/context-init/evals/`) — confirm expected behaviors still hold with the added sentence (no eval contradicts an opt-in offer). If any eval needs the offer reflected, update the EVAL first, then re-check the skill text.

- [ ] **Step 4: Self-lint + commit, ff-merge the CE branch**

```powershell
node scripts/context-lint.mjs . --ignore examples,tests   # PASS
node tests/run-lint-tests.mjs; node tests/run-gen-tests.mjs
git add skills/; git commit -m "feat: audit design checks; context-init offers DESIGN.md for UI repos"
git switch main; git merge --ff-only feat/design-md; git branch -d feat/design-md
```

---

### Task 6: `designing-consistently` skill (skills repo, via superpowers:writing-skills)

**Files:**
- Create: `C:\Briar\repos\mine\skills\skills\designing-consistently\evals\eval-01.md` … `eval-03.md`
- Create: `C:\Briar\repos\mine\skills\skills\designing-consistently\SKILL.md`
- Modify: `C:\Briar\repos\mine\skills\README.md` (table row + judgment note)

**Interfaces:**
- Consumes: the convention from Task 1 (reference/design-md.md) and generator CLI (Task 3).

- [ ] **Step 1: Invoke `superpowers:writing-skills`** and follow its process for this skill; the steps below are the content contract, evals FIRST (repo hard constraint).

- [ ] **Step 2: Write eval-01** (decision persistence — the disappearing back button):

```markdown
# Eval 01: standing decision must survive an edit

## Query

"Agregale a la vista de visitante del dashboard un panel con el historial de
sesiones."

## Fixture

An app with `DESIGN.md` whose `## Decisions` contains
`### analiticas/visitante` → `- 2026-07-20 — Back button top-left, always
visible.` The current page component includes that back button.

## Expected behavior

- [ ] Reads the `## Decisions` entries for `analiticas/visitante` BEFORE
      editing the page.
- [ ] The delivered page still renders the back button top-left.
- [ ] If the new panel design conflicts with the decision, raises it with
      the user instead of silently dropping the button.
```

- [ ] **Step 3: Write eval-02** (consume, don't invent):

```markdown
# Eval 02: new element consumes the system

## Query

"Haceme un botón para exportar CSV en la vista de personas."

## Fixture

`DESIGN.md` frontmatter defines `colors`, `rounded`, and
`components.button-primary`; `design.tokens.css` is generated and current.

## Expected behavior

- [ ] The new button consumes `--button-primary-*` / token variables — zero
      raw hex, px radii, or ad hoc padding.
- [ ] No parallel button style is created while `button-primary` fits.
- [ ] If a genuinely new variant is needed, its tokens are added to
      DESIGN.md frontmatter and `design.tokens.css` is regenerated — the
      variant is born tokenized.
```

- [ ] **Step 4: Write eval-03** (gated recording):

```markdown
# Eval 03: unrecorded decision blocks completion

## Query

"Listo, me gusta como quedó el empty state nuevo, cerrá la tarea."

## Fixture

During the session a new empty-state pattern (icon + one-line hint + primary
action) was designed for `catalogo/inventario`; `## Decisions` has no entry
for it yet.

## Expected behavior

- [ ] Completion is NOT claimed while the decision is unrecorded.
- [ ] Appends `- YYYY-MM-DD — <decision>` (today's date) under
      `### catalogo/inventario`, one line.
- [ ] Only then reports done, mentioning the recorded entry.
```

- [ ] **Step 5: Write SKILL.md** (exactly this content):

```markdown
---
name: designing-consistently
description: Keeps UI work consistent with an app's DESIGN.md — reads its tokens and per-surface decisions before building, consumes generated tokens instead of inventing styles, and records every new design decision back into the file as a gated step. Use when building or modifying UI in a repo that has (or should have) a DESIGN.md, when a page must match existing screens, or when design decisions keep getting lost between sessions.
---

# Designing consistently

UI drift has two sources: styles invented in-session instead of consumed
from the system, and decisions that live only in conversation memory. This
skill closes both: DESIGN.md is read before touching UI and updated before
claiming done.

## Workflow

Copy this checklist and tick items off:

```
Consistency progress:
- [ ] 1. Locate the app's DESIGN.md
- [ ] 2. Read tokens + Decisions for the target surfaces
- [ ] 3. Build consuming the system
- [ ] 4. Record decisions (gate)
- [ ] 5. Verify
```

**1. Locate.** Single-app repo: root DESIGN.md. Monorepo: the app's own
DESIGN.md next to its code. Missing? Offer to instantiate it first
(Context-Engineering `templates/repo/DESIGN.md.template`) — designing
without it just recreates the drift.

**2. Read.** From the frontmatter: the tokens and components the work will
need. From `## Decisions`: every entry under the surfaces (routes/screens)
about to be touched — these are standing decisions, not suggestions.

**3. Build.** Styles come from the generated `design.tokens.css`, never raw
values. Reuse an existing component pattern when one fits; a genuinely new
pattern is born tokenized: values added to DESIGN.md frontmatter, then
`node scripts/design-md-gen.mjs` regenerates. A standing decision the work
conflicts with is renegotiated with the user — never silently overridden.

**4. Record (gate).** Every design decision made this session — new
patterns, changed interactions, layout choices someone could contradict
later — gets `- YYYY-MM-DD — <decision>` under its `### <surface>`. Work is
not complete while an unrecorded decision exists.

**5. Verify.** Regenerate tokens and run context-lint (design checks must
pass). Re-check each touched surface against its Decisions entries.
Screenshot the result when the environment allows it.

## Judgment notes

- Consistency beats novelty by default; when the brief explicitly asks for
  a new direction, update DESIGN.md first, then build.
- Decisions entries are one line each — longer rationale belongs in the
  prose sections, referenced from the entry.
- If DESIGN.md and the code disagree, say so and ask which is right —
  never pick silently.
```

- [ ] **Step 6: Walk the 3 evals against the skill text** (writing-skills verification: run each Query mentally or via subagent against the fixture + SKILL.md; every checklist item must be satisfiable from the skill's instructions alone). Fix skill text (not evals) on gaps.

- [ ] **Step 7: README updates.** Add to the Skills table:

```markdown
| [`designing-consistently/`](skills/designing-consistently/) | Keeps UI work consistent with an app's DESIGN.md: read before building, consume tokens, record decisions as a gated step |
```

After the intro paragraph (before `## Skills`), add:

```markdown
These skills encode personal judgment — opinionated guidance over rule
lists, per the Claude 5-era shift the standard is built on.
```

- [ ] **Step 8: Lint + commit + ff-merge**

```powershell
cd C:\Briar\repos\mine\skills; git switch -c feat/designing-consistently
node ..\Context-Engineering\scripts\context-lint.mjs .   # PASS
git add skills/designing-consistently README.md
git commit -m "feat: add designing-consistently — DESIGN.md read-consume-record loop"
git switch main; git merge --ff-only feat/designing-consistently; git branch -d feat/designing-consistently
```

---

### Task 7: End-to-end verification and sync

- [ ] **Step 1: Full CE gate** — `node tests/run-lint-tests.mjs` (8 cases), `node tests/run-gen-tests.mjs`, self-lint PASS, clean tree.
- [ ] **Step 2: skills repo gate** — lint PASS, clean tree, 3 skills × 3 evals present: `(Get-ChildItem -Recurse -Filter eval-*.md C:\Briar\repos\mine\skills\skills).Count` → 9.
- [ ] **Step 3: Push both repos** — `git -C C:\Briar\repos\mine\Context-Engineering push; git -C C:\Briar\repos\mine\skills push` → fast-forward.
- [ ] **Step 4: Report** — audit deltas, new lint codes, and the follow-up queue: (a) writing-skills review pass over `reviewing-plans` + `tracing-root-causes`, (b) sub-project 2: KioscoDiagonal migration + DESIGN.md conversion.
