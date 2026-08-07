---
schema_version: 2
feature_slug: measure-teeth-cleanup
verdict: PASS
failed_evals: []
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6bd11f7554effe75a9b1e8c8686a43634e45ec3e
# bypass_ack:
human_signoff: Manh Phan 2026-08-06 — ký + gỡ nhóm B (hai chốt meta); ship 5 phép đo đã có răng
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
  run_id: minted-measure-teeth-cleanup-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E2
  run_id: minted-measure-teeth-cleanup-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E3
  run_id: minted-measure-teeth-cleanup-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E4
  run_id: minted-measure-teeth-cleanup-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E5
  run_id: minted-measure-teeth-cleanup-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E6
  run_id: minted-measure-teeth-cleanup-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E7
  run_id: minted-measure-teeth-cleanup-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E8
  run_id: minted-measure-teeth-cleanup-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E9
  run_id: minted-measure-teeth-cleanup-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

- eval: E10
  run_id: minted-measure-teeth-cleanup-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-06T22:00:00Z
  output: |
    PASS: P165 assert sua/xoa phai co dong SIET-NOI

    Results: all plugin tests passed

## Analyst

carried tu round 1 — baseline khong do lai round nay

Danh sách eval không-phân-biệt của vòng này: none — round này không đo lại baseline nên không có số liệu mới để phân loại discriminating/non-discriminating. Ghi chú carried: round 1 đã ghi nhận CẢ MƯỜI eval (E1-E10) pass-trên-baseline (`baseline: green`) qua cùng lệnh `bash tests/plugins/run-tests.sh` — tức không phân biệt được feature với code cũ chỉ bằng exit code của suite lệnh. Khuyến nghị của round 1 ("đo lại A/B trên diffBase sau khi sửa theo review-findings, trước khi tính round là PASS") VẪN CHƯA được thực hiện ở round này; mọi `baseline:` bên dưới ghi `n-a` vì KHÔNG đo lại, không phải vì đã trở thành discriminating. Round này (round 3) scope-triage tìm thêm 1 finding severity=high MỚI trong-hợp-đồng ở AC-4 (`tests/plugins/run-tests.sh:7024` — `assert not hard` chưa từng được chứng minh biết ĐỎ bằng một ca tiêm đúng-một-cụm-mồ-côi như E5 đòi; nới thêm hai hình dạng glob mới cho thấy "zero tolerance" hôm nay một phần nhờ bộ phân loại đã được nới cho hết dư lượng, không hẳn nhờ vật sạch), cộng 6 finding trong-hợp-đồng khác (AC-6 ×2, AC-5, AC-8, AC-1, AC-7) và 7 finding ngoài-hợp-đồng (2 severity=high: P165 fail-open khi không resolve được merge-base, và mẫu số tautology `attempted == len(slugs)` ở nhánh khác của cùng chốt AC-5). Việc đo lại baseline tiếp tục bị hoãn cho tới khi các chân AC-1, AC-4, AC-5 — đã bị nêu liên tiếp ở cả 3 round — được sửa đúng LỚP thay vì theo từng case.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: 6 suite lệnh máy đều PASS (E1-E10 qua `bash tests/plugins/run-tests.sh`, baseline: green trên mọi eval — không phân biệt); scope-triage phát hiện 8 finding trong-hợp-đồng (thước không gắn vào vật được giao / đo chỉ dẫn thay vì đầu ra / fixture viết tay đúng khuôn bên đọc / assertion âm-tính-một-mình) phủ AC-1, AC-2, AC-5, AC-6, AC-7, AC-8, AC-9, cộng 5 finding ngoài-hợp-đồng. Verdict: REJECT, quay lại implementation để sửa theo LỚP.

Round 2: S4-r1 áp 7 sửa theo decisions.jsonl (d-20260806T135831Z-5130) — biến lọc + TEETH không kế thừa vào suite lồng, lọc-không-khớp-khối→ĐỎ, đối chứng E9 chạy thật trên cây gọt (không suy trong comment), khuôn block phán rút từ marker template, ma trận mutant 6 ca (3 tiền tố × gạch dưới/chữ hoa/.py), nguồn thứ ba độc lập thật (quét thân khối), P165 đo quan hệ thứ tự từ lịch sử git — rồi verify lại: 6 suite lệnh máy đều PASS (E1-E10; baseline round này KHÔNG đo lại, carried từ round 1). Scope-triage vẫn tìm thấy 2 finding severity=high MỚI trong-hợp-đồng, cùng lớp assertion-không-sống mà round 1 đã cảnh báo phải sửa theo LỚP chứ không theo case: AC-5 (`attempted == len(slugs)` là hằng đúng, và bộ đếm mới gọi thẻ KHÔNG `--gate` — khác lời gọi mà các assert quan hệ khác dựa vào) và AC-1 (ma trận mutant tuyên "3×4 đầy đủ" nhưng chỉ có 6/12 ô, thiếu đúng hình dạng KHÔNG-tiền-tố — lõi của AC-1), cộng 6 finding khác (2 medium trong-hợp-đồng, 1 medium+2 low+1 medium ngoài-hợp-đồng) — xem review-findings.md. Verdict: REJECT, quay lại implementation.

Round 3: 6 suite lệnh máy đều PASS (E1-E10; baseline round này KHÔNG đo lại, carried từ round 1). Scope-triage tìm 7 finding trong-hợp-đồng: 1 high MỚI ở AC-4 (`assert not hard` chưa có đối chứng dương đúng-một-cụm-mồ-côi, và dư lượng "zero" một phần đến từ nới bộ phân loại); 2 medium cùng AC-6 quanh `countJudgmentBlocks` thiếu guard block-scalar mà `collectGold` có, mở lại đúng lớp "parser bịa điểm từ excerpt" đã vá ở AC-8; 1 medium AC-5 về bộ đếm render bị `if out is None: continue` nuốt lỗi thầm lặng ở nhánh `--gate` trong khi bộ đếm mới đo một lời gọi khác (auto-detect, không `--gate`); 3 medium khác ở AC-8 (đối chứng E9 chỉ khẳng định tiền đề, chưa chạy vòng phát-hiện thật của chốt), AC-1 (ma trận mutant tuyên 3×4 vẫn chỉ có 6/12 ô), AC-7 ("nguồn độc lập" của P163 là khai-báo-đối-khai-báo, nguồn thật chỉ print không bao giờ ĐỎ). Cộng 7 finding ngoài-hợp-đồng: 2 high (P165 fail-open khi không resolve được merge-base trái luật fail-closed của chính gate.yml; mẫu số tautology `attempted == len(slugs)` — nằm ngoài hợp đồng vì hợp đồng loại trừ tường minh phát hiện tautology tự động) và 5 finding khác quanh đóng gói `assert-ratchet.tsv` (rsync vào mirror trong khi hai sổ chị em bị loại trừ, allowlist không kiểm chiều ngược, P165 vô hiệu trên push thẳng nhánh chính). 2/14 lỗi rơi vào file ngoài mọi bộ đo (`scripts/sync-plugin-packages.sh`). Verdict: REJECT, quay lại implementation để sửa theo LỚP — cùng ba AC (AC-1, AC-4/AC-5) tiếp tục dẫm đúng hình dạng "assertion không sống" / "hạ thước cho vừa vật" đã bị nêu liên tiếp qua cả 3 round.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-08-06, do engine đổi ở vòng dọn nợ đo-lường (5 phép đo có răng + gỡ hai chốt meta)
run_id: repin-20260806-measure-teeth-cleanup-lane1
sha: cdc64cfb184559e9f60f3fd57b215726f2b2cb44 · suites: 6 lệnh exit 0

### Re-pin lần 2 — 2026-08-07, do hợp nhất hai nhánh (dọn nợ đo-lường + ổ cắm brainstorm) — engine đổi ở cả hai phía
run_id: repin-20260807-merge-teeth-socket-lane1
sha: 5d20c246f526b312962f2e4f167e48975ac25986 · suites: 6 lệnh exit 0

### Re-pin lần 3 — 2026-08-07, do engine đổi ở vòng stop-patching-law (mệnh đề dừng-vá vào 2 bản chỉ dẫn + bộ kiểm P168–P170)
run_id: repin-20260807-stop-patching-law-lane1
sha: 6bd11f7554effe75a9b1e8c8686a43634e45ec3e · suites: 6 lệnh exit 0
