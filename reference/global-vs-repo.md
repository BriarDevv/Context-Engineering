# Global vs repo placement

Source: [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)
(auto-memory shift); this repo's design spec. Retrieved 2026-07-30.

## The criterion

- **Global (`~/.claude`)** = facts about the USER and how they work
  everywhere: language/tone (rioplatense chat, English technical artifacts),
  cross-project safety rules, universal working style. Plus skills that are
  useful from any repo (`context-init`, `context-audit`).
- **Repo (`CLAUDE.md`, `.claude/`)** = facts about the PROJECT: commands,
  gotchas, hard constraints, project-specific workflows (as repo skills).
- **Auto-memory** = session-learned facts. Never hand-write memory content
  into CLAUDE.md at either level; if it was learned while working, memory
  owns it.

## The duplication test

- Would the same line appear in more than one repo's CLAUDE.md? → it belongs
  global (or nowhere).
- Does it only matter to one project? → it never goes global.
- Is it about neither the user nor one project (general how-to knowledge)?
  → it is a skill, or it is nothing.

## Global CLAUDE.md budget

≤40 lines. Identity/tone, safety, minimal working style. Zero procedural
content — workflows live in global skills with progressive disclosure.
The file's H1 is `# Global instructions` — tooling (context-lint) recognizes
the global canon by that title.
