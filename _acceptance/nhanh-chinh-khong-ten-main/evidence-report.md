---
schema_version: 2
feature_slug: nhanh-chinh-khong-ten-main
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 99b730f9259f1fc0648d21c61eab294dfeea88ef
human_signoff:
---

# Evidence Report: nhanh-chinh-khong-ten-main

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nhanh-chinh-khong-ten-main-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_master_khong_remote
  verified_at: 2026-08-30T14:32:00+07:00
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: cắt danh sách → nhánh master rơi đúng câu có hướng dẫn (ghim đủ, loại lỗi dùng sai cờ)
    Results: chan master-khong-remote passed

- eval: E2
  run_id: minted-nhanh-chinh-khong-ten-main-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_nhanh_la_cau_huong_dan
  verified_at: 2026-08-30T14:32:00+07:00
  output: |
    PASS: nhánh lạ → câu có hướng dẫn, không thông điệp sai, không vết đổ
    PASS: đối chứng dương: đổi tên về master → sinh args
    Results: chan nhanh-la-cau-huong-dan passed

- eval: E3
  run_id: minted-nhanh-chinh-khong-ten-main-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_doc_bat_buoc_van_dong
  verified_at: 2026-08-30T14:32:00+07:00
  output: |
    PASS: ref hỏng → exit 2, nêu tên phần hỏng, không sinh tệp
    PASS: đối chứng dương: --diff-base master → sinh tệp
    Results: chan doc-bat-buoc-van-dong passed

- eval: E6
  run_id: minted-nhanh-chinh-khong-ten-main-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_remote_tra_loi
  verified_at: 2026-08-30T14:32:00+07:00
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: phá bước đọc remote → rơi đúng câu đòi --diff-base (ghim thông điệp)
    Results: chan remote-tra-loi passed

- eval: E7
  run_id: minted-nhanh-chinh-khong-ten-main-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_ci_single_branch
  verified_at: 2026-08-30T14:32:00+07:00
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: bỏ kiểm-tồn-tại → chết đúng thông điệp sai-loại mà AC-2 cấm
    Results: chan ci-single-branch passed

- eval: E8
  run_id: minted-nhanh-chinh-khong-ten-main-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_khong_doan_sang_ten_khac
  verified_at: 2026-08-30T14:32:00+07:00
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: bản cho vòng dò chạy vô điều kiện ĐOÁN BỪA sang «master» (ca phân biệt được)
    Results: chan khong-doan-sang-ten-khac passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_scripts_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-08-30T14:32:00+07:00

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_hooks_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-08-30T14:32:00+07:00

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_plugins_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-08-30T14:32:00+07:00

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_workflows_run_tests_sh-r4
  exit_code: 0
  verified_at: 2026-08-30T14:32:00+07:00

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-node_scripts_product_map_mjs_root_check-r4
  exit_code: 0
  verified_at: 2026-08-30T14:32:00+07:00

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: rang.sh (bộ răng) mang hai lỗi nặng làm phạm vi đo sai — thu phạm vi + sửa lại rang.sh trước khi chạy tiếp.
Round 3: toàn bộ eval XANH nhưng hồi quy AC-8 (đoán bừa sang nhánh khác khi remote đã khai tên) bị chính bản vá tự tái lập — vượt cấp trần, escalate owner quyết hướng theo cấp 3 vòng.
Round 4: sửa s4-args.mjs cấm đoán sang tên khác khi remote đã khai nhánh chính (đóng AC-8) — toàn bộ eval và bốn bộ suite hồi quy xanh, verdict PASS.