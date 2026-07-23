---
name: feature-loop-codex
description: This skill should be used when the user asks to "run feature-loop-codex", "start a Codex feature loop", "resume a Codex feature loop", "build this feature with acceptance-gate in Codex", or wants a Codex-native version of feature-loop without Claude Code Workflow scripts.
version: 1.13.0
---

# feature-loop-codex

Run a Codex-native feature development loop on top of `acceptance-gate`.
Preserve the Claude `feature-loop` 1.13.0 discipline while replacing workflow
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

1. Confirm `acceptance-gate:acceptance` and `acceptance-gate:morphological-scan`
   are available (the latter needs acceptance-gate ≥ 1.16; if missing, stop and
   have the user update the plugin).
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
7. Check `.codex/agents` for the balanced role policy. When it is missing and
   the user wants role-level budget routing, invoke the `feature-loop-model-init`
   skill. A missing policy does not silently block the loop; record session
   inheritance as described below.

## Codex Role Policy

Use project custom agents when both the file and a named-agent selector are
available:

| Agent | Purpose | Requested model | Requested effort |
|---|---|---|---|
| `feature_loop_explorer` | bounded read-heavy discovery | `gpt-5.6-terra` | `medium` |
| `feature_loop_executor` | independent implementation | `gpt-5.6-sol` | `high` |
| `acceptance_ui_verifier` | UI execution and observed evidence | `gpt-5.6-sol` | `medium` |
| `acceptance_judge` | blind scoped judgment | `gpt-5.6-sol` | `medium` |
| `acceptance_reviewer` | high-recall invariants and bug review | `gpt-5.6-sol` | `high` |
| `acceptance_refuter` | one-finding adversarial check | `gpt-5.6-terra` | `medium` |

For every model-backed role, choose one routing mode in this exact order:

```text
named agent selectable and installed -> custom-agent
spawn available but no named-agent selector -> session-inherited
no usable spawn surface -> sequential-fallback
```

Do not pass Claude aliases from `feature_loop.models` to Codex, and do not
pretend the task name selects a model when the tool schema exposes no named
agent field. The configured values are requested policy, not proof of the
effective runtime model. Deterministic test/script commands, provenance,
run-log writes, and report field copying stay in shell/tool execution and do
not get a model worker.

## State Machine

Use `_acceptance/<slug>/contract.md` frontmatter as the durable state.

| status | Stage |
|---|---|
| missing workspace | S0 intake, then S1 design |
| `draft` | Gate 1 package review (CT-S: missing `gap-probe.md` and no `descope` entry starting `"bỏ gap-probe"` → yellow flag + one question to run step 8 — never auto-run, never block; pre-1.14.0 workspaces take this path) |
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

A staleness round entered this way is a DELTA round (P1) when the prior report
verdict was PASS-family: keep the changed-file list (excluding `_acceptance/**`)
and the old `verified_commit` as the carry-forward anchor for S4. Fix rounds
after REJECT have no anchor and always rerun everything.

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

## Coverage Switch (CT-S)

CT-S is ON exactly when `risk_tier` is T2 or T3 — the tier is machine-derived
in S0, so activation never depends on semantic judgment (T1 exits at S0 and
never reaches it). The default is inverted to prevent silent skips: the
question is not "should we scan?" (a forgotten scan is invisible) but "do we
want to skip the scan?" (a skip costs one visible `descope` entry). Three
layers:

1. **S1 default step:** enumerate the AC space with the
   `acceptance-gate:morphological-scan` skill during brainstorming (see S1).
2. **Structural slot:** the contract MUST contain a `## Coverage` section —
   axes + CE measure per axis, or a single skip line pointing at the descope
   entry. A missing section blocks entry to Gate 1.
3. **Card surface:** the Gate-1 card renders the coverage block and warns when
   the section is missing or an axis is tagged `[CE chưa kiểm chứng]`. The
   machine enforces PRESENCE and traceability only; whether coverage is truly
   sufficient stays a human call at the gate.

Old workspaces (contracts created before this switch) get a card warning only —
never block resume, never force migration.

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
artifacts exist — and, with CT-S on, until the contract has its `## Coverage`
section (even if it is a single skip line):

1. Run `superpowers:brainstorming` when available and useful.
2. For features touching three or more subsystems, inspect those areas before
   proposing the approach. Use `feature_loop_explorer` through `custom-agent`
   routing when selectable; otherwise use a read-only spawned worker with
   `session-inherited`, or inspect sequentially with `sequential-fallback`.
3. **(CT-S, default for T2/T3)** During or right after brainstorming, run the
   `acceptance-gate:morphological-scan` skill over the AC space, choosing the
   preset from that skill's routing table (entity-feature / test-matrix /
   risk-premortem / ...). Feed the output into the artifacts below: Core cells
   become AC candidates (merge cells into one AC when Core exceeds 15 to keep
   the 5-15 cap); Later/Never become out-of-scope items plus a `descope` ledger
   entry; axes + CE measures become the contract's `## Coverage` section (keep
   any `[CE chưa kiểm chứng]` tag — the card will flag it). If the problem is
   not an enumeration problem (single-axis, obvious ACs, scope fixed by an
   external spec), skip the scan with an explicit auto-drafted `descope` entry
   plus a one-line Coverage skip note. Never skip silently.
4. Write a design doc using repo convention, commonly
   `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md`.
5. Write `_acceptance/<slug>/contract.md` using the acceptance-gate contract
   shape: status `draft`, risk tier, surfaces, 5-15 Given/When/Then criteria,
   judgment tags where needed, a `## Coverage` section carrying the CT-S output
   (axes + CE measure, or one skip line), at least two out-of-scope items, and
   `time_human_minutes.gate1` / `time_human_minutes.gate2` placeholders.
6. Write `_acceptance/<slug>/evals.yaml`. Map every AC to at least one eval.
   Prefer `test`, `script`, or `ui-check` before `judgment`. Use `config:`
   command references, not hardcoded project commands. Machine/ui evals SHOULD
   declare `paths: [<repo-relative globs>]` — the files the eval actually
   checks — enabling P1 carry-forward on delta staleness rounds; an eval
   without `paths` always reruns (safe default).
7. Add boundary and should-NOT-fire coverage where criteria have thresholds,
   permissions, limits, or out-of-scope behavior. Run the advisory coverage lint
   when available:
   `node <acceptance-gate>/scripts/eval-coverage-lint.js <repo> --slug <slug>`.
8. **(CT-S, default for T2/T3) Clean-context gap-probe before rendering the
   Gate 1 card.** Run ONE fresh read-only spawned worker (`session-inherited`,
   or `custom-agent` routing when selectable). Inputs are ONLY the design doc,
   `contract.md`, `evals.yaml`, and `decisions.jsonl` (skip the ledger if
   absent) — never the brainstorm conversation, never repo code (the critic
   judges artifacts, not code). The prompt keeps six elements: (1) presuppose
   gaps exist — "list what is missing in this artifact set, ranked by
   severity"; (2) scope guard — only gaps that make THIS feature fail its own
   acceptance or make Gate 1 approve wrongly, no wishlist; (3) every finding
   carries artifact (design|contract|evals) · concrete failure scenario ·
   severity P0/P1/P2 · proposed measure — no scenario means DROP; (4) mandatory
   cross-checks: ACs with no eval, GWTs that cannot be measured, Coverage axes
   with no AC; (5) at most 5 findings; verdict `clean` is a VALID outcome;
   (6) never relitigate sealed/descoped ledger decisions without a NEW reason.
   Write `_acceptance/<slug>/gap-probe.md` — frontmatter `slug / at (ISO UTC) /
   verdict: clean|findings|probe-failed / p0 / p1 / p2` plus a `## Findings`
   table `| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |`
   (cells must not contain `|`; `clean` → one line "Không còn lỗ đáng kể") —
   then disposition every finding in the Xử lý column: **P0 = fix the artifact
   now OR `human-gate1`, never silent**; P1/P2 = `fixed: <what>` |
   `deferred: <note>` (a `revisit` entry when it qualifies) |
   `rejected: <one-line reason>`. One pass only — never re-probe after fixing;
   code gets its own S4 rounds. No selectable worker routing, or the worker
   fails twice → write `verdict: probe-failed` (yellow flag on the card,
   non-blocking). If the user opts out, append an auto-drafted `descope` entry
   whose decision starts with `"bỏ gap-probe"` and skip the file.

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
ledger. Gate 1 default presentation invokes the `acceptance-card` skill. The Gate 1
card now includes the "Phản biện context sạch" block (findings + dispositions
from gap-probe.md; absent file / probe-failed → yellow flag, non-blocking).
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
`feature_loop.models`, treat it as Claude Code configuration only. Apply the
Codex Role Policy when named agents are selectable; otherwise inherit the
session model and record `session-inherited` instead of claiming the Claude
roles were pinned.

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

1. Spawn one `feature_loop_executor` per independent task when named selection
   is available. Otherwise spawn a normal worker with `session-inherited`.
   Always provide explicit owned files and a verify command.
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
   On a DELTA round (P1): a machine/ui eval whose `paths` globs intersect no
   changed file AND whose previous-round run-log line has `exit_code: 0`
   carries forward — do not rerun it. Append a run-log line for THIS round with
   the ORIGINAL `run_id` plus `carried_from_round: <N>`, and render its report
   block with the original `run_id`/`verified_at`, `exit_code: 0`, a
   `carried_from_round: <N>` line, and no `screenshot:`/`observed:` fields.
   Suite commands always rerun. If nothing fresh remains (no commands, no fresh
   judgment), the round is `BLOCKED` — never an empty PASS.
9. Run A/B baseline checks for commands attached to feature evals on `diffBase`
   in an isolated worktree. Record `baseline: red|green|n-a`. Green on both HEAD
   and baseline is non-discriminating; list it under `## Analyst`.
   P2 (baseline-once): compute `sha256` of `evals.yaml`; if it equals
   `evals_hash` on the last `"kind":"baseline"` run-log line, skip the baseline
   entirely, carry the Analyst list from that line (open `## Analyst` with
   "carried from round <N> — baseline not re-measured this round", per-block
   `baseline: n-a`), and log a baseline line with `carried_from_round`.
   Otherwise run it and log a fresh baseline line with the hash.
10. For `ui-check`, use `acceptance_ui_verifier` when selectable, or the current
    grader under the recorded fallback mode. Run configured steps, manage any
    dev server safely, assert machine-checkable outcomes, and save a frame per state transition such as
    `evidence/E3-step1.png`, `evidence/E3-step2.png`. The first frame goes in
    `screenshot:`; additional frames are found by `evidence-page.html` and play
    as a slideshow. If screenshots are unavailable, save asserted HTML and
    record the fallback.
11. For `judgment`, use lenses `domain-correctness`,
    `operational-feasibility`, and `spec-alignment`. Dispatch three fresh
    `acceptance_judge` instances when named selection is available; otherwise
    use fresh session-inherited judges or separated sequential passes. Judges
    must not read the doer's reasoning. A 2-of-3 PASS proposes PASS, 2-of-3 FAIL
    proposes FAIL, anything else proposes UNCERTAIN. T3 keeps every judgment
    item pending for human override.
    P3 (panel memo, any round ≥ 2): before dispatching, compute
    `inputs_hash = sha256(question + input file contents in declared order)`.
    If it equals `inputs_hash` on the eval's last `"kind":"panel"` run-log
    line, carry the panel forward — do not re-judge; an UNCERTAIN item awaiting
    a human override with unchanged inputs stays carried (the answer lives at
    Gate 2, not in the machine). Log a panel line with `carried_from_round` and
    render the report panel as "carried from round <N> — inputs unchanged"
    with lens+verdict votes only. Otherwise judge fresh and log a panel line
    with the new hash.
12. Review the diff with repo guidance. Run two `acceptance_reviewer` passes:
    conventions/invariants and bug/silent-failure. Dispatch one
    `acceptance_refuter` per proposed finding before treating it as confirmed.
    Use the recorded fallback modes when named agents are unavailable. Write
    confirmed and unverified findings to
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
    Add this auditable routing block without inventing effective model data:

    ```text
    ## Codex routing
    policy: .codex/agents
    - role: <agent role>
      mode: custom-agent|session-inherited|sequential-fallback
      requested_model: <configured model or unavailable>
      requested_reasoning_effort: <configured effort or unavailable>
      invocations: <integer>
      effective_model: <runtime value only when exposed; otherwise unavailable>
    deterministic_executor_workers: 0
    ```
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
baseline analyst notes, what this round carried forward (P1 evals, P3 panels,
P2 baseline — carry-forward must be visible, never folded into "machine
handled it"), `review-findings.md`, any incomplete review warning,
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
