# Context Ladder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Phiên design-pass phải khai bản mẫu sống ở đâu (`context:` 3 nấc), thẻ Cổng 1 render nấc đó + cờ vàng khi standalone thiếu cảnh ngữ-cảnh — generic mọi repo.

**Architecture:** Writer (SKILL.md, khuôn marker) → artifact (`design-pass.md` frontmatter) → reader (`gate-card.js` Gate 1). Mọi biểu diễn máy-đọc (khoá `context:`, danh sách cảnh, chuỗi descope) sống trong MỘT khuôn có marker; reader chỉ dò theo khuôn; test round-trip rút-từ-writer-đọc-bằng-reader.

**Tech Stack:** Markdown skill text, Node (gate-card.js), bash+python test harness (tests/plugins/run-tests.sh).

## Global Constraints

- Nguồn sự thật là `skills/`, `scripts/`, `feature-loop/`; `plugins/` là mirror — Task cuối chạy `bash scripts/sync-plugin-packages.sh` và commit mirror CÙNG commit (P30 chặn drift).
- Mọi case âm: đối chứng dương XANH trước + ghim ĐÚNG thông điệp (bất biến CLAUDE.md).
- Fixture do CODE SINH trong lần chạy (rút từ marker template, không viết tay theo khuôn bên đọc); mọi path suy từ `$ROOT`, không hardcode.
- CẤM từ vựng host cụ thể ("Creator", "canvas", "OneHub") trong nguồn skill/script/test của kit.
- Đường đọc-cũ: artifact/config cũ → cờ vàng, KHÔNG lỗi, KHÔNG bắt migrate.
- Enum nấc: `standalone | static-frame | host-embedded`; nhãn tiếng người: `đứng một mình / khung giả tĩnh / nhúng host thật`; chuỗi descope: `bỏ cảnh ngữ-cảnh — ` (máy-đọc, prefix chính xác).
- Số case mới: P134–P141 (P133 là số cao nhất hiện dùng). Đặt sau vùng `# --- design-pass cases (P72-P81) end ---` với vùng marker riêng `# --- context-ladder cases (P134-P141) begin/end ---`.

---

### Task 1: Writer — design-pass SKILL.md (Giai đoạn 0 + khuôn + luật + socket)

**Files:**
- Modify: `skills/design-pass/SKILL.md`
- Test: `tests/plugins/run-tests.sh` (case P134)

**Interfaces:**
- Produces: khuôn `DESIGN-PASS-NOTE-TEMPLATE` có thêm 2 khoá frontmatter `context:` + `context_scenes:` và section body `## Cảnh ngữ-cảnh` chứa chuỗi descope `bỏ cảnh ngữ-cảnh — `. Task 2/3/4 rút khuôn này bằng regex `<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>`.

**Ghi chú giả định (đã kiểm):** SKILL.md hiện KHÔNG có "Giai đoạn 0 / câu phân loại mẫu" (mục Bổ sung 02/08 của spec v2 chưa thi công). Task này TẠO section Giai đoạn 0 chứa câu hỏi ngữ cảnh; khi câu phân loại mẫu land ở vòng khác, nó vào cùng section.

- [ ] **Step 1: Viết case P134 (đỏ trước).** Thêm vào `tests/plugins/run-tests.sh` sau vùng design-pass end, mở vùng marker mới (marker GHÉP MẢNH như P80 để find() không tự khớp source):

```bash
# --- context-ladder cases (P134-P141) begin ---

run "P134 context-ladder writer: khoa context + giai doan 0 + luat canh + mac-dinh-nac-cao (E1/E2/E3/E4a)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
def check(text):
    errs = []
    m = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", text, re.S)
    if not m:
        return ["KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE"]
    block = m.group(1)
    if "context: <standalone|static-frame|host-embedded>" not in block:
        errs.append("khuon thieu khoa context: 3 nac")
    if "context_scenes:" not in block:
        errs.append("khuon thieu khoa context_scenes")
    if "bỏ cảnh ngữ-cảnh — " not in block:
        errs.append("chuoi descope canh ngu-canh khong nam trong khuon marker")
    if "## Cảnh ngữ-cảnh" not in block:
        errs.append("khuon thieu section Canh ngu-canh")
    outside = text.replace(m.group(0), "")
    if "bỏ cảnh ngữ-cảnh — " in outside.split("## Giai đoạn 0")[0].split("| Thiếu |")[0] and "entry" not in outside:
        pass  # than skill duoc phep NHAC chuoi, mien khuon may-doc nam trong marker
    if "vật này sống ở đâu" not in text:
        errs.append("thieu cau hoi giai doan 0: vat nay song o dau")
    if "Giai đoạn 0" not in text:
        errs.append("thieu section Giai doan 0")
    if "scaffold đơn vị THẬT sau cờ dev" not in text:
        errs.append("thieu quy tac mac-dinh-nac-cao (scaffold don vi that sau co dev)")
    if "gương song song" not in text:
        errs.append("thieu lenh cam guong song song")
    if "hợp lệ vĩnh viễn" not in text:
        errs.append("thieu cau hop le vinh vien cho nhanh khong-co-duong-nhung-re")
    if "host_embed" not in text:
        errs.append("bang preflight thieu khoa design_pass.host_embed")
    if "standalone" in text and "trước Cổng Phạm-vi" not in text and "trước Gate 1" not in text:
        errs.append("thieu luat standalone truoc Cong Pham-vi phai kem canh/descope")
    return errs
# DOI CHUNG DUONG: ban nguyen ven phai XANH truoc khi tin cac mutation DO.
assert check(t) == [], f"ban nguyen ven phai xanh: {check(t)}"
# Mutation 1: xoa khoa context khoi khuon
m1 = t.replace("context: <standalone|static-frame|host-embedded>", "", 1)
assert any("khuon thieu khoa context" in e for e in check(m1)), "dot bien xoa khoa context khong do"
# Mutation 2: xoa cau hoi giai doan 0
m2 = t.replace("vật này sống ở đâu", "", 1)
assert any("vat nay song o dau" in e for e in check(m2)), "dot bien xoa cau hoi giai doan 0 khong do"
# Mutation 3: doi chuoi descope trong khuon (lech mot ky tu)
m3 = t.replace("bỏ cảnh ngữ-cảnh — ", "bo canh ngu canh: ", 1)
assert any("chuoi descope" in e for e in check(m3)), "dot bien lech chuoi descope khong do"
# Mutation 4: xoa lenh cam guong song song
m4 = t.replace("gương song song", "", 1)
assert any("cam guong song song" in e for e in check(m4)), "dot bien xoa cam guong khong do"
PY

# --- context-ladder cases (P134-P141) end ---
```

- [ ] **Step 2: Chạy suite, xác nhận P134 ĐỎ** với thông điệp "khuon thieu khoa context: 3 nac" (bản SKILL chưa sửa): `bash tests/plugins/run-tests.sh 2>&1 | grep -A2 P134`
- [ ] **Step 3: Sửa `skills/design-pass/SKILL.md`** — 4 chỗ:

(a) Section MỚI chèn ngay sau tiêu đề chính + đoạn mở ("Một mặt phẳng làm việc"), TRƯỚC "## 1. Preflight":

```markdown
## Giai đoạn 0 — vật này sống ở đâu (bắt buộc chọn trước khi mở Browser pane)

Câu hỏi bắt buộc mở phiên (song song câu phân loại mẫu khi mục đó land —
spec v2 §2.2 bổ sung 02/08): **"vật này sống ở đâu — phiên trình ở nấc
nào?"** Ba nấc, khai vào khoá `context:` của sổ phiên (mục 5), như `material:`:

| Nấc `context:` | Tiếng người | Nghĩa |
|---|---|---|
| `host-embedded` | nhúng host thật | vật render TRONG host thật của repo, sau cờ dev |
| `static-frame` | khung giả tĩnh | khung host thật dạng tĩnh bọc vật — thấy chỗ sống, host chưa chạy |
| `standalone` | đứng một mình | vật trần trên route proto — KHÔNG thấy người dùng vào–ra thế nào |

**Quy tắc chọn nấc — RẺ nhất đạt thị giác thật:** vật giao là một "đơn vị
host đã có khuôn" (plugin / route / screen) ⇒ mặc định **scaffold đơn vị
THẬT sau cờ dev, ruột tạm** — host render vật; CẤM dựng shell giống thật
(gương song song). Không có đường nhúng rẻ ⇒ `static-frame` hoặc
`standalone`+cảnh — hợp lệ vĩnh viễn: thang là khai báo, không ép.

**Luật cảnh ngữ-cảnh:** `standalone` trước Cổng Phạm-vi (Gate 1) ⇒ kèm ≥1
**cảnh ngữ-cảnh** (khung host thật dạng tĩnh bọc vật + storyboard hành
trình vào–ra, capture về `evidence/design-pass/`, liệt vào khoá
`context_scenes:`) HOẶC entry descope có tên trong sổ quyết định theo đúng
khuôn trong template mục 5. Không có đường bỏ im lặng — thẻ Cổng 1 cờ vàng.
```

(b) Bảng preflight (mục 1) thêm hàng sau `capture_cmd`:

```markdown
   | `design_pass.host_embed` | optional | Ổ cắm đường-nhúng-rẻ của repo: con trỏ hướng dẫn nhúng (`guide:` — thường trỏ cùng chỗ `feature_loop.ui_standards_skill`) + `route:` proto trong host + `dev_flag:` cờ dev. VẮNG → repo chưa có đường nhúng rẻ: phiên đi nấc thấp (`static-frame`/`standalone`+cảnh) + thẻ Cổng 1 cờ vàng, KHÔNG chặn. Khoá CÓ mà con trỏ không giải được → thẻ cờ vàng nêu tên con trỏ hỏng, cũng không chặn. |
```

(c) Template trong marker: sau dòng `material: <real-components|scaffold|static>` thêm 2 dòng frontmatter; sau section `## Ma trận capture` thêm section body:

```markdown
context: <standalone|static-frame|host-embedded>
context_scenes: [<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]
```

```markdown
## Cảnh ngữ-cảnh

- <file cảnh — khung host thật dạng tĩnh bọc vật + storyboard vào–ra; standalone mà bỏ cảnh ⇒ entry sổ quyết định bắt đầu đúng chuỗi "bỏ cảnh ngữ-cảnh — <lý do 1 dòng>">
```

(d) Bảng Degrade thêm 2 hàng:

```markdown
| `design_pass.host_embed` vắng | Nấc thấp + cờ vàng trên thẻ Cổng 1. Không chặn. |
| `standalone` thiếu cảnh ngữ-cảnh | Entry descope đúng khuôn (mục 5) hoặc thẻ cờ vàng — không có đường bỏ im lặng. |
```

- [ ] **Step 4: Chạy suite — P134 XANH và P72–P81 vẫn XANH**: `bash tests/plugins/run-tests.sh`
- [ ] **Step 5: Commit** `git add skills/design-pass/SKILL.md tests/plugins/run-tests.sh && git commit -m "feat(context-ladder): writer — khoá context 3 nấc + giai đoạn 0 + luật cảnh ngữ-cảnh (AC-1/2/3, E1-E3)"`

### Task 2: Reader — gate-card.js render nấc + 4 cờ vàng

**Files:**
- Modify: `scripts/gate-card.js` (khu Gate 1, quanh dòng 180–240)
- Test: `tests/plugins/run-tests.sh` (case P135–P138)

**Interfaces:**
- Consumes: khuôn template Task 1 (rút bằng regex marker); `readLedger`/`decsAll` sẵn có trong gate-card.js (dòng 109–134); helper `read()` cap 1MB sẵn có.
- Produces: hàm nội bộ `readDesignPass(dir)` → `{present, material, context, scenes, raw}`; `readHostEmbed(root)` → `{present, guide, resolvable}`; hằng `CONTEXT_LABEL`; chuỗi descope `DP_SCENE_DESCOPE = 'bỏ cảnh ngữ-cảnh — '`; block card `Bản mẫu & ngữ cảnh` + flags; EXTRACT JSON thêm key `design_pass`.

- [ ] **Step 1: Viết case P135–P138 (đỏ trước).** Mẫu chung: python rút template từ SKILL.md, điền giá trị, ghi `design-pass.md` vào workspace fixture tạm (code sinh dưới `$(mktemp -d)`), dựng `_acceptance/config.yaml` fixture tối thiểu, chạy `node scripts/gate-card.js --root <fixdir> --slug fx` THẬT, assert đầu ra HTML:

```bash
run "P135 context-ladder round-trip: khuon writer -> the render nhan tieng nguoi (E5)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
LABELS = {"standalone": "đứng một mình", "static-frame": "khung giả tĩnh", "host-embedded": "nhúng host thật"}
def mkfix(ctx, scenes):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (ws / "contract.md").write_text("---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "http://localhost:3000/proto/fx")
          .replace("<real-components|scaffold|static>", "scaffold")
          .replace("<standalone|static-frame|host-embedded>", ctx)
          .replace("[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]", scenes)
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "shadcn-default")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "1")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "default--mobile-375")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y")
          .replace("<file cảnh — khung host thật dạng tĩnh bọc vật + storyboard vào–ra; standalone mà bỏ cảnh ⇒ entry sổ quyết định bắt đầu đúng chuỗi \"bỏ cảnh ngữ-cảnh — <lý do 1 dòng>\">", "canh-1"))
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode}: {r.stderr}"
    return r.stdout
for ctx, label in LABELS.items():
    out = render(mkfix(ctx, "[evidence/design-pass/ctx.png]"))
    assert label in out, f"the khong render nhan '{label}' cho {ctx}"
PY
```

P136 (E6 — cờ vàng standalone thiếu cảnh, 3 nhánh cùng dùng `mkfix`-từ-writer):
- nhánh thiếu: `ctx=standalone`, `scenes=[]`, không ledger → assert HTML chứa cờ đúng thông điệp `standalone chưa có cảnh ngữ-cảnh` (chuỗi pin cuối cùng lấy từ implementation, ghi vào case khi viết);
- đối chứng dương (a): `scenes=[evidence/design-pass/ctx.png]` → KHÔNG chứa cờ;
- đối chứng dương (b): `scenes=[]` + ghi `decisions.jsonl` 1 dòng `{"id":"d-1","type":"descope","decision":"bỏ cảnh ngữ-cảnh — proto chạy trong host thật rồi"}` → KHÔNG chứa cờ (nhánh này đồng thời là mutation-detector: reader mù ledger sẽ cờ oan → case đỏ).

P137 (E7 — đường đọc-cũ + giá trị lạ):
- fixture KHUÔN CŨ: lấy fx của P135 rồi XOÁ 2 dòng `context*` (mô phỏng sổ phiên đời trước) → exit 0 + cờ `chưa khai nấc ngữ cảnh`;
- `ctx=embedded-lite` → exit 0 + cờ chứa nguyên văn `embedded-lite`;
- đối chứng dương: `ctx=host-embedded` → không cờ nào trong hai loại trên.

P138 (E4 — socket host_embed):
- config KHÔNG có `design_pass.host_embed` + có design-pass.md → exit 0 + cờ `chưa khai đường nhúng` (pin chuỗi thật khi viết);
- config CÓ `design_pass:\n  host_embed:\n    guide: docs/khong-ton-tai.md\n    route: /proto\n    dev_flag: DEV=1` → cờ nêu nguyên văn `docs/khong-ton-tai.md`;
- đối chứng dương: `guide:` trỏ file CÓ THẬT (code sinh file trong fixture) → không cờ nào trong hai loại trên;
- kiểm SKILL: bảng preflight có hàng `design_pass.host_embed` (đã có từ Task 1, assert lại quan hệ writer-docs ↔ reader-hành-vi).

- [ ] **Step 2: Chạy suite — P135–P138 ĐỎ** (gate-card chưa biết design-pass.md).
- [ ] **Step 3: Sửa `scripts/gate-card.js`** — trong khối `if (gate === '1')`, sau phần covGaps (dòng ~180):

```js
  // ---- design-pass context (context-ladder) — chỉ hiện khi phiên S1-D đã chạy
  const CONTEXT_LABEL = { 'standalone': 'đứng một mình', 'static-frame': 'khung giả tĩnh', 'host-embedded': 'nhúng host thật' };
  const DP_SCENE_DESCOPE = 'bỏ cảnh ngữ-cảnh — ';
  const dpText = read(path.join(dir, 'design-pass.md'));
  const dp = { present: !!dpText.trim(), material: '', context: '', scenes: [] };
  if (dp.present) {
    const fmm = dpText.match(/^---\n([\s\S]*?)\n---/);
    for (const ln of (fmm ? fmm[1].split('\n') : [])) {
      const kv = ln.match(/^(\w[\w_]*):\s*(.*)$/);
      if (!kv) continue;
      if (kv[1] === 'material') dp.material = kv[2].trim();
      if (kv[1] === 'context') dp.context = kv[2].trim();
      if (kv[1] === 'context_scenes') dp.scenes = kv[2].replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(s => s && !/^</.test(s));
    }
  }
  // host_embed socket — parse block design_pass: trong config.yaml (đường đọc-cũ: vắng = hợp lệ)
  const cfgText = read(path.join(root, '_acceptance', 'config.yaml'));
  const he = { present: false, guide: '', resolvable: true };
  { const bm = cfgText.match(/^design_pass:\n((?:[ \t]+.*\n?)*)/m);
    if (bm && /^[ \t]+host_embed:/m.test(bm[1])) {
      he.present = true;
      const g = bm[1].match(/^[ \t]+guide:\s*(.+)$/m);
      if (g) { he.guide = g[1].trim().replace(/^["']|["']$/g, '');
        if (he.guide.includes('/') || /\.md$/.test(he.guide)) he.resolvable = fs.existsSync(path.join(root, he.guide));
        else if (!he.guide.includes(':')) he.resolvable = fs.existsSync(path.join(root, '.claude', 'skills', he.guide, 'SKILL.md'));
      }
    } }
  const dpFlags = [];
  if (dp.present) {
    if (!dp.context) dpFlags.push('Sổ phiên chưa khai nấc ngữ cảnh (đời trước trục ngữ cảnh) — bản mẫu sống ở đâu chưa được khai; không chặn, khuyên bổ sung ở phiên sau.');
    else if (!CONTEXT_LABEL[dp.context]) dpFlags.push('Nấc ngữ cảnh không nhận diện được: "' + dp.context + '" — chỉ nhận standalone / static-frame / host-embedded.');
    else if (dp.context === 'standalone' && !dp.scenes.length && !decsAll.some(e => e.type === 'descope' && String(e.decision || '').startsWith(DP_SCENE_DESCOPE))) {
      dpFlags.push('Bản mẫu đứng một mình mà standalone chưa có cảnh ngữ-cảnh (khung host bọc vật + hành trình vào–ra) và không có dòng từ-chối trong sổ quyết định — người duyệt có quyền trả.');
    }
    if (!he.present) dpFlags.push('Repo chưa khai đường nhúng (design_pass.host_embed) — phiên coi như chưa có đường nhúng rẻ, đi nấc thấp; không chặn.');
    else if (!he.resolvable) dpFlags.push('Đường nhúng đã khai nhưng con trỏ không giải được: "' + he.guide + '" — sửa con trỏ hoặc phiên sẽ đi nấc thấp; không chặn.');
  }
```

Render block (sau khối Độ phủ AC, trước gap-probe) + flags loại `fwarn` vào mảng `flags` sẵn có; EXTRACT JSON thêm `design_pass: dp.present ? { material: dp.material, context: dp.context, context_label: CONTEXT_LABEL[dp.context] || null, scenes: dp.scenes, host_embed: he, flags: dpFlags } : { present: false }`:

```js
  if (dp.present) P.push(`<div class="lab">Bản mẫu &amp; ngữ cảnh</div><div class="grp gnot"><p class="li">Vật liệu: ${esc(dp.material || '(chưa khai)')} · sống ở: <b>${esc(CONTEXT_LABEL[dp.context] || dp.context || '(chưa khai)')}</b>${dp.scenes.length ? ' · ' + dp.scenes.length + ' cảnh ngữ-cảnh' : ''}</p></div>`);
  for (const f of dpFlags) flags.push(['fwarn', f]);
```

(`fs` đã require sẵn dòng 30; chuỗi cờ ở trên là CHUỖI PIN — case P136/P137/P138 ghim đúng các câu này.)

- [ ] **Step 4: Chạy suite — P135–P138 XANH, khu cũ (P52/P58/P68…) vẫn XANH.**
- [ ] **Step 5: Commit** `git add scripts/gate-card.js tests/plugins/run-tests.sh && git commit -m "feat(context-ladder): reader — thẻ Cổng 1 render nấc + 4 cờ vàng (AC-4/5/6/7, E4-E7)"`

### Task 3: Generic — fixture repo-lạ code-sinh + grep-guard

**Files:**
- Test: `tests/plugins/run-tests.sh` (case P139)

**Interfaces:**
- Consumes: `mkfix`/`render` pattern của P135 (lặp lại trong case — mỗi case tự chứa), template marker Task 1, chuỗi cờ pin Task 2.

- [ ] **Step 1: Viết case P139.** Fixture = repo web-app trơn DO CODE SINH: `mktemp -d` + `package.json` (`{"name":"plain-webapp"}`) + `src/app.js` + `_acceptance/config.yaml` KHÔNG có design_pass + workspace `fx-web` với design-pass.md rút từ template (context lần lượt: `host-embedded` hợp lệ → nhãn render; `standalone` không cảnh → cờ; khuôn-cũ → cờ đọc-cũ). Assert cả ba phân biệt đúng trên fixture này. Grep-guard có sanity counter:

```python
import re
srcs = { p: (root / p).read_text(encoding="utf-8") for p in
         ["skills/design-pass/SKILL.md", "scripts/gate-card.js"] }
rt_region = ...  # vùng P134-P141 của run-tests.sh, cắt theo marker ghép mảnh
srcs["tests:context-ladder-region"] = rt_region
BAD = ["Creator", "canvas", "OneHub"]
def guard(texts):
    errs = []
    for name, txt in texts.items():
        for w in BAD:
            if w in txt: errs.append(f"tu vung host '{w}' lot vao {name}")
    return errs
assert guard(srcs) == [], guard(srcs)
# DOI CHUNG DUONG cua guard: tiem "Creator" vao BAN SAO phai DO dung thong diep
mut = dict(srcs); mut["skills/design-pass/SKILL.md"] += "\nCreator"
assert any("tu vung host 'Creator'" in e for e in guard(mut)), "guard khong do khi tiem tu vung host"
```

(chuỗi BAD ghép trong case bằng `"Crea"+"tor"` v.v. để chính guard không tự khớp source của nó — mẫu marker-ghép-mảnh P80.)

- [ ] **Step 2: Chạy — P139 XANH** (đối chứng âm nội tại đã nằm trong case). **Commit** `git add tests/plugins/run-tests.sh && git commit -m "test(context-ladder): fixture repo-lạ code-sinh + grep-guard từ vựng host (AC-8, E8)"`

### Task 4: Wiring — feature-loop S1-D checklist + resume-guard

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (đoạn "Nghi thức S1-D")
- Test: `tests/plugins/run-tests.sh` (case P140)

- [ ] **Step 1: Viết case P140 (đỏ trước):** check hàm kiểu P134: SKILL feature-loop nguồn phải chứa (i) chuỗi checklist `ma trận capture + findings + nấc ngữ cảnh đã khai`; (ii) chuỗi resume `resume` gần `context:` trong cùng đoạn S1-D (assert đoạn "Nghi thức S1-D" chứa cả ` context:` lẫn `resume`); mutation xoá cụm `nấc ngữ cảnh đã khai` → đỏ đúng thông điệp; đối chứng dương trước.
- [ ] **Step 2: Sửa SKILL.md** — trong đoạn "**Nghi thức S1-D**", sau câu "Chọn chạy = entry `type:"approach"` như mọi quyết định lane.", thêm:

```markdown
Kết phiên S1-D phải đủ 3 mục: ma trận capture + findings + nấc ngữ cảnh đã khai (khoá `context:` trong `design-pass.md` — thẻ Cổng 1 render nấc này, `standalone` thiếu cảnh ngữ-cảnh sẽ cờ vàng). Khi resume vào workspace có `design-pass.md`, đọc khoá `context:`; thiếu (sổ phiên đời trước) → thẻ cờ vàng đường đọc-cũ, KHÔNG chặn, không bắt migrate.
```

- [ ] **Step 3: Suite xanh (P140 + toàn khu). Commit** `git add feature-loop/skills/feature-loop/SKILL.md tests/plugins/run-tests.sh && git commit -m "feat(context-ladder): wiring S1-D checklist + resume-guard đọc context (AC-9, E9)"`

### Task 5: Docs — amendment §2.2 + CONTEXT.md term + GUIDE

**Files:**
- Modify: `docs/specs/workflow-v2-spec.md` (§2.2, sau khối "Bổ sung 02/08"), `CONTEXT.md` (section Language), `GUIDE.md` (hàng S1-D dòng ~398)
- Test: `tests/plugins/run-tests.sh` (case P141)

- [ ] **Step 1: Viết case P141 (đỏ trước):** spec v2 phải chứa cả chuỗi `Bổ sung 04/08 — trục ngữ cảnh` LẪN `2026-08-04-context-ladder-design.md`; CONTEXT.md phải chứa `Nấc ngữ cảnh` và `Cảnh ngữ-cảnh`; mutation xoá đoạn amendment → đỏ "spec v2 thieu amendment truc ngu canh"; mutation xoá term → đỏ "CONTEXT.md thieu term"; đối chứng dương trước.
- [ ] **Step 2: Sửa docs.** workflow-v2-spec.md — chèn sau khối 4 mục "Bổ sung 02/08", trước đoạn "Đường E":

```markdown
  **Bổ sung 04/08 — trục ngữ cảnh:** sổ phiên khai thêm nấc ngữ cảnh
  `context: standalone | static-frame | host-embedded` (chiều thứ hai độc
  lập với thang vật liệu — VẬT là gì ⟂ VẬT SỐNG Ở ĐÂU); `standalone` trước
  Cổng Phạm-vi phải kèm ≥1 cảnh ngữ-cảnh hoặc descope có tên; ổ cắm
  `design_pass.host_embed` cấp đường-nhúng-rẻ per-repo (vắng = nấc thấp +
  cờ vàng, không chặn); thẻ Cổng Phạm-vi render nấc bằng tiếng người. Chi
  tiết: `docs/specs/2026-08-04-context-ladder-design.md`.
```

CONTEXT.md — 2 term vào section Language (theo giọng term hiện có):

```markdown
**Nấc ngữ cảnh (context:)**:
Khoá `context:` trong sổ phiên design-pass — chỗ bản mẫu sống, 3 nấc:
`standalone` (đứng một mình) / `static-frame` (khung giả tĩnh) /
`host-embedded` (nhúng host thật). Chiều thứ hai độc lập với thang vật liệu
(`material:`): vật là gì ⟂ vật sống ở đâu.
_Avoid_: environment, embed mode, host mode.

**Cảnh ngữ-cảnh**:
Bằng chứng đi kèm bản mẫu `standalone`: khung host thật dạng tĩnh bọc vật +
storyboard hành trình vào–ra, liệt trong khoá `context_scenes:`. Thiếu nó mà
không có entry descope `bỏ cảnh ngữ-cảnh — ` là cờ vàng trên thẻ Cổng 1.
_Avoid_: mockup ngữ cảnh, screenshot host.
```

GUIDE.md — hàng S1-D (dòng ~398) nối thêm vào cột nội dung: `; khai nấc ngữ cảnh (context: 3 nấc — standalone cần cảnh ngữ-cảnh hoặc descope có tên trước Cổng 1)`.

- [ ] **Step 3: Suite xanh. Commit** `git add docs/specs/workflow-v2-spec.md CONTEXT.md GUIDE.md tests/plugins/run-tests.sh && git commit -m "docs(context-ladder): amendment §2.2 + term CONTEXT.md + GUIDE (E13)"`

### Task 6: Mirror + toàn suite + chốt implemented

**Files:**
- Modify: `plugins/**` (máy sinh), `_acceptance/context-ladder/contract.md` (status)

- [ ] **Step 1: Sync mirror:** `bash scripts/sync-plugin-packages.sh` rồi `bash scripts/sync-plugin-packages.sh --check` (exit 0).
- [ ] **Step 2: Toàn bộ verify per-task lần cuối:** `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh && node scripts/eval-coverage-lint.js . && node scripts/product-map.mjs --root . --check`
- [ ] **Step 3: Commit mirror CÙNG LƯỢT:** `git add plugins/ && git commit -m "build(context-ladder): sync plugins mirror"` (chỉ mirror — nguồn đã commit ở task trước; nếu sync đổi cả file khác thì add đích danh từng file, KHÔNG dùng -A).
- [ ] **Step 4: Set contract `status: implemented`** rồi dispatch S4 (feature-loop lo, ngoài plan này).

## Bảng eval ↔ task

| Eval | Task | | Eval | Task |
|---|---|---|---|---|
| E1-E3 (writer) | 1 | | E8 (generic) | 3 |
| E4 (socket, 2 phía) | 1+2 | | E9 (wiring) | 4 |
| E5-E7 (reader) | 2 | | E13 (docs-pin) | 5 |
| E10/E14/E15/E16 (suites) | 6 | | E11 (mirror), E12 (lint) | 6 |

**Independent:** mọi task `independent: false` — Task 1→2→3 là chuỗi phụ thuộc khuôn; Task 4/5 độc lập về nghĩa nhưng cùng append `tests/plugins/run-tests.sh` với chuỗi kia (fan-out worktree sẽ conflict đúng file đó) → chạy tuần tự.
