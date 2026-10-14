---
schema_version: 2
feature_slug: nen-khong-tinh-tep-cua-vong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6aebf93355eb0c75eb648e23f89786b9d82e7ffd
human_signoff:
---

# Evidence Report: nen-khong-tinh-tep-cua-vong

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
| E10 | AC-10 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nen-khong-tinh-tep-cua-vong-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN0, NEN-TV1 (cùng lệnh phủ E1, E2, E3, E4, E5, E6, E8, E10).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E2
  run_id: minted-nen-khong-tinh-tep-cua-vong-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN-TV2 (cùng lệnh phủ E1, E2, E3, E4, E5, E6, E8, E10).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E3
  run_id: minted-nen-khong-tinh-tep-cua-vong-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp: đúng hai dòng PASS: NEN-TV3 (thư mục mới · thư mục có sẵn ở HEAD).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E4
  run_id: minted-nen-khong-tinh-tep-cua-vong-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN-TV4 (cùng lệnh phủ E1, E2, E3, E4, E5, E6, E8, E10).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E5
  run_id: minted-nen-khong-tinh-tep-cua-vong-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp: đúng năm dòng PASS: NEN-TV5 (các ca a đến e).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E6
  run_id: minted-nen-khong-tinh-tep-cua-vong-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN-TV7 (cùng lệnh phủ E1, E2, E3, E4, E5, E6, E8, E10).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E7
  run_id: minted-nen-khong-tinh-tep-cua-vong-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_the_nen
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: GN-TV1, GN-TV2 (gate-card-duong-nen) và GN-TV3 (ntr-the-canh-gay).
    Results: 1 passed, 0 failed (ntr-the-canh-gay)

- eval: E8
  run_id: minted-nen-khong-tinh-tep-cua-vong-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN-TV6 (cùng lệnh phủ E1, E2, E3, E4, E5, E6, E8, E10).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E9
  run_id: minted-nen-khong-tinh-tep-cua-vong-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncb_cay_ban
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN0 · NEN1…NEN9 · NEN-TD1…NEN-TD6 · NEN-CB1…NEN-CB5 (khoá có từ trước vòng).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E10
  run_id: minted-nen-khong-tinh-tep-cua-vong-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ntv_tep_cua_vong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN-TV8 (cùng lệnh phủ E1, E2, E3, E4, E5, E6, E8, E10).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E11
  run_id: minted-nen-khong-tinh-tep-cua-vong-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nme_moi_truong
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN-LC1…NEN-LC3 · NEN-ENV1…NEN-ENV4 (khoá có từ trước vòng).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E12
  run_id: minted-nen-khong-tinh-tep-cua-vong-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ndk_nen_dieu_kien
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: NEN-DK1, NEN-DK3…NEN-DK6 và đúng hai dòng NEN-DK2 (khoá có từ trước vòng).
    Results: 52 passed, 0 failed (duong-nen)

- eval: E13
  run_id: minted-nen-khong-tinh-tep-cua-vong-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tcc_the_nen
  verified_at: 2026-10-14T09:55:29Z
  output: |
    Ca đã khớp dòng PASS: GN1…GN5 (khoá có từ trước vòng).
    Results: 7 passed, 0 failed (gate-card-duong-nen)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-nen-khong-tinh-tep-cua-vong-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-14T09:55:29Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

Eval không-phân-biệt: none — danh sách rỗng. Lưu ý trung thực: baseline KHÔNG đo được ở round này (mọi eval máy ghi baseline n-a), nên chưa có bằng chứng «đỏ trên bản gốc» cho tính phân biệt của các eval; chiều đỏ của vật nằm ở các ca đột biến trong chính bộ đo (NEN-TV6) và đối chứng dương từng ca. Không có eval judgment nào trong round này, nên không có mục cho hội đồng chấm.

Baseline khong do:
- bash -c 'out=$(node tests/scripts/duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEN0 NEN-TV1 NEN-TV2 NEN-TV4 NEN-TV6 NEN-TV7 NEN-TV8; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done && [ "$(printf "%s\n" "$out" | grep -cF "PASS: NEN-TV3 ")" -eq 2 ] && [ "$(printf "%s\n" "$out" | grep -cF "PASS: NEN-TV5 ")" -eq 5 ]': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/scripts/gate-card-duong-nen.test.mjs 2>&1); rc=$?; out2=$(NTR_CASES=GN-TV3 node tests/scripts/ntr-the-canh-gay.test.mjs 2>&1); rc2=$?; printf "%s\n%s\n" "$out" "$out2" | tail -n 25; [ $rc -eq 0 ] && [ $rc2 -eq 0 ] && for c in GN-TV1 GN-TV2; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done && printf "%s\n" "$out2" | grep -qF "PASS: GN-TV3 "': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/scripts/duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEN0 NEN1 NEN2 NEN3 NEN4 NEN4b NEN5 NEN5-IM NEN6 NEN6-IM NEN7 NEN8 NEN9 NEN-TD1 NEN-TD2 NEN-TD3 NEN-TD4 NEN-TD5 NEN-TD6 NEN-CB1 NEN-CB2 NEN-CB3 NEN-CB4 NEN-CB5; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/scripts/duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEN0 NEN1 NEN2 NEN3 NEN4 NEN4b NEN-TD1 NEN-TD2 NEN-TD3 NEN-TD4 NEN-TD5 NEN-TD6 NEN-LC1 NEN-LC2 NEN-LC3 NEN-ENV1 NEN-ENV2 NEN-ENV3 NEN-ENV4; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/scripts/duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in NEN0 NEN6 NEN7 NEN-DK1 NEN-DK3 NEN-DK4 NEN-DK5 NEN-DK6; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done && [ "$(printf "%s\n" "$out" | grep -cF "PASS: NEN-DK2 ")" -eq 2 ]': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/scripts/gate-card-duong-nen.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in GN1 GN2 GN3 GN4 GN5; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định; không eval nào có runs lớn hơn 1).

## Iterations

Round 1: E1 đến E13 đều qua, suite hồi quy xanh; không eval nào hỏng. Verdict PASS.
