---
schema_version: 2
feature_slug: cong-cu-xet-tep-ton-tai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 59ac5ddf6576bd2c68981cf78190d8d9f359355e
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
  run_id: minted-cong-cu-xet-tep-ton-tai-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T07:46:22Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Lệnh đã ghim đủ 16 dòng PASS theo tên: NEN0 NEN1 NEN-TD1..TD6 NEN-LC1..LC3 NEN-TT1..TT5 (vòng kiểm tên cuối lệnh không dừng sớm).

- eval: E2
  run_id: minted-cong-cu-xet-tep-ton-tai-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T07:46:22Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng PASS của NEN-TT2 có mặt trong đầu ra của lệnh.

- eval: E3
  run_id: minted-cong-cu-xet-tep-ton-tai-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T07:46:22Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng PASS của NEN-TT3, NEN1, NEN-TD2, NEN-LC2 có mặt trong đầu ra của lệnh.

- eval: E4
  run_id: minted-cong-cu-xet-tep-ton-tai-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T07:46:22Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng PASS của NEN-TT4 và NEN-TD6 có mặt trong đầu ra của lệnh.

- eval: E5
  run_id: minted-cong-cu-xet-tep-ton-tai-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cxt_ton_tai
  verified_at: 2026-10-29T07:46:22Z
  output: |
    Results: 57 passed, 0 failed (duong-nen)
    Dòng PASS của NEN-TT5 có mặt trong đầu ra của lệnh (kể cả đột biến (b) đã ghim bullet tên trần có mặt và đối chứng bản tiêm chết).

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-cong-cu-xet-tep-ton-tai-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-29T07:46:22Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Baseline khong do:
- bash -c 'out=$(node tests/scripts/duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEN0 NEN1 NEN-TD1 NEN-TD2 NEN-TD3 NEN-TD4 NEN-TD5 NEN-TD6 NEN-LC1 NEN-LC2 NEN-LC3 NEN-TT1 NEN-TT2 NEN-TT3 NEN-TT4 NEN-TT5; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval khong-phan-biet: không eval nào bị xác định là không-phân-biệt; tuy nhiên baseline KHÔNG đo được ở round này (mọi field baseline là n-a), nên không thể khẳng định «mọi eval feature đều red trên baseline». Chiều đỏ của AC-1 nằm ở lịch sử (commit ca đứng trước commit vật) và ở đối chứng/đột biến trong NEN-TT5.

## Variance

none — mọi eval là deterministic (runs: 1), không có pass_rate hỗn hợp.

## Iterations

Round 1: S4 lượt 1 — PASS 5/5 eval, 11/11 lệnh suite xanh; 1 lỗi đo trong hợp đồng (AC-5 đột biến (b) chỉ xét lượt vắng, chưa ghim bullet tên trần có mặt). Returned to implementation: thêm ghim bullet tên trần có mặt + đối chứng bản tiêm chết cho NEN-TT5.
Round 2: E1–E5 PASS sau nhát sửa S4-r1 (57 ca xanh, đủ 16 dòng PASS theo tên); 11/11 lệnh suite xanh; baseline không đo được (hạ tầng).
