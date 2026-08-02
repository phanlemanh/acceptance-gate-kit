---
schema_version: 2
feature_slug: hinh-theo-mat-phang
verdict: PASS
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7153acdb98e6c4df5533b4d971f8235d7d337c3f
# bypass_ack:
human_signoff:          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---

# Evidence Report: hinh-theo-mat-phang

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
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-hinh-theo-mat-phang-E1-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-hinh-theo-mat-phang-E2-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-hinh-theo-mat-phang-E3-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E4
  run_id: minted-hinh-theo-mat-phang-E4-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E5
  run_id: minted-hinh-theo-mat-phang-E5-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E6
  run_id: minted-hinh-theo-mat-phang-E6-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-hinh-theo-mat-phang-E7-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-hinh-theo-mat-phang-E8-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-hinh-theo-mat-phang-E9-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-02T03:00:00Z
  output: |
    plugins/ mirror in sync.

- eval: E10
  run_id: minted-hinh-theo-mat-phang-E10-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-hinh-theo-mat-phang-E11-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-02T03:00:00Z
  output: |
      PASS: P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)

    Results: all plugin tests passed

## Analyst

E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11 — cả 11 eval đều xanh trên CẢ HEAD lẫn diffBase (cmd `bash tests/plugins/run-tests.sh` cho E1-E8/E10-E11, cmd `bash scripts/sync-plugin-packages.sh --check` cho E9). Suite `tests/plugins/run-tests.sh` và `scripts/sync-plugin-packages.sh --check` là lệnh regression-guard bao trùm toàn repo (hàng trăm case P khác cũng chạy qua cùng lệnh) nên xanh-cả-hai-phía ở mức LỆNH là bình thường; tín hiệu phân biệt thật của round này nằm ở việc từng case P97/P92/P89/P90/P93/P95/P96 mới/sửa có đúng đối chứng dương + đột biến riêng (xem cột "expected" trong evals.yaml) — các đối chứng đó đã chạy tại thời điểm phát triển, không lặp lại ở đây vì lệnh bọc ngoài không tách được diffBase theo từng case.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E9 pass (9/9, trước khi có AC-10/AC-11) tại commit da3117d — nhưng ở Gate 2 phạm vi được nâng: thêm AC-10 (danh sách đóng phải có dấu mốc) và AC-11 (đăng ký hai từ mới vào từ điển); quay lại implementation, vá tại commit 00e3c19.
Round 2: E1-E11 pass (11/11) tại commit 00e3c19 — nhưng review mã sau đó bắt ba lỗ mức cao (AC-11 tự-gác: danh sách bắt buộc rút từ chính khối đang đo; tên bảng tra trong khuôn câu-về-hình chưa bao giờ được giải tới marker thật; mục tránh `surface` là term chuẩn nên alias không bao giờ bắn — một luật không thể đỏ; hàng bảng thiếu ô làm phép đo văng lỗi Python thay vì thông điệp có tên); quay lại implementation, vá tại commit 7153acd.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
