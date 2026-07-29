---
schema_version: 2
feature_slug: gap-probe-presence-hook
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 58b613d5befdde68ff0fdefeba10b641ad23e864
# bypass_ack:
human_signoff: Manh Phan 2026-07-28
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
  run_id: minted-gap-probe-presence-hook-E1-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E2
  run_id: minted-gap-probe-presence-hook-E2-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E3
  run_id: minted-gap-probe-presence-hook-E3-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E4
  run_id: minted-gap-probe-presence-hook-E4-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E5
  run_id: minted-gap-probe-presence-hook-E5-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E6
  run_id: minted-gap-probe-presence-hook-E6-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E7
  run_id: minted-gap-probe-presence-hook-E7-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E8
  run_id: minted-gap-probe-presence-hook-E8-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E9
  judged_by: judge panel (3 lens, fresh context) — carried tu round 6, inputs khong doi (inputs_hash khop), khong cham lai; rationale xem round 6
  proposal: PASS
  votes:
    - domain-correctness: PASS (r6)
    - operational-feasibility: PASS (r6)
    - spec-alignment: PASS (r6)
  human_override: Manh Phan 2026-07-28

- eval: E10
  run_id: minted-gap-probe-presence-hook-E10-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E11
  run_id: minted-gap-probe-presence-hook-E11-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E12
  run_id: minted-gap-probe-presence-hook-E12-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E13
  run_id: minted-gap-probe-presence-hook-E13-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E14
  run_id: minted-gap-probe-presence-hook-E14-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-28T08:00:00Z
  output: |
      PASS: RL10d

      Results: 497 passed, 0 failed

- eval: E15
  run_id: minted-gap-probe-presence-hook-E15-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E16
  run_id: minted-gap-probe-presence-hook-E16-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T08:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

      Results: all plugin tests passed

- eval: E17
  run_id: minted-gap-probe-presence-hook-E17-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E18
  run_id: minted-gap-probe-presence-hook-E18-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E19
  run_id: minted-gap-probe-presence-hook-E19-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:30:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval.

- eval: E20
  run_id: minted-gap-probe-presence-hook-E20-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T08:00:00Z
  output: |
      PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

      Results: all plugin tests passed

- eval: E21
  run_id: minted-gap-probe-presence-hook-E21-r11
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-28T08:00:00Z
  output: |
      PASS: RL10d

      Results: 497 passed, 0 failed

## Analyst

- `bash tests/scripts/run-tests.sh`: E14, E21
- `bash tests/plugins/run-tests.sh`: E16, E20

## Variance

none — every multi-run eval is uniform (không eval nào mang field `runs` > 1; toàn bộ deterministic).

## Iterations

Round 1: 20/20 eval máy (E1-E8, E10-E21) PASS lần chạy đầu — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 304/304 test xanh, đến hết GPM20h) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) xanh làm regression-guard rộng hơn. Cả hai suite mang eval feature đều xanh trên diffBase (baseline: green — non-discriminating, xem `## Analyst`). E9 (judgment, risk_tier T3) nhận đề xuất PASS đồng thuận 3/3 lens (domain-correctness, operational-feasibility, spec-alignment) từ judge panel fresh-context, nhưng `human_override` bắt buộc theo luật T3 còn trống — chưa trả về implementation, verdict tổng PENDING-JUDGMENT chờ Gate 2.

Round 2: cùng 20 eval máy (E1-E8, E10-E21) PASS lại nguyên vẹn — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 304/304 test xanh, đến GPM20h) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39[acceptance-init/SKILL.md:modes]). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` là carried từ round 1. E9 (judgment, risk_tier T3) nhận lại panel 3-lens PASS đồng thuận (domain-correctness, operational-feasibility, spec-alignment) fresh-context, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2.

Round 3: cùng 20 eval máy (E1-E8, E10-E21) PASS lại nguyên vẹn — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 304/304 test xanh, đến GPM20h) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39[acceptance-init/SKILL.md:modes]). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3) nhận lại panel 3-lens PASS đồng thuận (domain-correctness, operational-feasibility, spec-alignment) fresh-context, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2.

Round 4: chỉ E16, E20 đo lại tươi — `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh, đến P39[acceptance-init/SKILL.md:modes]), run_id mới (`-r4`); 18 eval máy còn lại (E1-E8, E10-E15, E17-E19, E21) là carry-forward từ round 3 (P1 — delta staleness không chạm paths của các eval đó round này), giữ nguyên run_id/verified_at của round 3. Regression-guard rộng hơn round này: `bash tests/scripts/run-tests.sh` (304/304 test xanh), `bash tests/hooks/run-tests.sh` (51/51), `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) — cả ba đều xanh, không phát hiện lệch từ thay đổi chạm E16/E20. Baseline KHÔNG đo lại round này (P2); mỗi block eval máy đo mới (E16, E20) ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3): panel carried từ round 3 (P3 — inputs không đổi, hash khớp, không chấm lại), đề xuất PASS 3/3 lens vẫn giữ nguyên, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống round này → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2.

Round 5: contract đã ký lần trước (round 4, verified_commit 834eae8, human_signoff Manh Phan 2026-07-26) nhưng nhiều commit sau đó (994f9a6..900a52e, feature "premerge-rules-ledger" — bao gồm `fix: 5 finding S4 round 1/2` chạm `scripts/pre-merge-check.sh`, `tests/scripts/run-tests.sh`, `tests/hooks/run-tests.sh`) đã đổi các file dùng chung ngoài `_acceptance/`, khiến evidence cũ trở nên stale (verified_commit không còn khớp HEAD) — re-verify toàn bộ round này trên HEAD mới `900a52ee9399f83b0c34b5798b22419f2605ee97`. Cả 20 eval máy (E1-E8, E10-E21) đo lại tươi (run_id mới `-r5`) và PASS nguyên vẹn — `bash tests/scripts/run-tests.sh` (18 eval, exit 0, 459 passed/0 failed — số test tổng tăng so với round 1-4 vì các test mới của feature premerge-rules-ledger cùng nằm trong suite này, nhưng không có test nào của gap-probe-presence-hook bị ảnh hưởng) và `bash tests/plugins/run-tests.sh` (2 eval, exit 0, toàn bộ plugin test xanh). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard rộng hơn — không phát hiện lệch từ các thay đổi ngoài phạm vi. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3) được chấm lại tươi round này bởi judge panel fresh-context (không carried) — đồng thuận PASS 3/3 lens (domain-correctness, operational-feasibility, spec-alignment) với rationale đầy đủ, nhưng `human_override` bắt buộc theo luật T3 chưa được điền lại (contract downgrade về `implemented` khi phát hiện drift theo quy ước resume) → verdict tổng PENDING-JUDGMENT, chờ Gate 2 con người xác nhận lại trên bản evidence mới.

Round 6: evidence round 5 (verified_commit `900a52ee9399f83b0c34b5798b22419f2605ee97`) lại stale — commit `e8dcada` ("fix: 4 nợ leftover trước khi ký", nằm trong khoảng 900a52e..89fa742 cùng hai commit evidence-only của feature khác `301c487`/`89fa742`) chạm `scripts/pre-merge-check.sh` VÀ `tests/scripts/run-tests.sh` (file dùng chung ngoài `_acceptance/`, không nằm trong `risk_tiers.t1_skip_globs`) — re-verify toàn bộ round này trên HEAD mới `89fa742e7e1b028ccffbed3d3a3abef2060a6e4f`. 18 eval máy của `bash tests/scripts/run-tests.sh` (E1-E8, E10-E15, E17-E19, E21) đo lại tươi (run_id mới `-r6`) và PASS nguyên vẹn, 460 passed/0 failed (tăng 1 so với round 5's 459 — `e8dcada` thêm case mới cho RL11c parser enforcement; không có test nào của gap-probe-presence-hook bị ảnh hưởng). E16, E20 (`bash tests/plugins/run-tests.sh`) là carry-forward từ round 5 (P1 — delta round này không chạm paths plugin), giữ nguyên run_id/verified_at của round 5 (`-r5`, `2026-07-27T08:20:00Z`). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard rộng hơn — không phát hiện lệch từ thay đổi ngoài phạm vi. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy mới đo ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3) được chấm lại tươi round này bởi judge panel fresh-context (inputs_hash đổi so với round 5, không carried) — đồng thuận PASS 3/3 lens (domain-correctness, operational-feasibility, spec-alignment) với rationale đầy đủ, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống → verdict tổng giữ nguyên PENDING-JUDGMENT, chờ Gate 2 con người xác nhận lại trên bản evidence mới.

Round 7: evidence round 6 (verified_commit `89fa742e7e1b028ccffbed3d3a3abef2060a6e4f`) lại stale — commit `3be6be8` ("fix(docs): sàn version --no-t1-escape là 1.22.0+, KHÔNG phải 1.21.0+ — finding HIGH round 6") chạm `.github/workflows/gate.yml` VÀ `commands/acceptance-init.md` (file dùng chung ngoài `_acceptance/`, không nằm trong `risk_tiers.t1_skip_globs`; `GUIDE.md` cũng đổi trong cùng commit nhưng NẰM trong `t1_skip_globs` nên không tính là stale-trigger) — re-verify round này trên HEAD mới `092e85775576be3e494dfb3b272f5642a3016682`. Chỉ `E16` (`bash tests/plugins/run-tests.sh`) đo lại tươi (run_id mới `-r7`) và PASS nguyên vẹn — "PASS: P49 description gọi Codex giữ bản sắc Codex, không phải bản sao Claude" / "Results: all plugin tests passed". 18 eval máy còn lại của `bash tests/scripts/run-tests.sh` (E1-E8, E10-E15, E17-E19, E21) là carry-forward từ round 6 (P1 — delta round này chỉ đổi docs + comment workflow, không chạm `lib/gap-probe.js` hay logic `pre-merge-check.sh`), giữ nguyên run_id/verified_at của round 6. `E20` tiếp tục carry-forward từ round 5 (P1 — vẫn không bị chạm). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard rộng hơn — không phát hiện lệch từ thay đổi ngoài phạm vi. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3): panel carried từ round 6 (P3 — inputs không đổi, hash khớp, không chấm lại), đề xuất PASS 3/3 lens vẫn giữ nguyên, nhưng `human_override` bắt buộc theo luật T3 vẫn còn trống → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2. Review adversarial-verify round này bắt 3 finding mới (1 medium, 2 low) — xem `review-findings.md`: README.md dạy sai hành vi `--base` không resolve được (nói "skip + clean" trong khi cùng diff này đã đổi thành VIOLATION[scope] + exit 2 — medium); đoạn cảnh báo push-job trong `commands/acceptance-init.md` (và 2 bản mirror) lặp lại nguyên văn chính nó thay vì hợp nhất fix round 6 (low); snippet push-job mới trong `GUIDE.md` thiếu `fetch-depth: 0` nên trên shallow checkout `--base "$(git rev-parse HEAD~1)"` xẹp thành `--base ""`, tắt im lặng cả gap-probe lẫn t1-escape (low).

Round 8: evidence round 7 (verified_commit `092e85775576be3e494dfb3b272f5642a3016682`, ký round 7 tại commit `f93d686`) lại stale — commit `775d887` ("fix: đóng chip nợ 33ca1add — giá trị phạm vi RỖNG nổ to, pin RL5b, dedupe acceptance-init", đóng nợ chip task_33ca1add khai ở round 7 review cùng finding README/GUIDE round 7) chạm `scripts/pre-merge-check.sh` VÀ `tests/scripts/run-tests.sh` VÀ `commands/acceptance-init.md` (file dùng chung ngoài `_acceptance/`, không nằm trong `risk_tiers.t1_skip_globs`) — re-verify toàn bộ round này trên HEAD mới `28e61a83af887165a030e5da389adf33b5d33091`. 18 eval máy của `bash tests/scripts/run-tests.sh` (E1-E8, E10-E15, E17-E19, E21) đo lại tươi (run_id mới `-r8`) và PASS nguyên vẹn, 473 passed/0 failed (tăng 13 so với round 7's 460 — `775d887` thêm case RL14a/b/c cho `--base` rỗng / `PRE_MERGE_BASE` set-rỗng / `--slug` rỗng, đúng lớp finding round 7 nêu). E13 (AC-12, đường `--base`) đổi hành vi kỳ vọng theo cùng chip: `PRE_MERGE_BASE` set-rỗng / `--base` rỗng nay exit 2 (RL14) thay vì rơi về nhánh NOTE cũ; đường KHÔNG-set `PRE_MERGE_BASE` vẫn giữ nguyên NOTE (TE18k không đổi) — case mới nằm trong 473/0 xanh. `E16` (`bash tests/plugins/run-tests.sh`) cũng đo lại tươi (run_id mới `-r8`) và PASS nguyên vẹn — "PASS: P49 description gọi Codex giữ bản sắc Codex, không phải bản sao Claude" / "Results: all plugin tests passed" (cùng đợt fix dedupe câu cảnh báo version-floor lặp lại trong template acceptance-init hai harness, thuộc phạm vi P39). `E20` tiếp tục carry-forward từ round 5 (P1 — `775d887` không chạm paths của P38/gate-card require lib). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh làm regression-guard rộng hơn — không phát hiện lệch từ thay đổi ngoài phạm vi. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3): panel carried từ round 6 (P3 — inputs không đổi, hash khớp, không chấm lại), đề xuất PASS 3/3 lens vẫn giữ nguyên round này → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2. Review adversarial-verify round này bắt 2 finding mới (1 medium, 1 low) + 1 finding chưa adversarial-verify (refuter chết) — xem `review-findings.md`: `sync-plugin-packages.sh` chỉ validate `$1`, tham số thừa (`--write --check`) âm thầm chạy nhánh WRITE và xoá drift đã tiêm (medium); dòng `VIOLATION [scope]` mới của `pre-merge-check.sh` là VIOLATION duy nhất đi ra stderr thay vì stdout như mọi VIOLATION khác trong script (low); guard `PRE_MERGE_BASE` rỗng chạy trước vòng parse `--base` nên vẫn nổ exit 2 kể cả khi đã truyền `--base` hợp lệ tường minh — chưa adversarial-verify.

Round 9: evidence round 8 (verified_commit `28e61a83af887165a030e5da389adf33b5d33091`, ký round 8 tại commit `853b74b`) lại stale — feature khác "premerge-rules-ledger" đi tiếp một vòng round 9 riêng của nó (`1335ed9` → `e1bfcf4` → `c6bf3e6` → `59ee5a7` → `3009c7e`) và trong đó `1335ed9` ("fix: 3 finding round 8 — guard env-rỗng phán sau parse, sync chặn argv thừa, VIOLATION [scope] về stdout") ĐÓNG cả 3 finding mà round 8 của chính feature này nêu (2 đã adversarial-verify + 1 chưa) — chạm `scripts/pre-merge-check.sh`, `plugins/acceptance-gate/scripts/pre-merge-check.sh`, `scripts/sync-plugin-packages.sh`, `tests/scripts/run-tests.sh`, `tests/plugins/run-tests.sh` (file dùng chung ngoài `_acceptance/`, không nằm trong `risk_tiers.t1_skip_globs`) — re-verify toàn bộ round này trên HEAD mới `3009c7ee1256e384e0d3ecb14e688264c8aa84f8`. 18 eval máy của `bash tests/scripts/run-tests.sh` (E1-E8, E10-E15, E17-E19, E21) đo lại tươi (run_id mới `-r9`) và PASS nguyên vẹn, 497 passed/0 failed (tăng 24 so với round 8's 473 — các case mới đến từ chuỗi fix/finding round 9 của "premerge-rules-ledger" cùng nằm trong suite dùng chung; không có test nào riêng của gap-probe-presence-hook bị ảnh hưởng, hành vi 3 AC liên quan `pre-merge-check.sh` — AC-1/AC-11/AC-12/AC-16/AC-17 — giữ nguyên). `bash tests/hooks/run-tests.sh` (51/51) tiếp tục xanh. `bash tests/plugins/run-tests.sh` chạy làm regression-guard rộng hơn round này (thêm case P50 "argv thừa exit 2 + nêu tên tham số" cho `sync-plugin-packages.sh`, đúng finding medium round 8 vừa đóng) nhưng KHÔNG gán lại cho E16/E20 — E16 tiếp tục carry-forward từ round 8 (P1 — delta round này không chạm phạm vi template P39 hai harness), E20 tiếp tục carry-forward từ round 5 (P1 — vẫn không chạm phạm vi P38/gate-card require lib). `bash scripts/sync-plugin-packages.sh --check` xanh, mirror đồng bộ. Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); mỗi block eval máy đo mới ghi `baseline: n-a`, danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3): panel carried từ round 6 (P3 — inputs không đổi, hash khớp, không chấm lại), đề xuất PASS 3/3 lens vẫn giữ nguyên round này → verdict tổng giữ nguyên PENDING-JUDGMENT chờ Gate 2. Review adversarial-verify round này KHÔNG bắt finding mới (0) — cả 3 finding round 8 (2 verified + 1 unverified) đã đóng bởi `1335ed9` trước khi round này bắt đầu; xem `review-findings.md`. (Sau round này, con người ký `human_override` cho E9 tại commit `aaf845e` — "signoff(gap-probe-presence-hook): ký lại sau chip 33ca1add" — nâng verdict tổng lên PASS trên bản evidence pin ở `3009c7e`.)

Round 10: evidence round 9 (verified_commit `3009c7ee1256e384e0d3ecb14e688264c8aa84f8`, ký PASS tại commit `aaf845e`) lại stale — SAU khi ký, feature khác "premerge-rules-ledger" đóng chip 33ca1add rồi release: `2ef1285` ("release(acceptance-gate): 1.22.1 — đợt gia cố phạm-vi/bộ-lọc (chip 33ca1add)") bump version ở 4 manifest `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json`, `plugins/acceptance-gate/.codex-plugin/plugin.json`, rồi `26af229` ("fix(release): description 1.22.1 thôi hứa hardening không ship — sync-plugin-packages.sh là tooling nội bộ repo, không nằm trong gói", finding LOW round 10 của feature premerge-rules-ledger) sửa tiếp cùng 4 manifest đó — cả hai commit đều chạm file dùng chung ngoài `_acceptance/`, không nằm trong `risk_tiers.t1_skip_globs` (phần còn lại của `26af229` chỉ chạm `_acceptance/premerge-rules-ledger/*`, nằm trong `_acceptance/` nên không tính) — re-verify round này trên HEAD mới `e537754326c90b45caa547c0bfc32a33babdf263`. Cả 20 eval máy (E1-E8, E10-E21) là carry-forward nguyên vẹn (P1 — delta round này chỉ đổi version string trong manifest, không chạm `lib/gap-probe.js`, `scripts/pre-merge-check.sh`, hay bất kỳ path nào 20 eval này phụ thuộc): 18 eval của `bash tests/scripts/run-tests.sh` (E1-E8, E10-E15, E17-E19, E21) giữ nguyên run_id/verified_at của round 9; `E16` tiếp tục carry-forward từ round 8; `E20` tiếp tục carry-forward từ round 5. Bốn lệnh suite chạy lại thuần làm regression-guard xác nhận không có lệch từ 2 commit version-bump: `bash tests/scripts/run-tests.sh` (497 passed/0 failed, không đổi so với round 9 — không có test case mới), `bash tests/hooks/run-tests.sh` (51/51), `bash tests/plugins/run-tests.sh` (toàn bộ plugin test xanh, đến P50 "argv thừa exit 2 + nêu tên tham số; mode đơn vẫn xanh"), `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ). Baseline KHÔNG đo lại round này (P2 — evals.yaml không đổi từ lần đo baseline cuối); danh sách non-discriminating ở `## Analyst` tiếp tục carried từ round 1. E9 (judgment, risk_tier T3): panel carried từ round 6 (P3 — inputs không đổi, hash khớp, không chấm lại), đề xuất PASS 3/3 lens vẫn giữ nguyên; `human_override` mà con người ký ở round 9 (`aaf845e`) áp cho evidence pin tại `3009c7e` — evidence đó nay stale nên report round này pin lại trên HEAD mới và trường `human_override` của E9 reset về trống, chờ con người ký lại tại Gate 2 trên bản evidence mới → verdict tổng PENDING-JUDGMENT. Review adversarial-verify round này KHÔNG bắt finding mới (0) — delta giữa round 9 và round 10 chỉ là version bump + sửa description ở feature khác, không chạm logic nào trong phạm vi gap-probe-presence-hook; xem `review-findings.md`.

Round 11: evidence round 10 (verified_commit `e537754326c90b45caa547c0bfc32a33babdf263`, đã từng được ký PASS `Manh Phan 2026-07-27`) lại stale — feature khác "s4-scope-triage" đi hết một vòng round riêng của nó rồi ký Cổng 2 (round 6 PASS, commit `b195a26`); chuỗi commit trong khoảng đó (`3f168b7`, `b76d28a`, `23e0a38`, `054ed91`, `3a31688`, `247f2b5`, `6e7c1bb`, `79adba6`, `9940741`, …) chạm `scripts/gate-card.js` (+32 dòng, thêm khối out-of-contract), `lib/out-of-contract.js` (file mới, +79 dòng), `tests/plugins/run-tests.sh` (+322 dòng, test mới đến P56), `tests/workflows/acceptance-verify.test.mjs` (+382 dòng) — tất cả là file dùng chung ngoài `_acceptance/`, không nằm trong `risk_tiers.t1_skip_globs` — re-verify round này trên HEAD mới `2b149990c84136a9d0121e2b59ee1f8681eb7c03`. 4 eval máy đo lại tươi (run_id mới `-r11`) và PASS nguyên vẹn: `E14`, `E21` qua `bash tests/scripts/run-tests.sh` (đến case "PASS: RL10d", 497 passed/0 failed — không đổi số so với round 9/10, không có case mới chạm phạm vi 2 eval này) và `E16`, `E20` qua `bash tests/plugins/run-tests.sh` (đến case "PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)", toàn bộ plugin test xanh — E20 (AC-19, gate-card require lib/gap-probe.js) và E21 (AC-20, parity 2 lối vào) đo lại tươi vì chính `scripts/gate-card.js` — file cả hai eval này khảo sát — vừa đổi). 16 eval máy còn lại (E1-E8, E10-E13, E15, E17-E19) là carry-forward từ round 9 (P1 — delta round này không chạm paths của các eval đó). `bash tests/hooks/run-tests.sh` (51/51) và `bash scripts/sync-plugin-packages.sh --check` (mirror đồng bộ) tiếp tục xanh; `bash tests/workflows/run-tests.sh` (16 passed/0 failed, execute-parallel) chạy thêm làm regression-guard cho suite mới của s4-scope-triage — không phát hiện lệch từ thay đổi ngoài phạm vi gap-probe-presence-hook. Baseline đo lại cho 4 eval fresh: cả `E14`/`E21`/`E16`/`E20` đều `green` trên diffBase (non-discriminating round này — xem `## Analyst`; 2 lệnh suite này xanh trên cả HEAD lẫn baseline vì mã gap-probe-presence-hook không đổi trong delta gây stale). E9 (judgment, risk_tier T3): panel tiếp tục carried từ round 6 (P3 — inputs không đổi, hash khớp, không chấm lại), đề xuất PASS 3/3 lens giữ nguyên; `human_override` reset về trống trên bản evidence pin mới (giống mọi lần re-verify trước) → verdict tổng giữ nguyên PENDING-JUDGMENT, chờ Gate 2 con người ký lại. Review adversarial-verify round này bắt phân loại phạm vi HỎNG (triage-failed) — 17 finding không phân loại được (4 high, 9 medium, 4 low, tất cả nằm ngoài 21 AC của contract T3 này — thuộc scope-triage/gate-card/out-of-contract mới thêm bởi feature "s4-scope-triage") + 1 finding chưa adversarial-verify (medium); xem `review-findings.md`. Không có finding nào bị máy tự sửa; người xem lại toàn bộ ở Gate 2.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

## Re-pin machine-only — 2026-07-29

`verified_commit` được cập nhật lên `ee6b72b` **mà KHÔNG chạy lại vòng verify
đầy đủ**. Lý do và mức phủ, để người đọc sau không hiểu rộng hơn:

- Feature `premerge-unjudged-pass` chạm `scripts/pre-merge-check.sh` và
  `tests/scripts/run-tests.sh`, làm evidence của slug này stale theo luật
  staleness. Đây là **staleness coupling** ở nội bộ kit: mọi thay đổi lõi cổng
  làm hết hạn evidence của mọi feature cũ, không liên quan tới chất lượng thay
  đổi. Người duyệt chọn re-pin machine-only thay vì 4 vòng S4 (đúng nguyên tắc
  đã duyệt trong kế hoạch loop-economics, mục `s4-stop-rule`).
- **ĐÃ chạy lại:** toàn bộ eval MÁY của slug này. Machine lane ở `ee6b72b` do 5
  agent tươi chạy, sha nhất quán cả 5, tất cả exit 0 —
  `tests/scripts/run-tests.sh` (588 case), `tests/plugins/run-tests.sh`,
  `tests/workflows/run-tests.sh`, `tests/hooks/run-tests.sh`,
  `sync-plugin-packages.sh --check`.
- **KHÔNG chạy lại:** eval `judgment` và vòng review/refute. `human_override` +
  `human_signoff` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã
  phán về mã mới của cổng.

### Re-pin lần 2 — 2026-07-29, do đổi `description` của manifest

`verified_commit` lên `29356bb`. Nguyên nhân stale lần này **không đổi hành vi
nào của cổng**: commit `29356bb` chỉ thêm một câu release-notes vào trường
`description` của 3 manifest. Không code path nào đọc trường đó.

Luật staleness lọc theo **đường dẫn**, và `plugin.json` cố ý KHÔNG nằm trong
`t1_skip_globs` (manifest khai được `hooks`, nên miễn trừ trọn file là mở lỗ —
đề xuất đó đã bị từ chối, hồ sơ ở `.out-of-scope/`). Nên nó không phân biệt được
"đổi lõi cổng" với "sửa một dòng quảng cáo".

- **ĐÃ chạy lại:** toàn bộ eval MÁY, machine lane ở `29356bb` do 5 agent tươi
  chạy, sha nhất quán cả 5, tất cả exit 0 (588 case scripts · 51 hooks ·
  plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký + `human_override`
  sẵn có giữ nguyên hiệu lực.

### Re-pin lần 3 — 2026-07-29, do fix loop-stall của feature-loop (1.17.1)

`verified_commit` lên `57bff68`. Nguyên nhân stale: commit `57bff68` sửa
SKILL.md của feature-loop (cả hai harness) để vòng lặp tự đi — bất biến dừng,
S3 dispatch S4 ngay, REJECT tự động 3 round, in `/goal` bắt buộc — kèm bump
manifest 1.17.0→1.17.1 và re-pin 3 literal version trong
`tests/plugins/run-tests.sh` (P04/P22).

Khác lần 2, lần này staleness **bắt đúng một nửa**: SKILL.md là văn xuôi điều
phối (không code path nào của cổng đọc nó), nhưng `tests/plugins/run-tests.sh`
là một phần machine lane THẬT — suite đổi thì bằng chứng suite phải chạy lại.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `57bff68` do 5 agent tươi
  chạy (mỗi slug một agent), sha nhất quán cả 5, tất cả exit 0 (588 case
  scripts · 51 hooks · plugins pass · workflows 159+16 · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã
  phán về hành vi mới của feature-loop 1.17.1.

### Re-pin lần 4 — 2026-07-29, do feature cross-feature-claim-index

`verified_commit` lên `58b613d`. Nguyên nhân stale: feature
cross-feature-claim-index thêm `feature-loop/scripts/claim-scan.mjs`, sửa
SKILL.md feature-loop (input thứ 5 cho gap-probe, 1.18.0), thêm 2 file test
mới trong `tests/workflows/` và bump manifest. Staleness bắt ĐÚNG MỘT NỬA
như lần 3: SKILL/scanner không chạm hành vi cổng, nhưng suite workflows +
plugins đổi thật nên bằng chứng suite phải chạy lại.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `58b613d` do 5 agent
  tươi chạy (mỗi slug một agent), sha nhất quán cả 5, tất cả exit 0
  (588 scripts · 51 hooks · plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là
  đã phán về claim-scan hay feature-loop 1.18.0.
