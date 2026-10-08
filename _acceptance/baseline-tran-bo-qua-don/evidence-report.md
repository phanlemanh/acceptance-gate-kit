---
schema_version: 2
feature_slug: baseline-tran-bo-qua-don
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 20fd50edaecff2346ffa370671390abbca11ca19
human_signoff: Phan Le Manh 2026-10-08 — ký lượt chấm 1; Ngoài-1, 2, 4, 6, 7 ghi Known limits; Ngoài-3, 5 mở hợp đồng mới (hạt giống); Ngoài-8 chấp nhận; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: baseline-tran-bo-qua-don

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-baseline-tran-bo-qua-don-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.btbd_hinh_dang_lenh
  verified_at: 2026-10-08T12:09:55Z
  output: |
    Results: 82 passed, 0 failed (baseline-tran-bo-qua-don)
    Các ca BH1 BH2 BH3 BH4 BH5 BH5b BH6 BH7 BH8 đều có dòng PASS (lệnh eval kiểm từng tên ca bằng grep).

- eval: E2
  run_id: minted-baseline-tran-bo-qua-don-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.btbd_tran_that
  verified_at: 2026-10-08T12:09:55Z
  output: |
    Results: 82 passed, 0 failed (baseline-tran-bo-qua-don)
    Các ca BZ0 BT1 BT2 BT3 BT4 BT5 BT6 BT7 BT8 đều có dòng PASS (lệnh eval kiểm từng tên ca bằng grep).

- eval: E3
  run_id: minted-baseline-tran-bo-qua-don-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.btbd_blocked_ha_tang
  verified_at: 2026-10-08T12:09:55Z
  output: |
    Results: 82 passed, 0 failed (baseline-tran-bo-qua-don)
    Các ca BB0 BB0b BB0c BB1 BB2 BB3 BB4 BB5 BB6 BB7 BB8 đều có dòng PASS (lệnh eval kiểm từng tên ca bằng grep).

- eval: E4
  run_id: minted-baseline-tran-bo-qua-don-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.btbd_bo_qua_tep_moi
  verified_at: 2026-10-08T12:09:55Z
  output: |
    Results: 82 passed, 0 failed (baseline-tran-bo-qua-don)
    Các ca BQ1 BQ2 BQ3 BQ4 BQ5 BQ6 BQ7 BQ8 đều có dòng PASS (lệnh eval kiểm từng tên ca bằng grep).

- eval: E5
  run_id: minted-baseline-tran-bo-qua-don-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.btbd_don_worktree
  verified_at: 2026-10-08T12:09:55Z
  output: |
    Results: 82 passed, 0 failed (baseline-tran-bo-qua-don)
    Các ca BD0 BD1 BD2 BD3 BD4 BD5 BD6 BD7 đều có dòng PASS (lệnh eval kiểm từng tên ca bằng grep).

- eval: E6
  run_id: minted-baseline-tran-bo-qua-don-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.btbd_dot_bien
  verified_at: 2026-10-08T12:09:55Z
  output: |
    Results: 82 passed, 0 failed (baseline-tran-bo-qua-don)
    Các ca BM1 BM2 BM3 BM4 BM5 BM6 BM7 BM8 đều có dòng PASS (lệnh eval kiểm từng tên ca bằng grep).

- eval: E7
  run_id: minted-baseline-tran-bo-qua-don-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-08T12:09:55Z
  output: |
    Results: all workflow tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-baseline-tran-bo-qua-don-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-baseline-tran-bo-qua-don-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-08T12:09:55Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

Baseline khong do:

- bash -c 'out=$(node tests/workflows/baseline-tran-bo-qua-don.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BH1 BH2 BH3 BH4 BH5 BH5b BH6 BH7 BH8; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/workflows/baseline-tran-bo-qua-don.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BZ0 BT1 BT2 BT3 BT4 BT5 BT6 BT7 BT8; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/workflows/baseline-tran-bo-qua-don.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BB0 BB0b BB0c BB1 BB2 BB3 BB4 BB5 BB6 BB7 BB8; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/workflows/baseline-tran-bo-qua-don.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BQ1 BQ2 BQ3 BQ4 BQ5 BQ6 BQ7 BQ8; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/workflows/baseline-tran-bo-qua-don.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BD0 BD1 BD2 BD3 BD4 BD5 BD6 BD7; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'out=$(node tests/workflows/baseline-tran-bo-qua-don.test.mjs 2>&1); rc=$?; printf "%s\n" "$out" | tail -n 25; [ $rc -eq 0 ] && for c in BM1 BM2 BM3 BM4 BM5 BM6 BM7 BM8; do printf "%s\n" "$out" | grep -qF "PASS: $c " || exit 1; done': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash tests/workflows/run-tests.sh: BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

none — moi eval feature deu red tren baseline (co phan biet)

Lưu ý: ở round này baseline bị BLOCKED hạ tầng nên KHÔNG eval nào được đo trên diffBase (mọi field baseline là n-a). Câu «none» ở trên chỉ là dạng mặc định của danh sách rỗng, không có nghĩa các eval đã được đo ở chiều đỏ; danh sách eval không-phân-biệt không đo được ở round này.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3, E4, E5, E6, E7 đều qua ở lần chạy đầu; không eval nào thất bại. Baseline BLOCKED hạ tầng (xem Analyst).
