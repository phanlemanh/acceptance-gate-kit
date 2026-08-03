---
schema_version: 2
feature_slug: t1-escape-event-scope
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7
human_signoff: Manh Phan 2026-07-28
---

# Evidence Report: t1-escape-event-scope

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
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |
| E13 | AC-13 | judgment | UNCERTAIN (panel proposal: PASS — carried from round 8, human_override pending) |
| E14 | AC-13 | script | PASS |
| E15 | AC-14 | script | PASS |
| E16 | AC-15 | script | PASS |
| E17 | AC-16 | script | PASS |
| E18 | AC-17 | script | PASS |

Regression-guard suites (unmapped this round — `evals: []`, run as a sanity
check alongside the machine evidence below, not attributed to any single
eval): `bash tests/scripts/run-tests.sh` (497 passed, 0 failed, incl. `PASS:
RL10d`), `bash tests/hooks/run-tests.sh` (51 passed, 0 failed, incl. `PASS:
T42`), `bash scripts/sync-plugin-packages.sh --check` (`plugins/ mirror in
sync.`), `bash tests/workflows/run-tests.sh` (16 passed, 0 failed on
execute-parallel; all workflow tests passed).

## Evidence

- eval: E1
  run_id: minted-t1-escape-event-scope-E1-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-t1-escape-event-scope-E2-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-t1-escape-event-scope-E3-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-t1-escape-event-scope-E4-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-t1-escape-event-scope-E5-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-t1-escape-event-scope-E6-r12
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:30:00Z
  output: |
    PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E7
  run_id: minted-t1-escape-event-scope-E7-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-t1-escape-event-scope-E8-r12
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:30:00Z
  output: |
    PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-t1-escape-event-scope-E9-r12
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:30:00Z
  output: |
    PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-t1-escape-event-scope-E10-r12
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:30:00Z
  output: |
    PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-t1-escape-event-scope-E11-r12
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:30:00Z
  output: |
    PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-t1-escape-event-scope-E12-r12
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-07-28T09:30:00Z
  output: |
    PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)

    Results: all plugin tests passed

- eval: E14
  run_id: minted-t1-escape-event-scope-E14-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-t1-escape-event-scope-E15-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-t1-escape-event-scope-E16-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-t1-escape-event-scope-E17-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E18
  run_id: minted-t1-escape-event-scope-E18-r10
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-07-27T16:00:00Z
  carried_from_round: 10
  note: carry-forward tu round 10 — delta khong cham paths cua eval

- eval: E13
  carried: true
  carried_from_round: 8
  note: panel giu nguyen tu round 8 — inputs khong doi (hash khop, carried:true,
    fromRound:8, cung inputs_hash voi round 9/10/11), khong cham lai; rationale
    xem round 8
  judged_by: judge panel — domain-correctness, operational-feasibility, spec-alignment (fresh context, round 8)
  proposal: PASS
  votes:
    - domain-correctness: PASS (r8)
    - operational-feasibility: PASS (r8)
    - spec-alignment: PASS (r8)
  human_override: Manh Phan 2026-07-28
  # T3 contract: human_override is MANDATORY on this judgment item regardless
  # of the panel's PASS proposal. Gate 2 human must personally verify and fill
  # "<name> <date>" before this report can be upgraded to PASS. Round 11 was
  # previously signed off (Manh Phan 2026-07-27) but that signoff pinned an
  # earlier commit; this round re-verifies at a new verified_commit because
  # pre-merge flagged this slug's evidence as stale, so a fresh Gate 2
  # signoff is required again — the prior signature does not carry forward.

## Analyst

Non-discriminating this round: E6, E8, E9, E10, E11, E12 — all six passed on
`bash tests/plugins/run-tests.sh` re-run fresh this round with
`baseline: green`, meaning they also passed on the pre-feature diffBase tree.
This is expected for this cluster (mirror-drift guard P30, manifest-bump
suite P40/P44/P45, GUIDE-lifecycle doc check P43) — they are pre-existing
regression guards in `tests/plugins/run-tests.sh` that this feature's diff
does not rewrite to assert new T1-escape-specific behaviour, and rounds 7-9
already established this same baseline classification for this cluster (see
round 1's Analyst note for the original A/B analysis of the T1-escape script
evals, still valid since `evals.yaml` is unchanged for those). Suite commands
green-on-both (`bash tests/scripts/run-tests.sh`, `bash
tests/hooks/run-tests.sh`, `bash scripts/sync-plugin-packages.sh --check`,
`bash tests/workflows/run-tests.sh`) are ordinary regression guards run as a
sanity check, not eval-mapped, and are not listed per template convention.

## Variance

none — every eval this round is deterministic (no `runs` > 1 field on any
block); no eval was re-run multiple times this round.
## Iterations

Round 1: all 17 machine evals (E1-E12, E14-E18) PASS on `bash
tests/scripts/run-tests.sh` / `bash tests/plugins/run-tests.sh` (plus
supporting regression checks `bash tests/hooks/run-tests.sh` and `bash
scripts/sync-plugin-packages.sh --check`, both green, not tied to a specific
eval id). E13 (AC-13, judgment) — panel proposes FAIL 3/3, no dissent;
routed to Gate 2 for `human_override`.

Round 2: same 17 machine evals still PASS (`bash tests/scripts/run-tests.sh`
now 326 passed vs 324 in round 1 — TE18 cases added; `bash
tests/plugins/run-tests.sh` unchanged, plus the same two supporting
regression checks green). E13 evidence copy was revised (two NOTE lines
added answering layer/why/risk) — panel proposal flips to PASS 3/3
unanimous, no dissent. Contract is T3: every judgment item, including a PASS
proposal, still requires an explicit `human_override` before the overall
verdict can become PASS (hook-enforced) — verdict stays PENDING-JUDGMENT
pending Gate 2. Baseline not re-measured this round (P2 — `evals.yaml`
unchanged since the last baseline run); every machine eval block above
carries `baseline: n-a` accordingly.

Round 3: same 17 machine evals still PASS, unchanged from round 2 (`bash
tests/scripts/run-tests.sh` still 326 passed, 0 failed; `bash
tests/plugins/run-tests.sh` unchanged) plus the same two supporting
regression checks green (`bash tests/hooks/run-tests.sh` 51 passed, 0
failed; `bash scripts/sync-plugin-packages.sh --check` reports mirror in
sync). This round's changes were review-findings fixes rather than new
eval-facing behaviour, so no eval id or output count moved. E13 was
re-judged fresh by the panel (not carried — inputs/rationale text differ
from round 2) and again proposes PASS 3/3, unanimous, no dissent. Contract
remains T3: `human_override` on E13 is still required regardless of the
panel's proposal, so the overall verdict stays PENDING-JUDGMENT pending Gate
2. Baseline not re-measured this round (P2 — `evals.yaml` unchanged since
the last baseline run); every machine eval block above carries `baseline:
n-a` accordingly.

Round 4: same 17 machine evals still PASS, count moved from round 3 (`bash
tests/scripts/run-tests.sh` now 329 passed vs 326 in round 3 — TE18d/f/g
cases added per this round's review findings; `bash
tests/plugins/run-tests.sh` gains the new P46 case, still all-plugin-green)
plus the same two supporting regression checks green (`bash
tests/hooks/run-tests.sh` 51 passed, 0 failed; `bash
scripts/sync-plugin-packages.sh --check` reports mirror in sync). E13 was
re-judged fresh by the panel (not carried — round input has no `carried`
flag) and again proposes PASS 3/3, unanimous, no dissent, rationale text
re-derived against the current evidence copy. Contract remains T3:
`human_override` on E13 is still required regardless of the panel's
proposal, so the overall verdict stays PENDING-JUDGMENT pending Gate 2.
Baseline not re-measured this round (P2 — `evals.yaml` unchanged since the
last baseline run); every machine eval block above carries `baseline: n-a`
accordingly. This round's adversarial review surfaced 8 findings (2 high, 4
medium, 2 low) — see `review-findings.md` — including two that question
whether the T1-escape teeth this feature ships are actually load-bearing
end-to-end (vendored-script skew for `--no-t1-escape` consumers; two
assertion-only, no-positive-control test cases); none of these are
hook-enforced blockers, so they do not change the machine-eval table above,
but they bear directly on the E13 judgment item and are flagged for the
human at Gate 2.

Round 5: same 17 machine evals still PASS, count moved from round 4 (`bash
tests/scripts/run-tests.sh` now 332 passed vs 329 in round 4 — TE18g2 case
added per this round's review findings on the TE5/invariant #4 gap; `bash
tests/plugins/run-tests.sh` output tail now pins exit code + message text
for P46, still all-plugin-green) plus the same two supporting regression
checks green (`bash tests/hooks/run-tests.sh` now pins the T42 case, 51
passed, 0 failed; `bash scripts/sync-plugin-packages.sh --check` reports
mirror in sync). E13 was re-judged fresh by the panel (not carried — round
input has no `carried` flag) and again proposes PASS 3/3, unanimous, no
dissent, rationale text re-derived against the current evidence copy.
Contract remains T3: `human_override` on E13 is still required regardless of
the panel's proposal, so the overall verdict stays PENDING-JUDGMENT pending
Gate 2. Baseline not re-measured this round (P2 — `evals.yaml` unchanged
since the last baseline run); every machine eval block above carries
`baseline: n-a` accordingly. This round's adversarial review surfaced 8
findings — see `review-findings.md` — including a medium-severity gap on
TE5 (invariant #4: conclusion drawn from exit code alone, no pinned
message, no positive control — same class already fixed for TE18d/f/g and
P46 in earlier rounds but not yet applied to TE5), a medium-severity finding
that the kit's own self-hosted pre-merge gate is currently RED at HEAD (2
violations, one caused by this very diff), and two medium-severity bugs in
`scripts/sync-plugin-packages.sh` (a `set -e`-does-not-fire-on-command-
substitution gap, and a version line that reads sibling manifests rather
than the ones actually shipped into `plugins/` for 2 of 3 packages); none of
these are hook-enforced blockers, so they do not change the machine-eval
table above, but they bear directly on the E13 judgment item and are
flagged for the human at Gate 2.

Round 6: same 17 machine evals still PASS, count moved from round 5 (`bash
tests/scripts/run-tests.sh` now 334 passed vs 332 in round 5; `bash
tests/plugins/run-tests.sh` output tail unchanged — still pins exit code +
message text for P46, all-plugin-green) plus the same two supporting
regression checks green (`bash tests/hooks/run-tests.sh` still pins the T42
case, 51 passed, 0 failed; `bash scripts/sync-plugin-packages.sh --check`
reports mirror in sync). E13 was re-judged fresh by the panel (not carried
— round input has no `carried` flag) and again proposes PASS 3/3, unanimous,
no dissent, rationale text re-derived against the current evidence copy.
Contract remains T3: `human_override` on E13 is still required regardless of
the panel's proposal, so the overall verdict stays PENDING-JUDGMENT pending
Gate 2. Baseline not re-measured this round (P2 — `evals.yaml` unchanged
since the last baseline run); every machine eval block above carries
`baseline: n-a` accordingly. This round's adversarial review surfaced 6
findings (1 high, 3 medium, 2 low) — see `review-findings.md` — carrying
forward two round-5 findings not yet resolved (the kit's own self-hosted
pre-merge gate is still RED at HEAD; `verified_commit` in this very report
pins a commit before round 5's source changes, so the staleness rule will
fire the moment a human upgrades this report to PASS) plus two newly
verified bugs discovered by adversarial mutation testing (`--base`/`--slug`
in `scripts/pre-merge-check.sh` silently swallow a following `-*` option as
their value, disarming both the T1-escape backstop and the gap-probe rule
with exit 0; the `sync-plugin-packages.sh --check` drift guard uses
pathname expansion and so is blind to top-level dot-entries under
`plugins/`, making the `plugins/**` gate exemption wider than the guard
that is cited to justify it) and one low-severity drift in the count that
CLAUDE.md's own bullet #4 cites for how many times this bug class has
recurred. None of these are hook-enforced blockers, so they do not change
the machine-eval table above, but they bear directly on the E13 judgment
item and are flagged for the human at Gate 2.

Round 7: same 17 machine evals still PASS, count moved substantially from
round 6 (`bash tests/scripts/run-tests.sh` now 459 passed vs 334 in round 6
— last case name in the tail also changed, `RL10d` vs round 6's `TE18g2`,
reflecting the S4-fixes commits landed between rounds — `0422f08 fix: 5
finding S4 round 1` and `004bc34 fix: 5 finding S4 round 2`; `bash
tests/plugins/run-tests.sh` output tail now pins `P49` vs round 6's `P46`,
still all-plugin-green) plus the same two supporting regression checks
green (`bash tests/hooks/run-tests.sh` 51 passed, 0 failed; `bash
scripts/sync-plugin-packages.sh --check` reports mirror in sync).
`verified_commit` for this round (`02d81876...`) is a new commit past round
6's pin (`7fdfad17...`), consistent with those two S4-fix commits landing in
between — this round's verify re-ran against that fresh tree rather than
re-using round 6's stale pin. E13 was re-judged fresh by the panel (not
carried — round input has no `carried` flag) and again proposes PASS 3/3,
unanimous, no dissent, rationale text re-derived against the current
evidence copy. Contract remains T3: `human_override` on E13 is still
required regardless of the panel's proposal, so the overall verdict stays
PENDING-JUDGMENT pending Gate 2. Baseline not re-measured this round (P2 —
`evals.yaml` unchanged since the last baseline run); every machine eval
block above carries `baseline: n-a` accordingly. This round's adversarial
review surfaced 4 findings (1 high, 2 medium, 1 low) — see
`review-findings.md` — the headline one is a THIRD recurrence of the same
parser-divergence bug class that rounds 5 and 6 already touched: the hook's
`enforcement` regex (`hooks/acceptance-evidence-gate.js:56`) accepts
whitespace before the colon (`enforcement : off`) but the new
`pre-merge-check.sh` sed at line 168 does not, so `enforcement: off` can
disable the write-time gate while the pre-merge ledger-count check still
expects rules to have run — reproduced empirically both as a Vietnamese
"claim vs implementation" finding and as an independent English "hook vs
pre-merge parser" finding with a concrete repro. A second, medium-severity
finding flags `TE18i` in `tests/scripts/run-tests.sh` as a fresh instance of
the exact CLAUDE.md-bullet-#4 "negative-assertion-alone" class (checks exit
code 2 only, no pinned message, unlike its sibling cases in the same block)
— introduced in the same diff that fixed other instances of that class. A
low-severity finding flags `docs/adr/0006-...md` using bare "ledger" for
the decisions-log sense in a document that is otherwise entirely about the
rules-ledger sense, immediately after CONTEXT.md added the
disambiguation rule this same diff is supposed to be following. None of
these are hook-enforced blockers, so they do not change the machine-eval
table above, but they bear directly on the E13 judgment item and are
flagged for the human at Gate 2 — in particular whether the parser
divergence (now on its third documented recurrence) warrants stopping to
fix the class rather than the named case again.

Round 8: same 17 machine evals still PASS, count moved from round 7 (`bash
tests/scripts/run-tests.sh` now 460 passed vs 459 in round 7 — last case
name in the tail unchanged, `RL10d`; `bash tests/plugins/run-tests.sh`
output tail unchanged — still pins `P49`, all-plugin-green) plus the same
two supporting regression checks green (`bash tests/hooks/run-tests.sh` 51
passed, 0 failed, last case `T42`; `bash scripts/sync-plugin-packages.sh
--check` reports mirror in sync). Between round 7's pin (`02d81876...`) and
this round's pin (`3be6be8c...`) three commits landed: `89fa742
evidence(premerge-rules-ledger): round 4`, `e8dcada fix: 4 nợ leftover
trước khi ký`, and `3be6be8 fix(docs): sàn version --no-t1-escape là
1.22.0+, KHÔNG phải 1.21.0+ — finding HIGH round 6`; the last of these is
the docs fix E12's `expected` text explicitly calls out this round ("sàn
version trong hai file đó vừa đính chính 1.21.0+ → 1.22.0+"), and E12 was
re-run fresh (not carried) to confirm both `acceptance-init` copies now
state the corrected floor. E8-E11 (AC-8..AC-11, mirror-drift/sync-bump
cases in `tests/plugins/run-tests.sh`) are carried forward from round 7
per delta staleness (P1) — this round's diff does not touch the paths those
cases cover — and are marked `carried_from_round: 7` in the Evidence
section above rather than re-run. E13 was re-judged fresh by the panel (not
carried — round input has no `carried` flag) and again proposes PASS 3/3,
unanimous, no dissent, rationale text re-derived against the current
evidence copy. Contract remains T3: `human_override` on E13 is still
required regardless of the panel's proposal, so the overall verdict stays
PENDING-JUDGMENT pending Gate 2. Baseline not re-measured this round (P2 —
`evals.yaml` unchanged since the last baseline run); every machine eval
block above carries `baseline: n-a` accordingly. This round's adversarial
review surfaced 2 findings (0 high, 1 medium, 1 low) — see
`review-findings.md` — a medium-severity gap where `--base` given an
explicit empty value (`--base ""`, the classic CI shape of an unset
variable) silently degrades to the "no PR base given" skip path rather than
failing closed, even though the diff's own doctrine treats a declared-but-
unresolved base as fail-closed (exit 2) for the non-empty case — same
"vá case có tên, không vá LỚP" class CLAUDE.md invariant 4 warns about, and
present in both `scripts/pre-merge-check.sh` and its `plugins/` mirror; and
a low-severity finding that one remaining case in the new RL5b block
(`tests/scripts/run-tests.sh:2444`) concludes from exit code 2 alone
without pinning the expected "unknown option" message, the same
assertion-class CLAUDE.md invariant 4 already names, though residual risk
is small since RL5b exercises the real script rather than a fixture copy.
Neither is a hook-enforced blocker, so neither changes the machine-eval
table above, but both bear on the E13 judgment item and are flagged for the
human at Gate 2.

Round 9: same 17 machine evals still PASS, count moved from round 8 (`bash
tests/scripts/run-tests.sh` now 477 passed vs 460 in round 8 — last case
name in the tail unchanged, `RL10d`; `bash tests/plugins/run-tests.sh`
output tail now pins `P50` vs round 8's `P49` — the new case asserts
`sync-plugin-packages.sh` rejects extra argv, e.g. a stray `--write
--check` combo can no longer silently take the write path — still
all-plugin-green) plus the same two supporting regression checks green
(`bash tests/hooks/run-tests.sh` 51 passed, 0 failed, last case `T42`
unchanged; `bash scripts/sync-plugin-packages.sh --check` reports mirror in
sync). Between round 8's pin (`3be6be8c...`) and this round's pin
(`1335ed99...`) eight commits landed, ending in `1335ed9 fix: 3 finding
round 8 — guard env-rỗng phán sau parse, sync chặn argv thừa, VIOLATION
[scope] về stdout` — the direct fix for round 8's two review findings (the
`--base ""` fail-open gap and the RL5b unpinned-message gap), plus the new
`sync-plugin-packages.sh` argv guard (P50, chip task_33ca1add) and moving
`VIOLATION [scope]` onto stdout so it is grep-able the same way as the
other violation classes (TE16b, AC-17). E1-E5, E7, E8, E12, E14-E18 were
re-run fresh against this new pin (all still PASS, `baseline: n-a` since
`evals.yaml` did not change — P2). E6 (AC-6, `P40` push/PR-base coverage in
`tests/plugins/run-tests.sh`) is carried forward from round 8 per delta
staleness (P1) — this round's diff does not touch the paths that case
covers. E9-E11 (AC-9..AC-11, sync/bump cases) remain carried from round 7,
unchanged since round 8. E13 was NOT re-judged this round: its inputs are
unchanged since round 8 (hash match, `carried: true`, `fromRound: 8`), so
the panel's round-8 proposal (PASS 3/3, unanimous, no dissent) carries
forward verbatim per P3 — rationale text is not reproduced here, see round
8 above. Contract remains T3: `human_override` on E13 is still required
regardless of the panel's proposal, so the overall verdict stays
PENDING-JUDGMENT pending Gate 2. This round's adversarial review surfaced 2
new findings — see `review-findings.md` — a medium-severity gap where a
declared `--slug` value matching NO directory (a typo'd feature slug) makes
the per-slug loop skip every directory and report `pre-merge-check: clean`
exit 0, the same silent-fail-open shape the round-8 fix was justified by
for the empty-value case, just one input character away (non-empty typo
vs. truly-empty string) and not covered by that fix; and a low-severity gap
where a declared `--base` on a root where git itself is unusable (non-git
root, or `git rev-parse` failing e.g. a `safe.directory` ownership
rejection in CI containers) still falls through to the old DIFF_SKIP_NOTE
skip path rather than the new exit-2 path, contradicting the diff's own
updated README claim that a declared-but-unresolved base is now VIOLATION
+ exit 2 "ở MỌI repo". Neither is a hook-enforced blocker, so neither
changes the machine-eval table above, but both bear on the E13 judgment
item and are flagged for the human at Gate 2 — in particular whether the
`--slug` gap is close enough to round 8's already-fixed `--base ""` class
to warrant fixing before signoff rather than deferring to a follow-up.

Round 10: same 17 machine evals still PASS, count moved substantially from
round 9 (`bash tests/scripts/run-tests.sh` now 497 passed vs 477 in round 9
— last case name in the tail unchanged, `RL10d`; the delta covers the new
RL14a-e + RL15a-d block, chip `task_33ca1add` closed trọn: scope/filter
declared-but-unmatched now exits 2 theo LỚP — giá trị `--slug` rỗng, slug
gõ sai, slug chứa `/`/`.`/`..`, env set-rỗng, và `--base` khai trên root
không-git — plus a check that an env-override does not false-positive, and
that `VIOLATION [scope]` prints to stdout; `bash tests/plugins/run-tests.sh`
output tail unchanged — still pins `P50`, all-plugin-green) plus the same
two supporting regression checks green (`bash tests/hooks/run-tests.sh` 51
passed, 0 failed, last case `T42` unchanged; `bash
scripts/sync-plugin-packages.sh --check` reports mirror in sync). Between
round 9's pin (`1335ed99...`) and this round's pin (`829314e...`) five
commits landed: `e1bfcf4 fix: 2 finding round 9 — bộ lọc khai-mà-không-khớp
nổ to, base-khai-trên-root-không-git exit 2`, `c6bf3e6 fix: guard --slug
kiểm cùng NGỮ NGHĨA với bộ lọc thật — chặn /, . và ..`, `59ee5a7 test: pin
thông điệp RL15d2/d3 — bất biến #4, hai case sót trong chính nhóm vừa thêm`,
`3009c7e evidence(premerge-rules-ledger): round 9 re-pin cuối`, and
`829314e evidence(gap-probe): round 9 re-pin cuối` — the first two are the
direct fix for both of round 9's review findings (the `--slug` no-match
fail-open gap and the `--base` on non-git-root fail-open gap), and the
third pins the exact "unknown option"-class message on two sibling cases
that were left unpinned inside that same new block, per CLAUDE.md
invariant 4 (fix the class, not the named case). E1-E5, E7, E14-E18 were
re-run fresh against this new pin (all still PASS, `baseline: n-a` since
`evals.yaml` did not change — P2). E6 (AC-6, `P40` push/PR-base coverage)
remains carried from round 8 per delta staleness (P1) — this round's diff
still does not touch the paths that case covers. E8 (AC-8, mirror-drift
guard) and E12 (AC-12, acceptance-init doc coverage) are now carried
forward from round 9 — this round's diff does not touch the paths either
case covers. E9-E11 (AC-9..AC-11, sync/bump cases) remain carried from
round 7, unchanged since round 9. E13 was NOT re-judged this round: its
inputs are unchanged since round 8 (hash match, `carried: true`,
`fromRound: 8`, same `inputs_hash` as round 9's log entry), so the panel's
round-8 proposal (PASS 3/3, unanimous, no dissent) carries forward verbatim
per P3 for a second consecutive round — rationale text is not reproduced
here, see round 8 above. Contract remains T3: `human_override` on E13 is
still required regardless of the panel's proposal, so the overall verdict
stays PENDING-JUDGMENT pending Gate 2. This round's adversarial review
surfaced 0 new findings — see `review-findings.md` — both round-9 findings
(the `--slug` typo fail-open gap, and the `--base` on non-git-root
fail-open gap) were verified fixed by the commits above (declared-but-
unmatched `--slug` and declared-but-unresolvable `--base` on a non-git root
now both exit 2 with VIOLATION [scope], confirmed against the new RL14/RL15
cases), and no new gap was found this round.

Round 11: no source paths touched by this round's diff intersect any of the
17 machine evals' inputs (P1 delta-staleness), so E1-E5, E7-E12, E14-E18 are
all carried forward unchanged from their prior rounds (E1-E5, E7, E14-E18
from round 10; E6 from round 8; E8 from round 9; E9-E11 from round 7; E12
from round 9) — `run_id`/`verified_at` copied verbatim from the run-log
entries at those rounds, no re-attribution. As a sanity check (not
eval-mapped — `evals: []` on every command this round) the full suite set
was re-run fresh anyway: `bash tests/scripts/run-tests.sh` 497 passed / 0
failed (incl. `PASS: RL10d` — same count as round 10, no drift), `bash
tests/hooks/run-tests.sh` 51 passed / 0 failed (incl. `PASS: T42`), `bash
tests/plugins/run-tests.sh` all plugin tests passed (incl. `PASS: P50 argv
thừa exit 2 + nêu tên tham số; mode đơn vẫn xanh`), `bash
scripts/sync-plugin-packages.sh --check` reports `plugins/ mirror in
sync.` — all four green, confirming no regression entered between round
10's verified commit (`829314ede23b594857920373377c26ac78d88629`) and this
round's (`c09533b66ebffd2d4d6a5c40b53136329e69e6a7`), an interval that
includes this repo's own release 1.22.1 (`2ef1285 release(acceptance-gate):
1.22.1`, `26af229 fix(release): description 1.22.1 thôi hứa hardening
không ship`) plus signoff commits for two unrelated features (`853b74b`,
`f93d686`) landing on the shared tree; none of those commits touch this
feature's own eval paths. Baseline was again NOT re-measured this round
(P2 — `evals.yaml` still unchanged since the last baseline run); every
carried machine eval block above omits the `baseline:` field per this
report's own carry-forward convention (see round 1's Analyst note for the
original A/B analysis, still valid since `evals.yaml` is unchanged). E13
was NOT re-judged this round: its inputs are unchanged since round 8 (hash
match, `carried: true`, `fromRound: 8`, same `inputs_hash` as rounds 9 and
10's log entries), so the panel's round-8 proposal (PASS 3/3, unanimous, no
dissent) carries forward verbatim per P3 for a third consecutive round —
rationale text is not reproduced here, see round 8 above. Contract remains
T3: `human_override` on E13 is still required regardless of the panel's
proposal, so the overall verdict is PENDING-JUDGMENT again for this fresh
round — a new round always requires its own Gate 2 signoff, even though
round 10 was previously signed off (`human_signoff: Manh Phan 2026-07-27`,
commit `853b74b`). This round's adversarial review surfaced 1 new finding
(LOW) — see `review-findings.md` — the packaged `GUIDE.md` links to
`docs/adr/0006-rules-ledger-fail-closed-at-output.md` from inside
`plugins/acceptance-gate/`, but the shipped package carries no `docs/`
directory, so the relative link resolves nowhere for a consumer who only
installed the plugin; this continues a pre-existing convention gap (the
ADR 0005 link at the same file predates this diff) rather than introducing
a new one. This is not a hook-enforced blocker, so it does not change the
machine-eval table above, but it bears on the E13 judgment item and is
flagged for the human at Gate 2.

Round 12 (this round): re-verify triggered because pre-merge flagged this
slug's evidence as stale — code changed after round 11's signed
`verified_commit`, so that prior signoff no longer covers the current tree;
`verified_commit` moves to `2e2eaf7e894d5065478e6c24d4c748a8f4d1205f`. E6,
E8-E12 (the plugins/mirror-drift/manifest-bump/doc-coverage cluster) were
re-run fresh via `bash tests/plugins/run-tests.sh` (all plugin tests passed,
incl. `PASS: P56 codex chi dan khuon review-findings (plain + cau truc + dot
bien)`) rather than carried; all six remain PASS but `baseline: green`
(non-discriminating this round — see `## Analyst`). E1-E5, E7, E14-E18 are
carried forward unchanged from round 10 (P1 — this round's diff does not
touch `scripts/pre-merge-check.sh` or the TE* fixtures). As a sanity check
the full suite set was re-run fresh anyway: `bash tests/scripts/run-tests.sh`
497 passed/0 failed (`PASS: RL10d`, same count as round 10/11, no drift),
`bash tests/hooks/run-tests.sh` 51 passed/0 failed (`PASS: T42`), `bash
scripts/sync-plugin-packages.sh --check` reports mirror in sync, `bash
tests/workflows/run-tests.sh` 16 passed/0 failed (execute-parallel) and all
workflow tests passed — four suites green, no regression entering this
round. E13 was NOT re-judged this round: inputs unchanged since round 8
(hash match, `carried: true`, `fromRound: 8`, same `inputs_hash` as rounds
9-11), so the panel's round-8 proposal (PASS 3/3, unanimous, no dissent)
carries forward verbatim per P3 for a 4th consecutive round — rationale text
not reproduced here, see round 8. Contract remains T3: `human_override` on
E13 is required regardless of the panel's proposal, so the overall verdict
is PENDING-JUDGMENT again this round — a new round always requires its own
fresh Gate 2 signoff, even though round 11 was already signed off at an
earlier commit. This round's adversarial review surfaced 11 findings (2
high, 6 medium, 3 low) — see `review-findings.md` — but scope-triage could
not classify any of them into the in-contract or out-of-contract lanes: all
11 fall into files no eval/AC covers (`feature-loop/skills/feature-loop/SKILL.md`,
`codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`,
`scripts/gate-card.js`, `.codex-plugin/plugin.json`,
`feature-loop/workflows/acceptance-verify.js`, `lib/out-of-contract.js`), so
they landed under `## Chưa phân loại (triage-failed)` and the report ends
with the mandatory cluster-warning line. None of these are hook-enforced
blockers, so they do not change the machine-eval table above, but given the
volume (11/11 clustered) and severity mix (2 high) they bear directly on the
Gate 2 decision — the human should decide whether to widen this feature's
contract or narrow scope before signing.

Round 12 first attempt was BLOCKED, not PASS, and is recorded here rather
than overwritten: the `bash tests/scripts/run-tests.sh` suite agent completed
without returning structured output, so the workflow reported
`blocked: [{cmd, reason: "agent bi skip/chet — khong co ket qua, khong duoc
tinh la pass"}]`. The suite itself was not red — the six re-run evals
(E6, E8-E12) had already returned exit 0 in that same attempt — but the
missing result was a REGRESSION-GUARD suite, which is precisely the guard the
P1 carry-forward of E1-E5/E7/E14-E18 leans on, so counting it as green would
have made the round carry eleven evals *because* a net existed while that net
was in fact absent. The attempt was resumed at the same round via
`resumeFromRunId` (15 cached agents replayed, only the dead agent re-run), and
this report reflects that completed attempt. No run-log line or report body
was written for the blocked attempt: `run_id` is minted deterministically as
`minted-<slug>-<eval>-r<round>`, so appending both attempts would have put
duplicate ids in the audit log for round 12.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

E13 note for the human: this is a T3 contract, so `human_override` is
required on E13 regardless of the judge verdict. This round's panel input is
carried unchanged from round 8 for the 4th consecutive round (PASS 3/3,
unanimous, no dissent) — see round 8's full rationale text in an earlier
copy of this report; nothing about E13's inputs moved this round.
`review-findings.md` reports 11 new findings this round (2 high, 6 medium, 3
low), ALL routed to `## Chưa phân loại (triage-failed)` with a 11/11
coverage-cluster warning at the end of that file — informational and
non-hook-blocking, but worth reading in full before signing given the
volume and the two high-severity items (an unguarded write of
`result.report`/`result.findings` that can blank a prior round's evidence on
BLOCKED, and a card renderer that silently drops malformed out-of-contract
items with no flag).

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
theo ĐƯỜNG DẪN. Thẻ Cổng 1 của chính nó: 16 AC trước và sau — không đổi.

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

### Re-pin lần 9 — 2026-07-30, do merge origin/main vào nhánh gate-card-ac-visibility

`verified_commit` lên `23b8dc6`. Nguyên nhân stale: đợt tích hợp gộp nhánh
`fix/ac-bullet-regex-widen` với main — `lib/md-section.js` thêm `sectionLines()`
và `section()` thành lớp mỏng trên nó, `lib/ac-line.js` bỏ bản duyệt ranh giới
riêng, `scripts/gate-card.js` + suite đổi theo.

- **ĐÃ chạy lại:** toàn bộ eval MÁY ở `23b8dc6` — 6 suite EXIT=0 (596 scripts ·
  51 hooks · plugins · workflows · skills · codex) + `sync-plugin-packages.sh
  --check` EXIT=0. Kèm phép kiểm hồi quy `section()` trước/sau refactor trên
  686 file × 1.731 heading = 1.187.466 phép so → **0 lệch**, harness tự falsify
  được (đổi `lv>=2`→`lv>=3` cho 1.626 lệch). Provenance: một lượt chạy một
  phiên, không phải agent độc lập mỗi slug.
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký sẵn có giữ
  nguyên hiệu lực; chữ ký cũ KHÔNG được hiểu là đã phán về mã sau merge.

### Re-pin — 2026-07-30, do feature design-pass-skill

`verified_commit` lên `3ab4ee6`. Nguyên nhân stale: feature design-pass-skill
thêm skill `skills/design-pass/` (nghi thức thiết kế in-harness S1-D) + 10
case P58–P67 trong `tests/plugins/run-tests.sh` + bump acceptance-gate
1.26.0 (3 manifest) + mirror sync.

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `3ab4ee6` do 3 agent
  tươi chạy độc lập, sha nhất quán cả 3, tất cả exit 0 (590 scripts ·
  51 hooks · plugins pass gồm P58–P67 · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên; chữ ký cũ KHÔNG được hiểu là đã phán về
  design-pass 1.26.0.

### Re-pin — 2026-07-30 (lần 2), do amendment worked-example của design-pass-skill

`verified_commit` lên `a8f0d70`. Nguyên nhân stale: amendment sau signoff của
design-pass-skill (lệnh owner trong chat — skill-creator audit mục 1): thêm
worked example vào SKILL.md; description GIỮ NGUYÊN (trigger-eval 3 iteration
không dịch chuyển điểm).

- **ĐÃ chạy lại:** toàn bộ eval MÁY — machine lane ở `a8f0d70` do 3 agent
  tươi chạy độc lập, sha nhất quán cả 3, tất cả exit 0 (590 scripts ·
  51 hooks · plugins pass gồm P58–P67 · workflows pass · mirror in sync).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-07-30 (sau merge hai nhánh), tại 8ee3f4c

`verified_commit` lên `8ee3f4c` — merge commit tích hợp design-pass-skill
(1.26.0, case đánh lại số P72–P81) với gate-card-ac-visibility (PR 18) trên
origin/main. Machine lane ở `8ee3f4c` do 3 agent tươi chạy độc lập, sha nhất
quán cả 3, tất cả exit 0 (596 scripts · 51 hooks · plugins pass gồm case của
CẢ HAI feature · workflows pass · mirror in sync). Judgment + chữ ký giữ
nguyên như các lần re-pin trước.


### Re-pin — 2026-07-30 (sau pha3-goi-luoi), tại f929ceb

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 3 của feature
  `pha3-goi-luoi`, Workflow `wf_cfa3bb5d-5df`, doer≠grader): 5 suite tại
  `f929ceb553b3ea4d0d4204907ed8c1c291241a9e` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P88, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `f929ceb553b3ea4d0d4204907ed8c1c291241a9e` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-01 (sau ngon-ngu-mat-nguoi), tại b7f658d

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 4 của feature
  `ngon-ngu-mat-nguoi`, Workflow `wf_65b38963-25c`, doer≠grader): 5 suite tại
  `b7f658d42b6a8a72d6ef0a1310bac28127364423` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P96, gồm case của slug này) · workflows 10 pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `b7f658d42b6a8a72d6ef0a1310bac28127364423` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-02 (sau hinh-theo-mat-phang), tại 2b6823d

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 6 của feature
  `hinh-theo-mat-phang`, Workflow `wf_69f3bf7a-1a6`, doer≠grader): 5 suite tại
  `2b6823d400df3360975c9029b120ac5871e36bbf` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P97, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `2b6823d400df3360975c9029b120ac5871e36bbf` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-08-03 (sau start-command), tại b2d2eac

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 2 của feature
  `start-command`, Workflow `wf_73dc61df-6d8`, doer≠grader): 5 suite tại
  `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P101, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-08-03 (sau start-scan-hardening), tại 6f3449c

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 5 của feature
  `start-scan-hardening`, Workflow `wf_4cdd5992-610`, doer≠grader): 5 suite tại
  `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P105, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.
