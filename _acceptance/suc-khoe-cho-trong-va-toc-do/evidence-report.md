---
schema_version: 2
feature_slug: suc-khoe-cho-trong-va-toc-do
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7d01b7053703b4cb5af264fb37cf63d0d127fd21
human_signoff:
---

# Evidence Report: suc-khoe-cho-trong-va-toc-do

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | judgment | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-10 | test | PASS |

## Evidence

Mười eval E1–E10 cùng đo bằng một lệnh (hai tệp SK-01…SK-10), chạy một lần; E11 đo bằng lệnh DP1-07/DP2-01 riêng. Phần đầu ra dưới đây là đuôi đã làm sạch của lần chạy ấy.

- eval: E1
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    #   SK-01 · (m5, áp lực 1) · kỳ vọng dang-chay · s4 P1 · giam-tai 0 · ghi 9.7/11.0 GB · lý do 0 · thực tế dang-chay · s4 P1 · giam-tai 0 · ghi 9.7/11.0 GB · lý do 0
    #   SK-01 · (m5, áp lực 2) · kỳ vọng giam-   (đuôi đầu ra bị cắt ở giới hạn của bước chụp)

- eval: E2
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E3
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E4
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E5
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E6
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E6b
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  verified_at: 2026-10-21T02:35:56Z
  judges:
    - domain-correctness: PASS — LUAT.md dòng 18-26 trả lời đủ bốn điều. (1) đọc do-dang-chay/<tài nguyên>.json, trường duoi_tai khác null, TRƯỚC khi nhả. (2) nhả bằng nha --ha-tang "duoi tai". (3) đọc sự kiện luot-duoi-tai, duoc_thu_lai true thì xin lại và chấm lại đúng commit một lần, không sửa vật trước. (4) vẫn đỏ hoặc không được thử lại thì đỏ là của vật. Tệp không nói sự kiện luot-duoi-tai khớp theo trường nào và không nói xử lý khi chưa có sự kiện, nhưng thợ suy được là lấy sự kiện mới nhất của lượt vừa nhả, nên không đủ để thợ phải hỏi lại.
    - operational-feasibility: PASS — Tệp luật nói đủ rõ cả bốn điều ở mục «Lượt chạy dưới tải». (1) Phải đọc `<thư mục đợt>/do-dang-chay/<tài nguyên>.json` TRƯỚC khi nhả `s4` hay `duong-nen`, và `duoi_tai` khác `null` là có nhãn. (2) Lượt có nhãn mà đỏ thì nhả bằng đúng lệnh `nha <tài nguyên> --ha-tang "duoi tai"`. (3) Đọc sự kiện `luot-duoi-tai` trong `su-kien.jsonl`: `duoc_thu_lai: true` thì xin lại lượt và chấm lại ĐÚNG commit đó một lần, không sửa vật trước; `false` thì không chấm lại. (4) Lần chấm lại vẫn đỏ, hoặc không được thử lại, thì đỏ là của vật và sửa như mọi lượt đỏ. Còn hai chỗ nhỏ chưa nói thẳng: tệp không nêu sự kiện `luot-duoi-tai` xuất hiện sau lệnh nhả, và không nêu cách chọn dòng khi có nhiều sự kiện. Cả hai suy ra được từ thứ tự các bước và cụm «của lượt đó», nên không đủ để làm thợ phải hỏi ai.
    - spec-alignment: PASS — Dòng 18–26 của LUAT.md nói đủ cả bốn điều. (1) Trước khi nhả khoá `s4` hay `duong-nen`, đọc `do-dang-chay/<tài nguyên>.json` và xem `duoi_tai` có khác `null` không. (2) Lượt có nhãn mà đỏ thì nhả bằng lệnh `nha <tài nguyên> --ha-tang "duoi tai"`. (3) Đọc sự kiện `luot-duoi-tai` trong `su-kien.jsonl`. Nếu `duoc_thu_lai: true` thì xin lại lượt và chấm ĐÚNG commit đó một lần, không sửa vật trước. Nếu `false` thì không chấm lại. (4) Chấm lại vẫn đỏ, hoặc không được thử lại, thì đỏ là của vật và sửa như mọi lượt đỏ; lượt không có nhãn thì đỏ là của vật như thường lệ. Có vài chi tiết nhỏ chưa nói, như tên tệp khi tài nguyên có hai khoá, nhưng không đủ để một thợ phải hỏi ai.
  human_override:  # chi nguoi ghi

- eval: E7
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E8
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E9
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E10
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_suc_khoe
  verified_at: 2026-10-21T02:35:56Z
  output: |
    (lệnh chung E1–E10, một lần chạy) đuôi đầu ra như E1; lệnh kết thúc thành công.

- eval: E11
  run_id: minted-suc-khoe-cho-trong-va-toc-do-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.dieu_phoi_dp107_dp201
  verified_at: 2026-10-21T02:35:56Z
  output: |
    # fail 0

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: 839 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: 36 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: 36 passed, 0 failed

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: 36 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: 71 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: all plugin tests passed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: LO-TRINH.html khớp tệp ý định và hồ sơ.

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-suc-khoe-cho-trong-va-toc-do-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-21T02:35:56Z
  output: BỎ QUA: KB — không phải lượt cắt mốc (số 2.33.1 = gốc vòng)

## Known limits

## Ngoài hợp đồng

12 mục ngoài hợp đồng chờ người quyết, xem review-findings.md mục «Ngoài hợp đồng — người quyết ở Gate 2».

## Analyst

Eval không-phân-biệt (xanh cả trên cây hiện tại lẫn baseline diffBase, chứng minh bộ đo chứ không phải tính năng):

- E11: xanh cả hai phía (baseline green). Lệnh DP1-07/DP2-01 là regression-guard có chủ ý cho AC-10 (gói và fixture mới không lọt chuỗi riêng của kho tiêu thụ); không viết lại. Lưu ý riêng: phép quét DP1-07 chỉ phủ `dieu-phoi` và `tests/dieu-phoi/fixtures`, chưa phủ `tests/dieu-phoi/loi/` (xem review-findings.md).

Baseline khong do:

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/loi/suc-khoe.test.mjs" "tests/dieu-phoi/loi/suc-khoe-nhip.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - SK-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': bo qua baseline: tep tests/dieu-phoi/loi/suc-khoe-nhip.test.mjs co o cay dang kiem nhung chua co o merge-base b010ecd29c3b93ba3014896357771b80268c600c — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, tất định)

## Iterations

Round 1: E1–E11 đều đạt, không eval nào hỏng; E6b do hội đồng ba góc nhìn đều chấm đạt, ô human_override để trống cho người. Chuyển sang Cổng Bằng chứng.
