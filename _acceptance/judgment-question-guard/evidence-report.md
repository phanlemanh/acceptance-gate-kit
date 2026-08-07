---
schema_version: 2
feature_slug: judgment-question-guard
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5d20c246f526b312962f2e4f167e48975ac25986
human_signoff: Manh Phan 2026-08-04
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
| E13 | AC-12 | script | PASS |
| E14 | AC-13 | test | PASS |
| E15 | AC-14 | test | PASS |
| E16 | AC-15 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-judgment-question-guard-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E2
  run_id: minted-judgment-question-guard-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E3
  run_id: minted-judgment-question-guard-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E4
  run_id: minted-judgment-question-guard-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E5
  run_id: minted-judgment-question-guard-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E6
  run_id: minted-judgment-question-guard-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E7
  run_id: minted-judgment-question-guard-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E8
  run_id: minted-judgment-question-guard-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E9
  run_id: minted-judgment-question-guard-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E10
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  votes:
    - domain-correctness: PASS — Prompt dòng 4 nói thẳng luật neo vào QUAN HE (co-trong-danh-sach "Input:" cong persona), khong phai LOAI FILE, va tu giai thich vi sao: "cung mot ten file co the la input hop le cua eval nay va ngoai pham vi cua eval khac" — dieu nay chinh xac giai toa nguy co nham lan voi cac eval khac coi contract.md/design doc la input hop le, vi phep thu la thanh vien trong danh sach cua TUNG eval chu khong phai loai ten file co dinh. Dong 7 con noi ro rang khi danh sach khong du can cu thi PHAI tra UNCERTAIN va "TUYET DOI KHONG phai ly do di tim file khac de tu cuu" — mot hoi dong vien doc se hieu dung ca hai diem ma cau hoi neu ra.
    - operational-feasibility: PASS — Prompt dòng 4 nêu rõ luật scope neo theo QUAN HE ("co-trong-danh-sach hay khong"), KHONG theo loai file, và minh hoạ ngay: cùng một tên file có thể là input hợp lệ của eval này nhưng ngoài phạm vi của eval khác — điều này trực tiếp ngừa hiểu nhầm luật-theo-loại-file mà câu hỏi nêu. Dòng 7 nói thẳng: thiếu căn cứ → lý do trả UNCERTAIN, tuyệt đối không phải lý do tự đi tìm file khác để tự cứu/tự chế tiêu chí, và cảnh báo rõ hành vi đó phá tính độc lập của hội đồng. Cả hai vế câu hỏi đều được văn bản trả lời minh bạch, không cần suy luận thêm.
    - spec-alignment: PASS — Prompt neo ro vao QUAN HE, khong theo loai file: dong 4 noi thang "Luat nay theo QUAN HE (co-trong-danh-sach hay khong), KHONG theo loai file — cung mot ten file co the la input hop le cua eval nay va ngoai pham vi cua eval khac" — cau nay chinh la lam ro truoc moi lan can nham voi cac eval khac ma design doc/contract.md la input hop le. Dong 7 noi ro rang thieu can cu la ly do tra UNCERTAIN, "TUYET DOI KHONG phai ly do di tim file khac de tu cuu", va giai thich vi sao (pha hong tinh doc lap hoi dong) — khop voi persona "UNCERTAIN la mot verdict TOT". Khong thay mau thuan giua danh sach Input va luat pham vi trong prompt nay.
  human_override: Manh Phan 2026-08-04

- eval: E11
  run_id: minted-judgment-question-guard-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E12
  run_id: minted-judgment-question-guard-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E13
  run_id: minted-judgment-question-guard-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    plugins/ mirror in sync.

- eval: E14
  run_id: minted-judgment-question-guard-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E15
  run_id: minted-judgment-question-guard-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

- eval: E16
  run_id: minted-judgment-question-guard-E16-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-04T09:00:00+07:00
  output: |
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 10 passed, 0 failed
    Results: all workflow tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay
none — baseline không được đo lại ở round này (P2, không đổi từ lần baseline cuối, round 1), nên không có eval nào được xếp vào non-discriminating ở round này. Các lệnh suite xanh-cả-hai-phía (tests/scripts, tests/hooks, tests/plugins, product-map --check) là regression-guard bình thường, không liệt kê.

## Variance

none — every multi-run eval is uniform (không eval nào khai `runs` > 1 hoặc `variance: true` round này).

## Iterations

Round 1: Contract + evals.yaml chuẩn hoá; baseline (diffBase) được đo cho các eval máy — không đo lại ở các round sau (xem Analyst).
Round 2: Review ngoài-hợp-đồng phát hiện xung đột giữa bảng EVAL_REQUIRED fail-closed và các mẫu ui-check/design eval mà chính SKILL.md/design-ui-check.md khuyến nghị (xem review-findings.md); quyết định tại S4-r2 là hoãn sửa (known-limits/new-contract), không chặn round.
Round 3 (round này): toàn bộ 15 eval máy (E1-E9, E11, E12, E14-E16) + mirror-sync (E13) xanh; panel judgment E10 chấm mới, 3/3 lens PASS. Verdict tổng vẫn PENDING-JUDGMENT vì hợp đồng T3 bắt buộc `human_override` trên MỌI judgment item bất kể verdict của judge, trước khi Gate 2 có thể nâng lên PASS.

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
### Re-pin lần 7 — 2026-08-06, do engine đổi ở vòng discovery-brainstorm-socket (ổ cắm khám phá + bộ quét /start + bộ kiểm), ghim lại sau rebase lên main
run_id: repin-20260806-discovery-brainstorm-socket-lane2
sha: 4383b814def31b4627eb290d3e0ea688ca80887f · suites: 5 lệnh exit 0

### Re-pin lần 9 — 2026-08-07, do hợp nhất hai nhánh (dọn nợ đo-lường + ổ cắm brainstorm) — engine đổi ở cả hai phía
run_id: repin-20260807-merge-teeth-socket-lane1
sha: 5d20c246f526b312962f2e4f167e48975ac25986 · suites: 6 lệnh exit 0

### Re-pin lần 10 — 2026-08-07, do engine đổi ở vòng stop-patching-law (mệnh đề dừng-vá vào 2 bản chỉ dẫn + bộ kiểm P168–P170)
run_id: repin-20260807-stop-patching-law-lane1
sha: 6bd11f7554effe75a9b1e8c8686a43634e45ec3e · suites: 6 lệnh exit 0
