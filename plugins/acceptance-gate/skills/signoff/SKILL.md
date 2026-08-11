---
name: signoff
description: Gate 2 signoff assistant (nghiệm thu Cổng 2) for Acceptance Gate on Codex — verify preconditions, walk the human through human_override + human_signoff, land the signature in its own human-fields-only commit, re-check merge readiness. Use when the user wants to sign off evidence, ký Cổng 2, or asks what blocks the merge.
---

# Signoff (Gate 2) for Codex

Walk the Gate 2 signoff for one `_acceptance/<slug>/` workspace. This skill
prepares and verifies; the HUMAN supplies every decision value. With
`signoff.require_human_commit: true` the signature must land in a SEPARATE
commit touching only human-owned report lines — pre-merge blocks a signature
that ships inside the machine-written body, so signing for the user cannot
merge.

One-shot answer + `--repo` (shared clause, copied verbatim from the law):

Ba lệnh có-câu-hỏi (`/approve` · `/signoff` · `/start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người; còn việc kế thì kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE.

One-shot examples — bare (the machine carries identity/date/minutes) and
full (old style, still works unchanged):
`signoff E9: Đạt; cắt/hoãn: đồng ý cắt; Ký`
`signoff abc-xyz --repo /duong/dan/repo Ngoài-1: ghi Known limits; E9: Đạt; cắt/hoãn: đồng ý cắt; Treo: phê hết; Ký: Manh Phan 2026-08-11, phút 0`

This skill's one-shot answer joins the Gate-2 card's «Trả lời mẫu» blanks,
separated by `;` — full grammar in `GATE-ONESHOT-GRAMMAR`. The human states
only DECISIONS; identity, date and minutes are things the machine knows:
- «Ngoài-<số>: ghi Known limits / mở hợp đồng mới / nâng phạm vi sửa ngay»
  → the disposition of that out-of-contract item.
- «<mã eval>: Đạt» or «<mã eval>: Chưa đạt vì <lý do>» → that judgment
  item's `human_override` line (id shape: `E\w+`).
- «cắt/hoãn: đồng ý cắt» or «cắt/hoãn: kéo vào <mục>» → the scope
  confirmation.
- «Treo: phê hết» or «Treo: không phê Treo-<số>» → the post-Gate-1
  provisional decisions.
- The «ký hay trả» blank: `Ký[: <tên> [<ngày>]][, phút <số>]` →
  `human_signoff` + the verdict upgrade (only when every override line is
  filled) + contract `status: signed-off` + `time_human_minutes.gate2`; or
  `Trả lại: <lý do>` → the not-signable path, no signature field written.
  Name absent → infer down the ladder `--as "<tên>"` → `signoff.approvers`
  when it holds exactly one name → `git config user.name`; date absent →
  ngày lệnh chạy; then echo «với danh tính: <tên> <ngày> (từ <nguồn suy>) — Enter xác nhận»
  BEFORE writing (a short affirmative confirms; anything else corrects the
  identity; an explicitly typed name+date needs no confirm). Do NOT ask for
  minutes: the human's `phút <số>` if typed, otherwise ghi 0 into
  `time_human_minutes.gate2`. The word «Ký» itself must still be typed by
  the HUMAN — the confirm covers identity only, it is not the signature.
- A label the card demands and the answer lacks entirely → ask about exactly
  that label (that is a DECISION question — the machine never proposes an
  answer for it); a value the human DID type but ambiguous → the
  recommend-first rule of `GATE-ONESHOT-GRAMMAR`: state the most plausible
  reading with its evidence from the records (the approved Out-of-scope
  block, the decisions ledger, the workspace state) + ask a one-touch
  confirm; an open question is the last resort. Worked case (real incident
  11/08): «không cắt» reads both ways → propose «đồng ý phạm vi đã khai»
  citing the Out-of-scope block approved at Gate 1, do not ask open-ended.
  A free tail after recognised labels → keep it VERBATIM in the decisions
  ledger. The separate-signature-commit ritual (`require_human_commit`)
  does not change one bit.
«Ngoài-<số>», «cắt/hoãn» and «Treo» have no frontmatter field of their own:
their dispositions land as entries in the decisions ledger `decisions.jsonl`
(and «ghi Known limits» adds a known-limits bullet to the contract's
`## Notes`) — exactly as the step-by-step path already does.
With `--repo <path>`: render the card with `--root <path>`, edit files under
`<path>/_acceptance/…`, land the signature commit and re-check merge
readiness via `git -C <path>` / against root `<path>`. Every command printed
in the steps below is written with `.` as the root — under `--repo` move every
one of them to `<path>`: a bare `.` argument becomes `<path>`
(`pre-merge-check.sh <path>`), `--root .` becomes `--root <path>`, a relative
script path resolves against `<path>` instead of the current directory, and the signature
commands become `git -C <path> add _acceptance/<slug>/…` +
`git -C <path> commit -m …` (paths after `-C` stay relative to `<path>`).

## 1. Resolve the feature

Accept an optional slug. Without one, scan for an `evidence-report.md` whose
`verdict` is `PASS` or `PENDING-JUDGMENT` with empty `human_signoff` (one →
use — hồ-sơ là điều máy biết: đúng MỘT ứng viên thì KHÔNG hỏi, chỉ hiển thị
lại tên hồ sơ trong cùng lượt trả lời; several → table + ask; none →
`acceptance-status`). Verdict
`REJECT`/`BLOCKED` → not signable: show `failed_evals`/`reason` and stop.

## 2. Machine-evidence commit first

If `evidence-report.md`, `run-log.jsonl`, the contract, or `evidence/` carry
uncommitted machine-written changes, commit them NOW as their own commit with
NO human-signature lines — the required split; committing early also dodges
the stale-guard.

## 3. Render Gate 2

Run the `acceptance-card` skill: decision card + `evidence-page.html`
(open it or hand over the absolute path).

## 4. List what only the human decides — decisions, not identity

- every UNCERTAIN judgment item — T3: EVERY judgment item — needs a real
  `human_override`;
- the verdict upgrade `PENDING-JUDGMENT → PASS`, legal only after ALL those
  lines are filled;
- the word «Ký» or «Trả lại» → `human_signoff` + contract
  `status: signed-off`.

Identity, date and minutes are NOT on this list: name/date follow the
inference ladder above with a one-touch confirm when the human did not type
them; `time_human_minutes.gate2` is machine-written (the human's number if
typed, otherwise ghi 0).

## 5. Collect and apply

Collect decisions in chat, item by item (accept / reject). Apply the
human's dictated values VERBATIM with `apply_patch`. You contribute no
decision values of your own — identity/date/minutes follow the inference
ladder, decisions never do. Any item the human rejects → the feature is
NOT signable: leave every signoff field empty, stop, route back to the
verify/fix loop.

## 6. Regenerate the product map

First check the repo opted in: read `risk_tiers.t1_skip_globs` in
`_acceptance/config.yaml`. `PRODUCT-MAP.md` NOT listed → repo initialised before
acceptance-gate 1.31.0: SKIP this step, do NOT add the map to the commit, and
print the opt-in note (add `- "PRODUCT-MAP.md"` to `t1_skip_globs` plus a
`product_map` executor, then run it in CI) — without the exemption the signature
commit itself makes evidence stale and pre-merge blocks the merge (ADR 0007).
Listed → run `node ${PLUGIN_ROOT}/scripts/product-map.mjs --root .` after
`human_signoff` is written; the map is machine-generated from records this gate
just changed, so it belongs in the signature commit below.

## 7. Land the signature in its own commit

Touch only the human-owned lines in `evidence-report.md` (`human_signoff`,
`human_override`, the verdict upgrade, `bypass_ack`) plus the contract's
`status` + `time_human_minutes.gate2` — plus the regenerated `PRODUCT-MAP.md`
ONLY if the step above actually regenerated it:

```bash
git add _acceptance/<slug>/evidence-report.md _acceptance/<slug>/contract.md
git commit -m "Gate 2 signoff: <slug> — <name>"
```

Repo opted in → append ` PRODUCT-MAP.md` to that `git add`. Repo NOT opted in →
leave it out: the file does not exist there and naming it makes `git add` fail
with a pathspec error mid-signature.

The reviewer runs it themselves, or explicitly orders you to run exactly that
and nothing more.

## 8. Re-check merge readiness

Codex write-time hooks may be inactive, so always re-check: run the consumer's
`bash scripts/pre-merge-check.sh . --slug <slug>` (add
`--base origin/<default-branch>` when known) and `scripts/recheck-evidence.cjs`;
if the consumer copies are missing, run them from the installed Acceptance
Gate cache via the consumer runner. Report READY TO MERGE or the exact
violations.

## 9. Preserve ownership

- Never invent or assume a name, date, or verdict.
- Never upgrade a verdict while any override line is empty.
- Never fold signature lines into the machine-evidence commit.
- Never treat an unresolved PENDING-JUDGMENT as PASS.
