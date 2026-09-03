# Research Dossier Case Studies Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Infinite Canvas and 3D Director's Desk as complete evidence-led public research dossiers.

**Architecture:** Keep Jekyll Markdown as the source of narrative and add a dossier option to the existing case-study layout. Reusable includes produce evidence figures, decision ledgers, and title-only private archive indices. All public visuals live in local assets; no internal Feishu URL appears on the site.

**Tech Stack:** Jekyll, Liquid includes, Markdown, scoped CSS, local image assets, `bundle exec jekyll build`.

---

## Chunk 1: Dossier visual primitives

### Task 1: Add a dossier reading shell

**Files:** Modify `_layouts/case-study.html`, `assets/css/case-study.css`.

- [ ] Add a `page.case_format == "dossier"` layout branch. It retains the existing hero but adds a semantic desktop rail with anchor links: Situation, Evidence, Tension, Decisions, Prototype, Validation, Archive.
- [ ] Add scoped CSS for a wide editorial grid: sticky 10–12rem desktop rail, hairline rules, monospace labels, and a compact mobile index. Do not affect normal blog pages or existing Echo/Another History cases.
- [ ] Run `bundle exec jekyll build` before and after the change. Confirm generated Canvas HTML contains `case-dossier`, `#evidence`, and `#archive`.
- [ ] Commit only layout/CSS: `git commit -m "feat: add dossier case layout"`.

### Task 2: Add reusable documentary components

**Files:** Create `_includes/case-evidence.html`, `_includes/case-decision-ledger.html`, `_includes/case-source-index.html`; modify `assets/css/case-study.css`.

- [ ] `case-evidence.html` accepts `id`, `src`, `alt`, `caption`, `claim`, optional `note`, and renders a semantic figure with an `EVIDENCE / NN` marker.
- [ ] `case-decision-ledger.html` accepts `alternatives`, `decision`, `why_now`, `excluded` and renders a four-part definition list.
- [ ] `case-source-index.html` renders internal source titles only, plus a fixed confidentiality note; it never emits clickable private links.
- [ ] Add primary-figure, paired-evidence, margin-note, and caption styles; force one column on mobile.
- [ ] Build with a missing optional evidence note and verify no empty container is generated. Commit components: `git commit -m "feat: add case dossier evidence components"`.

## Chunk 2: Infinite Canvas dossier

### Task 3: Curate publishable Canvas evidence

**Files:** Create `assets/img/projects/infinite-canvas/evidence/`; add a local evidence manifest beside `projects/infinite-canvas.md`.

- [ ] Use the read-only Feishu archive and local evidence index to catalogue source title, material type, publication risk, claim, and final filename.
- [ ] Prepare at least four claims: node-management prototype; production-object model; two starting paths (script vs shot); source/reference/result writeback flow.
- [ ] Tag every item as `Prototype`, `Diagram`, or `Competitor reference`. Never present a competitor screen as SumengAI UI.
- [ ] Check every final file is nonzero and named for its claim.

### Task 4: Rewrite Infinite Canvas

**Files:** Modify `projects/infinite-canvas.md`; test `_site/projects/infinite-canvas/index.html`.

- [ ] Set `case_format: dossier`.
- [ ] Use anchors in this order: Situation, Evidence, Tension, Decisions, Prototype, Validation, Archive.
- [ ] Start from the fragmented production workflow, not a product introduction.
- [ ] Bind every evidence figure to a decision-level claim using `case-evidence.html`.
- [ ] Add decision ledgers for generic whiteboard vs production-object canvas, and chat-first vs context-writing Agent.
- [ ] Validation names re-binding/re-upload behavior, cross-shot reuse, time to first usable result, and entry-path completion.
- [ ] Archive lists private document titles without URLs. Build and scan for `my.feishu.cn`, `larksuite`, and personal/customer data. Commit: `git commit -m "feat: expand infinite canvas research dossier"`.

## Chunk 3: 3D Director's Desk dossier

### Task 5: Curate publishable Director's Desk evidence

**Files:** Create `assets/img/projects/3d-directors-desk/evidence/`; use existing `director-panel.png` only as a labelled competitor baseline.

- [ ] Prepare four claims: competitor baseline, semantic-directing interaction model, golden-task sequence, and scope/risk matrix.
- [ ] Keep only redacted source fragments and self-authored diagrams; do not publish internal discussions, user content, or full confidential documents.
- [ ] Check figure labels are readable at 768px wide.

### Task 6: Rewrite 3D Director's Desk

**Files:** Modify `projects/3d-directors-desk.md`; test `_site/projects/3d-directors-desk/index.html`.

- [ ] Set `case_format: dossier` and use the same seven-part order.
- [ ] Open on the repeated failure of multi-shot spatial relationships, not “a 3D tool.”
- [ ] Use a four-way tension grid: creator accessibility, spatial fidelity, downstream controllability, generation cost.
- [ ] Add decision ledgers for director language vs DCC language, RGB reference vs structured control, and V1 scene planning vs simplified Blender.
- [ ] Add golden task, planned cohort, captured behaviors, baseline comparison, and non-goals. Label targets as planned validation thresholds.
- [ ] Add a title-only archive and build scan. Commit: `git commit -m "feat: expand 3d director desk research dossier"`.

## Chunk 4: Regression and safety review

### Task 7: Review output and privacy

**Files:** Modify only if findings require it: layout, scoped CSS, dossier Markdown, or local assets.

- [ ] Run `bundle exec jekyll build`. Existing future-post and legacy Liquid warnings may remain; new dossier files must add no warnings.
- [ ] Review both pages at 1440px: rail position, chapter hierarchy, figure/caption pairing, annotation contrast, and evidence rhythm.
- [ ] Review both at 390px: no horizontal scroll, rail no longer sticky, figures and captions remain adjacent.
- [ ] Scan: `rg -n "my\\.feishu\\.cn|larksuite|reelmate\\.feishu|手机号" projects/infinite-canvas.md projects/3d-directors-desk.md assets/img/projects`.
- [ ] Commit only final verification changes: `git commit -m "fix: refine dossier case reading experience"`.
