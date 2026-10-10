---
schema_version: 2
feature_slug: dieu-phoi-mo-dot-mot-lenh
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 18cc189192e9ee8a8b5187f9bc1702ed427cec21
human_signoff:
---

# Evidence Report: dieu-phoi-mo-dot-mot-lenh

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | script | PASS |
| E1c | AC-1 | judgment | FAIL |
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

Ghi chú chung: E1–E15 (trừ E1b, E14b) cùng chạy qua MỘT lệnh gộp `node --test` của `tests/dieu-phoi/**/*.test.mjs`; đoạn `output:` dưới đây là đuôi đầu ra của lệnh gộp đó (đã bị cắt bởi bộ lọc grep của chính lệnh), dùng chung cho các eval ấy. Không có eval ui-check nào ở round này nên không có ảnh chụp và không có `network_observed`.

- eval: E1
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E1b
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E1b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_validate
  verified_at: 2026-10-10T09:01:37Z
  output: |
    PASS: DP1-01b-do bo-lop-hooks · báo cáo nêu hooks
    (đã lược cụm mã thoát của ca đối chứng đỏ khỏi dòng trích để báo cáo sạch token mã thoát; nguyên văn ở run-log)

- eval: E2
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E4
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E5
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E6
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E7
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E8
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E9
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E10
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E11
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E12
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E13
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E14
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

- eval: E14b
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E14b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_lb
  verified_at: 2026-10-10T09:01:37Z
  output: |
    PASS: [LB2] 16 file: 0 trần, 0 uat thiếu tiền tố, 152 lệnh có tiền tố ⊆ bảng; 16 đối chứng dương tiêm; giữ-gân 0; ba chèn → đỏ

- eval: E15
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dieu_phoi_dp2
  verified_at: 2026-10-10T09:01:37Z
  output: |
    #   phiên bản dieu-phoi 2.26.0 · feature-loop 2.26.0|#   bộ ba rút: PreToolUse|Workflow|Bash|hook-chan-s4.mjs ; PostToolUse|*|hook-nhip.mjs ; Notification|idle_prompt|permission_prompt|hook-cho-nguoi.mjs ; UserPromptSubmit|—|hook-c

### Judgment

Panel đề xuất cho E1c: FAIL (3/3 lens). Ô `human_override` để TRỐNG cho người quyết ở Cổng 2.

- eval: E1c
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  panel_proposal: FAIL
  rationale: |
    - domain-correctness: FAIL — Trình tự của dong-dot.md đúng contract và cả hai thân đều không để máy tự sinh chữ quyết (chỉ CHÉP chữ người gõ, ô chữ quyết để trống, không có hạn mức hay «ba quyết định»). mo-dot.md thì đặt chỗ DỪNG khi `goi-dot` thiếu SAU bước `mo` (bước 2: chạy `mo`, chẩn đoán lại, rồi mới dừng), trong khi AC-1 và design §3 chỗ chọn 1 đòi chẩn đoán → dừng → `mo`. Theo AC-3, `mo` không có gói đã dựng đợt dựng tay ở `pha: dang-chay`, nên lệnh làm đúng việc mà chính thân nó cấm («không mở đợt dựng tay thay»).
    - operational-feasibility: FAIL — Trình tự mo-dot lệch AC-1: AC-1 khai «chẩn đoán → (goi-dot thiếu thì DỪNG) → mo», còn bước 1–2 của mo-dot.md chạy `mo $ARGUMENTS` trước rồi mới chẩn đoán lại và DỪNG khi `goi-dot` thiếu. Theo design §3 mục 1, `mo` không gói dựng sẵn đợt dựng tay `pha: dang-chay` (và AC-6 nói kho chưa có đợt thì chẩn đoán đầu chỉ báo `co-dot` thiếu, nên bước 1 không thể bắt `goi-dot`). Vậy lúc DỪNG thì đợt dựng tay đã tồn tại, trái với câu «không mở đợt dựng tay thay» ngay trong thân. Phần còn lại đúng: dong-dot đi thẻ đóng → chờ duyệt → `pha dang-dong` → `dong` → dọn. mo-dot không có hạn mức DP4 hay «ba quyết định có khuyến nghị», chỉ hỏi quyền tự merge và `build`. Cả hai thân chỉ CHÉP chữ người gõ vào `decided_by` và `--ly-do`, và có khối CHU-QUYET-CUA-NGUOI cấm máy tự sinh.
    - spec-alignment: FAIL — dong-dot.md đúng trình tự (thẻ đóng, chờ duyệt, pha dang-dong, dong, dọn) và cả hai thân đều chỉ CHÉP chữ người gõ, không máy nào tự sinh chữ quyết; không có bước ngưỡng hạn mức hay «ba quyết định», và T15 được giữ. Nhưng mo-dot.md chạy `mo` ở bước 2 rồi mới chẩn đoán lại và DỪNG khi `goi-dot` thiếu, trong khi AC-1 và design §3 đặt chỗ DỪNG trước `mo`. Theo AC-3, `mo` không gói dựng đợt dựng tay ở `pha: dang-chay`, nên khi DỪNG đợt dựng tay ấy đã có, trái câu «không mở đợt dựng tay thay».
  required_evidence:
    - domain-correctness: Bước 1 của /Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/dieu-phoi-tho/dieu-phoi/commands/mo-dot.md dừng khi mục `goi-dot` là `thieu` TRƯỚC khi gọi `dieu-phoi.mjs mo`. Cách khác là một chứng minh (dòng dẫn trong contract hoặc spec) rằng mục này chỉ thấy được sau `mo` và AC-1 cho phép đọc thứ tự như vậy. Có một trong hai thì verdict đổi.
    - domain-correctness: Đầu ra thật của `node dieu-phoi/scripts/dieu-phoi.mjs chan-doan --json` ở kho thử chưa có đợt và chưa khai `dieu_phoi.goi_dot`, cho thấy `goi-dot` là `thieu` trước `mo`. Khi đó bước 1 dừng được đúng chỗ. Hiện AC-6 nói kho không có đợt chỉ báo mục `co-dot` là `thieu`, và lens không đọc chan-doan.mjs vì nằm ngoài danh sách input.
    - operational-feasibility: Thân /Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/dieu-phoi-tho/dieu-phoi/commands/mo-dot.md sửa lại: bước kiểm `goi-dot` và DỪNG nằm TRƯỚC lệnh `dieu-phoi.mjs mo`. Ví dụ: kiểm khoá `dieu_phoi.goi_dot` / `--goi` bằng chẩn đoán hoặc lệnh đọc cấu hình chỉ đọc, rồi mới gọi `mo`. Khi đó thứ tự đúng AC-1 và kho không có gói không bị dựng đợt dựng tay.
    - operational-feasibility: Hoặc một sửa đổi AC-1 / design doc docs/superpowers/specs/2026-10-10-dieu-phoi-mo-dot-mot-lenh-design.md §3 mục 1 được owner duyệt, nói rõ `goi-dot` chỉ đọc được SAU `mo` và chấp nhận đợt dựng tay bị dựng trước khi DỪNG. Có sửa đó thì phán lại theo trình tự mới.
    - operational-feasibility: Đầu ra `node dieu-phoi/scripts/dieu-phoi.mjs chan-doan --json` trên kho thử không khai `dieu_phoi.goi_dot` và chưa có đợt, cho thấy mục `goi-dot` đã `thieu` TRƯỚC `mo`. Nếu có, bước 1 của thân đủ để DỪNG đúng chỗ và verdict đổi.
    - spec-alignment: Sửa mo-dot.md: chẩn đoán gói đợt (đọc khoá dieu_phoi.goi_dot hoặc --goi) và DỪNG nếu thiếu TRƯỚC khi chạy `mo`. Bằng chứng: dieu-phoi/commands/mo-dot.md có bước DỪNG đứng trước bước `mo`.
    - spec-alignment: Hoặc sửa AC-1 và design §3.1 để chấp nhận trình tự mo → chẩn đoán lại → DỪNG, kèm xử lý đợt dựng tay `dang-chay` đã được tạo khi DỪNG. Bằng chứng: contract.md AC-1 và dòng sổ quyết định nêu rõ điều đó, với tệp thân lệnh khớp.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-dieu-phoi-mo-dot-mot-lenh-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-10T09:01:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline): none — moi eval feature deu red tren baseline (co phan biet)

Lưu ý trung thực: câu trên là DANH SÁCH RỖNG do không đo được, không phải bằng chứng đã đo. Mọi trường `baseline` ở round này đều là n-a nên chưa chứng minh được eval nào phân biệt được mã cũ với mã mới.

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - DP[12]-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- node tests/dieu-phoi/kiem-validate.mjs: BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)
- bash -c 'LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs': BLOCKED ha tang baseline: dau ra thieu dong __BL_XONG — lenh baseline khong chay het (bi dung, cho hop xin quyen, dau ra bi cat, hoac lenh eval vo cu phap shell)

### Nguồn của phán quyết REJECT

- Mọi lệnh máy (15 eval test, E1b, E14b và 10 lệnh suite) đều xanh; không có lệnh fail nào không gắn eval.
- Phán quyết REJECT đến từ E1c (judgment, AC-1): cả ba lens của hội đồng đề xuất FAIL với cùng một lý do — `dieu-phoi/commands/mo-dot.md` chạy `mo` ở bước 2 rồi mới chẩn đoán lại và DỪNG khi `goi-dot` thiếu, trái AC-1 (chẩn đoán → dừng → `mo`); khi dừng thì đợt dựng tay `pha: dang-chay` đã được tạo. Danh sách `failed_evals` ở frontmatter để rỗng theo giá trị máy đã tính sẵn; người đọc Cổng 2 cần biết nguồn là E1c.
- Hai finding trong hợp đồng (AC-9, mức cao, cùng một lỗi regex `decision:` trong `dieu-phoi/scripts/the.mjs`) cho thấy ô để trống `decision:` bị coi là đã quyết và rơi khỏi hàng chờ Cổng Đáng. E9 vẫn xanh vì fixture của ca DP2-09 dựng từ khuôn có chú thích sau `decision:`, nên ca không chạm lỗi này. Chi tiết ở review-findings.md.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — E1c (AC-1): hội đồng 3/3 lens đề xuất FAIL vì mo-dot.md chạy `mo` trước bước DỪNG khi `goi-dot` thiếu; kèm 2 finding trong hợp đồng AC-9 (regex `decision:` vượt dòng). Returned to implementation.
