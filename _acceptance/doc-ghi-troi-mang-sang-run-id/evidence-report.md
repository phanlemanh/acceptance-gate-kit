---
schema_version: 2
feature_slug: doc-ghi-troi-mang-sang-run-id
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 722b3c5fe6914bc806441ef74e4d3d8cb6ad3a7d
human_signoff:
---

# Evidence Report: doc-ghi-troi-mang-sang-run-id

Round 2. Cả bảy eval của hợp đồng đều xanh, nhưng một lệnh suite hồi quy không gắn eval nào (`bash tests/scripts/run-tests.sh --manh mjs:3/3`) kết thúc với mã thoát khác 0, nên verdict tính sẵn là REJECT. `failed_evals` để trống vì không eval nào của hợp đồng đỏ; nguyên nhân REJECT nằm ở lệnh suite đó (xem mục «Lệnh suite (hồi quy)» bên dưới). Không có eval ui-check nên không có ảnh chụp và không có `network_observed`.

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
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_bo_doc_tieu_de
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E2
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_mot_bieu_thuc
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_chen_mang_sang
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E4
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_run_id_ben_viet
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E5
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_run_id_ben_doc
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E6
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_dot_bien
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Results: 44 passed, 0 failed (doc-ghi-troi)

- eval: E7
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Results: all workflow tests passed

### Lệnh suite (hồi quy)

Tám lệnh xanh, một lệnh đỏ. Lệnh đỏ là `mjs:3/3` bên dưới; nó không gắn eval nào của hợp đồng, nhưng là lý do của verdict REJECT. Phần đuôi đầu ra máy lưu chỉ hiện các ca PASS cuối cùng và dòng tổng «24 passed, 1 failed»; tên ca đỏ không nằm trong phần đuôi đó, nên báo cáo này không gọi tên nó. Người chạy lại phải đọc đầu ra đầy đủ của `mjs:3/3` để biết ca nào đỏ trước khi kết luận nó thuộc hay không thuộc vật của vòng này.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 1
  verified_at: 2026-10-08T17:04:03Z
  output: |
    Phần đuôi đầu ra: các ca s4-args-not-run (NRS1–NRS4), stale-by-paths (SBP1–SBP16) và vong-meta-dang-mo (VM1–VM5) đều PASS.
    Results: 24 passed, 1 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-08T17:04:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature): E7 (`bash tests/workflows/run-tests.sh`). E7 là regression-guard có chủ ý cho cả bộ test workflow; nó không assert hành vi mới. Sáu eval còn lại (E1–E6) ghi baseline n-a vì không chạy được trên cây cũ, nên chưa chứng minh được chúng đỏ trên mã trước feature; tín hiệu phân biệt của chúng đến từ ca đột biến DG6, DG7, DG8 và DR5 của E6.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: AC-3 REJECT — nhãn lượt chỉ khớp đúng nhóm nhãn của OOC_TITLE_RE; returned to implementation (commit 722b3c5f).
Round 2: bảy eval của hợp đồng xanh (E1–E7); lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:3/3` kết thúc với mã thoát khác 0 (24 passed, 1 failed), không gắn eval nào. Verdict REJECT, `failed_evals` trống. Đầu ra đầy đủ của lệnh đó cần đọc để biết ca đỏ.
