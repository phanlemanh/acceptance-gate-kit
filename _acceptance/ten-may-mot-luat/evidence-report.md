---
schema_version: 2
feature_slug: ten-may-mot-luat
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 598ed81cc30cdb92452401761337d5f12ef6c83c
human_signoff:
---

# Evidence Report: ten-may-mot-luat

Cả sáu eval của hợp đồng (E1–E6) đều xanh. Verdict vẫn là REJECT vì bốn lệnh suite không gắn eval nào chạy đỏ ở round 2. Chúng được liệt kê dưới «Lệnh fail không gắn eval». Cổng không cho một PASS sạch khi suite hồi quy còn đỏ.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ten-may-mot-luat-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e1
  verified_at: 2026-10-31T20:25:33Z
  output: |
    # fail 0

    __EXIT=0

- eval: E2
  run_id: minted-ten-may-mot-luat-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e2
  verified_at: 2026-10-31T20:25:33Z
  output: |
    # fail 0

    __EXIT=0

- eval: E3
  run_id: minted-ten-may-mot-luat-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e3
  verified_at: 2026-10-31T20:25:33Z
  output: |
    # fail 0

    __EXIT=0

- eval: E4
  run_id: minted-ten-may-mot-luat-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e4
  verified_at: 2026-10-31T20:25:33Z
  output: |
    # fail 0

    __EXIT=0

- eval: E5
  run_id: minted-ten-may-mot-luat-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e5
  verified_at: 2026-10-31T20:25:33Z
  output: |
    # fail 0

    __EXIT=0

- eval: E6
  run_id: minted-ten-may-mot-luat-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tmml_e6
  verified_at: 2026-10-31T20:25:33Z
  output: |
    # fail 0

    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-31T20:25:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 1
  verified_at: 2026-10-31T20:25:33Z
  output: |
    Results: 39 passed, 1 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-31T20:25:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-31T20:25:33Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-31T20:25:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 1
  verified_at: 2026-10-31T20:25:33Z
  output: |
    FAIL: P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)
    FAIL: P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-31T20:25:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-10-31T20:25:33Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ten-may-mot-luat-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-31T20:25:33Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ten-may-mot-luat-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 1
  verified_at: 2026-10-31T20:25:33Z
  output: |
    PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .
    LO-TRINH.html lệch với tệp ý định và hồ sơ — chạy: node scripts/product-map.mjs --root .

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ten-may-mot-luat-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-31T20:25:33Z
  output: |
    BỎ QUA: KB — không phải lượt cắt mốc (số 2.36.0 = gốc vòng)

### Lệnh fail không gắn eval

Bốn lệnh sau chạy đỏ và không gắn eval nào. Đây là lý do của verdict REJECT.

- bash tests/scripts/run-tests.sh --manh mjs:1/3: 39 pass, 1 fail.
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': đỏ ở P122 và P126.
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': đỏ ở P179.
- node scripts/product-map.mjs --root . --check: PRODUCT-MAP.md và LO-TRINH.html lệch với hồ sơ.

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Lưu ý trung thực: cả sáu eval đều có baseline là n-a, nên «red trên baseline» chưa được đo. Lý do nằm ở mục dưới.

Baseline khong do:
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-1" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 2" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-1 khu-hoi" "TM-1-do noi-luat"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-2" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 1" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-2 viet-hop-le"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-3" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 2" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-3 viet-sai" "TM-3-do khong-kiem"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-4" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 4" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-4 vai" "TM-4 mot-nguon" "TM-4-do vai-rieng" "TM-4-do viet-rieng"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap --test-name-pattern="^TM-5" tests/dieu-phoi/ten-may-mot-luat.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^(not )?ok [0-9]+ - |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; printf "%s\n" "$out" | grep -qxF "# pass 1" || exit 1; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1; for c in "TM-5 dot-khong-doi"; do printf "%s\n" "$out" | grep -qE "^ok [0-9]+ - $c\$" || exit 1; done': bo qua baseline: tep tests/dieu-phoi/ten-may-mot-luat.test.mjs co o cay dang kiem nhung chua co o merge-base 225784d1df5accb5e919c5e0afefea5fb31169e7 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node --test --test-reporter=tap tests/dieu-phoi/tin.test.mjs tests/dieu-phoi/tin-khong-mat-dau.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | grep -E "^not ok |^# (pass|fail) "; [ $rc -eq 0 ] || exit 1; n=$(printf "%s\n" "$out" | sed -n "s/^# pass //p"); [ "${n:-0}" -ge 69 ] || exit 1; case "$out" in *"not ok "*) exit 1;; esac; printf "%s\n" "$out" | grep -qxF "# fail 0" || exit 1': baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

Judge panels: không có panel nào được đề xuất cho round này — hợp đồng không khai eval dạng judgment, nên không có mục nào để người đặt human_override.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — E6 đỏ vì hàng tốc độ GT-07 có sẵn trên nhánh chính; TM-3-do được thêm đối chứng dương cho vế kênh không đổi. Trả về cho bước làm.
Round 2: REJECT — E1–E6 xanh trên nền main 225784d1 (chạy lại trọn, không mang kết quả cũ sang). Bốn lệnh suite không gắn eval chạy đỏ: mjs:1/3, plugins vung:1 (P122, P126), plugins vung:3 (P179), product-map --check.
