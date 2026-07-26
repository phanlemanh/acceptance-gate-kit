# Review Findings: t1-escape-event-scope (round 3)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [medium] CONTEXT.md authoring language: chèn đoạn tiếng Việt vào file agent-facing toàn tiếng Anh, cắt đôi một câu tiếng Anh

- **file:** `commands/acceptance-init.md:121`
- **source:** invariants

`commands/acceptance-init.md:121-125` chèn một đoạn tiếng Việt vào GIỮA một
câu tiếng Anh đang dở: dòng 119-120 kết thúc bằng "`bash
scripts/pre-merge-check.sh . --base \"origin/$GITHUB_BASE_REF\"`" và phần
tiếp "(or export `PRE_MERGE_BASE`). The backstop blocks PRs that change..."
nằm ở dòng 126 — tức đoạn tiếng Việt tách vế trước khỏi vế sau của cùng một
câu, làm hướng dẫn đọc thành hai mảnh rời.
`codex/acceptance-gate/skills/acceptance-init/SKILL.md:113-117` chèn y hệt
đoạn đó vào một SKILL.md toàn tiếng Anh, kèm 3 space thụt lề còn sót từ ngữ
cảnh danh sách đánh số của bản Claude (SKILL.md ở đó không có danh sách nào
bao quanh). Hai file này ship cho consumer ở CẢ HAI harness. P44 chỉ assert
chuỗi con `--no-t1-escape` có mặt, nên không luật nào bắt được việc trộn
ngôn ngữ hay câu bị cắt đôi. CLAUDE.md invariant 2 yêu cầu SKILL.md/docs viết
theo term chuẩn của CONTEXT.md, mà CONTEXT.md quy định term chuẩn giữ tiếng
Anh khớp code — đoạn chèn dùng cách diễn đạt tiếng Việt tự do ("răng
T1-escape", "đỏ vĩnh viễn vì lý do cấu trúc") ngay trong instruction
agent-facing.

---

## 2. [medium] Unknown-flag guard only matches double-dash — single-dash typo silently becomes ROOT and the gate exits 0 without running any rule

- **file:** `scripts/pre-merge-check.sh:69`
- **source:** bugs

The new arg-parser guard uses `--*)` so it only rejects double-dash typos. A
single-dash typo (or any stray positional) falls through to `*)
ROOT="$1"` and produces exactly the fail-open the guard's own comment
describes. Verified: `bash scripts/pre-merge-check.sh -no-t1-escape --base
HEAD~1` prints `pre-merge-check: no _acceptance/ — nothing to check` and
exits 0 — zero rules executed, CI green. Same for `-base`, `-slug`, and for
`pre-merge-check.sh . extra` (ROOT silently retargeted to `extra`). TE18
only exercises `--no-t1escape`, so the suite cannot see this. Amplifier:
`scripts/pre-merge-check.sh:81` treats a missing `_acceptance/` as clean
exit 0. Fix: match `-*`, and/or reject a second positional / non-existent
ROOT. Identical defect in the build mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh:69`.

---

## 3. [medium] plugins/** exemption in t1_skip_globs is wider than the P30 sync check that justifies it, and that check fails open on a typo'd flag

- **file:** `_acceptance/config.yaml:56`
- **source:** bugs

The new `- "plugins/**"` entry exempts the whole tree from BOTH the
T1-escape teeth and the `stale_files()` staleness rule, justified in-comment
by `sync-plugin-packages.sh --check`. Two gaps: (1) that script only diffs
three hard-coded package dirs (acceptance-gate, feature-loop-codex,
design-loop-codex), so any other path under plugins/ — a future fourth
package, or a loose file — is exempt from every rule with nothing watching
it; P41 proves the guard works inside one package, not outside the
allowlist. (2) The guard itself is fail-open: `MODE="${1:-}"; if [ "$MODE" =
"--check" ]` means any other argument silently switches to write-in-place.
Verified on a copy with injected drift: `bash
.../sync-plugin-packages.sh --chek` printed `Synced Codex packages: ...`,
exited 0, and overwrote the injected drift (grep count went to 0) — the
'check' reported success while mutating the mirror. Before this diff that
was one guard among several for plugins/; after it, it is the only one.

---

## 4. [low] CONTEXT.md §Gates & verbs: "cổng" dùng cho lớp máy móc (pre-merge check / job CI) trong prose mới

- **file:** `docs/adr/0005-t1-escape-opt-out-flag.md:12`
- **source:** invariants

CONTEXT.md §Gates & verbs quy định Gate/cổng CHỈ dành cho điểm dừng con
người; lớp máy gọi là **the hook** hoặc **pre-merge check**, và ngoại lệ duy
nhất được ghi nhận là "P0 design gate". Prose mới trong range này thêm
nhiều lượt "cổng" trỏ thẳng vào pre-merge check hoặc job CI:
`docs/adr/0005:12` ("bịt mắt cổng"), `:16-17` ("làm cổng đỏ vì lý do cấu
trúc", "cổng đỏ thường xuyên"), `:25` ("làm cổng thoát 0 mà không chạy luật
nào"); `.out-of-scope/t1-skip-globs-github-and-manifests.md:8`, `:17` ("đổi
CI có thể TẮT cổng"), `:41`, `:46`; `_acceptance/config.yaml` (comment "đổi
CI có thể tắt cổng" trong khối plugins/**); `scripts/pre-merge-check.sh:67`
("cổng thoát 0"). Đây là DRIFT tiếp nối chứ không phải break mới —
`docs/adr/0004:12` và `README.md:246` đã dùng lối này trước range — nhưng
CONTEXT.md vẫn chưa có ngoại lệ tiếng Việt nào được ghi, nên mỗi lần viết
ADR mới lại nới thêm. Cần quyết một lần: hoặc bổ sung ngoại lệ vào
CONTEXT.md như đã làm cho "P0 design gate", hoặc sweep cả 0004/0005 về
"pre-merge check".

---

## 5. [low] Invariant 4 (ADR + .out-of-scope): ledger ID mà ADR 0005 và file .out-of-scope trích dẫn bị ghi ngày tương lai, mâu thuẫn thứ tự với run-log

- **file:** `_acceptance/t1-escape-event-scope/decisions.jsonl:1`
- **source:** invariants

CLAUDE.md invariant 4 bắt ADR và file .out-of-scope phải có vết truy
nguyên; ADR 0005 (dòng cuối) neo vào `d-20260727T040000Z-201` và
`.out-of-scope/t1-skip-globs-github-and-manifests.md:4` neo vào
`d-20260727T040100Z-202`. Hai ID đó tồn tại trong decisions.jsonl (đối
chiếu OK), nhưng field `at` của chúng là 2026-07-27T04:00:00Z / 04:01:00Z —
trong khi commit của cả range là 2026-07-26 (703675d 17:22 +0700 …
9f348e7 20:44 +0700) và run-log.jsonl dòng 1-2 ghi `ts:
2026-07-26T12:10:00Z`. Tức quyết định stage S1 mang dấu thời gian SAU các
lần chạy S4 mà nó lẽ ra đi trước, và sau cả commit cuối cùng của feature.
Toàn bộ 15 entry trong decisions.jsonl đều mang tiền tố 20260727. Vết audit
mà ADR/OOS trích dẫn vì thế không dựng lại được trình tự thật.

---

## 6. [low] sync-plugin-packages.sh prints a stale hard-coded version (1.20.1) while manifests are at 1.21.0

- **file:** `scripts/sync-plugin-packages.sh:75`
- **source:** bugs

`echo "Synced Codex packages: acceptance-gate@1.20.1 feature-loop-codex@
1.16.1 design-loop@0.3.0"` reports 1.20.1, but `.claude-plugin/plugin.json`,
`.codex-plugin/plugin.json` and
`codex/acceptance-gate/.codex-plugin/plugin.json` are all 1.21.0. This is
the same literal-pin rot the P03/P22 change in this diff removed from the
test suite; it was fixed in tests but left in the script's own
operator-facing output, so the script now reports a version that does not
exist.

---

## 7. [low] P42 accepts any nested-suite failure as proof the version-drift check fired

- **file:** `tests/plugins/run-tests.sh:577`
- **source:** bugs

P42 mutates `.codex-plugin/plugin.json` to 9.9.9 and asserts only that
`PLUGINS_SUITE_NESTED=1 bash .../run-tests.sh` exits non-zero. It never pins
which assertion fired. If the version-consistency assertion in P03 is later
removed or broken, any unrelated regression in the nested suite still makes
P42 pass — a green test guarding nothing. The positive control added in
round 2 rules out "always fails", not "fails for the right reason". Grep the
nested output for the "ba manifest lệch nhau" message instead of relying on
exit status alone.

---

## Chưa adversarial-verify (refuter chết)

none this round.
