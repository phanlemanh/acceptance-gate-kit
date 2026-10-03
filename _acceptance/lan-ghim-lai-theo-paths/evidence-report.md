---
schema_version: 2
feature_slug: lan-ghim-lai-theo-paths
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b3547ce91627b0f902131916f2082d30aaa2892e
human_signoff:
---

# Evidence Report: lan-ghim-lai-theo-paths

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-lan-ghim-lai-theo-paths-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_doc_cu
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan doc-cu
    runs: 1, passes: 1

- eval: E2
  run_id: minted-lan-ghim-lai-theo-paths-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_nhay_dac_hieu
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan nhay-dac-hieu
    E2 XANH

- eval: E3
  run_id: minted-lan-ghim-lai-theo-paths-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_chi_thu
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan chi-thu
    E3 XANH

- eval: E4
  run_id: minted-lan-ghim-lai-theo-paths-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_hinh_ho_so
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan hinh-ho-so
      PASS: E4 chiều đỏ: bản sao «bộ đọc paths một dạng» → M10 lệch kỳ vọng (stale)
    E4 XANH

- eval: E5
  run_id: minted-lan-ghim-lai-theo-paths-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_khong_chay_duoc
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan khong-chay-duoc
    E5 XANH

- eval: E6
  run_id: minted-lan-ghim-lai-theo-paths-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_khoa_va_co
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan khoa-va-co
    E6 XANH

- eval: E7
  run_id: minted-lan-ghim-lai-theo-paths-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_mot_nguon
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan mot-nguon
    E7 XANH

- eval: E8
  run_id: minted-lan-ghim-lai-theo-paths-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_song_song
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan song-song
    E8 XANH

- eval: E9
  run_id: minted-lan-ghim-lai-theo-paths-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_loi_khong_xen
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan loi-khong-xen
    E9 XANH

- eval: E10
  run_id: minted-lan-ghim-lai-theo-paths-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lgtp_lan_doc_cu
  verified_at: 2026-10-03T08:25:40Z
  output: |
    cmd: bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan lan-doc-cu
    E10 XANH

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lan-ghim-lai-theo-paths-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-03T08:25:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi). Field baseline cua tung eval ghi n-a. Khong co eval khong-phan-biet nao duoc liet ke; cac lenh suite xanh-ca-hai-phia la regression-guard binh thuong.

## Variance

none — moi eval chay mot lan (deterministic), khong co eval nhieu lan chay hay phuong sai.

## Iterations

Round 1: cả 10 eval máy (E1–E10) và các lệnh suite đều xanh; vẫn REJECT vì khối tìm lỗi xác nhận 3 lỗi nằm TRONG hợp đồng (AC-5 bộ lọc paths mở khi parse thứ hai sập · AC-4 ô M8 xanh nhờ nhánh khác · AC-10 chiều đỏ của làn chỉ ghim mã thoát). Returned to implementation.
Round 2: sau sửa S4-r1 (lưới đóng khi bộ lọc lỗi; evals.yaml hỏng nhận đúng; thước ghim lý do) cả 10 eval máy và toàn bộ lệnh suite xanh trên cây b3547ce9; baseline không đo lại (carried từ round 1). Verdict PASS.
