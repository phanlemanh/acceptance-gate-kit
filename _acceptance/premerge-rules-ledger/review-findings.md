# Review Findings: premerge-rules-ledger (round 4)

Informational — outside the hook-enforced evidence-report schema. Findings
below have all been adversarial-verified (reproduced or traced to exact
code/doc lines) prior to listing here.

---

## 1. [MEDIUM] GUIDE fail-closed CI snippet parses `enforcement: off` narrower than the two real parsers it must mirror

- **File**: `GUIDE.md:636`
- **Source**: conventions

The new "Sổ luật-đã-chạy" section tells consumers to fail-closed with
`grep -qE '^enforcement:[[:space:]]*off[[:space:]]*(#.*)?$' _acceptance/config.yaml`.
This pattern allows no whitespace before the colon, but both real parsers of
this key do: `hooks/acceptance-evidence-gate.js` uses
`/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m` and
`scripts/pre-merge-check.sh` (this same diff) uses
`'^enforcement[[:space:]]*:[[:space:]]*(strict|warn|off)...'` — the
`enforcement : off` variant is explicitly pinned as valid-off by new test
RL11c case `spacecolon`.

Verified: `printf 'enforcement : off' | grep -qE <GUIDE pattern>` misses
while the parser pattern matches. Consequence: a consumer with
`enforcement : off` gets ledger legitimately off (no
`pre-merge-check: rules ran=` line), exit 0, and the GUIDE snippet then
turns the job permanently red with the wrong diagnosis ("kiểm lại
working-directory") — exactly trap #3 the snippet itself warns about. This
also violates the wave's own stated convention (comment block in
`pre-merge-check.sh`) that every reader of the `enforcement` key must
duplicate the hook regex dimension-for-dimension.

Same class of gap as round 3's findings #1/#3 (parser parity on
`enforcement : off`), this time surfacing in prose/docs guidance rather than
in a script — consistent with the "sửa theo LỚP, không vá case" lens: fixing
the shell parsers alone left the doc-facing copy of the same regex
unmirrored.

Fix in source `GUIDE.md` (use the parser's pattern, e.g.
`^enforcement[[:space:]]*:[[:space:]]*off[[:space:]]*(#.*)?$`) and re-run
`scripts/sync-plugin-packages.sh` so the mirror copy at
`plugins/acceptance-gate/GUIDE.md:636` follows.

---

## Chưa adversarial-verify (refuter chết)

Không có — finding duy nhất ở trên đã adversarial-verify (repro thực nghiệm
+ trace tới đúng dòng doc) trước khi liệt vào file này. Không có finder nào
chết trong round này.
