# Review Findings: t1-escape-event-scope (round 6)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [high] Kit self-hosting — cổng tự chạy của repo ĐỎ tại HEAD (baseline cd4b85f XANH)

- **file:** `_acceptance/gap-probe-presence-hook/evidence-report.md:10`
- **source:** invariants

`bash scripts/pre-merge-check.sh . --base cd4b85f` tại HEAD trả 2 violation
và exit 1; chạy đúng lệnh đó tại cd4b85f (base = cd4b85f~1) cho
`pre-merge-check: clean`. Tức dải diff này biến cổng tự-host từ xanh sang
đỏ.

Violation 1: `VIOLATION [gap-probe-presence-hook]: evidence is stale — code
changed after verify (verified_commit 834eae8)` — liệt 7 file
(`.github/workflows/gate.yml`, `scripts/pre-merge-check.sh`,
`scripts/sync-plugin-packages.sh`, `tests/plugins/run-tests.sh`,
`tests/scripts/run-tests.sh`, `commands/acceptance-init.md`,
`codex/.../acceptance-init/SKILL.md`). Cái này KHÔNG tự hết sau Gate 2 của
feature mới: nó thuộc slug khác, và feature `t1-escape-event-scope` chạm
đúng `t3_paths` mà slug cũ đã pin.

Violation 2: `VIOLATION [t1-escape-event-scope]:
verdict=PENDING-JUDGMENT (must be PASS to merge)`.

Evidence report có nêu chuyện cổng đỏ ở dòng 357 và đẩy cho human ở Gate 2,
nên đây là finding ĐÃ KHAI BÁO — nhưng nó vẫn là trạng thái chặn merge do
chính dải diff tạo ra, và violation 1 không nằm trong tầm xử lý của Gate 2.

---

## 2. [medium] Evidence pin lệch commit — verified_commit trỏ trước round 5, staleness sẽ nổ ngay sau khi ký

- **file:** `_acceptance/t1-escape-event-scope/evidence-report.md:10`
- **source:** invariants

`verified_commit: 4008e4f` (round 4), nhưng HEAD là 7fdfad1 (round 5) và
commit đó sửa 6 file NGUỒN ngoài `_acceptance/`:
`scripts/sync-plugin-packages.sh`, `tests/plugins/run-tests.sh`,
`tests/scripts/run-tests.sh`, `commands/acceptance-init.md`,
`codex/acceptance-gate/skills/acceptance-init/SKILL.md`,
`plugins/acceptance-gate/skills/acceptance-init/SKILL.md`
(`git diff --name-only 4008e4f..HEAD`).

Hiện luật staleness KHÔNG nổ cho slug này vì
`scripts/pre-merge-check.sh:429-431` `continue` ngay khi `verdict != PASS`.
Nghĩa là ngay khi human nâng verdict lên PASS ở Gate 2, lần chạy kế tiếp sẽ
báo evidence stale cho chính slug vừa ký — đúng vòng lặp "ký → stale →
verify lại → ký lần hai" mà GUIDE.md (khối "Bump version + sync mirror
thuộc S3") vừa thêm vào để cảnh báo.

Ghi chú: bản round 6 hiện tại của file này pin `verified_commit:
7fdfad17bd6895b481617a353555e35fea834359` (round 5's HEAD) — vẫn cùng một
lớp: bất cứ commit nào đổi file nguồn ngoài `_acceptance/` sau lượt verify
này (kể cả các commit hạ tầng round 6 tạo ra để trả lời chính finding này)
sẽ lại kích hoạt staleness ngay sau khi human ký PASS.

---

## 3. [medium] `--base`/`--slug` swallow a following option as their value, silently disarming both the T1-escape backstop and gap-probe (exit 0)

- **file:** `scripts/pre-merge-check.sh:60`
- **source:** bugs

The new `-*` branch (line 65) was added precisely so a mistyped flag can no
longer be absorbed into ROOT and turn the gate into a no-op. But the guard
only covers *positional* words — `--base` and `--slug` still take `"$2"`
unconditionally after only checking `[ $# -ge 2 ]`. So the very typo the
hardening targets survives one form: forgetting the base value.

Reproduced on a throwaway repo (config with t3_paths: hooks/**, diff
touching plugins/.internal/x.js and hooks/):

    $ pre-merge-check.sh . --base --no-t1-escape
    GAP-PROBE: NOT ENFORCED reason=base "--no-t1-escape" not resolvable in this clone
    NOTE: gap-probe không cưỡng chế được — ... (advisory, không chặn merge).
    NOTE: T1-escape backstop skipped — base "--no-t1-escape" not resolvable in this clone
    pre-merge-check: clean          <- exit 0

BASE becomes the literal string `--no-t1-escape`, T1_ESCAPE stays 1, the
base never resolves, and both the T1-escape backstop and the gap-probe rule
go unenforced while the script reports `clean`. gap_probe defaults to
`advisory`, so in a consumer repo (the exact snippet GUIDE.md §Wire CI and
commands/acceptance-init.md now tell people to copy, with the added
`--no-t1-escape` making a mis-ordered command line more likely) the merge is
allowed with two of the gate's rules off. The kit's own CI happens to catch
it via the `*"backstop skipped"*` case in gate.yml, but that escalation does
not exist downstream.

Fix: reject `-*` as an option value too, e.g. in the `--base`/`--slug`
branches add `case "$2" in -*) echo "pre-merge-check: --base requires a
value (got option $2)" >&2; exit 2 ;; esac`.

Same code in the mirror: plugins/acceptance-gate/scripts/pre-merge-check.sh
(byte-identical).

---

## 4. [medium] sync --check guard is narrower than the plugins/** gate exemption it justifies: top-level dot-entries under plugins/ are invisible to it

- **file:** `scripts/sync-plugin-packages.sh:84`
- **source:** bugs

The new unknown-entry loop states its own invariant in the comment: "chốt
phải rộng ĐÚNG BẰNG miễn trừ" — it exists solely to justify adding
`plugins/**` to risk_tiers.t1_skip_globs in _acceptance/config.yaml. It is
not as wide as the exemption.

`for entry in "$ROOT"/plugins/*` is pathname expansion, which skips
dotfiles/dot-directories. `match_globs` in pre-merge-check.sh matches with
bash `case`, which has no dotfile rule — so `plugins/**` DOES match
`plugins/.internal/x.js`. Net result: anything under a top-level dot-entry
in plugins/ is exempt from the T1-escape backstop and from the staleness
rule, and the drift check that is supposed to be the compensating control
never sees it.

Reproduced twice:
1. Copy of this repo + `plugins/.rogue/evil.js` + `plugins/.rogue-file` →
   `sync-plugin-packages.sh --check` prints "plugins/ mirror in sync." and
   exits 0.
2. Fixture repo, commit adding only `plugins/.internal/x.js`, run
   `pre-merge-check.sh . --base <prev>` → "pre-merge-check: clean", exit 0,
   no VIOLATION [PR].

Fix: iterate with dotglob (or `find "$ROOT/plugins" -mindepth 1 -maxdepth
1`) so hidden entries hit the same DRIFT branch.

---

## 5. [low] CONTEXT.md glossary — "gate" cho lớp máy trong văn tiếng Anh

- **file:** `_acceptance/t1-escape-event-scope/evidence-report.md:357`
- **source:** invariants

Dòng 357: "that the kit's own self-hosted pre-merge gate is currently RED
at HEAD". Ngoại lệ tiếng Việt mới thêm ở CONTEXT.md:74-81 nói rõ nó CHỈ áp
cho chữ "cổng" thường trong văn tiếng Việt, còn "văn tiếng Anh vẫn theo luật
cũ (**the hook** / **pre-merge check**, không "evidence gate")". Ở đây phải
là "pre-merge check". Đây là lượt drift duy nhất còn lại sau khi trừ ngoại
lệ (grep toàn bộ dòng thêm ngoài `plugins/**`).

---

## 6. [low] CLAUDE.md bất biến #4 — số liệu tự dẫn đã lỗi thời ngay trong cùng dải diff

- **file:** `CLAUDE.md:28`
- **source:** invariants

Bất biến ghi "Lớp lỗi này đã xuất hiện **5 lần** trong hai feature (`TE2a`,
`P43`, `P40`, `P42`, `P45`)". Nhưng sau khi nó được viết (ccacf24), cùng dải
diff còn phát hiện thêm ít nhất 4 lượt nữa mà danh sách không được cập nhật:
`TE18d/f/g` và `P46` (khai trong `decisions.jsonl` entry
`d-20260726T170000Z-219`, commit 4008e4f), và `TE5` — commit 7fdfad1 gọi
thẳng là "lần thứ SÁU của cùng lớp lỗi". Con số và danh sách chính là phần
biện minh cho mệnh lệnh "sửa theo LỚP", nên để lệch làm yếu chính bất biến;
ngoài ra nó che mất việc TE4 vẫn còn hở (finding #2 round 5, chưa xử lý).
</content>
