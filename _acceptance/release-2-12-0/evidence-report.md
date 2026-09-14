---
schema_version: 2
feature_slug: release-2-12-0
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b2af84cd1d6bd5454111567b010778e8a8a1c5b4
human_signoff:
---

# Evidence Report: release-2-12-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3a | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | test | PASS |
| E4 | AC-4 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-12-0-E1-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_12
  verified_at: 2026-09-14T09:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban e34fd689)

- eval: E2
  run_id: minted-release-2-12-0-E2-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_12
  verified_at: 2026-09-14T09:05:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban 47ef1d63)

- eval: E3a
  run_id: minted-release-2-12-0-E3a-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-14T09:10:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 868 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-12-0-E3b-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-14T09:15:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-12-0-E3c-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-14T09:20:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-12-0-E3d-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-14T09:25:00Z
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-12-0-E3e-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-14T09:30:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  judged_by: judge-panel (3 lens: domain-correctness, operational-feasibility, spec-alignment)
  verified_at: 2026-09-14T09:35:00Z
  verdict: PASS
  rationale: panel giu nguyen tu round 7 — inputs khong doi (hash khop), khong cham lai; rationale xem round 7.
  votes:
    - domain-correctness: PASS (r7)
    - operational-feasibility: PASS (r7)
    - spec-alignment: PASS (r7)

## Known limits

## Ngoài hợp đồng

## Analyst

E3a, E3b, E3c, E3d, E3e — suite hồi quy xanh trên cả HEAD lẫn baseline (regression-guard có chủ ý, không phải thước phân biệt riêng cho lần cắt số 2.12.0 này; xem AC-3).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 6: E1/E2 (rang-p200.sh, rang-moc.sh) ghim dấu bản răng CŨ so với HEAD sau khi hai răng bị sửa — trả về S3 để đồng bộ dấu bản răng với vật đang đo.
Round 7: verify tại 00af886e; review phát hiện commit sau đó (ffa5c3a4) sửa tiếp rang-p200.sh, evals.yaml (E1) và feature-loop/.claude-plugin/plugin.json → stale evidence, pre-merge-check chặn merge.
Round 8: re-verify trên HEAD ffa5c3a4 (đã gồm mọi sửa hậu-round-7) — toàn bộ evals (E1, E2, E3a–E3e, E4) PASS, verified_commit khớp HEAD, đóng stale.

### Re-pin lần 1 — 2026-09-14, do gộp origin/main (4 commit, dời docs) sau lượt chấm 8 PASS tại ffa5c3a4
run_id: repin-20260914T023445Z-28270
sha: b2af84cd1d6bd5454111567b010778e8a8a1c5b4 · suites: 5 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng
