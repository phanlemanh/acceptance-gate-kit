---
description: Scaffold _acceptance/ workspace + config.yaml for this repo (one-time setup)
---

Initialize the Acceptance-Gate Kit in the current repository.

1. If `_acceptance/config.yaml` already exists → show it and STOP (never overwrite).
2. Ask the user, one question at a time:
   a. Test commands per surface they have (api/backend/sdk) — e.g. `pnpm --filter backend test`
   b. CLI smoke command if a CLI surface exists
   c. Dev server start command + URL (for ui-check evals)
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
baseline_minutes: []         # pre-kit acceptance estimates from 2g, e.g. [90, 120, 60]
executors:
  test:
    api: "<from 2a>"
  script:
    cli: "<from 2b>"
risk_tiers:
  t1_skip_globs:
    - "<from 2e>"
  t3_paths:
    - "<from 2d>"
signoff:
  required_for: [T2, T3]     # tiers that pre-merge-check requires signoff for
  approvers: ["<from 2f>"]   # informational in v1 (not yet machine-enforced)
dev_server:
  start: "<from 2c>"
  url: "<from 2c>"
```

Omit executor keys for surfaces the repo does not have — do not write empty strings.

4. Write `_acceptance/README.md` (3 lines): what this folder is, link to the
   acceptance skill, "artifacts are per-feature in subfolders".
5. Suggest copying `scripts/pre-merge-check.sh` from the plugin into the repo's
   CI (path: `${CLAUDE_PLUGIN_ROOT}/scripts/pre-merge-check.sh`).
6. Print: "Acceptance gate ready. Run the acceptance skill on your next feature."
