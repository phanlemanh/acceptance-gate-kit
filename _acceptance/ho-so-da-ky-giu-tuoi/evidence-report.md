---
schema_version: 2
feature_slug: ho-so-da-ky-giu-tuoi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4bcdf8d77dd98c762ca3e800d9baf81edb93c8f3
human_signoff:
---

# Evidence Report: ho-so-da-ky-giu-tuoi

Round 1. Cả 11 eval của hợp đồng đều xanh, nhưng verdict là REJECT vì hai lý do độc lập với bảng eval: (1) ba lệnh suite chung `bash tests/scripts/run-tests.sh --manh mjs:1/3`, `mjs:2/3`, `mjs:3/3` đỏ và không gắn eval nào (xem «Lệnh suite (hồi quy)» và mục Analyst); (2) review có một finding TRONG hợp đồng, mức high, ở AC-6 (xem `review-findings.md`, mục «Trong hợp đồng»).

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
| E11 | AC-2 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ho-so-da-ky-giu-tuoi-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E2
  run_id: minted-ho-so-da-ky-giu-tuoi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E3
  run_id: minted-ho-so-da-ky-giu-tuoi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E4
  run_id: minted-ho-so-da-ky-giu-tuoi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E5
  run_id: minted-ho-so-da-ky-giu-tuoi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E6
  run_id: minted-ho-so-da-ky-giu-tuoi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E7
  run_id: minted-ho-so-da-ky-giu-tuoi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E8
  run_id: minted-ho-so-da-ky-giu-tuoi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi_cac_kho
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs
    (phần đuôi đầu ra rỗng; lệnh kết thúc bình thường)

- eval: E9
  run_id: minted-ho-so-da-ky-giu-tuoi-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E10
  run_id: minted-ho-so-da-ky-giu-tuoi-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 17 passed, 0 failed

- eval: E11
  run_id: minted-ho-so-da-ky-giu-tuoi-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi_bo_cu
  verified_at: 2026-10-17T20:25:31Z
  output: |
    cmd: bộ repin-lane*.test.mjs + premerge-repin.test.mjs + stale-by-paths.test.mjs
    Results: 16 passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-17T20:25:31Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả bản mới lẫn baseline): none — không eval nào được đo xanh-ở-cả-hai; baseline của E1–E11 đều là n-a (xem «Baseline khong do» bên dưới), nên không có dữ liệu để khẳng định eval nào có phân biệt.

### Baseline khong do

- node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs: bo qua baseline: tep tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs co o cay dang kiem nhung chua co o merge-base 77b3750ee2a1a799fbc719c97b401e6d3ac146a3 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs: bo qua baseline: tep tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs co o cay dang kiem nhung chua co o merge-base 77b3750ee2a1a799fbc719c97b401e6d3ac146a3 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -e; for f in tests/scripts/repin-lane*.test.mjs tests/scripts/premerge-repin.test.mjs tests/scripts/stale-by-paths.test.mjs; do node "$f"; done': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

### Lệnh fail không gắn eval

Ba lệnh sau đỏ ở round này và không gắn eval nào, nên `failed_evals` để trống mà verdict vẫn là REJECT:

- `bash tests/scripts/run-tests.sh --manh mjs:1/3` — tổng kết 34 ca đạt, 2 đỏ.
- `bash tests/scripts/run-tests.sh --manh mjs:2/3` — tổng kết 34 ca đạt, 1 đỏ.
- `bash tests/scripts/run-tests.sh --manh mjs:3/3` — tổng kết 34 ca đạt, 1 đỏ.

Đoạn đuôi đầu ra đã lưu không nêu tên tệp đỏ ở cả ba lệnh, nên báo cáo này không gán tên tệp cho từng lệnh. Review nêu hai tệp test chung đỏ khi chạy riêng, là tín hiệu để người đọc đối chiếu: `tests/scripts/finding-line-bo-doc.test.mjs` (bảng khai 20 tệp chạm sổ chạy, thực tế 21) và `tests/scripts/evals-sat-le.test.mjs` (LB1 và đối chứng dương của LB2). Chi tiết ở `review-findings.md`, mục «Ngoài hợp đồng».

Ghi thêm: finding trong hợp đồng ở AC-6 (băm thông điệp đỏ không thấy ca đỏ mới khi eval đã có từ 10 dòng ca đỏ, hoặc khi bộ chạy không in tên ca theo khuôn) là lý do thứ hai của REJECT; E6 xanh vì các ô của nó không phủ ca này.

Judge panels: không có — hợp đồng này chỉ có eval máy (executor test), không có mục judgment nên không có hội đồng chấm và không có `human_override` nào cần điền.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, không eval nào có runs lớn hơn 1)

## Iterations

Round 1: không eval nào đỏ (E1–E11 xanh); ba lệnh suite `--manh mjs:1/3`, `mjs:2/3`, `mjs:3/3` đỏ không gắn eval, và có một finding trong hợp đồng mức high ở AC-6. Trả về giai đoạn cài đặt.
