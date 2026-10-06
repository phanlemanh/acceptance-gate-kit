---
schema_version: 2
feature_slug: loc-paths-dong-mac-dinh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 16bef1c7b17a03941db3ece3f6e3e28f11ce25f2
human_signoff: Manh Phan 2026-10-06 — ký lượt chấm 2; Ngoài-1, Ngoài-2, Ngoài-3, Ngoài-4, Ngoài-6 ghi Known limits; Ngoài-5 mở hợp đồng mới (hạt giống); đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: loc-paths-dong-mac-dinh

Round 2 xanh trọn: chín eval của hợp đồng (E1–E9) và mười lệnh suite hồi quy đều xanh trên cây 16bef1c7. Ca DV5 của additive-only đỏ ở round 1 nay xanh nhờ miễn trừ đích danh dòng gọi bộ lọc cũ (35fd61bd).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-loc-paths-dong-mac-dinh-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_ma_tran
  verified_at: 2026-10-06T12:12:23Z
  output: |
    E1 XANH

- eval: E2
  run_id: minted-loc-paths-dong-mac-dinh-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_doi_chung_crm
  verified_at: 2026-10-06T12:12:23Z
  output: |
    E2 XANH

- eval: E3
  run_id: minted-loc-paths-dong-mac-dinh-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_truoc_merge
  verified_at: 2026-10-06T12:12:23Z
  output: |
    E3 XANH

- eval: E4
  run_id: minted-loc-paths-dong-mac-dinh-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_cay
  verified_at: 2026-10-06T12:12:23Z
  output: |
    E4 XANH

- eval: E5
  run_id: minted-loc-paths-dong-mac-dinh-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_mot_nguon
  verified_at: 2026-10-06T12:12:23Z
  output: |
    (lệnh thoát sạch, không in dòng tóm tắt riêng)

- eval: E6
  run_id: minted-loc-paths-dong-mac-dinh-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_lan_mot_bo_doc
  verified_at: 2026-10-06T12:12:23Z
  output: |
    E6 XANH

- eval: E7
  run_id: minted-loc-paths-dong-mac-dinh-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_doc_cu
  verified_at: 2026-10-06T12:12:23Z
  output: |
    E7 XANH

- eval: E8
  run_id: minted-loc-paths-dong-mac-dinh-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_bo_may_cu
  verified_at: 2026-10-06T12:12:23Z
  output: |
    (lệnh thoát sạch, không in dòng tóm tắt riêng)

- eval: E9
  run_id: minted-loc-paths-dong-mac-dinh-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_tai_lieu
  verified_at: 2026-10-06T12:12:23Z
  output: |
    E9 XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-06T12:12:23Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml không đổi từ lần đo baseline cuối). Không eval nào được liệt kê là không-phân-biệt-được; lệnh suite xanh-cả-hai-phía là regression-guard bình thường. Field baseline của chín eval ghi n-a vì round này không đo.

none

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào của hợp đồng đỏ (E1–E9 xanh); lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:1/3` đỏ ở ca DV5 additive-only (scripts/pre-merge-check.sh có dòng luật cũ bị sửa, không chỉ thêm), không gắn eval nào. Trả về hiện thực hoá.
Round 2: sau sửa S4-r1 (miễn trừ đích danh dòng gọi staleByPaths cũ trong lưới chỉ-thêm, commit 35fd61bd), E1–E9 và cả mười lệnh suite xanh, kể cả mjs:1/3. Sáu mục ngoài hợp đồng của round 1 giữ nguyên, không chấm lại, chờ người quyết ở Cổng Bằng chứng.
