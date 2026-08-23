---
schema_version: 2
feature_slug: start-bang-dieu-khien
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 57820029a32b06b070690c176bd2c63d8a2e3a8a
human_signoff:
---

# Evidence Report: start-bang-dieu-khien

Round 1. Bốn suite (`tests/plugins`, `tests/scripts`, `tests/hooks`, `tests/workflows`) + `node scripts/product-map.mjs --root . --check` + sáu chân riêng của `_acceptance/start-bang-dieu-khien/rang-bdk.sh` đều exit 0 trên cây đã pin ở `verified_commit`. **Verdict REJECT không đến từ mã thoát của lệnh nào** — `failed_evals` rỗng vì không lệnh nào tự báo lỗi. REJECT đến từ review độc lập (scope-triage): 4 finding thật rơi TRONG hợp đồng, ghim trực tiếp vào AC-2, AC-4, AC-5, AC-8 — các khối lệnh tương ứng vẫn xanh vì bản thân phép đo có lỗ (đo chỉ dẫn thay vì đầu ra, thiếu sort, chiều đỏ không thể đỏ, v.v.). Chi tiết từng lỗ nằm ở `review-findings.md` § «Trong hợp đồng». Cuối file đó còn cảnh báo: 5/14 lỗi tổng cộng rơi vào file không bộ đo nào phủ — cần người quyết mở rộng hợp đồng hay rút phạm vi trước khi vòng sau bắt đầu.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-7 | test | PASS |
| E13 | AC-7 | script | PASS |
| E14 | AC-12 | script | PASS |

## Bằng chứng gốc — lệnh chạy, kể cả hai suite không gắn eval

    bash tests/plugins/run-tests.sh                                          →  PASS: ca bang dieu khien — BDK4; Results: all plugin tests passed
    bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan at             →  OK [at]
    bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan veto-ten       →  OK [veto-ten]
    bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan dang-thuc      →  OK [dang-thuc]
    bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan bon-bo-doc     →  OK [bon-bo-doc]
    bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan ahead-behind   →  OK [ahead-behind]
    bash _acceptance/start-bang-dieu-khien/rang-bdk.sh --chan sort-tuoi      →  OK [sort-tuoi]
    bash tests/scripts/run-tests.sh                                         →  PASS: ARM13-mut; Results: 750 passed, 0 failed
    node scripts/product-map.mjs --root . --check                          →  PRODUCT-MAP.md khớp hồ sơ xưởng.
    bash tests/hooks/run-tests.sh (regression-guard, không gắn eval)         →  PASS: V06; Results: 60 passed, 0 failed
    bash tests/workflows/run-tests.sh (regression-guard, không gắn eval)     →  Results: 44 passed, 0 failed; all workflow tests passed

## Evidence

- eval: E1
  run_id: minted-start-bang-dieu-khien-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T15:50:12Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-start-bang-dieu-khien-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T15:50:12Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-start-bang-dieu-khien-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_at
  verified_at: 2026-08-23T15:51:03Z
  output: |
    OK [at] — cay that 57 ho so, 0 null; ba nac dung tren fixture; go thang -> null, khong bia moc

- eval: E4
  run_id: minted-start-bang-dieu-khien-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T15:50:12Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-start-bang-dieu-khien-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_veto
  verified_at: 2026-08-23T15:51:47Z
  output: |
    OK [veto-ten] — 16 ho so, tap == grep, 14 ho so signed-off co mat; thu ve verified -> 2 (do)

- eval: E6
  run_id: minted-start-bang-dieu-khien-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_dang_thuc
  verified_at: 2026-08-23T15:52:20Z
  output: |
    OK [dang-thuc] — may quet == luoi tren cung kho git (2 -> 3, ca hai cung tang 1); bo mot ho so -> dang thuc vo

- eval: E7
  run_id: minted-start-bang-dieu-khien-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T15:50:12Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-start-bang-dieu-khien-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_bon_bo_doc
  verified_at: 2026-08-23T15:53:05Z
  output: |
    OK [bon-bo-doc] — neo vao HO SO THAT (release-2-0-0); sach+veto-mo: 0/3 bo doc co vi tu moi ky; pha vat that: 3/3 moi ky; ban do dung yen ca hai chieu; 3 chieu do song

- eval: E9
  run_id: minted-start-bang-dieu-khien-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_ahead_behind
  verified_at: 2026-08-23T15:53:41Z
  output: |
    OK [ahead-behind] — 6 chan: ban chung truoc, @{u} la nac cuoi, khong remote -> null, 0 goi mang; dao thang -> noi doi behind 0 (do)

- eval: E10
  run_id: minted-start-bang-dieu-khien-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T15:50:12Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-start-bang-dieu-khien-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T15:50:12Z
  output: |
    PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-start-bang-dieu-khien-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-23T15:55:02Z
  output: |
    PASS: ARM13-mut

    Results: 750 passed, 0 failed

- eval: E13
  run_id: minted-start-bang-dieu-khien-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-08-23T15:55:39Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E14
  run_id: minted-start-bang-dieu-khien-E14-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_sort_tuoi
  verified_at: 2026-08-23T15:54:18Z
  output: |
    OK [sort-tuoi] — moc rong xep cuoi; ageTied dung tren 2-chung-commit + 1-rieng; doi chung duong dat moc -> het cong rong; 2 chieu do song

## Analyst

Tám eval xanh trên cả HEAD lẫn diffBase (không phân biệt được feature này với code cũ — đến từ ba lệnh suite tổng hợp trần, không phải ca riêng cho feature):
- E1, E2, E4, E7, E10, E11 — cả sáu chạy chung `bash tests/plugins/run-tests.sh`; suite này pass trên baseline vì phần lớn ca của nó (LB1-9, P30/P101/P122/P126/P200...) không đụng khoá mới của round này. Phần rủi ro thật của round (khoá `at`, veto-ten, đang-thực, bốn bộ đọc, ahead/behind, sort-tuổi) đã có chiều đỏ riêng ở E3/E5/E6/E8/E9/E14 — sáu eval này ở đây đóng vai regression-guard cho phần còn lại của suite.
- E12 (`bash tests/scripts/run-tests.sh`) — suite scripts, guard cho lớp lib/md-section/repin không bị đổi bởi round này.
- E13 (`node scripts/product-map.mjs --root . --check`) — bản đồ đã khớp trước khi đổi BUCKET_OF, guard cho việc đổi bảng không tự phá bản đồ.

## Variance

none — mọi eval vòng này chạy `runs: 1`, không có eval ngẫu nhiên (không qua `ctx.providers.invoke`).

## Iterations

Round 1: mọi lệnh eval + hai suite ngoài eval đều exit 0 (harness xanh toàn bộ), nhưng review độc lập (scope-triage) ghim 4 finding thật vào AC-2, AC-4, AC-5, AC-8 — các phép đo tương ứng không tự đỏ vì chính chúng có lỗ (chi tiết: `review-findings.md` § Trong hợp đồng). REJECT theo nội dung hợp đồng, không theo mã thoát. Quay lại triển khai.

## Gate 2 checklist (human)

- [ ] Đọc bảng + soát 1-2 khối bằng chứng
- [ ] Xác nhận cá nhân từng judgment item UNCERTAIN rồi điền dòng `human_override: <tên> <ngày>`
- [ ] Chỉ T3: xác nhận cá nhân TẤT CẢ judgment item và điền `human_override` cho từng cái
- [ ] Nếu verdict là PENDING-JUDGMENT: nâng lên PASS (lượt ghi này là lúc hook thẩm định lại bằng chứng + override)
- [ ] Điền `human_signoff` trong frontmatter
