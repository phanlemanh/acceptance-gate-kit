---
name: design-init
description: Wire Design Loop into an Acceptance Gate consumer repository on Codex. Use once per repository to add runner-backed design executors and UI surface globs without overwriting existing config.
---

# Design Init for Codex

Wire the design sub-track idempotently.

## Preflight

1. Require `_acceptance/config.yaml`; otherwise invoke `acceptance-init` first.
2. Require `scripts/codex-plugin-runner.mjs`; otherwise repair Acceptance init.
3. Confirm `capture.ui` when file-backed UI evidence is required. Missing
   capture permits source checks only and must be disclosed.
4. Confirm Acceptance Gate and Design Loop are installed in the Codex cache.

## Dry run

Run:

```bash
node scripts/codex-plugin-runner.mjs design-loop design-config-patch \
  --config _acceptance/config.yaml
```

Show the exact additions. They must use the consumer runner for Acceptance
`design-gate`/`design-scan` and Design Loop `design-static-check`/
`design-fidelity-diff`. Any plugin-root placeholder is a configuration error.

Ask one apply-or-adjust question. On approval, rerun with `--write`.

## Surface globs

Inspect the repository and propose one to three globs containing UI source.
Ask the user to confirm, then run:

```bash
node scripts/codex-plugin-runner.mjs design-loop design-config-patch \
  --config _acceptance/config.yaml \
  --surface-globs "apps/web/**,src/components/**" \
  --write
```

Use repository-specific globs, not the example values. If the user declines,
state that the S4 tier-mismatch guard will skip.

Verify the resulting config has one `executors.design` block, at most one
top-level `design` block, and a `.bak` file. Missing runner/cache is `BLOCKED`.
