---
schema_version: 2
feature_slug: khoi-khuon-tren-the-cong
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 668416d25ff2cea2968514c80490fe6b823e6f40
human_signoff:
---

# Evidence Report: khoi-khuon-tren-the-cong

Round 2. Cả tám eval của hợp đồng đều chạy xanh, nhưng một lệnh suite hồi quy không gắn eval nào (`tests/plugins/run-tests.sh --manh vung:3`) kết thúc với mã khác 0 nên vòng bị từ chối. Chi tiết ở mục «Lệnh suite (hồi quy)» bên dưới.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-khoi-khuon-tren-the-cong-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

- eval: E2
  run_id: minted-khoi-khuon-tren-the-cong-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

- eval: E3
  run_id: minted-khoi-khuon-tren-the-cong-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

- eval: E4
  run_id: minted-khoi-khuon-tren-the-cong-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

- eval: E5
  run_id: minted-khoi-khuon-tren-the-cong-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

- eval: E6
  run_id: minted-khoi-khuon-tren-the-cong-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

- eval: E7
  run_id: minted-khoi-khuon-tren-the-cong-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

- eval: E8
  run_id: minted-khoi-khuon-tren-the-cong-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khoi_khuon
  verified_at: 2026-11-03T16:32:04Z
  output: |
    node tests/scripts/khoi-khuon-tren-the-cong.test.mjs
    PASS: [KK-8-do2]

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-11-03T16:32:04Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-khoi-khuon-tren-the-cong-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-11-03T16:32:04Z

Lệnh suite không gắn eval nào và kết thúc khác 0: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`. Ca đỏ là P179 (sổ known-limits). Vì không eval nào cover lệnh này nên `failed_evals` để rỗng, nhưng vòng không được xanh khi một lệnh hồi quy đỏ.

Ghi chú về `mjs:2/3`: lệnh bị công cụ chuyển sang nền sau 600 giây (không bị giết) và chạy xong tự nhiên với mã 0. Tệp đầu ra có dòng kết thúc báo thành công ở cuối. Stdout không có run_id; mã trong khối trên là mã đã ghi trong sổ chạy.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — không có eval nào xanh trên cả hai phía được đánh dấu là không phân biệt; baseline của mọi eval ghi n-a vì round này không đo lại (evals.yaml không đổi từ lần baseline cuối ở round 1). Lệnh suite xanh cả hai phía là regression-guard thông thường, không liệt kê.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lượt chấm 1 đạt tám trên tám eval nhưng kèm một lỗi trong hợp đồng (KK-4-do2 xanh rỗng: bản tiêm làm bộ đọc sập mà ca vẫn xanh). Returned to implementation (commit 668416d2 sửa KK-4-do2 chạy được về ngữ nghĩa, ca phá thử KK-4 ghim chỉ hàng đích đỏ).
Round 2: tám eval E1 đến E8 đều xanh; lệnh suite hồi quy `tests/plugins/run-tests.sh --manh vung:3` đỏ ở P179 (sổ known-limits, không gắn eval nào) nên verdict REJECT. Một finding ngoài hợp đồng mới (hình dạng 4, cờ chiMot chưa phủ các ca còn lại) ghi ở review-findings.md.
