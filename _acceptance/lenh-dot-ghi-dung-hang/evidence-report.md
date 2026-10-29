---
schema_version: 2
feature_slug: lenh-dot-ghi-dung-hang
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3508fc1f391f2d4fd463b163a5102765bbe035f8
human_signoff:
---

# Evidence Report: lenh-dot-ghi-dung-hang

Round 2. Mười eval hợp đồng (E1–E10) đều xanh. Verdict REJECT vì một lệnh suite hồi quy không gắn eval nào đỏ: `tests/plugins/run-tests.sh --manh vung:3` (ca P179 [MBC] E6, sổ known-limits). `failed_evals` để rỗng vì lệnh đỏ không thuộc eval nào; chi tiết ở mục «Lệnh suite (hồi quy)» và `## Analyst`.

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

Mười eval E1–E10 chạy chung MỘT lệnh (`node --test` trên `tests/dieu-phoi/**/*.test.mjs`, lọc TAP bằng grep dưới pipefail). Máy chỉ giữ đuôi đầu ra của lệnh chung, nên các dòng «ok … - TC2-0x» riêng từng eval nằm trong phần bị cắt khỏi đuôi lưu; lệnh thoát 0 dưới pipefail nghĩa là bộ lọc có khớp dòng. `verified_at` ở đây chỉ có độ phân giải ngày; giờ chạy thật nằm ở `run-log.jsonl`.

- eval: E1
  run_id: minted-lenh-dot-ghi-dung-hang-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (lệnh chung E1–E10, đuôi đầu ra máy lưu)
    #   số hàng: 3
    #   chi-phien-cli · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-giam-sat
    #   chi-ma-app · số hàng: 7 · a=khong b=nhan-giam-sat c=khong d=bao-chu-kho e=khong f=khong g=nhan-gi

- eval: E2
  run_id: minted-lenh-dot-ghi-dung-hang-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E3
  run_id: minted-lenh-dot-ghi-dung-hang-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E4
  run_id: minted-lenh-dot-ghi-dung-hang-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E5
  run_id: minted-lenh-dot-ghi-dung-hang-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E6
  run_id: minted-lenh-dot-ghi-dung-hang-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E7
  run_id: minted-lenh-dot-ghi-dung-hang-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E8
  run_id: minted-lenh-dot-ghi-dung-hang-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E9
  run_id: minted-lenh-dot-ghi-dung-hang-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

- eval: E10
  run_id: minted-lenh-dot-ghi-dung-hang-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_tc2
  verified_at: 2026-10-29T14:36:50Z
  output: |
    (cùng lệnh với E1 — xem đuôi đầu ra ở khối E1)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-10-29T14:36:50Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-lenh-dot-ghi-dung-hang-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-29T14:36:50Z

Lệnh đỏ không gắn eval (nguyên nhân của verdict REJECT): `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`, danh sách eval gắn kèm rỗng. Đuôi đầu ra máy bắt được:

    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Mọi eval E1–E10 ghi `baseline: n-a`; danh sách eval không-phân-biệt dưới đây KHÔNG đo được ở round này.

Baseline khong do:

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - (TC2-|TC1-09 )|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «<\tool_use_error>Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.<\/tool_use_error>»

Eval không-phân-biệt: none — không eval nào được xác định là xanh trên cả hai phía; vì baseline không đo được nên chiều «đỏ trên baseline» của E1–E10 chưa được chứng minh bằng round này (chiều đỏ của từng eval nằm ở các ca «-do» mà chính eval chạy: bản lành xanh, bản tiêm đỏ đúng một mục).

Lệnh suite đỏ không gắn eval: `tests/plugins/run-tests.sh --manh vung:3`, ca P179 [MBC] E6 (sổ known-limits). Ca này so quan hệ «>=» giữa số dòng của `docs/research/known-limits-ledger.tsv` và số mục «Đề xuất: known-limits» đếm trong mọi `_acceptance/*/review-findings.md`. Chẩn đoán từ đọc cây, CHƯA đọc thông điệp lỗi đầy đủ (đuôi lưu bị cắt ở «quan he >=»): sổ có 1145 dòng dữ liệu so với 1148 mục corpus lúc đọc, tức sổ thiếu dòng cho các mục known-limits mới (kể cả của vòng này). Số chính xác cần chạy lại ca; hướng sửa: thêm hàng sổ cho các mục known-limits của vòng.

## Variance

none — mọi eval chạy một lần và xác định (runs: 1); không eval nào có pass_rate lẫn lộn.

## Iterations

Round 1: không eval hợp đồng nào đỏ (E1–E10 xanh). Hai lệnh suite hồi quy `tests/plugins/run-tests.sh --manh vung:2` (ca P161) và `--manh vung:3` (ca RT13) đỏ nên verdict REJECT. Trả về cho khâu thực hiện. Mốc `verified_at` trong báo cáo này chỉ có độ phân giải ngày. Giờ chạy thật nằm ở `run-log.jsonl`.
Round 2: E1–E10 vẫn xanh; vung:1 và vung:2 nay xanh (P161 và RT13 đã vá ở 3508fc1f). vung:3 vẫn đỏ nhưng ở ca khác: P179 [MBC] E6 (sổ known-limits thiếu dòng so với corpus review-findings.md, chẩn đoán từ đọc cây). Baseline không đo được (hạ tầng chặn). Trả về cho khâu thực hiện: thêm hàng sổ cho các mục known-limits rồi chạy lại vung:3.
