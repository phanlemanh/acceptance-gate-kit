# evals-sat-le-doc-du Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một bộ đọc trường danh sách của `evals.yaml` ở `lib/evidence-core.cjs` (`evalListsOf`) đọc đúng mọi cách viết (sát lề, thụt, khối, một dòng, neo) cho lượt chấm, lượt sửa và bộ đọc vùng tệp; danh sách không đọc được lên cờ vàng có tên ở lượt chấm và hai thẻ cổng.

**Architecture:** `evalListsOf(text, keys)` quét theo dòng, cột khoá = cột của chữ `id` trong `- id:`. `evalPathsOf` thành vỏ của nó (hợp đồng giữ nguyên). `s4-args.mjs` và `carry-plan.mjs` bỏ bộ đọc danh sách tự viết, gọi lib. `gate-card.js` gọi `danhSachKhongDoc` để in cờ. Một tệp ca mới chứng mọi AC trên fixture do mã sinh, bản base lấy bằng `git archive 3200ba3a`.

**Tech Stack:** Node ≥ 18 (ESM + CJS), bash; không thêm gói ngoài.

**Spec:** `docs/superpowers/specs/2026-10-10-evals-sat-le-doc-du-design.md` · hợp đồng `_acceptance/evals-sat-le-doc-du/contract.md` (DUYỆT 10/10) · evals `_acceptance/evals-sat-le-doc-du/evals.yaml`.

## Global Constraints

- Không thư viện YAML; đọc theo dòng (`resolveConfigKey` «No YAML lib — line-based on purpose»).
- Kho thụt 4 đọc ra Y HỆT trước/sau (luật 26/09) — phép vi phân là lưới, không phải lời hứa.
- Bản base: `BASE = 3200ba3a`, `BASE_DIRS = ['feature-loop/scripts', 'lib', 'scripts']` — một hằng dùng chung mọi ca; chép trọn thư mục bằng `git archive`, không danh sách tệp tay (P150).
- Mọi fixture do mã sinh trong lượt chạy; mọi đường dẫn suy từ vị trí tệp ca.
- Mỗi phép đo mới: đối chứng dương + chiều đỏ trên CÙNG fixture, thông điệp ghim (MEASURE-BIRTH-CLAUSE).
- Tên ca in đúng khuôn `PASS: <MÃ> <mô tả>` (khoá config grep `PASS: <MÃ> `).
- Không đổi `lib/eval-yaml.cjs`; không sửa gì ở kho crm.

## Review Focus

1. Tiêu chí trùng id trong một tệp — bộ đọc mới lấy tiêu chí ĐẦU; phép vi phân VP1 nói ra nếu kho thật có ca khác bộ cũ. (Task 1, VP1 in số lệch theo id.)
2. Dòng chú thích / dòng trống GIỮA các mục khối không cắt danh sách (bộ cũ của `evalPathsOf` đã giữ điều này — lượt chấm 3, Ngoài-5). (Task 1, ca NEO1 fixture có một dòng chú thích giữa hai mục.)
3. Mục khối có nháy và chú thích cuối dòng (`- "src/a.ts"   # ghi chú`) → giá trị bỏ nháy, bỏ chú thích. (Task 1, mô hình AC-1 có một mục như vậy.)
4. Khoá danh sách viết `[]` tường minh → mảng rỗng, KHÔNG cờ (khác `key:` trống → cờ `rong`). (Task 2, CB2 chiều im có một `[]`.)
5. Tab thay dấu cách ở đầu dòng → đổi tab thành hai dấu cách như bộ cũ của lượt chấm. (Task 1, VP1 trên kho thật; không thêm ca riêng — 0 tab trên 620 hồ sơ thì phép vi phân là đủ.)

---

### Task 1: Bộ đọc danh sách ở lib + phép vi phân trên kho kit

**Files:**
- Modify: `lib/evidence-core.cjs` (thay thân `evalPathsOf` ~395–414; thêm `evalListsOf`, `moTaCanhBao`, `danhSachKhongDoc`, `DANH_SACH_KEYS`; export)
- Create: `tests/scripts/evals-sat-le-lib.mjs` (hằng + bộ sinh fixture + bản base + bộ vi phân — dùng chung cho tệp ca và CLI bảy kho)
- Create: `tests/scripts/evals-sat-le.test.mjs` (ca NEO1–3, VP1–2 ở task này)

**Interfaces:**
- Produces (lib): `evalListsOf(evalsText: string, keys: string[]) → { byId: Map<string, Record<string,string[]>>, canhBao: {id,key,ly_do:'bi-danh'|'khong-phai-danh-sach'|'rong',dong:number}[] }` · `moTaCanhBao(c) → "<id>.<key> (<lý do chữ>)"` · `DANH_SACH_KEYS = ['inputs','paths','evidence_required','steps']` · `danhSachKhongDoc(evalsText) → string[]` (moTaCanhBao của `evalListsOf(text, DANH_SACH_KEYS).canhBao`) · `evalPathsOf(text, id)` không đổi chữ ký.
- Produces (test lib): `BASE`, `BASE_DIRS`, `KIT`, `dungBase() → dir` (git archive vào thư mục tạm, kiểm «base trùng cây», «base thiếu tệp»), `vietMoHinh(cach) → string` (cach ∈ `thut4|satle|muc-ngang-khoa`), `MO_HINH`, `docDanhSachS4(srcS4, evalsText, ids, keys)` (rút khối danh sách của MỘT bản s4-args bằng mốc `// list fields` → `}` rồi chạy), `viPhan({ khos, base, moi })`.

- [ ] **Step 1: Viết ca đỏ trước** — `tests/scripts/evals-sat-le.test.mjs` với NEO1–3 và VP1–2:

```js
// evals-sat-le.test.mjs — hồ sơ evals-sat-le-doc-du. Fixture do mã sinh; base = git archive (BASE_DIRS).
import { createRequire } from 'node:module';
import path from 'node:path';
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import * as L from './evals-sat-le-lib.mjs';
const require = createRequire(import.meta.url);
let pass = 0, fail = 0;
const ok = (ma, m) => { console.log(`  PASS: ${ma} ${m}`); pass++; };
const bad = (ma, m) => { console.log(`  FAIL: ${ma} ${m}`); fail++; };
const ca = (ma, m, f) => { try { const r = f(); r === true ? ok(ma, m) : bad(ma, `${m} — ${r}`); } catch (e) { bad(ma, `${m} — ${e.message.split('\n')[0]}`); } };
const CORE = require(path.join(L.KIT, 'lib', 'evidence-core.cjs'));
const BASE_DIR = L.dungBase();
const CORE_BASE = require(path.join(BASE_DIR, 'lib', 'evidence-core.cjs'));
const NEO = 'evals:\n- id: E1\n  executor: script\n  paths: &id001\n  - a/x.js\n  # ghi chu giua muc\n  - "b/**"   # duoi\n- id: E2\n  executor: script\n  paths: *id001\n';
ca('NEO1', 'neo &id001 + mục khối → đúng các mục', () => JSON.stringify(CORE.evalPathsOf(NEO, 'E1')) === '["a/x.js","b/**"]' || JSON.stringify(CORE.evalPathsOf(NEO, 'E1')));
ca('NEO2', 'bí danh *id001 → null + cờ bi-danh, không glob & hay *', () => {
  const p = CORE.evalPathsOf(NEO, 'E2'); const c = CORE.evalListsOf(NEO, ['paths']).canhBao;
  return (p === null && c.some(x => x.id === 'E2' && x.ly_do === 'bi-danh')) || JSON.stringify({ p, c });
});
ca('NEO3', 'chiều đỏ: base đọc neo thành glob', () => {
  const p = CORE_BASE.evalPathsOf(NEO, 'E1');
  return (Array.isArray(p) && p[0] === '&id001') ? (console.log('    · neo thành glob (base)'), true) : `base không tái hiện lỗi: ${JSON.stringify(p)}`;
});
// VP1/VP2 — vi phân trên mọi hồ sơ của kit
const kq = L.viPhan({ khos: [L.KIT], base: BASE_DIR, moi: L.KIT });
ca('VP1', `vi phân kit: ${kq.hoSo} hồ sơ / ${kq.tieuChi} tiêu chí, 0 lệch ngoài sát lề`, () => {
  if (!kq.hoSo || !kq.tieuChi) return 'vi phân rỗng';
  const lech = kq.lech.filter(x => !x.satLe);
  return !lech.length || `vi phân lệch: ${lech[0].hoSo} ${lech[0].id}.${lech[0].key}`;
});
ca('VP2', 'chiều đỏ: bỏ mục cuối của mọi danh sách khối → lệch', () => {
  const dot = L.dungBanSaoLibDotBien(s => s.replace('seq.items.push(', 'seq.items.length >= 0 && (seq.cuoi = ') /* thay ở Step 3 */);
  const kq2 = L.viPhan({ khos: [L.KIT], base: BASE_DIR, moi: dot });
  if (!kq2.doi) return 'đột biến tương đương';
  const lech = kq2.lech.filter(x => !x.satLe);
  return lech.length ? (console.log(`    · vi phân lệch: ${lech[0].hoSo}`), true) : 'đột biến không làm lệch';
});
console.log(`Results: ${pass} passed, ${fail} failed (evals-sat-le)`);
process.exit(fail ? 1 : 0);
```

(VP2 đột biến chính xác chốt ở Step 3 khi thân hàm đã có: thay `seq.items.push(` bằng một biểu thức gạt mục cuối — `dungBanSaoLibDotBien(f)` chép trọn `lib/` vào thư mục tạm, áp `f` lên `evidence-core.cjs`, kiểm kim khớp đúng MỘT lần, trả gốc bản sao.)

- [ ] **Step 2: Chạy, xác nhận đỏ** — `node tests/scripts/evals-sat-le.test.mjs` → FAIL NEO1/NEO2 (`evalListsOf` chưa có, `evalPathsOf` trả `["&id001"]`), VP1 lỗi nạp.

- [ ] **Step 3: Viết `evalListsOf` + vỏ `evalPathsOf`** trong `lib/evidence-core.cjs`, thay thân `evalPathsOf` hiện tại:

```js
// ── MỘT bộ đọc trường danh sách của evals.yaml (hồ sơ evals-sat-le-doc-du) ──────────────
// Cột khoá của một tiêu chí = cột của chữ `id` trong dòng `- id:` (sát lề: 2 · thụt 4: 4) — đúng
// ngữ nghĩa ánh xạ khối YAML ở mọi cách viết; mục khối nhận ở thụt ≥ cột khoá (YAML 1.2 cho phép
// mục cùng cột khoá cha — kiểu xuất mặc định của bộ xuất YAML). Neo `&ten` được bỏ nhãn; bí danh
// `*ten`, khối chữ `|`/`>`, ánh xạ `{…}` và khoá trống không mục nào lên cờ có tên — không bao giờ
// đọc chúng thành giá trị. Tiêu chí trùng id: lấy tiêu chí ĐẦU. Không ném.
const DANH_SACH_KEYS = ['inputs', 'paths', 'evidence_required', 'steps'];
const LY_DO_DANH_SACH = { 'bi-danh': 'bí danh YAML', 'khong-phai-danh-sach': 'không phải danh sách', 'rong': 'khai mà rỗng' };
function evalListsOf(evalsText, keys) {
  const want = new Set(keys || DANH_SACH_KEYS);
  const byId = new Map(); const canhBao = [];
  let cur = null, keyCol = -1, seq = null;
  const dong = () => { if (seq && !seq.items.length) canhBao.push({ id: cur.id, key: seq.key, ly_do: 'rong', dong: seq.dong }); seq = null; };
  const lines = String(evalsText == null ? '' : evalsText).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\t/g, '  ');
    const idM = raw.match(/^(\s*)-\s+id:\s*(.*)$/);
    if (idM) {
      if (cur) dong();
      const id = parseFlowValue(idM[2]).value;
      keyCol = raw.indexOf('id:', idM[1].length);
      cur = byId.has(id) ? null : { id, f: {} };
      if (cur) byId.set(id, cur.f);
      continue;
    }
    if (!cur) continue;
    if (seq) {
      if (!raw.trim() || /^\s*#/.test(raw)) continue;
      const it = raw.match(/^(\s*)-\s+(\S.*)$/);
      if (it && it[1].length >= keyCol) { seq.items.push(parseFlowValue(it[2].replace(/\s+#.*$/, '')).value); continue; }
      dong();
    }
    if (raw.length - raw.trimStart().length !== keyCol) continue;
    const f = raw.match(/^\s*([\w-]+):(.*)$/);
    if (!f || !want.has(f[1])) continue;
    const k = f[1];
    let v = f[2].trim();
    v = v.startsWith('#') ? '' : v.replace(/\s+#.*$/, '').trim();
    const neo = v.match(/^&\S+\s*(.*)$/); if (neo) v = neo[1].trim();
    if (!v) { seq = { key: k, items: [], dong: i + 1 }; cur.f[k] = seq.items; continue; }
    if (v.startsWith('*')) { canhBao.push({ id: cur.id, key: k, ly_do: 'bi-danh', dong: i + 1 }); continue; }
    if (/^[|>{]/.test(v)) { canhBao.push({ id: cur.id, key: k, ly_do: 'khong-phai-danh-sach', dong: i + 1 }); continue; }
    const pv = parseFlowValue(v);
    cur.f[k] = pv.kind === 'seq' ? pv.items : [pv.value];
  }
  if (cur) dong();
  return { byId, canhBao };
}
const moTaCanhBao = c => `${c.id}.${c.key} (${LY_DO_DANH_SACH[c.ly_do] || c.ly_do})`;
function danhSachKhongDoc(evalsText) { return evalListsOf(evalsText, DANH_SACH_KEYS).canhBao.map(moTaCanhBao); }
// paths của MỘT eval — vỏ của evalListsOf; null = không khai / mảng rỗng / không đọc được (hợp đồng cũ).
function evalPathsOf(evalsText, id) {
  const f = evalListsOf(evalsText, ['paths']).byId.get(String(id));
  return f && Array.isArray(f.paths) && f.paths.length ? f.paths : null;
}
```

Export thêm `evalListsOf, moTaCanhBao, danhSachKhongDoc, DANH_SACH_KEYS` ở `module.exports`. Chốt đột biến VP2: kim `seq.items.push(parseFlowValue(it[2]` → thay bằng `seq.cuoi = (parseFlowValue(it[2]` … sao cho mục cuối không vào mảng: dùng phép thay `if (it && it[1].length >= keyCol) { seq.items.push(` → `if (it && it[1].length >= keyCol) { if (seq.tre !== undefined) seq.items.push(seq.tre); seq.tre = (` (giữ mục trước, mục cuối luôn treo). Kim phải khớp đúng một lần.

- [ ] **Step 4: Viết `tests/scripts/evals-sat-le-lib.mjs`** — `KIT` suy từ vị trí tệp; `dungBase()`: `git -C KIT rev-parse BASE` (không giải được → ném «base không giải được»), so `git rev-parse HEAD:lib` với `BASE:lib` (trùng → ném «base trùng cây»), `git archive BASE ...BASE_DIRS | tar -x -C <tmp>`, kiểm mỗi tệp chiều đỏ cần (`lib/evidence-core.cjs`, `feature-loop/scripts/s4-args.mjs`, `feature-loop/scripts/carry-plan.mjs`, `scripts/acceptance-gold.mjs`, `scripts/gate-card.js`) có mặt (thiếu → ném «base thiếu tệp: <đường>»). `viPhan({khos, base, moi})`: với mỗi `<kho>/_acceptance/*/evals.yaml`, lấy id bằng `parseEvals` của bản mới; so (a) bốn trường: khối danh sách của s4-args base (rút bằng `docDanhSachS4`) ↔ `evalListsOf` của `moi` cho `['steps','inputs','paths','evidence_required']`, chuẩn hoá `[]`/vắng thành `null`; (b) `evalPathsOf` base ↔ moi. Trả `{ hoSo, tieuChi, lech: [{kho, hoSo, id, key, cu, moi, satLe, chieu}], doi }` — `satLe = /^- id:/m.test(text)`, `chieu = 'doc-them'` khi `cu` null hoặc mọi phần tử bắt đầu `&`/`*` và `moi` có giá trị.

- [ ] **Step 5: Chạy, xác nhận xanh** — `node tests/scripts/evals-sat-le.test.mjs` → `PASS: NEO1..NEO3, VP1, VP2`.

- [ ] **Step 6: Chạy bộ kiểm cũ chạm `evalPathsOf`** — `bash tests/scripts/run-tests.sh --manh mjs:1/3` (và 2/3, 3/3) → không ca nào đỏ mới.

- [ ] **Step 7: Commit** — `git add lib/evidence-core.cjs tests/scripts/evals-sat-le-lib.mjs tests/scripts/evals-sat-le.test.mjs && git commit -m "feat(evals-sat-le-doc-du): evalListsOf — một bộ đọc danh sách; evalPathsOf thành vỏ (AC-3, AC-5)"`

Phục vụ: E3 (AC-3), E6 (AC-5). independent: false (mọi task sau dựa vào nó).

### Task 2: Lượt chấm đọc qua lib + cờ (s4-args)

**Files:**
- Modify: `feature-loop/scripts/s4-args.mjs` (import ~82; khối 158–182; args ~679)
- Test: `tests/scripts/evals-sat-le.test.mjs` (BC1, BC2, CB1–3, MN1 phần s4-args, MN2 phần s4-args)

**Interfaces:** Consumes `evalListsOf`, `moTaCanhBao`. Produces khoá args `canhBaoDanhSach: string[]` (vắng khi rỗng) và dòng stderr `s4-args: danh sách không đọc được: <mục, …>`.

- [ ] **Step 1: Ca đỏ** — `L.dungKho(evalsText)` (kho git do mã sinh như `s4-args-not-run.test.mjs`: config với `executors.script.cli`, `feature_loop.suite_keys`, contract T2 `implemented`, `README.md`, nhánh `v` có một commit vật) và `L.chayS4(dir, agRoot = KIT, s4 = KIT/feature-loop/scripts/s4-args.mjs) → { rc, stderr, args }`. `MO_HINH` (Task 1) có ba tiêu chí: `S1` script (`paths`, `evidence_required`), `J1` judgment (`inputs` trỏ `README.md`, `paths`), `U1` ui-check (`steps`, `expected`, `paths`). Ma trận BC1: `for cach of CACH × for tc of MO_HINH × for k of truongCua(tc)` — `truongCua` = `EVAL_REQUIRED[executor].arr` (rút từ khối marker của `acceptance-verify.js` lúc chạy, như s4-args) ∪ ba trường danh sách mà tc khai; tc thiếu trường bắt buộc → «mô hình hụt trường: <executor>.<trường>». So `args.evals[tc].k` với mô hình (inputs so sau `path.relative(dir, x)`); đếm == kích thước ma trận, không thì «ma trận hụt»; stderr của ba cách KHÔNG chứa «danh sách không đọc được». BC2: chạy s4-args của base trên `thut4` (phải đúng mô hình — đối chứng dương) và trên `satle` (phải thiếu; in «base mất danh sách: <id>.<k>» cho ít nhất paths, inputs, evidence_required). CB1: bốn tiêu chí `X1 paths: *id001`, `X2 inputs: |` + dòng chữ, `X3 paths: {a: b}`, `X4 evidence_required:` trống → đúng một dòng stderr bắt đầu `s4-args: danh sách không đọc được:` chứa `X1.paths`, `X2.inputs`, `X3.paths`, `X4.evidence_required`; `args.canhBaoDanhSach.length === 4`. CB2: mô hình thut4 + một `paths: []` → 0 dòng, khoá vắng. CB3: bản sao lib (`dungBanSaoLibDotBien(s => s.replaceAll('canhBao.push(', 'void ('))`) → stderr không có dòng; ca in «cờ im: X1.paths».

- [ ] **Step 2: Chạy, xác nhận đỏ** (BC1 satle đỏ «thiếu», CB1 không có dòng).

- [ ] **Step 3: Sửa s4-args** — import thêm `evalListsOf, moTaCanhBao` từ evidence-core; kiểm `typeof evalListsOf !== 'function'` → `die('acceptance-gate quá cũ: lib/evidence-core.cjs không có evalListsOf (cần bản có hồ sơ evals-sat-le-doc-du) — cập nhật plugin')`. Thay trọn khối `{ // list fields … }` bằng:

```js
let canhBaoDanhSach = [];
{ // list fields — MỘT bộ đọc ở lib (evalListsOf, hồ sơ evals-sat-le-doc-du): sát lề, thụt, khối, một dòng, neo.
  // Danh sách không đọc được (bí danh, khối chữ, ánh xạ, khoá trống) lên MỘT dòng gọi tên — không im.
  const LIST_KEYS = uniq([...REQ_ARR, 'inputs', 'paths', 'evidence_required']);
  const { byId, canhBao } = evalListsOf(evalsText, LIST_KEYS);
  for (const e of evals) { const f = byId.get(e.id); if (f) for (const k of LIST_KEYS) if (Array.isArray(f[k])) e[k] = f[k].slice(); }
  const con = new Set(evals.map(e => e.id));
  canhBaoDanhSach = canhBao.filter(c => con.has(c.id)).map(moTaCanhBao);
  if (canhBaoDanhSach.length) console.error(`s4-args: danh sách không đọc được: ${canhBaoDanhSach.join(', ')}`);
}
```

Thêm `...(canhBaoDanhSach.length ? { canhBaoDanhSach } : {}),` cạnh `evalsNotRun` trong object `args`.

- [ ] **Step 4: Chạy, xác nhận xanh** — BC1, BC2, CB1–3 PASS; `node tests/scripts/s4-args-not-run.test.mjs`, `node tests/scripts/s4-args-expected-exit.test.mjs`, `node tests/scripts/s4-args-lenh-dai-chay-rieng.test.mjs` vẫn xanh.

- [ ] **Step 5: Commit** — `feat(evals-sat-le-doc-du): lượt chấm đọc danh sách qua lib, cờ có tên (AC-1, AC-2, AC-4)`.

Phục vụ: E1, E2, E5. independent: false.

### Task 3: Lượt sửa đọc vùng tệp qua lib (carry-plan)

**Files:** Modify `feature-loop/scripts/carry-plan.mjs` (danh sách hàm bắt buộc ~44; `parseEvals` ~100–117). Test: CP1–3, MN1 (carry), MN2 (carry).

- [ ] **Step 1: Ca đỏ** — gọi `plan({ runLogText, evalsText, contractText, deltaFiles, round: 2, agRoot })` (import động `carry-plan.mjs` của cây / của base). Fixture: ba tiêu chí script `A` (`paths: [src/a/**]`), `B` (khối thụt 4 `- src/a/**`), `C` (khối sát lề) + run-log round 1 cùng sha, exit 0. CP1: `deltaFiles=['docs/x.md']` → `carriedEvals` có A, B, C, lý do «paths không chạm diff-fix, round trước xanh». CP2: `deltaFiles=['src/a/b.js']` → `rerun` cả ba, «diff-fix chạm src/a/b.js». CP3: base → B, C «thiếu paths — luôn chạy lại», in «base bỏ paths khối».
- [ ] **Step 2: Chạy, đỏ** (B, C rerun ở cây).
- [ ] **Step 3: Sửa** — thêm `'evalListsOf'` vào mảng `for (const n of ['parseFlowValue', 'machineEvalIdsSkipped'])` (thông điệp hiện có gọi tên hàm thiếu). Trong `parseEvals(text, R)`: id `R.parseFlowValue(m[1]).value`; xoá nhánh `paths:`; sau vòng lặp:

```js
  // paths qua MỘT bộ đọc ở lib (hồ sơ evals-sat-le-doc-du): dạng khối được giữ-ô-xanh như dạng một dòng.
  const { byId } = R.evalListsOf(text, ['paths']);
  for (const e of evals) { const f = byId.get(e.id); if (f && Array.isArray(f.paths) && f.paths.length) e.paths = f.paths; }
```

- [ ] **Step 4: Chạy, xanh** — CP1–3; `node tests/scripts/carry-plan.test.mjs` (nếu có) + `bash tests/workflows/run-tests.sh` xanh.
- [ ] **Step 5: Ca MN1/MN2** — MN1: bản sao lib với `evalListsOf` trả `{byId:new Map(),canhBao:[]}` → s4-args trên mô hình thut4 mất `paths`, carry-plan cho A «thiếu paths». MN2: bản sao lib xoá `evalListsOf` khỏi exports → s4-args rc 2 stderr chứa `evalListsOf`, không có tệp args; carry-plan rc 2 chứa `evalListsOf`.
- [ ] **Step 6: Commit** — `feat(evals-sat-le-doc-du): lượt sửa đọc paths dạng khối qua lib (AC-6, AC-9)`.

Phục vụ: E7, E10. independent: false.

### Task 4: Cờ trên hai thẻ cổng (gate-card)

**Files:** Modify `scripts/gate-card.js` (hằng gần ~94; flags Cổng 1 ~888; flags Cổng 2 ~1298), `commands/acceptance-card.md` (một dòng thuật). Test: TH1–4.

- [ ] **Step 1: Ca đỏ** — dựng hồ sơ do mã sinh: contract `draft` (Cổng 1) và một bản có `evidence-report.md` PASS (Cổng 2, khuôn như `gate-card-thuoc-vat.test.mjs`), `evals.yaml` có `X1 paths: *id001`. Hằng rút từ nguồn: `SRC.match(/const DANH_SACH_KHONG_DOC_FLAG = '([^']+)';/)`. TH1: hai thẻ chứa hằng + `X1.paths`. TH2: hồ sơ sạch → hai thẻ không chứa hằng. TH3: `commands/acceptance-card.md` chứa hằng. TH4: bản sao `scripts/` + `lib/` (cpSync trọn) gỡ dòng `flags.push(['fwarn', esc(DANH_SACH_KHONG_DOC_FLAG` (kim khớp đúng hai lần) → thẻ không chứa hằng; in «thẻ im khi danh sách không đọc được».
- [ ] **Step 2: Chạy, đỏ.**
- [ ] **Step 3: Sửa** — hằng:

```js
// Cờ danh sách không đọc được (hồ sơ evals-sat-le-doc-du AC-8) — chữ thuật ở commands/acceptance-card.md.
const DANH_SACH_KHONG_DOC_FLAG = 'Tệp tiêu chí có danh sách máy không đọc được — lượt chấm sẽ thiếu đúng các trường này; viết lại thành danh sách rồi dựng thẻ lại:';
const dsKhongDoc = (() => { try { return typeof evidenceCore.danhSachKhongDoc === 'function' ? evidenceCore.danhSachKhongDoc(read(path.join(dir, 'evals.yaml'))) : []; } catch (_) { return []; } })();
```

Ở cả hai khối `flags` (Cổng 1 sau dòng `nen`; Cổng 2 sau dòng `thuocVat`): `if (dsKhongDoc.length) flags.push(['fwarn', esc(DANH_SACH_KHONG_DOC_FLAG + ' ' + dsKhongDoc.join(', '))]);`. `commands/acceptance-card.md`, dưới đoạn ba cờ 2.16, thêm: «Từ hồ sơ evals-sat-le-doc-du thêm một cờ, mã thoát 0: - `<hằng>` → cờ vàng trên thẻ Cổng Phạm vi và Cổng Bằng chứng: tệp tiêu chí có trường danh sách viết kiểu máy không đọc được (bí danh YAML, khối chữ, ánh xạ, khoá trống); lượt chấm sẽ thiếu đúng các trường được gọi tên; việc kế là viết lại các trường ấy thành danh sách rồi dựng thẻ lại.»
- [ ] **Step 4: Chạy, xanh** — TH1–4; `bash tests/scripts/run-tests.sh --manh bash` (khối GM/thẻ) xanh.
- [ ] **Step 5: Commit** — `feat(evals-sat-le-doc-du): cờ danh sách không đọc được trên hai thẻ cổng (AC-8)`.

Phục vụ: E9. independent: false (cùng tệp ca).

### Task 5: Nhãn bộ chấm mẫu (acceptance-gold)

**Files:** Modify `scripts/acceptance-gold.mjs:148`. Test GD1–2.

- [ ] **Step 1: Ca đỏ** — xuất `glossOf`? Không có export → chạy CLI theo cách các ca gold hiện có gọi nó (tra `tests/` cho `acceptance-gold`), hoặc nạp nguồn và rút hàm `glossOf` bằng mốc `function glossOf(` → `\n}\n` rồi `new Function` (cùng kỹ thuật `docDanhSachS4`). GD1: hồ sơ sát lề, `J1 question: "Câu hỏi có nháy đủ dài để khớp"` → nhãn là câu hỏi; cùng mô hình thut4 → cùng nhãn; tiêu chí sát lề không `question`/`expected` → nhãn = rationale. GD2: `glossOf` của base trên sát lề → rationale; in «gold mất câu hỏi sát lề».
- [ ] **Step 2: Chạy, đỏ.**
- [ ] **Step 3: Sửa** — `const b = y.split(/\n(?=[ \t]*-\s+id:)/).find(…)` (giữ nguyên phần còn lại).
- [ ] **Step 4: Chạy, xanh.**
- [ ] **Step 5: Commit** — `fix(evals-sat-le-doc-du): nhãn bộ chấm mẫu tìm được tiêu chí sát lề (AC-7)`.

Phục vụ: E8. independent: false.

### Task 6: Lưới bên đọc (đóng lớp)

**Files:** Test `tests/scripts/evals-sat-le.test.mjs` (LB1–2).

- [ ] **Step 1: Ca** — `git -C KIT grep -l 'evals\.yaml' -- lib scripts feature-loop hooks` (bỏ `*.md`, `tests/`). Bảng viết trước `BEN_DOC = { 'feature-loop/scripts/s4-args.mjs': 'danh-sach', 'feature-loop/scripts/carry-plan.mjs': 'danh-sach', 'feature-loop/scripts/repin-lane.mjs': 'danh-sach', 'lib/evidence-core.cjs': 'danh-sach', 'scripts/acceptance-gold.mjs': 'truong-don', 'scripts/gate-card.js': 'danh-sach', … }` — mọi tệp grep ra hôm nay (Task 6 Step 0 chạy grep, chép kết quả vào bảng, mỗi tệp một kết luận: `danh-sach` · `truong-don` · `khong-doc`). LB1: mọi tệp grep có trong bảng; tệp `danh-sach` chứa `evalListsOf` hoặc `evalPathsOf`; cây không báo dòng nào. LB2: bản sao `git archive HEAD lib scripts feature-loop hooks` + một tệp `scripts/doc-rieng.mjs` đọc `evals.yaml` bằng biểu thức riêng → «bên đọc chưa phân loại: scripts/doc-rieng.mjs».
- [ ] **Step 2: Chạy, xanh; phá thử bảng (xoá một dòng) → đỏ đúng thông điệp, rồi hoàn lại.**
- [ ] **Step 3: Commit** — `test(evals-sat-le-doc-du): lưới phân loại mọi bên đọc evals.yaml (AC-11)`.

Phục vụ: E11. independent: false.

### Task 7: Vi phân bảy kho (CLI + bằng chứng)

**Files:** Create `tests/scripts/evals-sat-le-vi-phan.mjs` (CLI dùng `viPhan` của Task 1). Output `_acceptance/evals-sat-le-doc-du/evidence/vi-phan-bay-kho.txt` (sinh ở S4, không commit ở S3).

- [ ] **Step 1: Viết CLI** — cờ `--bay-kho` (kho = `$HOME/dev/{crm,oneflow,artifact-platform,radar,media-library,map}` + KIT), `--ghi <tệp>`. Thiếu kho → stderr «không đọc được ở đây: <kho>», exit 2. In mỗi kho: `<tên> sha=<git rev-parse HEAD> ho_so=<n> tieu_chi=<m>`; tổng `< 620` → exit 1 «tổng hồ sơ <n> < 620»; lệch ngoài sát lề hoặc chiều ≠ `doc-them` → exit 1 gọi tên; crm `thuoc-mot-cho-khai-quet-man` không có trong danh sách đọc-thêm → exit 1. Ghi trọn đầu ra vào `--ghi`.
- [ ] **Step 2: Chạy thử** `node tests/scripts/evals-sat-le-vi-phan.mjs --bay-kho --ghi /tmp/…` → exit 0 trên máy này; phá thử: `HOME=/khong-co` → exit 2 «không đọc được ở đây».
- [ ] **Step 3: Commit** — `test(evals-sat-le-doc-du): vi phân bảy kho (AC-3)`.

Phục vụ: E4. independent: false.

### Task 8: Lời cho người viết eval + CHANGELOG

**Files:** Modify `skills/acceptance/references/eval-executors.md` (cuối mục «evals.yaml shape»), `CHANGELOG.md` (đầu «Chưa phát hành»).

- [ ] **Step 1:** eval-executors.md thêm đoạn: kit đọc trường danh sách (`inputs`, `paths`, `evidence_required`, `steps`) viết sát lề (`- id:` cột 0, mục cùng cột khoá) lẫn thụt, dạng khối lẫn `[a, b]`; neo `&ten` được đọc; bí danh `*ten`, khối chữ `|`/`>`, ánh xạ `{…}` và khoá trống trên trường danh sách KHÔNG được đọc — lượt chấm in dòng «danh sách không đọc được», thẻ hai cổng lên cờ vàng; viết lại thành danh sách. Kho đang viết thụt 4 không phải làm gì.
- [ ] **Step 2:** CHANGELOG mục `### Tệp tiêu chí viết sát lề được đọc đủ (hồ sơ evals-sat-le-doc-du, T3)` — Gốc crm `dieu-phoi-va-bien` 07/10; đổi gì (một bộ đọc; cờ); ai bị ảnh hưởng (crm: lượt sửa nay giữ ô xanh cho `paths` dạng khối — 393 khai; hồ sơ do bộ xuất YAML sinh có bí danh sẽ thấy cờ); làm gì khi nâng: không gì.
- [ ] **Step 3: Commit** — `docs(evals-sat-le-doc-du): người viết eval biết kit đọc sát lề + cờ bí danh (AC-10)`.

Phục vụ: J1. independent: false.

### Task 9: Kết S3

- [ ] `bash tests/scripts/run-tests.sh`, `bash tests/workflows/run-tests.sh`, `bash tests/plugins/run-tests.sh`, `node scripts/product-map.mjs --root . --check` — xanh.
- [ ] Contract `status: implemented`; commit; vào S4.
