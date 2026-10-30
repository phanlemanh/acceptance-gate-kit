---
schema_version: 2
feature_slug: tep-sinh-khong-chan-gop
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 774ecafcb64855e2df08c839cb1154c70aff4c75
human_signoff:
---

# Evidence Report: tep-sinh-khong-chan-gop

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-tep-sinh-khong-chan-gop-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-tep-sinh-khong-chan-gop-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-tep-sinh-khong-chan-gop-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-tep-sinh-khong-chan-gop-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-tep-sinh-khong-chan-gop-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-tep-sinh-khong-chan-gop-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-tep-sinh-khong-chan-gop-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tep_sinh
  verified_at: 2026-10-30T03:28:28Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-tep-sinh-khong-chan-gop-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-30T04:51:00Z
  output: |
    lệnh `node scripts/product-map.mjs --root . --check` thoát sạch ở round 3 trên cây 774ecafc;
    đuôi đầu ra chỉ có dòng trạng thái thoát sạch.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-tep-sinh-khong-chan-gop-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-30T04:51:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Eval không-phân-biệt (xanh cả trên bản HEAD lẫn baseline; chứng minh harness chứ không phải feature — viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):
- E8 (`node scripts/product-map.mjs --root . --check`)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bộ suite plugin vung:1 và vung:2 đỏ theo run-log vòng 1; trả về cho bên triển khai.
Round 2: E1–E8 xanh nhưng ca cũ P105 (ghim thư mục rỗng là hỏng) đỏ — REJECT, dừng-vá, đổi khuôn theo luật P123.
Round 3: E8 và toàn bộ lệnh suite chạy lại xanh trên 774ecafc; E1–E7 carry-forward từ round 2 (delta không chạm paths của eval) — PASS.
