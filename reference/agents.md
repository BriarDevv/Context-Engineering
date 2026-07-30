# Custom agents: when and how

Sources: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
(sub-agent architectures); Claude Code agent docs. Retrieved 2026-07-30.

## Decision rule

Create a custom agent ONLY when both hold:

1. A **recurring role** needs a distinct system prompt or tool restriction
   that a skill cannot express (e.g. a reviewer that must never edit files).
2. **No native agent type already covers it.** Claude Code ships general
   search/plan/execute agent types, and installed plugins add more. Inventory
   before authoring.

Otherwise: use a native subagent, optionally pointed at a skill. A skill
changes *how* an agent works; an agent changes *who* is working. Most needs
are skill-shaped.

## Sub-agent architecture principle

A sub-agent exists to protect the caller's context: it may burn tens of
thousands of tokens exploring, but returns only a condensed, high-signal
result. Design the return contract first ("return the 5 files and the reason,
not the file contents"), then the prompt.

## Placement

- Global (`~/.claude/agents/*.md`): roles useful from any repo.
- Repo (`.claude/agents/`): roles that only make sense in one project.
  Rare — prefer repo skills.

## History

The 2025-era OMC pack (19 global agents, 2,570 lines) was audited and removed
2026-07-30: nearly all duplicated native agent types or plugins, and the two
genuinely useful methodologies were salvaged as skills (`tracing-root-causes`,
`reviewing-plans`), now maintained in the standalone `skills` repo. Full
matrix: `docs/adrs/ADR-003-omc-removal.md`. The
cautionary tale behind the decision rule above: inventory before authoring.
