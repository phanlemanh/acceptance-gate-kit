---
schema_version: 2
feature_slug: claim-scan-parser-hardening
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ae3726c33e5b8e9e7c2e6ff2dabe8921fe431235
human_signoff:
---

# Evidence Report: claim-scan-parser-hardening

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | judgment | FAIL |
| E8 | AC-8 | script | PASS |
| E9 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-claim-scan-parser-hardening-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T09:15:00Z
  output: |
    === skill-claims.test.mjs ===
    Results: 10 passed, 0 failed

- eval: E2
  run_id: minted-claim-scan-parser-hardening-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T09:15:00Z
  output: |
    === skill-claims.test.mjs ===
    Results: 10 passed, 0 failed

- eval: E3
  run_id: minted-claim-scan-parser-hardening-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T09:15:00Z
  output: |
    === skill-claims.test.mjs ===
    Results: 10 passed, 0 failed

- eval: E4
  run_id: minted-claim-scan-parser-hardening-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T09:15:00Z
  output: |
    === skill-claims.test.mjs ===
    Results: 10 passed, 0 failed

- eval: E5
  run_id: minted-claim-scan-parser-hardening-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T09:15:00Z
  output: |
    === skill-claims.test.mjs ===
    Results: 10 passed, 0 failed

- eval: E6
  run_id: minted-claim-scan-parser-hardening-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T09:15:00Z
  output: |
    === skill-claims.test.mjs ===
    Results: 10 passed, 0 failed

- eval: E7
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: FAIL
  rationale: |
    Cả 3 lens đồng thuận FAIL: lớp câm-lặng mà AC-7 hỏi ("đã đóng TRỌN chưa")
    vẫn còn một nhánh drop dữ liệu thứ ba ngoài hai loại bỏ-qua-chủ-đích được
    design đặt tên (verdict hợp lệ ≠ findings; dedupe cùng slug). Tại
    claim-scan.mjs:32, hàm `ledgerClaims` loại mọi entry ledger có `type`
    khác "fix"/"descope" (ví dụ "approach", "revisit" — cả hai đều hợp lệ
    theo enum SKILL.md: `type":"descope|approach|fix|revisit"`) mà không
    đếm, không warn, và không được nhắc tới ở bất kỳ đâu trong design hay
    trong chính comment "đóng lớp" ở dòng 93-95 của file. Comment đó tự
    nhận đã đóng trọn ("mọi đường drop đều có tiếng, trừ hai bỏ-qua-chủ-đích
    có tên") nhưng tuyên bố này sai với chính code.
  votes:
    - domain-correctness: FAIL — Các 5 lỗ nêu trong design đều đã có warn (parse JSON hỏng, thiếu decision/impact, frontmatter không đọc được, thiếu `at`, bảng malformed, id sai khuôn) và hai bỏ-qua-chủ-đích được đặt tên đúng (verdict≠findings ở dòng 57, dedupe cùng slug ở dòng 104-108) — nhưng lớp câm-lặng CHƯA đóng trọn: dòng 32 của `ledgerClaims` (`if (e.type !== 'fix' && e.type !== 'descope') continue;`) âm thầm loại mọi entry ledger không phải fix/descope mà không đếm, không warn, và không phải một trong hai loại được design đặt tên. Cap top-10 (dòng 126-134) cũng loại claim hợp lệ vượt hạn mức mà không có tiếng, nhưng design đã ghi "cap không thuộc hardening" ở Out of scope nên đây là loại trừ có ghi nhận; nhánh lọc-type ở dòng 32 thì hoàn toàn không được nhắc tới ở đâu.
    - operational-feasibility: FAIL — Có nhánh drop thứ ba ngoài hai loại design đặt tên: trong `ledgerClaims`, dòng `if (e.type !== 'fix' && e.type !== 'descope') continue;` (claim-scan.mjs:32) câm lặng bỏ mọi entry `type:"approach"` hoặc `type:"revisit"` trong decisions.jsonl — hai type hợp lệ theo schema ledger — không đếm, không warn, và không xuất hiện trong danh sách 2 bỏ-qua-chủ-đích ở design doc lẫn comment "đóng lớp" tại dòng 93-95 của chính file. Comment tại chỗ tự nhận đã đóng trọn nhưng khẳng định đó sai vì bỏ sót đúng nhánh này — vi phạm trực tiếp câu hỏi AC-7. Các nhánh khác (JSON malformed, decision/impact rỗng, frontmatter hỏng, id sai khuôn, dedupe cùng slug, dedupe khác slug, verdict≠findings, malformed rows) đều đúng như design mô tả.
    - spec-alignment: FAIL — Còn một nhánh drop ngoài hai loại được design nêu tên: trong `ledgerClaims` (dòng 32), `if (e.type !== 'fix' && e.type !== 'descope') continue;` bỏ qua entry hoàn toàn im lặng — không rơi vào nhánh đếm `bad++`/warn "skipped N malformed lines", cũng không phải "verdict hợp lệ ≠ findings" hay "dedupe trong cùng slug" mà design liệt kê. Bản thân comment trong code (dòng 93-95) tuyên bố "mọi đường drop đều có tiếng, trừ hai bỏ-qua-chủ-đích có tên trong design" — tuyên bố này không đúng với chính code, vì type-filter là đường drop thứ ba không có tiếng và không có tên trong design. Các nhánh khác (exclude-self, not-a-directory, cap top-10) là lọc phạm vi/hiển thị đã có tên ở nơi khác, không thuộc lớp "hỏng dữ liệu" nên không tính là vi phạm.
  human_override:

- eval: E8
  run_id: minted-claim-scan-parser-hardening-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-29T09:15:00Z
  output: |
    plugins/ mirror in sync.

- eval: E9
  run_id: minted-claim-scan-parser-hardening-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T09:15:00Z
  output: |
    === skill-claims.test.mjs ===
    Results: 10 passed, 0 failed

## Analyst

- `bash tests/workflows/run-tests.sh` → E1, E2, E3, E4, E5, E6, E9: pass trên CẢ HEAD lẫn baseline (diffBase) — xem `baseline: green` ở từng block Evidence trên. Các eval này không tự phân biệt code cũ/mới; cần xác nhận đây là quyết định có chủ đích (suite chạy trên fixture cố định không phụ thuộc thay đổi của round này) hoặc viết lại để assert hành vi mới do hardening đưa vào.
- `bash scripts/sync-plugin-packages.sh --check` → E8: pass trên CẢ HEAD lẫn baseline — không tự phân biệt; xác nhận là regression-guard có chủ đích (mirror đã sync sẵn trước khi feature này chạm vào) hoặc viết lại để assert riêng nội dung mirror của round này (bump version + description).

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 hay `variance: true`).

## Iterations

Round 1: E7 (AC-7, judgment) FAIL đồng thuận 3/3 lens — nhánh drop dữ liệu thứ ba tại `ledgerClaims` (feature-loop/scripts/claim-scan.mjs:32, lọc `type` ngoài fix/descope) bị loại âm thầm, không đếm/không warn, và không nằm trong hai loại bỏ-qua-chủ-đích mà design/AC-7 đặt tên; E1-E6, E8, E9 đều PASS. Trả về implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
