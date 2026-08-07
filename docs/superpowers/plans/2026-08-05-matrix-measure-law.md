# matrix-measure-law Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 6 hình dạng lỗi đo-lường thành luật ở 2 chốt sẵn có: 4 câu đối
chiếu chéo trong prompt gap-probe (2 SKILL) + finder thứ 3 `measurement`
trong review S4 — không nới finder cũ, mutation phủ 14 phần tử.

**Architecture:** `MEASUREMENT_SHAPES` (6 chuỗi) đặt một chỗ trong
acceptance-verify.js, prompt finder build từ đó; test pin ba-chiều
(pin-độc-lập ↔ const ↔ prompt). 4 câu cross-check chèn TRONG ý (4) của
S1#7 (giữ "đủ 7 ý"). Fixture RED-probe cho M11 sinh kèm ghi chú nguồn.

**Tech Stack:** Node thuần + harness vm-realm sẵn có (tests/workflows).

## Global Constraints

- AC-6: 2 finder cũ nguyên vẹn TỪNG CHỮ — pin neo `git show dc49fe7cae2e525b352b0cd85ebd501c652b8bad:feature-loop/workflows/acceptance-verify.js`.
- CS7b hiện hành: câu "Prompt giữ đủ 7 ý" phải GIỮ NGUYÊN.
- 4 câu cross-check (chèn trong ý 4, sau câu platform-fit): (a) "mỗi eval tuyên quét LỚP có ma trận toàn phần viết-trước không (số assert = số phần tử)"; (b) "assertion âm tính nào thiếu đối chứng dương hoặc không ghim thông điệp"; (c) "fixture nào viết tay đúng khuôn bên đọc thay vì code-sinh/round-trip"; (d) "assert nào đo chuỗi-có-mặt trong khi lời hứa là quan hệ".
- 6 shapes (chép nguyên văn design doc §Sáu hình dạng — pin độc lập trong test): (1) đo CHỈ DẪN thay vì ĐẦU RA; (2) fixture VIẾT TAY đúng khuôn bên đọc — không round-trip; (3) assert chuỗi-có-mặt khi lời hứa là QUAN HỆ; (4) âm-tính-một-mình — không đối chứng dương/ghim thông điệp; (5) tuyên quét LỚP nhưng chỉ điểm-case — thiếu ma trận viết-trước; (6) hardcode ROOT — đo checkout tác giả.
- Mirror sync + commit cùng lượt (P30); git add đích danh; bump feature-loop 1.22.0 → 1.23.0 (4 manifest + description).
- RED-test mỗi bản vá; mọi test fail-first.

---

### Task 1: 4 câu cross-check vào 2 SKILL (M1, M2 · phục vụ AC-1, AC-2)

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (ý 4 của S1#7), `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (bước gap-probe); Test `tests/workflows/skill-claims.test.mjs` (MM1 4 clause + 4 mutant; MM2 4 clause EN + 4 mutant).
**Interfaces:** 4 câu nguyên văn ở Global Constraints — MM1 pin đúng các chuỗi đó; codex bản EN giữ đủ 4 quan hệ (full-matrix / positive-control+pinned-message / code-generated-or-round-trip / vocabulary-vs-relationship). `independent: false` (Task 4 mutant đọc cùng vật).

- [ ] MM1/MM2 fail-first (khuôn DV1: regex per-clause, mutant per-clause qua match-rồi-xoá) → chạy ĐỎ.
- [ ] Chèn 4 câu vào ý (4) SKILL feature-loop (sau "skill/quy định nào của repo LẼ RA phải nạp mà chưa nạp;"), bản EN tương đương vào codex (trong bước gap-probe của nó) → chạy XANH + CS7b vẫn xanh.
- [ ] Commit `feat(matrix-measure-law): 4 câu đối chiếu lớp-đo-lường vào gap-probe 2 harness (AC-1/2)`.

### Task 2: MEASUREMENT_SHAPES + finder measurement (M3, M4, M5 · phục vụ AC-3, AC-4, AC-5)

**Files:** Modify `feature-loop/workflows/acceptance-verify.js` (const + phần tử thứ 3 của REVIEWERS); Test `tests/workflows/acceptance-verify.test.mjs` (case MM3/4/5).
**Interfaces:** `const MEASUREMENT_SHAPES = ['(1) …', …6 phần tử…]` đặt NGAY TRÊN `const REVIEWERS`; reviewer mới:
```js
{ key: 'measurement', prompt: `Review CAC FILE KIEM THU/EVAL trong diff ${args.diffBase}...HEAD cua repo ${args.repoRoot} (test/*.test.*, tests/**, evals.yaml, fixtures — bo qua file khong phai phep do). San DUNG 6 hinh dang loi do-luong sau, CHI bao finding high-confidence (thay ro trong code, khong suy dien y dinh), khong style-nit, khong tu fix, khong phan xu pham-vi (viec cua triage):\n${MEASUREMENT_SHAPES.map((s, i) => `${i + 1}. ${s}`).join('\n')}\nMoi finding: title goi TEN hinh dang + detail chi dong/assert cu the va vi sao do la hinh dang do.` }
```
`independent: false` (Task 3/4 đọc cùng file).

- [ ] MM3 fail-first: PIN 6 shapes độc lập (chép design doc, comment nguồn); dryRun/stub-run → capture calls; assert label `review:measurement` có mặt + prompt chứa TỪNG phần tử pin + const script khớp TỪNG phần tử pin (ba-chiều) + REVIEWERS đủ 3 + ranh giới high-confidence. MM4: responder cho `review:measurement` trả 1 finding + refute sống + triage inContract:false → finding vào khối out-of-contract, KHÔNG vào rejectFindings; nhánh 2: refute chết finding → biến mất. MM5: responder throw cho `review:measurement` → reviewIncomplete chứa key, không crash; đối chứng dương.
- [ ] Chạy ĐỎ → vá script → XANH toàn suite workflows.
- [ ] Commit `feat(matrix-measure-law): finder measurement — 6 hình dạng một chỗ, đi đường refute/triage chuẩn (AC-3/4/5)`.

### Task 3: MM6 pin finder cũ + MM7 ma trận 14 mutant (M6, M7 · phục vụ AC-6, AC-7)

**Files:** Test `tests/workflows/measure-law-mutants.test.mjs` (mới).
**Interfaces:** pin nguồn = `git show dc49fe7…:feature-loop/workflows/acceptance-verify.js` chạy LÚC TEST (so chuỗi prompt cũ trong bản hiện tại với bản tại sha — không chép tay); 14 mutant: 6 xoá-shape (bản sao script → chạy lại phép so ba-chiều của MM3 dạng hàm tái dùng → đỏ đúng shape), 4 xoá-câu SKILL feature-loop (regex MM1 → đỏ đúng câu), 4 xoá-câu codex (regex MM2 → đỏ đúng câu). `independent: false`.

- [ ] Viết + chạy: MM6 hai chiều (pin khớp git show + mutant sửa 1 chữ prompt cũ trên bản sao → đỏ); MM7 đủ 14, mỗi mutant assert đích danh phần tử.
- [ ] Commit `test(matrix-measure-law): pin neo git cho finder cũ + ma trận 14 mutant (AC-6/7)`.

### Task 4: Fixture RED-probe cho M11 (phục vụ AC-9)

**Files:** Create `_acceptance/matrix-measure-law/evidence/red-probe-artifact.md`.
**Interfaces:** file 2 khối — khối A: 1 eval mini `expected: "exit khác 0 là đạt"` (âm-tính-một-mình, KHÔNG đối chứng dương/thông điệp — đúng hình dạng 4, ghi chú "sinh từ khuôn hình dạng 4 của design doc"); khối B: bản tương đương CÓ đối chứng dương + ghim thông điệp. Ghi chú nguồn khuôn đầu file. `independent: true`.

- [ ] Viết fixture + commit `feat(matrix-measure-law): fixture RED-probe cho M11`.

### Task 5: Đóng gói — bump 1.23.0 + mirror + 4 suite

**Files:** 2 manifest feature-loop (+root nếu pin), `tests/plugins/run-tests.sh` (nếu floor/keyword cần), chạy sync.
- [ ] Bump 1.23.0 + description "v1.23 adds the measurement review lens (6 shapes, single-source, mutation-covered) and the measurement cross-check block in the S1 gap-probe prompt (both harnesses)"; sync --write + --check; đủ 4 suite + product-map.
- [ ] Commit `chore(matrix-measure-law): bump feature-loop 1.23.0 + sync mirror`.

### Task 6: Khép S3 → S4 nguồn

- [ ] `git diff --stat` soát; contract → implemented; commit; dispatch S4 NGAY bằng **script NGUỒN** `feature-loop/workflows/acceptance-verify.js` (ledger đã chốt), args đủ (round 1, invokedSha, P2/P3 hash, contractPath, personas/template 1.32.0).

## Self-review

AC-1/2→T1; AC-3/4/5→T2; AC-6/7→T3; AC-9 fixture→T4 (+M9/M11 judgment S4); AC-8/M8 judgment S4; AC-10/M10 đo tại Cổng 2. Đủ 10 AC. Khuôn 4 câu + 6 shapes khai một chỗ ở Global Constraints — T1/T2/T3 tiêu thụ nguyên văn.
