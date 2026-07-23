---
description: Gate 2 sign-off assistant (nghiệm thu Cổng 2) — verify preconditions, walk the human through human_override + human_signoff, land the signature in its own human-fields-only commit, then re-check merge readiness. Never signs by itself.
---

Walk the Gate 2 sign-off for a feature whose evidence report is in. This
command prepares and verifies; the HUMAN supplies every decision value. The
kit's attribution model (`signoff.require_human_commit: true`) requires the
signature to land in a SEPARATE commit touching only human-owned report lines
— pre-merge blocks a signature that ships inside the machine-written body, so
"sign for the user" is not merely forbidden, it cannot merge.

Arg: optional `<slug>`. Without it, scan `_acceptance/*/` for an
`evidence-report.md` whose `verdict` is `PASS` or `PENDING-JUDGMENT` with an
empty `human_signoff` (one → use; several → table + ask; none →
`/acceptance-status`). Verdict `REJECT`/`BLOCKED` → not signable: show
`failed_evals`/`reason` and stop.

Steps:

1. **Machine-evidence commit first.** If `evidence-report.md`, `run-log.jsonl`,
   the contract, or `evidence/` carry uncommitted machine-written changes,
   commit them NOW as their own commit containing NO human-signature lines —
   the required split, and committing early also dodges the stale-guard.
2. **Render Gate 2.** `/acceptance-card <slug>` — decision card + auto-opened
   `evidence-page.html`.
3. **List what only the human decides:**
   - every UNCERTAIN judgment item — T3: EVERY judgment item — needs a real
     `human_override: <name> <date>`;
   - the verdict upgrade `PENDING-JUDGMENT → PASS`, legal only after ALL those
     lines are filled;
   - `human_signoff: <name> <date>`;
   - minutes → `time_human_minutes.gate2`; contract `status: signed-off`.
4. **Collect decisions in chat, item by item** (accept / reject, plus
   name+date once). Apply the human's dictated values VERBATIM via your
   file-edit tool so the write-time hook re-validates each write (a human
   editing outside the agent bypasses PreToolUse; CI re-check is the
   backstop). You contribute no values of your own.
5. **Any item the human rejects** → the feature is NOT signable: leave every
   signoff field empty, stop, and route back to the verify/fix loop.
6. **Land the signature as its own commit** touching only the human-owned
   lines in `evidence-report.md` (`human_signoff`, `human_override`, the
   verdict upgrade, `bypass_ack`) plus the contract's `status` +
   `time_human_minutes.gate2`. Print the exact sequence:

   ```bash
   git add _acceptance/<slug>/evidence-report.md _acceptance/<slug>/contract.md
   git commit -m "Gate 2 signoff: <slug> — <name>"
   ```

   The reviewer runs it themselves, or explicitly orders you to run exactly
   that and nothing more.
7. **Re-check merge readiness.** If the repo ships `scripts/pre-merge-check.sh`
   run `bash scripts/pre-merge-check.sh . --slug <slug>` (add
   `--base origin/<default-branch>` when known); otherwise run the installed
   plugin's copy. In Codex sessions where write-time hooks are not active,
   also run `recheck-evidence.js`. Report READY TO MERGE or the exact
   violations.

Never:
- invent or assume a name, date, or verdict;
- upgrade a verdict while any override line is empty;
- fold signature lines into the machine-evidence commit;
- treat an unresolved PENDING-JUDGMENT as PASS.
