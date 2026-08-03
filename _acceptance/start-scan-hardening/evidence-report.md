---
schema_version: 2
feature_slug: start-scan-hardening
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 428bfdb32f4ca11c69932414682abbefbb279ae2
human_signoff:
---

# Evidence Report: start-scan-hardening

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-5 | test | PASS |
| E8 | AC-5 | test | PASS |
| E9 | AC-5 | test | PASS |
| E10 | AC-2 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-start-scan-hardening-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-start-scan-hardening-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-start-scan-hardening-E3-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-start-scan-hardening-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-start-scan-hardening-E5-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-start-scan-hardening-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T08:10:00Z
  output: |
    plugins/ mirror in sync.

- eval: E7
  run_id: minted-start-scan-hardening-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: GCV1d contract lanh khong sinh canh bao nao

    Results: 596 passed, 0 failed

- eval: E8
  run_id: minted-start-scan-hardening-E8-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: T42

    Results: 51 passed, 0 failed

- eval: E9
  run_id: minted-start-scan-hardening-E9-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-03T08:10:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E10
  run_id: minted-start-scan-hardening-E10-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T08:10:00Z
  output: |
      PASS: P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)

    Results: all plugin tests passed

## Analyst

- bash tests/plugins/run-tests.sh: E1, E2, E10, E3, E4, E5
- bash scripts/sync-plugin-packages.sh --check: E6
- bash tests/scripts/run-tests.sh: E7
- bash tests/hooks/run-tests.sh: E8
- bash tests/workflows/run-tests.sh: E9

## Variance

none — every multi-run eval is uniform.

## Iterations

Round 1: 9 eval máy (E1-E9) PASS ngay lần chạy đầu, nhưng review adversarial phát hiện lỗi TRONG hợp đồng AC-2 — verdict rỗng (khoá `verdict:` có mặt nhưng giá trị trống) lọt qua guard "thiếu verdict". Trả về implementation.
Round 2: re-verify 9 eval máy PASS (bao gồm chân (c) mới của E2 sau khi gộp guard rỗng=vắng dùng chung hai nhánh, S4-r1 fix); review adversarial round này lại phát hiện một THOÁI LUI do chính bản vá S4-r1 gây ra — `VERDICT_OK` bỏ sót BLOCKED khiến `implemented` + `verdict: BLOCKED` bị gọi "hồ sơ hỏng" thay vì giữ nguyên trạng đang-dở. Trả về implementation (S4-r2 fix: thêm BLOCKED vào `VERDICT_OK`, dựng P104 round-trip rút từ vựng từ khuôn writer).
Round 3 (vòng này): thêm E10 (P104), chạy lại toàn bộ 10 eval máy — tất cả PASS. Review round này tìm thêm các finding ngoài hợp đồng (nhánh `verified` vẫn bỏ sót BLOCKED cùng hình dạng vừa vá ở nhánh implemented, P102 chạy dưới root có thể che một loạt chân test mà vẫn báo PASS, contract AC-2 chưa cập nhật từ vựng theo BLOCKED) — đưa ra Gate 2 cho người quyết; không quay lại implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract