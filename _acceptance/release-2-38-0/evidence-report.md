---
schema_version: 2
feature_slug: release-2-38-0
verdict: REJECT
failed_evals: [E3i]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f2718ad047c7eec555471cf2e57daaa24e38216c
human_signoff:
---

# Evidence Report: release-2-38-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3f | AC-3 | test | PASS |
| E3g | AC-3 | test | PASS |
| E3h | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3i | AC-3 | test | REJECT |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người chốt ở Cổng 2) |
| E10 | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-38-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-38-0-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-38-0-E3j-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: all plugin tests passed

- eval: E6
  run_id: minted-release-2-38-0-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-38-0-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: 841 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-38-0-E3f-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: 43 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-38-0-E3g-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-38-0-E3h-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: 42 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-38-0-E3b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-38-0-E3c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-38-0-E3i-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-05T05:11:14Z
  output: |
    FAIL: P161 strip-md giu duong dan + ma tran toan phan
    Results: 1 failed

- eval: E3d
  run_id: minted-release-2-38-0-E3d-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-11-05T05:11:14Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-38-0-E3e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-11-05T05:11:14Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-38-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_cua_so
  verified_at: 2026-11-05T05:11:14Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-38-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_dd_giu
  verified_at: 2026-11-05T05:11:14Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E7
  run_id: minted-release-2-38-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_goi_doi
  verified_at: 2026-11-05T05:11:14Z
  output: |
    goi chi doi so: dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json

- eval: E8
  run_id: minted-release-2-38-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2380_lop_chep
  verified_at: 2026-11-05T05:11:14Z
  output: |
    XANH: đúng 0 tệp đổi như ghi chú 2.38.0 kể

- eval: E10
  run_id: minted-release-2-38-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-05T05:11:14Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.37.0 (39fa45cc) cài đúng tag

### Hội đồng chấm E9 (đề xuất, chưa người chốt)

Panel đề xuất: PASS. Ba lăng kính, mỗi phiếu giữ nguyên rationale.

- domain-correctness: PASS — Mục 2.38.0 của CHANGELOG khớp cả năm vế khi đọc cạnh các nguồn trong danh sách. Chữ «Gốc:», «Vật:» và các giới hạn trích khớp opportunity.md và hợp đồng của hai hồ sơ. Số mục giới hạn khớp Notes (6 và 17), số TRƯỚC/SAU khớp AC-5 của ban-do-khuon-roi-nhom, và 36 dòng trong khối INIT-CI-COPY-LIST khớp lời «không chép gì». Lời về `--nhom`/`--nhom-moi`/`--gan`, `chon`, khối «Khuôn», các cờ, tệp rời nhóm, `khoi: []`/trống/`""`, «Vì sao 2.38.0», «Ai bị ảnh hưởng» và lý do cắt trước nen-thiet-ke-0411 khớp hợp đồng, GUIDE §5.2, khuôn tệp và Context của release-2-38-0.
- operational-feasibility: PASS — Mục 2.38.0 khớp nguồn ở cả năm vế. «Gốc:» và «Vật:» chép đúng opportunity.md và dòng feature của hai hợp đồng. Số giới hạn 6 và 17 khớp số mục Ngoài-N trong Notes, hai câu trích Ngoài-1/11/15 đúng chữ. Các cờ, khoá `chon`, quy tắc `khoi` và số TRƯỚC/SAU (10·6·65→0·0·81; 6·3·47→0·0·56) khớp hợp đồng, design.md, template và GUIDE §5.2. Khối INIT-CI-COPY-LIST có đúng 36 mục, khớp «36 tệp giữ nguyên», không mục nào kể là đổi (người chấm không đọc diff nên không đối chiếu được tệp thực tế). «Vì sao 2.38.0», «Ai bị ảnh hưởng» và lý do cắt trước `nen-thiet-ke-0411` khớp Context của hợp đồng release-2-38-0.
- spec-alignment: PASS — Cả năm vế đều khớp nguồn trong danh sách. Chữ Gốc và Vật khớp opportunity và feature của hợp đồng, số giới hạn 6 và 17 khớp số mục Ngoài-n ở Notes, và hai câu trích Ngoài-1, Ngoài-11, Ngoài-15 đúng nguyên văn. Phần cờ, khoá `chon`, thẻ hai cổng, tệp rời nhóm, số TRƯỚC/SAU (10·6·65→0·0·81; 6·3·47→0·0·56), "không chép gì" (khối INIT-CI-COPY-LIST có 36 mục, không mục nào ghi là đổi) và lý do cắt trước nen-thiet-ke-0411 đều khớp hợp đồng, design.md, khuôn tệp và GUIDE §5.2. Hai đổi hành vi chạm kho đang dùng được nói thẳng, và căn cứ chọn minor đúng với nếp đã khai ở đoạn «Vì sao 2.37.0».

- eval: E9
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ chưa chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- `bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`: E1, E2, E3j, E6
- `bash tests/scripts/run-tests.sh --manh bash`: E3

Lệnh fail không gắn eval: không có. Lệnh duy nhất thoát khác 0 (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 ...'`) gắn với E3i, ca P161 đỏ.

Baseline khong do:
- bash tests/scripts/run-tests.sh --manh mjs:1/3: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:2/3: baseline vuot tran 9 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash tests/scripts/run-tests.sh --manh mjs:3/3: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/hooks/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash tests/workflows/run-tests.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node scripts/product-map.mjs --root . --check: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- GIT_GLOB_PATHSPECS=1 bash scripts/rel-cua-so.sh 39fa45cc ban-do-khuon-roi-nhom khoi-khuon-tren-the-cong: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'c=$(git show 39fa45cc:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 39fa45cc HEAD -- diagram-design && [ "$c" = "$m" ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash -c 'd=$(git diff --name-only 39fa45cc HEAD -- dieu-phoi road-map tri-thuc | tr "\n" " "); echo "goi chi doi so: $d"; [ "$d" = "dieu-phoi/.claude-plugin/plugin.json road-map/.claude-plugin/plugin.json tri-thuc/.claude-plugin/plugin.json " ]': het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- bash _acceptance/release-2-38-0/lop-chep-doi.sh 39fa45cc 2.38.0: bo qua baseline: tep _acceptance/release-2-38-0/lop-chep-doi.sh co o cay dang kiem nhung chua co o merge-base 2c77e408016fb411efa990cc3487f96d2c5f06c2 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E3i đỏ — vùng 2 của suite plugins có một ca đỏ duy nhất, P161 (strip-md giữ đường dẫn + ma trận toàn phần). Trả về bước hiện thực.
