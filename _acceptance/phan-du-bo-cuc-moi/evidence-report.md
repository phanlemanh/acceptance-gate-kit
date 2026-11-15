---
schema_version: 2
feature_slug: phan-du-bo-cuc-moi
verdict: REJECT
failed_evals: ["E1"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7cd8eadbd313d9bf1c3129ad99a720b2df721c71
human_signoff:
---

# Evidence Report: phan-du-bo-cuc-moi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-11 | script | PASS |
| E13 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-phan-du-bo-cuc-moi-E1-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.pdbm_cu
  verified_at: 2026-11-15T14:39:51Z
  output: |
    FAIL: CU tests/workflows/chot-truong-nguoi.test.mjs — mất khoá: CTN-AC6-kit chieu im tren 233 bao cao kit: chi dong bon khoa o vi tri truong doi
    FAIL: CU tests/workflows/run-tests.sh — mất khoá: CTN-AC6-kit chieu im tren 233 bao cao kit: chi dong bon khoa o vi tri truong doi
    PASS: CU-DO tests/scripts/bo-cuc.test.mjs — xoá ca «BC tri-thuc/commands/ghi.md · cây phẳng» khỏi bản sao HEAD → phép so đỏ: mất khoá 9
    PASS: CU-DO-DP tests/dieu-phoi/ten-may-mot-luat.test.mjs — xoá ca «TM-1 khu-hoi» khỏi bản sao HEAD → phép so đỏ: mất khoá 1
    PASS: CU-LT94 LT-94 chạy dưới đồng hồ ghim ở 2026-10-20 → đỏ «trang chứa ngày chạy» (đối chứng dương: đồng hồ thật xanh)
    giu-khoa --cu: 67 tệp, 3 khoá mất, 1 ca đỏ
    giu-khoa --cu: 6111s

- eval: E2
  run_id: minted-phan-du-bo-cuc-moi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pdbm_bo_cuc
  verified_at: 2026-11-15T14:39:51Z
  output: |
    bo-cuc: 217 passed, 0 failed

- eval: E3
  run_id: minted-phan-du-bo-cuc-moi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k2
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 1613s

- eval: E4
  run_id: minted-phan-du-bo-cuc-moi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_sp
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 318s

- eval: E13
  run_id: minted-phan-du-bo-cuc-moi-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_sp
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 318s

- eval: E5
  run_id: minted-phan-du-bo-cuc-moi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k3
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 1806s

- eval: E6b
  run_id: minted-phan-du-bo-cuc-moi-E6b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k3
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 1806s

- eval: E6
  run_id: minted-phan-du-bo-cuc-moi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.pdbm_recheck_goc_goi
  verified_at: 2026-11-15T14:39:51Z
  output: |
    Results: 4 passed, 0 failed

- eval: E7
  run_id: minted-phan-du-bo-cuc-moi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k4_sc
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 2216s

- eval: E8
  run_id: minted-phan-du-bo-cuc-moi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi_k4_pl
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 1870s

- eval: E11
  run_id: minted-phan-du-bo-cuc-moi-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_moi
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --moi: 3029s

- eval: E12
  run_id: minted-phan-du-bo-cuc-moi-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.pdbm_chieu_do
  verified_at: 2026-11-15T14:39:51Z
  output: |
    giu-khoa --chieu-do: 1271s

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: b66myine6
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-11-15T14:39:51Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-phan-du-bo-cuc-moi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-phan-du-bo-cuc-moi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-phan-du-bo-cuc-moi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-11-15T14:39:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt). Lưu ý: không eval nào có baseline đo được (toàn bộ n-a, xem bên dưới), nên "none" ở đây là không có gì để so, không phải bằng chứng phân biệt.

Lệnh fail không gắn eval:
- giu-khoa.mjs --cu thoát mã 1 (gắn E1, đã tính vào failed_evals).
- Suite plugins vung:3 thoát mã 1 do ca P179 (ledger known-limits) đỏ; lệnh này không gắn eval nào.

Baseline khong do
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

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần, xác định).

## Iterations

Round 1: E1 failed — giu-khoa --cu mất khoá CTN-AC6-kit ở tests/workflows/chot-truong-nguoi.test.mjs và tests/workflows/run-tests.sh (ba khoá mất, một ca đỏ); thêm suite plugins vung:3 đỏ ở ca P179 (không gắn eval). Returned to implementation.
