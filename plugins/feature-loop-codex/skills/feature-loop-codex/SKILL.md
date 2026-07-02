---
name: feature-loop-codex
description: This skill should be used when the user asks to "run feature-loop-codex", "start a Codex feature loop", "resume a Codex feature loop", "build this feature with acceptance-gate in Codex", or wants a Codex-native version of feature-loop without Claude Code Workflow scripts.
version: 1.5.0
---

# feature-loop-codex

Run a Codex-native feature development loop on top of `acceptance-gate`.
Preserve the Claude `feature-loop` 1.5.0 discipline while replacing workflow
scripts with Codex-native main-agent work, shell commands, and optional
`spawn_agent` / `wait_agent` calls.

## Runtime Contract

Use Codex-native orchestration only:

- Drive state from `_acceptance/<slug>/contract.md` frontmatter and local files.
- Run deterministic commands with shell tools and record exact evidence.
- Use `spawn_agent` / `wait_agent` only for independent implementation tasks,
  read-only exploration, fresh judgment panels, or adversarial review.
- Fall back to sequential main-agent execution when multi-agent tools are not
  available, and record the fallback in the evidence summary.
- Never execute the Claude edition's bundled workflow JavaScript files.
- Keep doer and grader separate. S3 edits code; S4 verifies and must not edit
  product code.

## Preconditions

Before starting:

1. Confirm `acceptance-gate:acceptance` is available.
2. Confirm `superpowers:brainstorming` and `superpowers:writing-plans` are
   available when the loop will use Superpowers planning.
3. Confirm `_acceptance/config.yaml` exists. If missing, stop and run
   `/acceptance-init` or the acceptance-gate init flow first.
4. Locate acceptance templates, personas, and scripts in Codex cache without
   hardcoding a version:
   `~/.codex/plugins/cache/*/acceptance-gate/*/`.
5. Read repo guidance (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`) when present.

## State Machine

Use `_acceptance/<slug>/contract.md` frontmatter as the durable state.

| status | Stage |
|---|---|
| missing workspace | S0 intake, then S1 design |
| `draft` | Gate 1 package review |
| `approved` | S2 plan, then S3 execute |
| `implemented` | S4 verify |
| `verified` | Gate 2 evidence review |
| `signed-off` | S5 handoff |

For resume requests, read status first and announce the stage before doing work.

## S0 - Intake

1. Identify expected touched files from the feature description.
2. Classify against `_acceptance/config.yaml`:
   - all touched files match `risk_tiers.t1_skip_globs`: exit the loop and use
     normal repo verification.
   - any touched file matches `risk_tiers.t3_paths`: use T3.
   - otherwise use T2.
3. Derive `slug` as kebab-case. Use `_acceptance/<slug>/` for artifacts.
4. If a later stage discovers the tier was too low, raise the tier and return to
   the earliest missing stage.

## S1 - Design, Contract, Evals

Produce one coherent Gate 1 package. Do not enter Gate 1 until all three
artifacts exist:

1. Run `superpowers:brainstorming` when available and useful.
2. For features touching three or more subsystems, inspect those areas before
   proposing the approach. Use read-only `spawn_agent` workers when available;
   otherwise inspect sequentially.
3. Write a design doc using repo convention, commonly
   `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md`.
4. Write `_acceptance/<slug>/contract.md` using the acceptance-gate contract
   shape: status `draft`, risk tier, surfaces, 5-15 Given/When/Then criteria,
   judgment tags where needed, at least two out-of-scope items, and
   `time_human_minutes.gate1` / `time_human_minutes.gate2` placeholders.
5. Write `_acceptance/<slug>/evals.yaml`. Map every AC to at least one eval.
   Prefer `test`, `script`, or `ui-check` before `judgment`. Use `config:`
   command references, not hardcoded project commands.
6. Add boundary and should-NOT-fire coverage where criteria have thresholds,
   permissions, limits, or out-of-scope behavior. Run the advisory coverage lint
   when available:
   `node <acceptance-gate>/scripts/eval-coverage-lint.js <repo> --slug <slug>`.

Gate 1 default presentation: render the decision card first with
`/acceptance-card <slug>` or
`node <acceptance-gate>/scripts/gate-card.js --root . --slug <slug>`.
The card is presentation only; contract and evals remain the source of truth.
Also provide the full design summary, contract, and AC-to-eval mapping. On
approval, update `approved_by`, `approved_at`, and `time_human_minutes.gate1`.

## S2 - Plan

Create an implementation plan with `superpowers:writing-plans` when available,
commonly `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`. Each task must list
files, verification command, related eval ids, and `independent: true|false`.
For T3, stop for plan review before execution. For T2, continue unless the user
requests review.

## S3 - Execute

Implement the plan in the main Codex agent by default. When the plan has at
least two independent tasks and Codex exposes multi-agent tools, split only
tasks with disjoint file ownership:

1. Spawn one worker per independent task with explicit owned files and verify
   command.
2. Tell workers not to revert, stash, reset, switch branches, or overwrite
   others' changes.
3. Wait for every worker, review returned diffs, and integrate deliberately.
4. Repair failed tasks sequentially in the main agent.

At the end, run task-level verification and set contract status to
`implemented`. Do not run acceptance evals in S3; S4 owns grading.

## S4 - Verify

Verify as grader, not doer.

1. Parse `_acceptance/<slug>/evals.yaml`. Preserve optional `runs`; an integer
   greater than 1 means stochastic/LLM eval and must report `pass_rate`.
2. Resolve every `cmd: config:a.b.c` from `_acceptance/config.yaml`. Preserve
   the original `config:` ref as `ref`; evidence `verifier` must use that ref,
   not the resolved shell command.
3. Resolve `feature_loop.suite_keys`. If missing, stop once, list available
   `executors.*` keys, ask the human which build/typecheck/lint/smoke commands
   should run every round, then write those keys to config. Do not guess and do
   not run every executor automatically.
4. Resolve judgment inputs to absolute paths rooted at `_acceptance/<slug>/`.
5. Locate `judge-personas.md`, `evidence-report-template.md`,
   `gate-card.js`, `evidence-page.js`, and `recheck-evidence.js` from the
   Codex acceptance-gate cache.
6. Detect `diffBase` from remote default branch, then `main`, `master`,
   `develop`, or `trunk`; ask the human if none exists.
7. Compute `round`: no `evidence-report.md` means round 1; otherwise count prior
   `## Iterations` entries and add one.
8. Deduplicate machine commands. Run each distinct command once, or N times when
   the covered evals specify `runs`. Missing results are `BLOCKED`, never PASS.
   For N runs, report `runs`, `pass_rate`, and route mixed pass/fail as
   `PENDING-JUDGMENT` under the `## Variance` section.
9. Run A/B baseline checks for commands attached to feature evals on `diffBase`
   in an isolated worktree. Record `baseline: red|green|n-a`. Green on both HEAD
   and baseline is non-discriminating; list it under `## Analyst`.
10. For `ui-check`, run configured steps, manage any dev server safely, assert
    machine-checkable outcomes, and save a frame per state transition such as
    `evidence/E3-step1.png`, `evidence/E3-step2.png`. The first frame goes in
    `screenshot:`; additional frames are found by `evidence-page.html` and play
    as a slideshow. If screenshots are unavailable, save asserted HTML and
    record the fallback.
11. For `judgment`, use lenses `domain-correctness`,
    `operational-feasibility`, and `spec-alignment`. Use fresh `spawn_agent`
    judges when available; otherwise run separated sequential passes. Judges
    must not read the doer's reasoning. A 2-of-3 PASS proposes PASS, 2-of-3 FAIL
    proposes FAIL, anything else proposes UNCERTAIN. T3 keeps every judgment
    item pending for human override.
12. Review the diff with repo guidance. Run a conventions/invariants reviewer
    and a bug/silent-failure reviewer. Adversarially refute each finding before
    treating it as confirmed. Write confirmed and unverified findings to
    `_acceptance/<slug>/review-findings.md`.
13. Capture provenance mechanically. Write `enforcement_mode: strict|warn|off`
    from `_acceptance/config.yaml` and `bypass_used: true|false` from the actual
    bypass environment. These fields are merge-boundary evidence and must not be
    invented by judgment.
14. Write `_acceptance/<slug>/evidence-report.md` from the acceptance-gate
    template. Every machine PASS block must include `run_id`, `exit_code: 0`,
    `verifier`, and `verified_at`. Mint stable ids like
    `minted-<slug>-<evalId>-r<round>` when the command has no run id.

Verdict routing:

- `PASS`: all required evals pass, no unresolved judgment, and no variance.
- `PENDING-JUDGMENT`: machine evals pass but human judgment is required, T3 has
  any judgment item, or variance requires a human threshold decision.
- `REJECT`: implementation or evals failed.
- `BLOCKED`: verifier cannot run due to environment/config/tooling issues.

For `REJECT`, return to S3 and run a new verify round. Cap at three rounds, then
stop and escalate with a round-by-round summary. For `BLOCKED`, present exact
blocked command and reason, fix environment/config, and rerun the same round.

## Gate 2

Render the decision card first with `/acceptance-card <slug>` or
`node <acceptance-gate>/scripts/gate-card.js --root . --slug <slug>`. Also
generate the full evidence page:
`node <acceptance-gate>/scripts/evidence-page.js --root . --slug <slug>`,
which writes `_acceptance/<slug>/evidence-page.html`.

Present one package: verdict, per-eval table, judgment proposals, variance,
baseline analyst notes, `review-findings.md`, any incomplete review warning,
and `git diff --stat <diffBase>...HEAD`. Translate every judgment or variance
item into a non-technical product/business question with proposal, rationale,
tradeoffs, and reversibility. Do not ask the human to judge schemas, commands,
or implementation details.

Ask the human to resolve UNCERTAIN/variance items, fill `human_signoff`, and
provide `time_human_minutes.gate2`. Do not self-sign. After signoff, update
contract status to `signed-off`.

## S5 - Handoff

Prepare final handoff or PR according to repo policy. Run
`scripts/pre-merge-check.sh` if present or copy it, `scripts/recheck-evidence.js`,
and `lib/evidence-core.js` from the installed acceptance-gate plugin cache.
Report whether CI enforces the same check before merge. If `recheck: strict` is
enabled, committed PASS evidence must still satisfy the L1/L2/L3 evidence bar.

## Conflict Rules

- Repo guidance wins over default verification conventions.
- Evals are approved before implementation; do not invent new acceptance scope
  after coding without returning to Gate 1.
- `verification-before-completion` is satisfied by S4 evidence.
- Doer != grader: implementation and S4 verification must stay separated.
