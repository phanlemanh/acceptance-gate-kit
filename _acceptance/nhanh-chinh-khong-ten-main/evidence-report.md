---
schema_version: 2
feature_slug: nhanh-chinh-khong-ten-main
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f24ffcb12a3bf0a8c3ec2896646e06bc831f648e
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

## Evidence

- eval: E1
  run_id: minted-nhanh-chinh-khong-ten-main-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_master_khong_remote
  verified_at: 2026-08-30T05:00:00Z
  output: |
    Results: chan master-khong-remote passed

- eval: E2
  run_id: minted-nhanh-chinh-khong-ten-main-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_nhanh_la_cau_huong_dan
  verified_at: 2026-08-30T05:00:00Z
  output: |
    PASS: nhánh lạ → câu có hướng dẫn, không thông điệp sai, không vết đổ
    PASS: đối chứng dương: đổi tên về master → sinh args
    Results: chan nhanh-la-cau-huong-dan passed

- eval: E3
  run_id: minted-nhanh-chinh-khong-ten-main-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_doc_bat_buoc_van_dong
  verified_at: 2026-08-30T05:00:00Z
  output: |
    PASS: ref hỏng → exit 2, nêu tên phần hỏng, không sinh tệp
    PASS: đối chứng dương: --diff-base master → sinh tệp
    Results: chan doc-bat-buoc-van-dong passed

- eval: E6
  run_id: minted-nhanh-chinh-khong-ten-main-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_remote_tra_loi
  verified_at: 2026-08-30T05:00:00Z
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: phá bước đọc remote → rơi đúng câu đòi --diff-base (ghim thông điệp)
    Results: chan remote-tra-loi passed

- eval: E7
  run_id: minted-nhanh-chinh-khong-ten-main-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_ci_single_branch
  verified_at: 2026-08-30T05:00:00Z
  output: |
    PASS: bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)
    PASS: chiều đỏ: bỏ kiểm-tồn-tại → chết đúng thông điệp sai-loại mà AC-2 cấm
    Results: chan ci-single-branch passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-08-30T05:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-08-30T05:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_plugins_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-08-30T05:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-08-30T05:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-08-30T05:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — không có eval nào chạy nhiều lần (runs > 1)

## Iterations

Round 1: sửa 5 lỗi in-contract (giải tên remote cục bộ trước đọc bắt buộc · nguồn giải tên vào đầu ra thay vì biến chết · ghim thông điệp E6 · snapshot_tree đối chứng dương trên chính bản sao · bỏ mã chết SRC_R) — đóng AC-6/AC-7; ngay sau đó luật dừng-vá kích hoạt lần 2 vì phép đo lại tự dối (snapshot_tree ghi đè fixture qua biến REPO toàn cục), owner thu phạm vi rút AC-4/AC-5.
Round 2: E1–E7 và 4 lệnh suite (scripts, hooks, workflows, product-map) pass; lệnh suite thứ năm `bash tests/plugins/run-tests.sh` bị chặn — agent skip/chết trước khi có kết quả, không được tính là pass → verdict BLOCKED (không phải lỗi mã).
Round 3: chạy lại đúng lệnh bị chặn — cả 5 eval (E1, E2, E3, E6, E7) và cả 5 lệnh suite (scripts, hooks, plugins, workflows, product-map) đều exit 0 → verdict PASS.
