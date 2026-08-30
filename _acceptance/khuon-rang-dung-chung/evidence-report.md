---
schema_version: 2
feature_slug: khuon-rang-dung-chung
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 31f8287e3f3bea9b0b5db966a925a0fdaef9fbb4
human_signoff:
---

# Evidence Report: khuon-rang-dung-chung

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-khuon-rang-dung-chung-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: ARM13-mut

    Results: 779 passed, 0 failed

- eval: E2
  run_id: minted-khuon-rang-dung-chung-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: ARM13-mut

    Results: 779 passed, 0 failed

- eval: E3
  run_id: minted-khuon-rang-dung-chung-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: ARM13-mut

    Results: 779 passed, 0 failed

- eval: E4
  run_id: minted-khuon-rang-dung-chung-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: ARM13-mut

    Results: 779 passed, 0 failed

- eval: E5
  run_id: minted-khuon-rang-dung-chung-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.krdc_tich_hop
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: móng riêng đã vắng — nạp trọn từ khuôn
    PASS: chiều đỏ: hàm móng lạ trong bản sao BỊ BẮT bởi phép đảo mặc định
    Results: chan tich-hop passed (11 pass, 0 fail)

- eval: E6
  run_id: minted-khuon-rang-dung-chung-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: ARM13-mut

    Results: 779 passed, 0 failed

- eval: E7
  run_id: minted-khuon-rang-dung-chung-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.krdc_carry_ma_thuc_thi
  verified_at: 2026-08-30T14:00:00Z
  output: |
    PASS: (c) chỉ chạm giấy → carry như cũ
    PASS: chiều đỏ: bản khôi-phục-loại-trọn CARRY OAN eval dù bộ đo đã đổi (ca phân biệt được)
    Results: chan carry-ma-thuc-thi passed (4 pass, 0 fail)

### Lệnh suite (hồi quy)

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khuon-rang-dung-chung-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-khuon-rang-dung-chung-SUITE-bash_tests_plugins_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khuon-rang-dung-chung-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khuon-rang-dung-chung-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-08-30T14:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

E1, E2, E3, E4, E6 (cmd: `bash tests/scripts/run-tests.sh`)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E7 cùng bốn lệnh suite hồi quy (hooks/plugins/workflows/product-map) PASS ngay lượt đầu, không có vòng lặp trước round này.
Round 2: cùng 7 eval + 4 lệnh suite PASS ở mức thực thi (exit 0), nhưng adversarial-verify bắt được lỗ phép đo THẬT trên đúng vật vừa sửa (E7 ô (b) của chân carry không phân biệt được vật hỏng — assertion âm-tính-một-mình; E7 danh sách PAPER_EXTS 7 phần tử chỉ 1 có assert; E3 fixture KR3 gõ tay không round-trip writer→reader của kr_vi_phan; E5 "chạy trọn 6 chân" là danh sách literal không rút từ nguồn) → verdict REJECT, trả về implementation.