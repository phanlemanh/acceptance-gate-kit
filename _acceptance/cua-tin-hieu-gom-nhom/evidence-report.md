---
schema_version: 2
feature_slug: cua-tin-hieu-gom-nhom
verdict: REJECT
failed_evals: ["E10"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b9a5168894d5644dfb47f93b48b3d8cbf32a9b55
human_signoff:
---

# Evidence Report: cua-tin-hieu-gom-nhom

Round 1. Kết luận máy: REJECT, vì E10 đỏ (bản gom của phiên tác tử tươi lệch đáp án bộ vàng ở 7 chỗ). Hội đồng E11 cũng đề xuất không đạt. Bài chạy còn hai lệnh suite đỏ không gắn eval nào (ghi ở mục Lệnh suite).

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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | FAIL |
| E11 | AC-11 | judgment | FAIL (hội đồng đề xuất; chờ người quyết ở Cổng 2) |

## Evidence

- eval: E1
  run_id: minted-cua-tin-hieu-gom-nhom-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E2
  run_id: minted-cua-tin-hieu-gom-nhom-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E3
  run_id: minted-cua-tin-hieu-gom-nhom-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E4
  run_id: minted-cua-tin-hieu-gom-nhom-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E5
  run_id: minted-cua-tin-hieu-gom-nhom-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E6
  run_id: minted-cua-tin-hieu-gom-nhom-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E7
  run_id: minted-cua-tin-hieu-gom-nhom-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E8
  run_id: minted-cua-tin-hieu-gom-nhom-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E9
  run_id: minted-cua-tin-hieu-gom-nhom-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu
  verified_at: 2026-10-11T09:47:19Z
  output: |
    Results: 23 passed, 0 failed (tin-hieu)

- eval: E10
  run_id: minted-cua-tin-hieu-gom-nhom-E10-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.tin_hieu_vang
  verified_at: 2026-10-11T09:47:19Z
  output: |
    PASS: TH-10-ong — kho đưa phiên gom kín đáp án (đối chứng thấy tên trong đáp án); 20 mục == 20 tệp; lệnh chấm chạy trên bộ vàng thứ hai; đảo thứ tự commit → «khai trước»
    PASS: TH-10-do — bản gom tách một cặp trùng: lệnh chấm trả «cặp trùng tách: crm-u7-3 → nhóm G1 (docs/gom/g.md) · crm-u7-4 → nhóm G9 (docs/gom/g.md)»
    PASS: TH-10-do2 — bộ sinh giữ tên hồ sơ trong nhãn: phép quét kín trả «vang-a-1.json chứa tên hồ sơ ca-chap-chon-cach-ly»
    TH-10: cặp trùng tách: vang-a-9 → nhóm G5 (docs/gom/gom-vang.md) · vang-b-12 → nhóm G3 (docs/gom/gom-vang.md)
    TH-10: cặp trùng tách: vang-b-14 → đã phủ luat-kho-vong-doi (docs/gom/gom-vang.md) · vang-b-18 → nhóm G6 (docs/gom/gom-vang.md)
    TH-10: vang-a-3 sinh từ hồ sơ đã giao ca-chap-chon-cach-ly nhưng ở «nhóm G1 (docs/gom/gom-vang.md)»
    TH-10: vang-b-6 sinh từ hồ sơ chưa giao thuoc-7-ngay-loc-pr nhưng ở «đã phủ ci-ma-tran-ba-o (docs/gom/gom-vang.md)», không ở nhóm
    TH-10: vang-a-15 sinh từ hồ sơ chưa giao thuoc-7-ngay-loc-pr nhưng ở «đã phủ ci-ma-tran-ba-o (docs/gom/gom-vang.md)», không ở nhóm
    TH-10: vang-b-18 sinh từ hồ sơ đã giao luat-kho-vong-doi nhưng ở «nhóm G6 (docs/gom/gom-vang.md)»
    TH-10: vang-b-20 sinh từ hồ sơ đã giao ca-chap-chon-cach-ly nhưng ở «nhóm G1 (docs/gom/gom-vang.md)»
    FAIL: TH-10 — bản gom của phiên lệch đáp án ở 7 chỗ (xem các dòng TH-10 ở trên)
    Results: 3 passed, 1 failed (tin-hieu)

### Judgment

- eval: E11
  judged_by: judge panel (fresh context) — 3 lens: domain-correctness, operational-feasibility, spec-alignment
  judge_proposal: FAIL
  rationale: Cả ba góc nhìn cùng kết luận: vế (1) gần đạt (tên nhóm mở bằng vai), vế (2) và (3) sai ở nhóm G3 vì `vang-b-12` bị xếp chung với `vang-a-7`, `vang-a-17` và tách khỏi `vang-a-9`; cặp (`vang-b-14`, `vang-b-18`) và hai tín hiệu của hồ sơ chưa giao (`vang-b-6`, `vang-a-15`) cũng lệch. Khớp với bảy dòng lệch của E10.
  votes:
    - domain-correctness: FAIL — Vế (1) đạt: tên nhóm mở bằng vai (G1 «Kỹ sư chạy bộ test … mà một ca chập chờn không làm đỏ cả lượt», G5 «Chủ kho gộp được mà CI không dừng giữa chừng vì hết hạn mức chi»), dù G1–G3 còn lẫn từ kỹ thuật (eve, pre-push, cây đã ký). Vế (2) và (3) sai ở G3: `vang-b-12` (cây onehub sau gộp giống cây đầu PR đã kiểm, hồ sơ giam-phut-acceptance) bị xếp cùng `vang-a-7` và `vang-a-17` dưới «Kỹ sư giữ hồ sơ đã ký xanh: thước đo đúng cây đã ký ở mốc cố định…». Đó là kết quả khác (gộp tự động an toàn), và tên G3 không nói gì về điều đó. Cặp cùng lớp (`vang-a-9`, `vang-b-12`) bị tách sang G5 và G3 mà lý do tách không nằm trong tên nhóm nào. Cặp (`vang-b-14` đã phủ luat-kho-vong-doi, `vang-b-18` ở G6) cũng bị tách mà tên G6 không giải thích. Ngoài ra `vang-b-6` và `vang-a-15` thuộc hồ sơ thuoc-7-ngay-loc-pr (chua-co, chưa giao) lại bị ghi «đã phủ» ci-ma-tran-ba-o, trái luật «nghi thì vào nhóm».
    - operational-feasibility: FAIL — Vế (1) gần đạt: tên nhóm mở bằng vai («Kỹ sư…», «Chủ kho…»), dù G2 («hai máy chủ eve… dọn khoá cũ») và G3 («đúng cây đã ký ở mốc cố định») còn nặng từ cơ chế. Vế (2) sai ở G3: nhóm này nhận vang-b-12 (hồ sơ giam-phut-acceptance: cây onehub sau khi gộp giống cây đầu PR đã kiểm) chung với vang-a-7 và vang-a-17 (hồ sơ thuoc-khong-tu-het-han) chỉ vì cùng nhắc «cây/mốc». Hai kết quả khác nhau: người gộp tin giám sát gộp đúng cây, và thước của hồ sơ đã ký không tự hết hạn. Vế (3) sai: vang-b-12 bị tách khỏi vang-a-9 ở G5 dù bo-vang.json xếp hai mục vào cùng một cặp trùng (cap_trung) và cùng hồ sơ giam-phut-acceptance, và không câu nào trong tên G3 hay G5 giải thích việc tách. Ngoài ra vang-b-6 và vang-a-15 (hồ sơ thuoc-7-ngay-loc-pr, chưa có việc) bị ghi «đã phủ» bởi ci-ma-tran-ba-o, trái luật «nghi thì vào nhóm» của SKILL. Bốn «cụm viết tay» trong câu hỏi cũng không có trường cum trong bo-vang.json (tệp chỉ có kieu, cap_trung, lien_ket_cung_lop), nên vế (3) không đối chiếu trọn được.
    - spec-alignment: FAIL — Vế (2) sai ở nhóm G3 («Kỹ sư giữ hồ sơ đã ký xanh: thước đo đúng cây đã ký ở mốc cố định, không tự đỏ khi các lượt sau gộp vào»). Nhóm này chứa `vang-b-12`, tức giả định về giám sát chỉ gộp PR đã gộp onehub mới nhất (hồ sơ giam-phut-acceptance). Đó là một kết quả khác với `vang-a-7` và `vang-a-17` (thước neo mốc cố định của thuoc-khong-tu-het-han). Hai bên chỉ giống nhau ở chữ «cây» và «gộp». Người gom tay ghép `vang-b-12` với `vang-a-9`, mà `vang-a-9` nằm ở G5 («Chủ kho gộp được mà CI không dừng giữa chừng vì hết hạn mức chi»). Vì vậy vế (3) cũng hỏng: tên G3 không giải thích vì sao cặp bị tách, và không nói gì về việc giám sát gộp. Vế (1) đạt phần lớn: G1, G4, G5 mở bằng vai và là tiếng sản phẩm. G2 («máy chủ eve») và G3 («cây», «thước», «mốc cố định») còn nặng từ nội bộ.
  required_evidence:
    - domain-correctness: Bản gom sửa trong đó `vang-b-12` nằm cùng nhóm với `vang-a-9` hoặc ở một nhóm riêng có tên vai + điều muốn làm được nêu việc gộp tự động dùng đúng cây đã kiểm; lấy từ _acceptance/cua-tin-hieu-gom-nhom/mau/gom-bo-vang.md sau khi chạy lại phiên gom
    - domain-correctness: Một dòng lý do trong tên nhóm hoặc ghi chú bản gom cho thấy vì sao `vang-b-14` đã phủ luat-kho-vong-doi còn `vang-b-18` ở G6 (trích tiêu chí trong _acceptance/luat-kho-vong-doi/contract.md nêu chính ca 15 loại bản ghi dọn dữ liệu)
    - domain-correctness: Trích _acceptance/ci-ma-tran-ba-o/contract.md cho thấy tiêu chí của hồ sơ này nêu chính ca đo ngưỡng 7 ngày (`vang-b-6`, `vang-a-15`); không có thì hai tín hiệu này phải vào nhóm
    - operational-feasibility: Bản gom sửa (gom-bo-vang.md) trong đó vang-b-12 nằm cùng nhóm với vang-a-9, hoặc tên nhóm của vang-b-12 nêu rõ lý do tách khỏi vang-a-9. Nguồn: _acceptance/cua-tin-hieu-gom-nhom/mau/gom-bo-vang.md, nhóm G3 và G5.
    - operational-feasibility: Danh sách bốn cụm «cùng lớp» do người gom tay (trường cum cho từng mục, hoặc ánh xạ cụm → id) trong bo-vang.json. Tệp hiện không có trường này nên vế (3) không đối chiếu trọn được. Nguồn: _acceptance/cua-tin-hieu-gom-nhom/mau/bo-vang.json.
    - operational-feasibility: Lý do «đã phủ» có căn cứ cho vang-b-6 và vang-a-15: tiêu chí trong contract.md của ci-ma-tran-ba-o nêu chính việc đo ngưỡng 7 ngày. Nếu không có thì hai mục này phải vào nhóm. Nguồn: _acceptance/ci-ma-tran-ba-o/contract.md của kho crm.
    - spec-alignment: Bản gom sửa trong gom-bo-vang.md có `vang-b-12` đứng cùng nhóm với `vang-a-9` (G5), hoặc tên G3 nêu rõ kết quả giám-sát-gộp. Răng chạy xanh: `AG=. node scripts/tin-hieu.mjs --root . --rang` thoát 0.
    - spec-alignment: Một dòng trong tên nhóm hoặc ghi chú bản gom lấy từ `_acceptance/cua-tin-hieu-gom-nhom/mau/` chứng minh `vang-b-12` cùng kết quả «thước không tự đỏ» với `vang-a-7` và `vang-a-17`. Nếu có, vế (2) sẽ đổi.
    - spec-alignment: Lý do bản gom tách cặp (`vang-b-14`, `vang-b-18`) và cặp (`vang-b-6`, `vang-a-15`) ra «đã phủ». Cụ thể: tiêu chí trong `_acceptance/ci-ma-tran-ba-o/contract.md` nêu việc đo ngưỡng 7 ngày sau gộp, và tiêu chí trong `_acceptance/luat-kho-vong-doi/contract.md` nêu 15 loại bản ghi dọn dữ liệu.
  human_override:        # người điền "<tên> <ngày>" ở Cổng 2

### Lệnh suite (hồi quy)

Hai lệnh suite dưới đây đỏ và không gắn eval nào: `bash tests/scripts/run-tests.sh --manh mjs:3/3` (tệp lỗi nằm trong cụm kiểm kho khác, cột dưới) và `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 …'` (ca RT13: tệp `tests/scripts/tin-hieu.test.mjs` chứa chữ trạng thái viết cứng). Lệnh `TH_CASES=TH-10,TH-10-ong,TH-10-do,TH-10-do2 node tests/scripts/tin-hieu.test.mjs` đỏ nhưng đã gắn E10.

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 1
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-11T09:47:19Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cua-tin-hieu-gom-nhom-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-11T09:47:19Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều chưa có baseline nên chưa có eval nào được xác nhận là xanh ở cả hai phía (xem mục «Baseline khong do»).

Baseline khong do:
- node tests/scripts/tin-hieu.test.mjs: bo qua baseline: tep tests/scripts/tin-hieu.test.mjs co o cay dang kiem nhung chua co o merge-base 08ba287d30ad96a89e3103436822f298c2684296 — eval moi, chay tren code cu khong phan biet gi
- TH_CASES=TH-10,TH-10-ong,TH-10-do,TH-10-do2 node tests/scripts/tin-hieu.test.mjs: bo qua baseline: tep tests/scripts/tin-hieu.test.mjs co o cay dang kiem nhung chua co o merge-base 08ba287d30ad96a89e3103436822f298c2684296 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10 failed — bản gom của phiên tác tử tươi lệch bộ vàng ở 7 chỗ (cặp trùng vang-a-9/vang-b-12 và vang-b-14/vang-b-18 bị tách; hồ sơ đã giao vang-a-3, vang-b-18, vang-b-20 nằm ở nhóm; vang-b-6 và vang-a-15 bị ghi «đã phủ» dù hồ sơ chưa giao). Hội đồng E11 đề xuất không đạt cùng lý do. Hai lệnh suite đỏ ngoài eval (mjs:3/3 và vung:3) cần người xem ở Cổng 2. Returned to implementation.
