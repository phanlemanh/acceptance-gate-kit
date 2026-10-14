---
schema_version: 2
feature_slug: moc-la-chien-dich
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 009d5ca1c92a1d7ab49e8d96ff47872ea5af5d9c
human_signoff:
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
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-11 | script | PASS |
| E13 | AC-5 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-moc-la-chien-dich-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E2
  run_id: minted-moc-la-chien-dich-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E3
  run_id: minted-moc-la-chien-dich-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E4
  run_id: minted-moc-la-chien-dich-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E5
  run_id: minted-moc-la-chien-dich-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E6
  run_id: minted-moc-la-chien-dich-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E7
  run_id: minted-moc-la-chien-dich-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E8
  run_id: minted-moc-la-chien-dich-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E9
  run_id: minted-moc-la-chien-dich-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E11
  run_id: minted-moc-la-chien-dich-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T10:16:45Z
  output: |
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E13
  run_id: minted-moc-la-chien-dich-E13-r1
  exit_code: 0
  verifier: config:executors.test.moc_chien_dich_lt97
  verified_at: 2026-10-14T09:26:45Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-moc-la-chien-dich-E10-r1
  exit_code: 0
  verifier: config:executors.test.moc_chien_dich_crm
  verified_at: 2026-10-14T09:26:45Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-moc-la-chien-dich-E12-r1
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-10-14T09:26:45Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-moc-la-chien-dich-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-moc-la-chien-dich-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-14T10:16:45Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Ghi chú: ở round này baseline của các eval chạy lại là n-a (xem mục dưới). E13 và E12 là carry-forward từ round 1, không chấm lại; round 1 đã ghi hai eval này xanh cả hai phía baseline.

### Baseline khong do

- node tests/scripts/moc-chien-dich.test.mjs: bo qua baseline: tep tests/scripts/moc-chien-dich.test.mjs co o cay dang kiem nhung chua co o merge-base f4e717bf6b21a6d3769d0df7821cc7497c494890 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — E7 ghim sai dòng «PASS: MC-6 ma-thoat» (tệp ca in «PASS: MC-7 ma-thoat»); hai lệnh suite đỏ (bash tests/scripts/run-tests.sh --manh mjs:2/3 và plugins vung:3, theo các finding RT13/RT18 và DP2-11); LTT-san đỏ trên vật thật. Returned to implementation.
Round 2: chạy lại E1–E9, E11 và mười hai lệnh suite trên 009d5ca1 — tất cả xanh (suite mjs:2/3 và plugins vung:3 đã xanh). E13, E10, E12 giữ nguyên từ round 1 (delta không chạm paths). Còn mở cho Cổng 2, ghi ở review-findings.md: 1 mục trong hợp đồng (AC-7, vế thư mục con của worktree), 4 mục ngoài hợp đồng mới và 7 mục mang từ round 1 — trong đó LTT-san nay đo trên bản sao đã tắt hai cờ mới.
