# design-loop

A design-aware sub-track for **feature-loop** and **feature-loop-codex**.
Standardizes the design-of-record → **PORT** (HTML→JSX + token translation) →
app repo plugin views pipeline as a **conditional** S1-D mockup + Gate-2
fidelity-evidence bookend. Reuses `acceptance-gate`'s P0 design gate via config
wiring; feature-loop 1.10 and feature-loop-codex 1.10 ship the seam guards that
make the sub-track deterministic — they **no-op** unless the feature is a web-UI
surface AND design-loop is wired. design-loop itself adds no runtime coupling.

## Install

Claude Code:

```bash
claude plugin install design-loop@acceptance-gate-kit
```

Codex:

```bash
codex plugin add design-loop@acceptance-gate-kit
```

Once per app repo: **`/design-init`** — wires
`executors.design.{gate,ui_check,static,fidelity}`. Prints a diff, stops for
confirm, never overwrites, and **never touches `smoke_sv_design`**.

## How it composes

- **S1 P0 floor** materializes because `/design-init` un-disables acceptance-gate's step-2b design auto-add (it self-disables when `executors.design` is absent).
- **S4 block layer** runs every round because the design checks are **per-surface evals** — the design-subtrack skill adds `config:executors.design.static` (with the target + `--html` capture) to the slug's `evals.yaml` at S1; S4 runs every eval each round.
- **S1-D + Gate-2 prompts, the Gate-1 mockup hard-gate, S4 fidelity-skip WARN, and resume reconcile** are made deterministic by feature-loop / feature-loop-codex guards (not skill-auto-load luck). The guards no-op for headless features and for repos where design-loop is not wired — closing the interaction breaks found in the seam audit.

## Two command families (never conflate)

- **H1 first-party** (Claude Code built-ins — this plugin does NOT ship them):
  `/design-login`, `/design-sync`, `/design`, tool `DesignSync`. The real
  claude.ai/design bridge; 2-way, planId-gated; **agent-tool, not CI-callable**.
- **Codex portable reference**: checked-in design files, a design repo,
  generated reference HTML/CSS, or saved screenshots captured under
  `_acceptance/<slug>/evidence/design/reference/` with `provenance.json`.
  This is the default Codex path and does not require Claude Design.
- **H2 cowork** (`design:*`): prompt-only advisors, do NOT sync to
  claude.ai/design.

## Reuse / reference / add

- **REUSE** acceptance-gate: P0 gate (`design-gate.mjs`/`design-scan.js`), the evidence hook when the runtime supports it, `evidence-page.js`, and CI re-check.
- **REFERENCE** the design repo (not vendored): `capture`/`diff`/`viewer` npm scripts (kept Chromium-free here) via `provenance.json` shell-out.
- **ADD** here: the sub-track skill + 3 references, 5 scripts, 4 commands.

## Fidelity = 3 layers

🔴 static-checks BLOCK: token-only + **layout-token-only** (source: raw hex / raw px-rem in spacing properties) + WCAG **contrast-AA** (rendered `--html` capture) + **tap-target≥44** (heuristic; advisory by default, `--strict-hit` to block) + 🔴 acceptance P0 floor + 🟡 pixel-diff ADVISORY + human onion-skin glance GOLD at Gate 2. **No blind VLM judge.**

## Honest CANNOT

Cannot ship `/design-sync` or `/design-login` (first-party built-ins). Cannot
make `DesignSync` CI/headless-callable. Codex cannot use the Claude Design
bridge directly, so the supported Codex mode is portable reference capture plus
provenance. The port/verify layers still run.

## Status

v0.3.0. Runnable now: `/design-init` (config wiring), `provenance` guard, `design-static-check` (token-only + layout-token-only + WCAG contrast-AA + tap-target heuristic). Skeleton/TODO: `design-fidelity-diff` shell-out to design-repo `diff:all`, `/design-push`. See the spec: `artifact-platform/docs/superpowers/specs/2026-07-01-design-code-workflow.md`.

v0.1.1 fixes: `design-static-check` no longer treats every `rgb(r,g,0)` as transparent (contrast-AA was skipping black text); `/design-init` and `/design-mockup` resolve `${CLAUDE_PLUGIN_ROOT}` against design-loop's own root (both died with MODULE_NOT_FOUND at the first wiring step).
