---
schema_version: 2
feature_slug: ui-check-chay-sau-suite
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d5e4db3aafa4f9dc8303c2d8c515233da4766713
human_signoff:
---

# Evidence Report: ui-check-chay-sau-suite

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-ui-check-chay-sau-suite-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.usc_ben_viet
  verified_at: 2026-10-19T15:27:00Z
  output: |
    Results: 5 passed, 0 failed (s4-args-ui-check-chay-sau-suite)
    Các ca UW1, UW2, UW3 đều có dòng PASS riêng.

- eval: E2
  run_id: minted-ui-check-chay-sau-suite-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.usc_sau_suite
  verified_at: 2026-10-19T15:27:00Z
  output: |
    Results: 10 passed, 0 failed (ui-check-chay-sau-suite)
    Các ca UC1, UC2 đều có dòng PASS riêng.

- eval: E3
  run_id: minted-ui-check-chay-sau-suite-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.usc_khong_chong
  verified_at: 2026-10-19T15:27:00Z
  output: |
    Results: 10 passed, 0 failed (ui-check-chay-sau-suite)
    Các ca UC3, UC4 đều có dòng PASS riêng.

- eval: E4
  run_id: minted-ui-check-chay-sau-suite-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.usc_ket_qua
  verified_at: 2026-10-19T15:27:00Z
  output: |
    Results: 10 passed, 0 failed (ui-check-chay-sau-suite)
    Các ca UC5, UC6 đều có dòng PASS riêng.

- eval: E5
  run_id: minted-ui-check-chay-sau-suite-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.usc_dry_run
  verified_at: 2026-10-19T15:27:00Z
  output: |
    Results: 10 passed, 0 failed (ui-check-chay-sau-suite)
    Ca UC7 có dòng PASS riêng.

- eval: E6
  run_id: minted-ui-check-chay-sau-suite-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.usc_vi_phan
  verified_at: 2026-10-19T15:27:00Z
  output: |
    Results: 10 passed, 0 failed (ui-check-chay-sau-suite)
    Các ca UC8, UC9, UC10 đều có dòng PASS riêng.

- eval: E7
  run_id: minted-ui-check-chay-sau-suite-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.usc_round_trip
  verified_at: 2026-10-19T15:27:00Z
  output: |
    Results: 5 passed, 0 failed (s4-args-ui-check-chay-sau-suite)
    Các ca UW4, UW5 đều có dòng PASS riêng.

### Judgment

Panel đề xuất cho E8 (T2): domain-correctness, operational-feasibility, spec-alignment. Cả ba cùng đọc CHANGELOG, GUIDE và eval-executors.md. `human_override` để trống vì hợp đồng là T2 và không có phiếu nào chưa chốt.

- domain-correctness: PASS — CHANGELOG «Chưa phát hành» có mục riêng cho `ui-check-chay-sau-suite` với đủ ba ý: đổi gì, kho nào bị ảnh hưởng, làm gì khi nhận. Hàng `model_evals` trong GUIDE và đoạn «run alone» của eval-executors.md đều nói ui-check thuộc diện chạy riêng; judgment ngoài diện. Đoạn «run alone» liệt kê tường minh từng nhóm lệnh trước ui-check. Câu mở đầu hàng GUIDE có cụm «sau mọi lệnh máy khác (eval song song và chuỗi suite)», nhưng ngay sau đó được làm rõ riêng cho ui-check.
- operational-feasibility: PASS — mục CHANGELOG có đủ ba gạch «Đổi gì», «Kho nào bị ảnh hưởng» (chỉ kho khai ui-check; kho chỉ khai test/script không đổi) và «Làm gì khi nhận» (không phải migrate; muốn chạy riêng thì liệt vào `model_evals`). Đoạn «run alone» không có câu nào ngụ ý «mọi lệnh máy khác» chỉ gồm eval song song và chuỗi suite khi nói về ui-check.
- spec-alignment: PASS — mục CHANGELOG có đủ ba điều. Dòng `model_evals` ở bảng GUIDE (dòng 1580) và đoạn «run alone» của eval-executors.md (dòng 132-141) đều nói ui-check chạy riêng, sau ui-check song song và sau lệnh chạy riêng; judgment ngoài diện. Câu về ui-check trong đoạn «run alone» liệt kê đủ cả test/script chạy riêng lẫn ui-check không khai.

- eval: E8
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba thấu kính cùng PASS. CHANGELOG, GUIDE và eval-executors.md nhất quán về việc ui-check khai trong model_evals chạy sau mọi lệnh máy, tuần tự, và không còn câu nào ngụ ý tập «mọi lệnh máy khác» chỉ gồm eval song song và chuỗi suite.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ui-check-chay-sau-suite-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ui-check-chay-sau-suite-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-ui-check-chay-sau-suite-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-19T15:27:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không có eval nào xanh trên cả HEAD lẫn baseline; bảy eval feature đều có baseline n-a (eval mới, chưa có ở merge-base) nên chưa chứng minh được chiều đỏ trên code cũ bằng A/B. Chiều đỏ nằm trong chính các ca UW3, UW5, UC2, UC4, UC6, UC10 (bản sao đã tiêm lỗi).

### Baseline khong do

- bash -c 'out=$(node tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in UW1 UW2 UW3; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs co o cay dang kiem nhung chua co o merge-base 399fa89e6daf144e9af896a0bc78b20fb1143d56 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/ui-check-chay-sau-suite.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in UC1 UC2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/ui-check-chay-sau-suite.test.mjs co o cay dang kiem nhung chua co o merge-base 399fa89e6daf144e9af896a0bc78b20fb1143d56 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/ui-check-chay-sau-suite.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in UC3 UC4; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/ui-check-chay-sau-suite.test.mjs co o cay dang kiem nhung chua co o merge-base 399fa89e6daf144e9af896a0bc78b20fb1143d56 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/ui-check-chay-sau-suite.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in UC5 UC6; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/ui-check-chay-sau-suite.test.mjs co o cay dang kiem nhung chua co o merge-base 399fa89e6daf144e9af896a0bc78b20fb1143d56 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/ui-check-chay-sau-suite.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in UC7; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/ui-check-chay-sau-suite.test.mjs co o cay dang kiem nhung chua co o merge-base 399fa89e6daf144e9af896a0bc78b20fb1143d56 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/workflows/ui-check-chay-sau-suite.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in UC8 UC9 UC10; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/workflows/ui-check-chay-sau-suite.test.mjs co o cay dang kiem nhung chua co o merge-base 399fa89e6daf144e9af896a0bc78b20fb1143d56 — eval moi, chay tren code cu khong phan biet gi
- bash -c 'out=$(node tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in UW4 UW5; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': bo qua baseline: tep tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs co o cay dang kiem nhung chua co o merge-base 399fa89e6daf144e9af896a0bc78b20fb1143d56 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E8 đều đạt; không eval nào thất bại. Verdict PASS.
