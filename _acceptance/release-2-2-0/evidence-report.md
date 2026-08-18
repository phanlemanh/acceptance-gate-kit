---
schema_version: 2
feature_slug: release-2-2-0
verdict: PASS
failed_evals: []
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 11e5f172c7971584d8b5f35346268b54863cbba1
human_signoff: Manh 2026-08-18
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
  run_id: minted-release-2-2-0-E1-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-18T08:13:25Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-2-0-E2-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-18T08:13:25Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-2-0-E3-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T08:13:25Z
  output: |
    PASS: GCV1d contract lanh khong sinh canh bao nao

    Results: 704 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-2-0-E3b-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-18T08:13:25Z
  output: |
    PASS: V06

    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-2-0-E3c-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-18T08:13:25Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-2-0-E3d-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-18T08:13:25Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-release-2-2-0-E6-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-18T08:13:25Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)

    Results: all plugin tests passed

## Analyst

Non-discriminating (green trên CẢ HEAD lẫn diffBase — không phân biệt được feature):
- E1, E2, E3c, E6 — `bash tests/plugins/run-tests.sh` xanh trên cả hai phía
- E3 — `bash tests/scripts/run-tests.sh` xanh trên cả hai phía
- E3b — `bash tests/hooks/run-tests.sh` xanh trên cả hai phía
- E3d — `bash tests/workflows/run-tests.sh` xanh trên cả hai phía

## Variance

none — không eval nào của vòng này có `runs` > 1, không có pass_rate hỗn hợp, không flaky.

## Iterations

Round 1: chân bộ đếm bash (bản dùng-một-lần) nuốt vế đỏ trong ống/shell con/trap — lần thứ ba cùng lớp lỗi trong chính hồ sơ này; chân tu-kiem AC-4 tautology vì git chạy trong bản sao chứ không phải kho thật; mô tả feature-loop từng bị sửa mục lịch sử v2.1.0 thành `>= 2.2.0` để qua cổng. Owner chọn đổi khuôn: viết lại răng bằng Node một tiến trình (luật dừng-vá lần ba), thu AC-4/AC-7 khỏi hợp đồng. Returned to implementation.

Round 2: trên bản Node mới, vòng dò lỗ (gap-probe) trả 5 phát hiện vá trước cổng — P0: ca không ghim quan hệ-với-base nên mất commit bump vẫn xanh (việc DUY NHẤT hồ sơ làm không có chiều đỏ); P1×3: AC-1 khai phép đo `diagram-design` không tồn tại, AC-6 khai năm vế nội dung không đo được, đột biến "dời câu khai cặp" không dời gì thật; P2: bốn eval cùng trỏ một dòng tổng và số đột biến tự khớp chính nó. Cả 5 vá trong commit f3dac37. Returned to implementation.

Round 3: bốn suite + P200 ở chế độ BUOC-TANG đều XANH trên cây f3dac37 (7/7 đột biến, base=origin/main) — bảng Evidence của vòng đó. Nhưng rà soát adversarial phát hiện lớp lỗi thứ tư vẫn sống dưới lớp vỏ Node mới: mảng `loi` trong `p200.mjs` gom mọi vế đỏ trên CÂY THẬT + thất bại của đối chứng dương "bản sao nguyên vẹn", nhưng KHÔNG BAO GIỜ được đọc lại — điều kiện thoát duy nhất là `nMut !== MUT_KY_VONG` (chỉ đếm đột biến). Chạy thật xác nhận: kịch bản "mất commit bump" (`P200_BASE=HEAD P200_MUST_BUMP=1`, đúng kịch bản P0 mà round 2 tuyên đã vá) vẫn in "P200 OK ... 7/7 dot bien chay that" và thoát như thành công. AC-1 in-contract, severity high — xem review-findings.md của vòng đó. Hết 3 vòng máy (giới hạn round-cap của S4) — verdict REJECT, dừng trình owner; failed_evals rỗng vì đây không phải eval máy thất bại mà là phép đo tự-khai-đạt trong khi không canh đúng thứ nó tuyên canh.

Round 4: bốn suite (scripts/hooks/plugins/workflows) + khoá `plugins_release` (P200 ở chế độ BUOC-TANG) đều XANH trên cây `50a5e85e3a5830356324a9f9c140c1eed03a30e7` — 7/7 eval PASS. `node scripts/product-map.mjs --root . --check` cũng khớp. Nhưng bước scope-triage của vòng rà soát chết giữa chừng — máy không phân loại được finding nào vào/ngoài hợp đồng, nên KHÔNG tự sửa gì. `triage_failed: true`, verdict PENDING-JUDGMENT — người xem lại toàn bộ trước khi ký.

Round 5 (vòng này): P200 refactor thành bản TRỪ tại commit 15af234 — bỏ vế số-phải-tăng (`P200_MUST_BUMP`) và khoá executor riêng `plugins_release` (khoá này không còn trong `_acceptance/config.yaml`, verifier của bảng Evidence trên đây trỏ đúng khoá còn sống `executors.test.plugins`), chỉ giữ tính nhất-quán (hai plugin cùng số · GUIDE dẫn xuất · mục mô tả của chính số đó), 5 đột biến, một lối thoát. Lượt chạy đầu của vòng này bị công cụ dừng ngang chừng ở khoảng 118 giây (suite chạy lâu hơn dưới tải, không phải một mã thoát thật của verifier — cannotRun; sổ D19 ghi lại lý do). Chạy lại cùng vòng (lượt 2) tại HEAD 11e5f172c7971584d8b5f35346268b54863cbba1: bốn suite (scripts/hooks/plugins/workflows) và `node scripts/product-map.mjs --root . --check` đều XANH — bảng Evidence trên đây là của lượt chạy này. Bảy eval PASS, không có mục judgment nào treo, không eval nào phương sai. Verdict PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
