# Goal Integration (docs-only) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tài liệu hóa nếp dùng `/goal` (Claude Code ≥ 2.1.139) cho đoạn máy S2→S4 của feature-loop — 1 mục GUIDE + 1 câu SKILL, đúng spec `docs/specs/2026-07-07-goal-integration-design.md`.

**Architecture:** Docs-only, zero cơ chế: GUIDE mang toàn bộ tri thức (template + giới hạn), SKILL mang 1 câu nhắc-an-toàn tại điểm dùng (sau Gate 1). Package acceptance-gate sinh bằng sync script.

**Tech Stack:** Markdown VN + `scripts/sync-plugin-packages.sh` + 3 bash test suites.

## Global Constraints

- Kit KHÔNG phụ thuộc `/goal` — mọi văn đều phrased "nếu có/nếu muốn"; không có → hành vi y nguyên (spec header).
- KHÔNG BAO GIỜ gợi ý goal tới `signed-off` — vế cấm phải nằm NGAY TRONG câu SKILL (spec §4) và in đậm trong GUIDE (spec §3.4).
- Template neo vào TƯỜNG THUẬT transcript, kèm vế "mơ hồ = CHƯA hoàn thành" — dùng NGUYÊN VĂN spec §3.2 (council C1).
- KHÔNG thêm test string-match cho docs (council C2 đã bác P22).
- Chỉ sửa bản ROOT; `plugins/acceptance-gate/` sinh qua `bash scripts/sync-plugin-packages.sh`. KHÔNG đụng `plugins/feature-loop-codex`, `design-loop/`.
- Commit tiếng Việt `<type>(<scope>): ...`, KHÔNG Co-Authored-By, KHÔNG push (nếp: user duyệt cuối rồi mới push).

---

### Task 1: GUIDE.md — mục "/goal" + entry mục lục

**Files:**
- Modify: `GUIDE.md` (mục mới sau "## Sổ quyết định & 2 công tắc design (1.11.0)", ~dòng 183; TOC ~dòng 9-19)

**Interfaces:**
- Produces: heading `## Chạy không-người-trông đoạn máy với /goal (1.11.1 · Claude Code ≥ 2.1.139)` — Task 2 tham chiếu "template mục /goal trong GUIDE".

- [ ] **Step 0: Preflight.** `git status --porcelain | wc -l` → 0; baseline `bash tests/hooks/run-tests.sh && bash tests/scripts/run-tests.sh && bash tests/plugins/run-tests.sh` → 51/0 · 151/0 · all pass. Đỏ → DỪNG báo user.

- [ ] **Step 1: Chèn mục mới** NGAY SAU toàn bộ mục "## Sổ quyết định & 2 công tắc design (1.11.0)" (trước heading kế tiếp — mục 5 "Cài đặt"), nguyên văn:

```markdown
## Chạy không-người-trông đoạn máy với /goal (1.11.1 · Claude Code ≥ 2.1.139)

Đoạn S2→S4 của feature-loop toàn việc máy — nhưng chỉ tự chạy khi phiên còn sống.
`/goal` của Claude Code (≥ 2.1.139, workspace trusted, hooks bật) là backstop tầng
harness: sau mỗi turn một checker nhỏ đọc transcript, điều kiện chưa thỏa thì tự nổ
turn mới. Dùng đúng cách với feature-loop:

**Khi nào:** ngay sau khi bạn duyệt Gate 1, trước khi rời máy.

**Template (điền slug của bạn, dán thành 1 dòng — xuống dòng dưới đây chỉ để dễ đọc):**

```
/goal Feature <slug>: coi là HOÀN THÀNH chỉ khi transcript tường thuật rõ
S4 verdict PASS hoặc PENDING-JUDGMENT và xác nhận đã set contract
_acceptance/<slug>/contract.md sang status: verified. Loop đã escalate cho
user (REJECT quá 3 round / BLOCKED / chờ input người) cũng coi là HOÀN THÀNH
— để dừng. Thông tin mơ hồ hoặc không chắc = CHƯA hoàn thành. Hoặc dừng
sau 15 turns.
```

**Vì sao template dài vậy:** checker của `/goal` đọc *transcript*, không đọc file —
điều kiện phải neo vào tường thuật của loop (verdict + set status), không neo vào
trạng thái file. Vế "mơ hồ = CHƯA hoàn thành" giữ checker khỏi dừng-sớm-sai khi log
lấp lửng; vế escalate và "15 turns" là hai lối thoát để không đốt token vô ích.

**Giới hạn cứng:**
- **KHÔNG BAO GIỜ đặt goal tới `signed-off`.** Hook của kit chặn agent tự điền chữ
  ký (đúng thiết kế) → điều kiện không bao giờ thỏa bằng máy → spin đốt token tới
  bound. Gate 2 là việc của người.
- `/goal` **không thay grader**: checker chỉ trả lời "chạy tiếp không"; S4 verify
  (fresh agents + evals máy + hook) mới là chấm thật — doer≠grader giữ nguyên.
- Đạt `verified` → goal tự thỏa và tắt; quay lại duyệt Gate 2 bằng mắt người như thường.

**Phạm vi:** tính năng Claude Code — Codex không có `/goal` (feature-loop-codex không
áp dụng). Kit không phụ thuộc: không dùng `/goal` thì mọi thứ chạy y nguyên.
```

- [ ] **Step 2: Entry mục lục.** Trong "## Mục lục", NGAY SAU entry của mục "Sổ quyết định & 2 công tắc design", thêm 1 dòng entry cho mục mới — SAO CHÉP ĐÚNG FORMAT của entry liền trên (kiểu anchor-link hay text thường tùy file đang dùng), title: `Chạy không-người-trông đoạn máy với /goal (1.11.1)`.

- [ ] **Step 3: Verify.** `grep -c '/goal' GUIDE.md` → ≥ 4; `grep -c 'signed-off' GUIDE.md` tăng đúng 1 so với trước (mục mới có 1 lần, đậm); mục lục có dòng mới (`grep -c 'không-người-trông' GUIDE.md` → 2: TOC + heading).

- [ ] **Step 4: Commit.** `git add GUIDE.md && git commit -m "docs(guide): nếp /goal cho đoạn máy S2→S4 — template neo transcript + giới hạn cứng (1.11.1)"`

---

### Task 2: feature-loop SKILL — 1 câu nhắc sau Gate 1

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (section `## GATE 1 (human — điểm dừng 1)`)

**Interfaces:**
- Consumes: heading GUIDE của Task 1 (câu tham chiếu "template mục /goal trong GUIDE").

- [ ] **Step 1: Chèn câu** vào CUỐI đoạn "Khi duyệt: ..." của section GATE 1 — ngay sau câu "Commit design doc + contract + evals." (giữ nguyên câu seal của 1.11.0 đứng trước đó), nguyên văn:

```markdown
User muốn rời máy cho đoạn S2→S4 tự chạy (Claude Code có `/goal`)? → IN gợi ý lệnh theo template mục /goal trong GUIDE, điền sẵn slug — CHỈ in gợi ý (slash command là của user, không tự đặt); TUYỆT ĐỐI không gợi ý goal tới `signed-off` (hook chặn chữ ký máy → spin vô hạn).
```

- [ ] **Step 2: Verify.** `grep -c '/goal' feature-loop/skills/feature-loop/SKILL.md` → 2 (cùng 1 câu: "có `/goal`" + "mục /goal"); `grep -c 'signed-off' ...SKILL.md` tăng đúng 1; các bar Đợt 4 còn nguyên: `grep -c '^| \*\*CT' ...` → 2, `grep -c '🎨' ...` → 7, `grep -c 'decisions.jsonl' ...` → 5.

- [ ] **Step 3: Commit.** `git add feature-loop/skills/feature-loop/SKILL.md && git commit -m "feat(feature-loop): gợi ý /goal sau Gate 1 — an toàn tại điểm dùng, cấm goal tới signed-off"`

---

### Task 3: Bump version + sync + suites + release commit

**Files:**
- Modify: `.claude-plugin/plugin.json` (version `1.11.0` → `1.11.1`), `feature-loop/.claude-plugin/plugin.json` (`1.11.0` → `1.11.1`)
- Generated: `plugins/acceptance-gate/**` qua sync script (root `.codex-plugin` + pkg manifests do script tự align)

- [ ] **Step 1:** Sửa field `version` trong 2 file trên (CHỈ field version). design-loop KHÔNG đổi (0.2.0 giữ).
- [ ] **Step 2:** `bash scripts/sync-plugin-packages.sh` — Expected: `Synced ... (version 1.11.1)`.
- [ ] **Step 3:** Chạy CẢ BA suite — Expected: hooks 51/0 · scripts 151/0 · plugins all pass (P03 canh 4 manifest acceptance-gate cùng 1.11.1; P06 canh 2 manifest design-loop khớp nhau — không đổi nên vẫn xanh). Đỏ → DỪNG, không release.
- [ ] **Step 4:** `git status` soát danh sách file: 2 manifest + plugins/acceptance-gate (GUIDE + manifests) — file lạ → DỪNG.
- [ ] **Step 5: Release commit.** `git add -A && git commit -m "Release: acceptance-gate 1.11.1 / feature-loop 1.11.1 — nếp /goal cho đoạn máy S2→S4 (docs-only)"` — thân commit 3 ý: mục GUIDE (template neo transcript, chống dừng-sớm-sai) · câu SKILL sau Gate 1 (cấm signed-off tại điểm dùng) · docs-only, không cơ chế, Codex không áp dụng. KHÔNG push.

---

## Self-review đã chạy (khi viết plan)

- **Spec coverage:** §3 (5 khối GUIDE) → T1 Step 1 đủ cả 5 · §3 "kèm entry mục lục" → T1 Step 2 · §4 câu SKILL → T2 nguyên văn · §5 đã-bác (P22/auto-set/card) → không task nào làm · §6 nơi chạm + release → T3. Không gap.
- **Placeholder scan:** T1 Step 2 "sao chép đúng format entry liền trên" là chỉ dẫn đọc-file-rồi-khớp (format anchor phụ thuộc file thật) — có chủ đích, kèm title chính xác; còn lại nguyên văn đủ.
- **Type consistency:** heading GUIDE trong T1 = chuỗi T2 tham chiếu ("mục /goal trong GUIDE"); version 1.11.1 nhất quán T1-heading/T3/commit message.
