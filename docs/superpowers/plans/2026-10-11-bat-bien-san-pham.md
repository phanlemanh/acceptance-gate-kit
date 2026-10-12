# Luật sản phẩm của kho — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kho khai luật sản phẩm trong `PRODUCT-INVARIANTS.md`; bước thiết kế nạp nó; thẻ Cổng Phạm vi hỏi «Phạm luật SP-n»; thẻ Cổng Bằng chứng gọi tên luật bị chạm trên diff — kho không có tệp thì không đổi byte nào.

**Architecture:** Một mô-đun mới `scripts/luat-san-pham.cjs` (bộ đọc tệp luật · băm phiên bản · bộ soi diff ghi `luat-cham.json` · lệnh đếm). Bộ xếp lớp căn cứ của A2 (`scripts/can-cu-s1.cjs`) thêm ba luật đỏ cho khoá `pham_luat`. Thẻ (`scripts/gate-card.js`) và vị từ «còn cần người» (`scripts/khong-can-nguoi.mjs`, `scripts/start-scan.mjs`) chỉ ĐỌC tệp luật và `luat-cham.json`. SKILL feature-loop thêm bước nạp ở S1 và một dòng lệnh ở S4.

**Tech Stack:** Node ≥ 18 (CommonJS cho mô-đun, ESM cho ca đo), git CLI, bash + zsh (ca khối lệnh sổ).

**Spec:** `docs/superpowers/specs/2026-10-11-bat-bien-san-pham-design.md` · hợp đồng `_acceptance/bat-bien-san-pham/contract.md` (11 AC) · phép đo `_acceptance/bat-bien-san-pham/evals.yaml` (E1–E13).

## Global Constraints

- Làm vật CHỈ sau khi PR A2 (`buoc-len-thiet-ke-khong-hoi`) đã gộp: `gh pr list --repo phanlemanh/acceptance-gate-kit --state merged --search buoc-len-thiet-ke-khong-hoi` có một dòng. Trước task 1: cập nhật nhánh từ `origin/main`, ghi sha vào dòng «Commit gốc của vòng» ở Notes của hợp đồng, chạy đường nền `node feature-loop/scripts/duong-nen.mjs --root . --slug bat-bien-san-pham` (bọc khoá máy).
- KHÔNG sửa: `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, `feature-loop/scripts/`, `feature-loop/workflows/`, `dieu-phoi/`, khối TRONG-DOT của SKILL, `scripts/cat-luot.mjs`, `skills/cat-luot/`, `_acceptance/config.yaml`.
- Đường tệp luật CỐ ĐỊNH: `PRODUCT-INVARIANTS.md` ở gốc kho. Mã luật: `SP-<số>` (regex `^SP-\d+$`).
- Kho không có tệp luật: mọi đầu ra của thẻ / khong-can-nguoi / start-scan giống từng byte bản ở gốc, trừ khoá `luat: {"co_tep":false}` của bản rút thẻ.
- Máy không bao giờ ghi `PRODUCT-INVARIANTS.md`.
- Thông điệp ghim (chép nguyên văn, một nguồn là hằng trong mô-đun):
  - `pham-luat-may-quyet` → «phạm luật sản phẩm là câu hỏi cho người»
  - `luat-vang` → «mã luật không có trong tệp luật sản phẩm»
  - `luat-kho-dao` → «luật khó đảo phải mang nhãn khó-đảo»
  - cờ vàng nạp thiếu → «Kho đã khai luật sản phẩm mà sổ bước thiết kế chưa có dòng nạp — lựa chọn của vòng chưa được soi theo luật.»
  - cờ vàng luật đổi → «Luật sản phẩm đã đổi sau khi bước thiết kế nạp (nạp bản <7>, nay <7>) — soi lại lựa chọn theo bản mới.»
  - cờ vàng sai khuôn → «Tệp luật sản phẩm có khối sai khuôn: <mã hoặc dòng> — <lý do>; luật đó chưa được nạp.»
  - cờ đỏ sửa tệp → «Vòng này sửa tệp luật sản phẩm — máy không sửa luật; tách thành commit riêng của chủ kho»
  - báo chủ kho sửa → «Chủ kho sửa tệp luật trong nhánh vòng (<n> commit)»
  - cờ vàng chưa soi → «Chưa soi luật sản phẩm trên bản đã chấm»
  - lý do `khong-can-nguoi` → «còn cần người: luật sản phẩm»
- Mọi phép đo mới: cặp hai chiều trên CÙNG kho thử do code sinh, bản lành xanh trước, bản tiêm đỏ với thông điệp ghim (MEASURE-BIRTH-CLAUSE). Đường dẫn suy từ `import.meta.dirname`.
- Mỗi commit kết bằng `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Tệp luật có BOM / CRLF / dòng trống thừa giữa tiêu đề và trường → vẫn đọc đúng (bộ đọc gom `\r\n`, bỏ BOM) — ca thêm vào LS-01 (task 1).
2. `Dấu hiệu` là regex hợp lệ nhưng khớp chuỗi rỗng (vd `a*`) → coi là sai khuôn «dấu hiệu khớp chuỗi rỗng», nếu không mọi dòng thêm đều thành chạm — ca thêm vào LS-01 (task 1).
3. Diff thêm tệp nhị phân hoặc đổi tên tệp → bộ soi bỏ qua nhị phân, đọc đường MỚI của tệp đổi tên — ca thêm vào LS-08 (task 4).
4. Hồ sơ đã ký / `machine-cleared` trong kho có tệp luật mà không có `luat-cham.json` (hồ sơ trước vòng này) → không cờ vàng «chưa soi», không đổi kết luận làn V — ca thêm vào LS-08 cu (task 5).
5. Tệp luật bị XOÁ trong nhánh vòng (có ở base, vắng ở den) → tính là sửa tệp luật (máy/người theo commit), không phải «kho không khai luật» — ca thêm vào LS-07 (task 4).

## File Structure

| Tệp | Trách nhiệm |
|---|---|
| `skills/acceptance/references/product-invariants-template.md` (mới) | Khuôn tệp luật — khối marker `PRODUCT-INVARIANTS-TEMPLATE` là nguồn duy nhất của hình dạng |
| `scripts/luat-san-pham.cjs` (mới) | `docLuat` · `banLuat` · `docTepLuat(root)` · `quet(...)` → `luat-cham.json` · `dem(...)` · CLI `--quet` / `--dem` |
| `scripts/can-cu-s1.cjs` (A2, sửa) | ba luật đỏ của `pham_luat`; nạp tệp luật một lần trong `taoNguCanh` |
| `scripts/gate-card.js` (sửa) | Cổng 1: nhãn «theo luật», tiền tố «Phạm luật», ba cờ vàng, khoá `luat` ở bản rút · Cổng 2: khối «Luật sản phẩm bị chạm», ô `SP-<n>` / `Tệp luật`, nhãn luật ở mục ngoài hợp đồng, cờ chưa soi |
| `scripts/khong-can-nguoi.mjs` (sửa) | `ctx.luat` tuỳ chọn → `khongCanNguoi` trả null khi có chạm / máy sửa tệp / chưa soi; CLI đọc tệp |
| `scripts/start-scan.mjs` (sửa) | truyền `ctx.luat` cùng cách CLI |
| `feature-loop/skills/feature-loop/SKILL.md` (sửa) | S1 bước nạp + khuôn `DEC-LUAT-NAP` + câu soi ở S1#7 + dòng lệnh S4 «Mọi verdict» |
| `commands/signoff.md`, `skills/acceptance/references/human-facing-language.md` (sửa) | nhãn ô `SP-<số>`, `Tệp luật` |
| `GUIDE.md`, `CONTEXT.md`, `docs/adr/0024-luat-san-pham-cua-kho.md` (mới) | tài liệu cho kho tiêu thụ |
| `tests/scripts/luat-san-pham.ca.mjs` (mới) + `tests/scripts/run-tests.sh` (sửa) | ca LS-01 … LS-11 |

---

### Task 0: Vào S3 — cập nhật nhánh, ghi gốc vòng, đường nền

**Files:** Modify `_acceptance/bat-bien-san-pham/contract.md` (dòng «Commit gốc của vòng» ở Notes) · Create `_acceptance/bat-bien-san-pham/duong-nen.md` (script sinh)
**independent:** false · **phục vụ:** E2 (gốc vòng)

- [ ] Kiểm A2 đã gộp (lệnh ở Global Constraints); chưa → DỪNG, báo phiên điều phối.
- [ ] `git fetch origin && git merge origin/main` (xung đột → giải, giữ cả hai phía).
- [ ] `G=$(git rev-parse origin/main)`; sửa dòng Notes thành ``- Commit gốc của vòng: `<G>` (origin/main lúc vào S3).``
- [ ] `bash ~/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh "BB1 đường nền" node feature-loop/scripts/duong-nen.mjs --root . --slug bat-bien-san-pham` — mã 1 → đọc `duong-nen.md`, gỡ thứ gỡ được, chạy lại.
- [ ] Commit `s3(bat-bien-san-pham): vào S3 — gốc vòng + đường nền`.

### Task 1: Khuôn tệp luật + bộ đọc + băm phiên bản (AC-1)

**Files:** Create `skills/acceptance/references/product-invariants-template.md`, `scripts/luat-san-pham.cjs`, `tests/scripts/luat-san-pham.ca.mjs` · Modify `tests/scripts/run-tests.sh`
**Interfaces — Produces:** `docLuat(text) → { luat: Luat[], sai_khuon: {ma?:string, dong:number, ly_do:string}[] }` với `Luat = { ma, cau, muc: 'thuong'|'kho-dao', chu, giu, dau_hieu: RegExp|null, dau_hieu_nguon: string|null, pham_vi: string[], vi_sao }` · `banLuat(text) → string` (40 hex) · `docTepLuat(root, ref?) → { co_tep:boolean, text:string|null, ban:string|null, luat, sai_khuon }` · hằng `TEP_LUAT = 'PRODUCT-INVARIANTS.md'`, `MA_RE = /^SP-\d+$/`, `LY_DO_KHUON`.
**independent:** true · **phục vụ:** E1

- [ ] **Step 1: Khuôn.** Tạo tệp khuôn; khối máy-đọc:

````markdown
<!-- <<<PRODUCT-INVARIANTS-TEMPLATE -->
```markdown
## SP-{so} · {cau}

- Mức: {muc}
- Chủ luật: {chu}
- Giữ bằng: {giu}
- Dấu hiệu: `{dau_hieu}`
- Phạm vi: {pham_vi}
- Vì sao: {vi_sao}
```
<!-- PRODUCT-INVARIANTS-TEMPLATE>>> -->
````
Văn quanh khối nói: tệp ở gốc kho, là của kho, máy không sửa; `Mức` ∈ {`thường`, `khó đảo`}; `Dấu hiệu`, `Phạm vi` tuỳ chọn (xoá dòng); `Phạm vi` là danh sách glob trong backtick cách nhau bằng dấu phẩy; khuyên thêm một dòng trỏ tệp vào `CLAUDE.md`.

- [ ] **Step 2: Ca đỏ trước (LS-01).** Trong `tests/scripts/luat-san-pham.ca.mjs` (ESM; `const ROOT = path.resolve(import.meta.dirname, '../..')`; `const require = createRequire(import.meta.url)`; helper `pass(n)` in `PASS: <n>`, `fail(n, why)` in `FAIL: <n> — <why>` và đặt `process.exitCode = 1`):

```js
const KHUON = (() => { const t = readFileSync(path.join(ROOT, 'skills/acceptance/references/product-invariants-template.md'), 'utf8');
  const m = t.match(/<!-- <<<PRODUCT-INVARIANTS-TEMPLATE -->\n```markdown\n([\s\S]*?)\n```\n<!-- PRODUCT-INVARIANTS-TEMPLATE>>> -->/);
  if (!m) throw new Error('khối PRODUCT-INVARIANTS-TEMPLATE vắng'); return m[1]; })();
const dien = (khuon, o) => khuon.split('\n').filter(l => !(o.dau_hieu == null && /Dấu hiệu/.test(l)) && !(o.pham_vi == null && /Phạm vi/.test(l)))
  .join('\n').replace(/\{(\w+)\}/g, (_, k) => o[k]);
const LUAT_VIET_SAN = [
  { so: 1, cau: 'Múi giờ của tổ chức đọc từ cấu hình, không khai hằng mới', muc: 'khó đảo', chu: 'Chủ A', giu: 'test mui-gio-mot-nguon', dau_hieu: 'Asia/Ho_Chi_Minh|\\+07:00', pham_vi: '`apps/**`', vi_sao: 'Tổ chức thứ hai ở múi giờ khác.' },
  { so: 2, cau: 'Mỗi tổ chức có một tổ chức mẫu để thử', muc: 'thường', chu: 'Chủ B', giu: 'giữ bằng mắt', dau_hieu: null, pham_vi: null, vi_sao: 'Người mới thử được ngay.' },
  { so: 3, cau: "Câu có 'nháy', $tien và | ống", muc: 'thường', chu: 'Chủ C', giu: 'giữ bằng mắt', dau_hieu: null, pham_vi: null, vi_sao: 'Ca ký tự lạ.' },
];
// + bốn khối sai khuôn: thiếu Chủ luật (SP-4) · mức lạ «vừa» (SP-5) · dấu hiệu `(` (SP-6) · trùng SP-1 (khối thứ hai)
// + Review Focus 1–2: tệp mang BOM + CRLF; SP-7 dấu hiệu `a*` (khớp rỗng)
```
Kỳ vọng viết sẵn: `luat.map(l => [l.ma, l.cau, l.muc, l.chu, l.giu, l.dau_hieu_nguon, l.pham_vi])` deepEqual
`[['SP-1', …, 'kho-dao', 'Chủ A', 'test mui-gio-mot-nguon', 'Asia/Ho_Chi_Minh|\\+07:00', ['apps/**']], ['SP-2', …, 'thuong', 'Chủ B', 'giữ bằng mắt', null, []], ['SP-3', "Câu có 'nháy', $tien và | ống", 'thuong', 'Chủ C', 'giữ bằng mắt', null, []]]`;
`sai_khuon.map(s => [s.ma, s.ly_do])` deepEqual `[['SP-4','thiếu Chủ luật'],['SP-5','mức lạ: vừa'],['SP-6','dấu hiệu không biên dịch được'],['SP-1','mã trùng'],['SP-7','dấu hiệu khớp chuỗi rỗng']]`;
`banLuat(t) === execFileSync('git', ['hash-object', '--stdin'], { input: t }).toString().trim()`.
Chiều đỏ `LS-01-do`: bản sao khuôn đổi `Chủ luật:` → `Người giữ:` rồi dựng lại cùng ba luật → `docLuat(...).luat.length === 0` → in `PASS: LS-01-do`; ngược lại `fail('LS-01-do', 'khuôn đổi nhãn mà vẫn đọc ra luật')`.

- [ ] **Step 3:** Thêm vào `tests/scripts/run-tests.sh` (phần bash, ngay sau khối `can-cu-s1.ca.mjs` của A2): 

```bash
echo "=== luat-san-pham.ca.mjs ==="
node "$HERE/luat-san-pham.ca.mjs"; _ls_rc=$?
check "luat-san-pham.ca.mjs (LS-01..LS-11)" 0 "$_ls_rc"
```
Chạy `node tests/scripts/luat-san-pham.ca.mjs` → FAIL (mô-đun chưa có).

- [ ] **Step 4: Bộ đọc.** `scripts/luat-san-pham.cjs`:

```js
'use strict';
// luat-san-pham.cjs — luật sản phẩm của kho (hồ sơ bat-bien-san-pham, ADR 0024).
// Khuôn tệp: khối PRODUCT-INVARIANTS-TEMPLATE trong skills/acceptance/references/product-invariants-template.md.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { spawnSync } = require('child_process');
const TEP_LUAT = 'PRODUCT-INVARIANTS.md';
const MA_RE = /^SP-\d+$/;
const TIEU_DE_RE = /^##\s+(SP-\d+)\s+·\s+(.+?)\s*$/;
const TRUONG_RE = /^-\s+(Mức|Chủ luật|Giữ bằng|Dấu hiệu|Phạm vi|Vì sao):\s*(.*)$/;
const MUC = { 'thường': 'thuong', 'khó đảo': 'kho-dao' };
function banLuat(text) { const b = Buffer.from(text, 'utf8'); return crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'); }
function docLuat(text) {
  const t = String(text || '').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const khoi = []; let cur = null;
  t.split('\n').forEach((l, i) => {
    const h = l.match(TIEU_DE_RE);
    if (h) { cur = { ma: h[1], cau: h[2], dong: i + 1, tr: {} }; khoi.push(cur); return; }
    if (/^#{1,2}\s/.test(l)) { cur = null; return; }
    const f = cur && l.match(TRUONG_RE); if (f) cur.tr[f[1]] = f[2].trim();
  });
  const luat = [], sai_khuon = [], daCo = new Set();
  for (const k of khoi) {
    const sai = ly => sai_khuon.push({ ma: k.ma, dong: k.dong, ly_do: ly });
    if (daCo.has(k.ma)) { sai('mã trùng'); continue; }
    if (!k.tr['Chủ luật']) { sai('thiếu Chủ luật'); continue; }
    const muc = MUC[(k.tr['Mức'] || '').toLowerCase()];
    if (!muc) { sai(`mức lạ: ${k.tr['Mức'] || '(trống)'}`); continue; }
    let re = null, nguon = null;
    if (k.tr['Dấu hiệu']) {
      nguon = k.tr['Dấu hiệu'].replace(/^`|`$/g, '');
      try { re = new RegExp(nguon); } catch (_) { sai('dấu hiệu không biên dịch được'); continue; }
      if (re.test('')) { sai('dấu hiệu khớp chuỗi rỗng'); continue; }
    }
    const pham_vi = (k.tr['Phạm vi'] || '').split(',').map(s => s.trim().replace(/^`|`$/g, '')).filter(Boolean);
    daCo.add(k.ma);
    luat.push({ ma: k.ma, cau: k.cau, muc, chu: k.tr['Chủ luật'], giu: k.tr['Giữ bằng'] || '', dau_hieu: re, dau_hieu_nguon: nguon, pham_vi, vi_sao: k.tr['Vì sao'] || '' });
  }
  return { luat, sai_khuon };
}
function docTepLuat(root, ref) {
  let text = null;
  if (ref) { const r = spawnSync('git', ['-C', root, 'show', `${ref}:${TEP_LUAT}`], { encoding: 'utf8', maxBuffer: 16 << 20 }); text = r.status === 0 ? r.stdout : null; }
  else { try { text = fs.readFileSync(path.join(root, TEP_LUAT), 'utf8'); } catch (_) { text = null; } }
  if (text === null) return { co_tep: false, text: null, ban: null, luat: [], sai_khuon: [] };
  return Object.assign({ co_tep: true, text, ban: banLuat(text) }, docLuat(text));
}
module.exports = { TEP_LUAT, MA_RE, banLuat, docLuat, docTepLuat };
```
(Lưu ý: «mã trùng» xếp sau khi khối gốc đã đọc hợp lệ — `daCo.add` chỉ cho khối hợp lệ; khối trùng đứng SAU.)

- [ ] **Step 5:** `node tests/scripts/luat-san-pham.ca.mjs` → `PASS: LS-01 doc-luat`, `PASS: LS-01-do`.
- [ ] **Step 6:** Commit `feat(luat-san-pham): khuôn tệp luật + bộ đọc + băm phiên bản (AC-1)`.

### Task 2: Luật đỏ của `pham_luat` trong bộ xếp lớp (AC-5, AC-6)

**Files:** Modify `scripts/can-cu-s1.cjs` · Test `tests/scripts/luat-san-pham.ca.mjs` (LS-05 phần mô-đun, LS-06)
**Interfaces — Consumes:** `docTepLuat(root)` (task 1). **Produces:** mã đỏ mới trong `LY_DO`: `pham-luat-may-quyet`, `luat-vang`, `luat-kho-dao`; `taoNguCanh` thêm `nc.luat = docTepLuat(root)` (đọc một lần, lười); mỗi dòng ra thêm `luat_ma` (mã SP khi dòng mang `pham_luat`, hoặc khi câu trích nằm trong một câu luật).
**independent:** false (dựa task 1)

- [ ] **Step 1: Ca đỏ trước.** Kho thử (`mkdtemp` + `git init` + tệp luật dựng bằng `dien(KHUON, …)` cho SP-1 khó đảo, SP-2 thường + commit gốc). Ma trận năm dòng S1 viết sẵn + bảng mong đợi:

| Ca | can_cu | lớp · mã |
|---|---|---|
| c1 | `{nguon:'chi-nguoi',kho_dao:false,khuyen:'…',loi_khac:'…',pham_luat:'SP-2'}` | `cau-hoi` · — |
| c2 | `{nguon:'chi-nguoi',kho_dao:true,…,pham_luat:'SP-1'}` | `cau-hoi` · — |
| c3 | `{nguon:'chi-nguoi',kho_dao:false,…,pham_luat:'SP-1'}` | `do` · `luat-kho-dao` |
| c4 | `{nguon:'muc-tieu',kho_dao:false,tep:'PRODUCT-INVARIANTS.md',trich:'<câu SP-2>',pham_luat:'SP-2'}` | `do` · `pham-luat-may-quyet` |
| c5 | `{nguon:'mot-loi',kho_dao:false,loi_chet:'…',pham_luat:'SP-2'}` | `do` · `pham-luat-may-quyet` |

LS-06: `pham_luat:'SP-9'` (chỉ-người đủ khuyến nghị) ở kho có tệp và ở kho KHÔNG tệp → `do` · `luat-vang` · «mã luật không có trong tệp luật sản phẩm»; đối chứng `SP-2` → `cau-hoi`. Chiều đỏ: với mỗi luật, bản sao mô-đun (chép `scripts/can-cu-s1.cjs` + `scripts/luat-san-pham.cjs` vào thư mục tạm, xoá đúng một nhánh `if` bằng `replace` có kiểm số lần thay == 1) → ca tương ứng ra lớp khác `do` → `PASS: LS-05-do <mã>` / `PASS: LS-06-do`.

- [ ] **Step 2:** Chạy → FAIL.
- [ ] **Step 3: Cài.** Trong `can-cu-s1.cjs`:

```js
const { docTepLuat } = require('./luat-san-pham.cjs');   // đầu tệp
Object.assign(LY_DO, {
  'pham-luat-may-quyet': 'phạm luật sản phẩm là câu hỏi cho người',
  'luat-vang': 'mã luật không có trong tệp luật sản phẩm',
  'luat-kho-dao': 'luật khó đảo phải mang nhãn khó-đảo',
});
// taoNguCanh: thêm thuộc tính lười
//   get luat() { return this._luat || (this._luat = docTepLuat(root)); }
// phanLoaiDong — chèn NGAY SAU kiểm nguồn lạ, TRƯỚC mọi nhánh khác:
if (typeof c.pham_luat === 'string') {
  const l = nc.luat.luat.find(x => x.ma === c.pham_luat);
  if (!l) return ra('do', 'luat-vang', { luat_ma: c.pham_luat });
  if (c.nguon !== 'chi-nguoi') return ra('do', 'pham-luat-may-quyet', { luat_ma: l.ma });
  if (l.muc === 'kho-dao' && c.kho_dao !== true) return ra('do', 'luat-kho-dao', { luat_ma: l.ma });
  return chuoi(c.khuyen) && chuoi(c.loi_khac) ? ra('cau-hoi', null, { luat_ma: l.ma, luat: l }) : ra('do', 'thieu-khuyen');
}
// nhánh muc-tieu hợp lệ: khi rel === 'PRODUCT-INVARIANTS.md', gắn luat_ma = mã của luật có l.cau chứa câu trích (gom khoảng trắng) — không có thì không gắn.
```
- [ ] **Step 4:** Chạy → `PASS: LS-05 ma-tran 5/5` (phần lớp/mã), `PASS: LS-05-do pham-luat-may-quyet`, `PASS: LS-05-do luat-kho-dao`, `PASS: LS-06 luat-vang 2/2`, `PASS: LS-06-do`; và `node tests/scripts/can-cu-s1.ca.mjs` của A2 vẫn xanh.
- [ ] **Step 5:** Commit `feat(can-cu-s1): ba luật đỏ của phạm luật sản phẩm (AC-5, AC-6)`.

### Task 3: Thẻ Cổng Phạm vi — dòng nạp, nhãn luật, câu «Phạm luật» (AC-3, AC-4, AC-5)

**Files:** Modify `scripts/gate-card.js` (nhánh `gate === '1'`, các chỗ A2 đã thêm khối `ccCauHoi` / `ccMayQuyet` và cờ), `feature-loop/skills/feature-loop/SKILL.md` (khuôn `DEC-LUAT-NAP` ở mục «Sổ quyết định») · Test LS-03, LS-04, LS-05 (phần thẻ)
**Interfaces — Consumes:** `docTepLuat`, dòng ra của `phanLoaiSo` mang `luat_ma`/`luat`. **Produces:** bản rút Cổng 1 khoá `luat: { co_tep, so_luat, sai_khuon: [{ma,dong,ly_do}], nap: {ban, khop} | null }`; kho không tệp → đúng `{"co_tep":false}`.
**independent:** false

- [ ] **Step 1: Khuôn sổ.** Trong SKILL, ngay dưới khối `DEC-CAN-CU-SLOT` của A2:

````markdown
**Dòng nạp luật sản phẩm (hồ sơ bat-bien-san-pham):** kho có `PRODUCT-INVARIANTS.md` → bước thiết kế ghi đúng MỘT dòng theo khuôn dưới (dòng giữa của `DEC-ID-RECIPE`), `<ban>` = `git hash-object PRODUCT-INVARIANTS.md`, `<N>` = số luật đọc được.
<!-- <<<DEC-LUAT-NAP -->
```
"type":"approach","stage":"S1","at":"<ISO>","decision":"Nạp <N> luật sản phẩm từ PRODUCT-INVARIANTS.md","why":"Kho đã khai tệp luật sản phẩm — bước thiết kế đọc nó trước khi chọn.","cost_if_wrong":"Không nạp thì lựa chọn phạm luật đi qua Cổng Phạm vi không ai gọi tên.","can_cu":{"nguon":"mot-loi","kho_dao":false,"loi_chet":"Kho đã khai tệp luật — bỏ qua tệp là phạm luật nạp của kit."},"luat_nap":{"ban":"<ban>","so":<N>}
```
<!-- DEC-LUAT-NAP>>> -->
````
- [ ] **Step 2: Ca đỏ trước.** LS-03: rút khối `DEC-LUAT-NAP` (đúng một dòng, chứa `"can_cu":` và `"luat_nap":`), thay `<ISO>`, `<N>`, `<ban>`; ghi bằng khối `DEC-ID-RECIPE` rút từ SKILL chạy dưới `bash -c` và `zsh -c` (zsh vắng → FAIL); ba hồ sơ nháp: khớp · thiếu · đổi (sửa tệp luật sau khi ghi dòng nạp, commit). Dựng thẻ bằng `spawnSync(process.execPath, [GATE_CARD, '--root', R, '--slug', s, '--glossary-base', 'goc'])` và `--extract`. LS-04: hai dòng mục-tiêu (trích câu SP-2 · trích câu ngoài khối luật) + biến thể câu SP-2 chỉ thêm trong nhánh. LS-05 phần thẻ: hồ sơ ma trận task 2 (c1, c2 + một chỉ-người không `pham_luat`).
- [ ] **Step 3: Cài trong `gate-card.js`** (Cổng 1):

```js
let luatSP = null; try { luatSP = require('./luat-san-pham.cjs'); } catch (_) { luatSP = null; }
const tepLuat = luatSP ? luatSP.docTepLuat(root) : { co_tep: false };
const dongNap = (ledger.entries || []).find(e => e && e.stage === 'S1' && e.luat_nap && typeof e.luat_nap.ban === 'string');
const luatKhoa = tepLuat.co_tep
  ? { co_tep: true, so_luat: tepLuat.luat.length, sai_khuon: tepLuat.sai_khuon, nap: dongNap ? { ban: dongNap.luat_nap.ban, khop: dongNap.luat_nap.ban === tepLuat.ban } : null }
  : { co_tep: false };
// cờ — CHỈ khi tepLuat.co_tep && ccDraft:
//   !dongNap → fwarn «Kho đã khai luật sản phẩm mà sổ bước thiết kế chưa có dòng nạp — lựa chọn của vòng chưa được soi theo luật.»
//   dongNap && !khop → fwarn `Luật sản phẩm đã đổi sau khi bước thiết kế nạp (nạp bản ${ban.slice(0,7)}, nay ${tepLuat.ban.slice(0,7)}) — soi lại lựa chọn theo bản mới.`
//   mỗi sai_khuon → fwarn `Tệp luật sản phẩm có khối sai khuôn: ${s.ma || 'dòng ' + s.dong} — ${s.ly_do}; luật đó chưa được nạp.`
// khối ccCauHoi: d.luat có → mở đầu `Phạm luật ${d.luat.ma} — ${d.luat.cau} (chủ luật: ${d.luat.chu})`, nhãn khó-đảo khi d.luat.muc === 'kho-dao'
// khối ccMayQuyet: d.luat_ma có → hậu tố ` · theo luật ${d.luat_ma}`
// bản rút: thêm khoá `luat: luatKhoa` (đặt cuối object)
```
- [ ] **Step 4:** Chạy → `PASS: LS-03 bash`, `PASS: LS-03 zsh`, `PASS: LS-03-do`, `PASS: LS-04 theo-luat`, `PASS: LS-04-do`, `PASS: LS-05 ma-tran 5/5` (đủ phần thẻ: Hỏi-1/Hỏi-2 đúng tiền tố, ca chỉ-người không `pham_luat` không có «Phạm luật», ca đỏ → one_shot chứa `___`).
- [ ] **Step 5:** Commit `feat(gate-card): Cổng Phạm vi đọc luật sản phẩm — dòng nạp, nhãn luật, câu phạm luật (AC-3..AC-5)`.

### Task 4: Bộ soi diff → `luat-cham.json` (AC-7, AC-8 phần soi)

**Files:** Modify `scripts/luat-san-pham.cjs` (hàm `quet`, CLI `--quet`) · Test LS-07, LS-08 (phần tệp)
**Interfaces — Produces:** `quet({ root, base, den }) → null | { ban, base, den, sua_tep_luat: { may: string[], nguoi: string[] }, cham: {ma, tep, dong, chu}[] }` (null = kho không có tệp ở cả `base` lẫn `den`) · CLI `node scripts/luat-san-pham.cjs --root . --slug <s> --quet --base <ref> --den <ref> [--write]` (`--write` ghi `_acceptance/<s>/luat-cham.json`, `JSON.stringify(o, null, 1) + '\n'`; không `--write` in ra stdout; thoát 0, kho không khai luật → in «kho không khai luật» và không ghi).
**independent:** false

- [ ] **Step 1: Ca đỏ trước.** LS-08 kho thử hình dạng `okr-soat-anh-luot-3`: tệp luật SP-1 (khó đảo, dấu hiệu `Asia/Ho_Chi_Minh|\+07:00`, phạm vi `` `apps/**` ``) ở commit gốc; nhánh thêm `apps/app/lib/a.ts` (dòng 3 = `  muiGio: "Asia/Ho_Chi_Minh",`), `tests/a.spec.ts` cùng chuỗi, `_acceptance/x/notes.md` cùng chuỗi, một tệp nhị phân `apps/logo.png`, đổi tên `apps/cu.ts` → `apps/moi.ts` có thêm dòng `+07:00` ở dòng 1 (Review Focus 3). Mong đợi viết sẵn: `cham` deepEqual `[{ma:'SP-1',tep:'apps/app/lib/a.ts',dong:3,…},{ma:'SP-1',tep:'apps/moi.ts',dong:1,…}]` (so `[ma,tep,dong]`). Đỏ: bản sao bỏ lọc phạm vi → có `tests/a.spec.ts` → `PASS: LS-08-do pham-vi`; tệp luật bỏ SP-1 → `cham` rỗng sau khi bản lành có chạm → `PASS: LS-08-do khong-luat`.
  LS-07 ba nhánh + Review Focus 5 (nhánh xoá tệp luật bằng commit có dòng đồng tác giả → `may` == [sha]).
- [ ] **Step 2:** Chạy → FAIL.
- [ ] **Step 3: Cài.**

```js
const { pathGlobToRe } = require('../lib/evidence-core.cjs');
const git = (root, a) => { const r = spawnSync('git', ['-C', root, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 }); if (r.status !== 0) throw new Error(`git ${a.join(' ')}: ${r.stderr.trim()}`); return r.stdout; };
const DONG_MAY = /^Co-Authored-By:\s*Claude\b/mi;
function quet({ root, base, den }) {
  const dau = docTepLuat(root, den), cu = docTepLuat(root, base);
  if (!dau.co_tep && !cu.co_tep) return null;
  const sua = { may: [], nguoi: [] };
  for (const sha of git(root, ['log', '--format=%H', `${base}..${den}`, '--', TEP_LUAT]).split('\n').filter(Boolean))
    (DONG_MAY.test(git(root, ['log', '-1', '--format=%B', sha])) ? sua.may : sua.nguoi).push(sha);
  const cham = [];
  const luat = dau.luat.filter(l => l.dau_hieu);
  if (luat.length) {
    const diff = git(root, ['diff', '--no-color', '--unified=0', '-M', `${base}...${den}`]);
    let tep = null, dong = 0;
    for (const l of diff.split('\n')) {
      if (l.startsWith('+++ ')) { tep = l === '+++ /dev/null' ? null : l.slice(6); continue; }
      if (l.startsWith('Binary files')) { tep = null; continue; }
      const h = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/); if (h) { dong = +h[1]; continue; }
      if (!tep || !l.startsWith('+') || l.startsWith('+++')) continue;
      const chu = l.slice(1);
      if (!tep.startsWith('_acceptance/') && tep !== TEP_LUAT)
        for (const r of luat) if ((!r.pham_vi.length || r.pham_vi.some(g => pathGlobToRe(g).test(tep))) && r.dau_hieu.test(chu))
          cham.push({ ma: r.ma, tep, dong, chu: chu.slice(0, 160) });
      dong++;
    }
  }
  return { ban: dau.ban, base: git(root, ['rev-parse', base]).trim(), den: git(root, ['rev-parse', den]).trim(), sua_tep_luat: sua, cham };
}
```
- [ ] **Step 4:** Chạy → phần tệp của LS-07/LS-08 xanh; đỏ đúng.
- [ ] **Step 5:** Commit `feat(luat-san-pham): bộ soi dấu hiệu trên diff + tách máy/người sửa tệp luật (AC-7, AC-8)`.

### Task 5: Thẻ Cổng Bằng chứng + «còn cần người» (AC-7, AC-8, AC-10)

**Files:** Modify `scripts/gate-card.js` (nhánh Cổng 2: sau khối «Ngoài hợp đồng»; `oneParts`/`routingHoi`), `scripts/khong-can-nguoi.mjs`, `scripts/start-scan.mjs`, `skills/acceptance/references/human-facing-language.md` (`GATE-ONESHOT-SLOTS` thêm `g2 SP-<số>` và `g2 Tệp luật`), `commands/signoff.md` · Test LS-07, LS-08, LS-10
**Interfaces — Consumes:** `luat-cham.json`, `docTepLuat`. **Produces:** `khongCanNguoi(contract, evidence, ctx)` đọc `ctx.luat` TUỲ CHỌN = `{ co_tep:boolean, cham:object|null, verified_commit:string|null, da_qua:boolean }`; vắng `ctx.luat` → hành vi cũ (giữ đẳng thức LV5 với lưới trước-gộp).
**independent:** false

- [ ] **Step 1: Ca đỏ trước** (LS-07, LS-08 phần thẻ, LS-08 cu, LS-08 nhan-ngoai, LS-10). Hồ sơ `verified` do code sinh: `evidence-report.md` theo khuôn `skills/acceptance/references/evidence-report-template.md` với `verdict: PASS`, Known limits và Ngoài hợp đồng hiện-diện-rỗng, `verified_commit: <den>`; `review-findings.md` dựng bằng khuôn `OOC-ITEM-TEMPLATE` rút từ marker (`lib/out-of-contract.cjs` là bên đọc). LS-08 cu: (a) xoá `luat-cham.json` · (b) `den` ≠ `verified_commit` → mỗi ca đúng một cờ vàng «Chưa soi luật sản phẩm trên bản đã chấm», không nhãn `đi tiếp hay kéo lại`; (c) Review Focus 4 — hồ sơ `signed-off` không có `luat-cham.json` → không cờ.
- [ ] **Step 2:** Chạy → FAIL.
- [ ] **Step 3: `khong-can-nguoi.mjs`** — trong `khongCanNguoi`, ngay SAU `if (!xanhSach(...).clean) return null;`:

```js
const L = ctx.luat;
if (L && L.co_tep && !L.da_qua) {
  if (!L.cham || L.cham.den !== L.verified_commit) return null;                       // chưa soi bản đã chấm
  if (L.cham.cham.length || L.cham.sua_tep_luat.may.length) return null;              // chạm luật / máy sửa tệp luật
}
```
CLI: dựng `ctx.luat = { co_tep: docTepLuat(root).co_tep, cham: <đọc luat-cham.json hoặc null>, verified_commit: frontmatterField(evidence,'verified_commit'), da_qua: false }` (`require('./luat-san-pham.cjs')`); lý do in khi trả null vì luật: «còn cần người: luật sản phẩm». `start-scan.mjs`: truyền cùng `ctx.luat`, `da_qua` = status ∈ {signed-off, machine-cleared, da-cham-boi-thuc-te}.
- [ ] **Step 4: `gate-card.js` Cổng 2:** đọc `luat-cham.json` + `docTepLuat(root)`; chỉ khi `co_tep`:
  - khối `<div class="lab">Luật sản phẩm bị chạm</div>`: nhóm `cham` theo `ma`; mỗi mã `<p class="li" data-luat="SP-n">` — mã · câu · chủ luật · mức (`khó-đảo` in đậm) · tối đa ba `tệp:dòng` + «và <k> chỗ nữa»;
  - mỗi mã: `oneParts.push(\`${ma}: sửa vật\`); routingHoi.push(ma);` (đặt TRƯỚC khối `Ngoài-<n>`);
  - `sua_tep_luat.may.length` → `flags` fred + `oneParts.push('Tệp luật: ___'); routingHoi.push('Tệp luật');`; chỉ `nguoi` → finfo «Chủ kho sửa tệp luật trong nhánh vòng (<n> commit)»;
  - `luat-cham.json` vắng hoặc `den !== verified_commit` (và hồ sơ chưa qua) → fwarn «Chưa soi luật sản phẩm trên bản đã chấm»;
  - nhãn ngoài hợp đồng: với mỗi `ooc.findings[i]`, `(f.title + ' ' + (f.plain||'') + ' ' + (f.detail||'')).match(/\bSP-\d+\b/g)` ∩ mã có trong tệp → hậu tố `· luật SP-n · <mức chữ>` trên dòng mục đó;
  - bản rút Cổng 2 thêm `luat: { co_tep, cham, sua_tep_luat, chua_soi }` (kho không tệp → `{co_tep:false}`).
  `MAY_DI_TIEP` không sửa trực tiếp: nó đọc trạng thái bộ quét, bộ quét đọc `khongCanNguoi` (Step 3).
- [ ] **Step 5: Nhãn ô.** `GATE-ONESHOT-SLOTS` thêm hai dòng `g2 SP-<số>` · `g2 Tệp luật`; `commands/signoff.md` mục câu gộp thêm: «`SP-<số>: sửa vật` (trả về S3) · `SP-<số>: chấp nhận có tên` (ghi Known limits + một dòng sổ `gate2`) · `Tệp luật: <lý do>` (người xác nhận đã tách luật thành commit riêng)». Ca P147/round-trip ô có sẵn của kit phải còn xanh: `bash tests/plugins/run-tests.sh` (bọc khoá máy).
- [ ] **Step 6:** Chạy → `PASS: LS-07 may|nguoi|sach`, `PASS: LS-07-do`, `PASS: LS-08 okr-soat`, `PASS: LS-08 cu`, `PASS: LS-08 nhan-ngoai`, `PASS: LS-08-do pham-vi`, `PASS: LS-08-do khong-luat`, `PASS: LS-10 mot-dong`, `PASS: LS-10-do`; `RT_CASES=LV5 node tests/plugins/lan-v.test.mjs` (hoặc lệnh LV5 của tệp) xanh.
- [ ] **Step 7:** Commit `feat(gate-card): Cổng Bằng chứng gọi tên luật sản phẩm bị chạm; khong-can-nguoi đọc luat-cham (AC-7, AC-8, AC-10)`.

### Task 6: Lệnh đếm cho Cổng Giá trị (AC-11)

**Files:** Modify `scripts/luat-san-pham.cjs` (hàm `dem`, CLI `--dem [--tu YYYY-MM-DD] [--json]`) · Test LS-11
**Interfaces — Produces:** `dem(root, { tu }) → { ngay_khai: 'YYYY-MM-DD'|null, hang: [{ slug, dong_nap, pham_thiet_ke, cham_diff, nhan_ngoai, may_sua, nguoi_sua }] }`. `ngay_khai` = ngày (UTC) commit đầu chạm `PRODUCT-INVARIANTS.md` (`git log --diff-filter=A --format=%cI -- PRODUCT-INVARIANTS.md | tail -1`). Lọc `--tu`: dòng sổ đầu tiên có `at` ≥ ngày. `pham_thiet_ke` đếm dòng S1 mang `pham_luat` mà KHÔNG bị dòng sau `supersedes`. `nhan_ngoai` đếm mục ngoài hợp đồng (bộ đọc `lib/out-of-contract.cjs`) nhắc một mã có trong tệp.
**independent:** false

- [ ] **Step 1:** LS-11 kho thử sáu hồ sơ (bảng ở E13), tệp luật commit với `GIT_COMMITTER_DATE=2026-10-20T00:00:00Z`; bảng mong đợi năm hàng × sáu cột viết sẵn. Đỏ: bản sao đếm cả dòng bị thay.
- [ ] **Step 2–4:** FAIL → cài → `PASS: LS-11 dem`, `PASS: LS-11-do`.
- [ ] **Step 5:** Commit `feat(luat-san-pham): lệnh đếm cho Cổng Giá trị (AC-11)`.

### Task 7: Vi phân trên mọi hồ sơ — kho không có tệp không đổi byte (AC-2)

**Files:** Test LS-02 trong `tests/scripts/luat-san-pham.ca.mjs` · Create `_acceptance/bat-bien-san-pham/evidence/vi-phan-crm.txt` (chạy tay)
**independent:** false (sau task 3, 5)

- [ ] **Step 1:** LS-02: đọc dòng «Commit gốc của vòng» từ Notes hợp đồng (vắng → FAIL nêu dòng); hợp đồng `status` ∈ {signed-off, machine-cleared} → in `PASS: LS-02 da-ky` và thoát ca. `git archive <gốc> scripts lib | tar -x -C <tmp>/goc`; với mỗi kho (kit = ROOT; crm = `process.env.LS_CRM_ROOT` nếu có, không thì in `crm=vang`): mọi thư mục `_acceptance/*/` có `contract.md` → so HTML thẻ, bản rút (xoá khoá `luat`, kiểm nó == `{co_tep:false}`), và với hồ sơ `verified`: `khong-can-nguoi --check` mã + stdout. Kho có `PRODUCT-INVARIANTS.md` → bỏ kho đó và in tên (vi phân chỉ định nghĩa cho kho không tệp). In `PASS: LS-02 vi-phan kit=<n> crm=<m|vang>`. Đỏ: bản sao `gate-card.js` của vòng chèn khối luật vô điều kiện → hàm so trả hồ sơ lệch đầu tiên → `PASS: LS-02-do`.
- [ ] **Step 2:** Chạy với kit → xanh. Chạy tay một lần `LS_CRM_ROOT=~/dev/crm node tests/scripts/luat-san-pham.ca.mjs 2>&1 | grep LS-02 > _acceptance/bat-bien-san-pham/evidence/vi-phan-crm.txt` (crm `git fetch origin onehub` trước; chạy trên `origin/onehub` bằng worktree tạm chỉ đọc).
- [ ] **Step 3:** Commit `test(luat-san-pham): vi phân thẻ trên mọi hồ sơ kit + crm (AC-2)`.

### Task 8: SKILL — bước nạp S1, câu soi phản biện, dòng lệnh S4 (AC-9 máy)

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (S1: bước sau mục 0; S1#7 ý (4) thêm câu soi; S4 «Mọi verdict»: ngay sau lệnh `thuoc-vat.mjs … --write`) · Test LS-09
**independent:** false

- [ ] **Step 1:** LS-09: rút đoạn từ `**Mọi verdict:**` tới hết đoạn; tìm vị trí `thuoc-vat.mjs` có `--write`, rồi vị trí đầu tiên của `luat-san-pham.cjs` sau nó; giữa hai vị trí không có `**Mã 5` → đạt. Đỏ: bản sao SKILL xoá câu lệnh soi → `PASS: LS-09-do` khi hàm trả lỗi chứa «luat-san-pham».
- [ ] **Step 2: Chữ.**
  - S1, sau mục 0: «**0b. Luật sản phẩm của kho.** Kho có `PRODUCT-INVARIANTS.md` ở gốc → đọc TRỌN tệp làm input tường minh của brainstorm (tệp ở gốc không tự nạp như `CLAUDE.md`), ghi đúng một dòng nạp theo khuôn `DEC-LUAT-NAP`. Lựa chọn theo một luật → căn cứ nguồn mục-tiêu trỏ `PRODUCT-INVARIANTS.md` + câu luật; lựa chọn trái một luật → câu chỉ-người mang `"pham_luat":"SP-<n>"`, `kho_dao` theo mức luật — khuyến nghị và lối khác như mọi câu chỉ-người. Máy không sửa tệp luật; muốn đổi luật thì đề nghị trong design doc, chủ kho sửa bằng commit riêng. Kho không có tệp → bỏ bước, không ghi gì.»
  - S1#7 ý (4) thêm: «· có lựa chọn nào trái một luật trong `PRODUCT-INVARIANTS.md` đã nạp mà sổ không ghi `pham_luat` → P0».
  - S4 «Mọi verdict», ngay sau câu `thuoc-vat.mjs … --write`: «Kho có `PRODUCT-INVARIANTS.md` → chạy tiếp `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/luat-san-pham.cjs) && node "$AG/scripts/luat-san-pham.cjs" --root . --slug <slug> --quet --base <diffBase> --den <sha lượt chấm> --write` (kit tự host: `AG=.`); lỗi → WARN một dòng, không chặn vòng.» (resolve gói acceptance-gate theo đúng nếp của SKILL, không glob cache.)
- [ ] **Step 3:** `PASS: LS-09 noi-day-s4`, `PASS: LS-09-do`; ca P85b / khối marker của A2 (CC-02) còn xanh — `node tests/scripts/can-cu-s1.ca.mjs`.
- [ ] **Step 4:** Commit `feat(feature-loop S1/S4): nạp luật sản phẩm ở thiết kế, soi luật ở lượt chấm (AC-9)`.

### Task 9: Tài liệu cho kho tiêu thụ (AC-9 judgment)

**Files:** Modify `GUIDE.md` (mục mới «Luật sản phẩm của kho»), `CONTEXT.md` (term «Luật sản phẩm»: định nghĩa · `_Avoid_: bất biến (trong chữ người), invariant, spec, PRD`), `skills/acceptance/references/product-invariants-template.md` (văn quanh khối) · Create `docs/adr/0024-luat-san-pham-cua-kho.md`
**independent:** true (chỉ tài liệu) — nhưng đặt sau task 8 để trích đúng chữ SKILL.

- [ ] GUIDE: viết tệp · tệp là của kho · vắng thì không gì đổi · dòng nạp · theo luật / phạm luật · thẻ hai cổng · ô `SP-<số>` hai lối + khuyến nghị «sửa vật» · ô `Tệp luật` · dòng trỏ trong `CLAUDE.md` (vì bộ tìm lỗi chỉ đọc `CLAUDE.md`) · lệnh `--dem`.
- [ ] ADR 0024 một đoạn: quyết · vì sao đường cố định không khoá config · ai phê CỘNG (Cổng Đáng 11/10, owner gõ «Làm») · đường đảo (xoá tệp luật ở kho = về hành vi cũ; gỡ mô-đun = thẻ không nạp được, cờ vàng) · giới hạn (lưới trước-gộp không biết luật sản phẩm — `pre-merge-check.sh` là `t3_paths`, ngoài vòng T2; ngưỡng: ≥ 1 hồ sơ gộp có `luat-cham.json` có chạm mà không có dòng sổ `gate2` cho mã đó).
- [ ] `node scripts/eval-coverage-lint.js .` không thêm cảnh báo mới cho hồ sơ; commit `docs: luật sản phẩm của kho — GUIDE, CONTEXT, ADR 0024 (AC-9)`.

### Task 10: Ảnh cho E11 + cả bộ kiểm (AC-10 nhìn)

**independent:** false

- [ ] LS-10 ghi `card-g1-luat.html`, `card-g2-luat.html` vào `_acceptance/bat-bien-san-pham/evidence/` (chỉ khi biến `LS_GHI_ANH=1`, để suite thường không bẩn cây).
- [ ] Cả bộ kiểm qua khoá máy: `bash ~/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh "BB1 suite" bash tests/scripts/run-tests.sh` + `… bash tests/plugins/run-tests.sh` + `… bash tests/hooks/run-tests.sh`.
- [ ] Contract `status: implemented` → S4.

---

## Self-review

1. Phủ spec: §3.1 → task 1 · §3.2 → task 2, 3, 8 · §3.3 → task 3 · §3.4 → task 4, 5, 8 · §3.5 → task 7 · §4 giới hạn → task 9 (ADR) · §6 đường đo → task 6. AC-1…AC-11 đều có task; E1–E13 đều có ca LS tương ứng.
2. Không chỗ trống TBD.
3. Tên nhất quán: `docTepLuat`, `quet`, `dem`, `luat_ma`, `luat_nap`, `pham_luat`, `sua_tep_luat.{may,nguoi}`, `ctx.luat.{co_tep,cham,verified_commit,da_qua}`.
4. Review Focus: năm mục, mỗi mục gắn vào ca của task sở hữu.
