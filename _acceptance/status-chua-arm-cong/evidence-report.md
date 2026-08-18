---
schema_version: 2
feature_slug: status-chua-arm-cong
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f8de779820fdc89276497f028736742cfef938c3
human_signoff:
---

# Evidence Report: status-chua-arm-cong

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5a | AC-5 | test | PASS |
| E5b | AC-5 | test | PASS |
| E5c | AC-5 | test | PASS |
| E5d | AC-5 | test | PASS |
| E5e | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-status-chua-arm-cong-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T09:40:00Z
  output: |
    PASS: ARM13-mut

    Results: 750 passed, 0 failed

- eval: E2
  run_id: minted-status-chua-arm-cong-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T09:40:00Z
  output: |
    PASS: ARM13-mut

    Results: 750 passed, 0 failed

- eval: E3
  run_id: minted-status-chua-arm-cong-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T09:40:00Z
  output: |
    PASS: ARM13-mut

    Results: 750 passed, 0 failed

- eval: E4
  run_id: minted-status-chua-arm-cong-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T09:40:00Z
  output: |
    PASS: ARM13-mut

    Results: 750 passed, 0 failed

- eval: E5a
  run_id: minted-status-chua-arm-cong-E5a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T09:40:00Z
  output: |
    PASS: ARM13-mut

    Results: 750 passed, 0 failed

- eval: E5b
  run_id: minted-status-chua-arm-cong-E5b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-18T09:40:00Z
  output: |
    PASS: V06

    Results: 60 passed, 0 failed

- eval: E5c
  run_id: minted-status-chua-arm-cong-E5c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-18T09:40:00Z
  output: |
    PASS: P199 hfl_clause mot nguon: 6 ca fixture code-sinh + hai khoi (P90 va khoi Gate 1) cung import, khong chep tay (siet-rang-cau-ve-hinh E1 E2 E6 E7)

    Results: all plugin tests passed

- eval: E5d
  run_id: minted-status-chua-arm-cong-E5d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-18T09:40:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E5e
  run_id: minted-status-chua-arm-cong-E5e-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_arm_guide
  verified_at: 2026-08-18T09:40:00Z
  output: |
    RANG-ARM ok: GUIDE 7 hàng=1, 7.1 gạch=1
    RANG-ARM đỏ-1 ok
    RANG-ARM đỏ-2 ok

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt). 4 lệnh suite (tests/scripts, tests/hooks, tests/plugins, tests/workflows) có baseline: green ở cấp TOÀN SUITE — nhưng đó là suite regression-guard bình thường (phần lớn ca trong suite không thuộc feature này), nên theo quy ước không liệt vào đây.

## Variance

none — không có eval nào chạy nhiều lần (mọi eval đều runs=1, deterministic; không có eval nào crossing ctx.providers.invoke).

## Iterations

Round 1: toàn bộ 9 eval (E1–E5e) PASS ngay từ lượt đầu tiên; không có vòng REJECT nào trước đó, không có eval nào fail. `node scripts/product-map.mjs --root . --check` (không gắn AC nào) cũng PASS cùng lượt, xác nhận PRODUCT-MAP.md khớp hồ sơ xưởng.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
