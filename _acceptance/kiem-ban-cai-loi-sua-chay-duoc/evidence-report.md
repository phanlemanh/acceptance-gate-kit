---
schema_version: 2
feature_slug: kiem-ban-cai-loi-sua-chay-duoc
verdict: REJECT
failed_evals: ["E10"]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d3b06b4167b0466f42e5e4ee5f7d0361df9514ad
human_signoff:
---

# Evidence Report: kiem-ban-cai-loi-sua-chay-duoc

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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | FAIL |

Tóm tắt: chín eval E1–E9 chạy chung một lệnh `node tests/scripts/kiem-ban-cai-loi-sua.test.mjs` và xanh. E10 (AC-10, bộ ca `kiem-ban-cai.ca.mjs`) không xanh: mọi dòng ca in ra đều là PASS (kể cả ca mới KB-13), nhưng tiến trình sập ở bước dọn thư mục tạm khi đang chạy ca KB-9 «khong-do» và lệnh thoát khác 0. Nên eval không đạt điều kiện «chạy trọn, không dòng FAIL, thoát 0».

## Evidence

- eval: E1
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E2
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E4
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E5
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E6
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E7
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E8
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E9
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_loi_sua
  verified_at: 2026-10-29T03:08:39Z
  output: |
    (lệnh dùng chung cho E1–E9; chỉ giữ phần đuôi đầu ra của máy)
    KL: mọi ca PASS

- eval: E10
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-E10-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai
  verified_at: 2026-10-29T03:08:39Z
  output: |
    PASS: KB-13
    PASS: KB-4 thua
    ...
    PASS: KB-9 doi-chung
    PASS: KB-9 do
    PASS: KB-9 khong-do
    node:fs:1282
      return binding.rmSync(getValidatedPath(path), opts.maxRetries, opts.recursive, opts.retryDelay);
    Error: ENOTEMPTY, Directory not empty: '/var/folders/6x/1dlzszm51wzbt20dn5y1lgzh0000gn/T/kb-ca-uBhnpH'
        at Object.rmSync (node:fs:1282:18)
        at chayTron (file:///Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/tc4-kiem-ban-cai-5150c9/tests/scripts/kiem-ban-cai.ca.mjs:451:8)
    Node.js v24.22.0
    (không dòng FAIL nào trong phần đầu ra đã giữ; tiến trình sập ở bước dọn thư mục tạm sau dòng ca cuối)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-kiem-ban-cai-loi-sua-chay-duoc-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-29T03:08:39Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không-phân-biệt (xanh cả trên bản hiện tại lẫn baseline): không liệt kê được ở round này — baseline không đo, nên danh sách rỗng chỉ vì không có số đo, không phải vì mọi eval đã được chứng minh đỏ trên mã cũ. Mọi trường baseline ghi n-a.

Baseline khong do:
- node tests/scripts/kiem-ban-cai-loi-sua.test.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»
- node tests/scripts/kiem-ban-cai.ca.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Lệnh fail không gắn eval: không có. Lệnh duy nhất thoát khác 0 là `node tests/scripts/kiem-ban-cai.ca.mjs`, thuộc E10 (đã nêu ở khối evidence). Mười một lệnh suite hồi quy đều xanh.

Judge panel: không có panel nào được đề xuất ở round này (không có mục judgment).

## Variance

none — mọi eval đều deterministic (runs: 1), không eval nào có pass_rate lẫn.

## Iterations

Round 1: E10 failed — bộ ca `kiem-ban-cai.ca.mjs` in đủ dòng PASS (gồm KB-13) nhưng sập ENOTEMPTY khi dọn thư mục tạm trong `chayTron` (dòng 451) nên thoát khác 0; chưa rõ do tranh chấp thư mục tạm hay do một ca để lại tiến trình/tệp. Returned to implementation. Chín eval E1–E9 xanh; mười tìm thấy ngoài hợp đồng nằm ở review-findings.md để người quyết.
