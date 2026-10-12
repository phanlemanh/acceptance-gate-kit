---
schema_version: 2
feature_slug: cua-tin-hieu-gom-nhom
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e043c06f3347db65f3c982a357b054c1991ac1f
human_signoff: Manh Phan 2026-10-11
---

# Evidence Report: cua-tin-hieu-gom-nhom

Vòng 3. Verdict PASS: E10 (AC-10, đã thu hẹp ở Cổng Phạm vi theo owner «1») đạt trên bản 8ae5480a; E1–E9 giữ nguyên từ vòng 2 vì thay đổi của vòng này không chạm đường dẫn của chúng. Mọi lệnh suite đạt.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cua-tin-hieu-gom-nhom-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E2
  run_id: minted-cua-tin-hieu-gom-nhom-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E3
  run_id: minted-cua-tin-hieu-gom-nhom-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E4
  run_id: minted-cua-tin-hieu-gom-nhom-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E5
  run_id: minted-cua-tin-hieu-gom-nhom-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E6
  run_id: minted-cua-tin-hieu-gom-nhom-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E7
  run_id: minted-cua-tin-hieu-gom-nhom-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E8
  run_id: minted-cua-tin-hieu-gom-nhom-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E9
  run_id: minted-cua-tin-hieu-gom-nhom-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T11:16:04Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E10
  run_id: minted-cua-tin-hieu-gom-nhom-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T13:10:12Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-11T13:10:12Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào bị liệt kê là không-phân-biệt; baseline không đo được cho lệnh eval của feature nên không có eval nào được xác nhận red trên baseline (xem «Baseline khong do»).

Baseline khong do:
- node tests/scripts/tin-hieu.test.mjs: bo qua baseline: tep tests/scripts/tin-hieu.test.mjs co o cay dang kiem nhung chua co o merge-base 9b11cc6652b924cf6816ae1c257b2494f48a57cd — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: không có.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10 failed — bản gom chấm lệch đáp án bộ vàng; hai bộ kiểm chung (RT13, NEN7) cũng đỏ. Returned to implementation (commit dd2c1bd5: sửa RT13, NEN7, câu hỏi E11, khai trước trên lịch sử kit; lượt gom lại sang luot-2).
Round 2: E10 failed — bản gom của lượt gom bộ vàng 3 (luật không đổi) lệch đáp án ở 7 chỗ: hai cặp trùng bị tách, ba tín hiệu của hồ sơ đã giao nằm ở nhóm thay vì «đã phủ», hai tín hiệu của hồ sơ chưa giao bị ghi «đã phủ»; E11 hội đồng đề xuất không đạt. E1–E9 và toàn bộ lệnh suite đạt.
Round 3: thu phạm vi theo owner «1» (commit 8ae5480a) — AC-10 thu hẹp thành lời hứa về ống dẫn và lệnh chấm (kho kín đáp án, 20 mục == 20 tệp, lệnh chấm chạy được trên bộ vàng thứ hai và nêu «khai trước»), vế khớp đáp án của bản gom và AC-11 ra Known limits của hợp đồng nên E11 không còn trong vòng. E10 đạt cùng E1–E9 (mang từ vòng 2) và toàn bộ lệnh suite; hai phát hiện của lượt tìm lỗi nằm ngoài hợp đồng, xem review-findings.md.

### Re-pin lần 1 — 2026-10-11, do gộp origin/main sau S3b (d5931848)
run_id: repin-20261011T211702Z-35113
sha: 9fbc148c46fbc5a7a873c5e8fe9c7acc8c1a0775 · suites: 10 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-12, do chiến dịch ghim lại 2.27.0 — 22 hồ sơ hoá cũ theo paths so v2.26.0, sau chữ ký mốc (lượt làn thứ hai)
run_id: repin-20261012T065455Z-55784
sha: 5e043c06f3347db65f3c982a357b054c1991ac1f · suites: 10 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng
