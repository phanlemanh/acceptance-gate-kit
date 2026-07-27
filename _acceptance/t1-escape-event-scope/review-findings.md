# Review Findings: t1-escape-event-scope (round 10)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

No findings this round.

Both findings open at round 9 were verified fixed by commits landed between
round 9's pin (`1335ed993e486689a58f8d32f60974e38eaf3422`) and this round's
pin (`829314ede23b594857920373377c26ac78d88629`):

- Round-9 finding #1 (`--slug` với slug không tồn tại lọc sạch mọi thư mục
  và báo "clean") — fixed by `c6bf3e6 fix: guard --slug kiểm cùng NGỮ NGHĨA
  với bộ lọc thật — chặn /, . và ..` and `e1bfcf4 fix: 2 finding round 9 —
  bộ lọc khai-mà-không-khớp nổ to, base-khai-trên-root-không-git exit 2`.
  Re-verified against the new RL14a-e cases in
  `tests/scripts/run-tests.sh`: an unmatched `--slug` value (empty, typo'd,
  or containing `/`, `.`, `..`) now exits 2 with `VIOLATION [scope]` on
  stdout instead of silently reporting `pre-merge-check: clean`.
- Round-9 finding #2 (`--base` khai trên root mà git không dùng được vẫn
  skip âm thầm) — fixed by the same `e1bfcf4` commit. Re-verified against
  the new RL15a-d cases: a declared `--base` on a root where git itself is
  unusable now exits 2 with `VIOLATION [scope]` instead of falling through
  to the old `DIFF_SKIP_NOTE` skip path, matching the README's "ở MỌI repo"
  claim.

Both fixes are covered by fresh machine evidence this round (E1/E15/E17/E18
— see `evidence-report.md` round 10, `tests/scripts/run-tests.sh` 497
passed vs 477 in round 9), and `59ee5a7 test: pin thông điệp RL15d2/d3`
additionally pinned the expected "unknown option"-class message on two
sibling cases inside the same new block that would otherwise have been
exit-code-only assertions (CLAUDE.md invariant 4 class).

---

## Chưa adversarial-verify (refuter chết)

Không có finding nào trong round này chưa được adversarial-verify.
