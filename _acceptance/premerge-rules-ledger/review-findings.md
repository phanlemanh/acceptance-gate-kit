# Review Findings: premerge-rules-ledger (round 3)

Informational — outside the hook-enforced evidence-report schema. Findings
below have all been adversarial-verified (reproduced or traced to exact
code/doc lines) prior to listing here.

---

## 1. [MEDIUM] Parity gap between hook and pre-merge for `enforcement : off` (space before colon) — comment claims exact parity, RL11c table misses the variant

- **File**: `scripts/pre-merge-check.sh:168`
- **Source**: conventions

The hook regex in `hooks/acceptance-evidence-gate.js:56` is
`/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m` — it allows whitespace
BEFORE the colon. The pre-merge `sed` added in this diff,
`sed -n 's/^enforcement:[[:space:]]*//p'`, does not.

Verified empirically: for the line `enforcement : off` (valid YAML), the hook
parses `off` (write-time gate silently disabled) while pre-merge parses
nothing (rules ledger stays enabled). The long comment at
`scripts/pre-merge-check.sh:152-167` explicitly claims "dòng sed dưới nhận
ĐÚNG tập mà regex của hook nhận" — that claim is false for this variant.

The RL11c parity table (`tests/scripts/run-tests.sh` `rl_enf_pair` calls)
covers case, quoting, comments and garbage values but omits the
space-before-colon dimension, so the divergence is untested. This is exactly
the class the round-2 commit (004bc34) says it fixed "theo LỚP, không vá
case": one axis of the hook regex (`\s*` before colon) is still unmatched.
Failure direction is fail-closed (ledger over-enforces while hook is off), so
it is not a fail-open hole, but it is a real two-parser disagreement on the
only key both layers read, plus now-false documentation. Same bug exists in
the mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh` (must be
fixed at source + re-synced per CLAUDE.md).

Fix option: `sed -n 's/^enforcement[[:space:]]*:[[:space:]]*//p'` and add an
`enforcement : off` row to RL11c.

---

## 2. [LOW] Backticks inside double-quoted echo execute `enforcement` as a command in the test suite

- **File**: `tests/scripts/run-tests.sh:2501`
- **Source**: conventions

`echo "RL11c parity `enforcement`: ..."` — backticks are command
substitution inside double quotes, so bash tries to run a command named
`enforcement`. Verified in a real suite run: line 791 of output is
`tests/scripts/run-tests.sh: line 2501: enforcement: command not found` and
the heading prints as `RL11c parity : ...` with the word dropped.

No test result is affected (459 passed, 0 failed), but it is unintended
command execution and stderr noise in the suite header. Use single quotes or
escape the backticks.

---

## 3. [MEDIUM] `enforcement` parser parity with hook is claimed exact but diverges on two YAML-valid variants

- **File**: `scripts/pre-merge-check.sh:168`
- **Source**: bugs

The comment (lines 147-167) claims the sed extraction accepts exactly the
set matched by the hook regex
`/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m`
(`hooks/acceptance-evidence-gate.js:56`). Verified by experiment, two
divergences exist, both `hook=off / ledger=on`:

1. `enforcement : off` with whitespace before the colon (valid YAML) — hook
   matches via `\s*` before `:`, but sed's `^enforcement:[[:space:]]*`
   requires a glued colon, extracts nothing, ledger stays enabled.
2. Duplicate keys (`enforcement: bogus` then `enforcement: off`) — the
   hook's `/m` match picks the first line matching the full pattern (`off`),
   while sed|head -1 picks the first `enforcement:` line (`bogus`), ledger
   stays enabled.

Direction is fail-closed (no false-green): the effect is that ledger lines
and the `pre-merge-check: rules ran=` summary print when AC-11 and GUIDE.md
("không in khi enforcement: off") say they must not. The RL11c parity table
in `tests/scripts/run-tests.sh` (`rl_enf_pair`), whose stated purpose is
per-variant agreement between both parsers, omits exactly these disagreeing
variants, so the gap is untested. Same gap exists in the mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh`.

Fix: allow optional whitespace before the colon in the sed pattern (e.g.
`^enforcement[[:space:]]*:[[:space:]]*`) and select the first line whose
value is a valid token, or add these variants to RL11c and document the
intentional narrowing.

(Related to finding #1 above — same root cause, two independent
adversarial-verify passes with different emphasis, `conventions` vs `bugs`;
kept as separate entries per source, consistent with round-2 precedent.)

---

## Chưa adversarial-verify (refuter chết)

Không có — toàn bộ 3 finding ở trên đều đã adversarial-verify (repro thực
nghiệm hoặc trace tới đúng dòng code/doc) trước khi liệt vào file này. Không
có finder nào chết trong round này.
