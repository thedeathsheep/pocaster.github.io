# Agent Instructions

## Read only what the task needs

1. Read `PROJECT.md` for stable facts and protected boundaries.
2. Read `CURRENT.md` for current state and known issues.
3. Read `STYLE.md` before changing public-facing copy, layout, or visuals.
4. When `TASK.md` exists, treat it as the active scope and acceptance contract.
5. Read `DEPLOYMENT.md` only for deployment or environment work.

Do not load the full post archive, large evidence folders, or unrelated histories unless the task requires them.

## Safety and scope

- Preserve unrelated user changes; never discard or reformat them.
- Never use broad staging such as `git add .`; stage explicit files only.
- Do not commit, push, deploy, or change server state unless explicitly requested.
- Never publish credentials, private keys, internal Feishu links, customer data, or raw confidential documents.
- Do not modify the Echo or Another History deployments while working on this repository.

## Work quality

- Preserve the editorial direction in `STYLE.md`.
- Prefer the smallest change that satisfies the task.
- Run `powershell -ExecutionPolicy Bypass -File scripts/site.ps1 check` before claiming completion.
- Report changed files, checks run, and remaining uncertainty.

## Delegation

Describe mechanical implementation in a temporary `TASK.md` copied from `TASK_TEMPLATE.md`. Do not expand its scope without asking.

