---
schema_version: 2
feature_slug: nen-cong-cu-gan-bang-lenh-con
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7c8f271110361faa9cc3bcfa9c141b95dbfb2e95
human_signoff: Phan Le Manh 2026-09-24 — ký với 6 known-limits đã khai (Ngoài-1/2/3/5/6/7) và 1 mục mở hợp đồng mới (Ngoài-4: lệnh con mở đầu bằng chuyển hướng, ghi hạt giống); đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: nen-cong-cu-gan-bang-lenh-con

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncl_lenh_con
  verified_at: 2026-09-24T08:53:49Z
  output: |
    PASS: NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)

    Results: 22 passed, 0 failed (duong-nen)

- eval: E2
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncl_lenh_con
  verified_at: 2026-09-24T08:53:49Z
  output: |
    PASS: NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)

    Results: 22 passed, 0 failed (duong-nen)

- eval: E3
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncl_lenh_con
  verified_at: 2026-09-24T08:53:49Z
  output: |
    PASS: NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)

    Results: 22 passed, 0 failed (duong-nen)

- eval: E4
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncl_lenh_con
  verified_at: 2026-09-24T08:53:49Z
  output: |
    PASS: NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)

    Results: 22 passed, 0 failed (duong-nen)

- eval: E5
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncl_lenh_con
  verified_at: 2026-09-24T08:53:49Z
  output: |
    PASS: NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)

    Results: 22 passed, 0 failed (duong-nen)

- eval: E6
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncl_lenh_con
  verified_at: 2026-09-24T08:53:49Z
  output: |
    PASS: NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)

    Results: 22 passed, 0 failed (duong-nen)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nen-cong-cu-gan-bang-lenh-con-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-24T08:53:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: toàn bộ 6 eval (E1–E6) và 10 lệnh suite hồi quy đều PASS ngay lượt chạy đầu tiên — không có vòng sửa lỗi nào cần quay lại implementation.