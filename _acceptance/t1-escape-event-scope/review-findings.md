# Review Findings: t1-escape-event-scope (round 4)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [high] CONTEXT.md (glossary nguồn) bị chèn đoạn mới CẮT ĐÔI câu — đúng lớp lỗi mà chính commit đó tuyên bố đã sửa

- **file:** `CONTEXT.md:66`
- **source:** invariants

CLAUDE.md bất biến #2 đặt CONTEXT.md làm glossary phát triển của kit. Commit
e1f2264 chèn khối `**Ngoại lệ tiếng Việt — "cổng" (thường):**` (dòng 68-75)
vào GIỮA câu của mục ngoại lệ P0 design gate: dòng 66 kết thúc bằng `...là
máy móc nhưng GIỮ chữ "gate",` và phần tiếp `vì đây là **tên riêng của một
tính năng**...` bị đẩy xuống dòng 76, nên đọc từ trên xuống thì mục P0 design
gate mất mệnh đề lý do và khối mới bị dính đuôi một câu lạ. Đây đúng là lỗi
mà cùng commit đó tuyên bố đã chữa ở chỗ khác — ledger
d-20260726T160200Z-218 và message commit ghi "Đoạn tiếng Việt tôi chèn ở
Task 9 CẮT ĐÔI một câu tiếng Anh trong acceptance-init của cả hai harness.
Viết lại bằng tiếng Anh, đặt sau câu trọn." — tức lại sửa theo FINDING chứ
không theo LỚP, trên chính file glossary.

---

## 2. [high] Docs tell consumers to add `--no-t1-escape`, but older vendored pre-merge-check.sh swallows it as ROOT and exits 0 with the WHOLE gate unrun

- **file:** `commands/acceptance-init.md:123`
- **source:** bugs

The diff adds the same consumer-facing instruction in three shipped places
(commands/acceptance-init.md:123, codex/acceptance-gate/skills/acceptance-init/SKILL.md:113,
GUIDE.md:566-570) telling repos to append `--no-t1-escape` to their push
job. The `-*` rejection that makes an unknown flag fail loudly is NEW in
this same diff (scripts/pre-merge-check.sh). Consumers vendor a COPY of
pre-merge-check.sh into their own repo (acceptance-init step 5), so any repo
that updates the plugin/GUIDE but not the vendored script gets the pre-diff
parser, where `*) ROOT="$1"` silently makes ROOT="--no-t1-escape".

Verified empirically against the pre-diff script on this very repo (which
does have _acceptance/):

    $ git show cd4b85f:scripts/pre-merge-check.sh > old-pmc.sh
    $ bash old-pmc.sh /Users/manhphan/dev/acceptance-gate-kit --base HEAD~1 --no-t1-escape
    pre-merge-check: no _acceptance/ — nothing to check
    OLD EXIT=0

That is not a degraded T1-escape teeth — it is the entire gate (signoff,
verdict, staleness, bypass, gap-probe, recheck) skipped with a green exit.
This is exactly the fail-open the diff's own comment warns about ("Nuốt cờ
lạ vào ROOT là fail-open chí tử"), and none of the three doc additions
states a minimum kit version or tells the reader to re-copy the script
first. Fix: make the instruction say "re-copy scripts/pre-merge-check.sh
from the plugin BEFORE adding this flag (older copies treat it as a path and
exit 0 having checked nothing)", or have the doc snippet grep the vendored
script for `--no-t1-escape` support.

---

## 3. [medium] Bất biến "assertion âm-tính-một-mình" (CLAUDE.md, ccacf24) bị vi phạm ngay trong cùng dải diff — TE18d/f/g chỉ ghim exit code

- **file:** `tests/scripts/run-tests.sh:2276`
- **source:** invariants

CLAUDE.md bất biến #4 (thêm ở ccacf24, cuối chính dải này) đòi mọi case kết
luận từ exit khác 0 phải có (a) đối chứng dương và (b) ghim ĐÚNG thông điệp.
TE18d (dòng 2273), TE18f (2276), TE18g (2278) chỉ `check ... 2 $?` — không
assert chuỗi nào. Kiểm chứng bằng đột biến trên bản sao repo: (1) đổi thông
điệp `pre-merge-check: unexpected argument $1` thành `BOGUS MESSAGE` → suite
vẫn 329 passed / 0 failed; (2) XOÁ HẲN chốt `[ -n "${ROOT_SET:-}" ] && { ...
exit 2; }` ở scripts/pre-merge-check.sh:76 → TE18f/TE18g VẪN PASS, vì `extra`
không phải thư mục nên exit 2 rơi ra từ chốt `[ -d "$1" ]` khác. Nghĩa là
luật "positional thứ hai âm thầm đổi ROOT" mà TE18f nói mình canh hiện KHÔNG
có răng nào giữ.

---

## 4. [medium] Cùng lớp lỗi: P46 không có đối chứng dương và không ghim thông điệp

- **file:** `tests/plugins/run-tests.sh:701`
- **source:** invariants

P46 (dòng 701-715) dựng bản sao rồi kết luận chỉ từ `[ "$P46ST" -eq 2 ]` +
số dòng tiêm còn lại. Thiếu cả hai vế của bất biến: không chạy bản nguyên
vẹn để xác nhận `--check` còn sống trong bản sao (khác P41/P42 ngay phía
trên vốn đã có đối chứng dương), và không grep chuỗi `unknown option`. Kiểm
chứng bằng đột biến: đổi thông điệp trong scripts/sync-plugin-packages.sh:16
thành `TOTALLY DIFFERENT ERROR` → P46 vẫn PASS, toàn bộ suite plugin vẫn
xanh. Vì P46 là chốt DUY NHẤT biện minh cho miễn trừ `plugins/**` trong
`_acceptance/config.yaml` (theo comment của chính nó và của config),
assertion không phân biệt được ở đây làm mất căn cứ của miễn trừ.

---

## 5. [medium] HEAD không qua chính cổng của kit: 2 violation, trong đó diff này làm evidence của slug ĐÃ KÝ trở thành stale

- **file:** `_acceptance/gap-probe-presence-hook/evidence-report.md:10`
- **source:** invariants

`bash scripts/pre-merge-check.sh . --base cd4b85f` tại HEAD → exit 1, 2
violation: (a) `VIOLATION [gap-probe-presence-hook]: evidence is stale —
code changed after verify (verified_commit 834eae8...)` liệt 7 file nguồn
đổi sau khi slug đó đã `PASS, signed off by Manh Phan 2026-07-26`
(.github/workflows/gate.yml, codex/acceptance-gate/skills/acceptance-init/SKILL.md,
commands/acceptance-init.md, scripts/pre-merge-check.sh,
scripts/sync-plugin-packages.sh, tests/plugins/run-tests.sh,
tests/scripts/run-tests.sh); (b) `VIOLATION [t1-escape-event-scope]:
verdict=PENDING-JUDGMENT (must be PASS to merge)`. Đã đối chứng: chạy cùng
lệnh trên worktree tại cd4b85f cho `pre-merge-check: clean` — tức chính dải
diff này sinh ra violation (a). Trớ trêu là ghi chú GUIDE.md thêm trong
chính diff này (dòng ~196) cảnh báo đúng vòng lặp "ký → đổi code → stale →
verify lại → ký lại".

---

## 6. [medium] GUIDE.md wire-CI snippet appends a bare shell line inside the ```yaml GitHub Actions block — copy-paste yields invalid workflow YAML

- **file:** `GUIDE.md:570`
- **source:** bugs

GUIDE.md §5.3 "Wire CI" presents a fenced ```yaml block labelled "GitHub
Actions mẫu" containing the `acceptance-gate:` job mapping. The diff appends,
inside that same fence, four `#` comment lines plus a bare shell command:

    ```yaml
    acceptance-gate:
      runs-on: ubuntu-latest
      steps:
        ...
        - run: bash scripts/pre-merge-check.sh . --base "origin/$GITHUB_BASE_REF"

    # Job chạy trên `push` ...
    bash scripts/pre-merge-check.sh . --base "$(git rev-parse HEAD~1)" --no-t1-escape
    ```

A consumer copy-pasting this block (which is precisely what §5.3 and
acceptance-init tell them to do) gets a document with a top-level mapping
key `acceptance-gate:` followed by a bare scalar line — a YAML parse error,
so the workflow never runs at all. It should be a proper `- run:` step under
a separate push-triggered job, or moved out of the yaml fence into its own
```bash fence.

The new P44 test (tests/plugins/run-tests.sh) cannot catch this: it only
asserts `"--no-t1-escape" in g`, i.e. substring presence, not that the
snippet is valid YAML.

---

## 7. [low] sync-plugin-packages.sh `_v` swallows node/manifest errors into '?' and reads manifests that are not the ones actually shipped into plugins/

- **file:** `scripts/sync-plugin-packages.sh:86`
- **source:** bugs

Line 86: `_v() { node -e 'process.stdout.write(require(process.argv[1]).version)' "$ROOT/$1" 2>/dev/null || echo '?'; }`

Two problems, both defeating the stated intent ("để lại đây thì script báo
một số hiệu không tồn tại"):

1. Silent fallback: a missing node, a malformed plugin.json, or a renamed
   manifest path all degrade to the literal `?` in the success line instead
   of failing. The script runs under `set -euo pipefail`, so without the
   `|| echo '?'` this would have failed loudly; the `2>/dev/null` also hides
   the reason.

2. Wrong source file for 2 of 3 packages. `build_feature_loop` copies from
   `codex/feature-loop-codex/` and `build_design_loop` from
   `codex/design-loop/`, but the message reads
   `feature-loop/.claude-plugin/plugin.json` and
   `design-loop/.codex-plugin/plugin.json` — sibling manifests that are NOT
   what lands in `plugins/feature-loop-codex/` and
   `plugins/design-loop-codex/`. They happen to agree today (all 1.16.1 /
   0.3.0, verified), but the moment a Codex overlay manifest is bumped
   independently the script reports a version it did not sync — the same
   class of stale-number report the change set out to remove. Read
   `codex/feature-loop-codex/.codex-plugin/plugin.json` and
   `codex/design-loop/.codex-plugin/plugin.json` instead, and drop the
   `|| echo '?'`.

---

## 8. [low] `plugins/**` exemption is broader than the P30 drift check that justifies it

- **file:** `_acceptance/config.yaml:56`
- **source:** bugs

config.yaml:56 adds `- "plugins/**"` to `risk_tiers.t1_skip_globs`, which
exempts those paths from BOTH the T1-escape backstop
(scripts/pre-merge-check.sh:587) and the stale-evidence rule
(`stale_files`, line 217). The comment justifies it with "P30
(sync-plugin-packages.sh --check) canh `mirror == nguồn` độc lập".

That justification only holds for paths inside the three hardcoded package
dirs: sync-plugin-packages.sh:73 iterates `for pkg in acceptance-gate
feature-loop-codex design-loop-codex` and `diff -r`s only those. Anything
else under `plugins/` — a future 4th package dir, or a
`plugins/.claude-plugin/marketplace.json` — is compared by nothing, while
the glob `plugins/**` still exempts it from the gate and from staling
evidence. Today only `plugins/.DS_Store` lives outside the three dirs
(verified), so this is latent rather than exploited, but the exemption and
its guard should be kept the same width: either narrow the glob to the
three package dirs, or make `--check` enumerate `plugins/*` and fail on an
unknown entry.

---

## Chưa adversarial-verify (refuter chết)

none this round.
