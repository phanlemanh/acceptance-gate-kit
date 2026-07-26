---
schema_version: 2
feature_slug: premerge-rules-ledger
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6a5bdbfe60344d86b93f4d94d50c16f8979b5bd0
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
passed, incl. `PASS: P48 chu ky ledger_mark khop EXPECTED`), `bash
scripts/sync-plugin-packages.sh --check` (`plugins/ mirror in sync.`).

## Evidence

- eval: E1
  run_id: minted-premerge-rules-ledger-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E2
  run_id: minted-premerge-rules-ledger-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E3
  run_id: minted-premerge-rules-ledger-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E4
  run_id: minted-premerge-rules-ledger-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E5
  run_id: minted-premerge-rules-ledger-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E6
  run_id: minted-premerge-rules-ledger-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E7
  run_id: minted-premerge-rules-ledger-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E8
  run_id: minted-premerge-rules-ledger-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E9
  run_id: minted-premerge-rules-ledger-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E10
  criterion: AC-10
  judged_by: 3-lens panel (domain-correctness, operational-feasibility, spec-alignment) — fresh-context judge subagent
  proposal: PASS
  rationale_summary: |
    All three lenses independently confirm the NOTE block at line 20 (immediately
    after the VIOLATION line) states in plain language that a `VIOLATION [ledger]`
    is an internal fault of the pre-merge gate (not the user's change), names the
    missing block (gap-probe, matching line 18's "luật gap-probe không chạy và
    không khai tắt"), and directs the next step (report to the kit maintainer
    with the full run output; do not edit the feature to route around it) — all
    three requirements of AC-10 answered inline, no kit background knowledge
    required.
  votes:
    - domain-correctness: PASS — Dòng 20 (NOTE ngay sau VIOLATION) nói thẳng bằng ngôn ngữ tự nhiên: đây là "lỗi NỘI TẠI của cổng pre-merge... KHÔNG phải lỗi trong thay đổi của bạn", nêu đích danh khối thiếu là gap-probe (khớp với dòng 18 "luật gap-probe không chạy và không khai tắt"), và chỉ rõ bước kế tiếp là "báo maintainer của kit kèm TOÀN BỘ output lần chạy này; đừng sửa feature của bạn để né nó". Cả ba yêu cầu của câu hỏi (biết đây là lỗi nội tại, biết khối nào thiếu, biết bước kế) đều được trả lời tường minh ngay trong thông điệp, không cần kiến thức nền về kit.
    - operational-feasibility: PASS — Khối NOTE nói thẳng, không cần biết thuật ngữ kit: "VIOLATION [ledger] là lỗi NỘI TẠI của cổng pre-merge ... KHÔNG phải lỗi trong thay đổi của bạn" — trả lời rõ câu hỏi (1). Dòng VIOLATION ngay phía trên nêu đích danh khối thiếu: "luật gap-probe không chạy và không khai tắt" — trả lời (2). NOTE kết bằng hành động cụ thể: "báo maintainer của kit kèm TOÀN BỘ output lần chạy này; đừng sửa feature của bạn để né nó" — trả lời (3) và còn chặn trước hành vi sai (tự sửa feature). Cả ba yếu tố nằm liền nhau, không cần suy luận hay đọc thêm tài liệu kit.
    - spec-alignment: PASS — Dòng 18 nêu đích danh khối thiếu ("luật gap-probe không chạy và không khai tắt"); dòng 20 nói thẳng bằng ngôn ngữ phổ thông đây là lỗi NỘI TẠI của cổng pre-merge, không phải lỗi trong thay đổi của người dùng, và chỉ rõ bước kế tiếp là báo maintainer của kit kèm toàn bộ output — không cần biết thuật ngữ nội bộ kit mới hiểu được. Cả ba yêu cầu của AC-10 (nhận biết lỗi nội tại, biết khối nào thiếu, biết bước kế) đều được đáp ứng tường minh trong cùng một khối thông điệp.
  human_override:
  # T3 contract: human_override is MANDATORY on this judgment item regardless
  # of the panel's PASS proposal. Gate 2 human must personally verify and fill
  # "<name> <date>" before this report can be upgraded to PASS.

- eval: E11
  run_id: minted-premerge-rules-ledger-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E12
  run_id: minted-premerge-rules-ledger-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

- eval: E13
  run_id: minted-premerge-rules-ledger-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T05:45:00Z
  output: |
    PASS: RL10d

    Results: 449 passed, 0 failed

## Analyst

Non-discriminating evals (green on both HEAD and the diffBase baseline via
`bash tests/scripts/run-tests.sh`): E1, E2, E3, E4, E5, E6, E7, E8, E9, E11,
E12, E13.

This is a whole-suite baseline run rather than per-eval isolation — the
`run-tests.sh` script runs all RL-prefixed cases (and the rest of the suite)
in one process, so a case-by-case "old code vs new code" diff was not
separable per eval id in this round; the suite-level `baseline: green`
reflects that the runner itself pre-existed the feature and continues to
pass. The individual RL1-RL12 cases (see `expected` per eval above) are each
designed to assert NEW behaviour introduced by this feature (ledger marking,
declared-off provenance, the ledger-count chokepoint, etc.) and several carry
their own positive/negative pairs (e.g. RL2/RL2ctrl, RL9/RL9ctrl) that do
discriminate within the suite itself. Recommend a future round captures a
true per-eval A/B (checkout diffBase, run only the RLn case, restore) if this
distinction becomes load-bearing for a gate decision.

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
report stays PENDING-JUDGMENT pending `human_override` at Gate 2.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
