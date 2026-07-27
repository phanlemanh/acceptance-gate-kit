# Review Findings: gap-probe-presence-hook (round 5)

Informational — adversarial-verified findings from this VERIFY round. Not
hook-enforced; feeds Gate 2 human review.

## Findings

- **title:** enforcement parser parity gap: sed rejects whitespace before colon that the hook regex accepts
  **file:** scripts/pre-merge-check.sh:168
  **severity:** medium
  **source:** conventions
  **detail:** The comment at line 153 pins the invariant: 'dong sed duoi nhan DUNG tap ma regex cua hook nhan'. That is not true for whitespace before the colon. Hook regex (hooks/acceptance-evidence-gate.js:56) is `/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m` — it accepts `enforcement : off`. The sed pattern `s/^enforcement:[[:space:]]*//p` requires the colon immediately after the key, so on `enforcement : off` it extracts nothing (verified by direct execution: sed=empty, hook=off). Result: the hook stops enforcing at write time while the rules ledger stays enabled at pre-merge — the two parsers disagree on exactly the key the code declares they must agree on, and AC-11 ("enforcement off => ledger off, no ledger lines") is violated for this spelling. The direction is fail-closed (extra ledger lines, no false exit 2), so impact is mild, but this is a missed member of the exact class the round-2 fix commit (004bc34, "vá LỚP, không vá case") claims to close: the RL11c parity table in tests/scripts/run-tests.sh tests only "enforcement: <value>" variants and has no space-before-colon row, so the machine check cannot see this divergence. Fix per repo convention: either widen the sed to `^enforcement[[:space:]]*:` or add the variant row to RL11c and document the intentional narrowing. Same gap exists in the mirror plugins/acceptance-gate/scripts/pre-merge-check.sh (fix source then run scripts/sync-plugin-packages.sh).

- **title:** Usage header of pre-merge-check.sh not updated with the new --no-t1-escape flag
  **file:** scripts/pre-merge-check.sh:4
  **severity:** low
  **source:** conventions
  **detail:** Line 4 still reads "Usage: pre-merge-check.sh [repo_root] [--slug <slug>]... [--base <ref>]" and the header paragraph only describes --base, but this diff adds a third public flag --no-t1-escape (parsed at line 67, taught to consumers via commands/acceptance-init.md, GUIDE.md and gate.yml). The feature branch explicitly made docs-match-behavior part of its scope (commit 9f348e7 "gate.yml+README+GUIDE khớp hành vi"), yet the script's own usage line — the first thing an operator reads on error — was missed. Applies identically to the mirror plugins/acceptance-gate/scripts/pre-merge-check.sh; per CLAUDE.md, edit the source and re-run scripts/sync-plugin-packages.sh, committing both together.

- **title:** enforcement key parity gap: hook accepts space-before-colon, pre-merge sed does not
  **file:** scripts/pre-merge-check.sh:168
  **severity:** low
  **source:** bugs
  **detail:** The comment above the parse (lines 147-167) claims the sed accepts EXACTLY the set the hook regex accepts, but the hook regex in hooks/acceptance-evidence-gate.js:56 is `/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m` (whitespace allowed before the colon) while the sed pattern is `s/^enforcement:[[:space:]]*//p` (colon must be glued to the key). Verified live: a config.yaml containing `enforcement : off` makes the hook read off (write-time gate disabled) while pre-merge keeps LEDGER_ENABLED=1 and prints ledger lines — the two parsers disagree on this variant, breaking the AC-11 "off la off toan cuc" contract the block documents. Direction is fail-closed (pre-merge over-enforces rather than silently disabling), so impact is low, but the RL11c parity test (tests/scripts/run-tests.sh, rl_enf_pair) only varies the VALUE (`OFF`, quotes, comment) and never the key/colon spacing, so this variant class is invisible to the machine parity check. Same divergence exists in the mirror plugins/acceptance-gate/scripts/pre-merge-check.sh. Fix: either match `\s*` before the colon in the sed (e.g. `sed -n 's/^enforcement[[:space:]]*:[[:space:]]*//p'`) in BOTH source and mirror, or add a key-spacing row to the RL11c table and document the divergence.

- **title:** Backticks inside double-quoted echo execute a nonexistent command in test suite
  **file:** tests/scripts/run-tests.sh:2501
  **severity:** low
  **source:** bugs
  **detail:** `echo "RL11c parity \`enforcement\`: pre-merge va hook phai dong y tung bien the"` — the backticks are command substitution inside double quotes, so bash tries to run a command named `enforcement`. Reproduced: prints "bash: enforcement: command not found" to stderr and the label renders as "RL11c parity : ...". No effect on PASS/FAIL counts (suite runs `set -u`, not `set -e`), but it is an unintended command execution and stderr noise in every suite run. Fix: escape the backticks or use single quotes for the label.

## Chua adversarial-verify (refuter chet)

(none — tat ca finding tren da duoc adversarial-verify; khong co finder chet round nay)
