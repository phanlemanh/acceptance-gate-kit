---
schema_version: 2
feature_slug: gap-probe-presence-hook
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 89fa742e7e1b028ccffbed3d3a3abef2060a6e4f
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
  run_id: minted-gap-probe-presence-hook-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E2
  run_id: minted-gap-probe-presence-hook-E2-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E3
  run_id: minted-gap-probe-presence-hook-E3-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E4
  run_id: minted-gap-probe-presence-hook-E4-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E5
  run_id: minted-gap-probe-presence-hook-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E6
  run_id: minted-gap-probe-presence-hook-E6-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E7
  run_id: minted-gap-probe-presence-hook-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E8
  run_id: minted-gap-probe-presence-hook-E8-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E9
  judged_by: judge panel (fresh context, 3-lens)
  proposal: PASS
  votes:
    - lens: domain-correctness
      verdict: PASS
      rationale: Mỗi thông điệp nêu rõ cái thiếu bằng ngôn ngữ thường ("không có gap-probe.md hợp lệ và ledger không có entry descope" / "gap-probe verdict là probe-failed") và cho ít nhất một hướng đi cụ thể — với feat-b/feat-c là JSON mẫu đầy đủ trường để ghi thẳng vào decisions.jsonl, không cần biết kit là gì. feat-f/feat-g là NOTE thuần thông tin (đã có dấu vết quyết định, hoặc chỉ cảnh báo rủi ro) nên không bắt buộc có bước hành động chi tiết. Điểm trừ nhỏ: nhãn "S1#7" xuất hiện không kèm giải thích nó là lệnh/tài liệu gì, nhưng vì luôn có nhánh thay thế tự-đủ (viết entry JSON) nên người đọc lần đầu vẫn có đường đi rõ ràng.
    - lens: operational-feasibility
      verdict: PASS
      rationale: Mỗi thông điệp nêu rõ cái đang thiếu (gap-probe.md hợp lệ hoặc entry descope trong ledger) và cho hai lối ra cụ thể — chạy bước gọi tên "S1#7", hoặc dán đúng một dòng JSON mẫu đầy đủ field vào decisions.jsonl — người đọc không cần biết nội bộ kit vẫn có thể thực hiện lối thứ hai. Các case NOTE (feat-f, feat-g) còn giải thích thêm bối cảnh (đã bỏ có chủ đích / probe chạy lỗi) nên phân biệt được "đã quyết định" với "chưa từng chạy". Điểm trừ nhỏ: thuật ngữ "ledger", "S1#7" không được diễn giải tại chỗ, nhưng không cản trở hành động vì JSON mẫu đã tự đủ nghĩa.
    - lens: spec-alignment
      verdict: PASS
      rationale: Cả VIOLATION (feat-b) và NOTE (feat-c) đều nêu rõ cái thiếu ("không có gap-probe.md hợp lệ và ledger không có entry descope") và cho đúng hai lối ra cụ thể — chạy bước S1#7 để sinh gap-probe.md, hoặc ghi entry vào decisions.jsonl kèm sẵn schema JSON mẫu — người chưa đọc kit vẫn có đủ tên file, tên bước và cấu trúc entry để hành động mà không cần tra thêm tài liệu. feat-f và feat-g cũng tự giải thích trạng thái (đã descope có chủ đích theo ledger d-77; gap-probe chạy lỗi nên merge là merge-chưa-phản-biện) kèm gợi ý hành động hoặc chấp nhận rủi ro, không để lại câu hỏi mở "thiếu gì".
  human_override:        # T3: bắt buộc verdict trực tiếp từ human trên MỌI judgment item, bất kể panel đề xuất gì — điền "<name> <ISO date>" tại Gate 2

- eval: E10
  run_id: minted-gap-probe-presence-hook-E10-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E11
  run_id: minted-gap-probe-presence-hook-E11-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E12
  run_id: minted-gap-probe-presence-hook-E12-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E13
  run_id: minted-gap-probe-presence-hook-E13-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E14
  run_id: minted-gap-probe-presence-hook-E14-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E15
  run_id: minted-gap-probe-presence-hook-E15-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E16
  run_id: minted-gap-probe-presence-hook-E16-r5
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-07-27T08:20:00Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta khong cham paths cua eval.

- eval: E17
  run_id: minted-gap-probe-presence-hook-E17-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E18
  run_id: minted-gap-probe-presence-hook-E18-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E19
  run_id: minted-gap-probe-presence-hook-E19-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

- eval: E20
  run_id: minted-gap-probe-presence-hook-E20-r5
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-07-27T08:20:00Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta khong cham paths cua eval.

- eval: E21
  run_id: minted-gap-probe-presence-hook-E21-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:55:00Z
  output: |
    PASS: RL10d

    Results: 460 passed, 0 failed

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

Round 6: evidence round 5 (verified_commit `900a52ee9399f83b0c34b5798b22419f2605ee97`) lại stale — commit `e8dcada` ("fix: 4 nợ leftover trước khi ký", nằm trong khoảng 900a52e..89fa742 cùng hai commit evidence-only của feature khác `301c487`/`89fa742`) chạm `scripts/pre-merge-check.sh` VÀ `tests/scripts/run-tests.sh` (file dùng chung ngoài `_acceptance/`, không nằm trong `risk_tiers.t1_skip_globs`) — re-verify toàn bộ round này trên HEAD mới `89fa742e7e1b028ccffbed3d3a3abef2060a6e4f`. 18 eval máy của `bash tests/scripts/run-tests.sh` (E1-E8, E10-E15, E17-E19, E21) đo lại tươi (run_id mới `-r6`) và PASS nguyên vẹn, 460 passed/0 failed (tăng 1 so với round 5's 459 — `e8dcada` thêm case mới cho RL11c parser enforcement; không có test nào của gap-probe-presence-hook bị ảnh hưởng). E16, E20 (`bash tests/plugins/run-tests.sh`) là carry-forward từ round 5 (P1 — delta round này không chạm paths plugin), giữ nguyên run_id/verified_at của round 5 (`-r5`, `2026-07-27T08:20:00Z`). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard rộng hơn — không phát hiện lệch từ thay đổi ngoài phạm vi. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy mới đo ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3) được chấm lại tươi round này bởi judge panel fresh-context (inputs_hash đổi so với round 5, không carried) — đồng thuận PASS 3/3 lens (domain-correctness, operational-feasibility, spec-alignment) với rationale đầy đủ, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống → verdict tổng PENDING-JUDGMENT, chờ Gate 2 con người xác nhận lại trên bản evidence mới.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
