# Review Findings: gap-probe-presence-hook (round 6)

Informational — adversarial-verified findings from this VERIFY round. Not
hook-enforced; feeds Gate 2 human review.

## Findings

- **title:** Doc version floor '1.21.0+' for --no-t1-escape is wrong; true floor is 1.22.0 and following it reproduces the exact silent fail-open the doc warns about
  **file:** commands/acceptance-init.md:135
  **severity:** high
  **source:** conventions
  **detail:** Released acceptance-gate 1.21.0 is commit 834eae8 — the base of this diff — and its scripts/pre-merge-check.sh contains neither the --no-t1-escape flag nor the unknown-flag guard (verified: `git show 834eae8:scripts/pre-merge-check.sh` has no 'no-t1-escape' and no 'unknown option'; manifest at 834eae8 says 1.21.0). Both the flag and the `-*` guard land inside this range, and the only release commit in the range is 1.22.0 (c412943); the t1-escape feature shipped without a manifest bump, so the string '1.21.0' labels two different artifacts. Yet three source docs claim 'Support landed in acceptance-gate 1.21.0+' / 'cần acceptance-gate 1.21.0+': /Users/manh-macmini/dev/acceptance-gate-kit/commands/acceptance-init.md:135, /Users/manh-macmini/dev/acceptance-gate-kit/codex/acceptance-gate/skills/acceptance-init/SKILL.md:127, /Users/manh-macmini/dev/acceptance-gate-kit/GUIDE.md:572 (plus their plugins/ mirror copies via sync). A consumer on the actually-released 1.21.0 who trusts this floor re-copies a script whose parser is still `*) ROOT="$1"`, so `--no-t1-escape` is swallowed as the ROOT path, `_acceptance/` is not found, and CI exits 0 with the ENTIRE pre-merge check unrun — exactly the fail-open these paragraphs describe. Fix: change the floor to 1.22.0+ in all three source files and re-run scripts/sync-plugin-packages.sh.

- **title:** Docs pin --no-t1-escape support to 1.21.0+, but it ships in 1.22.0 — invites the exact silent full-gate bypass the docs warn about
  **file:** commands/acceptance-init.md:135
  **severity:** high
  **source:** bugs
  **detail:** commands/acceptance-init.md:135, GUIDE.md:572, codex/acceptance-gate/skills/acceptance-init/SKILL.md:127 (plus their two plugins/ mirror copies) all state support for --no-t1-escape 'landed in acceptance-gate 1.21.0+'. Verified against git history: the flag AND the unknown-flag guard were added after base commit 834eae8, whose manifest reads 1.21.0; the only version bump in this range is 1.21.0 -> 1.22.0 (commit c412943). On actual released 1.21.0 the arg parser's catch-all `*) ROOT="$1"` swallows --no-t1-escape as the ROOT path, the script prints 'no _acceptance/ — nothing to check' and exits 0 with the ENTIRE pre-merge gate unrun (signoff, verdict, staleness, gap-probe, T1-escape). A consumer already on 1.21.0 reads '1.21.0+', skips the re-copy step, adds the flag to their push job, and gets permanently green CI with zero rules enforced — the precise false-green class this kit exists to block. Fix: change the floor to 1.22.0+ in the three source files and re-run scripts/sync-plugin-packages.sh to update the mirror.

- **title:** Stale comment in gate.yml backstop step: unresolvable base is no longer 'skip + clean' — this range made it VIOLATION [scope] + exit 2
  **file:** .github/workflows/gate.yml:71
  **severity:** low
  **source:** conventions
  **detail:** The T1-escape backstop step's comment in /Users/manh-macmini/dev/acceptance-gate-kit/.github/workflows/gate.yml says 'pre-merge-check coi base không resolve được là "skip + clean"' to justify the `*"backstop skipped"*` case-guard. But this same diff range changed scripts/pre-merge-check.sh so that a declared-but-unresolvable base prints 'VIOLATION [scope]' and exits 2 (see the BASE_SHA block around scripts/pre-merge-check.sh:318-324). The 'backstop skipped' NOTE now only fires for the no-merge-base / git-diff-failed branch (and for no --base, which this step never hits). Behavior remains fail-closed either way (st=2 propagates through `exit "${st:-0}"`), so this is a doc-accuracy issue, not a hole — but the comment now misdescribes which failure mode the grep guard covers and should be updated to match the new exit-2 behavior.

- **title:** Stale comment in gate.yml T1-escape backstop: claims unresolvable base is 'skip + clean', but this diff made it hard exit 2
  **file:** .github/workflows/gate.yml:71
  **severity:** low
  **source:** bugs
  **detail:** Lines 71–74 say "pre-merge-check coi base không resolve được là 'skip + clean'" to justify the `*"backstop skipped"*` escalation. This same diff changed scripts/pre-merge-check.sh so an unresolvable --base now prints 'VIOLATION [scope]' and exits 2 (fail-closed); only the missing-merge-base path (`git diff` failure on shallow/grafted clones) still produces 'backstop skipped'. Behavior remains fail-closed on every path (exit 2 propagates via `exit "${st:-0}"`), so this is comment drift only — but it misdescribes the premise of a security-relevant guard and should be updated to name the merge-base case as the remaining skip path.

## Chua adversarial-verify (refuter chet)

(none — tat ca finding tren da duoc adversarial-verify; khong co finder chet round nay)
