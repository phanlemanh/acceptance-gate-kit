---
schema_version: 2
feature_slug: judgment-question-guard
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 82cb46645b454ae2aaff5273b53ed8244d5e5dd5
human_signoff:
---

# Evidence Report: judgment-question-guard

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | judgment | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-12 | test | PASS |
| E14 | AC-13 | test | PASS |
| E15 | AC-14 | test | PASS |
| E16 | AC-15 | test | PASS |
| E13 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-judgment-question-guard-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E2
  run_id: minted-judgment-question-guard-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E3
  run_id: minted-judgment-question-guard-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E4
  run_id: minted-judgment-question-guard-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E5
  run_id: minted-judgment-question-guard-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-judgment-question-guard-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E7
  run_id: minted-judgment-question-guard-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E8
  run_id: minted-judgment-question-guard-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E9
  run_id: minted-judgment-question-guard-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E10
  judged_by: judge-panel (fresh context, 3 lens — không carried, chấm lại round này)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Prompt tự trả lời đúng câu hỏi: dòng 4 nói rõ "CHI duoc doc dung cac file liet ke o dong Input" và danh sách là "DAY DU", đồng thời tự nêu luật neo vào QUAN HE (co-trong-danh-sach) chứ không phải loại file — đúng khớp với lo ngại về contract.md/design doc là input hợp lệ ở eval khác. Dòng 7 cấm rõ ràng hành vi tự cứu: "danh sach tren KHONG du can cu de phan → do la ly do tra UNCERTAIN, TUYET DOI KHONG phai ly do di tim file khac de tu cuu", và giải thích hệ quả (phá tính độc lập hội đồng) nên không để ngỏ đường tự cứu.
    - operational-feasibility: PASS — Dòng 4 nói rõ luật phạm vi neo vào QUAN HỆ (có-trong-danh-sách-Input hay không), không neo vào loại file, và tự nêu ví dụ "cùng một tên file có thể là input hợp lệ của eval này và ngoài phạm vi của eval khác" — nên không mâu thuẫn với các eval khác liệt kê contract.md/design doc làm input hợp lệ. Dòng 7 tách bạch dứt khoát: thiếu căn cứ trong danh sách đã cho ⇒ trả UNCERTAIN, và nói thẳng "TUYỆT ĐỐI KHÔNG phải lý do đi tìm file khác để tự cứu", kèm lý do (tự chọn thêm artifact là phá tính độc lập của hội dồng) — không để ngỏ đường tự cứu. Câu chữ đủ tường minh để một hội đồng viên đọc xong hiểu đúng giới hạn phạm vi và hành vi đúng khi thiếu bằng chứng.
    - spec-alignment: PASS — Dong 4 va dong 7 cua prompt noi ro: hoi dong CHI duoc doc file trong danh sach "Input:" cong persona, danh sach la DAY DU, va khi thieu can cu thi PHAI tra UNCERTAIN — "TUYET DOI KHONG phai ly do di tim file khac de tu cuu" vi tu chon them artifact se "pha hong tinh doc lap cua hoi dong". Dong 4 con noi ro luat neo vao QUAN HE (co-trong-danh-sach) chu khong neo vao loai file ("cung mot ten file co the la input hop le cua eval nay va ngoai pham vi cua eval khac"), nen khong mau thuan voi cac eval khac khai design doc/contract.md la input hop le cua chung. Van ban khong con duong ngo nao cho judge tu di tim contract.md de tu che tieu chi.
  rationale: Hội đồng đồng thuận PASS 3/3 lens, không có dissent; cả ba lens cùng chốt luật neo vào quan hệ có-trong-danh-sách-Input (không neo loại file) và cấm rõ hành vi tự cứu khi thiếu căn cứ.
  human_override:

- eval: E11
  run_id: minted-judgment-question-guard-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E12
  run_id: minted-judgment-question-guard-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E14
  run_id: minted-judgment-question-guard-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E15
  run_id: minted-judgment-question-guard-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E16
  run_id: minted-judgment-question-guard-E16-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T00:00:00Z
  output: |
    Results: 10 passed, 0 failed

    Results: all workflow tests passed

- eval: E13
  run_id: minted-judgment-question-guard-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T00:00:00Z
  output: |
    plugins/ mirror in sync.

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — round này không đo lại baseline (P2, evals.yaml không đổi từ lần baseline cuối ở round 1) nên không xác định được eval nào không-phân-biệt mới; xem round 1 cho baseline gốc.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: Toàn bộ 15 eval máy (E1-E9, E11, E12, E14-E16, E13) exit 0 và judge panel E10 (AC-10) đồng thuận PASS 3/3 lens, cùng 4 suite hồi quy đầy đủ (tests/scripts, tests/hooks, tests/plugins, product-map --check) xanh. Verdict tổng vẫn REJECT: review-findings.md xác nhận 4 finding "bugs"/"conventions" mức high/medium map trực tiếp vào AC-4, AC-9, AC-10, AC-14 (guard crash TypeError trên executor trùng tên Object.prototype; nhánh BLOCKED-toàn-ungrounded báo sai lý do; câu cấm allowlist trong judge-prompt tự mâu thuẫn với chính input đã khai ở workspace khác; phép đo tồn kho AC-14 yếu hơn guard thật nó đo) — các eval hiện có không bắt được các lớp lỗi này nên bộ máy báo xanh trong khi contract chưa đạt. Trả về implementation.

Round 2: Toàn bộ 15 eval máy (E1-E9, E11, E12, E14-E16, E13) exit 0, judge panel E10 (AC-10) chấm lại (không carried) và đồng thuận PASS 3/3 lens, cùng 4 suite hồi quy đầy đủ (tests/scripts 596 passed, tests/hooks 51 passed, tests/plugins xanh, product-map --check khớp hồ sơ xưởng) xanh. Verdict tổng vẫn REJECT: review-findings.md round này chỉ còn 1 finding trong hợp đồng — map vào AC-14 (E15), severity high — cùng LỚP lỗi round 1 mà quyết định S4-r1 từng tuyên đã đóng (phép đo tồn kho AC-14 viết lại luật yếu hơn engine thật), lần này ở hai vị từ `inputs` (nhánh hard-shape và nhánh ungrounded) nằm ngoài marker EVAL-REQUIRED-FIELDS nên bị test chép tay và lệch khỏi acceptance-verify.js ở cả hai nhánh; các finding AC-4/AC-9/AC-10 của round 1 đã hết trong hợp đồng round này. Trả về implementation; xem review-findings.md mục "Trong hợp đồng" để biết chi tiết.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract