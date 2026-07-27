# Review Findings: premerge-rules-ledger (round 7)

Informational — outside the hook-enforced evidence-report schema. Findings
below have all been adversarial-verified (reproduced or traced to exact
code/doc lines) prior to listing here.

---

## 1. [HIGH] HEAD of the reviewed range fails the repo's own pre-merge gate: 3 reports PENDING-JUDGMENT, unsigned, and stale-pinned

- **File:** `/Users/manh-macmini/dev/acceptance-gate-kit/_acceptance/premerge-rules-ledger/evidence-report.md:4`
- **Source:** conventions

Verified by running `bash scripts/pre-merge-check.sh . --base 2ba38ec7` at
HEAD: exit 1 with three VIOLATIONs — all three features
(premerge-rules-ledger, t1-escape-event-scope, gap-probe-presence-hook)
carry `verdict: PENDING-JUDGMENT` and empty `human_signoff` (line 4 of each
evidence-report.md). The last two commits (1335ed9 round-8 fixes, e1bfcf4
round-9 fixes) landed AFTER the last signoff commits and changed
`scripts/pre-merge-check.sh` — a declared t3_path, not t1-skip — so every
`verified_commit` pin (28e61a8 / 775d887 / 1335ed9) is also stale relative
to HEAD. The repo's own `.github/workflows/gate.yml` runs the per-slug rules
on push to main (only T1-escape is off there), so pushing this range as-is
turns the kit's own gate job red. This is the kit's normal mid-loop state
after a fix round, but it means the range is not merge/push-ready: it still
owes a round-10 re-verify (re-pin `verified_commit` at e1bfcf4) and the
1-line human Gate-2 re-sign for each slug — the signature must come from the
human (ADR 0002); it must not be auto-fixed by an agent.

## 2. [HIGH] `--slug` guard fooled by trailing-slash/dot values — gate greens with filter matching nothing

- **File:** `scripts/pre-merge-check.sh:171`
- **Source:** bugs

The new guard added in round 9 (commit e1bfcf4) validates each `--slug`
value with `[ -d "$ACC/$_s" ]`, but the per-slug loop filters by string
equality against `basename "$dir"` (line 437). Values like `feat-x/`
(trailing slash — realistic when a CI variable is derived from a path),
`feat-x/.`, `.`, or `..` satisfy the `-d` test yet equal no basename, so
EVERY slug directory is silently skipped: no per-slug rule (signoff,
verdict, staleness, bypass, evidence) inspects any feature, the ledger still
records `ran per-slug` (SLUG_SEEN/SLUG_EXPECTED_N count directories BEFORE
the filter, per the script's own comment), and the script prints
`pre-merge-check: clean` with exit 0. Confirmed by repro: a repo with
`_acceptance/feat-x` (T3, status implemented, NO evidence-report.md) exits 1
with `--slug feat-x` but exits 0 clean with `--slug "feat-x/"`, `--slug .`,
and `--slug ..`. This is exactly the declared-filter-matches-nothing
false-green class this diff claims to close; test RL15a only covers a plain
non-existent name. Fix: reject values containing `/` or equal to `.`/`..`,
or validate membership against the same basename set the loop uses. Must be
fixed in both `scripts/pre-merge-check.sh` and the
`plugins/acceptance-gate/scripts/pre-merge-check.sh` mirror (currently
byte-identical), then re-synced.

---

## Chưa adversarial-verify (refuter chết)

Không có — cả hai finding trên đều đã adversarial-verify (repro trực tiếp
cho finding #2; đối chiếu `pre-merge-check.sh` chạy thật + `git log` cho
finding #1).
