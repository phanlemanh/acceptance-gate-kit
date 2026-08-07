---
schema_version: 2
feature_slug: workspace-reader-unification
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ad4619558be1d09b0c827a80baba4740ec8926ac
human_signoff: Manh Phan 2026-08-07 — ký thẳng, known-limits cả 4 lỗi ngoài hợp đồng (2 câu chữ mặt người + 2 mục nhẹ)
---

# Evidence Report: workspace-reader-unification

Round 2 (tái verify trên commit mới sau round 1): 18 eval máy (E1-E11, E13-E19) qua `bash tests/plugins/run-tests.sh` và 1 eval máy (E12) qua `node scripts/product-map.mjs --root . --check` đều thoát mã sạch (zero) — `failed_evals` rỗng, không lệnh nào rớt. Bốn suite hồi quy còn lại (`tests/scripts`, `tests/hooks`, `tests/workflows`, `sync-plugin-packages.sh --check`) cũng exit 0, không gắn eval nào của contract này (regression-guard bình thường). Contract này ở risk_tier T3, nhưng bộ 19 eval của round này toàn bộ là executor `test`/`script` — không có eval executor `judgment` nào, nên không có mục UNCERTAIN và không có judgment item nào cần `human_override` để đạt PASS. Toàn bộ 19 eval xanh trên CẢ HEAD lẫn baseline (diffBase) — xem cảnh báo không-phân-biệt ở mục Analyst bên dưới, verdict tổng vẫn PASS vì mọi eval đã pass đúng nghĩa exit-code + nội dung expected, nhưng người ký nên đọc mục Analyst trước khi ký.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-1 | test | PASS |
| E4 | AC-2 | test | PASS |
| E5 | AC-2 | test | PASS |
| E6 | AC-3 | test | PASS |
| E7 | AC-3 | test | PASS |
| E8 | AC-7 | test | PASS |
| E9 | AC-4 | test | PASS |
| E10 | AC-4 | test | PASS |
| E11 | AC-5 | test | PASS |
| E12 | AC-5 | script | PASS |
| E13 | AC-6 | test | PASS |
| E14 | AC-8 | test | PASS |
| E15 | AC-8 | test | PASS |
| E16 | AC-1 | test | PASS |
| E17 | AC-7 | test | PASS |
| E18 | AC-7 | test | PASS |
| E19 | AC-4 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-workspace-reader-unification-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E2
  run_id: minted-workspace-reader-unification-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E3
  run_id: minted-workspace-reader-unification-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E4
  run_id: minted-workspace-reader-unification-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E5
  run_id: minted-workspace-reader-unification-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E6
  run_id: minted-workspace-reader-unification-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E7
  run_id: minted-workspace-reader-unification-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E8
  run_id: minted-workspace-reader-unification-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E9
  run_id: minted-workspace-reader-unification-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E10
  run_id: minted-workspace-reader-unification-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E11
  run_id: minted-workspace-reader-unification-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E12
  run_id: minted-workspace-reader-unification-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-08-07T16:05:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E13
  run_id: minted-workspace-reader-unification-E13-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E14
  run_id: minted-workspace-reader-unification-E14-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E15
  run_id: minted-workspace-reader-unification-E15-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E16
  run_id: minted-workspace-reader-unification-E16-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E17
  run_id: minted-workspace-reader-unification-E17-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E18
  run_id: minted-workspace-reader-unification-E18-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

- eval: E19
  run_id: minted-workspace-reader-unification-E19-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T16:00:00Z
  output: |
    PASS: P173 5 ca not: E3/E13/E14/E15/E19

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11, E13, E14, E15, E16, E17, E18, E19 (bash tests/plugins/run-tests.sh) và E12 (node scripts/product-map.mjs --root . --check) — toàn bộ 19 eval của feature này xanh trên CẢ HEAD lẫn baseline (diffBase), tức không eval nào tự phân biệt được so với code cũ theo phép đo A/B. Cần một trong hai: viết lại các case này để assert đúng hành vi MỚI mà workspace-reader-unification thêm vào (ví dụ mutant lật bảng luật/nhãn trong lib, thay vì chỉ chạy lại suite nguyên trạng), hoặc xác nhận rõ ràng đây là bộ regression-guard có chủ ý (kiểm tra hành vi đã có từ trước, không phải hành vi mới của AC nào). Không có mục nào rỗng danh sách này. Ghi chú round 2: cùng tình trạng như round 1 — không có thay đổi nào trong tập eval hay cách chạy khiến cảnh báo này biến mất.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E19 xanh ngay lần chạy đầu (18 ca qua tests/plugins/run-tests.sh + E12 qua product-map --check); 4 suite hồi quy (scripts, hooks, workflows, mirror-sync) đều exit 0. verified_commit round 1: 0d9845f6f5dada87dc9f90c97d78aeff51ae5128.
Round 2: tái verify trên commit mới (verified_commit 72f690d65189fb0a9b43fa3b164c8e86d2be5c81, code đổi sau lần ký round 1) — toàn bộ 19 eval feature (bash tests/plugins/run-tests.sh + product-map --check) và 4 suite hồi quy (scripts/hooks/workflows/mirror-sync) đều xanh lại y hệt round 1, không case nào đổi màu, không có failed_evals, không cần vòng sửa nào.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-08-07, do engine đổi ở vòng workspace-reader-unification (bảng luật đọc hồ sơ + bảng nhãn bản đồ + bộ kiểm P171–P173)
run_id: repin-20260807-workspace-reader-unification-lane1
sha: 28660e60903c76ee57463bcd228220a2b9bfe546 · suites: 6 lệnh exit 0

### Re-pin lần 2 — 2026-08-07, do hợp nhất hai nhánh (workspace-reader-unification + triage-key-normalize) — engine đổi ở cả hai phía
run_id: repin-20260807-merge-wru-triage-lane1
sha: 7d6f42716f2c9b52892c6c341d31da3042ca8e3d · suites: 6 lệnh exit 0

### Re-pin lần 3 — 2026-08-07, do hợp nhất hai nhánh ac-line (eval-coverage-lint W7 + evidence-page parseAC một nguồn) + NEG_RE học từ vựng đối-chứng + changelog feature-loop v1.25/v1.26 — engine lint/trang-ký và manifest gói đổi
run_id: repin-20260807-ac-line-lane1
sha: eb81fd3ad5db935c72c042202d1af2df783f19f9 · suites: 6 lệnh exit 0

### Re-pin lần 4 — 2026-08-07, do răng cross-layer của pre-merge chấm bằng lib/ac-line.js (awk làm đường lùi có tiếng) — engine cổng đổi
run_id: repin-20260807-premerge-ac-line-lane1
sha: ad4619558be1d09b0c827a80baba4740ec8926ac · suites: 6 lệnh exit 0
