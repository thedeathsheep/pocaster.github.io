# Practical Agent Workflow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a low-maintenance shared context and command system for Codex, Cursor, and Claude without duplicating project history.

**Architecture:** Stable project and style context live in focused root documents; volatile state lives in `CURRENT.md`; editor-specific files only point to these sources. One PowerShell command wrapper provides deterministic preview, check, status, and publish behavior.

**Tech Stack:** Markdown, Cursor MDC rules, PowerShell, Jekyll, Git, GitHub Actions.

---

## Chunk 1: Shared context

### Task 1: Create canonical context files

**Files:**
- Create: `PROJECT.md`
- Create: `STYLE.md`
- Create: `CURRENT.md`
- Create: `TASK_TEMPLATE.md`
- Modify: `DEPLOYMENT.md`

- [ ] Extract stable project facts from `DEPLOYMENT.md` into `PROJECT.md`.
- [ ] Record current visual and editorial constraints in `STYLE.md`.
- [ ] Record branch, deployed state, known issues, and next work in `CURRENT.md`.
- [ ] Create a compact delegated-task contract in `TASK_TEMPLATE.md`.
- [ ] Remove duplicated project-description sections from `DEPLOYMENT.md` and link to `PROJECT.md`.
- [ ] Check that no internal URLs or private keys were introduced.
- [ ] Commit only these documentation files.

## Chunk 2: Agent adapters

### Task 2: Give all agents the same boundaries

**Files:**
- Create: `AGENTS.md`
- Replace: `.cursor/rules/post.mdc`
- Create: `.claude/CLAUDE.md`
- Modify: `.gitignore`

- [ ] Add minimum-context, dirty-worktree, privacy, verification, and delegation rules to `AGENTS.md`.
- [ ] Replace the stale GitHub Pages Cursor rule with a concise always-applied project rule.
- [ ] Add matching Claude CLI instructions that require `TASK.md` when delegated.
- [ ] Ignore temporary `TASK.md` and local deployment archives without changing unrelated ignore rules.
- [ ] Review the diff for duplicated or contradictory instructions.
- [ ] Commit only agent adapter files.

## Chunk 3: Command interface

### Task 3: Implement and verify the site command wrapper

**Files:**
- Create: `scripts/site.ps1`
- Modify: `README.md`

- [ ] Implement `preview`, `check`, `status`, and `publish` actions with repository-root discovery.
- [ ] Ensure `publish` never stages or commits files and refuses non-`redesign-frame-system` branches.
- [ ] Document the four commands in `README.md`.
- [ ] Run `scripts/site.ps1 status` and confirm branch/status output.
- [ ] Run `scripts/site.ps1 check` and confirm Jekyll build succeeds.
- [ ] Run a safe wrong-branch/unit-style validation of the publish guard without pushing.
- [ ] Scan tracked changes for private-key headers and internal Feishu URLs.
- [ ] Commit only the command wrapper and README changes.
