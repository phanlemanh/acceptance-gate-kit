# loi-moi-cong-may-sinh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lời mời cổng thành vật máy sinh — thẻ in câu gộp khuyến nghị bấm được, khối «VIỆC CỦA ANH» chỉ chứa điều-chỉ-người-biết, các đường fail-quiet của thẻ kêu to.

**Architecture:** Toàn bộ là đổi-vai trên ba vật sẵn có: `scripts/gate-card.js` (bộ dựng thẻ, hai cổng), `lib/out-of-contract.js` (bộ đọc mục Ngoài-hợp-đồng — **t3_paths**), và bản luật ngôn ngữ mặt người (khối marker + bản chép trong thân lệnh). Mọi chuỗi thẻ in ra đều RÚT từ hằng có marker để lưới thường trực round-trip được; không thêm cổng, không NLP — phân loại mục theo bảng đóng có hàng mặc định.

**Tech Stack:** Node ≥18 (CommonJS cho `scripts/`, `lib/`), bash suite `tests/scripts/run-tests.sh` + `*.test.mjs` tự-wire, Python inline trong `tests/plugins/run-tests.sh` (răng đồng bộ luật).

**Spec:** `docs/superpowers/specs/2026-09-02-loi-moi-cong-may-sinh-design.md` · hợp đồng `_acceptance/loi-moi-cong-may-sinh/contract.md` (AC-1…AC-8, T3) · eval `_acceptance/loi-moi-cong-may-sinh/evals.yaml` (E1…E11).

## Global Constraints

- **T3**: mọi task chạm `lib/` phải có ca đối chứng dương + chiều đỏ ghim thông điệp nguyên văn (CLAUDE.md «assertion âm-tính-một-mình là assertion không sống»).
- **Một nguồn**: chuỗi thẻ in ra khai bằng `const NAME = '...';` ở đầu file (khuôn `gmpick` của suite rút được); test rút từ marker, KHÔNG gõ literal.
- **Đảo chiều mặc định** (design D2/D3): không phân loại được → rơi về NGƯỜI; gap-probe không đọc được → rơi bậc.
- **Luật đang ship cản D1** — `skills/acceptance/references/human-facing-language.md` dòng 133 (GATE-INVITE-CLAUSE) và 138–141 (luật âm «máy không viết sẵn câu trả lời của người»), có răng P185/P186/P186b/P187/P188 trong `tests/plugins/run-tests.sh`. Owner đã quyết nguyên tắc mới 01/09 (CLAUDE.md luật (c): «máy soạn sẵn trọn gói khuyến nghị, người chỉ phát ngôn quyết định»). **Task 1 sửa luật + bản chép + răng TRƯỚC**, để mọi task sau không lách một ca đang đỏ.
- **Ranh ADR 0002 giữ nguyên**: máy điền sẵn ô CÓ khuyến nghị; ô loại-5 không khuyến nghị và CHỮ QUYẾT (`duyệt`/`Ký`/verdict eval) luôn là `___`.
- Commit từng task, `git add` đích danh (repo self-host — không `git add -A`).
- Sau mỗi task: `bash tests/scripts/run-tests.sh` xanh; Task 1 và 7 thêm `bash tests/plugins/run-tests.sh` (răng luật, ~7 phút).

---

## File map

| File | Vai | Task |
|---|---|---|
| `skills/acceptance/references/human-facing-language.md` | nguồn luật: GATE-INVITE-CLAUSE, luật âm, GATE-ONESHOT-GRAMMAR | 1, 7 |
| `commands/acceptance-card.md` · `skills/acceptance/SKILL.md` · `feature-loop/skills/feature-loop/SKILL.md` | bản chép clause (P188 round-trip 4 site) | 1 |
| `commands/approve.md` · `commands/signoff.md` | bản chép grammar (răng ONESHOT-BODY) | 7 |
| `tests/plugins/run-tests.sh` | P185–P187 (khuôn câu mẫu) | 1 |
| `lib/out-of-contract.js` | `suspect_empty`, `PROPOSALS`, `proposal_raw` | 2 |
| `tests/scripts/out-of-contract.test.mjs` (mới) | ma trận bộ đọc OOC | 2 |
| `scripts/gate-card.js` | hằng ONE-SHOT-CMD · bảng ROUTING · rơi bậc · one_shot · khối đối kháng · cờ D4/D5 · classifier D6 | 3, 4, 5, 6 |
| `tests/scripts/gate-card-lmcms.test.mjs` (mới) | ca LM01…: cờ D4/D5, classifier D6, rơi bậc D3, one_shot D1, routing D2, sweep E11 | 3–6, 8 |
| `_acceptance/loi-moi-cong-may-sinh/sweep-baseline.txt` (mới) | danh sách hồ sơ bật cờ ĐẾM TRƯỚC (E11) | 8 |
| `commands/acceptance-card.md` | thân lệnh dạy khối mới | 9 |

---

### Task 1: Sửa luật để D1 hợp pháp — điều khoản mời-cổng, luật âm, và ba răng P185–P187

**Files:**
- Modify: `skills/acceptance/references/human-facing-language.md` (dòng 133 khối `GATE-INVITE-CLAUSE`; dòng 138–141 luật âm)
- Modify: MỌI site chép clause theo manifest `GATE-INVITE-SITES` trong cùng file luật — đọc manifest ở Step 1, KHÔNG tin con số «4»: rà soát đếm được 3 file / 5 bản chép
- Modify: `tests/plugins/run-tests.sh` — P185 (ghim `trả lời dạng:` + `___` ở Cổng 1 → đổi sang ghim dòng one_shot), P186 (`slots < 5` → đẳng thức mới; BỎ cấm «đồng ý cắt»/«phê hết»), P186b, P191 (neo GRAMMAR), P192 (round-trip khuôn «điền vào chỗ trống» → bóc được ô đã điền) — rà soát đối kháng Gate 1.5 liệt đích danh; P190 (so byte 3 thẻ check-in) chạy lại và tái sinh 3 thẻ cùng lượt nếu đỏ
- Modify: `skills/acceptance/references/human-facing-language.md` dòng 194 khối GATE-ONESHOT-GRAMMAR («không bao giờ điền sẵn lựa chọn, verdict hay chữ ký thay người» → «không bao giờ điền sẵn VERDICT hay CHỮ KÝ thay người; lựa chọn đã có khuyến nghị máy thì điền sẵn») — nếu không, luật tự cãi giữa hai khối
- Test: `tests/plugins/run-tests.sh` (P185–P188)

**Interfaces:**
- Produces: luật mới cho mọi task sau — «câu mẫu = câu gộp ĐIỀN SẴN khuyến nghị, chỗ trống chỉ ở ô loại-5 không khuyến nghị và chữ quyết».

- [ ] **Step 1: Đọc manifest site**

Run: `grep -n "GATE-INVITE-SITES" -A8 skills/acceptance/references/human-facing-language.md`
Ghi lại đúng danh sách đường dẫn site (P188 so từng ký tự với nguồn).

- [ ] **Step 2: Chạy P188 trước khi sửa để có đối chứng dương**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P185|P186|P187|P188"`
Expected: cả bốn PASS trên cây chưa sửa.

- [ ] **Step 3: Sửa NGUỒN clause (dòng 133) — thay nguyên văn bằng:**

```markdown
<!-- <<<GATE-INVITE-CLAUSE -->
Mời cổng như đồng nghiệp hỏi: một câu hỏi đóng, nói ngả máy khuyên và vì sao, kèm ĐÚNG MỘT dòng lệnh đã điền sẵn mọi ô có khuyến nghị — người chỉ gõ chữ quyết định hoặc sửa ô mình nghĩ khác, rồi máy nói mình làm gì tiếp; không hỏi phút, không mã bắt buộc ngoài dòng lệnh đó.
<!-- GATE-INVITE-CLAUSE>>> -->
```

- [ ] **Step 4: Sửa luật âm (dòng 138–141) thành:**

```markdown
- **Máy không viết sẵn CHỮ QUYẾT của người.** Máy ĐƯỢC và PHẢI điền sẵn
  mọi ô đã có khuyến nghị máy (đề xuất Ngoài-N, «đồng ý cắt», «phê hết») —
  đó là nhận thức máy gánh (luật (c) CLAUDE.md, owner quyết 01/09). Máy
  KHÔNG BAO GIỜ soạn hộ chữ chấp thuận, chữ ký, hay verdict cho mục người
  phải tự chấm (ô loại-5 không khuyến nghị): những chỗ đó luôn là `___`.
  Kit khoá không cho máy GỌI thao tác cổng (ADR 0002); ranh nằm ở AI PHÁT
  NGÔN CUỐI, không ở việc ô có được điền sẵn hay không (ca thật: thẻ Cổng 2
  vòng 2 chip ② từng in sẵn «E9 Đạt» cho mục máy vừa khai «chưa chắc» — đó
  là điền verdict, vẫn cấm).
```

- [ ] **Step 5: Chép nguyên văn clause mới vào từng site của manifest** (mở từng file, thay khối giữa hai marker `GATE-INVITE-CLAUSE` bằng đúng chuỗi Step 3 — không sửa chữ nào khác).

- [ ] **Step 6: Sửa P186 trong `tests/plugins/run-tests.sh`** — tìm dòng
`if (slots < 5) die("mau thieu cho trong: chi co " + slots + " (moi muc phai co mot ___)");`
thay bằng:

```js
// Luật mới (loi-moi-cong-may-sinh, owner 01/09): ô CÓ khuyến nghị được điền
// sẵn; chỗ trống chỉ còn ở ô loại-5 không khuyến nghị + chữ quyết. Fixture
// P186 có 1 judgment (E9, không khuyến nghị) + chữ ký → đúng 2 «___».
if (slots !== 2) die("mau sai so cho trong: " + slots + " (mong 2 = 1 o loai-5 khong khuyen nghi + chu quyet)");
if (!/Ngoài-1: (known-limits|new-contract|wont-fix)/.test(mau[0])) die("mau KHONG dien san de xuat cho Ngoai-1");
```

(Nếu fixture P186 không có Ngoài với proposal, đọc fixture ở ~20 dòng phía trên và sửa số mong đợi theo đúng số ô loại-5-không-khuyến-nghị của fixture đó + 1 — ghi con số vào comment.)

- [ ] **Step 7: Chạy răng luật**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep -E "P185|P186|P187|P188|ONESHOT"`
Expected: P188 PASS (4 site khớp nguồn), P186 FAIL lúc này là ĐÚNG (thẻ chưa điền sẵn — Task 6 làm xanh); P185/P187 PASS.

- [ ] **Step 8: Commit**

```bash
git add skills/acceptance/references/human-facing-language.md commands/acceptance-card.md skills/acceptance/SKILL.md feature-loop/skills/feature-loop/SKILL.md tests/plugins/run-tests.sh
git commit -m "law: mời cổng mang dòng lệnh điền sẵn khuyến nghị; luật âm thu về «không viết sẵn CHỮ QUYẾT» (owner 01/09) — P186 đổi sang đẳng thức chỗ trống"
```

---

### Task 2: `lib/out-of-contract.js` — hết fail-quiet, token đề xuất kêu to (T3)

**Files:**
- Modify: `lib/out-of-contract.js`
- Create: `tests/scripts/out-of-contract.test.mjs`

**Interfaces:**
- Produces: `parse(text)` trả thêm `suspect_empty: boolean`; mỗi finding có `proposal` ∈ `PROPOSALS` hoặc `''`, và `proposal_raw` (chuỗi gốc); `module.exports = { parse, PROPOSALS }`, với `PROPOSALS = ['known-limits','new-contract','wont-fix']` đặt giữa marker `<<<OOC-PROPOSALS` … `OOC-PROPOSALS>>>`.

- [ ] **Step 1: Viết test đỏ**

```js
// tests/scripts/out-of-contract.test.mjs — ma trận bộ đọc Ngoài-hợp-đồng
// (loi-moi-cong-may-sinh AC-5/AC-6). Fixture code-sinh; khuôn mục RÚT từ
// OOC-ITEM-TEMPLATE trong acceptance-verify.js, không viết tay.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const ooc = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'out-of-contract.js'));
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

const wf = readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
const tpl = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/) || wf.match(/<<<OOC-ITEM-TEMPLATE\n([\s\S]*?)\nOOC-ITEM-TEMPLATE>>>/);
if (!tpl) die('KHONG rut duoc OOC-ITEM-TEMPLATE');
const item = (title, proposal) => tpl[1].replace(/\\n/g, '\n').replace('{title}', title).replace('{plain}', 'nguoi thay X').replace('{file}', 'a.js').replace('{severity}', 'medium').replace('{proposal}', proposal);
const doc = body => `# Review\n\n## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật.\n\n${body}\n\n## Known limits\n`;

// Ma trận viết trước: 5 phần tử = 5 assert
const M = [
  ['dung-khuon-token-hop-le', doc(item('A', 'known-limits')), r => r.findings.length === 1 && r.findings[0].proposal === 'known-limits' && r.suspect_empty === false],
  ['van-xuoi-0-finding', doc('**N1 — Bat bien X khong nam trong luoi.** Chi tiet dai hon 40 ky tu de khong bi coi la rong.'), r => r.findings.length === 0 && r.suspect_empty === true],
  ['muc-rong-that', doc(''), r => r.findings.length === 0 && r.suspect_empty === false],
  ['token-la', doc(item('B', 'ghi Known limits')), r => r.findings.length === 1 && r.findings[0].proposal === '' && r.findings[0].proposal_raw === 'ghi Known limits'],
  ['ba-token-hop-le', doc(item('C', 'new-contract') + '\n' + item('D', 'wont-fix')), r => r.findings.map(f => f.proposal).join(',') === 'new-contract,wont-fix'],
];
for (const [n, text, ok] of M) check(n, () => { const r = ooc.parse(text); if (!ok(r)) die(JSON.stringify(r)); });
check('PROPOSALS xuat tu marker', () => {
  const src = readFileSync(path.join(ROOT, 'lib', 'out-of-contract.js'), 'utf8');
  if (!/<<<OOC-PROPOSALS[\s\S]*OOC-PROPOSALS>>>/.test(src)) die('thieu marker OOC-PROPOSALS');
  if (JSON.stringify(ooc.PROPOSALS) !== JSON.stringify(['known-limits', 'new-contract', 'wont-fix'])) die('PROPOSALS lech: ' + JSON.stringify(ooc.PROPOSALS));
});
console.log(`\nResults: ${passed} passed, ${failed} failed (out-of-contract)`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy để thấy đỏ**

Run: `node tests/scripts/out-of-contract.test.mjs`
Expected: FAIL ở `van-xuoi-0-finding` (chưa có `suspect_empty`), `token-la` (proposal giữ nguyên chuỗi lạ), `PROPOSALS xuat tu marker`.

- [ ] **Step 3: Sửa `lib/out-of-contract.js`** — thêm sau `const CLUSTER_RE`:

```js
// <<<OOC-PROPOSALS — MỘT nguồn của ba token đề xuất; thẻ và bộ tổng hợp S4
// đối chiếu với đúng danh sách này. Chuỗi ngoài danh sách KHÔNG được ép về
// một token hay nuốt im — nó giữ nguyên ở proposal_raw để thẻ kêu to.
const PROPOSALS = ['known-limits', 'new-contract', 'wont-fix'];
// OOC-PROPOSALS>>>
// Mục «Ngoài hợp đồng» có chữ mà không parse ra finding nào = NGỜ sai khuôn.
// Câu mở đầu chuẩn của S4 («Các lỗi dưới đây là thật…») không tính là chữ.
const OOC_INTRO_RE = /^Các lỗi dưới đây là thật/;
const SUSPECT_MIN_CHARS = 40;
```

Trong `parseFindings`, thay dòng `else cur.proposal = v;` bằng:

```js
    else { cur.proposal_raw = v; cur.proposal = PROPOSALS.includes(v) ? v : ''; }
```

và trong `cur = { title: …, proposal: '', plain: '' }` thêm `proposal_raw: ''`.

Trong `parse()`, sau `const outLines = …` thêm:

```js
  const findings = outLines ? parseFindings(outLines) : [];
  const meat = outLines ? outLines.filter(l => l.trim() && !OOC_INTRO_RE.test(l.trim())).join('').length : 0;
  const suspect_empty = outLines !== null && findings.length === 0 && meat >= SUSPECT_MIN_CHARS;
```

và return `{ present: …, findings, unclassified, cluster: …, suspect_empty }`; cuối file `module.exports = { parse, PROPOSALS };`.

- [ ] **Step 4: Chạy xanh**

Run: `node tests/scripts/out-of-contract.test.mjs`
Expected: `Results: 6 passed, 0 failed`.

- [ ] **Step 5: Lưới hồi quy**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -3` → `0 failed`; `bash tests/workflows/run-tests.sh 2>&1 | tail -2` → xanh (acceptance-verify đọc OOC).

- [ ] **Step 6: Commit**

```bash
git add lib/out-of-contract.js tests/scripts/out-of-contract.test.mjs
git commit -m "lib(out-of-contract): suspect_empty khi mục có chữ mà 0 finding; token đề xuất lạ giữ ở proposal_raw thay vì nuốt (AC-5, AC-6)"
```

---

### Task 3: Thẻ Cổng 2 — cờ vàng cho `suspect_empty` và token lạ (D4, D5)

**Files:**
- Modify: `scripts/gate-card.js` (khối `if (ooc.findings.length) {…}` ~dòng 748–766; hằng thông điệp đầu file cạnh `MSG_NO_WORKSPACE`)
- Create: `tests/scripts/gate-card-lmcms.test.mjs` (khung dùng chung cho Task 3–6, 8)

**Interfaces:**
- Produces: hằng `MSG_OOC_SUSPECT` và `MSG_PROPOSAL_LA` (khuôn `const X = '...';`); hàm test `mkWs(name, files)` dựng xưởng fixture.

- [ ] **Step 1: Khung test + hai ca đỏ**

```js
// tests/scripts/gate-card-lmcms.test.mjs — lưới thường trực của hồ sơ
// loi-moi-cong-may-sinh. Fixture code-sinh; chuỗi RÚT từ hằng của gate-card.js.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const SRC = readFileSync(GC, 'utf8');
export const pick = name => { const m = SRC.match(new RegExp(`^const ${name}\\s*=\\s*'([^']*)';`, 'm')); if (!m) throw new Error('gate-card.js khong khai hang ' + name); return m[1]; };
let passed = 0, failed = 0;
export const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
export function mkWs(slug, files) {
  const root = mkdtempSync(path.join(tmpdir(), 'lmcms-'));
  mkdirSync(path.join(root, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\ngap_probe: required\n');
  for (const [f, t] of Object.entries(files)) writeFileSync(path.join(root, '_acceptance', slug, f), t);
  return root;
}
export const card = (root, slug, extra = []) => spawnSync('node', [GC, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });
export const extract = (root, slug, extra = []) => JSON.parse(card(root, slug, ['--extract', ...extra]).stdout);
const CONTRACT_G2 = `---\nschema_version: 1\nfeature: F\nslug: S\nrisk_tier: T2\nsurfaces: [cli]\nstatus: verified\napproved_by: A\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- bỏ X.\n`;
const EVALS = `evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.scripts\n    expected: xanh\n`;
const REPORT_PASS = `---\nschema_version: 2\nfeature_slug: S\nverdict: PASS\nfailed_evals: []\nverified_commit: 0000000\nhuman_signoff:\n---\n\n# E\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: r1\n  exit_code: 0\n  verifier: config:executors.test.scripts\n  verified_at: 2026-09-01T00:00:00Z\n`;
export const G2 = (review) => ({ 'contract.md': CONTRACT_G2, 'evals.yaml': EVALS, 'evidence-report.md': REPORT_PASS, 'review-findings.md': review });
const ITEM = (p) => `- **Bat bien X**\n  Người dùng thấy gì: nguoi thay X\n  file: \`a.js\`\n  severity: medium\n  Đề xuất: ${p}\n`;

// --- Task 3: D4 + D5 ---
check('LM01 OOC van xuoi -> co vang suspect (rut tu hang)', () => {
  const r = mkWs('s', G2('## Ngoài hợp đồng\n\n**N1 — Bat bien X khong nam trong luoi thuong truc, chi tiet rat dai.**\n'));
  const out = card(r, 's').stdout; if (!out.includes(pick('MSG_OOC_SUSPECT'))) die('thieu co ' + pick('MSG_OOC_SUSPECT'));
});
check('LM02 doi chung duong: dung khuon -> KHONG co suspect', () => {
  const r = mkWs('s', G2('## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật.\n\n' + ITEM('known-limits')));
  const out = card(r, 's').stdout; if (out.includes(pick('MSG_OOC_SUSPECT'))) die('co oan'); if (!out.includes('Máy đề xuất: ghi vào hạn chế đã biết rồi ship.')) die('mat de xuat hop le');
});
check('LM03 token la -> in nguyen van + 3 token hop le, KHONG «chua de xuat»', () => {
  const r = mkWs('s', G2('## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật.\n\n' + ITEM('ghi Known limits')));
  const out = card(r, 's').stdout;
  if (!out.includes(pick('MSG_PROPOSAL_LA'))) die('thieu ' + pick('MSG_PROPOSAL_LA'));
  if (!out.includes('ghi Known limits')) die('khong in nguyen van token la');
  if (out.includes('Máy chưa đề xuất hướng nào.')) die('van in cau sai');
});
```

Cuối file (tạm — Task 8 nối thêm trước dòng này): `console.log(\`\nResults: ${passed} passed, ${failed} failed (gate-card-lmcms)\`); process.exit(failed ? 1 : 0);`

- [ ] **Step 2: Chạy đỏ** — `node tests/scripts/gate-card-lmcms.test.mjs` → LM01/LM03 FAIL «khong khai hang».

- [ ] **Step 3: Sửa `scripts/gate-card.js`** — cạnh ba hằng `MSG_NO_*` thêm:

```js
const MSG_OOC_SUSPECT = 'gate-card: mục «Ngoài hợp đồng» có chữ nhưng không đọc ra finding nào — sai khuôn OOC-ITEM-TEMPLATE, khối này đang BỊ GIẤU khỏi thẻ';
const MSG_PROPOSAL_LA = 'gate-card: đề xuất không đọc được';
```

Trong khối Cổng 2, ngay trước `if (ooc.findings.length) {`:

```js
if (ooc.suspect_empty) P.push(`<div class="flag fwarn">⚠ ${esc(MSG_OOC_SUSPECT)}</div>`);
```

Thay nhánh mặc định `: 'Máy chưa đề xuất hướng nào.'` bằng:

```js
      : f.proposal_raw ? `${MSG_PROPOSAL_LA}: '${f.proposal_raw}' — dùng một trong: ${outOfContract.PROPOSALS.join(' · ')}`
      : 'Máy chưa đề xuất hướng nào.';
```

- [ ] **Step 4: Chạy xanh** — `node tests/scripts/gate-card-lmcms.test.mjs` → 3 PASS; `bash tests/scripts/run-tests.sh | tail -2` → 0 failed.

- [ ] **Step 5: Commit**

```bash
git add scripts/gate-card.js tests/scripts/gate-card-lmcms.test.mjs
git commit -m "gate-card: cờ vàng OOC sai khuôn + token đề xuất lạ in nguyên văn (AC-5, AC-6)"
```

---

### Task 4: Classifier SẼ/KHÔNG dò ĐẦU vế Then (D6)

**Files:**
- Modify: `scripts/gate-card.js` (`const NEG_RE` ~dòng 239; `willDo/wontDo` ~317–318)
- Test: `tests/scripts/gate-card-lmcms.test.mjs`

**Interfaces:**
- Produces: `HEAD_NEG_RE` CHỈ dùng cho will/wont; `NEG_RE` cũ giữ nguyên cho `covGaps`. Hình dạng regex theo lựa chọn của owner tại Gate 1.5 (đo trên 566 AC thật của xưởng, 02/09): **mệnh-đề-đầu** (khuyến nghị) `/^[^,;.]{0,60}?\b(KHÔNG|không được|không|chặn|từ chối|refuse|reject|VIOLATION|thoát khác 0)\b/i` → cột KHÔNG-làm 251→109, giữ đủ các ca chặn thật («thoát khác 0 và KHÔNG sinh tệp», «VIOLATION»), 8 AC của hai bản phát hành đều về SẼ-làm; **head-only** `/^\s*(KHÔNG\b|không\b|chặn\b|từ chối|refuse|reject)/i` → 251→17, mất ~100 ca chặn thật vì Then tiếng Việt mở đầu bằng chủ ngữ. Chọn mệnh-đề-đầu thì AC-7 đổi vế «MỞ ĐẦU bằng từ chối/chặn» → «mệnh đề đầu của vế Then mang từ chối/chặn» (entry `fix` + chữ owner một chạm tại Gate 1.5).

- [ ] **Step 1: Ca đỏ (round-trip từ hồ sơ đã ký + ma trận đầu vế)**

```js
// --- Task 4: D6 ---
import { execFileSync } from 'node:child_process';
const PIN = '69e095e3'; // commit ký Cổng 2 của release-2-6-0 — mốc BẤT BIẾN (không neo main: CI checkout PR có thể vắng main)
const gitShow = p => execFileSync('git', ['-C', ROOT, 'show', `${PIN}:${p}`], { encoding: 'utf8' });
for (const slug of ['release-2-5-0', 'release-2-6-0']) check(`LM04 ${slug}: AC co «không» giua ve nam cot SE lam`, () => {
  const r = mkWs(slug, { 'contract.md': gitShow(`_acceptance/${slug}/contract.md`).replace(/^status: .*$/m, 'status: draft').replace(/^approved_by: .*$/m, 'approved_by:'), 'evals.yaml': gitShow(`_acceptance/${slug}/evals.yaml`) });
  const j = extract(r, slug, ['--gate', '1']);
  const ids = j.will_do.map(x => x.id);
  for (const id of ['AC-1', 'AC-2', 'AC-6']) if (!ids.includes(id)) die(id + ' roi vao KHONG lam: ' + JSON.stringify(j.wont_do.map(x => x.id)));
});
const MATRIX = [['KHÔNG ghi đè hồ sơ đã ký', 'wont'], ['không sinh file mới', 'wont'], ['script thoát khác 0 và KHÔNG sinh tệp', 'wont'], ['ghi hồ sơ, không hỏi lại', 'will'], ['nó khớp ba số (một nguồn, không so hằng)', 'will']];
MATRIX.forEach(([then, side], i) => check(`LM05.${i + 1} dau ve «${then.slice(0, 12)}» -> ${side}`, () => {
  const r = mkWs('m', { 'contract.md': `---\nschema_version: 1\nfeature: F\nslug: m\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then ${then}.\n\n## Out of scope\n\n- x.\n`, 'evals.yaml': EVALS });
  const j = extract(r, 'm', ['--gate', '1']);
  const got = j.wont_do.length ? 'wont' : 'will'; if (got !== side) die('xep ' + got);
}));
```

- [ ] **Step 2: Chạy đỏ** — LM04 ×2 và LM05.3 FAIL (substring bắt «không» giữa vế).

- [ ] **Step 3: Sửa** — thêm sau `const thenOf`:

```js
// Phân cột SẼ/KHÔNG-làm theo ĐẦU vế Then (loi-moi-cong-may-sinh D6): một chữ
// «không» giữa câu («không so hằng», «không đổi kể từ mốc trước») không biến
// cả tiêu chí thành việc máy KHÔNG làm — 2.5.0 và 2.6.0 từng bị xếp nhầm cả ba AC.
const HEAD_NEG_RE = /^[^,;.]{0,60}?\b(KHÔNG|không được|không|chặn|từ chối|refuse|reject|VIOLATION|thoát khác 0)\b/i; // mệnh-đề-đầu (owner chọn Gate 1.5); head-only: /^\s*(KHÔNG\b|không\b|chặn\b|từ chối|refuse|reject)/i
```

và đổi hai dòng: `const willDo = acs.filter(x => !x.judgment && !HEAD_NEG_RE.test(thenOf(x.gwt)));` / `const wontDo = acs.filter(x => !x.judgment && HEAD_NEG_RE.test(thenOf(x.gwt)));` (giữ `NEG_RE` cho `covGaps`).

- [ ] **Step 4: Chạy xanh + hồi quy** — test file → PASS; `bash tests/scripts/run-tests.sh | tail -2`; **chạy thêm** `bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|P1[0-9][0-9]" | head` vì suite plugins có ca ghim khối SẼ/KHÔNG trên fixture — ca nào đỏ thì đọc fixture của nó: nếu Then của fixture mở đầu bằng «không» thì ca đúng và cột đổi hợp lệ → cập nhật kỳ vọng của ca kèm comment «D6»; nếu không → bug ở regex.

- [ ] **Step 5: Commit** — `git add scripts/gate-card.js tests/scripts/gate-card-lmcms.test.mjs [tests/plugins/run-tests.sh]` · `git commit -m "gate-card: cột SẼ/KHÔNG dò đầu vế Then, thôi bắt «không» giữa câu (AC-7)"`.

---

### Task 5: Luật rơi bậc trên thẻ Cổng 1 (D3)

**Files:**
- Modify: `scripts/gate-card.js` (sau `const gpVerdictKnown` ~dòng 346; khối flags Cổng 1; JSON `--extract` Cổng 1)
- Test: `tests/scripts/gate-card-lmcms.test.mjs`

**Interfaces:**
- Produces: `const MSG_ROI_BAC = 'gate-card: đối kháng không chạy được — phần vượt-nhận-thức rơi về anh, thẻ này không điền sẵn gì';` · biến `roiBac` (boolean) · trường extract `roi_bac: {on, reason}` · Task 6 đọc `roiBac` để tắt điền sẵn.

- [ ] **Step 1: Ma trận 4 ô đỏ**

```js
// --- Task 5: D3 ---
const G1 = (probe) => { const f = { 'contract.md': `---\nschema_version: 1\nfeature: F\nslug: g\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- trục A [thước CE: x].\n\n## Out of scope\n\n- x.\n`, 'evals.yaml': EVALS, 'decisions.jsonl': '' }; if (probe !== null) f['gap-probe.md'] = probe; return f; };
const PROBE = v => `---\nslug: g\nat: 2026-09-01T00:00:00Z\nverdict: ${v}\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n`;
const ROI = [['findings', PROBE('findings'), false], ['probe-failed', PROBE('probe-failed'), true], ['vang-khi-required', null, true], ['file-hong-token-la', 'verdict: maybe\nkhong co frontmatter', true], ['vang-khi-advisory', null, false]];
for (const [n, probe, expect] of ROI) check(`LM06 roi bac [${n}] = ${expect}`, () => {
  const r = mkWs('g', G1(probe)); if (n === 'vang-khi-advisory') writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\ngap_probe: advisory\n'); const j = extract(r, 'g', ['--gate', '1']); const out = card(r, 'g', ['--gate', '1']).stdout;
  if (!!(j.roi_bac && j.roi_bac.on) !== expect) die('extract roi_bac=' + JSON.stringify(j.roi_bac));
  if (out.includes(pick('MSG_ROI_BAC')) !== expect) die('HTML khoi roi-bac ' + (expect ? 'thieu' : 'thua'));
});
```

- [ ] **Step 2: Chạy đỏ** — 4 FAIL (không có hằng/trường).

- [ ] **Step 3: Sửa** — cạnh các hằng: `const MSG_ROI_BAC = '…';` (chuỗi trên). Sau `const gpVerdictKnown …`:

```js
  // ĐẢO CHIỀU MẶC ĐỊNH (loi-moi-cong-may-sinh D3): chỉ khi gap-probe.md đọc được
  // VÀ verdict thuộc tập khai VÀ không phải probe-failed thì đối kháng mới «đã
  // chạy». Mọi trạng thái khác — vắng (không descope), file hỏng, token lạ,
  // probe-failed — đều rơi bậc: phần vượt-nhận-thức trả về người, thẻ không
  // điền sẵn gì, và chữ ký không được nói «đối kháng đã hội tụ».
  // Mode đọc từ config (khoá vắng = advisory — cùng mặc định với pre-merge-check.sh):
  // vắng gap-probe chỉ rơi bậc khi repo khai `required`; repo advisory/off không bị
  // đỏ oan mọi thẻ (crm, media-library, floorplanstudio đều advisory — rà soát 02/09).
  const gpMode = (function () { const m = /^\s*gap_probe:\s*([a-z]+)/m.exec(read(path.join(root, '_acceptance', 'config.yaml'))); return m ? m[1] : 'advisory'; })();
  const roiBacReason = !gpPresent ? (gpDescope || gpMode !== 'required' ? '' : 'vang')
    : !gpVerdictKnown ? 'khong-doc-duoc' : gpVerdict === 'probe-failed' ? 'probe-failed' : '';
  const roiBac = !!roiBacReason;
```

Thêm vào JSON `--extract` Cổng 1 khoá `roi_bac: { on: roiBac, reason: roiBacReason }`. Trong khối flags Cổng 1, ngay sau dòng `if (tier === 'T3') flags.push(…)`: `if (roiBac) flags.push(['fred', esc(MSG_ROI_BAC)]);`.

- [ ] **Step 4: Chạy xanh** — 4 PASS; `bash tests/scripts/run-tests.sh | tail -2` → 0 failed.

- [ ] **Step 5: Commit** — `git commit -m "gate-card: luật rơi bậc — gap-probe vắng/hỏng/probe-failed đều trả phần vượt-nhận-thức về người (AC-4)"`.

---

### Task 6: Câu gộp máy-sinh + bảng định tuyến + khối PHÁN QUYẾT ĐỐI KHÁNG (D1, D2)

**Files:**
- Modify: `scripts/gate-card.js` — hằng lệnh; Cổng 1: khối VIỆC CỦA ANH (~571) + extract; Cổng 2: khối ymItems (~812–846) + extract + khối mới trước «Ngoài hợp đồng»
- Test: `tests/scripts/gate-card-lmcms.test.mjs`

**Interfaces:**
- Produces: `const ONE_SHOT_CMD_APPROVE = '/acceptance-gate:approve';` · `const ONE_SHOT_CMD_SIGNOFF = '/acceptance-gate:signoff';` (khuôn gmpick) · hàm `oneShotG1(slug, blocked, roiBac)` và `oneShotG2(slug, ctx)` trả chuỗi · extract `one_shot` (cả hai cổng) · extract Cổng 2 `routing: { hoi: [...nhãn], bao: [...nhãn] }` · khối HTML «PHÁN QUYẾT ĐỐI KHÁNG».
- Bảng định tuyến đặt giữa marker `<<<ROUTING-TABLE … ROUTING-TABLE>>>` dưới dạng hằng đối tượng, hàng mặc định `'*': 'hoi'`; `route(kind)` PHẢI được gọi với `kind` suy từ dữ liệu (không literal) để hàng `*` sống — test LM10 tiêm mục kind lạ qua fixture và đo ĐẦU RA (ô hỏi tăng 1), không grep mã nguồn.
- **Từ vựng đề xuất MỘT NGUỒN** (rủi ro #1 Gate 1.5): one_shot in chữ NGƯỜI mà `signoff.md` đang dạy — `Ngoài-N: ghi Known limits` / `mở hợp đồng mới` / `nâng phạm vi sửa ngay` — ánh xạ từ token máy qua bảng `OOC_GLOSS_NGUOI = { 'known-limits': 'ghi Known limits', 'new-contract': 'mở hợp đồng mới', 'wont-fix': 'chấp nhận, không sửa' }` đặt cạnh `PROPOSALS` trong `lib/out-of-contract.js`; thân lệnh `signoff.md` học thêm nhãn thứ ba «chấp nhận, không sửa» ↔ `wont-fix` (răng ONESHOT-BODY canh nhãn g2 — cập nhật GATE-ONESHOT-SLOTS cùng lượt).

- [ ] **Step 1: Ma trận đỏ**

```js
// --- Task 6: D1 + D2 ---
const LEDGER = `{"id":"d-1","type":"descope","stage":"S1","at":"2026-09-01T00:00:00Z","decision":"bỏ X","impact":"y"}\n{"id":"d-2","type":"seal","gate":1,"at":"2026-09-01T00:00:00Z"}\n{"id":"d-3","type":"fix","stage":"S4-r1","at":"2026-09-01T01:00:00Z","decision":"sửa Z","impact":"w"}\n`;
const REVIEW2 = '## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật.\n\n' + ITEM('known-limits') + '\n' + ITEM('');   // Ngoài-1 có khuyến nghị, Ngoài-2 không
check('LM07 one_shot Cong 1 sach', () => {
  const r = mkWs('g', G1(PROBE('findings'))); const j = extract(r, 'g', ['--gate', '1']);
  if (j.one_shot !== `${pick('ONE_SHOT_CMD_APPROVE')} g duyệt`) die(j.one_shot);
});
check('LM08 one_shot Cong 1 roi bac -> khong dien san', () => {
  const r = mkWs('g', G1(null)); const j = extract(r, 'g', ['--gate', '1']);
  if (j.one_shot !== `${pick('ONE_SHOT_CMD_APPROVE')} g ___`) die(j.one_shot);
});
check('LM09 one_shot Cong 2 du bon nhom o, tap ___ = loai-5-khong-khuyen-nghi + chu quyet', () => {
  const f = G2(REVIEW2); f['decisions.jsonl'] = LEDGER; f['gap-probe.md'] = PROBE('findings');
  const r = mkWs('s', f); const j = extract(r, 's');
  const want = `${pick('ONE_SHOT_CMD_SIGNOFF')} s Ngoài-1: ghi Known limits; Ngoài-2: ___; cắt/hoãn: đồng ý cắt; Treo: phê hết; ký hay trả: ___`;
  if (j.one_shot !== want) die('\n got: ' + j.one_shot + '\nwant: ' + want);
  const html = card(r, 's').stdout; if (!html.includes(j.one_shot)) die('HTML khong chua dung chuoi one_shot (hai nguon)');
});
check('LM10 routing: o hoi == loai-5; scope + Treo la dong bao; muc ngoai bang -> HOI', () => {
  const f = G2(REVIEW2); f['decisions.jsonl'] = LEDGER; f['gap-probe.md'] = PROBE('findings');
  const r = mkWs('s', f); const j = extract(r, 's');
  if (JSON.stringify(j.routing.hoi) !== JSON.stringify(['Ngoài-1', 'Ngoài-2', 'ký hay trả'])) die('hoi=' + JSON.stringify(j.routing.hoi));
  if (!j.routing.bao.includes('cắt/hoãn') || !j.routing.bao.includes('Treo')) die('bao=' + JSON.stringify(j.routing.bao));
  // chieu do 1: them 1 muc loai-5 (judgment UNCERTAIN) -> o hoi tang dung 1 (dang thuc so)
  const f2 = G2(REVIEW2); f2['decisions.jsonl'] = LEDGER; f2['gap-probe.md'] = PROBE('findings');
  f2['evals.yaml'] = EVALS + `  - id: E9\n    criterion: AC-1\n    executor: judgment\n    expected: mat nguoi\n`;
  f2['evidence-report.md'] = REPORT_PASS.replace('| E1 | AC-1 | test | PASS |', '| E1 | AC-1 | test | PASS |\n| E9 | AC-1 | judgment | UNCERTAIN |').replace('verdict: PASS', 'verdict: PENDING-JUDGMENT');
  const j2 = extract(mkWs('s2', f2), 's2'); if (j2.routing.hoi.length !== j.routing.hoi.length + 1) die('them 1 loai-5 nhung o hoi tang ' + (j2.routing.hoi.length - j.routing.hoi.length));
  // chieu do 2 (ngoai bang): fixture co khoi provisional voi type la -> route() nhan kind khong co trong bang -> phai roi ve HOI
  const f3 = G2(REVIEW2); f3['decisions.jsonl'] = LEDGER + `{"id":"d-9","type":"loai-la","stage":"S4-r1","at":"2026-09-01T02:00:00Z","decision":"gi do","impact":"x"}\n`; f3['gap-probe.md'] = PROBE('findings');
  const j3 = extract(mkWs('s3', f3), 's3'); if (!j3.routing.hoi.some(x => /Treo|loai-la|d-9/.test(x))) die('muc ngoai bang khong roi ve HOI: ' + JSON.stringify(j3.routing));
});
check('LM11 khoi PHAN QUYET DOI KHANG mang verdict + p0/p1/p2', () => {
  const f = G2(REVIEW2); f['gap-probe.md'] = PROBE('findings').replace('p1: 0', 'p1: 2');
  const r = mkWs('s', f); const html = card(r, 's').stdout;
  if (!html.includes(pick('LBL_DOI_KHANG'))) die('thieu khoi');
  const txt = html.replace(/<[^>]+>/g, ' ');   // bóc tag rồi mới so — «<b>findings</b> · P0 0 · P1 2» (phép HOẶC trong assert là chỗ trốn, ghim MỘT dạng)
  if (!/findings\s+·\s+P0 0\s+·\s+P1 2\s+·\s+P2 0/.test(txt)) die('khong in dung so: ' + txt.slice(txt.indexOf('findings'), txt.indexOf('findings') + 60));
});
```

- [ ] **Step 2: Chạy đỏ** — LM07…LM11 FAIL.

- [ ] **Step 3: Sửa `scripts/gate-card.js`** — cạnh hằng:

```js
// <<<ONE-SHOT-CMD — MỘT nguồn của tên lệnh in ra thẻ; luật «lệnh in ra phải
// bấm được» (chip D, #93+#98) được máy giữ ở đây thay vì trí nhớ phiên.
const ONE_SHOT_CMD_APPROVE = '/acceptance-gate:approve';
const ONE_SHOT_CMD_SIGNOFF = '/acceptance-gate:signoff';
// ONE-SHOT-CMD>>>
const LBL_DOI_KHANG = 'PHÁN QUYẾT ĐỐI KHÁNG — thay mắt người ở phần vượt nhận thức';
// <<<ROUTING-TABLE — mục thẻ → 'hoi' (ô người quyết, loại-5) | 'bao' (máy đã
// đi, dòng báo + cửa veto). Không gian mục là MỞ nên hàng '*' là MẶC ĐỊNH và
// đoán về phía HỎI — nuốt quyết định của người là chiều cấm (design D2).
const ROUTING = { 'ngoai': 'hoi', 'judgment': 'hoi', 'ky': 'hoi', 'scope': 'bao', 'treo': 'bao', '*': 'hoi' };
// ROUTING-TABLE>>>
const route = kind => ROUTING[kind] || ROUTING['*'];
```

Cổng 1 — thay khối `P.push(\`<div class="lab">👉 VIỆC CỦA ANH</div>…\`)` bằng:

```js
  // Nguồn cờ đỏ THẬT của Cổng 1 (rà soát Gate 1.5): rangHong · mienDoCoNguoiDung · blindSpot (đỏ nhưng nằm ngoài mảng flags) — dupIds chỉ vàng, KHÔNG chặn. Tính TRƯỚC extract.
  const blocked = !!rangHong || mienDoCoNguoiDung || !!blindSpot;
  const oneShot = `${ONE_SHOT_CMD_APPROVE} ${slug} ${roiBac || blocked ? '___' : 'duyệt'}`;
  P.push(`<div class="lab">👉 VIỆC CỦA ANH</div><div class="grp gdo"><p class="li"><b>Duyệt hay trả hồ sơ này</b> — làm gì: đọc khối PHÁN QUYẾT ĐỐI KHÁNG và các cờ chú ý; ở đâu: gõ dòng dưới trong phiên đang trình thẻ; sửa chữ cuối thành «sửa: …» nếu trả lại.</p><p class="li">Trả lời mẫu (một dòng, ${roiBac || blocked ? 'chưa điền sẵn — thẻ đang có cờ đỏ' : 'đã điền sẵn khuyến nghị'}): «${esc(oneShot)}»</p></div>`);
```

và thêm `one_shot: oneShot, routing: { hoi: ['duyệt hay sửa'], bao: [] }` vào JSON extract Cổng 1 — LƯU Ý extract nằm TRƯỚC khối flags: chuyển phép tính `blocked` lên trước `if (EXTRACT)` hoặc tính `oneShot` từ `roiBac` + `dupIds.length + mienDoCoNguoiDung + !!rangHong` (đúng ba nguồn cờ đỏ hiện có).

Cổng 2 — trước `if (ooc.unclassified)` thêm khối đối kháng:

```js
{ // PHÁN QUYẾT ĐỐI KHÁNG: loại-3 render thành số, không thành vật (design D2)
  const gpT = read(path.join(dir, 'gap-probe.md')); const gpF = frontmatter(gpT);
  const rows = section(gpT, 'Findings').filter(l => /^\s*\|/.test(l) && !/^\s*\|\s*(Sev|:?-+)/i.test(l));
  const fixed = rows.filter(l => /\|\s*fixed:/i.test(l)).length;
  const verdict3 = clean(gpF.verdict).toLowerCase();
  P.push(`<div class="lab">${esc(LBL_DOI_KHANG)}</div><div class="grp gnot"><p class="li">Phản biện context sạch: <b>${esc(verdict3 || 'không đọc được')}</b> · P0 ${esc(clean(gpF.p0) || '0')} · P1 ${esc(clean(gpF.p1) || '0')} · P2 ${esc(clean(gpF.p2) || '0')} · đã sửa ${fixed}/${rows.length}</p><p class="li">Rà soát đối kháng: ${ooc.findings.length} mục ngoài hợp đồng${ooc.suspect_empty ? ' (⚠ khối nghi sai khuôn)' : ''} · ${decisions.length} mục cần mắt người</p></div>`);
}
```

Cổng 2 — trong khối `ymItems`, xây thêm `oneParts` song song với `ymSlots`:

```js
  const oneParts = [];
  ooc.findings.forEach((f, fi) => { const lbl = 'Ngoài-' + (fi + 1); oneParts.push(`${lbl}: ${f.proposal ? outOfContract.OOC_GLOSS_NGUOI[f.proposal] : '___'}`); });
  for (const d of decisions) oneParts.push(`${d.id}: ___`);
  if (oos.length) oneParts.push('cắt/hoãn: đồng ý cắt');
  if (decsProvisional.length) oneParts.push('Treo: phê hết');
  oneParts.push(MAY_DI_TIEP ? 'veto hay để yên: ___' : 'ký hay trả: ___');
  const oneShot = `${ONE_SHOT_CMD_SIGNOFF} ${slug} ${oneParts.join('; ')}`;
  const routingHoi = [...ooc.findings.map((_, i) => 'Ngoài-' + (i + 1)).filter(() => route('ngoai') === 'hoi'), ...decisions.map(d => d.id), MAY_DI_TIEP ? 'veto hay để yên' : 'ký hay trả'];
  const routingBao = [...(oos.length && route('scope') === 'bao' ? ['cắt/hoãn'] : []), ...(decsProvisional.length && route('treo') === 'bao' ? ['Treo'] : [])];
```

Thay dòng «Trả lời mẫu» cuối khối bằng `<p class="li">Trả lời mẫu (một dòng, đã điền sẵn khuyến nghị — sửa ô nào anh nghĩ khác): «${esc(oneShot)}»</p>`; các mục scope/Treo trong `ymItems` đổi chữ «trả lời dạng» thành «máy đã điền «đồng ý cắt»/«phê hết» — chỉ sửa nếu anh không đồng ý». Extract Cổng 2 thêm `one_shot: oneShot, routing: { hoi: routingHoi, bao: routingBao }` — thứ tự biến THẬT (rà soát Gate 1.5): `MAY_DI_TIEP` tính ở ~dòng 716, SAU `--extract` (639) và SAU nhánh thoát non-approvable (647). Nên: (a) dời cả khối tính `MAY_DI_TIEP` (quét trạng thái) lên TRƯỚC `if (EXTRACT)`, (b) chỉ dựng `oneShot` khi `approvable`, còn không thì `one_shot: null` (thẻ REJECT/BLOCKED không có câu gộp — đúng khối «không cần làm gì»), (c) hồi quy: chạy lại toàn bộ ca thẻ Cổng 2 trong tests/scripts + tests/plugins sau khi dời.

- [ ] **Step 4: Chạy xanh** — LM07…LM11 PASS; `bash tests/scripts/run-tests.sh | tail -2`; **`bash tests/plugins/run-tests.sh 2>&1 | grep -E "P185|P186|P187"`** → P186 nay PASS với đẳng thức Task 1 (fixture: sửa số mong đợi nếu fixture khác 2, ghi comment).

- [ ] **Step 5: Commit** — `git commit -m "gate-card: câu gộp máy-sinh hai cổng + bảng định tuyến có hàng mặc định + khối PHÁN QUYẾT ĐỐI KHÁNG (AC-1, AC-2, AC-3)"`.

---

### Task 7: Nới echo danh tính khi hai nguồn khớp (D7) — sửa tại nguồn grammar + hai bản chép

**Files:**
- Modify: `skills/acceptance/references/human-facing-language.md` (khối `GATE-ONESHOT-GRAMMAR`, đoạn «Suy xong HIỂN THỊ LẠI…»)
- Modify: `commands/approve.md`, `commands/signoff.md` (đoạn tương ứng)
- Test: `tests/plugins/run-tests.sh` (răng ONESHOT + NEO anchors — phải GIỮ cụm «Enter xác nhận», «với danh tính:», «(từ <nguồn suy>)»)

- [ ] **Step 1: Sửa nguồn** — thay câu `Suy xong HIỂN THỊ LẠI theo khuôn «với danh tính: <tên> <ngày> (từ <nguồn suy>) — Enter xác nhận» TRƯỚC khi ghi` bằng:

```markdown
  Suy xong: nếu `git config user.name` và `signoff.approvers` KHỚP TUYỆT ĐỐI
  (danh sách đúng một tên và bằng tên git) thì GHI THẲNG rồi hiển thị lại
  «với danh tính: <tên> <ngày> (từ <nguồn suy>)» — không chờ, vì hai nguồn
  độc lập đã đồng ý và người vẫn lật được bằng một câu; mọi ca khác HIỂN THỊ
  LẠI theo khuôn «với danh tính: <tên> <ngày> (từ <nguồn suy>) — Enter xác
  nhận» TRƯỚC khi ghi
```

(giữ nguyên phần còn lại của đoạn — «khuôn PHẢI in cả nguồn suy…»).

- [ ] **Step 2: Chép đoạn tương ứng vào `commands/approve.md` và `commands/signoff.md`** (mỗi thân lệnh có câu «Suy xong HIỂN THỊ LẠI…» — thay bằng cùng ý, cùng cụm neo).

- [ ] **Step 3: Chạy răng** — `bash tests/plugins/run-tests.sh 2>&1 | grep -E "ONESHOT|NEO|FAIL"` → không FAIL; nếu răng so từng-ký-tự đoạn này giữa nguồn và bản chép thì chép NGUYÊN VĂN.

- [ ] **Step 4: Commit** — `git commit -m "law(grammar): hai nguồn danh tính khớp tuyệt đối → ghi thẳng + hiển thị lại, bỏ lượt Enter (AC-8)"`.

---

### Task 8: Quét trọn xưởng — cờ oan không được xanh lén (E11)

**Files:**
- Create: `_acceptance/loi-moi-cong-may-sinh/sweep-baseline.txt`
- Test: `tests/scripts/gate-card-lmcms.test.mjs` (ca LM12)

- [ ] **Step 1: ĐẾM TRƯỚC — dựng baseline bằng chính bộ dựng đã vá**

```bash
for d in _acceptance/*/; do s=$(basename "$d"); [ -f "$d/contract.md" ] || continue; node scripts/gate-card.js --root . --slug "$s" --extract 2>/dev/null | node -e 'let t="";process.stdin.on("data",c=>t+=c).on("end",()=>{try{const j=JSON.parse(t);const f=[];if(j.out_of_contract&&j.out_of_contract.suspect_empty)f.push("suspect_empty");for(const x of (j.out_of_contract||{}).findings||[])if(x.proposal_raw&&!x.proposal)f.push("token-la:"+x.proposal_raw);if(j.roi_bac&&j.roi_bac.on)f.push("roi-bac:"+j.roi_bac.reason);if(f.length)console.log(process.argv[1]+"\t"+f.join(","))}catch(e){}})' "$s"; done | sort > _acceptance/loi-moi-cong-may-sinh/sweep-baseline.txt
wc -l _acceptance/loi-moi-cong-may-sinh/sweep-baseline.txt
```

(Extract Cổng 2 phải xuất `suspect_empty` + `proposal_raw` trong `out_of_contract` — thêm hai trường ở Task 6 nếu chưa.)

- [ ] **Step 2: ĐỊNH ĐOẠT từng dòng** — mở file, sau mỗi dòng thêm cột thứ ba `that-sai-khuon` (kèm 1 câu bằng chứng: dòng nào của file sai khuôn) hoặc `co-oan`. Rà soát 02/09 ĐÃ đo trước trên cây hiện tại: 2/3 hit `suspect_empty` là lời khai rỗng hợp lệ («Ngoài hợp đồng: không có — …» mở đầu bằng «(» hoặc «không có»), 8/14 token lạ là token hợp lệ kèm chú thích («known-limits — vì…»). Nên trước Step 1 PHẢI: (a) `OOC_INTRO_RE` mở rộng thành nhận cả lời khai rỗng (`/^(Các lỗi dưới đây là thật|\(?\s*không có\b|n-a\b)/`), (b) token so khớp TIỀN TỐ (`v.split(/\s*[—(:]/)[0].trim()`) và giữ đuôi ở `proposal_raw`. Sau đó mới đếm. Bất kỳ `co-oan` còn lại ⇒ quay lại Task 2/3/5, chạy lại Step 1. Chỉ commit baseline khi 0 dòng `co-oan`; baseline ghi CẢ loại cờ theo slug (`slug\tloại`) để cờ oan MỚI trên hồ sơ đã có tên vẫn lệch baseline.

- [ ] **Step 3: Ca LM12 giữ baseline**

```js
// --- Task 8: E11 ---
check('LM12 quet xuong: tap ho so bat co == baseline da dinh doat', () => {
  const base = readFileSync(path.join(ROOT, '_acceptance', 'loi-moi-cong-may-sinh', 'sweep-baseline.txt'), 'utf8').split('\n').filter(Boolean).map(l => l.split('\t').slice(0, 2).join('\t')).sort();   // slug + loại cờ, không chỉ slug
  const acc = path.join(ROOT, '_acceptance'); const got = [];
  for (const s of readdirSync(acc)) { if (!existsSync(path.join(acc, s, 'contract.md'))) continue; const r = spawnSync('node', [GC, '--root', ROOT, '--slug', s, '--extract'], { encoding: 'utf8' }); if (r.status !== 0) continue; const j = JSON.parse(r.stdout); const o = j.out_of_contract || {}; const fl = []; if (o.suspect_empty) fl.push('suspect_empty'); for (const x of (o.findings || [])) if (x.proposal_raw && !x.proposal) fl.push('token-la:' + x.proposal_raw); if (j.roi_bac && j.roi_bac.on) fl.push('roi-bac:' + j.roi_bac.reason); if (fl.length) got.push(s + '\t' + fl.join(',')); }
  got.sort(); if (JSON.stringify(got) !== JSON.stringify(base)) die('lech baseline\n got: ' + got.join(',') + '\nbase: ' + base.join(','));
});
```
(thêm `readdirSync, existsSync` vào import).

- [ ] **Step 4: Chạy** — PASS; đối chứng: xoá tạm một dòng baseline → FAIL «lech baseline» → khôi phục.

- [ ] **Step 5: Commit** — `git add _acceptance/loi-moi-cong-may-sinh/sweep-baseline.txt tests/scripts/gate-card-lmcms.test.mjs` · `git commit -m "lmcms: baseline quét xưởng đã định đoạt từng dòng + ca giữ baseline (E11)"`.

---

### Task 9: Thân lệnh và bản đồ — thẻ dạy khối mới

**Files:**
- Modify: `commands/acceptance-card.md` (bước Extract/Render: thêm mô tả khối PHÁN QUYẾT ĐỐI KHÁNG, dòng one_shot, cờ rơi-bậc, cờ OOC sai khuôn)
- Modify: `docs/superpowers/specs/2026-09-02-loi-moi-cong-may-sinh-design.md` (nếu Task 1–8 lệch thiết kế → sửa thiết kế, không sửa mã cho khớp thiết kế cũ)

- [ ] **Step 1:** Thêm vào `commands/acceptance-card.md`, mục Extract: «Từ 2.7 JSON có `one_shot` (dòng lệnh đầy đủ, ô có khuyến nghị đã điền, `___` chỉ ở ô người tự quyết và chữ quyết), `routing` (mục nào là ô hỏi, mục nào là dòng báo), `roi_bac` (Cổng 1: đối kháng không chạy được → không điền sẵn). Thẻ in `one_shot` nguyên văn ở khối VIỆC CỦA ANH — người dán lại, sửa ô nào nghĩ khác, gõ chữ quyết.»

- [ ] **Step 2:** `bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL"` (răng thân lệnh) → rỗng.

- [ ] **Step 3: Commit** — `git commit -m "docs(acceptance-card): thân lệnh dạy one_shot, routing, rơi bậc"`.

---

## Self-review

- **Spec coverage:** D1→Task 6 (+Task 1 hợp pháp hoá) · D2→Task 6 (bảng ROUTING có `*`) · D3→Task 5 · D4→Task 2+3 · D5→Task 2+3 · D6→Task 4 · D7→Task 7 · N3 (routing áp khối provisional)→Task 6 (`treo` → `bao`, `Treo: phê hết` điền sẵn; khó-đảo tách riêng: chưa có tín hiệu máy-đọc cho «khó-đảo» trong ledger — **giới hạn khai**: phiên bản này coi mọi Treo là báo, người vẫn thấy chúng và câu mẫu vẫn sửa được; đường nâng: khoá `irreversible: true` trong entry ledger → Task tương lai) · E11→Task 8 · AC-8→Task 7.
- **Placeholder scan:** không còn «TBD/tương tự Task N»; Task 1 Step 6 và Task 6 Step 4 có nhánh «nếu fixture khác 2» — đó là chỉ dẫn đọc fixture có thật, không phải placeholder.
- **Type consistency:** `pick`, `mkWs`, `card`, `extract`, `G1`, `G2`, `ITEM`, `PROBE`, `EVALS` khai một lần ở Task 3 và dùng xuyên suốt; `roiBac`/`roi_bac`, `one_shot`, `routing.hoi/bao`, `PROPOSALS`, `proposal_raw`, `suspect_empty` nhất quán giữa Task 2/5/6/8.
