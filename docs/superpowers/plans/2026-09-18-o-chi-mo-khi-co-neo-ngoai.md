# Ô chỉ mở khi có neo ngoài — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một dòng `Gốc:` máy đọc ở hàng chờ Cổng Đáng + răng VC8 đảo chiều, VC9 «Kho chờ nhận» cho mốc, lối (b) ghi hạt giống, hạ vế «phải gọi tên chỗ cắt», rà 22 ô tồn.

**Architecture:** Bên viết là hai khuôn có marker (`opportunity-template.md`: `OPP-GOC-LINE` + `OPP-GOC-RULE`; `contract-template.md`: `KHO-CHO-NHAN-LINE`), bên đọc là hai ca trong `tests/plugins/vao-co-o.test.mjs` rút khuôn từ marker và chạy trên cây thật + fixture ma trận. Lối (b) đổi hành động ở khối `OOC-LOI-B` của ba tài liệu + một hằng thẻ, đo bằng `tests/scripts/loi-b-hat-giong.test.mjs`. Luật ở `CLAUDE.md` là văn bản, chấm bằng judgment E6.

**Tech Stack:** Node ESM test files (mẫu `vao-co-o.test.mjs`, `gate-card-lmcms.test.mjs`), `tests/fixtures/from-template.mjs`, `tests/scripts/gate-fixture.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-18-o-chi-mo-khi-co-neo-ngoai-design.md` · hợp đồng `_acceptance/o-chi-mo-khi-co-neo-ngoai/contract.md`.

## Global Constraints

- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2).
- Mọi phép đo mới có cặp hai chiều trên cùng fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE).
- Fixture rút từ khuôn qua marker (`fileFromTemplate`/`blockFromTemplate`), không gõ tay frontmatter.
- Đường dẫn trong test suy từ vị trí file; không hardcode ROOT.
- Nhãn «mở hợp đồng mới» / token `new-contract` giữ nguyên văn (lib T3 — ngoài phạm vi).
- Từ chuẩn theo `CONTEXT.md`; không chép ô bị xoá: «về hạt giống» = `stage: archived` tại chỗ.

---

### Task 1: Hai khuôn có marker + lời dặn điền

**Files:**
- Modify: `skills/acceptance/references/opportunity-template.md:33-38` (section «Vấn đề & ai gặp»)
- Modify: `skills/acceptance/references/contract-template.md:104-106` (section Notes)
- Modify: `commands/start.md` khối `START-HIEU-KET` mục ④

**Interfaces:**
- Produces: marker `OPP-GOC-LINE` chứa đúng một dòng `Gốc: {goc}`; marker `OPP-GOC-RULE` chứa đúng hai dòng regex (dòng 1 dạng hồ sơ, có `{slug}` để bên đọc thay bằng slug của ô; dòng 2 dạng người gọi tên); marker `KHO-CHO-NHAN-LINE` chứa đúng một dòng `Kho chờ nhận: {kho}`.

- [ ] **Step 1: Thêm khối Gốc vào opportunity-template** — ngay sau ba dòng `>` của section «Vấn đề & ai gặp», chèn:

```markdown
> Dòng đầu tiên của section là NEO NGOÀI — ô chỉ đứng được ở hàng chờ Cổng Đáng khi có nó
> (luật 18/09, ô o-chi-mo-khi-co-neo-ngoai). Hai dạng hợp lệ, là hai regex ở khối RULE:
> (1) một hồ sơ cụ thể `<kho>/_acceptance/<slug-khác>` (kho có thể là chính kit) ·
> (2) `kho <tên> — <người> gọi tên <YYYY-MM-DD>`. «Suy từ đọc mã» không phải neo — ý chưa
> có neo sống ở hạt giống `docs/plans/<ngày>-hat-giong-<slug>.md`, không mở ô.

<!-- <<<OPP-GOC-LINE -->
Gốc: {goc}
<!-- OPP-GOC-LINE>>> -->

<!-- <<<OPP-GOC-RULE -->
^Gốc:\s*\S+/_acceptance/(?!{slug}/)[\w-]+
^Gốc:\s*kho\s+\S+\s+—\s+.+?\s+gọi tên\s+\d{4}-\d{2}-\d{2}
<!-- OPP-GOC-RULE>>> -->
```

- [ ] **Step 2: Thêm khối Kho chờ nhận vào contract-template** — trong `## Notes`, sau dòng `{{Optional…}}`:

```markdown
> Hồ sơ MỐC PHÁT HÀNH (`release-*`) phải có dòng dưới đây khi còn chưa ký: tên ≥1 kho tiêu thụ đang
> chờ bản mới (luật 18/09 — mốc chỉ cắt khi có kho chờ nhận; răng VC9 đọc, bác «chưa có»/placeholder).

<!-- <<<KHO-CHO-NHAN-LINE -->
Kho chờ nhận: {kho}
<!-- KHO-CHO-NHAN-LINE>>> -->
```

- [ ] **Step 3: Dặn điền ở start.md** — trong `START-HIEU-KET`, sửa mục ④ thành: `④ section «Vấn đề & ai gặp» mở bằng dòng \`Gốc:\` rút từ khối \`OPP-GOC-LINE\` của khuôn — một hồ sơ cụ thể \`<kho>/_acceptance/<slug-khác>\` hoặc \`kho <tên> — <người> gọi tên <ngày>\` (răng VC8 đọc; không neo thì ghi hạt giống, KHÔNG mở ô) · rồi ≥ 1 câu vấn đề`.

- [ ] **Step 4: Kiểm round-trip thủ công** — `node -e` đọc hai marker bằng `blockFromTemplate` từ `tests/fixtures/from-template.mjs`; mong in đúng ba khối. Commit `feat(khuôn): dòng Gốc + Kho chờ nhận có marker`.

### Task 2: VC8 đảo chiều + VC9

**Files:**
- Modify: `tests/plugins/vao-co-o.test.mjs` (ALL_IDS thêm `VC9`; thay trọn khối VC8; thêm khối VC9)

**Interfaces:**
- Consumes: ba marker của Task 1; `stub()`, `W`, `tmp`, `scan`, `slugsIn`, `fileFromTemplate`, `blockFromTemplate`.
- Produces: dòng `PASS: [VC8] …` / `PASS: [VC9] …`; lỗi ghim `«<slug>: thiếu Gốc»`, `«<slug>: trỏ chính nó»`, `«<slug>: chưa điền»`, `«<slug>: không khớp dạng»`, `«<mốc>: thiếu Kho chờ nhận»`, `«<mốc>: giá trị bác»`, `«<mốc>: chưa điền»`, `«khuôn thiếu marker <tên>»`.

- [ ] **Step 1: Helper đọc neo (đặt trên khối VC8)**

```js
import { blockFromTemplate } from '../fixtures/from-template.mjs';
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
const fm = (t, k) => { const m = t.match(new RegExp(`^${k}:\\s*(.*?)\\s*(#.*)?$`, 'm')); return m ? m[1].trim() : ''; };
const gocRule = tpl => {                     // [placeholderLine, regexHoSo(slug) => RegExp, regexNguoi]
  let line, rules;
  try { line = blockFromTemplate(tpl, 'OPP-GOC-LINE').trim(); rules = blockFromTemplate(tpl, 'OPP-GOC-RULE').trim().split('\n'); }
  catch (e) { throw new Error('khuôn thiếu marker OPP-GOC-LINE/OPP-GOC-RULE'); }
  if (rules.length !== 2) throw new Error('khuôn OPP-GOC-RULE phải đúng hai dòng');
  return { line, hoSo: slug => new RegExp(rules[0].split('{slug}').join(slug), 'm'), nguoi: new RegExp(rules[1], 'm') };
};
// Hàng chờ: discovery, hoặc decided+build chưa có contract. park/kill/archived miễn.
const hangCho = (dir) => {
  const o = path.join(dir, 'opportunity.md'); if (!existsSync(o) || existsSync(path.join(dir, 'contract.md'))) return null;
  const t = readFileSync(o, 'utf8'); const st = fm(t, 'stage'), de = fm(t, 'decision');
  return (st === 'discovery' || (st === 'decided' && de === 'build')) ? t : null;
};
const neoErrs = (accDir, tpl) => {
  const r = gocRule(tpl); const errs = [];
  for (const slug of readdirSync(accDir)) {
    const t = hangCho(path.join(accDir, slug)); if (t === null) continue;
    const m = t.match(/^Gốc:.*$/m);
    if (!m) { errs.push(`${slug}: thiếu Gốc`); continue; }
    const val = m[0].replace(/^Gốc:\s*/, '').trim();
    if (!val || m[0].trim() === r.line) { errs.push(`${slug}: chưa điền`); continue; }
    if (new RegExp(`/_acceptance/${slug}(/|$)`).test(val)) { errs.push(`${slug}: trỏ chính nó`); continue; }
    if (!r.hoSo(slug).test(m[0]) && !r.nguoi.test(m[0])) errs.push(`${slug}: không khớp dạng`);
  }
  return errs;
};
```

- [ ] **Step 2: Thay khối VC8** (giữ phần «stub sống đúng MỘT ngăn», bỏ phần orphans/hạt giống-phải-có-ô):

```js
// ---------- VC8 (đảo chiều 18/09): mọi ô ở HÀNG CHỜ có Gốc hợp lệ; hạt giống mồ côi IM; stub sống đúng MỘT ngăn
if (want('VC8')) {
  const errs = [];
  const acc = path.join(ROOT, '_acceptance');
  // cây thật
  errs.push(...neoErrs(acc, TEMPLATE).map(e => 'cây thật: ' + e));
  // start.md dặn điền (AC-1)
  const startBlk = readFileSync(START_MD, 'utf8').match(/<<<START-HIEU-KET -->([\s\S]*?)<!-- START-HIEU-KET>>>/);
  if (!startBlk || !startBlk[1].includes('Gốc:')) errs.push('start.md khối START-HIEU-KET không dặn điền Gốc:');
  // ma trận trên MỘT fixture — số ca = số ô
  const r = tmp(); const goc = { hoSo: 'Gốc: crm/_acceptance/vong-khac', nguoi: 'Gốc: kho oneflow — Mạnh gọi tên 2026-09-18' };
  const body = g => `\n## Vấn đề & ai gặp\n\n${g}\nMột câu.\n`;
  const put = (slug, values, g) => W(r, `_acceptance/${slug}/opportunity.md`, stub({ slug, ...values }, { filled: true, body: body(g) }));
  put('duong-hoso', { stage: 'discovery' }, goc.hoSo);
  put('duong-nguoi', { stage: 'decided', decision: 'build' }, goc.nguoi);
  put('do1-thieu', { stage: 'discovery' }, '');
  put('do2-tu-tro', { stage: 'discovery' }, 'Gốc: kit/_acceptance/do2-tu-tro');
  put('do3a-rong', { stage: 'discovery' }, 'Gốc:');
  put('do3b-placeholder', { stage: 'discovery' }, blockFromTemplate(TEMPLATE, 'OPP-GOC-LINE').trim());
  put('do3c-van-tu-do', { stage: 'discovery' }, 'Gốc: suy từ đọc mã');
  put('do4-build-thieu', { stage: 'decided', decision: 'build' }, '');
  put('im2-park', { stage: 'decided', decision: 'park' }, '');
  put('im3-archived', { stage: 'archived', decision: 'kill' }, '');
  W(r, 'docs/plans/2026-01-01-hat-giong-mo-coi.md', '# hạt giống không ô — hợp lệ\n');
  const got = neoErrs(path.join(r, '_acceptance'), TEMPLATE).sort();
  const want8 = ['do1-thieu: thiếu Gốc', 'do2-tu-tro: trỏ chính nó', 'do3a-rong: chưa điền', 'do3b-placeholder: chưa điền', 'do3c-van-tu-do: không khớp dạng', 'do4-build-thieu: thiếu Gốc'].sort();
  if (JSON.stringify(got) !== JSON.stringify(want8)) errs.push(`ma trận fixture: có ${JSON.stringify(got)} — mong ${JSON.stringify(want8)}`);
  // khuôn là nguồn: đổi regex trong bản sao khuôn → ca dương đổi màu
  const { template: tp } = pluginCopy({ template: t => t.replace('^Gốc:\\s*kho\\s+', '^Gốc:\\s*KHOO\\s+') });
  if (!neoErrs(path.join(r, '_acceptance'), tp).includes('duong-nguoi: không khớp dạng')) errs.push('đổi regex trong bản sao khuôn mà ca dương không đổi màu — bên đọc không rút từ khuôn');
  const { template: tp2 } = pluginCopy({ template: t => t.replace('OPP-GOC-RULE', 'OPP-GOC-RULEX') });
  try { neoErrs(path.join(r, '_acceptance'), tp2); errs.push('gỡ marker RULE mà không đỏ'); } catch (e) { if (!/thiếu marker/.test(e.message)) errs.push('gỡ marker: sai thông điệp: ' + e.message); }
  // stub sống đúng MỘT ngăn (giữ từ bản cũ — bất biến «mọi stub nằm đúng một ô»)
  const j = scan(ROOT);
  for (const s of ['hoi-theo-mat-phang', 'ban-do-dinh-chu-ky', 'o-nuot-luat', 'ba-cho-tich-luy-khong-duong-ra', 'duong-do-trong-dinh-nghia-xong', 'liet-ke-may-doc', 't1-tuyen-kem-can-cu']) {
    const n = ['gates', 'inProgress', 'considering', 'done'].filter(k => slugsIn(j.groups[k]).includes(s)).length + (slugsIn(j.broken).includes(s) ? 1 : 0);
    if (n !== 1) errs.push(`${s} phải nằm đúng MỘT ô, đang ở ${n} ô`);
  }
  if (errs.length) fail('VC8', errs.join(' · ')); else pass('VC8', 'mọi ô ở hàng chờ có Gốc hợp lệ (cây thật + ma trận 10 ô, khuôn là nguồn); hạt giống mồ côi im; 7 stub đúng một ngăn');
}
```

- [ ] **Step 3: Thêm khối VC9**

```js
// ---------- VC9: mốc phát hành chưa ký phải khai «Kho chờ nhận:» với ≥1 tên kho
const khoErrs = (accDir, tpl) => {
  let line; try { line = blockFromTemplate(tpl, 'KHO-CHO-NHAN-LINE').trim(); } catch (e) { throw new Error('khuôn thiếu marker KHO-CHO-NHAN-LINE'); }
  const BAC = new Set(['', 'chưa có', 'không', '—', '…', '(chưa có)']); const errs = [];
  for (const d of readdirSync(accDir).filter(s => s.startsWith('release-'))) {
    const c = path.join(accDir, d, 'contract.md'); if (!existsSync(c)) continue;
    const t = readFileSync(c, 'utf8'); if (fm(t, 'status') === 'signed-off') continue;
    const m = t.match(/^Kho chờ nhận:.*$/m);
    if (!m) { errs.push(`${d}: thiếu Kho chờ nhận`); continue; }
    if (m[0].trim() === line) { errs.push(`${d}: chưa điền`); continue; }
    const val = m[0].replace(/^Kho chờ nhận:\s*/, '').trim();
    const ok = val.split(/[,\s·]+/).filter(Boolean).some(k => /^[a-z0-9][a-z0-9._-]+$/.test(k) && !BAC.has(k));
    if (BAC.has(val) || !ok) errs.push(`${d}: giá trị bác`);
  }
  return errs;
};
if (want('VC9')) {
  const errs = [];
  errs.push(...khoErrs(path.join(ROOT, '_acceptance'), CONTRACT_TPL).map(e => 'cây thật: ' + e));
  const r = tmp(); const line = blockFromTemplate(CONTRACT_TPL, 'KHO-CHO-NHAN-LINE').trim();
  const rec = (name, status, kho) => W(r, `_acceptance/${name}/contract.md`,
    fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE', { feature: 'mốc', slug: name, owner: 'o@x', risk_tier: 'T2', surfaces: 'ci', status }, `\n# x\n\n## Notes\n\n${kho}\n`));
  rec('release-im-1', 'draft', 'Kho chờ nhận: media-library');
  rec('release-do-thieu', 'draft', '');
  rec('release-do-bac', 'approved', 'Kho chờ nhận: chưa có');
  rec('release-do-placeholder', 'draft', line);
  rec('release-im-2', 'signed-off', '');
  const got = khoErrs(path.join(r, '_acceptance'), CONTRACT_TPL).sort();
  const want9 = ['release-do-bac: giá trị bác', 'release-do-placeholder: chưa điền', 'release-do-thieu: thiếu Kho chờ nhận'].sort();
  if (JSON.stringify(got) !== JSON.stringify(want9)) errs.push(`fixture: có ${JSON.stringify(got)} — mong ${JSON.stringify(want9)}`);
  const ctp = path.join(tmp(), 'contract-template.md'); writeFileSync(ctp, readFileSync(CONTRACT_TPL, 'utf8').replace('KHO-CHO-NHAN-LINE', 'KHO-CHO-NHAN-LINEX'));
  try { khoErrs(path.join(r, '_acceptance'), ctp); errs.push('gỡ marker mà không đỏ'); } catch (e) { if (!/thiếu marker/.test(e.message)) errs.push('gỡ marker: sai thông điệp'); }
  if (errs.length) fail('VC9', errs.join(' · ')); else pass('VC9', 'mốc chưa ký khai Kho chờ nhận (cây thật + 5 hồ sơ fixture rút từ khuôn, marker là nguồn)');
}
```

- [ ] **Step 4: Chạy** `VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs` — mong ĐỎ trên cây thật (22 ô thiếu Gốc) nhưng ma trận fixture khớp; `VC_CASES=VC9` — mong đỏ `release-2-0-0: thiếu Kho chờ nhận`. Đó là đối chứng rằng răng cắn vật thật; Task 5 làm xanh.
- [ ] **Step 5: Commit** `feat(răng): VC8 đảo chiều — ô hàng chờ phải có Gốc; VC9 mốc chưa ký phải có Kho chờ nhận`.

### Task 3: Lối (b) ghi hạt giống — hằng thẻ + ba khối OOC-LOI-B + ca LB

**Files:**
- Modify: `scripts/gate-card.js:88` (thêm hằng) và `:1013` (dùng hằng)
- Modify: `feature-loop/skills/feature-loop/SKILL.md:276`, `commands/acceptance-card.md:149`, `commands/signoff.md:33-34`
- Create: `tests/scripts/loi-b-hat-giong.test.mjs`

**Interfaces:**
- Produces: `const MSG_OOC_HAT_GIONG = 'Máy đề xuất: ghi hạt giống có Gốc, chờ kho gọi tên — không mở ô.';` trong gate-card.js; khối `<!-- <<<OOC-LOI-B -->…<!-- OOC-LOI-B>>> -->` ở ba tài liệu.

- [ ] **Step 1: gate-card.js** — sau dòng 89 thêm hằng; ở nhánh `f.proposal === 'new-contract'` thay chuỗi `'Máy đề xuất: tách thành một việc riêng.'` bằng `MSG_OOC_HAT_GIONG`.
- [ ] **Step 2: Ba tài liệu** — bọc câu lối (b) bằng marker và viết lại:

SKILL.md (thay `(b) **mở contract mới** — một feature riêng có AC + eval của nó;`):
```
(b) **mở contract mới** — <!-- <<<OOC-LOI-B -->hành động: ghi HẠT GIỐNG `docs/plans/<ngày>-hat-giong-<slug>.md` có dòng `Gốc:` trỏ hồ sơ vòng này + phát hiện; KHÔNG tạo `_acceptance/<slug>/` — ô chỉ mở khi một kho gọi tên (luật 18/09)<!-- OOC-LOI-B>>> -->;
```
acceptance-card.md (thay vế `(b) **mở hợp đồng mới** — tách thành một việc riêng có tiêu chí nghiệm thu của nó;`):
```
(b) **mở hợp đồng mới** — <!-- <<<OOC-LOI-B -->hành động: ghi HẠT GIỐNG `docs/plans/<ngày>-hat-giong-<slug>.md` có dòng `Gốc:` trỏ hồ sơ vòng này + phát hiện; KHÔNG tạo `_acceptance/<slug>/` — ô chỉ mở khi một kho gọi tên<!-- OOC-LOI-B>>> -->;
```
signoff.md (sau dòng 34 thêm):
```
  <!-- <<<OOC-LOI-B -->«mở hợp đồng mới» = ghi HẠT GIỐNG `docs/plans/<ngày>-hat-giong-<slug>.md` có dòng `Gốc:` trỏ hồ sơ này + phát hiện; KHÔNG tạo `_acceptance/<slug>/` — ô chỉ mở khi một kho gọi tên (luật 18/09)<!-- OOC-LOI-B>>> -->
```

- [ ] **Step 3: Ca LB1–LB3**

```js
// tests/scripts/loi-b-hat-giong.test.mjs — hồ sơ o-chi-mo-khi-co-neo-ngoai AC-5
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, GC, SRC, mkWs, card, G2, ITEM, OOC } from './gate-fixture.mjs';
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`PASS: ${n} `); } catch (e) { failed++; console.log(`FAIL: ${n}\n  ${e.message}`); } };
const die = m => { throw new Error(m); };
const pick = name => { const m = SRC.match(new RegExp(`^const ${name}\\s*=\\s*'([^']*)';`, 'm')); if (!m) die('gate-card.js khong khai hang ' + name); return m[1]; };
const MSG = pick('MSG_OOC_HAT_GIONG');
const DOCS = ['feature-loop/skills/feature-loop/SKILL.md', 'commands/acceptance-card.md', 'commands/signoff.md'];
const blk = txt => { const m = txt.match(/<<<OOC-LOI-B -->([\s\S]*?)<!-- OOC-LOI-B>>>/); return m ? m[1] : null; };
check('LB1 finding new-contract → the in cau hat giong', () => {
  const r = mkWs('s', G2(OOC(ITEM('new-contract'))));
  const out = card(r, 's').stdout;
  if (!out.includes(MSG)) die('thieu: ' + MSG);
  if (out.includes('tách thành một việc riêng')) die('con cau cu');
});
check('LB2 doi hang trong ban sao gate-card → LB1 do', () => {
  const d = mkdtempSync(path.join(tmpdir(), 'lb-')); for (const x of ['scripts', 'lib', 'skills']) cpSync(path.join(ROOT, x), path.join(d, x), { recursive: true });
  const gc = path.join(d, 'scripts', 'gate-card.js'); writeFileSync(gc, readFileSync(gc, 'utf8').replace(MSG, 'Máy đề xuất: tách thành một việc riêng.'));
  const r = mkWs('s', G2(OOC(ITEM('new-contract'))));
  const out = spawnSync('node', [gc, '--root', r, '--slug', 's'], { encoding: 'utf8' }).stdout;
  if (out.includes(MSG)) die('ban sao doi hang ma van in cau moi — LB1 khong do duoc');
});
check('LB3 ba tai lieu: khoi OOC-LOI-B co cau moi, khong co cau cu', () => {
  for (const f of DOCS) {
    const b = blk(readFileSync(path.join(ROOT, f), 'utf8')); if (b === null) die(`${f}: thieu marker OOC-LOI-B`);
    for (const need of ['hat-giong-<slug>.md', 'Gốc:', 'KHÔNG tạo `_acceptance/<slug>/`']) if (!b.includes(need)) die(`${f}: khoi thieu «${need}»`);
    for (const ban of ['tách thành một việc riêng', 'tạo thư mục']) if (b.includes(ban)) die(`${f}: khoi con cau cu «${ban}»`);
    if (!readFileSync(path.join(ROOT, f), 'utf8').includes('mở hợp đồng mới') && !f.endsWith('SKILL.md')) die(`${f}: mat nhan nguyen van`);
  }
  const d = mkdtempSync(path.join(tmpdir(), 'lb-')); const f = path.join(d, 'x.md');
  writeFileSync(f, readFileSync(path.join(ROOT, DOCS[1]), 'utf8').replace('<!-- OOC-LOI-B>>>', 'tách thành một việc riêng<!-- OOC-LOI-B>>>'));
  if (!blk(readFileSync(f, 'utf8')).includes('tách thành một việc riêng')) die('mutant chen cau cu khong vao khoi');
});
console.log(`Results: ${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
```

- [ ] **Step 4: Chạy** `node tests/scripts/loi-b-hat-giong.test.mjs` → 3 PASS; `node tests/scripts/gate-card-lmcms.test.mjs` vẫn xanh. Commit `feat(lối b): mở hợp đồng mới = ghi hạt giống có Gốc, không tạo ô`.

### Task 4: Luật trong CLAUDE.md

**Files:** Modify `CLAUDE.md:61` (luật (b)) và `:88-90` (vế gọi tên).

- [ ] **Step 1:** dòng 61 → `(b) **Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN tối đa MỘT vòng meta**, chỉ khi owner gọi tên — mẫu số là mốc kho nhận, không phải mốc cắt số (18/09: bảy lần cắt số trong mười ngày nới trần thành bảy). Mốc chỉ cắt khi có kho chờ nhận (dòng \`Kho chờ nhận:\` trong hồ sơ mốc, răng VC9), và đi làn V như 2.5.0/2.7.0.`
- [ ] **Step 2:** vế «Mỗi mốc phát hành PHẢI gọi tên ít nhất MỘT chỗ cắt cho cửa sổ kế, hoặc tuyên bố đã-tối-ưu kèm số — số đếm không dẫn tới một nhát cắt có tên là đo-hình-thức, đúng bệnh luật này sinh ra để chặn.» → `Mỗi mốc phát hành ĐƯỢC PHÉP ghi chỗ cắt cho cửa sổ kế vào Notes, hoặc tuyên bố đã-tối-ưu kèm số; chỗ cắt chỉ thành ô khi có \`Gốc:\` (18/09: vế «PHẢI gọi tên» đẻ 12/35 ô trong mười ngày — ô o-chi-mo-khi-co-neo-ngoai). Số đếm phải đọc được, không phải đẻ việc.`
- [ ] **Step 3:** Thêm một gạch đầu dòng dưới khung bổ sung: `**Ô chỉ mở khi có neo ngoài (owner 18/09).** Hàng chờ Cổng Đáng (\`stage: discovery\`, hoặc \`decided build\` chưa hợp đồng) phải có dòng \`Gốc:\` — một hồ sơ cụ thể ở một kho, hoặc kho + người gọi tên + ngày; «suy từ đọc mã» không phải neo. Ý chưa có neo sống ở hạt giống, không mở ô. Lối «mở hợp đồng mới» tại Cổng Bằng chứng ghi hạt giống, không tạo ô. Răng: VC8/VC9. Hồ sơ: \`_acceptance/o-chi-mo-khi-co-neo-ngoai/\`.` Commit `docs(luật): ô chỉ mở khi có neo; trần meta neo vào mốc kho nhận`.

### Task 5: Rà 22 ô hàng chờ + mốc 2.0.0 + bản đồ

**Files:** Modify 22 × `_acceptance/<slug>/opportunity.md`, `_acceptance/release-2-0-0/contract.md`, `PRODUCT-MAP.md`; append `decisions.jsonl` của vòng.

- [ ] **Step 1: Thêm `Gốc:`** (dòng đầu section «Vấn đề & ai gặp») cho 16 ô có neo đọc được từ thân bài:

| slug | Gốc |
|---|---|
| ba-cho-cat-sau-chu-ky-cua-so-2-13 | `acceptance-gate-kit/_acceptance/release-2-12-0` (phiên ship 14/09 > 60 phút) |
| bat-bien-san-pham | `kho media-library — Mạnh gọi tên 2026-09-02` |
| cong-chan-theo-ho-so-khong-theo-diff | `crm-onehub/_acceptance/cua-vao-noi-tieng-viet` (PR #2 bị chặn 06/09) |
| danh-sach-chep-ci-thieu-product-map | `kho crm-onehub — Mạnh gọi tên 2026-09-05` (CI đỏ 8 lượt) |
| nha-tai-lieu-router | `kho oneflow — Mạnh gọi tên 2026-09-13` (khảo sát 5 kho) |
| o-nuot-luat | `artifact-platform/_acceptance/trang-tu-van-v2` (r4) |
| phat-hien-den-duoc-nguoi-ky | `crm-onehub/_acceptance/nang-tran-trang-danh-ba` (08/09) |
| phep-kiem-sach-do-theo-vung | `acceptance-gate-kit/_acceptance/ra-co-ten-lam-va-trao` (23–24/08) |
| premerge-nhu-ci-truoc-khi-mo-pr | `kho acceptance-gate-kit — Mạnh gọi tên 2026-09-11` (PR #168 ba lượt đỏ) |
| rang-moc-neo-theo-ho-so | `acceptance-gate-kit/_acceptance/release-2-15-0` (răng đỏ giả ở ghim lại 2.16.0) |
| t1-tuyen-kem-can-cu | `kho acceptance-gate-kit — Mạnh gọi tên 2026-08-12` |
| thuoc-khong-lat-verdict | `acceptance-gate-kit/_acceptance/cong-nguoi-doc-du-nguon` (8 lượt chấm, 9 lần gọi người) |
| viec-ke-theo-plan | `kho oneflow — Mạnh gọi tên 2026-09-06` |
| y-dinh-co-nha-rieng | `kho acceptance-gate-kit — Mạnh gọi tên 2026-09-07` |
| phep-do-o-doc-lap-thuoc-co-cua | `kho acceptance-gate-kit — Mạnh gọi tên 2026-09-18` (Cổng Đáng, vá-trong-mốc) |
| vong-la-mot-ket-qua | `kho media-library — Mạnh gọi tên 2026-09-04` |
| o-chi-mo-khi-co-neo-ngoai | `kho acceptance-gate-kit — Mạnh gọi tên 2026-09-18` |

- [ ] **Step 2: Về hạt giống** (`stage: archived`, thêm dưới frontmatter: `> **Về hạt giống 18/09 (luật ô-có-neo):** chưa kho nào gọi tên — mở lại = thêm dòng \`Gốc:\` + \`stage: discovery\`. Chữ giữ nguyên.`) cho 6 ô: `ba-cho-tich-luy-khong-duong-ra` · `chieu-do-xanh-vi-ban-tiem-sap` (phát hiện của chính vòng) · `hinh-o-moi-cong-dung-cho-nguoi` · `luat-lai-may-duoc-hoi-quy` · `mot-khuon-cho-ben-viet-va-ben-doc` · `ngay-viec-vua-xong-lay-sai-nac` (đo trên fixture, chưa ca thật).
- [ ] **Step 3: Mốc 2.0.0** (`status: verified`, chưa ký, mốc đã phát hành 15/08): thêm vào Notes `Kho chờ nhận: media-library` (kho đã nhận 2.0.0 — sử liệu) + một dòng ghi chú.
- [ ] **Step 4:** `node scripts/product-map.mjs && node scripts/product-map.mjs --check`; `VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs` và `VC9` → xanh. Append sổ: `{"type":"fix","stage":"S3","decision":"rà 22 ô hàng chờ: 17 thêm Gốc · 6 về archived (danh sách trong commit) · mốc 2.0.0 thêm Kho chờ nhận","impact":"tồn kho chưa hợp đồng 46 → 40 đang mở; 0 ô thiếu neo"}`. Commit `chore(rà tồn kho): 17 ô thêm Gốc, 6 ô về hạt giống, mốc 2.0.0 khai kho`.

### Task 6: Lưới + trạng thái

- [ ] **Step 1:** Chạy bốn suite theo `feature_loop.suite_keys` (`bash tests/scripts/run-tests.sh`, `bash tests/hooks/run-tests.sh`, plugins, workflows) — mong xanh; đỏ ở đâu sửa ở đó (không nới lưới).
- [ ] **Step 2:** contract `status: implemented`, vẽ lại bản đồ, commit `chore(o-chi-mo-khi-co-neo-ngoai): S3 xong — contract sang implemented`. Vào S4 ngay.
