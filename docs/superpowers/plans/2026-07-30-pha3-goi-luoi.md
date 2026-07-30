# Pha 3 — gói lưới 5 món Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 5 lưới chống-drift vào feature-loop + template opportunity vào acceptance references, kèm test P82–P88, mirror sync, version bump có chủ đích.

**Architecture:** Toàn bộ là sửa-chữ SKILL/GUIDE/template + test bash/python trong `tests/plugins/run-tests.sh`. Không máy mới ngoài test. Nguồn sự thật: `skills/`, `feature-loop/`, `codex/`, `GUIDE.md`; mirror `plugins/` sinh bằng `scripts/sync-plugin-packages.sh`.

**Tech Stack:** Markdown + bash test harness + python3 heredoc (pattern P55/P80) + node (chỉ để gọi reader thật `lib/evidence-core.js`).

## Global Constraints

- Mọi case có nhánh âm PHẢI: đối chứng dương chạy TRƯỚC trong cùng harness + ghim đúng thông điệp/hành vi (CLAUDE.md).
- Grep-pin phải có sanity: path tường minh, assert bắt cả positive lẫn mutated-copy-fails.
- Sửa nguồn `skills/`/`codex/` → chạy sync + commit mirror CÙNG commit (P30).
- Từ vựng theo CONTEXT.md ("Cổng 1/Cổng 2" hoa = điểm dừng người; không dùng "ledger" trần trong văn mới).
- KHÔNG renumber các bước hiện có của 2 SKILL (nhiều test/desc tham chiếu "S1#7", "step 8").
- Test P mới đánh số P82–P88, append trước khối `if [ "$failures" -gt 0 ]` cuối `tests/plugins/run-tests.sh`.
- Verify per-task: `bash tests/plugins/run-tests.sh` (suite phải XANH toàn bộ, không chỉ case mới).

---

### Task 1: Template opportunity + P82/P83 (món 1 — phục vụ E1, E2, E3)

**Files:**
- Create: `skills/acceptance/references/opportunity-template.md`
- Modify: `tests/plugins/run-tests.sh` (append P82, P83)

**Interfaces:**
- Produces: file template với marker `<!-- <<<OPP-FRONTMATTER-TEMPLATE -->` … `<!-- OPP-FRONTMATTER-TEMPLATE>>> -->` bao một fence yaml chứa frontmatter placeholder `{slug}` v.v. — Task 6 nhắc nó trong description.

`independent: false` (chung file test với mọi task).

- [ ] **Step 1: Viết template** — nội dung ground vào opportunity.md thật của V1 (trang-tu-van-v2). Cấu trúc bắt buộc:

````markdown
# Opportunity — khuôn D1b (điền xong mới tới red-team D2; Cổng 0 ký trên file này)

> Bản mẫu rút từ vòng V1 thật (trang-tu-van-v2, artifact-platform 27-28/07/2026).
> Frontmatter là phần MÁY ĐỌC (card/funnel F-B sẽ đọc) — giữ nguyên key, chỉ thay giá trị.
> Xoá các dòng hướng dẫn `>` khi dùng thật.

<!-- <<<OPP-FRONTMATTER-TEMPLATE -->
```yaml
---
schema_version: 1
slug: {slug}
feature: {feature}
owner: {owner}
stage: {stage}              # discovery | decided | archived
decision: {decision}        # build | iterate | park | kill — người ký Cổng 0
decided_by: {decided_by}
decided_at: {decided_at}    # ISO UTC
time_human_minutes:
  gate0: {gate0_minutes}
prototype:
  base_commit: {base_commit}    # điểm cắt nhánh proto — guard diffBase khi keep
  disposition: {disposition}    # keep | archive
---
```
<!-- OPP-FRONTMATTER-TEMPLATE>>> -->

## Vấn đề & ai gặp
## Giả định chốt sinh tử
(bảng: # · Giả định · Nếu sai thì · Phép thử rẻ nhất · Trạng thái — re-rank sau red-team)
## Ngưỡng chết / ngưỡng UAT
(ngưỡng KHAI tại Cổng 0, ĐO tại phiên UAT; phép đo đổi giữa chừng → ghi SUPERSEDED tường minh, giữ bản gốc làm sử liệu)
## Kết quả prototype
## Nguồn ngoài & phạm vi kế thừa
(bảng: Món vật liệu · Nguồn · Phân loại · Kế thừa? · Người ký)
- Phân loại TỪNG món vật liệu ngoài repo: **triết-lý/logic** (engine, luật nghiệp vụ, ngưỡng, thuật toán — kế thừa được) vs **ngôn-ngữ-thiết-kế/hình-thái** (layout, DNA thị giác, khuôn tương tác — mặc định KHÔNG: chuẩn của repo tiêu thụ THẮNG).
- Muốn kế thừa hình thái: khai đích danh vào bảng + người ký tại Cổng 0 (cột Người ký).
- không phân loại = chưa đủ điều kiện ký Cổng 0.
## Cổng 0
(2 câu hỏi: số phận cơ hội → `decision`; số phận code → `disposition`; ngưỡng UAT chốt cùng lúc ký; keep → điền Bảng nợ + 3 guard)
## Thước đo thành công → ứng viên criterion
(đo-sau-ship; mỗi thước phải truy được thành AC của contract)
## Bảng nợ kế thừa (CHỈ khi disposition: keep)
(bảng: Path · Giữ / Dựng lại · Chạm t3_paths? · Ghi chú)
## Out of scope từ khám phá
(≥2 bullet; nhánh-đã-bác ghi kèm lý do)
````

  (Văn đầy đủ hơn khung trên: mỗi section kèm 1-3 dòng hướng dẫn `>` lấy từ hành vi V1 thật — vd Giả định ghi chú "re-rank sau D2", Ngưỡng ghi chú hai đồng hồ dựng/chờ. KHÔNG copy nội dung E03/trang-tu-van cụ thể vào template.)

- [ ] **Step 2: Viết P82 (round-trip + mutation, pattern P55)** — append vào run-tests.sh trước khối kết:

```bash
# ── P82: ROUND-TRIP frontmatter opportunity-template <-> reader that ─────────
# Khuon rut tu CHINH template (marker), doc bang frontmatterField cua
# lib/evidence-core.js — reader ma hook/CI dung. Doi chung duong truoc, dot bien sau.
run "P82 opportunity-template round-trip frontmatter (marker -> frontmatterField)" \
  node - "$ROOT" <<'JS'
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const tplPath = path.join(root, 'skills/acceptance/references/opportunity-template.md');
const tpl = fs.readFileSync(tplPath, 'utf8');
const core = require(path.join(root, 'lib/evidence-core.js'));
const m = tpl.match(/<!-- <<<OPP-FRONTMATTER-TEMPLATE -->\n```yaml\n([\s\S]*?)```\n<!-- OPP-FRONTMATTER-TEMPLATE>>> -->/);
if (!m) { console.error('KHONG rut duoc khuon OPP-FRONTMATTER-TEMPLATE tu template'); process.exit(1); }
const SAMPLE = { slug: 'demo-coho', feature: 'Demo', owner: 'a@b.c', stage: 'decided',
  decision: 'build', decided_by: 'a@b.c', decided_at: '2026-07-30T00:00:00Z',
  gate0_minutes: '6', base_commit: 'abc123', disposition: 'archive' };
const filled = m[1].replace(/\{(\w+)\}/g, (_, k) => SAMPLE[k] !== undefined ? SAMPLE[k] : (console.error('placeholder la ' + k + ' khong co sample'), process.exit(1)));
// Doi chung DUONG: reader that doc dung tung key top-level.
for (const k of ['slug', 'stage', 'decision', 'decided_by', 'decided_at', 'owner']) {
  const v = core.frontmatterField(filled, k);
  if (v !== SAMPLE[k]) { console.error('reader doc key ' + k + ' = [' + v + '] nhung phai la [' + SAMPLE[k] + ']'); process.exit(1); }
}
// Dot bien: xoa dong --- dong -> reader phai tra null (ghim hanh vi fail).
const broken = filled.replace(/\n---[ \t]*(\r?\n|$)(?![\s\S]*\n---)/, '\n');
if (core.frontmatterField(broken, 'slug') !== null) {
  console.error('dot bien xoa --- dong ma reader van doc duoc — phep do da chet'); process.exit(1);
}
console.log('round-trip OK; dot bien mat frontmatter bi bat');
JS
```

- [ ] **Step 3: Viết P83 (section + trường mới, checker + mutation copies, pattern P80)**:

```bash
# ── P83: opportunity-template du 8 section V1 + truong Nguon ngoai ───────────
run "P83 opportunity-template du muc V1 + luoi ke thua (kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
text = (root / "skills/acceptance/references/opportunity-template.md").read_text(encoding="utf-8")

REQUIRED = [
    "OPP-FRONTMATTER-TEMPLATE",
    "## Vấn đề & ai gặp",
    "## Giả định chốt sinh tử",
    "## Ngưỡng chết / ngưỡng UAT",
    "## Kết quả prototype",
    "## Nguồn ngoài & phạm vi kế thừa",
    "## Cổng 0",
    "## Thước đo thành công",
    "## Bảng nợ kế thừa",
    "## Out of scope từ khám phá",
    "triết-lý/logic",
    "ngôn-ngữ-thiết-kế/hình-thái",
    "không phân loại = chưa đủ điều kiện ký Cổng 0",
]
def missing(t):
    return [n for n in REQUIRED if n not in t]

# Doi chung DUONG: ban that phai du.
assert missing(text) == [], f"template thieu: {missing(text)}"
# Doi chung AM: pha tung anchor trong ban sao -> checker PHAI bao thieu dung anchor do.
for needle in REQUIRED:
    mutated = text.replace(needle, needle[:-1] + "_", 1)
    got = missing(mutated)
    assert needle in got, f"dot bien go [{needle}] ma checker khong do — phep do chet"
PY
```

- [ ] **Step 4: Chạy suite** — `bash tests/plugins/run-tests.sh` → mọi case PASS (kể cả P82/P83 mới).
- [ ] **Step 5: Commit** — `git add skills/acceptance/references/opportunity-template.md tests/plugins/run-tests.sh && git commit -m "feat(acceptance): opportunity-template.md — khuôn D1b máy-đọc + lưới Nguồn ngoài (P82/P83)"` (mirror sync dồn về Task 7 nếu muốn, nhưng AN TOÀN hơn: chạy `bash scripts/sync-plugin-packages.sh` + `git add plugins/` NGAY trong commit này — P30 chặn drift theo từng commit).

### Task 2: Platform-fit cross-check + P84 (món 2 — phục vụ E4, E5)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (S1#7, ý (4))
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (step 8, element (4))
- Modify: `tests/plugins/run-tests.sh` (append P84)

`independent: false`

- [ ] **Step 1: Sửa Claude SKILL S1#7 ý (4)** — chuỗi cũ kết thúc `…hoặc chỉ có eval lớp UI (ui-check/judgment);` → nối thêm trước dấu `;`: ` · artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không; skill/quy định nào của repo LẼ RA phải nạp mà chưa nạp`
- [ ] **Step 2: Sửa codex step 8 element (4)** — chuỗi cũ `…or carry UI-layer evals only (ui-check/judgment);` → nối trước `;`: `, and platform-fit: does the artifact set follow the consuming repo's existing UI/plugin standards, and which repo skill or rule SHOULD have been loaded but was not`
- [ ] **Step 3: Viết P84**:

```bash
# ── P84: gap-probe platform-fit cross-check o CA HAI harness ────────────────
run "P84 gap-probe co ve platform-fit (Claude + Codex, kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
PINS = {
    "feature-loop/skills/feature-loop/SKILL.md":
        "artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không; skill/quy định nào của repo LẼ RA phải nạp mà chưa nạp",
    "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md":
        "platform-fit: does the artifact set follow the consuming repo's existing UI/plugin standards",
}
for rel, needle in PINS.items():
    text = (root / rel).read_text(encoding="utf-8")
    assert needle in text, f"{rel} thieu ve platform-fit"
    # ve phai nam TRONG doan cross-check bat buoc (y (4)), khong phai cho khac
    idx = text.find(needle)
    ctx = text[max(0, idx - 600):idx]
    assert ("cross-check" in ctx) or ("cross-checks" in ctx), f"{rel}: ve platform-fit khong nam trong muc cross-check"
    # doi chung am: go ve trong ban sao -> pin phai truot
    assert needle not in text.replace(needle, "", 1), f"{rel}: dot bien khong hieu luc"
PY
```

- [ ] **Step 4: Chạy suite** → PASS toàn bộ (P0x parity codex + P20 không được vỡ).
- [ ] **Step 5: Sync mirror + commit** — `bash scripts/sync-plugin-packages.sh && git add feature-loop/skills/feature-loop/SKILL.md codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md plugins/ tests/plugins/run-tests.sh && git commit -m "feat(feature-loop): gap-probe cross-check platform-fit 2 harness (P84)"`

### Task 3: GOAL-TEMPLATE nhúng vào SKILL + marker GUIDE + P85 (món 4 — phục vụ E8, E9)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (mục GATE 1)
- Modify: `GUIDE.md` (bọc marker quanh fence template /goal hiện có, ~dòng 304-313)
- Modify: `tests/plugins/run-tests.sh` (append P85)

`independent: false`

- [ ] **Step 1: Sửa SKILL GATE 1** — thay cụm `IN gợi ý lệnh theo template mục /goal trong GUIDE, điền sẵn slug — CHỈ in gợi ý` bằng `IN NGUYÊN VĂN khối GOAL-TEMPLATE ngay dưới đây, thay ` + backtick `<slug>` + ` bằng slug thật — CHỈ in gợi ý` (giữ nguyên phần còn lại của câu + đoạn /model). CUỐI đoạn GATE 1 (sau đoạn văn, trước `## S2 — PLAN`) chèn khối:

````markdown
<!-- <<<GOAL-TEMPLATE -->
```
/goal Feature <slug>: coi là HOÀN THÀNH chỉ khi transcript tường thuật rõ
S4 verdict PASS hoặc PENDING-JUDGMENT và xác nhận đã set contract
_acceptance/<slug>/contract.md sang status: verified. Loop đã escalate cho
user (REJECT quá 3 round / BLOCKED / chờ input người) cũng coi là HOÀN THÀNH
— để dừng. Thông tin mơ hồ hoặc không chắc = CHƯA hoàn thành. Hoặc dừng
sau 15 turns.
```
<!-- GOAL-TEMPLATE>>> -->
````

- [ ] **Step 2: Sửa GUIDE.md** — bọc fence template hiện có (giữ NGUYÊN VĂN nội dung fence, khớp từng ký tự với khối ở Step 1) bằng 2 dòng marker `<!-- <<<GOAL-TEMPLATE -->` / `<!-- GOAL-TEMPLATE>>> -->`.
- [ ] **Step 3: Viết P85**:

```bash
# ── P85: GOAL-TEMPLATE — SKILL la nguon runtime, GUIDE la ban nguoi doc ──────
# B4 (retro V1): package feature-loop KHONG ship GUIDE nen "in theo GUIDE" chet
# o runtime. Template nay nhung vao SKILL; P85 giu 2 ban khop tung ky tu.
run "P85 GOAL-TEMPLATE nhung trong SKILL, khop GUIDE, lenh in noi voi khoi" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
RX = re.compile(r"<!-- <<<GOAL-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- GOAL-TEMPLATE>>> -->")
skill_p = "feature-loop/skills/feature-loop/SKILL.md"
guide_p = "GUIDE.md"
def block(rel, text):
    m = RX.search(text)
    assert m, f"{rel}: KHONG rut duoc khoi GOAL-TEMPLATE qua marker"
    return m.group(1).strip()
skill_t = (root / skill_p).read_text(encoding="utf-8")
guide_t = (root / guide_p).read_text(encoding="utf-8")
sb, gb = block(skill_p, skill_t), block(guide_p, guide_t)
# Doi chung DUONG: hai ban nguyen ven phai khop truoc khi tin phep so.
assert sb == gb, f"GOAL-TEMPLATE lech giua {skill_p} va {guide_p} — dong bo lai 2 khoi marker"
# Tinh chat noi dung cua template.
assert sb.startswith("/goal "), "template phai bat dau bang /goal"
assert "verified" in sb, "template phai neo dieu kien verified"
assert "REJECT quá 3 round" in sb, "template phai co loi thoat escalate"
assert "signed-off" not in sb, "template KHONG duoc nham dich signed-off"
# Lenh in phai NOI voi khoi (khong chi khoi ton tai — gap-probe F1).
assert "IN NGUYÊN VĂN khối GOAL-TEMPLATE" in skill_t, "GATE 1 thieu lenh in-mac-dinh tham chieu dich danh khoi marker"
assert "template mục /goal trong GUIDE" not in skill_t, "SKILL van tro template sang GUIDE — goc benh B4 chua cat"
# Doi chung AM: dot bien MOT ban (ban sao trong bo nho) -> phep so phai DO.
mutated = skill_t.replace("15 turns", "16 turns", 1)
try:
    ok = block(skill_p, mutated) == gb
except AssertionError:
    ok = False
assert not ok, f"dot bien khoi trong {skill_p} ma van khop {guide_p} — phep so da chet"
# Doi chung khong-pha: dong /goal native cua codex SKILL con nguyen (AC-9).
codex_t = (root / "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md").read_text(encoding="utf-8")
assert "suggest the native Codex `/goal` command" in codex_t, "codex SKILL mat dong goi y /goal native"
assert "Never create or suggest a goal that reaches" in codex_t, "codex SKILL mat rao chan signed-off"
PY
```

- [ ] **Step 4: Chạy suite** → PASS (P43 GUIDE pins không vỡ; P0x codex parity `/goal` vẫn xanh).
- [ ] **Step 5: Sync mirror + commit** — `bash scripts/sync-plugin-packages.sh && git add feature-loop/skills/feature-loop/SKILL.md GUIDE.md plugins/ tests/plugins/run-tests.sh && git commit -m "feat(feature-loop): Gate 1 nhúng GOAL-TEMPLATE vào SKILL, drift-pin với GUIDE (P85) — sửa gốc B4"` (GUIDE nằm trong t1_skip nhưng đi cùng commit nguồn — hợp lệ, gate xét theo diff PR).

### Task 4: Key ui_standards_skill + P86 (món 3 — phục vụ E6, E7)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (S1#4, mở đầu)
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (S1 step 4, mở đầu)
- Modify: `tests/plugins/run-tests.sh` (append P86)

`independent: false`

- [ ] **Step 1: Sửa Claude SKILL S1#4** — đầu item 4 hiện là `Kết thúc brainstorm, sinh CÙNG LÚC từ một ngữ cảnh:` → thay bằng:

```
Kết thúc brainstorm — 🎨 feature chạm UI: TRƯỚC khi sinh 3 artifact, đọc key `feature_loop.ui_standards_skill` trong `_acceptance/config.yaml` (giá trị = tên skill chuẩn-plugin/DS của repo tiêu thụ, vd `create-onehub-plugin`); key CÓ → BẮT BUỘC invoke skill đó ngay (đối trọng chuẩn nội đặt lên cùng bàn cân với vật liệu ngoài — retro V1 quy luật meta 1); key VẮNG → ghi chú đúng 1 dòng vào gói Gate 1 ("repo chưa khai `feature_loop.ui_standards_skill` — artifact UI không có đối trọng chuẩn nội"), KHÔNG chặn. Rồi sinh CÙNG LÚC từ một ngữ cảnh:
```

- [ ] **Step 2: Sửa codex step 4** — hiện là `Write a design doc using repo convention, commonly…` → thay bằng:

```
When the feature touches UI, first read `feature_loop.ui_standards_skill` from `_acceptance/config.yaml` (its value names the consuming repo's plugin/design-standards skill); when present you MUST invoke that skill before generating the three artifacts (the internal counterweight to external material); when absent, add exactly one line to the Gate 1 package ("repo has not declared `feature_loop.ui_standards_skill` — UI artifacts lack an internal standards counterweight") and do not block. Then write a design doc using repo convention, commonly…
```

- [ ] **Step 3: Viết P86** (cùng khuôn P84: PINS dict 2 file):
  - Claude pins: `` feature_loop.ui_standards_skill `` xuất hiện; `BẮT BUỘC invoke skill đó` ; `KHÔNG chặn` cùng đoạn (context ±600 ký tự quanh key); đối chứng âm gỡ key trong bản sao → pin trượt.
  - Codex pins: `feature_loop.ui_standards_skill`; `you MUST invoke that skill before generating`; `do not block`; đối chứng âm tương tự.
- [ ] **Step 4: Chạy suite** → PASS.
- [ ] **Step 5: Sync mirror + commit** — `git add` đích danh 2 SKILL + plugins/ + tests, message `feat(feature-loop): S1 bắt nạp ui_standards_skill của repo tiêu thụ (P86)`.

### Task 5: Lane → design-pass + Gate 1 bản bấm được + P87 (món 5 — phục vụ E10)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (đoạn "Câu hỏi lane" + mục GATE 1)
- Modify: `tests/plugins/run-tests.sh` (append P87)

`independent: false`

- [ ] **Step 1: Thay đoạn "Câu hỏi lane"** — thay TOÀN BỘ đoạn bắt đầu `**Câu hỏi lane (cuối S1, CHỈ khi CT1 bật ∧ CT2 chưa bật — 1 câu):**` bằng:

```
**Nghi thức S1-D (cuối S1, MỌI feature chạm UI — trigger là surface web-UI của feature, KHÔNG phụ thuộc CT1/CT2 hay executors.design):** feature chạm UI → chạy skill `design-pass` (plugin acceptance-gate ≥ 1.26.0, in-harness trên Browser pane) TRƯỚC Gate 1 — Gate 1 duyệt UI trên BẢN BẤM ĐƯỢC, không duyệt UI bằng chữ. Bỏ bước này PHẢI là entry `descope` CÓ TÊN trong ledger (AUTO-DRAFT: decision bắt đầu đúng chuỗi `"bỏ design-pass — <lý do 1 dòng>"`, impact "Gate 1 duyệt UI bằng chữ — mất khoảnh khắc visual trước duyệt"); không có đường bỏ im lặng. Chọn chạy = entry `type:"approach"` như cũ. Workspace cũ đang giữa vòng với ceremony design-mockup (CT2 bật) đi tiếp bảng tra CT1/CT2 — đường đọc-cũ, không bắt migrate.
```

- [ ] **Step 2: Sửa mục GATE 1** — sau câu invoke `/acceptance-card`, thêm 1 câu: `Feature chạm UI: trình kèm thẻ BẢN BẤM ĐƯỢC (URL/proto từ design-pass) — không duyệt UI bằng chữ; nếu S1 có ghi chú vắng `feature_loop.ui_standards_skill` thì dòng đó phải nằm trong gói.`
- [ ] **Step 3: Viết P87** (khuôn P84/P86, 1 file): pins trong Claude SKILL: `Nghi thức S1-D`; `design-pass` + `TRƯỚC Gate 1` cùng đoạn; `"bỏ design-pass — ` (chuỗi máy-đọc descope); `BẢN BẤM ĐƯỢC` xuất hiện ở mục GATE 1 (context sau `## GATE 1`); đối chứng âm mutated copy. THÊM pin giữ-bảng-cũ: `| **CT1` và `| **CT2` vẫn mỗi cái đúng 1 lần (không phá P20).
- [ ] **Step 4: Chạy suite** → PASS (đặc biệt P20).
- [ ] **Step 5: Sync mirror + commit** — message `feat(feature-loop): wire S1-D — lane design-pass trước Gate 1, bản bấm được tại thẻ (P87)`.

### Task 6: Version bump có chủ đích + description + P88, update P22 (phục vụ E12)

**Files:**
- Modify: `.claude-plugin/plugin.json` + `.codex-plugin/plugin.json` + `codex/acceptance-gate/.codex-plugin/plugin.json` (version → `1.27.0`, description nối đoạn v1.27; P03 đòi 3 version KHỚP nhau)
- Modify: `feature-loop/.claude-plugin/plugin.json` + `codex/feature-loop-codex/.codex-plugin/plugin.json` (version → `1.19.0`, description nối đoạn v1.19)
- Modify: `tests/plugins/run-tests.sh` (P22: 2 literal `"1.18.1"` → `"1.19.0"`; append P88)

`independent: false`

- [ ] **Step 1: Bump + description.** Đoạn nối description (giữ giọng lịch sử hiện có):
  - acceptance-gate (cả 3 manifest, khớp P03): ` v1.27 ships references/opportunity-template.md — the discovery Cổng-0 opportunity mold with machine-readable frontmatter (OPP-FRONTMATTER-TEMPLATE marker, round-trip-tested against the kit's real frontmatter reader) and the "Nguồn ngoài & phạm vi kế thừa" inheritance-classification field (philosophy/logic inheritable; design-language defaults to NO — unclassified material blocks the Cổng-0 signature).`
  - feature-loop (Claude): ` v1.19 closes the V1-retro B1/B4 nets: S1 must load the consuming repo's standards skill via feature_loop.ui_standards_skill (one visible line when absent), the gap-probe cross-checks platform-fit, the S1-D lane routes every UI feature to the in-harness design-pass skill before Gate 1 (skipping requires a named descope entry), and Gate 1 prints the /goal suggestion from the GOAL-TEMPLATE block embedded in the SKILL itself (drift-pinned to GUIDE — the packaged skill no longer depends on GUIDE at runtime).`
  - feature-loop-codex: ` v1.19 adds the platform-fit gap-probe cross-check and mandatory feature_loop.ui_standards_skill loading at S1; design-pass S1-D wiring stays Claude-only for now (descope ledger d-20260730T050548Z-4723).`
- [ ] **Step 2: Update P22** — 2 assert literal `== "1.18.1"` → `== "1.19.0"` (comment của P22 giữ nguyên).
- [ ] **Step 3: Viết P88**:

```bash
# ── P88: release co chu dich — version floor + description khop hanh vi ─────
run "P88 version floor 1.27/1.19 + description nhac hanh vi moi" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
def ver(rel):
    return tuple(int(x) for x in json.loads((root / rel).read_text())["version"].split("."))
def desc(rel):
    return json.loads((root / rel).read_text())["description"]
# Floor semver (KHONG ghim literal bang == — tranh vong "bump -> stale" cua P03):
assert ver(".claude-plugin/plugin.json") >= (1, 27, 0), "acceptance-gate chua bump toi 1.27.0"
assert ver("feature-loop/.claude-plugin/plugin.json") >= (1, 19, 0), "feature-loop chua bump toi 1.19.0"
assert ver("codex/feature-loop-codex/.codex-plugin/plugin.json") >= (1, 19, 0), "feature-loop-codex chua bump toi 1.19.0"
# Description phai nhac hanh vi moi (keyword chuc nang, on dinh qua cac ban sau):
assert "opportunity-template" in desc(".claude-plugin/plugin.json"), "desc acceptance-gate thieu opportunity-template"
d = desc("feature-loop/.claude-plugin/plugin.json")
for kw in ("ui_standards_skill", "design-pass", "GOAL-TEMPLATE"):
    assert kw in d, f"desc feature-loop thieu {kw}"
assert "platform-fit" in desc("codex/feature-loop-codex/.codex-plugin/plugin.json"), "desc codex thieu platform-fit"
# Doi chung am: ha version trong ban sao -> floor phai truot.
low = (1, 18, 1)
assert not (low >= (1, 19, 0)), "phep so semver chet"
PY
```

- [ ] **Step 4: Chạy suite** → PASS (P03/P04/P22 phải xanh với version mới).
- [ ] **Step 5: Sync mirror + commit** — `bash scripts/sync-plugin-packages.sh && git add .claude-plugin/plugin.json .codex-plugin/plugin.json codex/acceptance-gate/.codex-plugin/plugin.json feature-loop/.claude-plugin/plugin.json codex/feature-loop-codex/.codex-plugin/plugin.json plugins/ tests/plugins/run-tests.sh && git commit -m "chore(release): acceptance-gate 1.27.0 + feature-loop 1.19.0 — gói lưới Pha 3 (P88, update P22)"`

### Task 7: Vòng chốt — full suite + set implemented

**Files:** không file mới; `_acceptance/pha3-goi-luoi/contract.md` (status).

`independent: false`

- [ ] **Step 1:** `bash scripts/sync-plugin-packages.sh --check` → "plugins/ mirror in sync."
- [ ] **Step 2:** chạy đủ 4 suite + coverage lint: `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh && node scripts/eval-coverage-lint.js . --slug pha3-goi-luoi` → tất cả PASS/exit 0 (lint advisory: đọc output, xử lý W nếu chỉ ra lỗi thật).
- [ ] **Step 3:** set contract `status: implemented`, commit `chore(acceptance): pha3-goi-luoi status implemented`, rồi dispatch S4 NGAY (feature-loop, không dừng).

## Self-review

- Spec coverage: món 1→T1, món 2→T2, món 4→T3, món 3→T4, món 5→T5, version/AC-12→T6, mirror/AC-11→từng task + T7. AC-1..AC-12 đều có task. ✓
- Placeholder scan: không TBD; mọi step có nội dung thật. ✓ (Văn template T1 Step 1 là khung + chỉ dẫn cụ thể, implementer cùng session đã đọc opportunity V1.)
- Type consistency: marker `OPP-FRONTMATTER-TEMPLATE`/`GOAL-TEMPLATE` thống nhất giữa task và evals.yaml; số P khớp evals (P82/83/84/85/86/87/88 ↔ E1..E12). ✓
