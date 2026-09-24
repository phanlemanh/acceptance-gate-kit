---
schema_version: 2
feature_slug: nen-cong-cu-gan-mo-thay-the
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c3bc9664edba267dde651ccb7c7839eeb10d7ce9
human_signoff:
---

# Evidence Report: nen-cong-cu-gan-mo-thay-the

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T10:20:33Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E2
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E2-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T10:20:33Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E3
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T10:20:33Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E4
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E4-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T10:20:33Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E5
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T10:20:33Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E6
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.ncc_hoi_quy_nen
  verified_at: 2026-09-24T10:20:33Z
  output: |
    Results: 25 passed, 0 failed (duong-nen)
    PASS: HQ1 du 13 ca cu va 6 ca moi co mat bang TEN
    PASS: HQ2 so dong PASS NEN dung bang 19

- eval: E7
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E7-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T10:20:33Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E8
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T10:20:33Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: repin-20260924T102633Z-41074
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-24T10:20:33Z

## Known limits

## Ngoài hợp đồng

## Analyst

E6 — cmd `bash _acceptance/nen-cong-cu-lenh-shell/rang-hoi-quy.sh` — baseline: green (pass trên cả HEAD lẫn diffBase). Đây là hồi quy giữ răng của hồ sơ `nen-cong-cu-lenh-shell` đã ký trước đó (HQ1/HQ2), không phải phép đo phân biệt cho tính năng vòng này — cố ý giữ nguyên như một regression-guard, không cần viết lại.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 trong vòng này).

## Iterations

Round 1: assertion âm-tính-một-mình ở GM3, GM6 và TD5 — chỉ kết luận từ điều VẮNG mặt (ví dụ "0 bullet") mà không đòi bản chép có ra `tep` và `cong_cu` XANH trước khi tiêm lỗi, nên bản chép hỏng cũng qua được. Sửa theo lớp: thêm đối chứng dương trên CÙNG bản chép (chạy chuỗi trước khi tiêm, đòi `fm(r.tep,'cong_cu') === 'xanh'`) cho GM3/GM6/TD5. Returned to implementation (commit `c3bc9664`).
Round 2: toàn bộ 8 eval (E1–E8, gồm cả E6 hồi quy) PASS trên bản vá theo lớp ở Round 1; suite hồi quy 837+19+19+19+70+3 khối plugin + workflows + product-map đều xanh. Một khoảng hở cùng lớp còn sót ở TD6 (không nằm trong AC nào của vòng này) được chuyển thành finding ngoài hợp đồng — xem review-findings.md.