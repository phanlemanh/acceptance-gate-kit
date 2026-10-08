---
schema_version: 2
feature_slug: release-2-25-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5a4ce32d22aaafa5d4c4962549dfed457f45f4fa
human_signoff:
---

# Evidence Report: release-2-25-0

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
| E3i | AC-3 | test | PASS |
| E3j | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-25-0-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.rel2250_vung_3_p200
  verified_at: 2026-10-08T18:34:20Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'|     P200 VE: acceptance-gate hop semver: 2.25.0|     P200 VE: feature-loop hop semver: 2.25.0|     P200 VE: diagram-design hop se

- eval: E2
  run_id: minted-release-2-25-0-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.rel2250_vung_3_p200
  verified_at: 2026-10-08T18:34:20Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'|     P200 VE: acceptance-gate hop semver: 2.25.0|     P200 VE: feature-loop hop semver: 2.25.0|     P200 VE: diagram-design hop se

- eval: E3
  run_id: minted-release-2-25-0-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: 837 passed, 0 failed

- eval: E3f
  run_id: minted-release-2-25-0-E3f-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3g
  run_id: minted-release-2-25-0-E3g-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: 26 passed, 0 failed

- eval: E3h
  run_id: minted-release-2-25-0-E3h-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: 25 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-25-0-E3b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: 71 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-25-0-E3c-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: all plugin tests passed

- eval: E3i
  run_id: minted-release-2-25-0-E3i-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: all plugin tests passed

- eval: E3j
  run_id: minted-release-2-25-0-E3j-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-25-0-E3d-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-10-08T18:34:20Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-25-0-E3e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-10-08T18:34:20Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  run_id: minted-release-2-25-0-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2250_cua_so
  verified_at: 2026-10-08T18:34:20Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-25-0-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2250_dd_giu
  verified_at: 2026-10-08T18:34:20Z
  output: |
    moc:   "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-25-0-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.rel2250_vung_3_p200
  verified_at: 2026-10-08T18:34:20Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'|     P200 VE: acceptance-gate hop semver: 2.25.0|     P200 VE: feature-loop hop semver: 2.25.0|     P200 VE: diagram-design hop se

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi, round 1); mọi eval ghi baseline n-a.

Mười lăm eval đều xanh ở round này, chạy trên cây 5a4ce32d (sau hai commit sửa lệnh P200 để dòng bằng chứng sống sót qua bước cắt ba dòng cuối của báo cáo). Không có lệnh suite nào tách riêng khỏi eval.

- E1, E2, E6 — không phân biệt ở mức lệnh ngoài (không đo lại baseline ở round này); chiều đỏ sống trong chính P200 (5 đột biến cùng đối chứng dương trên bản sao nguyên vẹn). Giữ như khoá hồi quy có chủ ý cho mốc phát hành.
- E4, E5 — không phân biệt ở mức lệnh ngoài; chiều đỏ sống trong chính lệnh (slug thừa/thiếu in tên; mốc cũ `1b98fdb1` làm lệnh đỏ), đo lúc mở hồ sơ. Giữ như khoá hồi quy có chủ ý.
- E3, E3f, E3g, E3h, E3b, E3c, E3i, E3j, E3d, E3e — lệnh suite hồi quy, kỳ vọng của một mốc phát hành đóng số; không cần viết lại.

Lưu ý khi đọc phần `output:` của E1, E2, E6: lệnh P200 giờ gộp mọi dòng vào MỘT dòng, nhưng bước bọc lệnh của lượt chấm cắt mỗi dòng ở 240 byte, nên báo cáo chỉ giữ phần đầu của dòng gộp — các dòng P200 mà `expected` liệt kê (dòng mô tả hai plugin, năm dòng chiều đỏ, dòng tổng kết) không hiện hết ở đây. Kết luận đạt vẫn đọc từ mã thoát. Xem mục liên quan trong `review-findings.md` (phần ngoài hợp đồng) trước khi ký.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mười lăm eval đều xanh (E1 E2 E3 E3f E3g E3h E3b E3c E3i E3j E3d E3e E4 E5 E6) — không vòng sửa.
Round 2: chạy lại trên cây 6ceecaa3 (sau commit thêm chiều đỏ cho vế CHANGELOG của AC-10) — mười lăm eval vẫn xanh; một mục ngoài hợp đồng ghi ở review-findings.md để người quyết ở Gate 2.
Round 3: chạy lại trên cây 5a4ce32d (sau khi dòng P200 được gộp một dòng để sống qua bước cắt ba dòng) — mười lăm eval vẫn xanh; một mục ngoài hợp đồng mới về việc bước bọc lệnh cắt dòng gộp ở 240 byte, ghi ở review-findings.md để người quyết ở Gate 2.
