# ADR: oh-my-claudecode (OMC) keep/drop/replace decision

Date: 2026-07-30
Status: Accepted <!-- user instructed removal 2026-07-30 ("sacame OMC"), after
the 19-agent audit confirmed the matrix below; methodologies salvaged first
(ADR-002); statusline replaced by the standalone hud repo -->

## Context

OMC was installed 2026-07-30 (same-day CLAUDE.md backups; near-empty
history.jsonl, 11 lines). It adds: a ~110-line always-loaded block in
`~/.claude/CLAUDE.md`, 19 global agents, ~37 skills, hooks on 6 events, and a
HUD/statusline. Usage evidence: **zero invocations** of any OMC skill keyword
(autopilot, ralph, ultrawork, ralplan, omc-*, team, …) — meaning "no usage yet
on a fresh install", not "tried and abandoned". Meanwhile the native 2026
stack already active on this machine covers much of the same ground: native
agent types, superpowers plugin (brainstorming → plans → subagent execution),
auto-memory, /doctor, native tasks, /loop, /schedule, and Workflow/ultracode
orchestration.

## Evidence matrix

| Component | Native-2026 duplicate? | Used? | Paradigm conflict? | Verdict |
|---|---|---|---|---|
| CLAUDE.md block (~110 lines, always loaded) | Largely (task tools, verification norms, AskUserQuestion guidance are native) | n/a | HIGH: rule-heavy 2025 style, delegation tables, keyword magic | **replace** with `global/CLAUDE.md` (31 lines) |
| 19 agents (executor, explore, verifier, code-reviewer, planner, architect, critic, …) | Mostly: native agent types + superpowers flows overlap ~15/19 | 0 | Medium: model-routing rules fight judgment | **drop**; recreate individually on demand per `reference/agents.md` decision rule (tracer/qa-tester/git-master are the only non-obvious losses) |
| Loop skills (autopilot, ralph, ultrawork, ralplan, team, ultragoal) | Native /loop, /schedule, Workflow+ultracode cover the core loop/orchestration needs | 0 | Medium: keyword-trigger magic | **drop**; revisit only if a concrete loop need exceeds native tooling |
| Utility skills (deepinit≈/init, skillify≈writing-skills, wiki, deep-dive, …) | Yes, near-total | 0 | Low | **drop** |
| Infra skills (omc-setup, omc-doctor, omc-reference, cancel, hud) | n/a (OMC self-management) | 0 | Low | **drop** with OMC itself |
| Hooks (6 events) | Auto-memory + skills replace reminder-injection | n/a | HIGH: upfront context injection; fragile (setup wiped hook events once — see memory note) | **drop** |
| Statusline/HUD | Cosmetic | — | None | user preference; keep only if missed |

## Decision (recommended end-state)

Uninstall OMC entirely; the global layer becomes `global/CLAUDE.md` (31
lines) + the two Context-Engineering skills + the plugins already enabled
(superpowers, context7, frontend-design, playwright, chrome-devtools).

Migration path: (1) approve this ADR; (2) workstation installer writes
`global/CLAUDE.md` to `~/.claude/CLAUDE.md` WITHOUT the OMC block; (3) remove
OMC agents/skills/hooks via OMC's uninstaller (or omc setup removal path);
(4) run one week of normal work; anything genuinely missed gets recreated
deliberately (agent or skill) under the `reference/agents.md` rule.

Rollback: reinstall with `omc setup --force-hooks` + workstation installer
(per existing memory note), which restores block, agents, skills, and hooks.

## Consequences

- Global always-loaded context drops from ~110+40 lines to ~31.
- One orchestration paradigm (native + superpowers) instead of two competing
  ones; no keyword-trigger magic.
- Harder: if ralph-style infinite loops become a real workflow, they must be
  rebuilt on /loop + Workflow, or OMC selectively reinstalled.

## Alternatives considered

- Keep OMC fully — rejected: highest-conflict component is the always-loaded
  block; zero usage evidence to justify it.
- Keep loop skills only — rejected for now: no usage yet; native /loop +
  Workflow unexplored; can revisit with evidence.
