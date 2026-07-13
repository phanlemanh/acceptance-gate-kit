# Codex-Native Parity Design

**Date:** 2026-07-13
**Status:** Approved design, pending implementation plan
**Target:** Acceptance Gate, Feature Loop, and Design Loop on Codex without changing Claude Code behavior

## 1. Context

The repository was originally designed around Claude Code plugin conventions:

- `.claude-plugin` manifests and marketplace entries;
- command documents under `commands/`;
- `Workflow(...)` orchestration scripts;
- Claude Design and Claude Preview integration points;
- hook payloads shaped like Claude `Write` and `Edit` calls;
- `${CLAUDE_PLUGIN_ROOT}` in command and executor paths.

Codex support already exists, but it is incomplete:

- `acceptance-gate` is installed at 1.11.2 and its deterministic suites pass;
- `feature-loop-codex` is installed at 1.10.0 while Claude `feature-loop` is 1.11.2;
- `design-loop` has a Codex manifest but is not installed;
- the current hook matcher recognizes `Write|Edit`, but the hook body expects
  `tool_input.file_path` and `content/new_string`; Codex reports canonical
  `tool_name: apply_patch` with the patch in `tool_input.command`;
- plugin-root compatibility variables exist inside plugin hook processes, but
  they are not general shell environment variables for later executor commands;
- current Codex plugin documentation defines skills and hooks as distributable
  components, but does not define Claude-style command documents as a native
  invocation surface.

The local repository was clean and synchronized with `origin/main` at commit
`cf50eb54b158369ab722d99fe4295759cc5e03d0` when this design was prepared.
Baseline verification passed: hooks 51/51, scripts 151/151, workflows 82/82,
plugin packaging, and Design Loop fixtures.

## 2. Goals

1. Preserve the observable Feature Loop and Acceptance Gate discipline on Codex:
   contract and evals before implementation, two human gates, evidence-backed
   verdicts, doer/grader separation, staleness checks, and CI enforcement.
2. Bring `feature-loop-codex` to behavioral parity with Claude Feature Loop
   1.11.2 where Codex exposes an equivalent native capability.
3. Make Design Loop installable and usable through a Codex-native portable
   reference flow without Claude Design or `DesignSync`.
4. Adapt write-time enforcement to Codex `apply_patch` payloads.
5. Keep Claude Code manifests, commands, skills, Workflow scripts, and versions
   behaviorally unchanged.
6. Support Codex 0.139.0 as the compatibility floor and verify the final result
   again after upgrading the local CLI to 0.144.1.

## 3. Non-goals

- Reimplement Claude `Workflow(...)` inside Codex.
- Make Claude Design, `/design-sync`, `/design-login`, or `DesignSync`
  callable from Codex or CI.
- Pretend Codex subagent tools honor Claude `feature_loop.models` role routing
  when the current tool interface does not expose per-spawn model selection.
- Replace the existing deterministic evidence core or change its verdict rules.
- Change the number or ownership of human gates.
- Publish or push a release as part of compatibility implementation.
- Upgrade the Codex CLI before source compatibility is implemented and tested
  against the current 0.139.0 runtime.

## 4. Chosen Architecture

Use generated Codex packages built from shared Claude-era engines plus
Codex-only overlays.

```text
Claude source                         Codex overlay source
root acceptance-gate                 codex/acceptance-gate/
feature-loop/                        codex/feature-loop-codex/
design-loop/                         codex/design-loop/
        |                                      |
        +--------------- shared ---------------+
                               |
                    scripts/sync-plugin-packages.sh
                               |
                               v
                    plugins/ (generated outputs)
```

Claude runtime sources remain authoritative for Claude. Codex overlay sources
contain only runtime-specific manifests, skills, hooks, adapters, and runner
instructions. Generated packages are never hand-edited.

### 4.1 Generated package roots

| Package output | Codex plugin name | Version | Shared input | Codex overlay |
|---|---|---:|---|---|
| `plugins/acceptance-gate/` | `acceptance-gate` | 1.11.3 | root scripts, lib, vendor, references, docs | hook adapter and command-replacement skills |
| `plugins/feature-loop-codex/` | `feature-loop-codex` | 1.11.3 | behavioral contract from Feature Loop 1.11.2 | complete Codex-native S0-S5 skill |
| `plugins/design-loop-codex/` | `design-loop` | 0.2.1 | Design Loop scripts and references | portable-reference skills and Codex manifest |

Claude versions remain 1.11.2 for Acceptance Gate and Feature Loop, and 0.2.0
for Design Loop. Codex package versions advance independently so the Codex cache
receives a new immutable version without implying a Claude runtime release.

### 4.2 Marketplace isolation

- `.claude-plugin/marketplace.json` continues to point to `./`,
  `./feature-loop`, and `./design-loop`.
- `.agents/plugins/marketplace.json` points only to the three generated package
  roots under `plugins/`.
- The Codex marketplace never exposes Claude `feature-loop`.
- The Claude marketplace never exposes `feature-loop-codex` or Codex overlay
  sources.

## 5. Components

### 5.1 Acceptance Gate Codex overlay

The Acceptance Gate package continues to reuse the existing deterministic
engine. Its overlay adds four Codex-native capabilities:

1. `acceptance-init` skill: gathers repo commands and policy, writes
   `_acceptance/config.yaml`, installs a consumer-local runner, and offers the
   existing CI backstop files.
2. `acceptance-card` skill: runs `gate-card.js` and `evidence-page.js`, then
   presents or opens the resulting artifacts using available Codex surfaces.
3. `acceptance-status` skill: scans feature contracts and reports actionable
   state without relying on a slash command.
4. Codex hook adapter: translates `apply_patch` input into the post-edit file
   content expected by `lib/evidence-core.js`.

The existing `acceptance` skill remains the main three-phase workflow. Its
Codex package copy names the native skills first and treats Claude command names
only as legacy aliases documented for users migrating from Claude Code.

### 5.2 Consumer-local plugin runner

`acceptance-init` writes `scripts/codex-plugin-runner.mjs` into each consumer
repository. Executor config uses stable repo-relative commands such as:

```yaml
executors:
  design:
    gate: "node scripts/codex-plugin-runner.mjs acceptance-gate design-gate"
    static: "node scripts/codex-plugin-runner.mjs design-loop design-static-check"
    fidelity: "node scripts/codex-plugin-runner.mjs design-loop design-fidelity-diff"
```

The runner:

- locates `$CODEX_HOME/plugins/cache/*/<plugin>/*/`;
- selects the newest valid installed version deterministically;
- uses an allowlist mapping from plugin and action to a package-relative script;
- executes Node scripts without shell interpolation;
- preserves exit code, stdout, and stderr;
- returns exit 2 with an exact install/init instruction when resolution fails;
- rejects arbitrary plugin names, action names, relative traversal, and direct
  script paths.

This removes `${CLAUDE_PLUGIN_ROOT}` from Codex executor config while keeping
the consumer config portable across users and cache versions. CI jobs that run
these executors must install the corresponding Codex plugins; otherwise the
runner reports `BLOCKED` instead of silently skipping the check.

### 5.3 Codex write-time hook adapter

The Codex manifest points to a Codex-specific hooks file. The Claude manifest
continues using `hooks/hooks.json` and `acceptance-evidence-gate.js` unchanged.

For `PreToolUse` with an `apply_patch` tool call, the adapter:

1. reads the patch from `tool_input.command`;
2. identifies Add, Update, Delete, and Move operations;
3. resolves paths relative to the hook input `cwd` and rejects traversal;
4. ignores non-gate files;
5. reconstructs the post-patch content for each targeted `contract.md` or
   `evidence-report.md`;
6. evaluates reconstructed content through the existing evidence core;
7. emits a Codex deny decision or exit code 2 on a strict violation;
8. preserves warn, off, and `ACCEPTANCE_GATE_BYPASS=1` behavior.

If a patch visibly targets a gate file but cannot be parsed or reconstructed,
the adapter fails closed for that gate file with a remediation message. It does
not block unrelated files merely because they share a multi-file patch.

Codex hooks are guardrails, not the sole enforcement boundary. Unified shell
edits or disabled/untrusted hooks can bypass a pre-tool hook. The committed
`recheck-evidence.js` and `pre-merge-check.sh` path remains authoritative at the
merge boundary.

### 5.4 Feature Loop Codex parity

The Codex skill keeps the same durable state machine:

| Contract status | Stage |
|---|---|
| missing | S0 intake and S1 design |
| `draft` | Gate 1 |
| `approved` | S2 plan and S3 execution |
| `implemented` | S4 verification |
| `verified` | Gate 2 |
| `signed-off` | S5 handoff |

Parity additions from Claude Feature Loop 1.11.2:

- append-only `decisions.jsonl`, Gate-1 seal, provisional decisions, and
  supersession rules;
- Design Loop CT1/CT2 lookup with user-facing D0/D1/D2 lanes;
- tier-mismatch guard using `design.surface_globs`;
- Gate-1 lane decision and visible descope record;
- native Codex `/goal` suggestion for the machine-owned S2-S4 segment only;
- explicit prohibition on goals that attempt to reach `signed-off`;
- `/model` picker guidance at Gate 1 rather than hardcoded Claude model slugs;
- warning when `feature_loop.models` contains role routing the current Codex
  spawn interface cannot apply.

Native orchestration rules:

- use shell tools for deterministic commands;
- use Codex subagents only for independent tasks, fresh graders, judgment
  panels, or adversarial reviewers;
- subagents inherit the parent permissions;
- S3 may edit product code; S4 graders may not;
- when subagents are unavailable, run a clearly separated sequential grader
  pass and record the degradation; never call it a fresh agent;
- never invoke `feature-loop/workflows/*.js` from Codex.

### 5.5 Design Loop Codex overlay

The Codex Design Loop package exposes native skills replacing the legacy
command entry points:

| Claude command | Codex skill | Behavior |
|---|---|---|
| `/design-init` | `design-init` | wire runner-backed design executors and surface globs |
| `/design-mockup` | `design-mockup` | create or import portable reference, capture states, write provenance |
| `/design-evidence` | `design-evidence` | build and present reference/implementation evidence panel |
| `/design-push` | `design-push-status` | record skipped or externally handled Claude Design sync; never invoke it |

Portable references may be a design repository, checked-in HTML/CSS, generated
reference files, or saved screenshots. Browser, Playwright, Computer Use, or
another available Codex-native visual surface may capture evidence. No blind
VLM judgment replaces the human Gate-2 perceptual check.

## 6. Runtime Flow

1. A user installs or upgrades the three plugins from the repo marketplace.
2. A fresh Codex task receives the installed skill list.
3. `acceptance-init` wires the consumer repository and its runner.
4. `feature-loop-codex` drives contract status through S0-S5.
5. Design Loop arms only for web-UI surfaces with design executors configured.
6. The hook adapter checks supported gate-file patches before write.
7. Machine evidence and judgment proposals are synthesized into Gate 2.
8. Only the human supplies overrides and signoff.
9. CI rechecks committed evidence independently of the interactive runtime.

## 7. Error and Degradation Policy

| Condition | Required behavior |
|---|---|
| Gate-file patch cannot be reconstructed | deny that gate-file patch with remediation |
| Hook disabled or untrusted | warn; require CI recheck before completion claim |
| Plugin cache or consumer runner missing | `BLOCKED` with exact install/init action |
| Browser unavailable for required UI check | `BLOCKED`, or downgrade only when the approved eval contract permits judgment |
| Design provenance missing in D2 | `BLOCKED`; never treat fidelity as skipped-green |
| Fidelity command returns advisory skip | visible Gate-2 warning |
| Subagents unavailable | separated sequential grader with explicit degradation record |
| Role-specific model route unavailable | warn and inherit session model; never claim the role was pinned |
| Claude Design bridge requested from Codex | state unsupported and use portable reference or external human step |
| Prompt-input diagnostic times out | record timeout and use fresh-task injection plus registry/cache evidence |

## 8. Testing Strategy

Implementation follows test-first development. No production adapter or runner
behavior is added before a failing test demonstrates the missing behavior.

### 8.1 Hook adapter tests

- allow a valid draft contract Add File patch;
- deny a new `implemented` contract without Gate-1 approval;
- allow an approved contract transition;
- deny PASS evidence missing required machine evidence;
- preserve warn, off, and bypass behavior;
- handle multi-file patches without blocking unrelated files;
- reject path traversal;
- fail closed when a targeted gate-file patch is unsupported;
- verify the exact Codex input shape: `tool_name: apply_patch` and
  `tool_input.command`.

### 8.2 Runner tests

- choose the newest valid cache version;
- honor a non-default `CODEX_HOME`;
- execute every allowlisted action and preserve exit status;
- reject unknown plugin/action pairs and traversal;
- return deterministic `BLOCKED` diagnostics for missing cache or script;
- prove config output contains no `${CLAUDE_PLUGIN_ROOT}`.

### 8.3 Packaging tests

- generate all three package roots from clean source;
- assert Codex manifests, versions, skill names, hooks, and required assets;
- assert the marketplace exposes exactly Acceptance Gate, Feature Loop Codex,
  and Design Loop from generated paths;
- assert Claude manifests and Workflow sources are unchanged by generation;
- assert Feature Loop parity markers for ledger, D0/D1/D2, `/goal`, `/model`,
  doer/grader separation, and design mismatch guards;
- assert Codex skills do not instruct execution of Claude Workflow or Design
  bridge tools.

### 8.4 Regression suites

The final source must pass all existing suites plus new Codex suites:

```bash
for t in hooks scripts plugins design-loop workflows codex; do
  bash "tests/$t/run-tests.sh"
done
```

### 8.5 Runtime matrix

Run the following first on Codex 0.139.0 and again after upgrading to 0.144.1:

1. marketplace resolves the local repository;
2. all three plugins install and report enabled with expected versions;
3. cache manifests and required files are readable;
4. hooks are discovered and trusted or reported as requiring trust;
5. direct native hook smoke tests allow and deny representative patches;
6. a fresh task contains the Acceptance Gate, Feature Loop Codex, and Design
   Loop skills, but not Claude `feature-loop`;
7. `codex debug prompt-input` is attempted with a timeout; timeout is recorded
   rather than allowed to hang verification;
8. the consumer runner resolves installed packages and runs a harmless
   allowlisted action.

The CLI upgrade occurs only after the 0.139.0 matrix passes. If 0.144.1 reveals
a runtime incompatibility, fix it while retaining the 0.139.0 tests unless the
two runtimes are demonstrably incompatible; such a conflict must be reported
instead of silently dropping the compatibility floor.

## 9. Success Criteria

The work is complete only when all of the following are true:

1. Local source was synchronized from GitHub before implementation.
2. Claude Code plugin versions and behavior remain unchanged.
3. Codex packages are generated from shared inputs plus isolated overlays.
4. Acceptance Gate, Feature Loop Codex, and Design Loop are installed and
   enabled in Codex at their new versions.
5. A fresh Codex task receives all three intended skill families and excludes
   Claude `feature-loop`.
6. Native `apply_patch` hook smoke tests prove both allow and deny paths.
7. No Codex executor config depends on `${CLAUDE_PLUGIN_ROOT}`.
8. Feature Loop Codex includes the approved 1.11.2 parity behaviors without
   claiming unsupported role-model routing.
9. Design Loop uses portable references and honestly reports unavailable
   Claude-only bridges.
10. Every existing and new automated suite passes on the final source.
11. The runtime smoke matrix passes on both Codex 0.139.0 and 0.144.1, or any
    unavoidable version conflict is reported with exact evidence.

## 10. Authoritative References

- Codex manual: <https://developers.openai.com/codex/codex-manual.md>
- Codex hooks: <https://learn.chatgpt.com/docs/hooks>
- Codex plugin authoring: <https://learn.chatgpt.com/docs/build-plugins>
- Codex skill authoring: <https://learn.chatgpt.com/docs/build-skills>
