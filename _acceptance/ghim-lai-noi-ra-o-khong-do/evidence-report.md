---
schema_version: 2
feature_slug: ghim-lai-noi-ra-o-khong-do
verdict: REJECT
failed_evals: [E12]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 81da26e9d95d6cde70a999b94fe03615237bafd0
human_signoff:
---

# Evidence Report: ghim-lai-noi-ra-o-khong-do

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-9 | script | FAIL |
| E13 | AC-9 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_khoa_kieu
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN01 dòng ghim nêu ô ngoài làn máy; ba tập rời nhau, hợp = tập id (0.8s)

    Results: 1 passed, 0 failed

- eval: E2
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_vang_han
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN02 hồ sơ toàn eval máy: khoá tuỳ chọn VẮNG HẲN, không phải mảng rỗng (0.6s)

    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_section
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN03 section Re-pin nêu ô ngoài làn máy + AC không có chốt máy; hồ sơ toàn máy thì im (5.1s)

    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_khuon_skill
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN04 khoá dòng ghim của script == khoá khuôn REPIN-TEMPLATE, cả ca đủ ba khoá tuỳ chọn (1.3s)

    Results: 1 passed, 0 failed

- eval: E5
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_guide_nguong
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN05 SKILL + GUIDE §7.1 khai khoá touched; lệnh đếm ngưỡng của GUIDE chạy thật (1.3s)

    Results: 1 passed, 0 failed

- eval: E6
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_diff_cham
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN06 diff từ PIN CŨ chạm paths của ô ngoài làn máy → khoá touched, không chặn (2.1s)

    Results: 1 passed, 0 failed

- eval: E7
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_glob_mot_nguon
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN07 khớp glob bằng globToRe của carry-plan (* không xuyên /); đọc cả paths flow lẫn block-seq (2.6s)

    Results: 1 passed, 0 failed

- eval: E8
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_ben_doc_cu
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN08 dòng ghim mang khoá mới: bên đọc hiện tại VÀ bên đọc 2.17.0 đều xanh, không VIOLATION (2.1s)

    Results: 1 passed, 0 failed

- eval: E9
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_the_cong_2
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN09 thẻ Cổng Bằng chứng: cờ AC không có chốt máy + cờ pin đã chạm, round-trip với section (6.9s)

    Results: 1 passed, 0 failed

- eval: E10
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E10-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_the_cong_1
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN10 thẻ Cổng Phạm vi: cùng vị từ AC không có chốt máy, chiều im khi toàn eval máy (1.4s)

    Results: 1 passed, 0 failed

- eval: E11
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_w8_gia
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN11 W8 giữ tiền tố cũ và NỐI câu giá; hợp đồng không có mặt người nhìn thì im (1.3s)

    Results: 1 passed, 0 failed

- eval: E12
  run_id: repin-20260920T092837Z-69084
  exit_code: 1
  baseline: red
  verifier: config:executors.script.gnro_suite_con_lai
  verified_at: 2026-09-20T09:28:37Z
  output: |
    repin-lane: LÀN ĐỎ — không ghi gì (suite [0]; eval đỏ: s1/E14=4). Khắc phục nguyên nhân rồi chạy làn MỚI (run_id mới); không ký mù.
    lan-status-not-run: bộ lọc LSNR_CASES=KHONG-CO-CA-NAY khớp 0 ca — không có gì chạy

- eval: E13
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_bo_chon
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN12 bộ chọn GNRO_CASES: một ca in đúng một dòng; khớp 0 ca thì đỏ có tên (0.6s)

    Results: 1 passed, 0 failed

- eval: E14
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E14-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_hat_giong
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E15
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E15-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_khong_ghi_de
  verified_at: 2026-09-20T09:28:37Z
  output: |
    PASS: GN13 không ca nào GHI vào tệp nguồn theo dõi git — kể cả ghi rồi khôi phục y hệt (43.0s)

    Results: 1 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-20T09:28:37Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-20T09:28:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r1
  exit_code: 0
  verified_at: 2026-09-20T09:28:37Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-20T09:28:37Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-20T09:28:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt).

## Variance

none — không có eval runs>1 trong vòng này (mọi eval deterministic, runs=1).

## Iterations

Round 1: E12 failed — làn ghim lại (repin-lane) tự khai "LÀN ĐỎ — không ghi gì" (suite scripts_con_lai không nhất được cụm PASS/GN qua glob, tiếp đó lộ eval nội bộ s1/E14 đỏ 4 lần trong chính cơ chế repin), nên bốn suite còn lại + product-map --check không được xác nhận chạy hết qua đúng lệnh hợp đồng đã khai. Trả về giai đoạn implementation để khắc phục nguyên nhân rồi chạy làn MỚI (run_id mới), không ký mù trên làn đỏ này.
