---
schema_version: 2
feature_slug: thuoc-nhan-de-khoi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a0257bfd75e5cf7b7f5864fc8d5767f1575c26c7
human_signoff:
---

# Evidence Report: thuoc-nhan-de-khoi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-thuoc-nhan-de-khoi-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_hai_chieu
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: scale -> warn co tieng
    PASS: chieu do chan WARN: thieu WARN -> bat duoc
    Results: 4 passed, 0 failed

- eval: E2
  run_id: minted-thuoc-nhan-de-khoi-E2-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_ba_ca_that
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: base neu nhan S5 GIAO
    PASS: doi chung: ban da sua -> exit 0
    Results: 4 passed, 0 failed

- eval: E3
  run_id: minted-thuoc-nhan-de-khoi-E3-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_nhan_con_song
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: chieu do (b2): chi co OCCLUDED -> khong tinh la thay nhan
    PASS: chieu do (b): xoa mask -> nhan ngoai tam thuoc
    Results: 12 passed, 0 failed

- eval: E4
  run_id: minted-thuoc-nhan-de-khoi-E4-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_fill_trong_suot
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: duc [fill="rgba(45,49,66,0.9)"] -> do
    PASS: duc [fill="#2d3142ff"] -> do
    Results: 8 passed, 0 failed

- eval: E5
  run_id: minted-thuoc-nhan-de-khoi-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_html_inline
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: html lanh -> exit 0
    PASS: html tiem -> do dung nhan
    Results: 2 passed, 0 failed

- eval: E6
  run_id: minted-thuoc-nhan-de-khoi-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: ARM13-mut

    Results: 751 passed, 0 failed

- eval: E7
  run_id: minted-thuoc-nhan-de-khoi-E7-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_suite_case
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: suite ghim [PASS: mutant code-sinh -> do dung thong diep]
    PASS: chieu do: stdout thieu dong -> bat duoc
    Results: 6 passed, 0 failed

- eval: E8
  run_id: minted-thuoc-nhan-de-khoi-E8-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_taste_gate
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: chieu do: muc ngoai §9 -> bat duoc
    PASS: LOCAL-PATCHES co entry
    Results: 6 passed, 0 failed

- eval: E9
  run_id: minted-thuoc-nhan-de-khoi-E9-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_quet_vung_ngoai
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: report-only: khong cham vung ngoai
    PASS: chieu do: mau duong dan BAT duoc thay doi that (5938183)
    Results: 5 passed, 0 failed

Bổ sung — ba suite toàn kho và một phép đối chiếu bản đồ (không gắn AC nào, chạy cạnh chín eval trên như hàng rào hồi quy toàn cục; không có run_id vì không thuộc map eval nào):

- suite: bash tests/hooks/run-tests.sh
  exit_code: 0
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: V06

    Results: 60 passed, 0 failed

- suite: bash tests/plugins/run-tests.sh
  exit_code: 0
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PASS: ca lan may qua bo phan loai — LM8b (ho so lan-may-song-qua-bo-phan-loai)

    Results: all plugin tests passed

- suite: bash tests/workflows/run-tests.sh
  exit_code: 0
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- suite: node scripts/product-map.mjs --root . --check
  exit_code: 0
  verified_at: 2026-08-27T09:00:00+07:00
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

## Ngoài hợp đồng

## Analyst

E6 (`bash tests/scripts/run-tests.sh`) — xanh trên cả HEAD lẫn diffBase: chứng minh harness (label-occlusion.test.mjs chạy được), không phải hành vi mới của tính năng. E7 chạy riêng cùng suite này và ghim đúng khối dòng của case label-occlusion.test.mjs trong stdout suite (nếp p194), nên khoảng hở "suite-không-dispatch-case" mà E6 một mình để lộ đã có E7 phủ độc lập.

## Variance

none — every multi-run eval is uniform (không eval nào có runs > 1 trong vòng này).

## Iterations

Round 1: E3, E7, E9 phơi lỗi harness — quan hệ co-mặt-rời-nhau cho nhãn khớp chéo (E3), suite gọi thẳng file case thay vì dispatch trọn suite (E7), và pathspec report-only khớp rỗng vĩnh viễn nên vế guard luôn xanh + probe cũ xoá nhầm 2 file thật của hồ sơ khác (E9) — đã sửa harness.
Round 2: E4, E8 phơi thêm lỗi — hai dạng alpha-màu-da (rgba/hex tint) của chính hình repo bị chấm nhầm là che kín nhãn (E4), và dòng path trong taste-gate dùng đường dẫn tương đối nên chết theo cwd của consumer mà phép kiểm chỉ-có-mặt-tên không phân biệt được (E8) — đã vá cả hai.
Round 3 (vòng này): cả 9 eval xanh, có phân biệt trên baseline đỏ (trừ E6 — non-discriminating, xem Analyst; được E7 bù độc lập).