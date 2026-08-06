---
schema_version: 2
feature_slug: start-scan-hardening
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cdc64cfb184559e9f60f3fd57b215726f2b2cb44
human_signoff: "Manh Phan 2026-08-03"
---

# Evidence Report: start-scan-hardening

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-5 | test | PASS |
| E8 | AC-5 | test | PASS |
| E9 | AC-5 | test | PASS |
| E10 | AC-2 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-start-scan-hardening-E1-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T11:00:00Z
  output: |
      PASS: P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-start-scan-hardening-E2-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T11:00:00Z
  output: |
      PASS: P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-start-scan-hardening-E3-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T11:00:00Z
  output: |
      PASS: P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-start-scan-hardening-E4-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T11:00:00Z
  output: |
      PASS: P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-start-scan-hardening-E5-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T11:00:00Z
  output: |
      PASS: P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-start-scan-hardening-E6-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T11:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E7
  run_id: minted-start-scan-hardening-E7-r5
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-08-03T11:00:00Z
  output: |
    Results: 596 passed, 0 failed

- eval: E8
  run_id: minted-start-scan-hardening-E8-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-03T11:00:00Z
  output: |
      PASS: T42

    Results: 51 passed, 0 failed

- eval: E9
  run_id: minted-start-scan-hardening-E9-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-03T11:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E10
  run_id: minted-start-scan-hardening-E10-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T11:00:00Z
  output: |
      PASS: P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)

    Results: all plugin tests passed

## Analyst

- bash tests/plugins/run-tests.sh: E1, E2, E10, E3, E4, E5
- bash scripts/sync-plugin-packages.sh --check: E6
- bash tests/scripts/run-tests.sh: E7
- bash tests/hooks/run-tests.sh: E8
- bash tests/workflows/run-tests.sh: E9

## Variance

none — every multi-run eval is uniform.

## Iterations

Round 1: 9 eval máy (E1-E9) PASS ngay lần chạy đầu, nhưng review adversarial phát hiện lỗi TRONG hợp đồng AC-2 — verdict rỗng (khoá `verdict:` có mặt nhưng giá trị trống) lọt qua guard "thiếu verdict". Trả về implementation.
Round 2: re-verify 9 eval máy PASS (bao gồm chân (c) mới của E2 sau khi gộp guard rỗng=vắng dùng chung hai nhánh, S4-r1 fix); review adversarial round này lại phát hiện một THOÁI LUI do chính bản vá S4-r1 gây ra — `VERDICT_OK` bỏ sót BLOCKED khiến `implemented` + `verdict: BLOCKED` bị gọi "hồ sơ hỏng" thay vì giữ nguyên trạng đang-dở. Trả về implementation (S4-r2 fix: thêm BLOCKED vào `VERDICT_OK`, dựng P104 round-trip rút từ vựng từ khuôn writer).
Round 3: thêm E10 (P104), chạy lại toàn bộ 10 eval máy — tất cả PASS. Review round này tìm thêm các finding ngoài hợp đồng (nhánh `verified` vẫn bỏ sót BLOCKED cùng hình dạng vừa vá ở nhánh implemented, P102 chạy dưới root có thể che một loạt chân test mà vẫn báo PASS, contract AC-2 chưa cập nhật từ vựng theo BLOCKED) — đưa ra Gate 2 cho người quyết; không quay lại implementation.
Round 4: re-verify toàn bộ 10 eval máy — vẫn PASS, không eval nào bắt được lỗi mới (mọi suite baseline=green, không phân biệt). Review adversarial round này phát hiện 2 finding TRONG hợp đồng, cùng lớp AC-1 vừa được vá cho `opportunity.md` ở round 3: guard đọc + guard verdict của `evidence-report.md` (scripts/start-scan.mjs:116-123) vẫn chạy TRƯỚC khi rẽ nhánh theo status, nên lỗi đọc/verdict-rỗng của một file không thuộc luồng kiểm của status `draft`/`approved`/`signed-off` vẫn đẩy nhầm slug ra khỏi ô đúng — đúng kịch bản AC-1 cấm, và đúng bản REGRESSION do chính diff round 3 gây ra so với base (base nuốt lỗi đọc, giữ slug ở gates). Verdict REJECT, trả về implementation.
Round 5 (vòng này): re-verify toàn bộ 10 eval máy sau khi dời guard đọc + guard verdict của `evidence-report.md` vào trong hai nhánh `verified`/`implemented` (S4 fix cho regression round 4, cùng cách round 3 đã xử lý cho `opportunity.md`) — tất cả PASS, mọi suite baseline=green (không eval nào phân biệt round này, harness ổn định chứ không phải feature mới). Review adversarial không tìm thêm finding TRONG hợp đồng; phát hiện 1 finding NGOÀI hợp đồng (trục `human_signoff` chưa được ma trận P105 biến thiên — verdict ngoài từ vựng đi kèm chữ ký người ở nhánh `verified` có thể lọt qua guard là `done` thay vì `broken`), không phải regression của diff round 5 (thứ tự nhánh đã có từ code cũ) — đưa ra Gate 2 làm known-limit. Verdict PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract


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
