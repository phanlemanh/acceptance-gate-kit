---
schema_version: 2
feature_slug: cau-tin-hieu-nguoi-gui
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5a42e7c5a3e9d27c1810fd835fd2d33f6409f8de
human_signoff:
---

# Evidence Report: cau-tin-hieu-nguoi-gui

Round 2. Mọi eval máy (E1–E9) chạy xanh: E1–E8 chung một lệnh 24 ca của bộ tin-hieu, E9 đo trên bản sao crm ở sha đã ghim. Hội đồng E10 (judgment) đề xuất UNCERTAIN (một lens FAIL, một lens PASS, một lens UNCERTAIN), chưa có chữ người. Verdict REJECT đã được tính sẵn; `failed_evals` để rỗng vì lệnh suite `vung:3` chạy đỏ mà không gắn eval nào (ca P179, xem mục «Lệnh suite (hồi quy)» và `## Iterations`), còn E10 mới là đề xuất của máy. Không có phát hiện nào trong hợp đồng ở round này; một phát hiện mới ngoài hợp đồng (mức vừa) nằm ở `review-findings.md`. Baseline không đo lại ở round này (carried từ round 1).

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
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-cau-tin-hieu-nguoi-gui-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E2
  run_id: minted-cau-tin-hieu-nguoi-gui-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E3
  run_id: minted-cau-tin-hieu-nguoi-gui-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E4
  run_id: minted-cau-tin-hieu-nguoi-gui-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E5
  run_id: minted-cau-tin-hieu-nguoi-gui-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E6
  run_id: minted-cau-tin-hieu-nguoi-gui-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E7
  run_id: minted-cau-tin-hieu-nguoi-gui-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E8
  run_id: minted-cau-tin-hieu-nguoi-gui-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: 24 passed, 0 failed (tin-hieu)

- eval: E9
  run_id: minted-cau-tin-hieu-nguoi-gui-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cau_crm
  verified_at: 2026-10-12T23:03:37Z
  output: |
    Results: all passed (do-crm)

- eval: E10
  judged_by: judge panel (3 lens, fresh context) — đề xuất của máy, chưa có chữ người
  verdict: UNCERTAIN
  rationale: Hội đồng không chốt được. Khung câu do kit viết sạch ở cả 16 câu (8 câu kho thử và 8 câu bản sao CRM): không còn mã việc, tên thư mục hay chữ gom/lẻ/hồ sơ/lượt/bản phạm vi. Ba lens bất đồng ở tên việc CRM chép nguyên văn («chip Kara», «kỳ đích đổi pha … đợt rà», «Lát dựng … mã đọc đúng tiếng»): một lens FAIL, một lens PASS, một lens UNCERTAIN vì tệp không cho biết nhân viên CRM có quen các chữ ấy trên giao diện hay không. Máy đề xuất UNCERTAIN; chữ cuối là của người ở Cổng 2.
  panel:
    - domain-correctness: FAIL — Khung câu do kit viết ("đã vào nhóm ... và thành việc ... — chưa bắt đầu / đang làm / tạm hoãn / đã giao ngày ...") đọc được ở cả 16 câu, không lọt mã việc, tên thư mục hay chữ gom/lẻ/hồ sơ/lượt/bản phạm vi, và 8 câu kho thử đều sạch. Nhưng ở bản sao CRM, tên việc chép nguyên văn kéo vào chữ mà nhân viên không dùng git khó hiểu: câu da-phu «Lát dựng tác nhân nói tiếng Việt — đợt một: ... bảng kết quả/mã đọc đúng tiếng» («Lát dựng» là chữ của quy trình dựng, «mã đọc đúng tiếng» không rõ nghĩa) và câu hang-chua-ho-so việc 7n «Mang sang đúng khi kỳ đích đổi pha, và đợt rà đặt lịch tương lai đóng được» («kỳ đích đổi pha», «đợt rà»). Mức vấp nhẹ hơn nhưng cùng loại: câu hang-co-ho-so «chip Kara cùng cỡ nhãn» và câu hang-chua-ho-so việc DA6 «đường găng, baseline».
    - operational-feasibility: PASS — Cả 16 câu cau_nguoi_gui (8 CRM + 8 kho thử) đều nói rõ tín hiệu đang ở đâu bằng chữ đời thường. Các mẫu câu là: «đã vào nhóm "X" và thành việc "Y" — đã giao ngày 4/10/2026 / chưa bắt đầu / đang làm / tạm hoãn», «đã có trong việc "Y" — đã giao ngày 17/9/2026», «đã vào nhóm "Z" — nhóm chưa thành việc», «để sau: chờ đợt góp ý sau 14/10», «không xếp vào nhóm nào: lời cảm ơn, không đòi thay đổi gì», «chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới». Không câu nào chứa mã việc (R1a, 7n, DA6, H1/H2/H3), tên thư mục (khung-okr-truoc-r1, viec-hai, cua-tin-hieu-gom-nhom) hay chữ quy trình (gom, lẻ, hồ sơ, lượt, bản phạm vi). Những thứ đó chỉ nằm ở trường cau cũ, là trường không chấm. Chỗ có thể lạ duy nhất là vài từ trong tên việc, như «chip Kara» và «Lát dựng». Đó là văn nguyên của chủ kho CRM đặt trong ngoặc kép, không phải chữ kit viết.
    - spec-alignment: UNCERTAIN — Phần câu do kit viết đều là tiếng thường: "đã vào nhóm … và thành việc …", "đã giao ngày …", "chưa bắt đầu", "tạm hoãn", "chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới". Không câu nào còn mã việc, tên thư mục hay chữ gom, lẻ, hồ sơ, lượt, bản phạm vi. Nhưng ba câu của CRM trích nguyên tên việc do chủ kho viết, và tên đó có chữ mà một nhân viên không phải dev có thể vấp: "chip Kara" (câu 1), "kỳ đích đổi pha … đợt rà đặt lịch tương lai" (câu 2), "Lát dựng … mã đọc đúng tiếng" (câu 7). Tệp không cho biết các chữ này có phải nhãn người dùng CRM đã thấy trên giao diện hay không, nên tôi không thể PASS chắc chắn, cũng không đủ căn cứ để FAIL.
  required_evidence:
    - (domain-correctness) Bản cau-mau.json dựng lại (cùng đường dẫn _acceptance/cau-tin-hieu-nguoi-gui/mau/cau-mau.json, cùng nguồn CRM 06e34d26...) mà cau_nguoi_gui của cho=da-phu và của cho=hang-chua-ho-so (việc 7n) không còn «Lát dựng», «mã đọc đúng tiếng», «kỳ đích đổi pha», «đợt rà» — tên việc được thay bằng một tên bằng tiếng nhân viên dùng thường ngày; tệp này sinh ra từ lệnh dựng mẫu của chính vòng, không sửa tay.
    - (domain-correctness) Ảnh chụp màn hình hoặc tệp chuỗi chữ giao diện của CRM thật ở commit 06e34d26 cho thấy «Lát dựng», «kỳ đích», «pha», «Kara» là chữ đang hiện cho người dùng cuối trên trang Mục tiêu hoặc Tín hiệu đã gửi; nếu có, các chữ đó là từ vựng sản phẩm quen thuộc của nhân viên CRM và các câu tương ứng đổi sang PASS.
    - (spec-alignment) Ảnh chụp trang CRM thật (hoặc tệp chuỗi giao diện của kho CRM ở commit 06e34d26) cho thấy các chữ «chip Kara», «kỳ đích», «đổi pha», «đợt rà», «Lát dựng», «mã đọc đúng tiếng» là nhãn nhân viên đã thấy hằng ngày. Nếu đủ cả sáu thì verdict đổi thành PASS.
    - (spec-alignment) Biên bản một lần đọc thử của một nhân viên phòng ban không dùng git trên đúng 8 câu cau_nguoi_gui của khối crm (cau-mau.json), ghi rõ từng chữ họ vấp. Nếu họ vấp ở chữ nào thì verdict đổi thành FAIL và nêu đúng câu và chữ đó.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-10-12T23:03:37Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-12T23:03:37Z

Lệnh suite đỏ không gắn eval nào (nên `failed_evals` để rỗng):

- `vung:3` — một ca đỏ: «P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=»; dòng tổng «Results: 1 failed». Lệnh lọc chỉ giữ dòng FAIL và Results nên đuôi không nêu lý do; hai dòng đi kèm trong đuôi (một dòng «MUTANT-6 bi bat», một dòng «4 passed» của ca ntr-observed) là đầu ra bình thường của ca khác, không phải lỗi. Đo tay lúc soạn báo cáo, KHÔNG phải kết quả của lượt máy: ca P179 đếm các dòng `Đề xuất: known-limits` trong mọi `_acceptance/*/review-findings.md` và đòi số hàng của `docs/research/known-limits-ledger.tsv` không bé hơn số đếm; trên cây hiện tại là 744 mục so với 737 hàng sổ, khớp nhánh «quan he >=» của ca. Hồ sơ này góp 20 mục (10 thẻ cộng 10 dòng lặp ở phần chi tiết kỹ thuật) và `review-findings.md` của nó mới vào cây ở commit 5a42e7c5; bỏ phần của hồ sơ này thì số đếm là 724, không vượt 737. Mười lệnh suite còn lại đều xanh.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Mọi block eval máy ghi `baseline: n-a`.

Baseline khong do:

- E9 (`do-crm.mjs`): bỏ qua baseline từ round 1 — tệp có ở cây đang kiểm nhưng chưa có ở merge-base, eval mới, chạy trên code cũ không phân biệt gì.

Eval KHÔNG-PHÂN-BIỆT (xanh trên cả HEAD lẫn baseline), carried từ round 1:

- TH_CASES=CN-1,CN-1-do,CN-1-do2,CN-2,CN-2-do,CN-3,CN-3-do,CN-4,CN-4-do,CN-5,CN-5-do,CN-5-do2,CN-6,CN-6-do,CN-6-do-tt,CN-6-do2,CN-6-do3,CN-6-do4,CN-7,CN-7-do,CN-8,CN-8-do node tests/scripts/tin-hieu.test.mjs: E1, E2, E3, E4, E5, E6, E7, E8 (cùng một lệnh nên cùng một kết quả baseline). Tệp test ở merge-base chứa 0 ca mang tên CN-*, nên bộ lọc TH_CASES chọn rỗng; nhiều khả năng baseline xanh vì không có ca nào để đỏ chứ không phải vì vật cũ đã làm đúng hành vi mới. Cần viết lại để assert hành vi mới trên baseline (đỏ thật), hoặc xác nhận đây là regression-guard có chủ ý. Ghi chú round 2: lệnh round này chạy 24 ca, thêm hai ca CN-5-do3 và CN-6-do-khung so với lệnh 22 ca đã đo baseline ở round 1; hai ca ấy chưa có phép đo baseline, và `expected` của E5, E6 không nêu tên chúng.

## Variance

none — mọi eval chạy một lượt, đồng nhất, không eval nào có phương sai.

## Iterations

Round 1: E1–E9 xanh (E1–E8 chung một lệnh, 22 ca); hội đồng E10 đề xuất FAIL ở cả ba lens vì tên việc chép nguyên văn còn chữ quy trình nội bộ; lệnh suite `vung:3` đỏ ca RT13 không gắn eval, mười lệnh suite còn lại xanh. Trả về triển khai.
Round 2: E1–E9 xanh (E1–E8 chung một lệnh, 24 ca); hội đồng E10 đổi từ ba FAIL sang một FAIL, một PASS, một UNCERTAIN nên đề xuất UNCERTAIN (16 câu khung kit đều sạch, còn lại là tên việc CRM chép nguyên văn); lệnh suite `vung:3` đỏ ca P179 (sổ known-limits) không gắn eval, mười lệnh suite còn lại xanh; không có phát hiện trong hợp đồng, một phát hiện mới ngoài hợp đồng. Trả về triển khai.
