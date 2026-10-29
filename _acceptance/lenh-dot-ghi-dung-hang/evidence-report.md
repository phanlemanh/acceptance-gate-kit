---
schema_version: 2
feature_slug: lenh-dot-ghi-dung-hang
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 07829af93a2d81e21bb35e3423c1bdeeffef6a68
human_signoff:
---

# Evidence Report: lenh-dot-ghi-dung-hang

Round 3. Mười eval hợp đồng (E1–E10) đều xanh và mọi lệnh suite hồi quy đều xanh, gồm cả `tests/plugins/run-tests.sh --manh vung:3` đã đỏ ở round 2 (ca P179, nay sổ known-limits đã có đủ dòng). Không có eval judgment nào. Lượt tìm lỗi có hai mục NGOÀI hợp đồng (một mức high, một mức low), danh sách đầy đủ ở `review-findings.md` để người quyết ở Cổng 2; báo cáo này không chép chúng.

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
| E10 | AC-10 | test | PASS |

## Evidence

Mười eval E1–E10 chạy chung MỘT lệnh (`node --test` trên `tests/dieu-phoi/**/*.test.mjs`, lọc TAP bằng grep dưới pipefail). Máy chỉ giữ đuôi đầu ra của lệnh chung, nên các dòng «ok … - TC2-0x» riêng từng eval nằm trong phần bị cắt khỏi đuôi lưu; lệnh thoát 0 dưới pipefail nghĩa là bộ lọc có khớp dòng. `verified_at` ở đây chỉ có độ phân giải ngày (giờ 00:00:00 là giữ chỗ); giờ chạy thật nằm ở `run-log.jsonl`.

- eval: E1
  run_id: minted-lenh-dot-ghi-dung-hang-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (lệnh chung E1–E10, đuôi đầu ra máy lưu)
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E2
  run_id: minted-lenh-dot-ghi-dung-hang-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E3
  run_id: minted-lenh-dot-ghi-dung-hang-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E4
  run_id: minted-lenh-dot-ghi-dung-hang-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E5
  run_id: minted-lenh-dot-ghi-dung-hang-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E6
  run_id: minted-lenh-dot-ghi-dung-hang-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E7
  run_id: minted-lenh-dot-ghi-dung-hang-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E8
  run_id: minted-lenh-dot-ghi-dung-hang-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E9
  run_id: minted-lenh-dot-ghi-dung-hang-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E10
  run_id: minted-lenh-dot-ghi-dung-hang-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T16:48:48Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r3
  exit_code: 0
  verified_at: 2026-10-29T16:48:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Mọi eval E1–E10 ghi `baseline: n-a`; danh sách eval không-phân-biệt dưới đây KHÔNG đo được ở round này.

Baseline khong do:

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (TC2-|TC1-09 )|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không-phân-biệt: danh sách rỗng, nhưng vì baseline không đo được nên chiều «đỏ trên baseline» của E1–E10 chưa được chứng minh bằng round này (chiều đỏ của từng eval nằm ở các ca «-do» mà chính eval chạy: bản lành xanh, bản tiêm đỏ đúng một mục).

## Variance

none — mọi eval chạy một lần và xác định (runs: 1); không eval nào có pass_rate lẫn lộn.

## Iterations

Round 1: không eval hợp đồng nào đỏ (E1–E10 xanh). Hai lệnh suite hồi quy `tests/plugins/run-tests.sh --manh vung:2` (ca P161) và `--manh vung:3` (ca RT13) đỏ nên verdict REJECT. Trả về cho khâu thực hiện. Mốc `verified_at` trong báo cáo này chỉ có độ phân giải ngày. Giờ chạy thật nằm ở `run-log.jsonl`.
Round 2: E1–E10 vẫn xanh; vung:1 và vung:2 nay xanh (P161 và RT13 đã vá ở 3508fc1f). vung:3 vẫn đỏ nhưng ở ca khác: P179 [MBC] E6 (sổ known-limits thiếu dòng so với corpus review-findings.md, chẩn đoán từ đọc cây). Baseline không đo được (hạ tầng chặn). Trả về cho khâu thực hiện: thêm hàng sổ cho các mục known-limits rồi chạy lại vung:3.
Round 3: E1–E10 xanh và mọi lệnh suite xanh, kể cả vung:3 (bốn dòng sổ known-limits đã thêm ở 457079b9, P179 hết đỏ). Baseline vẫn không đo được (hạ tầng chặn). Hai mục ngoài hợp đồng ghi ở review-findings.md để người quyết ở Cổng 2.
