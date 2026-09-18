---
schema_version: 2
feature_slug: o-chi-mo-khi-co-neo-ngoai
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1f2d1e65a53501cf6e328c380add7757e6fca642
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
| E6 | AC-6 | judgment | UNCERTAIN (panel rẽ — xem khối Evidence) |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T09:00:00+07:00
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 10 ô, khuôn là nguồn luật); hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E2
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T09:00:00+07:00
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 10 ô, khuôn là nguồn luật); hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E4
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T09:00:00+07:00
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 10 ô, khuôn là nguồn luật); hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E3
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc9
  verified_at: 2026-09-18T09:00:00+07:00
  output: |
    PASS: [VC9] mốc chưa ký khai Kho chờ nhận (cây thật + 5 hồ sơ fixture rút từ khuôn; marker là nguồn)

- eval: E5
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_loi_b
  verified_at: 2026-09-18T09:00:00+07:00
  output: |
    PASS: LB2 chieu do: ban sao gate-card doi hang -> LB1 do
    PASS: LB3 ba tai lieu: khoi OOC-LOI-B co cau moi, KHONG co cau cu
    Results: 3 passed, 0 failed

- eval: E6
  judged_by: đối kháng máy — panel 3 lens (domain-correctness, operational-feasibility, spec-alignment), fresh context
  verified_at: 2026-09-18T09:00:00+07:00
  proposal: PASS
  votes:
    - domain-correctness: PASS — Cả ba điểm hỏi rõ trong AC-6 khớp đúng với CLAUDE.md: (1) dòng 102-107 đổi "PHẢI gọi tên" thành "ĐƯỢC PHÉP ghi... chỗ cắt chỉ thành Ô khi có Gốc:", đúng như vế 1 của thiết kế §3 hàng 1; (2) luật (b) dòng 74-75 viết rõ "Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN tối đa MỘT vòng meta... Mẫu số là mốc KHO NHẬN, không phải mốc cắt số", khớp với §3 hàng 4; (3) dòng 76-78 có câu "Mốc chỉ cắt khi có kho chờ nhận (dòng Kho chờ nhận:... răng VC9), và đi làn V như tiền lệ 2.5.0/2.7.0" — đúng nguyên ý §3 hàng 4. Mục "Ô chỉ mở khi có NEO NGOÀI" (dòng 52-63) cũng khớp định nghĩa neo ở §2 và hành động "ghi hạt giống, KHÔNG tạo ô" ở §3 hàng 2. Câu sử liệu dòng 75-77 ("bảy lần cắt số trong mười ngày nối trần này thành bảy mà 0 kho nhận") đọc lại vẫn parse được mạch lạc như một bằng chứng hỗ trợ cho đổi mẫu số, không mâu thuẫn với các câu còn lại của luật.
    - operational-feasibility: FAIL — Bốn câu-điểm gắn với luật (b)/(c) của "Giới hạn CHIỀU RỘNG" khớp thiết kế §3 (vế 1: "PHẢI gọi tên" → "ĐƯỢC PHÉP ghi vào Notes... chỉ thành Ô khi có Gốc:"; vế 4: mẫu số đã đổi thành "mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN NHẬN" + câu "mốc chỉ cắt khi có kho chờ nhận... đi làn V" đều có mặt nguyên văn). Nhưng mục mới «Ô chỉ mở khi có NEO NGOÀI» (CLAUDE.md dòng 52-54) tuyên phạm vi bắt buộc rộng hơn thiết kế: nó gộp cả ô "decided+build chưa có hợp đồng" vào diện phải mang Gốc ngay bây giờ, trong khi thiết kế §4 xếp rõ "decided-build không neo" vào nhóm Later (chưa làm, chỉ xét nếu ngưỡng CHẾT nổ) chứ không phải Core đang áp dụng — tức luật nói KHÔNG ĐÚNG phạm vi đang thật sự có răng (VC8 ở vế 3 chỉ phủ discovery, không phủ decided+build).
      required_evidence:
        - "CLAUDE.md dòng 52-54: \"Hàng chờ Cổng Đáng — ô `stage: discovery`, hoặc `decided`+`build` chưa có hợp đồng — phải mang dòng `Gốc:`...\" — lấy bằng `sed -n '52,54p' /Users/manhphan/dev/acceptance-gate-kit/CLAUDE.md`"
        - "docs/superpowers/specs/2026-09-18-o-chi-mo-khi-co-neo-ngoai-design.md dòng 69-71: \"Core: mọi nguồn × discovery cần Gốc: (VC8) · release-mở cần Kho chờ nhận: (VC9) · lối (b) đổi hành động (LB). Later: decided-build không neo (chữ ký là neo — nếu ngưỡng CHẾT nổ thì xét).\" — lấy bằng `sed -n '69,71p' /Users/manhphan/dev/acceptance-gate-kit/docs/superpowers/specs/2026-09-18-o-chi-mo-khi-co-neo-ngoai-design.md` — nếu owner xác nhận đây là chủ ý (luật tuyên trước, răng theo sau) thay vì lệch phạm vi, verdict đổi thành PASS/UNCERTAIN."
    - spec-alignment: PASS — CLAUDE.md's luật (c) đổi đúng từ "PHẢI gọi tên ≥1 chỗ cắt" sang "ĐƯỢC PHÉP ghi chỗ cắt... vào Notes... chỗ cắt chỉ thành Ô khi có Gốc:" — khớp thiết kế §3 hàng 1. Luật (b) đổi mẫu số thành "mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN, không phải mốc cắt số" và có câu "Mốc chỉ cắt khi có kho chờ nhận... và đi làn V như tiền lệ 2.5.0/2.7.0" — khớp thiết kế §3 hàng 4. Phần còn lại của luật (c) (5 dòng số, điều kiện tin cậy, mục tiêu ≤3 lượt, hai chốt không bị ghi đè) và bullet "Ô chỉ mở khi có NEO NGOÀI" (định nghĩa Gốc:, lối (b) ghi hạt giống không tạo ô, răng VC8/VC9) đọc mạch lạc, không mâu thuẫn nội bộ và khớp §2–§3 của bản thiết kế.
  human_override:

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-18T09:00:00+07:00

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-18T09:00:00+07:00

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r1
  exit_code: 0
  verified_at: 2026-09-18T09:00:00+07:00

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-18T09:00:00+07:00

## Known limits

## Ngoài hợp đồng

## Analyst

E7 (`node scripts/product-map.mjs --root . --check`) — pass trên cả HEAD và diffBase (`baseline: green`), không phân biệt được feature này với code cũ trên chính lệnh đó — đây là regression-guard hồi quy sẵn có của kit (kiểm PRODUCT-MAP.md khớp hồ sơ xưởng), không chứng minh hành vi mới của o-chi-mo-khi-co-neo-ngoai. AC-7 tự khai vế "tự ăn thuốc" đo bằng E1/E2/E4 (VC8) chứ không đo bằng chính E7; xem finding t15 trong review-findings.md cho lỗ ở đúng vế đó trên cây thật.

## Variance

none — không có eval nào mang field `runs` > 1 trong vòng này (mọi eval là deterministic, `runs: 1` hoặc vắng).

## Iterations

Round 1: mọi eval máy (E1–E5, E7) và bốn lệnh suite hồi quy đều exit 0 xanh, nhưng panel đối kháng của E6 rẽ (operational-feasibility: FAIL — phạm vi "Ô chỉ mở khi có NEO NGOÀI" trong CLAUDE.md rộng hơn nhóm Core mà thiết kế 2026-09-18 khai) và finder tìm 4 lỗi TRONG hợp đồng mà răng chưa bắt (AC-2: Gốc tự trỏ có ghi chú vẫn qua; AC-5: LB3 ghim literal viết tay thay vì rút từ MSG_OOC_HAT_GIONG; AC-7: vế "tự ăn thuốc" đo trên ô đã có contract.md nên bị `hangCho` loại khỏi phạm vi răng) — bằng chứng không tự dối nên verdict là REJECT dù bảng eval toàn PASS; quay lại implementation để vá 4 lỗi trong hợp đồng và đưa dissent của E6 lên owner.
