---
schema_version: 2
feature_slug: cau-tin-hieu-nguoi-gui
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8fdc2f784cab5eeedc4818fa1448085f2423bda2
human_signoff:
---

# Evidence Report: cau-tin-hieu-nguoi-gui

Round 1. Mọi eval máy (E1–E9) chạy xanh. Hội đồng E10 (judgment) đề xuất FAIL ở cả ba lens, chưa có chữ người. Verdict REJECT đã được tính sẵn; `failed_evals` để rỗng vì lệnh suite `vung:3` chạy đỏ mà không gắn eval nào (ca RT13, xem mục «Lệnh suite (hồi quy)» và `## Iterations`), còn E10 mới là đề xuất của máy. Hai phát hiện trong hợp đồng (AC-6 mức cao, AC-5 mức vừa) cho thấy ca CN-6-do-tt và dòng tóm tắt của CN-5 chưa chứng minh đủ vế của chúng dù E5, E6 xanh; chi tiết và mười ba mục ngoài hợp đồng nằm ở `review-findings.md`.

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
| E10 | AC-10 | judgment | FAIL |

## Evidence

- eval: E1
  run_id: minted-cau-tin-hieu-nguoi-gui-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E2
  run_id: minted-cau-tin-hieu-nguoi-gui-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E3
  run_id: minted-cau-tin-hieu-nguoi-gui-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E4
  run_id: minted-cau-tin-hieu-nguoi-gui-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E5
  run_id: minted-cau-tin-hieu-nguoi-gui-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E6
  run_id: minted-cau-tin-hieu-nguoi-gui-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E7
  run_id: minted-cau-tin-hieu-nguoi-gui-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E8
  run_id: minted-cau-tin-hieu-nguoi-gui-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: 22 passed, 0 failed (tin-hieu)

- eval: E9
  run_id: minted-cau-tin-hieu-nguoi-gui-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cau_crm
  verified_at: 2026-10-12T21:38:05Z
  output: |
    Results: all passed (do-crm)

- eval: E10
  judged_by: judge panel (3 lens, fresh context) — đề xuất của máy, chưa có chữ người
  proposal: FAIL
  rationale: Cả ba lens cùng thấy phần khung câu do kit viết đã sạch (không còn mã việc, tên thư mục, chữ gom/lẻ/hồ sơ/lượt/bản phạm vi) nhưng tên việc chép nguyên văn trong ngoặc kép vẫn mang chữ của quy trình bên trong mà nhân viên không dùng git không hiểu: ít nhất bốn câu bên kit (hang-co-ho-so ×2, hang-chua-ho-so, da-phu) và hai câu bên CRM (hang-chua-ho-so «kỳ đích đổi pha…», da-phu «Lát dựng…»). Vì vậy không thể nói mọi câu cau_nguoi_gui đọc được; hội đồng đề xuất FAIL, chữ cuối là của người ở Cổng 2.
  panel:
    - domain-correctness: FAIL — Phần kit tự viết đã sạch: 16 câu không còn mã việc, tên thư mục hay chữ "gom/lẻ/hồ sơ/lượt/bản phạm vi". Câu nào cũng nói rõ nhóm nào, việc nào và trạng thái (ví dụ "chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới"; "không xếp vào nhóm nào: lời cảm ơn, không đòi thay đổi gì"). Nhưng "đã thành việc gì" nằm ở tên việc chép nguyên văn, và ở bốn câu bên kit tên đó đầy chữ của quy trình bên trong mà nhân viên không dùng git không hiểu. Câu bên kit nêu "thẻ mở phiên", "vòng nào phạm luật thì thẻ cổng nêu tên luật", "luật được nạp lúc viết đặc tả", "bốn lớp lỗi mới có ca đại diện, nguyên tắc lật-allow-list, một bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn", "Đưa bài học đo lường … vào engine". Bên CRM cũng có chỗ vấp: "Lát dựng tác nhân nói tiếng Việt … mã đọc đúng tiếng" và "kỳ đích đổi pha, … đợt rà đặt lịch tương lai đóng được".
    - operational-feasibility: FAIL — Khung câu («đã vào nhóm … và thành việc … — đã giao ngày … / chưa bắt đầu / tạm hoãn», «không xếp vào nhóm nào», «chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới») đọc được và không còn mã việc, tên thư mục, gom/lẻ/hồ sơ/lượt/bản phạm vi; 6 câu nhóm-chưa-cắt / chặn-trời / lẻ / chưa-gom (ở cả hai phía) đạt. Nhưng tên việc trích nguyên văn trong ngoặc kép vẫn mang chữ nội bộ khiến nhân viên không dùng git vấp, nên không thể PASS "mọi câu": kit/hang-co-ho-so (câu 1) «Kho khai một tệp kế hoạch, thẻ mở phiên chỉ ra việc kế và việc trễ»; kit/hang-co-ho-so (câu 2) «Mỗi kho khai các luật sản phẩm… nạp lúc viết đặc tả… vòng nào phạm luật thì thẻ cổng nêu tên luật»; kit/hang-chua-ho-so «Bước lên thiết kế không hỏi người…» (mơ hồ); kit/da-phu «…vào engine — bốn lớp lỗi… lật-allow-list… bánh cóc hai chiều… trace về sổ nguồn»; crm/hang-chua-ho-so (câu 1) «…kỳ đích đổi pha, và đợt rà đặt lịch tương lai đóng được»; crm/da-phu «Lát dựng tác nhân… bảng kết quả/mã đọc đúng tiếng». Hai câu «tạm hoãn» (crm DA6-Gantt, kit luật-sản-phẩm) cũng không nói vì sao chưa làm, trong khi người gửi cần biết lý do.
    - spec-alignment: FAIL — Khung câu («đã vào nhóm "…" và thành việc "…" — đã giao ngày …», «chưa xếp vào nhóm nào — đội sản phẩm sẽ xem ở lần xếp nhóm tới», «không xếp vào nhóm nào: lời cảm ơn…») sạch: không có mã việc, tên thư mục hay gom/lẻ/hồ sơ/lượt/bản phạm vi. Nhưng tên việc dán vào trong câu là chữ của quy trình kỹ thuật mà nhân viên phòng ban không hiểu: kit[0] «Kho khai một tệp kế hoạch, thẻ mở phiên chỉ ra việc kế và việc trễ», kit[1] «luật được nạp lúc viết đặc tả… thẻ cổng nêu tên luật», kit[6] «bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn… lật-allow-list… ca đại diện… engine», crm[6] «Lát dựng tác nhân… bảng kết quả/mã đọc đúng tiếng», crm[1] «kỳ đích đổi pha, và đợt rà đặt lịch tương lai đóng được». Vì vậy không thể nói mọi câu cau_nguoi_gui đọc được.
  required_evidence:
    - (domain-correctness) Tệp cau-mau.json được sinh lại (bằng lệnh sinh mẫu của hồ sơ, đường dẫn _acceptance/cau-tin-hieu-nguoi-gui/mau/cau-mau.json), trong đó phần tên việc ở bốn câu kit (hang-co-ho-so ×2, hang-chua-ho-so, da-phu) không còn 'thẻ mở phiên', 'thẻ cổng', 'đặc tả', 'engine', 'lớp lỗi', 'ca đại diện', 'allow-list', 'bánh cóc', 'trace', 'sổ nguồn', 'tệp kế hoạch', 'Kho khai'. Cách làm: kit hiện tên việc bằng tiếng người, hoặc đánh dấu các dòng kit là kho nội bộ ngoài phạm vi người dùng CRM.
    - (domain-correctness) Cho hai câu CRM còn nghi ('Lát dựng tác nhân nói tiếng Việt … mã đọc đúng tiếng của người quản trị' và 'Mang sang đúng khi kỳ đích đổi pha, và đợt rà đặt lịch tương lai đóng được'): bằng chứng các chữ 'lát dựng', 'đổi pha', 'đợt rà' có trên màn hình CRM mà nhân viên thấy, hoặc tên việc được viết lại. Nguồn: bản chụp trang Lộ trình của CRM, hoặc cau-mau.json sinh lại.
    - (operational-feasibility) Bản cau-mau.json sinh lại từ chính bộ dựng câu (cùng đường `_acceptance/cau-tin-hieu-nguoi-gui/mau/cau-mau.json`) trong đó các trường cau_nguoi_gui của kit/hang-co-ho-so ×2, kit/hang-chua-ho-so, kit/da-phu, crm/hang-chua-ho-so (câu «kỳ đích đổi pha») và crm/da-phu không còn các chữ kho, tệp, thẻ mở phiên, thẻ cổng, đặc tả, vòng, engine, allow-list, bánh cóc, trace, sổ nguồn, lát dựng, mã đọc — tên việc đã được viết lại bằng tiếng người dùng CRM; mở file này và đọc lại từng câu thì kết luận của lens đổi.
    - (operational-feasibility) Bằng chứng các chữ còn lại trong tên việc CRM («kỳ đích», «pha», «Lát dựng», «Gantt», «đường găng», «baseline», «chip Kara») là nhãn mà nhân viên CRM đang thấy sẵn trên giao diện CRM — ví dụ ảnh chụp trang lộ trình/giao diện CRM hiển thị đúng các nhãn đó, hoặc danh sách thuật ngữ giao diện CRM — để chứng minh nhân viên hiểu chúng.
    - (operational-feasibility) Văn bản AC-10/contract nêu rõ người đọc của các hàng `kit` ở cau-mau.json là người phát triển kit chứ không phải nhân viên phòng ban CRM (loại các câu kit khỏi phạm vi chấm vai nhân viên), hoặc cau_nguoi_gui của hai câu «tạm hoãn» được bổ sung lý do hoãn có thể đọc trong chính tệp mẫu.
    - (spec-alignment) Một bản cau-mau.json sinh lại (từ bộ sinh mẫu của kit, ghi ra _acceptance/cau-tin-hieu-nguoi-gui/mau/cau-mau.json) trong đó tên việc ở kit[0], kit[1], kit[6] và crm[1], crm[6] được viết bằng tiếng người dùng, không còn các chữ «kho khai», «tệp», «thẻ mở phiên», «thẻ cổng», «đặc tả», «lát dựng», «đổi pha», «bánh cóc», «allow-list», «trace», «lớp lỗi», «sổ nguồn», «engine»; judge đọc lại tệp đó cho từng câu.
    - (spec-alignment) Hoặc một dòng trong contract.md (AC-10) / giải_thích của tệp mẫu nói rõ phạm vi người-gửi chỉ gồm các hàng crm[] và loại các hàng kit[] ra khỏi phép chấm, kèm một bản crm[] mà crm[1] và crm[6] đã được viết lại bằng chữ người dùng hiểu được (đọc từ cùng tệp cau-mau.json).
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-12T21:38:05Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-12T21:38:05Z

Lệnh suite đỏ không gắn eval nào (nên `failed_evals` để rỗng):

- `vung:3` — một ca đỏ: «[RT13] file lạ chứa "signed-off": tests/scripts/tin-hieu.test.mjs — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH» (kéo theo «ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)»); dòng tổng «Results: 1 failed». Nghĩa là tệp test của hồ sơ này chứa chữ «signed-off» mà chưa được khai gạch có lý do trong khối BO-DOC-KHAI-GACH. Mười lệnh suite còn lại đều xanh.

## Known limits

## Ngoài hợp đồng

## Analyst

Baseline khong do:

- node _acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs --crm "${CRM_ROOT:-$HOME/dev/crm}" --sha 06e34d26c38426e2e23cbf1a51bc612cccb405c9: bo qua baseline: tep _acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs co o cay dang kiem nhung chua co o merge-base 72eb55f3287477778e222ff47b08499d2aaa7969 — eval moi, chay tren code cu khong phan biet gi

Eval KHÔNG-PHÂN-BIỆT (xanh trên cả HEAD lẫn baseline):

- TH_CASES=CN-1,CN-1-do,CN-1-do2,CN-2,CN-2-do,CN-3,CN-3-do,CN-4,CN-4-do,CN-5,CN-5-do,CN-5-do2,CN-6,CN-6-do,CN-6-do-tt,CN-6-do2,CN-6-do3,CN-6-do4,CN-7,CN-7-do,CN-8,CN-8-do node tests/scripts/tin-hieu.test.mjs: E1, E2, E3, E4, E5, E6, E7, E8 (cùng một lệnh nên cùng một kết quả baseline). Tệp test ở merge-base chứa 0 ca mang tên CN-*, nên bộ lọc TH_CASES chọn rỗng; nhiều khả năng baseline xanh vì không có ca nào để đỏ chứ không phải vì vật cũ đã làm đúng hành vi mới. Cần viết lại để assert hành vi mới trên baseline (đỏ thật), hoặc xác nhận đây là regression-guard có chủ ý.

## Variance

none — mọi eval chạy một lượt, đồng nhất, không eval nào có phương sai.

## Iterations

Round 1: E1–E9 xanh (E1–E8 chung một lệnh, 22 ca); hội đồng E10 đề xuất FAIL ở cả ba lens vì tên việc chép nguyên văn còn chữ quy trình nội bộ; lệnh suite `vung:3` đỏ ca RT13 không gắn eval, mười lệnh suite còn lại xanh. Trả về triển khai.
