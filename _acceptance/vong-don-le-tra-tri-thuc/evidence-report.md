---
schema_version: 2
feature_slug: vong-don-le-tra-tri-thuc
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 962418ca3e0b90f36d854d9c0a8aaf624f6cbc50
human_signoff:
---

# Evidence Report: vong-don-le-tra-tri-thuc

Round 2. Cả mười eval của hợp đồng (E1–E10) mang từ round 1: bản vá S4 r1 chỉ chạm danh sách chép CI, hướng dẫn GUIDE và ca KM-8, không chạm đường dẫn nào của các eval này, nên round này không chạy lại. Tổng thể vẫn REJECT vì một lệnh suite hồi quy không gắn eval nào chạy đỏ: `bash tests/scripts/run-tests.sh --manh mjs:1/3` cho kết quả «37 passed, 1 failed». Ca đỏ là XD-6 của `xuat-du-qua-pipe.test.mjs` (xem mục «Lệnh fail không gắn eval»).

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
| E10 | AC-9 | test | PASS |

## Evidence

Ghi chú về `verified_at` của các lệnh suite round 2: sổ chạy chưa có dấu giờ trong tay người soạn nên giá trị dưới đây lấy theo giờ mở lượt chấm (2026-10-25T03:37:56Z, ghi ở `s4-args-r2.json`), chỉ là mốc xấp xỉ. Mười eval E1–E10 giữ nguyên `verified_at` của round 1.

- eval: E1
  run_id: minted-vong-don-le-tra-tri-thuc-E1-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-vong-don-le-tra-tri-thuc-E2-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-vong-don-le-tra-tri-thuc-E3-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-vong-don-le-tra-tri-thuc-E4-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-vong-don-le-tra-tri-thuc-E5-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-vong-don-le-tra-tri-thuc-E6-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-vong-don-le-tra-tri-thuc-E7-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-vong-don-le-tra-tri-thuc-E8-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-vong-don-le-tra-tri-thuc-E9-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_tra_tri_thuc
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-vong-don-le-tra-tri-thuc-E10-r1
  exit_code: 0
  verifier: config:executors.test.vong_don_le_hoi_quy
  verified_at: 2026-10-25T01:39:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh fail không gắn eval

`bash tests/scripts/run-tests.sh --manh mjs:1/3` chạy đỏ ở round 2 và không thuộc eval nào (mảng `evals` của lệnh rỗng). Tổng kết của phân mảnh: «Results: 37 passed, 1 failed». Ca đỏ duy nhất là `xuat-du-qua-pipe.test.mjs`, ca XD-6 «người đọc đóng sớm — mã 0, không EPIPE; khuôn exitCode thì sập», lý do máy ghi: «chiều đỏ không đỏ: bản sao exitCode → mã 1, stderr tiến trình con KHÔNG có EPIPE». Sáu ca còn lại của tệp (XD-1…XD-5, XD-7) xanh. Ở round 1 lệnh đỏ là phân mảnh `mjs:3/3` (36 passed, 1 failed); round 2 phân mảnh đó xanh (37 passed, 0 failed) và phân mảnh `mjs:1/3` đỏ. Máy chưa phân loại ca XD-6 là lỗi môi trường hay hồi quy do bản vá; việc đó thuộc phiên sửa.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 1
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-vong-don-le-tra-tri-thuc-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-25T03:37:56Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do: mười một lệnh suite hồi quy (n-a, không có baseline); E1–E10 mang từ round 1 nên round này không đo baseline lại.

## Variance

none — mọi eval multi-run đều đồng nhất (không eval nào có runs lớn hơn 1; không có ca flaky được ghi nhận)

## Iterations

Round 1: E1–E10 xanh, không eval nào trượt; lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:3/3` đỏ (36 passed, 1 failed), không gắn eval. Returned to implementation (commit 5dbd4502: ba tệp lối --tra vào danh sách chép CI, GUIDE §5.3, ca KM-8).
Round 2: E1–E10 mang từ round 1 (delta không chạm đường dẫn của eval); lệnh suite `bash tests/scripts/run-tests.sh --manh mjs:1/3` đỏ ở ca XD-6 của `xuat-du-qua-pipe.test.mjs` (37 passed, 1 failed), không gắn eval; mười suite còn lại xanh. Verdict REJECT, trả về phiên sửa.
