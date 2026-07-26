---
schema_version: 2
feature_slug: gap-probe-presence-hook
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 14f7b0b4ec7ac979905f1612acc6507b64d94679
# bypass_ack:
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
| E9 | AC-9 | judgment | PENDING (panel proposal PASS — T3 requires human_override) |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-12 | script | PASS |
| E14 | AC-13 | script | PASS |
| E15 | AC-14 | script | PASS |
| E16 | AC-15 | script | PASS |
| E17 | AC-16 | script | PASS |
| E18 | AC-17 | script | PASS |
| E19 | AC-18 | script | PASS |
| E20 | AC-19 | script | PASS |
| E21 | AC-20 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-gap-probe-presence-hook-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM1: mode required + thiếu cả file lẫn descope → stdout có VIOLATION nêu slug, exit != 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E2
  run_id: minted-gap-probe-presence-hook-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM2 + GPM2b: advisory VÀ khoá vắng → stdout có NOTE, KHÔNG có VIOLATION, exit 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E3
  run_id: minted-gap-probe-presence-hook-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM3: mode off → stdout KHÔNG chứa chuỗi gap-probe nào, exit 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E4
  run_id: minted-gap-probe-presence-hook-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM4: contract T1 + mode required → KHÔNG in gì về gap-probe, exit 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E5
  run_id: minted-gap-probe-presence-hook-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM5: verdict clean và findings → im lặng ở cả required lẫn advisory, exit 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E6
  run_id: minted-gap-probe-presence-hook-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM6: gap-probe.md rỗng (touch) và verdict rác → VIOLATION ở required, exit != 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E7
  run_id: minted-gap-probe-presence-hook-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM7 + GPM7b: entry descope thường VÀ bản thụt-đầu-viết-hoa → KHÔNG violation, NOTE nêu id entry, exit 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E8
  run_id: minted-gap-probe-presence-hook-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM8: verdict probe-failed ở mode required → NOTE, KHÔNG violation, exit 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E9
  judged_by: judge panel (fresh context, 3-lens)
  proposal: PASS
  votes:
    - domain-correctness: PASS — Mỗi thông điệp nêu rõ hai phần: đang thiếu gì (thiếu gap-probe.md hợp lệ / ledger không có entry descope / verdict probe-failed / đã bỏ có chủ đích theo d-77) và phải làm gì tiếp (chạy S1#7 để sinh gap-probe.md, hoặc ghi entry decisions.jsonl kèm template JSON đầy đủ trường id/type/stage/at/decision/impact) — một người chưa đọc kit vẫn có đường dẫn hành động cụ thể dù chưa hiểu sâu ý nghĩa "S1#7"/"ledger". feat-f và feat-g là NOTE thuần thông tin, không cần hành động, và cũng diễn giải rõ ràng lý do (đã bỏ có dấu vết / probe không chạy được) nên không gây hiểu lầm là phải làm gì thêm.
    - operational-feasibility: PASS — Mỗi thông điệp (feat-b/c/f/g) đều nêu rõ trạng thái thiếu gì (không có gap-probe.md hợp lệ, không có entry descope trong ledger, hoặc probe-failed) và cho ít nhất một lối hành động không đòi hỏi biết trước về kit: ghi thẳng một entry JSON đầy đủ schema vào decisions.jsonl, hoặc chấp nhận rủi ro (feat-g), hoặc không cần làm gì vì đã có dấu vết quyết định (feat-f) — người đọc lần đầu vẫn nắm được việc cần làm tiếp theo. Điểm trừ nhỏ: nhánh khuyến nghị "Chạy bước S1#7" không giải thích S1#7 là gì/chạy ở đâu, nhưng vì nó luôn đi kèm một nhánh OR đầy đủ và tự chứa (JSON schema cụ thể), tiêu chí "biết phải làm gì tiếp" vẫn được đáp ứng.
    - spec-alignment: PASS — Mỗi thông điệp tự giải thích cái thiếu bằng ngôn ngữ thường ("chưa qua phản biện context sạch (gap-probe)") thay vì chỉ nêu mã lỗi, và cho đúng hai lối ra cụ thể: chạy bước S1#7 để sinh gap-probe.md, hoặc dán một entry decisions.jsonl với schema JSON đầy đủ (id/type/stage/at/decision/impact) — không cần biết trước kit vẫn copy-paste được. feat-f và feat-g còn nói rõ trạng thái khác nhau (đã bỏ có chủ đích vs. probe chạy lỗi) nên người đọc phân biệt được đây là NOTE thông tin hay việc cần làm.
  human_override:        # risk_tier T3: bắt buộc verdict trực tiếp từ human trên MỌI judgment item, bất kể panel đề xuất gì — điền "<name> <ISO date>" tại Gate 2

- eval: E10
  run_id: minted-gap-probe-presence-hook-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM10: contract T3 status draft và approved, mode required → KHÔNG in gì về gap-probe, exit 0 — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E11
  run_id: minted-gap-probe-presence-hook-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM11a/b + GPM11c..c6: nháy/viết hoa nhận đúng là required; sai chính tả → VIOLATION cấu hình, exit != 0, script CHẠY TIẾP (dòng tổng kết có mặt, không lỗi shell) và KHÔNG rơi về advisory — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E12
  run_id: minted-gap-probe-presence-hook-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM12: suite TỰ SINH LẠI premerge-messages.txt từ 4 fixture trong cùng lần chạy rồi diff byte-đối-byte với file trong evidence/ — lệch là FAIL. GPM12a-d giữ 4 nhãn để bắt trôi phạm vi — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E13
  run_id: minted-gap-probe-presence-hook-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM13: slug thiếu gap-probe nhưng NGOÀI diff PR → không in gì; case GPM13b: chạy không --base ở mode required → marker + VIOLATION — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E14
  run_id: minted-gap-probe-presence-hook-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM20g + GPM21[json-hong]: ledger chỉ có một dòng JSON HỎNG trông giống descope gap-probe → lib cho 'missing', pre-merge VẪN VIOLATION ở required (fail-CLOSED), decision card trên cùng ledger cũng cho 'missing' — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E15
  run_id: minted-gap-probe-presence-hook-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM18a/b: mode required + thiếu lib/gap-probe.js → VIOLATION (exit != 0) kèm marker GAP-PROBE: NOT ENFORCED; mode advisory cùng tình huống → marker + NOTE, exit 0; mode off → im hoàn toàn (GPM18c) — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E16
  run_id: minted-gap-probe-presence-hook-E16-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case P39: template config trong acceptance-init của CẢ HAI harness đều có khoá gap_probe VÀ chuỗi ba mode 'required | advisory | off' — asserted
      PASS: P39[acceptance-init/SKILL.md:modes]

    Results: all plugin tests passed

- eval: E17
  run_id: minted-gap-probe-presence-hook-E17-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM19a-f: marker in ĐÚNG MỘT dòng 'GAP-PROBE: NOT ENFORCED reason=' và dòng tổng kết cuối khai đã tắt; thiếu --base cũng đi qua CÙNG lối ra đó — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E18
  run_id: minted-gap-probe-presence-hook-E18-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM15/15b/15c/15d (giữ từ v2): lịch sử rời nhau khiến git diff thoát != 0 → mode required cho VIOLATION + marker, KHÔNG in 'pre-merge-check: clean' — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E19
  run_id: minted-gap-probe-presence-hook-E19-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM14/14a/14b/14c (giữ từ v2): _acceptance/ nằm ở pkg/ (không phải git root) + slug T3 trong diff thiếu gap-probe → VẪN VIOLATION [feat-x], không phải marker — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

- eval: E20
  run_id: minted-gap-probe-presence-hook-E20-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case P38a/P38b: gate-card.js require lib/gap-probe.js VÀ không còn literal regex descope nào của riêng nó — asserted
      PASS: P39[acceptance-init/SKILL.md:modes]

    Results: all plugin tests passed

- eval: E21
  run_id: minted-gap-probe-presence-hook-E21-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-26T09:10:00Z
  output: |
    case GPM21: bảng 8 đầu vào chạy qua CẢ HAI lối vào THẬT (pre-merge end-to-end và decision card Cổng 1) → khớp TỪNG ca, in dòng LỆCH nêu đích danh ca lệch — asserted
      PASS: GPM20h

    Results: 304 passed, 0 failed

## Analyst

carried tu round truoc — baseline khong do lai round nay (P2, evals.yaml khong doi tu lan baseline cuoi). Danh sach non-discriminating duoi day la danh sach carried tu round 1 (khi baseline duoc do lan cuoi); khong co phep do moi round nay:

- `bash tests/scripts/run-tests.sh`: E1, E2, E3, E4, E5, E6, E7, E8, E10, E11, E12, E13, E14, E15, E17, E18, E19, E21
- `bash tests/plugins/run-tests.sh`: E16, E20

`bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) là suite xanh-cả-hai-phía, regression-guard bình thường, không liệt kê ở trên theo quy ước.

## Variance

none — every multi-run eval is uniform (không eval nào mang field `runs` > 1; toàn bộ deterministic).

## Iterations

Round 1: 20/20 eval máy (E1-E8, E10-E21) PASS lần chạy đầu — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 304/304 test xanh, đến hết GPM20h) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) xanh làm regression-guard rộng hơn. Cả hai suite mang eval feature đều xanh trên diffBase (baseline: green — non-discriminating, xem `## Analyst`). E9 (judgment, risk_tier T3) nhận đề xuất PASS đồng thuận 3/3 lens (domain-correctness, operational-feasibility, spec-alignment) từ judge panel fresh-context, nhưng `human_override` bắt buộc theo luật T3 còn trống — chưa trả về implementation, verdict tổng PENDING-JUDGMENT chờ Gate 2.

Round 2: cùng 20 eval máy (E1-E8, E10-E21) PASS lại nguyên vẹn — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 304/304 test xanh, đến GPM20h) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39[acceptance-init/SKILL.md:modes]). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` là carried từ round 1. E9 (judgment, risk_tier T3) nhận lại panel 3-lens PASS đồng thuận (domain-correctness, operational-feasibility, spec-alignment) fresh-context, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2.

Round 3: cùng 20 eval máy (E1-E8, E10-E21) PASS lại nguyên vẹn — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 304/304 test xanh, đến GPM20h) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39[acceptance-init/SKILL.md:modes]). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3) nhận lại panel 3-lens PASS đồng thuận (domain-correctness, operational-feasibility, spec-alignment) fresh-context, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
