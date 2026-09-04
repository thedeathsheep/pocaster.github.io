# Current State

Last updated: 2026-09-04

## Production

- Public site: `https://inevitable-event.com`.
- Latest manual deployment returned HTTP 200 for the Infinite Canvas case.
- Normal deployment path is GitHub Actions after a push to `redesign-frame-system`.

## Active development

- Integration branch: `redesign-frame-system`.
- Workflow-infrastructure branch: `practical-agent-workflow`.
- Current objective: establish shared context and safe commands for Codex, Cursor, and Claude-compatible clients.

## Known issues

- Legacy posts produce Liquid warnings during builds.
- Future-dated posts may be skipped by Jekyll; this is expected until their publication date.
- Some case-study images still need stronger selection or replacement.
- The working repository may contain unrelated user changes. Never stage broadly.

## Next task

After this workflow is merged, use `TASK_TEMPLATE.md` to prepare one narrow `TASK.md` for delegated mechanical work. Update this file only when project state materially changes.

