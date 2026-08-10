---
name: acceptance-card
description: Render the plain-language Gate 1 or Gate 2 decision card and full evidence page for an Acceptance Gate feature on Codex. Use when a human needs to approve contract scope, judgment items, or signoff evidence.
---

# Acceptance Card for Codex

Render a presentation layer for one `_acceptance/<slug>/` workspace. The card
never changes the verdict and never signs for the human.

## 1. Validate input

1. Require one kebab-case slug and reject traversal.
2. Require `_acceptance/<slug>/contract.md`.
3. Read repository guidance to identify the product persona and preferred
   language.

## 2. Resolve scripts

Prefer the consumer runner when present:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate gate-card --root . --slug <slug> --extract
```

If the runner is absent, run `${PLUGIN_ROOT}/scripts/gate-card.js` with Node —
this skill ships inside Acceptance Gate, so the harness supplies its own root;
do not glob the plugin cache (lexical `ls` order picks 1.9.2 over 1.20.1). With
no `PLUGIN_ROOT`, resolve via feature-loop's `scripts/resolve-plugin.mjs`. Still
nothing is `BLOCKED` with the exact install instruction.

## 3. Create the plain-language overlay

**Load the language rules first.** Read
`${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
(six rules N1–N6, two quick tests, the presentation templates) TRƯỚC khi viết
bất kỳ câu nào sẽ hiện cho người. Every render re-reads the file — the rules do
not live in memory. No `PLUGIN_ROOT` → resolve as in section 2.

Translate the extracted JSON without changing meaning:

- `feature_plain`: one product sentence;
- Gate 1 `will_do`: each item starts with `Sẽ`;
- Gate 1 `wont_do`: each item starts with `Sẽ KHÔNG` or `Chặn`;
- Gate 2 `decisions`: short non-technical questions;
- `scope_plain`: one deferred-scope phrase;
- Gate 1 `coverage_plain` (`[{i,p}]`, `i` = index into the extract's `coverage`
  array): one product sentence per Coverage axis — what it covers and what
  "enough" means. Keep AC codes as lookups (rule N3). A missing key or missing
  entry never hides a line: the script prints a markdown-stripped fallback;
- Gate 1 `gap_probe_plain` (`[{i,p}]`, `i` = index into `gap_probe.rows`):
  REWRITE each finding's text in human-facing language — what was missing, how
  it was handled. Never invent, merge, or soften severity; the sev badge is
  script-rendered and cannot be overridden, and rows without an overlay entry
  still render a markdown-stripped fallback (the overlay cannot hide a finding).
  Absence/probe-failed/parse_dropped flags still render from the script;
- `decisions_plain`: every approved or provisional ledger choice as
  `đã chọn gì — đổi lại gì`;
- Gate 2 "Ngoài hợp đồng" block: **do not translate it and do not add an overlay
  key for it** — `gate-card.js` reads `_acceptance/<slug>/review-findings.md` and
  renders the block itself, on the same rule as `gap_probe`: whatever must appear
  on the card is rendered by the script, so it cannot be forgotten or filled in
  wrong. The text shown is the `Người dùng thấy gì` line written by scope-triage —
  the reviewer's technical title never reaches the person deciding. The three
  choice labels stay verbatim — (a) **ghi Known limits**: accept
  it, record it under known limitations, ship as is; (b) **mở hợp đồng mới**:
  split it into its own piece of work with its own acceptance criteria;
  (c) **nâng phạm vi sửa ngay**: add criteria to the current contract and
  re-approve Gate 1. A file with no such section (older generation, or a round
  with no findings) renders exactly as before — no flag, no error; this backward
  branch is mandatory, not optional. When "## Chưa phân loại (triage-failed)" is
  present the script ADDS a single amber flag above the block — it never swaps
  the block out, so findings already classified stay visible to the decider. The
  coverage-cluster flag is script-rendered too, and deliberately carries no file
  paths: the card is where the decision happens, details live in the evidence.

Write `_acceptance/<slug>/card-plain.json` with `apply_patch`. The ledger is
rationale, not a new source of acceptance scope.

## 4. Render the card

Run the same gate-card action with:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate gate-card \
  --root . --slug <slug> --plain _acceptance/<slug>/card-plain.json
```

Wrap the returned fragment in a minimal UTF-8 document and save
`_acceptance/<slug>/card.html`.

When a browser tool is available, open the local card there. Otherwise provide
the absolute clickable file path. Do not report a gate decision from rendering
alone.

Mọi tin mời cổng (duyệt hay ký) kết bằng đúng MỘT khối 👉 VIỆC CỦA ANH theo khuôn `YOUR-MOVE-BLOCK-TEMPLATE` trong bản luật ngôn ngữ mặt người: mỗi mục đủ 3 vế làm-gì / ở-đâu / trả-lời-dạng-gì, kèm câu mẫu trả-lời-gộp MỘT dòng ở dạng khuôn có chỗ trống (máy không điền sẵn lựa chọn thay người); tin chỉ-báo ghi rõ "không cần làm gì"; cấm câu tu từ mang dấu hỏi.

## 5. Gate 2 evidence page

When `evidence-report.md` exists, run:

```bash
node scripts/codex-plugin-runner.mjs acceptance-gate evidence-page --root . --slug <slug>
```

This writes `_acceptance/<slug>/evidence-page.html`. Open it with the available
Codex browser or provide the absolute path. Present judgment, variance,
provisional decisions, review findings, and visual evidence before machine-pass
details.

## 6. Preserve ownership

- Gate 1 approval is recorded only in `approved_by` and `approved_at`.
- Gate 2 resolution is recorded only in `human_override`, `human_signoff`, and
  approved verdict changes.
- Never click, infer, or write a human decision without the user's explicit
  instruction.

## 7. The reviewer may reject the card

A card that breaks the human-facing language rules is rejected at the gate — not
approved with a comment for later. A rejection is a kit defect, not an author
mistake: append to `_acceptance/<slug>/decisions.jsonl` a `revisit` entry whose
`decision` starts with the exact string `lỗ-kit — ngôn ngữ mặt người`, quoting
the offending sentence, so the next card-set upgrade reads it as a number rather
than a memory.
