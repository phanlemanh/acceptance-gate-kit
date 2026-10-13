---
schema_version: 2
feature_slug: cau-tin-hieu-nguoi-gui
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 478ad46b13595ae98f2f49ae7fbeda906635d651
human_signoff:
---

# Evidence Report: cau-tin-hieu-nguoi-gui

Round 3. Mười lệnh suite chạy xanh trọn, gồm cả `vung:3` (ca P179 của round 2 không còn đỏ). Chín eval máy E1–E9 không chạy lại vì delta không chạm paths của chúng nên mang nguyên kết quả round 2 (carry-forward, run_id và verified_at giữ nguyên). Hội đồng E10 (judgment) giữ nguyên đề xuất UNCERTAIN của round 2 vì đầu vào không đổi, chưa có chữ người. Verdict là PENDING-JUDGMENT: chỉ còn E10 chờ người quyết ở Cổng 2. Không có phát hiện trong hợp đồng; năm phát hiện mới ngoài hợp đồng nằm ở `review-findings.md`.

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
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-cau-tin-hieu-nguoi-gui-E2-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-cau-tin-hieu-nguoi-gui-E3-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-cau-tin-hieu-nguoi-gui-E4-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-cau-tin-hieu-nguoi-gui-E5-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-cau-tin-hieu-nguoi-gui-E6-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-cau-tin-hieu-nguoi-gui-E7-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-cau-tin-hieu-nguoi-gui-E8-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.test.tin_hieu_cau
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-cau-tin-hieu-nguoi-gui-E9-r2
  exit_code: 0
  carried_from_round: 2
  baseline: n-a
  verifier: config:executors.script.cau_crm
  verified_at: 2026-10-12T23:03:37Z
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  judged_by: judge panel (3 lens, fresh context) — giu nguyen tu round 2, đề xuất của máy, chưa có chữ người
  verdict: UNCERTAIN
  rationale: Panel giu nguyen tu round 2 — inputs khong doi, khong cham lai; rationale xem round do. Phần câu do kit viết sạch ở cả 16 câu; ba lens bất đồng ở tên việc CRM chép nguyên văn, nên máy đề xuất UNCERTAIN và chữ cuối là của người ở Cổng 2.
  panel:
    - domain-correctness: FAIL (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: UNCERTAIN (r2)
  required_evidence:
    - (domain-correctness) Bản cau-mau.json dựng lại (cùng đường dẫn _acceptance/cau-tin-hieu-nguoi-gui/mau/cau-mau.json, cùng nguồn CRM 06e34d26...) mà cau_nguoi_gui của cho=da-phu và của cho=hang-chua-ho-so (việc 7n) không còn «Lát dựng», «mã đọc đúng tiếng», «kỳ đích đổi pha», «đợt rà» — tên việc được thay bằng một tên bằng tiếng nhân viên dùng thường ngày; tệp này sinh ra từ lệnh dựng mẫu của chính vòng, không sửa tay.
    - (domain-correctness) Ảnh chụp màn hình hoặc tệp chuỗi chữ giao diện của CRM thật ở commit 06e34d26 cho thấy «Lát dựng», «kỳ đích», «pha», «Kara» là chữ đang hiện cho người dùng cuối trên trang Mục tiêu hoặc Tín hiệu đã gửi; nếu có, các chữ đó là từ vựng sản phẩm quen thuộc của nhân viên CRM và các câu tương ứng đổi sang PASS.
    - (spec-alignment) Ảnh chụp trang CRM thật (hoặc tệp chuỗi giao diện của kho CRM ở commit 06e34d26) cho thấy các chữ «chip Kara», «kỳ đích», «đổi pha», «đợt rà», «Lát dựng», «mã đọc đúng tiếng» là nhãn nhân viên đã thấy hằng ngày. Nếu đủ cả sáu thì verdict đổi thành PASS.
    - (spec-alignment) Biên bản một lần đọc thử của một nhân viên phòng ban không dùng git trên đúng 8 câu cau_nguoi_gui của khối crm (cau-mau.json), ghi rõ từng chữ họ vấp. Nếu họ vấp ở chữ nào thì verdict đổi thành FAIL và nêu đúng câu và chữ đó.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

Cả mười lệnh suite chạy xanh ở round 3 (bộ bash 838 ca, ba lát mjs 30 · 29 · 29 ca, hooks 71 ca, ba vùng plugins, workflows, bản đồ lộ trình khớp).

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_hooks_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-bash_tests_workflows_run_tests_sh-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cau-tin-hieu-nguoi-gui-SUITE-node_scripts_product_map_mjs_root_check-r3
  exit_code: 0
  verified_at: 2026-10-13T00:14:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1). Mọi block eval máy ghi `baseline: n-a`.

Eval KHÔNG-PHÂN-BIỆT (xanh trên cả HEAD lẫn baseline), carried từ round 1:

- TH_CASES=CN-1,CN-1-do,CN-1-do2,CN-2,CN-2-do,CN-3,CN-3-do,CN-4,CN-4-do,CN-5,CN-5-do,CN-5-do2,CN-6,CN-6-do,CN-6-do-tt,CN-6-do2,CN-6-do3,CN-6-do4,CN-7,CN-7-do,CN-8,CN-8-do node tests/scripts/tin-hieu.test.mjs: E1, E2, E3, E4, E5, E6, E7, E8 (cùng một lệnh nên cùng một kết quả baseline). Cần viết lại để assert hành vi mới trên baseline, hoặc xác nhận đây là regression-guard có chủ ý.

## Variance

none — mọi eval chạy một lượt, đồng nhất, không eval nào có phương sai.

## Iterations

Round 1: E1–E9 xanh (E1–E8 chung một lệnh, 22 ca); hội đồng E10 đề xuất FAIL ở cả ba lens vì tên việc chép nguyên văn còn chữ quy trình nội bộ; lệnh suite `vung:3` đỏ ca RT13 không gắn eval, mười lệnh suite còn lại xanh. Trả về triển khai.
Round 2: E1–E9 xanh (E1–E8 chung một lệnh, 24 ca); hội đồng E10 đổi từ ba FAIL sang một FAIL, một PASS, một UNCERTAIN nên đề xuất UNCERTAIN; lệnh suite `vung:3` đỏ ca P179 (sổ known-limits) không gắn eval, mười lệnh suite còn lại xanh; không có phát hiện trong hợp đồng, một phát hiện mới ngoài hợp đồng. Trả về triển khai.
Round 3: mười lệnh suite xanh trọn (P179 hết đỏ); E1–E9 carry-forward từ round 2 vì delta không chạm paths; hội đồng E10 giữ nguyên UNCERTAIN (đầu vào không đổi); không có phát hiện trong hợp đồng, năm phát hiện ngoài hợp đồng. Chuyển Cổng 2 với verdict PENDING-JUDGMENT.
