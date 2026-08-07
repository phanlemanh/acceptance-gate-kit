---
schema_version: 2
feature_slug: docs-first-run-audit
verdict: PASS
failed_evals: []
reason:
verified_by: main-session direct run (owner-directed, per-eval logs archived in session scratchpad)
enforcement_mode: strict
bypass_used: false
verified_commit: 3f96b45349ea1981f6b4cb15c178d3f79bf15c6d
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


### Re-pin — 2026-08-05 (sau gate-card-ngon-ngu-may 1.32.0), tại 866c89e

`verified_commit` lên `866c89e`. Nguyên nhân stale: PR #29 sửa LỚP TRÌNH BÀY
thẻ cổng — scripts/gate-card.js (nối bullet hard-wrap, tầng card-plain cho
Coverage/gap-probe, lột markdown ở fallback) + writer doc 2 harness + test
P146–P148 + bump manifest 1.32.0 + vẽ lại PRODUCT-MAP.md + fix grep portable.
Không luật cưỡng chế nào đổi: hooks/, lib/, pre-merge-check.sh,
recheck-evidence.js KHÔNG nằm trong diff.

- **ĐÃ chạy lại:** toàn bộ machine lane tại `866c89e` — 596 case scripts ·
  51 hooks · plugins pass (kèm P146–P148 mới) · workflows pass · mirror in
  sync · product-map khớp; cả 6 suite_keys exit 0. Minh bạch: MỘT lượt chạy
  chung trong phiên fix CI của PR #29 cho cả đợt re-pin 19 slug, không phải
  agent tươi per-slug (khuôn 1-lượt có máy đối chiếu là việc của
  delta-verify-repin, đã duyệt Cổng 1, chưa ship).
- **KHÔNG chạy lại:** eval judgment, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực.

### Re-pin lần 2 — 2026-08-05, do feature delta-verify-repin (nghi thức 1-lane: 1 lượt machine-lane cho cả sự kiện)
run_id: repin-20260805-delta-verify-repin-lane1
sha: c1f781d9ccb880091988a9612f2dd0a5b72d3b82 · suites: 6 lệnh exit 0

### Re-pin lần 3 — 2026-08-05, do feature matrix-measure-law + hotfix luật repin (nghi thức 1-lane)
run_id: repin-20260805-matrix-measure-law-lane2
sha: 5ec937c0746dfeaa3c554f5c44b224954ae989ae · suites: 6 lệnh exit 0

### Re-pin lần 4 — 2026-08-05, do feature judge-required-evidence (nghi thức 1-lane)
run_id: repin-20260805-judge-required-evidence-lane1
sha: e6dad45a6169d17c59ac85a95c6d58924c14ffff · suites: 6 lệnh exit 0

### Re-pin lần 4 — 2026-08-05, do engine đổi ở vòng gold-output-measure (sổ vàng + tài liệu luật + bộ kiểm)
run_id: repin-20260805-gold-output-measure-lane1
sha: 9962888ed8058d1cec02fe737ff2b22ac80d84bb · suites: 6 lệnh exit 0

### Re-pin lần 5 — 2026-08-06, do engine đổi ở vòng card-text-fidelity (hàm lột định dạng của thẻ + bộ kiểm)
run_id: repin-20260806-card-text-fidelity-lane1
sha: 2b01e982116f80b50828d30cb2d593025c918dbe · suites: 6 lệnh exit 0

### Re-pin lần 6 — 2026-08-06, do engine đổi ở vòng codex-script-packaging (công cụ mang-kết-quả + hàm dựng gói + chỉ dẫn 2 bản)
run_id: repin-20260806-codex-script-packaging-lane1
sha: 451840967a9ef3726e953246da03225504c71675 · suites: 6 lệnh exit 0

### Re-pin lần 7 — 2026-08-06, do engine đổi ở vòng dọn nợ đo-lường (5 phép đo có răng + gỡ hai chốt meta)
run_id: repin-20260806-measure-teeth-cleanup-lane1
sha: cdc64cfb184559e9f60f3fd57b215726f2b2cb44 · suites: 6 lệnh exit 0
### Re-pin lần 7 — 2026-08-06, do engine đổi ở vòng discovery-brainstorm-socket (ổ cắm khám phá + bộ quét /start + bộ kiểm), ghim lại sau rebase lên main
run_id: repin-20260806-discovery-brainstorm-socket-lane2
sha: 4383b814def31b4627eb290d3e0ea688ca80887f · suites: 5 lệnh exit 0

### Re-pin lần 9 — 2026-08-07, do hợp nhất hai nhánh (dọn nợ đo-lường + ổ cắm brainstorm) — engine đổi ở cả hai phía
run_id: repin-20260807-merge-teeth-socket-lane1
sha: 5d20c246f526b312962f2e4f167e48975ac25986 · suites: 6 lệnh exit 0

### Re-pin lần 10 — 2026-08-07, do engine đổi ở vòng stop-patching-law (mệnh đề dừng-vá vào 2 bản chỉ dẫn + bộ kiểm P168–P170)
run_id: repin-20260807-stop-patching-law-lane1
sha: 6bd11f7554effe75a9b1e8c8686a43634e45ec3e · suites: 6 lệnh exit 0

### Re-pin lần 11 — 2026-08-07, do engine verify đổi ở vòng triage-key-normalize (chuẩn hoá path khoá ghép scope-triage + triage hỏng ra PENDING-JUDGMENT)
run_id: repin-20260807-triage-key-normalize-lane1
sha: 3f96b45349ea1981f6b4cb15c178d3f79bf15c6d · suites: 6 lệnh exit 0
