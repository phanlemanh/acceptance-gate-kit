---
schema_version: 2
feature_slug: start-command
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9962888ed8058d1cec02fe737ff2b22ac80d84bb
human_signoff: "Manh Phan 2026-08-03"
---

# Evidence Report: start-command

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | judgment | PASS |
| E8 | AC-8 | judgment | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | script | PASS |
| E13 | AC-13 | test | PASS |
| E14 | AC-14 | test | PASS |
| E15 | AC-15 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-start-command-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-start-command-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-start-command-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-start-command-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-start-command-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-start-command-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E7
  judged_by: judge-subagent panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Cả ba lens đều PASS ở vòng này. Cả hai harness (commands/start.md bước 4, codex SKILL.md bước 4) kết thúc ở đúng MỘT câu hỏi chọn chữ cái/số dòng, không có câu hỏi thứ hai. Mỗi lựa chọn bàn giao đúng đích: cổng → acceptance-card <slug>, vòng dở → feature-loop <slug> (kèm cảnh báo worktree khi git.dirty), việc mới → đúng ba lối (a) buổi khai thác theo nghi thức advisor, (b) feature-loop, (c) xác nhận T1 rồi KẾT THÚC không tự sửa — bước 5 cả hai file đều khẳng định lệnh không tự làm nội dung, bàn giao xong là hết vai. Khuôn thẻ dùng nhãn tiếng sản phẩm, mã máy (S1-S4, dang/pham-vi/bang-chung) đều kèm nghĩa lần-đầu-xuất-hiện đúng N3, không thấy tiếng máy lọt ra mặt thẻ. Đầy đủ vote từng lens xem section Judge Panels bên dưới.
  human_override:

- eval: E8
  judged_by: judge-subagent panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  rationale: Cả ba lens đều PASS. Cả commands/start.md (bước 4, dòng 56-58) và codex SKILL.md (bước 4, dòng 63-66) đều quy định rõ: khi chọn resume một vòng dở, nếu git.dirty là true hoặc phiên đang đứng cây chung với vòng khác, thân lệnh phải nhắc mở worktree/phiên riêng TRƯỚC, chưa đưa lệnh resume — không nhánh nào bàn giao thẳng lệnh resume vào cây bẩn. Đầy đủ vote từng lens xem section Judge Panels bên dưới.
  human_override:

- eval: E9
  run_id: minted-start-command-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-start-command-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-start-command-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-start-command-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-03T12:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E13
  run_id: minted-start-command-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E14
  run_id: minted-start-command-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

- eval: E15
  run_id: minted-start-command-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-03T12:00:00Z
  output: |
      PASS: P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)

    Results: all plugin tests passed

## Judge Panels

### E7 — proposal: PASS
- domain-correctness: PASS — Cả hai harness (commands/start.md bước 4, codex SKILL.md bước 4) đều buộc kết thúc bằng đúng MỘT câu hỏi chọn chữ cái/số dòng, không câu thứ hai. Mỗi lựa chọn bàn giao đúng đích: cổng → acceptance-card <slug>, vòng dở → feature-loop <slug> (có cảnh báo worktree khi git.dirty), việc mới → đúng ba lối (a) advisor/HIỂU (b) feature-loop (c) xác nhận T1 rồi KẾT THÚC không tự sửa — bước 5 cả hai file đều nói rõ lệnh không tự làm nội dung. Khuôn thẻ dùng nhãn tiếng sản phẩm, mã máy đều kèm nghĩa lần-đầu-xuất-hiện đúng N3, không thấy tiếng máy lọt ra mặt thẻ.
- operational-feasibility: PASS — (1) Cả hai harness đều buộc "MỘT câu hỏi chọn bằng chữ cái/số dòng — không hỏi câu thứ hai". (2) Bàn giao đúng đích: cổng → /acceptance-card <slug>, vòng dở → /feature-loop <slug> có cảnh báo worktree khi git.dirty, việc mới đi đúng 3 lối. (3) Không thấy chỗ nào mời model tự viết nội dung: nhóm "Đang dở" cấm mở file sản phẩm, nhóm việc vặt T1 buộc kết thúc /start thay vì tự sửa. (4) Khuôn thẻ tuân N1-N6 quan sát được, mã kèm nghĩa lần đầu xuất hiện, không thấy tiếng máy lọt vào mẫu trình bày.
- spec-alignment: PASS — Cả hai thân lệnh đều kết ở đúng MỘT câu hỏi chọn chữ cái/số dòng, cấm câu hỏi thứ hai; ba lựa chọn bàn giao đúng đích, khớp bảng phân ô và JSON-keys của spec. Không có chỗ nào cho model tự làm nội dung: bước 5 đóng vai rõ, kể cả lối (c) việc vặt T1 cũng bị buộc KẾT THÚC không tự sửa. Khuôn thẻ tuân N1-N3 và không thấy tiếng máy lọt vào ví dụ trình bày.
human_override:

### E8 — proposal: PASS
- domain-correctness: PASS — Cả hai bản (commands/start.md bước 4, dòng 56-58; codex SKILL.md bước 4, dòng 63-66) đều quy định rõ: khi chọn resume một vòng dở, nếu git.dirty là true HOẶC phiên đang đứng cây chung với vòng khác, thân lệnh phải nhắc mở worktree/phiên riêng TRƯỚC, "chưa đưa lệnh resume" — không có nhánh nào khác bàn giao thẳng lệnh resume vào cây bẩn.
- operational-feasibility: PASS — Cả hai bản đều ghi rõ: khi chọn resume một vòng dở, nếu git.dirty là true HOẶC phiên đang đứng cây chung với vòng khác, lệnh phải nhắc mở worktree/phiên riêng TRƯỚC, "chưa đưa lệnh resume" (gọi thẳng là "cạm bẫy một-worktree-một-phiên"). Không có nhánh nào khác cho phép bàn giao thẳng /feature-loop <slug> khi cây bẩn.
- spec-alignment: PASS — Cả hai file cùng có nhánh tường minh ở bước 4: khi chọn resume mà git.dirty là true hoặc phiên đứng cây chung, thân lệnh buộc nhắc mở worktree/phiên riêng TRƯỚC (commands/start.md dòng 56-58; codex SKILL.md dòng 63-65, gọi đúng tên "cạm bẫy one-worktree-one-session"). Không có đường tắt nào bàn giao thẳng /feature-loop <slug> vào cây bẩn.
human_override:

## Analyst

carried tu round 1 — baseline khong do lai round nay.

- bash tests/plugins/run-tests.sh: E1, E2, E3, E4, E5, E6, E9, E10, E11, E13, E14, E15
- bash scripts/sync-plugin-packages.sh --check: E12

## Variance

none — every multi-run eval is uniform.

## Iterations

Round 1: E7 (AC-7) FAIL ở cả 3 lens judge panel — bullet (c) "việc vặt khớp miễn trừ T1 → sửa thẳng, không mở vòng" mâu thuẫn với bất biến "Lệnh KHÔNG tự làm nội dung" mà chính lệnh tuyên bố, và lối (a) "buổi khai thác vòng HIỂU" thiếu đích bàn giao tường minh (lệch khỏi docs/specs/2026-08-03-start-command-design.md). Trả về implementation.
Round 2: E7 và E8 chấm lại — cả 3 lens PASS trên cả hai eval, không còn dissent. Toàn bộ 15 eval PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin — 2026-08-03 (sau start-scan-hardening), tại 6f3449c

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 5 của feature
  `start-scan-hardening`, Workflow `wf_4cdd5992-610`, doer≠grader): 5 suite tại
  `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P105, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


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

### Re-pin lần 3 — 2026-08-05, do feature delta-verify-repin (nghi thức 1-lane: 1 lượt machine-lane cho cả sự kiện)
run_id: repin-20260805-delta-verify-repin-lane1
sha: c1f781d9ccb880091988a9612f2dd0a5b72d3b82 · suites: 6 lệnh exit 0

### Re-pin lần 4 — 2026-08-05, do feature matrix-measure-law + hotfix luật repin (nghi thức 1-lane)
run_id: repin-20260805-matrix-measure-law-lane2
sha: 5ec937c0746dfeaa3c554f5c44b224954ae989ae · suites: 6 lệnh exit 0

### Re-pin lần 5 — 2026-08-05, do feature judge-required-evidence (nghi thức 1-lane)
run_id: repin-20260805-judge-required-evidence-lane1
sha: e6dad45a6169d17c59ac85a95c6d58924c14ffff · suites: 6 lệnh exit 0

### Re-pin lần 4 — 2026-08-05, do engine đổi ở vòng gold-output-measure (sổ vàng + tài liệu luật + bộ kiểm)
run_id: repin-20260805-gold-output-measure-lane1
sha: 9962888ed8058d1cec02fe737ff2b22ac80d84bb · suites: 6 lệnh exit 0
