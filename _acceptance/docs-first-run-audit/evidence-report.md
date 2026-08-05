---
schema_version: 2
feature_slug: docs-first-run-audit
verdict: PASS
failed_evals: []
reason:
verified_by: main-session direct run (owner-directed, per-eval logs archived in session scratchpad)
enforcement_mode: strict
bypass_used: false
verified_commit: 3078c08e2cc6ee35b062e80205cbae676e946b49
human_signoff: Manh Phan 2026-08-04
---

# Evidence Report: docs-first-run-audit

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-5 | test | PASS |
| E7 | AC-5 | test | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-docs-first-run-audit-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T12:13:26Z
  output: |
      P131 khuon CI: moi loi goi pre-merge-check.sh trong doc mang --base + fetch-depth di kem
      P131 OK
        PASS: P131 khuon CI: moi loi goi pre-merge-check.sh trong doc mang --base + fetch-depth di kem
      Results: all plugin tests passed
- eval: E2
  run_id: minted-docs-first-run-audit-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T12:13:26Z
  output: |
      P101 nap human-facing-language truoc render (2 harness) + GUIDE/README/QUICKSTART co muc /start (E11,E15)
        PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README/QUICKSTART co muc /start (E11,E15)
      Results: all plugin tests passed
- eval: E3
  run_id: minted-docs-first-run-audit-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T12:13:26Z
  output: |
      P132 pilot block README symlink du moi lenh commands/*.md
      P132 OK (7 lenh deu co mat)
        PASS: P132 pilot block README symlink du moi lenh commands/*.md
      Results: all plugin tests passed
- eval: E4
  run_id: minted-docs-first-run-audit-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-04T12:13:26Z
  output: |
      P133 chu first-run: recheck-advice khop init + jsdom o 3 diem init + attribution /start=v1.30
      P133 OK (3 pin chu + dot bien deu do dung cho)
        PASS: P133 chu first-run: recheck-advice khop init + jsdom o 3 diem init + attribution /start=v1.30
      Results: all plugin tests passed
- eval: E5
  run_id: minted-docs-first-run-audit-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-04T12:13:26Z
  output: |
      Results: 596 passed, 0 failed
- eval: E6
  run_id: minted-docs-first-run-audit-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-04T12:13:26Z
  output: |
      Results: 51 passed, 0 failed
- eval: E7
  run_id: minted-docs-first-run-audit-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T12:13:26Z
  output: |
      Results: all workflow tests passed
- eval: E8
  run_id: minted-docs-first-run-audit-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T12:13:26Z
  output: |
      plugins/ mirror in sync.
- eval: E9
  run_id: minted-docs-first-run-audit-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-08-04T12:13:26Z
  output: |
      PRODUCT-MAP.md khớp hồ sơ xưởng.

## Ghi chú vòng

- Round 1 duy nhất: 9/9 eval PASS ngay lần chạy đầu — thước (P131/P132/P101 mở
  rộng/P133) đã ĐỎ trên trạng thái cũ trước khi sửa vật, nên vòng verify này
  chỉ xác nhận trạng thái sau sửa.
- 4 eval E1-E4 dùng chung một lần chạy suite plugins (dedupe theo cmd, cùng
  nghi thức S4); E5-E9 mỗi eval một lệnh riêng.
