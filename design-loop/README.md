# design-loop

A design-aware sub-track for **feature-loop**. Standardizes the 2-repo design
pipeline — design-of-record (design repo `.html/.css`) → **PORT** (HTML→JSX + token
translation) → app repo plugin views — as a **conditional** S1-D mockup + Gate-2
fidelity-evidence bookend. Reuses `acceptance-gate`'s P0 design gate via config
wiring; **feature-loop v1.7 ships the seam guards** (🎨) that make the sub-track
deterministic — they **no-op** unless the feature is a web-UI surface AND design-loop
is wired. design-loop itself adds no runtime coupling.

## Install

1. Already registered in `.claude-plugin/marketplace.json` (3rd entry, source `./design-loop`).
2. `claude plugin install design-loop@acceptance-gate-kit` (needs acceptance-gate + feature-loop + superpowers).
3. Once per app repo: **`/design-init`** — wires `executors.design.{gate,ui_check,static,fidelity}` + appends `executors.design.static` to `feature_loop.suite_keys`. Prints a diff, STOPS for confirm, never overwrites, and **never touches `smoke_sv_design`**.

## How it composes

- **S1 P0 floor** materializes because `/design-init` un-disables acceptance-gate's step-2b design auto-add (it self-disables when `executors.design` is absent).
- **S4 block layer** runs every round because `/design-init` appends `executors.design.static` to the existing `feature_loop.suite_keys` resolution.
- **S1-D + Gate-2 prompts, the Gate-1 mockup hard-gate, S4 fidelity-skip WARN, and resume reconcile** are made deterministic by **feature-loop v1.7 🎨 guards** (not skill-auto-load luck). The guards no-op for headless features and for repos where design-loop is not wired — closing the interaction breaks found in the seam audit.

## Two command families (never conflate)

- **H1 first-party** (Claude Code built-ins — this plugin does NOT ship them): `/design-login`, `/design-sync`, `/design`, tool `DesignSync`. The real claude.ai/design bridge; 2-way, planId-gated; **agent-tool, not CI-callable**.
- **H2 cowork** (`design:*`): prompt-only advisors, do NOT sync to claude.ai/design.

## Reuse / reference / add

- **REUSE** acceptance-gate: P0 gate (`design-gate.mjs`/`design-scan.js`), the `PreToolUse` evidence hook, `evidence-page.js`.
- **REFERENCE** the design repo (not vendored): `capture`/`diff`/`viewer` npm scripts (kept Chromium-free here) via `provenance.json` shell-out.
- **ADD** here: the sub-track skill + 3 references, 5 scripts, 4 commands.

## Fidelity = 3 layers

🔴 static-checks BLOCK (token-only now; tap≥44/contrast-AA declared `pending_checks`) + 🔴 acceptance P0 floor + 🟡 pixel-diff ADVISORY + human onion-skin glance GOLD at Gate 2. **No blind VLM judge.**

## Honest CANNOT

Cannot ship `/design-sync` or `/design-login` (first-party built-ins). Cannot make `DesignSync` CI/headless-callable. The claude.ai/design bridge is human-in-the-loop at S1-D, orchestrated but never automated.

## Status

v0.1.0 scaffold. Runnable now: `/design-init` (config wiring), `provenance` guard, `design-static-check` (token-only). Skeleton/TODO: static-check tap≥44 + contrast-AA (pending), `design-fidelity-diff` shell-out to design-repo `diff:all`, `/design-push`. See the spec: `artifact-platform/docs/superpowers/specs/2026-07-01-design-code-workflow.md`.
