---
schema_version: 2
feature_slug: cong-nguoi-doc-du-nguon
verdict: REJECT
failed_evals: [E16]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6f57ccd8301e9e59fc6675c11afec7ed2c461641
findings_open: 12
human_signoff:
---

# Evidence Report: cong-nguoi-doc-du-nguon

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
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |
| E13 | AC-13 | script | PASS |
| E14 | AC-14 | script | PASS |
| E15 | AC-12 | script | PASS |
| E16 | AC-12 | script | FAIL |
| E17 | AC-12 | script | PASS |
| E18 | AC-15 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cong-nguoi-doc-du-nguon-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_luat_thu_bay
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · lý do bash CHỨA nguyên văn lý do mjs

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E2
  run_id: minted-cong-nguoi-doc-du-nguon-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_mot_nguon
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · mũi (c): bash tự duyệt = 1 lần

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E3
  run_id: minted-cong-nguoi-doc-du-nguon-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_fail_closed
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vắng node: nêu đích danh thứ thiếu=true

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E4
  run_id: minted-cong-nguoi-doc-du-nguon-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_khai_lech_vat
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · khoá 2 · 2 mục · 2 định đoạt → clean=false why="lời khai lệch vật: findings_open khai 2, vật còn 0 mục chờ người (2+0 "

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E5
  run_id: minted-cong-nguoi-doc-du-nguon-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_duong_doc_cu
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vắng hẳn tệp: VIOLATION=0

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E6
  run_id: minted-cong-nguoi-doc-du-nguon-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_cua_ghi
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · 2 mục + 2 dòng sổ gate2: mã=0, status→machine-cleared

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E7
  run_id: minted-cong-nguoi-doc-du-nguon-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_ac_tieu_de
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · ba ca nguyên văn từ hợp đồng thật: đạt

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E8
  run_id: minted-cong-nguoi-doc-du-nguon-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_tieu_de_muc
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · không mục nào → AC-1,AC-2

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E9
  run_id: minted-cong-nguoi-doc-du-nguon-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_bo_do_khong_im
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · bỏ sót 6/6 → blank

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E10
  run_id: minted-cong-nguoi-doc-du-nguon-E10-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_the_cong_2
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vị trí: Trong=3297 Ngoài=3741

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E11
  run_id: minted-cong-nguoi-doc-du-nguon-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_cross_layer_hai_nhanh
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · nhánh awk   → nêu AC-1 xuyên lớp: true

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E12
  run_id: minted-cong-nguoi-doc-du-nguon-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cndn_luoi_chep_san_co
  verified_at: 2026-09-13T00:00:00Z
  output: |
    PASS: CE7 red: lib/gap-probe đuôi .js chạy classify trong type:module → cùng lớp ReferenceError

    Results: 9 passed, 0 failed

- eval: E13
  run_id: minted-cong-nguoi-doc-du-nguon-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_bon_ben_goi
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · cả bốn bên đổi theo mũi tiêm — chúng cùng một nguồn

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E14
  run_id: minted-cong-nguoi-doc-du-nguon-E14-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_round_trip_writer
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · chiều đỏ: khuôn đổi → bên đọc ra 0 (phải khác 3)

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E15
  run_id: minted-cong-nguoi-doc-du-nguon-E15-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_lop_chep_ci
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · bản tiêm: thiếu=["lib/out-of-contract.cjs"] mã=1

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E16
  run_id: minted-cong-nguoi-doc-du-nguon-E16-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.coverage_lint
  verified_at: 2026-09-13T00:00:00Z
  output: |
    W1 = a bounded/threshold criterion needs a just-below should-NOT-fire (boundary) eval; W3 = give the out-of-scope half real negative evals; W4 = a (cross-layer) criterion needs a paired layer: backend-effect eval; W5 = a mobile-surface contract needs a "Mobile backend target:" line; W6 = the contract uses a word this repo's CONTEXT.md ruled out under _Avoid_; W7 = a criterion-shaped line did not parse, so every warning above ran on an incomplete AC set — fix the contract line first, then re-read this output; W8 = a human-visible surface (ui/web/web-ui) needs ≥1 executor: ui-check eval per contract (label layer: ui-observed), or a named descope "bỏ ui-observed — …".

- eval: E17
  run_id: minted-cong-nguoi-doc-du-nguon-E17-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_ban_kinh
  verified_at: 2026-09-13T00:00:00Z
  output: |
    ]
    }
    }

- eval: E18
  run_id: minted-cong-nguoi-doc-du-nguon-E18-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_coverage_bang
  verified_at: 2026-09-13T00:00:00Z
  output: |
    · vắng hẳn: coverage_missing=true, còn cờ vàng=true

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r1
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-13T00:00:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

E12 — lưới quan hệ sẵn có `tests/scripts/consumer-esm.test.mjs` (chân thứ nhất của AC-12, đo tầng seam CE1/CE2 giữa marker chép và hai tệp cưỡng chế): baseline `green` — pass trên CẢ HEAD lẫn diffBase, tức phép đo không phân biệt được bằng feature này. Đây là regression-guard sẵn có bảo vệ một lớp đã ổn định từ trước vòng cong-nguoi-doc-du-nguon (không phải hành vi mới của vòng này), không phải một test cần viết lại — chân thứ hai của AC-12 (E15, đo bao đóng bắc cầu của danh sách chép CI) mới là phần mới sinh bởi vòng này và đã `red` đúng trên baseline (xem bảng).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E16 failed — `node scripts/eval-coverage-lint.js .` thoát 1. Bán kính bản vá (AC-12) làm ~1500 tiêu chí trở nên nhìn thấy với lint, sinh cảnh báo mới chưa được xử lý hết hoặc khai known-limits/new-contract đầy đủ (chi tiết + phân loại từng cảnh báo nằm ở review-findings.md). Trả về implementation.