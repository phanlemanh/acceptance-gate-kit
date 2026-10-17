---
schema_version: 2
feature_slug: road-map-de-dung
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 433220428f445c7887f51b82e83527844e6fe154
human_signoff:
---

# Evidence Report: road-map-de-dung

Round 2. Mọi eval máy của hợp đồng đều xanh, nhưng một lệnh suite không gắn eval nào (`tests/plugins/run-tests.sh --manh vung:3`) trả mã thoát 1 ở ca P179, nên verdict là REJECT. `failed_evals` để trống vì không eval nào của hợp đồng đỏ; nguyên nhân nằm ở lệnh suite, xem mục «Lệnh suite (hồi quy)».

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | judgment | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | judgment | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-4 | test | PASS |
| E12 | AC-7 | test | PASS |
| E13 | AC-11 | test | PASS |

E4 và E7 là mục judgment: cột Verdict ghi đề xuất của hội đồng, chữ chốt của người còn trống (mục Judge panels).

## Evidence

- eval: E1
  run_id: minted-road-map-de-dung-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E3
  run_id: minted-road-map-de-dung-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E5
  run_id: minted-road-map-de-dung-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E6
  run_id: minted-road-map-de-dung-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lo_trinh_trang
  verified_at: 2026-10-17T16:42:52Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-road-map-de-dung-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E9
  run_id: minted-road-map-de-dung-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E10
  run_id: minted-road-map-de-dung-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E11
  run_id: minted-road-map-de-dung-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E12
  run_id: minted-road-map-de-dung-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

- eval: E13
  run_id: minted-road-map-de-dung-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.road_map_de_dung
  verified_at: 2026-10-17T20:40:56Z
  output: |
    RD Results: 38 PASS · 0 FAIL

### Judgment (hội đồng đề xuất — chữ chốt của người còn trống)

- eval: E4
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba lăng kính (domain-correctness, operational-feasibility, spec-alignment) đều thấy cả 13 mục K1–K13 có một khối của SKILL cắt lượt buộc ra đúng cách xử lý trong đáp án, không mục nào dẫn tới mốc `loai: ngoai`.
  human_override:  # chi nguoi ghi

- eval: E7
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba lăng kính đều đọc từ trang-moi.txt ra R2 20 việc, R1 8 việc, R3 4 việc, tất cả «Chưa mở», khớp dap-an-trang.json từng việc về tên và trạng thái.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-road-map-de-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-road-map-de-dung-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-road-map-de-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-road-map-de-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-road-map-de-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r2
  exit_code: 1
  verified_at: 2026-10-17T20:40:56Z
  output: |
    FAIL: P179 [MBC] E6 ledger known-limits: dem tu corpus + bat bien hang + quan he >=
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 4 passed, 0 failed (ntr-observed)
    Results: 1 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-road-map-de-dung-SUITE-bash_tests_workflows_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-road-map-de-dung-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-road-map-de-dung-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r2
  exit_code: 0
  verified_at: 2026-10-17T20:40:56Z

Lệnh fail không gắn eval: `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 ...'` (ca P179, phép đếm known-limits trong bộ plugin). Không eval nào của hợp đồng khai lệnh này, nên `failed_evals` trống; người cần xem P179 là lỗi của vật vòng này hay lỗi nền có sẵn trước khi quyết.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay. Field baseline cua moi eval ghi n-a.

Eval khong-phan-biet (xanh ca tren HEAD lan baseline, chung minh harness chu khong phai feature; viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y): E6 (lenh `node tests/scripts/xem-trang-lo-trinh.test.mjs`).

Baseline khong do: round nay khong do lai vi evals.yaml khong doi tu lan baseline cuoi (round 1). Lenh suite xanh-ca-hai-phia la regression-guard binh thuong, khong liet ke.

Ghi chu thoi diem: `verified_at` cua cac khoi round 2 ghi theo ngay viet bao cao; moc gio chinh xac cua tung lan chay nam o truong `ts` trong run-log.jsonl.

## Judge panels (đề xuất — người chốt ở Cổng 2, human_override để trống)

### E4 (AC-4) — đề xuất: PASS

- domain-correctness: PASS — Cả 13 mục K1–K13 đều có một khối của SKILL cắt lượt buộc ra đúng cách xử lý trong đáp án, và không mục nào dẫn tới mốc `loai: ngoai`. K1/K3/K5/K7/K9 vào hàng theo bước 3 và luật 5 của 2b, trong đó K1/K3/K7 là `du_lieu: gia` vì «cập nhật tuần» và «câu hỏi thật» được nêu đích danh, còn K5/K9 chỉ là thao tác «giao, duyệt, bấm» nên không khai `du_lieu`. K2→H1 và K6→R6 theo luật 4 (lặp theo tổ chức mà «coi là mới có một» → chờ; lặp theo kỳ «mỗi quý» → hàng ngay). K10→H2 theo luật 5 cuối. K4/K8/K11 ra khỏi kho theo luật 1 và 4. K12→mốc `han-cung` có hàng R6, R9 theo luật 2. K13→opportunity.md của R1 kèm mã vào `phu` theo luật 3.
- operational-feasibility: PASS — Mỗi mục K1–K13 đều có khối hoặc bước của SKILL quyết được cách xử lý, khớp dap-an.json. Các điểm dễ nước đôi (K13 vào phu theo bước 2b luật 3 so với bước 1; K2 là lặp theo tổ chức theo luật 4) đều có câu cụ thể chốt. Không mục nào dẫn tới mốc `loai: ngoai`.
- spec-alignment: PASS — Với cả 13 mục K1–K13, bước 2b và bước 3 của SKILL buộc ra đúng cách xử lý trong đáp án, và không mục nào dẫn tới mốc `loai: ngoai`. K1, K3, K7 là việc phát triển cần kết quả vận hành: luật 5 cho `du_lieu: gia` và tạo hàng `sinh-gia`, phép thử nêu đích danh «cập nhật tuần» và «câu hỏi thật». K5 và K9 là việc phát triển thành hàng. K2 lặp theo tổ chức mà mới có một nên vào mục chờ (luật 4, kèm quy tắc «mới có một»), mã ở «Ra khỏi kho». K6 lặp theo kỳ nên thành hàng R6 với `phu` rỗng. K4, K8, K11 là vận hành thuần (luật 1 và 4), liệt ở «Ra khỏi kho». K10 vào mục chờ theo luật 5 (ví dụ «sửa danh sách góp ý» khớp nguyên văn). K12 thành ngày của mốc `han-cung` gắn các hàng «đặt» và «công bố» (luật 2 khớp nguyên văn). K13 là đo giá trị, ghi vào `opportunity.md` của hàng R1, mã vào `phu` của R1 (luật 3).

human_override:  # chi nguoi ghi

### E7 (AC-7) — đề xuất: PASS

- domain-correctness: PASS — Đọc riêng trang-moi.txt, tôi ra: R2 có 20 việc, R1 có 8 việc, R3 có 4 việc, tất cả «Chưa mở». Đối chiếu dap-an-trang.json thì khớp từng việc về tên và trạng thái (20/20, 8/8, 4/4). Mỗi dòng là một câu mô tả việc bằng tiếng thường, mã chỉ đứng cuối trong ngoặc nên không cần hiểu mã vẫn đọc ra. Dòng đầu mỗi mốc có «còn n/m việc» nên đọc được trong khoảng một phút. Có vài thuật ngữ kỹ thuật (Breadcrumb, packages/ui) nhưng không làm mất nghĩa của việc.
- operational-feasibility: PASS — Chỉ từ trang-moi.txt, tôi đọc ra đủ 20/20 việc của mốc R2, 8/8 việc của mốc R1 và 4/4 việc của mốc R3, tất cả ở trạng thái «Chưa mở». Khi so với dap-an-trang.json, tên việc, số lượng và trạng thái khớp hoàn toàn. Mỗi việc là một câu tiếng Việt đọc được mà không cần mã, và mã chỉ là đuôi định danh trong ngoặc. Có vài chỗ hơi kỹ thuật (như V2e có đường dẫn packages/ui) nhưng không làm sai nghĩa hay trạng thái.
- spec-alignment: PASS — Từ `trang-moi.txt`, ba câu đều trả lời được trước khi mở đáp án. Mốc R2 còn 20/20 việc, mốc R1 còn 8/8, mốc R3 còn 4/4, tất cả «Chưa mở». Đáp án khớp từng việc về tên và trạng thái, không thiếu việc nào. Mỗi dòng là một câu tiếng thường, mã chỉ nằm trong ngoặc ở cuối nên đọc không phải đoán mã. Ba mốc dài 32 dòng, đọc được trong khoảng một phút.

human_override:  # chi nguoi ghi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy xanh, nhưng hội đồng chấm E4 (AC-4) cả ba lăng kính cùng FAIL vì SKILL cat-luot nước đôi ở K6/R6, K2/H1 và K12 (han hay han-cung); thêm một lỗi trong hợp đồng ở AC-10 (dự báo giờ máy một làn có thể cho mốc phụ thuộc xong trước mốc nó dựa vào) và một ca đo AC-10 lỏng hơn lời khai. Trả về triển khai.
Round 2: các eval máy E1, E3, E5, E8–E13 xanh (E6 mang từ round 1), hội đồng E4 và E7 đề xuất PASS, nhưng lệnh suite `tests/plugins/run-tests.sh --manh vung:3` đỏ ở ca P179 và không gắn eval nào, nên verdict là REJECT. Cần người xem P179 trước khi chạy lại.
