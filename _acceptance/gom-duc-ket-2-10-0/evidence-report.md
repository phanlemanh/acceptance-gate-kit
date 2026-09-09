---
schema_version: 2
feature_slug: gom-duc-ket-2-10-0
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fc4144945a5649fd834750f391b57a1a409f3bc4
human_signoff:
---

# Evidence Report: gom-duc-ket-2-10-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E8b | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-gom-duc-ket-2-10-0-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_lnt_do
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-gom-duc-ket-2-10-0-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_c1_nho
  verified_at: 2026-09-09T09:12:00Z
  output: |
    PASS: NO3 — ba bộ đọc + hai đường cắt hội tụ trên 4 fixture; mutant \s*# bị bắt
    PASS: NO4 — 2 helper đọc stdout thẻ đều bỏ ANSI (ma trận toàn phần + chiều đỏ của phép quét)
    lnt-no: OK (NO1, NO2, NO3, NO4)

- eval: E3
  run_id: minted-gom-duc-ket-2-10-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k1
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-gom-duc-ket-2-10-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k2
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-gom-duc-ket-2-10-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k3
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5b
  run_id: minted-gom-duc-ket-2-10-0-E5b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k3_cay_that
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-gom-duc-ket-2-10-0-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k4
  verified_at: 2026-09-09T09:14:00Z
  output: |
    stale-paths: OK (SP1, SP2, SP3, SP4, SP5, SP6, SP7)

- eval: E7
  run_id: minted-gom-duc-ket-2-10-0-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k5
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-gom-duc-ket-2-10-0-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k6
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8b
  run_id: minted-gom-duc-ket-2-10-0-E8b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k6_cay_that
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-gom-duc-ket-2-10-0-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k7
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9b
  run_id: minted-gom-duc-ket-2-10-0-E9b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k7_the
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-gom-duc-ket-2-10-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gdk_k8
  verified_at: 2026-09-09T02:05:00Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-09T09:16:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-09T09:18:00Z

- cmd: bash tests/plugins/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_plugins_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-09T09:20:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-gom-duc-ket-2-10-0-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-09T09:22:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-gom-duc-ket-2-10-0-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-09-09T09:24:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round truoc — baseline khong do lai round nay

none (baseline không đo lại round này — mọi eval carry giá trị "n-a")

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: E1, E3, E4, E5, E5b, E7, E8, E8b, E9, E9b, E10 PASS trên harness hiện tại — carry-forward sang round 3 (delta không chạm paths của các eval này).
Round 3: chạy lại E2 (lnt-no), E6 (stale-paths) và toàn bộ 5 lệnh suite hồi quy — tất cả PASS (861+67+plugin+51 test + product-map check, exit 0). Review độc lập phát hiện 1 finding HIGH trong hợp đồng (AC-6: `staleScope()` ở `lib/evidence-core.cjs:680` fail-open khi executor có chú thích/trailing comment — không dùng `stripComment` chung nguồn với `lib/eval-yaml.cjs`) — verdict REJECT, quay lại implementation để vá staleScope trước khi verify lại.
