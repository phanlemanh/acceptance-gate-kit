---
schema_version: 2
feature_slug: loc-paths-dong-mac-dinh
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 11dffe76272d850a41a0f78815120b2883f309fb
human_signoff:
---

# Evidence Report: loc-paths-dong-mac-dinh

Round 1 bị REJECT dù cả chín eval của hợp đồng đều xanh: một lệnh suite hồi quy không gắn eval nào (`bash tests/scripts/run-tests.sh --manh mjs:1/3`) đỏ ở ca DV5 của `additive-only.test.mjs` — diff làm đổi một dòng luật cũ trong `scripts/pre-merge-check.sh`. Chi tiết ở khối suite bên dưới và mục Iterations.

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
  run_id: minted-loc-paths-dong-mac-dinh-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_ma_tran
  verified_at: 2026-10-06T11:16:25Z
  output: |
    E1 XANH

- eval: E2
  run_id: minted-loc-paths-dong-mac-dinh-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_doi_chung_crm
  verified_at: 2026-10-06T11:16:25Z
  output: |
    E2 XANH

- eval: E3
  run_id: minted-loc-paths-dong-mac-dinh-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_truoc_merge
  verified_at: 2026-10-06T11:16:25Z
  output: |
    E3 XANH

- eval: E4
  run_id: minted-loc-paths-dong-mac-dinh-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_cay
  verified_at: 2026-10-06T11:16:25Z
  output: |
    E4 XANH

- eval: E5
  run_id: minted-loc-paths-dong-mac-dinh-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_mot_nguon
  verified_at: 2026-10-06T11:16:25Z
  output: |
    E5 XANH

- eval: E6
  run_id: minted-loc-paths-dong-mac-dinh-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_lan_mot_bo_doc
  verified_at: 2026-10-06T11:16:25Z
  output: |
    E6 XANH

- eval: E7
  run_id: minted-loc-paths-dong-mac-dinh-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_doc_cu
  verified_at: 2026-10-06T11:16:25Z
  output: |
    PASS: chiều đỏ «đổi mặc định»: bản sao coi khoá vắng là paths → đầu ra lưới khác base
    E7 XANH

- eval: E8
  run_id: minted-loc-paths-dong-mac-dinh-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_bo_may_cu
  verified_at: 2026-10-06T11:16:25Z
  output: |
    (lệnh thoát sạch, không in dòng tóm tắt riêng)

- eval: E9
  run_id: minted-loc-paths-dong-mac-dinh-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lpdm_tai_lieu
  verified_at: 2026-10-06T11:16:25Z
  output: |
    E9 XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-10-06T11:16:25Z
  ghi chú: lệnh ĐỎ và không gắn eval nào (failed_evals để trống). Ca đỏ là DV5 trong additive-only.test.mjs — «diff so với base 892755e CHỈ THÊM» — vì một dòng luật cũ của scripts/pre-merge-check.sh (dòng gọi l.staleByPaths, nay truyền thêm tham số cây {prefix:process.argv[3]} cùng đối số thứ ba) bị đổi thay vì thêm. Ba mục còn lại trong cùng lệnh (DV5 recheck-evidence, DV5u, DV5m) và cay-doi-trong-luot.test.mjs (25 ca) xanh. Cách gỡ thuộc về người sửa vật: hoặc thêm dòng mới thay vì sửa dòng cũ, hoặc đưa dòng bị sửa vào ALLOWED_REMOVALS kèm lý do.
  output: |
    additive-only: existing rule line removed/modified trong scripts/pre-merge-check.sh:
      process.stdout.write(JSON.stringify(l.staleByPaths(files,ev,{prefix:process.argv[3]})));' "$CHU_KY_LIB" "$dir/evals.yaml" "$_sbp_pre" 2>"$_sbp_ef")"; then
    Results: 4 passed, 1 failed
      FAIL: additive-only.test.mjs (expected exit 0, got 1)
    Results passed: 57 tests in multiple suites with core suite additive-only.test.mjs failing

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-loc-paths-dong-mac-dinh-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-06T11:16:25Z

## Known limits

## Ngoài hợp đồng

## Analyst

none (baseline n-a ở cả chín eval — chiều đỏ nằm trong chính từng chân bằng bản sao tiêm lỗi, không đo trên cây base; không eval nào được chứng minh là xanh-cả-hai-phía)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: không eval nào của hợp đồng đỏ (E1–E9 xanh); lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:1/3` đỏ ở ca DV5 additive-only (scripts/pre-merge-check.sh có dòng luật cũ bị sửa, không chỉ thêm), không gắn eval nào. Trả về hiện thực hoá.
