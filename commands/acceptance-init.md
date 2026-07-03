---
description: Scaffold _acceptance/ workspace + config.yaml for this repo (one-time setup)
---

Initialize the Acceptance-Gate Kit in the current repository.

1. If `_acceptance/config.yaml` already exists → show it and STOP (never overwrite).
2. Ask the user, one question at a time:
   a. Test commands per surface they have (api/backend/sdk) — e.g. `pnpm --filter backend test`
   b. CLI smoke command if a CLI surface exists
   c. Dev server start command + URL (for ui-check evals)
   c2. (optional, for UI slideshow evidence) A command that saves a screenshot of
       a URL to a FILE — `<cmd> <url> <out.png>` (e.g. `npm run ui:capture`).
       preview_screenshot is inline-only, so this is what writes the slideshow
       frames. None yet → offer to scaffold a reference (step 3b).
   d. Paths that are critical (auth/data/payments) → `t3_paths`
   e. Globs safe to skip entirely (docs, pure-config) → `t1_skip_globs`
   f. Who can sign off (names) → `signoff.approvers`
   g. (optional, pilot metric) Roughly how many minutes did acceptance take
      for each of the last 3 features? → `baseline_minutes`
3. Write `_acceptance/config.yaml`:

```yaml
# 2-space indentation REQUIRED — the kit's hook parses this file line-by-line.
schema_version: 1
enforcement: strict          # strict | warn | off
recheck: strict              # CI re-check of COMMITTED evidence: strict | warn | off.
                             # strict is safe for a fresh repo (no legacy reports);
                             # `warn` only exists so repos ADOPTING the kit with older
                             # reports aren't blocked — do not start there.
baseline_minutes: []         # pre-kit acceptance estimates from 2g, e.g. [90, 120, 60]
executors:
  test:
    api: "<from 2a>"
  script:
    cli: "<from 2b>"
  design:                                              # keep if the repo has any web UI
    gate: "node ${CLAUDE_PLUGIN_ROOT}/scripts/design-gate.mjs"   # script tier (a11y/slop)
    ui_check: "${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js"     # browser tier (authoritative P0)
  # ui:                                                # optional (step 3c): cross-family VLM
  #   vlm_assert: "node scripts/vlm-assert.mjs"        # second opinion on saved UI frames
risk_tiers:
  t1_skip_globs:
    - "<from 2e>"
  t3_paths:
    - "<from 2d>"
signoff:
  required_for: [T2, T3]     # tiers that pre-merge-check requires signoff for
  approvers: ["<from 2f>"]   # informational in v1 (not yet machine-enforced)
  require_human_commit: true # Gate-2 signature must land in its own human-fields-only
                             # commit (pre-merge checks git history; the reviewer commits
                             # the signoff line themselves). Safe default for a fresh repo.
  # agent_authors:           # OPTIONAL email-glob blocklist for the signoff commit's author
  #   - "*[bot]*"            # (useful when CI/agents commit under a dedicated identity)
dev_server:
  start: "<from 2c>"
  url: "<from 2c>"
capture:
  ui: "<from 2c2>"           # optional: <cmd> <url> <out.png> to save ui-check frames to files (Gate-2 slideshow). Omit if no UI evidence.
# feature_loop:              # (feature-loop plugin) S4 adds suite_keys here via scripts/config-patch.mjs
#   models:                  # optional: override the verify-agent model per role
#     judge: opus            # roles: machine/ui/judge/finder/refute/baseline/provenance/scribe/synthesize (+ executor for S3 fan-out)
#     finder: session        # 'session' = inherit the main session's model
```

Omit executor keys for surfaces the repo does not have — do not write empty strings.
Omit the `capture` block if the repo has no UI evidence need.

3b. **(optional) Scaffold the UI capture reference.** If the user wants slideshow
    evidence but has no capture command, copy
    `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/ui-capture.reference.mjs`
    into the repo as `scripts/ui-capture.mjs`; tell them to `npm i -D
    puppeteer-core` (drives an EXISTING Chrome — no heavy download) and add
    `"ui:capture": "node scripts/ui-capture.mjs"` to package.json, then set
    `capture.ui: "npm run ui:capture"`. The script + dependency live in the REPO,
    NOT in the plugin — the kit stays zero-dependency.

3c. **(optional) Scaffold the external-VLM second opinion.** If the user wants a
    cross-model check on saved UI frames (a different model family re-reads the
    screenshots and answers closed YES/NO questions), copy
    `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/vlm-assert.reference.mjs`
    into the repo as `scripts/vlm-assert.mjs`; tell them to set `GEMINI_API_KEY`
    (the script calls Gemini REST via Node's built-in fetch — zero npm
    dependency; default model `gemini-3.5-flash`, override with `VLM_MODEL`),
    and add the
    `executors.ui.vlm_assert` key above. Evals use it through a thin
    per-assertion wrapper — closed questions only, opt-in per eval (see the
    acceptance skill's eval-executors reference). The script + key live in the
    REPO, NOT in the plugin.

4. Write `_acceptance/README.md` (3 lines): what this folder is, link to the
   acceptance skill, "artifacts are per-feature in subfolders".
5. Suggest copying the CI gate from the plugin into the repo — ALL THREE files,
   keeping the `scripts/` + `lib/` layout (pre-merge finds the re-check next to
   itself, and the re-check `require`s `../lib`):
   - `${CLAUDE_PLUGIN_ROOT}/scripts/pre-merge-check.sh` → `scripts/`
   - `${CLAUDE_PLUGIN_ROOT}/scripts/recheck-evidence.js` → `scripts/`
   - `${CLAUDE_PLUGIN_ROOT}/lib/evidence-core.js` → `lib/`
   Copying only pre-merge-check.sh silently drops the committed-evidence
   re-check layer (it degrades to a NOTE).
   In the CI step, pass the PR base so the T1-escape backstop is armed
   (without it the backstop only NOTEs): on GitHub Actions
   `bash scripts/pre-merge-check.sh . --base "origin/$GITHUB_BASE_REF"`
   (or export `PRE_MERGE_BASE`). The backstop blocks PRs that change
   `t3_paths` — or any non-T1 file — while carrying no `_acceptance/<slug>/`
   artifacts.
6. Print: "Acceptance gate ready. Run the acceptance skill on your next feature."
