---
schema_version: 2
feature_slug: lenh-dai-chay-rieng
verdict: REJECT
failed_evals: ["E3"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6b1a6387d5f6461101a71433d5fb5989614d65d9
human_signoff:
---

# Evidence Report: lenh-dai-chay-rieng

Round 5. Một eval đỏ (E3). Nguyên nhân gốc nằm ở hạ tầng đo: test không còn phát ca LN6b mà lệnh của E3 vẫn đòi ca đó (xem Evidence E3 và `review-findings.md`).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | judgment | PASS (hội đồng đề xuất, giữ từ round 2; chờ người) |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | PASS (hội đồng đề xuất; chờ người) |

## Evidence

- eval: E1
  run_id: minted-lenh-dai-chay-rieng-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_s4_args_lenh_dai
  verified_at: 2026-10-07T07:06:55Z
  output: |
    (lệnh chạy xong, đủ bốn ca SL1 SL2 SL3 SL4 đều in PASS)
    __EXIT=0

- eval: E2
  run_id: minted-lenh-dai-chay-rieng-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_prompt_lenh_dai
  verified_at: 2026-10-07T07:06:55Z
  output: |
    Results: 28 passed, 0 failed (lenh-dai-chay-rieng)
    (đủ bốn ca LD1 LD2 LD3 LD4 đều in PASS)
    __EXIT=0

- eval: E3
  run_id: minted-lenh-dai-chay-rieng-E3-r5
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.ldcr_chay_nen_that
  verified_at: 2026-10-07T07:06:55Z
  output: |
    PASS: LN6c chiều đỏ: bản sao gỡ đúng phép chặn → "mốc rỗng thành quá hạn giả"
    PASS: LN8 lệnh bẫy TERM chết sau __QUA_HAN
    PASS: LN8 chiều đỏ: bản sao chỉ gửi TERM → "lệnh bẫy TERM sống sót"
    PASS: VP2 mutant đỏ với "thứ tự lệnh đổi"
    Results: 28 passed, 0 failed (lenh-dai-chay-rieng)
    Tệp test thoát xanh, nhưng vòng kiểm của eval không thấy dòng "PASS: LN6b " nên lệnh eval thoát khác 0.
  Nguyên nhân (đọc từ review): commit f743960d viết đè khối LN6b bằng LN6c thay vì để cạnh nhau; lệnh eval (config.yaml:435) vẫn lặp qua LN6b. Chưa có ca nào kiểm "hạn chờ tính từ mốc đã lưu, không dời theo mỗi lần chờ" cả chiều xanh lẫn chiều đỏ.

- eval: E5
  run_id: minted-lenh-dai-chay-rieng-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_s4_args_chay_rieng
  verified_at: 2026-10-07T07:06:55Z
  output: |
    (lệnh chạy xong, đủ sáu ca SC1 SC2 SC3 SC4 SC5 RT1 đều in PASS)
    __EXIT=0

- eval: E6
  run_id: minted-lenh-dai-chay-rieng-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_thu_tu_chay_rieng
  verified_at: 2026-10-07T07:06:55Z
  output: |
    PASS: CR4 mutant đỏ với "chạy-riêng chồng lệnh khác"
    PASS: CR5 chạy sau mọi lệnh khác, prompt khung nền HAN_PHUT=45
    PASS: CR5 chiều đỏ: nhóm chạy-riêng dùng khung bọc thường → "chạy-riêng mất khung nền"
    Results: 28 passed, 0 failed (lenh-dai-chay-rieng)
    __EXIT=0

- eval: E7
  run_id: minted-lenh-dai-chay-rieng-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ldcr_vi_phan_khong_khai
  verified_at: 2026-10-07T07:06:55Z
  output: |
    PASS: VP1 bằng hệt base, kết cục ghim đúng ở cả hai
    PASS: VP2 mutant đỏ với "thứ tự lệnh đổi"
    Results: 28 passed, 0 failed (lenh-dai-chay-rieng)
    __EXIT=0

- eval: E4
  judged_by: hội đồng 3 lens (domain-correctness, operational-feasibility, spec-alignment), giữ nguyên từ round 2
  verdict: PASS
  rationale: Panel giữ nguyên từ round 2 — inputs không đổi, không chấm lại; rationale xem round đó.
  human_override:  # chi nguoi ghi

- eval: E8
  judged_by: hội đồng 3 lens (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Ba lens đều thấy (a) eval-executors.md nêu đủ khoá long_running, (b) eval-executors.md, GUIDE, CHANGELOG và comment acceptance-init đều nói model_evals chạy riêng sau mọi lệnh máy khác, (c) mục Chưa phát hành của CHANGELOG nêu cả hai thay đổi kèm dòng «Khoá vắng = như 2.24.0». Không thấy câu mâu thuẫn; có hai chỗ thiếu nhỏ (GUIDE chưa nhắc model_evals sai dạng nay cũng dừng s4-args; acceptance-init.md chưa nhắc long_running).
  human_override:  # chi nguoi ghi

### Judge panel đề xuất (chờ người ở Cổng 2)

E8 — đề xuất PASS:
- domain-correctness: PASS — (a) eval-executors.md nêu đủ khoá `long_running`: số nguyên 1–240 phút, chỉ `test`/`script`, khai khi lệnh có thể chạy quá ~9 phút; nhật ký kết bằng `__EXIT=<n>`, lượt chấm chờ bằng các lần hỏi ngắn, quá hạn thì dừng cả cây tiến trình và eval BLOCKED. (b) bốn tệp đều nói eval trong `feature_loop.model_evals` chạy riêng, tuần tự, sau mọi lệnh máy khác. (c) Mục «Chưa phát hành» của CHANGELOG nêu cả hai thay đổi và có dòng «Khoá vắng = như 2.24.0». Các số liệu khớp nhau giữa các tệp, không thấy câu nào mâu thuẫn.
- operational-feasibility: PASS — Chỉ từ bốn tệp, người viết eval biết đủ cả ba điều. Có hai chỗ thiếu nhỏ, không phải mâu thuẫn: GUIDE không nhắc `model_evals` sai dạng nay cũng dừng `s4-args`, và acceptance-init.md không nhắc `long_running`.
- spec-alignment: PASS — Bốn tệp đủ cho cả ba ý; ngưỡng 30 phút của TOOL-KILL, khoảng 1–240 và việc BLOCKED khi quá hạn khớp nhau giữa eval-executors.md và CHANGELOG. Câu «VẮNG = như 2.22» trong GUIDE nói về năm khoá của làn ghim lại, không phải hành vi S4 mới.

E4 — đề xuất PASS (panel giữ nguyên từ round 2 — inputs không đổi, không chấm lại):
- domain-correctness: PASS (r2)
- operational-feasibility: PASS (r2)
- spec-alignment: PASS (r2)

human_override của E4 và E8 để TRỐNG cho người quyết ở Cổng 2.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lenh-dai-chay-rieng-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lenh-dai-chay-rieng-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-10-07T07:06:55Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: E3 bị trả (REJECT) — bước dọn cây mồ côi không chạy dưới zsh (AC-3 iii); owner thu phạm vi: gỡ bước đó, giữ nhãn lượt (LN7 mới), mở rộng LN6c, tách SC5 thành ba fixture.
Round 5: E3 failed — ca LN6b bị xoá khỏi test khi thêm LN6c nhưng lệnh eval vẫn đòi ca đó, nên hạn chờ tính từ mốc đã lưu mất cả chiều xanh lẫn chiều đỏ. Returned to implementation.