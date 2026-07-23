---
description: Record the Gate 1 decision (phê duyệt Cổng 1) — render the decision card, ask exactly one question, write approved_by/approved_at only on an explicit human YES. Never approves on its own.
---

Record the human's Gate 1 decision for a feature. `/acceptance-card` is the
presentation layer; THIS command is the decision verb — it walks the approval
moment and writes the real gate fields. It decides nothing itself: an explicit
human YES in chat is the only trigger, and the PreToolUse hook re-validates
every transition it writes.

Arg: optional `<slug>`. Without it, scan `_acceptance/*/contract.md` for
`status: draft`:
- exactly one → use it;
- several → print a slug table and ask which;
- none → nothing awaits Gate 1 — say so and point to `/acceptance-status`.
  (Plan approval — Gate 1.5 — and design-mockup approval live in their own
  loops: feature-loop / design-loop. Do not fake them here.)

Steps:

1. **Preconditions.** `contract.md` + `evals.yaml` exist (missing → run the
   acceptance skill Phase 1–2 first, then return). `status` must be `draft`.
   Already `approved` or later → show `status`, `approved_by`, `approved_at`
   and stop: re-approval only happens when the user explicitly reopens the
   contract, and the hook re-validates that path.
2. **Present.** Render the decision card — `/acceptance-card <slug>` — unless
   it was just rendered this session. Attach the deep-review package: the full
   `contract.md` verbatim + the AC → eval → executor mapping table. Run the
   advisory coverage lint (`eval-coverage-lint.js`, found in the same
   installed-plugin `scripts/` dir that step 1 of `/acceptance-card` locates)
   and surface its W1/W3 warnings — advisory only, the human decides.
3. **Ask EXACTLY ONE question:** approve, or what should change?
4. **Edits requested** → apply them to `contract.md`/`evals.yaml` (pre-approval
   artifacts are agent-editable), re-render the card, ask again. Still Gate 1.
5. **On an explicit YES only:**
   - `approved_by` = the reviewer's name: take it from their approval message;
     if absent and `signoff.approvers` in `_acceptance/config.yaml` holds
     exactly one name, confirm that name; otherwise ask. Never guess; never
     write an agent's name.
   - Edit the contract frontmatter — `status: approved`, `approved_by`,
     `approved_at` (ISO date) — via your file-edit tool so the write-time hook
     validates the transition.
   - Ask how many minutes Gate 1 took → `time_human_minutes.gate1`.
   - If `_acceptance/<slug>/decisions.jsonl` exists (feature-loop), append the
     seal entry `{"id":"d-<next>","type":"seal","gate":1,"at":"<ISO>"}` in the
     same write-batch as `approved_by`.
   - Offer ONE commit: contract + evals (+ design doc when present) — the
     Gate-1 record.
6. **"Not now" / rejected** → the contract stays `draft`; capture the reason in
   chat; write nothing to gate fields.

Never:
- approve from silence, a timeout, or your own judgment;
- offer gate-skipping here — `gate1_skipped: true` stays a chat-explicit,
  audited escape hatch, deliberately outside this command;
- touch `human_signoff` or any Gate-2 field (that is `/signoff`).
