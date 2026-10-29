---
schema_version: 2
feature_slug: cong-cu-xet-tep-ton-tai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fa5b965fe380c50e43a018584d2d352bd257ca2f
human_signoff:
---

# Evidence Report: cong-cu-xet-tep-ton-tai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cong-cu-xet-tep-ton-tai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T04:18:49Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Đã đối chiếu đủ 16 dòng PASS của NEN0 NEN1 NEN-TD1…TD6 NEN-LC1…LC3 NEN-TT1…TT5; dòng NEN-TT1 có mặt.

- eval: E2
  run_id: minted-cong-cu-xet-tep-ton-tai-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T04:18:49Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng NEN-TT2 (lượt «vắng») có mặt trong bộ 16 dòng PASS đã đối chiếu.

- eval: E3
  run_id: minted-cong-cu-xet-tep-ton-tai-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T04:18:49Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng NEN-TT3, NEN1, NEN-TD2, NEN-LC2 có mặt trong bộ 16 dòng PASS đã đối chiếu.

- eval: E4
  run_id: minted-cong-cu-xet-tep-ton-tai-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T04:18:49Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng NEN-TT4 và NEN-TD6 có mặt trong bộ 16 dòng PASS đã đối chiếu.

- eval: E5
  run_id: minted-cong-cu-xet-tep-ton-tai-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T04:18:49Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng NEN-TT5 (bản sao feature-loop, ba đột biến a b c) có mặt trong bộ 16 dòng PASS đã đối chiếu.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-29T04:18:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Mọi trường baseline của các eval đều là n-a; danh sách eval không-phân-biệt KHÔNG đo được ở round này. Không eval nào được liệt kê là không-phân-biệt, và cũng không khẳng định eval nào đỏ trên baseline.

Baseline khong do:
- bash -c 'out=$(node tests/scripts/duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEN0 NEN1 NEN-TD1 NEN-TD2 NEN-TD3 NEN-TD4 NEN-TD5 NEN-TD6 NEN-LC1 NEN-LC2 NEN-LC3 NEN-TT1 NEN-TT2 NEN-TT3 NEN-TT4 NEN-TT5; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

## Variance

none — every multi-run eval is uniform (cả năm eval chạy một lần, deterministic, không có pass_rate hỗn hợp)

## Iterations

Round 1: E1–E5 đều qua, 57/57 ca duong-nen và 12 lệnh suite xanh; không eval nào thất bại, không có judgment item chờ người. Baseline BLOCKED hạ tầng nên không đo được eval nào phân biệt.
