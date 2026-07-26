# Review Findings: t1-escape-event-scope (round 2)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [high] P42 passes whenever its fixture copy is broken — negative-only assertion with no positive control (false green)

- **file:** `tests/plugins/run-tests.sh:585`
- **source:** bugs

P42 asserts a negative outcome only: `cp -R "$ROOT/." "$P42T/" 2>/dev/null ||
true` swallows every copy error, the `python3` heredoc that injects the
version drift (lines 586-590) is unchecked, and line 591 then treats ANY
non-zero exit of the nested suite as proof that the drift was caught. Any
failure upstream of the assertion — failed/partial copy, missing
`$P42T/tests/plugins/run-tests.sh` (bash exits 127), python traceback —
produces exactly the same non-zero exit and the case reports PASS.

**Detail:** Verified empirically: replayed the block verbatim with
`ROOT=/nonexistent-repo-path` so the copy produced an empty directory.
Output was `PASS: P42 manifest lech phai bi bat`, failures=0 — the case
greens with no fixture at all and no manifest ever compared. This is the
exact bug class round-1 review finding #5 raised against P41, and P41 was
fixed correctly in this same diff: it guards the copy (`if [ ! -f ... ];
then fail`) and adds a positive control (`if bash
"$P41T/scripts/sync-plugin-packages.sh" --check`, i.e. the pristine copy
must be GREEN before the injected drift is trusted to be RED). P42, added a
few lines below, never got that treatment. The consequence is that P42 —
the case whose whole job is to prove P03's new `len(versions) == 1` check is
not `assert x == x` after literal version pins were removed — cannot
actually distinguish "drift was caught" from "the suite never ran". P03's
pin removal is therefore unguarded in practice. Fix: mirror P41 — assert
`$P42T/tests/plugins/run-tests.sh` and `$P42T/.codex-plugin/plugin.json`
exist after the copy, check the python exit status, and require the
UNMUTATED copy to pass the nested suite before mutating it.

---

## 2. [medium] gate.yml: comment của bước backstop mâu thuẫn với code vừa thêm ngay phía trên

- **file:** `.github/workflows/gate.yml:59`
- **source:** invariants

Cùng commit 06de401 thêm nhánh push đặt `PRE_MERGE_BASE=$(git rev-parse
HEAD~1)` kèm comment "push: CÓ base (luật gap-probe cần phạm vi diff)" (dòng
49-53), nhưng để nguyên comment của bước "T1-escape backstop" 6 dòng bên
dưới: "Chỉ chạy trên `pull_request`: một `push` không có nhánh base để so,
nên ở đó bước này không có nghĩa" (dòng 59-61).

**Detail:** Lý do nêu trong comment giờ SAI theo chính file đó — push có
base; lý do thật (đã viết đúng trong ADR 0005 và trong dòng 49-51) là tiền
đề "thay đổi này là một PR nên phải kèm `_acceptance/<slug>/`" sai với
commit release/mirror-sync. Banner "# ── Răng T1-escape (BẬT) ──" ở dòng 57
cũng không còn đúng cho toàn job: bước pre-merge check ngay trên nó nay chạy
với `--no-t1-escape` ở nhánh push. Người sửa CI sau này đọc comment sẽ suy
ra kết luận ngược với hành vi.

---

## 3. [medium] README §CI khai sai posture của kit sau khi cờ --no-t1-escape landing

- **file:** `README.md:251`
- **source:** invariants

README dòng 251 vẫn ghi "pre-merge-check.sh + **răng T1-escape (ĐANG BẬT)**"
và dòng 254 vẫn nêu lý do "Chỉ chạy trên `pull_request` (một `push` không có
nhánh base để so)". Cả hai câu đã bị chính range này phủ định: gate.yml nay
truyền `--no-t1-escape` ở nhánh push (răng TẮT trên push, không phải chỉ
"không chạy bước riêng"), và push CÓ base.

**Detail:** README không nằm trong diff `cd4b85f..HEAD` dù đây là chỗ duy
nhất mô tả posture T1-escape của repo kit cho người đọc ngoài. README là
file được rsync vào `plugins/acceptance-gate/README.md` nên câu sai này còn
đi theo bản phát hành.

---

## 4. [medium] GUIDE §5.3 Wire CI không được cập nhật cờ --no-t1-escape trong khi cả hai harness acceptance-init đều đã có

- **file:** `GUIDE.md:543`
- **source:** invariants

Commit 98589d8 thêm hướng dẫn "Job chạy trên `push` (không phải PR) phải
thêm `--no-t1-escape`" vào CẢ HAI nguồn acceptance-init
(`commands/acceptance-init.md:120-125` và
`codex/acceptance-gate/skills/acceptance-init/SKILL.md:113-117`, test P44
ghim điều đó), nhưng GUIDE.md §5.3 "Wire CI" — tài liệu wiring người-đọc,
cũng do chính commit đó sửa ở chỗ khác (blockquote bump-version, dòng
~196) — vẫn chỉ có snippet `bash scripts/pre-merge-check.sh . --base
"origin/$GITHUB_BASE_REF"` (dòng 564) và không nhắc cờ.

**Detail:** Consumer chép snippet này vào workflow trigger `push` sẽ dính
đúng triệu chứng mà feature sinh ra để chữa: job đỏ vĩnh viễn vì lý do cấu
trúc. GUIDE.md được rsync vào `plugins/acceptance-gate/GUIDE.md` nên gap này
ship ra ngoài; không có test nào ghim parity GUIDE ↔ acceptance-init (P44
chỉ phủ hai harness acceptance-init).

---

## 5. [medium] P45's unchecked fixture mutation lets the case pass vacuously when no manifest was ever bumped

- **file:** `tests/plugins/run-tests.sh:599`
- **source:** bugs

P45 (`bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua`) has
the same swallowed copy (`cp -R "$ROOT/." "$P45T/" 2>/dev/null || true`) and,
more importantly, an unchecked mutation step: the `python3` heredoc at lines
600-606 that rewrites all three plugin.json versions to 9.9.9 has no
exit-status check. If it fails on the FIRST file (bad copy,
unreadable/absent `.claude-plugin/plugin.json`), no bump happens at all —
`sync-plugin-packages.sh --write` (line 611, exit code also discarded)
becomes a no-op, `$P45_BEFORE` equals `$P45_AFTER` because nothing under
tests/ was touched, and the nested suite passes because the tree is
pristine. Both conjuncts on lines 612-613 are satisfied and P45 reports PASS
having verified nothing.

**Detail:** Unlike P42 this one degrades noisily (the traceback reaches
stderr) and a partial bump does fail loudly via P03's `len(versions) == 1`,
so severity is lower — but the case still cannot tell "bump was clean" from
"bump never happened", which is precisely the property it exists to certify
(that removing the literal version pins from P03/P22 means a release bump no
longer edits the suite). Fix: check the python exit status and the
`sync-plugin-packages.sh --write` exit status, and assert the three
manifests actually read 9.9.9 in the fixture before measuring the tests/
checksum delta.

---

## 6. [low] review-findings.md: finding #6 mô tả một tình trạng đã được sửa trong cùng commit

- **file:** `_acceptance/t1-escape-event-scope/review-findings.md:139`
- **source:** invariants

Finding #6 (round 1) khẳng định plan vẫn ghi bảng "Spec coverage — 16 AC"
với AC-1..AC-16, rằng Task 7 vẫn ghi "**Evals phục vụ:** E17 (AC-16)", và
`grep -n "AC-17" plan` = 0 hit. Nhưng
`docs/superpowers/plans/2026-07-26-t1-escape-event-scope.md` — sửa trong
CÙNG commit 360a257 — nay ghi "**Độ phủ contract — 17 AC**" (dòng 574), bảng
có ô "AC-16 · AC-17 | 7" (dòng 585), và Task 7 dòng 454 ghi "**Evals phục
vụ:** E17 (AC-16), E18 (AC-17)"; `grep -n "Spec coverage"` trên plan = 0
hit.

**Detail:** Nit từ vựng kèm theo (heading "Spec" vi phạm `_Avoid_` của
**Contract**) cũng đã tự tiêu. Artifact S4 vì thế mô tả sai trạng thái repo
tại HEAD — đúng lớp "artifact nói dối" mà chính finding đó phê phán. Round 3
(nếu có) nên xoá hoặc đánh dấu "đã tự sửa" finding #6 thay vì lặp lại
nguyên văn.

---

## 7. [low] Glossary drift: "cổng" dùng cho máy móc (pre-merge check / CI) trong prose mới

- **file:** `docs/adr/0005-t1-escape-opt-out-flag.md:16`
- **source:** invariants

CONTEXT.md §Gates & verbs quy định: Gate viết hoa CHỈ dành cho điểm dừng con
người; máy móc gọi là **the hook** / **pre-merge check**, `_Avoid_` mọi biến
thể "<x> gate" khi chỉ hook/CI. Range này thêm 15 lượt "cổng" trỏ vào
pre-merge check hoặc job CI: ADR 0005 ("bịt mắt cổng", "làm cổng đỏ vì lý do
cấu trúc", "cổng thoát 0 mà không chạy luật nào"),
`.out-of-scope/t1-skip-globs-github-and-manifests.md` ("làm cổng đỏ", "đổi
CI có thể TẮT cổng", "không qua cổng"), `_acceptance/config.yaml` (comment
"đổi CI có thể tắt cổng"), `scripts/pre-merge-check.sh:67` (comment "cổng
thoát 0").

**Detail:** Cần nói rõ: đây là DRIFT tiếp nối chứ không phải break mới — ADR
0004 ("một cổng tự hạ chuẩn") và README:246 đã dùng lối này trước range. Ghi
lại để quyết một lần: hoặc bổ sung ngoại lệ tiếng Việt vào CONTEXT.md như đã
làm cho "P0 design gate", hoặc sweep cả hai ADR về "pre-merge check".

---

## Chưa adversarial-verify (refuter chết)

none this round.
