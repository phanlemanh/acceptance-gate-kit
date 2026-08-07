---
schema_version: 2
feature_slug: card-text-fidelity
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5d20c246f526b312962f2e4f167e48975ac25986
human_signoff: Manh Phan 2026-08-06 — ship với 6 nhóm giới hạn đã biết ghi trong contract; chọn đường (b) sau khi hết vòng uỷ quyền
---

# Evidence Report: card-text-fidelity

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-2 | test | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-5 | test | PASS |
| E5 | AC-12 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-13 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-card-text-fidelity-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E2
  run_id: minted-card-text-fidelity-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E3
  run_id: minted-card-text-fidelity-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E4
  run_id: minted-card-text-fidelity-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E5
  run_id: minted-card-text-fidelity-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E6
  run_id: minted-card-text-fidelity-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E7
  run_id: minted-card-text-fidelity-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E8
  run_id: minted-card-text-fidelity-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E9
  run_id: minted-card-text-fidelity-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E10
  run_id: minted-card-text-fidelity-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E11
  run_id: minted-card-text-fidelity-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

- eval: E12
  run_id: minted-card-text-fidelity-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T11:15:00Z
  output: |
    PASS: P161 strip-md giu duong dan + ma tran toan phan

    Results: all plugin tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay
none — every feature eval is red on baseline (discriminates)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: contract + evals dựng cho card-text-fidelity (strip-md giữ đường dẫn có dấu sao trên thẻ Cổng 1/2).
Round 2: 3 chân đo mù (must-fail, clone assert, hậu-điều-kiện) + 1 lỗ hardcode ROOT được nêu ra và một phần được vá — quyết định S4-r2 (decisions.jsonl d-20260806T032557Z-562) liệt kê 4 việc theo LỚP, trong đó (b) must-fail chưa thực sự có răng.
Round 3: 11/11 eval máy xanh (exit 0) VÀ 6 suite regression-guard khác xanh, nhưng review phát hiện 2 hình dạng đường-dẫn-chứa-sao thật trên thẻ vẫn bị cụt (AC-6 đỏ trên dữ liệu sống dù E6/E7/E9 báo xanh), cộng 3 chân đo (E9, E10, E11) đo chỉ-dẫn hoặc chuỗi-có-mặt thay vì quan hệ mà AC hứa. REJECT — quay lại implementation để gắn thước đúng vào vật trước khi verify lại.
Round 4: người uỷ quyền vượt trần 3 vòng (decisions.jsonl d-20260806T040916Z-11054) — đổi lời giải sang che nội dung trong nháy ngược trước khi lột + guard cả hai phía mở/đóng của dấu nhấn mạnh, và thêm E12/AC-13 (bảng phải phủ corpus, rút từ dữ liệu thật thay vì tự nghĩ) như chân mới đóng nguyên nhân gốc round 3. 12/12 eval máy xanh (exit 0) + 6 suite regression-guard khác xanh, nhưng scope-triage phát hiện E12 dùng ngưỡng dung sai `<= 25` thay vì quan hệ đỏ-khi-có-cụm-mồ-côi (18 loại mồ côi đo được hiện tại vẫn xanh, không có đối chứng dương chứng minh khối này biết đỏ) và ma trận chỉ ràng 11/19 hình dạng khai trong marker; cộng lớp "đo tổng-gộp/chỉ-dẫn/chuỗi-có-mặt thay vì quan hệ toàn phần" từ round 3 vẫn còn nguyên ở E6 (AC-6), E9 (AC-9), E10 (AC-10), E11 (AC-11). REJECT — quay lại implementation, sửa theo LỚP chứ không theo từng finding.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-08-06, do engine đổi ở vòng card-text-fidelity (hàm lột định dạng của thẻ + bộ kiểm)
run_id: repin-20260806-card-text-fidelity-lane1
sha: 2b01e982116f80b50828d30cb2d593025c918dbe · suites: 6 lệnh exit 0

### Re-pin lần 2 — 2026-08-06, do engine đổi ở vòng codex-script-packaging (công cụ mang-kết-quả + hàm dựng gói + chỉ dẫn 2 bản)
run_id: repin-20260806-codex-script-packaging-lane1
sha: 451840967a9ef3726e953246da03225504c71675 · suites: 6 lệnh exit 0

### Re-pin lần 3 — 2026-08-06, do engine đổi ở vòng dọn nợ đo-lường (5 phép đo có răng + gỡ hai chốt meta)
run_id: repin-20260806-measure-teeth-cleanup-lane1
sha: cdc64cfb184559e9f60f3fd57b215726f2b2cb44 · suites: 6 lệnh exit 0
### Re-pin lần 3 — 2026-08-06, do engine đổi ở vòng discovery-brainstorm-socket (ổ cắm khám phá + bộ quét /start + bộ kiểm), ghim lại sau rebase lên main
run_id: repin-20260806-discovery-brainstorm-socket-lane2
sha: 4383b814def31b4627eb290d3e0ea688ca80887f · suites: 5 lệnh exit 0

### Re-pin lần 5 — 2026-08-07, do hợp nhất hai nhánh (dọn nợ đo-lường + ổ cắm brainstorm) — engine đổi ở cả hai phía
run_id: repin-20260807-merge-teeth-socket-lane1
sha: 5d20c246f526b312962f2e4f167e48975ac25986 · suites: 6 lệnh exit 0

### Re-pin lần 6 — 2026-08-07, do engine đổi ở vòng stop-patching-law (mệnh đề dừng-vá vào 2 bản chỉ dẫn + bộ kiểm P168–P170)
run_id: repin-20260807-stop-patching-law-lane1
sha: 6bd11f7554effe75a9b1e8c8686a43634e45ec3e · suites: 6 lệnh exit 0
