---
schema_version: 2
feature_slug: premerge-rules-ledger
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0422f08dd82aeb6f5a5acebf353576f9f26157c7
# bypass_ack:
human_signoff:
---

# Evidence Report: premerge-rules-ledger

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
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | judgment | PASS (proposal — T3 mandatory human verdict pending) |
| E11 | AC-10 | test | PASS |
| E12 | AC-11 | test | PASS |
| E13 | AC-12 | test | PASS |

Regression-guard suites (green on both sides, not eval-mapped, listed for
completeness — not counted under `## Analyst`): `bash tests/hooks/run-tests.sh`
(51 passed, 0 failed), `bash tests/plugins/run-tests.sh` (all plugin tests
passed, incl. `PASS: P49 description gọi Codex giữ bản sắc Codex, không phải
bản sao Claude`), `bash scripts/sync-plugin-packages.sh --check` (`plugins/
mirror in sync.`).

## Evidence

- eval: E1
  run_id: minted-premerge-rules-ledger-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E2
  run_id: minted-premerge-rules-ledger-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E3
  run_id: minted-premerge-rules-ledger-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E4
  run_id: minted-premerge-rules-ledger-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E5
  run_id: minted-premerge-rules-ledger-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E6
  run_id: minted-premerge-rules-ledger-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E7
  run_id: minted-premerge-rules-ledger-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E8
  run_id: minted-premerge-rules-ledger-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E9
  run_id: minted-premerge-rules-ledger-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E10
  criterion: AC-10
  judged_by: 3-lens panel (domain-correctness, operational-feasibility, spec-alignment) — fresh-context judge subagent
  proposal: PASS
  rationale_summary: |
    All three lenses independently confirm the NOTE block immediately after
    the VIOLATION line states in plain language that a `VIOLATION [ledger]`
    is an internal fault of the pre-merge gate (not the user's change), names
    the missing block (gap-probe, "luật gap-probe không chạy và không khai
    tắt"), and directs the next step (report to the kit maintainer with the
    full run output; do not edit the feature to route around it) — all three
    requirements of AC-10 answered inline, no kit background knowledge
    required. Same conclusion as round 1's panel, re-run fresh this round.
  votes:
    - domain-correctness: PASS — Thông điệp có dòng NOTE giải thích rõ ràng bằng ngôn ngữ phổ thông: nêu tên khối luật thiếu ("luật gap-probe không chạy và không khai tắt"), khẳng định đây là lỗi NỘI TẠI của cổng pre-merge chứ KHÔNG phải lỗi trong thay đổi của người dùng, và chỉ bước kế tiếp cụ thể (báo maintainer kèm toàn bộ output, không tự sửa feature). Cả ba tiêu chí của câu hỏi đều được đáp ứng trực tiếp trong văn bản, không cần suy luận thêm hay biết bối cảnh kit.
    - operational-feasibility: PASS — Dòng 18 nêu rõ khối thiếu (gap-probe: "không chạy và không khai tắt"); dòng 20 nói thẳng đây là lỗi NỘI TẠI của cổng pre-merge, không phải lỗi trong thay đổi của người dùng, và chỉ rõ bước kế tiếp là báo maintainer kèm toàn bộ output, đừng tự sửa feature. Cả ba yếu tố (nội tại/không phải lỗi code của họ, khối nào thiếu, bước kế) đều có mặt tường minh bằng ngôn ngữ phổ thông, không cần biết thuật ngữ nội bộ của kit.
    - spec-alignment: PASS — Dòng NOTE nói thẳng "VIOLATION [ledger] là lỗi NỘI TẠI của cổng pre-merge ... KHÔNG phải lỗi trong thay đổi của bạn", nêu đích danh khối thiếu qua dòng VIOLATION ngay trên ("luật gap-probe không chạy và không khai tắt"), và chỉ rõ bước kế "báo maintainer của kit kèm TOÀN BỘ output lần chạy này; đừng sửa feature của bạn để né nó". Cả ba yếu tố AC-10 hỏi (lỗi nội tại, khối nào thiếu, bước kế báo maintainer) đều có mặt tường minh, không cần suy diễn thêm.
  human_override:
  # T3 contract: human_override is MANDATORY on this judgment item regardless
  # of the panel's PASS proposal. Gate 2 human must personally verify and fill
  # "<name> <date>" before this report can be upgraded to PASS.

- eval: E11
  run_id: minted-premerge-rules-ledger-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E12
  run_id: minted-premerge-rules-ledger-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

- eval: E13
  run_id: minted-premerge-rules-ledger-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T06:25:00Z
  output: |
    PASS: RL10d

    Results: 463 passed, 0 failed

## Analyst

carried tu round truoc — baseline khong do lai round nay (P2: evals.yaml
khong doi tu lan baseline cuoi). Danh sach eval khong-phan-biet cho round
nay: none — không đo lại baseline nên không có kết luận mới; xem round 1
(E1-E9, E11-E13 non-discriminating trên baseline whole-suite) cho phân tích
gốc, vẫn còn giá trị vì evals.yaml không đổi.

## Variance

none — no stochastic evals (`runs` > 1) in this round; all twelve machine
evals are deterministic single-run cases.

## Iterations

Round 1: All 13 machine evals (E1-E9, E11-E13) passed on the first run
(`tests/scripts/run-tests.sh`: 449 passed, 0 failed), plus regression-guard
suites `tests/hooks/run-tests.sh` (51/51), `tests/plugins/run-tests.sh` (all
green, incl. the `ledger_mark` signature parity case P48), and
`scripts/sync-plugin-packages.sh --check` (mirror in sync — no drift). The
sole judgment item, E10 (AC-10, the ledger-violation NOTE's actionability),
was reviewed by a 3-lens panel that unanimously proposed PASS; per the T3
contract this eval still requires a mandatory direct human verdict, so the
report stayed PENDING-JUDGMENT pending `human_override` at Gate 2.

Round 2: All 13 machine evals (E1-E9, E11-E13) passed again
(`tests/scripts/run-tests.sh`: 463 passed, 0 failed — case count grew from
449 since round 1, consistent with intervening fixes/tests), plus
regression-guard suites `tests/hooks/run-tests.sh` (51 passed, 0 failed,
incl. `PASS: T42`), `tests/plugins/run-tests.sh` (all plugin tests passed,
incl. `PASS: P49 description gọi Codex giữ bản sắc Codex, không phải bản sao
Claude`), and `scripts/sync-plugin-packages.sh --check` (`plugins/ mirror in
sync.`). Baseline was NOT re-measured this round (P2 — evals.yaml unchanged
since the last baseline run); every machine eval's `baseline:` field carries
`n-a` accordingly, and `## Analyst` carries forward round 1's finding. The
E10 judgment panel was re-run fresh (not carried) and again unanimously
proposed PASS with matching rationale to round 1; the T3 mandatory human
verdict is still pending, so the report stays PENDING-JUDGMENT. A parallel
adversarial review pass (see `review-findings.md`, round 2) surfaced 5 new
findings (1 HIGH, 3 MEDIUM, 1 LOW) unrelated to the machine-eval pass/fail
outcome above — none of them flip a machine eval's exit code, so they do not
change this report's verdict, but Gate 2 should read them before signing
off.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
