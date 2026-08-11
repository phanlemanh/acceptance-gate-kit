---
name: approve
description: Record the Gate 1 decision (phê duyệt Cổng 1) for an Acceptance Gate feature on Codex — render the decision card, ask one question, write approved_by/approved_at only on an explicit human YES. Use when the user wants to approve a contract, duyệt Cổng 1, or asks what is waiting for approval.
---

# Approve (Gate 1) for Codex

Record the human's Gate 1 decision for one `_acceptance/<slug>/` workspace.
The card presents; this skill records. It never decides: an explicit human
YES in the conversation is the only trigger.

One-shot answer + `--repo` (shared clause, copied verbatim from the law):

Ba lệnh có-câu-hỏi (`/approve` · `/signoff` · `/start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người; còn việc kế thì kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE.

One-shot examples — bare (the machine carries the rest) and full (old
style, still works unchanged):
`approve duyệt`
`approve abc-xyz --repo /duong/dan/repo duyệt: Manh Phan, phút 0`

This skill's one-shot answer fills the card's «duyệt hay sửa: ___» blank —
full grammar in the `GATE-ONESHOT-GRAMMAR` block of the language law. The
human states only the DECISION; identity, date and minutes are things the
machine knows:
- `duyệt[: <tên>][, phút <số>]` → the explicit YES of step 5: `<tên>` →
  `approved_by`; absent → infer down the ladder `--as "<tên>"` →
  `signoff.approvers` when it holds exactly one name →
  `git config user.name`, then echo «với danh tính: <tên> <ngày> — Enter xác nhận»
  BEFORE writing (a short affirmative confirms; anything else corrects the
  identity; an explicitly typed name needs no confirm). Do NOT ask for
  minutes: `phút <số>` typed by the human → write that number to
  `time_human_minutes.gate1`, absent → ghi 0 (field kept for the old
  schema).
- `sửa: <điều cần đổi>` → the edit path with exactly that content.
- A free tail after recognised labels → keep it VERBATIM in the decisions
  ledger; an ambiguous part → the recommend-first rule of
  `GATE-ONESHOT-GRAMMAR`: state the most plausible reading with its
  evidence from the records + ask a one-touch confirm; an open question is
  the last resort, only when no reading dominates or a wrong guess is
  costly to undo.
With `--repo <path>`: render the card with `--root <path>`, edit files under
`<path>/_acceptance/…`, and commit the Gate-1 record via `git -C <path>`.
Every command printed in the steps below is written with `.` as the root —
under `--repo` move every one of them to `<path>`: a bare `.` argument becomes
`<path>`, `--root .` becomes `--root <path>`, a relative script path resolves
against `<path>` instead of the current directory, and every git call becomes `git -C <path> …` (paths after
`-C` stay relative to `<path>`).

## 1. Resolve the feature

Accept an optional kebab-case slug (reject traversal). Without one, scan
`_acceptance/*/contract.md` for `status: draft`: exactly one → use it — hồ-sơ
là điều máy biết: đúng MỘT ứng viên thì KHÔNG hỏi, chỉ hiển thị lại tên hồ
sơ trong cùng lượt trả lời;
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

If the runner is absent, run `${PLUGIN_ROOT}/scripts/eval-coverage-lint.js` with
Node (own plugin — no cache glob). Surface W1/W3 warnings — advisory only; a lint
failure never blocks the question.

## 4. Ask exactly one question

Approve, or what should change? Edits requested → apply them to
`contract.md`/`evals.yaml` with `apply_patch` (pre-approval artifacts are
agent-editable), re-render the card, ask again.

## 5. Record on an explicit YES only

- `approved_by` = the reviewer's name: from their approval message; absent →
  infer down the ladder — `--as "<tên>"` → `signoff.approvers` in
  `_acceptance/config.yaml` when it holds exactly one name →
  `git config user.name` — then echo «với danh tính: <tên> <ngày> — Enter xác nhận» and
  wait for the one-touch confirm BEFORE writing (an explicitly typed name
  needs no confirm). Never guess beyond the ladder; never write an agent's
  name. The confirm covers IDENTITY only — the decision was the human's
  explicit YES above.
- Patch the contract frontmatter: `status: approved`, `approved_by`,
  `approved_at` (ISO date, ngày lệnh chạy — máy ghi, không hỏi).
- `time_human_minutes.gate1`: do NOT ask — the human's `phút <số>` if
  typed, otherwise ghi 0 (field kept for the old schema).
- If `_acceptance/<slug>/decisions.jsonl` exists, append the seal entry
  `{"id":"d-<next>","type":"seal","gate":1,"at":"<ISO>"}` in the same
  write-batch as `approved_by`.
- Regenerate the product map — but FIRST check the repo opted in: read
  `risk_tiers.t1_skip_globs` in `_acceptance/config.yaml`. `PRODUCT-MAP.md` NOT
  listed → repo initialised before acceptance-gate 1.31.0: SKIP the regen, do NOT
  add the map to the commit, print
  the opt-in note (add `- "PRODUCT-MAP.md"` to `t1_skip_globs` plus a
  `product_map` executor, then run it in CI), and carry on — without the
  exemption the signature commit itself makes evidence stale (ADR 0007).
  Listed → run `node ${PLUGIN_ROOT}/scripts/product-map.mjs --root .` AFTER the
  gate fields are written; CI's `--check` turns any drift red.
- Offer ONE commit: contract + evals (+ design doc when present). Add
  `PRODUCT-MAP.md` ONLY if you regenerated it above — a repo that has not opted
  in has no such file, and naming it in `git add` fails the whole command.
- Where write-time hooks are not active in the Codex session, run the
  consumer's `scripts/recheck-evidence.cjs` path later at Gate 2 as usual; the
  contract transition itself is re-checked by CI `pre-merge-check.sh`.

## 6. Preserve ownership

- "Not now" / rejected → the contract stays `draft`; capture the reason in
  chat; write nothing to gate fields.
- Never approve from silence or your own judgment.
- Never offer gate-skipping here — `gate1_skipped: true` stays a
  chat-explicit, audited escape hatch outside this skill.
- Never touch `human_signoff` or any Gate-2 field (that is the `signoff`
  skill).
