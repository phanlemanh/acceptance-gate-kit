---
schema_version: 2
feature_slug: o-chi-mo-khi-co-neo-ngoai
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 36f47814ae82834198dfe6d91f8cae43085cb03a
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

Mọi eval kịch bản đều xanh, nhưng verdict tổng là REJECT vì hai lý do độc lập với bảng trên:
(1) review xác nhận hai lỗi THẬT nằm trong hợp đồng (AC-2, AC-3) mà không eval nào trong bảng
chạm tới — xem `review-findings.md` mục "## Trong hợp đồng"; và (2) lệnh suite
`bash tests/scripts/run-tests.sh` — không gắn eval nào — thoát mã khác 0 (khối trong mục
"### Lệnh suite (hồi quy)" bên dưới).

## Evidence

- eval: E1
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T18:25:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E2
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T18:25:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E3
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E3-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.neo_vc9
  verified_at: 2026-09-18T18:25:00Z
  output: |
    PASS: [VC9] mốc chưa ký khai Kho chờ nhận (cây thật + 5 hồ sơ fixture rút từ khuôn; marker là nguồn)

- eval: E4
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T18:25:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô (một dạng neo); khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E5
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.neo_loi_b
  verified_at: 2026-09-18T18:25:00Z
  output: |
    PASS: LB2 chieu do: ban sao gate-card doi hang -> LB1 do
    PASS: LB3 ba tai lieu: khoi OOC-LOI-B co cau moi, KHONG co cau cu
    Results: 3 passed, 0 failed

- eval: E6
  judged_by: judge panel (fresh-context) — domain-correctness, operational-feasibility, spec-alignment
  proposal: PASS
  votes:
    - domain-correctness: PASS — Đối chiếu trực tiếp: (1) CLAUDE.md đổi "PHẢI gọi tên ít nhất MỘT chỗ cắt" thành "ĐƯỢC PHÉP ghi chỗ cắt... vào Notes", đúng khớp vế 1 của bảng §3 thiết kế; (2) luật (b) đổi "Giữa hai release" thành "Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN", đúng khớp vế 4; (3) câu "Mốc chỉ cắt khi có kho chờ nhận (dòng Kho chờ nhận:...), và đi làn V như tiền lệ 2.5.0/2.7.0" có mặt nguyên văn, khớp vế 4; (4) các câu còn lại (a), phần "Ô chỉ mở khi có NEO NGOÀI" khớp định nghĩa neo và phạm vi ở §2/§3 thiết kế, không phát hiện mâu thuẫn hay sai lệch nghĩa nào giữa hai văn bản trong phạm vi hai file được cấp.
    - operational-feasibility: PASS — CLAUDE.md phản ánh đủ và đúng cả bốn vế của thiết kế §3: (1) vế "PHẢI gọi tên chỗ cắt" đã đổi thành "ĐƯỢC PHÉP ghi... ; chỗ cắt chỉ thành Ô khi có Gốc:" (dòng ~105-108), tham chiếu quy tắc cũ chỉ còn ở dạng trích dẫn lịch sử trong ngoặc; (2) luật (b) nói rõ "Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN... Mẫu số là mốc KHO NHẬN, không phải mốc cắt số" (dòng 74-76); (3) có câu "Mốc chỉ cắt khi có kho chờ nhận (dòng Kho chờ nhận:... răng VC9), và đi làn V như tiền lệ 2.5.0/2.7.0" (dòng 77-78) khớp thiết kế; (4) các câu sử liệu/lịch sử khác (án cắt kit đã bỏ, mục tiêu ≤3 lượt, hai chốt không mục tiêu số nào ghi đè...) không bị đụng chạm và không mâu thuẫn với phần vừa sửa. Không tìm thấy chỗ nào còn sót khẳng định "PHẢI gọi tên chỗ cắt" như quy tắc hiện hành.
    - spec-alignment: PASS — CLAUDE.md luật (c) đã hạ đúng như thiết kế §3 vế 1: "PHẢI gọi tên" → "ĐƯỢC PHÉP ghi chỗ cắt cho cửa sổ kế... chỗ cắt chỉ thành Ô khi có `Gốc:`". Luật (b) đã đổi mẫu số đúng vế 4: "Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN tối đa MỘT vòng meta... Mẫu số là mốc KHO NHẬN, không phải mốc cắt số" và có câu "Mốc chỉ cắt khi có kho chờ nhận (dòng `Kho chờ nhận:`... — răng VC9), và đi làn V như tiền lệ 2.5.0/2.7.0" — khớp nguyên văn ý thiết kế. Mục «Ô chỉ mở khi có NEO NGOÀI» cũng khớp định nghĩa neo, phạm vi VC8, và hành động ghi hạt giống thay vì tạo ô ở §2–§3 thiết kế. Các câu khác của luật (a), (c) phần 5-dòng-số, mục tiêu ≤3 lượt/≤1 chạm, hai chốt không mục tiêu số ghi đè — không thấy mâu thuẫn với hai vế vừa đổi, đọc mạch lạc và nhất quán nội bộ với hai file trong phạm vi.
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E6-r3
  verifier: judgment: judge panel (fresh-context)
  verified_at: 2026-09-18T18:25:00Z
  output: |
    3/3 lens đồng thuận PASS trên đối chiếu CLAUDE.md sau sửa với 4 vế thiết kế (luật (a) không còn bắt buộc gọi tên chỗ cắt, luật (b) đổi mẫu số sang mốc-kho-nhận, câu "mốc chỉ cắt khi có kho chờ nhận" có mặt nguyên văn, phần còn lại giữ nguyên nghĩa) — không có dissent.
  human_override:

- eval: E7
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-18T18:25:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_scripts_run_tests_sh-r3
  exit_code: 1
  verified_at: 2026-09-18T18:25:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-18T18:25:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r3
  exit_code: 0
  verified_at: 2026-09-18T18:25:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-09-18T18:25:00Z

## Known limits

## Ngoài hợp đồng

Xem `review-findings.md` (mục "## Ngoài hợp đồng — người quyết ở Gate 2") — 12 finding ngoài phạm vi hợp đồng đã duyệt của vòng này (8 mới + 4 carried từ round trước), chưa qua đối kháng — người quyết ở Gate 2, máy không tự sửa.

## Analyst

E1, E2, E4 (VC8 chạy trên cây thật) và E7 (`product-map --check`) đều xanh trên CẢ nhánh lẫn diffBase — không phân biệt được tính năng vòng này với code cũ. Phần "cây thật" của ba eval VC8 đo trên một cây vốn đã sạch từ các vòng trước (không ô nào đang thiếu Gốc ngay lúc này), nên đây là regression-guard có chủ ý; phần phân biệt thật của VC8 nằm ở ma trận fixture chạy trong cùng tiến trình test (không có cmd riêng nên không có baseline riêng để so). `product-map --check` tương tự luôn xanh khi bản đồ khớp hồ sơ xưởng, bất kể vòng nào. Giữ nguyên như regression-guard, không viết lại ở vòng này.

## Variance

none — không có eval nào khai `runs > 1` trong vòng này.

## Iterations

Round 1: REJECT — 4 lỗi trong hợp đồng (luật bác tự-trỏ về khuôn, LB3 round-trip từ hằng, tự-ăn-thuốc thiếu chiều đỏ, và một lỗi khác). Trả về implementation.
Round 2: PASS ở tầng máy nhưng còn 2 lỗi trong hợp đồng — chốt DỪNG-VÁ (thu phạm vi thay vì vá thêm), trả về implementation theo đường B.
Round 3: đường B thi hành (neo còn MỘT dạng — bỏ «kho — người gọi tên», đóng t4 và t7 của round trước) — nhưng lượt tổng hợp trước bị lỗi điều phối (args ráp tay làm mất dòng panel + một evalsHash bịa); soạn lại cho đúng thì review xác nhận 2 lỗi MỚI trong hợp đồng (AC-2, AC-3 — chưa eval nào bắt) và lệnh suite `bash tests/scripts/run-tests.sh` thoát mã khác 0 → verdict REJECT, đã chạm trần 3 vòng, escalate cho người.