---
schema_version: 2
feature_slug: design-floor-moc-s3-s4
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 68f6f9dccd01676fccec347cdf4a93353f50f6fc
human_signoff:
---

# Evidence Report: design-floor-moc-s3-s4

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
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-design-floor-moc-s3-s4-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_s3_autofix
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E2
  run_id: minted-design-floor-moc-s3-s4-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_s3_sinh_lai
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E3
  run_id: minted-design-floor-moc-s3-s4-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_s3_cay_ban
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E4
  run_id: minted-design-floor-moc-s3-s4-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_s4_hex
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E5
  run_id: minted-design-floor-moc-s3-s4-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_s4_token_coverage
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E6
  run_id: minted-design-floor-moc-s3-s4-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_s4_bac
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E7
  run_id: minted-design-floor-moc-s3-s4-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_s4_chi_doc
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E8
  run_id: minted-design-floor-moc-s3-s4-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_gate_df07
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E9
  run_id: minted-design-floor-moc-s3-s4-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_vong_mau
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

- eval: E10
  run_id: minted-design-floor-moc-s3-s4-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.df5_noi_day
  verified_at: 2026-10-28T03:16:59Z
  output: |
    moc-s3-s4: XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-design-floor-moc-s3-s4-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-design-floor-moc-s3-s4-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-design-floor-moc-s3-s4-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-28T03:16:59Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»

none — moi eval feature deu red tren baseline (co phan biet)

Luu y: baseline BLOCKED o round nay nen moi field baseline la n-a; danh sach eval khong-phan-biet o tren KHONG do duoc o round nay (rong vi baseline khong do, khong phai vi da chung minh co phan biet).

Baseline khong do:

- bash tests/design-floor/eval.sh df5-s3-autofix: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-s3-sinh-lai: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-s3-cay-ban: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-s4-hex: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-s4-token-coverage: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-s4-bac: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-s4-chi-doc: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-gate-df07: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-vong-mau: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- bash tests/design-floor/eval.sh df5-noi-day: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: all 10 feature evals (E1-E10) and 11 suite commands passed; verdict PASS. Baseline lane BLOCKED by infrastructure (see Analyst); findings out of contract listed in review-findings.md for Gate 2.
