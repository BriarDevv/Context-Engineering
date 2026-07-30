# Context engineering principles

Sources: [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)
(2026-07-24); [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
Retrieved 2026-07-30.

## Attention budget

Context is a finite public good. The goal is always the **smallest possible set
of high-signal tokens** that maximizes the likelihood of the desired outcome.
Every line in an always-loaded file (CLAUDE.md, skill descriptions) competes
with conversation history and task content. Anthropic removed >80% of Claude
Code's system prompt for Claude 5 models with no measurable eval loss.

## The six shifts

1. **Rules → judgment.** Then: explicit constraints to prevent worst cases.
   Now: state intent and let the model judge. Hard rules only for genuine
   safety ("never commit .env"), not taste ("one-line comments max").
2. **Examples → interface design.** Then: usage examples for every tool.
   Now: self-describing interfaces (enums, typed parameters, good names)
   communicate intended use without examples.
3. **Upfront context → progressive disclosure.** Then: everything in the
   system prompt / CLAUDE.md. Now: short always-loaded core + skills and
   reference files loaded when relevant.
4. **Duplication → single source.** Then: instructions repeated in prompt and
   tool descriptions. Now: each instruction lives in exactly one place — the
   tool/skill definition that owns it.
5. **Manual memory → auto-memory.** Then: hand-curated memory notes in
   CLAUDE.md. Now: auto-memory captures session-learned facts; CLAUDE.md never
   stores what memory handles.
6. **Prose specs → rich references.** Then: markdown descriptions of intent.
   Now: tests, HTML mockups, rubrics, and code as specification — executable
   or inspectable artifacts beat prose.

## Right altitude

System-level guidance must be specific enough to guide behavior and flexible
enough to leave heuristics to the model. Two failure modes: brittle hardcoded
logic (breaks on the first unanticipated case) and vague platitudes (no signal).
Write the constraint that survives both tests, or write nothing.

## Just-in-time retrieval

Agents discover context at runtime through the filesystem. Folder hierarchy
and naming conventions are **signals** that guide retrieval — never mandatory
read orders. A map (short pointer list) is acceptable; a toll ("read X before
doing anything") is not. Metadata beats content: a well-named file teaches
before it is opened.

## Long-horizon techniques

- **Sub-agents**: isolate exploration in a separate context; return only a
  condensed result to the caller.
- **Compaction**: when nearing the window limit, summarize preserving
  decisions and open issues, discard stale tool output.
- **Note-taking**: persistent state files (progress, decisions) survive
  context resets.

## The "Claude is already smart" test

Challenge every line of every context file: could the model infer this from
the filesystem, the code, or common sense? If yes, delete it. Only
non-inferable knowledge (owner intent, tribal gotchas, genuine constraints)
earns tokens.
