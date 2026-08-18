---
schema_version: 2
feature_slug: release-2-2-0
verdict: REJECT
failed_evals: []
# REJECT do rà soát adversarial tìm thấy P200 fail-open (in-contract, AC-1, severity high) ở vòng 3/3 — hết quota máy, dừng trình owner (xem review-findings.md). KHÔNG phải eval máy thất bại: cả 7 evidence dưới đều exit_code 0 / PASS.
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f3dac37d711bf2dc3c513cb3336f1abd02c6347d
human_signoff: 
---

# Evidence Report: release-2-2-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-2-0-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_release
  verified_at: 2026-08-18T12:40:00Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do · quan he voi base (7 dot bien)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-2-0-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_release
  verified_at: 2026-08-18T12:40:00Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do · quan he voi base (7 dot bien)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-2-0-E3-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T12:40:00Z
  output: |
    PASS: GCV1d contract lanh khong sinh canh bao nao

    Results: 704 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-2-0-E3b-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-18T12:40:00Z
  output: |
    PASS: V06

    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-2-0-E3c-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-18T12:40:00Z
  output: |
    PASS: GCV1d contract lanh khong sinh canh bao nao

    Results: 704 passed, 0 failed

- eval: E3d
  run_id: minted-release-2-2-0-E3d-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-18T12:40:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-release-2-2-0-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_release
  verified_at: 2026-08-18T12:40:00Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do · quan he voi base (7 dot bien)

    Results: all plugin tests passed

## Analyst

Non-discriminating (green trên CẢ HEAD lẫn diffBase — không phân biệt được feature):
- E1, E2, E6 — `P200_MUST_BUMP=1 bash tests/plugins/run-tests.sh` xanh trên cả hai phía
- E3 — `bash tests/scripts/run-tests.sh` xanh trên cả hai phía
- E3b — `bash tests/hooks/run-tests.sh` xanh trên cả hai phía
- E3c — `bash tests/plugins/run-tests.sh` xanh trên cả hai phía
- E3d — `bash tests/workflows/run-tests.sh` xanh trên cả hai phía

Toàn bộ 7 eval của vòng này baseline: green. Đây KHÔNG tự động là lỗi thước (đây là 4 suite-guard toàn repo + khoá `plugins_release`, vốn không kỳ vọng đỏ trên baseline vì tự nó đã có 7 đột biến nội bộ làm chiều đỏ). Nhưng vì cả bảy đều không phân biệt được HEAD với baseline, chúng KHÔNG thể là bằng chứng bác bỏ finding "P200 fail-open" ở review-findings.md — chính finding đó chứng minh bằng chạy thật (không phải qua các cmd suite này) rằng vế `loi` (mọi vế đỏ trên cây thật + đối chứng dương) không hề gate mã thoát. Con số đọc từ bảng trên là "suite xanh", không phải "phép đo có răng" — hai điều khác nhau, và khoảng cách đó chính là nội dung của finding.

## Variance

none — every multi-run eval is uniform (không eval nào của vòng này có `runs` > 1)

## Iterations

Round 1: chân bộ đếm bash (bản dùng-một-lần) nuốt vế đỏ trong ống/shell con/trap — lần thứ ba cùng lớp lỗi trong chính hồ sơ này; chân tu-kiem AC-4 tautology vì git chạy trong bản sao chứ không phải kho thật; mô tả feature-loop từng bị sửa mục lịch sử v2.1.0 thành `>= 2.2.0` để qua cổng. Owner chọn đổi khuôn: viết lại răng bằng Node một tiến trình (luật dừng-vá lần ba), thu AC-4/AC-7 khỏi hợp đồng. Returned to implementation.

Round 2: trên bản Node mới, vòng dò lỗ (gap-probe) trả 5 phát hiện vá trước cổng — P0: ca không ghim quan hệ-với-base nên mất commit bump vẫn xanh (việc DUY NHẤT hồ sơ làm không có chiều đỏ); P1×3: AC-1 khai phép đo `diagram-design` không tồn tại, AC-6 khai năm vế nội dung không đo được, đột biến "dời câu khai cặp" không dời gì thật; P2: bốn eval cùng trỏ một dòng tổng và số đột biến tự khớp chính nó. Cả 5 vá trong commit f3dac37. Returned to implementation.

Round 3 (vòng này): bốn suite + P200 ở chế độ BUOC-TANG đều XANH trên cây f3dac37 (7/7 đột biến, base=origin/main) — bảng Evidence trên đây. Nhưng rà soát adversarial phát hiện lớp lỗi thứ tư vẫn sống dưới lớp vỏ Node mới: mảng `loi` trong `p200.mjs` gom mọi vế đỏ trên CÂY THẬT + thất bại của đối chứng dương "bản sao nguyên vẹn", nhưng KHÔNG BAO GIỜ được đọc lại — điều kiện thoát duy nhất là `nMut !== MUT_KY_VONG` (chỉ đếm đột biến). Chạy thật xác nhận: kịch bản "mất commit bump" (`P200_BASE=HEAD P200_MUST_BUMP=1`, đúng kịch bản P0 mà round 2 tuyên đã vá) vẫn in "P200 OK ... 7/7 dot bien chay that" và exit 0. AC-1 in-contract, severity high — xem review-findings.md. Hết 3 vòng máy (giới hạn round-cap của S4) — verdict REJECT, dừng trình owner; failed_evals rỗng vì đây không phải eval máy thất bại mà là phép đo tự-khai-đạt trong khi không canh đúng thứ nó tuyên canh.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
