---
schema_version: 2
feature_slug: release-2-2-0
verdict: PENDING-JUDGMENT
triage_failed: true
failed_evals: []
reason: 
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 50a5e85e3a5830356324a9f9c140c1eed03a30e7
human_signoff: 
---

# Evidence Report: release-2-2-0

⚠ phân loại phạm vi KHÔNG chạy được — không lỗi nào được máy tự sửa, danh sách đầy đủ nằm trong review-findings.md, người xem lại toàn bộ trước khi ký.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-2-0-E1-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_release
  verified_at: 2026-08-18T16:10:00Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do · quan he voi base (7 dot bien)

    Results: all plugin tests passed

- eval: E2
  run_id: minted-release-2-2-0-E2-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_release
  verified_at: 2026-08-18T16:10:00Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do · quan he voi base (7 dot bien)

    Results: all plugin tests passed

- eval: E3
  run_id: minted-release-2-2-0-E3-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-18T16:10:00Z
  output: |
    PASS: GCV1e nhanh CUT ra toi card that: card neu doc THIEU
    PASS: GCV1f card cut cung bao dung duyet
    PASS: GCV1d contract lanh khong sinh canh bao nao

- eval: E3b
  run_id: minted-release-2-2-0-E3b-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-18T16:10:00Z
  output: |
    PASS: V06

    Results: 60 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-2-0-E3c-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-18T16:10:00Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do · quan he voi base (7 dot bien)

    Results: all plugin tests passed

- eval: E3d
  run_id: minted-release-2-2-0-E3d-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-18T16:10:00Z
  output: |
    Results: 44 passed, 0 failed

    Results: all workflow tests passed

- eval: E6
  run_id: minted-release-2-2-0-E6-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins_release
  verified_at: 2026-08-18T16:10:00Z
  output: |
    PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do · quan he voi base (7 dot bien)

    Results: all plugin tests passed

## Analyst

Non-discriminating (green trên CẢ HEAD lẫn diffBase — không phân biệt được feature):
- E1, E2, E6 — `P200_MUST_BUMP=1 bash tests/plugins/run-tests.sh` xanh trên cả hai phía
- E3 — `bash tests/scripts/run-tests.sh` xanh trên cả hai phía
- E3b — `bash tests/hooks/run-tests.sh` xanh trên cả hai phía
- E3d — `bash tests/workflows/run-tests.sh` xanh trên cả hai phía

E3c baseline: n-a (không chạy được trên diffBase), nên không liệt vào đây.

## Variance

none — không eval nào của vòng này có `runs` > 1, không có pass_rate hỗn hợp, không flaky.

## Iterations

Round 1: chân bộ đếm bash (bản dùng-một-lần) nuốt vế đỏ trong ống/shell con/trap — lần thứ ba cùng lớp lỗi trong chính hồ sơ này; chân tu-kiem AC-4 tautology vì git chạy trong bản sao chứ không phải kho thật; mô tả feature-loop từng bị sửa mục lịch sử v2.1.0 thành `>= 2.2.0` để qua cổng. Owner chọn đổi khuôn: viết lại răng bằng Node một tiến trình (luật dừng-vá lần ba), thu AC-4/AC-7 khỏi hợp đồng. Returned to implementation.

Round 2: trên bản Node mới, vòng dò lỗ (gap-probe) trả 5 phát hiện vá trước cổng — P0: ca không ghim quan hệ-với-base nên mất commit bump vẫn xanh (việc DUY NHẤT hồ sơ làm không có chiều đỏ); P1×3: AC-1 khai phép đo `diagram-design` không tồn tại, AC-6 khai năm vế nội dung không đo được, đột biến "dời câu khai cặp" không dời gì thật; P2: bốn eval cùng trỏ một dòng tổng và số đột biến tự khớp chính nó. Cả 5 vá trong commit f3dac37. Returned to implementation.

Round 3: bốn suite + P200 ở chế độ BUOC-TANG đều XANH trên cây f3dac37 (7/7 đột biến, base=origin/main) — bảng Evidence của vòng đó. Nhưng rà soát adversarial phát hiện lớp lỗi thứ tư vẫn sống dưới lớp vỏ Node mới: mảng `loi` trong `p200.mjs` gom mọi vế đỏ trên CÂY THẬT + thất bại của đối chứng dương "bản sao nguyên vẹn", nhưng KHÔNG BAO GIỜ được đọc lại — điều kiện thoát duy nhất là `nMut !== MUT_KY_VONG` (chỉ đếm đột biến). Chạy thật xác nhận: kịch bản "mất commit bump" (`P200_BASE=HEAD P200_MUST_BUMP=1`, đúng kịch bản P0 mà round 2 tuyên đã vá) vẫn in "P200 OK ... 7/7 dot bien chay that" và exit 0. AC-1 in-contract, severity high — xem review-findings.md của vòng đó. Hết 3 vòng máy (giới hạn round-cap của S4) — verdict REJECT, dừng trình owner; failed_evals rỗng vì đây không phải eval máy thất bại mà là phép đo tự-khai-đạt trong khi không canh đúng thứ nó tuyên canh.

Round 4 (vòng này): bốn suite (scripts/hooks/plugins/workflows) + khoá `plugins_release` (P200 ở chế độ BUOC-TANG) đều XANH trên cây `50a5e85e3a5830356324a9f9c140c1eed03a30e7` — 7/7 eval PASS, bảng Evidence trên đây; `node scripts/product-map.mjs --root . --check` cũng khớp (PRODUCT-MAP.md khớp hồ sơ xưởng). Nhưng bước scope-triage của vòng rà soát chết giữa chừng — máy không phân loại được finding nào vào/ngoài hợp đồng, nên KHÔNG tự sửa gì. Toàn bộ danh sách nằm nguyên trong review-findings.md: 1 finding trong hợp đồng (AC-3 — khối bằng chứng E3c của round 3 là bản chép từ E3, không phải output suite plugins thật), 4 finding ngoài hợp đồng (cổng trước-merge bỏ qua hồ sơ REJECT vì status: approved · P200 neo origin/main gây đỏ oan cho làn song song sau merge · đường kích hoạt buộc-tăng chưa có ca đỏ thật đi qua · một chuỗi ghim đột biến không phân biệt được hai plugin), và 1 finding chưa phân loại (verified_commit của round 3 ghim ở f3dac37 trong khi bản vá thật nằm ở 50a5e85 — bằng chứng «tự phá thử 4 chiều» chỉ có ở commit message, không có run_id/exit_code kèm theo). `triage_failed: true`, verdict PENDING-JUDGMENT — người xem lại toàn bộ trước khi ký.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter
