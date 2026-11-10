---
schema_version: 2
feature_slug: do-tuong-phan-lab-oklab
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b2dbc55c2177ea996e0338841506c9bc3c629fb0
human_signoff: Manh Phan 2026-11-10
---

# Evidence Report: do-tuong-phan-lab-oklab

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6a | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6c | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-7 | test | PASS |
| E11 | AC-8 | script | PASS |
| E9a | AC-9 | test | PASS |
| E9b | AC-9 | script | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-do-tuong-phan-lab-oklab-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E2
  run_id: minted-do-tuong-phan-lab-oklab-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E3
  run_id: minted-do-tuong-phan-lab-oklab-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E4
  run_id: minted-do-tuong-phan-lab-oklab-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E5
  run_id: minted-do-tuong-phan-lab-oklab-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E6a
  run_id: minted-do-tuong-phan-lab-oklab-E6a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E6b
  run_id: minted-do-tuong-phan-lab-oklab-E6b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kdd_hoi_quy
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: bash tests/design-eval/kdd.sh --hoi-quy
    KD: 4 đạt, 0 trượt

- eval: E6c
  run_id: minted-do-tuong-phan-lab-oklab-E6c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kdd_nen_mau
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: bash tests/design-eval/kdd.sh KD9
    KD: 11 đạt, 0 trượt

- eval: E7
  run_id: minted-do-tuong-phan-lab-oklab-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E8
  run_id: minted-do-tuong-phan-lab-oklab-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E11
  run_id: minted-do-tuong-phan-lab-oklab-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mau_lab_chromium
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab-chromium.mjs
    mau-lab-chromium: 6/6 ca đạt

- eval: E9a
  run_id: minted-do-tuong-phan-lab-oklab-E9a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.mau_lab_hai_chieu
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-eval/mau-lab.test.mjs && node tests/design-eval/mau-lab-do.test.mjs
    mau-lab-do: 19/19 ca đạt

- eval: E9b
  run_id: minted-do-tuong-phan-lab-oklab-E9b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.design_scan_khop_nguon
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node scripts/build-design-scan.mjs --check
    design-scan.js in sync

- eval: E10
  run_id: minted-do-tuong-phan-lab-oklab-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.df_s4_chu_thich
  verified_at: 2026-11-10T02:10:13Z
  output: |
    lệnh: node tests/design-floor/moc-s3-s4.mjs --chi S4-HEX,S4-CHU-THICH
    moc-s3-s4: XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: b7cstdn04
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-do-tuong-phan-lab-oklab-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-10T02:10:13Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (pass trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E6b (bash tests/design-eval/kdd.sh --hoi-quy)
- E6c (bash tests/design-eval/kdd.sh KD9)
- E9b (node scripts/build-design-scan.mjs --check)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chấm tại commit 5f2d360b; chi tiết xem run-log.jsonl.
Round 2: mọi eval đạt tại commit caac4053e72297a6bf354f59a79a33f87d8f6749; baseline carried từ round 1.

### Re-pin lần 1 — 2026-11-10, do hoá cũ do gộp origin/main (#491) để giải xung đột PR 489
run_id: repin-20261110T094227Z-45153
sha: b2dbc55c2177ea996e0338841506c9bc3c629fb0 · suites: 11 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng
