---
schema_version: 2
feature_slug: release-2-14-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ddb305f3d7a887ea52b448ca7d49283b241eba2b
human_signoff:
---

# Evidence Report: release-2-14-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3a | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | judgment | PASS |
| E5 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-14-0-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_14
  verified_at: 2026-09-15T10:15:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban 094ab14c)

- eval: E1b
  run_id: minted-release-2-14-0-E1b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_tang_2_14
  verified_at: 2026-09-15T10:15:00Z
  output: |
    [neo] so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 · so trong cay lam viec = 2.14.0
    PASS: so trong cay (2.14.0) TANG theo semver so voi so tai commit dua ho so moc vao kho (4c4d58f9) = 2.13.0 — neo suy TU KHO, khong ghim sha

- eval: E2
  run_id: minted-release-2-14-0-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_14
  verified_at: 2026-09-15T10:15:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban 0bb56634)

- eval: E3a
  run_id: minted-release-2-14-0-E3a-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-15T10:15:00Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 873 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-14-0-E3b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-15T10:15:00Z
  output: |
    PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-14-0-E3c-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-15T10:15:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-14-0-E3d-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-15T10:15:00Z
  output: |
    Results: all workflow tests passed
    EXIT_CODE=0

- eval: E3e
  run_id: minted-release-2-14-0-E3e-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-09-15T10:15:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS (r4)
    - operational-feasibility: PASS (r4)
    - spec-alignment: PASS (r4)
  rationale: panel giữ nguyên từ round 4 — inputs không đổi (hash khớp), không chấm lại; rationale chi tiết xem round 4.

- eval: E5
  run_id: minted-release-2-14-0-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ton_dong_ghim_lai_2_14
  verified_at: 2026-09-15T10:15:00Z
  output: |
    [khai] so_stale=45 · so_stale_toan_kho=71 · moc_so=7d12ffad · do tren HEAD=ddb305f3 (cay 0 muc chua commit)
           [luoi] soi 120 dong per-slug · 45 ho so DUY NHAT hoa cu tai moc 7d12ffad
    PASS: so ho so hoa cu ghi trong ho so (45 ho so duy nhat tai moc 7d12ffad, do tren HEAD ddb305f3) BANG so luoi dang noi hom nay, va cac dong VAN HOP DONG co chua «ghim lai» hoac «hoa cu» (da go dinh dang markdown) khong mang con so ho so nao ngoai cac nen da khai o marker

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round truoc — baseline khong do lai round nay.

none — baseline không được đo lại ở round này (mọi ô baseline ghi n-a theo P2); trạng thái phân biệt của từng eval xem round có đo baseline gần nhất.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: S4-r2 — ĐỔI KHUÔN sau DỪNG-VÁ (lời khai đổi đúng theo phép đo hiện có, không xoá răng).
Round 3/3b: S4-r3 — enum sổ known-limits + dải token sai lan tới CHANGELOG; r3b — owner cho chạy tiếp sau khi hết trần T3, gỡ vòng chết P179, ghi đủ 11 giới hạn vào sổ theo-dõi.
Round 5: chạy lại trọn bộ máy đo (E1, E1b, E2, E3a–E3e, E5) + hội đồng E4 (carried từ round 4, inputs không đổi) — tất cả xanh, verdict PASS.
