---
schema_version: 2
feature_slug: nen-cong-cu-gan-mo-thay-the
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: eaa07c0c0fea1cf3467e9633387577e96397d7d4
human_signoff:
---

# Evidence Report: nen-cong-cu-gan-mo-thay-the

⚠ REJECT — toàn bộ 8 eval trong hợp đồng (E1–E8, AC-1…AC-7) đều PASS, nhưng 2 lệnh
suite hồi quy không gắn eval nào thất bại (exit 1): `bash tests/plugins/run-tests.sh
--manh vung:1` (P122, P126 đỏ) và `node scripts/product-map.mjs --root . --check`
(PRODUCT-MAP.md lệch với hồ sơ xưởng). Hai lệnh này nằm ngoài phạm vi eval của vòng
`nen-cong-cu-gan-mo-thay-the` — `failed_evals` vì vậy đúng nghĩa rỗng — nhưng theo quy
tắc "mọi lệnh phải xanh mới PASS", verdict tổng vẫn là REJECT. Quay lại implementation
để sửa 2 lỗi hạ tầng này trước khi verify lại; không sửa gì ở phần vật của
`nen-cong-cu-gan-mo-thay-the` (E1–E8 đã xanh, xem `## Evidence`).

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
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E2
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E3
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E4
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E5
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E6
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.ncc_hoi_quy_nen
  verified_at: 2026-09-24T09:44:06Z
  output: |
    Results: 25 passed, 0 failed (duong-nen)
    PASS: HQ1 du 13 ca cu va 6 ca moi co mat bang TEN
    PASS: HQ2 so dong PASS NEN dung bang 19

- eval: E7
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

- eval: E8
  run_id: minted-nen-cong-cu-gan-mo-thay-the-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ngm_gan_mo
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: GM6 dot bien «co mat $(» — GM4 mat den (bi bo tra), ca hai nhanh GM5 do

    Results: 25 passed, 0 failed (duong-nen)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 837 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: co it nhat mot *.test.mjs duoc chay

    Results: 20 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: co it nhat mot *.test.mjs duoc chay

    Results: 19 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    vong-meta-dang-mo: 5 passed, 0 failed
    PASS: vong-meta-dang-mo.test.mjs
    PASS: co it nhat mot *.test.mjs duoc chay

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PASS: V16

    Results: 70 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-09-24T09:44:06Z
  output: |
    FAIL: P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)
    FAIL: P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)
    Results: 2 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: acceptance-verify.test.mjs + triage-do-tin.test.mjs + vung-vat-mutants.test.mjs
  exit_code: 0
  verified_at: 2026-09-24T09:44:06Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nen-cong-cu-gan-mo-thay-the-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-09-24T09:44:06Z
  output: |
    PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .

## Known limits

## Ngoài hợp đồng

## Analyst

E6 — baseline green (regression-guard cố ý). Eval E6 (`rang-hoi-quy.sh`, ca HQ1/HQ2)
kiểm tra 13 ca đỏ cũ của hồ sơ `nen-cong-cu-lenh-shell` cộng 6 ca TD vẫn còn mặt bằng
tên và số dòng PASS NEN giữ nguyên 19 — nó pass trên cả HEAD lẫn diffBase vì đúng thiết
kế là răng chống thụt lùi (regression guard) cho hồ sơ trước, không phải test hành vi
mới của vòng `nen-cong-cu-gan-mo-thay-the`. Không cần viết lại.

## Variance

none — không có eval nào mang field `runs` > 1 (mọi eval E1–E8 là deterministic).

## Iterations

Round 1: E1–E8 (AC-1…AC-7) đều PASS trên vật của `nen-cong-cu-gan-mo-thay-the`, nhưng
2 lệnh suite hồi quy ngoài phạm vi eval của vòng này đỏ — `tests/plugins/run-tests.sh
--manh vung:1` (P122, P126) và `node scripts/product-map.mjs --root . --check`
(PRODUCT-MAP.md lệch với hồ sơ xưởng). Verdict REJECT; quay lại implementation để sửa 2
lỗi hạ tầng đó trước khi verify lại.
