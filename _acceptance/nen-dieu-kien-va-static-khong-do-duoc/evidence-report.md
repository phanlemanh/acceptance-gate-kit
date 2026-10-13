---
schema_version: 2
feature_slug: nen-dieu-kien-va-static-khong-do-duoc
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5a843da1800b9cab8bd4052a1a851aef4a808f3c
human_signoff: manh 2026-10-13
---

# Evidence Report: nen-dieu-kien-va-static-khong-do-duoc

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
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_nen_dieu_kien
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 38 passed, 0 failed (duong-nen)
    (lệnh chỉ thoát 0 khi có đủ các dòng PASS: NEN0, NEN6, NEN7, NEN-DK1, NEN-DK3, NEN-DK4, NEN-DK5, NEN-DK6 và đúng hai dòng PASS: NEN-DK2)

- eval: E2
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_nen_dieu_kien
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 38 passed, 0 failed (duong-nen)
    (lệnh chỉ thoát 0 khi có đúng hai dòng PASS: NEN-DK2 — một cho tin_hieu, một cho lo_trinh)

- eval: E3
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_nen_dieu_kien
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 38 passed, 0 failed (duong-nen)
    (lệnh chỉ thoát 0 khi có dòng PASS: NEN-DK3 và PASS: NEN6)

- eval: E4
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_nen_dieu_kien
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 38 passed, 0 failed (duong-nen)
    (lệnh chỉ thoát 0 khi có dòng PASS: NEN-DK4)

- eval: E5
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_nen_dieu_kien
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 38 passed, 0 failed (duong-nen)
    (lệnh chỉ thoát 0 khi có dòng PASS: NEN-DK5)

- eval: E9
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_nen_dieu_kien
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 38 passed, 0 failed (duong-nen)
    (lệnh chỉ thoát 0 khi có dòng PASS: NEN-DK6 và PASS: NEN7)

- eval: E6
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_static_khong_do
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 3 passed, 0 failed (design-gate-khong-do-duoc)
    (lệnh chỉ thoát 0 khi có dòng PASS: DG-KDD1)

- eval: E7
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_static_khong_do
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 3 passed, 0 failed (design-gate-khong-do-duoc)
    (lệnh chỉ thoát 0 khi có dòng PASS: DG-KDD2)

- eval: E8
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_static_khong_do
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 3 passed, 0 failed (design-gate-khong-do-duoc)
    (lệnh chỉ thoát 0 khi có dòng PASS: DG-KDD3)

- eval: E10
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_doc_khoi_chep
  verified_at: 2026-10-13T02:29:38Z
  output: |
    Results: 16 passed, 0 failed
    (lệnh chỉ thoát 0 khi có dòng PASS: CE1 và PASS: CE2g)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nen-dieu-kien-va-static-khong-do-duoc-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-13T02:29:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

Mọi field baseline của round này là n-a; danh sách eval không-phân-biệt (xanh cả trên bản cũ lẫn bản mới) KHÔNG đo được ở round này, nên không có căn cứ để khẳng định eval nào «red trên baseline».

Eval không-phân-biệt đã biết: none — chưa có eval nào được đo là xanh trên cả hai phía (baseline không chạy hết).

Baseline khong do:
- bash -c 'out=$(node tests/scripts/duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEN0 NEN6 NEN7 NEN-DK1 NEN-DK3 NEN-DK4 NEN-DK5 NEN-DK6; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done && [ "$(printf "%s\n" "$out" | grep -cF "PASS: NEN-DK2 ")" -eq 2 ]': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/scripts/design-gate-khong-do-duoc.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in DG-KDD1 DG-KDD2 DG-KDD3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/scripts/consumer-esm.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in CE1 CE2g; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

## Variance

none — mọi eval chạy một lần, xác định (runs: 1), không có eval ngẫu nhiên.

## Iterations

Round 1: E1–E10 đều xanh, 11 lệnh suite xanh; baseline BLOCKED hạ tầng nên không đo được chiều đỏ trên bản cũ. Verdict PASS.

### Re-pin lần 1 — 2026-10-13, do gộp origin/main e76684fd (lô 2 MacBook Pro) trước khi gộp PR #338
run_id: repin-20261013T075214Z-80361
sha: 5a843da1800b9cab8bd4052a1a851aef4a808f3c · suites: 11 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng
