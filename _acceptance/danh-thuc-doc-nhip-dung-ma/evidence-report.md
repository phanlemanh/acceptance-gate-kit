---
schema_version: 2
feature_slug: danh-thuc-doc-nhip-dung-ma
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e208665fba6bbf3069b2d079c64448b8010ac180
human_signoff:
---

# Evidence Report: danh-thuc-doc-nhip-dung-ma

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
| E9b | AC-9 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E1-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E2-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E3-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E4-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E5-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E6-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E7-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E8-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9b
  run_id: minted-danh-thuc-doc-nhip-dung-ma-E9b-r2
  exit_code: 0
  verifier: config:executors.test.dieu_phoi_tc1_hai_moi_truong
  verified_at: 2026-10-26T04:32:29Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-danh-thuc-doc-nhip-dung-ma-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-26T06:02:08Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do: 10 eval mang tu round 2 (round nay khong chay lai eval nao nen khong do baseline moi) va 11 lenh suite hoi quy (n-a, khong gan eval).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — E9b chập chờn ca cũ dưới tải; AC-8 đo chuỗi thay vì quan hệ theo từng dòng. Returned to implementation.
Round 2: REJECT chỉ vì suite (P179 sổ known-limits thiếu hàng; LT-99-mau ENOTEMPTY); các eval của hợp đồng đều xanh. Returned to implementation: thêm 7 hàng sổ known-limits, dọn thư mục tạm có thử lại.
Round 3: PASS — 10 eval mang từ round 2 (delta không chạm paths), 11 lệnh suite xanh ở sha e208665fba6bbf3069b2d079c64448b8010ac180.
