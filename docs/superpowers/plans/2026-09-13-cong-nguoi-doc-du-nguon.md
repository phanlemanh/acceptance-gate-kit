# Cổng người đọc đủ nguồn — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nối hai cổng người của kit vào đủ nguồn đang có — luật xanh-sạch đọc cả `review-findings.md`, bộ bóc tiêu chí đọc được dạng tiêu đề, thẻ Cổng Bằng chứng hiện lỗi trong hợp đồng chưa sửa.

**Architecture:** Mỗi VẬT có ĐÚNG MỘT bộ đọc; mọi bên tiêu thụ rút qua bộ đọc đó. Vật thứ nhất (`review-findings.md` + `decisions.jsonl`) đi qua `lib/out-of-contract.cjs`, được gói trong một vị từ ở `lib/evidence-core.cjs` theo đúng khuôn khối `CHU-KY-THAT` mà vòng `cua-veto-sau-chu-ky` vừa đặt. Vật thứ hai (mục tiêu chí) đi qua `lib/ac-line.cjs` với một lối vào mới `parseACBlock`. Không bên nào tự duyệt lại.

**Tech Stack:** Node CommonJS (`lib/**.cjs`), Node ESM (`scripts/khong-can-nguoi.mjs`), POSIX shell + awk (`scripts/pre-merge-check.sh`), không phụ thuộc ngoài.

**Spec:** `docs/superpowers/specs/2026-09-12-cong-nguoi-doc-du-nguon-design.md`
**Hợp đồng:** `_acceptance/cong-nguoi-doc-du-nguon/contract.md` (14 AC, 17 eval, duyệt 2026-09-13)

## Global Constraints

- **DV5 chỉ-được-THÊM** áp cho ĐÚNG hai tệp: `scripts/pre-merge-check.sh` và `scripts/recheck-evidence.cjs` (`tests/scripts/additive-only.test.mjs`, hằng `FILES`). Mọi thay đổi ở hai tệp đó phải là dòng THÊM. Cần sửa hành vi của một dòng cũ thì viết **một dòng ĐÈ phía sau**, đúng tiền lệ `if (a && a.crossLayer === false) out.delete(a.id);` đang có. Không tệp nào khác bị luật này canh.
- **Mọi tệp trong `lib/` chép sang kho tiêu thụ phải có đuôi `.cjs`** — kho `type: module` nạp `.js` thành ESM và `require` chết.
- **Fixture do CODE SINH trong chính lượt chạy.** Không đọc hợp đồng thật của kho làm fixture; hồ sơ đã ký là sử liệu. Hình dạng lấy từ hồ sơ thật thì CHÉP CHUỖI vào tệp ca.
- **Mỗi phép đo mới phải chạy hai chiều trên CÙNG fixture**: vật lành → xanh (đối chứng dương, chạy TRƯỚC), rồi hoàn nguyên đúng một đường trên BẢN SAO → đỏ với ĐÚNG thông điệp ghim. Bản sao `.cjs`/`.mjs` phải qua `node --check`. Mũi tiêm phải khớp đúng một lần.
- **Mọi đường dẫn trong tệp ca suy từ vị trí tệp ca** (`fileURLToPath(import.meta.url)`), không hằng nào trỏ checkout của tác giả.
- **Tệp ca chung:** `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`, bộ chọn biến môi trường `CNDN_CASES`. Mỗi ca in ĐÚNG MỘT dòng `PASS: CNxx …` hoặc `FAIL: CNxx … (DO: …)`; chi tiết in với tiền tố `    · `. `CNDN_CASES` khớp 0 ca → thoát khác 0, in `CNDN_CASES khop 0 ca`.
- **Vị từ «mục CHỜ NGƯỜI»** (khai ở mục Context của hợp đồng): số phần tử dưới `## Ngoài hợp đồng` cộng `## Trong hợp đồng` của `review-findings.md`, TRỪ số dòng `decisions.jsonl` khai `stage: "gate2"`. Lớn hơn 0 là còn chờ người.
- **Không sửa hồ sơ `_acceptance/<slug>/` nào khác** ngoài `cong-nguoi-doc-du-nguon`.
- Commit theo khuôn `<type>(cong-nguoi-doc-du-nguon): <mô tả>`, kết bằng dòng `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Bẫy hook đã biết:** không ghép `git commit` chung lệnh với `sed -n` / `grep -n` — hook `block-no-verify` bắt chuỗi ` -n` trong cả lệnh và chặn. Tách thành hai lệnh.

---

## File Structure

| Tệp | Trách nhiệm | Tạo/Sửa |
|---|---|---|
| `lib/out-of-contract.cjs` | Bộ đọc DUY NHẤT của `review-findings.md` — cả `Ngoài hợp đồng` lẫn `Trong hợp đồng` | Đổi tên từ `.js` + sửa |
| `lib/evidence-core.cjs` | Vị từ «mục chờ người» + điều kiện xanh-sạch thứ bảy, khối marker `MUC-CHO-NGUOI` | Sửa |
| `lib/ac-line.cjs` | Bộ bóc tiêu chí — thêm `parseACBlock`, `criteriaLines`, nới `AC_SUSPECT` | Sửa |
| `scripts/khong-can-nguoi.mjs` | Bản dựng mjs của luật xanh-sạch + cửa GHI | Sửa |
| `scripts/pre-merge-check.sh` | Bản dựng bash + nhánh đọc-cũ + nới răng cross-layer (CHỈ THÊM) | Sửa |
| `scripts/gate-card.js` | Khối «Trong hợp đồng» ở thẻ Cổng Bằng chứng; đổi sang `parseACBlock`; bộ đọc `Coverage` nhận bảng và văn xuôi | Sửa |
| `scripts/evidence-page.js`, `scripts/eval-coverage-lint.js` | Đổi sang `parseACBlock` | Sửa |
| `skills/acceptance/references/evidence-report-template.md` | Điều kiện thứ bảy vào khối `EVIDENCE-XANH-SACH-BLOCK`; khoá `findings_open` | Sửa |
| `feature-loop/workflows/acceptance-verify.js` | Bên VIẾT điền `findings_open` | Sửa |
| `commands/acceptance-init.md` | `INIT-CI-COPY-LIST` thêm `lib/out-of-contract.cjs` | Sửa |
| `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` | 14 ca CN01–CN14, lưới thường trực | Tạo |
| `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs` | Phép đo bán kính năm trục | Tạo |

---

### Task 1: Bộ đọc một nguồn — `out-of-contract` đọc cả hai mục

**Files:**
- Rename: `lib/out-of-contract.js` → `lib/out-of-contract.cjs`
- Modify: `lib/out-of-contract.cjs` (thêm `HEAD_IN`, trường `inContract`)
- Modify: `scripts/gate-card.js:34` (đường require)
- Modify: `tests/scripts/out-of-contract.test.mjs:13,53` (đường require)
- Modify: `tests/plugins/run-tests.sh:670` và chú thích ở dòng 660 và 6980
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN14)

**Interfaces:**
- Consumes: không gì từ task trước.
- Produces: `require('./out-of-contract.cjs')` trả `{ parse, PROPOSALS, OOC_GLOSS_NGUOI }`. `parse(text)` nay trả thêm `inContract: Array<{title,file,severity,proposal,proposal_raw,plain}>` — cùng hình dạng phần tử với `findings`.

- [ ] **Step 1: Đổi tên tệp và sửa mọi chỗ trỏ tới**

```bash
cd /Users/manh-macmini/dev/acceptance-gate-kit/.claude/worktrees/cong-nguoi-doc-du-nguon
git mv lib/out-of-contract.js lib/out-of-contract.cjs
```

Sửa `scripts/gate-card.js` dòng 34:

```js
const outOfContract = require('../lib/out-of-contract.cjs');
```

Sửa `tests/scripts/out-of-contract.test.mjs` dòng 13 và 53: đổi `'out-of-contract.js'` thành `'out-of-contract.cjs'`.

Sửa `tests/plugins/run-tests.sh` dòng 670: đổi `lib/out-of-contract.js` thành `lib/out-of-contract.cjs`. Sửa chú thích dòng 660 cho khớp, và sửa chú thích dòng 6980 — câu «`out-of-contract.js` (file không chép sang consumer nên giữ đuôi cũ)» nay SAI, thay bằng «`out-of-contract.cjs` (nay chép sang consumer theo INIT-CI-COPY-LIST nên phải là `.cjs`)».

- [ ] **Step 2: Chạy hai suite để chắc việc đổi tên không gãy gì**

Run: `node tests/scripts/out-of-contract.test.mjs && bash tests/plugins/run-tests.sh 2>&1 | tail -3`
Expected: cả hai PASS, `Results:` không có `failed` khác 0.

- [ ] **Step 3: Commit bước đổi tên**

```bash
git add -A lib scripts/gate-card.js tests
git commit -F - <<'MSG'
refactor(cong-nguoi-doc-du-nguon): out-of-contract thành .cjs vì nay chép sang kho tiêu thụ

Kho type: module nạp .js thành ESM và require chết. Chú thích cũ nói tệp
không chép sang consumer — lý do đó hết hiệu lực trong chính vòng này.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

- [ ] **Step 4: Viết ca CN14 — round-trip rút-từ-writer-đọc-bằng-reader (ĐỎ trước)**

Tạo `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` với bộ khung ca và ĐÚNG ca CN14:

```js
// CN — cổng người đọc đủ nguồn (hồ sơ cong-nguoi-doc-du-nguon, 13/09/2026).
//
// Ca VĨNH VIỄN: suite scripts tự chạy mọi *.test.mjs qua glob. Luật đo ở đầu
// evals.yaml của hồ sơ; tóm tắt: fixture do CODE SINH trong chính lượt chạy,
// mỗi ca chạy hai chiều trên CÙNG fixture (đối chứng dương TRƯỚC, rồi mũi tiêm
// trên BẢN SAO phải ĐỎ với thông điệp ghim), mọi đường dẫn suy từ vị trí tệp này.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const SELF = fileURLToPath(import.meta.url);
const HERE = path.dirname(SELF);
const ROOT = path.resolve(HERE, '..', '..');
const req = createRequire(import.meta.url);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'cndn-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };

const CASES = {};
const fails = [];
const def = (id, fn) => { CASES[id] = fn; };
const say = (id, ok, why, chi) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${id}${ok ? '' : ` (DO: ${why})`}`);
  for (const c of chi || []) console.log(`    · ${c}`);
  if (!ok) fails.push(id);
};

// ── CN14: khuôn mục rút từ BÊN VIẾT, đọc bằng BÊN ĐỌC ───────────────────
def('CN14', () => {
  const chi = [];
  const wf = fs.readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/);
  if (!m) return say('CN14', false, 'KHONG rut duoc OOC-ITEM-TEMPLATE tu writer', chi);
  const khuon = m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
  if (!/\{title\}/.test(khuon)) return say('CN14', false, 'khuon rut ra khong co {title} — marker da troi', chi);
  chi.push(`khuôn rút từ writer: ${khuon.split('\n')[0]}`);

  const muc = (n, i) => khuon
    .replace('{title}', `${n}-${i}`).replace('{plain}', `người dùng thấy ${n}-${i}`)
    .replace('{file}', `src/${n}${i}.ts`).replace('{severity}', 'medium')
    .replace('{proposal}', 'known-limits');
  const rf = [
    '## Trong hợp đồng', '', muc('trong', 1), muc('trong', 2), '',
    '## Ngoài hợp đồng — người quyết ở Gate 2', '', muc('ngoai', 1), muc('ngoai', 2), muc('ngoai', 3), '',
  ].join('\n');

  const ooc = req(path.join(ROOT, 'lib', 'out-of-contract.cjs'));
  const r = ooc.parse(rf);
  const soNgoai = (r.findings || []).length;
  const soTrong = (r.inContract || []).length;
  chi.push(`bên đọc thấy ngoài=${soNgoai} trong=${soTrong}`);
  if (soNgoai !== 3) return say('CN14', false, `ngoai=${soNgoai}, cho 3`, chi);
  if (soTrong !== 2) return say('CN14', false, `trong=${soTrong}, cho 2`, chi);

  // Chiều đỏ (a): khuôn bên VIẾT đổi mà bên đọc vẫn ra số cũ là ĐỎ.
  const khuonKhac = khuon.replace('- **{title}**', '### {title}');
  const mucKhac = (n, i) => khuonKhac
    .replace('{title}', `${n}-${i}`).replace('{plain}', 'x')
    .replace('{file}', 'x.ts').replace('{severity}', 'low').replace('{proposal}', 'known-limits');
  const rfKhac = ['## Ngoài hợp đồng', '', mucKhac('ngoai', 1), mucKhac('ngoai', 2), mucKhac('ngoai', 3), ''].join('\n');
  const rKhac = ooc.parse(rfKhac);
  if ((rKhac.findings || []).length === 3) {
    return say('CN14', false, 'ben doc khong theo ben viet — doi khuon van ra 3', chi);
  }
  chi.push(`chiều đỏ (a): khuôn đổi → bên đọc ra ${(rKhac.findings || []).length}, khác 3 như mong đợi`);
  say('CN14', true, '', chi);
});

// ── chạy ────────────────────────────────────────────────────────────────
const chon = (process.env.CNDN_CASES || '').split(/[,\s]+/).filter(Boolean);
const ids = Object.keys(CASES).filter(id => !chon.length || chon.includes(id));
if (!ids.length) { console.error('CNDN_CASES khop 0 ca'); process.exit(1); }
for (const id of ids) CASES[id]();
console.log(`\nResults: ${ids.length - fails.length} passed, ${fails.length} failed (cong-nguoi-doc-du-nguon)`);
process.exit(fails.length ? 1 : 0);
```

- [ ] **Step 5: Chạy CN14 để xác nhận nó ĐỎ vì đúng lý do**

Run: `CNDN_CASES=CN14 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: FAIL với `(DO: trong=0, cho 2)` — bộ đọc chưa biết mục `Trong hợp đồng`. Nếu đỏ vì lý do khác (`KHONG rut duoc OOC-ITEM-TEMPLATE`) thì dừng và sửa marker trước.

- [ ] **Step 6: Thêm đọc mục `Trong hợp đồng` vào bộ đọc**

Trong `lib/out-of-contract.cjs`, ngay dưới `const HEAD_UNCLASSIFIED`:

```js
// Mục «Trong hợp đồng» — lỗi THẬT nằm trong phạm vi đã duyệt mà vòng sửa chưa
// dọn. Trước hồ sơ cong-nguoi-doc-du-nguon KHÔNG bộ đọc nào chạm mục này: bên
// viết vẫn in nó (acceptance-verify.js sinh cả ba tiêu đề), thẻ không đọc, và
// luật xanh-sạch cũng không. Một hồ sơ dừng-vá có thể mang lỗi có mã AC mà
// không bề mặt nào của người quyết nhìn thấy.
const HEAD_IN = /^##\s+Trong hợp đồng/;
```

Trong `parse(text)`, sau `const outLines = sectionLines(lines, HEAD_OUT);`:

```js
  const inLines = sectionLines(lines, HEAD_IN);
```

Và trong object trả về, thêm ngay sau `findings`:

```js
    // Cùng bộ bóc với `findings`: hai mục dùng CHUNG khuôn OOC-ITEM-TEMPLATE ở
    // bên viết, nên bóc hai lần bằng hai khuôn là dựng lại đúng lớp lỗi
    // bên-đọc-trôi-khỏi-bên-viết mà vòng này đi đóng.
    inContract: inLines ? parseFindings(inLines) : [],
```

Sửa luôn `present` để mục `Trong hợp đồng` một mình cũng tính là có khuôn triage:

```js
    present: outLines !== null || inLines !== null || unclassified,
```

- [ ] **Step 7: Chạy CN14 và suite cũ**

Run: `CNDN_CASES=CN14 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs && node tests/scripts/out-of-contract.test.mjs`
Expected: CN14 PASS; suite cũ vẫn PASS (không ca nào ghim `present` theo nghĩa cũ bị vỡ — nếu vỡ, đó là phát hiện thật, sửa ca cũ và ghi lý do trong commit).

- [ ] **Step 8: Commit**

```bash
git add lib/out-of-contract.cjs tests/scripts/cong-nguoi-doc-du-nguon.test.mjs
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): bộ đọc review-findings đọc cả mục Trong hợp đồng

AC-14. Ca CN14 rút khuôn mục từ marker OOC-ITEM-TEMPLATE của bên VIẾT trong
chính lượt chạy rồi đọc lại bằng bên đọc — marker vắng hoặc rút ra rỗng làm
ca ĐỎ có tên, không xanh lặng.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 2: Vị từ «mục chờ người» trong lõi

**Files:**
- Modify: `lib/evidence-core.cjs` (thêm khối marker `MUC-CHO-NGUOI` trước `module.exports`, thêm hai tên vào `module.exports`)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN04, và ô (1) của CN03)

**Interfaces:**
- Consumes: `lib/out-of-contract.cjs` `parse()` từ Task 1.
- Produces:
  - `mucChoNguoi({ findingsText, ledgerText })` → `{ n, ngoai, trong, daDinhDoat, docDuoc, why }`. `docDuoc: false` khi không nạp được bộ đọc; `why` khi đó nêu tên tệp và `INIT-CI-COPY-LIST`.
  - `dieuKienFindings({ findingsText, ledgerText, reportText })` → `{ clean, why, doiCu }`. `doiCu: true` khi báo cáo VẮNG khoá `findings_open` hoặc `findingsText == null`.

- [ ] **Step 1: Viết ca CN04 (ma trận 6 ô) và ô (1) của CN03 — ĐỎ trước**

Thêm vào `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`:

```js
// Dựng văn bản fixture — dùng lại ở nhiều ca.
const rfText = (ngoai, trong) => {
  const muc = (n, i) => `- **${n}-${i}**\n  Người dùng thấy gì: ${n}-${i}\n  file: \`src/${n}${i}.ts\`\n  severity: medium\n  Đề xuất: known-limits`;
  const out = [];
  if (trong > 0) { out.push('## Trong hợp đồng', ''); for (let i = 1; i <= trong; i++) out.push(muc('trong', i)); out.push(''); }
  out.push('## Ngoài hợp đồng — người quyết ở Gate 2', '');
  for (let i = 1; i <= ngoai; i++) out.push(muc('ngoai', i));
  return out.join('\n') + '\n';
};
const soText = (soGate2, soKhac = 0) => {
  const ln = [];
  for (let i = 0; i < soGate2; i++) ln.push(JSON.stringify({ id: `d-x-${i}`, type: 'descope', stage: 'gate2', at: '2026-09-13T00:00:00Z', decision: 'x', impact: 'y' }));
  for (let i = 0; i < soKhac; i++) ln.push(JSON.stringify({ id: `d-y-${i}`, type: 'fix', stage: 'S4-r1', at: '2026-09-13T00:00:00Z', decision: 'x', impact: 'y' }));
  return ln.join('\n') + (ln.length ? '\n' : '');
};
const baoCao = (findingsOpen) => [
  '---', 'schema_version: 1', 'verdict: PASS',
  ...(findingsOpen == null ? [] : [`findings_open: ${findingsOpen}`]),
  '---', '', '## Known limits', '', '## Ngoài hợp đồng', '',
].join('\n');

def('CN04', () => {
  const chi = [];
  const core = req(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  // ô, mỗi ô: [tên, khoá findings_open, số mục ngoài, số mục trong, số dòng gate2, mong đợi sạch, chuỗi phải có trong why]
  const O = [
    ['khoá 0 · vật 0', 0, 0, 0, 0, true, ''],
    ['khoá 2 · vật 2', 2, 2, 0, 0, false, '2'],
    ['khoá 0 · vật 2', 0, 2, 0, 0, false, 'lệch'],
    ['khoá 5 · vật 2', 5, 2, 0, 0, false, 'lệch'],
    ['khoá 0 · 2 mục 2 định đoạt', 0, 2, 0, 2, true, ''],
    ['khoá 2 · 2 mục 2 định đoạt', 2, 2, 0, 2, false, 'lệch'],
  ];
  for (const [ten, khoa, ng, tr, g2, mongSach, phaiCo] of O) {
    const r = core.dieuKienFindings({ findingsText: rfText(ng, tr), ledgerText: soText(g2), reportText: baoCao(khoa) });
    chi.push(`${ten} → clean=${r.clean} why="${r.why}"`);
    if (r.clean !== mongSach) return say('CN04', false, `ô «${ten}» clean=${r.clean}, cho ${mongSach}`, chi);
    if (phaiCo && !String(r.why).includes(phaiCo)) return say('CN04', false, `ô «${ten}» why thiếu "${phaiCo}"`, chi);
  }
  say('CN04', true, '', chi);
});
```

- [ ] **Step 2: Chạy để xác nhận ĐỎ vì hàm chưa tồn tại**

Run: `CNDN_CASES=CN04 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: ném `TypeError: core.dieuKienFindings is not a function`, hoặc FAIL ô đầu. Cả hai đều là đỏ đúng lý do.

- [ ] **Step 3: Viết khối `MUC-CHO-NGUOI` trong `lib/evidence-core.cjs`**

Chèn ngay TRƯỚC `module.exports = {`:

```js
// <<<MUC-CHO-NGUOI — MỘT NGUỒN của vị từ «mục chờ người» và của điều kiện
// xanh-sạch THỨ BẢY (hồ sơ cong-nguoi-doc-du-nguon, Cổng Phạm vi 13/09).
//
// VÌ SAO: luật xanh-sạch cũ kết luận CHỈ từ evidence-report.md, trong khi làn
// rà soát cùng lượt ghi phát hiện vào review-findings.md. Đo trên 8 kho: 4 hồ
// sơ đi làn V hoặc máy-thông với mục chưa ai quyết, 2 trong đó nằm trên nhánh
// chính của chính kit.
//
// ĐỊNH NGHĨA «mục chờ người» — số mục ở HAI tiêu đề TRỪ số dòng sổ khai
// stage gate2. Trừ đi sổ chứ không đếm trần: một phát hiện đã được người định
// đoạt ở Cổng Bằng chứng để lại đúng một dòng sổ, và đếm trần sẽ làm mọi hồ sơ
// từng có phát hiện rồi đã xử vĩnh viễn KHÔNG-sạch. Đây là phép ĐẾM, không
// phải phép ghép từng mục với từng định đoạt — lệch về phía MỜI KÝ.
//
// FAIL-CLOSED: không nạp được lib/out-of-contract.cjs thì trả doc-duoc = false
// và KHÔNG bao giờ trả sạch — cùng nếp với checkRepinEvals khi thiếu eval-yaml.
function _bodocOOC() {
  try { return require(path.join(__dirname, 'out-of-contract.cjs')); } catch (_) { return null; }
}
function mucChoNguoi({ findingsText, ledgerText }) {
  const bo = _bodocOOC();
  if (!bo) {
    return { n: null, ngoai: 0, trong: 0, daDinhDoat: 0, docDuoc: false,
      why: 'không nạp được lib/out-of-contract.cjs cạnh lib/evidence-core.cjs — chép đủ INIT-CI-COPY-LIST rồi chạy lại' };
  }
  if (findingsText == null) {
    return { n: null, ngoai: 0, trong: 0, daDinhDoat: 0, docDuoc: false, why: 'không có review-findings.md' };
  }
  const r = bo.parse(String(findingsText));
  const ngoai = (r.findings || []).length;
  const trong = (r.inContract || []).length;
  let daDinhDoat = 0;
  for (const l of String(ledgerText == null ? '' : ledgerText).split('\n')) {
    if (!l.trim()) continue;
    let o; try { o = JSON.parse(l); } catch (_) { continue; }
    if (String(o && o.stage) === 'gate2') daDinhDoat += 1;
  }
  const n = Math.max(0, ngoai + trong - daDinhDoat);
  return { n, ngoai, trong, daDinhDoat, docDuoc: true, why: '' };
}
// Điều kiện thứ bảy. `doiCu` = đường đọc-cũ: báo cáo VẮNG khoá findings_open,
// hoặc review-findings.md vắng hẳn. Bên gọi quyết hạ xuống NOTE hay không —
// vị từ chỉ nói SỰ THẬT, không tự quyết mức nghiêm trọng.
function dieuKienFindings({ findingsText, ledgerText, reportText }) {
  const m = mucChoNguoi({ findingsText, ledgerText });
  if (!m.docDuoc) {
    const vangTep = findingsText == null;
    return { clean: false, why: m.why, doiCu: vangTep };
  }
  const raw = frontmatterField(reportText, 'findings_open');
  const khai = raw == null || String(raw).trim() === '' ? null : String(raw).trim();
  if (khai === null) {
    return m.n > 0
      ? { clean: false, why: `còn ${m.n} mục chờ người ở «Ngoài hợp đồng»/«Trong hợp đồng» (${m.ngoai}+${m.trong} mục, ${m.daDinhDoat} đã định đoạt); báo cáo VẮNG khoá findings_open`, doiCu: true }
      : { clean: true, why: '', doiCu: true };
  }
  if (!/^\d+$/.test(khai) || Number(khai) !== m.n) {
    return { clean: false, doiCu: false,
      why: `lời khai lệch vật: findings_open khai ${khai}, vật còn ${m.n} mục chờ người (${m.ngoai}+${m.trong} mục, ${m.daDinhDoat} đã định đoạt)` };
  }
  return m.n > 0
    ? { clean: false, doiCu: false, why: `còn ${m.n} mục chờ người ở «Ngoài hợp đồng»/«Trong hợp đồng» (${m.ngoai}+${m.trong} mục, ${m.daDinhDoat} đã định đoạt)` }
    : { clean: true, why: '', doiCu: false };
}
// MUC-CHO-NGUOI>>>
```

Thêm vào `module.exports`, ngay sau `vetoGateState,`:

```js
  mucChoNguoi,
  dieuKienFindings,
```

- [ ] **Step 4: Chạy CN04**

Run: `CNDN_CASES=CN04 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: PASS, sáu dòng `    · ` in ra sáu ô.

- [ ] **Step 5: Viết ô (1) của CN03 — fail-closed khi vắng bộ đọc**

```js
def('CN03a', () => {
  const chi = [];
  const d = mk('failclosed-');
  fs.cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  const core = req(path.join(d, 'lib', 'evidence-core.cjs'));
  // Đối chứng dương TRƯỚC: bản sao nguyên vẹn, 2 mục chờ người → KHÔNG-sạch nêu 2.
  const duong = core.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: soText(0), reportText: baoCao(2) });
  chi.push(`đối chứng dương: clean=${duong.clean} why="${duong.why}"`);
  if (duong.clean || !duong.why.includes('2')) return say('CN03a', false, 'doi chung duong khong dat', chi);
  // Xoá bộ đọc rồi nạp một bản MỚI (xoá cache require).
  fs.rmSync(path.join(d, 'lib', 'out-of-contract.cjs'));
  const d2 = mk('failclosed-b-');
  fs.cpSync(path.join(d, 'lib'), path.join(d2, 'lib'), { recursive: true });
  const core2 = req(path.join(d2, 'lib', 'evidence-core.cjs'));
  const r = core2.dieuKienFindings({ findingsText: rfText(2, 0), ledgerText: soText(0), reportText: baoCao(2) });
  chi.push(`vắng bộ đọc: clean=${r.clean} why="${r.why}"`);
  if (r.clean) return say('CN03a', false, 'vang bo doc ma van SACH', chi);
  if (!r.why.includes('out-of-contract.cjs') || !r.why.includes('INIT-CI-COPY-LIST')) {
    return say('CN03a', false, 'why khong neu dich danh tep thieu', chi);
  }
  say('CN03a', true, '', chi);
});
```

- [ ] **Step 6: Chạy cả hai ca**

Run: `CNDN_CASES="CN03a CN04 CN14" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: `Results: 3 passed, 0 failed`.

- [ ] **Step 7: Commit**

```bash
git add lib/evidence-core.cjs tests/scripts/cong-nguoi-doc-du-nguon.test.mjs
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): vị từ «mục chờ người» và điều kiện xanh-sạch thứ bảy

AC-2, AC-3, AC-4. Khối marker MUC-CHO-NGUOI trong lib/evidence-core.cjs theo
đúng khuôn CHU-KY-THAT: ngữ pháp khai một chỗ, hai bản dựng hỏi vào.

Vị từ TRỪ số dòng sổ khai stage gate2 chứ không đếm trần — đếm trần làm mọi
hồ sơ từng có phát hiện rồi đã xử vĩnh viễn không sạch.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 3: Bản dựng mjs — `xanhSach` và cửa GHI

**Files:**
- Modify: `scripts/khong-can-nguoi.mjs` (`xanhSach` nhận đối số thứ ba; CLI đọc thêm hai tệp)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN06)

**Interfaces:**
- Consumes: `dieuKienFindings` từ Task 2.
- Produces: `xanhSach(contractTxt, evidenceTxt, phu)` với `phu = { findingsText, ledgerText }` — đối số thứ ba TUỲ CHỌN; vắng nó thì điều kiện thứ bảy KHÔNG chạy (mọi bên gọi cũ giữ nguyên hành vi). `khongCanNguoi(contractTxt, evidenceTxt, phu)` truyền tiếp.

- [ ] **Step 1: Viết ca CN06 — cửa GHI đọc thẳng vật (ĐỎ trước)**

```js
def('CN06', () => {
  const chi = [];
  const d = mk('cuaghi-');
  const ws = path.join(d, '_acceptance', 'x');
  fs.mkdirSync(ws, { recursive: true });
  const hopDong = ['---', 'schema_version: 1', 'slug: x', 'risk_tier: T2', 'status: verified   # draft | approved',
    'approved_by: Người Duyệt', 'veto_state: mo', 'veto_opened_at: 2026-09-13T00:00:00Z', '---', '', '## Criteria', '', '- AC-1: Given a, When b, Then c', ''].join('\n');
  const chay = () => {
    const r = require('node:child_process').spawnSync(process.execPath,
      [path.join(ROOT, 'scripts', 'khong-can-nguoi.mjs'), '--write', '--root', d, '--slug', 'x'],
      { encoding: 'utf8' });
    return { ma: r.status, err: String(r.stderr || '') };
  };
  // Đối chứng dương TRƯỚC: review-findings RỖNG → ghi được.
  fs.writeFileSync(path.join(ws, 'contract.md'), hopDong);
  fs.writeFileSync(path.join(ws, 'evidence-report.md'), baoCao(null));
  fs.writeFileSync(path.join(ws, 'review-findings.md'), '## Trong hợp đồng\n\n## Ngoài hợp đồng\n\n');
  fs.writeFileSync(path.join(ws, 'decisions.jsonl'), '');
  const a = chay();
  const sauA = fs.readFileSync(path.join(ws, 'contract.md'), 'utf8');
  chi.push(`đối chứng dương: mã=${a.ma}, status→${/status:\s*(\S+)/.exec(sauA)[1]}`);
  if (a.ma !== 0 || !/status:\s*machine-cleared/.test(sauA)) return say('CN06', false, `doi chung duong: ma=${a.ma}`, chi);
  // Ô thật: 2 mục chờ người, báo cáo VẮNG khoá → vẫn phải CHẶN.
  fs.writeFileSync(path.join(ws, 'contract.md'), hopDong);
  fs.writeFileSync(path.join(ws, 'review-findings.md'), rfText(2, 0));
  const truoc = fs.readFileSync(path.join(ws, 'contract.md'));
  const b = chay();
  const sau = fs.readFileSync(path.join(ws, 'contract.md'));
  chi.push(`vắng khoá + 2 mục: mã=${b.ma}, stderr="${b.err.trim().slice(0, 120)}"`);
  if (b.ma !== 2) return say('CN06', false, `cua ghi di qua loi khai — ma=${b.ma}, cho 2`, chi);
  if (!b.err.includes('2')) return say('CN06', false, 'stderr khong neu so muc', chi);
  if (!truoc.equals(sau)) return say('CN06', false, 'da GHI DIA du bi chan', chi);
  say('CN06', true, '', chi);
});
```

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `CNDN_CASES=CN06 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: FAIL `(DO: cua ghi di qua loi khai — ma=0, cho 2)`.

- [ ] **Step 3: Sửa `xanhSach` nhận đối số thứ ba**

Trong `scripts/khong-can-nguoi.mjs`, đổi dòng khai báo và thêm nhánh cuối:

```js
export function xanhSach(contractTxt, evidenceTxt, phu) {
```

Ngay TRƯỚC `return { clean: true, why: '' };` cuối hàm, chèn:

```js
  // Điều kiện THỨ BẢY (hồ sơ cong-nguoi-doc-du-nguon). `phu` vắng ⇒ bên gọi
  // đời cũ, không chạy điều kiện này — đường đọc-cũ ở TẦNG API, để mọi bên gọi
  // hiện có giữ nguyên hành vi cho tới khi chúng truyền vật vào.
  if (phu) {
    const { dieuKienFindings } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));
    const f = dieuKienFindings({ findingsText: phu.findingsText, ledgerText: phu.ledgerText, reportText: evidenceTxt });
    if (!f.clean) return { clean: false, why: f.why, doiCu: !!f.doiCu };
  }
```

Sửa `khongCanNguoi` để truyền tiếp:

```js
export function khongCanNguoi(contractTxt, evidenceTxt, phu) {
```

và đổi dòng gọi bên trong thành `if (!xanhSach(contractTxt, evidenceTxt, phu).clean) return null;`.

- [ ] **Step 4: Sửa CLI đọc hai tệp và truyền vào**

Trong khối `if (_isMain)`, sau hai dòng đọc `contract` và `evidence`, thêm:

```js
  let findingsText = null, ledgerText = '';
  try { findingsText = fs.readFileSync(path.join(root, '_acceptance', slug, 'review-findings.md'), 'utf8'); } catch { findingsText = null; }
  try { ledgerText = fs.readFileSync(path.join(root, '_acceptance', slug, 'decisions.jsonl'), 'utf8'); } catch { ledgerText = ''; }
  const phu = { findingsText, ledgerText };
```

Đổi hai lời gọi trong biểu thức `why` thành `khongCanNguoi(contract, evidence, phu)` và `xanhSach(contract, evidence, phu).why`.

- [ ] **Step 5: Chạy CN06 và ca cũ của làn V**

Run: `CNDN_CASES=CN06 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs && node tests/plugins/ra-co-ten.test.mjs 2>&1 | tail -3`
Expected: CN06 PASS. `ra-co-ten` có thể ĐỎ ở ca RT1 (khối bảy điều kiện chưa cập nhật) — đó là Task 5; ghi lại và đi tiếp, KHÔNG sửa RT1 ở task này.

- [ ] **Step 6: Commit**

```bash
git add scripts/khong-can-nguoi.mjs tests/scripts/cong-nguoi-doc-du-nguon.test.mjs
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): bản dựng mjs và cửa GHI đọc vật, không đọc lời khai

AC-6. xanhSach nhận đối số thứ ba tuỳ chọn nên mọi bên gọi đời cũ giữ nguyên
hành vi; CLI --write luôn truyền vật vào, nên hồ sơ MỚI không vào được trạng
thái máy-thông với mục còn treo kể cả khi báo cáo vắng khoá findings_open.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 4: Bản dựng bash — điều kiện thứ bảy và đường đọc-cũ

**Files:**
- Modify: `scripts/pre-merge-check.sh` (CHỈ THÊM — xem Global Constraints)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN01, CN05, CN03b)

**Interfaces:**
- Consumes: `dieuKienFindings` từ Task 2.
- Produces: `xanh_sach_check` nay đặt thêm biến toàn cục `CLEAN_DOI_CU` (`1` khi trượt điều kiện thứ bảy theo đường đọc-cũ, `0` ngược lại). Bên gọi dùng nó để chọn NOTE hay VIOLATION.

- [ ] **Step 1: Viết ba ca — CN01 (hai bản dựng cùng lý do), CN05 (đọc-cũ), CN03b (vắng node)**

Ca CN01 gọi `dieuKienFindings` cho vế mjs và chạy một kho git tạm qua `pre-merge-check.sh` cho vế bash, rồi so chuỗi lý do sau khi chuẩn hoá khoảng trắng. Ca CN05 dựng hồ sơ làn V và đòi dòng `NOTE` mang slug, KHÔNG có `VIOLATION` cho slug đó, và mã thoát bằng đúng mã của lượt chạy khi `review-findings.md` rỗng. Ca CN03b chạy lưới với `PATH` chỉ chứa một thư mục bin tạm không có `node`.

Khuôn dựng kho tạm — chép từ `tests/scripts/repin-lane-lop-cu.test.mjs` (hàm dựng kho git tạm ở đầu tệp đó), KHÔNG viết lại từ đầu: nó đã xử `git init`, cấu hình tên/email, và commit đầu.

- [ ] **Step 2: Chạy ba ca để xác nhận ĐỎ vì đúng lý do**

Run: `CNDN_CASES="CN01 CN05 CN03b" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: cả ba FAIL. CN01 đỏ vì vế bash trả SẠCH; CN05 đỏ vì không có dòng NOTE; CN03b đỏ vì vắng node thì điều kiện thứ bảy im.

- [ ] **Step 3: Thêm điều kiện thứ bảy vào `xanh_sach_check` (CHỈ THÊM)**

Trong `scripts/pre-merge-check.sh`, ngay TRƯỚC dòng `CLEAN_WHY="$clean_why"` ở cuối hàm, chèn:

```sh
  # Điều kiện THỨ BẢY (hồ sơ cong-nguoi-doc-du-nguon): còn mục chờ người ở
  # review-findings.md thì KHÔNG sạch. Ngữ pháp sống MỘT chỗ — khối
  # MUC-CHO-NGUOI của lib/evidence-core.cjs; ở đây chỉ hỏi.
  # CLEAN_DOI_CU=1 nghĩa là trượt theo ĐƯỜNG ĐỌC-CŨ (báo cáo vắng khoá
  # findings_open, hoặc review-findings.md vắng hẳn) — bên gọi hạ xuống NOTE.
  CLEAN_DOI_CU=0
  if [ "$clean_ok" -eq 1 ]; then
    _fjson="$(AGK_DIR="$_cdir" AGK_REPORT="$report" node -e '
      const fs = require("fs"); const path = require("path");
      const core = require(process.argv[1]);
      const doc = (p) => { try { return fs.readFileSync(p, "utf8"); } catch (_) { return null; } };
      const d = process.env.AGK_DIR;
      const r = core.dieuKienFindings({
        findingsText: doc(path.join(d, "review-findings.md")),
        ledgerText: doc(path.join(d, "decisions.jsonl")) || "",
        reportText: doc(process.env.AGK_REPORT),
      });
      process.stdout.write(JSON.stringify({ clean: !!r.clean, why: String(r.why || ""), doiCu: !!r.doiCu }));
    ' "$ROOT/lib/evidence-core.cjs" 2>/dev/null)"
    if [ -z "$_fjson" ]; then
      clean_ok=0
      clean_why="không chấm được điều kiện «mục chờ người» (thiếu node hoặc lib/evidence-core.cjs) — fail-closed, chép đủ INIT-CI-COPY-LIST"
    else
      case "$_fjson" in
        *'"clean":false'*)
          clean_ok=0
          clean_why="$(printf '%s' "$_fjson" | sed -e 's/.*"why":"//' -e 's/","doiCu".*//')"
          case "$_fjson" in *'"doiCu":true'*) CLEAN_DOI_CU=1 ;; esac ;;
      esac
    fi
  fi
```

Lưu ý fail-CLOSED: `node` vắng thì `_fjson` rỗng và hàm kết luận KHÔNG sạch — đây là vế AC-3 ô (2). Không được đổi thành «bỏ qua».

- [ ] **Step 4: Thêm nhánh đọc-cũ ở hai chỗ gọi (CHỈ THÊM — dòng ĐÈ)**

Chỗ gọi `machine-cleared` (khoảng dòng 812) và chỗ gọi làn V (khoảng dòng 852) hiện in VIOLATION khi `xanh_sach_check` trả khác 0. Thêm NGAY SAU mỗi lệnh `echo "VIOLATION …"` tương ứng một khối đè:

```sh
      # ĐÈ (hồ sơ cong-nguoi-doc-du-nguon): hồ sơ đời trước luật thứ bảy —
      # trượt CHỈ vì đường đọc-cũ thì hạ xuống NOTE, không chặn merge. Hồ sơ
      # MỚI không đi được đường này: cửa GHI (khong-can-nguoi.mjs --write) đọc
      # thẳng vật, không qua khoá findings_open.
      if [ "${CLEAN_DOI_CU:-0}" = "1" ]; then
        violations=$((violations-1))
        echo "NOTE [$slug]: $CLEAN_WHY — hồ sơ thuộc đời trước luật «mục chờ người»; xử bằng chữ ký Cổng 2 hoặc một dòng sổ quyết định stage gate2"
      fi
```

Đặt khối này SAU dòng `violations=$((violations+1)); continue` thì không chạy tới — nên phải đặt TRƯỚC dòng đó, ngay sau `echo "VIOLATION …"`. Kiểm lại bằng mắt: thứ tự đúng là `echo VIOLATION` → khối đè → `violations=$((violations+1)); continue`. Khối đè tự trừ lại một để bù cho lần cộng ngay sau nó.

- [ ] **Step 5: Chạy ba ca + DV5**

Run: `CNDN_CASES="CN01 CN05 CN03b" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs && node tests/scripts/additive-only.test.mjs 2>&1 | tail -3`
Expected: ba ca PASS; DV5 PASS (mọi thay đổi là dòng thêm). DV5 đỏ nghĩa là có dòng cũ bị sửa — quay lại Step 3/4 và viết dòng đè thay vì sửa tại chỗ.

- [ ] **Step 6: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/cong-nguoi-doc-du-nguon.test.mjs
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): lưới trước-merge chấm điều kiện thứ bảy, có đường đọc-cũ

AC-1, AC-3 ô vắng node, AC-5. Mọi thay đổi là dòng THÊM theo luật DV5; nhánh
đọc-cũ là khối ĐÈ tự trừ lại bộ đếm vi phạm.

Vắng node hoặc vắng lib thì fail-CLOSED có tên, không bỏ qua im lặng.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 5: Khối bảy điều kiện, khoá `findings_open`, và ca RT1

**Files:**
- Modify: `skills/acceptance/references/evidence-report-template.md` (khối `EVIDENCE-XANH-SACH-BLOCK` + khoá frontmatter)
- Modify: `feature-loop/workflows/acceptance-verify.js` (bên VIẾT điền `findings_open`)
- Modify: `tests/plugins/ra-co-ten.test.mjs` (hằng `EXPECT_XS`, hai danh sách mốc)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN02)

**Interfaces:**
- Consumes: vị từ từ Task 2, hai bản dựng từ Task 3 và 4.
- Produces: khối `EVIDENCE-XANH-SACH-BLOCK` có bảy dòng, dòng thứ bảy khoá `findings`.

- [ ] **Step 1: Thêm dòng thứ bảy vào khối**

Trong `skills/acceptance/references/evidence-report-template.md`, trong khối marker, thêm sau dòng `sections`:

```
findings       review-findings.md không còn mục chờ người ở «Ngoài hợp đồng» và «Trong hợp đồng»
```

Và thêm khoá vào phần frontmatter mẫu của khuôn báo cáo (cạnh `verdict:`):

```
findings_open: <số mục còn chờ người — đếm từ review-findings.md trừ số dòng sổ stage gate2; 0 khi đã dọn hết>
```

- [ ] **Step 2: Cập nhật ca RT1**

Trong `tests/plugins/ra-co-ten.test.mjs`, sửa `EXPECT_XS` thành bảy phần tử:

```js
  const EXPECT_XS = ['verdict-pass', 'bypass', 'enforcement', 'tier', 'uncertain', 'sections', 'findings'];
```

Thêm mốc thứ bảy vào cả hai danh sách thứ tự:

```js
  const orderMjs = ["!== 'PASS'", 'bypass_used', 'enforcement_mode', 'risk_tier', 'UNCERTAIN_RE.test', "'Known limits', 'Ngoài hợp đồng'", 'dieuKienFindings'].map(n => mjs.indexOf(n));
```

```js
  const orderSh = ['= "PASS"', 'bypass_used', 'enforcement_mode', 'risk_tier', 'UNCERTAIN', '"Known limits" "Ngoài hợp đồng"', 'dieuKienFindings'].map(n => fn.indexOf(n));
```

- [ ] **Step 3: Chạy RT1**

Run: `bash tests/plugins/run-tests.sh 2>&1 | tail -3`
Expected: PASS. Nếu `orderMjs` đỏ vì mốc `dieuKienFindings` nằm trước một mốc khác, dời khối điều kiện thứ bảy trong `xanhSach` xuống cuối hàm — thứ tự khối là hợp đồng, không phải gợi ý.

- [ ] **Step 4: Bên VIẾT điền `findings_open`**

Trong `feature-loop/workflows/acceptance-verify.js`, trong prompt soạn báo cáo (`synthesize:report`), thêm một dòng lệnh cho bên viết, ngay cạnh chỗ nó được dặn điền `verdict`:

```
FINDINGS-OPEN: frontmatter PHAI co khoa `findings_open: <n>` — n = so muc con CHO NGUOI = (so muc duoi "## Ngoai hop dong" + so muc duoi "## Trong hop dong") tru so dong decisions.jsonl khai stage gate2. Chua co dong so nao thi n = tong so muc. Khai 0 khi ca hai muc rong.
```

- [ ] **Step 5: Viết ca CN02 — một nguồn, đo QUAN HỆ**

Ba khẳng định: khối rút ra đúng bảy khoá và khoá thứ bảy là `findings`; hai thân hàm mỗi bên có đúng bảy mốc đúng thứ tự; không bên nào tự duyệt `review-findings.md` (đếm số lần chuỗi `Ngoài hợp đồng` hoặc `Trong hợp đồng` xuất hiện trong hai tệp NGOÀI lời gọi vị từ — phải bằng 0). Ba mũi tiêm độc lập, mỗi mũi ghim một thông điệp riêng.

- [ ] **Step 6: Chạy CN02 và toàn bộ ca đã có**

Run: `node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: mọi ca đã viết PASS.

- [ ] **Step 7: Commit**

```bash
git add skills feature-loop tests
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): khối xanh-sạch lên BẢY điều kiện, bên viết điền findings_open

AC-2. Khối EVIDENCE-XANH-SACH-BLOCK là nguồn duy nhất; ca RT1 giữ hai bản
dựng khớp thứ tự khối, nay bảy mốc mỗi bên.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 6: `ac-line` đọc theo KHỐI

**Files:**
- Modify: `lib/ac-line.cjs` (thêm `criteriaLines`, `parseACBlock`; nới `AC_SUSPECT`; `acBlindSpot` dùng `criteriaLines`)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN07, CN08, CN09)

**Interfaces:**
- Consumes: `sectionLines` của `lib/md-section.cjs`.
- Produces:
  - `criteriaLines(contractText)` → `Array<{no, l}>` — dòng của mục tiêu chí, thử ba tên `Criteria`, `Acceptance Criteria`, `Acceptance criteria`; không mục nào có thì trả cả tệp.
  - `parseACBlock(contractText)` → `Array<{id, gwt, judgment, crossLayer}>` — gộp dạng gạch đầu dòng và dạng tiêu đề, theo thứ tự xuất hiện, id trùng chỉ lấy lần đầu.

- [ ] **Step 1: Viết CN07 (ma trận 12 hình dạng), CN08 (bốn tên mục), CN09 (bộ dò) — ĐỎ trước**

Mười hai ô của CN07 liệt đủ trong `expected` của E7 ở `evals.yaml`; chép đúng danh sách đó, mỗi ô ghim `id`, một chuỗi phải có trong `gwt`, và cặp `(judgment, crossLayer)`. Ba ô lấy NGUYÊN VĂN từ hợp đồng thật — chép chuỗi vào tệp ca, không đọc tệp thật:

```js
const THAT_CRM = '### AC-1 — Ở kho này, job không chạy — đo bằng số GitHub trả về';
const THAT_AP = '### AC-2 — Google Contacts một-cú-bấm';
const THAT_KIT = '### AC-1 (bộ giải) — bóc nháy chỉ khi nháy CÂN và đúng một cặp vỏ';
```

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `CNDN_CASES="CN07 CN08 CN09" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: cả ba FAIL — `parseACBlock` chưa tồn tại.

- [ ] **Step 3: Nới `AC_SUSPECT` và thêm hai hàm**

Trong `lib/ac-line.cjs`, đổi `AC_SUSPECT` để nhận cả dòng tiêu đề:

```js
// Nới (hồ sơ cong-nguoi-doc-du-nguon): 214 hợp đồng ĐÃ DUYỆT khai tiêu chí bằng
// tiêu đề `### AC-n`. Khuôn cũ chỉ nhận gạch đầu dòng nên với chúng m = 0 và bộ
// dò trả null — IM LẶNG ở 35 hồ sơ, đúng chỗ nó sinh ra để kêu.
const AC_SUSPECT = /^\s*(?:#{2,6}\s+)?(?:[-*]\s+)?\*{0,2}\s*AC-\d+\b/;
```

Thêm sau `const { sectionLines } = require('./md-section.cjs');`:

```js
// Tên mục tiêu chí trôi qua ba cách viết trên 11 kho đo được. Bộ bóc thử lần
// lượt; không mục nào có thì quét cả tệp (giữ hành vi cũ).
const CRITERIA_HEADINGS = ['Criteria', 'Acceptance Criteria', 'Acceptance criteria'];
function criteriaLines(contractText) {
  for (const h of CRITERIA_HEADINGS) {
    const ls = sectionLines(contractText, h);
    if (ls.length) return ls;
  }
  return String(contractText == null ? '' : contractText).split('\n').map((l, i) => ({ no: i + 1, l }));
}
// Tiêu chí khai bằng TIÊU ĐỀ: `### AC-n — nhãn`, thân là các dòng tới tiêu đề kế.
const AC_HEAD = /^(#{2,6})\s+\*{0,2}\s*(AC-\d+)\b\*{0,2}\s*(.*)$/;
function parseACBlock(contractText) {
  const lines = criteriaLines(contractText);
  const out = []; const seen = new Set();
  let cur = null;
  const dong = () => {
    if (!cur) return;
    const body = cur.body.join(' ').replace(/\s+/g, ' ').trim();
    const gia = parseAC(`- ${cur.id}${cur.nhan ? ' ' + cur.nhan : ''}: ${body || cur.nhan || '—'}`);
    if (gia && !seen.has(gia.id)) { seen.add(gia.id); out.push(gia); }
    cur = null;
  };
  for (const { l } of lines) {
    const h = l.match(AC_HEAD);
    if (h) { dong(); cur = { id: h[2], nhan: h[3] || '', body: [] }; continue; }
    if (/^#{2,6}\s/.test(l)) { dong(); continue; }
    if (cur) { cur.body.push(l); continue; }
    const a = parseAC(l);
    if (a && !seen.has(a.id)) { seen.add(a.id); out.push(a); }
  }
  dong();
  return out;
}
```

Đổi `acBlindSpot` để dùng chung phạm vi:

```js
  const scan = criteriaLines(contractText);
```

(thay hai dòng `const inSec = …` và `const scan = …`).

Thêm vào `module.exports`: `criteriaLines`, `parseACBlock`, `CRITERIA_HEADINGS`, `AC_HEAD`.

- [ ] **Step 4: Chạy ba ca**

Run: `CNDN_CASES="CN07 CN08 CN09" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: cả ba PASS. Ô «tiêu chí thân rỗng KHÔNG tính» dựa vào `parseAC` trả null khi `gwt` không có chữ — nếu ô đó đỏ, kiểm lại chuỗi `'—'` dự phòng trong `dong()`: nó phải KHÔNG được tính là chữ.

- [ ] **Step 5: Commit**

```bash
git add lib/ac-line.cjs tests/scripts/cong-nguoi-doc-du-nguon.test.mjs
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): ac-line đọc theo khối và nhận ba cách đặt tên mục

AC-7, AC-8, AC-9. parseAC giữ nguyên chữ ký nên ba bên gọi và lớp vendored ở
9 kho không vỡ; parseACBlock là lối vào mới.

AC_SUSPECT nới để bộ dò điểm mù thôi im trước dạng tiêu đề — đo được 35 hồ sơ
thẻ trống mà không cờ nào.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 7: Bốn bên gọi cùng thấy một số

**Files:**
- Modify: `scripts/gate-card.js:400,716` (đổi sang `parseACBlock`)
- Modify: `scripts/evidence-page.js` (đổi sang `parseACBlock`)
- Modify: `scripts/eval-coverage-lint.js:135` (đổi sang `parseACBlock`)
- Modify: `scripts/pre-merge-check.sh` (nhánh node dùng `parseACBlock`; nhánh awk thêm lượt quét dạng tiêu đề — CHỈ THÊM)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN13, CN11)

**Interfaces:**
- Consumes: `parseACBlock` từ Task 6.
- Produces: không API mới.

- [ ] **Step 1: Viết CN13 (bốn bên, bốn mũi tiêm) và CN11 (hai nhánh cross-layer) — ĐỎ trước**

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `CNDN_CASES="CN11 CN13" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: cả hai FAIL.

- [ ] **Step 3: Đổi ba bên gọi JS**

`scripts/gate-card.js` dòng 400:

```js
  for (const ac of parseACBlock(contract)) { if (seen[ac.id]) dupIds.push(ac.id); seen[ac.id] = 1; acs.push(ac); }
```

dòng 716:

```js
const critText = {}; for (const ac of parseACBlock(contract)) { if (!critText[ac.id]) critText[ac.id] = ac.gwt; }
```

Nhớ thêm `parseACBlock` vào dòng `require` ở đầu tệp (dòng 287).

`scripts/evidence-page.js`: đổi vòng lặp `for (const l of section(contract, 'Criteria'))` thành `for (const p of parseACBlock(contract))`, và sửa require.

`scripts/eval-coverage-lint.js` hàm `parseACs`: khi `acLine` có mặt, gọi `acLine.parseACBlock(contractText)` một lần thay cho vòng lặp từng dòng; nhánh dự phòng khuôn hẹp giữ NGUYÊN.

- [ ] **Step 4: Nới nhánh node và nhánh awk của răng cross-layer (CHỈ THÊM)**

Trong khối `node -e` của `pre-merge-check.sh`, thêm SAU vòng lặp hiện có (dòng đè):

```js
        // ĐÈ (hồ sơ cong-nguoi-doc-du-nguon): tiêu chí khai bằng TIÊU ĐỀ không
        // lọt vào vòng trên. parseACBlock gộp cả hai hình dạng; union vào đây
        // thay vì sửa dòng cũ, theo luật DV5 chỉ-được-thêm.
        try {
          const { parseACBlock } = require(process.argv[1]);
          for (const a of parseACBlock(t)) { if (a.crossLayer) out.add(a.id); else out.delete(a.id); }
        } catch (_) { /* lib đời cũ: giữ kết quả vòng trên */ }
```

Thêm một lượt awk THỨ HAI ngay sau dòng `xl_acs="$(awk …)"`, union kết quả:

```sh
  # THÊM: lượt quét dạng TIÊU ĐỀ cho nhánh awk dự phòng. Không có nó thì máy
  # thiếu node trả tập id khác máy có node — đúng lớp lỗi hai-bề-mặt-hai-câu-trả-lời.
  # Nhận cả `## Acceptance Criteria` và `## Acceptance criteria`.
  xl_acs_head="$(awk '
    tolower($0) ~ /^##[[:space:]]+(acceptance[[:space:]]+)?criteria/ { insec=1; next }
    /^##[[:space:]]/ && tolower($0) !~ /^##[[:space:]]+(acceptance[[:space:]]+)?criteria/ { insec=0 }
    insec && /^###*[[:space:]]/ { cur=""; if (match($0, /AC-[0-9]+/)) cur=substr($0, RSTART, RLENGTH) }
    insec && cur != "" && tolower($0) ~ /\(cross-layer\)/ { print cur }
  ' "$contract" 2>/dev/null | sort -u)"
  xl_acs="$(printf '%s\n%s\n' "$xl_acs" "$xl_acs_head" | sed '/^$/d' | sort -u)"
```

- [ ] **Step 5: Chạy hai ca + DV5 + suite scripts**

Run: `CNDN_CASES="CN11 CN13" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs && node tests/scripts/additive-only.test.mjs 2>&1 | tail -2 && bash tests/scripts/run-tests.sh 2>&1 | tail -3`
Expected: tất cả PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts tests
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): bốn bên đọc cùng thấy một số tiêu chí

AC-11, AC-13. Thẻ, trang bằng chứng, lint và nhánh node của răng xuyên lớp
đều đi qua parseACBlock; nhánh awk dự phòng thêm một lượt quét dạng tiêu đề
nên hai bề mặt trả cùng một tập id.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 8: Thẻ hiện lỗi trong hợp đồng, và đọc được Coverage dạng bảng

**Files:**
- Modify: `scripts/gate-card.js` (khối «Trong hợp đồng» trước khối «Ngoài hợp đồng»; chặn phát ngôn đầy-đủ khi n > 0; dòng 411 `covLines` nhận bảng và văn xuôi)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN10, CN15)

**Interfaces:**
- Consumes: `parse().inContract` từ Task 1.
- Produces: không API mới.

- [ ] **Step 1: Viết CN10 — ĐỎ trước**

Ghim: HTML có khối nêu đúng số 2; chỉ số chuỗi của nhãn «Trong hợp đồng» NHỎ HƠN chỉ số của «Ngoài hợp đồng»; HTML không chứa phát ngôn khẳng định bằng chứng đầy đủ khi n > 0. Đối chứng dương TRƯỚC: mục `Trong hợp đồng` rỗng → không có khối, phát ngôn cũ xuất hiện như hành vi hiện có.

- [ ] **Step 2: Chạy để xác nhận ĐỎ**

Run: `CNDN_CASES=CN10 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs`
Expected: FAIL `(DO: the giau loi trong hop dong)`.

- [ ] **Step 3: Thêm khối vào thẻ**

Trong `scripts/gate-card.js`, NGAY TRƯỚC khối `if (ooc.findings.length) {` (khoảng dòng 947):

```js
// Lỗi TRONG hợp đồng chưa sửa — đứng TRƯỚC khối «Ngoài hợp đồng» vì nó nặng
// hơn: nó nằm trong phạm vi người đã duyệt ở Cổng 1. Ca thật: sau STOP-PATCHING
// máy dừng với một lỗi có mã AC chưa sửa, verdict PENDING-JUDGMENT, và trước
// bản này lỗi đó không xuất hiện ở bất kỳ đâu trên thẻ.
if ((ooc.inContract || []).length) {
  P.push(`<div class="lab">Lỗi TRONG hợp đồng CHƯA sửa — bạn quyết (${ooc.inContract.length})</div>`);
  P.push(`<div class="flag fred">Các lỗi dưới đây nằm TRONG phạm vi bạn đã duyệt ở Cổng 1 và vẫn chưa được sửa. Ký ở trạng thái này là nhận chúng.</div>`);
  ooc.inContract.forEach((f, fi) => {
    const q = f.plain ? f.plain : '(chưa có mô tả cho người đọc — xem review-findings.md)';
    P.push(`<div class="item"><p class="q">Trong-${fi + 1} · ${esc(q)}</p><p class="ai">${esc(f.severity ? 'mức ' + f.severity : 'chưa khai mức')}${f.file ? ' · ' + esc(f.file) : ''}</p></div>`);
  });
}
```

Chặn phát ngôn đầy-đủ: tìm chỗ thẻ in câu khẳng định bằng chứng đầy đủ và bọc điều kiện `(ooc.inContract || []).length === 0 && …`. Đây là dòng SỬA, không phải dòng thêm — `gate-card.js` KHÔNG bị DV5 canh nên sửa tại chỗ là hợp lệ.

- [ ] **Step 4: Chạy CN10 và suite plugins**

Run: `CNDN_CASES=CN10 node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs && bash tests/plugins/run-tests.sh 2>&1 | tail -3`
Expected: PASS cả hai.

- [ ] **Step 5: Viết CN15 và nới bộ đọc Coverage**

Ca CN15 theo đúng `expected` của E18: ba ô (đối chứng dương gạch-đầu-dòng · bảng · vắng hẳn), một mũi tiêm hoàn nguyên `covLines` về bullets-only, và khẳng định mũi tiêm KHÔNG giết ô «vắng hẳn» — nếu cả hai ô cùng đỏ thì phép đo không phân biệt được hình dạng.

Sửa dòng 411 của `scripts/gate-card.js`:

```js
  // Nới (AC-15): mục Coverage viết bằng BẢNG hoặc văn xuôi từng đọc ra rỗng,
  // nên dòng 684 nổi cờ «chưa có section Coverage» trên một mục CÓ THẬT — đo
  // được 29/244 hợp đồng có mục Coverage trên 11 kho. Cùng lớp với hai hình
  // dạng kia của vòng này: bên đọc hẹp hơn vật.
  const covRaw = covAll.filter(l => l.trim() && !/\{\{/.test(l));
  const covBullets = bullets(covAll).filter(l => !/\{\{/.test(l));
  const covLines = covBullets.length ? covBullets
    : covRaw.filter(l => !/^\s*\|\s*:?-{2,}/.test(l));
```

Hàng phân cách của bảng (`|---|---|`) bị loại vì nó không mang chữ cho người đọc; mọi hàng bảng khác và mọi dòng văn xuôi đều giữ.

- [ ] **Step 6: Chạy CN10, CN15 và suite plugins**

Run: `CNDN_CASES="CN10 CN15" node tests/scripts/cong-nguoi-doc-du-nguon.test.mjs && bash tests/plugins/run-tests.sh 2>&1 | tail -3`
Expected: PASS cả hai.

- [ ] **Step 7: Commit**

```bash
git add scripts/gate-card.js tests/scripts/cong-nguoi-doc-du-nguon.test.mjs
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): thẻ hiện lỗi TRONG hợp đồng, và đọc được Coverage dạng bảng

AC-10, AC-15. Khối đứng trước «Ngoài hợp đồng» vì nó nặng hơn — lỗi nằm trong
phạm vi người đã duyệt. Thẻ thôi khẳng định bằng chứng đầy đủ khi còn mục như vậy.

Bộ đọc Coverage nhận bảng và văn xuôi: 29/244 hợp đồng có mục Coverage đang bị
báo «chưa có section Coverage» oan.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

---

### Task 9: Danh sách chép CI, phép đo bán kính, và nợ đo lint

**Files:**
- Modify: `commands/acceptance-init.md` (khối `INIT-CI-COPY-LIST`)
- Create: `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs`
- Modify: `_acceptance/cong-nguoi-doc-du-nguon/contract.md` (điền dòng thứ năm của Đường đo)
- Test: `tests/scripts/cong-nguoi-doc-du-nguon.test.mjs` (ca CN12)

**Interfaces:**
- Consumes: `parseACBlock`, `acBlindSpot`, `mucChoNguoi` từ các task trước.
- Produces: `do-ban-kinh.cjs` nhận `--truc ac|findings|cross-layer|lint|tat-ca`, `--root <kho>` (lặp được), `--ag-root <cây thư viện>`, `--json`.

- [ ] **Step 1: Thêm mục thứ mười vào danh sách chép**

Trong `commands/acceptance-init.md`, sau dòng `lib/lop-nhin-thay.cjs`:

```
   - `${CLAUDE_PLUGIN_ROOT}/lib/out-of-contract.cjs` → `lib/` (the ONE reader of review-findings.md; the seventh clean-green condition loads it — missing → the gate fails CLOSED with a named error instead of passing a dossier that still has findings nobody decided)
```

- [ ] **Step 2: Viết CN12 — đo QUAN HỆ tập-require ⊆ tập-danh-sách**

Rút tập đường dẫn từ khối `INIT-CI-COPY-LIST`; rút tập tệp `lib/` mà ba tệp cưỡng chế nạp tới, lần theo require bắc cầu; đòi tập hai ⊆ tập một và `out-of-contract.cjs` có ở cả hai. Hai mũi tiêm: gỡ dòng khỏi danh sách → đỏ; thêm một require tới tệp lib chưa có trong danh sách → đỏ.

- [ ] **Step 3: Viết `do-ban-kinh.cjs`**

Năm trục. Trục `ac` trả `{hopDong, tieuChiVoHinh, daDuyet, boDoImLang}` — so số tiêu chí bên đọc HÔM NAY thấy với số khai báo thật. Trục `findings` trả danh sách hồ sơ còn mục chờ người. Trục `cross-layer` trả số hợp đồng sinh vi phạm mới. Trục `lint` chạy `eval-coverage-lint.js` ở từng kho và đếm cảnh báo MỚI so với lượt chạy bằng `--ag-root` trỏ lớp trước bản vá. Mọi đường dẫn suy từ `__dirname`; kho không đọc được thì in dòng bỏ-qua CÓ TÊN.

- [ ] **Step 4: Chạy phép đo, ghi số vào Đường đo**

Run: `node _acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs --truc tat-ca --json`
Expected: trục `ac` trả 0 hợp đồng còn đọc thiếu và 0 im lặng; trục `cross-layer` trả 0.

Điền số thật vào dòng thứ năm của mục `## Đường đo` trong hợp đồng. Số cảnh báo lint mới **lớn hơn 0** → thêm một mục Known limits nêu SỐ và TÊN KHO; đây là nợ đo đã hẹn trong sổ quyết định `revisit`, phải trả TRƯỚC khi khai `implemented`.

- [ ] **Step 5: Chiều đỏ của chính phép đo**

Run:
```bash
BASE=$(git rev-parse HEAD~9)
mkdir -p /tmp/cndn-base && git archive "$BASE" lib | tar -x -C /tmp/cndn-base
node _acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs --truc ac --ag-root /tmp/cndn-base
```
Expected: trục `ac` trả lại **221**. Số không đổi theo lớp đo nghĩa là script đo VĂN chứ không đo VẬT — sửa script, đừng sửa ngưỡng.

- [ ] **Step 6: Chạy trọn bốn suite + lint**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -3 && bash tests/hooks/run-tests.sh 2>&1 | tail -2 && bash tests/plugins/run-tests.sh 2>&1 | tail -3 && bash tests/workflows/run-tests.sh 2>&1 | tail -2 && node scripts/eval-coverage-lint.js .`
Expected: mọi suite PASS, lint thoát 0.

- [ ] **Step 7: Commit và khai `implemented`**

```bash
git add commands _acceptance tests
git commit -F - <<'MSG'
feat(cong-nguoi-doc-du-nguon): danh sách chép CI mục thứ mười + phép đo bán kính

AC-12. CN12 đo QUAN HỆ tập-require ⊆ tập-danh-sách thay vì đếm số mục, nên nó
bắt được cả mục thiếu lẫn require mới chưa khai.

do-ban-kinh.cjs có chiều đỏ thật: chạy với --ag-root trỏ lớp trước bản vá phải
trả lại 221, số không đổi theo lớp đo là dấu script đo văn chứ không đo vật.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

Rồi đổi `status: approved` → `status: implemented` trong hợp đồng và commit riêng.

---

## Self-Review

**1. Phủ hợp đồng** — 14 AC, mỗi AC có ít nhất một task:

| AC | Task | AC | Task |
|---|---|---|---|
| AC-1 | 4 | AC-8 | 6 |
| AC-2 | 5 | AC-9 | 6 |
| AC-3 | 2 (ô 1) + 4 (ô 2) | AC-10 | 8 |
| AC-4 | 2 | AC-11 | 7 |
| AC-5 | 4 | AC-12 | 9 |
| AC-6 | 3 | AC-13 | 7 |
| AC-7 | 6 | AC-14 | 1 |
| | | AC-15 | 8 |

**2. Quét giữ-chỗ** — Task 4 Step 1, Task 5 Step 5, Task 7 Step 1, Task 8 Step 1 và Task 9 Step 2–3 mô tả ca kiểm bằng lời thay vì dán trọn mã. Đó là CÓ CHỦ Ý và là chỗ yếu đã biết của kế hoạch này: mã ca của chúng dài hơn mã sản phẩm, và `expected` của eval tương ứng trong `evals.yaml` đã liệt đủ từng ô, từng mũi tiêm, từng thông điệp ghim — người thi công đọc `evals.yaml` làm đặc tả ca. Mọi bước KHÁC đều có mã thật.

**3. Nhất quán kiểu** — `dieuKienFindings` trả `{clean, why, doiCu}` ở Task 2, dùng đúng ba tên đó ở Task 3 (mjs) và Task 4 (bash, qua JSON). `mucChoNguoi` trả `{n, ngoai, trong, daDinhDoat, docDuoc, why}` — Task 9 dùng `n`. `parseACBlock` trả phần tử cùng hình dạng `parseAC` (`{id, gwt, judgment, crossLayer}`) nên bốn bên gọi ở Task 7 không phải đổi cách đọc.
