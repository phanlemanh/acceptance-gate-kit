---
schema_version: 2
feature_slug: o-chi-mo-khi-co-neo-ngoai
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9101520124ee6aae8d86b43beccb3594cb5ca788
human_signoff:
---

# Evidence Report: o-chi-mo-khi-co-neo-ngoai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | judgment | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-19T14:00:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E2
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-19T14:00:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E3
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E3-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.neo_vc9
  verified_at: 2026-09-19T14:05:00Z
  output: |
    PASS: [VC9] mốc chưa ký khai Kho chờ nhận (cây thật + 5 hồ sơ fixture rút từ khuôn; marker là nguồn)

- eval: E4
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-19T14:00:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E5
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.neo_loi_b
  verified_at: 2026-09-19T14:10:00Z
  output: |
    PASS: LB2 chieu do: ban sao gate-card doi hang -> LB1 do
    PASS: LB3 ba tai lieu: khoi OOC-LOI-B co cau moi, KHONG co cau cu
    Results: 3 passed, 0 failed

- eval: E6
  judged_by: judge panel (fresh-context) — domain-correctness, operational-feasibility, spec-alignment
  proposal: PASS
  votes:
    - domain-correctness: PASS — CLAUDE.md hiện tại khớp cả 4 vế: (1) "Mỗi mốc phát hành PHẢI gọi tên..." đã đổi thành "ĐƯỢC PHÉP ghi chỗ cắt... vào Notes của hồ sơ mốc... chỗ cắt chỉ thành Ô khi có `Gốc:`" (dòng 105-108) — đúng thiết kế §3 vế 1. (2) Luật (b) đổi mẫu số thành "Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN tối đa MỘT vòng meta... Mẫu số là mốc KHO NHẬN, không phải mốc cắt số" (dòng 74-76) — đúng thiết kế §3 vế 4. (3) Câu "Mốc chỉ cắt khi có kho chờ nhận (dòng `Kho chờ nhận:`... răng VC9), và đi làn V như tiền lệ 2.5.0/2.7.0" có mặt nguyên văn (dòng 77-78). (4) Các câu còn lại của luật (a), phần "5 dòng số", "Hai chốt không mục tiêu số nào ghi đè" giữ nguyên nghĩa so với bản trước khi sửa, không bị xáo trộn ngoài ý.
    - operational-feasibility: PASS — Cả bốn vế đối chiếu đúng khớp thiết kế §3: (1) CLAUDE.md dòng ~105-108 đổi "PHẢI gọi tên" thành "ĐƯỢC PHÉP ghi chỗ cắt... chỗ cắt chỉ thành Ô khi có `Gốc:`", khớp thiết kế dòng 24 (không còn bắt buộc, đúng điều kiện thành-ô); (2) luật (b) dòng 74-76 nêu rõ "Mẫu số là mốc KHO NHẬN, không phải mốc cắt số", khớp thiết kế dòng 55/75; (3) CLAUDE.md dòng 77-78 có nguyên câu "Mốc chỉ cắt khi có kho chờ nhận... và đi làn V như tiền lệ 2.5.0/2.7.0" — trùng khớp gần như nguyên văn thiết kế dòng 77-78; (4) phần sử liệu (12/35, 18/09) và các câu còn lại của luật (a), phần token/phút, mục tiêu ≤3 lượt/vòng... vẫn nhất quán nội tại, không có mâu thuẫn hay câu mồ côi khi đối chiếu hai file được cấp. Không phát hiện chỗ thiếu hoặc sai lệch nghĩa nào trong phạm vi hai file input.
    - spec-alignment: PASS — Đối chiếu CLAUDE.md (dòng 52-63 mục NEO NGOÀI và dòng 65-112 mục CHIỀU RỘNG) với thiết kế §2-§3: cả bốn điểm khớp — vế "PHẢI gọi tên" đã đổi thành "ĐƯỢC PHÉP ghi vào Notes... chỗ cắt chỉ thành Ô khi có Gốc:" (dòng 105-108, đúng vế #1 bảng §3); luật (b) đã đổi mẫu số thành "Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN" (dòng 74, đúng vế #4); có câu "Mốc chỉ cắt khi có kho chờ nhận (dòng Kho chờ nhận:... răng VC9), và đi làn V như tiền lệ 2.5.0/2.7.0" (dòng 77-78, khớp nguyên văn thiết kế); định nghĩa "neo" ở dòng 54-57 khớp hai dạng regex trong thiết kế §2, và các câu sử liệu/số liệu khác (dòng 65-73, 92-110) không mâu thuẫn với phần vừa sửa.
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E6-r3
  verifier: judgment: judge panel (fresh-context)
  verified_at: 2026-09-19T14:30:00Z
  output: |
    3/3 lens đồng thuận PASS trên đối chiếu CLAUDE.md sau sửa với 4 vế thiết kế (luật (a) không còn bắt buộc gọi tên chỗ cắt, luật (b) đổi mẫu số sang mốc-kho-nhận, câu "mốc chỉ cắt khi có kho chờ nhận" có mặt nguyên văn, phần còn lại giữ nguyên nghĩa) — không có dissent.
  human_override:

- eval: E7
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-19T14:15:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-19T14:20:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-19T14:22:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r3
  exit_code: 0
  verified_at: 2026-09-19T14:24:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-19T14:26:00Z

## Known limits

## Ngoài hợp đồng

Xem `review-findings.md` (mục "## Ngoài hợp đồng — người quyết ở Gate 2") — 13 finding ngoài phạm vi hợp đồng đã duyệt của vòng này (9 mới + 4 carried từ round trước), chưa qua đối kháng — người quyết ở Gate 2, máy không tự sửa.

## Analyst

E1, E2, E4 (VC8 chạy trên cây thật) và E7 (`product-map --check`) đều xanh trên CẢ nhánh lẫn diffBase — không phân biệt được tính năng vòng này với code cũ. Phần "cây thật" của ba eval VC8 đo trên một cây vốn đã sạch từ các vòng trước (không ô nào đang thiếu Gốc ngay lúc này), nên đây là regression-guard có chủ ý; phần phân biệt thật của VC8 nằm ở ma trận fixture chạy trong cùng tiến trình test (không có cmd riêng nên không có baseline riêng để so). `product-map --check` tương tự luôn xanh khi bản đồ khớp hồ sơ xưởng, bất kể vòng nào. Giữ nguyên như regression-guard, không viết lại ở vòng này.

## Variance

none — không có eval nào khai `runs > 1` trong vòng này.

## Iterations

Round 1: REJECT — 16 lỗi xác nhận (4 trong hợp đồng: luật bác tự-trỏ về khuôn, LB3 round-trip từ hằng, tự-ăn-thuốc thiếu chiều đỏ, và một lỗi khác). Trả về implementation.
Round 2: PASS ở tầng máy nhưng còn 2 lỗi trong hợp đồng — chốt DỪNG-VÁ (thu phạm vi thay vì vá thêm), trả về implementation theo đường B.
Round 3: đường B thi hành xong (neo còn MỘT dạng — bỏ «kho — người gọi tên», đóng t4 và t7) — E1–E7 xanh, verdict PASS.
