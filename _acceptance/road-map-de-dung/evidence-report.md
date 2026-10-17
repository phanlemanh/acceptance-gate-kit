---
schema_version: 2
feature_slug: road-map-de-dung
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e429c126ff22f932be81f7266ac91c29026acb53
human_signoff:
---

# Evidence Report: road-map-de-dung

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | judgment | FAIL |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | judgment | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-4 | test | PASS |
| E12 | AC-7 | test | PASS |
| E13 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-road-map-de-dung-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E3
  run_id: minted-road-map-de-dung-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E5
  run_id: minted-road-map-de-dung-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E6
  run_id: minted-road-map-de-dung-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.lo_trinh_trang
  verified_at: 2026-10-17T16:42:52Z
  output: |
    Results: 11 passed, 0 failed (xem-trang-lo-trinh)

- eval: E8
  run_id: minted-road-map-de-dung-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E9
  run_id: minted-road-map-de-dung-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E10
  run_id: minted-road-map-de-dung-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E11
  run_id: minted-road-map-de-dung-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E12
  run_id: minted-road-map-de-dung-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

- eval: E13
  run_id: minted-road-map-de-dung-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T16:42:52Z
  output: |
    RD Results: 36 PASS · 0 FAIL

### Judgment

Panel đề xuất cho E4 và E7 (ba lăng kính mỗi eval). Ô human_override để TRỐNG cho người quyết ở Cổng Bằng chứng.

- eval: E4
  judged_by: judge-subagent (fresh context)
  proposal: FAIL
  votes:
    - domain-correctness: FAIL — Hầu hết mục (K1,K3,K4,K5,K7,K8,K9,K10,K11,K13, K2, K6) có chỗ trong CAT-LUOT-VAN-HANH quyết được. Riêng K12 (sự kiện tạo hạn 07/12): luật 2 chỉ nói mốc «phat-hanh, han hay han-cung» không có tiêu chí chọn, và lo-trinh-template.json dạy mốc `loai: han` cho đúng ca này, trong khi đáp án đòi `han-cung`, nên hai cách đều hợp luật (nước đôi).
    - operational-feasibility: FAIL — Phần lớn mục quyết được bằng trích dẫn: K4, K8 và K11 theo 2b luật 1 và 4; K10 theo luật 5, nhánh «Cần PHẠM VI chỉ biết sau việc vận hành»; K13 theo luật 3; K1, K3 và K7 theo luật 5. Nhưng SKILL im lặng hoặc nước đôi ở ba chỗ: K6 và hàng R6, K12 chọn `han` hay `han-cung`, K2 và H1 cần biết «mới có một» tổ chức.
    - spec-alignment: FAIL — 11 trong 13 mục có bước hoặc khối SKILL buộc cách xử lý đúng đáp án. K6 và K2 (vận hành lặp lại) thì SKILL nước đôi: luật 4 khối CAT-LUOT-VAN-HANH không nói mã gốc có được chép vào bản phạm vi làm `phu` của hàng R6 hay mục H1 không. Bước 1 chỉ cấm chép «vận hành thuần», nên «K6 trong bản phạm vi, R6 phu [K6]» vẫn hợp luật nhưng lệch đáp án «K6 ra khỏi kho, R6 phu []». Thêm nữa, SKILL không chọn giữa mốc `han` và `han-cung` (đáp án chọn `han-cung`) và không buộc gắn mốc K12 vào R6 và R9.
  required_evidence:
    - Trong khối CAT-LUOT-VAN-HANH (hoặc bước 3) của /Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/angry-wilson-b98512/skills/cat-luot/SKILL.md có một câu nêu tiêu chí chọn giữa `han` và `han-cung` (ví dụ: «sự kiện của người có ngày không dời được, công cụ phải sẵn trước ngày ấy» thì `han-cung`) để K12 quyết được là `han-cung`.
    - Hoặc lo-trinh-template.json mang mốc mẫu `loai: han-cung` cho ca sự kiện tạo hạn cứng, hoặc dap-an.json đổi mốc K12 thành `han` cho khớp luật hiện hành.
    - K6 và R6. 2b luật 4 chỉ nói «việc tự phục vụ thay nó là mã phát triển — một hàng ngay». Bước 1 chỉ nói «chỉ mục PHÁT TRIỂN thành dòng mã». Hai cách đều hợp luật: chép K6 vào bản phạm vi và để R6 mang phu [K6], hoặc không chép K6 mà tạo R6 với phu [] như đáp án. Luật 5(i) chỉ cho phép tạo hàng với phu rỗng cho hàng sinh-gia. Cần một câu trong khối CAT-LUOT-VAN-HANH hoặc bước 1 của skills/cat-luot/SKILL.md, nói mã vận hành lặp theo kỳ có vào phu của hàng tự phục vụ hay không, có đứng ở «Ra khỏi kho» hay không, và hàng được tạo mang mã nào.
    - K12 và loại mốc. Luật 2 liệt kê «mốc phat-hanh, han hay han-cung» mà không nói khi nào chọn loại nào. Đáp án chọn han-cung, còn mẫu skills/acceptance/references/lo-trinh-template.json dùng han cho cùng loại sự kiện. Cần một câu trong SKILL, hoặc một định nghĩa loại mốc mà SKILL trỏ tới, phân biệt han và han-cung (ví dụ ngày công bố cố định thì chọn loại nào). SKILL cũng chưa nói phiên cắt có tạo mốc mới khi lộ trình chưa có mốc nào hay không, và gắn hàng nào vào mốc: R6 và R9 do K12 «đặt và công bố».
    - K2 và H1. Luật 4 rẽ sang mục chờ điều kiện chỉ khi «mới có một» tổ chức. Đầu vào dau-vao-crm.md chỉ ghi «mỗi tổ chức mới», không nêu số tổ chức hiện có. Hai cách đều hợp luật: tạo hàng ngay, hoặc đưa vào chan_troi. Cần một quy tắc trong SKILL về cách phiên cắt xác định «mới có một» (đọc từ đâu, mặc định khi không rõ), hoặc một dòng trong đầu vào mẫu nêu số tổ chức hiện có.
  human_override:  # chi nguoi ghi

- eval: E7
  judged_by: judge-subagent (fresh context)
  proposal: PASS
  votes:
    - domain-correctness: PASS — Chỉ đọc trang-moi.txt, tôi trả lời được cả ba câu: R2 còn 20/20 việc, R1 còn 8/8 việc, R3 còn 4/4 việc, tất cả ở trạng thái «Chưa mở» (chưa bắt đầu, chưa xong). Đối chiếu dap-an-trang.json thì tên việc, số lượng (20/8/4) và trạng thái khớp từng dòng. Mỗi việc là một câu tiếng Việt tự đủ nghĩa, mã chỉ nằm trong ngoặc ở cuối. Mốc có 20 việc đọc khoảng một phút là xong. Một vài việc ở mốc R2 có từ kỹ thuật (packages/ui, Breadcrumb) nhưng vẫn hiểu được ý.
    - operational-feasibility: PASS — Chỉ đọc trang-moi.txt, tôi đọc ra mốc R2 có 20/20 việc, mốc R1 có 8/8 việc và mốc R3 có 4/4 việc. Cả ba mốc đều ở trạng thái «Chưa mở». Sau đó so với dap-an-trang.json thì khớp cả ba: đủ số việc, đủ tên việc, đúng trạng thái. Mỗi việc là một câu tiếng Việt tự nói được ý, mã (R1, N1, 10…) chỉ nằm trong ngoặc ở cuối dòng nên không cần giải mã. Tiêu đề mốc ghi sẵn «còn n/m việc», nên người không biết mã vẫn đọc xong trong khoảng một phút.
    - spec-alignment: PASS — Đọc riêng trang-moi.txt, tôi ra đúng ba câu trả lời: mốc R2 còn 20/20 việc, mốc R1 còn 8/8, mốc R3 còn 4/4, và mọi việc đều ở «Chưa mở». Đối chiếu dap-an-trang.json thì khớp từng việc và từng trạng thái. Mỗi việc được nêu bằng một câu tiếng Việt tự đọc hiểu, mã (R1a, N1, 10…) chỉ nằm ở cuối dòng và không cần để hiểu nghĩa, nên một người không biết mã vẫn đọc được trong khoảng một phút.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-road-map-de-dung-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-road-map-de-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-road-map-de-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-road-map-de-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-road-map-de-dung-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-road-map-de-dung-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-road-map-de-dung-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-17T16:42:52Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh ở CẢ cây đang kiểm lẫn baseline): E6 (`node tests/scripts/xem-trang-lo-trinh.test.mjs`) — regression-guard có chủ ý cho trang lộ trình; baseline: green.

Baseline khong do
- node tests/scripts/road-map-de-dung.test.mjs: bo qua baseline: tep tests/scripts/road-map-de-dung.test.mjs co o cay dang kiem nhung chua co o merge-base 77b3750ee2a1a799fbc719c97b401e6d3ac146a3 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy xanh, nhưng hội đồng chấm E4 (AC-4) cả ba lăng kính cùng FAIL vì SKILL cat-luot nước đôi ở K6/R6, K2/H1 và K12 (han hay han-cung); thêm một lỗi trong hợp đồng ở AC-10 (dự báo giờ máy một làn có thể cho mốc phụ thuộc xong trước mốc nó dựa vào) và một ca đo AC-10 lỏng hơn lời khai. Trả về triển khai.
