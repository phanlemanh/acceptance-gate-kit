---
name: approve
description: Record the Gate 1 decision (phê duyệt Cổng 1) for an Acceptance Gate feature on Codex — render the decision card, ask one question, write approved_by/approved_at only on an explicit human YES. Use when the user wants to approve a contract, duyệt Cổng 1, or asks what is waiting for approval.
---

# Approve (Gate 1) for Codex

Record the human's Gate 1 decision for one `_acceptance/<slug>/` workspace.
The card presents; this skill records. It never decides: an explicit human
YES in the conversation is the only trigger.

## 1. Resolve the feature

Accept an optional kebab-case slug (reject traversal). Without one, scan
`_acceptance/*/contract.md` for `status: draft`: exactly one → use it;
several → print a slug table and ask; none → nothing awaits Gate 1 — point to
the `acceptance-status` skill. Plan approval (Gate 1.5) and design-mockup
approval belong to feature-loop-codex / design-loop; never fake them here.

## 2. Preconditions

Require `contract.md` and `evals.yaml` (missing → run the Acceptance skill
Phase 1–2 first). Require `status: draft`. Already `approved` or later → show
`status`, `approved_by`, `approved_at` and stop; re-approval only happens when
the user explicitly reopens the contract.

## 3. Present

Run the `acceptance-card` skill for the slug (skip if the card was just
rendered in this session). Attach the deep-review package: full `contract.md`
verbatim plus the AC → eval → executor mapping table. Run the advisory
coverage lint through the consumer runner when present:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate eval-coverage-lint . --slug <slug>
```

If the runner is absent, locate the newest installed Acceptance Gate cache and
run its `scripts/eval-coverage-lint.js` with Node. Surface W1/W3 warnings —
advisory only; a lint failure never blocks the question.

## 4. Ask exactly one question

Approve, or what should change? Edits requested → apply them to
`contract.md`/`evals.yaml` with `apply_patch` (pre-approval artifacts are
agent-editable), re-render the card, ask again.

## 5. Record on an explicit YES only

- `approved_by` = the reviewer's name: from their approval message; else, if
  `signoff.approvers` in `_acceptance/config.yaml` holds exactly one name,
  confirm it; otherwise ask. Never guess; never write an agent's name.
- Patch the contract frontmatter: `status: approved`, `approved_by`,
  `approved_at` (ISO date).
- Ask how many minutes Gate 1 took → `time_human_minutes.gate1`.
- If `_acceptance/<slug>/decisions.jsonl` exists, append the seal entry
  `{"id":"d-<next>","type":"seal","gate":1,"at":"<ISO>"}` in the same
  write-batch as `approved_by`.
- Offer ONE commit: contract + evals (+ design doc when present).
- Where write-time hooks are not active in the Codex session, run the
  consumer's `scripts/recheck-evidence.js` path later at Gate 2 as usual; the
  contract transition itself is re-checked by CI `pre-merge-check.sh`.

## 6. Preserve ownership

- "Not now" / rejected → the contract stays `draft`; capture the reason in
  chat; write nothing to gate fields.
- Never approve from silence or your own judgment.
- Never offer gate-skipping here — `gate1_skipped: true` stays a
  chat-explicit, audited escape hatch outside this skill.
- Never touch `human_signoff` or any Gate-2 field (that is the `signoff`
  skill).
