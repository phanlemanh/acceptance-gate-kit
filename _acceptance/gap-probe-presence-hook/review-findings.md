# Review Findings: gap-probe-presence-hook (round 8)

Informational — adversarial-verified findings from this VERIFY round. Not
hook-enforced; feeds Gate 2 human review.

## Findings

- **title:** sync-plugin-packages.sh validates only $1 — extra argv silently turns a check into a write
  **file:** scripts/sync-plugin-packages.sh:14
  **severity:** medium
  **source:** conventions
  **detail:** The new unknown-mode guard (`case "$MODE" in ""|--check|--write)`) inspects only `MODE="${1:-}"`; arguments beyond `$1` are silently dropped. Reproduced on a temp copy: after injecting drift into `plugins/acceptance-gate/lib/gap-probe.js`, `--check` correctly exits 1, but `--write --check` runs the WRITE path, ERASES the injected drift, prints "Synced Codex packages: ..." and exits 0. This is exactly the fail-open class the guard's own comment forbids ("Mode lạ KHÔNG được âm thầm rơi về 'ghi đè'... một lỗi gõ biến lệnh KIỂM thành lệnh GHI, rồi báo thành công") and that P46 pins — just reached via a second argument instead of a misspelled first one. It is also inconsistent with the pattern this same wave applied to `scripts/pre-merge-check.sh`, where a second positional is rejected with "unexpected argument" + exit 2. Since this script is the stated sole justification for the new `plugins/**` entry in `t1_skip_globs` (`_acceptance/config.yaml` comment), an arg-order typo silently blessing a hand-edited mirror undermines that exemption. Fix shape: reject `$#>1` (or loop argv), same exit 2 + pinned message; add the mutation case alongside P46.

- **title:** VIOLATION [scope] is the only VIOLATION line emitted on stderr — breaks the script's own output convention
  **file:** scripts/pre-merge-check.sh:341
  **severity:** low
  **source:** conventions
  **detail:** The new unresolvable-base check echoes "VIOLATION [scope]: ..." with `>&2`, while every other VIOLATION line in the script (~20: `[config]`, `[gap-probe]`, `[PR]`, `[ledger]`, per-slug) goes to stdout. The message borrows the VIOLATION label but routes like a usage error, so any consumer CI that captures/greps stdout for VIOLATION (the kit's own `gate.yml` step works around this by capturing `2>&1`) gets a bare exit 2 with no visible reason line. Same inconsistency is mirrored in `plugins/acceptance-gate/scripts/pre-merge-check.sh` (build mirror — fix at source and re-sync). Either drop `>&2` to match the other VIOLATION lines, or rename the message to the usage-error style ("pre-merge-check: ...") that the other stderr+exit-2 paths use. The suite tests (TE18j, gate.yml) all capture `2>&1` so they would not notice a change either way.

## Chua adversarial-verify (refuter chet)

- **title:** Empty PRE_MERGE_BASE guard fires even when a valid explicit --base is passed, and its remedy hint cannot be followed
  **file:** scripts/pre-merge-check.sh:58
  **severity:** low
  **source:** bugs
  **detail:** The set-but-empty check for `PRE_MERGE_BASE` runs BEFORE the argument-parse loop, so `PRE_MERGE_BASE="" pre-merge-check.sh . --base origin/main` exits 2 even though a real, resolvable base was explicitly supplied on the command line (verified by running it: exit=2). Two problems: (a) it breaks the flag-overrides-env convention — the explicit `--base` would have overwritten BASE at line 90 anyway, so the run is aborted over an env var that would never be used; (b) the error message says "unset it to run without a diff scope, or give it a real ref", but giving a real ref via `--base` does NOT clear the error — only unsetting the env var does, so the suggested remedy is misleading for the flag path. This is fail-loud, not silent (hence low severity), but a CI that exports `PRE_MERGE_BASE` as an empty default while also passing `--base` explicitly will be permanently red with a diagnostic pointing at the wrong fix. Mirror copy `plugins/acceptance-gate/scripts/pre-merge-check.sh` has the same behavior. Fix: move the guard after the parse loop and only fail when the empty env value would actually be consumed (i.e. no `--base` was given), or amend the message to say the env var itself must be unset. Note also no test covers the combination (RL14b only tests empty env WITHOUT `--base`). Everything else in the diff checked out: both test suites pass, ledger accounting is exhaustive across all traced branches, and the negative-assertion test cases all carry positive controls.
