---
schema_version: 2
feature_slug: lo-trinh-chi-viec-phat-trien
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f65cdb462b374cbc4549e00ace069f0bbd62f6bd
human_signoff:
---

# Evidence Report: lo-trinh-chi-viec-phat-trien

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | judgment | UNCERTAIN |
| E10 | AC-10 | test | PASS |

Chín eval máy (E1–E8, E10) xanh; E9 là phán đoán của hội đồng, ba góc nhìn cùng đề xuất FAIL nên báo cáo dừng ở PENDING-JUDGMENT chờ người quyết ở Cổng Bằng chứng. Chưa có mục nào được nâng thành PASS.

## Evidence

- eval: E1
  run_id: minted-lo-trinh-chi-viec-phat-trien-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)
    (một lệnh `node tests/scripts/lo-trinh.test.mjs` phủ E1–E8 và E10; bản ghi cuối chỉ giữ dòng tổng kết)

- eval: E2
  run_id: minted-lo-trinh-chi-viec-phat-trien-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

- eval: E3
  run_id: minted-lo-trinh-chi-viec-phat-trien-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

- eval: E4
  run_id: minted-lo-trinh-chi-viec-phat-trien-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

- eval: E5
  run_id: minted-lo-trinh-chi-viec-phat-trien-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

- eval: E6
  run_id: minted-lo-trinh-chi-viec-phat-trien-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

- eval: E7
  run_id: minted-lo-trinh-chi-viec-phat-trien-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

- eval: E8
  run_id: minted-lo-trinh-chi-viec-phat-trien-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

- eval: E10
  run_id: minted-lo-trinh-chi-viec-phat-trien-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh
  verified_at: 2026-10-11T10:08:28Z
  output: |
    Results: 297 passed, 0 failed (lo-trinh)

### Phán đoán (judgment)

- eval: E9
  judged_by: hội đồng ba góc nhìn (fresh context): domain-correctness, operational-feasibility, spec-alignment
  verdict: UNCERTAIN
  proposal: FAIL
  rationale: Cả ba góc nhìn cùng đề xuất FAIL (3/3). Vế (B) và (C) của AC-9 đạt; vế (A) không đạt trọn vì SKILL còn im lặng hoặc nước đôi ở vài mã của bản phạm vi mẫu (luật 5 về hàng tự phục vụ so với chân trời, phép thử «thiếu dữ liệu thật» ở luật 4, nguồn của `ai`, ranh giới K11 so với K9). Chi tiết từng góc nhìn ở mục phiếu bầu dưới đây.
  votes:
    - domain-correctness: FAIL — (B) đạt: SKILL ghi «dán số đo của đồng hồ cỡ vào mô tả PR cắt lượt và báo chủ kit — KHÔNG sửa khối». (C) đạt: dòng `hàng R2 [duoi-muc-tieu]` khớp `cua-dot`, nên «XỬ LÝ (gộp…) hoặc giữ và ghi vì sao vào mô tả PR»; dòng `[chua-uoc-tieu-chi] 12 hàng ngoài đợt` rơi vào `ngoai-dot`, nên «chép vào mô tả PR, không sửa». (A) hụt: K10→H2 (ví dụ «sửa danh sách góp ý sẽ gom» ở luật 3 bước 2b), K2/K4/K8/K11→mốc ngoài và hai hàng sinh dữ liệu giả được SKILL dẫn tới, nhưng (1) luật 5 cho «một hàng tính năng tự phục vụ, hoặc — khi mới có một tổ chức hay một kho — một chân trời» mà không nói lặp theo tổ chức hay theo kỳ thì đi đường nào, nên H1 (chân trời, từ K2) và R6 (hàng, từ K6) trong cùng một kho một tổ chức đều không bị buộc; (2) luật 4 dùng «Thiếu dữ liệu thật» mà không có phép thử, và luật 3 («Hàng cần thứ một việc vận hành tạo ra: cần DỮ LIỆU») cũng bắt R5, R9 như bắt R1, R3, R7, nên việc K1/K3/K7 mang `du_lieu: gia` còn K5/K9 thì không là nước đôi.
    - operational-feasibility: FAIL — (B) đạt: SKILL ghi «dán số đo của đồng hồ cỡ vào mô tả PR cắt lượt và báo chủ kit — KHÔNG sửa khối». (C) đạt: dòng `hàng R2 [duoi-muc-tieu]` khớp `cua-dot` nên «gộp… hoặc giữ và ghi vì sao vào mô tả PR», còn dòng gom `[chua-uoc-tieu-chi] 12 hàng ngoài đợt` rơi vào `ngoai-dot` nên «chép vào mô tả PR, không sửa». (A) không đạt trọn: K1, K2/H1, K10 được dẫn rõ (khuôn hàng 5 và mốc V1, luật 3 «sửa danh sách góp ý sẽ gom»), nhưng K11 (SKILL không có luật tách nó khỏi K9), đích `tu_phuc_vu` R6 của K6 (luật 5 cho cả «hàng» lẫn «chân trời») và `ai` của V4/K8 (bản phạm vi không nêu người) đều nước đôi hoặc SKILL im lặng.
    - spec-alignment: FAIL — (B) và (C) đạt: SKILL ghi «dán số đo của đồng hồ cỡ vào mô tả PR cắt lượt và báo chủ kit — KHÔNG sửa khối»; khối CAT-LUOT-CANH-BAO xếp dòng «hàng R2 [duoi-muc-tieu]» vào cua-dot («XỬ LÝ (gộp, khai, thêm tự phục vụ) hoặc giữ và ghi vì sao vào mô tả PR») và dòng «[chua-uoc-tieu-chi] 12 hàng ngoài đợt» vào ngoai-dot («chép vào mô tả PR, không sửa»). (A) trượt vì hai chỗ SKILL im lặng hoặc nước đôi: luật 5 của CAT-LUOT-VAN-HANH cho «một hàng tính năng tự phục vụ, hoặc — khi mới có một tổ chức hay một kho — một chân trời» mà không tách lặp-theo-tổ-chức khỏi lặp-theo-kỳ, nên K6→R6 (hàng) và K2→H1 (chân trời) đều không bị ép (K6 có thể sang chân trời hợp luật, K2 có thể sang hàng hợp luật); luật 3–4 chỉ nói «cần DỮ LIỆU»/«Thiếu dữ liệu thật» không có phép thử nào để K1/K7/K3 mang `gia` còn K5/K9 thì không, nên R5/R9 đánh `gia` hay không đều hợp luật. Các mã còn lại được dẫn rõ (K10→H2 bằng ví dụ «sửa danh sách góp ý sẽ gom»; K2/K6 `lap` bằng «mỗi tổ chức mới, hay mỗi kỳ»; K4/K8/K11→mốc ngoài; K9→hàng), nhưng PASS đòi mọi mã đều đạt.
  required_evidence:
    - (domain-correctness) Một câu trong khối CAT-LUOT-VAN-HANH (skills/cat-luot/SKILL.md, luật 4) nêu phép thử máy áp được cho «thiếu dữ liệu thật». Ví dụ: hàng nào có tiêu chí đo trên dữ liệu do một mốc ngoài của chính đợt tạo ra thì mang `du_lieu: gia`, kèm cách phiên cắt biết dữ liệu đó chưa có (đọc hồ sơ hay dữ liệu của kho). Cần để R1/R3/R7 (gia) tách khỏi R5/R9 (không) mà không cần số đo riêng của crm.
    - (domain-correctness) Một câu trong luật 5 gán đường tự phục vụ theo trục lặp (mỗi tổ chức mới → chân trời khi mới một tổ chức; mỗi kỳ → hàng tự phục vụ), hoặc thêm vào lo-trinh-template.json một ca mốc `lap: true` có `tu_phuc_vu` trỏ HÀNG (hiện khuôn chỉ có ca trỏ chân trời H2). Cần để K6→R6 và K2→H1 cùng được buộc.
    - (domain-correctness) Một câu trong luật 1 bước 2b nói mã vận hành nào là «một lần» và mã nào là «lặp lại» (ví dụ chỉ coi là lặp lại khi mã tự ghi chu kỳ), để K4, K8, K11 không bị đọc thành `lap: true` theo «mỗi tổ chức mới, hay mỗi kỳ».
    - (domain-correctness) Đầu ra thật của một phiên cắt mù, chỉ dùng skills/cat-luot/SKILL.md và _acceptance/lo-trinh-chi-viec-phat-trien/mau/pham-vi-crm.md. Lấy bằng cách chạy một phiên mới trên bản phạm vi mẫu rồi diff với lo-trinh-dap-an.json. Với cả K1…K11, bộ (chỗ · du_lieu · dung_tren · lap · tu_phuc_vu · mo_lai_khi) phải trùng đáp án thì mới đổi được verdict.
    - (operational-feasibility) K11 → mốc V5 (hang R9): một câu trong khối CAT-LUOT-VAN-HANH (skills/cat-luot/SKILL.md, bước 2b, luật 1) nói một mã là việc người dùng CHÍNH tính năng mà mã khác đã giao (K11 «công bố OKR quý 4» so với K9 «bấm Công bố») thì là vận hành một lần, mốc chờ hàng của tính năng đó, không gộp vào `phu` của R9. Hiện định nghĩa «người làm ngoài sản phẩm» loại K11 (công bố nằm trong công cụ), nên K11 có thể ra hàng hoặc trùng K9. Lấy từ: sửa SKILL.md khối CAT-LUOT-VAN-HANH.
    - (operational-feasibility) K6 → V3.tu_phuc_vu = R6 (một hàng): một câu ở luật 5 của CAT-LUOT-VAN-HANH nói khi nào `tu_phuc_vu` phải là hàng và khi nào là chân trời, ví dụ chân trời chỉ cho lặp theo «tổ chức mới», lặp theo kỳ (mỗi quý) thì là hàng. Hiện luật 5 cho cả hai khi kho mới có một tổ chức, và crm chỉ có một tổ chức, nên chân trời cũng hợp luật cho K6. Lấy từ: skills/cat-luot/SKILL.md luật 5.
    - (operational-feasibility) K8 → V4.ai = «Quản trị chương trình»: nguồn của `ai` khi dòng mã không nêu người. Hoặc SKILL ghi cách điền (chép đúng chữ của dòng mã, không có thì hỏi hoặc để trống kèm cờ), hoặc dòng K8 trong _acceptance/lo-trinh-chi-viec-phat-trien/mau/pham-vi-crm.md nêu người đó. Hiện chữ «Quản trị chương trình» chỉ có trong lo-trinh-dap-an.json, mà răng coi mốc thiếu `ai` là `lỗi:`.
    - (operational-feasibility) du_lieu của R1/R7/R3 so với R5/R9: một tiêu chí trong luật 4 (CAT-LUOT-VAN-HANH) để nhận ra «thiếu dữ liệu thật», ví dụ hàng đo trên kết quả vận hành chưa xảy ra (cập nhật tuần, câu hỏi thật) thì `gia`, hàng chỉ thao tác thì không. Hiện K9 «bộ OKR quý» và K5 cũng có thể bị xếp `gia` trên SG1 mà luật không cấm, còn khuôn lo-trinh-template.json chỉ minh hoạ riêng K1.
    - (spec-alignment) skills/cat-luot/SKILL.md, khối CAT-LUOT-VAN-HANH luật 5, có thêm câu nêu phép chọn giữa «hàng tự phục vụ» và «chân trời» (ví dụ: vận hành lặp theo tổ chức/kho mà mới có một → chân trời; lặp theo kỳ trong cùng tổ chức → hàng tự phục vụ). Có câu này thì K6→R6 (hàng) và K2→H1 (chân trời) thành duy nhất và verdict đổi.
    - (spec-alignment) skills/cat-luot/SKILL.md, khối CAT-LUOT-VAN-HANH luật 3–4, có thêm phép thử cho `du_lieu: gia` (hàng nào PHẢI đứng trên hàng sinh-gia, hàng nào KHÔNG — ví dụ hàng đọc số tổng hợp theo thời gian/số lượng do việc vận hành tạo ra thì gia, hàng chỉ là luồng thao tác như phó duyệt-thang leo hay bấm Công bố thì không). Có phép thử này thì R1/R7/R3 `gia` và R5/R9 không `gia` là một đường duy nhất.
    - (spec-alignment) Một dòng trong _acceptance/lo-trinh-chi-viec-phat-trien/mau/pham-vi-crm.md hoặc một chỉ dẫn ở bước 2 của SKILL nói phiên cắt lấy số tổ chức đang dùng công cụ từ đâu; hiện fact «mới một tổ chức» chỉ có trong ly_do của H1 ở lo-trinh-dap-an.json (chính đáp án), không có trong bản phạm vi hay SKILL, nên điều kiện «khi mới có một tổ chức» của luật 5 chưa tự kiểm được.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-lo-trinh-chi-viec-phat-trien-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T10:08:28Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên bản HEAD lẫn bản nền diffBase), nên chúng chứng minh bộ kiểm chứ chưa chứng minh riêng tính năng: E1, E2, E3, E4, E5, E6, E7, E8, E10 (cùng lệnh `node tests/scripts/lo-trinh.test.mjs`, baseline: green). Cần viết lại để assert hành vi mới, hoặc người xác nhận đó là lưới hồi quy có chủ ý. Các lệnh suite xanh cả hai phía là lưới hồi quy bình thường, không liệt kê.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E8 và E10 xanh, E9 hội đồng đề xuất FAIL (3/3), verdict PENDING-JUDGMENT. Không eval máy nào đỏ. Rà soát tìm lỗi để lại 4 mục trong hợp đồng (chiều đỏ còn mỏng ở AC-2, AC-5, AC-7) và 7 mục ngoài hợp đồng, xem review-findings.md.
