---
schema_version: 2
feature_slug: ten-may-mot-luat
verdict: REJECT
failed_evals: ["E6"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f645cd32be3a071044cc1f30104d9de5afef0fc2
human_signoff:
---

# Evidence Report: ten-may-mot-luat

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-5 | script | FAIL |

## Evidence

- eval: E1
  run_id: minted-ten-may-mot-luat-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e1
  verified_at: 2026-10-31T15:49:31Z
  output: |
    # fail 0

- eval: E2
  run_id: minted-ten-may-mot-luat-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e2
  verified_at: 2026-10-31T15:49:31Z
  output: |
    # fail 0

- eval: E3
  run_id: minted-ten-may-mot-luat-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e3
  verified_at: 2026-10-31T15:49:31Z
  output: |
    # fail 0

- eval: E4
  run_id: minted-ten-may-mot-luat-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e4
  verified_at: 2026-10-31T15:49:31Z
  output: |
    # fail 0

- eval: E5
  run_id: minted-ten-may-mot-luat-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e5
  verified_at: 2026-10-31T15:49:31Z
  output: |
    # fail 0

- eval: E6
  run_id: minted-ten-may-mot-luat-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.tmml_e6
  verified_at: 2026-10-31T15:49:31Z
  output: |
    not ok 52 - GT-07 tin-tu-den
    # pass 68
    # fail 1

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ten-may-mot-luat-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ten-may-mot-luat-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-31T15:49:31Z

## Known limits

## Ngoài hợp đồng

## Analyst

Lệnh fail gắn eval E6 (không có lệnh fail nào ngoài eval): chạy trọn hai tệp tests/dieu-phoi/tin.test.mjs và tests/dieu-phoi/tin-khong-mat-dau.test.mjs cho 68 ca qua, 1 ca hỏng là «GT-07 tin-tu-den» (ca thứ 52). Vế «số ca ≥ 69» và «không dòng not ok» của E6 đều không đạt. Lệnh này là phép bảo vệ hồi quy của AC-5 (mọi ca GT- của lệnh tin giữ nguyên kết cục), nên REJECT.

Eval không phân biệt (xanh cả hai phía): none — không eval nào đo được trên baseline (xem mục dưới), nên không có căn cứ kết luận «không phân biệt».

### Baseline khong do

- baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu (áp cho E6)
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-1" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 2" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-1 khu-hoi" "TM-1-do noi-luat"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-2" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 1" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-2 viet-hop-le"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-3" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 2" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-3 viet-sai" "TM-3-do khong-kiem"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-4" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 4" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-4 vai" "TM-4 mot-nguon" "TM-4-do vai-rieng" "TM-4-do viet-rieng"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-5" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 1" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-5 dot-khong-doi"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 115100b6bd7b39b148678f2bf6458b3d094b3772 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap tests/dieu-phoi/tin.test.mjs tests/dieu-phoi/tin-khong-mat-dau.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^not ok |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; n=$(printf "%s\n" "$out" | sed -n "s/^# pass //p"); [ "${n:-0}" -ge 69 ] || exit 1; case "$out" in *"not ok "*) exit 1;; esac; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — mọi eval chạy một lần, xác định (runs: 1), không eval nào có pass_rate lẫn lộn.

## Iterations

Round 1: E6 hỏng — ca «GT-07 tin-tu-den» (ca 52) đỏ khi chạy trọn tin.test.mjs và tin-khong-mat-dau.test.mjs (68 qua, 1 hỏng, cần ≥ 69 và 0 hỏng). Trả về bước hiện thực.
