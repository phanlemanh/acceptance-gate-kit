---
schema_version: 2
feature_slug: kiem-ban-cai-loi-sua-chay-duoc
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c7912f5207c5b79dcf5115dae798d3d70288544d
human_signoff:
---

# Evidence Report: kiem-ban-cai-loi-sua-chay-duoc

Lượt chấm 3. Mười eval E1–E10 đều xanh (mang từ lượt 2, delta không chạm paths của eval nào); mười một lệnh suite hồi quy chạy lại ở lượt này đều xanh, gồm cả `vung:3` đã đỏ ở lượt 2. Không có judgment item, không có eval ngẫu nhiên, không có eval ui-check.

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

## Evidence

- eval: E1
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E1-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E2-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E3-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E4-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E5-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E6-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E7-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E8-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E9-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E10-r2
  exit_code: 0
  carried_from_round: 2
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-29T06:07:38Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-29T09:25:59Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet). Ghi chu: E1–E10 mang tu round 2 nen round nay khong do lai baseline; khong eval nao duoc phat hien xanh ca hai phia.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10 failed — bộ ca `kiem-ban-cai.ca.mjs` in đủ dòng PASS (gồm KB-13) nhưng sập ENOTEMPTY khi dọn thư mục tạm trong `chayTron` (dòng 451) nên thoát khác 0; chưa rõ do tranh chấp thư mục tạm hay do một ca để lại tiến trình/tệp. Returned to implementation. Chín eval E1–E9 xanh; mười tìm thấy ngoài hợp đồng nằm ở review-findings.md để người quyết.
Round 2: E1–E10 đều xanh (E10 đã qua sau khi dọn thư mục tạm có thử lại), nhưng lệnh suite `tests/plugins/run-tests.sh --manh vung:3` đỏ ở ca P179 [MBC] E6 (không gắn eval nào) nên verdict REJECT; hai finding ngoài hợp đồng mới (cách dọn thư mục tạm còn sót ở `tests/scripts/kiem-ban-cai.ca.mjs` và `scripts/kiem-ban-cai.mjs`) nằm ở review-findings.md. Returned to implementation.
Round 3: E1–E10 mang từ round 2 (delta không chạm paths của eval nào); cả mười một lệnh suite xanh, gồm `vung:3`. Verdict PASS. Một finding trong hợp đồng (AC-4, mức medium) và năm finding ngoài hợp đồng nằm ở review-findings.md; thời điểm chạy của các lệnh suite round 3 ghi ở mức ngày vì run-log được ghi sau khi báo cáo soạn xong.
