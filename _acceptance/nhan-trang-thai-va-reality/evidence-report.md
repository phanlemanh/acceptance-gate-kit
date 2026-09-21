---
schema_version: 2
feature_slug: nhan-trang-thai-va-reality
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 41b949dec2245c147ff1460ba6e70e41e5fbb6df
human_signoff: Phan Le Manh 2026-09-21 — ký lượt chấm 2; Ngoài-1…Ngoài-8 ghi Known limits; đồng ý phần cắt/hoãn; phê hết Treo
---

# Evidence Report: nhan-trang-thai-va-reality

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

## Evidence

- eval: E1
  run_id: minted-nhan-trang-thai-va-reality-E1-r1
  exit_code: 0
  verifier: config:executors.script.ntr_thuoc
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E2
  run_id: minted-nhan-trang-thai-va-reality-E2-r1
  exit_code: 0
  verifier: config:executors.script.ntr_thuoc
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E3
  run_id: minted-nhan-trang-thai-va-reality-E3-r1
  exit_code: 0
  verifier: config:executors.script.ntr_thuoc
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E4
  run_id: minted-nhan-trang-thai-va-reality-E4-r1
  exit_code: 0
  verifier: config:executors.script.ntr_the
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E5
  run_id: minted-nhan-trang-thai-va-reality-E5-r1
  exit_code: 0
  verifier: config:executors.script.ntr_the
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E6
  run_id: minted-nhan-trang-thai-va-reality-E6-r1
  exit_code: 0
  verifier: config:executors.script.ntr_the
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E7
  run_id: minted-nhan-trang-thai-va-reality-E7-r1
  exit_code: 0
  verifier: config:executors.script.ntr_the
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E8
  run_id: minted-nhan-trang-thai-va-reality-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ntr_luoi
  verified_at: 2026-09-21T11:10:23Z
  output: |
    PASS: NL-AC10-mo-lai — pre-merge 1 · recheck 0, đúng thông điệp ghim

    Results: 10 passed, 0 failed (ntr-luoi)

- eval: E9
  run_id: minted-nhan-trang-thai-va-reality-E9-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ntr_trang_thai
  verified_at: 2026-09-21T11:10:23Z
  output: |
    PASS: NS-AC9-sai — gõ sai giá trị: vẫn hồ sơ hỏng «status không nhận diện được: da-cham-boi-thuc-t»

    Results: 3 passed, 0 failed (ntr-trang-thai)

- eval: E10
  run_id: minted-nhan-trang-thai-va-reality-E10-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ntr_luoi
  verified_at: 2026-09-21T11:10:23Z
  output: |
    PASS: NL-AC10-mo-lai — pre-merge 1 · recheck 0, đúng thông điệp ghim

    Results: 10 passed, 0 failed (ntr-luoi)

- eval: E11
  run_id: minted-nhan-trang-thai-va-reality-E11-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ntr_observed
  verified_at: 2026-09-21T11:10:23Z
  output: |
    PASS: NO-AC11-than — khuôn THUC-TE-LINE qua thucTe ra dòng hợp lệ; đổi tên vế build_sha → dong-so-thieu nêu build_sha

    Results: 4 passed, 0 failed (ntr-observed)

- eval: E12
  run_id: minted-nhan-trang-thai-va-reality-E12-r1
  exit_code: 0
  verifier: config:executors.script.ntr_the
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

- eval: E13
  run_id: minted-nhan-trang-thai-va-reality-E13-r1
  exit_code: 0
  verifier: config:executors.script.ntr_hieu_chuan
  verified_at: 2026-09-21T08:25:33Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-nhan-trang-thai-va-reality-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-21T11:10:23Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nhan-trang-thai-va-reality-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-21T11:10:23Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nhan-trang-thai-va-reality-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-21T11:10:23Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nhan-trang-thai-va-reality-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-21T11:10:23Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nhan-trang-thai-va-reality-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-21T11:10:23Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — không có eval nào khai runs > 1 (không có eval ngẫu nhiên trong vòng này)

## Iterations

Round 1: BLOCKED — tác tử kiểm bản đồ bị nhiễm tin chuyển tiếp «gỡ goal», không xác minh được lệnh suite product-map; sau đó S3 thêm `id` bắt buộc cho dòng quan sát (AC-10) trước khi verify lại.
Round 2 (báo cáo này): toàn bộ 13 eval gắn AC (E1–E13, carry-forward E1–E7/E12/E13 từ round 1, chạy mới E8–E11 với ca NL-AC10-thieu-id) và cả 5 lệnh suite hồi quy đều PASS.

### Re-pin lần 1 — 2026-09-21, do chiến dịch ghim lại theo mốc 2.18.0
run_id: repin-20260921T175037Z-33397
sha: 41b949dec2245c147ff1460ba6e70e41e5fbb6df · suites: 5 lệnh exit 0 · evals: 13/13 eval máy đạt kỳ vọng
