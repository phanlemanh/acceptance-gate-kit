# Evidence Report Template

Written by the VERIFY phase (fresh-context subagent) to
`_acceptance/{slug}/evidence-report.md`. The acceptance-evidence-gate hook
enforces this format at write time: a PASS verdict without complete, authentic
evidence is blocked.

Verdict rules:
- `PASS` — every eval passed AND no judgment item is pending a human.
  Requires evidence blocks below. Hook-enforced consistency: a PASS report
  must contain ZERO `verdict: FAIL` lines and ZERO non-zero exit tokens
  (`exit_code:`, `exit=`) anywhere — including inside `output:` excerpts;
  sanitize pasted logs. Screenshot-bearing blocks additionally need a substantive observed: (see Field notes). If anything failed, the verdict is REJECT.
- `PENDING-JUDGMENT` — all machine evals passed but ≥1 judgment item is
  UNCERTAIN (or, for T3, awaits its mandatory direct human verdict). This is
  the verdict the verify subagent writes so the report can reach Gate 2; the
  HUMAN upgrades it to PASS after filling `human_override` lines.
- `REJECT` — ≥1 eval failed. List `failed_evals`. No evidence requirements
  (failing honestly is always legal).
- `BLOCKED` — verifier could not run (env broken, MCP missing). Give `reason`.
- Per-eval `UNCERTAIN` (judgment only): overall PASS is blocked until each
  UNCERTAIN carries a real `human_override: <name> <date>` value (a
  comment-only placeholder does not count).
- T3 contracts: overall PASS additionally requires `human_override` on EVERY
  judgment item, regardless of the judge's verdict (hook-enforced).

Field notes: use `verified_by:` for attribution only — `checked_by:` is
reserved (parsed as a verifier and will fail authenticity). `run_id` must be
at least 4 chars; if the verifier prints none, mint `<slug>-<eval>-<date>`.
Run-log reconciliation: when `_acceptance/{slug}/run-log.jsonl` exists (the
verify machinery appends one machine-computed JSON line per machine/ui eval,
at run time), every `run_id` in a PASS report must appear in that log — the
hook and the CI re-check both block ids that were never logged. Copy run_ids
from the actual runs; never invent them. A report without a sibling log
(older flow) is tolerated; pre-merge NOTEs it.

Observed (hook-enforced from schema_version 2): every evidence block carrying a
`screenshot:` (PNG frames or the .html fallback) must also carry `observed:` —
1-3 lines describing what is actually VISIBLE in the saved frames, written only
AFTER opening each frame with a multimodal Read, cross-checked against the
eval's `expected`. Describe the content, not the command. If what you see
contradicts `expected`, that eval FAILS even when the command exited 0. If the
verify machinery supplied no observed text (older workflow), the report writer
must Read the frames and write it before claiming PASS. The hook blocks a v2
PASS report whose screenshot blocks lack a substantive observed (>= 20 chars
after stripping placeholders); schema_version < 2 reports are tolerated and
pre-merge NOTEs them.

Provenance (CI-enforced, not hook-enforced): REPLACE the `enforcement_mode` /
`bypass_used` placeholders with the real values — `enforcement` from
`_acceptance/config.yaml` (default `strict`), and `true` iff
`ACCEPTANCE_GATE_BYPASS` was set (`printf '%s' "$ACCEPTANCE_GATE_BYPASS"` = `1`).
`pre-merge-check.sh` then blocks a merge whose PASS was produced unenforced
(`enforcement_mode: off`) or bypassed (`bypass_used: true`, unless a human adds
`bypass_ack: <name> <date>`); `warn` only warns — so the green you merge is a
green that was actually gated.

Pinned tree (`verified_commit`): set it to `git rev-parse HEAD` at verify time —
the exact tree the verifiers ran on. The hook rejects a value that is not a
7-40 char hex SHA (when the field is present); omit the field ONLY when the
repo is not a git repo. `pre-merge-check.sh` blocks the merge when any non-gate
file (outside `_acceptance/`, not matching `risk_tiers.t1_skip_globs`) changed
after this commit — code modified after verify cannot ride the old evidence;
re-verify instead. On resume, the skills downgrade contract `status: verified`
back to `implemented` when they detect such drift. A report without the field
(older template) is tolerated with a NOTE: staleness is then unverifiable.

Baseline (A/B): each machine eval may carry a `baseline:` field — its status on
the diffBase (pre-feature) tree. `red` = it failed on the old code (good: the
eval discriminates), `green` = it passed on the old code too (non-discriminating
— the `## Analyst` section flags these), `n-a` = baseline could not run. Use the
WORDS red/green/n-a, never an exit number, so the consistency scan does not
misread a baseline as a failed eval.

Variance (run-N): an eval may carry `runs: N` (N > 1) when it is stochastic
(crosses `ctx.providers.invoke` / an LLM generator). It runs N times and reports
`pass_rate: <passes>/<N>` (a fraction word, never an exit number). A mixed
pass_rate (not 0/N, not N/N) puts the overall verdict in PENDING-JUDGMENT and is
listed under `## Variance` for a human to judge — like a judgment item. A
deterministic eval omits `runs`/`pass_rate` and must be 0/N or N/N (a mixed
deterministic result is a flaky test, not a score).

---8<---
---
schema_version: 2
feature_slug: {{slug}}
verdict: {{PASS|PENDING-JUDGMENT|REJECT|BLOCKED}}
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: {{strict|warn|off}}   # the `enforcement` value from _acceptance/config.yaml (default strict). CI pre-merge BLOCKS off; warn only warns.
bypass_used: {{true|false}}              # true iff ACCEPTANCE_GATE_BYPASS=1 at verify. CI pre-merge BLOCKS true unless a human records bypass_ack.
verified_commit: {{git rev-parse HEAD at verify time}}   # pins the evidence to the exact tree verified. CI pre-merge BLOCKS when non-gate files changed after it (stale evidence — re-verify). Omit ONLY if not a git repo; hook rejects non-SHA values.
# bypass_ack:              # OPTIONAL "<name> <ISO date>" — a human consciously releasing a bypassed PASS (audit trail)
human_signoff:          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---

# Evidence Report: {{slug}}

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E4 | AC-2 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: {{from verifier stdout, or mint <slug>-<eval>-<date>; min 4 chars}}
  exit_code: 0
  baseline: red          # status on diffBase: red=eval discriminates (good), green=non-discriminating, n-a=couldn't run
  verifier: config:executors.test.api
  verified_at: {{ISO8601}}
  output: |
    {{last 5-10 relevant lines of runner output}}

- eval: E3
  run_id: {{...}}
  exit_code: 0
  verifier: scripts/verify-ui-login.sh
  verified_at: {{ISO8601}}
  screenshot: evidence/E3-step1.png   # first frame; capture E3-step{n}.png per step → Gate-2 page plays them as a slideshow
  observed: |
    {{1-3 lines describing what is actually VISIBLE in the frames, cross-checked
    against the eval's expected — written AFTER opening each frame with a
    multimodal Read. >= 20 substantive chars; placeholders do not count.}}

# Example shows the PENDING-JUDGMENT state; under an overall PASS verdict
# this UNCERTAIN-without-override combination is hook-blocked.
- eval: E4
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: {{1-3 sentences — what the judge could not determine and why}}
  human_override:        # human fills "<name> <date>" + optional note to resolve

## Analyst

# Non-discriminating evals: machine evals green on BOTH the branch and the diffBase
# baseline — they pass regardless of this feature, so they prove the harness, not the
# feature. Rewrite each to assert the new behaviour, or confirm it is an intended
# regression guard. Suite commands green-on-both are expected guards (not listed).
# Use words, never exit numbers.
{{eval ids green-on-both, or "none — every feature eval is red on baseline (discriminates)"}}

## Variance

# Stochastic evals (runs > 1 — e.g. crossing ctx.providers.invoke / an LLM generator)
# run N times; list any whose pass_rate is mixed (not 0/N and not N/N). A mixed
# pass_rate is NOT auto-pass and NOT auto-fail — the overall verdict is
# PENDING-JUDGMENT and a human decides at Gate 2 whether the rate clears the bar.
# A deterministic eval (runs: 1) that varies across re-runs is flaky/racy — list it
# here marked "flaky" and root-cause it. Use fraction words (4/5), never exit numbers.
{{eval ids with mixed pass_rate + their pass_rate, or "none — every multi-run eval is uniform"}}

## Iterations

{{One line per verify round, max 3: "Round 1: E2, E5 failed — <one-line cause>.
Returned to implementation." After round 3 → escalate to user, verdict REJECT.}}

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
