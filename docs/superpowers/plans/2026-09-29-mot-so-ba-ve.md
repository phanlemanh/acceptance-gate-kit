# Một sổ ba vế — Kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mỗi quyết định máy làm thay người thành một dòng sổ ba vế (`decision · why · cost_if_wrong`) trong `decisions.jsonl`, thẻ Cổng 1/2 in dòng đó thành một câu ba vế, và ruling của superpowers được gặt vào sổ trước khi thư mục tạm của nó bị xoá.

**Architecture:** Bốn mảnh rời: (1) khuôn ghi sổ trong SKILL feature-loop (khối `DEC-ID-RECIPE`); (2) bộ dựng thẻ `scripts/gate-card.js` thêm hàm `decBaVe` dùng cho cả ba khối; (3) cầu nối `scripts/cau-noi-ruling.mjs` đọc `.superpowers/sdd/<ws>/progress.md`, cắt ba vế theo NHÃN, append vào sổ; (4) hook `hooks/ruling-truoc-khi-xoa.js` đăng ký PreToolUse matcher `Bash`, chặn `rm` đệ quy vào thư mục tạm cho tới khi cầu nối chạy xong.

**Tech Stack:** Node ≥ 20 thuần (không phụ thuộc ngoài), bash cho khung test hook, cùng nếp test `*.test.mjs` tự in `PASS: <tên ca> ` của kho.

**Spec:** `docs/superpowers/specs/2026-09-29-mot-so-ba-ve-design.md` · hợp đồng `_acceptance/mot-so-ba-ve/contract.md` (duyệt Cổng 1, 29/09) · evals `_acceptance/mot-so-ba-ve/evals.yaml`.

## Global Constraints

- Tên ca = tên AC: mọi ca in đúng `PASS: <MS-AC…|RT-AC6-…> ` (có dấu cách sau tên — khoá `executors.script.msbv` grep `PASS: $c `).
- Mọi đường dẫn trong test suy từ vị trí tệp test (`const HERE = path.dirname(fileURLToPath(import.meta.url))`), không hardcode gốc kho.
- Phép đo mới đi theo cặp hai chiều trên CÙNG fixture: vật lành → xanh, bản sao phá vật → đỏ với thông điệp ghim. Bản sao chép TRỌN thư mục (`scripts/`, `lib/`, `hooks/`), không chép danh sách tệp tay (P150). Kim đột biến phải khớp ĐÚNG MỘT lần trong nguồn thật.
- Đường đọc-cũ: dòng sổ chỉ có `decision + impact` in y như hôm nay.
- Không chạm hồ sơ đã ký nào dưới `_acceptance/`; test không ghi vào cây kho TRỪ tệp `_acceptance/mot-so-ba-ve/evidence/the-cong-2-ba-ve.txt`, và chỉ ghi khi nội dung khác (Task 2). Nội dung tệp đó TẤT ĐỊNH: dòng đầu `# fixture sha256 <băm> · at <ISO của fixture>` (giờ lấy từ trường `at` của fixture, không phải giờ chạy) — nếu mang giờ chạy thì mỗi lượt suite ghi lại tệp, và sau khi hồ sơ ký, làn ghim lại đỏ vì «chạm hồ sơ đã thông cổng». Lệch chữ E4/E8 («at <ISO lúc chạy>», «không sớm hơn 24 giờ») sửa ở Task 2 Step 5 và ghi dòng sổ S2.
- Thông điệp máy bằng tiếng Việt, có tiền tố tên script (`cau-noi-ruling: …`, `ruling-truoc-khi-xoa: …`).
- `SHA_NEN = 705077e53764e482593fb47c68a5f9e9034091f3` — output `git rev-parse origin/main` ngày 29/09 trước vòng (CI checkout `fetch-depth: 0` nên sha này resolve được).

## Review Focus

1. **Ruling nhiều dòng** (ledger thật dòng 127–138: `Ruling: …` gãy dòng tới dòng trống) — cầu nối gộp các dòng nối tiếp thành MỘT ruling; ca ở Task 3 (`MS-AC5-ma-tran`, hàng đoạn).
2. **Nhãn biến thể** — không dấu (`Vi sao:`, `Sai thi ton:`), `Vì sao lật:`, `Giá nếu sai:`, `cost if wrong:` — đều là dấu cắt; ca ở Task 3.
3. **Dòng có giá mà không có vì-sao** (ledger thật dòng 59: `Ruling: … — Sai thì tốn: …`) — thẻ vẫn phải in giá, không được rơi mất; ca `MS-AC4-chi-gia` ở Task 2.
4. **Hook chạy khi thư mục làm việc là thư mục con của kho** và lệnh xoá mang đường TUYỆT ĐỐI (đúng hình superpowers phát) — hook suy gốc kho từ chính đường `.superpowers/sdd`, không từ `cwd`; hàng `cwd-con` ở Task 4.
5. **Đường có chữ `.superpowers` mà không phải thư mục tạm** (`rm -rf /tmp/x.superpowers-bak`) — hook im, sổ không đổi; hàng im ở Task 4.

---

### Task 1: Khuôn ghi sổ ba vế trong SKILL + văn bản thẻ

`independent: true` · phục vụ **E1** (AC-1), **E7** (AC-7)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (mục «Sổ quyết định» dòng 70–90; khối `DEC-ID-RECIPE` dòng 73–79; khối `DEC-TARGET-SLOT`; S3 bước 1 dòng 188)
- Modify: `commands/acceptance-card.md` (mục `decisions_plain`, ngay trên khối `DEC-PLAIN-ITEM-TEMPLATE`)
- Modify: `tests/scripts/gate-card-dec-key.test.mjs:287-297` (lỗ `IMPACT_HOLE` dời sang ô `cost_if_wrong`)
- Create: `tests/scripts/msbv-fixture.mjs` (helper dùng chung Task 1 + Task 2)
- Create: `tests/scripts/msbv-so.test.mjs`

**Interfaces:**
- Produces: `ghiSo(ledgerPath, { type, stage, at, decision, why, cost_if_wrong })` trong `msbv-fixture.mjs` — chạy khối `DEC-ID-RECIPE` rút từ SKILL bằng `bash -c`, trả dòng JSON vừa ghi (object). `recipeOf(skillText)` trả chuỗi lệnh trong khối.
- Produces (văn bản): khối `DEC-ID-RECIPE` dòng giữa đúng khuôn
  `"type":"<type>","stage":"<stage>","at":"<ISO>","decision":"<1 câu>","why":"<vì sao, 1 câu>","cost_if_wrong":"<sai thì tốn gì, 1 câu>"`

- [ ] **Step 1: Viết helper `tests/scripts/msbv-fixture.mjs`**

```js
// msbv-fixture.mjs — helper hồ sơ mot-so-ba-ve: ghi sổ bằng CHÍNH lệnh rút từ khối DEC-ID-RECIPE
// của SKILL feature-loop (round-trip bên viết → bên đọc), không gõ tay dòng JSON.
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(HERE, '..', '..');
export const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
export const recipeOf = t => {
  const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]+?)\n```\n<!-- DEC-ID-RECIPE>>> -->/g);
  if (!m || m.length !== 1) throw new Error(`khoi DEC-ID-RECIPE phai co dung mot, thay ${m ? m.length : 0}`);
  return m[0].replace(/^<!-- <<<DEC-ID-RECIPE -->\n```\n/, '').replace(/\n```\n<!-- DEC-ID-RECIPE>>> -->$/, '');
};
const jsonStr = s => JSON.stringify(String(s)).slice(1, -1);
export function ghiSo(ledgerPath, f, skillText = readFileSync(SKILL, 'utf8')) {
  mkdirSync(path.dirname(ledgerPath), { recursive: true });
  const slugDir = path.dirname(ledgerPath);
  const slug = path.basename(slugDir);
  const cwd = path.dirname(path.dirname(slugDir));
  const cmd = recipeOf(skillText)
    .split('<slug>').join(slug).split('<type>').join(f.type).split('<stage>').join(f.stage)
    .split('<ISO>').join(f.at).split('<1 câu>').join(jsonStr(f.decision))
    .split('<vì sao, 1 câu>').join(jsonStr(f.why ?? ''))
    .split('<sai thì tốn gì, 1 câu>').join(jsonStr(f.cost_if_wrong ?? ''));
  const r = spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error('lenh ghi so loi: ' + r.stderr);
  const lines = readFileSync(ledgerPath, 'utf8').trim().split('\n');
  return JSON.parse(lines[lines.length - 1]);
}
```

- [ ] **Step 2: Viết test đỏ `tests/scripts/msbv-so.test.mjs`**

```js
// msbv-so.test.mjs — hồ sơ mot-so-ba-ve, làn sổ + văn bản (AC-1, AC-7). Tên ca = tên AC.
import { mkdtempSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, SKILL, recipeOf, ghiSo } from './msbv-fixture.mjs';
let pass = 0, fail = 0;
const ok = n => { pass++; console.log(`PASS: ${n} `); };
const bad = (n, m) => { fail++; console.log(`FAIL: ${n} — ${m}`); };
const ca = (n, f) => { try { f(); ok(n); } catch (e) { bad(n, e.message); } };
const die = m => { throw new Error(m); };
const skill = readFileSync(SKILL, 'utf8');

ca('MS-AC1-recipe', () => {
  const L = path.join(mkdtempSync(path.join(tmpdir(), 'msbv-so-')), '_acceptance', 'x', 'decisions.jsonl');
  const a = ghiSo(L, { type: 'approach', stage: 'S3', at: '2026-09-29T00:00:00Z', decision: "chọn A 100% $HOME `x`", why: 'vì B', cost_if_wrong: 'tốn C' });
  const b = ghiSo(L, { type: 'fix', stage: 'S3', at: '2026-09-29T00:00:01Z', decision: 'D', why: 'E', cost_if_wrong: 'F' });
  if (!/^d-\d{8}T\d{6}Z-1$/.test(a.id)) die('id dong 1 sai khuon: ' + a.id);
  if (!/^d-\d{8}T\d{6}Z-2$/.test(b.id)) die('id dong 2 sai khuon: ' + b.id);
  for (const [o, d] of [[a, "chọn A 100% $HOME `x`"], [b, 'D']]) {
    if (o.decision !== d) die('decision ghi sai: ' + o.decision);
    if (!o.why || !o.cost_if_wrong) die('thieu why/cost_if_wrong');
    if ('impact' in o) die('dong moi van co khoa impact');
  }
  // CHIỀU ĐỎ: bản sao SKILL bỏ ô cost_if_wrong khỏi recipe → phải bắt được.
  const mut = skill.replace(',"cost_if_wrong":"<sai thì tốn gì, 1 câu>"', '');
  if (mut === skill) die('kim dot bien cost_if_wrong khong khop trong SKILL');
  const L2 = path.join(mkdtempSync(path.join(tmpdir(), 'msbv-so-')), '_acceptance', 'x', 'decisions.jsonl');
  const c = ghiSo(L2, { type: 'fix', stage: 'S3', at: '2026-09-29T00:00:00Z', decision: 'D', why: 'E', cost_if_wrong: 'F' }, mut);
  if ('cost_if_wrong' in c) die('dot bien khong co tac dung');
  console.log('    · chieu do: recipe thieu cost_if_wrong → dong khong co cost_if_wrong (bat duoc)');
});

ca('MS-AC1-lib-im', () => {
  const require = createRequire(import.meta.url);
  const WR = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));
  const cu = [
    '{"id":"d-1","type":"descope","stage":"S1","at":"2026-09-01T00:00:00Z","decision":"bo X","impact":"y"}',
    '{"id":"d-2","type":"seal","gate":1,"at":"2026-09-01T00:30:00Z"}',
    '{"id":"d-3","type":"veto","stage":"gate2","at":"2026-09-02T00:00:00Z","decision":"ly do","decided_by":"A","decided_at":"2026-09-02T00:00:00Z"}',
  ];
  const moi = [cu[0], '{"id":"d-9","type":"approach","stage":"S1","at":"2026-09-01T00:10:00Z","decision":"q","why":"w","cost_if_wrong":"c"}', cu[1], cu[2],
    '{"id":"d-10","type":"approach","stage":"S3","at":"2026-09-01T01:00:00Z","decision":"q2","why":"w2","source":"superpowers","source_ref":"ws#Ruling:abcd1234"}'];
  const A = cu.join('\n') + '\n', B = moi.join('\n') + '\n';
  const kq = t => JSON.stringify({ nghi: WR.hoSoNghi({ ledgerText: t }), thucTe: WR.thucTe(t), khep: WR.hoSoDaKhep({ status: 'signed-off', ledgerText: t }) });
  if (kq(A) !== kq(B)) die(`bo doc lib doi ket qua khi so co dong ba ve:\n A=${kq(A)}\n B=${kq(B)}`);
});

ca('MS-AC7-van-ban', () => {
  const sec = skill.slice(skill.indexOf('## Sổ quyết định'), skill.indexOf('**Rule đáng-log'));
  for (const k of ['decision', 'why', 'cost_if_wrong']) if (!sec.includes(`\`${k}\``) && !sec.includes(`"${k}"`)) die('muc So quyet dinh thieu khoa ' + k);
  if (!/impact[^\n]*đường đọc-cũ/.test(sec)) die('muc So quyet dinh khong noi impact la duong doc-cu');
  const r = recipeOf(skill);
  if (!r.includes('"why"') || !r.includes('"cost_if_wrong"')) die('recipe thieu why/cost_if_wrong');
  if (r.includes('"impact"')) die('recipe con o impact');
  const s3 = skill.slice(skill.indexOf('## S3 — EXECUTE'), skill.indexOf('## S4 — VERIFY'));
  if (s3.split('cau-noi-ruling.mjs').length !== 2) die('S3 phai neu cau-noi-ruling.mjs dung mot lan');
  const card = readFileSync(path.join(ROOT, 'commands', 'acceptance-card.md'), 'utf8');
  if (!card.includes('chỉ phát khoá cho dòng thiếu `why`')) die('acceptance-card.md thieu cau DEC-PLAIN ve dong thieu why');
  // CHIỀU ĐỎ: bản sao SKILL gỡ câu S3 → ca phải đỏ đúng thông điệp.
  const mut = skill.replace(/[^\n]*cau-noi-ruling\.mjs[^\n]*\n/, '\n');
  const s3m = mut.slice(mut.indexOf('## S3 — EXECUTE'), mut.indexOf('## S4 — VERIFY'));
  if (s3m.includes('cau-noi-ruling.mjs')) die('dot bien go cau S3 khong co tac dung');
  console.log('    · chieu do: go cau S3 → «S3 khong neu duong tay» (bat duoc)');
});

console.log(`Results: ${pass} passed, ${fail} failed (msbv-so)`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 3: Chạy — phải ĐỎ**

Run: `node tests/scripts/msbv-so.test.mjs`
Expected: `FAIL: MS-AC1-recipe — …` (recipe chưa có `"why"`), `FAIL: MS-AC7-van-ban — …`; `MS-AC1-lib-im` có thể xanh ngay (chiều im — đúng kỳ vọng).

- [ ] **Step 4: Sửa SKILL feature-loop**

(a) Trong câu schema của mục «Sổ quyết định» thay `"decision":"1 câu","impact":"tiết kiệm gì · rủi ro gì"}` bằng:
```
"decision":"1 câu — quyết gì, viết cho người ký","why":"1 câu — vì sao, được trỏ tệp và mã eval","cost_if_wrong":"1 câu — sai thì tốn gì, viết cho người ký"}` (ADR 0021 «ba vế một câu»; `impact` là đường đọc-cũ cho dòng ghi trước 2.19 — bộ đọc vẫn đọc nó, dòng mới không ghi nó)
```
(b) Dòng giữa khối `DEC-ID-RECIPE` thành:
```
"type":"<type>","stage":"<stage>","at":"<ISO>","decision":"<1 câu>","why":"<vì sao, 1 câu>","cost_if_wrong":"<sai thì tốn gì, 1 câu>"
```
(c) Câu dẫn khối `DEC-TARGET-SLOT`: `NGAY SAU "impact":"<đổi lại gì>"` → `NGAY SAU "cost_if_wrong":"<sai thì tốn gì, 1 câu>"`.
(d) S3 bước 1, cuối câu «…card Gate 2 sẽ trình để phê.» thêm:
```
Ruling mà superpowers ghi vào `.superpowers/sdd/<plan>/progress.md` được gặt vào sổ tự động bởi hook `ruling-truoc-khi-xoa` trước khi thư mục đó bị xoá; harness không chạy hook thì chạy tay `node <acceptance-gate>/scripts/cau-noi-ruling.mjs --root . --workspace .superpowers/sdd/<plan> --write` trước khi xoá.
```

- [ ] **Step 5: Sửa `commands/acceptance-card.md`** — ngay dưới dòng «rationale, KHÔNG phải scope-truth — không dịch thành cam kết mới.» thêm:
```
     Dòng sổ đã có `why` (ADR 0021, ba vế) thẻ in thẳng ba vế: `--extract` chỉ phát khoá cho dòng thiếu `why`, và câu dịch cho dòng đã có `why` bị bỏ qua.
```

- [ ] **Step 6: Dời lỗ trong `tests/scripts/gate-card-dec-key.test.mjs`**

Dòng 287: `const IMPACT_HOLE = '"impact":"<đổi lại gì>"';` → `const IMPACT_HOLE = '"cost_if_wrong":"<sai thì tốn gì, 1 câu>"';` (giữ tên biến để diff nhỏ; sửa thông điệp dòng 289 thành `khoi DEC-ID-RECIPE khong con dung mot o cost_if_wrong de chen target sau no`). Dòng 297: `.split('<đổi lại gì>').join('doi lai y')` → `.split('<vì sao, 1 câu>').join('vi y').split('<sai thì tốn gì, 1 câu>').join('ton z')`.

- [ ] **Step 7: Chạy — phải XANH, và không vỡ test cũ**

Run: `node tests/scripts/msbv-so.test.mjs && node tests/scripts/gate-card-dec-key.test.mjs && bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:"`
Expected: `Results: 3 passed, 0 failed (msbv-so)`; `gate-card-dec-key` 0 failed; plugins vùng 1 0 failed (lưới GATE-INVITE-SITES, P85 không đụng).

- [ ] **Step 8: Commit**

```bash
git add feature-loop/skills/feature-loop/SKILL.md commands/acceptance-card.md tests/scripts/msbv-fixture.mjs tests/scripts/msbv-so.test.mjs tests/scripts/gate-card-dec-key.test.mjs
git commit -m "feat(mot-so-ba-ve): khuôn ghi sổ ba vế decision · why · cost_if_wrong (AC-1, AC-7)"
```

---

### Task 2: Thẻ in ba vế ở cả ba khối + trích dịch chỉ dòng cũ

`independent: true` · phục vụ **E2** (AC-2), **E3** (AC-3), **E4** (AC-4), **E8** đầu vào, **E9** (AC-9)

**Files:**
- Modify: `scripts/gate-card.js:411` (`decLine`), sau dòng 497 (thêm `coBaVe`, `decBaVe`), `:785` (extract Cổng 1), `:810` (khối Cổng 1), `:1123` (extract Cổng 2), `:1257` (Treo), `:1259` (Đã duyệt)
- Create: `tests/scripts/msbv-the.test.mjs`
- Create (do test sinh): `_acceptance/mot-so-ba-ve/evidence/the-cong-2-ba-ve.txt`

**Interfaces:**
- Consumes: `mkWs`, `extract`, `G1`, `G2`, `REVIEW2`, `PROBE`, `ROOT`, `GC`, `SRC` của `tests/scripts/gate-fixture.mjs` (đã có). Dòng sổ ba vế trong Task 2 dựng bằng `JSON.stringify` theo khuôn hợp đồng; ca round-trip recipe → thẻ (`MS-AC2-recipe`) thêm ở Task 4 Step 7, sau khi Task 1 gộp.
- Produces: `coBaVe(e) → boolean` (`typeof e.why === 'string' && e.why.trim() !== ''`), `decBaVe(e) → string (HTML đã escape)`.

- [ ] **Step 1: Viết test đỏ `tests/scripts/msbv-the.test.mjs`**

```js
// msbv-the.test.mjs — hồ sơ mot-so-ba-ve, làn thẻ (AC-2, AC-3, AC-4, AC-9 + tệp đầu vào AC-8). Tên ca = tên AC.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { mkWs, card, extract, G1, G2, REVIEW2, PROBE, ROOT, GC, SRC } from './gate-fixture.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHA_NEN = '705077e53764e482593fb47c68a5f9e9034091f3'; // git rev-parse origin/main 29/09, trước vòng mot-so-ba-ve
let pass = 0, fail = 0;
const ca = (n, f) => { try { f(); pass++; console.log(`PASS: ${n} `); } catch (e) { fail++; console.log(`FAIL: ${n} — ${e.message}`); } };
const die = m => { throw new Error(m); };
const J = o => JSON.stringify(o);
const BA = (id, d, w, c) => J({ id, type: 'approach', stage: 'S1', at: '2026-09-29T00:00:00Z', decision: d, why: w, ...(c ? { cost_if_wrong: c } : {}) });
const CU = (id, d, i) => J({ id, type: 'fix', stage: 'S1', at: '2026-09-29T00:00:00Z', decision: d, impact: i });
const SEAL = J({ id: 'd-seal', type: 'seal', gate: 1, at: '2026-09-29T00:30:00Z' });
const text = html => html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean).join('\n');
const khoi = (html, nhan) => { const i = html.indexOf(`<div class="lab">${nhan}`); if (i < 0) return null; const j = html.indexOf('<div class="lab">', i + 10); return html.slice(i, j < 0 ? undefined : j); };
const g2 = (ledger, plain) => { const f = G2(REVIEW2); f['decisions.jsonl'] = ledger; f['gap-probe.md'] = PROBE('clean'); if (plain) f['card-plain.json'] = J(plain); return f; };
const render = (root, slug, gc = GC, plain = true) => spawnSync('node', [gc, '--root', root, '--slug', slug, ...(plain && existsSync(path.join(root, '_acceptance', slug, 'card-plain.json')) ? ['--plain', path.join(root, '_acceptance', slug, 'card-plain.json')] : [])], { encoding: 'utf8' });
const banSao = mutate => { const d = mkdtempSync(path.join(tmpdir(), 'msbv-gc-')); cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true }); cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true }); const p = path.join(d, 'scripts', 'gate-card.js'); const s = readFileSync(p, 'utf8'); const m = mutate(s); if (m === s) die('kim dot bien khong khop'); writeFileSync(p, m); return p; };
const BA_VE = s => `D${s} — W${s} — sai thì tốn: C${s}`;

ca('MS-AC2-ba-khoi', () => {
  const plain = { decisions_plain: [{ id: 'd-a', p: 'CAU OVERLAY A' }, { id: 'd-b', p: 'CAU OVERLAY B' }] };
  // Cổng 2: d-a trước seal (Đã duyệt), d-b sau seal (Treo)
  const r2 = mkWs('g', g2([BA('d-a', 'Da', 'Wa', 'Ca'), SEAL, BA('d-b', 'Db', 'Wb', 'Cb')].join('\n') + '\n', plain));
  const h2 = render(r2, 'g').stdout;
  const treo = khoi(h2, 'Quyết định CHƯA duyệt'), duyet = khoi(h2, 'Đã duyệt từ Gate 1');
  if (!treo || !duyet) die('thieu khoi Treo hoac Da duyet');
  if (!duyet.includes('Da — Wa — sai thì tốn: Ca')) die('khoi Da duyet khong in ba ve');
  if (!treo.includes('Db — Wb — sai thì tốn: Cb')) die('khoi Treo khong in ba ve');
  if (h2.includes('CAU OVERLAY')) die('overlay hien cho dong ba ve');
  // Cổng 1: hồ sơ chưa seal
  const f1 = G1(PROBE('clean')); f1['decisions.jsonl'] = BA('d-a', 'Da', 'Wa', 'Ca') + '\n'; f1['card-plain.json'] = J(plain);
  const r1 = mkWs('g', f1); const h1 = render(r1, 'g').stdout;
  if (!h1.includes('Da — Wa — sai thì tốn: Ca')) die('khoi Cong 1 khong in ba ve');
  if (h1.includes('CAU OVERLAY')) die('overlay hien o Cong 1 cho dong ba ve');
});

ca('MS-AC2-dot-bien', () => { // CHIỀU ĐỎ trên CÙNG fixture của MS-AC2-ba-khoi
  const r2 = mkWs('g', g2([BA('d-a', 'Da', 'Wa', 'Ca'), SEAL, BA('d-b', 'Db', 'Wb', 'Cb')].join('\n') + '\n'));
  if (!(khoi(render(r2, 'g').stdout, 'Quyết định CHƯA duyệt') || '').includes('Db — Wb — sai thì tốn: Cb')) die('doi chung duong: ban lanh khong xanh');
  const gc = banSao(s => s.replace("if (coBaVe(e)) {", "if (false) {"));
  if ((khoi(render(r2, 'g', gc).stdout, 'Quyết định CHƯA duyệt') || '').includes('sai thì tốn: Cb')) die('dot bien go nhanh ba ve khong co tac dung');
  console.log('    · chieu do: go nhanh ba ve → «khối Quyết định CHƯA duyệt không in ba vế» (bat duoc)');
});

ca('MS-AC3-doc-cu', () => {
  const plain = { decisions_plain: [{ id: 'd-1', p: 'DICH MOT' }, { id: 'd-3', p: 'DICH BA' }] };
  const L = [CU('d-1', 'cu mot', 'i1'), CU('d-2', 'cu hai', 'i2'), SEAL, CU('d-3', 'cu ba', 'i3'), CU('d-4', 'cu bon', 'i4')].join('\n') + '\n';
  const h = render(mkWs('g', g2(L, plain)), 'g').stdout;
  const duyet = khoi(h, 'Đã duyệt từ Gate 1'), treo = khoi(h, 'Quyết định CHƯA duyệt');
  if (!duyet.includes('DICH MOT')) die('khoi da duyet khong tra decisions_plain');
  if (!duyet.includes('cu hai — i2')) die('khoi da duyet mat chu goc dong khong dich');
  if (!treo.includes('DICH BA') || !treo.includes('cu bon — i4')) die('khoi Treo sai duong doc-cu');
});

ca('MS-AC3-dot-bien', () => { // CHIỀU ĐỎ trên CÙNG fixture của MS-AC3-doc-cu
  const plain = { decisions_plain: [{ id: 'd-1', p: 'DICH MOT' }, { id: 'd-3', p: 'DICH BA' }] };
  const L = [CU('d-1', 'cu mot', 'i1'), CU('d-2', 'cu hai', 'i2'), SEAL, CU('d-3', 'cu ba', 'i3'), CU('d-4', 'cu bon', 'i4')].join('\n') + '\n';
  if (!(khoi(render(mkWs('g', g2(L, plain)), 'g').stdout, 'Đã duyệt từ Gate 1') || '').includes('DICH MOT')) die('doi chung duong: ban lanh khong xanh');
  const gc = banSao(s => s.replace('${decSort(decsApproved).map(e => `<p class="li">${decBaVe(e)}</p>`)', '${decSort(decsApproved).map(e => `<p class="li">${decLine(e)}</p>`)'));
  if ((khoi(render(mkWs('g', g2(L, plain)), 'g', gc).stdout, 'Đã duyệt từ Gate 1') || '').includes('DICH MOT')) die('dot bien khong co tac dung');
  console.log('    · chieu do: go tra overlay o khoi da duyet → «khối đã duyệt không tra decisions_plain» (bat duoc)');
});

ca('MS-AC3-nen', () => {
  const head = spawnSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  if (head === SHA_NEN) die('nền trùng HEAD — đối chứng rỗng');
  const d = mkdtempSync(path.join(tmpdir(), 'msbv-nen-'));
  const a = spawnSync('bash', ['-c', `git -C "${ROOT}" archive ${SHA_NEN} scripts lib | tar -x -C "${d}"`], { encoding: 'utf8' });
  if (a.status !== 0) die(`nền dựng lỗi: ${a.status} ${a.stderr.split('\n')[0]}`);
  const plain = { decisions_plain: [{ id: 'd-3', p: 'DICH BA' }] };
  const L = [CU('d-1', 'cu mot', 'i1'), SEAL, CU('d-3', 'cu ba', 'i3'), CU('d-4', 'cu bon', 'i4')].join('\n') + '\n';
  const r = mkWs('g', g2(L, plain));
  const nen = render(r, 'g', path.join(d, 'scripts', 'gate-card.js'));
  if (nen.status !== 0) die(`nền dựng lỗi: ${nen.status}`);
  const tNen = khoi(nen.stdout, 'Quyết định CHƯA duyệt'), tNay = khoi(render(r, 'g').stdout, 'Quyết định CHƯA duyệt');
  if (!tNen) die('nền dựng lỗi: khối Treo rỗng');
  if (tNen !== tNay) die(`khoi Treo lech ban nen:\n nen=${tNen}\n nay=${tNay}`);
});

ca('MS-AC4-thieu-gia', () => {
  const L = [SEAL, BA('d-a', 'Da', 'Wa', 'Ca'), BA('d-b', 'Db', 'Wb', null)].join('\n') + '\n';
  const h = render(mkWs('g', g2(L)), 'g').stdout;
  const n = h.split('chưa khai giá nếu sai').length - 1;
  if (n !== 1) die(`nhan thieu gia xuat hien ${n} lan`);
  const dong = h.split('<div class="item">').find(x => x.includes('Db — Wb'));
  if (!dong || !dong.includes('chưa khai giá nếu sai')) die('dòng thiếu giá không mang nhãn');
  const dongDu = h.split('<div class="item">').find(x => x.includes('Da — Wa'));
  if (dongDu.includes('chưa khai giá nếu sai')) die('dong du ba ve mang nhan');
  const gc = banSao(s => s.replace(" <b>⚠ chưa khai giá nếu sai</b>", ''));
  if (render(mkWs('g', g2(L)), 'g', gc).stdout.includes('chưa khai giá nếu sai')) die('dot bien khong co tac dung');
  console.log('    · chieu do: go nhan → «dòng thiếu giá không mang nhãn» (bat duoc)');
});

ca('MS-AC4-chi-gia', () => { // Review Focus 3: dòng có giá mà không có vì-sao vẫn in giá
  const L = [SEAL, J({ id: 'd-c', type: 'approach', stage: 'S3', at: '2026-09-29T00:00:00Z', decision: 'Dc', cost_if_wrong: 'Cc' })].join('\n') + '\n';
  const h = render(mkWs('g', g2(L)), 'g').stdout;
  if (!h.includes('Dc — sai thì tốn: Cc')) die('dong chi co gia mat gia tren the');
});

ca('MS-AC8-xuat', () => {
  const L = [CU('d-1', 'Bỏ bước tự dịch cho dòng cũ', 'đổi lại người đọc chữ gốc'), SEAL,
    BA('d-2', 'Chặn lệnh xoá thư mục tạm cho tới khi đã gặt quyết định', 'thư mục bị xoá trước bước cuối thi công', 'một hook chạy trên mọi lệnh shell'),
    BA('d-3', 'In quyết định thành một dòng ba vế', 'người ký cần biết giá để quyết có lật không', 'một câu dài hơn trên thẻ'),
    BA('d-4', 'Giữ quyết định chưa khai giá và gắn nhãn', 'giới hạn là nhãn trạng thái, không phải việc', null)].join('\n') + '\n';
  const plain = { decisions_plain: [{ id: 'd-1', p: 'KHÔNG tự dịch dòng cũ — người đọc chữ gốc của sổ.' }] };
  const h = render(mkWs('g', g2(L, plain)), 'g').stdout;
  const bam = createHash('sha256').update(L).digest('hex');
  const noiDung = `# fixture sha256 ${bam} · at 2026-09-29T00:00:00Z\n` + text((khoi(h, 'Quyết định CHƯA duyệt') || '') + (khoi(h, 'Đã duyệt từ Gate 1') || '')) + '\n';
  const out = path.join(HERE, '..', '..', '_acceptance', 'mot-so-ba-ve', 'evidence', 'the-cong-2-ba-ve.txt');
  mkdirSync(path.dirname(out), { recursive: true });
  if (!existsSync(out) || readFileSync(out, 'utf8') !== noiDung) writeFileSync(out, noiDung);  // ghi chỉ khi khác: không chạm mtime hồ sơ khi vật không đổi
  if (readFileSync(out, 'utf8') !== noiDung) die('tep dau vao AC-8 khong bang ban dung tu code hien tai');
  if (!/^# fixture sha256 [0-9a-f]{64} · at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z\n/.test(noiDung)) die('dong dau sai khuon');
});

ca('MS-AC9-extract', () => {
  const f1 = G1(PROBE('clean'));
  f1['decisions.jsonl'] = [BA('d-a', 'Da', 'Wa', 'Ca'), CU('d-b', 'cu', 'i'), BA('d-c', 'Dc', 'Wc', null), CU('d-d', 'cu2', 'i2')].join('\n') + '\n';
  const x = extract(mkWs('g', f1), 'g');
  const ids = x.decisions.map(e => e.key).sort();
  if (J(ids) !== J(['d-b', 'd-d'])) die('extract xin dich dong da ba ve: ' + J(ids));
  if (SRC.split('const decKey = e =>').length !== 2) die('DEC-PLAIN-KEY khong con mot ham');
});

ca('MS-AC9-dot-bien', () => { // CHIỀU ĐỎ trên CÙNG fixture của MS-AC9-extract
  const f1 = G1(PROBE('clean'));
  f1['decisions.jsonl'] = [BA('d-a', 'Da', 'Wa', 'Ca'), CU('d-b', 'cu', 'i'), BA('d-c', 'Dc', 'Wc', null), CU('d-d', 'cu2', 'i2')].join('\n') + '\n';
  if (extract(mkWs('g', f1), 'g').decisions.length !== 2) die('doi chung duong: ban lanh khong xanh');
  const gc = banSao(s => s.replace('decisions: decsAll.filter(e => !coBaVe(e)).map(', 'decisions: decsAll.map('));
  const xm = JSON.parse(spawnSync('node', [gc, '--root', mkWs('g', f1), '--slug', 'g', '--extract'], { encoding: 'utf8' }).stdout);
  if (xm.decisions.length !== 4) die('dot bien khong co tac dung');
  console.log('    · chieu do: bo loc → «extract xin dịch dòng đã ba vế» (bat duoc)');
});

console.log(`Results: ${pass} passed, ${fail} failed (msbv-the)`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Chạy — phải ĐỎ**

Run: `node tests/scripts/msbv-the.test.mjs`
Expected: FAIL ở `MS-AC2-ba-khoi` («khoi Da duyet khong in ba ve»), `MS-AC4-*`, `MS-AC9-extract`; `MS-AC3-nen` xanh (chưa đổi gì là đúng bằng nền).

- [ ] **Step 3: Sửa `scripts/gate-card.js`**

(a) Dòng 411 — `decLine` in giá khi dòng chỉ có giá (đường đọc-cũ không đổi vì dòng cũ không có `cost_if_wrong`):
```js
const decLine = e => esc(stripMd(e.decision || '')) + (e.impact ? ' — ' + esc(stripMd(e.impact)) : (e.cost_if_wrong ? ' — sai thì tốn: ' + esc(stripMd(e.cost_if_wrong)) : ''));
```
(b) Ngay sau dòng `const plDec = e => …` (khoảng 497):
```js
// <<<DEC-BA-VE — một dòng sổ ra một dòng thẻ, dùng cho CẢ BA khối (ADR 0021, hồ sơ mot-so-ba-ve).
// Dòng có `why` → «decision — why — sai thì tốn: cost_if_wrong», không tra decisions_plain; thiếu giá →
// nhãn ngay dòng đó, không chặn thẻ. Dòng không có `why` → câu dịch nếu có, không thì chữ gốc (đọc-cũ).
const coBaVe = e => !!e && typeof e.why === 'string' && e.why.trim() !== '';
const decBaVe = e => {
  if (coBaVe(e)) {
    const d = esc(stripMd(e.decision || '')) + ' — ' + esc(stripMd(e.why));
    const c = typeof e.cost_if_wrong === 'string' && e.cost_if_wrong.trim();
    return c ? d + ' — sai thì tốn: ' + esc(stripMd(e.cost_if_wrong)) : d + ' <b>⚠ chưa khai giá nếu sai</b>';
  }
  return esc(plDec(e)) || decLine(e);
};
// DEC-BA-VE>>>
```
(c) Dòng 810: `${esc(plDec(e)) || decLine(e)}` → `${decBaVe(e)}`.
(d) Dòng 1257: `${esc(plDec(e)) || decLine(e)}` → `${decBaVe(e)}`.
(e) Dòng 1259: `` `<p class="li">${decLine(e)}</p>` `` → `` `<p class="li">${decBaVe(e)}</p>` ``.
(f) Dòng 785 (extract Cổng 1): `decisions: decsAll.map(` → `decisions: decsAll.filter(e => !coBaVe(e)).map(`.
(g) Dòng 1123 (extract Cổng 2): `decisions_approved: decsApproved.map(` → `decisions_approved: decsApproved.filter(e => !coBaVe(e)).map(` và `decisions_provisional: decsProvisional.map(` → `decisions_provisional: decsProvisional.filter(e => !coBaVe(e)).map(`.

- [ ] **Step 4: Chạy — phải XANH, không vỡ lưới thẻ cũ**

Run: `node tests/scripts/msbv-the.test.mjs && for f in tests/scripts/gate-card-*.test.mjs; do node "$f" >/dev/null || echo "DO: $f"; done`
Expected: `Results: 10 passed, 0 failed (msbv-the)` (mười ca: MS-AC2-ba-khoi, MS-AC2-dot-bien, MS-AC3-doc-cu, MS-AC3-dot-bien, MS-AC3-nen, MS-AC4-thieu-gia, MS-AC4-chi-gia, MS-AC8-xuat, MS-AC9-extract, MS-AC9-dot-bien); không dòng `DO:`.

- [ ] **Step 5: Sửa chữ E4 và E8 trong `_acceptance/mot-so-ba-ve/evals.yaml` cho khớp tệp tất định**

E4 `expected`: thay `«# fixture sha256 <băm sổ fixture> · at <ISO lúc chạy>»` bằng `«# fixture sha256 <băm sổ fixture> · at <ISO trường at của fixture>»`, và thay `đối chứng: xoá tệp trước khi chạy.` bằng `ghi chỉ khi nội dung khác; khẳng định tệp trên đĩa BẰNG từng byte bản dựng từ code hiện tại (nên tệp cũ hay viết tay đều đỏ).`
E8 `question`: thay câu `<ISO> không sớm hơn invokedAt của lượt chấm này quá 24 giờ; thiếu hoặc quá cũ → FAIL «đầu vào không phải vật của lượt»` bằng `thiếu dòng ấy → FAIL «đầu vào không phải vật của lượt» (ca E4 MS-AC8-xuat đã khẳng định tệp bằng bản dựng từ code hiện tại)`.
Rồi `node scripts/eval-coverage-lint.js . 2>&1 | grep mot-so-ba-ve || echo "lint: 0"` → `lint: 0`.

- [ ] **Step 6: Commit** (kèm tệp đầu vào AC-8 do test sinh)

```bash
git add scripts/gate-card.js tests/scripts/msbv-the.test.mjs _acceptance/mot-so-ba-ve/evidence/the-cong-2-ba-ve.txt _acceptance/mot-so-ba-ve/evals.yaml
git commit -m "feat(mot-so-ba-ve): thẻ in dòng sổ ba vế ở cả ba khối, trích dịch chỉ dòng cũ (AC-2, AC-3, AC-4, AC-9)"
```

---

### Task 3: Cầu nối gặt ruling superpowers vào sổ

`independent: true` · phục vụ **E5** (AC-5)

**Files:**
- Create: `scripts/cau-noi-ruling.mjs`
- Create: `tests/scripts/fixtures/msbv-progress-superpowers.md`
- Create: `tests/scripts/msbv-cau-noi.test.mjs`

**Interfaces:**
- Produces (CLI): `node scripts/cau-noi-ruling.mjs --root <repo> --workspace <path tới .superpowers/sdd/<ws>> [--slug <slug>] [--write]` — exit 0 (gặt xong hoặc không có gì; stdout `cau-noi-ruling: đã gặt <N> ruling vào sổ <slug> (<M> đã có)`), exit 2 (`cau-noi-ruling: không suy được hồ sơ — …` trên stderr), exit 5 (sai cú pháp). Không có ruling → exit 0 + stderr `cau-noi-ruling: không có ruling để gặt — <lý do>`.
- Produces (module, cho test): `export function tachRuling(text) → string[]`, `export function catBaVe(entry) → { decision, why?, cost_if_wrong?, type, prefix }`.

- [ ] **Step 1: Dựng fixture `tests/scripts/fixtures/msbv-progress-superpowers.md`**

Dòng đầu:
```
<!-- Hình dạng rút từ MỘT ledger superpowers 6.4.1 thật (một kho tiêu thụ riêng tư); nội dung thay bằng câu trung tính trước khi đẩy (owner quyết 29/09, Ngoài-3). -->
# SDD ledger — plan: docs/superpowers/plans/2026-09-19-ho-so-mau.md

Hợp đồng ràng buộc: _acceptance/ho-so-mau/contract.md
```
Rồi chép bằng lệnh (không gõ tay) mọi đoạn chứa `Ruling` của ledger crm, giữ dòng trống giữa các đoạn và một dòng `minor (deferred)` thật:
```bash
S=/Users/manh-macmini/dev/crm/.superpowers/sdd/2026-09-19-vao-bang-email-va-mat-khau/progress.md
F=tests/scripts/fixtures/msbv-progress-superpowers.md
awk 'BEGIN{p=0} /Ruling/{p=1} /^$/{if(p){print ""};p=0} p{print}' "$S" >> "$F"
grep -m1 'minor (deferred)' "$S" >> "$F"; echo >> "$F"
cat >> "$F" <<'EOF'
Ruling: dùng khoá cũ — khớp nếp kho — một lần đổi tên

Final: Ruling: giữ hành vi X mà người soát gạt ra — hợp đồng không nói — một vòng sửa nếu sai

Task 3: parked — tên biến viết tắt khó đọc — Ruling: giữ nguyên vì cùng nếp tệp bên cạnh
EOF
```
(Test KHÔNG đọc kho nguồn — chỉ đọc bản chép. Sau Cổng Bằng chứng 29/09, bản chép được thay nội dung bằng câu trung tính, giữ nguyên khung từng đoạn, để kho kit công khai không mang nội dung của kho tiêu thụ.)

- [ ] **Step 2: Viết test đỏ `tests/scripts/msbv-cau-noi.test.mjs`**

Ma trận viết TRƯỚC: mảng `KY_VONG`, một phần tử cho MỖI ruling của fixture theo thứ tự xuất hiện, dạng `{ dau: '<20 ký tự đầu của đoạn>', decision: '…', why: '…' | null, cost_if_wrong: '…' | null, type: 'approach'|'revisit' }`, chữ lấy nguyên văn theo quy tắc cắt ở Task 3 Step 4. Người thi công điền từng phần tử bằng tay SAU khi đọc fixture và TRƯỚC khi viết `cau-noi-ruling.mjs` (đó là «viết trước»). Ba phần tử đầu và ba phần tử khuôn phải đúng như sau:
```js
const KY_VONG = [
    {"dau": "Ruling 1: nội dung t", "decision": "nội dung trung tính 1.", "why": "nội dung trung tính 2.", "cost_if_wrong": "nội dung trung tính 3.", "type": "approach"},
  // … một phần tử cho mỗi đoạn Ruling còn lại của bản chép crm, đúng thứ tự …
  { dau: 'Ruling: dùng khoá cũ', decision: 'dùng khoá cũ', why: 'khớp nếp kho', cost_if_wrong: 'một lần đổi tên', type: 'approach' },
  { dau: 'Final: Ruling: giữ hà', decision: 'giữ hành vi X mà người soát gạt ra', why: 'hợp đồng không nói', cost_if_wrong: 'một vòng sửa nếu sai', type: 'approach' },
  { dau: 'Task 3: parked — tên', decision: 'KHÔNG sửa: tên biến viết tắt khó đọc', why: 'giữ nguyên vì cùng nếp tệp bên cạnh', cost_if_wrong: null, type: 'revisit' },
];
```
Thân test:
```js
// msbv-cau-noi.test.mjs — hồ sơ mot-so-ba-ve, làn cầu nối (AC-5). Tên ca = tên AC.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const CN = path.join(ROOT, 'scripts', 'cau-noi-ruling.mjs');
const FIX = readFileSync(path.join(HERE, 'fixtures', 'msbv-progress-superpowers.md'), 'utf8');
// KY_VONG như Step 2 ở trên
let pass = 0, fail = 0;
const ca = (n, f) => { try { f(); pass++; console.log(`PASS: ${n} `); } catch (e) { fail++; console.log(`FAIL: ${n} — ${e.message}`); } };
const die = m => { throw new Error(m); };
const kho = (slug = 'vao-bang-email-va-mat-khau', ws = '2026-09-19-vao-bang-email-va-mat-khau', progress = FIX) => {
  const r = mkdtempSync(path.join(tmpdir(), 'msbv-cn-'));
  mkdirSync(path.join(r, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', slug, 'decisions.jsonl'), '');
  const w = path.join(r, '.superpowers', 'sdd', ws); mkdirSync(w, { recursive: true });
  if (progress !== null) writeFileSync(path.join(w, 'progress.md'), progress);
  return { r, w, L: path.join(r, '_acceptance', slug, 'decisions.jsonl') };
};
const chay = (r, w, extra = [], cn = CN) => spawnSync('node', [cn, '--root', r, '--workspace', w, '--write', ...extra], { encoding: 'utf8' });
const so = L => readFileSync(L, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const soRuling = () => FIX.split('\n').filter(l => /\bRuling\b[^:\n]*:/.test(l) && !/minor \(deferred\)/.test(l)).length;

ca('MS-AC5-ma-tran', () => {
  if (KY_VONG.length !== soRuling()) die(`ma tran co ${KY_VONG.length} hang, fixture co ${soRuling()} doan Ruling`);
  const { r, w, L } = kho(); const x = chay(r, w);
  if (x.status !== 0) die('exit ' + x.status + ' ' + x.stderr);
  const d = so(L);
  if (d.length !== KY_VONG.length) die(`so co ${d.length} dong, ky vong ${KY_VONG.length}`);
  KY_VONG.forEach((k, i) => {
    const o = d[i];
    for (const f of ['decision', 'why', 'cost_if_wrong']) if ((o[f] ?? null) !== k[f]) die(`hang «${k.dau}» ${f}:\n  got : ${o[f]}\n  want: ${k[f]}`);
    if (o.type !== k.type || o.stage !== 'S3' || o.source !== 'superpowers') die(`hang «${k.dau}» type/stage/source sai`);
    if (!/^d-\d{8}T\d{6}Z-\d+$/.test(o.id)) die('id sai khuon: ' + o.id);
  });
  if (new Set(d.map(o => o.source_ref)).size !== d.length) die('source_ref trung');
  if (d.some(o => /minor \(deferred\)/.test(o.decision))) die('dong minor vao so');
  const vangGia = d.filter(o => !o.cost_if_wrong).length;
  if (vangGia !== KY_VONG.filter(k => k.cost_if_wrong === null).length) die('so hang vang gia lech ma tran');
});

ca('MS-AC5-lap', () => {
  const { r, w, L } = kho(); chay(r, w); const n1 = so(L).length; chay(r, w);
  if (so(L).length !== n1) die(`chay lan hai them ${so(L).length - n1} dong`);
});

ca('MS-AC5-slug', () => {
  const a = kho(); const x = spawnSync('node', [CN, '--root', a.r, '--workspace', a.w, '--write'], { encoding: 'utf8' });
  if (x.status !== 0 || so(a.L).length === 0) die('khong suy duoc slug tu ten workspace');
  const b = kho('ho-so-that', 'ten-la-khong-co-ngay', FIX.replace('_acceptance/vao-bang-email-va-mat-khau/', '_acceptance/ho-so-that/'));
  const y = chay(b.r, b.w); if (y.status !== 0 || so(b.L).length === 0) die('khong suy duoc slug tu dong contract trong ledger');
  const c = kho('khac', 'ten-la', FIX.replace('_acceptance/vao-bang-email-va-mat-khau/contract.md', 'khong-co.md'));
  const z = chay(c.r, c.w);
  if (z.status !== 2 || !z.stderr.includes('không suy được hồ sơ')) die(`ky vong exit 2 «không suy được hồ sơ», duoc ${z.status} ${z.stderr}`);
});

ca('MS-AC5-rong', () => {
  for (const p of [null, '# SDD ledger\n\nTask 1: complete (commits a..b)\n']) {
    const { r, w, L } = kho(undefined, undefined, p); const x = chay(r, w);
    if (x.status !== 0 || !x.stderr.includes('không có ruling để gặt') || so(L).length) die(`ca ${p === null ? 'vang tep' : '0 ruling'}: exit ${x.status} ${x.stderr}`);
  }
});

ca('MS-AC5-dot-bien', () => {
  const ban = mutate => { const d = mkdtempSync(path.join(tmpdir(), 'msbv-cnm-')); cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true }); cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true }); const p = path.join(d, 'scripts', 'cau-noi-ruling.mjs'); const s = readFileSync(p, 'utf8'); const m = mutate(s); if (m === s) die('kim khong khop'); writeFileSync(p, m); return p; };
  const p1 = ban(s => s.replace('if (daCo.has(ref)) continue;', ''));
  const a = kho(); chay(a.r, a.w, [], p1); chay(a.r, a.w, [], p1);
  if (so(a.L).length !== 2 * KY_VONG.length) die('dot bien bo dedupe khong co tac dung');
  console.log(`    · chieu do: bo so source_ref → «gặt lặp nhân đôi: ${so(a.L).length}» (bat duoc)`);
  const p2 = ban(s => s.replace("const NHAN_GIA = /", "const NHAN_GIA = /KHONG-BAO-GIO-KHOP|"));
  const b = kho(); chay(b.r, b.w, [], p2);
  if (so(b.L)[0].cost_if_wrong === KY_VONG[0].cost_if_wrong) die('dot bien bo nhan gia khong co tac dung');
  console.log('    · chieu do: bo nhan lam dau cat → «hàng Ruling 1 mất cost» (bat duoc)');
});

console.log(`Results: ${pass} passed, ${fail} failed (msbv-cau-noi)`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 3: Chạy — phải ĐỎ**

Run: `node tests/scripts/msbv-cau-noi.test.mjs`
Expected: mọi ca FAIL vì `scripts/cau-noi-ruling.mjs` chưa có (thông điệp «exit 1 … Cannot find module»), trừ khi ma trận lệch fixture — ca `MS-AC5-ma-tran` phải nêu đúng số hàng.

- [ ] **Step 4: Viết `scripts/cau-noi-ruling.mjs`**

```js
#!/usr/bin/env node
// cau-noi-ruling.mjs — gặt dòng «Ruling» trong ledger superpowers (.superpowers/sdd/<ws>/progress.md) vào
// _acceptance/<slug>/decisions.jsonl thành dòng ba vế (ADR 0021, hồ sơ mot-so-ba-ve). Quy tắc cắt: NHÃN
// («Vì sao:», «Sai thì tốn:», «Giá nếu sai:», «cost if wrong:», có dấu hay không) thắng dấu « — ».
import { readFileSync, existsSync, appendFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MO = /\bRuling\b[^:\n]*:/;
const DONG_MOI = /^(#|- |Task \d|Final:|S\d+:|\d+\.\s)/;
export function tachRuling(text) {
  const out = []; let cur = null;
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (MO.test(l) && !/minor \(deferred\)/.test(l)) { if (cur) out.push(cur); cur = [l]; continue; }
    if (!cur) continue;
    if (l === '' || DONG_MOI.test(l)) { out.push(cur); cur = null; } else cur.push(l);
  }
  if (cur) out.push(cur);
  return out.map(ls => ls.join(' '));
}
// Bản không dấu + ánh xạ vị trí về chuỗi gốc (một ký tự gốc có thể thành 0–1 ký tự không dấu).
function khongDau(s) {
  let n = ''; const idx = [];
  for (let i = 0; i < s.length; i++) {
    const k = s[i].normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    for (const ch of k) { n += ch; idx.push(i); }
  }
  idx.push(s.length);
  return { n, idx };
}
const NHAN_WHY = /vi sao(?: lat)?\s*:/;
const NHAN_GIA = /(?:sai thi ton|gia neu sai|cost if wrong)\s*:/;
const tim = (s, re) => { const { n, idx } = khongDau(s); const m = re.exec(n); return m ? { a: idx[m.index], b: idx[m.index + m[0].length] } : null; };
const gon = s => { const t = String(s || '').replace(/^[\s—-]+/, '').replace(/[\s—]+$/, '').trim(); return t || null; };
export function catBaVe(entry) {
  const m = entry.match(/^(.*?)\bRuling\b[^:]*:\s*/);
  const truoc = m[1].trim();
  const than = entry.slice(m[0].length);
  const prefix = (truoc.match(/^([^:]+):/) || [])[1]?.trim() || (entry.match(/^Ruling\s*\d+/) || [])[0] || 'Ruling';
  const pk = truoc.replace(/^[^:]*:\s*/, '').match(/^parked\s*—\s*([\s\S]*?)[\s—.]*$/);
  const w = tim(than, NHAN_WHY), c = tim(than, NHAN_GIA);
  const cuoiDau = Math.min(w ? w.a : Infinity, c ? c.a : Infinity, than.length);
  const dau = than.slice(0, cuoiDau);
  let why = w ? than.slice(w.b, c && c.a > w.a ? c.a : than.length) : null;
  const cost = c ? than.slice(c.b, w && w.a > c.a ? w.a : than.length) : null;
  let decision;
  if (pk) { decision = 'KHÔNG sửa: ' + gon(pk[1]); why = [gon(dau), gon(why)].filter(Boolean).join(' ') || null; }
  else if (w) decision = dau;
  else {
    const parts = dau.split(' — ').map(gon).filter(Boolean);
    decision = parts[0] || '';
    if (c) why = parts.slice(1).join(' — ') || null;
    else { why = parts[1] || null; if (parts.length > 2) return { prefix, type: 'approach', decision: gon(decision), why: gon(why), cost_if_wrong: gon(parts.slice(2).join(' — ')) }; }
  }
  return { prefix, type: pk ? 'revisit' : 'approach', decision: gon(decision), why: gon(why), cost_if_wrong: gon(cost) };
}
function suySlug(root, ws, text, slugArg) {
  const co = s => s && existsSync(path.join(root, '_acceptance', s)) && statSync(path.join(root, '_acceptance', s)).isDirectory();
  if (slugArg) return co(slugArg) ? slugArg : null;
  const tuTen = path.basename(ws).replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (co(tuTen)) return tuTen;
  const m = text.match(/_acceptance\/([\w-]+)\/contract\.md/);
  return m && co(m[1]) ? m[1] : null;
}
const soDong = t => t === '' ? 0 : t.split('\n').length - (t.endsWith('\n') ? 1 : 0);
export function main(argv) {
  const v = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const root = v('--root'), ws = v('--workspace'), write = argv.includes('--write');
  if (!root || !ws) { console.error('cau-noi-ruling: cú pháp — --root <repo> --workspace <.superpowers/sdd/<ws>> [--slug <slug>] [--write]'); return 5; }
  const wsAbs = path.resolve(root, ws);
  const pf = path.join(wsAbs, 'progress.md');
  if (!existsSync(pf)) { console.error(`cau-noi-ruling: không có ruling để gặt — không thấy ${pf}`); return 0; }
  const text = readFileSync(pf, 'utf8');
  const entries = tachRuling(text);
  if (!entries.length) { console.error(`cau-noi-ruling: không có ruling để gặt — ${pf} không có dòng Ruling`); return 0; }
  const slug = suySlug(root, wsAbs, text, v('--slug'));
  if (!slug) { console.error(`cau-noi-ruling: không suy được hồ sơ — tên workspace «${path.basename(wsAbs)}» và dòng _acceptance/<slug>/contract.md trong ledger đều không trỏ tới hồ sơ có thật; truyền --slug`); return 2; }
  const L = path.join(root, '_acceptance', slug, 'decisions.jsonl');
  let so = existsSync(L) ? readFileSync(L, 'utf8') : '';
  const daCo = new Set(so.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l).source_ref; } catch { return null; } }).filter(Boolean));
  let moi = 0;
  const now = new Date(); const utc = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z'); const at = now.toISOString().replace(/\.\d+Z$/, 'Z');
  for (const e of entries) {
    const b = catBaVe(e);
    const ref = `${path.basename(wsAbs)}#${b.prefix}:${createHash('sha256').update(e).digest('hex').slice(0, 8)}`;
    if (daCo.has(ref)) continue;
    const o = { id: `d-${utc}-${soDong(so) + 1}`, type: b.type, stage: 'S3', at, decision: b.decision };
    if (b.why) o.why = b.why;
    if (b.cost_if_wrong) o.cost_if_wrong = b.cost_if_wrong;
    o.source = 'superpowers'; o.source_ref = ref;
    const line = JSON.stringify(o) + '\n';
    if (write) { if (so !== '' && !so.endsWith('\n')) { appendFileSync(L, '\n'); so += '\n'; } appendFileSync(L, line); } else process.stdout.write(line);
    so += line; daCo.add(ref); moi++;
  }
  console.log(`cau-noi-ruling: đã gặt ${moi} ruling vào sổ ${slug} (${entries.length - moi} đã có)`);
  return 0;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
```

- [ ] **Step 5: Chạy — phải XANH**

Run: `node tests/scripts/msbv-cau-noi.test.mjs`
Expected: `Results: 5 passed, 0 failed (msbv-cau-noi)`. Hàng nào lệch: sửa `catBaVe` nếu quy tắc cắt sai so với Step 4, sửa `KY_VONG` CHỈ khi phần tử chép sai chữ fixture — ghi lý do vào commit.

- [ ] **Step 6: Commit**

```bash
git add scripts/cau-noi-ruling.mjs tests/scripts/fixtures/msbv-progress-superpowers.md tests/scripts/msbv-cau-noi.test.mjs
git commit -m "feat(mot-so-ba-ve): cầu nối gặt ruling superpowers vào sổ ba vế (AC-5)"
```

---

### Task 4: Hook chặn lệnh xoá thư mục tạm cho tới khi đã gặt

`independent: false` (cần `scripts/cau-noi-ruling.mjs` của Task 3) · phục vụ **E6** (AC-6); cuối task chạy trọn executor `msbv` (E1–E5, E7, E9)

**Files:**
- Create: `hooks/ruling-truoc-khi-xoa.js`
- Modify: `hooks/hooks.json` (thêm mục PreToolUse matcher `Bash`)
- Create: `tests/hooks/ruling-truoc-khi-xoa.test.mjs`
- Modify: `tests/hooks/run-tests.sh` (gọi tệp test node trước dòng `Results:`)
- Modify: `tests/scripts/msbv-the.test.mjs` (thêm ca `MS-AC2-recipe` — round-trip recipe Task 1 → thẻ Task 2)

**Interfaces:**
- Consumes: CLI `cau-noi-ruling.mjs` (Task 3) — exit 0/2/5 như đã khai; `ghiSo` (Task 1).
- Produces: `export function workspacesBiXoa(command, cwd) → { ws: string[] /*đường tuyệt đối*/, khongGiai: string[] }` (CommonJS `module.exports`).

- [ ] **Step 1: Viết test đỏ `tests/hooks/ruling-truoc-khi-xoa.test.mjs`**

```js
// ruling-truoc-khi-xoa.test.mjs — hồ sơ mot-so-ba-ve, làn hook (AC-6). Chạy CHÍNH lệnh ghi trong hooks.json
// (gồm bộ lọc shell) với CLAUDE_PLUGIN_ROOT = gốc kho, payload đúng hình PreToolUse. Tên ca = tên AC.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let pass = 0, fail = 0;
const ca = (n, f) => { try { f(); pass++; console.log(`  PASS: ${n} `); } catch (e) { fail++; console.log(`  FAIL: ${n} — ${e.message}`); } };
const die = m => { throw new Error(m); };
const hooksJson = JSON.parse(readFileSync(path.join(ROOT, 'hooks', 'hooks.json'), 'utf8'));
const muc = hooksJson.hooks.PreToolUse.filter(x => x.matcher === 'Bash' && x.hooks.some(h => h.command.includes('ruling-truoc-khi-xoa.js')));
const PROGRESS = '# SDD ledger\n\nHợp đồng ràng buộc: _acceptance/ws-thu/contract.md\n\nRuling 1: chọn A — Vì sao: vì B. Sai thì tốn: C.\n\nTask 2: Ruling: chọn D — vì E — tốn F\n';
const kho = (slugDir = 'ws-thu') => {
  const r = mkdtempSync(path.join(tmpdir(), 'rt-'));
  mkdirSync(path.join(r, '_acceptance', slugDir), { recursive: true }); writeFileSync(path.join(r, '_acceptance', slugDir, 'decisions.jsonl'), '');
  for (const ws of ['2026-09-29-ws-thu', '2026-09-30-ws-thu']) { const w = path.join(r, '.superpowers', 'sdd', ws); mkdirSync(w, { recursive: true }); writeFileSync(path.join(w, 'progress.md'), PROGRESS); }
  mkdirSync(path.join(r, 'apps', 'con'), { recursive: true });
  return r;
};
const so = r => { const p = path.join(r, '_acceptance', 'ws-thu', 'decisions.jsonl'); return existsSync(p) ? readFileSync(p, 'utf8') : ''; };
const dem = r => so(r).split('\n').filter(Boolean).length;
const hook = (r, command, cwd = r, pluginRoot = ROOT) => {
  const cmd = muc[0].hooks.find(h => h.command.includes('ruling-truoc-khi-xoa.js')).command;
  return spawnSync('sh', ['-c', cmd], { input: JSON.stringify({ tool_name: 'Bash', cwd, tool_input: { command } }), env: { ...process.env, CLAUDE_PLUGIN_ROOT: pluginRoot }, encoding: 'utf8' });
};

ca('RT-AC6-dang-ky', () => { if (muc.length !== 1) die(`hooks.json co ${muc.length} muc Bash tro ruling-truoc-khi-xoa.js`); });

const HANG = [
  ['finish-tuyet-doi', r => `rm -rf ${path.join(r, '.superpowers', 'sdd', '2026-09-29-ws-thu')}`, r => r, 2],
  ['cwd-con', r => `rm -rf ${path.join(r, '.superpowers', 'sdd', '2026-09-29-ws-thu')}`, r => path.join(r, 'apps', 'con'), 2],
  ['tuong-doi', () => 'rm -rf .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['gach-cuoi', () => 'rm -rf .superpowers/sdd/2026-09-29-ws-thu/', r => r, 2],
  ['sau-cd', () => 'cd .superpowers/sdd && rm -rf 2026-09-29-ws-thu', r => r, 2],
  ['thu-muc-cha', () => 'rm -rf .superpowers/sdd', r => r, 4],
  ['rm-r', () => 'rm -r .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['rm-fr', () => 'rm -fr .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['rm-R', () => 'rm -R .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['nhay-kep', () => 'rm -rf ".superpowers/sdd/2026-09-29-ws-thu"', r => r, 2],
];
ca('RT-AC6-gat', () => {
  for (const [ten, lenh, cwd, n] of HANG) {
    const r = kho(); const x = hook(r, lenh(r), cwd(r));
    if (x.status !== 0) die(`hang ${ten}: exit ${x.status} ${x.stderr}`);
    if (dem(r) !== n) die(`hang ${ten}: so co ${dem(r)} dong, ky vong ${n}`);
  }
});
ca('RT-AC6-im', () => {
  for (const lenh of ['cat .superpowers/sdd/2026-09-29-ws-thu/progress.md', 'grep -r Ruling .superpowers/sdd/2026-09-29-ws-thu', 'ls -R .superpowers/sdd', 'node x.mjs --workspace .superpowers/sdd/2026-09-29-ws-thu', 'rm -rf /tmp/x.superpowers-bak', 'rm .superpowers/sdd/2026-09-29-ws-thu/progress.md']) {
    const r = kho(); const truoc = createHash('sha256').update(so(r)).digest('hex'); const x = hook(r, lenh);
    if (x.status !== 0) die(`«${lenh}»: exit ${x.status}`);
    if (createHash('sha256').update(so(r)).digest('hex') !== truoc) die(`«${lenh}»: so doi`);
  }
});
ca('RT-AC6-bien', () => {
  const r = kho(); const x = hook(r, 'rm -rf "$WS"');
  if (x.status !== 0 || dem(r) !== 0) die(`exit ${x.status}, so ${dem(r)} dong`);
  const y = hook(r, 'WS=.superpowers/sdd/2026-09-29-ws-thu; rm -rf "$WS"');
  if (y.status !== 0 || !y.stderr.includes('không giải được đường')) die('khong khai «không giải được đường»: ' + y.stderr);
});
ca('RT-AC6-chan', () => {
  const r = kho('ho-so-khac'); const x = hook(r, 'rm -rf .superpowers/sdd/2026-09-29-ws-thu');
  if (x.status !== 2 || !x.stderr.includes('ruling chưa vào sổ') || !x.stderr.includes('cau-noi-ruling.mjs')) die(`exit ${x.status} ${x.stderr}`);
});
ca('RT-AC6-vang', () => { const r = kho(); const x = hook(r, 'rm -rf .superpowers/sdd/khong-ton-tai'); if (x.status !== 0 || dem(r) !== 0) die(`exit ${x.status}`); });

const banSao = mutate => { const d = mkdtempSync(path.join(tmpdir(), 'rt-m-')); for (const s of ['hooks', 'scripts', 'lib']) cpSync(path.join(ROOT, s), path.join(d, s), { recursive: true }); const p = path.join(d, 'hooks', 'ruling-truoc-khi-xoa.js'); const s = readFileSync(p, 'utf8'); const m = mutate(s); if (m === s) die('kim khong khop'); writeFileSync(p, m); return d; };
ca('RT-AC6-dot-bien-rm', () => {
  const d = banSao(s => s.replace("if (!laRm(w[0])) continue;", ''));
  const r = kho(); hook(r, 'grep -r Ruling .superpowers/sdd/2026-09-29-ws-thu', r, d);
  if (dem(r) === 0) die('dot bien bo neo rm khong co tac dung');
  console.log('    · chieu do: bo neo rm → «lệnh đọc kích gặt» (bat duoc)');
});
ca('RT-AC6-dot-bien-chan', () => {
  const d = banSao(s => s.replace('process.exitCode = 2;', ''));
  const r = kho('ho-so-khac'); const x = hook(r, 'rm -rf .superpowers/sdd/2026-09-29-ws-thu', r, d);
  if (x.status === 2) die('dot bien bo exit 2 khong co tac dung');
  console.log('    · chieu do: bo exit 2 → «hook cho xoá khi ruling chưa vào sổ» (bat duoc)');
});
console.log(`  Results: ${pass} passed, ${fail} failed (ruling-truoc-khi-xoa)`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Chạy — phải ĐỎ**

Run: `node tests/hooks/ruling-truoc-khi-xoa.test.mjs`
Expected: `FAIL: RT-AC6-dang-ky — hooks.json co 0 muc …` và các ca còn lại FAIL.

- [ ] **Step 3: Viết `hooks/ruling-truoc-khi-xoa.js`**

```js
#!/usr/bin/env node
/*
 * ruling-truoc-khi-xoa.js — PreToolUse (matcher Bash) của acceptance-gate. Hồ sơ mot-so-ba-ve, ADR 0021.
 * superpowers xoá thư mục tạm .superpowers/sdd/<ws>/ ở bước Finish — cùng lúc là ruling trong progress.md
 * mất. Hook này neo vào LỆNH rm đệ quy (không vào chuỗi): đối số giải được về dưới .superpowers/sdd →
 * chạy cầu nối gặt ruling vào decisions.jsonl rồi mới cho xoá; gặt lỗi → exit 2 chặn kèm lệnh chạy tay.
 * Đối số mang thay thế shell ($, dấu huyền) không giải được: cho qua, khai một dòng (giới hạn đã khai).
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const CAU_NOI = path.join(__dirname, '..', 'scripts', 'cau-noi-ruling.mjs');

function tachLenh(s) { // tách theo ; && || | xuống dòng, tôn trọng nháy
  const out = []; let cur = '', q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if (c === ';' || c === '\n' || c === '|' || (c === '&' && s[i + 1] === '&')) { out.push(cur); cur = ''; if (s[i + 1] === c) i++; continue; }
    cur += c;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}
function tachTu(s) { // trả [{ raw, val }]
  const out = []; let raw = '', val = '', q = null, co = false;
  for (const c of s) {
    if (q) { raw += c; if (c === q) q = null; else val += c; continue; }
    if (c === "'" || c === '"') { q = c; raw += c; co = true; continue; }
    if (/\s/.test(c)) { if (co || raw) out.push({ raw, val }); raw = ''; val = ''; co = false; continue; }
    raw += c; val += c;
  }
  if (co || raw) out.push({ raw, val });
  return out;
}
const laRm = t => t && (t.val === 'rm' || t.val.endsWith('/rm'));
const coThayThe = raw => /\$|`/.test(raw.replace(/'[^']*'/g, ''));
function workspacesBiXoa(command, cwd0) {
  const ws = new Set(), khongGiai = []; let cwd = cwd0;
  for (const lenh of tachLenh(command)) {
    const w = tachTu(lenh);
    if (!w.length) continue;
    if (w[0].val === 'cd') { if (w[1] && !coThayThe(w[1].raw)) cwd = path.resolve(cwd, w[1].val); continue; }
    if (!laRm(w[0])) continue;
    let deQuy = false; const args = []; let hetCo = false;
    for (const t of w.slice(1)) {
      if (!hetCo && t.val === '--') { hetCo = true; continue; }
      if (!hetCo && t.val.startsWith('-')) { if (t.val === '--recursive' || /^-[a-zA-Z]*[rR]/.test(t.val)) deQuy = true; continue; }
      args.push(t);
    }
    if (!deQuy) continue;
    for (const t of args) {
      if (coThayThe(t.raw)) { if (/superpowers|\$/.test(t.raw)) khongGiai.push(t.raw); continue; }
      const abs = path.resolve(cwd, t.val).replace(/\/+$/, '');
      const iSdd = abs.indexOf(`${path.sep}.superpowers${path.sep}sdd`);
      if (abs.endsWith(`${path.sep}.superpowers`) || abs.endsWith(`${path.sep}.superpowers${path.sep}sdd`)) {
        const sdd = abs.endsWith('sdd') ? abs : path.join(abs, 'sdd');
        if (fs.existsSync(sdd)) for (const d of fs.readdirSync(sdd)) if (fs.statSync(path.join(sdd, d)).isDirectory()) ws.add(path.join(sdd, d));
      } else if (iSdd >= 0) {
        const sdd = abs.slice(0, iSdd + `${path.sep}.superpowers${path.sep}sdd`.length);
        const rest = path.relative(sdd, abs).split(path.sep)[0];
        if (rest && rest !== '..') ws.add(path.join(sdd, rest));
      }
    }
  }
  return { ws: [...ws], khongGiai };
}
module.exports = { workspacesBiXoa };

if (require.main === module) {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { process.exit(0); }
  if (input.tool_name && input.tool_name !== 'Bash') process.exit(0);
  const command = (input.tool_input && input.tool_input.command) || '';
  const { ws, khongGiai } = workspacesBiXoa(command, input.cwd || process.cwd());
  for (const k of khongGiai) console.error(`ruling-truoc-khi-xoa: không giải được đường: ${k} — ruling trong đó (nếu có) chưa được gặt; giới hạn đã khai`);
  for (const w of ws) {
    if (!fs.existsSync(w)) continue;
    const root = path.dirname(path.dirname(path.dirname(w)));
    const r = spawnSync(process.execPath, [CAU_NOI, '--root', root, '--workspace', w, '--write'], { encoding: 'utf8' });
    if (r.status === 0) { if (r.stdout.trim()) console.log(r.stdout.trim()); continue; }
    const lyDo = (r.stderr || '').trim().split('\n')[0] || `exit ${r.status}`;
    console.error(`ruling-truoc-khi-xoa: ruling chưa vào sổ — ${lyDo}; chạy tay: node ${CAU_NOI} --root ${root} --workspace ${w} --slug <slug> --write rồi xoá lại`);
    process.exitCode = 2;
  }
}
```

- [ ] **Step 4: Đăng ký trong `hooks/hooks.json`** — thêm phần tử thứ hai vào mảng `PreToolUse`:

```json
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "sh -c 'd=$(cat); case \"$d\" in *.superpowers*) printf %s \"$d\" | node \"${CLAUDE_PLUGIN_ROOT}/hooks/ruling-truoc-khi-xoa.js\";; esac'"
          }
        ]
      }
```

- [ ] **Step 5: Nối test node vào `tests/hooks/run-tests.sh`** — ngay trước khối `echo ""` / `echo "Results: …"` cuối tệp:

```bash
echo "RT làn hook ruling-truoc-khi-xoa (hồ sơ mot-so-ba-ve)"
node "$HERE/ruling-truoc-khi-xoa.test.mjs"; check RT-node 0 $?
```

- [ ] **Step 6: Chạy — phải XANH**

Run: `node tests/hooks/ruling-truoc-khi-xoa.test.mjs && bash tests/hooks/run-tests.sh | tail -3`
Expected: `Results: 9 passed, 0 failed (ruling-truoc-khi-xoa)`; suite hooks `0 failed`.

- [ ] **Step 7: Thêm ca round-trip `MS-AC2-recipe` vào `tests/scripts/msbv-the.test.mjs`** (Task 1 đã gộp nên `ghiSo` có) — chèn trước dòng `console.log(\`Results:`, thêm import `import { ghiSo } from './msbv-fixture.mjs';` ở đầu tệp:

```js
ca('MS-AC2-recipe', () => {
  const r = mkWs('g', g2(J({ id: 'd-s', type: 'seal', gate: 1, at: '2026-09-29T00:00:00Z' }) + '\n', null));
  ghiSo(path.join(r, '_acceptance', 'g', 'decisions.jsonl'), { type: 'approach', stage: 'S3', at: '2026-09-29T00:01:00Z', decision: 'Dr', why: 'Wr', cost_if_wrong: 'Cr' });
  if (!(khoi(render(r, 'g').stdout, 'Quyết định CHƯA duyệt') || '').includes('Dr — Wr — sai thì tốn: Cr')) die('dong ghi bang recipe khong in ba ve tren the');
});
```
và thay danh sách ca trong vòng `for c in …` của khoá `executors.script.msbv` (`_acceptance/config.yaml`, giữ bọc nháy kép) bằng ĐÚNG danh sách ca ba tệp test in ra:
`MS-AC1-recipe MS-AC1-lib-im MS-AC7-van-ban MS-AC2-ba-khoi MS-AC2-dot-bien MS-AC2-recipe MS-AC3-doc-cu MS-AC3-dot-bien MS-AC3-nen MS-AC4-thieu-gia MS-AC4-chi-gia MS-AC8-xuat MS-AC9-extract MS-AC9-dot-bien MS-AC5-ma-tran MS-AC5-lap MS-AC5-slug MS-AC5-rong MS-AC5-dot-bien`.
Kiểm: `grep -o 'PASS: MS-[A-Za-z0-9-]*' <(for f in msbv-so msbv-the msbv-cau-noi; do node tests/scripts/$f.test.mjs; done) | sort` phải bằng danh sách trên sau khi sort.

- [ ] **Step 8: Chạy trọn executor của hồ sơ và bộ kiểm toàn kho**

Run: `bash -c "$(python3 -c "import yaml;print(yaml.safe_load(open('_acceptance/config.yaml'))['executors']['script']['msbv'])")"; echo "msbv exit=$?"` rồi `bash tests/scripts/run-tests.sh | tail -2; bash tests/hooks/run-tests.sh | tail -1; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:"; node scripts/product-map.mjs --root . --check`
Expected: `msbv exit=0`; ba suite `0 failed`; product-map exit 0. Suite đỏ ngoài hồ sơ → ghi dòng `fix` vào sổ trước khi sửa.

- [ ] **Step 9: Commit**

```bash
git add hooks/ruling-truoc-khi-xoa.js hooks/hooks.json tests/hooks/ruling-truoc-khi-xoa.test.mjs tests/hooks/run-tests.sh tests/scripts/msbv-the.test.mjs _acceptance/config.yaml
git commit -m "feat(mot-so-ba-ve): hook chặn xoá thư mục tạm superpowers cho tới khi ruling vào sổ (AC-6)"
```
