---
schema_version: 2
feature_slug: premerge-rules-ledger
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c90c06d01d675c59058d7da14c627af7a2699055
# bypass_ack:
human_signoff: Manh Phan 2026-07-27
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

Regression-guard suites (all unmapped this round — evidence for E1-E9/E11-E13
is carried forward per P1 below, not re-attributed to a fresh run; listed for
completeness — not counted under `## Analyst`): `bash tests/scripts/run-tests.sh`
(460 passed, 0 failed, incl. `PASS: RL10d`), `bash tests/hooks/run-tests.sh`
(51 passed, 0 failed, incl. `PASS: T42`), `bash tests/plugins/run-tests.sh`
(all plugin tests passed, incl. `PASS: P49 description gọi Codex giữ bản sắc
Codex, không phải bản sao Claude`), `bash scripts/sync-plugin-packages.sh
--check` (`plugins/ mirror in sync.`).

## Evidence

- eval: E1
  criterion: AC-1
  run_id: minted-premerge-rules-ledger-E1-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E2
  criterion: AC-2
  run_id: minted-premerge-rules-ledger-E2-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E3
  criterion: AC-3
  run_id: minted-premerge-rules-ledger-E3-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E4
  criterion: AC-4
  run_id: minted-premerge-rules-ledger-E4-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E5
  criterion: AC-5
  run_id: minted-premerge-rules-ledger-E5-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E6
  criterion: AC-6
  run_id: minted-premerge-rules-ledger-E6-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E7
  criterion: AC-7
  run_id: minted-premerge-rules-ledger-E7-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E8
  criterion: AC-8
  run_id: minted-premerge-rules-ledger-E8-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E9
  criterion: AC-9
  run_id: minted-premerge-rules-ledger-E9-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E10
  criterion: AC-10
  carried: true
  carried_from_round: 4
  note: panel giu nguyen tu round 4 — inputs khong doi (inputs_hash khop), khong cham lai; rationale xem round 4
  proposal: PASS
  votes:
    - domain-correctness: PASS (r4)
    - operational-feasibility: PASS (r4)
    - spec-alignment: PASS (r4)
  human_override: Manh Phan 2026-07-27
  # T3 contract: human_override is MANDATORY on this judgment item regardless
  # of the panel's PASS proposal. Gate 2 human must personally verify and fill
  # "<name> <date>" before this report can be upgraded to PASS.

- eval: E11
  criterion: AC-10
  run_id: minted-premerge-rules-ledger-E11-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E12
  criterion: AC-11
  run_id: minted-premerge-rules-ledger-E12-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E13
  criterion: AC-12
  run_id: minted-premerge-rules-ledger-E13-r4
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T09:30:00Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

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

Round 3: All 13 machine evals (E1-E9, E11-E13) passed again
(`tests/scripts/run-tests.sh`: 459 passed, 0 failed — case count vs round 2's
463 reflects intervening fixes to the suite between rounds, not a coverage
loss; no eval failed), plus regression-guard suites `tests/hooks/run-tests.sh`
(51 passed, 0 failed, incl. `PASS: T42`), `tests/plugins/run-tests.sh` (all
plugin tests passed, incl. `PASS: P49 description gọi Codex giữ bản sắc
Codex, không phải bản sao Claude`), and `scripts/sync-plugin-packages.sh
--check` (`plugins/ mirror in sync.`). Baseline was again NOT re-measured
this round (P2 — evals.yaml still unchanged since the last baseline run);
every machine eval's `baseline:` field carries `n-a` accordingly, and
`## Analyst` continues to carry forward round 1's finding. The E10 judgment
panel was re-run fresh (not carried) and again unanimously proposed PASS
with matching rationale to rounds 1 and 2; the T3 mandatory human verdict is
still pending, so the report stays PENDING-JUDGMENT. This round's commits
(0422f08, 004bc34, 71c42fa) landed round-2's HIGH/MEDIUM fixes (see round 2
history above) plus a docs-only model-routing note; a fresh adversarial
review pass this round (see `review-findings.md`, round 3) surfaced 3 new
findings (2 MEDIUM, 1 LOW) — a residual enforcement-parser parity gap on the
`enforcement : off` (space-before-colon) and duplicate-key variants, found
under the same "sửa theo LỚP" lens that flagged round 2's HIGH, plus one
unrelated low-severity shell quoting slip in the test suite itself. None of
these flip a machine eval's exit code, so they do not change this report's
verdict, but Gate 2 should read them before signing off.

Round 4: All 13 machine evals (E1-E9, E11-E13) passed again
(`tests/scripts/run-tests.sh`: 460 passed, 0 failed — case count vs round 3's
459 reflects a small intervening test addition, not a coverage loss; no eval
failed), plus regression-guard suites `tests/hooks/run-tests.sh` (51 passed,
0 failed, incl. `PASS: T42`), `tests/plugins/run-tests.sh` (all plugin tests
passed, incl. `PASS: P49 description gọi Codex giữ bản sắc Codex, không phải
bản sao Claude`), and `scripts/sync-plugin-packages.sh --check` (`plugins/
mirror in sync.`). Baseline was again NOT re-measured this round (P2 —
evals.yaml still unchanged since the last baseline run); every machine
eval's `baseline:` field carries `n-a` accordingly, and `## Analyst`
continues to carry forward round 1's finding. The E10 judgment panel was
re-run fresh (not carried) and again unanimously proposed PASS with matching
rationale to rounds 1-3; the T3 mandatory human verdict is still pending, so
the report stays PENDING-JUDGMENT. This round's commit (71c42fa, docs-only
model-routing note) landed since round 3; a fresh adversarial review pass
this round (see `review-findings.md`, round 4) surfaced 1 new finding
(MEDIUM) — the new GUIDE.md fail-closed CI snippet for the `enforcement`
key parses `enforcement:\s*off` narrower than the two real parsers it must
mirror (hook regex and `pre-merge-check.sh`'s own bash regex), missing the
`enforcement : off` (space-before-colon) variant that round-3's new test
RL11c pins as legitimately valid-off — same "sửa theo LỚP" class of gap as
round 3's finding, this time surfacing in prose/docs rather than in a
script. This does not flip a machine eval's exit code, so it does not
change this report's verdict, but Gate 2 should read it before signing off.
That same round-4 write also landed the fix itself (`GUIDE.md:636` regex
widened to `^enforcement[[:space:]]*:[[:space:]]*off...`, mirrored into
`plugins/acceptance-gate/GUIDE.md`), so the finding is already resolved on
the tree this round verifies.

Round 5: No source paths touched by this round's diff intersect any of the
13 evals' inputs (P1 delta-staleness), so E1-E9/E11-E13 and the E10 judgment
panel are all carried forward from round 4 unchanged — `run_id`/`verified_at`
copied verbatim from the round-4 run-log entries, panel `inputs_hash`
unchanged (`93581f38...66646b27879`), no re-attribution. As a sanity check
(not eval-mapped — `evals: []` on every command this round) the full suite
was re-run fresh anyway: `tests/scripts/run-tests.sh` 460 passed / 0 failed
(same count as round 4 — no drift), `tests/hooks/run-tests.sh` 51 passed / 0
failed (incl. `PASS: T42`), `tests/plugins/run-tests.sh` all plugin tests
passed (incl. `PASS: P49`), `scripts/sync-plugin-packages.sh --check`
reports `plugins/ mirror in sync.` — all four green, confirming no
regression entered between round 4's verified commit and this round's
(`e8dcadac2` → `c90c06d01`), an interval that includes an unrelated feature's
work (`t1-escape-event-scope` rounds 6/8) landing on the shared tree.
Baseline was again NOT re-measured this round (P2 unchanged); `## Analyst`
continues to carry forward round 1's finding, words-only, no eval marked
green-on-both this round since none were freshly measured. No new
adversarial-review findings this round (`review-findings.md` round 5 is
empty); round 4's sole finding (GUIDE.md enforcement-regex parity) was
already fixed in the same commit that produced round 4's own evidence write
(`89fa742`), confirmed present on this round's verified commit. The T3
mandatory human verdict on E10 is still pending, so the report stays
PENDING-JUDGMENT.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
