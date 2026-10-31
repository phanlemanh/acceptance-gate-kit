---
schema_version: 2
feature_slug: chi-tep-vat-keo-xet-lai
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c6caff51ba2d06ea70721da8fe0d201ccc8fc39f
human_signoff:
---

# Evidence Report: chi-tep-vat-keo-xet-lai

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
  run_id: minted-chi-tep-vat-keo-xet-lai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e1
  verified_at: 2026-10-31T18:46:38Z
  output: |
    Results: 3 passed, 0 failed

- eval: E2
  run_id: minted-chi-tep-vat-keo-xet-lai-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e2
  verified_at: 2026-10-31T18:46:38Z
  output: |
    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-chi-tep-vat-keo-xet-lai-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e3
  verified_at: 2026-10-31T18:46:38Z
  output: |
    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-chi-tep-vat-keo-xet-lai-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e4
  verified_at: 2026-10-31T18:46:38Z
  output: |
    Results: 2 passed, 0 failed

- eval: E5
  run_id: minted-chi-tep-vat-keo-xet-lai-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e5
  verified_at: 2026-10-31T18:46:38Z
  output: |
    Results: 1 passed, 0 failed

- eval: E6
  run_id: minted-chi-tep-vat-keo-xet-lai-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tvx_e6
  verified_at: 2026-10-31T18:46:38Z
  output: |
    Results: 1 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 1
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-31T18:46:38Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T18:46:38Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-10-31T18:46:38Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-chi-tep-vat-keo-xet-lai-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-31T18:46:38Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều chưa có baseline so sánh được (n-a), không eval nào bị đánh dấu không-phân-biệt.

Baseline khong do

- bash -c 'out=$(node tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs TV1 TV1-do 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 3 passed, 0 failed" || exit 1; for c in chi-tep-chu ban-goc go-ve-chu; do printf "%s\n" "$out" | grep -qE "^PASS: TV1(-do|-doi-chung)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs co o cay dang kiem nhung chua co o merge-base a9f02e3a6b39ab8b6c6f698c212a8c9f273e99f3 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs TV2 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in tep-vat; do printf "%s\n" "$out" | grep -qE "^PASS: TV2(-do|-doi-chung)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs co o cay dang kiem nhung chua co o merge-base a9f02e3a6b39ab8b6c6f698c212a8c9f273e99f3 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs TV3 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in ho-so-tuoi; do printf "%s\n" "$out" | grep -qE "^PASS: TV3(-do|-doi-chung)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs co o cay dang kiem nhung chua co o merge-base a9f02e3a6b39ab8b6c6f698c212a8c9f273e99f3 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs TV4 TV4-doi-chung 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 2 passed, 0 failed" || exit 1; for c in paths-phu-chu paths-khong-phu; do printf "%s\n" "$out" | grep -qE "^PASS: TV4(-do|-doi-chung)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs co o cay dang kiem nhung chua co o merge-base a9f02e3a6b39ab8b6c6f698c212a8c9f273e99f3 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs TV5 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in hai-luat-giu; do printf "%s\n" "$out" | grep -qE "^PASS: TV5(-do|-doi-chung)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs co o cay dang kiem nhung chua co o merge-base a9f02e3a6b39ab8b6c6f698c212a8c9f273e99f3 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs TV6 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "Results: 1 passed, 0 failed" || exit 1; for c in lui-ve-vat; do printf "%s\n" "$out" | grep -qE "^PASS: TV6(-do|-doi-chung)? $c " || exit 1; done': bo qua baseline: tep tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs co o cay dang kiem nhung chua co o merge-base a9f02e3a6b39ab8b6c6f698c212a8c9f273e99f3 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lượt đều đồng nhất (không eval nào có runs > 1).

## Iterations

Round 1: sáu eval của vòng (E1–E6) đều xanh, nhưng verdict là REJECT vì năm lệnh suite hồi quy không gắn eval nào chạy ra mã khác 0: tests/scripts mjs:2/3 (1 ca đỏ), tests/plugins vung:1 (P122, P126), vung:2 (P161), vung:3 (RT13 — tệp lạ chi-tep-vat-keo-xet-lai.test.mjs chứa chữ «signed-off» chưa khai gạch), và product-map --check (PRODUCT-MAP.md và LO-TRINH.html lệch). Hai ca RT13 và product-map nhiều khả năng do chính vòng sinh ra. Trả về giai đoạn cài đặt.
