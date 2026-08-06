---
schema_version: 2
feature_slug: measure-teeth-cleanup
verdict: REJECT
failed_evals: []
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5e40e55ba98522741c290902689c4ce019584125
# bypass_ack:
human_signoff:
---

# Evidence Report: measure-teeth-cleanup

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

## Evidence

- eval: E1
  run_id: minted-measure-teeth-cleanup-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E2
  run_id: minted-measure-teeth-cleanup-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E3
  run_id: minted-measure-teeth-cleanup-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E4
  run_id: minted-measure-teeth-cleanup-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E5
  run_id: minted-measure-teeth-cleanup-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E6
  run_id: minted-measure-teeth-cleanup-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E7
  run_id: minted-measure-teeth-cleanup-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E8
  run_id: minted-measure-teeth-cleanup-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E9
  run_id: minted-measure-teeth-cleanup-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

- eval: E10
  run_id: minted-measure-teeth-cleanup-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T14:30:00Z
  output: |
    PASS: P165 assert sua/xoa phai co entry SIET-NOI

    Results: all plugin tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay

Danh sách eval không-phân-biệt của vòng này: none — round này không đo lại baseline nên không có số liệu mới để phân loại discriminating/non-discriminating. Ghi chú carried: round 1 đã ghi nhận CẢ MƯỜI eval (E1-E10) pass-trên-baseline (`baseline: green`) qua cùng lệnh `bash tests/plugins/run-tests.sh` — tức không phân biệt được feature với code cũ chỉ bằng exit code của suite lệnh. Khuyến nghị của round 1 ("đo lại A/B trên diffBase sau khi sửa theo review-findings, trước khi tính round là PASS") VẪN CHƯA được thực hiện ở round này; mọi `baseline:` bên dưới ghi `n-a` vì KHÔNG đo lại, không phải vì đã trở thành discriminating. Round này thay vào đó tìm thấy hai finding severity=high MỚI (xem review-findings.md, mục 5 và 6) chỉ ra rằng ngay cả sau 7 sửa của S4-r1, chân đo AC-5 và AC-1 vẫn mang đúng lớp lỗi "assertion không sống" mà round 1 đã cảnh báo — nên việc đo lại baseline tiếp tục bị hoãn cho tới khi các chân này được sửa đúng LỚP.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 6 suite lệnh máy đều PASS (E1-E10 qua `bash tests/plugins/run-tests.sh`, baseline: green trên mọi eval — không phân biệt); scope-triage phát hiện 8 finding trong-hợp-đồng (thước không gắn vào vật được giao / đo chỉ dẫn thay vì đầu ra / fixture viết tay đúng khuôn bên đọc / assertion âm-tính-một-mình) phủ AC-1, AC-2, AC-5, AC-6, AC-7, AC-8, AC-9, cộng 5 finding ngoài-hợp-đồng. Verdict: REJECT, quay lại implementation để sửa theo LỚP.

Round 2: S4-r1 áp 7 sửa theo decisions.jsonl (d-20260806T135831Z-5130) — biến lọc + TEETH không kế thừa vào suite lồng, lọc-không-khớp-khối→ĐỎ, đối chứng E9 chạy thật trên cây gọt (không suy trong comment), khuôn block phán rút từ marker template, ma trận mutant 6 ca (3 tiền tố × gạch dưới/chữ hoa/.py), nguồn thứ ba độc lập thật (quét thân khối), P165 đo quan hệ thứ tự từ lịch sử git — rồi verify lại: 6 suite lệnh máy đều PASS (E1-E10; baseline round này KHÔNG đo lại, carried từ round 1). Scope-triage vẫn tìm thấy 2 finding severity=high MỚI trong-hợp-đồng, cùng lớp assertion-không-sống mà round 1 đã cảnh báo phải sửa theo LỚP chứ không theo case: AC-5 (`attempted == len(slugs)` là hằng đúng, và bộ đếm mới gọi thẻ KHÔNG `--gate` — khác lời gọi mà các assert quan hệ khác dựa vào) và AC-1 (ma trận mutant tuyên "3×4 đầy đủ" nhưng chỉ có 6/12 ô, thiếu đúng hình dạng KHÔNG-tiền-tố — lõi của AC-1), cộng 6 finding khác (2 medium trong-hợp-đồng, 1 medium+2 low+1 medium ngoài-hợp-đồng) — xem review-findings.md. Verdict: REJECT, quay lại implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
