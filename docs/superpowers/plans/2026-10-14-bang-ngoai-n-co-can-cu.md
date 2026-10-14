# Bảng Ngoài-n có cột «Căn cứ» — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (vòng T3, thực thi inline trong phiên
> feature-loop sau Gate 1.5). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thẻ Cổng 2 in mục ngoài hợp đồng thành bảng Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ; trường `can_cu`
đi trọn đường từ tác tử phân loại tới thẻ, kể cả mục mang sang.

**Architecture:** Một trường mới `can_cu` thêm vào CÙNG các chỗ `plain` đang đi (khuôn `OOC-ITEM-TEMPLATE`,
`TRIAGE_SCHEMA`, `triagedRaw`, `FINDING-LINE`, `carry-plan.mjs`, `dungMucCarry`, bộ đọc `lib/out-of-contract.cjs`).
`scripts/gate-card.js` thay vòng khối `.item` của mục Ngoài-n bằng một `<table>` xếp ba nhóm; câu gộp ký không đổi.

**Tech Stack:** Node (CommonJS + ESM), harness workflow `tests/workflows/harness.mjs`, Python Playwright cho răng màn hẹp.

**Spec:** `docs/superpowers/specs/2026-10-14-bang-ngoai-n-co-can-cu-design.md` · hợp đồng
`_acceptance/bang-ngoai-n-co-can-cu/contract.md` · evals `_acceptance/bang-ngoai-n-co-can-cu/evals.yaml`.

## Global Constraints

- Base đo chiều đỏ: `6ed3e410` (`git archive 6ed3e410 scripts lib feature-loop` vào thư mục tạm).
- Nhãn `Ngoài-<n>` = vị trí mục trong tệp — KHÔNG đánh số lại theo thứ tự hiển thị.
- Câu gộp ký (`oneShotG2`), `routingHoi`/`routingBao`, `--extract` KHÔNG đổi byte nào trên cùng hồ sơ.
- Chữ câu đề xuất trong bảng giữ NGUYÊN chuỗi `rec` / «Máy đã định tuyến: …» hôm nay (ca lmcms, NT ghim chúng).
- Ba nhãn lựa chọn giữ nguyên văn: «ghi Known limits» · «mở hợp đồng mới» · «nâng phạm vi sửa ngay».
- Ô căn cứ vắng: chữ «chưa có căn cứ»; cờ vàng: «<k>/<n> mục chưa có căn cứ — hồ sơ chấm bằng bản kit trước khi có
  trường này; lý do của đề xuất nằm trong review-findings.md nếu có».
- Tiêu đề ba nhóm: «Cần anh quyết» · «Máy khuyên — chỉ đổi khi anh nghĩ khác» · «Máy đã định tuyến».
- Màn hẹp: `@media (max-width:560px)`.
- Ca đo: mỗi ca đỏ chạy trên bản sao bị tiêm SAU khi bản lành xanh trên CÙNG fixture; nhát tiêm phải khớp đúng một lần
  (kiểm trước khi tin); ghim thông điệp. Đường dẫn suy từ vị trí tệp ca. Fixture mục điền từ khuôn rút ở writer.
- Văn hồ sơ không dán cụm sao dạng đường dẫn hay chữ in đậm (`**`) — P161 quét corpus.
- Sửa `lib/`, `scripts/`, `feature-loop/` là xong; không còn bản sao nào phải đồng bộ.

## Review Focus

1. Mục có `|` hay `<` trong câu căn cứ — thẻ phải thoát HTML (`esc`), bảng không vỡ. → BN-3 dùng căn cứ có `<b>` và `|`.
2. Hồ sơ có `## Ngoài hợp đồng` nhưng 0 mục (lời khai rỗng) — không in bảng rỗng, không cờ căn cứ. → BN-5 vế «rỗng».
3. Mục mang nhãn lượt `(r1 · tệp đã đổi)` — nhãn lượt vẫn hiện ở ô Mục hoặc ô người dùng gặp gì như hôm nay (tiêu đề
   không lên thẻ, nhưng đếm thiếu căn cứ phải tính mục mang sang). → BN-5 vế mang sang.
4. Kho bật luật sản phẩm (`luatG2.nhanNgoai`) — nhãn luật vẫn dính sau câu người dùng gặp gì. → giữ đúng biểu thức cũ trong ô.
5. Thẻ KHÔNG ký được (REJECT/BLOCKED) có mục Ngoài-n — bảng vẫn hiện làm sử liệu, không cờ mới. → BN-3 vế REJECT.

---

### Task 1: Trường `can_cu` đi trọn đường (khuôn · phân loại · sổ · tổng hợp · mang sang · bộ đọc)

Phục vụ E1, E2, E7 · `independent: false` (Task 2 đọc `can_cu` từ bộ đọc).

**Files:**
- Modify: `lib/out-of-contract.cjs` (khởi tạo `cur`, biểu thức khoá, nhánh gán)
- Modify: `feature-loop/workflows/acceptance-verify.js` (`OOC_ITEM_TEMPLATE`, `dungMucCarry`, `TRIAGE_SCHEMA`,
  `triagePrompt` + khối `CAN-CU-CHI-DAN`, `triagedRaw`, `FINDING-LINE`, dòng carry `findingLine(...)`, chỉ dẫn synthesize)
- Modify: `feature-loop/scripts/carry-plan.mjs` (map `carriedFindings`)
- Modify: `tests/plugins/run-tests.sh` (P55: `SAMPLE.can_cu` + vòng so trường)
- Create: `tests/scripts/bang-ngoai-n.test.mjs` (BN-1, BN-1-cu, BN-1-do, BN-2, BN-2-rong, BN-2-do)

**Interfaces:**
- Produces: `parse(text).findings[i].can_cu: string` (mặc định `''`); dòng run-log `kind:'finding'` có khoá
  `can_cu`; `carriedFindings[i].can_cu`; khuôn có dòng `  Căn cứ: {can_cu}`.

- [ ] **Step 1: Viết khung tệp ca + BN-1 (đỏ trước)**

```js
#!/usr/bin/env node
// Ca vĩnh viễn hồ sơ bang-ngoai-n-co-can-cu. Tên ca = mã BN-… trong evals.yaml. Chạy: node tests/scripts/bang-ngoai-n.test.mjs
// Một nhóm: BN_CASES=BN-1,BN-2 node tests/scripts/bang-ngoai-n.test.mjs (khớp 0 ca → thoát 1).
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const BASE = '6ed3e410';
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const WF_SRC = fs.readFileSync(WF, 'utf8');
const req = createRequire(import.meta.url);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'bn-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch {} });
// Bản base: git archive trọn thư mục (không danh sách tệp tay).
const BASE_DIR = (() => { const d = path.join(TMP, 'base'); fs.mkdirSync(d);
  execFileSync('bash', ['-c', `git -C "${ROOT}" archive ${BASE} scripts lib feature-loop skills commands | tar -x -C "${d}"`]); return d; })();
const tiem = (src, tu, sang, ten) => { const n = src.split(tu).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm «${ten}» khớp ${n} lần (phải đúng 1)`); return src.split(tu).join(sang); };
const khuonTu = src => { const m = src.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('không rút được OOC-ITEM-TEMPLATE'); return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`'); };
const dien = (tpl, v) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in v ? v[k] : ''));
const HEAD = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n';
const MAU = { title: 'globToRe bo sot dau hoi', plain: 'Bấm Cập nhật có thể làm mất tiện ích đang cài.',
  can_cu: 'Mất cấu hình nhưng cài lại là có; người dùng tự gỡ được.', file: 'src/x.ts:10', severity: 'high', proposal: 'known-limits' };
const CASES = []; const test = (id, fn) => CASES.push({ id, fn });
// ... các ca BN-… dưới đây ...
const chon = (process.env.BN_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chay = chon.length ? CASES.filter(c => chon.includes(c.id)) : CASES;
if (!chay.length) { console.log('FAIL: không khớp ca nào'); process.exit(1); }
let hong = 0;
for (const c of chay) { try { await c.fn(); console.log(`PASS: ${c.id}`); } catch (e) { hong++; console.log(`FAIL: ${c.id} — ${e.message}`); } }
console.log(`BN Results: ${chay.length - hong} PASS · ${hong} FAIL`); process.exit(hong ? 1 : 0);
```

BN-1: rút khuôn từ `WF_SRC`, điền `MAU`, `require(lib/out-of-contract.cjs).parse(HEAD + doc)`; so sáu trường, lệch → ném
«trường <k> lệch». BN-1-cu: `require(BASE_DIR/lib/out-of-contract.cjs)` đọc CÙNG tài liệu và tài liệu đã gỡ dòng
`Căn cứ:` → năm trường cũ và `mucChuaDinhTuyen(doc, '')` bằng nhau, lệch → «bộ đọc cũ hỏng trên khuôn mới». BN-1-do:
(a) bản sao bộ đọc (ghi tệp tạm cạnh `md-section.cjs` nếu cần) với nhát tiêm gỡ `|Căn cứ` khỏi biểu thức khoá → `can_cu`
rỗng → ca ghi «do OK: bộ đọc bỏ Căn cứ», không rỗng → ném; (b) khuôn với dòng `  Căn cứ: {can_cu}\n` bị gỡ → `can_cu`
rỗng → «do OK: khuôn thiếu Căn cứ».

- [ ] **Step 2: Chạy, thấy BN-1 đỏ**

Run: `BN_CASES=BN-1 node tests/scripts/bang-ngoai-n.test.mjs`
Expected: `FAIL: BN-1 — trường can_cu lệch` (khuôn chưa có dòng).

- [ ] **Step 3: Sửa bộ đọc + khuôn**

`lib/out-of-contract.cjs`:
```js
cur = { title: tieuDeMuc(title), file: '', severity: '', proposal: '', proposal_raw: '', plain: '', can_cu: '' };
// …
const kv = /^\s+(file|severity|Đề xuất|proposal|Người dùng thấy gì|Căn cứ)\s*:\s*(.+?)\s*$/.exec(raw);
// …
else if (k === 'Người dùng thấy gì') cur.plain = v;
else if (k === 'Căn cứ') cur.can_cu = v;
```
Cập nhật chú thích kiểu trả về `{title,file,severity,proposal,plain,can_cu}`.

`acceptance-verify.js`:
```js
const OOC_ITEM_TEMPLATE = `<<<OOC-ITEM-TEMPLATE\n- **{title}**\n  Người dùng thấy gì: {plain}\n  Căn cứ: {can_cu}\n  file: \`{file}\`\n  severity: {severity}\n  Đề xuất: {proposal}\nOOC-ITEM-TEMPLATE>>>`
// dungMucCarry:
const v = { title: …, plain: c.plain || '', can_cu: c.can_cu || '', file: …, severity: …, proposal: … }
```

- [ ] **Step 4: Thêm BN-2 (harness) rồi chạy đỏ**

Kịch bản: `argsGoc` như `tests/workflows/luot-sua-giu-du.test.mjs` (round 1, không carry); `respond` trả
`review:*` → `{ findings: [{ title:'t1', file:'src/a.ts', line:3, severity:'medium', detail:'d', source:'bugs' }] }`
(lấy đúng hình finding mà workflow nhận — đọc lại REVIEW schema trong workflow khi viết), `triage*` → trả mục
`{ tid:<tid nhận trong prompt>, title, file, inContract:false, acRef:'', rationale:'r', plain:'P', proposal:'known-limits', can_cu:CC }`
(tid rút từ JSON trong `call.prompt`), `synthesize:report` → `{ report:'# r', findings:'# f\n' }`. Kiểm:
(i) `calls.find(triage).opts.schema` có `can_cu` trong `required` của mục; (ii) `result.runLog` dòng `kind:'finding'`
có `can_cu===CC`; (iii) ghi run-log vào kho tạm, chạy `carry-plan.mjs --run-log … --round 2 --ag-root ROOT --no-delta`
(cùng cờ như luot-sua-giu-du) → `carriedFindings[0].can_cu===CC`; (iv) `runWorkflow` lượt 2 `{round:2, carriedFindings}`,
tổng hợp trả findings không có mục → `parse(result.findings)` có mục `t1 (r1)` với `can_cu===CC`; (v) prompt của
`synthesize:report` lượt 1 chứa `CC` và chứa `Căn cứ: {can_cu}`. BN-2-rong: lượt 2 với `carriedFindings` mục không
có `can_cu` (đối chứng dương: cùng mục có `can_cu` xanh trước) → `can_cu===''`, `file/severity/proposal/plain` bằng mẫu.
BN-2-do: `srcOverride` ba bản — gỡ `can_cu` khỏi `FINDING-LINE` («sổ finding mất căn cứ»), gỡ `can_cu` khỏi
`triagedRaw` («tổng hợp không thấy căn cứ»); bản sao `carry-plan.mjs` trong thư mục tạm (cùng cây `feature-loop/scripts`
chép trọn) gỡ `can_cu` khỏi map («mang sang mất căn cứ»).

Run: `BN_CASES=BN-2 node tests/scripts/bang-ngoai-n.test.mjs` → Expected: FAIL (schema thiếu `can_cu`).

- [ ] **Step 5: Sửa workflow + carry-plan**

`TRIAGE_SCHEMA` thêm thuộc tính và `required`:
```js
can_cu: { type: 'string', description: 'CHI khi inContract=false: MOT cau ngon ngu san pham — vi sao de xuat nay (xem khoi CAN-CU-CHI-DAN trong prompt); chuoi rong khi inContract=true' },
// required: [..., 'plain', 'can_cu', TRIAGE_ID_FIELD]
```
Khối chỉ dẫn (một nguồn, judge E7 đọc đúng khối này), chèn vào `triagePrompt` ngay sau dòng `plain`:
```js
// <<<CAN-CU-CHI-DAN
const CAN_CU_CHI_DAN = `- inContract=false: BAT BUOC viet them can_cu = MOT cau ngon ngu san pham noi VI SAO de xuat do: hau qua nang hay nhe voi nguoi dung, co mat hay lo du lieu khong, nguoi dung tu go duoc khong (tai lai, thu lai), sua sau re hay dat. Day la cot «Can cu» tren the Cong 2 — nguoi ky doc no de dong y hay dao de xuat ma khong mo tep nao. Cam ten ham, duong dan file, ma thoat, tu ngu regex/schema. Khong de xuat cach sua, khong doc code.\n`
// CAN-CU-CHI-DAN>>>
```
`triagedRaw`: `can_cu: (ok && t.inContract !== true && t.can_cu) ? t.can_cu : null,`
`FINDING-LINE`: thêm `can_cu: f.can_cu || '',` sau `plain`. Dòng carry: `plain: c.plain, can_cu: c.can_cu, proposal: …`.
Chỉ dẫn synthesize: sau câu «{plain} chep NGUYEN VAN truong plain…» thêm «{can_cu} chep NGUYEN VAN truong can_cu (rong
thi de trong sau dau hai cham)».
`carry-plan.mjs`: `.map(l => ({ …, plain: l.plain || '', can_cu: l.can_cu || '', proposal: … }))`.
P55 (`tests/plugins/run-tests.sh`): thêm `can_cu: 'Tải lại là có, không mất dữ liệu.'` vào `SAMPLE` và `'can_cu'` vào
vòng so trường.

- [ ] **Step 6: Chạy xanh**

Run: `BN_CASES=BN-1,BN-1-cu,BN-1-do,BN-2,BN-2-rong,BN-2-do node tests/scripts/bang-ngoai-n.test.mjs` → 6 PASS.
Run: `bash tests/workflows/run-tests.sh` → toàn bộ PASS (luot-sua-giu-du, doc-ghi-troi rút cùng khuôn).

- [ ] **Step 7: Commit** — `feat(bang-ngoai-n-co-can-cu): trường can_cu đi trọn đường triage → thẻ (BN-1, BN-2)`.

### Task 2: Bảng trên thẻ Cổng 2 + đọc-cũ

Phục vụ E3, E4, E5 · `independent: false`.

**Files:**
- Modify: `scripts/gate-card.js` (khối «Ngoài hợp đồng — bạn quyết» quanh dòng 1320–1360; CSS ~dòng 492)
- Test: `tests/scripts/bang-ngoai-n.test.mjs` (BN-3, BN-3-do, BN-4, BN-4-do, BN-5, BN-5-cu)

**Interfaces:**
- Consumes: `ooc.findings[i].can_cu` (Task 1), `dtmMay(fi)`, `outOfContract.OOC_GLOSS_NGUOI`, `esc`.
- Produces: HTML `<table class="ngoai">` với `<th>` bốn cột, mỗi `<td data-cot="<tiêu đề cột>">`, hàng nhóm
  `<tr class="nhom"><td colspan="4">…</td></tr>`, dòng `<p class="ai">Mỗi mục: …</p>`, cờ vàng thiếu căn cứ.

- [ ] **Step 1: Viết BN-3/BN-4/BN-5 (đỏ trước)**

Kho thử: `_acceptance/config.yaml` tối thiểu + hồ sơ `demo` (contract `status: verified`, evidence-report PASS — chép
hình fixture của `tests/plugins/fixtures/render-out-of-contract-block.sh`), `review-findings.md` = `HEAD + dien(khuon, …)`
cho mỗi mục. Dựng thẻ: `spawnSync(node, [gate-card.js, '--root', kho, '--slug', 'demo'])` cho cây và cho
`BASE_DIR/scripts/gate-card.js`. Tách khối: từ `Ngoài hợp đồng — bạn quyết` tới `<div class="lab">` kế. Đọc bảng bằng
regex trên `<tr>`/`<td data-cot="…">`. BN-3: ba mục (new-contract, known-limits, wont-fix; căn cứ mục 1 chứa `<b>` và
`|`), so `th` = bốn chữ, mỗi hàng ô thứ i = trường thứ i (ô đề xuất so với chuỗi `rec` lấy từ thẻ base cùng mục), `data-cot`
= `th[i]`, ba nhãn (rút bằng sed P52 từ `commands/acceptance-card.md`) đếm đúng 1, không có «globToRe»/«src/x.ts»; vế
REJECT: evidence verdict REJECT → bảng vẫn có, không cờ thiếu căn cứ. BN-3-do: base → không `<table` («base không
bảng»); bản sao cây tráo hai `<td>` cuối («ô lệch cột»). BN-4: ma trận ba hồ sơ A/B/C (design §3.2; B bật
`feature_loop.ngoai_n_tu_dinh_tuyen: true` trong config, hồ sơ T2 PASS 0 UNCERTAIN, chạy
`node scripts/dinh-tuyen-may.cjs --write --root kho --slug B` của cây trước khi dựng thẻ), so thứ tự nhãn hàng với bảng
viết sẵn, đếm hàng nhóm, in `so o: <n>` = tổng phần tử; câu gộp: `--extract` của cây và base → `one_shot` bằng nhau.
BN-4-do: bản sao bỏ bước xếp → A ra thứ tự tệp. BN-5: ba bản (khuôn base không dòng Căn cứ · thiếu một · đủ) +
vế `## Ngoài hợp đồng` rỗng; cờ «3/3» · «1/3» · không cờ · không bảng/không cờ; tập cờ (`class="flag …">…`) trừ cờ căn
cứ = tập cờ thẻ base. BN-5-cu: `carry-plan.mjs` trên run-log có dòng finding thiếu `can_cu` → exit 0, `can_cu===''`.

Run: `BN_CASES=BN-3,BN-4,BN-5 node tests/scripts/bang-ngoai-n.test.mjs` → FAIL (chưa có bảng).

- [ ] **Step 2: Dựng bảng trong `gate-card.js`**

Thay vòng `ooc.findings.forEach(...)` in `.item` bằng:
```js
const COT = ['Mục', 'Người dùng gặp gì', 'Máy đề xuất', 'Căn cứ'];
const NHOM = ['Cần anh quyết', 'Máy khuyên — chỉ đổi khi anh nghĩ khác', 'Máy đã định tuyến'];
const nhomCua = (f, fi) => dtmMay(fi) ? 2 : (f.proposal === 'known-limits' || f.proposal === 'wont-fix') ? 1 : 0;
const hang = ooc.findings.map((f, fi) => ({ f, fi, g: nhomCua(f, fi) }));
// <<<XEP-NHOM — thứ tự hiển thị; nhãn vẫn theo fi (vị trí tệp)
hang.sort((a, b) => a.g - b.g || a.fi - b.fi);
// XEP-NHOM>>>
const nhomCo = new Set(hang.map(h => h.g));
let truoc = -1; const tr = [];
for (const { f, fi, g } of hang) {
  if (nhomCo.size > 1 && g !== truoc) tr.push(`<tr class="nhom"><td colspan="4">${esc(NHOM[g])}</td></tr>`);
  truoc = g;
  const o = [`Ngoài-${fi + 1}`, esc(q(f)) + nhanLuat(f), aiCua(f, fi), f.can_cu ? esc(f.can_cu) : '<span class="mo">chưa có căn cứ</span>'];
  tr.push(`<tr>${o.map((x, i) => `<td data-cot="${COT[i]}">${x}</td>`).join('')}</tr>`);
}
P.push(`<table class="ngoai"><thead><tr>${COT.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${tr.join('')}</tbody></table>`);
P.push(`<p class="ai">Mỗi mục: ghi Known limits · mở hợp đồng mới · nâng phạm vi sửa ngay — đổi bằng dòng lệnh ký.</p>`);
const thieu = ooc.findings.filter(f => !f.can_cu).length;
if (thieu) P.push(`<div class="flag fwarn">${thieu}/${ooc.findings.length} mục chưa có căn cứ — hồ sơ chấm bằng bản kit trước khi có trường này; lý do của đề xuất nằm trong review-findings.md nếu có</div>`);
```
`q(f)`, `nhanLuat(f)`, `aiCua(f, fi)` là ba biểu thức hiện có (câu `plain`/thay thế, `luatG2.nhanNgoai`, chuỗi `rec`
hoặc «Máy đã định tuyến: … — đảo: <code>…</code>») tách thành hàm, KHÔNG đổi chữ. Ô Mục giữ nhãn lượt nếu tiêu đề có
`(rN…)`: `Ngoài-${fi+1}` + ` (r1)` lấy từ đuôi tiêu đề bằng `OOC_TITLE_RE` nhóm 2 — tiêu đề kỹ thuật KHÔNG lên thẻ.

CSS (trong khối `<style>`):
```css
.gc table.ngoai{width:100%;border-collapse:collapse;font-size:13px;margin:4px 0 8px;table-layout:fixed}
.gc .ngoai th{text-align:left;font-size:11px;color:#8a887f;font-weight:600;padding:6px 8px;border-bottom:1px solid #e6e4de}
.gc .ngoai td{padding:8px;vertical-align:top;border-bottom:1px solid #efede7;color:#412402;overflow-wrap:anywhere}
.gc .ngoai th:first-child,.gc .ngoai td:first-child{width:84px;white-space:nowrap}
.gc .ngoai tr.nhom td{background:#FAEEDA;font-weight:600;color:#633806}
.gc .ngoai .mo{color:#9a988f}
@media (max-width:560px){.gc table.ngoai,.gc .ngoai tbody,.gc .ngoai tr,.gc .ngoai td{display:block;width:auto}
.gc .ngoai thead{display:none}.gc .ngoai tr{border:1px solid #e6e4de;border-radius:9px;margin-bottom:8px}
.gc .ngoai td:before{content:attr(data-cot);display:block;font-size:11px;color:#8a887f;font-weight:600}
.gc .ngoai td:first-child{white-space:normal}}
```

- [ ] **Step 3: Chạy xanh** — `BN_CASES=BN-3,BN-3-do,BN-4,BN-4-do,BN-5,BN-5-cu node tests/scripts/bang-ngoai-n.test.mjs` → 6 PASS.
- [ ] **Step 4: Commit** — `feat(bang-ngoai-n-co-can-cu): thẻ Cổng 2 in Ngoài-n thành bảng ba nhóm + đọc-cũ (BN-3…5)`.

### Task 3: Răng màn hẹp + khoá executor

Phục vụ E6 (và đăng ký E1–E5) · `independent: false` (đọc CSS Task 2).

**Files:**
- Create: `_acceptance/bang-ngoai-n-co-can-cu/rang/man-hep.py`
- Modify: `_acceptance/config.yaml` (`executors.test.bang_ngoai_n`, `executors.script.bang_ngoai_n_man_hep`)

- [ ] **Step 1: Viết răng**

Python: `ROOT` suy từ `__file__` (ba cấp lên). Thiếu `playwright` → in «không đọc được ở đây: playwright», `sys.exit(2)`.
Sinh kho tạm (config + hồ sơ verified PASS + `review-findings.md` mười mục, căn cứ ~120 ký tự), chạy
`node scripts/gate-card.js` của cây, bọc `<!doctype html><meta charset="utf-8"><meta name="viewport"
content="width=device-width"><body style="margin:0;padding:16px">`. Playwright chromium: 320×800 → đo
`document.documentElement.scrollWidth <= clientWidth` và với mỗi `tbody tr:not(.nhom)` top bốn ô tăng dần → in
`man-hep 320: cuon-ngang=0 xep-chong=10/10`; 1280×800 → bốn ô cùng top → `man-hep 1280: cung-dong=10/10`. Bản sao cây
(`git archive HEAD scripts lib` vào thư mục tạm) gỡ khối `@media (max-width:560px){…}` (nhát tiêm khớp đúng 1) → ở 320
`scrollWidth > clientWidth` → in `do OK: cuon ngang o 320`; không đỏ → exit 1 «chiều đỏ không đỏ». Bất kỳ đo sai → exit 1.

- [ ] **Step 2: Khoá executor**

```yaml
    # Hồ sơ bang-ngoai-n-co-can-cu: ca BN-1..BN-5 (bảng Ngoài-n có căn cứ). Tên ca = mã trong evals.yaml.
    bang_ngoai_n: "node tests/scripts/bang-ngoai-n.test.mjs"
```
(dưới `executors.test`) và dưới `executors.script`:
```yaml
    # Răng màn hẹp của bang-ngoai-n-co-can-cu — cần Python Playwright; KHÔNG vào feature_loop.suite_keys.
    bang_ngoai_n_man_hep: "python3 _acceptance/bang-ngoai-n-co-can-cu/rang/man-hep.py"
```

- [ ] **Step 3: Chạy** — `python3 _acceptance/bang-ngoai-n-co-can-cu/rang/man-hep.py` → ba dòng kỳ vọng, exit 0.
- [ ] **Step 4: Commit** — `test(bang-ngoai-n-co-can-cu): răng màn hẹp 320/1280 + khoá executor (E6)`.

### Task 4: Đồng bộ ca cũ, tệp mẫu P53, tài liệu

Phục vụ E8 + giữ suite xanh · `independent: false`.

**Files:**
- Modify: `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md` (sinh lại bằng script sinh P53)
- Modify (nếu đỏ): ca ghim bố cục cũ trong `tests/plugins/run-tests.sh` (P52/P53b/P201), `tests/scripts/gate-card-lmcms.test.mjs`,
  `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs` — chỉ sửa chỗ ghim `.item`, không hạ thước
- Modify: `CHANGELOG.md` (mục «Chưa phát hành»), `commands/acceptance-card.md` (đoạn khối «Ngoài hợp đồng»)

- [ ] **Step 1: Sinh lại tệp mẫu P53**
```bash
F=_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md
{ head -6 "$F"; bash tests/plugins/fixtures/render-out-of-contract-block.sh; } > /tmp/p53 && mv /tmp/p53 "$F"
```
Đọc diff: chỉ khối render đổi, sáu dòng đầu giữ nguyên.

- [ ] **Step 2: Chạy suite plugins + scripts + workflows; sửa ca ghim bố cục cũ** — mỗi ca sửa phải vẫn có chiều đỏ
(đọc lại nhát tiêm của ca). P52: ba nhãn nay ở dòng «Mỗi mục: …» — ca grep vẫn khớp, không sửa.

- [ ] **Step 3: Tài liệu** — CHANGELOG «Chưa phát hành» một mục: bảng bốn cột, căn cứ do bước phân loại viết và đi theo
mục mang sang, ba nhóm, đọc-cũ «chưa có căn cứ» + cờ vàng, câu ký và ba lựa chọn không đổi, kho chỉ cần nhận mốc (lớp CI
vendored chép lại `lib/out-of-contract.cjs` theo mốc như mọi lần). `commands/acceptance-card.md`: đoạn khối «Ngoài hợp
đồng» thêm câu tả bảng + cột Căn cứ + cờ vàng, GIỮ nguyên dòng ba nhãn (a)(b)(c) (P52 rút bằng sed).

- [ ] **Step 4: Vẽ lại bản đồ + commit** — `node scripts/product-map.mjs --root .` rồi commit
`docs+test(bang-ngoai-n-co-can-cu): tệp mẫu P53, ca cũ theo bảng, CHANGELOG, chỉ dẫn thẻ (E8)`.

## Kết S3

Contract `status: implemented`; gộp `origin/main` mới (DP11 #345 chạm `lib/out-of-contract.cjs`), giải xung đột,
chạy lại BN; xin lượt S4 ở Điều phối M5; sinh args `s4-args.mjs --ag-root . --diff-base $(git merge-base HEAD origin/main)`.
