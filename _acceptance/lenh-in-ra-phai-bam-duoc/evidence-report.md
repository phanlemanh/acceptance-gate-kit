---
schema_version: 2
feature_slug: lenh-in-ra-phai-bam-duoc
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (đường VERIFY độc lập, 6 lệnh chạy tuần tự — d-4512)
enforcement_mode: strict
bypass_used: false
verified_commit: 24eec78ce4823260b1b4656b66ed8d7ec867ed55
human_signoff:
---

# Evidence Report: lenh-in-ra-phai-bam-duoc

Round 1. Một phiên tươi chạy tuần tự bốn suite + phép kiểm bản đồ trên cây `24eec78c` (working tree
sạch); mỗi eval đối chiếu với chốt `PASS: [LBn]` (ranh giới vuông) hoặc dòng tổng kết của chính lệnh.

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
| E9 | AC-2 | test | PASS |
| E10 | AC-2 | test | PASS |
| E11 | AC-2 | test | PASS |

## Bằng chứng gốc — năm lệnh, một lượt

    bash tests/plugins/run-tests.sh                →  Results: all plugin tests passed (0 dòng FAIL; 8 chốt LB + DD2/DD4/DD7/VC6/P30/P143)
    bash tests/scripts/run-tests.sh                →  Results: 750 passed, 0 failed (TM3 đổi thước: không cờ glossary-base)
    bash tests/hooks/run-tests.sh                  →  Results: 60 passed, 0 failed
    bash tests/workflows/run-tests.sh              →  Results: all workflow tests passed
    node scripts/product-map.mjs --root . --check  →  PRODUCT-MAP.md khớp hồ sơ xưởng.

Trong S3: suite đỏ hai ca cũ ghim hành vi cũ (P30 needle `/acceptance-card` trần · TM3 đòi cờ glossary-base)
→ đổi thước theo hợp đồng (d-4511). Reviewer tươi 4 finding trong hợp đồng → sửa cùng round
(`/uat-session` trần cũng đỏ · Analyst n-a hỗn hợp mã eval vẫn đỏ · LB4 đủ ba trạng thái · 13 file).

## Evidence

- eval: E1
  run_id: lenh-in-ra-phai-bam-duoc-E1-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB1] bảng COMMAND-NAMES ⊆ vật thật (tiền tố = name plugin.json, vật tồn tại; harness chỉ [goal]); foo / đổi name / harness lạ → đỏ

- eval: E2
  run_id: lenh-in-ra-phai-bam-duoc-E2-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB2] 13 file: 0 trần, 0 uat thiếu tiền tố, 68 lệnh có tiền tố ⊆ bảng; origin/main == 65+3; giữ-gân 0; ba chèn → đỏ

- eval: E3
  run_id: lenh-in-ra-phai-bam-duoc-E3-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB3] một câu luật: dùng cột Lệnh bấm được của COMMAND-NAMES, không dạng trần; gỡ → đỏ

- eval: E4
  run_id: lenh-in-ra-phai-bam-duoc-E4-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB4] Analyst n-a có lý do → không đỏ; n-a trần/ngắn → đỏ ghim; nội dung thật → đỏ như cũ; ba hồ sơ thật 0 cờ baseline

- eval: E5
  run_id: lenh-in-ra-phai-bam-duoc-E5-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB5] 0 cờ glossary-base; cũ∖mới trên A/B/C chỉ gồm baseline(3) + glossary(1), mới∖cũ = ∅

- eval: E6
  run_id: lenh-in-ra-phai-bam-duoc-E6-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB6] «Bỏ đường đo —» không gạch/viết hoa = dòng bỏ: không vào lines; không entry → vàng, entry → info
    PASS: [DD2] R−: gỡ section / chỉ placeholder / chỉ dòng bỏ không entry → đúng 1 cờ vàng «chưa có đường đo» nêu hai lối
    PASS: [DD4] RK: entry đúng tiền tố → info «Đã bỏ đường đo theo id» + CHƯA ĐO, 0 vàng (cả khi section chỉ có dòng bỏ); sai tiền tố / sai type → vẫn vàng

- eval: E7
  run_id: lenh-in-ra-phai-bam-duoc-E7-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB7] _Avoid_ của Đường đo: tracking, không metric; uat-session lấy số từ đường đo đã khai; thêm lại metric → đỏ
    PASS: [DD7] CONTEXT.md có term Đường đo (thước/ngưỡng/số đo, _Avoid_ tracking); gỡ → đỏ

- eval: E8
  run_id: lenh-in-ra-phai-bam-duoc-E8-r1-20260822T152436Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-22T15:24:36Z
  output: |
    PASS: [LB8] START-HIEU-KET nằm trong bullet «Bắt đầu việc mới», trước (a); stub duong-do ghi chú decided_at xấp xỉ
    PASS: [VC6] hai khối marker đúng chỗ, ma trận 6 mệnh đề, 0 «grill», nghi thức → máy round-trip; gỡ span/khối/16 dòng → đỏ

- eval: E9
  run_id: lenh-in-ra-phai-bam-duoc-E9-r1-20260822T152701Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-22T15:27:01Z
  output: |
    Results: 750 passed, 0 failed
    PASS: TM3 (có CONTEXT.md nhưng thiếu --glossary-base → KHÔNG cờ)

- eval: E10
  run_id: lenh-in-ra-phai-bam-duoc-E10-r1-20260822T152825Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-22T15:28:25Z
  output: |
    Results: 60 passed, 0 failed

- eval: E11
  run_id: lenh-in-ra-phai-bam-duoc-E11-r1-20260822T152832Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-22T15:28:32Z
  output: |
    Results: all workflow tests passed

## Analyst

n-a — không chạy baseline trên cây diffBase (đường verify độc lập, d-4512). Điều đọc được từ chính
lượt chạy: LB2 có ĐỐI CHỨNG DƯƠNG thật (cùng hàm quét trên `origin/main` đếm đúng 65 + 3), chiều đỏ
chèn ba dạng sai đều đỏ nêu file:dòng; LB5 so tập cờ cũ/mới với đối chứng dương bản cũ thật sự phát cờ;
tác giả tự phá thử LB2 (đưa một điểm bàn giao về dạng trần) → đỏ đúng. Bộ đo phân biệt được vật hỏng.

## Variance

none — mọi eval tất định.

## Known limits

- **Không có hội đồng / baseline A-B; một reviewer tươi** (d-4512).
- **QUICKSTART.md · README.md · GUIDE.md còn 45 token trần** — ngoài danh sách 13 file của AC-2 (cùng lớp
  AC-7b chip A: vũ trụ là danh sách khai tường minh). Đây là mặt người ĐẦU TIÊN owner chép lệnh.
  Máy khuyên: hồ sơ kế thêm ba file vào vũ trụ quét (regex đã có, đối chứng dương đổi số, khai sổ).
- **Giả định 3 chỉ thử được một nửa:** dạng `/<plugin>:<tên>` giải được ở CLI (headless, d-4507);
  app desktop chưa quan sát — ván lái-thử kế sẽ đo nốt (ngưỡng UAT «0 lần gõ lại tay»).
- **Cờ «ngưỡng/biên chưa có ca» GIỮ** (d-4509) — rà soát 22/08 gọi nhầm là nhiễu; P143 là đối chứng
  dương. Thẻ chip C vẫn có hai cờ này vì AC nhắc số đếm trong chữ — việc của người viết AC.
- **Câu nói với MÁY dùng dạng slash** («invoke `/acceptance-gate:acceptance-card`») trong khi Skill tool
  nhận tên không gạch — không lệch thật (bản cũ còn xa hơn), để nguyên.
- **Chuỗi lỗi nguyên văn của owner chưa có** (giả định 1b) — chiều đỏ của chip đứng trên 7→3 chỗ
  `uat-session` chắc sai và 65 token trần; chuỗi của owner khi có là bằng chứng thêm, không chặn.

## Ngoài hợp đồng

Ba finding của reviewer, máy KHÔNG sửa trong round (chi tiết `review-findings.md`):
1. QUICKSTART/README/GUIDE 45 token trần (medium) — xem Known limits; đề xuất hồ sơ kế, rẻ.
2. uat-session SKILL:100 «ở cả hai harness» lỗi thời (Codex đã lưu kho) — một câu.
3. Câu invoke cho máy dùng dạng slash — không lệch thật.

## Iterations

Round 1: đường verify độc lập — 6 lệnh tuần tự trên `24eec78c`, tất cả exit 0; 11/11 eval PASS.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
