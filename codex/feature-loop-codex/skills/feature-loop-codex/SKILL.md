---
name: feature-loop-codex
description: This skill should be used when the user asks to "run feature-loop-codex", "start a Codex feature loop", "resume a Codex feature loop", "build this feature with acceptance-gate in Codex", or wants a Codex-native version of feature-loop without Claude Code Workflow scripts.
version: 1.11.3
---

# feature-loop-codex

Run a Codex-native feature development loop on top of `acceptance-gate`.
Preserve the Claude `feature-loop` 1.11.2 discipline while replacing workflow
scripts with Codex-native main-agent work, shell commands, and optional
`spawn_agent` / `wait_agent` calls.

## Runtime Contract

Use Codex-native orchestration only:

- Drive state from `_acceptance/<slug>/contract.md` frontmatter and local files.
- Run deterministic commands with shell tools and record exact evidence.
- Use `spawn_agent` / `wait_agent` only for independent implementation tasks,
  read-only exploration, fresh judgment panels, or adversarial review.
- Fall back to a separated sequential grader pass when multi-agent tools are
  unavailable, record the degradation, and never describe it as a fresh agent.
- Never execute the Claude edition's bundled workflow JavaScript files.
- Never rely on Claude Code built-ins such as Workflow orchestration, Claude Preview,
  or Claude Design. Use browser/tooling available in the Codex session and the
  portable design-reference path described below.
- Keep doer and grader separate. S3 edits code; S4 verifies and must not edit
  product code.

## Preconditions

Before starting:

1. Confirm `acceptance-gate:acceptance` is available.
2. Confirm `superpowers:brainstorming` and `superpowers:writing-plans` are
   available when the loop will use Superpowers planning.
3. Confirm `_acceptance/config.yaml` exists. If missing, stop and invoke the
   `acceptance-init` skill first.
4. Locate acceptance templates, personas, and scripts in Codex cache without
   hardcoding a version:
   `~/.codex/plugins/cache/*/acceptance-gate/*/`.
5. For web-UI work, locate design-loop when installed:
   `~/.codex/plugins/cache/*/design-loop/*/`, or fall back to the repo-local
   `design-loop/` directory when developing this kit from source.
6. Read repo guidance (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`) when present.

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

Before presenting Gate 2 from `verified`, run the staleness guard. Read
`verified_commit` from `_acceptance/<slug>/evidence-report.md`; when present,
run `git diff --name-only <verified_commit>`. If any changed file is outside
`_acceptance/` and not matched by `risk_tiers.t1_skip_globs`, the evidence is
STALE. Set the contract back to `implemented` and re-enter S4. If the report has
no `verified_commit`, warn and recommend re-verification rather than presenting
the report as current.

## Decision Ledger

Use `_acceptance/<slug>/decisions.jsonl` as an append-only rationale ledger. It
never overrides the contract or evals. Parse one JSON object per line; report
malformed lines and ignore only those lines.

Each decision uses:

```json
{"id":"d-<UTC>-<suffix>","type":"descope|approach|fix|revisit","stage":"S1|S2|S3|S4-r<N>|gate1|gate2","at":"<ISO>","decision":"one sentence","impact":"saved cost and accepted risk"}
```

Optional fields are `serves`, `revisit`, and `supersedes`. Append with
`apply_patch`; never rewrite or delete prior lines. Log only when a real option
was rejected, a downside was intentionally accepted, or a revisit condition
exists. A descope that changes an AC still requires contract/eval edits and
Gate-1 reapproval.

When Gate 1 is approved, append a seal entry in this shape:
`{"id":"d-...","type":"seal","gate":1,"at":"<ISO>"}`. Every entry after
the latest seal is provisional and must be shown separately at Gate 2. Reverse
a prior decision only with a new entry containing `supersedes` and human
approval at the next gate.

## Design Lanes

Derive two switches from artifacts; never store a separate design tier:

| Switch | Machine-readable condition | Effect |
|---|---|---|
| **CT1** UI touched | `design-detect-surface` returns `surface:true` and config has `executors.design` | add per-surface static and P0 gate evals; ask the lane question |
| **CT2** design ceremony | `evidence/design/provenance.json` exists or evals contain `design.fidelity` | require state matrix, portable reference, provenance, fidelity warning, and Gate-2 panel |

User-facing lane names are **D0** = no CT1, **D1** = CT1 without CT2, and
**D2** = CT1 plus CT2. They are presentation terms only.

At the end of S1, when CT1 is on and CT2 is off, ask one question: new surface
or redesign → run the `design-mockup` skill and use D2; existing-surface tweak →
use D1 static-only. Always record this lane decision in `decisions.jsonl`:
`approach` for D2, or `descope` for D1 with the explicit loss of
mockup/fidelity/panel evidence.

On resume, CT2 plus status `approved` or later requires provenance before work
continues. In S4, when `design.surface_globs` exists, compare changed files with
those globs. A matching UI file with no static or fidelity eval is a tier
mismatch: stop for lane elevation or an explicit descope decision.

## S0 - Intake

1. Identify expected touched files from the feature description.
2. Classify against `_acceptance/config.yaml`:
   - all touched files match `risk_tiers.t1_skip_globs`: exit the loop and use
     normal repo verification only after showing the `<path> -> <glob>` match
     table and getting an explicit T1 confirmation from the human.
   - any touched file matches `risk_tiers.t3_paths`: use T3.
   - otherwise use T2.
3. Derive `slug` as kebab-case. Use `_acceptance/<slug>/` for artifacts.
4. If `_acceptance/<slug>/` already exists, compare the contract `feature:` and
   `owner:` against the current request. A different feature is a slug collision,
   not a resume; require a new slug such as `<slug>-2` or a dated suffix.
5. If a later stage discovers the tier was too low, raise the tier and return to
   the earliest missing stage.
6. Detect web-UI surfaces from expected files and, once a contract exists,
   `contract.surfaces`. If `_acceptance/config.yaml` contains
   `executors.design`, arm design-loop guards. If the feature is web UI but the
   repo is not wired, warn clearly and continue functional-only only when the
   human accepts that reduced design coverage.

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

For CT1 web-UI surfaces, add per-surface `config:executors.design.static` and
`config:executors.design.gate` evals with rendered captures and
`--require-html`. Add the touched surface and states to the design doc.

For CT2 only, also:

1. Add a domain-state × theme × viewport state matrix.
2. Add the app-space seam: data shape plus token vocabulary in app token names.
3. Split machine-checkable design requirements from perceptual judgment items.
4. Invoke the `design-mockup` skill to create a portable reference from a design
   repo, checked-in HTML/CSS, generated files, or saved screenshots.
5. Capture frames under `_acceptance/<slug>/evidence/design/reference/` and
   write `provenance.json` through the consumer plugin runner.

Do not enter Gate 1 in D2 without the state matrix and provenance. D1 proceeds
without mockup ceremony only after its visible descope ledger entry.

At the end of S1, append every qualifying approach/descope decision to the
ledger. Gate 1 default presentation invokes the `acceptance-card` skill.
The card is presentation only; contract and evals remain the source of truth.
Also provide the full design summary, design-reference provenance when present,
contract, and AC-to-eval mapping. On approval, update `approved_by`,
`approved_at`, and `time_human_minutes.gate1`, then append the Gate-1 seal.

If the user wants the machine-owned segment S2→S4 to continue unattended,
suggest the native Codex `/goal` command with an objective that ends at
`contract.status: verified`. Never create or suggest a goal that reaches
`signed-off`; Gate 2 remains human-owned. If the current model is more expensive
than the machine segment needs, suggest that the user open the native `/model`
picker before setting the goal. Do not change the model or create the goal
without the user's explicit action. When `_acceptance/config.yaml` contains
`feature_loop.models`, warn that the current Codex spawn interface does not
expose role-specific model routing; inherit the session model and record that
degradation instead of claiming the roles were pinned.

## S2 - Plan

Create an implementation plan with `superpowers:writing-plans` when available,
commonly `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`. Each task must list
files, verification command, related eval ids, and `independent: true|false`.
For T3, stop for plan review before execution. For T2, continue unless the user
requests review. Append any load-bearing approach or descope decision to the
ledger.

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

When execution must depart from the approved plan, append a provisional `fix`
or `descope` entry immediately with `stage: S3`.

At the end, run task-level verification and set contract status to
`implemented`. Do not run acceptance evals in S3; S4 owns grading.

## S4 - Verify

Verify as grader, not doer.

Before running evals, apply the `design.surface_globs` tier-mismatch guard from
Design Lanes. Do not continue with uncovered UI changes until the lane is raised
or the human confirms a descope entry.

1. Parse `_acceptance/<slug>/evals.yaml`. Preserve optional `runs`; an integer
   greater than 1 means stochastic/LLM eval and must report `pass_rate`.
2. Resolve every `cmd: config:a.b.c` from `_acceptance/config.yaml`. Preserve
   the original `config:` ref as `ref`; evidence `verifier` must use that ref,
   not the resolved shell command.
3. Resolve `feature_loop.suite_keys`. If missing, stop once, list available
   `executors.*` keys, ask the human which build/typecheck/lint/smoke commands
   should run every round, then write those keys with the acceptance-gate
   append-only config patcher through the consumer runner:
   `node scripts/codex-plugin-runner.mjs acceptance-gate config-patch --config _acceptance/config.yaml --key feature_loop.suite_keys --value "[<keys>]" --write`.
   Do not guess and do not run every executor automatically.
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
14. For web-UI surfaces with design-loop wired, verify the design reference
    before synthesizing PASS:
    `node <design-loop>/scripts/provenance.mjs verify --slug <slug>`.
    Missing provenance is `BLOCKED`, not a quiet skip. Run per-surface design
    evals just like other evals. If `config:executors.design.fidelity` returns a
    skipped/advisory result because the design repo is unavailable, put a clear
    Gate-2 warning in the report: fidelity pixel-diff did not run, so visual
    comparison still needs the human onion-skin review.
15. Write `_acceptance/<slug>/evidence-report.md` from the acceptance-gate
    template. Every machine PASS block must include `run_id`, `exit_code: 0`,
    `verifier`, and `verified_at`. Mint stable ids like
    `minted-<slug>-<evalId>-r<round>` when the command has no run id.
16. On PASS or PENDING-JUDGMENT, commit the machine-written evidence package
    separately before Gate 2 when repo policy allows commits. The human-owned
    Gate-2 edits must remain a separate commit in repos with
    `signoff.require_human_commit: true`.

Verdict routing:

- `PASS`: all required evals pass, no unresolved judgment, and no variance.
- `PENDING-JUDGMENT`: machine evals pass but human judgment is required, T3 has
  any judgment item, or variance requires a human threshold decision.
- `REJECT`: implementation or evals failed.
- `BLOCKED`: verifier cannot run due to environment/config/tooling issues.

For `REJECT`, return to S3 and run a new verify round. Cap at three rounds, then
stop and escalate with a round-by-round summary. For `BLOCKED`, present exact
blocked command and reason, fix environment/config, and rerun the same round.
Before each REJECT→fix transition, append a `fix` decision with
`stage: S4-r<N>` and the chosen repair rationale.

## Gate 2

Invoke the `acceptance-card` skill first. It also generates the full evidence
page at `_acceptance/<slug>/evidence-page.html`.

Present one package: verdict, per-eval table, judgment proposals, variance,
baseline analyst notes, `review-findings.md`, any incomplete review warning,
and `git diff --stat <diffBase>...HEAD`. Translate every judgment or variance
item into a non-technical product/business question with proposal, rationale,
tradeoffs, and reversibility. Do not ask the human to judge schemas, commands,
or implementation details.

For web-UI surfaces with perceptual ACs, run or present the design evidence
panel before asking for signoff:
invoke the `design-evidence` skill. The
human resolves perceptual ACs from reference vs implementation evidence, not
from text alone. Any fidelity-skip warning from S4 must appear at the top of the
Gate-2 package.

Ask the human to resolve UNCERTAIN/variance items, fill `human_signoff`, and
provide `time_human_minutes.gate2`. Do not self-sign. After signoff, update
contract status to `signed-off`. Present every provisional ledger entry and
append a Gate-2 `revisit` entry when the human leaves a follow-up condition.

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
