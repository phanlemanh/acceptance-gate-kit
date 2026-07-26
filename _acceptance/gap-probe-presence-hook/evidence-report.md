---
schema_version: 2
feature_slug: gap-probe-presence-hook
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 987fd836979ff1eb23dd753bf984e62166be62b3
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
| E6 | AC-6 | judgment | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

Ghi chú: mọi hàng trên đều PASS ở mức máy/panel, nhưng contract `risk_tier: T3`
bắt buộc human tự xác nhận trực tiếp E6 (judgment) bất kể panel đã đề xuất PASS
— xem `human_override` ở block E6 dưới đây. Đó là lý do verdict TỔNG THỂ của
report này giữ `PENDING-JUDGMENT` cho tới khi Gate 2 điền dòng đó. So với round
2, verdict KHÔNG đổi — round này tái xác nhận trên code đã sửa 5/9 finding
round 2 (+ descope N3 có dấu vết) và bổ sung case t76.

## Evidence

- eval: E1
  run_id: minted-gap-probe-presence-hook-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

- eval: E2
  run_id: minted-gap-probe-presence-hook-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

- eval: E3
  run_id: minted-gap-probe-presence-hook-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

- eval: E4
  run_id: minted-gap-probe-presence-hook-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

- eval: E5
  run_id: minted-gap-probe-presence-hook-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

- eval: E6
  judged_by: judge panel (fresh context, 3-lens) — domain-correctness, operational-feasibility, spec-alignment
  verdict: PASS
  rationale: |
    Panel đề xuất PASS, đồng thuận 3/3 lens, không dissent. Chấm lại round 3
    trên evidence cập nhật sau khi sửa 5/9 finding round 2 + thêm case t76
    (inputs_hash round 3 khác round 2 — panel KHÔNG carried, đã chấm lại thật).
    - domain-correctness: PASS — Mỗi thông điệp (BLOCKED lẫn NOTE) đều nêu rõ hai lối đi cụ thể: chạy "S1#7 (phản biện context sạch)" để sinh gap-probe.md, hoặc ghi đúng cú pháp entry vào decisions.jsonl (kèm mẫu JSON {"type":"descope","decision":"..."}) — không chỉ nói "bị chặn" mà chỉ thẳng hành động khắc phục, kèm cả đường dẫn file liên quan và biến bypass hợp lệ (ACCEPTANCE_GATE_BYPASS=1). Các case đặc thù (t70 đã descope, t64 probe-failed, t76 marker bị gỡ) đều giải thích rõ trạng thái và hệ quả nên vẫn tự nhất quán, đủ để người mới hành động mà không cần đoán. Điểm trừ nhỏ: "S1#7" là ký hiệu nội bộ không được định nghĩa ngay trong thông điệp, nhưng vì đường thay thế (ghi decisions.jsonl) đã đầy đủ tự thân nên không chặn hiểu next-step.
    - operational-feasibility: PASS — Mọi thông điệp (BLOCKED lẫn NOTE) đều nêu rõ lý do chặn và cho đúng 2 lối ra cụ thể: chạy bước "S1#7 (phản biện context sạch)" để sinh gap-probe.md, HOẶC ghi entry descope với cú pháp JSON đầy đủ y hệt vào decisions.jsonl — không phải lời nhắc mơ hồ. Các case đặc biệt (t70 đã descope, t64 probe-failed, t76 gỡ marker) còn giải thích thêm ngữ cảnh và hệ quả của từng lựa chọn, cùng "Gate-1 lifecycle reference" và cờ bypass hợp pháp đi kèm ở case bị chặn. Người mới có đủ thông tin hành động ngay (biết chạy bước nào, hoặc chép đúng cú pháp entry nào) mà không cần suy đoán.
    - spec-alignment: PASS — Every BLOCKED/NOTE message pairs the violation with a concrete, actionable next step: "Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"type":"descope","decision":"bỏ gap-probe — <lý do>"}" — giving an exact command-equivalent path plus the literal JSON shape to write, so a newcomer isn't left guessing. BLOCKED cases additionally show the absolute file path, the Gate-1 lifecycle reference, and the emergency bypass var (ACCEPTANCE_GATE_BYPASS=1), covering the "what do I do now" question from multiple angles. Cases like t70/t64 that are informational (decision already recorded, or probe already failed) correctly explain the state rather than force an action, which is appropriate since no action is pending.
  human_override:        # T3 (risk_tier=T3): BẮT BUỘC — human tự đọc evidence/hook-messages.txt rồi điền "<name> <date>" ở đây dù panel đã PASS đồng thuận; hook chặn nâng verdict tổng thể lên PASS tới khi dòng này có giá trị thật

- eval: E7
  run_id: minted-gap-probe-presence-hook-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

- eval: E8
  run_id: minted-gap-probe-presence-hook-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

- eval: E9
  run_id: minted-gap-probe-presence-hook-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-07-26T04:01:44Z
  output: |
      PASS: T77-silent

    Results: 81 passed, 0 failed

**Regression suites khác (repo-wide, KHÔNG map vào AC/eval cụ thể — chạy để
xác nhận diff không phá vỡ phần còn lại của kit):**

- `bash tests/scripts/run-tests.sh` — exit 0, tail: "PASS: U01 / Results: 238 passed, 0 failed", baseline: n-a.
- `bash tests/plugins/run-tests.sh` — exit 0, tail: "PASS: P36 gap_probe_expected is emitted ONLY by the flow that runs gap-probe / Results: all plugin tests passed", baseline: n-a.
- `bash scripts/sync-plugin-packages.sh --check` — exit 0, tail: "plugins/ mirror in sync.", baseline: n-a.

Cả ba đều là regression-guard bình thường (không đặc thù cho feature này) nên
không đưa vào bảng Eval/`## Analyst` ở trên.

## Analyst

carried tu round 1 — baseline khong do lai round nay (P2: evals.yaml không
đổi từ lần đo baseline gần nhất; `run-log.jsonl` dòng `kind:"baseline"` của
round này mang `carried_from_round: 1`, cùng `evals_hash` với dòng baseline
round 1). Vì vậy mọi block eval máy ở trên ghi `baseline: n-a` cho ROUND NÀY
— giá trị đo thật (`green`) vẫn nằm nguyên ở round 1, không lặp lại đo ở đây.

E1, E2, E3, E4, E5, E7, E8, E9 — cả 8 eval script chạy qua
`bash tests/hooks/run-tests.sh` KẾ THỪA nguyên trạng non-discriminating đã
ghi ở round 1: xanh trên CẢ HEAD lẫn diffBase (bộ test khi đó 74 case, round 2
lên 77, nay 81 sau khi round-2-fix + case t76 mới — số case tăng KHÔNG đồng
nghĩa với việc đã đo lại A/B, chỉ là round này chạy suite mới trên HEAD).
Khuyến nghị đã ghi ở round 1 (đọc thủ công từng case fixture tại Gate 2 để
xác nhận assertion thật sự chạm đúng nhánh hook mới, không phải suite xanh
chung chung) vẫn CHƯA được thực hiện — chuyển tiếp sang round này, chưa
resolve; không phải finding mới của round 3.

## Variance

none — every multi-run eval is uniform (không eval nào có trường `runs` > 1;
cả 4 lệnh máy đều `runs: 1`, `variance: false`, nên không áp dụng `pass_rate`).

## Iterations

Round 1: E1, E2, E3, E4, E5, E7, E8, E9 pass ngay ở lần chạy đầu (exit 0,
74/74 trên `bash tests/hooks/run-tests.sh`); E6 (judgment, panel 3 lens)
đề xuất PASS đồng thuận nhưng contract `risk_tier: T3` bắt buộc human tự
chấm trực tiếp trên mọi judgment item bất kể verdict của panel — verdict
tổng thể giữ nguyên PENDING-JUDGMENT. Review pass (adversarial-verify) sau
round 1 tìm 8 finding (3 high/4 medium/1 low) — quay lại implementation sửa
cả 8 trước khi verify lại.

Round 2: cả 8 finding round 1 đã sửa xong tại commit `a2947d5`
("fix(s3-r2): sửa cả 8 finding của S4 round 1"), `hook-messages.txt` sinh
lại sau đó tại commit `8ca5f88` (thêm case t74). E1-E5/E7-E9 vẫn PASS,
nay 77/77 (thêm T73-T75 + GPP1/GPP2 phủ đúng F2/F6/F4/F7 round 1); E6 được
panel chấm LẠI trên evidence 6-case cập nhật → vẫn PASS đồng thuận 3/3 lens,
không dissent. Review pass round 2 (adversarial-verify trên diff đã sửa)
tìm thêm 9 finding MỚI (2 high/5 medium/2 low), không finding nào trong 9
cái này trùng lại 8 finding round 1. Verdict tổng thể GIỮ NGUYÊN
`PENDING-JUDGMENT` — không phải vì có eval fail hay finding round 2 chặn,
mà vì `risk_tier: T3` vẫn bắt buộc human tự chấm trực tiếp E6.

Round 3: 5/9 finding round 2 đã sửa xong (+ descope N3 được cho dấu vết)
tại commit `9447c6a` ("fix(s3-r3): 5 finding của S4 round 2 + descope N3
có dấu vết"); `hook-messages.txt` sinh lại tại commit `987fd83`
("chore(s4-r3): sinh lại hook-messages.txt — thêm case t76: gỡ marker vẫn
chặn + ghi vết"). E1-E5/E7-E9 vẫn PASS, nay 81/81 (test T77-silent + case
mới t76). E6 được panel chấm LẠI trên evidence cập nhật (inputs_hash đổi so
round 2, KHÔNG carried) → vẫn PASS đồng thuận 3/3 lens, không dissent. Review
pass round 3 (adversarial-verify trên diff sau fix) tìm thêm 9 finding MỚI
(2 high/3 medium/4 low — xem `review-findings.md`), tách biệt hoàn toàn với
9 finding round 2 — bao gồm 2 lỗ risk_tier chưa từng bị phát hiện trước đó
(hạ tier trong đúng lần ghi tiến cổng tháo sạch guard không dấu vết; leo tier
SAU khi qua Cổng 1 không bao giờ được xét lại) và xác nhận lại lỗ kênh NOTE
stderr+exit-0 (item #7 review-findings round 2, vẫn CHƯA vá). Verdict tổng
thể GIỮ NGUYÊN `PENDING-JUDGMENT` — không phải vì có eval fail hay finding
round 3 chặn, mà vì `risk_tier: T3` vẫn bắt buộc human tự chấm trực tiếp E6
(xem `human_override` ở block E6 phía trên); 9 finding round 3 là input bổ
sung cho Gate 2, không tự động hạ verdict.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
