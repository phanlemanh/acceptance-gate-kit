---
schema_version: 2
feature_slug: trang-thai-dot-dieu-phoi-tho
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dec146af99c8469990455fdb947e6bb52be10543
human_signoff: manh 2026-10-13
---

# Evidence Report: trang-thai-dot-dieu-phoi-tho

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E9b | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_khung
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node --test tests/dieu-phoi, chung các eval E1–E4)
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi

- eval: E2
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_khung
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node --test tests/dieu-phoi, chung các eval E1–E4)
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>tam-dung · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi

- eval: E3
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_khung
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node --test tests/dieu-phoi, chung các eval E1–E4)
    #   nhap>dang-dong · tu-choi · tu-choi
    #   nhap>dang-ban-giao · tu-choi · tu-choi
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi

- eval: E4
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_khung
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node --test tests/dieu-phoi, chung các eval E1–E4)
    #   nhap>nhap · cheo · cheo
    #   nhap>dang-chay · hop-le · hop-le
    #   nhap>cho-tiep-tuc · tu-choi · tu-choi

- eval: E5
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_khung_mod
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node tests/dieu-phoi/kiem-khung.mjs, chung các eval E5–E9)
    PASS: KH-09-do argv · khung.ts: argv process.run không kết thúc 'xem','--json': ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'pha', 'dang-chay']

- eval: E6
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_khung_mod
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node tests/dieu-phoi/kiem-khung.mjs, chung các eval E5–E9)
    PASS: KH-09-do argv · khung.ts: argv process.run không kết thúc 'xem','--json': ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'pha', 'dang-chay']

- eval: E7
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_khung_mod
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node tests/dieu-phoi/kiem-khung.mjs, chung các eval E5–E9)
    PASS: KH-09-do argv · khung.ts: argv process.run không kết thúc 'xem','--json': ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'pha', 'dang-chay']

- eval: E8
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_khung_mod
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node tests/dieu-phoi/kiem-khung.mjs, chung các eval E5–E9)
    PASS: KH-09-do argv · khung.ts: argv process.run không kết thúc 'xem','--json': ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'pha', 'dang-chay']

- eval: E9
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_khung_mod
  verified_at: 2026-10-12T20:49:03Z
  output: |
    (đuôi đầu ra của lệnh node tests/dieu-phoi/kiem-khung.mjs, chung các eval E5–E9)
    PASS: KH-09-do argv · khung.ts: argv process.run không kết thúc 'xem','--json': ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'pha', 'dang-chay']

- eval: E9b
  run_id: minted-trang-thai-dot-dieu-phoi-tho-E9b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_mod
  verified_at: 2026-10-12T19:24:33Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-trang-thai-dot-dieu-phoi-tho-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-12T20:49:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi).

Eval không-phân-biệt (xanh trên CẢ cây đang kiểm lẫn baseline diffBase; chứng minh harness chứ chưa chứng minh feature — viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):
- E1, E2, E3, E4 (lệnh node --test tests/dieu-phoi/**/*.test.mjs): green trên baseline ở round 1.
- E9b (lệnh node tests/dieu-phoi/kiem-mod.mjs): green trên baseline ở round 1; là răng của hồ sơ đã ký dieu-phoi-doi-tai-khoan, giữ nguyên làm regression-guard.

Baseline khong do
- node tests/dieu-phoi/kiem-khung.mjs: carried tu round 1 — tep chua co o merge-base nen eval moi, chay tren code cu khong phan biet gi.

Judge panels: không có eval judgment trong vòng này; không có mục nào chờ người.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E9b đều xanh, không eval nào thất bại. Review-findings: 1 finding trong hợp đồng (AC-6) và 5 finding ngoài hợp đồng, xem review-findings.md.
Round 2: sau nhát sửa lớp assertion âm-tính (AC-6 argv bằng gốc gói, đối chứng dương và thông điệp ghim cho ca đỏ), E1–E9 chạy lại và đều xanh, E9b carry-forward từ round 1 vì delta không chạm paths của nó; 10 lệnh suite xanh. Review-findings round 2: 0 finding trong hợp đồng, 1 finding ngoài hợp đồng mới, 5 mục ngoài hợp đồng carry từ round 1.

### Re-pin lần 1 — 2026-10-13, do gộp main 4c791556 (v2.28.0 + #334 + S3c #335) sau chữ ký Cổng 2 của trang-thai-dot-dieu-phoi-tho
run_id: repin-20261012T232028Z-56508
sha: dec146af99c8469990455fdb947e6bb52be10543 · suites: 10 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng
