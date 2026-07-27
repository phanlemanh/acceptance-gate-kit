# Review Findings: premerge-rules-ledger (round 10)

Informational — outside the hook-enforced evidence-report schema. Findings
below have all been adversarial-verified (reproduced or traced to exact
code/doc lines) prior to listing here.

## Findings

1. **Plugin descriptions advertise sync-plugin-packages.sh hardening that is
   not shipped in any package** — LOW
   File: `codex/acceptance-gate/.codex-plugin/plugin.json:4`
   The 1.22.1 description text (identical sentence in
   `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and
   `codex/acceptance-gate/.codex-plugin/plugin.json`, mirrored to `plugins/`)
   ends with "...and sync-plugin-packages.sh rejects extra argv so an
   argument-order typo can never turn a check into a write." But
   `sync-plugin-packages.sh` is kit-repo maintenance tooling explicitly
   excluded from every shipped package
   (`scripts/sync-plugin-packages.sh:44` rsyncs `scripts/` with `--exclude
   'sync-plugin-packages.sh'`; `plugins/acceptance-gate/scripts/` contains no
   such file). A marketplace consumer is promised hardening they do not
   receive. This is the same description-vs-shipped-surface mismatch class
   that P49 (`tests/plugins/run-tests.sh`) was added in this very diff to
   police — P49 only pins Claude-only phrases, so it cannot catch this
   variant. Fix is to drop that clause from the plugin descriptions (it
   belongs in the repo changelog/commit message), or ship the
   guard-relevant behavior; not fixed per review scope.

2. **Enforcement parity gap: hook regex accepts multiline value, pre-merge
   grep does not (fail-closed direction only)** — LOW
   File: `scripts/pre-merge-check.sh:227`
   Confirmed by repro: with config `enforcement:\n  off` (value on the next
   indented line — valid YAML), the hook regex
   `/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m` in
   `hooks/acceptance-evidence-gate.js` matches `off` because JS `\s*` spans
   the newline under `/m`, so the WRITE-time gate goes fully off; the new
   line-based grep in `pre-merge-check.sh` matches nothing, so the rules
   ledger stays ON. This contradicts the comment claiming the grep
   replicates the hook regex "theo TỪNG chiều" and is not covered by the
   RL11c parity table (no multiline variant). Impact is benign/fail-closed:
   any line the grep matches is also matched by the hook regex, so the
   pre-merge ledger can never be silently off while the hook enforces — the
   dangerous fail-open direction is impossible. Same text is mirrored at
   `plugins/acceptance-gate/scripts/pre-merge-check.sh` (mirror verified
   byte-identical). Consider adding a multiline variant to RL11c and either
   tolerating the divergence explicitly in the comment or anchoring the hook
   regex value to the same line.

---

## Chưa adversarial-verify (refuter chết)

Không có — cả 2 finding trên đã adversarial-verify (repro trực tiếp +
truy vết đúng dòng mã).
