---
description: Gate 2 signoff assistant (nghiệm thu Cổng 2) — verify preconditions, walk the human through human_override + human_signoff, land the signature in its own human-fields-only commit, then re-check merge readiness. Never signs by itself.
disable-model-invocation: true
---

Walk the Gate 2 signoff for a feature whose evidence report is in. This
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
6. **Regenerate the product map — only if this repo opted in.** Read
   `risk_tiers.t1_skip_globs` in `_acceptance/config.yaml`. `PRODUCT-MAP.md`
   NOT listed → the repo was initialised before acceptance-gate 1.31.0: **SKIP
   this step**, do NOT add the map to the commit, and print the note below —
   otherwise the signature commit itself makes the evidence stale and
   pre-merge blocks the merge with no way out (ADR 0007).

   > Bản đồ sản phẩm chưa bật cho repo này. Bật bằng hai dòng trong
   > `_acceptance/config.yaml`: thêm `- "PRODUCT-MAP.md"` vào
   > `risk_tiers.t1_skip_globs`, và `product_map: "node
   > ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root . --check"` vào
   > `executors.script` — rồi chạy executor đó trong CI.

   Listed → run `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root .`
   after `human_signoff` is written; the map is machine-generated from records
   this gate just changed, so it belongs in the signature commit below.

7. **Land the signature as its own commit** touching only the human-owned
   lines in `evidence-report.md` (`human_signoff`, `human_override`, the
   verdict upgrade, `bypass_ack`) plus the contract's `status` +
   `time_human_minutes.gate2` — plus the regenerated `PRODUCT-MAP.md` ONLY if
   step 6 actually regenerated it. Print the exact sequence:

   ```bash
   git add _acceptance/<slug>/evidence-report.md _acceptance/<slug>/contract.md
   git commit -m "Gate 2 signoff: <slug> — <name>"
   ```

   Repo opted in (step 6 regenerated the map) → append ` PRODUCT-MAP.md` to that
   `git add`. Repo NOT opted in → leave it out: the file does not exist there and
   naming it makes `git add` fail with a pathspec error mid-signature.

   The reviewer runs it themselves, or explicitly orders you to run exactly
   that and nothing more.
8. **Re-check merge readiness.** If the repo ships `scripts/pre-merge-check.sh`
   run `bash scripts/pre-merge-check.sh . --slug <slug>` (add
   `--base origin/<default-branch>` when known); otherwise run the installed
   plugin's copy. In Codex sessions where write-time hooks are not active,
   also run `recheck-evidence.cjs`. Report READY TO MERGE or the exact
   violations.

Never:
- invent or assume a name, date, or verdict;
- upgrade a verdict while any override line is empty;
- fold signature lines into the machine-evidence commit;
- treat an unresolved PENDING-JUDGMENT as PASS.
