---
name: design-evidence
description: Build and present Gate-2 visual evidence for a D2 Feature Loop Codex feature. Use to compare the approved portable reference with the implemented UI before human signoff.
---

# Design Evidence for Codex

This skill supplies the human evidence surface; it does not change the machine
verdict or sign for the user.

1. Require reference captures, implementation captures, `provenance.json`, and
   completed static/P0 design eval output. Missing provenance in D2 is
   `BLOCKED`, not skipped-green.
2. Gather three layers:
   - blocking token, contrast, and P0 gate results;
   - advisory fidelity diff images and changed-pixel percentage;
   - reference and implementation captures for every pinned state.
3. Build or reuse `_acceptance/<slug>/evidence/design/panel.html` with paired
   frames, onion-skin comparison, and available diff heatmaps.
4. Open the panel with the available Codex browser. If it cannot be opened,
   provide the absolute file path and do not resolve perceptual criteria.
5. Ask the product question: `Does the built screen match the look approved at
   Gate 1 — ship, or one more port round?`

Pixel diff shows where to inspect; it never decides aesthetic correctness. No
blind VLM judge replaces the human Gate-2 perceptual decision. Record the
human's answer only through normal Acceptance Gate override/signoff fields.
