---
schema_version: 2
feature_slug: run-id-danh-sach-cho-phep
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d36de070d408f0af371c6842a411a531662e6638
human_signoff:
---

# Evidence Report: run-id-danh-sach-cho-phep

Lý do REJECT: sáu eval AC-1..AC-6 đều mang sang xanh từ round 1 (delta không chạm paths của chúng), nhưng lệnh suite `tests/plugins/run-tests.sh --manh vung:3` đỏ ở round này và không gắn eval nào (ca P179 «E6 ledger known-limits: dem tu corpus + bat bien hang + quan he»). Lệnh đó được ghi rõ ở khối «Lệnh suite (hồi quy)» bên dưới.

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
  run_id: minted-run-id-danh-sach-cho-phep-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e1
  verified_at: 2026-10-31T19:37:27Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-run-id-danh-sach-cho-phep-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e2
  verified_at: 2026-10-31T19:37:27Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-run-id-danh-sach-cho-phep-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e3
  verified_at: 2026-10-31T19:37:27Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-run-id-danh-sach-cho-phep-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e4
  verified_at: 2026-10-31T19:37:27Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-run-id-danh-sach-cho-phep-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e5
  verified_at: 2026-10-31T19:37:27Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-run-id-danh-sach-cho-phep-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rh_e6
  verified_at: 2026-10-31T19:37:27Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-01T02:07:24Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed
- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z
- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-run-id-danh-sach-cho-phep-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-01T02:07:24Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Non-discriminating evals: none. Baseline round này không đo lại (evals.yaml không đổi từ lần baseline cuối, round 1); field baseline của mọi eval ghi n-a. Các lệnh suite xanh-cả-hai-phía là regression-guard bình thường, không liệt kê.

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 ...'` (ca P179, ledger known-limits). Không eval nào phủ nó nên failed_evals để trống; chính lệnh này làm verdict thành REJECT.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E6 đều PASS (run_id hậu tố r1).
Round 2: E1–E6 mang sang từ round 1 (delta không chạm paths); lệnh suite vung:3 đỏ ở ca P179 (ledger known-limits), không gắn eval nào. Trả về triển khai.
