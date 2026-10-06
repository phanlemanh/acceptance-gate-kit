---
schema_version: 2
feature_slug: gia-lan-ghim-lai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2341eb013a3a0a1dab05e4d2011ef7703cc4fe19
human_signoff: Phan Le Manh 2026-10-06
---

# Evidence Report: gia-lan-ghim-lai

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
  run_id: minted-gia-lan-ghim-lai-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac1
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 1
    AC-1: XANH — chiều xanh đủ, 7 phép phá đều bị bắt đúng thông điệp ghim

- eval: E2
  run_id: minted-gia-lan-ghim-lai-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac2
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 2
    AC-2: XANH — chiều xanh đủ, 5 phép phá đều bị bắt đúng thông điệp ghim

- eval: E3
  run_id: minted-gia-lan-ghim-lai-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac3
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 3
    AC-3: XANH — chiều xanh đủ, 1 phép phá đều bị bắt đúng thông điệp ghim

- eval: E4
  run_id: minted-gia-lan-ghim-lai-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac4
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 4
    AC-4: XANH — chiều xanh đủ, 2 phép phá đều bị bắt đúng thông điệp ghim

- eval: E5
  run_id: minted-gia-lan-ghim-lai-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac5
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 5
    AC-5: XANH — chiều xanh đủ, 3 phép phá đều bị bắt đúng thông điệp ghim

- eval: E6
  run_id: minted-gia-lan-ghim-lai-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac6
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 6
    AC-6: XANH — chiều xanh đủ, 2 phép phá đều bị bắt đúng thông điệp ghim

- eval: E7
  run_id: minted-gia-lan-ghim-lai-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac7
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 7
    AC-7: XANH — chiều xanh đủ, 4 phép phá đều bị bắt đúng thông điệp ghim

- eval: E8
  run_id: minted-gia-lan-ghim-lai-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gg_ac8
  verified_at: 2026-10-06T06:50:56Z
  output: |
    cmd: node _acceptance/gia-lan-ghim-lai/rang/chan.mjs --ac 8
    AC-8: XANH — chiều xanh đủ, 3 phép phá đều bị bắt đúng thông điệp ghim

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-gia-lan-ghim-lai-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-gia-lan-ghim-lai-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-06T06:50:56Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi).

Không có eval nào được liệt kê là không-phân-biệt. Các lệnh suite xanh ở cả hai phía là regression-guard bình thường, không liệt kê.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, deterministic).

## Iterations

Round 1: REJECT — một lỗi trong hợp đồng, lệnh dùng chung với eval model thật vẫn bị chạy lại. Returned to implementation.
Round 2: REJECT — lỗi trong hợp đồng cùng lớp (tập lệnh model khoá theo env «full»), dừng-vá; đổi khuôn: cờ model xét ở MỘT điểm dựng bản ghi, ma trận nhánh × env. Returned to implementation.
Round 3: PASS — 8 eval máy và 10 lệnh suite xanh trên verified_commit; các phát hiện ngoài hợp đồng nằm ở review-findings.md để người quyết ở Gate 2.

### Re-pin lần 1 — 2026-10-06, do hoá cũ do mốc 2.23.0 (manifest, config.yaml, GUIDE)
run_id: repin-20261006T112535Z-18651
sha: 892755ec6014ccc4312afddca594c77ac2ce416c · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-10-06, do hoá cũ do mốc 2.23.0 và PR #271 (engine: repin-lane, evidence-core, pre-merge)
run_id: repin-20261006T141021Z-66326
sha: 2341eb013a3a0a1dab05e4d2011ef7703cc4fe19 · suites: 10 lệnh exit 0 · evals: 8/8 eval máy đạt kỳ vọng
