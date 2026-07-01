---
description: One-time per app repo — wire design-loop into _acceptance/config.yaml (executors.design.*), never overwriting existing keys
---

Wire the design sub-track into this repo. Idempotent, append-only, safe.

1. **Preflight the composition seams** (warn, do not block):
   - acceptance-gate step 2b auto-add exists (`skills/acceptance/SKILL.md`, the design-eval that self-disables when `executors.design` is absent).
   - `capture.ui` exists (design evals capture the surface; if missing, only the source token-only check runs).
   - `_acceptance/config.yaml` exists (else tell the user to run `/acceptance-init` first).
   If a seam looks refactored away, warn the user — the 0-edit composition depends on it.

2. **Dry-run the config patch** and show the plan:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/design-loop/scripts/design-config-patch.mjs
   ```
   This prints exactly the lines it would ADD:
   - `executors.design.{gate,ui_check,static,fidelity}` (gate/ui_check reuse acceptance-gate's own scripts; static/fidelity point at design-loop).
   The design checks (static/gate/fidelity) run as **per-surface evals** — the design-subtrack skill adds them to the slug's `evals.yaml` at S1 with the target + `--html` capture. They are NOT suite_keys (a bare suite run has no target and would BLOCK); S4 runs every eval each round, so they still block per round.
   It **never** touches `executors.script.smoke_sv_design` (a live key referenced by `_acceptance/v3-m3/evals.yaml`) — it aborts if any edit would.

3. **Show the diff, ask ONE question** (apply / adjust). On approval:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/design-loop/scripts/design-config-patch.mjs --write
   ```
   A `.bak` is written next to `config.yaml`.

4. **Note on paths.** Executor commands use `${CLAUDE_PLUGIN_ROOT}` (= the kit root, from acceptance-gate's plugin root; design-loop lives under it at `./design-loop`). If it does not resolve at verify time on a given machine, re-run `/design-init` there.

5. **Pending v3-m3 note (do NOT fix here):** `executors.script.smoke_sv_design` points at `npm run smoke:sv-design`, which is missing from package.json. That is a v3-m3-specific latent issue — fix the npm script separately; do NOT delete the config key.

6. Print: "design-loop wired. Design sub-track will arm for web-UI-surface features. Run /feature-loop as usual; use /design-mockup before Gate 1 and /design-evidence before Gate 2."
