# Practical Agent Workflow Design

## Goal

Reduce repeated context loading and expensive multi-agent discussion while preserving reliable implementation, review, and deployment for the Inevitable Event repository.

## Operating model

Codex owns scope, product judgment, safety boundaries, review, verification, and final delivery. Claude CLI may receive one compact implementation brief for mechanical or high-volume edits. The user should not manually relay prompts between agents.

Small or judgment-heavy changes remain with Codex. Delegation is only worthwhile when the implementation volume is larger than the handoff and review cost.

## Repository knowledge layers

The system uses four short, stable documents instead of replaying conversation history:

- `PROJECT.md`: stable project identity, architecture, pages, domains, repositories, and protected boundaries.
- `STYLE.md`: visual direction, language rules, case-study structure, and anti-patterns.
- `CURRENT.md`: current branch, active work, known issues, and the next meaningful task. This is the only frequently updated context file.
- `TASK_TEMPLATE.md`: a compact implementation contract for delegated work: outcome, scope, constraints, evidence, acceptance checks, and files likely involved.

`DEPLOYMENT.md` remains the operational source for local preview, GitHub Actions, SSH, Nginx, and recovery. It should not duplicate product or style guidance.

## Agent integration

- Root `AGENTS.md` instructs Codex and compatible agents to read only the minimum relevant context, protect unrelated dirty changes, distinguish facts from assumptions, and verify before completion.
- `.cursor/rules/project.mdc` replaces the stale GitHub Pages-era Cursor rule. It points Cursor to the same knowledge files and requires scoped edits and concise output.
- `.claude/CLAUDE.md` gives Claude CLI the same boundaries and tells it to use `TASK.md` when present.
- `TASK.md` is an optional, temporary working brief. It is ignored by Git and can be overwritten per delegated task.

## Command interface

`scripts/site.ps1` exposes four explicit actions:

- `preview`: start Jekyll locally at `127.0.0.1:4000` with LiveReload.
- `check`: run a clean Jekyll build and report repository status without modifying Git state.
- `status`: show branch, concise dirty-file status, recent commits, and deployment workflow location.
- `publish`: require the correct branch, run `check`, require at least one commit ahead of the remote, then push the current branch. It never stages or commits files automatically.

The script must fail early with readable messages. It must not delete files, stage all changes, rewrite history, or deploy directly over SSH.

## Delegation flow

1. Codex reads `PROJECT.md`, `CURRENT.md`, and only the task-relevant files.
2. Codex decides whether delegation has positive value.
3. If delegated, Codex writes a concise `TASK.md` and runs Claude CLI once in non-interactive mode.
4. Claude edits only the declared scope and returns a short completion summary.
5. Codex reviews `git diff`, runs `scripts/site.ps1 check`, and inspects the affected page when visual behavior changed.
6. Codex makes any judgment-heavy correction, updates `CURRENT.md` only when project state materially changed, and commits scoped files.

There is no model-to-model debate and no forwarding of full chat history.

## Safety boundaries

- Never commit SSH private keys, internal Feishu URLs, customer information, or unpublished work evidence.
- Never use `git add .` in a dirty repository without an explicit full-scope request.
- Never overwrite `/var/www/echo` or `/var/www/anotherhistory` when publishing the portfolio.
- `publish` triggers the existing GitHub Actions workflow; manual SSH deployment remains a documented fallback.
- Generated build output and task scratch files stay ignored.

## Acceptance criteria

- A new agent can understand the project by reading no more than `PROJECT.md`, `CURRENT.md`, and the relevant style/deployment document.
- Cursor and Claude receive consistent instructions derived from the same source files.
- `scripts/site.ps1 check`, `status`, and `preview` work from any PowerShell directory.
- `publish` refuses the wrong branch and never stages or commits files.
- Existing Jekyll output builds successfully.
- No private key material or internal source URL appears in tracked files.
