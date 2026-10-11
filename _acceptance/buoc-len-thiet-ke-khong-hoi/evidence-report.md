---
schema_version: 2
feature_slug: buoc-len-thiet-ke-khong-hoi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 340d2e42bd7b3e509cd98aab7286dc7d78e66a6d
human_signoff:
---

# Evidence Report: buoc-len-thiet-ke-khong-hoi

Round 1. Mọi eval máy và ui-check đều xanh. Verdict REJECT vì review tìm được một lỗi TRONG hợp đồng ở AC-6: ca đo `CC-06 bo-doc` so hai vế đều là hằng số nên mệnh đề «các bộ đọc khác ra cùng kết quả có/không khoá can_cu» chưa được chứng minh (chi tiết ở `review-findings.md`, mục «Trong hợp đồng»).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS |
| E9 | AC-9 | ui-check | PASS |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E2
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T12:55:28Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
    Results: 838 passed, 0 failed

- eval: E3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T12:55:28Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
    Results: 838 passed, 0 failed

- eval: E4
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T12:55:28Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
    Results: 838 passed, 0 failed

- eval: E5
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T12:55:28Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
    Results: 838 passed, 0 failed

- eval: E6
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T12:55:28Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
    Results: 838 passed, 0 failed

- eval: E7
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T12:55:28Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
    Results: 838 passed, 0 failed

- eval: E10
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-11T12:55:28Z
  output: |
    bash tests/scripts/run-tests.sh --manh bash
    Results: 838 passed, 0 failed

- eval: E9
  run_id: minted-buoc-len-thiet-ke-khong-hoi-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-10-11T12:55:28Z
  screenshot: evidence/E9-step1.png
  observed: |
    E9-step1.png (1280x800): thẻ rộng khoảng 640px. Thứ tự khối từ trên xuống: Hệ thống sẽ làm, Sẽ không làm / Sẽ chặn, Câu chỉ anh trả lời được (xanh), Máy đã quyết ở bước thiết kế (xám), Quyết định & trade-off, Độ phủ AC. Hỏi-1 đọc được khuyến nghị + lối khác; Hỏi-2 mang nhãn khó-đảo (đúng một câu, card.html có 1 lần chữ này) cùng khuyến nghị + lối khác. Máy đã quyết m1 đọc được câu trích và tệp (CLAUDE.md); m2 đọc được lý do lối khác chết.
    E9-step2.png (390x844, iframe): không bị cắt ngang, chữ xuống dòng, chip «duyệt tiêu chí» nằm trong thẻ, thứ tự khối giữ nguyên; scrollWidth đo được 390 (clientWidth 390), 390 <= 390. Một màn đọc trả lời được «máy đã quyết gì, còn hỏi gì».
  network_observed: n-a (driver)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-buoc-len-thiet-ke-khong-hoi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T12:55:28Z

### Judgment (đề xuất của hội đồng — người quyết ở Cổng 2)

Hội đồng đề xuất PASS cho cả hai eval. `human_override` để TRỐNG cho người điền.

- eval: E1
  judged_by: judge-subagent panel (fresh context)
  verdict: PASS
  panel_votes:
    - domain-correctness: PASS — Mọi câu hỏi đều đúng. S1 mục 1 ngoài đợt viết lại thành «KHÔNG hỏi-đáp», cấm dừng xin duyệt và hỏi «làm ngay chứ?» / «chọn A hay B?». Mục này xếp lựa chọn theo ba nguồn căn cứ kèm việc máy làm, nói không trỏ được căn cứ thì là chỉ người có, và khó-đảo luôn là câu hỏi. Câu chỉ-người-biết soạn nháp rồi lên thẻ Cổng Phạm vi thành «Hỏi-n». Bất biến dừng có thêm vế sổ bước thiết kế, /goal dời về lời mời Cổng Đáng, ý (4) của gap-probe soi đủ bốn điểm với P0 xử lý bằng dòng S1 mang supersedes. Mục Sổ quyết định có khuôn DEC-LAT-GATE1. Bước 3 của acceptance-card.md truyền gốc nhánh khi sổ có dòng can_cu. Khối TRONG-DOT giữ nguyên (cùng hash shasum giữa 0b664c3b và HEAD).
    - operational-feasibility: PASS — Mọi câu hỏi đều đúng trên chữ trong SKILL.md và acceptance-card.md (cấm dừng xin duyệt, ba nguồn căn cứ kèm việc máy làm, khó-đảo luôn là câu hỏi, câu chỉ-người-biết lên thẻ thành «Hỏi-n», danh sách dừng Gate 1 có vế sổ còn câu chỉ-người-biết hoặc dòng đỏ, điểm vũ trang /goal đầu tiên dời về lời mời Cổng Đáng, ý (4) của phản biện soi đủ bốn chỗ, DEC-LAT-GATE1 có stage gate1 + supersedes + decided_by, bước 3 truyền --glossary-base khi sổ có can_cu, khối TRONG-DOT còn đủ bốn mục S0, S1, S4, S5 cùng dòng khối-không-đổi-bảng-cổng). Lưu ý ngoài phạm vi các câu hỏi: lệnh `node scripts/can-cu-s1.cjs` ở S1 mục 5 là đường tương đối, chỉ chạy được trong chính kho kit; judge không thể kiểm khối TRONG-DOT có byte-nguyên so với bản trước, chỉ kiểm được nó còn đủ và mạch lạc.
    - spec-alignment: PASS — S1 mục 1 (ngoài đợt) cấm dừng xin duyệt thiết kế và cấm hỏi «làm ngay chứ?»; xếp lựa chọn theo ba nguồn căn cứ kèm việc máy làm, khó-đảo luôn là câu hỏi, câu chỉ-người-biết soạn nháp rồi đưa lên thẻ Cổng Phạm vi thành «Hỏi-n». Các phần còn lại khớp design §3.1/3.5/3.6/3.8 và ô cơ hội: danh sách dừng Gate 1 có vế «sổ bước thiết kế còn câu chỉ-người-biết hoặc dòng đỏ», điểm vũ trang /goal đầu tiên là lời mời Cổng Đáng, ý (4) của gap-probe soi mọi dòng S1 máy đã quyết theo bốn kiểm tra với P0 xử lý bằng dòng S1 mới mang supersedes, khuôn DEC-LAT-GATE1 (stage gate1, supersedes, decided_by) kèm lời dặn ghi trước khi soạn lại, bước 3 của acceptance-card.md truyền --glossary-base khi sổ có can_cu, khối TRONG-DOT còn nguyên lời dặn riêng. Judge chỉ đọc trạng thái hiện tại của khối, không so diff nên không xác nhận được «không đổi một byte».
  human_override:  # chi nguoi ghi

- eval: E8
  judged_by: judge-subagent panel (fresh context)
  verdict: PASS
  panel_votes:
    - domain-correctness: PASS — Mục sổ quyết định của GUIDE.md nêu đủ ba nguồn (mục tiêu + quy tắc · một lối ra · chỉ người có) cùng trường đi kèm, cờ `kho_dao` luôn là câu hỏi, dòng không khoá được đọc như đời trước, và ba khối trên thẻ Cổng Phạm vi kèm cờ đỏ. CONTEXT.md có mục «Nguồn căn cứ» kèm `_Avoid_`. ADR 0022 giải thích vì sao khoá này không trái ADR 0021 (con trỏ cho máy kiểm, ba câu của người đọc giữ nguyên), nêu chủ kho phê phần CỘNG ở Cổng Phạm vi theo ADR 0018, và nêu đường đảo (ngừng ghi khoá, bộ đọc coi dòng không khoá là đời trước, không đỏ).
    - operational-feasibility: PASS — Bốn tệp đủ cho cả ba phần. GUIDE (mục «Sổ quyết định», dòng 325–345) nêu ba nguồn với khoá `nguon` và trường đi kèm, cờ `kho_dao`, dòng không khoá là đời trước, ba khối trên thẻ Cổng Phạm vi cùng cờ đỏ chặn lệnh duyệt điền sẵn. CONTEXT (dòng 341–347) có định nghĩa «Nguồn căn cứ» kèm _Avoid_. ADR 0022 đủ ba ý: vì sao không trái 0021, chủ kho phê CỘNG đích danh ở Cổng Phạm vi theo ADR 0018, đường đảo là ngừng ghi khoá. Hai chỗ mỏng nhưng không làm hỏng kết luận: cú pháp dòng JSON đầy đủ được GUIDE đẩy sang khuôn `DEC-CAN-CU-SLOT` trong SKILL (ngoài danh sách input) nên người đọc biết khoá và trường nhưng không thấy dòng mẫu; thẻ in câu trích cạnh lựa chọn máy đã quyết, ADR 0022 chỉ nêu điều này như lưới đối chiếu chứ không biện giải rõ với «ba câu» của 0021.
    - spec-alignment: PASS — Đủ hết các điểm hỏi: mục sổ quyết định của GUIDE.md nêu ba nguồn với khoá riêng (muc-tieu + tep/trich, mot-loi + loi_chet, chi-nguoi + khuyen/loi_khac), cờ kho_dao luôn là câu hỏi, dòng không có khoá đọc như đời trước, thẻ Cổng Phạm vi có ba khối. CONTEXT.md định nghĩa «Nguồn căn cứ» kèm _Avoid_. ADR 0022 giải thích vì sao không trái ADR 0021, ghi chủ kho phê CỘNG đích danh ở Cổng Phạm vi, nêu đường đảo ngừng ghi khoá. Có hai chỗ nhỏ chưa rõ nhưng không làm hụt tiêu chí.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên CẢ HEAD lẫn baseline): E2, E3, E4, E5, E6, E7, E10 (cùng lệnh `bash tests/scripts/run-tests.sh --manh bash`). Cần viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

Baseline khong do: E9 (ui-check, kết quả máy ghi n-a) và chín lệnh suite hồi quy (kết quả máy ghi n-a). Kết quả máy không ghi lại lý do cụ thể của từng n-a.

Review ghi một finding TRONG hợp đồng (AC-6, ca đo `CC-06 bo-doc`) — đây là nguyên nhân của verdict REJECT dù mọi eval xanh; xem `review-findings.md`.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy, ui-check và suite hồi quy xanh; REJECT vì một finding trong hợp đồng ở AC-6 (ca đo CC-06 bo-doc so hai vế đều là hằng số, không có đối chứng dương). Returned to implementation.
