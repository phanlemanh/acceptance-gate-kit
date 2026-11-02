---
schema_version: 2
feature_slug: khuon-loi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 430fb3f36debf758e6be7202c6c8f6445df04209
human_signoff:
---

# Evidence Report: khuon-loi

Round 2. Mười một eval E1–E11 đều xanh, nhưng một lệnh suite hồi quy không gắn eval (vùng 3 của bộ plugin) thoát khác 0 và có hai phát hiện trong hợp đồng chạm AC-7 → verdict REJECT, trả về implementation.

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

## Evidence

Mười một eval cùng chạy qua một lệnh `node tests/scripts/khuon-loi.test.mjs` (một lượt, deterministic, runs 1). Dòng cuối của đầu ra là `PASS: [KL-10]`.

- eval: E1
  run_id: minted-khuon-loi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E2
  run_id: minted-khuon-loi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E3
  run_id: minted-khuon-loi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E4
  run_id: minted-khuon-loi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E5
  run_id: minted-khuon-loi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E6
  run_id: minted-khuon-loi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E7
  run_id: minted-khuon-loi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E8
  run_id: minted-khuon-loi-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E9
  run_id: minted-khuon-loi-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E10
  run_id: minted-khuon-loi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

- eval: E11
  run_id: minted-khuon-loi-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khuon_loi
  verified_at: 2026-11-01T23:23:33Z
  output: |
    PASS: [KL-10]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-khuon-loi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khuon-loi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khuon-loi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-01T23:23:33Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khuon-loi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khuon-loi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-khuon-loi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-01T23:23:33Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml không đổi từ lần baseline cuối, round 1). Mọi block eval ghi `baseline: n-a`; lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

Baseline khong do: round này không đo lại.

Eval không-phân-biệt: none.

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 ...'` (suite hồi quy vùng 3 của bộ plugin) thoát khác 0, ca P179 [MBC] E6 báo lỗi. Lệnh này không gắn eval nào nên `failed_evals` để trống; chính nó là lý do verdict là REJECT cùng với hai phát hiện trong hợp đồng chạm AC-7 (chi tiết ở review-findings.md).

## Variance

none — mọi eval đều deterministic (runs 1), không có pass_rate hỗn hợp.

## Iterations

Round 1: E1–E11 đều xanh, các lệnh suite hồi quy xanh; verdict PASS, chờ người ký ở Cổng Bằng chứng.
Round 2: E1–E11 vẫn xanh, nhưng suite vùng 3 của bộ plugin (ca P179) đỏ và có hai phát hiện trong hợp đồng chạm AC-7 (bước ghi số đo khuôn đòi HEAD bằng đúng sha lượt chấm). Returned to implementation.
