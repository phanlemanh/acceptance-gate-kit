---
schema_version: 2
feature_slug: phan-du-bo-cuc-moi
verdict: BLOCKED
failed_evals: []
reason: "Ba lệnh đo không xong trong ngưỡng 30 phút mặc định của long_running, nên chưa có kết quả đạt hay hỏng nào cho E1, E7, E11. Chưa có dòng __EXIT= và chưa có run_id thật. Cách gỡ là chạy lại với timeout dài hơn (khai long_running trong evals.yaml cho ba eval này), không phải sửa mã. (1) giu-khoa.mjs --cu (E1): chuyển sang nền sau 600 s, tiến trình pid 66840 còn sống sau hơn 30 phút, tệp đầu ra 0 byte. (2) giu-khoa.mjs --moi --cum K4-SC (E7): chuyển sang nền sau 600 s, tiến trình pid 66101 còn chạy khi hết thời gian chờ (khoảng 31 phút). (3) giu-khoa.mjs --moi (E11): chuyển sang nền sau 600 s (ID btpub0atz), tệp đầu ra rỗng suốt chu kỳ chờ. Không công cụ nào giết lệnh; không chạy lại để tránh hai bản song song."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 158b1801022a8e3604271c88852e1e4ff544a7da
human_signoff:
---

# Evidence Report: phan-du-bo-cuc-moi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | BLOCKED |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | script | PASS |
| E7 | AC-7 | script | BLOCKED |
| E8 | AC-8 | script | PASS |
| E11 | AC-11 | script | BLOCKED |
| E12 | AC-11 | script | PASS |
| E13 | AC-12 | script | PASS |

## Evidence

- eval: E1
  verifier: config:executors.script.pdbm_cu
  trạng thái: BLOCKED — lệnh `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --cu` chạy quá 30 phút chưa xong (pid 66840, tệp đầu ra 0 byte, chưa có dòng __EXIT=). Không có run_id, không có mã thoát thật. Không chạy lại, không giết tiến trình.
  baseline: n-a

- eval: E2
  run_id: minted-phan-du-bo-cuc-moi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pdbm_bo_cuc
  verified_at: 2026-11-15T13:20:10Z
  output: |
    bo-cuc: 217 passed, 0 failed

- eval: E3
  run_id: minted-phan-du-bo-cuc-moi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k2
  verified_at: 2026-11-15T13:20:10Z
  output: |
    giu-khoa --moi: 1674s

- eval: E4
  run_id: minted-phan-du-bo-cuc-moi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_sp
  verified_at: 2026-11-15T13:20:10Z
  output: |
    giu-khoa --moi: 336s

- eval: E13
  run_id: minted-phan-du-bo-cuc-moi-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_sp
  verified_at: 2026-11-15T13:20:10Z
  output: |
    giu-khoa --moi: 336s

- eval: E5
  run_id: minted-phan-du-bo-cuc-moi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k3
  verified_at: 2026-11-15T13:20:10Z
  output: |
    giu-khoa --moi: 1859s

- eval: E6b
  run_id: minted-phan-du-bo-cuc-moi-E6b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k3
  verified_at: 2026-11-15T13:20:10Z
  output: |
    giu-khoa --moi: 1859s

- eval: E6
  run_id: minted-phan-du-bo-cuc-moi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pdbm_recheck_goc_goi
  verified_at: 2026-11-15T13:20:10Z
  output: |
    Results: 4 passed, 0 failed

- eval: E7
  verifier: config:executors.script.pdbm_moi_k4_sc
  trạng thái: BLOCKED — lệnh `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi --cum K4-SC` chạy quá 30 phút chưa xong (pid 66101, ID nền bzin3x3xc, tệp đầu ra 0 byte, chưa có dòng __EXIT=). Không có run_id, không có mã thoát thật. Không chạy lại.
  baseline: n-a

- eval: E8
  run_id: minted-phan-du-bo-cuc-moi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k4_pl
  verified_at: 2026-11-15T13:20:10Z
  output: |
    giu-khoa --moi: 1921s

- eval: E11
  verifier: config:executors.script.pdbm_moi
  trạng thái: BLOCKED — lệnh `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi` chạy quá 30 phút chưa xong (ID nền btpub0atz, tệp đầu ra rỗng suốt chu kỳ chờ, chưa có dòng __EXIT=). Không có run_id, không có mã thoát thật. Không chạy lại để tránh hai bản song song.
  baseline: n-a

- eval: E12
  run_id: minted-phan-du-bo-cuc-moi-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_chieu_do
  verified_at: 2026-11-15T13:20:10Z
  output: |
    giu-khoa --chieu-do: 1286s

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-phan-du-bo-cuc-moi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-phan-du-bo-cuc-moi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-15T13:20:10Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Ghi chú trung thực: câu trên là mẫu máy đòi khi danh sách không-phân-biệt rỗng. Thực tế mọi eval feature đều có baseline n-a (eval mới, chưa có ở merge-base), nên chưa có eval nào được chứng minh red trên baseline. Bảng dưới là các lệnh không đo baseline.

Baseline khong do:
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --cu: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/bo-cuc.test.mjs: bo qua baseline: tep tests/scripts/bo-cuc.test.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi --cum K2: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi --cum SP: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi --cum K3: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/recheck-goc-goi-loi.test.mjs: bo qua baseline: tep tests/scripts/recheck-goc-goi-loi.test.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi --cum K4-SC: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi --cum K4-PL: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --moi: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --chieu-do: bo qua baseline: tep _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs co o cay dang kiem nhung chua co o merge-base 644e9b49af3d24de3fe284304d765ea388304b89 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E7, E11 BLOCKED — mỗi lệnh chạy quá 30 phút chưa xong (đã chuyển sang nền sau 600 s, không có dòng __EXIT=); chưa kết luận đạt hay hỏng, cần chạy lại với timeout dài hơn (khai long_running), không phải sửa mã. Chín eval còn lại (E2, E3, E4, E5, E6, E6b, E8, E12, E13) và mười một lệnh suite xanh.
