---
schema_version: 2
feature_slug: doc-ghi-troi-mang-sang-run-id
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c61b854e5215608072b6953f8d52106021dbb6b3
human_signoff: Phan Le Manh 2026-10-09 — ký lượt chấm 3; Ngoài-1, 2, 4, 5, 6, 7 ghi Known limits; Ngoài-3 mở hợp đồng mới (hạt giống); đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: doc-ghi-troi-mang-sang-run-id

Round 3. Cả bảy eval của hợp đồng (E1–E7) đều xanh và chín lệnh suite hồi quy cũng xanh, kể cả lệnh `mjs:3/3` đã đỏ ở round 2. Không có eval judgment nên không có mục nào chờ người; không có eval ui-check nên không có ảnh chụp và không có `network_observed`. Bảy phát hiện ngoài hợp đồng nằm ở `review-findings.md`, không ở báo cáo này.

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
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_bo_doc_tieu_de
  verified_at: 2026-10-08T17:53:33Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E2
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_mot_bieu_thuc
  verified_at: 2026-10-08T17:53:33Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_chen_mang_sang
  verified_at: 2026-10-08T17:53:33Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E4
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_run_id_ben_viet
  verified_at: 2026-10-08T17:53:33Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E5
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_run_id_ben_doc
  verified_at: 2026-10-08T17:53:33Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E6
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_dot_bien
  verified_at: 2026-10-08T17:53:33Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E7
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-08T17:53:33Z
  output: |
    Results: all workflow tests passed

### Lệnh suite (hồi quy)

Chín lệnh, đều xanh. Không lệnh nào gắn eval của hợp đồng.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-08T17:53:33Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay.

Eval không phân biệt (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature): E7 (`bash tests/workflows/run-tests.sh`). E7 là regression-guard có chủ ý cho cả bộ test workflow, không assert hành vi mới. Sáu eval còn lại (E1–E6) ghi baseline n-a vì round này không đo lại; tín hiệu phân biệt của chúng đến từ các ca đột biến DG6, DG7, DG8 và DR5 của E6.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: AC-3 REJECT — nhãn lượt chỉ khớp đúng nhóm nhãn của OOC_TITLE_RE; returned to implementation (commit 722b3c5f).
Round 2: bảy eval của hợp đồng xanh; lệnh suite `mjs:3/3` đỏ một ca (GL03 so byte run-log bỏ qua trường đo thời gian), không gắn eval nào; returned to implementation (commit 70db1a9c).
Round 3: bảy eval của hợp đồng xanh và chín lệnh suite xanh, kể cả `mjs:3/3` (26 ca ở phân mảnh 1 và 2, 25 ca ở phân mảnh 3, tất cả đạt). Verdict PASS; bảy phát hiện ngoài hợp đồng chuyển sang `review-findings.md` cho người quyết ở Cổng 2.

### Re-pin lần 1 — 2026-10-09, do gộp origin/main sau #289 (xung đột docRid/ridHopLe)
run_id: repin-20261009T080502Z-25112
sha: 6197c7845c5ac0b99103e31c175ec61aa3987ee1 · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-09, do chiến dịch ghim lại mốc 2.26.0
run_id: repin-20261009T104247Z-18914
sha: c61b854e5215608072b6953f8d52106021dbb6b3 · suites: 10 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng
