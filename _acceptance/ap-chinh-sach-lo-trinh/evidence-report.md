---
schema_version: 2
feature_slug: ap-chinh-sach-lo-trinh
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3376ae3a8ddc26e260c0ed584a5a725613bc9788
human_signoff:
---

# Evidence Report: ap-chinh-sach-lo-trinh

Verdict REJECT ở round 2: cả 12 eval của hợp đồng đều xanh (không eval nào hỏng, nên `failed_evals` rỗng), nhưng hai lệnh suite hồi quy không gắn eval nào đỏ: `bash tests/scripts/run-tests.sh --manh mjs:3/3` (31 đạt, 1 hỏng) và suite plugin vùng 3 (dòng hỏng đọc được: `P179 [MBC] E6 ledger known-limits`). Hai lệnh này ghi ở mục «Lệnh suite (hồi quy)» bên dưới, kèm run_id.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ap-chinh-sach-lo-trinh-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E2
  run_id: minted-ap-chinh-sach-lo-trinh-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E3
  run_id: minted-ap-chinh-sach-lo-trinh-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E4
  run_id: minted-ap-chinh-sach-lo-trinh-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E5
  run_id: minted-ap-chinh-sach-lo-trinh-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E6
  run_id: minted-ap-chinh-sach-lo-trinh-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E7
  run_id: minted-ap-chinh-sach-lo-trinh-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E7b
  run_id: minted-ap-chinh-sach-lo-trinh-E7b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
    Results: all plugin tests passed

- eval: E8
  run_id: minted-ap-chinh-sach-lo-trinh-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E9
  run_id: minted-ap-chinh-sach-lo-trinh-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E10
  run_id: minted-ap-chinh-sach-lo-trinh-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
    Results: 59 passed, 0 failed (ap-chinh-sach-lo-trinh)

- eval: E11
  run_id: minted-ap-chinh-sach-lo-trinh-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ap_chinh_sach_lo_trinh_crm
  verified_at: 2026-10-15T05:41:51Z
  output: |
    cmd: node tests/scripts/ap-chinh-sach-lo-trinh-crm.mjs
    Results: 1 passed, 0 failed (ap-chinh-sach-lo-trinh-crm)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 1
  verified_at: 2026-10-15T05:41:51Z
  # HỎNG, không gắn eval nào. Tail kết quả: «Results: 31 passed, 1 failed». Phần tail chỉ còn các ca thuoc-vat, vong-meta-dang-mo, xuat-du-qua-pipe đều đạt; ca hỏng nằm ngoài đoạn đuôi đã lưu, chưa định danh được từ dữ liệu có sẵn.

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-10-15T05:41:51Z
  # HỎNG, không gắn eval nào. Dòng hỏng: «FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=»; tail kết «Results: 1 failed».

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ap-chinh-sach-lo-trinh-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-15T05:41:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Field baseline cua tung eval ghi n-a.

Eval không phân biệt (xanh cả HEAD lẫn baseline): none — danh sách rỗng. Lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

Hai lệnh suite đỏ nêu ở trên không gắn eval nào: đây là hồi quy cần người đọc ở Cổng 2, không phải eval của hợp đồng.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định; không eval nào có phương sai).

## Judge

none — không eval nào khai judge panel; không có phiếu chấm nào để ghi.

## Iterations

Round 1: lượt chấm đầu; vòng S4-r1 đã sửa (commit 24bc5aa5) và ghi sổ fix lượt 1 (commit 3376ae3a). Returned to implementation.
Round 2: 12/12 eval của hợp đồng xanh, nhưng hai lệnh suite hồi quy không gắn eval (mjs:3/3 và plugins vùng 3, dòng P179) đỏ nên verdict REJECT. Returned to implementation.
