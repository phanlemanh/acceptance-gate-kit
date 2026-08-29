---
schema_version: 2
feature_slug: nhanh-chinh-khong-ten-main
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 87126b66e38852aee06ec74337a5a72c3fbadd3b
human_signoff:
---

# Evidence Report: nhanh-chinh-khong-ten-main

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nhanh-chinh-khong-ten-main-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_master_khong_remote
  verified_at: 2026-08-30T10:00:00Z
  output: |
    PASS: nhánh 'trunk': mốc so sánh BẰNG merge-base độc lập và khác HEAD
    PASS: chiều đỏ: cắt danh sách → nhánh master rơi đúng câu có hướng dẫn
    Results: chan master-khong-remote passed

- eval: E2
  run_id: minted-nhanh-chinh-khong-ten-main-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_nhanh_la_cau_huong_dan
  verified_at: 2026-08-30T10:00:00Z
  output: |
    PASS: nhánh lạ → câu có hướng dẫn, không thông điệp sai, không vết đổ
    PASS: đối chứng dương: đổi tên về master → sinh args
    Results: chan nhanh-la-cau-huong-dan passed

- eval: E3
  run_id: minted-nhanh-chinh-khong-ten-main-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_doc_bat_buoc_van_dong
  verified_at: 2026-08-30T10:00:00Z
  output: |
    PASS: ref hỏng → exit 2, nêu tên phần hỏng, không sinh tệp
    PASS: đối chứng dương: --diff-base master → sinh tệp
    Results: chan doc-bat-buoc-van-dong passed

- eval: E4
  run_id: minted-nhanh-chinh-khong-ten-main-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_hai_vai_hai_ham
  verified_at: 2026-08-30T10:00:00Z
  output: |
    PASS: chiều đỏ: gỡ marker → bộ dò vùng trả rỗng (ca sẽ đỏ, không xanh rỗng)
    PASS: chiều đỏ: khôi phục lời gọi cũ → phép đo bắt được
    Results: chan hai-vai-hai-ham passed

- eval: E5
  run_id: minted-nhanh-chinh-khong-ten-main-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_remote_co_tran
  verified_at: 2026-08-30T10:00:00Z
  output: |
    PASS: remote treo: bước chuẩn bị args về sau 10s (< 30s) — không treo theo
    PASS: remote treo → rơi đúng đường dò tên quen, vẫn sinh args
    Results: chan remote-co-tran passed

- eval: E6
  run_id: minted-nhanh-chinh-khong-ten-main-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nckt_remote_tra_loi
  verified_at: 2026-08-30T10:00:00Z
  output: |
    PASS: nguồn remote thật sự khai tên ngoài danh sách (phat-trien)
    PASS: chiều đỏ: phá bước đọc remote → mất đường remote, đòi --diff-base
    Results: chan remote-tra-loi passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-08-30T10:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-08-30T10:00:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_plugins_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-08-30T10:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-08-30T10:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nhanh-chinh-khong-ten-main-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-08-30T10:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — không có eval nào chạy nhiều lần trong round này (mọi eval runs=1, deterministic)

## Iterations

Round 1: E1–E6 và 5 lệnh suite đều xanh cơ khí (exit 0), nhưng scope-triage xác nhận AC-6 vế "script ghi lại NGUỒN giải được tên nhánh" chưa được cài trong `feature-loop/scripts/s4-args.mjs` (biến `mainBranchInfo` bị tính rồi bỏ, không vào `args.json`) — verdict REJECT theo đúng thiếu sót trong-hợp-đồng đó, không theo một eval nào thất bại về mặt cơ khí.
