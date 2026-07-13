---
name: feature-loop-model-init
description: Use when a consumer repository should install, check, or upgrade the Codex-native role model policy for Feature Loop and Acceptance Gate without changing Claude Code routing.
version: 1.11.4
---

# Feature Loop Model Init

Install the balanced project-scoped Codex agent policy. The policy belongs in
`.codex/agents`; it never rewrites `_acceptance/config.yaml` or Claude
`feature_loop.models` aliases.

## Preconditions

Run from the consumer repository root. If
`scripts/codex-plugin-runner.mjs` is missing, invoke the `acceptance-init` skill
first. Confirm the installed Codex model catalog contains `gpt-5.6-sol` and
`gpt-5.6-terra` before writing the policy.

## Check and Install

Run check mode first:

```bash
node scripts/codex-plugin-runner.mjs feature-loop-codex install-model-policy --root .
```

Show every `current`, `missing`, `upgrade`, or `conflict` result. Check mode
writes nothing and exits 1 when work remains.

When the user requested installation or upgrade, run:

```bash
node scripts/codex-plugin-runner.mjs feature-loop-codex install-model-policy --root . --write
```

The installer writes missing agents and upgrades only unchanged managed files.
Never overwrite a `conflict`; preserve the user's `.codex/agents` file and
report its path. A conflict keeps the command nonzero even when other safe
files were installed.

## Verification

After a zero-exit write, run check mode again. Require every file to be
`current`. Confirm Claude routing remains unchanged:

```bash
rg -n 'feature_loop:|models:|finder:|executor:' _acceptance/config.yaml
```

Tell the user to open a fresh Codex task because project custom agents are
loaded at task start. In that task, named-agent selection is used only when the
runtime exposes it; otherwise Feature Loop records `session-inherited` instead
of claiming role routing occurred.
