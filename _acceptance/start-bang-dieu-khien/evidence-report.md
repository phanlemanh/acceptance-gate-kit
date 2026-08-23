---
schema_version: 2
feature_slug: start-bang-dieu-khien
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 001c524e41b7ebf076f4deabe531f50751fccd36
human_signoff: Manh Phan 2026-08-23 — ký với 15 known-limits đã khai trong contract ## Notes; mục thứ 16 (ngày hồ sơ đã nghiệm thu lấy sai nấc) tách thành ô riêng vì nó chạm HỢP ĐỒNG chứ không chạm mã; 9 quyết định ghi sau dấu niêm Cổng Phạm vi đã phê
---

# Evidence Report: start-bang-dieu-khien

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

## Evidence

- eval: E1
  run_id: minted-start-bang-dieu-khien-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:00:00Z
  output: |
    Results: all plugin tests passed
    Exit code: 0

- eval: E2
  run_id: minted-start-bang-dieu-khien-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:00:00Z
  output: |
    Results: all plugin tests passed
    Exit code: 0

- eval: E3
  run_id: minted-start-bang-dieu-khien-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_at
  verified_at: 2026-08-23T00:00:00Z
  output: |
    OK [at] — cay that 57 ho so, 0 null; ba nac dung tren fixture; go thang -> null, khong bia moc

- eval: E4
  run_id: minted-start-bang-dieu-khien-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:00:00Z
  output: |
    Results: all plugin tests passed
    Exit code: 0

- eval: E5
  run_id: minted-start-bang-dieu-khien-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_veto
  verified_at: 2026-08-23T00:00:00Z
  output: |
    OK [veto-ten] — 16 ho so, tap == grep, 14 ho so signed-off co mat; thu ve verified -> 2 (do)

- eval: E6
  run_id: minted-start-bang-dieu-khien-E6-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_dang_thuc
  verified_at: 2026-08-23T00:00:00Z
  output: |
    OK [dang-thuc] — may quet == luoi tren cung kho git (2 -> 3, ca hai cung tang 1); bo mot ho so -> dang thuc vo

- eval: E7
  run_id: minted-start-bang-dieu-khien-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:00:00Z
  output: |
    Results: all plugin tests passed
    Exit code: 0

- eval: E8
  run_id: minted-start-bang-dieu-khien-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_bon_bo_doc
  verified_at: 2026-08-23T00:00:00Z
  output: |
    OK [bon-bo-doc] — neo vao HO SO THAT (release-2-1-0); sach+veto-mo: 0/3 bo doc co vi tu moi ky; pha vat that: 3/3 moi ky; ban do dung yen ca hai chieu; 3 chieu do song
    EXIT_CODE=0

- eval: E9
  run_id: minted-start-bang-dieu-khien-E9-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_ahead_behind
  verified_at: 2026-08-23T00:00:00Z
  output: |
    OK [ahead-behind] — 6 chan: ban chung truoc, @{u} la nac cuoi, khong remote -> null, 0 goi mang; dao thang -> noi doi behind 0 (do)

- eval: E10
  run_id: minted-start-bang-dieu-khien-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:00:00Z
  output: |
    Results: all plugin tests passed
    Exit code: 0

- eval: E11
  run_id: minted-start-bang-dieu-khien-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-23T00:00:00Z
  output: |
    Results: all plugin tests passed
    Exit code: 0

- eval: E12
  run_id: minted-start-bang-dieu-khien-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-23T00:00:00Z
  output: |
    PASS: ARM13-mut

    Results: 750 passed, 0 failed

- eval: E13
  run_id: minted-start-bang-dieu-khien-E13-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-08-23T00:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E14
  run_id: minted-start-bang-dieu-khien-E14-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.bdk_rang_sort_tuoi
  verified_at: 2026-08-23T00:00:00Z
  output: |
    OK [sort-tuoi] — moc rong xep cuoi; ageTied dung tren 2-chung-commit + 1-rieng; doi chung duong dat moc -> het cong rong; 2 chieu do song

## Analyst

E1, E2, E4, E7, E10, E11 (bash tests/plugins/run-tests.sh) — xanh cả trên nhánh này lẫn trên diffBase; đây là suite dùng chung cho cả bốn eval nên tự nó xanh-cả-hai-phía là regression-guard bình thường (các ca discriminate đã tách riêng ở các bộ `rang-bdk.sh` khác trong cùng bảng).
E12 (bash tests/scripts/run-tests.sh) — suite chung của toàn bộ `scripts/`, xanh-cả-hai-phía là regression-guard cho lớp lib/md-section/repin, không phải phép đo riêng của feature này.
E13 (node scripts/product-map.mjs --root . --check) — bản đồ sản phẩm xanh trên cả hai phía vì product-map.mjs đọc BUCKET_OF tại chỗ; đúng là ca "bản đồ đứng yên" mà AC-7 đòi, không phải rò rỉ đo lường.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E4, E5, E8, E11 bị review nêu tên — E1 dùng phép hoặc che vế (`/cũ nhất|chưa rõ tuổi/` luôn được vế đầu thoả sẵn), E4 giao mô hình tự xếp lại 57 mốc thay vì máy quét tự sort, E5 đọc cửa veto SAU chốt status khiến hồ sơ veto-mở-status-hỏng biến khỏi thẻ, E8 chỉ soi chip/nút nên khối VIỆC-CỦA-ANH vẫn dặn ký + bộ đọc thứ ba dùng grep tĩnh + fixture không chứng minh được lượt tiêm đổi dòng, E11 thiếu khoá paths cho chính ca đo mới. Trả về implementation, vòng 2 sửa cả năm và bổ sung chiều đỏ tương ứng.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
