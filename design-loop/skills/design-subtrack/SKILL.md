---
name: design-subtrack
description: Design sub-track for a web-UI-surface feature inside feature-loop — use when designing/redesigning a screen, plugin view, mockup, or any user-facing surface (khi thiết kế một surface web-UI / màn hình / mockup trong feature-loop). Standardizes the 2-repo design-of-record → port → 3-layer fidelity pipeline as a CONDITIONAL S1-D mockup + Gate-2 evidence bookend, composing with feature-loop (0 edits) and reusing acceptance-gate's P0 design gate. NOT for headless/backend features. Requires: acceptance-gate + feature-loop + superpowers; one-time /design-init per repo.
---

# design-subtrack

Layers a **conditional design sub-track** onto feature-loop's S0–S5 spine **without editing feature-loop**. Only for features whose `contract.surfaces` renders web UI; headless features run vanilla feature-loop. Prerequisite: `/design-init` has wired `executors.design.*` (once per repo).

**Two command families — never conflate** (details: [references/design-command-map.md](references/design-command-map.md)):
- **H1 first-party** (Claude Code built-ins, NOT shipped by this plugin): `/design-login`, `/design-sync`, `/design` + the `DesignSync` tool. The real claude.ai/design bridge — 2-way, planId-gated, **agent-tool, not CI/headless-callable**.
- **H2 cowork** (`design:*` from anthropics/knowledge-work-plugins): `design:design-critique`, `design:design-system`, `design:design-handoff`, `design:ux-copy`, `design:accessibility-review`. **Prompt-only advisors** — do NOT sync to claude.ai/design.

**Invariants kept (never break):** `contract.status` single source of truth · doer≠grader (this skill only AUTHORS mockups/references/scripts — grading stays in the acceptance verify subagent + human Gate-2) · the 2 (T3: 3) human gates unchanged in count (mockup folds into Gate-1, perceptual into Gate-2) · no new state-machine state.

## Per-stage add/modify (only these; everything else = vanilla feature-loop)

- **S0 — detect.** `node ${plugin}/scripts/design-detect-surface.mjs --slug <slug>` → arm the sub-track only if a web-UI surface; else stop here.
- **S1 — spec pack (+).** Author into the design-doc: (a) the **state matrix** (theme×viewport×domain-state, see [references/state-matrix.md](references/state-matrix.md)); (b) the **seam** = data-shape + token vocab **in APP space** `--_* / --color-*` (never `--oh-*` hex); (c) **G2 AC split** — every machine-checkable visual criterion becomes a `script` eval (contrast/token-only/hit≥44); remaining perceptual criteria tagged `(judgment) — human-glance @ Gate 2`. Hard-gate: no Gate-1 without the state matrix. *(H2 advisory: `design:design-critique`, `design:design-system`.)*
- **S1-D — mockup.** Run `/design-mockup <slug>` (the only path to the H1 bridge). Author/pull the design-of-record from claude.ai/design, **drift-check** the pulled surface set vs the state matrix, **capture the reference** + `provenance.json`. Human-in-the-loop by necessity (H1 is not automatable). *(H2 advisory: `design:accessibility-review`.)*
- **Gate 1.** Mockup + state matrix + seam ride the existing `/acceptance-card` decision. One question. *(H2: `design:design-handoff` to draft the port spec.)*
- **S2 — plan (+).** Add a **port task** per surface: HTML→JSX into `apps/web/plugins/<name>/view/*.tsx` (see [references/port-translation.md](references/port-translation.md)); DoD names the `--oh-*`→`--_*/--color-*` translation.
- **S3 — execute.** The doer ports per the playbook (register-client=Preview, register-server=Body; never host shell / `components/ui/`). This skill supplies the playbook only — never grades.
- **S4 — verify (3 layers, automatic via config).** 🔴 `config:executors.design.static` (token-only/tap≥44/contrast-AA, in suite_keys → blocks every round) + 🔴 `config:executors.design.gate` (acceptance-gate P0 floor) + 🟡 `config:executors.design.fidelity` (advisory pixel-diff, never blocks). `provenance.mjs` refuses (BLOCKED, not false-green) on missing provenance. **No blind VLM judge.**
- **Gate 2.** Run `/design-evidence <slug>` for the onion-skin panel (reference↔impl); human resolves the perceptual AC. Machine verdict + `status → signed-off` unchanged.
- **S5 — ship.** PR as usual. Optionally `/design-push <slug>` to sync finalized design-system deltas back to cloud (H1, human-run).

## Honest CANNOT
This plugin **cannot ship** `/design-sync` or `/design-login` (first-party built-ins) and **cannot make** `DesignSync` CI/headless-callable (needs subscription + interactive planId approval). When the H1 bridge is unavailable, degrade to H2 advisors + manual authoring — the port/verify layers still run.
