---
schema_version: 2
feature_slug: ho-so-da-ky-giu-tuoi
verdict: REJECT
failed_evals: [E8]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 40fa0e310b162276d005b060906c2608ecaacf06
human_signoff:
---

# Evidence Report: ho-so-da-ky-giu-tuoi

Round 2. Nội dung này thay toàn bộ báo cáo round cũ; lịch sử round nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | FAIL |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-2 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-ho-so-da-ky-giu-tuoi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs (một lần chạy chung cho E1–E7, E9, E10)
    GT Results: 18 passed, 0 failed

- eval: E2
  run_id: minted-ho-so-da-ky-giu-tuoi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E3
  run_id: minted-ho-so-da-ky-giu-tuoi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E4
  run_id: minted-ho-so-da-ky-giu-tuoi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E5
  run_id: minted-ho-so-da-ky-giu-tuoi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E6
  run_id: minted-ho-so-da-ky-giu-tuoi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E7
  run_id: minted-ho-so-da-ky-giu-tuoi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E8
  run_id: r2-l2-1-20261018002528
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi_cac_kho
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs
    kho thử AC-6: khoá vắng và false — mã thoát + dòng sổ + mục Re-pin bằng bản trước vòng (H2 xanh, H5 E1 đỏ có dòng nền), 0 khác
    đột biến khoá vắng → bật: ca đỏ như mong đợi
    acceptance-gate-kit: 176 hồ sơ so, 0 khác
    crm-onehub: 286 hồ sơ so, 1 khác
    oneflow: 41 hồ sơ so, 0 khác
    tổng 51.9 phút
    FAIL: GT8 — crm-onehub: lưới trước-gộp dòng 2855: mới «» · cũ «<kit>/scripts/pre-merge-check.sh: line 1514: printf: write error: Broken pipe»

- eval: E9
  run_id: minted-ho-so-da-ky-giu-tuoi-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E10
  run_id: minted-ho-so-da-ky-giu-tuoi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
    GT Results: 18 passed, 0 failed

- eval: E11
  run_id: minted-ho-so-da-ky-giu-tuoi-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.ho_so_da_ky_giu_tuoi_bo_cu
  verified_at: 2026-10-18T00:25:28Z
  output: |
    lệnh: bash -c 'set -e; for f in tests/scripts/repin-lane*.test.mjs tests/scripts/premerge-repin.test.mjs tests/scripts/stale-by-paths.test.mjs; do node "$f"; done'
    Results: 16 passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ho-so-da-ky-giu-tuoi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-18T00:25:28Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt). Lưu ý đọc kèm mục «Baseline khong do» dưới đây: cả 11 eval đều có baseline là n-a nên câu trên là quy ước của mục rỗng, không phải số đo.

Lệnh fail không gắn eval: không có. Lệnh duy nhất đỏ là `node tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs` và nó gắn với E8. Trên kho crm-onehub có 1 hồ sơ khác trong 286; hai kho còn lại (acceptance-gate-kit 176, oneflow 41) là 0 khác. Chỗ khác nằm ở dòng 2855 của lưới trước-gộp: phía mới rỗng, phía cũ in lỗi ghi vào ống đã đóng từ `pre-merge-check.sh` dòng 1514. Từ phần đuôi kết quả không phân biệt được đây là nhiễu hạ tầng của bản cũ hay hành vi thật; người đọc cần xem nhật ký đầy đủ của lượt này.

### Baseline khong do

- node tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs: bo qua baseline: tep tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs co o cay dang kiem nhung chua co o merge-base 77b3750ee2a1a799fbc719c97b401e6d3ac146a3 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs: bo qua baseline: tep tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs co o cay dang kiem nhung chua co o merge-base 77b3750ee2a1a799fbc719c97b401e6d3ac146a3 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'set -e; for f in tests/scripts/repin-lane*.test.mjs tests/scripts/premerge-repin.test.mjs tests/scripts/stale-by-paths.test.mjs; do node "$f"; done': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, không có eval ngẫu nhiên)

## Iterations

Round 1: REJECT — 14 phát hiện, trong đó 1 phát hiện thuộc hợp đồng (AC-6: băm thông điệp đỏ không thấy ca đỏ mới); các ô duyệt thêm đã sửa trước round 2. Returned to implementation.
Round 2: E8 failed — trên kho crm-onehub phép so cũ/mới còn 1 hồ sơ khác (lưới trước-gộp dòng 2855: phía mới rỗng, phía cũ có lỗi ghi vào ống đã đóng); các eval E1–E7, E9, E10, E11 và mọi lệnh suite đều xanh. Returned to implementation.
