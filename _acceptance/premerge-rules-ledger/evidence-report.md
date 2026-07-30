---
schema_version: 2
feature_slug: premerge-rules-ledger
verdict: PASS
failed_evals: []        # REJECT only, e.g. [E2, E5]
reason:                 # BLOCKED only
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9d01b830e0db240097122b5849fdb07732399fac
# bypass_ack:
human_signoff: Manh Phan 2026-07-28
---

# Evidence Report: premerge-rules-ledger

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
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | judgment | PASS |
| E11 | AC-10 | script | PASS |
| E12 | AC-11 | script | PASS |
| E13 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-premerge-rules-ledger-E1-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-premerge-rules-ledger-E2-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-premerge-rules-ledger-E3-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-premerge-rules-ledger-E4-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-premerge-rules-ledger-E5-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-premerge-rules-ledger-E6-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-premerge-rules-ledger-E7-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-premerge-rules-ledger-E8-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-premerge-rules-ledger-E9-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E10
  judged_by: judge panel (3 lens) — carried, inputs unchanged since round 4
  verdict: PASS
  panel_note: panel giu nguyen tu round 4 — inputs khong doi, khong cham lai; rationale xem round 4
  votes:
    - domain-correctness: PASS (r4)
    - operational-feasibility: PASS (r4)
    - spec-alignment: PASS (r4)
  human_override: Manh Phan 2026-07-28

- eval: E11
  run_id: minted-premerge-rules-ledger-E11-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-premerge-rules-ledger-E12-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-premerge-rules-ledger-E13-r9
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T15:00:00Z
  carried_from_round: 9
  note: carry-forward tu round 9 — delta khong cham paths cua eval

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — không có eval nào mang field runs>1 trong round này; mọi eval carry-forward là deterministic (0/N hoặc N/N không áp dụng vì không re-run)
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
PENDING-JUDGMENT. Gate 2 subsequently reviewed and signed off this round
(`human_signoff: Manh Phan 2026-07-27`, verdict upgraded to PASS,
`verified_commit: c90c06d01d675c59058d7da14c627af7a2699055`), recorded in
git as `c95464a`.

Round 6: All 13 machine evals (E1-E9, E11-E13) re-ran fresh this round via
`bash tests/scripts/run-tests.sh` — 473 passed, 0 failed (incl. `PASS:
RL10d`; case count vs round 5's 460 reflects intervening test additions from
unrelated feature work landing on the shared tree, not a coverage loss; no
eval failed), plus regression-guard suites `tests/hooks/run-tests.sh` (51
passed, 0 failed, incl. `PASS: T42`), `tests/plugins/run-tests.sh` (all
plugin tests passed, incl. `PASS: P49 description gọi Codex giữ bản sắc
Codex, không phải bản sao Claude`), and `scripts/sync-plugin-packages.sh
--check` (`plugins/ mirror in sync.`). Baseline was again NOT re-measured
this round (P2 — evals.yaml still unchanged since the last baseline run);
every machine eval's `baseline:` field carries `n-a` accordingly, and
`## Analyst` continues to carry forward round 1's finding. The E10 judgment
panel remains carried from round 4 (inputs_hash unchanged:
`93581f38...66646b27879`), not re-chấm; the T3 mandatory human verdict for
this round's write is still pending (`human_override:` blank), so the
report reverts to PENDING-JUDGMENT for this fresh round despite round 5
having been signed off — a new round always requires its own Gate 2
signoff. No new adversarial-review findings this round (`review-findings.md`
round 6 lists none); no prior-round findings were reopened.

Round 7: All 13 machine evals (E1-E9, E11-E13) re-ran fresh this round via
`bash tests/scripts/run-tests.sh` — 490 passed, 0 failed (incl. `PASS:
RL10d`; case count vs round 6's 473 reflects intervening test additions from
this round's own RL15a/b/c work tightening the `--slug`/`--base` scope
parser — see AC-8/E8 — not a coverage loss; no eval failed), plus
regression-guard suites `tests/hooks/run-tests.sh` (51 passed, 0 failed,
incl. `PASS: T42`), `tests/plugins/run-tests.sh` (all plugin tests passed,
incl. `PASS: P50 argv thừa exit 2 + nêu tên tham số; mode đơn vẫn xanh`), and
`scripts/sync-plugin-packages.sh --check` (`plugins/ mirror in sync.`).
Baseline was again NOT re-measured this round (P2 — evals.yaml still
unchanged since the last baseline run); every machine eval's `baseline:`
field carries `n-a` accordingly, and `## Analyst` continues to carry forward
round 1's finding. The E10 judgment panel remains carried from round 4
(inputs_hash unchanged: `93581f38...66646b27879`), not re-chấm; the T3
mandatory human verdict for this round's write is still pending
(`human_override:` blank), so the report is PENDING-JUDGMENT again for this
fresh round — a new round always requires its own Gate 2 signoff. No new
adversarial-review findings this round (`review-findings.md` round 7 lists
none); no prior-round findings were reopened on this round's verified
commit (`e1bfcf42d07000e88ea0ff88672dab080de9da6d`).

Round 8: All 13 machine evals (E1-E9, E11-E13) re-ran fresh this round via
`bash tests/scripts/run-tests.sh` — 495 passed, 0 failed (incl. `PASS:
RL10d`; case count vs round 7's 490 reflects intervening test additions on
the shared tree, not a coverage loss; no eval failed), plus regression-guard
suites `tests/hooks/run-tests.sh` (51 passed, 0 failed, incl. `PASS: T42`),
`tests/plugins/run-tests.sh` (all plugin tests passed, incl. `PASS: P50 argv
thừa exit 2 + nêu tên tham số; mode đơn vẫn xanh`), and
`scripts/sync-plugin-packages.sh --check` (`plugins/ mirror in sync.`).
Baseline was again NOT re-measured this round (P2 — evals.yaml still
unchanged since the last baseline run); every machine eval's `baseline:`
field carries `n-a` accordingly, and `## Analyst` continues to carry forward
round 1's finding. The E10 judgment panel remains carried from round 4
(inputs_hash unchanged: `93581f38...66646b27879`), not re-chấm; the T3
mandatory human verdict for this round's write is still pending
(`human_override:` blank), so the report is PENDING-JUDGMENT again for this
fresh round — a new round always requires its own Gate 2 signoff. A fresh
adversarial-review pass this round (see `review-findings.md`, round 8)
surfaced 1 new finding (MEDIUM) — two sibling cases in the round-7 RL15d
guard group (RL15D2 `--slug .`, RL15D3 `--slug ..`) assert only the bare
exit code, not the guard's actual message, unlike their sibling RL15D1 and
every other case in the same round-7 batch (RL14a/b/c/e, RL15a/b/c, RL5b,
TE18i2) — the same negative-assertion-alone gap CLAUDE.md's invariant #4
calls out, this time two cases sitting in the same file the invariant's own
history log already names. This does not flip a machine eval's exit code,
so it does not change this report's verdict, but Gate 2 should read it
before signing off.

Round 9: All 13 machine evals (E1-E9, E11-E13) re-ran fresh this round via
`bash tests/scripts/run-tests.sh` — exit 0, all tests passed (runner output
confirms completion of the RL13 gap-probe-advisory, RL12 node-vắng-advisory,
and RL10 ledger-generation suites, all PASS; this round's fresh output
format did not surface a "<N> passed, 0 failed" tail like prior rounds — the
exit-0 + all-tests-passed confirmation is what the machine result carried),
plus regression-guard suites `tests/hooks/run-tests.sh` (51 passed, 0
failed, incl. `PASS: T42`), `tests/plugins/run-tests.sh` (all plugin tests
passed, incl. `PASS: P50 argv thừa exit 2 + nêu tên tham số; mode đơn vẫn
xanh`), and `scripts/sync-plugin-packages.sh --check` (`plugins/ mirror in
sync.`). This round landed the fix for round 8's sole finding: RL15D2
(`--slug .`) and RL15D3 (`--slug ..`) now pin the guard's actual message
(`RL15d2m`/`RL15d3m`) instead of asserting only the bare exit code — closing
the "sửa theo LỚP" gap round 8 flagged against CLAUDE.md's invariant #4;
`review-findings.md` round 9 is empty (the fix is confirmed present on this
round's verified commit, no new findings surfaced). Baseline was again NOT
re-measured this round (P2 — evals.yaml still unchanged since the last
baseline run); every machine eval's `baseline:` field carries `n-a`
accordingly, and `## Analyst` continues to carry forward round 1's finding.
The E10 judgment panel remains carried from round 4 (inputs_hash unchanged:
`93581f38...66646b27879`), not re-chấm; the T3 mandatory human verdict for
this round's write is still pending (`human_override:` blank), so the
report is PENDING-JUDGMENT again for this fresh round — a new round always
requires its own Gate 2 signoff. Verified commit this round:
`59ee5a7ac1ae75fc15d66f109c2c75c4a9514a5d`.

Round 10: No source paths touched by this round's diff intersect any of the
13 evals' inputs (P1 delta-staleness), so E1-E9/E11-E13 are all carried
forward from round 9 unchanged — `run_id`/`verified_at` copied verbatim from
the round-9 run-log entries, no re-attribution — and the E10 judgment panel
remains carried from round 4 (inputs_hash unchanged:
`93581f38...66646b27879`), not re-chấm. As a sanity check (not eval-mapped —
`evals: []` on every command this round) the full suite was re-run fresh
anyway: `tests/scripts/run-tests.sh` 497 passed / 0 failed (incl. `PASS:
RL10d` — case count vs round 9 reflects intervening test additions from
unrelated feature work on the shared tree, not a coverage loss),
`tests/hooks/run-tests.sh` 51 passed / 0 failed (incl. `PASS: T42`),
`tests/plugins/run-tests.sh` all plugin tests passed (incl. `PASS: P50 argv
thừa exit 2 + nêu tên tham số; mode đơn vẫn xanh`),
`scripts/sync-plugin-packages.sh --check` reports `plugins/ mirror in
sync.` — all four green, confirming no regression entered between round 9's
verified commit and this round's (`59ee5a7ac1a` → `2ef12850c9c`). Baseline
was again NOT re-measured this round (P2 — evals.yaml still unchanged since
the last baseline run); every carried machine eval's `baseline:` field
carries `n-a` accordingly, and `## Analyst` continues to carry forward round
1's finding. The T3 mandatory human verdict for this round's write is still
pending (`human_override:` blank), so the report is PENDING-JUDGMENT again
for this fresh round — a new round always requires its own Gate 2 signoff,
even though round 9 was previously signed off (see git `853b74b`/`f93d686`
for unrelated features' signoffs landing on the shared tree between rounds).
A fresh adversarial-review pass this round (see `review-findings.md`, round
10) surfaced 2 new findings (both LOW) — (1) the 1.22.1 plugin descriptions
across all three package manifests promise `sync-plugin-packages.sh`
argv-hardening that is explicitly excluded from every shipped package
(`scripts/sync-plugin-packages.sh:44`), the same
description-vs-shipped-surface mismatch class P49 was added to police, but a
variant P49 does not catch; (2) the hook's `enforcement` regex accepts a
multiline YAML value (`enforcement:\n  off`) via JS `/m` semantics while
`pre-merge-check.sh`'s line-based grep does not, an uncovered variant of the
RL11c parity table — confirmed benign/fail-closed by repro (the ledger can
only stay erroneously ON, never silently OFF, under this divergence), so it
is not a merge-blocking gap. Neither finding flips a machine eval's exit
code, so neither changes this report's verdict, but Gate 2 should read both
before signing off. Verified commit this round:
`2ef12850c9c83be5762959ad269e2aaadec2f52c`.

Round 11: No source paths touched by this round's diff intersect any of the
13 evals' inputs (P1 delta-staleness), so E1-E9/E11-E13 are all carried
forward from round 9 unchanged — `run_id`/`verified_at` copied verbatim from
the round-9 run-log entries, no re-attribution — and the E10 judgment panel
remains carried from round 4 (inputs_hash unchanged:
`93581f38...66646b27879`), not re-chấm. As a sanity check (not eval-mapped —
`evals: []` on every command this round) the full suite was re-run fresh
anyway: `tests/scripts/run-tests.sh` 497 passed / 0 failed (incl. `PASS:
RL10d` — same count as round 10, no drift), `tests/hooks/run-tests.sh` 51
passed / 0 failed (incl. `PASS: T42`), `tests/plugins/run-tests.sh` all
plugin tests passed (incl. `PASS: P50 argv thừa exit 2 + nêu tên tham số;
mode đơn vẫn xanh`), `scripts/sync-plugin-packages.sh --check` reports
`plugins/ mirror in sync.` — all four green, confirming no regression
entered between round 10's verified commit and this round's
(`2ef12850c9c` → `26af2297a6d`), an interval that includes two unrelated
features' signoff commits (`853b74b`, `f93d686`) landing on the shared tree.
Baseline was again NOT re-measured this round (P2 — evals.yaml still
unchanged since the last baseline run); every carried machine eval's
`baseline:` field carries `n-a` accordingly, and `## Analyst` continues to
carry forward round 1's finding. The T3 mandatory human verdict for this
round's write is still pending (`human_override:` blank), so the report is
PENDING-JUDGMENT again for this fresh round — a new round always requires
its own Gate 2 signoff, even though round 10 was previously signed off. No
new adversarial-review findings this round (`review-findings.md` round 11
is empty); round 10's two LOW findings were not reopened or re-verified
this round (out of scope for a delta-carry-forward round — see round 10's
entry above for their standing detail; neither was fixed in the interim
commits, both remain informational-only, non-merge-blocking per round 10's
repro). Verified commit this round: `26af2297a6d5abe322d36bdc9415643099ded983`.

Round 12: staleness re-verify. Evidence from round 11 pinned
`26af2297a6d5abe322d36bdc9415643099ded983`; the `s4-scope-triage` feature
landed afterwards and touched shared gated files outside `_acceptance/`
(plugin manifests, `.github/workflows/gate.yml`, both harnesses'
acceptance-card instructions, `feature-loop/workflows/acceptance-verify.js`,
`lib/out-of-contract.js`, `scripts/gate-card.js`, `tests/plugins/**`,
`tests/workflows/**`), so the pin no longer matched HEAD. Re-verified at
`a8899d2a29faa2586fcf16ac4a29f9f049cec2d8`. None of that delta intersects any
of the 13 evals' `paths` (P1 delta-staleness), so E1-E9/E11-E13 stay carried
from round 9 with `run_id`/`verified_at` copied verbatim, and the E10 panel
stays carried from round 4 (`inputs_hash` unchanged,
`93581f38...66646b27879`). Carry here is not blind: every one of those 12
evals runs `bash tests/scripts/run-tests.sh`, and that exact command is in
`feature_loop.suite_keys`, so the underlying measurement re-executed fresh
this round regardless — only the per-eval attribution was carried. All five
suites re-ran green: `tests/scripts/run-tests.sh` 497 passed / 0 failed (same
count as rounds 10-11, no drift), `tests/hooks/run-tests.sh` 51 passed / 0
failed, `tests/plugins/run-tests.sh` all passed, `sync-plugin-packages.sh
--check` mirror in sync, `tests/workflows/run-tests.sh` all passed. Baseline
WAS re-measured this round (P2 miss): the last `kind:"baseline"` memo carried
the sentinel `evals_hash: "pending"` rather than a real digest, so it could
not match the current `c3d28050...464f1059`; the fresh pass returned an empty
non-discriminating list. Review found 10 findings, and scope-triage classified
**all 10 as out of contract** for this feature — they concern
`s4-scope-triage` (the diff under review) and its shared files, not the rules
ledger; `triageFailed: true` with `rejectFindings: []` means the machine
declined to force them into this contract and failed toward the human
instead. Cluster flag raised: 10 of 10 findings out-of-contract across 5
files. Two are `high` and are carried to the human at Gate 2 rather than
silently absorbed: (a) `s4-scope-triage` self-classified `risk_tier: T2` while
adding `lib/out-of-contract.js`, which matches `risk_tiers.t3_paths`, so its
Gate 1.5 and the T3 mandatory `human_override`-per-judgment-item rule were
both skipped; (b) `scripts/gate-card.js` drops the out-of-contract block with
no error when the writer's item shape drifts — already declared in that
feature's `## Known limits`. Verdict PENDING-JUDGMENT, awaiting `human_override`
on E10 at Gate 2. Verified commit this round:
`a8899d2a29faa2586fcf16ac4a29f9f049cec2d8`.

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

### Re-pin lần 5 — 2026-07-29, do feature claim-scan-parser-hardening

`verified_commit` lên `69e797a`. Nguyên nhân stale: feature
claim-scan-parser-hardening sửa `feature-loop/scripts/claim-scan.mjs` (đóng
lớp câm-lặng parser), thêm case test trong `tests/workflows/`, bump manifest
1.18.1 + description. Suite workflows/plugins đổi thật nên bằng chứng suite
chạy lại là đúng việc.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `69e797a` do 6 agent
  tươi chạy (mỗi slug một agent), sha nhất quán cả 6, tất cả exit 0
  (588 scripts · 51 hooks · plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên; chữ ký cũ KHÔNG được hiểu là đã phán về
  claim-scan 1.18.1.

### Re-pin — 2026-07-29, do feature findings-section-boundary

`verified_commit` lên `9d01b83`. Nguyên nhân stale: feature
findings-section-boundary thêm `lib/md-section.js` (luật ranh giới
per-section), gỡ bản sao `section()` khỏi gate-card + evidence-page, wire
runner `tests/scripts` chạy mọi `*.test.mjs`, bump acceptance-gate 1.25.0.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `9d01b83` do 7 agent
  tươi chạy (mỗi slug một agent), sha nhất quán cả 7, tất cả exit 0
  (590 scripts · 51 hooks · plugins pass · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên; chữ ký cũ KHÔNG được hiểu là đã phán về
  luật ranh giới mới.

### Re-pin lần 6 — 2026-07-30, do vá AC-regex của gate-card

`verified_commit` lên `3a80983`. Nguyên nhân stale: `scripts/gate-card.js` nới
`AC_LINE` + tách `parseAC()` — dòng AC dạng `- **AC-N (nhãn):**`,
`- **AC-N** (judgment)`, `- AC-N (nhãn):` trước đây bị bỏ CÂM, nên thẻ Cổng 1
hiện thiếu tiêu chí hoặc rỗng hẳn.

**KHÁC lần 2-4: lần này staleness bắt ĐÚNG HOÀN TOÀN.** Không được viện "không
đổi hành vi cổng" như hai lần trước — thay đổi này đổi CHÍNH cái thẻ Cổng 1
render ra. Đo tính chất trên 176 contract (2 repo): 916 → 1246 dòng AC đọc
được; **0 dòng mất**, **0 lật cờ judgment** trên dòng cả hai parser cùng đọc
được, **0 false-positive**.

Slug này KHÔNG có eval nào đụng `scripts/gate-card.js`; staleness ở đây thuần
theo ĐƯỜNG DẪN. Thẻ Cổng 1 của chính nó: 11 AC trước và sau — không đổi.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `3a80983` — 6 suite EXIT=0
  (588 scripts · 51 hooks · plugins pass · workflows pass · skills pass · codex
  pass) + `sync-plugin-packages.sh --check` EXIT=0 (mirror in sync).
  **Provenance YẾU HƠN lần 2-4:** chạy MỘT lượt trong một phiên, KHÔNG phải 5
  agent tươi độc lập mỗi slug. Sha nhất quán vì cùng một cây, không phải vì
  năm lần đo độc lập đồng ý với nhau — đọc con số này với đúng trọng lượng đó.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` sẵn có giữ nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là
  đã phán về AC-regex mới của gate-card.

### Re-pin lần 7 — 2026-07-30, do gói cảnh báo mù criterion (cùng chuỗi với lần 5)

`verified_commit` lên `afe223f`. Cùng nguyên nhân và cùng posture với lần 5
(vá AC-regex): `scripts/gate-card.js` đổi tiếp, thêm `lib/ac-line.js`. Vẫn
**KHÔNG viện được "không đổi hành vi cổng"** — gói này đổi cả cái card render ra.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `afe223f` — 6 suite EXIT=0 (592 scripts ·
  51 hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh
  --check` EXIT=0. Case đụng gate-card: P38a/b · P52 · P53 (byte-đối-byte) ·
  GPM21 · GPM20g đều PASS. Provenance vẫn YẾU như lần 5: một lượt chạy một
  phiên, không phải 5 agent tươi độc lập.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ
  nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về cảnh báo mù mới.

### Re-pin lần 8 — 2026-07-30, do vòng verify 2 của gate-card-ac-visibility

`verified_commit` lên `246e7e1`. Cùng chuỗi, cùng posture với lần 6: vòng 2 viết
lại case P61 (thước cũ không đo AC-4) và mở lane corpus repo tiêu thụ.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `246e7e1` — 6 suite EXIT=0 (594 scripts · 51
  hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh --check`
  EXIT=0. Case đụng gate-card: P38a/b · P52 · P53 (byte-đối-byte) · GPM21 · GPM20g
  đều PASS. Provenance vẫn một lượt chạy một phiên, không phải 5 agent độc lập.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ nguyên
  hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về cảnh báo mù hay thước mới.
