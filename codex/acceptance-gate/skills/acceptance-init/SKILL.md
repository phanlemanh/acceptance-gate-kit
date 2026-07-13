---
name: acceptance-init
description: Initialize Acceptance Gate in a consumer repository on Codex. Use when `_acceptance/config.yaml` is missing or the user asks to set up Acceptance Gate, its runner, design executors, or CI backstop.
---

# Acceptance Init for Codex

Initialize the current repository once. Never overwrite an existing
`_acceptance/config.yaml` without explicit approval.

## 1. Preflight

1. Treat the current git root as the consumer repository.
2. If `_acceptance/config.yaml` exists, show it and stop.
3. Locate this skill's bundled
   `references/codex-plugin-runner.mjs` from the loaded skill directory.
4. Read repository guidance and existing package scripts before asking for
   commands that can already be discovered.

## 2. Intake

Ask one question at a time only for values that cannot be discovered:

1. test commands for each real surface;
2. CLI or integration smoke commands;
3. dev-server start command and URL;
4. optional screenshot command that accepts URL and output file;
5. critical paths for T3;
6. safe skip globs for T1;
7. human signoff names;
8. optional historical acceptance minutes.

Omit executor keys for surfaces that do not exist. Never write empty command
strings.

## 3. Install the consumer runner

Create `scripts/codex-plugin-runner.mjs` from the bundled reference using
`apply_patch`. If the target exists and is byte-identical, keep it. If it
differs, show the diff and ask before replacement. The runner stays in the
consumer repository so executor config remains stable across users and Codex
cache versions.

## 4. Write config

Create `_acceptance/config.yaml` with two-space indentation:

```yaml
schema_version: 1
enforcement: strict
recheck: strict
baseline_minutes: []
executors:
  test:
    api: "<discovered-or-approved command>"
  script:
    cli: "<discovered-or-approved command>"
  design:
    gate: "node scripts/codex-plugin-runner.mjs acceptance-gate design-gate"
    ui_check: "node scripts/codex-plugin-runner.mjs acceptance-gate design-scan"
risk_tiers:
  t1_skip_globs:
    - "docs/**"
  t3_paths:
    - "src/auth/**"
signoff:
  required_for: [T2, T3]
  approvers: ["<approved human>"]
  require_human_commit: true
dev_server:
  start: "<discovered-or-approved command>"
  url: "<discovered-or-approved URL>"
```

The angle-bracket values above are schema examples, not values to copy. Fill
them only from discovered repository commands or the user's answers. Remove the
whole key or block when the repository lacks that surface.

If Design Loop is not installed, omit `executors.design` and state that design
coverage is not wired. Once installed, the `design-init` skill adds the complete
runner-backed design block safely.

When screenshot capture is approved, add:

```yaml
capture:
  ui: "<approved command>"
```

## 5. Repository artifacts

Create `_acceptance/README.md` with three facts: this folder contains
per-feature acceptance artifacts, contract status is the state source, and the
Acceptance skill runs the gate.

Offer to copy the merge backstop as one coherent set:

- Acceptance package `scripts/pre-merge-check.sh` → consumer `scripts/`;
- Acceptance package `scripts/recheck-evidence.js` → consumer `scripts/`;
- Acceptance package `lib/evidence-core.js` → consumer `lib/`.

Locate package files through the installed Codex cache or this source checkout;
do not hardcode a version. Explain that CI must pass the PR base, for example:

```bash
bash scripts/pre-merge-check.sh . --base "origin/$GITHUB_BASE_REF"
```

## 6. Optional references

If the user wants file-backed UI captures, copy
`skills/acceptance/references/ui-capture.reference.mjs` from the installed
Acceptance package into the consumer repository and follow its dependency
instructions. If the user wants a cross-family closed-question check, copy
`vlm-assert.reference.mjs`; never treat it as an open-ended design judge.

## 7. Verify

Run:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate config-patch --help
```

An exit caused only by the target script's documented help behavior proves the
runner resolved the installed package. Missing cache or script is `BLOCKED`,
not a successful initialization.

Finish with: `Acceptance Gate is ready. Use the acceptance skill for the next feature.`
