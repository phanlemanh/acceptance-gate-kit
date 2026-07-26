---
schema_version: 2
feature_slug: gap-probe-presence-hook
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d7a0c8b3946660ce01867909fe6119617f34746a
human_signoff:
---

# Evidence Report: gap-probe-presence-hook

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | PENDING (panel proposal PASS carried from round 2 — inputs unchanged; T3 requires human_override) |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-gap-probe-presence-hook-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM1: mode required + thiếu cả file lẫn descope → VIOLATION nêu slug, exit != 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E2
  run_id: minted-gap-probe-presence-hook-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM2 + GPM2b: advisory VÀ khoá vắng → NOTE, KHÔNG VIOLATION, exit 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E3
  run_id: minted-gap-probe-presence-hook-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM3: mode off → KHÔNG chứa chuỗi gap-probe nào, exit 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E4
  run_id: minted-gap-probe-presence-hook-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM4: contract T1 + mode required → không in gì về gap-probe (REQUIRED_FOR filter), exit 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E5
  run_id: minted-gap-probe-presence-hook-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM5 + GPM5c: verdict clean/findings từ frontmatter, fixture chép nguyên văn output S1#7 → im lặng, exit 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E6
  run_id: minted-gap-probe-presence-hook-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM6a/b/c: file rỗng, verdict rác, verdict chỉ ở thân bài → VIOLATION ở required, exit != 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E7
  run_id: minted-gap-probe-presence-hook-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM7/7b/7c/7d + GPM16: van thoát descope khớp TRỌN không gian hoa/thường như gate-card.js (bỏ|Bỏ|BỎ, một space); entry descope KHÁC không được coi là van thoát — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E8
  run_id: minted-gap-probe-presence-hook-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM8: verdict probe-failed ở mode required → NOTE, KHÔNG violation, exit 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E9
  judged_by: judge-panel (fresh context, 3-lens)
  proposal: PASS
  panel: giữ nguyên từ round 2 — inputs không đổi (inputs_hash khớp), không chấm lại; rationale xem round 2
  votes:
    - domain-correctness: PASS (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: PASS (r2)
  human_override:        # risk_tier T3: bắt buộc verdict trực tiếp từ human trên MỌI judgment item, bất kể panel đề xuất gì — điền "<name> <ISO date>" tại Gate 2

- eval: E10
  run_id: minted-gap-probe-presence-hook-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM10: contract T3 status draft và approved, mode required → không in gì về gap-probe, exit 0 — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E11
  run_id: minted-gap-probe-presence-hook-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM11a/b/c + c3/c4/c5: giá trị có nháy/viết hoa nhận đúng; sai chính tả → VIOLATION cấu hình VÀ script chạy tiếp (exit code đúng, dòng tổng kết có mặt, không lỗi shell unbound variable) — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E12
  run_id: minted-gap-probe-presence-hook-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM12: evidence/premerge-messages.txt tồn tại và chứa đủ 4 nhãn (VIOLATION(required) · advisory · theo ledger(descope nêu id) · probe-failed) — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

- eval: E13
  run_id: minted-gap-probe-presence-hook-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T07:05:00Z
  output: |
    case GPM13/13a/13b/13c + GPM14/GPM15: slug ngoài diff không xét; không --base bỏ qua kèm NOTE; _acceptance/ không ở git root VẪN chạy; git diff lỗi thì KHAI bỏ qua chứ không tin phạm vi rỗng — asserted
      PASS: GPM16

    Results: 279 passed, 0 failed

## Analyst

carried tu round 2 — baseline khong do lai round nay (P2: evals.yaml không đổi từ lần baseline cuối). Field `baseline:` của toàn bộ khối eval máy round này ghi `n-a` vì không đo lại. Danh sách carried từ round 2 (khi đo lần cuối, cả 12 eval máy của `bash tests/scripts/run-tests.sh` xanh trên CẢ HEAD lẫn diffBase — tín hiệu KHÔNG-PHÂN-BIỆT, xem round 2 để biết chi tiết và khuyến nghị):

E1, E2, E3, E4, E5, E6, E7, E8, E10, E11, E12, E13

`bash tests/hooks/run-tests.sh` (51/51), `bash tests/plugins/run-tests.sh` (toàn bộ xanh, gồm P35) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) là suite xanh-cả-hai-phía, regression-guard bình thường, không liệt kê ở đây theo quy ước.

## Variance

none — every multi-run eval is uniform (không eval nào mang field `runs` > 1; toàn bộ deterministic).

## Iterations

Round 1: 12/12 eval máy (E1-E8, E10-E13) PASS lần chạy đầu, exit 0, 273/273 test suite xanh. E9 (judgment, risk_tier T3) nhận đề xuất PASS đồng thuận 3/3 lens từ judge panel nhưng còn treo `human_override` bắt buộc theo luật T3 — chưa trả về implementation, verdict tổng PENDING-JUDGMENT chờ Gate 2.

Round 2: 12/12 eval máy vẫn PASS (exit 0, 275/275 `tests/scripts/run-tests.sh` xanh — 2 case mới so với round 1, đến hết GPM8note), cộng thêm `tests/hooks/run-tests.sh` (51/51), `tests/plugins/run-tests.sh` (toàn bộ xanh, gồm P35) và `scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) đều xanh làm bằng chứng regression rộng hơn. E9 chạy lại panel 3-lens từ context sạch, vẫn đồng thuận đề xuất PASS 3/3 nhưng `human_override` T3 vẫn trống — verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2. Review adversarial-verify round này phát hiện 8 finding mới ở lớp merge-boundary (`scripts/pre-merge-check.sh`), 2 trong số đó (`DIFF_READY` nuốt lỗi git diff; descope-regex lệch gate-card.js) là các vấn đề round 1 đã ghi (§4, §8) và XÁC NHẬN CHƯA ĐƯỢC SỬA trong HEAD — xem `review-findings.md` round 2.

Round 3: 12/12 eval máy vẫn PASS (exit 0, 279/279 `tests/scripts/run-tests.sh` xanh — 4 case mới so với round 2, đến hết GPM16, bao trùm parity descope hoa/thường với gate-card.js), cộng `tests/hooks/run-tests.sh` (51/51), `tests/plugins/run-tests.sh` (toàn bộ xanh, gồm P35), `scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) đều xanh. Baseline KHÔNG đo lại round này (evals.yaml không đổi từ round 2 — xem `## Analyst`). E9 (panel) giữ nguyên từ round 2 — inputs_hash khớp, không chấm lại; `human_override` T3 vẫn trống, verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2. Review adversarial-verify round này bổ sung 4 finding mới (2 medium ở lớp toàn vẹn init/parity harness và mirror comment-vs-code, 2 low ở lớp fixture/vòng đời test) cộng 4 finding bugs từ round trước ở lớp merge-boundary — xem `review-findings.md` round 3.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
