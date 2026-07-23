---
name: signoff
description: Gate 2 sign-off assistant (nghiệm thu Cổng 2) for Acceptance Gate on Codex — verify preconditions, walk the human through human_override + human_signoff, land the signature in its own human-fields-only commit, re-check merge readiness. Use when the user wants to sign off evidence, ký Cổng 2, or asks what blocks the merge.
---

# Signoff (Gate 2) for Codex

Walk the Gate 2 sign-off for one `_acceptance/<slug>/` workspace. This skill
prepares and verifies; the HUMAN supplies every decision value. With
`signoff.require_human_commit: true` the signature must land in a SEPARATE
commit touching only human-owned report lines — pre-merge blocks a signature
that ships inside the machine-written body, so signing for the user cannot
merge.

## 1. Resolve the feature

Accept an optional slug. Without one, scan for an `evidence-report.md` whose
`verdict` is `PASS` or `PENDING-JUDGMENT` with empty `human_signoff` (one →
use; several → table + ask; none → `acceptance-status`). Verdict
`REJECT`/`BLOCKED` → not signable: show `failed_evals`/`reason` and stop.

## 2. Machine-evidence commit first

If `evidence-report.md`, `run-log.jsonl`, the contract, or `evidence/` carry
uncommitted machine-written changes, commit them NOW as their own commit with
NO human-signature lines — the required split; committing early also dodges
the stale-guard.

## 3. Render Gate 2

Run the `acceptance-card` skill: decision card + `evidence-page.html`
(open it or hand over the absolute path).

## 4. List what only the human decides

- every UNCERTAIN judgment item — T3: EVERY judgment item — needs a real
  `human_override: <name> <date>`;
- the verdict upgrade `PENDING-JUDGMENT → PASS`, legal only after ALL those
  lines are filled;
- `human_signoff: <name> <date>`;
- minutes → `time_human_minutes.gate2`; contract `status: signed-off`.

## 5. Collect and apply

Collect decisions in chat, item by item (accept / reject, plus name+date
once). Apply the human's dictated values VERBATIM with `apply_patch`. You
contribute no values of your own. Any item the human rejects → the feature is
NOT signable: leave every signoff field empty, stop, route back to the
verify/fix loop.

## 6. Land the signature in its own commit

Touch only the human-owned lines in `evidence-report.md` (`human_signoff`,
`human_override`, the verdict upgrade, `bypass_ack`) plus the contract's
`status` + `time_human_minutes.gate2`:

```bash
git add _acceptance/<slug>/evidence-report.md _acceptance/<slug>/contract.md
git commit -m "Gate 2 signoff: <slug> — <name>"
```

The reviewer runs it themselves, or explicitly orders you to run exactly that
and nothing more.

## 7. Re-check merge readiness

Codex write-time hooks may be inactive, so always re-check: run the consumer's
`bash scripts/pre-merge-check.sh . --slug <slug>` (add
`--base origin/<default-branch>` when known) and `scripts/recheck-evidence.js`;
if the consumer copies are missing, run them from the installed Acceptance
Gate cache via the consumer runner. Report READY TO MERGE or the exact
violations.

## 8. Preserve ownership

- Never invent or assume a name, date, or verdict.
- Never upgrade a verdict while any override line is empty.
- Never fold signature lines into the machine-evidence commit.
- Never treat an unresolved PENDING-JUDGMENT as PASS.
