# Review Findings: t1-escape-event-scope (round 1)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [high] Invariant 4 (ADR) — cờ `--no-t1-escape` + nhánh push tắt răng T1-escape không có ADR

- **file:** `scripts/pre-merge-check.sh:62`
- **source:** invariants

Range này thêm một escape hatch fail-OPEN cho răng T1-escape
(`scripts/pre-merge-check.sh:53,62-64,559`, `.github/workflows/gate.yml:53`
cho nhánh push tắt răng) nhưng `docs/adr/` KHÔNG có file mới nào (`git log
cd4b85f...HEAD -- docs/adr` rỗng). Đủ cả 3 điều kiện của CLAUDE.md:

- **(a) khó đảo** — cờ đã thành API công khai, `commands/acceptance-init.md`
  và `codex/acceptance-gate/skills/acceptance-init/SKILL.md` nay DẠY mọi
  consumer thêm nó vào CI; tệ hơn, arg parser có nhánh bắt-tất
  `*) ROOT="$1"` nên nếu sau này gỡ cờ thì `--no-t1-escape` bị nuốt thành
  ROOT → hỏng im lặng, không phải lỗi cứng.
- **(b) gây bất ngờ** — nó đúng là hình dạng quyết định mà ADR 0004 đã TỪ
  CHỐI cho gap-probe: "Chọn sửa CI chứ không miễn trừ nhánh không-base, vì
  miễn trừ đó lại đúng là lỗ vừa bịt"; người đọc ADR 0004 rồi đọc mã này sẽ
  thấy hai chuẩn ngược nhau mà không có chỗ nào giải thích vì sao răng
  T1-escape được miễn còn gap-probe thì không.
- **(c) trade-off thật và đã được cân nhắc** — comment trong mã tự luận
  opt-out vs opt-in ("opt-in sẽ làm răng tắt IM LẶNG trên mọi repo tiêu
  thụ"). Lý do hiện chỉ nằm trong comment mã + ledger per-feature
  `_acceptance/t1-escape-event-scope/decisions.jsonl` — cả hai đều biến mất
  khỏi tầm mắt khi feature đóng; ADR là nơi CLAUDE.md chỉ định.

**Detail:** Ghi ADR 0005 theo khuôn 0004 (nêu rõ: khác gap-probe ở chỗ nào,
marker `T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise` là hàng rào
gì, và răng: TE16/TE17/P40).

---

## 2. [high] P40's "PR branch must not disable T1-escape" assertion is vacuous — verified it passes on a mutant

- **file:** `tests/plugins/run-tests.sh:618`
- **source:** bugs

P40 filters gate.yml to `pr_lines = [l for l in wf.splitlines() if
"base_ref" in l]`, then asserts none of those lines contains
`--no-t1-escape`. But the PR branch sets the flag on its own line (`echo
"T1_ESCAPE_FLAG=" >> "$GITHUB_ENV"`), which contains no `base_ref`. Only two
lines in gate.yml match the filter (the `PRE_MERGE_BASE=origin/${{
github.base_ref }}` echo and `--base "origin/${{ github.base_ref }}"` in the
backstop step), and neither could ever carry the flag under any plausible
regression.

**Detail:** Verified by mutation — rewriting the PR branch to `echo
"T1_ESCAPE_FLAG=--no-t1-escape"` still passes all four P40 assertions. This
is the ONLY automated guard that PRs keep the T1-escape tooth armed, and it
cannot fail — the same non-discriminating-assertion class that commit
957e992 just fixed in P43. Fix: match on the T1_ESCAPE_FLAG assignment lines
(e.g. parse the if/else arms), not on `base_ref`.

---

## 3. [high] Unrecognized flag is swallowed as ROOT and silently greens the whole gate (exit 0)

- **file:** `scripts/pre-merge-check.sh:65`
- **source:** bugs

Arg parsing validates `--slug` and `--base` arguments, but the catch-all
`*) ROOT="$1"; shift ;;` absorbs any unrecognized option into ROOT. Combined
with line 76 (`[ -d "$ACC" ] || { echo "pre-merge-check: no _acceptance/ —
nothing to check"; exit 0; }`), a misspelled flag makes the entire pre-merge
gate exit 0 without running a single rule.

**Detail:** Verified — `bash scripts/pre-merge-check.sh . --no-t1escape
--base HEAD~1` prints "no _acceptance/ — nothing to check" and exits 0. The
catch-all predates this diff, but this diff makes it reachable in practice:
it introduces the first optional flag AND instructs every consumer to
hand-copy it into CI (commands/acceptance-init.md:120-125 and
codex/acceptance-gate/skills/acceptance-init/SKILL.md:113-118). The authors
were aware of the hazard — TE2a3/TE2a4 exist to distinguish "flag
understood" from "flag treated as ROOT" — but the guard lives only in the
test fixture, not in the script. Fix: in the catch-all, reject anything
starting with `--` (`echo "pre-merge-check: unknown option $1" >&2; exit
2`). Same defect in the build mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh` (byte-identical file).

---

## 4. [medium] Invariant 4 (.out-of-scope) — đề xuất miễn trừ `.github/**` + `.claude-plugin/plugin.json` bị từ chối, chưa có file `.out-of-scope/`

- **file:** `.out-of-scope/gap-probe-write-time-hook.md:1`
- **source:** invariants

Feature này ship (status draft→implemented ở `e7ceb91`) với một đề xuất đã
TỪ CHỐI dứt khoát: nới `t1_skip_globs` cho `.github/**` và
`.claude-plugin/plugin.json` (ledger `d-20260727T040100Z-202`, và
`_acceptance/t1-escape-event-scope/contract.md` mục Ngoài phạm vi).

**Detail:** Nguy cơ quay lại là CAO và cụ thể, không phải giả định: chính
cơn đau sinh ra feature này (commit hạ tầng bump manifest / sync mirror làm
cổng đỏ) sẽ tái diễn ở lần release kế, và phản xạ tự nhiên của người kế tiếp
là "thêm nốt hai path đó vào skip_globs" — đúng lỗ mà d-202 giải thích là
chí tử (đổi `.github/` có thể TẮT cổng; `plugin.json` khai được hooks).
Theo CLAUDE.md phải có 1 file trong `.out-of-scope/` kèm mục "Prior
requests" (xem khuôn `.out-of-scope/gap-probe-write-time-hook.md` — có sẵn
cả mục "Nếu đề xuất này quay lại"). Hiện lý do chỉ sống trong ledger
per-feature + comment `_acceptance/config.yaml:52-55`, tức chết cùng
feature. (Ghi nhận: quyết định d-202 được ghi TRƯỚC cd4b85f, nhưng range
này là lượt ship nên là điểm cuối hợp lý để lập hồ sơ.)

---

## 5. [medium] P41 passes whenever sync-plugin-packages.sh fails for any reason, including a broken fixture copy

- **file:** `tests/plugins/run-tests.sh:552`
- **source:** bugs

P41 does `cp -R "$ROOT/." "$P41T/" 2>/dev/null || true` (copy errors
explicitly discarded), then appends to the mirror file without checking the
result, then `if bash "$P41T/scripts/sync-plugin-packages.sh" --check
>/dev/null 2>&1; then fail; else pass; fi`. Any non-zero exit counts as
success — including exit 127 when the copy failed and the script does not
exist, so the case can go green having tested nothing.

**Detail:** This matters because P41 is the load-bearing RED case cited in
`_acceptance/config.yaml:51-55` to justify adding `plugins/**` to
`t1_skip_globs`, an exemption that now also suppresses the staleness rule
for the entire shipped mirror. The sibling P45 avoids this by pairing its
exit-code assertion with a positive control; P41 has none. Fix: capture the
output and assert it names the drifted file (e.g. grep for
`gap-probe.js`), and drop the `2>/dev/null || true` on the cp so a broken
fixture fails loudly.

---

## 6. [low] Plan self-review lệch với contract sau khi thêm AC-17 (bảng "Spec coverage — 16 AC" không được cập nhật)

- **file:** `docs/superpowers/plans/2026-07-26-t1-escape-event-scope.md:574`
- **source:** invariants

Commit `d64abd3` viết lại AC-16 và THÊM AC-17 (+ eval E18) vào
`_acceptance/t1-escape-event-scope/contract.md` và `evals.yaml`, nhưng plan
không được cập nhật cùng lượt: mục Self-Review vẫn ghi "Spec coverage — 16
AC" với bảng AC-1..AC-16 và khẳng định "Không AC nào không có task" (dòng
574-587), còn Task 7 vẫn ghi "**Evals phục vụ:** E17 (AC-16)" (dòng 454) —
không có AC-17/E18. `grep -n "AC-17" plan` = 0 hit.

**Detail:** Hệ quả: artifact plan giờ nói dối về độ phủ, đúng lớp
"xanh-rỗng" mà chính ledger `d-208` vừa phê phán. Nit từ vựng đi kèm
(CONTEXT.md, invariant 2): tiêu đề dùng "Spec", mà `_Avoid_` của
**Contract** liệt kê "spec, PRD (đó là *input* của Phase 1)" — đây là
heading có sẵn của template superpowers (xuất hiện ở 6 plan cũ) nên là nợ
hệ thống chứ không phải lỗi mới của range này; W6 lint không quét plan nên
không bắt.

---

## Chưa adversarial-verify (refuter chết)

none this round.
