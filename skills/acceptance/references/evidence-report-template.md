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
  sanitize pasted logs. If anything failed, the verdict is REJECT.
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

---8<---
---
schema_version: 1
feature_slug: {{slug}}
verdict: {{PASS|PENDING-JUDGMENT|REJECT|BLOCKED}}
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
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
  verifier: config:executors.test.api
  verified_at: {{ISO8601}}
  output: |
    {{last 5-10 relevant lines of runner output}}

- eval: E3
  run_id: {{...}}
  exit_code: 0
  verifier: scripts/verify-ui-login.sh
  verified_at: {{ISO8601}}
  screenshot: evidence/E3-login-redirect.png

# Example shows the PENDING-JUDGMENT state; under an overall PASS verdict
# this UNCERTAIN-without-override combination is hook-blocked.
- eval: E4
  judged_by: judge-subagent (fresh context)
  verdict: UNCERTAIN
  rationale: {{1-3 sentences — what the judge could not determine and why}}
  human_override:        # human fills "<name> <date>" + optional note to resolve

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
