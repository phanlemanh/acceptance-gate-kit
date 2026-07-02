---
description: S1-D — author/pull the design-of-record mockup from Claude Design, drift-check vs the state matrix, capture the reference (run between brainstorm and Gate 1)
---

Argument: `<slug>` (the feature workspace `_acceptance/<slug>/`).

This is the ONLY path to the H1 first-party Claude Design bridge, and it is
human-in-the-loop by necessity — `/design-login` and `/design-sync` are Claude Code
built-ins this plugin cannot ship or call headlessly.

1. **Confirm the surface + state matrix.** Read `_acceptance/<slug>/contract.md` (`surfaces`) and the design-doc's state matrix. If no state matrix → go back to S1 (it is a Gate-1 hard-gate input). H2 advisory pre-check: `design:design-critique`.

2. **Author / pull the design-of-record (H1, user-run).**
   - `/design-login` (once, if not authed — needs a Claude subscription).
   - Author the mockup per state on claude.ai/design **on real tokens** (import the design system so it builds on real components), OR pull an existing surface: `/design-sync` (planId-gated; you approve the file list).
   - Landing repo: the design-of-record clone (e.g. `~/dev/artifact-platform-design/plugins/<name>/{composer,living,preview}.html`).

3. **Drift-check** the pulled surface set against the state matrix (missing / extra / stale states) BEFORE Gate 1. A wrong reference is a false-green self-heal can never fix.

4. **Capture the reference + provenance:**
   - Render the design-of-record at the pinned breakpoints (design-repo `capture`/`capture:all`) into `_acceptance/<slug>/evidence/design/reference/`.
   - `node ${CLAUDE_PLUGIN_ROOT}/scripts/provenance.mjs write --slug <slug> --design-repo <path> --commit <sha>`

5. Tell the user the mockup + state matrix are ready to fold into the Gate-1 card (`/acceptance-card <slug>`). H2 advisory: `design:design-handoff` to draft the port spec.

**Fallback:** no subscription / bridge unavailable → skip H1, use H2 advisors + manual authoring of the reference HTML; the port (S3) and verify (S4) layers still run.
