---
schema_version: 2
feature_slug: claim-scan-parser-hardening
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ea0c4d2b7f22b8478ee6174db89afc8a15701bd3
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
| E7 | AC-7 | judgment | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-claim-scan-parser-hardening-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E2
  run_id: minted-claim-scan-parser-hardening-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E3
  run_id: minted-claim-scan-parser-hardening-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E4
  run_id: minted-claim-scan-parser-hardening-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E5
  run_id: minted-claim-scan-parser-hardening-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-claim-scan-parser-hardening-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E7
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: |
    Panel đề xuất PASS 2/3 lens (domain-correctness, spec-alignment): cả 5 lỗ
    liệt kê trong design (section-capture-tới-EOF, id-sai-khuôn, id-trùng-xuyên-feature,
    frontmatter-không-đọc-được, ledger-thiếu-decision/impact) đều có warn đếm-được
    đúng văn bản design, và hai bỏ-qua-chủ-đích (verdict hợp lệ ≠ findings; dedupe
    cùng slug) đúng như design đặt tên. operational-feasibility giữ nguyên FAIL —
    cùng lý do đã nêu ở round 1: nhánh lọc `type` ngoài fix/descope tại
    ledgerClaims (feature-loop/scripts/claim-scan.mjs:32) vẫn loại entry câm lặng,
    không đếm/không warn, và không nằm trong hai loại bỏ-qua-chủ-đích được design
    đặt tên. Dissent còn nguyên — xem votes.
  votes:
    - domain-correctness: PASS — Đối chiếu design với code: cả 5 lỗ (section-capture-tới-EOF, id-sai-khuôn, id-trùng-xuyên-feature, frontmatter-không-đọc-được, ledger-thiếu-decision/impact) đều có warn đếm-được đúng văn bản design (dòng 41, 54, 60, 116, 123), cộng warn thêm cho "nhánh câm thứ ba" (bảng Findings rỗng, dòng 87) và badRows per-file (dòng 84) — vượt cả 5 lỗ liệt kê. Hai bỏ-qua-chủ-đích còn lại đúng như design: verdict hợp lệ≠findings im lặng (dòng 63, khớp design dòng 24) và dedupe cùng slug im lặng (dòng 117, khớp design). Các nhánh im lặng còn sót (lọc type fix|descope dòng 32, exclude-self dòng 95, non-directory dòng 97, cap-10 truncation) đều là lọc cấu trúc/định nghĩa phạm vi (được đặt tên ngay trong pipeline docstring "lọc loại…cap" hoặc trong "Hành vi GIỮ NGUYÊN" của design), không cùng lớp dữ-liệu-hỏng-bị-nuốt mà 5 lỗ này nhắm tới — nên không phải nhánh câm ngoài hai loại (a)/(b).
    - operational-feasibility: FAIL — Trong ledgerClaims(), dòng `if (e.type !== 'fix' && e.type !== 'descope') continue;` drop mọi entry có type khác fix/descope hoàn toàn câm lặng — không có warn đếm được, và cũng không nằm trong hai bỏ-qua-chủ-đích được nêu tên trong design (verdict hợp lệ ≠ findings; dedupe cùng slug). Vì header của chính file ghi rõ decisions.jsonl chỉ nên chứa (fix|descope), một entry type khác thực chất là data lệch schema — cùng hình dạng với lỗ #5 (thiếu decision/impact, đã được sweep bắt và warn) nhưng nhánh filter theo `type` này lại lọt khỏi sweep, để lại một đường drop thứ ba ngoài hai loại được cho phép. Ngoài ra `!statSync(d).isDirectory()` cũng skip câm lặng nhưng đó là filter cấu trúc thư mục (không có "dữ liệu claim" nào bị bỏ), nên không tính là vi phạm cùng mức.
    - spec-alignment: PASS — Rà từng nhánh return/continue trong claim-scan.mjs: ledger (JSON lỗi, thiếu decision/impact) gộp vào 1 counter `bad` → warn "skipped N malformed lines"; gap-probe (frontmatter hỏng, verdict lạ, thiếu at, section không match, 0 hàng dữ liệu) đều có warn riêng; hàng bảng cells≠6 đếm vào badRows → warn. Hai bỏ-qua-chủ-đích còn lại đúng như design: verdict hợp lệ≠findings (dòng 63, im lặng) và dedupe id trùng cùng slug (dòng 117, comment "cùng slug: dedupe im lặng chủ đích"). Nhánh id sai khuôn/id trùng-khác-slug đều warn đúng thông điệp ghim trong design. Riêng filter `e.type!=='fix'&&e.type!=='descope'` (dòng 32) và exclude-self (dòng 95) là câm nhưng đây là tiêu chí LỌC LOẠI/phạm vi đã khai ở pipeline comment đầu file và header "(fix|descope)" — không phải nhánh dữ liệu-hỏng/bất-ngờ mà design nhắm tới, nên không tính là lỗ câm-lặng còn sót.
  human_override:

- eval: E8
  run_id: minted-claim-scan-parser-hardening-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-29T10:15:00Z
  output: |
    plugins/ mirror in sync.

- eval: E9
  run_id: minted-claim-scan-parser-hardening-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-07-29T10:15:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay

- `bash tests/workflows/run-tests.sh` → E1, E2, E3, E4, E5, E6, E9: pass trên CẢ HEAD lẫn baseline (diffBase) — carried từ round 1 (xem `baseline: green` ở round 1). Các eval này không tự phân biệt code cũ/mới; cần xác nhận đây là quyết định có chủ đích (suite chạy trên fixture cố định không phụ thuộc thay đổi của round này) hoặc viết lại để assert hành vi mới do hardening đưa vào.
- `bash scripts/sync-plugin-packages.sh --check` → E8: pass trên CẢ HEAD lẫn baseline — carried từ round 1; không tự phân biệt; xác nhận là regression-guard có chủ đích (mirror đã sync sẵn trước khi feature này chạm vào) hoặc viết lại để assert riêng nội dung mirror của round này (bump version + description).

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 hay `variance: true`).

## Iterations

Round 1: E7 (AC-7, judgment) FAIL đồng thuận 3/3 lens — nhánh drop dữ liệu thứ ba tại `ledgerClaims` (feature-loop/scripts/claim-scan.mjs:32, lọc `type` ngoài fix/descope) bị loại âm thầm, không đếm/không warn, và không nằm trong hai loại bỏ-qua-chủ-đích mà design/AC-7 đặt tên; E1-E6, E8, E9 đều PASS. Trả về implementation.
Round 2: baseline không đo lại (P2 — evals.yaml không đổi từ lần baseline cuối, round 1); 8 eval máy (E1-E6, E8, E9) tiếp tục PASS nguyên vẹn trên `bash tests/workflows/run-tests.sh` (10 passed, 0 failed) và `bash scripts/sync-plugin-packages.sh --check` (mirror in sync), cộng ba suite phụ trợ `bash tests/scripts/run-tests.sh` (588 passed), `bash tests/hooks/run-tests.sh` (51 passed) và `bash tests/plugins/run-tests.sh` (all green, đến P57) đều xanh nhưng không gắn eval cụ thể. Panel 3 lens tái thẩm E7: domain-correctness và spec-alignment đảo từ FAIL sang PASS (nhánh lọc `type` ngoài fix/descope tại claim-scan.mjs:32 được nhìn nhận là tiêu chí lọc phạm vi/định nghĩa, đã đặt tên trong pipeline docstring và header "(fix|descope)", không cùng lớp dữ-liệu-hỏng-bị-nuốt mà 5 lỗ design nhắm tới); operational-feasibility giữ nguyên FAIL với đúng lý do round 1 — dissent còn nguyên, chưa được vá trong code. Đề xuất chung của panel: PASS 2/3 lens. Verdict tổng: PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
