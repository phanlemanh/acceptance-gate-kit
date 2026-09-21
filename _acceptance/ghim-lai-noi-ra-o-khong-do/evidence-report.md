---
schema_version: 2
feature_slug: ghim-lai-noi-ra-o-khong-do
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 41b949dec2245c147ff1460ba6e70e41e5fbb6df
human_signoff: Phan Le Manh 2026-09-20
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
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_khoa_kieu
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN01 dòng ghim nêu ô ngoài làn máy; ba tập rời nhau, hợp = tập id (0.8s)

    Results: 1 passed, 0 failed

- eval: E2
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E2-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_vang_han
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN02 hồ sơ toàn eval máy: khoá tuỳ chọn VẮNG HẲN, không phải mảng rỗng (0.6s)

    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E3-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_section
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN03 section Re-pin nêu ô ngoài làn máy + AC không có chốt máy; hồ sơ toàn máy thì im (6.6s)

    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E4-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_khuon_skill
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN04 khoá dòng ghim của script == khoá khuôn REPIN-TEMPLATE, cả ca đủ ba khoá tuỳ chọn (1.1s)

    Results: 1 passed, 0 failed

- eval: E5
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_guide_nguong
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN05 SKILL + GUIDE §7.1 khai khoá touched; lệnh đếm ngưỡng của GUIDE chạy thật (6.0s)

    Results: 1 passed, 0 failed

- eval: E6
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E6-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_diff_cham
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN06 diff từ PIN CŨ chạm paths của ô ngoài làn máy → khoá touched, không chặn (3.1s)

    Results: 1 passed, 0 failed

- eval: E7
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E7-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_glob_mot_nguon
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN07 khớp glob bằng globToRe của carry-plan (* không xuyên /); đọc cả paths flow lẫn block-seq (2.7s)

    Results: 1 passed, 0 failed

- eval: E8
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E8-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_ben_doc_cu
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN08 dòng ghim mang khoá mới: bên đọc hiện tại VÀ bên đọc 2.17.0 đều xanh, không VIOLATION (2.4s)

    Results: 1 passed, 0 failed

- eval: E9
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E9-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_the_cong_2
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN09 thẻ Cổng Bằng chứng: cờ AC không có chốt máy + cờ pin đã chạm, round-trip với section (10.7s)

    Results: 1 passed, 0 failed

- eval: E10
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E10-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_the_cong_1
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN10 thẻ Cổng Phạm vi: cùng vị từ AC không có chốt máy, chiều im khi toàn eval máy (1.9s)

    Results: 1 passed, 0 failed

- eval: E11
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E11-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_w8_gia
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN11 W8 giữ tiền tố cũ và NỐI câu giá; hợp đồng không có mặt người nhìn thì im (1.2s)

    Results: 1 passed, 0 failed

- eval: E12
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E12-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_suite_con_lai
  verified_at: 2026-09-20T14:12:00Z
  output: |
    [approved] khoi OK, 0 loi hua phut
    PRODUCT-MAP.md khớp hồ sơ xưởng.
    [exited with code 0]

- eval: E13
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E13-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_bo_chon
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN12 bộ chọn GNRO_CASES: một ca in đúng một dòng; khớp 0 ca thì đỏ có tên (0.7s)

    Results: 1 passed, 0 failed

- eval: E14
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E14-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_hat_giong
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

- eval: E15
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E15-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.gnro_khong_ghi_de
  verified_at: 2026-09-20T14:12:00Z
  output: |
    PASS: GN13 không ca nào GHI vào tệp nguồn theo dõi git — kể cả ghi rồi khôi phục y hệt (67.7s)

    Results: 1 passed, 0 failed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-20T14:12:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-20T14:12:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r3
  exit_code: 0
  verified_at: 2026-09-20T14:12:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-20T14:12:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-20T14:12:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt).

## Variance

none — không có eval nào chạy nhiều lần (mọi eval deterministic, runs=1).

## Iterations

Round 1: E12 failed — làn ghim lại (repin-lane) tự khai "LÀN ĐỎ — không ghi gì" (suite scripts_con_lai không nhất được cụm PASS/GN qua glob, tiếp đó lộ eval nội bộ s1/E14 đỏ 4 lần trong chính cơ chế repin), nên bốn suite còn lại + product-map --check không được xác nhận chạy hết qua đúng lệnh hợp đồng đã khai. Trả về giai đoạn implementation để khắc phục nguyên nhân rồi chạy làn MỚI (run_id mới), không ký mù trên làn đỏ này.
Round 2: Đổi khuôn theo yêu cầu round này — mọi chuỗi kỳ vọng trong các ca GN (paths, hậu tố AC, khoá mới) nay RÚT trực tiếp từ vật (evals.yaml, contract.md, SKILL/GUIDE, dòng repin thật) thay vì gõ lại hằng tay (commit 0c8e9dc3, 20a6b5d5, 0381a94e). Lệnh tổng hợp E12 (đối chiếu cụm GN01 qua glob + bốn suite còn lại + product-map --check) nay thoát 0; suite scripts nhất được ca mới, không còn kẹt ở nhánh LÀN ĐỎ nội bộ như round 1. Cả 15 eval + 5 lệnh suite hồi quy đều PASS/exit 0.
Round 3: Sau khi owner định đoạt 29 mục ngoài hợp đồng ở Gate 2 round trước (TRẢ LẠI) và vá Ngoài-10 + Ngoài-11 (hai hằng-đúng do chính bản đổi khuôn round 2 tự sinh ra, verified_commit cd672d86), 15 eval + 5 lệnh suite hồi quy đều PASS/exit 0 lại trên cây đã vá. Review scope-triage vòng này phân loại thêm 7 lỗi phát hiện được là NGOÀI hợp đồng (5 known-limits, 2 new-contract) — không lỗi nào rơi vào một AC nào của hợp đồng.

### Re-pin lần 1 — 2026-09-21, do chiến dịch ghim lại theo mốc 2.18.0
run_id: repin-20260921T175037Z-33397
sha: 41b949dec2245c147ff1460ba6e70e41e5fbb6df · suites: 5 lệnh exit 0 · evals: 15/15 eval máy đạt kỳ vọng
