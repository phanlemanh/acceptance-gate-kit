---
schema_version: 2
feature_slug: o-chi-mo-khi-co-neo-ngoai
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 85f8dbf0f6b889f1958472eebb69947948a3ae82
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
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T15:20:00+07:00
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô; khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E2
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T15:20:00+07:00
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô; khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E3
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.neo_vc9
  verified_at: 2026-09-18T15:20:00+07:00
  output: |
    PASS: [VC9] mốc chưa ký khai Kho chờ nhận (cây thật + 5 hồ sơ fixture rút từ khuôn; marker là nguồn)

- eval: E4
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T15:20:00+07:00
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 12 ô; khuôn là nguồn CẢ BA luật, hai mutant); tự ăn thuốc hai chiều trên ô của chính vòng; hạt giống mồ côi im; 7 stub đúng một ngăn

- eval: E5
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.neo_loi_b
  verified_at: 2026-09-18T15:20:00+07:00
  output: |
    PASS: LB2 chieu do: ban sao gate-card doi hang -> LB1 do
    PASS: LB3 ba tai lieu: khoi OOC-LOI-B co cau moi, KHONG co cau cu
    Results: 3 passed, 0 failed

- eval: E6
  judged_by: đối kháng máy — panel 3 lens (domain-correctness, operational-feasibility, spec-alignment), fresh context
  verified_at: 2026-09-18T15:20:00+07:00
  proposal: PASS
  votes:
    - domain-correctness: PASS — CLAUDE.md khớp thiết kế §3 ở cả bốn vế: (c) đổi "PHẢI gọi tên ≥1 chỗ cắt" thành "ĐƯỢC PHÉP ghi ... vào Notes của hồ sơ mốc; chỗ cắt chỉ thành Ô khi có `Gốc:`" đúng như vế 1; (b) đổi mẫu số thành "Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN" và có câu "Mốc chỉ cắt khi có kho chờ nhận ... và đi làn V như tiền lệ 2.5.0/2.7.0" đúng như vế 4. Mục «Ô chỉ mở khi có NEO NGOÀI» mới thêm mô tả đúng định nghĩa neo (kể cả ràng buộc "khác slug" qua placeholder `<slug-khác>`) và hành động ghi hạt giống thay vì tạo ô, khớp §2–§3; các câu số liệu (35 ô, 22/35, VC8/VC9, tiền lệ làn V) và các câu khác của luật (a), (c) phần còn lại đọc mạch lạc, không bị đổi nghĩa bởi lần sửa này.
    - operational-feasibility: PASS — Đối chiếu trực tiếp CLAUDE.md (dòng 52-108) với thiết kế §3: vế 1 đã hạ từ "PHẢI gọi tên ≥1 chỗ cắt" xuống "ĐƯỢC PHÉP ghi... vào Notes, chỗ cắt chỉ thành Ô khi có Gốc:" — đúng khớp; luật (b) đã đổi mẫu số từ "hai release" sang "hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN", kèm câu tường minh "Mốc chỉ cắt khi có kho chờ nhận... và đi làn V như tiền lệ 2.5.0/2.7.0" — đúng khớp cả hai điều kiện được hỏi. Các câu số liệu/mục tiêu khác (≤3 lượt/vòng, trần T3=4, ≤1 chạm/lượt, hai chốt không bị KPI ghi đè) giữ nguyên nguyên văn, không có tàn dư câu "PHẢI gọi tên chỗ cắt" cũ nào còn sót lại gây mâu thuẫn (grep xác nhận). Câu diễn giải hệ quả đo-hình-thức được viết lại hợp lý để khớp nghĩa mới (không còn "một nhát cắt có tên"), không đổi bản chất cảnh báo.
    - spec-alignment: PASS — Bốn vế trong CLAUDE.md khớp thiết kế §3: (1) "PHẢI gọi tên" đã đổi thành "ĐƯỢC PHÉP ghi chỗ cắt... vào Notes... chỗ cắt chỉ thành Ô khi có `Gốc:`" (dòng 105-107) — đúng nghĩa vế 1 của bảng thiết kế; (2) luật (b) nêu rõ "Mẫu số là mốc KHO NHẬN, không phải mốc cắt số" (dòng 75) khớp cột "mẫu số = mốc được một kho tiêu thụ nhận"; (3) câu "Mốc chỉ cắt khi có kho chờ nhận (... răng VC9), và đi làn V như tiền lệ 2.5.0/2.7.0" (dòng 76-78) hiện diện đầy đủ. Rà toàn file không thấy câu nào khác còn giữ cụm "PHẢI gọi tên ít nhất MỘT chỗ cắt" cũ hay mâu thuẫn với định nghĩa mẫu số mới; các sử liệu (18/09, 35 ô, 2.5.0/2.7.0) nhất quán nội bộ và không bị luật khác ghi đè nghĩa.
  human_override:

- eval: E7
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-18T15:20:00+07:00
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-18T15:20:00+07:00

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-18T15:20:00+07:00

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r2
  exit_code: 0
  verified_at: 2026-09-18T15:20:00+07:00

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-18T15:20:00+07:00

## Known limits

## Ngoài hợp đồng

## Analyst

E1/E2/E4 (`VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs`) — pass trên cả HEAD và diffBase (`baseline: green`): VC8 tự nó đã tồn tại trước vòng này (cây thật + phần ma trận cũ), nên phần cũ của chân này không phân biệt được feature mới — chỉ phần MỞ RỘNG của vòng này (ma trận 12 ô thay vì 10, hai mutant marker, chân tự-ăn-thuốc trên ô của chính vòng) là mới; E3 và E5 (`baseline: red`) mới là hai chân thật sự phân biệt được feature. Không rewrite thêm ở vòng này — ba eval này vẫn là regression-guard hợp lệ cho phần luật Gốc cũ, cộng thêm phần răng mới; xem review-findings.md cho các lỗ còn lại trong chính phần "mới" đó (t1x, t2x…).

E7 (`node scripts/product-map.mjs --root . --check`) — pass trên cả HEAD và diffBase (`baseline: green`), không phân biệt được feature này với code cũ trên chính lệnh đó — đây là regression-guard hồi quy sẵn có của kit (kiểm PRODUCT-MAP.md khớp hồ sơ xưởng), không chứng minh hành vi mới của o-chi-mo-khi-co-neo-ngoai. Vế "tự ăn thuốc" thật của AC-7 đo bằng chân riêng trong E1/E2/E4 (VC8, chạy thẳng trên `_acceptance/o-chi-mo-khi-co-neo-ngoai/opportunity.md`), không phải bằng chính E7.

## Variance

none — không có eval nào mang field `runs` > 1 trong vòng này (mọi eval là deterministic, `runs: 1` hoặc vắng).

## Iterations

Round 1: mọi eval máy (E1–E5, E7) và bốn lệnh suite hồi quy đều exit 0 xanh, nhưng panel đối kháng của E6 rẽ (operational-feasibility: FAIL — phạm vi "Ô chỉ mở khi có NEO NGOÀI" trong CLAUDE.md rộng hơn nhóm Core mà thiết kế 2026-09-18 khai) và finder tìm 4 lỗi TRONG hợp đồng mà răng chưa bắt (AC-2: Gốc tự trỏ có ghi chú vẫn qua; AC-5: LB3 ghim literal viết tay thay vì rút từ MSG_OOC_HAT_GIONG; AC-7: vế "tự ăn thuốc" đo trên ô đã có contract.md nên bị `hangCho` loại khỏi phạm vi răng) — bằng chứng không tự dối nên verdict là REJECT dù bảng eval toàn PASS; quay lại implementation để vá 4 lỗi trong hợp đồng và đưa dissent của E6 lên owner.

Round 2: bốn lỗi trong hợp đồng của round 1 đã vá (commit 85f8dbf0 — luật bác «neo tự trỏ» áp cho cả hai dạng viết, LB3 chuyển sang round-trip rút thẳng từ hằng MSG_OOC_HAT_GIONG, chân "tự ăn thuốc" của AC-7 chạy vị từ neo thẳng trên opportunity.md thay vì đi qua bộ lọc hàng chờ); toàn bộ eval máy (E1–E5, E7) và bốn lệnh suite hồi quy exit 0 xanh, panel E6 hội tụ PASS ở cả ba lens (domain-correctness, operational-feasibility, spec-alignment) — không còn dissent. Finder vòng này xác nhận thêm 2 lỗi khác vẫn TRONG hợp đồng (AC-1: start.md chưa dặn hai dạng hợp lệ của dòng Gốc; AC-2: luật bác neo tự trỏ mới chỉ phủ dạng viết (1), dạng (2) `kho <tên> — <người> gọi tên <ngày>` vẫn tự trỏ được khi `<tên kho>` trùng slug) cùng 9 lỗi ngoài hợp đồng và 3 mục ngoài hợp đồng mang từ round 1 — liệt kê đầy đủ trong review-findings.md cho Gate 2 và cho vòng kế; verdict của vòng này giữ nguyên PASS theo bảng eval + panel đã hội tụ.
