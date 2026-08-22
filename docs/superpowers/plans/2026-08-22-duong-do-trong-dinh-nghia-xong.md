# Đường đo trong định-nghĩa-xong — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Contract có ô `## Đường đo` khi hồ sơ có ngưỡng; thẻ Cổng Phạm vi cờ vàng khi thiếu / info khi bỏ có tên / im lặng khi vòng không có cơ hội; gap-probe có một dòng cross-check; term vào CONTEXT.md.

**Architecture:** Một khối marker `CONTRACT-DUONG-DO-TEMPLATE` trong `contract-template.md` là nguồn heading + tiền tố bỏ; `scripts/gate-card.js` ghim hai hằng cùng chuỗi và tính `duong_do {applicable, present, lines, descoped}` từ đúng vị từ `ut` sẵn có; hai câu trong `feature-loop/skills/feature-loop/SKILL.md`; một term trong `CONTEXT.md`; file ca riêng `tests/plugins/duong-do.test.mjs` (DD1–DD7) chạy gate-card THẬT trên fixture code-sinh từ hai khuôn.

**Tech Stack:** Node (CJS gate-card.js, ESM test), bash suite `tests/plugins/run-tests.sh`, `tests/fixtures/from-template.mjs`, `lib/md-section.cjs` (chỉ dùng, không sửa).

**Spec:** `docs/superpowers/specs/2026-08-22-duong-do-trong-dinh-nghia-xong-design.md` · hợp đồng `_acceptance/duong-do-trong-dinh-nghia-xong/contract.md`.

## Global Constraints

- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, `skills/uat-session/**`.
- Heading `Đường đo` và tiền tố `bỏ đường-đo — ` chỉ gõ ở: khuôn (nguồn), gate-card (hằng), SKILL (auto-draft) — test rút từ nguồn, KHÔNG literal.
- Mọi ca: đối chứng dương + chiều đỏ ghim thông điệp; fixture code-sinh; đường dẫn suy từ vị trí file; chốt `PASS: [DDn]`.

---

### Task 1: khuôn contract — khối `CONTRACT-DUONG-DO-TEMPLATE`

**Files:** Modify `skills/acceptance/references/contract-template.md` (sau `## Coverage`, trước `## Out of scope`).

- [ ] **Step 1:** chèn:

```markdown
<!-- <<<CONTRACT-DUONG-DO-TEMPLATE -->
## Đường đo

{{CHỈ khi hồ sơ có `opportunity.md` với ngưỡng đã khai (vòng đi từ Cổng Đáng). Mỗi thước
đã khai một dòng — thước · con số đến từ đâu trong sản phẩm · AC nào bảo đảm nó tồn tại
(hoặc «đã có sẵn: <nguồn>»). Đường đo là VẬT: phải viết code mới thì biến nó thành một AC
bình thường rồi trỏ tới. Vòng không có hồ sơ cơ hội: xoá section này. Hồ sơ có ngưỡng mà
thiếu section = cờ vàng trên thẻ Cổng Phạm vi (không chặn); bỏ thì ghi đúng dòng bỏ dưới
đây VÀ entry `descope` cùng tiền tố trong decisions.jsonl — dòng bỏ không phải đường đo.}}

- Thước: {{tên thước}} · số từ: {{event / counter / truy vấn / bảng đếm}} · bảo đảm bởi: {{AC-n | đã có sẵn: nguồn}}
- {{... | "bỏ đường-đo — <lý do 1 dòng> (entry d-...)"}}
<!-- CONTRACT-DUONG-DO-TEMPLATE>>> -->
```

- [ ] **Step 2:** đổi dòng trong contract của chính hồ sơ: `- Bỏ đường-đo — …` → `- bỏ đường-đo — …` (khớp tiền tố nguyên văn).
- [ ] **Step 3:** Commit `feat(contract-template): section Đường đo — khối marker CONTRACT-DUONG-DO-TEMPLATE`.

### Task 2: `scripts/gate-card.js` — `duong_do` + khối + cờ

**Files:** Modify `scripts/gate-card.js` (sau khối `ut`, trước `if (EXTRACT)`; thêm vào EXTRACT; khối HTML sau Coverage; cờ sau cờ `ut`).

**Interfaces:** `--extract` thêm `duong_do: {applicable:boolean, present:boolean, lines:string[], descoped:string|null}`.

- [ ] **Step 1:** sau khối `ut` thêm:

```js
  // ---- đường đo (contract `## Đường đo` — chỉ có nghĩa khi hồ sơ có ngưỡng đã khai) ----
  // Heading + tiền tố bỏ là CHUỖI PIN round-trip với khối CONTRACT-DUONG-DO-TEMPLATE của khuôn
  // (DD5) và câu auto-draft trong feature-loop SKILL S1#4 (DD6). «Áp dụng» = ĐÚNG vị từ ut ở trên
  // (khối «Ngưỡng nghiệm thu» in ⇔ applicable) — không viết vị từ thứ hai (d-4303).
  const DUONG_DO_HEADING = 'Đường đo';
  const DUONG_DO_DESCOPE = 'bỏ đường-đo — ';
  const ddStem = DUONG_DO_DESCOPE.replace(/\s*—\s*$/, '').toLowerCase();
  const ddIsBoLine = l => l.trim().toLowerCase().startsWith(ddStem);
  const ddApplicable = ut.opportunity_present && ut.readable && ut.section_present && ut.lines.length > 0;
  const ddPresent = new RegExp('^#{2,6}\\s+' + DUONG_DO_HEADING + '\\b', 'im').test(contract);
  // dòng thật = bullet không còn placeholder VÀ không phải dòng bỏ (dòng bỏ không phải đường đo — gap-probe F2)
  const ddLines = ddPresent ? bullets(section(contract, DUONG_DO_HEADING)).filter(l => !/\{\{/.test(l) && !ddIsBoLine(l)) : [];
  const ddDescope = decsAll.find(e => e.type === 'descope' && String(e.decision || '').startsWith(DUONG_DO_DESCOPE)) || null;
```

- [ ] **Step 2:** EXTRACT thêm `duong_do: { applicable: ddApplicable, present: ddPresent, lines: ddLines, descoped: ddDescope ? ddDescope.id : null }` (đặt sau `uat_threshold: ut`).
- [ ] **Step 3:** HTML: ngay sau dòng `if (covLines.length) P.push(...)`:

```js
  if (ddLines.length) P.push(`<div class="lab">Đường đo (con số cho ngưỡng sẽ đến từ đâu)</div><div class="grp gnot">${ddLines.map(t => `<p class="li">${esc(stripMd(t))}</p>`).join('')}</div>`);
```

- [ ] **Step 4:** cờ, ngay sau ba cờ `ut`:

```js
  if (ddApplicable && !ddLines.length) {
    if (ddDescope) flags.push(['finfo', `Đã bỏ đường đo theo ${esc(ddDescope.id || 'entry descope')} — Cổng Giá trị sẽ đọc ngưỡng với ô CHƯA ĐO; quyết định chủ động, có dấu vết.`]);
    else flags.push(['fwarn', 'Hồ sơ cơ hội có ngưỡng nhưng contract chưa có đường đo — không ai xây thứ sinh ra con số, Cổng Giá trị sẽ đọc bảng toàn CHƯA ĐO. Thêm section «Đường đo» (mỗi thước một dòng: số từ đâu · AC nào bảo đảm) hoặc ghi entry «bỏ đường-đo — <lý do>» rồi hãy duyệt.']);
  }
```

- [ ] **Step 5:** `node scripts/gate-card.js --root . --slug duong-do-trong-dinh-nghia-xong --extract | grep -o '"duong_do":{[^}]*}'` → `applicable:false` (stub kit còn `…`), `descoped:"d-…-4306"`.
- [ ] **Step 6:** Commit `feat(gate-card): khối + cờ Đường đo, duong_do trong --extract`.

### Task 3: SKILL.md + CONTEXT.md

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (S1#4 bullet contract; S1#7 câu Input và ý (4)); Modify `CONTEXT.md` (mục `### Evidence vocabulary`).

- [ ] **Step 1 (S1#4):** cuối bullet `` `_acceptance/<slug>/contract.md` `` (trước dấu `)` đóng) thêm: `; section \`## Đường đo\` khi hồ sơ có \`opportunity.md\` với ngưỡng đã khai (mỗi thước một dòng: số từ đâu · AC nào bảo đảm — đường đo là VẬT, code mới thì thành một AC); bỏ thì entry \`descope\` AUTO-DRAFT với decision bắt đầu đúng chuỗi \`"bỏ đường-đo — <lý do 1 dòng>"\` + impact "Cổng Giá trị sẽ đọc bảng ngưỡng với ô CHƯA ĐO — quyết release/iterate/kill mất căn cứ số"`.
- [ ] **Step 2 (S1#7 input):** sau `CỘNG file claims làm input thứ 5 khi bước claim-scan ở trên có claim` thêm `, CỘNG \`_acceptance/<slug>/opportunity.md\` làm input thứ 6 khi file tồn tại (để cross-check ngưỡng ↔ đường đo)`.
- [ ] **Step 3 (S1#7 ý 4):** sau `artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không` thêm ` · ngưỡng nào ở \`opportunity.md\` không có đường đo nào trong contract (section \`## Đường đo\` hoặc entry bỏ có tên)`.
- [ ] **Step 4 (CONTEXT.md):** đầu mục `### Evidence vocabulary` thêm:

```markdown
**Đường đo**:
Thứ trong sản phẩm sinh ra con số cho một thước đã khai — event, counter, truy
vấn, bảng đếm. Khác **thước** (đo cái gì), **ngưỡng** (bao nhiêu là SỐNG) và
**số đo** (con số thật đặt cạnh ngưỡng ở Cổng Giá trị). Khai ở contract
`## Đường đo`, chỉ khi vòng có hồ sơ cơ hội với ngưỡng (22/08).
_Avoid_: tracking, analytics, metric (metric là *thước*, không phải đường).
```

- [ ] **Step 5:** Commit `docs(feature-loop,CONTEXT): đường đo — S1#4 ô + cửa bỏ, S1#7 cross-check + input 6, term`.

### Task 4: `tests/plugins/duong-do.test.mjs` DD1–DD7 + nối suite

**Files:** Create `tests/plugins/duong-do.test.mjs`; Modify `tests/plugins/run-tests.sh` (vòng `_dd_ids` sau vòng VC).

**Helpers:** `ROOT` suy từ file; `CONTRACT_TPL`, `OPP_TPL`, `GATE_CARD`, `SKILL`, `CONTEXT`; `blockOf(text, marker)`; `ddBlock()` = khối CONTRACT-DUONG-DO-TEMPLATE (bỏ dòng marker); `ddSection(kind)` với `kind ∈ {real, placeholder, bo, none}` — `real`: heading + bullet 1 với `{{…}}`→giá trị thật; `placeholder`: heading + hai bullet nguyên; `bo`: heading + dòng rút từ mẫu `"bỏ … (entry d-...)"` thay `<lý do 1 dòng>`→`test`, `d-...`→`d-1`; `contractOf(kind)` = `fileFromTemplate(CONTRACT_TPL,'CONTRACT-FRONTMATTER-TEMPLATE',{…status:'draft'})` + Criteria + Coverage + ddSection + Out of scope; `oppOf(mode)` (`filled`|`dots`|`one`) = `fileFromTemplate(OPP_TPL,'OPP-FRONTMATTER-TEMPLATE',{stage:'discovery',…})` + section Ngưỡng rút từ khuôn (điền hết / giữ `…` / điền 1 dòng); `ws({contract, opp, decisions})` dựng `tmp/_acceptance/{config.yaml,x/…}`; `card(root)` → `{json: --extract, html}`; `flagsOf(html)` = mảng `{cls,text}` từ `<div class="flag (fwarn|finfo|fok)">`; `hasLab(html,'Đường đo')`, `hasLab(html,'Ngưỡng nghiệm thu')`; `assertRel(j, html)` = `j.duong_do.applicable === hasLab(html,'Ngưỡng nghiệm thu')` (chạy ở mọi fixture DD1–DD4); `ddFlags(html)` = flags có /đường đo/i.
**Hằng rút từ nguồn:** `HEADING = /DUONG_DO_HEADING = '([^']+)'/` và `DESCOPE = /DUONG_DO_DESCOPE = '([^']+)'/` trên `gate-card.js` (test không gõ literal).

- [ ] DD1 (R+): `ws(real, filled)` → `duong_do` deep-equal `{applicable:true, present:true, lines:[<dòng>], descoped:null}`; `hasLab('Đường đo')`; `ddFlags.length===0`; `assertRel`; biên `ws(real, one)` → `applicable:true`, `hasLab('Ngưỡng nghiệm thu')`.
- [ ] DD2 (R−): (a) `ws(none, filled)` → `present:false, lines:[]`, đúng 1 `fwarn` khớp /chưa có đường đo/ và chứa cả «section» lẫn tiền tố DESCOPE; không lab; `assertRel`. (b) `ws(placeholder, filled)` → `present:true, lines:[]`, cùng cờ. (c) `ws(bo, filled)` không entry → `present:true, lines:[]`, cùng cờ.
- [ ] DD3 (R0): (a) `ws(real, null)` → `applicable:false`, `!hasLab('Ngưỡng nghiệm thu')`, `ddFlags.length===0`, `hasLab('Đường đo')` (khối vẫn in). (b) `ws(real, dots)` → như (a). `assertRel` cả hai.
- [ ] DD4 (RK): entry `{"id":"d-1","type":"descope","decision": DESCOPE + "test","impact":"x"}` với (a) `ws(none, filled, entry)` và (d) `ws(bo, filled, entry)` → `descoped:'d-1'`, `lines:[]`, `!hasLab('Đường đo')`, đúng 1 `finfo` khớp /Đã bỏ đường đo theo d-1/ và /CHƯA ĐO/, 0 `fwarn` chứa /đường đo/i. Seam: decision `'bỏ đường đo — test'` (không gạch nối) và `type:'approach'` → `descoped:null` + 1 fwarn. `assertRel`.
- [ ] DD5 (round-trip khuôn): khối tồn tại; dòng đầu khối `## X` → `X === HEADING`; mẫu bỏ `/"(bỏ [^"<]+?— )<lý do/` → `=== DESCOPE`; dòng mẫu bullet chứa `Thước:` và `bảo đảm bởi:`; bản sao khuôn đổi heading → hàm so trả lỗi nêu cả hai chuỗi (assert).
- [ ] DD6 (SKILL): cắt phạm vi: `s14` = từ `` - `_acceptance/<slug>/contract.md` `` tới `\n   - ` kế; `s17` = dòng chứa `Phản biện context sạch (gap-probe)`; `y4` = trong `s17` từ `(4) cross-check` tới `(5)`. MATRIX 6: [① `s14` đếm `## Đường đo` ==1] [② `s14` đếm `` `opportunity.md` với ngưỡng `` ==1] [③ `s14` rút `/bắt đầu đúng chuỗi `"([^"]+?)<lý do/` === DESCOPE] [④ `s14` đếm `CHƯA ĐO` ==1] [⑤ `y4` đếm `không có đường đo nào trong contract` ==1] [⑥ `s17` đếm `` `opportunity.md` làm input thứ 6 `` ==1]. Reader = hàm `checkSkill(text)` trả mảng lỗi; chạy trên bản thật (rỗng) và trên 6 bản sao mỗi bản gỡ một mệnh đề → assert lỗi nêu đúng ①…⑥; bản sao đổi tiền tố → lỗi nêu hai chuỗi.
- [ ] DD7 (CONTEXT): `section(CONTEXT, 'Evidence vocabulary')` chứa dòng `**Đường đo**:`; trong 6 dòng sau có `thước`, `ngưỡng`, `số đo`; dòng `_Avoid_` chứa `tracking` và `metric`; bản sao gỡ term → đỏ.
- [ ] Đuôi file + `--ids` + `DD_CASES` như file VC. Nối suite:

```bash
# ─── Hồ sơ duong-do-trong-dinh-nghia-xong: DD1..DD7 (file ca riêng) ───────────
_dd_ids="$(node "$ROOT/tests/plugins/duong-do.test.mjs" --ids)" || { echo "khong lay duoc danh sach ca DD"; failures=$((failures+1)); _dd_ids=""; }
for _dd in $_dd_ids; do
  run "ca duong do — $_dd (ho so duong-do-trong-dinh-nghia-xong)" \
    env DD_CASES="$_dd" node "$ROOT/tests/plugins/duong-do.test.mjs"
done
```

- [ ] Chạy `node tests/plugins/duong-do.test.mjs` → 7 PASS; phá thử: đổi `!ddIsBoLine(l)` thành `true` trong bản sao → DD2(c)/DD4(d) đỏ.
- [ ] Commit `test(duong-do): DD1–DD7 — fixture từ hai khuôn, gate-card thật, ma trận R+/R−/R0/RK`.

### Task 5: bốn suite + contract sang implemented

- [ ] 4 suite + `product-map --check` (contract status đổi → bản đồ: approved/implemented cùng ô «Đang làm», không cần vẽ lại).
- [ ] Sửa E6 `expected` «5 mệnh đề» → «6 mệnh đề». Contract `status: implemented`. Commit.
