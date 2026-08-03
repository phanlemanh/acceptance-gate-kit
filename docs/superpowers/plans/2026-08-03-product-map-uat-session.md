# PRODUCT-MAP + phiên nghiệm thu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repo tự sinh `PRODUCT-MAP.md` từ hồ sơ xưởng, có nghi thức phiên nghiệm thu ghi `uat-session.md` máy-đọc, và `/start` đọc được hai nguồn mới thay hai dòng skip-có-tên.

**Architecture:** Một script generic `scripts/product-map.mjs` (render thuần + `--check`) là nguồn duy nhất của bản đồ; `start-scan.mjs` import hàm `renderProductMap` của nó thay vì gọi child process. Khuôn frontmatter của mọi artifact điều hướng nằm trong marker ở `skills/acceptance/references/*`, và fixture test PHẢI rút từ marker đó (chống seam writer↔reader trôi). Nghi thức phiên là skill MỞ `skills/uat-session/`, chữ ký vẫn human-owned trong file.

**Tech Stack:** Node ESM (`node:fs`, `node:path`, `createRequire` để nạp `lib/evidence-core.js` CommonJS), bash + python3/node heredoc trong `tests/plugins/run-tests.sh`, rsync mirror qua `scripts/sync-plugin-packages.sh`.

## Global Constraints

- **Reader duy nhất:** mọi đọc frontmatter đi qua `frontmatterField` của `lib/evidence-core.js`. KHÔNG viết parser fence thứ hai (tiền lệ S4-r1 của start-command: parser riêng chặt hơn reader chuẩn → báo hỏng oan).
- **Đường dẫn suy từ vị trí script**, không hardcode ROOT: `path.dirname(fileURLToPath(import.meta.url))`.
- **Assertion âm-tính-một-mình là assertion không sống:** mọi case dựng bản sao rồi kết luận từ "exit khác 0" PHẢI có (a) đối chứng dương — bản nguyên vẹn XANH trước — và (b) ghim ĐÚNG thông điệp, không chỉ mã thoát.
- **Fixture do code sinh trong chính lần chạy**, rút từ khuôn canonical có marker; cấm test tự gõ frontmatter theo khuôn bên đọc.
- **Sửa nguồn xong phải chạy `bash scripts/sync-plugin-packages.sh`** và commit mirror `plugins/` cùng lượt (test P30-family chặn drift).
- **Ngôn ngữ mặt người** (`skills/acceptance/references/human-facing-language.md`, luật N1–N6) cho MỌI chữ trong `PRODUCT-MAP.md`, thông điệp `--check`, và dòng bản đồ trên thẻ `/start`. Mã máy chỉ trong ngoặc hoặc trong lệnh gợi ý.
- **Từ vựng CONTEXT.md:** dùng "bộ sinh"/"script", KHÔNG dùng "engine" (nằm trong `_Avoid_` của mục Executor).
- **Enum điều hướng** (ghim một chỗ trong `product-map.mjs`, start-scan dùng lại nghĩa):
  `status`: `draft|approved|implemented|verified|signed-off` · `stage`: `discovery|decided|archived` · `decision`: `build|iterate|park|kill` · `verdict` (uat): `release|iterate|kill`. Giá trị NGOÀI enum ⇒ Hồ sơ hỏng / `broken[]`, không bao giờ biến mất im lặng.
- Chạy test: `bash tests/plugins/run-tests.sh` (chậm ~30s, in `PASS:`/`FAIL:` từng case).

---

## File Structure

| File | Trách nhiệm |
|---|---|
| `skills/acceptance/references/uat-session-template.md` (create) | Khuôn hồ sơ phiên nghiệm thu; frontmatter máy-đọc trong marker `UAT-FRONTMATTER-TEMPLATE` |
| `skills/acceptance/references/contract-template.md` (modify) | Thêm marker `CONTRACT-FRONTMATTER-TEMPLATE` quanh khối frontmatter sẵn có |
| `tests/fixtures/from-template.mjs` (create) | Helper test: rút khối marker + điền placeholder → nội dung file fixture |
| `scripts/product-map.mjs` (create) | Bộ sinh bản đồ: đọc hồ sơ xưởng → render chuỗi; `--check`; export `renderProductMap` |
| `PRODUCT-MAP.md` (create, máy sinh) | Bản đồ của chính kit, commit cùng lượt |
| `skills/uat-session/SKILL.md` (create) | Nghi thức phiên nghiệm thu (Cổng Giá trị) |
| `scripts/start-scan.mjs` (modify) | Đọc `uat-session.md` + trạng thái bản đồ; bỏ 2 dòng skip |
| `commands/start.md`, `codex/acceptance-gate/skills/start/SKILL.md` (modify) | Marker START-SCAN-KEYS + dòng bản đồ trên thẻ |
| `commands/approve.md`, `commands/signoff.md`, `codex/.../approve/SKILL.md`, `codex/.../signoff/SKILL.md` (modify) | Bước làm mới bản đồ sau khi ghi field cổng |
| `docs/specs/2026-08-03-start-command-design.md` (modify) | Bảng phân ô + khuôn JSON: hàng/khoá mới |
| `_acceptance/config.yaml` (modify) | `executors.script.product_map` + `feature_loop.suite_keys` |
| `tests/plugins/run-tests.sh` (modify) | P102–P109 mới; P98 thêm hàng mới |
| `plugins/**` (generated) | Mirror, sinh bởi sync script |

Thứ tự phụ thuộc: T1 → T2 → T3 → T5 → T6 → T7. T4 (skill uat-session) chỉ cần T1. Chỉ MỘT task độc lập ⇒ S3 chạy TUẦN TỰ trong main loop, không dùng `execute-parallel`.

---

### Task 1: Khuôn canonical + helper sinh fixture

**Files:**
- Create: `skills/acceptance/references/uat-session-template.md`
- Modify: `skills/acceptance/references/contract-template.md` (bọc marker quanh khối frontmatter sau `---8<---`)
- Create: `tests/fixtures/from-template.mjs`
- Test: `tests/plugins/run-tests.sh` (case P102)

**Interfaces:**
- Produces: `tests/fixtures/from-template.mjs` export `blockFromTemplate(absPath, markerName)` → chuỗi YAML frontmatter nguyên khối (đã bóc fence ```` ```yaml ````) và `fillTemplate(block, values)` → chuỗi đã thay `{key}`; `fileFromTemplate(absPath, markerName, values, body)` → nội dung file hoàn chỉnh. Task 2/3/5 dùng cả ba để sinh fixture.
- Produces: marker names `UAT-FRONTMATTER-TEMPLATE`, `CONTRACT-FRONTMATTER-TEMPLATE`, (sẵn có) `OPP-FRONTMATTER-TEMPLATE`.

- [ ] **Step 1: Viết `skills/acceptance/references/uat-session-template.md`**

```markdown
# Phiên nghiệm thu — khuôn hồ sơ (Cổng Giá trị ký trên file này)

> Vị trí khi dùng: `_acceptance/<slug>/uat-session.md` của repo sản phẩm.
> Frontmatter là phần MÁY ĐỌC (`/start` và bản đồ sản phẩm đọc) — giữ nguyên
> tên khoá, chỉ thay giá trị. Xoá các dòng hướng dẫn `>` khi dùng thật.

<!-- <<<UAT-FRONTMATTER-TEMPLATE -->
```yaml
---
schema_version: 1
slug: {slug}
feature: {feature}
owner: {owner}
stage: {stage}              # scheduled | held
verdict: {verdict}          # release | iterate | kill — người ký Cổng Giá trị
                            # điền; để TRỐNG cho tới lúc ký
decided_by: {decided_by}
decided_at: {decided_at}    # ISO UTC
time_human_minutes:
  gateUAT: {gateUAT_minutes}
---
```
<!-- UAT-FRONTMATTER-TEMPLATE>>> -->

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

> Chép từ section "Ngưỡng chết / ngưỡng UAT" của `opportunity.md`. Từ lúc phiên
> bắt đầu, ngưỡng là hằng số. Muốn đổi phép đo: ghi `[SUPERSEDED <ngày>]` bên
> opportunity và GIỮ bản gốc — không sửa ở đây.

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …

## Người dự

| Tên | Vai | Đại diện cho ai |
|---|---|---|

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

> Thứ tự trong file này là vết: khối chấm kín phải điền xong mới mở khối thảo
> luận. Ai cũng chấm một mình, không nghe điểm của người khác trước.

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|

## Thảo luận sau khi đã chấm

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|

## Quyết định Cổng Giá trị

> `release` = giao rộng · `iterate` = giữ giả định, sửa rồi đo lại · `kill` =
> dừng. **Giết ở đây là THÀNH CÔNG của quy trình** — câu trả lời mua bằng giá
> một vòng dựng, không phải thất bại của người làm.

- **verdict = …** Căn cứ: …
- Bước kế: …
```

- [ ] **Step 2: Bọc marker quanh khối frontmatter của `contract-template.md`**

Chèn `<!-- <<<CONTRACT-FRONTMATTER-TEMPLATE -->` + mở fence ```` ```yaml ```` ngay TRƯỚC dòng `---` đầu tiên sau `---8<---`, và đóng fence + `<!-- CONTRACT-FRONTMATTER-TEMPLATE>>> -->` ngay SAU dòng `---` đóng frontmatter. Nội dung frontmatter GIỮ NGUYÊN, chỉ đổi `{{placeholder}}` thành `{placeholder}` một-ngoặc cho khớp `fillTemplate` (các placeholder khác trong phần thân template không đụng tới):

```markdown
---8<---
<!-- <<<CONTRACT-FRONTMATTER-TEMPLATE -->
```yaml
---
schema_version: 1
feature: {feature}
slug: {slug}
owner: {owner}
risk_tier: {risk_tier}
surfaces: [{surfaces}]
status: {status}
approved_by:
approved_at:
time_human_minutes: {gate1: 0, gate2: 0}
---
```
<!-- CONTRACT-FRONTMATTER-TEMPLATE>>> -->
```

Chú ý: `time_human_minutes: {gate1: 0, gate2: 0}` chứa dấu ngoặc nhọn nhưng KHÔNG phải placeholder — `fillTemplate` ở Step 3 chỉ thay khoá có trong `values`, nên dòng này đi qua nguyên vẹn.

- [ ] **Step 3: Viết `tests/fixtures/from-template.mjs`**

```js
// Helper test: fixture PHẢI rút từ khuôn canonical (marker trong references/),
// không được tự gõ frontmatter theo khuôn bên đọc — nếu khuôn viết trôi khỏi
// khuôn máy đọc thì case dùng helper này đỏ, đó là mục đích.
import { readFileSync } from 'node:fs';

export function blockFromTemplate(absPath, marker) {
  const txt = readFileSync(absPath, 'utf8');
  const m = txt.match(new RegExp(`<<<${marker} -->\\n([\\s\\S]*?)<!-- ${marker}>>>`));
  if (!m) throw new Error(`không rút được khối ${marker} từ ${absPath}`);
  const body = m[1].replace(/^```yaml\n/m, '').replace(/```\s*$/m, '');
  return body.trim() + '\n';
}

export function fillTemplate(block, values) {
  let out = block;
  for (const [k, v] of Object.entries(values))
    out = out.split(`{${k}}`).join(String(v));
  // dòng comment-only sau khi điền rỗng vẫn hợp lệ với frontmatterField
  return out;
}

export function fileFromTemplate(absPath, marker, values, body = '# fixture\n') {
  return fillTemplate(blockFromTemplate(absPath, marker), values) + body;
}
```

- [ ] **Step 4: Viết case P102 (đỏ trước)**

Chèn vào `tests/plugins/run-tests.sh` ngay sau case P101:

```bash
# ── P102: khuon canonical -> fixture -> reader chuan (round-trip seam) ──────
# Fixture cua MOI case sau nay rut tu marker nay; case nay chung minh khuon
# VIET va khuon MAY DOC con khop. Doi chung duong truoc, roi tiem hong.
run "P102 khuon canonical 3 artifact rut duoc + frontmatterField doc duoc (E1,E8)" \
  node --input-type=module -e "
const root = process.argv[1];
const path = await import('node:path');
const { createRequire } = await import('node:module');
const require = createRequire(import.meta.url);
const { frontmatterField } = require(path.join(root, 'lib/evidence-core.js'));
const { fileFromTemplate } = await import(path.join(root, 'tests/fixtures/from-template.mjs'));
const R = p => path.join(root, 'skills/acceptance/references', p);
const die = m => { console.error(m); process.exit(1); };

const cases = [
  ['uat-session-template.md', 'UAT-FRONTMATTER-TEMPLATE',
   { slug: 's1', feature: 'f', owner: 'o', stage: 'held', verdict: 'release',
     decided_by: 'Manh', decided_at: '2026-08-03T00:00:00Z', gateUAT_minutes: '20' },
   { verdict: 'release', stage: 'held', decided_at: '2026-08-03T00:00:00Z' }],
  ['contract-template.md', 'CONTRACT-FRONTMATTER-TEMPLATE',
   { feature: 'f', slug: 's2', owner: 'o', risk_tier: 'T2', surfaces: 'cli', status: 'draft' },
   { status: 'draft', risk_tier: 'T2', slug: 's2' }],
  ['opportunity-template.md', 'OPP-FRONTMATTER-TEMPLATE',
   { slug: 's3', feature: 'f', owner: 'o', stage: 'decided', decision: 'build',
     decided_by: 'M', decided_at: '2026-08-03T00:00:00Z', gate0_minutes: '10',
     base_commit: 'abc', disposition: 'keep' },
   { stage: 'decided', decision: 'build' }],
];
for (const [file, marker, values, expect] of cases) {
  const txt = fileFromTemplate(R(file), marker, values);
  for (const [k, v] of Object.entries(expect))
    if (frontmatterField(txt, k) !== v)
      die(\`\${file}: reader doc \${k} = \${JSON.stringify(frontmatterField(txt, k))}, mong \${v}\`);
  // doi chung am: khuon mat marker thi helper PHAI nem, khong im lang tra rong
  let threw = false;
  try { fileFromTemplate(R(file), marker + '-KHONG-CO', values); } catch { threw = true; }
  if (!threw) die(\`\${file}: marker sai ma helper van tra ve noi dung\`);
}
console.log('P102 OK');
" "$ROOT"
```

- [ ] **Step 5: Chạy P102 để thấy nó ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -A3 P102`
Expected: FAIL — `không rút được khối CONTRACT-FRONTMATTER-TEMPLATE` (khi chưa làm Step 2) hoặc thiếu file uat-session-template.md.

- [ ] **Step 6: Chạy lại sau khi Step 1–3 xong → XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P102|Results"`
Expected: `PASS: P102 …` và tổng suite không có FAIL mới.

- [ ] **Step 7: Commit**

```bash
git add skills/acceptance/references/uat-session-template.md skills/acceptance/references/contract-template.md tests/fixtures/from-template.mjs tests/plugins/run-tests.sh
git commit -m "feat(references): khuôn uat-session + marker contract-template + helper fixture canonical (P102)"
```

---

### Task 2: Bộ sinh bản đồ — render, bucket, cạnh, xác định

**Files:**
- Create: `scripts/product-map.mjs`
- Test: `tests/plugins/run-tests.sh` (P103, P104, P105)

**Interfaces:**
- Consumes: `blockFromTemplate`/`fileFromTemplate` (Task 1), `frontmatterField` (`lib/evidence-core.js`).
- Produces: `export function renderProductMap(root) -> string` (chuỗi Markdown đầy đủ, kết thúc bằng `\n`) và `export const NAV_ENUMS` (`{status, stage, decision, verdict}` → mảng giá trị hợp lệ). Task 3 gọi `renderProductMap` cho `--check`; Task 5 gọi từ `start-scan.mjs`.

- [ ] **Step 1: Viết case P103 (bucket đủ + enum-lạc) — ĐỎ trước**

```bash
# ── P103: product-map phan bucket tren fixture RUT TU KHUON (E1) ────────────
# Fixture code-sinh trong chinh lan chay, rut tu marker canonical (P102 canh
# khuon). Phu DU moi hang bang bucket cua design + luat enum-lac theo LOP:
# tiem gia tri la cho TUNG field dieu huong, khong chi verdict.
run "P103 product-map bucket du moi hang + enum-lac tung field (E1)" \
  node --input-type=module -e "
const root = process.argv[1];
const fs = await import('node:fs'); const os = await import('node:os');
const path = await import('node:path');
const { renderProductMap } = await import(path.join(root, 'scripts/product-map.mjs'));
const { fileFromTemplate } = await import(path.join(root, 'tests/fixtures/from-template.mjs'));
const R = p => path.join(root, 'skills/acceptance/references', p);
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p103-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) => fileFromTemplate(R('contract-template.md'),
  'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'viec ' + slug, slug, owner: 'o@o', risk_tier: 'T2', surfaces: 'cli', status });
const opp = (slug, stage, decision) => fileFromTemplate(R('opportunity-template.md'),
  'OPP-FRONTMATTER-TEMPLATE',
  { slug, feature: 'co hoi ' + slug, owner: 'o@o', stage, decision, decided_by: 'M',
    decided_at: '2026-08-01T00:00:00Z', gate0_minutes: '10', base_commit: 'abc',
    disposition: 'archive' });
const uat = (slug, verdict) => fileFromTemplate(R('uat-session-template.md'),
  'UAT-FRONTMATTER-TEMPLATE',
  { slug, feature: 'phien ' + slug, owner: 'o@o', stage: 'held', verdict,
    decided_by: 'M', decided_at: '2026-08-02T00:00:00Z', gateUAT_minutes: '20' });

W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/a-can-nhac/opportunity.md', opp('a-can-nhac', 'discovery', ''));
W('_acceptance/b-sap-mo/opportunity.md', opp('b-sap-mo', 'decided', 'build'));
W('_acceptance/c-cho-duyet/contract.md', contract('c-cho-duyet', 'draft'));
W('_acceptance/d-dang-dung/contract.md', contract('d-dang-dung', 'approved'));
W('_acceptance/e-cho-nghiem-thu/contract.md', contract('e-cho-nghiem-thu', 'signed-off'));
W('_acceptance/e-cho-nghiem-thu/opportunity.md', opp('e-cho-nghiem-thu', 'decided', 'build'));
W('_acceptance/f-da-ship/contract.md', contract('f-da-ship', 'signed-off'));
W('_acceptance/g-release/contract.md', contract('g-release', 'signed-off'));
W('_acceptance/g-release/opportunity.md', opp('g-release', 'decided', 'build'));
W('_acceptance/g-release/uat-session.md', uat('g-release', 'release'));
W('_acceptance/h-kill/contract.md', contract('h-kill', 'signed-off'));
W('_acceptance/h-kill/uat-session.md', uat('h-kill', 'kill'));
W('_acceptance/i-xep-lai/opportunity.md', opp('i-xep-lai', 'decided', 'park'));
W('_acceptance/j-bac/opportunity.md', opp('j-bac', 'decided', 'kill'));
W('_acceptance/k-hong/contract.md', 'khong co frontmatter\n');
W('.out-of-scope/mot-de-xuat-da-bac.md', '# Miễn trừ X — ĐÃ TỪ CHỐI\n\nvan xuoi\n');

// --- doi chung DUONG: ban nguyen ven phai xep dung MOI hang ---
const out = renderProductMap(tmp);
const sectionOf = slug => {
  let cur = null;
  for (const line of out.split('\n')) {
    if (line.startsWith('## ')) cur = line.slice(3).trim();
    if (line.includes('**' + slug + '**')) return cur;
  }
  return null;
};
const EXPECT = {
  'a-can-nhac': 'Đang cân nhắc cơ hội',
  'b-sap-mo': 'Sắp mở vòng',
  'c-cho-duyet': 'Vòng đang mở — chờ duyệt phạm vi',
  'd-dang-dung': 'Vòng đang mở — đang dựng và nghiệm thu máy',
  'e-cho-nghiem-thu': 'Đã ship — chờ phiên nghiệm thu',
  'f-da-ship': 'Đã ship',
  'g-release': 'Đã nghiệm thu giá trị',
  'h-kill': 'Đã nghiệm thu giá trị',
  'i-xep-lai': 'Xếp lại sau',
  'j-bac': 'Đã bác từ khám phá',
  'k-hong': 'Hồ sơ hỏng',
};
for (const [slug, sec] of Object.entries(EXPECT))
  if (sectionOf(slug) !== sec) die(\`\${slug}: nam o \"\${sectionOf(slug)}\", mong \"\${sec}\"\`);
if (!out.includes('Miễn trừ X — ĐÃ TỪ CHỐI')) die('thieu muc ngoai pham vi (title dong # dau file)');
if (!/release/i.test(out.split('Đã nghiệm thu giá trị')[1].split('##')[0]))
  die('muc da nghiem thu khong ghi ket cuc');
// khong slug nao xuat hien 2 lan
for (const slug of Object.keys(EXPECT)) {
  const n = out.split('**' + slug + '**').length - 1;
  if (n !== 1) die(\`\${slug} xuat hien \${n} lan trong map\`);
}

// --- enum-lac: tiem gia tri la cho TUNG field dieu huong ---
const MUT = [
  ['d-dang-dung/contract.md', 'status: approved', 'status: xong-roi', 'status'],
  ['a-can-nhac/opportunity.md', 'stage: discovery', 'stage: dang-nghi', 'stage'],
  ['b-sap-mo/opportunity.md', 'decision: build', 'decision: Build-hoa', 'decision'],
  ['g-release/uat-session.md', 'verdict: release', 'verdict: done', 'verdict'],
];
for (const [rel, from, to, field] of MUT) {
  const p = path.join(tmp, '_acceptance', rel);
  const orig = fs.readFileSync(p, 'utf8');
  if (!orig.includes(from)) die(\`fixture \${rel} khong chua \"\${from}\" — buoc tiem chua bao gio chay\`);
  fs.writeFileSync(p, orig.replace(from, to));
  const slug = rel.split('/')[0];
  const mutated = renderProductMap(tmp);
  const cur = (() => { let c = null;
    for (const line of mutated.split('\n')) {
      if (line.startsWith('## ')) c = line.slice(3).trim();
      if (line.includes('**' + slug + '**')) return c;
    } return null; })();
  if (cur !== 'Hồ sơ hỏng')
    die(\`enum-lac o \${field} (\${rel}): slug nam o \"\${cur}\", mong \"Hồ sơ hỏng\"\`);
  const hongBlock = mutated.split('Hồ sơ hỏng')[1] || '';
  if (!hongBlock.includes(field) || !hongBlock.includes(to.split(': ')[1]))
    die(\`enum-lac o \${field}: muc Ho so hong khong neu ten field + gia tri la\`);
  fs.writeFileSync(p, orig);
}
console.log('P103 OK');
" "$ROOT"
```

- [ ] **Step 2: Chạy P103 → ĐỎ vì chưa có script**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -A3 P103`
Expected: FAIL — `Cannot find module .../scripts/product-map.mjs`.

- [ ] **Step 3: Viết `scripts/product-map.mjs`**

```js
#!/usr/bin/env node
// product-map.mjs — bản đồ sản phẩm SINH từ hồ sơ xưởng (_acceptance/*/ +
// .out-of-scope/). View, không phải kho: regenerate = hết trôi. Bucket cố ý
// THÔ — approved/implemented/verified gộp một nhãn — để bản đồ đứng yên giữa
// hai lần đóng cổng người; nếu không, --check đỏ oan mỗi lần máy chạy xong
// một bước. Reader duy nhất là frontmatterField của lib/evidence-core.js.
import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));

export const NAV_ENUMS = {
  status: ['draft', 'approved', 'implemented', 'verified', 'signed-off'],
  stage: ['discovery', 'decided', 'archived'],
  decision: ['build', 'iterate', 'park', 'kill'],
  verdict: ['release', 'iterate', 'kill'],
};

const SECTIONS = [
  ['can-nhac', 'Đang cân nhắc cơ hội'],
  ['sap-mo', 'Sắp mở vòng'],
  ['cho-duyet', 'Vòng đang mở — chờ duyệt phạm vi'],
  ['dang-dung', 'Vòng đang mở — đang dựng và nghiệm thu máy'],
  ['cho-nghiem-thu', 'Đã ship — chờ phiên nghiệm thu'],
  ['da-ship', 'Đã ship'],
  ['da-nghiem-thu', 'Đã nghiệm thu giá trị'],
  ['xep-lai', 'Xếp lại sau'],
  ['da-bac', 'Đã bác từ khám phá'],
  ['ngoai-pham-vi', 'Ngoài phạm vi đã ký'],
  ['hong', 'Hồ sơ hỏng'],
];
const UAT_KET_CUC = { release: 'giao rộng (release)', iterate: 'lặp thêm (iterate)', kill: 'dừng (kill)' };

const read = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const fm = (txt, key) => (txt == null ? null : frontmatterField(txt, key));
const low = v => (v == null ? null : v.toLowerCase());

// Cạnh: đọc từ contract trước, thiếu thì opportunity — vắng cả hai thì IM,
// không placeholder (write-side epic: thuộc vòng khám phá, chưa có ở đây).
function edges(cTxt, oTxt) {
  const pick = k => fm(cTxt, k) || fm(oTxt, k) || '';
  const out = [];
  const epic = pick('epic'); if (epic) out.push(`epic: ${epic}`);
  const sup = pick('supersedes'); if (sup) out.push(`thay thế: ${sup}`);
  const rel = pick('relates'); if (rel) out.push(`liên quan: ${rel}`);
  return out.length ? ' · ' + out.join(' · ') : '';
}

function classify(dir, slug) {
  const cTxt = read(path.join(dir, 'contract.md'));
  const oTxt = read(path.join(dir, 'opportunity.md'));
  const uTxt = read(path.join(dir, 'uat-session.md'));
  const name = fm(cTxt, 'feature') || fm(oTxt, 'feature') || fm(uTxt, 'feature') || slug;
  const edge = edges(cTxt, oTxt);
  const hong = (file, reason) => ({ key: 'hong', slug, file, reason });

  if (cTxt == null && oTxt == null && uTxt == null)
    return hong('(hồ sơ)', 'không có contract.md lẫn opportunity.md');

  // Lượt 1 — soi MỌI field điều hướng có mặt. Giá trị ngoài enum là hồ sơ
  // hỏng, không phải "bỏ qua": bỏ qua = slug biến mất im lặng vì một lỗi gõ.
  const checks = [
    [cTxt, 'contract.md', 'status'],
    [oTxt, 'opportunity.md', 'stage'],
    [oTxt, 'opportunity.md', 'decision'],
    [uTxt, 'uat-session.md', 'verdict'],
  ];
  for (const [txt, file, field] of checks) {
    if (txt == null) continue;
    const raw = fm(txt, field);
    if (raw == null) {
      // decision/verdict được phép VẮNG (chưa ký); status/stage thì không
      if (field === 'decision' || field === 'verdict') continue;
      return hong(file, `frontmatter không đọc được hoặc thiếu ${field}`);
    }
    const v = raw.toLowerCase();
    if (v === '') continue;
    if (!NAV_ENUMS[field].includes(v))
      return hong(file, `${field} không nhận diện được: ${raw}`);
  }

  // Lượt 2 — xếp ô, tra từ artifact muộn nhất về sớm nhất.
  const verdict = low(fm(uTxt, 'verdict')) || '';
  if (verdict) return { key: 'da-nghiem-thu', slug, name, edge, note: UAT_KET_CUC[verdict] };

  const status = low(fm(cTxt, 'status')) || '';
  const decision = low(fm(oTxt, 'decision')) || '';
  if (status) {
    if (status === 'signed-off') {
      const duongA = decision === 'build' || decision === 'iterate';
      return { key: duongA ? 'cho-nghiem-thu' : 'da-ship', slug, name, edge };
    }
    if (status === 'draft') return { key: 'cho-duyet', slug, name, edge };
    return { key: 'dang-dung', slug, name, edge };
  }

  const stage = low(fm(oTxt, 'stage')) || '';
  if (stage !== 'decided' || !decision) return { key: 'can-nhac', slug, name, edge };
  if (decision === 'build' || decision === 'iterate') return { key: 'sap-mo', slug, name, edge };
  if (decision === 'park') return { key: 'xep-lai', slug, name, edge };
  return { key: 'da-bac', slug, name, edge };
}

export function renderProductMap(root) {
  const acc = path.join(root, '_acceptance');
  const buckets = Object.fromEntries(SECTIONS.map(([k]) => [k, []]));

  if (existsSync(acc)) {
    for (const entry of readdirSync(acc, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const item = classify(path.join(acc, entry.name), entry.name);
      buckets[item.key].push(item);
    }
  }

  const oos = path.join(root, '.out-of-scope');
  if (existsSync(oos)) {
    for (const f of readdirSync(oos)) {
      if (!f.endsWith('.md')) continue;
      const txt = read(path.join(oos, f)) || '';
      const title = (txt.split('\n').find(l => l.startsWith('# ')) || '# ' + f).slice(2).trim();
      buckets['ngoai-pham-vi'].push({ slug: f.replace(/\.md$/, ''), name: title, edge: '', file: f });
    }
  }

  const lines = [
    '# Bản đồ sản phẩm',
    '',
    '> Máy sinh từ hồ sơ trong `_acceptance/` và `.out-of-scope/` — đừng sửa tay.',
    '> Bản đồ được làm mới ở mỗi lần một người ký một cổng.',
    '',
  ];
  for (const [key, title] of SECTIONS) {
    const items = buckets[key].sort((a, b) => a.slug.localeCompare(b.slug));
    if (!items.length) continue;
    lines.push(`## ${title}`, '');
    for (const it of items) {
      if (key === 'hong') lines.push(`- **${it.slug}** — \`${it.file}\`: ${it.reason}`);
      else if (key === 'ngoai-pham-vi') lines.push(`- **${it.name}** (\`.out-of-scope/${it.file}\`)`);
      else lines.push(`- **${it.slug}** — ${it.name}${it.note ? ` — ${it.note}` : ''}${it.edge}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

// ─── CLI ───
const args = process.argv.slice(2);
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMain) {
  const rootIx = args.indexOf('--root');
  const root = path.resolve(rootIx >= 0 && args[rootIx + 1] ? args[rootIx + 1] : '.');
  const mapPath = path.join(root, 'PRODUCT-MAP.md');
  const check = args.includes('--check');
  // Gợi ý lệnh phải chạy được ở CHÍNH repo đang đỏ: suy từ vị trí script thật
  // (self-host → scripts/product-map.mjs; consumer → đường dẫn plugin).
  const rel = path.relative(root, __filename);
  const hint = rel && !rel.startsWith('..') ? rel : __filename;

  if (!existsSync(path.join(root, '_acceptance', 'config.yaml'))) {
    console.log('Repo chưa dựng cổng nghiệm thu — chưa có gì để vẽ bản đồ.');
    process.exit(0);
  }
  const rendered = renderProductMap(root);
  if (!check) { writeFileSync(mapPath, rendered); console.log(mapPath); process.exit(0); }
  if (!existsSync(mapPath)) {
    console.log('PRODUCT-MAP.md chưa có — repo chưa dựng bản đồ; nó sẽ tự sinh ở lần đóng cổng người kế.');
    process.exit(0);
  }
  if (read(mapPath) === rendered) { console.log('PRODUCT-MAP.md khớp hồ sơ xưởng.'); process.exit(0); }
  console.error(`PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node ${hint} --root .`);
  process.exit(1);
}
```

- [ ] **Step 4: Chạy P103 → XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P103|Results"`
Expected: `PASS: P103 …`

- [ ] **Step 5: Viết P104 (bất biến giữa chuyển máy) + P105 (xác định + cạnh)**

```bash
# ── P104: bat bien giua chuyen may (E2) ────────────────────────────────────
run "P104 map GIU NGUYEN qua approved->implemented->verified; DOI qua cong nguoi (E2)" \
  node --input-type=module -e "
const root = process.argv[1];
const fs = await import('node:fs'); const os = await import('node:os');
const path = await import('node:path');
const { renderProductMap } = await import(path.join(root, 'scripts/product-map.mjs'));
const { fileFromTemplate } = await import(path.join(root, 'tests/fixtures/from-template.mjs'));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p104-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const cPath = path.join(tmp, '_acceptance/x/contract.md');
const contract = status => fileFromTemplate(
  path.join(root, 'skills/acceptance/references/contract-template.md'),
  'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'viec x', slug: 'x', owner: 'o@o', risk_tier: 'T2', surfaces: 'cli', status });
W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/x/contract.md', contract('approved'));
const base = renderProductMap(tmp);
for (const s of ['implemented', 'verified']) {
  fs.writeFileSync(cPath, contract(s));
  if (renderProductMap(tmp) !== base) die('map DOI khi chuyen may sang ' + s + ' — --check se do oan giua vong');
}
// doi chung DUONG: chuyen qua cong NGUOI thi map PHAI doi
fs.writeFileSync(cPath, contract('signed-off'));
if (renderProductMap(tmp) === base) die('map khong doi khi slug da ky signed-off — bucket khong con phan biet gi');
fs.writeFileSync(cPath, contract('draft'));
if (renderProductMap(tmp) === base) die('map khong doi giua draft va approved — phep do nay khong song');
console.log('P104 OK');
" "$ROOT"

# ── P105: xac dinh + canh hien-khi-co (E4, E5) ──────────────────────────────
run "P105 render 2 lan giong het + sort theo slug + canh chi hien khi ho so co (E4,E5)" \
  node --input-type=module -e "
const root = process.argv[1];
const fs = await import('node:fs'); const os = await import('node:os');
const path = await import('node:path');
const { renderProductMap } = await import(path.join(root, 'scripts/product-map.mjs'));
const { fileFromTemplate } = await import(path.join(root, 'tests/fixtures/from-template.mjs'));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p105-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, extra = '') => fileFromTemplate(
  path.join(root, 'skills/acceptance/references/contract-template.md'),
  'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'viec ' + slug, slug, owner: 'o@o', risk_tier: 'T2', surfaces: 'cli',
    status: 'draft' }).replace('status: draft', 'status: draft' + extra);
W('_acceptance/config.yaml', 'schema_version: 1\n');
// tao KHONG theo thu tu chu de chung minh sort theo slug, khong theo thu tu file
W('_acceptance/zebra/contract.md', contract('zebra'));
W('_acceptance/alpha/contract.md', contract('alpha', '\nepic: nen-tang\nrelates: zebra'));
W('_acceptance/mike/contract.md', contract('mike'));
const a = renderProductMap(tmp), b = renderProductMap(tmp);
if (a !== b) die('hai lan render khac nhau — --check khong the tin duoc');
const order = ['alpha', 'mike', 'zebra'].map(s => a.indexOf('**' + s + '**'));
if (!(order[0] < order[1] && order[1] < order[2])) die('khong sort theo slug: ' + JSON.stringify(order));
const lineOf = s => a.split('\n').find(l => l.includes('**' + s + '**')) || '';
if (!lineOf('alpha').includes('epic: nen-tang') || !lineOf('alpha').includes('liên quan: zebra'))
  die('canh co trong ho so ma khong hien: ' + lineOf('alpha'));
if (/epic|thay thế|liên quan/.test(lineOf('zebra')))
  die('slug khong khai canh ma dong van co nhan canh: ' + lineOf('zebra'));
console.log('P105 OK');
" "$ROOT"
```

- [ ] **Step 6: Chạy P104 + P105**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P10[345]|Results"`
Expected: cả ba PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/product-map.mjs tests/plugins/run-tests.sh
git commit -m "feat(product-map): bộ sinh bản đồ sản phẩm — bucket thô, enum-lạc → hồ sơ hỏng, render xác định (P103-P105)"
```

---

### Task 3: Chế độ `--check` + đường đọc-cũ

**Files:**
- Modify: `scripts/product-map.mjs` (chỉ nếu Step 3 của Task 2 cần chỉnh sau khi test soi)
- Test: `tests/plugins/run-tests.sh` (P106)

**Interfaces:**
- Consumes: CLI của `product-map.mjs` (Task 2).
- Produces: hợp đồng exit-code cho `_acceptance/config.yaml` executor `script.product_map` (Task 6) — `0` khớp / chưa có file / chưa init, `1` lệch.

- [ ] **Step 1: Viết P106**

```bash
# ── P106: --check 4 trang thai + goi y lenh chay duoc o CHINH repo do (E3) ──
run "P106 --check fresh/stale/thieu-file/chua-init + path goi y suy tu vi tri script (E3)" \
  node --input-type=module -e "
const root = process.argv[1];
const fs = await import('node:fs'); const os = await import('node:os');
const path = await import('node:path');
const { execFileSync } = await import('node:child_process');
const { fileFromTemplate } = await import(path.join(root, 'tests/fixtures/from-template.mjs'));
const die = m => { console.error(m); process.exit(1); };
const SCRIPT = path.join(root, 'scripts/product-map.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p106-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const runCheck = () => { try {
    const out = execFileSync('node', [SCRIPT, '--root', tmp, '--check'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out, err: '' };
  } catch (e) { return { code: e.status, out: String(e.stdout || ''), err: String(e.stderr || '') }; } };

// 1. chua init -> exit 0 co note (KHONG do oan)
let r = runCheck();
if (r.code !== 0 || !/chưa dựng cổng/.test(r.out)) die('chua init: code=' + r.code + ' out=' + r.out);

W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/x/contract.md', fileFromTemplate(
  path.join(root, 'skills/acceptance/references/contract-template.md'),
  'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'viec x', slug: 'x', owner: 'o@o', risk_tier: 'T2', surfaces: 'cli', status: 'draft' }));

// 2. chua co PRODUCT-MAP.md -> exit 0 co note (duong doc-cu)
r = runCheck();
if (r.code !== 0 || !/chưa có/.test(r.out)) die('thieu file: code=' + r.code + ' out=' + r.out);

// 3. DOI CHUNG DUONG: sinh roi check -> XANH
execFileSync('node', [SCRIPT, '--root', tmp], { stdio: 'ignore' });
r = runCheck();
if (r.code !== 0) die('vua sinh xong ma --check do: ' + r.err);

// 4. tiem lech -> exit 1 + DUNG thong diep + path chay duoc
const mapPath = path.join(tmp, 'PRODUCT-MAP.md');
fs.writeFileSync(mapPath, fs.readFileSync(mapPath, 'utf8') + '\n- **la-hoac**\n');
r = runCheck();
if (r.code !== 1) die('map lech ma --check khong exit 1 (code=' + r.code + ')');
if (!r.err.includes('PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node '))
  die('thong diep khong khop khuon ghim: ' + r.err);
const m = r.err.match(/chạy: node (\S+) --root \./);
if (!m) die('thong diep khong neu duong dan script: ' + r.err);
if (!fs.existsSync(path.resolve(tmp, m[1])))
  die('duong dan trong goi y KHONG ton tai khi chay tu repo dang do: ' + m[1]);
console.log('P106 OK');
" "$ROOT"
```

- [ ] **Step 2: Chạy P106**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -A3 P106`
Expected: PASS. Nếu ĐỎ ở nhánh path (`m[1]` không tồn tại khi resolve từ `tmp`) → sửa `hint` trong `product-map.mjs` thành absolute `__filename` khi `path.relative(root, __filename)` bắt đầu bằng `..` (nhánh này đã có trong code Task 2; case đang soi đúng nó).

- [ ] **Step 3: Commit**

```bash
git add scripts/product-map.mjs tests/plugins/run-tests.sh
git commit -m "test(product-map): --check 4 trạng thái + gợi ý lệnh chạy được ở repo tiêu thụ (P106)"
```

---

### Task 4: Skill `uat-session` — nghi thức Cổng Giá trị

**Files:**
- Create: `skills/uat-session/SKILL.md`
- Test: `tests/plugins/run-tests.sh` (P107)

**Interfaces:**
- Consumes: `skills/acceptance/references/uat-session-template.md` (Task 1); CLI `product-map.mjs --root .` (Task 2) cho bước làm mới sau ký.
- Produces: `_acceptance/<slug>/uat-session.md` — vật mà `start-scan.mjs` (Task 5) và `product-map.mjs` đọc.

- [ ] **Step 1: Viết `skills/uat-session/SKILL.md`**

```markdown
---
name: uat-session
description: Nghi thức PHIÊN NGHIỆM THU (Cổng Giá trị) trên sản phẩm THẬT sau flag — mời người dùng đại diện, chấm kín trước thảo luận, đặt số đo cạnh ngưỡng đã khai ở Cổng Đáng, rồi người ký release/iterate/kill. Dùng sau khi một vòng đã signed-off và cơ hội có ngưỡng UAT. KHÔNG dùng cho vòng không có opportunity (đường B/C/E ship thẳng), KHÔNG tự chấm thay người, KHÔNG sửa ngưỡng sau khi thấy số.
---

# uat-session — phiên nghiệm thu giá trị

**Một mặt phẳng làm việc:** phiên chạy trong Claude Code trên sản phẩm thật
đang chạy sau flag. Skill này DẪN phiên và GHI hồ sơ; nó không quyết — verdict
là chữ của người ký.

**KILL tại cổng này là THÀNH CÔNG của quy trình** — câu trả lời mua bằng giá
một vòng dựng, không phải thất bại của người làm. Nói câu đó ra khi trình
quyết định, đừng để người ký cảm thấy phải bảo vệ code.

## 0. Điều kiện vào — kiểm trước, không hỏi

- `_acceptance/<slug>/contract.md` có `status: signed-off`.
- `_acceptance/<slug>/opportunity.md` tồn tại và có ngưỡng UAT đã chốt tại
  Cổng Đáng (section "Ngưỡng chết / ngưỡng UAT").
- Sản phẩm thật đã chạy sau flag cho người dự bấm được.

Thiếu bất kỳ điều nào → DỪNG, nói rõ thiếu gì. Vòng KHÔNG có opportunity đi
đường B/C/E: ship thẳng, không có phiên nghiệm thu — đừng dựng phiên giả.

## 1. Dựng hồ sơ trước khi mời người

Chép khuôn từ `references/uat-session-template.md` sang
`_acceptance/<slug>/uat-session.md`, `stage: scheduled`, `verdict` để TRỐNG.

**Chép NGUYÊN VĂN ngưỡng** từ opportunity vào section ngưỡng. Từ giây phút
này ngưỡng là hằng số: đổi phép đo sau khi thấy số là gian, dù lý do nghe hợp
lý tới đâu. Cần đổi thật → ghi `[SUPERSEDED <ngày>]` bên `opportunity.md`,
giữ bản gốc, và phiên này dừng lại chờ Cổng Đáng.

## 2. Mời người dự

Ghi bảng người dự: tên · vai · đại diện cho ai. Người dùng đại diện thật ưu
tiên hơn người trong đội — đội đã biết trước câu trả lời mong muốn.

## 3. Chấm kín TRƯỚC thảo luận

Thu điểm và nhận xét của TỪNG người trước khi mở thảo luận chung. Nghe điểm
người khác trước là hỏng phép đo (ai cũng trôi về ý kiến của người nói to
nhất). Điền xong khối "Chấm kín" mới được viết khối "Thảo luận".

Cùng lúc chấm kín, hỏi từng người **một câu ràng buộc**: "anh/chị sẽ gửi cho
khách nào, khi nào?" — ghi nguyên văn. Người thật sự tin sẽ nêu được tên và
mốc; câu trả lời chung chung tự nó là dữ liệu.

## 4. Đặt số đo cạnh ngưỡng

Điền bảng: thước · ngưỡng đã khai · số đo được · SỐNG/CHẾT. Số từ tracking
thật, không từ cảm giác trong phòng. Chưa đo được thước nào thì ghi rõ CHƯA
ĐO — không đo mà im lặng là gian.

## 5. Người ký quyết định

Trình gọn: ngưỡng, số, chấm kín, câu ràng buộc. Rồi hỏi ĐÚNG MỘT câu: giao
rộng, lặp thêm, hay dừng? Người ký điền `verdict`, `decided_by`,
`decided_at`, `time_human_minutes.gateUAT`, `stage: held`. Agent KHÔNG điền
verdict thay người, kể cả khi số đã rõ.

## 6. Sau khi ký

- Làm mới bản đồ sản phẩm:
  `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root .` (repo tự host
  kit chạy `node scripts/product-map.mjs --root .`).
- Bước kế theo verdict: `release` → nghi thức phát hành của repo · `iterate`
  → cơ hội quay vòng, giữ giả định, sửa rồi đo lại · `kill` → đóng có hồ sơ,
  ghi lại điều đã học vào `opportunity.md`.
- Kết quả đo append vào `opportunity.md` — vòng đo sau ship nuôi retro.
```

- [ ] **Step 2: Viết P107**

```bash
# ── P107: nghi thuc uat-session du chot + DUNG THU TU + khong khoa invocation ─
run "P107 uat-session giu 7 chot spec §2.3 dung thu tu; skill MO nhu design-pass (E12)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
die = lambda m: (_ for _ in ()).throw(AssertionError(m))
p = root / "skills/uat-session/SKILL.md"
assert p.is_file(), "thieu skills/uat-session/SKILL.md"
t = p.read_text(encoding="utf-8")

# 7 chot, moi chot mot dau moc van ban, phai xuat hien DUNG THU TU nay
CHOTS = [
    ("dieu kien vao", "signed-off"),
    ("nguong da chot", "ngưỡng UAT đã chốt"),
    ("chep nguyen van + cam sua", "NGUYÊN VĂN"),
    ("cham kin truoc thao luan", "Chấm kín TRƯỚC thảo luận"),
    ("cau rang buoc", "gửi cho khách nào"),
    ("verdict human-owned", "Agent KHÔNG điền verdict"),
    ("kill la thanh cong", "THÀNH CÔNG của quy trình"),
]
pos = []
for label, needle in CHOTS:
    i = t.find(needle)
    assert i >= 0, f"thieu chot: {label} ({needle!r})"
    pos.append((label, i))
# "kill la thanh cong" co the nam som (loi mo dau) — chi rang buoc thu tu cua
# 5 chot quy trinh, con 2 chot tuyen bo chi can CO MAT
flow = [p for p in pos if p[0] not in ("kill la thanh cong",)]
for a, b in zip(flow, flow[1:]):
    assert a[1] < b[1], f"chot lech thu tu: {a[0]} phai truoc {b[0]}"

# regen map sau khi ky, va phai nam SAU muc ky
assert "product-map.mjs" in t, "thieu buoc lam moi ban do"
assert t.find("product-map.mjs") > t.find("decided_by"), \
    "buoc lam moi ban do nam TRUOC luc ky — sai diem regen"

# skill MO: khong co co khoa invocation nao (doi chung duong tren mot lenh LOCKED)
assert "disable-model-invocation" not in t, "uat-session bi khoa — tien le design-pass la MO"
locked = (root / "commands/start.md").read_text(encoding="utf-8")
assert "disable-model-invocation: true" in locked, \
    "doi chung duong hong: commands/start.md le ra phai co co khoa"

# dot bien: bo mot chot thi phep do PHAI do
mut = t.replace("Chấm kín TRƯỚC thảo luận", "Thu y kien")
assert "Chấm kín TRƯỚC thảo luận" not in mut, "buoc tiem chua bao gio chay"
PY
```

- [ ] **Step 3: Chạy P107**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P107|Results"`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add skills/uat-session/SKILL.md tests/plugins/run-tests.sh
git commit -m "feat(uat-session): nghi thức phiên nghiệm thu — chấm kín, ngưỡng bất biến, verdict human-owned (P107)"
```

---

### Task 5: `start-scan.mjs` đọc hai nguồn mới + marker hai harness

**Files:**
- Modify: `scripts/start-scan.mjs`
- Modify: `commands/start.md` (khối START-SCAN-KEYS + dòng bản đồ ở bước 3)
- Modify: `codex/acceptance-gate/skills/start/SKILL.md` (cùng hai chỗ)
- Modify: `docs/specs/2026-08-03-start-command-design.md` (bảng phân ô + khuôn JSON)
- Modify: `tests/plugins/run-tests.sh` (P108 mới; P98 thêm hàng)

**Interfaces:**
- Consumes: `renderProductMap` (Task 2), khuôn UAT (Task 1).
- Produces: khoá JSON `map.present` (bool), `map.fresh` (bool|null); `gates[].gate` nhận giá trị `gia-tri`; `done[].state` nhận `released`/`uat-iterate`/`uat-kill`.

- [ ] **Step 1: Viết P108 — ĐỎ trước**

```bash
# ── P108: start-scan doc uat-session + trang thai ban do (E10) ──────────────
run "P108 o cho-Cong-Gia-tri + state theo verdict + map.present/fresh 4 to hop (E10)" \
  node --input-type=module -e "
const root = process.argv[1];
const fs = await import('node:fs'); const os = await import('node:os');
const path = await import('node:path');
const { execFileSync } = await import('node:child_process');
const { fileFromTemplate } = await import(path.join(root, 'tests/fixtures/from-template.mjs'));
const die = m => { console.error(m); process.exit(1); };
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const MAP = path.join(root, 'scripts/product-map.mjs');
const R = p => path.join(root, 'skills/acceptance/references', p);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p108-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const scan = () => JSON.parse(execFileSync('node', [SCAN, '--root', tmp], { encoding: 'utf8' }));
const contract = (slug, status) => fileFromTemplate(R('contract-template.md'),
  'CONTRACT-FRONTMATTER-TEMPLATE',
  { feature: 'viec ' + slug, slug, owner: 'o@o', risk_tier: 'T2', surfaces: 'cli', status });
const opp = (slug, decision) => fileFromTemplate(R('opportunity-template.md'),
  'OPP-FRONTMATTER-TEMPLATE',
  { slug, feature: 'co hoi', owner: 'o@o', stage: 'decided', decision, decided_by: 'M',
    decided_at: '2026-08-01T00:00:00Z', gate0_minutes: '10', base_commit: 'a', disposition: 'archive' });
const uat = (slug, verdict, decidedAt = '2026-08-02T00:00:00Z') =>
  fileFromTemplate(R('uat-session-template.md'), 'UAT-FRONTMATTER-TEMPLATE',
    { slug, feature: 'phien', owner: 'o@o', stage: 'held', verdict, decided_by: 'M',
      decided_at: decidedAt, gateUAT_minutes: '20' });

W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/a-cho-gia-tri/contract.md', contract('a-cho-gia-tri', 'signed-off'));
W('_acceptance/a-cho-gia-tri/opportunity.md', opp('a-cho-gia-tri', 'build'));
W('_acceptance/b-cho-co-uat/contract.md', contract('b-cho-co-uat', 'signed-off'));
W('_acceptance/b-cho-co-uat/opportunity.md', opp('b-cho-co-uat', 'iterate'));
W('_acceptance/b-cho-co-uat/uat-session.md', uat('b-cho-co-uat', '', '2026-07-01T00:00:00Z'));
W('_acceptance/c-release/contract.md', contract('c-release', 'signed-off'));
W('_acceptance/c-release/uat-session.md', uat('c-release', 'release'));
W('_acceptance/d-iterate/contract.md', contract('d-iterate', 'signed-off'));
W('_acceptance/d-iterate/uat-session.md', uat('d-iterate', 'iterate'));
W('_acceptance/e-kill/contract.md', contract('e-kill', 'signed-off'));
W('_acceptance/e-kill/uat-session.md', uat('e-kill', 'kill'));
W('_acceptance/f-uat-hong/contract.md', contract('f-uat-hong', 'signed-off'));
W('_acceptance/f-uat-hong/uat-session.md', 'khong co frontmatter\n');
W('_acceptance/g-uat-la/contract.md', contract('g-uat-la', 'signed-off'));
W('_acceptance/g-uat-la/uat-session.md', uat('g-uat-la', 'xong-roi'));
W('_acceptance/h-ship-thang/contract.md', contract('h-ship-thang', 'signed-off'));

let j = scan();
const gate = s => (j.groups.gates.find(g => g.slug === s) || {}).gate;
const state = s => (j.groups.done.find(d => d.slug === s) || {}).state;
const broken = s => j.broken.find(b => b.slug === s);
if (gate('a-cho-gia-tri') !== 'gia-tri') die('signed-off duong A khong vao o cho-Cong-Gia-tri');
if (gate('b-cho-co-uat') !== 'gia-tri') die('uat co file nhung verdict rong phai VAN cho ky');
if (state('c-release') !== 'released') die('verdict release -> state released, got ' + state('c-release'));
if (state('d-iterate') !== 'uat-iterate') die('verdict iterate -> uat-iterate, got ' + state('d-iterate'));
if (state('e-kill') !== 'uat-kill') die('verdict kill -> uat-kill, got ' + state('e-kill'));
if (!broken('f-uat-hong') || !/uat-session/.test(broken('f-uat-hong').file))
  die('uat hong khong vao broken[] kem ten file');
if (!broken('g-uat-la') || !/xong-roi/.test(broken('g-uat-la').reason))
  die('verdict ngoai enum khong vao broken[] kem gia tri la');
if (state('h-ship-thang') !== 'signed-off') die('signed-off khong duong A phai la da-ky thuong');
// since 2 nhanh: co decided_at -> dung no; thieu -> mtime contract
const gA = j.groups.gates.find(g => g.slug === 'a-cho-gia-tri');
const gB = j.groups.gates.find(g => g.slug === 'b-cho-co-uat');
if (gB.since !== '2026-07-01T00:00:00Z') die('since khong lay decided_at cua uat: ' + gB.since);
if (!gA.since || gA.since === gB.since) die('since thieu decided_at phai roi ve mtime contract');
if (j.groups.gates[0].slug !== 'b-cho-co-uat') die('cong cho lau nhat phai dung dau');
// 2 dong skip cu KHONG con
const skipTxt = JSON.stringify(j.skipped || []);
if (/PRODUCT-MAP|nghiệm-thu/.test(skipTxt)) die('van con dong skip cu: ' + skipTxt);

// map 4 to hop
if (j.map.present !== false || j.map.fresh !== null) die('map vang: ' + JSON.stringify(j.map));
execFileSync('node', [MAP, '--root', tmp], { stdio: 'ignore' });
j = scan();
if (j.map.present !== true || j.map.fresh !== true) die('map fresh: ' + JSON.stringify(j.map));
fs.appendFileSync(path.join(tmp, 'PRODUCT-MAP.md'), '\n- **la**\n');
j = scan();
if (j.map.present !== true || j.map.fresh !== false) die('map stale: ' + JSON.stringify(j.map));
// loi render -> fresh null, KHONG crash: bo doc quyen doc _acceptance
fs.chmodSync(path.join(tmp, '_acceptance'), 0o000);
try { j = scan(); } finally { fs.chmodSync(path.join(tmp, '_acceptance'), 0o755); }
if (j.map.fresh !== null) die('loi render phai cho fresh=null, got ' + JSON.stringify(j.map));
console.log('P108 OK');
" "$ROOT"
```

- [ ] **Step 2: Chạy P108 → ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -A3 P108`
Expected: FAIL — `j.map` undefined / `gia-tri` không có.

- [ ] **Step 3: Sửa `scripts/start-scan.mjs`**

Thêm import dưới các import sẵn có:

```js
import { renderProductMap } from './product-map.mjs';
```

Trong vòng lặp per-slug, chèn NGAY TRƯỚC `if (cTxt != null) {` (tra từ artifact muộn nhất — uat-session mới hơn contract):

```js
  const uPath = path.join(dir, 'uat-session.md');
  const uTxt = read(uPath);
  if (uTxt != null) {
    const vRaw = fmOrNull(uTxt, 'verdict');
    if (vRaw == null) { broken.push({ slug, file: 'uat-session.md', reason: 'frontmatter không parse được hoặc thiếu verdict' }); continue; }
    const v = vRaw.toLowerCase();
    // verdict RỖNG = phiên đã dựng nhưng chưa ký → vẫn là ô chờ-Cổng-Giá-trị
    const UAT_STATE = { release: 'released', iterate: 'uat-iterate', kill: 'uat-kill' };
    if (v) {
      if (UAT_STATE[v]) { done.push({ slug, state: UAT_STATE[v] }); continue; }
      broken.push({ slug, file: 'uat-session.md', reason: `verdict không nhận diện được: ${vRaw}` });
      continue;
    }
  }
```

Trong nhánh contract, thay dòng `if (status === 'signed-off') done.push({ slug, state: 'signed-off' });` bằng:

```js
    if (status === 'signed-off') {
      // Đường A (cơ hội quyết build/iterate) chưa ký nghiệm thu → còn một cổng
      // người nữa; đường B/C/E ship thẳng, không có phiên nghiệm thu.
      const oDecision = oTxt != null ? (frontmatterField(oTxt, 'decision') || '').toLowerCase() : '';
      if (oDecision === 'build' || oDecision === 'iterate')
        gates.push({ slug, gate: 'gia-tri', since: since(cPath, fmOrNull(uTxt, 'decided_at')), tier });
      else done.push({ slug, state: 'signed-off' });
    }
```

Thay khối skip cuối file:

```js
// Hai nguồn từng bỏ qua (PRODUCT-MAP, phiên nghiệm thu) nay đã dựng — mảng
// giữ lại trong schema cho nguồn tương lai, thường rỗng.
const skipped = [];
let map = { present: existsSync(path.join(root, 'PRODUCT-MAP.md')), fresh: null };
if (map.present) {
  try { map.fresh = readFileSync(path.join(root, 'PRODUCT-MAP.md'), 'utf8') === renderProductMap(root); }
  catch { map.fresh = null; }
}

out({ schema_version: 1, config: true, git, groups: { gates, inProgress, done }, map, skipped, broken });
```

Lưu ý: `fmOrNull(uTxt, ...)` an toàn khi `uTxt` là `null` (hàm đã trả `null`).

- [ ] **Step 4: Chạy P108 → XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P108|Results"`
Expected: PASS.

- [ ] **Step 5: Cập nhật marker + thẻ ở CẢ HAI harness**

Trong `commands/start.md` VÀ `codex/acceptance-gate/skills/start/SKILL.md`, thêm dòng vào khối marker (P99 tự đối chiếu):

```
   map.present map.fresh
```

Và ở bước trình thẻ, đổi dòng skip thành dòng bản đồ (giữ dòng `skipped[]` cho nguồn tương lai):

```
   - Dưới thẻ: một dòng bản đồ sản phẩm — `map.present` là `false` → "chưa có
     bản đồ sản phẩm (sẽ tự vẽ ở lần ký cổng kế)"; `map.fresh` là `false` →
     "bản đồ đang lệch với hồ sơ — làm mới bằng một lệnh"; `null` → "chưa
     kiểm được bản đồ". Mỗi phần tử `skipped[]` vẫn in một dòng "(bỏ qua
     nguồn `source` — `reason`)" khi có.
```

Thêm ô mới vào bảng tra nhóm "Chờ chữ ký của anh": `gia-tri` = Cổng Giá trị: xem số thật rồi quyết giao rộng / lặp thêm / dừng. Và trong bước bàn giao: chọn cổng `gia-tri` → skill `uat-session <slug>` (các cổng khác giữ `/acceptance-card <slug>`).

- [ ] **Step 6: Cập nhật bảng phân ô + khuôn JSON trong spec**

`docs/specs/2026-08-03-start-command-design.md` — thêm vào bảng phân ô:

```markdown
| `uat-session.md` verdict `release`/`iterate`/`kill` | đã-ký (`released`/`uat-iterate`/`uat-kill`) | — |
| `uat-session.md` có mặt, verdict TRỐNG | chờ-Cổng-Giá-trị | — |
| status `signed-off` + opportunity decision `build`/`iterate`, chưa verdict | chờ-Cổng-Giá-trị | — |
| status `signed-off` không thuộc đường A | đã-ký | — |
| `verdict` ngoài enum release/iterate/kill | cờ hỏng (broken[]) | — |
```

Sửa câu ưu tiên: "ưu tiên tra từ artifact muộn nhất (uat-session → evidence → contract → opportunity)"; `since` của ô chờ-Cổng-Giá-trị = `decided_at` của uat-session nếu có, thiếu → mtime `contract.md`. Trong khuôn JSON thêm `"map": { "present": true, "fresh": false }` và đổi ví dụ `skipped` thành `[]`.

- [ ] **Step 7: Bổ sung hàng mới vào fixture P98**

Trong case P98, thêm vào phần fixture nguyên vẹn (dùng đúng helper của case đó) ba slug: `m-uat-release` (contract signed-off + uat verdict release), `n-cho-gia-tri` (signed-off + opportunity build, không uat), `o-uat-la` (uat verdict `xong-roi`); rồi thêm vào bảng assert của case: `m-uat-release` → `done`, `n-cho-gia-tri` → `gates` với `gate: gia-tri`, `o-uat-la` → `broken`. Giữ nguyên phép đếm "tổng slug vào ô = tổng slug fixture" của case.

- [ ] **Step 8: Chạy toàn suite**

Run: `bash tests/plugins/run-tests.sh 2>&1 | tail -5`
Expected: `Results: all plugin tests passed` (P98, P99, P108 đều xanh).

- [ ] **Step 9: Commit**

```bash
git add scripts/start-scan.mjs commands/start.md codex/acceptance-gate/skills/start/SKILL.md docs/specs/2026-08-03-start-command-design.md tests/plugins/run-tests.sh
git commit -m "feat(start-scan): đọc phiên nghiệm thu + trạng thái bản đồ, trả nợ 2 dòng skip (P108, P98/P99 mở rộng)"
```

---

### Task 6: Điểm làm mới bản đồ + bản đồ của chính kit

**Files:**
- Modify: `commands/approve.md`, `commands/signoff.md`, `codex/acceptance-gate/skills/approve/SKILL.md`, `codex/acceptance-gate/skills/signoff/SKILL.md`
- Modify: `_acceptance/config.yaml`
- Create: `PRODUCT-MAP.md` (máy sinh)
- Modify: `tests/plugins/run-tests.sh` (P109)

**Interfaces:**
- Consumes: CLI + exit-code của `product-map.mjs` (Task 2/3); skill `uat-session` (Task 4) đã có bước regen sẵn từ Task 4 Step 1.
- Produces: `executors.script.product_map` — eval E7 của contract dùng ref này.

- [ ] **Step 1: Viết P109 — ĐỎ trước**

```bash
# ── P109: diem lam moi ban do o MOI than cong nguoi + config self-host (E6) ─
run "P109 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
# (than lenh, moc "ghi field cong" phai dung TRUOC buoc regen)
BODIES = [
    ("commands/approve.md", "approved_by"),
    ("commands/signoff.md", "human_signoff"),
    ("codex/acceptance-gate/skills/approve/SKILL.md", "approved_by"),
    ("codex/acceptance-gate/skills/signoff/SKILL.md", "human_signoff"),
    ("skills/uat-session/SKILL.md", "decided_by"),
]
for rel, anchor in BODIES:
    t = (root / rel).read_text(encoding="utf-8")
    assert "product-map.mjs" in t, f"{rel}: thieu buoc lam moi ban do"
    assert t.find("product-map.mjs") > t.find(anchor), \
        f"{rel}: buoc lam moi ban do nam TRUOC {anchor} — sai diem regen"
    if rel.startswith(("commands/", "codex/")):
        seg = t[t.find("product-map.mjs") - 200: t.find("product-map.mjs") + 40]
        assert "CLAUDE_PLUGIN_ROOT" in seg, \
            f"{rel}: dan script bang duong dan self-host — consumer se khong bao gio regen"
        # doi chung duong: than lenh nay von da dung plugin-root o cho khac
        assert t.count("CLAUDE_PLUGIN_ROOT") >= 1

cfg = (root / "_acceptance/config.yaml").read_text(encoding="utf-8")
assert "product_map:" in cfg, "config thieu executors.script.product_map"
assert "executors.script.product_map" in cfg, "product_map chua nam trong feature_loop.suite_keys"
# dot bien: go dong suite_keys thi phep do PHAI do
mut = "\n".join(l for l in cfg.splitlines() if "executors.script.product_map" not in l)
assert "executors.script.product_map" not in mut, "buoc tiem chua bao gio chay"

# ban do cua CHINH kit da commit
assert (root / "PRODUCT-MAP.md").is_file(), "kit chua commit PRODUCT-MAP.md cua chinh no"
PY
```

- [ ] **Step 2: Thêm bước regen vào `commands/approve.md`**

Chèn bullet ngay SAU bullet seal entry, TRƯỚC bullet "Offer ONE commit":

```markdown
   - Regenerate the product map — `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs
     --root .` — AFTER the gate fields are written. The map is a view over the
     workshop's records; every human gate closing is a point where it changes,
     and CI's `--check` turns any drift red.
```

Và thêm `PRODUCT-MAP.md` vào bullet commit: "Offer ONE commit: contract + evals (+ design doc when present) + `PRODUCT-MAP.md` — the Gate-1 record."

- [ ] **Step 3: Thêm bước regen vào `commands/signoff.md`**

Chèn bước mới đánh số giữa bước 5 (ghi chữ ký) và bước "Land the signature as its own commit", để bản đồ nằm trong commit chữ ký:

```markdown
6. **Regenerate the product map** — `node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs
   --root .` — after `human_signoff` is written. Include `PRODUCT-MAP.md` in the
   signature commit below; the map is machine-generated from records that just
   changed, so it belongs with the gate closing that changed them.
```

Đánh số lại các bước sau đó và thêm `PRODUCT-MAP.md` vào khối `git add` mẫu.

- [ ] **Step 4: Lặp lại cho hai thân Codex**

`codex/acceptance-gate/skills/approve/SKILL.md`: thêm bullet regen ngay sau bullet seal entry, cùng nội dung tiếng Anh và cùng `${CLAUDE_PLUGIN_ROOT}`.
`codex/acceptance-gate/skills/signoff/SKILL.md`: thêm mục regen trước mục "Re-check merge readiness", cùng cách.

- [ ] **Step 5: Khai executor trong `_acceptance/config.yaml`**

Dưới `executors.script`, thêm (tự host nên trỏ thẳng `scripts/`, xem ghi chú 1 đầu file):

```yaml
    product_map: "node scripts/product-map.mjs --root . --check"
```

Và dưới `feature_loop.suite_keys`, thêm dòng cuối:

```yaml
    # Bản đồ sản phẩm phải khớp hồ sơ xưởng — pattern P30 cho một view máy sinh.
    - executors.script.product_map
```

- [ ] **Step 6: Sinh bản đồ của chính kit**

Run: `node scripts/product-map.mjs --root .`
Rồi đọc `PRODUCT-MAP.md` bằng mắt: mỗi mục có đọc được bằng tiếng sản phẩm không, có slug nào rơi nhầm "Hồ sơ hỏng" không (repo có 15 workspace thật — hỏng thật thì sửa hồ sơ, KHÔNG nới luật để bản đồ đẹp).

- [ ] **Step 7: Chạy P109 + toàn suite**

Run: `bash tests/plugins/run-tests.sh 2>&1 | tail -5`
Expected: `Results: all plugin tests passed`.

- [ ] **Step 8: Kiểm executor mới chạy đúng (đối chứng dương cho E7)**

Run: `node scripts/product-map.mjs --root . --check; echo "exit=$?"`
Expected: `PRODUCT-MAP.md khớp hồ sơ xưởng.` + `exit=0`.

- [ ] **Step 9: Commit**

```bash
git add commands/approve.md commands/signoff.md codex/acceptance-gate/skills/approve/SKILL.md codex/acceptance-gate/skills/signoff/SKILL.md _acceptance/config.yaml PRODUCT-MAP.md tests/plugins/run-tests.sh
git commit -m "feat(gates): làm mới bản đồ tại mỗi lần đóng cổng người + bản đồ của chính kit (P109)"
```

---

### Task 7: Đồng bộ mirror + đóng S3

**Files:**
- Modify: `plugins/**` (sinh máy)
- Modify: `_acceptance/product-map-uat-session/contract.md` (`status: implemented`)

**Interfaces:**
- Consumes: mọi vật giao của Task 1–6.
- Produces: cây làm việc sẵn sàng cho S4 (mirror khớp nguồn, contract `implemented`).

- [ ] **Step 1: Đồng bộ mirror**

Run: `bash scripts/sync-plugin-packages.sh`
Expected: in danh sách gói đã dựng lại, exit 0.

- [ ] **Step 2: Kiểm mirror khớp nguồn**

Run: `bash scripts/sync-plugin-packages.sh --check; echo "exit=$?"`
Expected: `exit=0`.

- [ ] **Step 3: Chạy TOÀN BỘ suite của repo**

```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh
```
Expected: cả bốn in dòng "all … passed", exit 0.

- [ ] **Step 4: Bản đồ vẫn khớp sau khi mirror đổi**

Run: `node scripts/product-map.mjs --root . --check; echo "exit=$?"`
Expected: `exit=0` (mirror không nằm trong `_acceptance/`, nên bản đồ không đổi — nếu đỏ thì có gì đó đang đọc sai phạm vi).

- [ ] **Step 5: Đặt contract sang `implemented`**

Sửa frontmatter `_acceptance/product-map-uat-session/contract.md`: `status: implemented`.

- [ ] **Step 6: Commit**

```bash
git add plugins _acceptance/product-map-uat-session/contract.md
git commit -m "chore(mirror): sync plugins sau product-map-uat-session; contract → implemented"
```

---

## Self-Review

**Spec coverage — mỗi AC có task:**

| AC | Task |
|---|---|
| AC-1 bucket + enum-lạc | T2 (P103) |
| AC-2 bất biến chuyển máy | T2 (P104) |
| AC-3 --check 3 trạng thái + path động | T3 (P106) |
| AC-4 xác định | T2 (P105) |
| AC-5 cạnh | T2 (P105) |
| AC-6 điểm regen + config | T6 (P109) |
| AC-7 map của kit fresh | T6 (Step 6/8) + eval E7 |
| AC-8 round-trip template UAT | T1 (P102) + T5 (P108 dùng khuôn đó cho reader thật) |
| AC-9 nghi thức phiên | T4 (P107) + eval judgment E9 |
| AC-10 start-scan nguồn mới + since | T5 (P108) |
| AC-11 marker 2 harness + bảng phân ô | T5 (Step 5–7, P99/P98) |
| AC-12 LOCKED không đổi | T4 (P107 kiểm skill mở) + P31/P32 sẵn có |
| AC-13 ngôn ngữ mặt người | T2 (render tiếng sản phẩm) + T6 Step 6 (đọc bằng mắt) + eval judgment E13 |

**Placeholder scan:** không có TBD/TODO; mọi step có lệnh hoặc code thật.

**Type consistency:** `renderProductMap(root) -> string` dùng nhất quán ở T2/T3/T5; `fileFromTemplate(absPath, marker, values, body?)` dùng nhất quán ở T1/T2/T3/T5; tên marker `UAT-FRONTMATTER-TEMPLATE` / `CONTRACT-FRONTMATTER-TEMPLATE` / `OPP-FRONTMATTER-TEMPLATE` khớp giữa helper, template và test; khoá JSON `map.present`/`map.fresh` khớp giữa `start-scan.mjs`, marker hai harness, spec và P108.

**Rủi ro đã biết:** P108 Step 1 dùng `chmod 000` để ép lỗi render — chạy dưới `root` sẽ KHÔNG lỗi (root đọc được mọi thứ) và case đó sẽ đỏ; nếu suite chạy trong container root, đổi cách ép lỗi sang ghi `_acceptance` thành file thường (không phải thư mục) trong một tmp riêng.
