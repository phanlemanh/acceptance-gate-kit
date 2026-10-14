---
schema_version: 2
feature_slug: moc-la-chien-dich
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 928b9ff98317b2fc2c5492375322a6c8c1d75bfb
human_signoff: Manh Phan 2026-10-14
---

# Evidence Report: moc-la-chien-dich

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
| E10 | AC-10 | test | PASS (carry-forward từ round 1) |
| E11 | AC-11 | test | PASS |
| E12 | AC-11 | script | PASS |
| E13 | AC-5 | test | PASS (carry-forward từ round 1) |
| E14 | AC-4 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-moc-la-chien-dich-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E2
  run_id: minted-moc-la-chien-dich-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E3
  run_id: minted-moc-la-chien-dich-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E4
  run_id: minted-moc-la-chien-dich-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E5
  run_id: minted-moc-la-chien-dich-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E6
  run_id: minted-moc-la-chien-dich-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E7
  run_id: minted-moc-la-chien-dich-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E8
  run_id: minted-moc-la-chien-dich-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E9
  run_id: minted-moc-la-chien-dich-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E11
  run_id: minted-moc-la-chien-dich-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T12:27:17Z
  output: |
    Results: 28 passed, 0 failed (moc-chien-dich)

- eval: E12
  run_id: minted-moc-la-chien-dich-E12-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-14T12:27:17Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E14
  run_id: minted-moc-la-chien-dich-E14-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.moc_chien_dich_dp211
  verified_at: 2026-10-14T12:27:17Z
  output: |
    ℹ duration_ms 644.214459

- eval: E13
  run_id: minted-moc-la-chien-dich-E13-r1
  exit_code: 0
  verifier: config:executors.test.moc_chien_dich_lt97
  verified_at: 2026-10-14T09:26:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-moc-la-chien-dich-E10-r1
  exit_code: 0
  verifier: config:executors.test.moc_chien_dich_crm
  verified_at: 2026-10-14T09:26:45Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-moc-la-chien-dich-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-14T12:27:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả bản nhánh lẫn bản gốc, chứng minh harness chứ không chứng minh tính năng; giữ như regression-guard có chủ ý):

- E12 (`node scripts/product-map.mjs --root . --check`): xanh trên baseline
- E14 (`node --test --test-name-pattern=DP2-11 tests/dieu-phoi/mo-dot.test.mjs`): xanh trên baseline

Baseline khong do

- node tests/scripts/moc-chien-dich.test.mjs: bo qua baseline: tep tests/scripts/moc-chien-dich.test.mjs co o cay dang kiem nhung chua co o merge-base f4e717bf6b21a6d3769d0df7821cc7497c494890 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chạy đầu tiên của vòng, ghi vào sổ chạy; các sửa sau lượt này vào ở commit 009d5ca1.
Round 2: S4 lượt 2 PASS ở 009d5ca1, dừng ở Cổng Bằng chứng với 11 mục ngoài hợp đồng chờ người.
Round 3: sau vòng sửa Ngoài-6 (nâng phạm vi, chủ kho 14/10) — khoá loTrinhChuaKhai chỉ có mặt khi kho chưa khai lộ trình, thêm E14 và siết E4; E1–E9, E11, E12, E14 chạy lại trên f6cac108, E10 và E13 carry-forward từ round 1; toàn bộ PASS.

### Re-pin lần 1 — 2026-10-14, do gộp origin/main (#349–#353) vào nhánh PR #354
run_id: repin-20261014T133924Z-90432
sha: 928b9ff98317b2fc2c5492375322a6c8c1d75bfb · suites: 11 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng
