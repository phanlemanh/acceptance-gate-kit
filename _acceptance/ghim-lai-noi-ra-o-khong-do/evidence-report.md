---
schema_version: 2
feature_slug: ghim-lai-noi-ra-o-khong-do
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1665a2b237e4c3a651d921bcbe64fe470be950ee
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
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_khoa_kieu
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN01 dòng ghim nêu ô ngoài làn máy; ba tập rời nhau, hợp = tập id (0.8s)

    Results: 1 passed, 0 failed

- eval: E2
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_vang_han
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN02 hồ sơ toàn eval máy: khoá tuỳ chọn VẮNG HẲN, không phải mảng rỗng (0.5s)

    Results: 1 passed, 0 failed

- eval: E3
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_section
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN03 section Re-pin nêu ô ngoài làn máy + AC không có chốt máy; hồ sơ toàn máy thì im (4.4s)

    Results: 1 passed, 0 failed

- eval: E4
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_khuon_skill
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN04 khoá dòng ghim của script == khoá khuôn REPIN-TEMPLATE, cả ca đủ ba khoá tuỳ chọn (1.0s)

    Results: 1 passed, 0 failed

- eval: E5
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_guide_nguong
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN05 SKILL + GUIDE §7.1 khai khoá touched; lệnh đếm ngưỡng của GUIDE chạy thật (1.2s)

    Results: 1 passed, 0 failed

- eval: E6
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_diff_cham
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN06 diff từ PIN CŨ chạm paths của ô ngoài làn máy → khoá touched, không chặn (1.9s)

    Results: 1 passed, 0 failed

- eval: E7
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_glob_mot_nguon
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN07 khớp glob bằng globToRe của carry-plan (* không xuyên /); đọc cả paths flow lẫn block-seq (2.5s)

    Results: 1 passed, 0 failed

- eval: E8
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_ben_doc_cu
  verified_at: 2026-09-20T06:24:31Z
  output: |
    PASS: GN08 dòng ghim mang khoá mới: bên đọc hiện tại VÀ bên đọc 2.17.0 đều xanh, không VIOLATION (2.2s)

    Results: 1 passed, 0 failed

- eval: E9
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_the_cong_2
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN09 thẻ Cổng Bằng chứng: cờ AC không có chốt máy + cờ pin đã chạm, round-trip với section (6.4s)

    Results: 1 passed, 0 failed

- eval: E10
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_the_cong_1
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN10 thẻ Cổng Phạm vi: cùng vị từ AC không có chốt máy, chiều im khi toàn eval máy (1.2s)

    Results: 1 passed, 0 failed

- eval: E11
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_w8_gia
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN11 W8 giữ tiền tố cũ và NỐI câu giá; hợp đồng không có mặt người nhìn thì im (0.8s)

    Results: 1 passed, 0 failed

- eval: E12
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_suite_con_lai
  verified_at: 2026-09-20T06:24:31Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

    [exited with code 0]

- eval: E13
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_bo_chon
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: GN12 bộ chọn GNRO_CASES: một ca in đúng một dòng; khớp 0 ca thì đỏ có tên (0.5s)

    Results: 1 passed, 0 failed

- eval: E14
  run_id: minted-ghim-lai-noi-ra-o-khong-do-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gnro_hat_giong
  verified_at: 2026-09-20T06:24:31Z
  output: |
      PASS: P201 ngan khong-sua co ten + duong doc-cu + mutant

    Results: all plugin tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-20T06:24:31Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-20T06:24:31Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-20T06:24:31Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-20T06:24:31Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ghim-lai-noi-ra-o-khong-do-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-20T06:24:31Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round trước — baseline không đo lại round này.

## Variance

none — every multi-run eval is uniform.

## Iterations

Round 1: E12 (gnro_suite_con_lai) failed — lệnh tổng (bốn suite + product-map --check) thoát 141 (SIGPIPE từ grep sau khi không khớp pattern "PASS: GN01"), log liệt kê một RED lane (s1 E14 exit 4) và nhiều evidence thiếu tham chiếu config.yaml; verdict giữ REJECT, trả về implementation trước khi chạy lại.
Round 2: E12 hết SIGPIPE (lệnh tổng nay hứng stdout vào biến rồi khớp bằng case, không còn ống vào grep -q), GN08 đối chứng đỏ nay chạy cả bốn bộ đọc thay vì hai, E11 khai lại đúng theo chữ của vật (cùng tiêu chí); toàn bộ 14 eval + 5 lệnh suite thoát 0 — verdict PASS.
