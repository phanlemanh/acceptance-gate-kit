---
schema_version: 2
feature_slug: lan-ghim-lai-giu-tron-loi-loi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a54ab8a63eae64120b0bb84b93f515e34361de6e
human_signoff:
---

# Evidence Report: lan-ghim-lai-giu-tron-loi-loi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: 20261002T235212Z-52924
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_nhat_ky_tron
  verified_at: 2026-10-02T23:51:59Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh --chan nhat-ky-tron
    E1 XANH

- eval: E2
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_xanh_im
  verified_at: 2026-10-02T23:51:59Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh --chan xanh-im
    E2 XANH

- eval: E3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_dau_do
  verified_at: 2026-10-02T23:51:59Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh --chan dau-do
    E3 XANH

- eval: E4
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_bo_doc_im
  verified_at: 2026-10-02T23:51:59Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh --chan bo-doc-im
    E4 XANH

- eval: E5
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_thoi_luong
  verified_at: 2026-10-02T23:51:59Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh --chan thoi-luong
    E5 XANH

- eval: E6
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_tai_may
  verified_at: 2026-10-02T23:51:59Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh --chan tai-may
    E6 XANH

- eval: E7
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gtll_nghia_khong_doi
  verified_at: 2026-10-02T23:51:59Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang.sh --chan nghia-khong-doi
    E7 XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lan-ghim-lai-giu-tron-loi-loi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-02T23:51:59Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet). Ghi chu: truong baseline cua bay eval deu la n-a (khong chay duoc tren ban base); do phan biet cua tung eval nam o cac chieu do ben trong chinh no (ban sao bi tiem phai cho ket qua do).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bay eval E1 den E7 va muoi mot lenh suite deu xanh; khong eval nao do, khong muc judgment, khong phuong sai. Cac phat hien cua buoc tim loi nam o review-findings.md, khong dua vao bao cao nay.
