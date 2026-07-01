---
description: Gate 2 — build the onion-skin visual-evidence panel (reference↔impl) so the human resolves the perceptual fidelity AC
---

Argument: `<slug>`. Run alongside `/acceptance-card <slug>` at Gate 2. This only
supplies the human's evidence surface — the machine verdict already came from S4 and
`contract.status → signed-off` is unchanged.

1. **Gather the three layers** (already produced at S4):
   - 🔴 BLOCK: `design-static-check` (token-only) + acceptance-gate P0 `design-gate` results.
   - 🟡 ADVISORY: `design-fidelity-diff` pixel-diff PNGs + %-changed.
   - reference captures (from `/design-mockup`) + implemented captures.

2. **Build the onion-skin viewer** over reference vs implemented captures at each pinned breakpoint (design-repo `viewer` / `make-diff-viewer`), plus the pixel-diff heatmap. Emit `_acceptance/<slug>/evidence/design/panel.html` (self-contained HTML, mirroring acceptance-gate's `evidence-page.js`).

3. **Present for the human (Gate-2 product question):** "does the built screen match the look you approved at Gate 1? — ship / one more port round". Reversibility is high (re-port is cheap, no data). Fidelity is judged by the human eye on the onion-skin; pixel-diff only "shows where to look". **No blind VLM judge.**

4. The human records the perceptual AC resolution via the normal `/acceptance-card` Gate-2 signoff flow. This command adds only the panel.
