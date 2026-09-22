---
schema_version: 2
feature_slug: ho-so-khep-thoi-hoi
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 45e4a0b8f96f0ba77745885669f158ed2cb1e566
human_signoff:
---

# Evidence Report: ho-so-khep-thoi-hoi

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

## Evidence

- eval: E1
  run_id: minted-ho-so-khep-thoi-hoi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T04:03:50Z
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E2
  run_id: minted-ho-so-khep-thoi-hoi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T04:03:50Z
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E3
  run_id: minted-ho-so-khep-thoi-hoi-E3-r1
  exit_code: 0
  verifier: config:executors.script.hskt_ce
  verified_at: 2026-09-22T02:45:57Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E4
  run_id: minted-ho-so-khep-thoi-hoi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T04:03:50Z
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E5
  run_id: minted-ho-so-khep-thoi-hoi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T04:03:50Z
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E6
  run_id: minted-ho-so-khep-thoi-hoi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T04:03:50Z
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

- eval: E7
  run_id: minted-ho-so-khep-thoi-hoi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hskt_bo_do
  verified_at: 2026-09-22T04:03:50Z
  output: |
    lan-status-not-run: 13/13 ca xanh
    PASS: HK-AC7-dot-bien — gỡ bộ lọc khép: NS-AC9-cu đỏ «… bản sau vòng khác bản trước vòng», L05 đỏ «bản sao TRƯỚC khi tiêm đã có hồ sơ đỏ (release-2-0-0)»
    Results: 1 passed, 0 failed (hskt)

- eval: E8
  run_id: minted-ho-so-khep-thoi-hoi-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hskt
  verified_at: 2026-09-22T04:03:50Z
  output: |
    PASS: HK-AC8-dot-bien — bỏ truyền tệp phát hiện ở từng bên gọi (3) → ca của bên ấy đỏ

    Results: 18 passed, 0 failed (hskt)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-22T04:03:50Z
  output: |
    Results: 892 passed, 0 failed

    [exited with code 0]

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-22T04:03:50Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-22T04:03:50Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-22T04:03:50Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-ho-so-khep-thoi-hoi-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-22T04:03:50Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

- E7 — lệnh `ntr-trang-thai.test.mjs && lan-status-not-run.test.mjs && hskt.test.mjs HK-AC7-dot-bien` pass trên cả HEAD lẫn baseline (non-discriminating theo phép đo round 1); cần viết lại để assert hành vi mới, hoặc xác nhận đây là regression-guard có chủ ý.

## Variance

none — không có eval nào runs > 1 trong round này (mọi eval chạy tất định, deterministic).

## Iterations

Round 1: BLOCKED — suite `tests/scripts/run-tests.sh` bị công cụ ngắt ở mốc 600 giây (timeout), 7/8 eval máy trả về nhưng round không đóng được; quay lại re-run với timeout dài hơn.
Round 2: 8/8 eval máy PASS (E1,E2,E4,E5,E6,E8 qua hskt; E7 qua bộ ba script trạng thái; E3 carry-forward từ round 1) và 5/5 lệnh suite PASS — verdict PASS.
