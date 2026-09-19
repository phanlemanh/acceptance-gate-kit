---
schema_version: 2
feature_slug: o-chi-mo-khi-co-neo-ngoai
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3216538753b924a31da7247e6b00c40705505582
human_signoff:
---

# Evidence Report: o-chi-mo-khi-co-neo-ngoai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | judgment | FAIL |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-19T10:00:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 9 ca đỏ chấm dưới luật thật; luật kit là nguồn, bốn mutant; ba vật giao đi không mang mảnh luật kit, có chiều đỏ); tự ăn thuốc hai chiều trên ô của chính vòng; 7 stub đúng một ngăn

- eval: E2
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E2-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-19T10:00:00Z
  output: |
    PASS: [VC8] mọi ô hàng chờ có Gốc hợp lệ (cây thật + ma trận 9 ca đỏ chấm dưới luật thật; luật kit là nguồn, bốn mutant; ba vật giao đi không mang mảnh luật kit, có chiều đỏ); tự ăn thuốc hai chiều trên ô của chính vòng; 7 stub đúng một ngăn

- eval: E4
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E4-r3
  exit_code: 0
  verifier: config:executors.script.neo_vc8
  verified_at: 2026-09-18T18:25:00Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E5
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E5-r3
  exit_code: 0
  verifier: config:executors.script.neo_loi_b
  verified_at: 2026-09-18T18:25:00Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E6
  judged_by: panel (fresh context) — 3 lens: domain-correctness, operational-feasibility, spec-alignment
  proposal: FAIL
  votes:
    - domain-correctness: FAIL — |
        Ba vế đầu khớp thiết kế §3: vế «PHẢI gọi tên» đã đổi thành «ĐƯỢC PHÉP» (dòng 134), luật (b) đã đổi mẫu số sang «mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN» thay vì mốc cắt số (dòng 103-105), và vế «mốc chỉ cắt khi có kho chờ nhận» có mặt, khai rõ CHƯA CÓ RĂNG kèm ngưỡng 21 ngày đang đếm (dòng 84-88). Nhưng «các câu khác của luật» KHÔNG giữ nguyên nghĩa: chính câu luật (b) ở dòng 106 viết «(dòng `Kho chờ nhận:` trong hồ sơ mốc — răng VC9)» như thể VC9 đang là răng sống cho đúng yêu cầu này, mâu thuẫn trực tiếp với dòng 86-87 hai đoạn trước đó nói bản răng đó (một dòng tự khai trong hồ sơ mốc) «đã dựng và GỠ 19/09».
      required_evidence:
        - "CLAUDE.md dòng 103-107 (luật (b), mục Giới hạn CHIỀU RỘNG): '...Mốc chỉ cắt khi có kho chờ nhận (dòng `Kho chờ nhận:` trong hồ sơ mốc — răng VC9), và đi làn V...' — trích dẫn \"răng VC9\" như một cơ chế đang sống, gắn liền với đúng yêu cầu \"mốc chỉ cắt khi có kho chờ nhận\"."
        - "CLAUDE.md dòng 84-88 (mục Ô chỉ mở khi có NEO NGOÀI, khối 'Giới hạn đã khai'): '...Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG. Răng đúng tầng là... bản chiếu yếu của nó (một dòng tự khai trong hồ sơ mốc) đã dựng và GỠ 19/09 vì nó rò vào khuôn giao đi...' — cùng một yêu cầu (dòng `Kho chờ nhận:` trong hồ sơ mốc) bị khai là ĐÃ GỠ, không còn răng, ngược hẳn với dòng 106."
        - "Cần đối chiếu tests/plugins/vao-co-o.test.mjs (hoặc git log của file đó quanh 18-19/09) để xác nhận VC9 hiện có tồn tại/chạy hay đã bị gỡ thật — nếu VC9 đã gỡ thì dòng 106 phải sửa lại (bỏ '— răng VC9'); nếu VC9 còn sống thì dòng 84-88 phải sửa lại (không còn 'CHƯA CÓ RĂNG')."
    - operational-feasibility: FAIL — |
        Ba vế đầu khớp thiết kế §3: vế "PHẢI gọi tên" đã hạ thành "ĐƯỢC PHÉP" (CLAUDE.md dòng 134), luật (b) đã đổi mẫu số thành "hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN" (dòng 103), và mục "Ô chỉ mở khi có NEO NGOÀI" (dòng 84-88) khai đúng vế 4 là "CHƯA CÓ RĂNG" kèm ngưỡng đang đếm (21 ngày). Nhưng chính luật (b) ở dòng 106 lại nói "Mốc chỉ cắt khi có kho chờ nhận (dòng `Kho chờ nhận:` trong hồ sơ mốc — răng VC9)" như thể VC9 là một răng đang hoạt động — mâu thuẫn trực tiếp với dòng 84-88 vốn nói chính cơ chế tự khai này ("một dòng tự khai trong hồ sơ mốc") đã dựng rồi bị GỠ ngày 19/09. Hai đoạn trong cùng CLAUDE.md mô tả trạng thái đối lập của cùng một cơ chế, nên luật không "nói ĐÚNG" ở phần khai chi tiết của vế 4.
      required_evidence:
        - "Đọc lại CLAUDE.md dòng 103-107 (luật (b)) và đối chiếu với dòng 84-88 (mục Ô chỉ mở khi có NEO NGOÀI): dòng 106 viết \"...dòng `Kho chờ nhận:` trong hồ sơ mốc — răng VC9\" như đang tồn tại, trong khi dòng 84-88 khai rõ \"Vế 4 của luật (b)... CHƯA CÓ RĂNG\" và nói chính cơ chế \"một dòng tự khai trong hồ sơ mốc\" đã \"dựng và GỠ 19/09\". Nếu owner xác nhận VC9 thực sự đã bị gỡ (khớp dòng 84-88), thì dòng 106 cần sửa để không còn nhắc \"răng VC9\" như một cơ chế đang hoạt động — sửa xong, verdict đổi thành PASS."
    - spec-alignment: FAIL — |
        Vế 1 và vế 2 khớp thiết kế §3 (dòng 134-136: "ĐƯỢC PHÉP" thay "PHẢI"; dòng 103-105: mẫu số đổi thành "mốc KHO NHẬN"). Nhưng vế 3/4 tự mâu thuẫn NGAY TRONG CLAUDE.md: mục «Ô chỉ mở khi có NEO NGOÀI» (dòng 84-88) khai rõ vế 4 của luật (b) "CHƯA CÓ RĂNG" và rằng "bản chiếu yếu của nó (một dòng tự khai trong hồ sơ mốc) đã dựng và GỠ 19/09" — trong khi chính luật (b) ở mục «Giới hạn CHIỀU RỘNG» (dòng 106) lại viết "Mốc chỉ cắt khi có kho chờ nhận (dòng `Kho chờ nhận:` trong hồ sơ mốc — răng VC9)", tức khẳng định răng đó đang tồn tại và enforce đúng cơ chế vừa bị khai là đã gỡ. Hai câu trong cùng một file nói trái nhau về cùng một cơ chế nên "sử liệu cùng các câu khác của luật giữ nguyên nghĩa" không đúng.
      required_evidence:
        - "CLAUDE.md dòng 106 (bullet Giới hạn CHIỀU RỘNG, luật (b)): cụm \"(dòng `Kho chờ nhận:` trong hồ sơ mốc — răng VC9)\" cần sửa/bỏ (vd đổi thành \"CHƯA CÓ RĂNG, xem ngưỡng ở mục Ô chỉ mở khi có NEO NGOÀI\") để khớp với dòng 84-88 cùng file, nơi khai rằng đúng cơ chế này (dòng tự khai `Kho chờ nhận:` trong hồ sơ mốc) \"đã dựng và GỠ 19/09\" và vế 4 \"CHƯA CÓ RĂNG\". Sửa xong khớp nghĩa thì verdict đổi thành PASS."
  human_override:

- eval: E7
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-E7-r3
  exit_code: 0
  verifier: config:executors.script.product_map
  verified_at: 2026-09-18T18:25:00Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_scripts_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-09-19T10:05:00Z
  output: |
    PASS: SELF02 (đối chứng đường: phép quét bắt được lỗi khi nó CÓ thật)

    Results: 886 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_hooks_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-09-19T10:06:00Z
  output: |
    PASS: V16

    Results: 70 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r6
  exit_code: 0
  verified_at: 2026-09-19T10:07:00Z
  output: |
    MUTANT-6 bị bắt: doc_manifest() FAIL-LOUD ghim 'site thiếu số bản: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-bash_tests_workflows_run_tests_sh-r6
  exit_code: 0
  verified_at: 2026-09-19T10:08:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-o-chi-mo-khi-co-neo-ngoai-SUITE-node_scripts_product_map_mjs_root_check-r6
  exit_code: 0
  verified_at: 2026-09-19T10:09:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — không có eval nào có runs > 1 (không có eval ngẫu nhiên)

## Iterations

Round 4: REJECT 7/7 trong hợp đồng — đường A không đóng được lớp, máy dừng.
Round 5: khôi phục phép chấm ma trận — luật "neo không trỏ chính nó" đã chết lặng từ commit cắt.
Round 6: E1/E2 (VC8) PASS trên cây thật + ma trận CA_DO khôi phục; E4/E5/E7 carry-forward từ round 3 (delta không chạm paths); E6 (judgment AC-6, luật Giới hạn CHIỀU RỘNG) FAIL cả 3 lens — CLAUDE.md dòng 106 tự mâu thuẫn với dòng 84-88 (nói "răng VC9" đang sống trong khi đoạn khác khai đã GỠ 19/09). Verdict REJECT — trả về sửa câu luật (b) trước khi verify lại.
