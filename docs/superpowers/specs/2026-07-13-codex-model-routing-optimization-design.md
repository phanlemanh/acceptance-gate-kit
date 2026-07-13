# Codex-Native Model Routing Optimization Design

**Date:** 2026-07-13

**Status:** Approved in chat; written-spec review pending

**Target:** `feature-loop-codex` and its Acceptance Gate verification path

**Compatibility:** Codex-only additions; Claude Code behavior and versions stay unchanged

## 1. Problem

The Claude Feature Loop has real role-to-model routing in its Workflow scripts.
Mechanical work goes to small models, scoped judgment and synthesis go to a
mid-tier model, and high-recall review or implementation inherits or overrides
the main session model.

The Codex edition preserves the workflow discipline but does not currently
apply those role routes. The project config may still contain Claude aliases:

```yaml
feature_loop:
  models:
    finder: opus
    executor: opus
```

Those aliases remain valid for Claude Code, but the current Codex skill only
warns and inherits the Codex session model. On the target OneHub workstation,
the default is `gpt-5.6-sol` with `xhigh` reasoning, so judgment and review
workers can consume the same high-effort budget even when their task is narrow.

Codex 0.144.1 supports project-scoped custom agents under `.codex/agents/`.
Each agent can set `model`, `model_reasoning_effort`, and scoped instructions.
The kit does not yet package, install, select, or report such agents.

## 2. Goals

1. Use native Codex custom agents to separate model and reasoning effort by
   Feature Loop and Acceptance Gate role.
2. Keep deterministic test, script, provenance, and run-log work in local tools
   instead of spawning a model worker.
3. Preserve strong models for implementation and high-recall review while
   lowering effort for bounded judgment, UI verification, exploration, and
   finding refutation.
4. Install the policy into consumer repositories deterministically and without
   overwriting user-owned custom agents.
5. Record the requested routing policy and any fallback honestly in acceptance
   evidence; never claim an effective model that the runtime did not expose.
6. Keep all Claude manifests, Workflow scripts, `feature_loop.models` parsing,
   versions, and behavior unchanged.
7. Install and activate the Codex policy in the active OneHub Desktop worktree.

## 3. Non-goals

- Do not translate `opus`, `sonnet`, or `haiku` aliases into Codex model ids.
- Do not edit global `~/.codex/config.toml`.
- Do not invoke nested `codex exec` sessions to force model selection.
- Do not create model workers for shell-only operations.
- Do not promise exact token or monetary savings without runtime usage data.
- Do not silently overwrite an existing `.codex/agents/*.toml` file.
- Do not change Gate 1, Gate 2, risk tiers, verdict rules, or doer/grader
  separation.

## 4. Considered Approaches

### A. Session-level `/model` switching only

This works on every current Codex client and requires no files, but it is coarse
and interrupts unattended S2-S4 execution. Every spawned role still inherits
the same session model and effort.

### B. Project custom agents with a capability-aware fallback — chosen

Ship canonical agent templates, install them into `.codex/agents/`, and instruct
the Codex loop to dispatch named roles when the runtime exposes named-agent
selection. If the current spawn surface cannot select a named agent, inherit the
session configuration and write a degradation record. This uses the official
Codex extension surface and leaves Claude untouched.

### C. Nested `codex exec -m ...`

This can force a model per subprocess, but creates separate sessions, duplicates
orchestration, complicates permissions and hooks, and makes budget accounting
harder. It is intentionally excluded.

## 5. Architecture

### 5.1 Source and generated package layout

Codex-only source remains under the existing overlay:

```text
codex/feature-loop-codex/
  agent-templates/
    feature-loop-explorer.toml
    feature-loop-executor.toml
    acceptance-ui-verifier.toml
    acceptance-judge.toml
    acceptance-reviewer.toml
    acceptance-refuter.toml
  scripts/
    install-model-policy.mjs
  skills/
    feature-loop-codex/SKILL.md
    feature-loop-model-init/SKILL.md
```

`scripts/sync-plugin-packages.sh` copies this overlay into the generated
`plugins/feature-loop-codex/` package. Claude source directories are not inputs
to the new files.

The existing consumer runner receives one allowlisted action:

```text
feature-loop-codex install-model-policy
```

This is a stable repo-relative entrypoint; it does not expose arbitrary plugin
paths or scripts.

### 5.2 Consumer installation

The `feature-loop-model-init` skill runs:

```bash
node scripts/codex-plugin-runner.mjs \
  feature-loop-codex install-model-policy --root . --write
```

The installer has two modes:

- default check mode: print missing, current, and conflicting agent files;
- `--write`: create missing files and update only files whose current content is
  an unchanged older managed template.

Every managed template has a version marker and a `source-hash` for its managed
body. The installer recomputes that body hash before an upgrade. A file without
the marker, or a managed file whose body no longer matches its recorded hash,
is a conflict. The installer reports it and does not overwrite it. This permits
safe upgrades without bundling every prior template. Re-running an
already-current installation is a no-op.

The OneHub installation also refreshes its checked-in
`scripts/codex-plugin-runner.mjs` from the new Acceptance Gate reference before
invoking the new allowlisted action.

### 5.3 Role policy

The balanced default is:

| Agent | Work | Model | Reasoning |
|---|---|---|---|
| `feature-loop-explorer` | read-heavy discovery and bounded codebase scans | `gpt-5.6-terra` | `medium` |
| `feature-loop-executor` | independent implementation tasks | `gpt-5.6-sol` | `high` |
| `acceptance-ui-verifier` | browser/UI verification and observed evidence | `gpt-5.6-sol` | `medium` |
| `acceptance-judge` | blind scoped judgment lens | `gpt-5.6-sol` | `medium` |
| `acceptance-reviewer` | conventions, silent-failure, and high-recall review | `gpt-5.6-sol` | `high` |
| `acceptance-refuter` | test one concrete finding against file evidence | `gpt-5.6-terra` | `medium` |

No custom agent exists for machine test/script execution, run-log writing,
provenance capture, or report field copying. The main Codex orchestrator runs
those deterministic operations with tools and templates.

T3 does not automatically raise every worker to `xhigh`. The root session may
use `xhigh` for architecture or irreducibly ambiguous decisions; bounded
subtasks retain the table above unless the human intentionally changes the
project policy.

These ids are taken from the live Codex 0.144.1 model catalog on the target
machine. The catalog exposes `gpt-5.6-sol` and `gpt-5.6-terra`; it does not
expose a bare `gpt-5.6` id. Packaging tests assert these configured ids, while
runtime activation rechecks the live catalog because availability can drift.

### 5.4 Dispatch and fallback

Before S1 exploration, S3 parallel execution, or S4 judgment/review, the skill
checks for the required project agent files and the available spawn interface.

Routing has three explicit states:

- `custom-agent`: named agent was selectable; record the requested agent,
  configured model, and configured effort;
- `session-inherited`: spawn exists but cannot select a named agent; inherit the
  session and record the interface limitation;
- `sequential-fallback`: no usable multi-agent surface; run a separated pass and
  retain the existing doer/grader degradation warning.

The skill must not infer the effective model from a template alone. If the
runtime does not return effective model metadata, evidence says `requested`,
not `effective`.

### 5.5 Evidence and budget telemetry

S4 writes a `## Codex routing` section to `evidence-report.md` containing:

- policy source path;
- routing mode per spawned role;
- requested agent, model, and reasoning effort when known;
- session-inheritance or sequential-fallback reasons;
- count of model-backed role invocations;
- statement that deterministic executor commands were tool-run and did not
  create a separate model worker.

Exact tokens and currency are included only if a future Codex runtime returns
them. Until then, the report provides auditable routing evidence rather than an
estimated savings claim.

## 6. Skill Behavior

`feature-loop-model-init` is the single installation entrypoint. It explains
the policy, performs check/write, shows conflicts, and tells the user to open a
fresh Codex task because project agent files are loaded at session start.

`feature-loop-codex` gains:

1. a preflight that checks `.codex/agents/` without blocking users who choose
   session inheritance;
2. the role lookup table above;
3. named-agent dispatch instructions keyed to observable runtime capability;
4. routing evidence requirements;
5. a prohibition on interpreting Claude aliases as Codex model ids.

The Acceptance Gate Codex skill refers to the judge, UI verifier, reviewer, and
refuter agents when installed. Standalone Acceptance Gate remains usable without
Feature Loop and falls back honestly.

## 7. Versioning and Isolation

- Bump only the generated Codex packages whose contents change.
- Claude Acceptance Gate and Feature Loop remain at 1.11.2.
- Claude `.claude-plugin` marketplace entries and Workflow tests must have zero
  diff beyond generated Codex package references that are already isolated.
- `_acceptance/config.yaml feature_loop.models` remains untouched in OneHub so
  Claude continues using its `opus` overrides.
- OneHub receives only `.codex/agents/` plus the refreshed consumer runner.

## 8. Failure Handling

| Failure | Behavior |
|---|---|
| Model id unavailable | named spawn fails; report `session-inherited` only after an actual supported fallback, never silently substitute |
| Existing user agent file | report conflict and leave it unchanged |
| Old managed template unchanged | installer may upgrade it |
| Managed template modified | report conflict and preserve it |
| Runner lacks action | report exact runner refresh command |
| Named-agent selector absent | use session inheritance and record degradation |
| Multi-agent unavailable | use separated sequential grader and record degradation |
| Effective model metadata absent | report requested policy only |

## 9. Test Strategy

Implementation follows RED-GREEN-REFACTOR.

1. Installer unit tests first fail for missing behavior, then cover check mode,
   initial install, idempotent rerun, managed upgrade, user-file conflict, path
   validation, and missing template handling.
2. Runner tests first fail until the new plugin/action allowlist exists.
3. Plugin packaging tests first fail until templates, installer, helper skill,
   version alignment, and generated/source parity are present.
4. Skill contract tests first fail until the role table, named dispatch,
   fallback states, and routing evidence fields are documented.
5. Claude isolation tests compare Claude manifests, Workflow routing code, and
   package surfaces against the pre-change baseline.
6. OneHub verification parses all installed TOML with Codex strict config,
   runs installer check mode, confirms its Claude `feature_loop.models` block is
   unchanged, and starts a fresh Codex task to prove project-agent discovery.
7. Run the complete hook, script, plugin, design-loop, workflow, and Codex test
   suites before commit, merge, or push.

## 10. Delivery Sequence

1. Commit this design spec in the isolated kit worktree.
2. Write and commit an implementation plan.
3. Implement tests and Codex-only source changes in the kit worktree.
4. Regenerate packages and install the new plugin versions locally.
5. Refresh the OneHub consumer runner and install `.codex/agents/` on its active
   Codex branch.
6. Verify source truth, installed-cache truth, and fresh-task runtime truth.
7. Commit, merge, and push the kit and OneHub changes only after all checks pass.
