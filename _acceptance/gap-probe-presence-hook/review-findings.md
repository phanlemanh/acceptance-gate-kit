# Review Findings: gap-probe-presence-hook (round 7)

Informational — adversarial-verified findings from this VERIFY round. Not
hook-enforced; feeds Gate 2 human review.

## Findings

- **title:** README still claims unresolvable --base is "skip + clean" — behavior changed to exit 2 in this same diff
  **file:** README.md:259
  **severity:** medium
  **source:** bugs
  **detail:** The bullet says: "pre-merge-check.sh coi base không resolve được là *skip + clean* — đúng cho repo tiêu thụ, nhưng ở repo kit ... CI nâng skip thành lỗi". This diff changed scripts/pre-merge-check.sh (PR diff scope block, ~line 319-323) so that a base that was GIVEN but does not resolve is now VIOLATION [scope] + exit 2 everywhere, consumers included — verified empirically: `pre-merge-check.sh . --base khong-ton-tai` prints VIOLATION [scope] and exits 2. The remaining skip+clean path only covers base-not-given / no-merge-base. gate.yml's comment was updated to the new behavior in the same diff, but this README bullet (the section right next to a bullet that WAS edited) still teaches operators of consuming repos the old fail-open behavior and misattributes the fail-loud to kit-CI-only wrapping. Consumers reading it will not expect their CI to hard-fail after upgrading to 1.22.0.

- **title:** acceptance-init push-job paragraph duplicates its own warning verbatim (append-fix instead of merge), x3 files
  **file:** commands/acceptance-init.md:135
  **severity:** low
  **source:** conventions
  **detail:** The round-6 HIGH fix (3be6be8, version floor 1.21.0 -> 1.22.0) was appended as a parenthetical — "Support landed in acceptance-gate 1.22.0+ (on 1.21.0 the parser swallows the flag as the repo-root path and the WHOLE gate silently no-ops — re-copy the script before adding the flag)." — onto a paragraph whose two preceding sentences already say exactly that ("re-copy scripts/pre-merge-check.sh from the plugin BEFORE you add this flag. Older vendored copies ... treat --no-t1-escape as the ROOT path ... exit 0 with the ENTIRE pre-merge check unrun"). The same duplicated text is mirrored in codex/acceptance-gate/skills/acceptance-init/SKILL.md:127 and plugins/acceptance-gate/skills/acceptance-init/SKILL.md:127; the codex copy additionally carries three stray blank lines before the IMPORTANT block and no blank line before "## 6. Optional references". This is agent-facing instruction text — redundancy costs prompt budget and reads as an unmerged patch; fold the parenthetical into the preceding sentences in the source files and re-run scripts/sync-plugin-packages.sh.

- **title:** GUIDE push-job snippet silently collapses to a scope-less run on shallow checkout: --base "$(git rev-parse HEAD~1)" becomes --base ""
  **file:** GUIDE.md:575
  **severity:** low
  **source:** bugs
  **detail:** The new push-job snippet is a bare `bash scripts/pre-merge-check.sh . --base "$(git rev-parse HEAD~1)" --no-t1-escape` with no checkout context, while the PR snippet just above (line 565) explicitly requires fetch-depth: 0. actions/checkout defaults to fetch-depth: 1, where `git rev-parse HEAD~1` fails; the command substitution failure does not trip GitHub's `bash -e` (same trap the diff itself documents in sync-plugin-packages.sh), so the flag degrades to `--base ""`. Verified empirically: `--base ""` is treated as "no PR base given" — gap-probe AND t1-escape both go declared-off and the run exits 0 in advisory mode. That directly contradicts the snippet's own stated purpose ("VẪN giữ --base: luật gap-probe cần phạm vi diff"): a consumer following the doc verbatim gets a green CI with both diff-scoped rules off, the exact silent-degradation class this feature wave was built to close (fail-closed VIOLATION [scope] only fires when the base string is non-empty). Fix is a one-line doc addition: state the push job also needs fetch-depth: 0 (or use the fail-closed `--base HEAD~1` form so an unresolvable ref exits 2 instead of vanishing).

## Chua adversarial-verify (refuter chet)

(none — tat ca finding tren da duoc adversarial-verify; khong co finder chet round nay)
