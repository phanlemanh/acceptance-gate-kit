---
schema_version: 2
feature_slug: cham-khong-tu-dot-luot
verdict: BLOCKED
failed_evals: []
reason: |
  3 lệnh suite hồi quy có mã thoát không đọc được (thiếu dòng __EXIT=) nên không tính PASS:
  - bash tests/scripts/run-tests.sh --manh bash
  - bash tests/hooks/run-tests.sh
  - bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  Chín eval máy (E1-E9) và eval judgment (E10) đã chạy xong và đạt; bảy lệnh suite khác cũng thoát sạch. Ba lệnh trên cần chạy lại trên hạ tầng đọc được dòng __EXIT= — không phải sửa code.
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 67638883590c19465b1f65b832df1584a3652b2d
human_signoff:
---

# Evidence Report: cham-khong-tu-dot-luot

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
| E10 | AC-10 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-cham-khong-tu-dot-luot-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Chạy qua lệnh gộp ckdl-cham/ckdl-the/ckdl-do; script xác nhận có dòng
    "PASS: CK-AC1 ", "PASS: CK-AC1-khung ", "PASS: CK-AC1-dot-bien " trước khi
    thoát sạch. Tail chung: ckdl-do: 3 passed, 0 failed

- eval: E2
  run_id: minted-cham-khong-tu-dot-luot-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC2 ", "PASS: CK-AC2-ui ",
    "PASS: CK-AC2-dot-bien " trước khi thoát sạch.

- eval: E3
  run_id: minted-cham-khong-tu-dot-luot-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC3-r2 ", "PASS: CK-AC3-r3 ",
    "PASS: CK-AC3-dot-bien " trước khi thoát sạch.

- eval: E4
  run_id: minted-cham-khong-tu-dot-luot-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC4 ", "PASS: CK-AC4-dot-bien "
    trước khi thoát sạch.

- eval: E5
  run_id: minted-cham-khong-tu-dot-luot-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC5 ", "PASS: CK-AC5-dot-bien "
    trước khi thoát sạch.

- eval: E6
  run_id: minted-cham-khong-tu-dot-luot-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC6 ", "PASS: CK-AC6-crm ",
    "PASS: CK-AC6-co-vang ", "PASS: CK-AC6-dot-bien " trước khi thoát sạch.

- eval: E7
  run_id: minted-cham-khong-tu-dot-luot-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC7 ", "PASS: CK-AC7-clean ",
    "PASS: CK-AC7-dot-bien " trước khi thoát sạch.

- eval: E8
  run_id: minted-cham-khong-tu-dot-luot-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC8 ", "PASS: CK-AC8-doi-chung ",
    "PASS: CK-AC8-dot-bien " trước khi thoát sạch.

- eval: E9
  run_id: minted-cham-khong-tu-dot-luot-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ckdl
  verified_at: 2026-09-27T08:59:42Z
  output: |
    Cùng lệnh gộp; script xác nhận có dòng "PASS: CK-AC9 ", "PASS: CK-AC9-dot-bien "
    trước khi thoát sạch.

- eval: E10
  judged_by: judge panel — domain-correctness, operational-feasibility, spec-alignment (fresh context mỗi lens)
  verdict: PASS
  rationale: Cả ba lens đồng thuận PASS, không bất đồng. (a) Frontmatter SKILL.md
    feature-loop nêu rõ vòng chạy ở phiên cấp cao nhất có công cụ Workflow — tác
    tử con không có Workflow, không chạy vòng trong tác tử con. (b) eval-executors.md
    mục Exclusive resources nêu driver dùng tài nguyên độc quyền tự xếp hàng bên
    trong thước — kit không tuần tự hoá thay. (c) Khối marker TOOL-KILL-RULE, đoạn
    "DAU RA DAI", nêu rõ đầu ra bị cắt ra tệp và chỉ hiện đoạn đầu không phải bị
    công cụ giết — phải đọc đuôi (tail) tệp để lấy dòng tổng kết và mã thoát thật.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-09-27T08:59:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-09-27T08:59:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-09-27T08:59:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-09-27T08:59:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-09-27T08:59:42Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-27T08:59:42Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cham-khong-tu-dot-luot-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-27T08:59:42Z

### Lệnh suite BLOCKED (mã thoát không đọc được — không tính PASS)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  reason: ma thoat khong doc duoc (thieu dong __EXIT=) — khong tinh PASS
  verified_at: 2026-09-27T08:59:42Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_hooks_run_tests_sh-r1
  reason: ma thoat khong doc duoc (thieu dong __EXIT=) — khong tinh PASS
  verified_at: 2026-09-27T08:59:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cham-khong-tu-dot-luot-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  reason: ma thoat khong doc duoc (thieu dong __EXIT=) — khong tinh PASS
  verified_at: 2026-09-27T08:59:42Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 9 eval máy (E1-E9) và eval judgment (E10) đều đạt; 7/10 lệnh suite hồi quy thoát sạch — nhưng 3 lệnh suite (tests/scripts/run-tests.sh --manh bash, tests/hooks/run-tests.sh, tests/plugins/run-tests.sh --manh vung:3) có mã thoát không đọc được (thiếu dòng __EXIT=) nên không tính được PASS. Verdict tổng: BLOCKED — cần chạy lại ba lệnh đó trên hạ tầng đọc được __EXIT=, không phải sửa code sản phẩm.
