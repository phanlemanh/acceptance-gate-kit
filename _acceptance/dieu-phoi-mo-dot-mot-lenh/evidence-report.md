---
schema_version: 2
feature_slug: dieu-phoi-mo-dot-mot-lenh
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 83e4bf463b616908c6d898d6eb4f9e6ae36cb85f
human_signoff:
---

# Evidence Report: dieu-phoi-mo-dot-mot-lenh

Round 2. Toàn bộ eval máy đều thoát sạch và hội đồng đề xuất PASS cho E1c, nhưng vòng bị REJECT vì còn một finding TRONG hợp đồng (AC-7, high) ở `dieu-phoi/scripts/hang.mjs` — xem `review-findings.md`, mục «Trong hợp đồng».

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | script | PASS |
| E1c | AC-1 | judgment | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | test | PASS |
| E13 | AC-13 | test | PASS |
| E14 | AC-14 | test | PASS |
| E14b | AC-14 | test | PASS |
| E15 | AC-15 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0
    #   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c
    __EXIT=0

- eval: E1b
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E1b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_validate
  verified_at: 2026-10-10T09:52:16Z
  output: |
    PASS: DP1-01b-do bo-lop-hooks […]
    __EXIT=0

- eval: E2
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E4
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E5
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E6
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E7
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E8
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E9
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E10
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E11
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E12
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E13
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E14
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng tóm tắt bị cắt ngắn, xem mục Analyst)
    __EXIT=0

- eval: E14b
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E14b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_lb
  verified_at: 2026-10-10T09:52:16Z
  output: |
    PASS: [LB2] 16 file: 0 trần, 0 uat thiếu tiền tố, 152 lệnh có tiền tố ⊆ bảng; 16 đối chứng dương tiêm; giữ-gân 0; ba chèn → đỏ
    __EXIT=0

- eval: E15
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:52:16Z
  output: |
    (cùng lệnh gộp với E1; dòng «# pass N» / «# fail 0» không hiện trong phần đuôi đầu ra, xem mục Analyst)
    __EXIT=0

### Hội đồng judgment (đề xuất — chờ người)

- eval: E1c
  judged_by: judge-subagent (fresh context), hội đồng 3 lens
  verdict: PASS
  rationale: Ba lens cùng đề xuất PASS. Thân mo-dot.md đi đúng trình tự AC-1 (chẩn đoán, DỪNG trước `mo` khi `goi-dot` thiếu, `mo`, thẻ khởi tạo, chờ người duyệt, `pha dang-chay`, `chay`, chẩn đoán lại); thân dong-dot.md đúng (thẻ đóng, chờ duyệt, `pha dang-dong`, `dong`, dọn). Chữ quyết do người gõ, máy chỉ chép vào `decided_by` và `--ly-do`.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

Phiếu từng lens (không dissent):

- domain-correctness: PASS — Trình tự đúng AC-1 cho cả mo-dot.md và dong-dot.md. Khối CHU-QUYET cấm máy tự sinh chữ quyết, ô chữ quyết để trống. Không thấy ngưỡng hạn mức (DP4) hay «ba quyết định có khuyến nghị»; câu hỏi cho người chỉ gồm quyền tự merge và `build` từng hàng, đúng T15.
- operational-feasibility: PASS — Cả hai thân đặt chữ quyết ở người gõ. Thân `mo-dot` có thêm một lần chẩn đoán lại ngay sau `mo`, nhưng chỉ đọc và khớp nguyên tắc «chẩn đoán trước, chẩn đoán lại» của spec workflow §2.4.
- spec-alignment: PASS — mo-dot.md đúng trình tự AC-1, dong-dot.md đúng; cả hai chỉ CHÉP chữ người gõ vào `decided_by` và `--ly-do`, khối CHU-QUYET cấm máy tự sinh; thẻ khởi tạo chỉ hỏi quyền tự merge và `build` từng hàng, không có ngưỡng hạn mức (DP4).

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-10T09:52:16Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

Eval không-phân-biệt (xanh cả hai phía): danh sách rỗng, nhưng KHÔNG đo được ở round này vì baseline BLOCKED hạ tầng — mọi field baseline đều n-a. Đừng đọc thành «mọi eval đều đỏ trên baseline».

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP[12]-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- node tests/dieu-phoi/kiem-validate.mjs: BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

### Giới hạn đọc kết quả E1–E15 (khai thẳng)

E1–E15 (trừ E1b, E14b) chạy chung MỘT lệnh gộp qua `paste -sd"|"`. Dòng kết quả bị gộp thành một dòng và cắt ngắn nên các dòng «# pass», «# fail», «# skipped» KHÔNG hiện trong phần đuôi đầu ra. Mã thoát 0 của lệnh chứng tỏ `node --test` thoát sạch (pipefail) và grep khớp ít nhất một dòng; nó không tự chứng tỏ ngưỡng «# pass N ≥ 118 + số ca DP2» của E15. Báo cáo này không suy đếm pass/fail từ đầu ra bị cắt; người ký đọc E15 như «lệnh thoát sạch», và nếu cần con số thì chạy lại lệnh không cắt.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — E1c (AC-1): hội đồng 3/3 lens đề xuất không đạt vì mo-dot.md chạy `mo` trước bước DỪNG khi `goi-dot` thiếu; kèm 2 finding trong hợp đồng AC-9 (regex `decision:` vượt dòng). Returned to implementation.
Round 2: REJECT — toàn bộ eval máy thoát sạch, E1c được hội đồng đề xuất PASS (3/3), không còn finding AC-9; còn 1 finding TRONG hợp đồng AC-7 (high): CLI `hang` không kiểm đối số vắng, `timHang(hv, undefined)` khớp nhầm hàng không mã và ghi đè `hang-viec.json`. Returned to implementation.
