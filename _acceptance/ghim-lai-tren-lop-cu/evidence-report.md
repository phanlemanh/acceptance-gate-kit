---
schema_version: 2
feature_slug: ghim-lai-tren-lop-cu
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a6fc84adcc1ee902323b0e14d48b6e678cf9736e
human_signoff:
---

# Evidence Report: ghim-lai-tren-lop-cu

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-8 | test | PASS |
| E11 | AC-8 | test | PASS |
| E12 | AC-8 | script | PASS |
| E13 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ghim-lai-tren-lop-cu-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_lop_cu_that
  verified_at: 2026-09-11T09:10:12Z
  output: |
      PASS: GL01 lớp cũ thật 0b5c5b37 → exit 2 có tên, trước kiểm cây sạch, không suite, không ghi (0.9s)

    Results: 1 passed, 0 failed

- eval: E2
  run_id: minted-ghim-lai-tren-lop-cu-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_liet_ke_tron
  verified_at: 2026-09-11T09:10:18Z
  output: |
      PASS: GL02 liệt kê TRỌN mục thiếu — đẳng thức tập tính lúc chạy, cả hai-thiếu-cùng-tệp (0.6s)

    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-ghim-lai-tren-lop-cu-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_ma_tran_export
  verified_at: 2026-09-11T09:10:29Z
  output: |
      PASS: GL03 ma trận xoá-export × hai hồ sơ (G so byte · N có tên) + quan hệ tên dùng ⊆ bảng (5.1s)

    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-ghim-lai-tren-lop-cu-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_lop_lai
  verified_at: 2026-09-11T09:10:35Z
  output: |
      PASS: GL04 lớp LAI (evidence-core 04069351) → dừng TRƯỚC khi ghi, gọi tên readSignedReportFor (0.7s)

    Results: 1 passed, 0 failed

- eval: E5
  run_id: minted-ghim-lai-tren-lop-cu-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_nap_loi
  verified_at: 2026-09-11T09:10:41Z
  output: |
      PASS: GL05 tệp có mà nạp lỗi → exit 2 «không nạp được», không stack (0.5s)

    Results: 1 passed, 0 failed

- eval: E6
  run_id: minted-ghim-lai-tren-lop-cu-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_nguon_cache
  verified_at: 2026-09-11T09:10:47Z
  output: |
      PASS: GL06 không --ag-root, plugin cache chỉ có lớp cũ → nói nguồn + cập nhật plugin (0.6s)

    Results: 1 passed, 0 failed

- eval: E7
  run_id: minted-ghim-lai-tren-lop-cu-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_loi_di_tiep
  verified_at: 2026-09-11T09:10:53Z
  output: |
      PASS: GL07 lối đi tiếp rút từ stderr: lệnh dò chạy từ --root → --ag-root in ra → bên đọc cũ nhận (1.1s)

    Results: 1 passed, 0 failed

- eval: E8
  run_id: minted-ghim-lai-tren-lop-cu-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-11T09:12:40Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 865 passed, 0 failed

- eval: E9
  run_id: minted-ghim-lai-tren-lop-cu-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-11T09:13:05Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E10
  run_id: minted-ghim-lai-tren-lop-cu-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-11T09:13:50Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E11
  run_id: minted-ghim-lai-tren-lop-cu-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-11T09:14:10Z
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E12
  run_id: minted-ghim-lai-tren-lop-cu-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-11T09:14:15Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E13
  run_id: minted-ghim-lai-tren-lop-cu-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gllc_bo_loc_rong
  verified_at: 2026-09-11T09:14:22Z
  output: |
      PASS: GL08 bộ chọn ca sống: GL99 khớp 0 ca → exit khác 0; GL01 → đúng một dòng kết quả (0.9s)

    Results: 1 passed, 0 failed

## Known limits

## Ngoài hợp đồng

## Analyst

E8, E9, E10, E11, E12 — pass trên cả HEAD và diffBase (baseline: green). Đây là bốn lệnh suite hồi quy (tests/scripts, tests/hooks, tests/plugins, tests/workflows) và script product-map --check: chúng chạy mỗi vòng để canh regression trên toàn kit, không riêng cho feature "ghim-lai-tren-lop-cu" (mã đo mới của feature này nằm trong tests/scripts/repin-lane-lop-cu.test.mjs, được suite scripts glob nạp — đó là phần góp bởi E8 mà baseline red thật xảy ra ở E1-E7/E13, các ca GLxx). Đọc như regression-guard có chủ ý, không cần viết lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 13/13 evals PASS ngay lượt đầu (E1-E7, E13 đỏ trên diffBase 0b5c5b37/lớp lai — có phân biệt; E8-E12 xanh cả hai phía — suite hồi quy nguyên vẹn). Không có vòng trước.