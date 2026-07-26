# Review Findings: premerge-rules-ledger (round 2)

Informational — outside the hook-enforced evidence-report schema. Findings
below have all been adversarial-verified (reproduced or traced to exact
code/doc lines) prior to listing here.

---

## 1. [HIGH] Enforcement parse still diverges from the hook on quoted values — the case-sensitivity fix patched the named case, not the class

- **File**: `scripts/pre-merge-check.sh:147`
- **Source**: conventions

Round-1 finding #1 was "enforcement: OFF disables the ledger while the hook
stays strict", fixed by no longer lowercasing. But the same `sed` chain
(copied from `fm_field`) still strips surrounding quotes:
`-e 's/^["\'']//' -e 's/["\'']$//'`. The hook regex at
`hooks/acceptance-evidence-gate.js:56`
(`/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m`) accepts no quotes.

Verified against both parsers on the same `config.yaml`:

| value | ledger summary lines | hook |
|---|---|---|
| `strict` | 1 | strict |
| `off` | 0 | off |
| `OFF` | 1 | strict (the fixed case) |
| `"off"` | 0 | strict |
| `'off'` | 0 | strict |

The last two are exactly the fail-open the inline comment at lines 150-156
claims to close ("Hai parser phải cùng ngữ nghĩa", "fail-open kích hoạt
bằng typo"): the rules ledger goes silently off (no `ran`/`declared-off`/
`pre-merge-check: rules ran=` lines emitted at all) while every other
enforcement layer keeps running, so nothing signals that the
proof-of-execution layer is gone.

This is the CLAUDE.md invariant "sửa phải theo LỚP: quét cả file tìm mọi
case cùng hình dạng, đừng chỉ vá case bị nêu tên" — test RL11c pins only the
case variant, there is no quote variant. Same line in the mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh:147`.

---

## 2. [MEDIUM] GUIDE's new fail-closed CI snippet swallows the entire gate output under `set -e` (GitHub Actions default)

- **File**: `GUIDE.md:620`
- **Source**: conventions

The newly added snippet is:

```
out="$(bash scripts/pre-merge-check.sh . --base "origin/$GITHUB_BASE_REF")"; st=$?
printf '%s\n' "$out"
grep -q '^pre-merge-check: rules ran=' <<<"$out" || { ...; exit 1; }
exit $st
```

GitHub Actions runs `run:` steps under `bash -e` (`-eo pipefail` for
`shell: bash`), and `commands/acceptance-init.md:117-129` points consumers
explicitly at GitHub Actions. Under `-e` the assignment aborts the step as
soon as the gate exits non-zero, so `st=$?`, the `printf`, and the ledger
`grep` never execute.

Reproduced on a fixture repo with one violation: plain `bash ci.sh` prints
the full gate output and exits 1; `bash -eo pipefail ci.sh` prints NOTHING
and exits 1.

Consequence on every violating PR and on every exit-2 ledger mismatch: the
operator sees zero diagnostics — including the "NOTE: VIOLATION [ledger] là
lỗi NỘI TẠI của cổng ... báo maintainer" line that exists precisely so they
do not go debug their own feature — and the fail-closed grep the snippet was
added for never runs.

Fix: wrap in `set +e`, or use `if ! out="$(...)"; then st=$?; fi`.

Same paragraph, secondary issue: the snippet is presented unconditionally,
but `enforcement: off` also suppresses the `pre-merge-check: rules ran=`
line (script line 157), so a consumer on `enforcement: off` who adopts it
gets a permanently red job. Mirrored at
`plugins/acceptance-gate/GUIDE.md:620`.

---

## 3. [MEDIUM] `[ledger]` tag collides with the pre-existing meaning of "ledger" (decisions.jsonl) in the same output stream

- **File**: `scripts/pre-merge-check.sh:706`
- **Source**: conventions

Lines 706, 709, 716 and 723 emit `VIOLATION [ledger]: ...` / `NOTE:
VIOLATION [ledger] là lỗi NỘI TẠI của cổng` for the new RULES ledger. The
same script already prints, at lines 469 and 472, `NOTE: [$slug]: phản biện
context sạch đã được BỎ có chủ đích theo ledger $gp_id` and `VIOLATION
[$slug]: ... ledger không có entry descope` — where "ledger" means the
decisions ledger (`decisions.jsonl`, also referenced as `ledger.broken` in
`scripts/gate-card.js:208`).

Both senses can appear in a single run's output with nothing to disambiguate
them, and CONTEXT.md has no entry for "ledger"/"sổ" at all, so the kit
glossary offers no resolution either. CLAUDE.md invariant #2 asks for
correct, non-colliding terminology in script messages and docs. A CI
operator reading "VIOLATION [ledger]" will reasonably go open
`decisions.jsonl`.

Either tag the new checks `[rules-ledger]` / `[sổ luật]`, or add both senses
to CONTEXT.md.

---

## 4. [MEDIUM] `enforcement: "off"` (quoted) silently disables the rules ledger while the write-time hook stays strict

- **File**: `scripts/pre-merge-check.sh:147`
- **Source**: bugs

The config read strips surrounding quotes
(`sed -e 's/^["\'']//' -e 's/["\'']$//'`) before
`case "$cfg_enf" in off) LEDGER_ENABLED=0`. The hook at
`hooks/acceptance-evidence-gate.js:56` matches
`/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m`, which does NOT match
`enforcement: "off"` or `enforcement: 'off'` and therefore falls back to
`strict`.

Reproduced: a fixture with `enforcement: "off"` makes `pre-merge-check`
print `pre-merge-check: clean` with zero ledger lines and no
`pre-merge-check: rules ran=` summary (chokepoint fully disabled), while the
hook keeps enforcing strict. This is exactly the two-layer divergence the
comment directly above the code claims to prevent ("Hai parser phải cùng
ngữ nghĩa" ... "sổ ở pre-merge tắt IM LẶNG — fail-open kích hoạt bằng
typo"). Commit 0422f08 fixed only the case dimension (dropped `tr
'[:upper:]' '[:lower:]'`, pinned by RL11c) and left the quoting dimension
open.

Quoted scalars are an idiomatic, explicitly supported style in this same
parser block — GPM11a (`tests/scripts/run-tests.sh:1730-1732`) asserts
`gap_probe: "required"` is accepted — so this is realistic input, not a
contrived typo. Same defect in the build mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh` (byte-identical file).

(Related: finding #1 above surfaces the same root cause from an independent
adversarial-verify pass with emphasis on the missing test coverage — kept as
a separate entry per source, `conventions` vs `bugs`.)

---

## 5. [LOW] GUIDE fail-closed CI snippet contradicts documented `enforcement: off` behavior and collapses exit 2 into exit 1

- **File**: `GUIDE.md:622`
- **Source**: bugs

The recommended consumer guard
`grep -q '^pre-merge-check: rules ran=' <<<"$out" || { echo "cổng không
chạy luật nào — kiểm lại đường dẫn repo"; exit 1; }` hard-fails whenever the
summary line is absent. Eight lines below, the same GUIDE section documents
that `enforcement: off` turns the ledger off entirely (verified: no
`ran`/`declared-off` lines and no `rules ran=` line are emitted — pinned by
RL11a). A repo that legitimately sets `enforcement: off` (or the quoted form
from finding 4) therefore gets a red CI job with a diagnosis pointing at the
wrong cause (repo path / working-directory) instead of the config key.

Secondary effect: the guard runs before `exit $st`, so an argument-parse
`exit 2` — which also precedes the summary line, as pinned by RL5b — is
rewritten to `exit 1`, erasing the "internal gate error vs. feature
violation" distinction that ADR 0006 introduced exit 2 for. Same text in the
mirror `plugins/acceptance-gate/GUIDE.md`.

---

## Chưa adversarial-verify (refuter chết)

Không có — toàn bộ 5 finding ở trên đều đã adversarial-verify (repro thực
nghiệm hoặc trace tới đúng dòng code/doc) trước khi liệt vào file này. Không
có finder nào chết trong round này.
