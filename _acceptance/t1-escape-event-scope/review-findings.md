# Review Findings: t1-escape-event-scope (round 5)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [medium] Invariant #4 — TE5 kết luận từ exit≠0, không ghim thông điệp, không đối chứng dương

- **file:** `tests/scripts/run-tests.sh:2169`
- **source:** invariants

TE5 (dòng 2169-2175) dựng fixture (xoá giá trị `human_signoff` của feat-y)
rồi kết luận CHỈ từ `check TE5a 1 "$TE5ST"` + `nothas TE5b "pre-merge-check:
clean"`. Thiếu cả hai vế bất biến #4: (a) không chạy bản nguyên vẹn để xác
nhận nó XANH trước, (b) không ghim thông điệp `VIOLATION [feat-y]: verdict
PASS but human_signoff is empty (Gate 2 pending)`. Đã kiểm chứng bằng đột
biến trên bản sao repo: đổi chuỗi đó ở scripts/pre-merge-check.sh:450 thành
'TOTALLY BOGUS MESSAGE' → toàn bộ suite vẫn 332 passed / 0 failed, tức không
case nào trong dải diff phân biệt được luật chữ ký bắn đúng lý do hay một
luật khác bắn. (Đột biến thứ hai — vô hiệu hoá hẳn nhánh `if [ -z "$signoff"
]` — làm TE5a/TE5b đỏ, nên case còn răng ở mức 'có violation nào đó', nhưng
đúng lớp lỗi mà bất biến #4, thêm ở ccacf24 trong CHÍNH dải này, cấm.) Cùng
lớp với các finding round 4 đã sửa cho TE18d/f/g và P46 — sửa theo FINDING
chứ chưa theo LỚP: TE5 nằm ngay giữa TE4 (đã ghim thông điệp) và TE7.

---

## 2. [medium] Cổng của chính kit đỏ tại HEAD — 2 violation, một cái do chính dải diff này sinh ra

- **file:** `_acceptance/gap-probe-presence-hook/evidence-report.md:10`
- **source:** invariants

`bash scripts/pre-merge-check.sh . --base cd4b85f` tại HEAD → 2 violation,
merge blocked: (a) `VIOLATION [gap-probe-presence-hook]: evidence is stale —
code changed after verify (verified_commit 834eae8…)` liệt 7 file nguồn đổi
sau khi slug đó đã ký (.github/workflows/gate.yml,
codex/acceptance-gate/skills/acceptance-init/SKILL.md,
commands/acceptance-init.md, scripts/pre-merge-check.sh,
scripts/sync-plugin-packages.sh, tests/plugins/run-tests.sh,
tests/scripts/run-tests.sh); (b) `VIOLATION [t1-escape-event-scope]:
verdict=PENDING-JUDGMENT (must be PASS to merge)`. Trớ trêu: chính diff này
thêm ghi chú GUIDE.md (~dòng 196) cảnh báo đúng vòng lặp 'ký → đổi code →
stale → verify lại → ký lại'. Lưu ý đây không phải một trong 5 gạch đầu dòng
của CLAUDE.md, nhưng là trạng thái cổng repo tự chạy, và review-findings.md
round 4 (#5) đã nêu mà HEAD vẫn chưa xử lý.

---

## 3. [medium] `set -e` does not abort on a failing command substitution — the "khong nuot loi" fix for `_v` is inert, sync still exits 0 with a blank version

- **file:** `scripts/sync-plugin-packages.sh:89`
- **source:** bugs

Commit 4008e4f removed `2>/dev/null || echo '?'` from `_v` on the stated
premise that, under `set -euo pipefail`, a node/manifest failure would then
be fatal (comment lines 86-87: "manifest doi ten / node vang / JSON hong
phai NO"). That premise is wrong: bash's `-e` is not triggered when a
command substitution fails inside the argument list of a simple command —
only the status of `echo` counts.

Verified on a full copy of the repo with `design-loop/.codex-plugin/plugin.json`
renamed away:

    $ bash scripts/sync-plugin-packages.sh
    <node MODULE_NOT_FOUND stack trace>
    Synced Codex packages: acceptance-gate@1.21.0 feature-loop-codex@1.16.1 design-loop@
    EXIT=0

So a missing node, a renamed manifest, or malformed JSON produces a success
line with an empty version and exit status 0 — exactly the swallowed error
the comment claims is impossible. The write side already ran, so the
operator's only signal that the wrong package version shipped is a blank
field.

Fix: capture into variables before printing so `set -e` actually fires, e.g.
`AGV="$(_v ...)"` (assignment form DOES trip `-e`), or add an explicit
`[ -n "$AGV" ] || { echo ... >&2; exit 1; }`.

---

## 4. [medium] Version line reads manifests that are NOT the ones shipped into `plugins/` for 2 of 3 packages

- **file:** `scripts/sync-plugin-packages.sh:89`
- **source:** bugs

`build_feature_loop` overlays from `codex/feature-loop-codex/` and
`build_design_loop` from `codex/design-loop/` (lines 54, 64), so the
manifests that actually land in `plugins/feature-loop-codex/` and
`plugins/design-loop-codex/` are
`codex/feature-loop-codex/.codex-plugin/plugin.json` and
`codex/design-loop/.codex-plugin/plugin.json`.

The new line 89 instead reads `feature-loop/.claude-plugin/plugin.json` and
`design-loop/.codex-plugin/plugin.json` — sibling manifests that are not
part of the build.

For design-loop nothing keeps them equal. They already differ in content
today:

    $ diff design-loop/.codex-plugin/plugin.json plugins/design-loop-codex/.codex-plugin/plugin.json
    (differs in description, keywords, commands, shortDescription, longDescription)
    $ diff codex/design-loop/.codex-plugin/plugin.json plugins/design-loop-codex/.codex-plugin/plugin.json
    (identical)

And no test pins `design-loop/.codex-plugin/plugin.json` — P22 only asserts
`codex/design-loop/.codex-plugin/plugin.json == "0.3.0"`. The versions
coincide at 0.3.0 right now, so the first independent bump of the Codex
overlay makes the script report a version it did not sync — the same
stale-number rot the change set out to remove. (acceptance-gate is safe: P03
asserts root `.claude-plugin`/`.codex-plugin`/overlay all match.)

---

## 5. [low] Invariant #4 (tinh thần) — P45 chứa một assertion không bao giờ đỏ được + nuốt exit của bước sync

- **file:** `tests/plugins/run-tests.sh:630`
- **source:** invariants

P45 so `P45_BEFORE`/`P45_AFTER` = shasum của cây `tests/` trước và sau
`sync-plugin-packages.sh --write` (dòng 630-634). `--write` chỉ ghi vào
`$ROOT/plugins` (DEST=$ROOT/plugins; mọi rsync trong build_acceptance/
build_feature_loop/build_design_loop đều trỏ vào $DEST) — không đường nào
chạm `tests/`, nên `[ "$P45_BEFORE" = "$P45_AFTER" ]` là hằng đúng, một
assertion không sống. Cùng dòng 631 nuốt cả exit lẫn stderr của bước sync
(`>/dev/null 2>&1`, không kiểm status), đúng lớp 'bước tiêm thất bại vẫn cho
màu xanh' mà bất biến #4 liệt kê. Răng THẬT của P45 nằm ở lần chạy suite
lồng — đã kiểm chứng bằng đột biến (khôi phục `assert
root_claude["version"] == "1.21.0"` ở P03 → P45 đỏ), nên đây là dư thừa gây
hiểu nhầm về mức bảo vệ chứ không phải case rỗng hoàn toàn.

---

## 6. [low] Invariant #2 — văn tiếng Anh gọi pre-merge check là 'the gate' trong 2 file agent-facing đã ship

- **file:** `commands/acceptance-init.md:134`
- **source:** invariants

Đoạn mới thêm viết 'exit 0 with the ENTIRE gate unrun (signoff, verdict,
staleness, gap-probe, re-check — all skipped, CI green)' ở
commands/acceptance-init.md:134 và
codex/acceptance-gate/skills/acceptance-init/SKILL.md:126. CONTEXT.md quy
định 'Gate' chỉ dành cho điểm dừng con người, lớp máy trong văn tiếng Anh gọi
là **the hook** / **pre-merge check**; và ngoại lệ 'cổng' thêm ở CHÍNH dải
này (CONTEXT.md:74-81) nói rõ nó CHỈ áp cho chữ thường trong văn tiếng Việt,
'văn tiếng Anh vẫn theo luật cũ'. Bản tiếng Việt tương ứng trong GUIDE.md
('TOÀN BỘ cổng không chạy') thì hợp lệ theo ngoại lệ mới. Sửa: 'with the
ENTIRE pre-merge check unrun'.

---

## 7. [low] Invariant #1 — dòng 'Synced …' đọc manifest KHÔNG phải manifest được đồng bộ vào mirror

- **file:** `scripts/sync-plugin-packages.sh:89`
- **source:** invariants

`_v` (dòng 88-89) đọc `.codex-plugin/plugin.json` (gốc repo),
`feature-loop/.claude-plugin/plugin.json` và
`design-loop/.codex-plugin/plugin.json`. Nhưng bản thực sự landing vào
mirror là các manifest overlay: build_acceptance →
`codex/acceptance-gate/.codex-plugin/plugin.json`, build_feature_loop →
`codex/feature-loop-codex/.codex-plugin/plugin.json`, build_design_loop →
`codex/design-loop/.codex-plugin/plugin.json` (sync_overlay, dòng
44/54/64). Hôm nay ba cặp trùng số (1.21.0 / 1.16.1 / 0.3.0 — đã verify) nên
vô hại, nhưng khi một overlay Codex bump độc lập, script báo một số hiệu nó
KHÔNG đồng bộ — đúng lớp 'báo số hiệu không tồn tại' mà comment ngay trên
dòng đó tuyên bố vừa gỡ khỏi P03/P22. Không case nào canh dòng này. (Cùng
gốc với finding #4 ở trên — hai lens độc lập, invariants và bugs, quy về
cùng một dòng code.)

---

## 8. [low] Miễn trừ `plugins/**` rộng hơn chốt P30 dùng để biện minh cho nó

- **file:** `_acceptance/config.yaml:56`
- **source:** invariants

config.yaml:56 thêm `- "plugins/**"` vào `risk_tiers.t1_skip_globs`, miễn
cho các path đó khỏi CẢ răng T1-escape lẫn luật stale_files; comment dòng
51-55 biện minh bằng 'P30 (sync-plugin-packages.sh --check) canh mirror ==
nguồn độc lập'. Nhưng `--check` chỉ `diff -r` ba thư mục hardcode (`for pkg
in acceptance-gate feature-loop-codex design-loop-codex`,
sync-plugin-packages.sh:73). Bất cứ thứ gì khác dưới `plugins/` — một
package thứ tư trong tương lai, hay `plugins/.claude-plugin/marketplace.json`
— vẫn được glob miễn trừ nhưng KHÔNG có chốt nào so. Hiện chỉ
`plugins/.DS_Store` nằm ngoài ba thư mục đó (đã verify bằng `ls -a
plugins/`), nên đây là lỗ tiềm ẩn chứ chưa bị khai thác. Hoặc thu hẹp glob về
ba thư mục package, hoặc để `--check` liệt kê `plugins/*` và nổ khi gặp entry
lạ, để miễn trừ và chốt bằng độ rộng.

---

## 9. [low] `plugins/**` gate exemption is wider than the P30 drift check cited to justify it

- **file:** `_acceptance/config.yaml:56`
- **source:** bugs

Line 56 adds `- "plugins/**"` to `risk_tiers.t1_skip_globs`, which exempts
those paths from BOTH the T1-escape backstop (`scripts/pre-merge-check.sh`,
non-T1 branch) and the stale-evidence rule (`stale_files`). The inline
comment justifies this with "P30 (sync-plugin-packages.sh --check) canh
`mirror == nguon` doc lap".

But that guard is narrower than the glob: `scripts/sync-plugin-packages.sh:73`
iterates a hardcoded list — `for pkg in acceptance-gate feature-loop-codex
design-loop-codex` — and `diff -r`s only those three directories. Anything
else under `plugins/` (a future 4th package dir, a
`plugins/.claude-plugin/marketplace.json`) is compared by nothing while
still being exempted from the gate and from staling evidence.

Today only `plugins/.DS_Store` lives outside the three dirs (`ls -a
plugins/` → `.DS_Store  acceptance-gate  design-loop-codex
feature-loop-codex`), so this is latent, not exploited. Keep the two the
same width: narrow the glob to the three package dirs, or make `--check`
enumerate `plugins/*` and fail on an unrecognised entry. (Same underlying
gap as finding #8 above, independently surfaced by the bugs lens.)
</content>
