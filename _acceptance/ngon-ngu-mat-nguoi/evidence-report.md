---
schema_version: 2
feature_slug: ngon-ngu-mat-nguoi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 01bae727d607a4c346aa8e5dae2319838bc6881c
# bypass_ack:
human_signoff:
---

# Evidence Report: ngon-ngu-mat-nguoi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-5 | test | PASS |
| E7 | AC-6 | test | PASS |
| E8 | AC-7 | test | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-9 | test | PASS |
| E11 | AC-10 | test | PASS |
| E12 | AC-11 | test | PASS |
| E13 | AC-12 | test | PASS |
| E14 | AC-13 | test | PASS |
| E15 | AC-14 | script | PASS |
| E16 | AC-15 | judgment | FAIL |

Toàn bộ 15 eval máy (E1–E15) PASS. Verdict tổng vẫn là REJECT vì eval phán đoán E16 (AC-15) có panel 3 lens đều bỏ phiếu không đạt trên văn bản trình-cho-người của chín vật đang soi — số file lệch khác nhau theo lens (domain-correctness 5/9, operational-feasibility 2/9, spec-alignment 5/9), lỗi lặp lại rõ nhất ở commands/acceptance-status.md + codex acceptance-status/SKILL.md ("chạy Phase 3 của skill acceptance" làm nội dung duy nhất của dòng việc-cần-làm) — xem chi tiết ở khối E16 trong Evidence và ở review-findings.md.

## Evidence

- eval: E1
  run_id: minted-ngon-ngu-mat-nguoi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-ngon-ngu-mat-nguoi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-ngon-ngu-mat-nguoi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-ngon-ngu-mat-nguoi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-ngon-ngu-mat-nguoi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-ngon-ngu-mat-nguoi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-ngon-ngu-mat-nguoi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-ngon-ngu-mat-nguoi-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-ngon-ngu-mat-nguoi-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-ngon-ngu-mat-nguoi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-ngon-ngu-mat-nguoi-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-ngon-ngu-mat-nguoi-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E13
  run_id: minted-ngon-ngu-mat-nguoi-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E14
  run_id: minted-ngon-ngu-mat-nguoi-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-01T18:10:00Z
  output: |
    PASS: P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)

    Results: all plugin tests passed

- eval: E15
  run_id: minted-ngon-ngu-mat-nguoi-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-01T18:12:00Z
  output: |
    plugins/ mirror in sync.

# E16 la eval judgment (khong co run_id/exit_code — khong nam trong run-log.jsonl,
# vi run-log chi ghi eval may/ui). Panel round 2 la panel MOI (khong carried tu
# round 1), 3 lens deu bo phieu FAIL; human_override de trong cho Gate 2.
- eval: E16
  judged_by: judge panel (fresh context) — lenses: domain-correctness, operational-feasibility, spec-alignment
  panel_proposal: FAIL
  votes:
    - domain-correctness: FAIL — 5/9 file có câu trình-cho-người không qua phép thử Xoá-tên-máy. Rõ nhất: commands/acceptance-status.md và codex acceptance-status/SKILL.md dùng "chạy Phase 3 của skill acceptance" làm nội dung duy nhất của dòng việc-cần-làm; feature-loop/SKILL.md tự nhận "ngôn ngữ sản phẩm" nhưng 3 nhãn lựa chọn Gate 2 lại nhúng nguyên "contract/AC/eval/Gate 1/S4 round/bullet/## Notes", và cả feature-loop/SKILL.md lẫn feature-loop-codex/SKILL.md nhúng khoá cấu hình `feature_loop.ui_standards_skill` làm nội dung duy nhất của ghi chú Gate 1; commands/acceptance-report.md dùng `time_human_minutes` làm nội dung duy nhất một dòng action-item — lệch khuôn so với chính khối "Vệ sinh cổng" ngay phía trên nó. 4 file còn lại (human-facing-language.md, hai bản acceptance-card SKILL, codex acceptance-report/SKILL.md) đạt.
    - operational-feasibility: FAIL — 2/9 file thất bại phép thử Xoá-tên-máy: commands/acceptance-status.md và codex/acceptance-gate/skills/acceptance-status/SKILL.md dùng câu hành động cho trạng thái "implemented" là "Chờ chấm bằng chứng — chạy Phase 3 của skill acceptance" — xoá "Phase 3 của skill acceptance" (tên pha + tên skill nội bộ) thì câu cụt "Chờ chấm bằng chứng — chạy", mất hết nghĩa hành động cho người không đọc mã nguồn (vi phạm N1/N2, chủ ngữ/hành động phụ thuộc tên máy thay vì đứng độc lập). 7 file còn lại (human-facing-language.md, hai bản acceptance-card SKILL, hai bản acceptance-report SKILL, feature-loop/SKILL.md, feature-loop-codex/SKILL.md) qua được phép thử ở mọi câu/khuôn trình-cho-người đã kiểm (bảng SAU N1-N6, ba nhãn lựa chọn Ngoài-hợp-đồng, khuôn PLAN-SUMMARY/DECISION-DIAGRAM, các dòng vệ sinh cổng có mã kèm giải nghĩa trong ngoặc đúng N3) — chỉ có ghi nhận phụ chưa đủ căn cứ kết luận vi phạm (nhãn tiếng Anh "Known limits", mã "CE" trong tag "[CE chưa kiểm chứng]" chưa rõ có lộ nguyên văn lên thẻ hay không).
    - spec-alignment: FAIL — 5/9 file có câu trong vùng trình-cho-người không qua phép thử Xoá-tên-máy: acceptance-report.md (commands) dùng ví dụ "thiếu `time_human_minutes`" không gán nghĩa; acceptance-status.md (cả 2 harness) chỉ dẫn "chạy Phase 3 của skill acceptance" làm hành động cho người không đọc code; feature-loop SKILL.md (cả 2 harness) định nghĩa từ vựng hiển thị D0/D1/D2 hoàn toàn qua tên công tắc máy CT1/CT2, xoá đi thì rỗng nghĩa. 4 file còn lại (human-facing-language.md, acceptance-card.md cả 2 harness, acceptance-report.md codex) đạt.
  human_override:

## Analyst

carried tu round 1 — baseline khong do lai round nay

- E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11, E12, E13, E14 (`bash tests/plugins/run-tests.sh`) — non-discriminating tại round 1 (PASS trên cả HEAD lẫn baseline diffBase); evals.yaml không đổi từ lần baseline cuối nên round này không đo lại. Cần rà lại từng case để assert đúng hành vi mới hoặc xác nhận có chủ ý là regression-guard.
- E15 (`bash scripts/sync-plugin-packages.sh --check`) — non-discriminating tại round 1 (PASS trên cả HEAD lẫn baseline); round này không đo lại.

## Variance

none — không eval nào trong round 2 có `runs` > 1 (không có eval ngẫu nhiên/stochastic).

## Iterations

Round 1: E16 (AC-15, judgment) FAIL — panel 3 lens đồng thuận: 6/9 file trình-cho-người (đặc biệt khối lặp `ui_standards_skill` ở acceptance-report ×2 / acceptance-status ×2 / feature-loop ×2, cộng commands/acceptance-report.md và commands/acceptance-status.md) đặt tên trường/khoá máy làm chủ ngữ/tân ngữ chính, không qua phép thử Xoá-tên-máy; 15 eval máy E1–E15 đều PASS. Trả về implementation.
Round 2: E16 (AC-15, judgment) FAIL — panel 3 lens (panel mới, không carried) vẫn đồng thuận không đạt nhưng số file lệch nay khác theo lens (domain-correctness 5/9, operational-feasibility 2/9, spec-alignment 5/9); lỗi rõ nhất lặp lại ở commands/acceptance-status.md + codex acceptance-status/SKILL.md ("chạy Phase 3 của skill acceptance" làm nội dung duy nhất của dòng việc-cần-làm) cộng khoá cấu hình `feature_loop.ui_standards_skill` lộ nguyên trong cả hai bản feature-loop SKILL.md; 15 eval máy E1–E15 đều PASS. Trả về implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
