---
description: S1-D — author/pull or create the design-of-record reference, drift-check vs the state matrix, capture the reference (run between brainstorm and Gate 1)
---

Argument: `<slug>` (the feature workspace `_acceptance/<slug>/`).

This command creates the reference evidence required before Gate 1. In Claude
Code it can orchestrate the H1 first-party Claude Design bridge. In Codex it
uses the portable reference path: a design repo, checked-in HTML/CSS, generated
reference files, or saved screenshots.

1. **Confirm the surface + state matrix.** Read `_acceptance/<slug>/contract.md` (`surfaces`) and the design-doc's state matrix. If no state matrix → go back to S1 (it is a Gate-1 hard-gate input). H2 advisory pre-check: `design:design-critique`.

2. **Choose the reference source.**
   - **Claude H1 path, user-run:** `/design-login` (once, if not authed), then
     author the mockup per state on claude.ai/design or pull an existing
     surface with `/design-sync` (planId-gated; user approves the file list).
   - **Codex portable-reference path:** use an existing design repo, checked-in
     static HTML/CSS, generated reference HTML/CSS, or saved screenshots. Put
     source files or a manifest under
     `_acceptance/<slug>/evidence/design/reference/source/` when no external
     design repo exists.

3. **Drift-check** the surface set against the state matrix (missing / extra /
   stale states) BEFORE Gate 1. A wrong reference is a false-green self-heal can
   never fix.

4. **Capture the reference + provenance:**
   - Render/copy the design-of-record at the pinned breakpoints into
     `_acceptance/<slug>/evidence/design/reference/`. Use the design repo's
     `capture` script, a repo screenshot command, Playwright/Puppeteer, or
     existing screenshots. The files must be inspectable from the repo.
   - Write provenance:
     `node ${CLAUDE_PLUGIN_ROOT}/scripts/provenance.mjs write --slug <slug> --design-repo <path> --commit <sha-or-version>`
   - If the reference source is not a git repo, use a content hash or explicit
     version string for `--commit` and say so in the Gate-1 package.

5. Tell the user the mockup/reference + state matrix are ready to fold into the
   Gate-1 card (`/acceptance-card <slug>`). H2 advisory:
   `design:design-handoff` to draft the port spec.

**Claude H1 details for reference:**
   - `/design-login` (once, if not authed — needs a Claude subscription).
   - Author the mockup per state on claude.ai/design **on real tokens** (import the design system so it builds on real components), OR pull an existing surface: `/design-sync` (planId-gated; you approve the file list).
   - Landing repo: the design-of-record clone (e.g. `~/dev/artifact-platform-design/plugins/<name>/{composer,living,preview}.html`).

**Fallback:** no Claude subscription / bridge unavailable → use the Codex
portable-reference path plus optional H2 advisors. The port (S3) and verify
(S4) layers still run.
