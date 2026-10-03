---
schema_version: 2
feature_slug: loi-moi-tran-luot-loi-song-co-gia
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5c6f2f482432b385cd4140557b251f90d668a8ec
human_signoff: Phan Le Manh 2026-10-03
---

# Evidence Report: loi-moi-tran-luot-loi-song-co-gia

Round 2: cả chín eval máy (E1–E9) xanh và đều red trên baseline; vế còn thiếu của AC-1 mà round 1 nêu (hàng 6b, «id ngoài evals.yaml không vào lặp») nay đã có hàng đo riêng và một đột biến chỉ gỡ đúng vế đó. Không còn phát hiện trong hợp đồng; ba phát hiện mức thấp còn lại nằm ngoài hợp đồng và được xếp ở review-findings.md cho người quyết.

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

## Evidence

- eval: E1
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_khoi
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC1-lap,LT-AC1-tuan-tu,LT-AC1-blocked,LT-AC2-tran,LT-AC4-khuyen-nghi,LT-AC7-mot-nguon,LT-dot-bien-tat-khoi,LT-dot-bien-bo-expected-exit,LT-dot-bien-bo-loc-id,LT-dot-bien-bo-loc-ngoai-evals node tests/scripts/lmtl-the.test.mjs'
    Results: 10 passed, 0 failed (lmtl-the)

- eval: E2
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E2-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_khoi
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC1-lap,LT-AC1-tuan-tu,LT-AC1-blocked,LT-AC2-tran,LT-AC4-khuyen-nghi,LT-AC7-mot-nguon,LT-dot-bien-tat-khoi,LT-dot-bien-bo-expected-exit,LT-dot-bien-bo-loc-id,LT-dot-bien-bo-loc-ngoai-evals node tests/scripts/lmtl-the.test.mjs'
    Results: 10 passed, 0 failed (lmtl-the)

- eval: E3
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_bien
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC3-khong-ky,LT-AC6-im,LT-AC9-so-hong,LT-dot-bien-them-loi-ky,LT-dot-bien-lap-moi-luot,LT-dot-bien-nuot-evals-hong node tests/scripts/lmtl-the.test.mjs'
    Results: 6 passed, 0 failed (lmtl-the)

- eval: E4
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E4-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_khoi
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC1-lap,LT-AC1-tuan-tu,LT-AC1-blocked,LT-AC2-tran,LT-AC4-khuyen-nghi,LT-AC7-mot-nguon,LT-dot-bien-tat-khoi,LT-dot-bien-bo-expected-exit,LT-dot-bien-bo-loc-id,LT-dot-bien-bo-loc-ngoai-evals node tests/scripts/lmtl-the.test.mjs'
    Results: 10 passed, 0 failed (lmtl-the)

- eval: E5
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_gia
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC5-phut,LT-AC5-chua-do,LT-AC8-skill,LT-dot-bien-phut-ve-0 node tests/scripts/lmtl-the.test.mjs'
    Results: 4 passed, 0 failed (lmtl-the)

- eval: E6
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E6-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_bien
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC3-khong-ky,LT-AC6-im,LT-AC9-so-hong,LT-dot-bien-them-loi-ky,LT-dot-bien-lap-moi-luot,LT-dot-bien-nuot-evals-hong node tests/scripts/lmtl-the.test.mjs'
    Results: 6 passed, 0 failed (lmtl-the)

- eval: E7
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E7-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_khoi
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC1-lap,LT-AC1-tuan-tu,LT-AC1-blocked,LT-AC2-tran,LT-AC4-khuyen-nghi,LT-AC7-mot-nguon,LT-dot-bien-tat-khoi,LT-dot-bien-bo-expected-exit,LT-dot-bien-bo-loc-id,LT-dot-bien-bo-loc-ngoai-evals node tests/scripts/lmtl-the.test.mjs'
    Results: 10 passed, 0 failed (lmtl-the)

- eval: E8
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_gia
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC5-phut,LT-AC5-chua-do,LT-AC8-skill,LT-dot-bien-phut-ve-0 node tests/scripts/lmtl-the.test.mjs'
    Results: 4 passed, 0 failed (lmtl-the)

- eval: E9
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-E9-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lmtl_bien
  verified_at: 2026-10-02T23:57:05Z
  output: |
    cmd: bash -c 'LMTL_CASES=LT-AC3-khong-ky,LT-AC6-im,LT-AC9-so-hong,LT-dot-bien-them-loi-ky,LT-dot-bien-lap-moi-luot,LT-dot-bien-nuot-evals-hong node tests/scripts/lmtl-the.test.mjs'
    Results: 6 passed, 0 failed (lmtl-the)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-loi-moi-tran-luot-loi-song-co-gia-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-02T23:57:05Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (không eval nào khai runs lớn hơn 1)

## Iterations

Round 1: cả chín eval máy (E1–E9) xanh và đều red trên baseline, nhưng khâu tìm lỗi giữ một phát hiện trong hợp đồng mức high ở AC-1 (hàng 6 của ma trận chỉ đo nửa «SUITE-*», chưa có assert nào cho vế «id ngoài evals.yaml») nên phán quyết REJECT, failed_evals để trống vì không eval nào đỏ. Trả về thi công để thêm hàng đo cho vế còn thiếu và một đột biến chỉ gỡ vế đó.
Round 2: thêm hàng 6b vào ma trận AC-1 (nay mười hàng) cùng đột biến bo-loc-ngoai-evals; cả chín eval máy xanh và đều red trên baseline, không còn phát hiện trong hợp đồng nên phán quyết PASS. Ba phát hiện mức thấp ngoài hợp đồng (hai trong số đó là cùng một lệch «chín hàng» so với mười hàng) cùng một mục mang từ round 1 chuyển sang review-findings.md cho người quyết ở Cổng 2.

### Re-pin lần 1 — 2026-10-03, do hoá cũ do merge main (#246 lộ trình) vào nhánh PR #247
run_id: repin-20261003T015721Z-66467
sha: 8a8ea2d84361be894137d031aad82a7881931713 · suites: 10 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-03, do chiến dịch ghim lại mốc 2.21.0
run_id: repin-20261003T125505Z-37851
sha: 5c6f2f482432b385cd4140557b251f90d668a8ec · suites: 10 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng
