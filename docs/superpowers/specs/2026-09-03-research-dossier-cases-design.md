# Research dossier case studies

## Purpose

Turn the Infinite Canvas and 3D Director's Desk pages from short product summaries into complete public research dossiers. The reader is a peer, creator, or collaborator first; hiring value comes from the quality of observation, product judgment, and evidence.

## Narrative structure

Each page follows the same reading order, while retaining project-specific material:

1. **Situation** — a concrete production failure, not a product introduction.
2. **Evidence** — research fragments, annotated competitor walkthroughs, prototype crops, and observed user signals.
3. **Tension** — the competing user, system, business, and scope constraints.
4. **Decision ledger** — options considered, the decision made, why it was made now, and what was excluded.
5. **Prototype / operating model** — interface details or system flows that make the decision executable.
6. **Validation** — success signals, test task, instrumentation, risks, and unresolved hypotheses.
7. **Private archive** — a redacted index of original internal research, PRDs, walkthroughs, and reviews. No internal URLs, client material, or confidential UI is publicly linked.

## Visual system

- Warm paper background and black editorial typography inherit the current site language.
- Evidence images are never free-floating decoration. Every figure has an evidence ID, a caption that states the observation, and a margin annotation that explains its consequence.
- Images are sequenced by claim rather than treated as a gallery: a full-width primary evidence figure, paired evidence crops, and occasional annotated comparison plates.
- Section labels encode actual reading order: `SITUATION`, `EVIDENCE`, `TENSION`, `DECISION`, `PROTOTYPE`, `VALIDATION`, `ARCHIVE`.
- The persistent side rail shows the dossier order and current reading position on desktop; it collapses into a compact index on small screens.
- The decision ledger uses a repeated four-field structure: `ALTERNATIVES`, `DECISION`, `WHY NOW`, `EXCLUDED`.
- Images, quotes, risk registers, scope matrices, and test plans all use one documentary visual vocabulary: rules, caption blocks, monospace IDs, and restrained blue/pink signals.

## Material plan

### Infinite Canvas

- Existing node-management prototype.
- Crops or redacted reconstructions from canvas/Agent competitor research.
- Script-to-node, asset-to-shot, and result-writeback flow diagrams based on the original PRDs.
- Three-user-group synthesis, node semantic model, and P0/P1 scope matrix.
- Archive index naming the original research documents without links.

### 3D Director's Desk

- Existing RunningHub baseline screen, marked clearly as a competitor reference.
- Redacted comparison plates for competitor controls vs the proposed semantic/director-language layer.
- Golden-task flow: bring in scene → block actors → cover with cameras → write back.
- Scope boundary chart, risk register, measurement plan, and a prototype walkthrough sequence.
- Archive index naming research, social evidence, resource review, and annotated competitor walkthroughs without links.

## Privacy and accuracy

- Public pages only include material the owner can publish or safely redact.
- Screens from competitors are captioned as references, never presented as self-built work.
- Internal source titles can be named; direct Feishu URLs, private discussions, customer information, and non-public product screens are excluded.
- Hypotheses and target metrics are labelled as hypotheses; shipped evidence remains distinct from planned validation.

## Verification

- Jekyll build succeeds.
- Both pages render on desktop and mobile with readable figures and captions.
- Every visual carries a claim-specific caption.
- No non-public URL or unredacted internal information appears in the generated site.
