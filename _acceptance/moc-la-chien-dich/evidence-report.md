---
schema_version: 2
feature_slug: moc-la-chien-dich
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7acfe8fe9d4d7c235ba4a8e5b6d544c873c1aa1d
human_signoff:
---

# Evidence Report: moc-la-chien-dich

Round 1. Cả 13 eval của hợp đồng chạy xanh ở phía máy, nhưng verdict là REJECT vì hai lệnh suite không gắn eval nào báo đỏ (xem mục «Lệnh suite (hồi quy)» và «Iterations») và vì có hai finding trong hợp đồng về eval E7.

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
| E12 | AC-11 | script | PASS |
| E13 | AC-5 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-moc-la-chien-dich-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E2
  run_id: minted-moc-la-chien-dich-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E3
  run_id: minted-moc-la-chien-dich-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E4
  run_id: minted-moc-la-chien-dich-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E5
  run_id: minted-moc-la-chien-dich-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E6
  run_id: minted-moc-la-chien-dich-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E7
  run_id: minted-moc-la-chien-dich-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)
    Lưu ý: phần expected của E7 ghim dòng «PASS: MC-6 ma-thoat», còn bộ kiểm in «PASS: MC-7 ma-thoat» (xem Analyst và review-findings.md).

- eval: E8
  run_id: minted-moc-la-chien-dich-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E9
  run_id: minted-moc-la-chien-dich-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E10
  run_id: minted-moc-la-chien-dich-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich_crm
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich-crm.mjs
    Results: 3 passed, 0 failed (moc-chien-dich-crm)

- eval: E11
  run_id: minted-moc-la-chien-dich-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.moc_chien_dich
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node tests/scripts/moc-chien-dich.test.mjs
    Results: 27 passed, 0 failed (moc-chien-dich)

- eval: E12
  run_id: minted-moc-la-chien-dich-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-10-14T09:26:45Z
  output: |
    node scripts/product-map.mjs --root . --check
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E13
  run_id: minted-moc-la-chien-dich-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.moc_chien_dich_lt97
  verified_at: 2026-10-14T09:26:45Z
  output: |
    LT_CASES=LT-97,LT-97-do,LT-97-do2 node tests/scripts/lo-trinh.test.mjs
    Results: 3 passed, 0 failed (lo-trinh)

### Lệnh suite (hồi quy)

Hai lệnh dưới đây ĐỎ và không gắn eval nào; chúng là lý do chính của verdict REJECT. Các lệnh suite còn lại xanh.

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 1
  verified_at: 2026-10-14T09:26:45Z
  output: |
    FAIL: LTT-san — độ dài: trang mới 5373px, trang 2.21.0 11801px (tỉ lệ 0.455 > 1/3)
    FAIL: LTT-san-do — Error: bản lành chưa xanh — không tin được chiều đỏ
    FAIL: LTT-san-im — Error: bản lành chưa xanh
    Results: 6 passed, 3 failed (xem-trang-lo-trinh)
    FAIL: xem-trang-lo-trinh.test.mjs
    Results: 30 passed, 1 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-14T09:26:45Z
  output: |
    FAIL: [RT13] file lạ chứa "signed-off": tests/scripts/moc-chien-dich.test.mjs — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH
    FAIL: ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)
    FAIL: [RT18] bản CHÉP luật ngưỡng ngoài lib: tests/scripts/moc-chien-dich.test.mjs (tiêu đề section) — gọi lib/nguong-o-co-hoi.cjs, hoặc khai gạch có lý do
    FAIL: ca ra co ten — RT18 (ho so ra-co-ten-lam-va-trao)
    Results: 2 failed

Các lệnh suite xanh:

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-moc-la-chien-dich-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-moc-la-chien-dich-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-14T09:26:45Z
  output: |
    BỎ QUA: KB — không phải lượt cắt mốc (số 2.30.0 = gốc vòng)

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả cây đang kiểm lẫn baseline, nên chúng chứng minh bộ kiểm chứ không chứng minh tính năng mới; hoặc viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- E13 (`LT_CASES=LT-97,LT-97-do,LT-97-do2 node tests/scripts/lo-trinh.test.mjs`): baseline green.
- E12 (`node scripts/product-map.mjs --root . --check`): baseline green.

Baseline khong do:

- node tests/scripts/moc-chien-dich.test.mjs: bo qua baseline: tep tests/scripts/moc-chien-dich.test.mjs co o cay dang kiem nhung chua co o merge-base f4e717bf6b21a6d3769d0df7821cc7497c494890 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/moc-chien-dich-crm.mjs: bo qua baseline: tep tests/scripts/moc-chien-dich-crm.mjs co o cay dang kiem nhung chua co o merge-base f4e717bf6b21a6d3769d0df7821cc7497c494890 — eval moi, chay tren code cu khong phan biet gi

Lệnh đỏ không gắn eval nào (ghi rõ để người đọc không bỏ sót):

- `bash tests/scripts/run-tests.sh --manh mjs:2/3` đỏ ở tệp `xem-trang-lo-trinh.test.mjs`: ca LTT-san báo trang mới 5373px so với trang 2.21.0 11801px (tỉ lệ 0.455 vượt ngưỡng 1/3); LTT-san-do và LTT-san-im báo «bản lành chưa xanh». Lượt chấm này chưa xác định nguyên nhân và không có baseline cho lệnh suite; các finding của vòng không nêu tệp này.
- `bash tests/plugins/run-tests.sh --manh vung:3` đỏ ở hai lưới luật RT13 và RT18; cả hai gọi tên đúng tệp ca mới `tests/scripts/moc-chien-dich.test.mjs` (khớp finding t1 trong review-findings.md).

Ghi chú về phép đo của E1 đến E9 và E11: đầu ra ghi lại chỉ có dòng tổng «Results: 27 passed, 0 failed»; từng dòng «PASS: MC-…» mà `expected` ghim không nằm trong phần đuôi đầu ra đã lưu. Riêng E7: `expected` ghim «PASS: MC-6 ma-thoat» trong khi bộ kiểm in «PASS: MC-7 ma-thoat» (hai finding trong hợp đồng, AC-7; xem review-findings.md). Bảng ghi E7 là PASS theo kết quả máy (mã thoát 0); chỗ lệch ghim này cần sửa `evals.yaml` hoặc bộ kiểm trước khi tin E7 phủ vế mã thoát.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, deterministic, không có phương sai)

## Iterations

Round 1: không eval nào đỏ ở phía máy (E1–E13 xanh), nhưng verdict REJECT vì (a) hai lệnh suite không gắn eval là `bash tests/scripts/run-tests.sh --manh mjs:2/3` (xem-trang-lo-trinh: LTT-san, LTT-san-do, LTT-san-im) và `bash tests/plugins/run-tests.sh --manh vung:3` (RT13, RT18 trỏ vào tệp ca mới) đỏ, và (b) hai finding trong hợp đồng (AC-7) về eval E7 ghim dòng không tồn tại. Trả về cho khâu cài đặt.
