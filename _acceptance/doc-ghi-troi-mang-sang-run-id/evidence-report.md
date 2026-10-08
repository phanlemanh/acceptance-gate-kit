---
schema_version: 2
feature_slug: doc-ghi-troi-mang-sang-run-id
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f6909765cc978cb809ccc648c2cd6e736cd94723
human_signoff:
---

# Evidence Report: doc-ghi-troi-mang-sang-run-id

Round 1. Bảy eval của hợp đồng (E1 đến E7) đều chạy xanh. Verdict vẫn là REJECT vì hai lệnh suite hồi quy KHÔNG gắn eval nào đỏ: `bash tests/scripts/run-tests.sh --manh mjs:1/3` và lệnh `vung:3` của `tests/plugins/run-tests.sh` (chi tiết ở mục «Lệnh suite fail không gắn eval» bên dưới). `failed_evals` để rỗng đúng sự thật: không eval nào của hợp đồng đỏ.

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
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_bo_doc_tieu_de
  verified_at: 2026-10-08T16:26:05Z
  output: |
    Results: 40 passed, 0 failed (doc-ghi-troi)
    Các ca DG1 và DG1b đều có dòng PASS (mười mục tiêu đề chuẩn hoá, đếm đúng 10).

- eval: E2
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_mot_bieu_thuc
  verified_at: 2026-10-08T16:26:05Z
  output: |
    Results: 40 passed, 0 failed (doc-ghi-troi)
    Ca DG2 có dòng PASS (khối OOC-TITLE-RE ở workflow và lib giống nhau từng ký tự).

- eval: E3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_chen_mang_sang
  verified_at: 2026-10-08T16:26:05Z
  output: |
    Results: 40 passed, 0 failed (doc-ghi-troi)
    Các ca DG3, DG3b, DG3c, DG4, DG5 đều có dòng PASS.

- eval: E4
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_run_id_ben_viet
  verified_at: 2026-10-08T16:26:05Z
  output: |
    Results: 40 passed, 0 failed (doc-ghi-troi)
    Các ca DR1, DR6, DR6b đều có dòng PASS.

- eval: E5
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_run_id_ben_doc
  verified_at: 2026-10-08T16:26:05Z
  output: |
    Results: 40 passed, 0 failed (doc-ghi-troi)
    Các ca DR2a, DR2, DR4 đều có dòng PASS.

- eval: E6
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dgt_dot_bien
  verified_at: 2026-10-08T16:26:05Z
  output: |
    Results: 40 passed, 0 failed (doc-ghi-troi)
    Các ca DG6, DG7, DR5 đều có dòng PASS (ba kim đột biến đều đỏ đúng chỗ).

- eval: E7
  run_id: minted-doc-ghi-troi-mang-sang-run-id-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-10-08T16:26:05Z
  output: |
    Results: all workflow tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-08T16:26:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-10-08T16:26:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-08T16:26:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-08T16:26:05Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-08T16:26:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-08T16:26:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-08T16:26:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-08T16:26:05Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-08T16:26:05Z

### Lệnh suite fail không gắn eval

Hai lệnh dưới đây đỏ và không gắn eval nào, nên chúng không vào `failed_evals` nhưng vẫn kéo verdict về REJECT.

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  output: |
    Results: 25 passed, 1 failed
    (phần cuối đầu ra cắt ở bộ ca w6-w8-pham-vi; dòng ca đỏ nằm phía trên đoạn đuôi 25 dòng đã lưu, cần mở log đầy đủ của lượt chạy để biết tên tệp test đỏ)

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-doc-ghi-troi-mang-sang-run-id-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  output: |
    FAIL: [RT13] bản mới broken: ["baseline-tran-bo-qua-don"]
    FAIL: ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)
    Results: 1 failed

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt được (xanh cả ở HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature):

- E7 (`bash tests/workflows/run-tests.sh`): xanh trên baseline lẫn HEAD. Đây là bộ hồi quy workflow toàn cục, giữ lại như regression-guard có chủ ý, không assert hành vi mới.

Sáu eval còn lại (E1 đến E6) có baseline n-a vì bộ ca `doc-ghi-troi.test.mjs` chưa tồn tại ở cây trước tính năng, nên không có kết luận phân biệt từ phép so A/B; sự phân biệt của chúng dựa vào ca đột biến E6 (DG6, DG7, DR5) đỏ khi gỡ từng mảnh.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lượt, tất định)

## Iterations

Round 1: các eval E1 đến E7 xanh; REJECT vì hai lệnh suite hồi quy không gắn eval đỏ (`mjs:1/3` còn một ca đỏ chưa rõ tên trong đoạn đuôi đã lưu; `vung:3` đỏ ở ca RT13 của hồ sơ ra-co-ten-lam-va-trao, «baseline-tran-bo-qua-don»). Có thêm một phát hiện trong hợp đồng ở mức trung bình (AC-3, mục mang sang bị nuốt khi tên tươi bắt đầu bằng ngoặc mở với r hoặc R) ghi ở review-findings.md. Trả về giai đoạn triển khai.
