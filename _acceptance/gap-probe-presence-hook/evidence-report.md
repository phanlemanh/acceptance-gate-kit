---
schema_version: 2
feature_slug: gap-probe-presence-hook
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 900a52ee9399f83b0c34b5798b22419f2605ee97
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
  run_id: minted-gap-probe-presence-hook-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E2
  run_id: minted-gap-probe-presence-hook-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E3
  run_id: minted-gap-probe-presence-hook-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E4
  run_id: minted-gap-probe-presence-hook-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E5
  run_id: minted-gap-probe-presence-hook-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E6
  run_id: minted-gap-probe-presence-hook-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E7
  run_id: minted-gap-probe-presence-hook-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E8
  run_id: minted-gap-probe-presence-hook-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E9
  judged_by: judge panel (fresh context, 3-lens)
  proposal: PASS
  votes:
    - lens: domain-correctness
      verdict: PASS
      rationale: Mỗi VIOLATION/NOTE nêu rõ vật thiếu cụ thể (gap-probe.md hợp lệ, hoặc entry descope trong ledger/decisions.jsonl) và cho hai lối hành động cụ thể — chạy bước S1#7, HOẶC dán đúng template JSON entry được cung cấp sẵn — nên dù thuật ngữ "S1#7"/"ledger" là biệt ngữ nội bộ chưa giải thích, người đọc vẫn có ít nhất một đường hành động tự-đủ (viết JSON entry theo mẫu) mà không cần hiểu kit trước. feat-f/feat-g cũng nói rõ trạng thái (đã bỏ có chủ đích / probe-failed) kèm hệ quả, đủ để người đọc phân biệt "cần làm gì" với "chỉ để biết".
    - lens: operational-feasibility
      verdict: PASS
      rationale: Cả VIOLATION lẫn NOTE đều nêu rõ cái thiếu ("chưa có gap-probe.md hợp lệ và ledger không có entry descope" / "verdict là probe-failed") và cho đúng 2 lối ra cụ thể — chạy bước có tên+mô tả ("S1#7 (phản biện context sạch)"), hoặc ghi thẳng một entry JSON đầy đủ field vào decisions.jsonl (id/type/stage/at/decision/impact đã điền sẵn khuôn). Người chưa đọc kit không cần biết "S1#7" là gì vẫn có lối tác nghiệp thay thế nhờ template JSON tường minh, nên biết được cả "thiếu gì" và "làm gì tiếp".
    - lens: spec-alignment
      verdict: PASS
      rationale: Mỗi VIOLATION/NOTE nêu rõ đúng thứ đang thiếu (gap-probe.md hợp lệ hoặc entry descope trong ledger) và cho hai lối đi cụ thể — chạy bước "S1#7 (phản biện context sạch)" HOẶC tự ghi entry vào decisions.jsonl kèm schema JSON đầy đủ có thể copy-dùng ngay — nên dù không biết S1#7 là gì, người đọc vẫn có một đường hành động tự-đủ (self-contained). feat-f/feat-g phân biệt rõ trạng thái "đã descope có dấu vết" và "probe chạy fail" nên không gây nhầm case này với case khác. Điểm yếu nhỏ: thuật ngữ "S1#7" không được giải thích thêm, nhưng không cản trở vì luôn có lối thay thế tường minh đi kèm.
  human_override:        # T3: bắt buộc verdict trực tiếp từ human trên MỌI judgment item, bất kể panel đề xuất gì — điền "<name> <ISO date>" tại Gate 2

- eval: E10
  run_id: minted-gap-probe-presence-hook-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E11
  run_id: minted-gap-probe-presence-hook-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E12
  run_id: minted-gap-probe-presence-hook-E12-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E13
  run_id: minted-gap-probe-presence-hook-E13-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E14
  run_id: minted-gap-probe-presence-hook-E14-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E15
  run_id: minted-gap-probe-presence-hook-E15-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E16
  run_id: minted-gap-probe-presence-hook-E16-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: P49 description gọi Codex giữ bản sắc Codex, không phải bản sao Claude

    Results: all plugin tests passed

- eval: E17
  run_id: minted-gap-probe-presence-hook-E17-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E18
  run_id: minted-gap-probe-presence-hook-E18-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E19
  run_id: minted-gap-probe-presence-hook-E19-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

- eval: E20
  run_id: minted-gap-probe-presence-hook-E20-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: P49 description gọi Codex giữ bản sắc Codex, không phải bản sao Claude

    Results: all plugin tests passed

- eval: E21
  run_id: minted-gap-probe-presence-hook-E21-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T08:20:00Z
  output: |
    PASS: RL10d

    Results: 459 passed, 0 failed

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

Round 4: chỉ E16, E20 đo lại tươi — `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39[acceptance-init/SKILL.md:modes]), run_id mới (`-r4`); 18 eval máy còn lại (E1-E8, E10-E15, E17-E19, E21) là carry-forward từ round 3 (P1 — delta staleness không chạm paths của các eval đó round này), giữ nguyên run_id/verified_at của round 3. Regression-guard rộng hơn round này: `bash tests/scripts/run-tests.sh` (304/304 test xanh), `bash tests/hooks/run-tests.sh` (51/51), `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) — cả ba đều xanh, không phát hiện lệch từ thay đổi chạm E16/E20. Baseline KHÔNG đo lại round này (P2); mỗi block eval máy đo mới (E16, E20) ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3): panel carried từ round 3 (P3 — inputs không đổi, hash khớp, không chấm lại), đề xuất PASS 3/3 lens vẫn giữ nguyên, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống round này → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2.

Round 5: contract đã ký lần trước (round 4, verified_commit 834eae8, human_signoff Manh Phan 2026-07-26) nhưng nhiều commit sau đó (994f9a6..900a52e, feature "premerge-rules-ledger" — bao gồm `fix: 5 finding S4 round 1/2` chạm `scripts/pre-merge-check.sh`, `tests/scripts/run-tests.sh`, `tests/hooks/run-tests.sh`) đã đổi các file dùng chung ngoài `_acceptance/`, khiến evidence cũ trở nên stale (verified_commit không còn khớp HEAD) — re-verify toàn bộ round này trên HEAD mới `900a52ee9399f83b0c34b5798b22419f2605ee97`. Cả 20 eval máy (E1-E8, E10-E21) đo lại tươi (run_id mới `-r5`) và PASS nguyên vẹn — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 459 passed/0 failed — số test tổng tăng so với round 1-4 vì các test mới của feature premerge-rules-ledger cùng nằm trong suite này, nhưng không có test nào của gap-probe-presence-hook bị ảnh hưởng) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard rộng hơn — không phát hiện lệch từ các thay đổi ngoài phạm vi. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3) được chấm lại tươi round này bởi judge panel fresh-context (không carried) — đồng thuận PASS 3/3 lens (domain-correctness, operational-feasibility, spec-alignment) với rationale đầy đủ, nhưng `human_override` bắt buộc theo luật T3 chưa được điền lại (contract downgrade về `implemented` khi phát hiện drift theo quy ước resume) → verdict tổng PENDING-JUDGMENT, chờ Gate 2 con người xác nhận lại trên bản evidence mới.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
