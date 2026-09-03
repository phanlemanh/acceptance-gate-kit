---
schema_version: 2
feature_slug: release-2-8-0
verdict: REJECT
failed_evals: [E1, E2, E3c, E6, E3e]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0e411b2858d14032437d060428ed6b78f6573753
human_signoff:
---

# Evidence Report: release-2-8-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | FAIL |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | FAIL |
| E6 | AC-6 | test | FAIL |

## Evidence

- eval: E1
  run_id: minted-release-2-8-0-E1-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
    P187 khoi Cong 2 khong-ky-duoc: 'khong can lam gi' + 3 nhanh verdict (E3)
    MUTANT: da gop ba

    [output was truncated; full test log contains extensive test results with many PASS status entries for comprehensive plugin test suite covering vendor engine, feature-loop skills, decision commands, gate card rendering, fixture validation, and measure-birth-clause tests]

- eval: E2
  run_id: minted-release-2-8-0-E2-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
    P187 khoi Cong 2 khong-ky-duoc: 'khong can lam gi' + 3 nhanh verdict (E3)
    MUTANT: da gop ba

    [output was truncated; full test log contains extensive test results with many PASS status entries for comprehensive plugin test suite covering vendor engine, feature-loop skills, decision commands, gate card rendering, fixture validation, and measure-birth-clause tests]

- eval: E3
  run_id: minted-release-2-8-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
    Results: 796 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-8-0-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
      PASS: V06

    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-8-0-E3c-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
    P187 khoi Cong 2 khong-ky-duoc: 'khong can lam gi' + 3 nhanh verdict (E3)
    MUTANT: da gop ba

    [output was truncated; full test log contains extensive test results with many PASS status entries for comprehensive plugin test suite covering vendor engine, feature-loop skills, decision commands, gate card rendering, fixture validation, and measure-birth-clause tests]

- eval: E3d
  run_id: minted-release-2-8-0-E3d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-8-0-E3e-r1
  exit_code: 1
  baseline: green
  verifier: scripts/product-map.mjs
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
    PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .

- eval: E6
  run_id: minted-release-2-8-0-E6-r1
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-04T10:30:00+07:00
  output: |
    P187 khoi Cong 2 khong-ky-duoc: 'khong can lam gi' + 3 nhanh verdict (E3)
    MUTANT: da gop ba

    [output was truncated; full test log contains extensive test results with many PASS status entries for comprehensive plugin test suite covering vendor engine, feature-loop skills, decision commands, gate card rendering, fixture validation, and measure-birth-clause tests]

### Lệnh suite (hồi quy)

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-release-2-8-0-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-09-04T10:30:00+07:00

## Known limits

## Ngoài hợp đồng

## Analyst

- E3, E3b, E3d — pass trên cả HEAD lẫn baseline (diffBase); ba eval quy-hồi
  (`tests/scripts`, `tests/hooks`, `tests/workflows`) không phân biệt được
  vòng tính năng này — cân nhắc viết lại để assert hành vi mới của vòng này,
  hoặc xác nhận đây là regression-guard có chủ ý và giữ nguyên.

## Variance

none — không có eval nào chạy nhiều lần (runs > 1) trong vòng này.

## Iterations

(chưa có vòng trước — đây là vòng VERIFY đầu tiên của hồ sơ này. Vòng 1:
E1, E2, E3c, E6 fail cùng lượt chạy `bash tests/plugins/run-tests.sh` — exit
1; E3e fail ở `node scripts/product-map.mjs --check` — exit 1. Nguyên nhân
gốc: commit 0e411b28 lật `contract.md` từ `status: draft` sang
`status: implemented` nhưng không chạy lại `node scripts/product-map.mjs
--root .` để vẽ lại PRODUCT-MAP.md, kéo theo hai ca P122/P126 trong suite
plugins đỏ theo. Verdict: REJECT, trả về S3 để sửa.)
