# Bộ lọc paths đóng mặc định — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `staleByPaths` chỉ bớt tệp khi mọi mục `paths` của hồ sơ thuộc dạng đã chứng trên danh sách tệp git của bản đang kiểm; lưới trước-merge và làn ghim lại truyền danh sách đó; làn đọc `paths` bằng một nguồn.

**Architecture:** Hai hàm thuần mới trong `lib/evidence-core.cjs` (`dungCayPaths`, `phanLoaiMucPaths`), `staleByPaths` nhận `opts.cay`. Bên gọi tự dựng cây bằng `git ls-files -z` (lib không gọi git, không đọc đĩa). Làn bỏ `pathsCuaEval` và dùng bộ đọc + bộ phân loại của lib. Đo bằng bộ răng hồ sơ `rang.sh` chín chân.

**Tech Stack:** Node ≥ 18 (CommonJS lib, ESM script), bash, git.

**Spec:** `docs/superpowers/specs/2026-10-06-loc-paths-dong-mac-dinh-design.md` · hợp đồng `_acceptance/loc-paths-dong-mac-dinh/contract.md` (đã duyệt 06/10).

## Global Constraints

- Ma trận D sống ở bảng của `contract.md` (19 ô). Bộ răng RÚT bảng đó khi chạy (`rang/ma-tran-d.mjs`), không chép tay; số ô hằng `19`.
- Bản base cho mọi phép vi phân: `git archive 892755ec6014ccc4312afddca594c77ac2ce416c scripts lib feature-loop` (nhánh chính lúc S3 bắt đầu, mốc 2.23.0), với `set -o pipefail`; GHIM sha, không dùng merge-base.
- **Dòng tiêm của bộ răng vòng `lan-ghim-lai-theo-paths` phải còn nguyên, mỗi chuỗi đúng MỘT lần:** `function staleByPaths(staleFiles, evalsText, opts = {}) {` (lib) · `if (staleScope === 'paths' && doiSlug.length) {` (làn) · `, khi: 'stale_scope=paths' }` (làn, chỉ hàng `staleByPaths`). Hàng điều kiện mới viết `khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' }`.
- Lib tự đứng ở kho tiêu thụ: không `require` tệp ngoài `INIT-CI-COPY-LIST`, không `child_process`, không `fs` trong hai hàm mới.
- Mọi thư mục tạm của bộ răng được dọn: `process.on('exit', …rmSync)` (bài học Ngoài-1 mốc 2.23.0).
- Mã lý do (nguồn duy nhất là khối marker `PATHS-LY-DO` trong lib): `evals-hong` · `dang-khai-la` · `paths-khong-tro-toi-tep` · `thieu-cay`. Mục rỗng giữ lý do trần `evals-hong` (ca SBP hiện có); các mã khác có dạng `<mã>:<id eval>:<mục>`.
- Kho không bật khoá: lưới trước-merge không gọi bộ lọc → đầu ra không đổi byte.

## Review Focus

1. Tên tệp có dấu: git in đường dẫn trong ngoặc khi không dùng `-z`; cây phải dựng bằng `ls-files -z` để `src/tài.js` khớp đúng (ô D6) — test ở Task 2 bước 1 (hồ sơ D6 qua lưới trước-merge).
2. Hồ sơ nằm ở thư mục con (`--root pkg/a`): cây phải tương đối gốc kho của hồ sơ, cùng gốc với `paths` — test ở Task 2 (kho có tiền tố `pkg/a/`).
3. Tệp bị xoá trong chính diff: mục khai đúng tệp ấy phải rơi về luật cũ — test ở Task 1 (AC-4 b).
4. Glob `**` trần (cả kho): kết bằng `**` → bước 3, khớp ≥ 1 tệp → nhận — ca SBP mới ở Task 1.
5. `git ls-files` lỗi ở lưới trước-merge: NOTE `thieu-cay`, luật cũ giữ nguyên, không xanh — test ở Task 2 (AC-4 d).

---

### Task 1: Bộ phân loại và bộ lọc trong lib (AC-1, AC-2, AC-4 a–c)

**Phục vụ:** E1, E2, E4 (vế a–c) · **independent:** false (mọi task sau dùng API này)

**Files:**
- Modify: `lib/evidence-core.cjs` (khối «Hoá cũ theo paths», ~dòng 374–466; `module.exports` ~dòng 1276)
- Modify: `tests/scripts/stale-by-paths.test.mjs`
- Create: `_acceptance/loc-paths-dong-mac-dinh/rang/kho.mjs`, `rang/ma-tran-d.mjs`, `rang/chan-lib.mjs`

**Interfaces:**
- Produces: `dungCayPaths(files: string[]) → { tep: Set, thuMuc: Set, dsTep: string[], dsThuMuc: string[] }` · `phanLoaiMucPaths(muc: string, cay) → { nhan: true, glob: string } | { nhan: false, ma: string }` · `staleByPaths(staleFiles, evalsText, { prefix?, cay? }) → { apply, reason, kept, skipped }` · `PATHS_LY_DO: string[]`.
- `rang/ma-tran-d.mjs` produces `MA_TRAN_D: { id, muc: string[]|{evals:[{id,muc}]}, doi: string[], ketLuan: string, kept: string[] }[]` và `D_SO_O = 19`, `CAY_D: string[]`.
- `rang/kho.mjs` produces `dungKho({ staleScope?, hoSo: [{ slug, evals: [{ id, executor, paths: string[] }] }], tep: string[], prefix? }) → { R, AR, git(...a), doi(files), xoa(files), don() }` (pin ghi bằng `repin-lane.mjs --write` thật), `chayPremerge(engine, kho, args?)`, `chayLan(engine, kho, slug, args?, agRoot?)`, `banSao(sua[], goc?)`, `banBase()`.

- [ ] **Step 1: Viết `rang/ma-tran-d.mjs` rút bảng từ contract**

```js
// Rút ma trận D từ bảng của contract.md (nguồn đã duyệt) — không chép tay.
import { readFileSync } from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HO_SO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const D_SO_O = 19;
export const CAY_D = ['src/a.js', 'src/tài.js', 'src/a b.js', 'src/sub/c.js', 'app/[slug]/(app)/page.tsx', 'other/z.js'];
const ma = (o) => [...o.matchAll(/`([^`]*)`/g)].map(m => m[1]);
export function rutMaTran() {
  const t = readFileSync(path.join(HO_SO, 'contract.md'), 'utf8');
  const rows = t.split('\n').filter(l => /^\| D\d+ \|/.test(l));
  return rows.map(l => {
    const c = l.split(' | ').map(s => s.replace(/^\| ?| ?\|$/g, '').trim());
    const id = c[0];
    const doi = c[2].includes('tệp ấy') ? ma(c[1]).slice(0, 1).concat('other/z.js') : ma(c[2]).concat(c[2].includes('mồi') ? ['other/z.js'] : []);
    return { id, muc: ma(c[1]), doi: [...new Set(doi)], ketLuan: c[3], kept: c[4] === '—' ? [] : (c[4].includes('tệp ấy') ? ma(c[1]).slice(0, 1) : ma(c[4])) };
  });
}
```

D18 (hai eval) đọc riêng: cột 1 có `E1` và `E2` → `evals: [{id:'E1', muc:['src/**']}, {id:'E2', muc:['src/sub/']}]`. D7/D8: `ma()` trả `""` và `"   "` từ chuỗi có nháy kép trong bảng, bóc nháy.

- [ ] **Step 2: Viết `rang/kho.mjs`** — kho git tạm, hồ sơ đã ký, pin do `repin-lane.mjs --write` của KIT ghi (cùng nếp `lan-ghim-lai-theo-paths/rang/kho-mau.mjs`), `doi(files)` nối một dòng vào mỗi tệp rồi commit, `xoa(files)` xoá rồi commit, `don()` + `process.on('exit')` dọn. `banBase()` chạy `bash -c 'set -o pipefail; git -C "$1" archive "$2" scripts lib feature-loop | tar -x -C "$3"'` với sha ghim ở Global Constraints. `banSao(sua)` chép `scripts lib feature-loop` rồi thay chuỗi, ném lỗi «tiêm hụt» khi chuỗi xuất hiện khác đúng một lần.

- [ ] **Step 3: Viết chân `ma-tran`, `doi-chung-crm`, `cay` trong `rang/chan-lib.mjs`**

```js
// ma-tran (AC-1)
const M = rutMaTran(); ok(M.length === D_SO_O, `số ô lệch: ${M.length} ≠ ${D_SO_O}`);
const chay = (core) => M.map(o => { const r = core.staleByPaths(o.doi, evalsCua(o), { cay: core.dungCayPaths(CAY_D) });
  const dung = o.ketLuan.startsWith('nhận') ? (r.apply && same(r.kept, o.kept)) : (!r.apply && r.reason.startsWith(maCua(o.ketLuan)) && (maCua(o.ketLuan) === 'evals-hong' || r.reason.includes(o.muc.at(-1))));
  return { id: o.id, dung }; });
const lanh = chay(core); ok(lanh.every(x => x.dung), `đối chứng dương: ${lanh.filter(x => !x.dung).map(x => x.id)}`);
const lech = (sao) => chay(require(path.join(sao, 'lib/evidence-core.cjs'))).filter(x => !x.dung).map(x => x.id);
const l1 = lech(banSao([{ tep: 'lib/evidence-core.cjs', tu: 'const pl = phanLoaiMucPaths(muc, cay);', thanh: 'const pl = { nhan: true, glob: muc };' }]));
console.log(`bỏ phân loại → lệch ${l1.length} ô: ${l1}`); ok(['D4','D12'].every(d => l1.includes(d)), 'bỏ qua thầm');
const l2 = lech(banSao([{ tep: 'lib/evidence-core.cjs', tu: 'const res = globs.map(pathGlobToRe);', thanh: 'const res = globs.map(() => /^$a/);' }]));
console.log(`khớp rỗng → lệch ${l2.length} ô: ${l2}`); ok(['D1','D3','D5','D6'].every(d => l2.includes(d)), 'kept rỗng');
```

`doi-chung-crm` (AC-2): `dungKho` với mỗi ô D1–D17, D19 là hồ sơ `d<n>`; chép `lib/evidence-core.cjs`, `lib/eval-yaml.cjs` của KIT vào `<kho>/lib/` và `rang/doi-chung-crm/kiem-paths-dong.mjs` vào `<kho>/scripts/`; chạy lưới (`node scripts/kiem-paths-dong.mjs`), gom hồ sơ ở dòng `LỖI`/`CẢNH BÁO`; chạy `staleByPaths(['x'], evals, { cay: dungCayPaths(git ls-files -z) })` từng hồ sơ; assert `lưới − từChối = {d4}`, `từChối − lưới = {d15, d17, d19}`, số dòng `LỖI` ≥ 7. Chiều đỏ: `banSao` thay `v.endsWith('/')` bằng `false` → hiệu thứ nhất `{d4, d12}`, ghim «lưới crm chặn mà bộ lọc nhận: D12».

`cay` vế a–c (AC-4): (a) cây `['src/a.js']`, đĩa có thư mục chưa theo dõi `vendor/` (tạo trong kho), mục `vendor` → `paths-khong-tro-toi-tep`; đối chứng dương: `git add vendor` rồi dựng cây lại → nhận. (b) mục `src/old.js`, diff xoá `src/old.js` (tệp có ở pin, mất ở cây) → `paths-khong-tro-toi-tep`. (c) không truyền `cay` → `thieu-cay`. Chiều đỏ (a): bản sao lib thay thân `dungCayPaths` bằng đọc đĩa (`fs.readdirSync` đệ quy) → (a) nhận, ghim «cây đọc từ đĩa».

- [ ] **Step 4: Chạy để thấy ĐỎ trên lib hiện tại**

Run: `bash _acceptance/loc-paths-dong-mac-dinh/rang.sh --chan ma-tran`
Expected: FAIL «core.dungCayPaths is not a function» (lib chưa có hàm). Ghi đầu ra vào commit message.

- [ ] **Step 5: Cài đặt trong lib** (giữ NGUYÊN dòng `function staleByPaths(staleFiles, evalsText, opts = {}) {`)

```js
// <<<PATHS-LY-DO
const PATHS_LY_DO = ['evals-hong', 'dang-khai-la', 'paths-khong-tro-toi-tep', 'thieu-cay'];
// PATHS-LY-DO>>>
function dungCayPaths(files) {
  const tep = new Set(), thuMuc = new Set();
  for (const f of files || []) { if (!f) continue; tep.add(f); const p = f.split('/'); for (let i = 1; i < p.length; i++) thuMuc.add(p.slice(0, i).join('/')); }
  return { tep, thuMuc, dsTep: [...tep], dsThuMuc: [...thuMuc] };
}
function phanLoaiMucPaths(muc, cay) {
  const v = String(muc == null ? '' : muc);
  if (!v.trim()) return { nhan: false, ma: 'evals-hong' };
  if (/[\\\s]/.test(v) || /^(\.{1,2}\/|\/)/.test(v) || v.endsWith('/')) return { nhan: false, ma: 'dang-khai-la' };
  if (/[*?]/.test(v)) {
    const re = pathGlobToRe(v), coTep = cay.dsTep.some(f => re.test(f));
    if (v === '**' || v.endsWith('/**')) return coTep ? { nhan: true, glob: v } : { nhan: false, ma: 'paths-khong-tro-toi-tep' };
    if (cay.dsThuMuc.some(d => re.test(d))) return { nhan: false, ma: 'dang-khai-la' };
    return coTep ? { nhan: true, glob: v } : { nhan: false, ma: 'paths-khong-tro-toi-tep' };
  }
  if (cay.tep.has(v)) return { nhan: true, glob: v };
  if (cay.thuMuc.has(v)) return { nhan: true, glob: v + '/**' };
  return { nhan: false, ma: 'paths-khong-tro-toi-tep' };
}
```

Trong `staleByPaths`: gom `[{ id, muc }]` thay vì `globs` trần; sau `if (!globs.length) return cu('hop-paths-rong');` thêm `if (!opts.cay) return cu('thieu-cay');` rồi vòng phân loại — `const pl = phanLoaiMucPaths(muc, cay);` (dòng tiêm của Step 3), mục bị từ chối → `cu(pl.ma === 'evals-hong' ? 'evals-hong' : \`${pl.ma}:${id}:${muc}\`)`; `globs` = các `pl.glob`; giữ nguyên dòng `const res = globs.map(pathGlobToRe);`. Bỏ dòng `globs.some(g => !String(g || '').trim())` (bước 1 thay nó). Thêm ba tên vào `module.exports`.

- [ ] **Step 6: Cập nhật `tests/scripts/stale-by-paths.test.mjs`** — mọi lời gọi `apply: true` truyền `{ cay: core.dungCayPaths([...tệp của ca]) }`; thêm `SBP12 không cây → thieu-cay`, `SBP13 '**' trần nhận`, `SBP14 thư mục trần có thật → giữ tệp bên trong`.

- [ ] **Step 7: Chạy xanh**

Run: `bash _acceptance/loc-paths-dong-mac-dinh/rang.sh --chan ma-tran && bash _acceptance/loc-paths-dong-mac-dinh/rang.sh --chan doi-chung-crm && bash _acceptance/loc-paths-dong-mac-dinh/rang.sh --chan cay && node tests/scripts/stale-by-paths.test.mjs`
Expected: PASS cả bốn; dòng in «bỏ phân loại → lệch N ô» với N ≥ 2.

- [ ] **Step 8: Commit** `feat(loc-paths-dong-mac-dinh): bộ phân loại mục paths + staleByPaths nhận cây (AC-1, AC-2, AC-4)`

---

### Task 2: Lưới trước-merge truyền cây (AC-3, AC-4 d, AC-7 vế lưới)

**Phục vụ:** E3, E4 (vế d), E7 · **independent:** false (cần Task 1)

**Files:**
- Modify: `scripts/pre-merge-check.sh` (khối `if [ -n "$stale" ] && [ "$STALE_SCOPE" = paths ]`, ~dòng 1368–1400)
- Create: `_acceptance/loc-paths-dong-mac-dinh/rang/chan-premerge.mjs`

**Interfaces:**
- Consumes: `staleByPaths(files, evals, { prefix, cay })`, `dungCayPaths(files)` (Task 1); `dungKho`, `chayPremerge`, `banBase`, `banSao` (`rang/kho.mjs`).

- [ ] **Step 1: Viết chân `truoc-merge`** — (a) kho khoá `paths`, hồ sơ `src/sub`, diff `src/sub/c.js` → KIT: stdout có `VIOLATION [feat]: evidence is stale` và `src/sub/c.js`, mã 1; BASE cùng kho → không có dòng VIOLATION hoá cũ (lỗ có thật). (b) mỗi ô D7–D17, D19 một kho: VIOLATION hoá cũ + dòng `NOTE [feat]: bộ lọc paths không áp (<mã>:E1:<mục>)` khớp đúng mục. (c) `src/sub`, diff `other/z.js` → không VIOLATION hoá cũ, có `NOTE [feat]: hoá cũ theo luật cũ, bỏ qua theo paths: 1 tệp`. Thêm ca D6 (tên có dấu) và ca tiền tố `pkg/a/`. Chiều đỏ: `banSao` thay `echo "NOTE [$slug]: bộ lọc paths không áp` bằng `: "` → ghim «từ chối im lặng».

- [ ] **Step 2: Viết vế (d) của chân `cay`** — bản sao `pre-merge-check.sh` thay `git -C "$ROOT" ls-files -z` bằng `false` → NOTE `thieu-cay`, VIOLATION luật cũ còn.

- [ ] **Step 3: Viết vế lưới của chân `doc-cu`** — khoá vắng, ô D1–D3: stdout + mã thoát KIT bằng hệt BASE, VÀ mỗi kịch bản mã 1 với đúng một `VIOLATION [feat]: evidence is stale` (ghim kết cục; bằng nhau mà sai → «vi phân rỗng»). Chiều đỏ: bản sao đổi `STALE_SCOPE=all` mặc định thành `paths` → khác, ghim «đổi mặc định».

- [ ] **Step 4: Chạy ĐỎ** — Run: `bash _acceptance/loc-paths-dong-mac-dinh/rang.sh --chan truoc-merge` · Expected: FAIL ở (a) (lưới chưa truyền cây → `thieu-cay` → luật cũ, NOTE «không áp (thieu-cay)» thay vì nhận `src/sub`) và ở (c).

- [ ] **Step 5: Cài đặt** — trước vòng hồ sơ, khi `STALE_SCOPE=paths` và `STALE_ALL=0`:

```bash
_sbp_cay="$(mktemp 2>/dev/null || echo "/tmp/pmc-cay.$$")"
git -C "$ROOT" ls-files -z > "$_sbp_cay" 2>/dev/null || : > "$_sbp_cay.loi"
```

trong `node -e` thêm đối số thứ tư `"$_sbp_cay"` và:

```js
let cay=null; try{ if(!fs.existsSync(process.argv[4]+".loi")) cay=l.dungCayPaths(fs.readFileSync(process.argv[4],"utf8").split("\0").filter(Boolean)) }catch(_){}
process.stdout.write(JSON.stringify(l.staleByPaths(files,ev,{prefix:process.argv[3],cay})));
```

`trap` dọn `"$_sbp_cay" "$_sbp_cay.loi"` khi thoát. Không đổi chữ ba dòng NOTE hiện có.

- [ ] **Step 6: Chạy xanh** — `rang.sh --chan truoc-merge`, `--chan cay`, `--chan doc-cu` (vế lưới) · Expected: PASS.

- [ ] **Step 7: Bộ răng chị em còn xanh** — Run: `for c in doc-cu nhay-dac-hieu chi-thu hinh-ho-so khong-chay-duoc khoa-va-co; do bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan $c || echo "DO $c"; done` · Expected: không dòng `DO`.

- [ ] **Step 8: Commit** `feat(loc-paths-dong-mac-dinh): lưới trước-merge dựng cây git một lần, truyền cho bộ lọc (AC-3, AC-4d)`

---

### Task 3: Làn ghim lại một nguồn (AC-5, AC-6, AC-7 vế làn, AC-8)

**Phục vụ:** E5, E6, E7, E8 · **independent:** false (cần Task 1)

**Files:**
- Modify: `feature-loop/scripts/repin-lane.mjs` (bảng `AG-ENGINE-TABLE` ~dòng 108–130; `--skip-unchanged` ~dòng 440–446; `pathsCuaEval` + `chamTuPin` ~dòng 474–530; hậu tố `ngoài làn máy` ~dòng 659)
- Create: `_acceptance/loc-paths-dong-mac-dinh/rang/chan-lan.mjs`; thêm chân `mot-nguon` vào `rang/chan-premerge.mjs`

**Interfaces:**
- Consumes: `core.evalPathsOf`, `core.dungCayPaths`, `core.phanLoaiMucPaths`, `core.pathGlobToRe`, `core.staleByPaths(…, { prefix, cay })`.

- [ ] **Step 1: Viết chân `mot-nguon`** — 19 ô × hai diff (tệp đổi của ô · chỉ `other/z.js`), khoá `paths`: «lưới có VIOLATION hoá cũ» ⇔ «làn KHÔNG bỏ qua» ở 38/38 lượt (hằng). Chiều đỏ: bản sao làn thay `{ prefix: tienToGit, cay }` bằng `{ prefix: tienToGit }` → tập lượt lệch in ra, phải chứa `D4/chỉ-mồi`, ghim «làn mù cây».

- [ ] **Step 2: Viết chân `lan-mot-bo-doc`** — hồ sơ có `E1 script src/**` và `E2 ui-check` với `paths` (i) khối `- "ui/a/**"`, dòng trống, `# ghi chú`, `- "ui/b/**"`, diff `ui/b/x.tsx`; (ii) `ui/b` (thư mục có thật), diff `ui/b/x.tsx`; (iii) `./ui/**`, diff `ui/b/x.tsx` → dòng pin mới có `"evals_not_machine_touched":["E2"]` cả ba. Trên 19 ô (ô ui-check mang mục của ô): tập id KIT ⊇ tập id BASE, mã thoát và «có ghi pin» bằng nhau. Chiều đỏ: bản sao làn thay `const gl = core.evalPathsOf(s.evalsText, id) || [];` bằng bộ đọc cũ (chép thân `pathsCuaEval` từ BASE) → (i) thiếu `E2`, ghim «bộ đọc riêng».

- [ ] **Step 3: Viết chân `bo-may-cu`** — bản sao KIT gỡ `phanLoaiMucPaths,` khỏi `module.exports` làm `--ag-root`. Khoá `paths`: làn thoát khác 0, stderr có `phanLoaiMucPaths` và `cần ≥`, `git status --porcelain` của kho rỗng. Khoá vắng, hồ sơ có ô ui-check: làn thoát 0, ghi pin, dòng pin KHÔNG có `evals_not_machine_touched`, stderr đúng một dòng `bộ máy thiếu phanLoaiMucPaths — không tính được ô ngoài làn máy có vật đổi`. Đối chứng dương: bộ máy đủ → có `evals_not_machine_touched`. Chiều đỏ: bản sao làn đổi `khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' }` thành ` }` ở hàng `phanLoaiMucPaths` → ca khoá vắng thoát khác 0, ghim «khoá vắng mà đòi bộ máy mới».

- [ ] **Step 4: Viết vế làn của chân `doc-cu`** — khoá vắng, D1–D3: `--skip-unchanged` và `--reason x --write` KIT bằng hệt BASE (stdout, stderr chuẩn hoá thời gian/sha, dòng run-log mới), VÀ ghim kết cục: `--skip-unchanged` sau diff `src/a.js` → stderr có `làn chạy trọn`; `--write` thoát 0 với đúng một dòng `"kind":"repin"` mới.

- [ ] **Step 5: Chạy ĐỎ** — `rang.sh --chan mot-nguon` · Expected: FAIL (làn chưa truyền cây → `thieu-cay` → làn không bỏ qua ở ô lưới nói «bỏ qua»).

- [ ] **Step 6: Cài đặt**

Bảng — thêm sau hàng `staleByPaths` (hàng `staleByPaths` giữ nguyên):

```js
  { file: 'lib/evidence-core.cjs', name: 'evalPathsOf', kind: 'function', since: '2.21.0', why: 'làn gọi (đọc paths một nguồn)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' },
  { file: 'lib/evidence-core.cjs', name: 'dungCayPaths', kind: 'function', since: '2.24.0', why: 'làn gọi (cây git cho bộ lọc)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' },
  { file: 'lib/evidence-core.cjs', name: 'phanLoaiMucPaths', kind: 'function', since: '2.24.0', why: 'làn gọi (phân loại mục paths)', khi: 'stale_scope=paths', vong: 'loc-paths-dong-mac-dinh' },
```

Cây — một lần, lười: `let _cay; const cayHead = () => (_cay ??= core.dungCayPaths(gitRaw('ls-files', '-z').split('\0').filter(Boolean)));`. `--skip-unchanged`: `core.staleByPaths(doiSlug, …, { prefix: tienToGit, cay: cayHead() })`.

`chamTuPin` — xoá `pathsCuaEval`; đầu hàm sau `if (!s.ngoaiMay.length) return [];`:

```js
  const thieu = ['evalPathsOf', 'dungCayPaths', 'phanLoaiMucPaths'].find(n => typeof core[n] !== 'function');
  if (thieu) { log(`bộ máy thiếu ${thieu} — không tính được ô ngoài làn máy có vật đổi`); return []; }
```

vòng ô: `const gl = core.evalPathsOf(s.evalsText, id) || [];` · `if (!gl.length) continue;` · `const pl = gl.map(m => core.phanLoaiMucPaths(m, cayHead()));` · `if (pl.some(x => !x.nhan)) { if (doi.length) cham.push(id); continue; }` · `const res = pl.map(x => core.pathGlobToRe(x.glob));`. Hậu tố `ngoài làn máy` (dòng ~659) đổi `pathsCuaEval(s.evalsText, id).length` thành `(core.evalPathsOf ? core.evalPathsOf(s.evalsText, id) : null)`. Giữ `import { globToRe } from './carry-plan.mjs'` (vẫn dùng cho `t1_skip_globs`).

- [ ] **Step 7: Chạy xanh** — `rang.sh --chan mot-nguon`, `lan-mot-bo-doc`, `bo-may-cu`, `doc-cu` · Expected: PASS.

- [ ] **Step 8: Bộ răng chị em và test làn còn xanh** — Run: `for c in mot-nguon lan-doc-cu song-song loi-khong-xen; do bash _acceptance/lan-ghim-lai-theo-paths/rang.sh --chan $c || echo "DO $c"; done; node tests/scripts/repin-lane-lop-cu.test.mjs; node tests/scripts/repin-lane-noi-ra.test.mjs; node tests/scripts/repin-lane-skip-unchanged.test.mjs` · Expected: không `DO`, ba test thoát 0.

- [ ] **Step 9: Commit** `feat(loc-paths-dong-mac-dinh): làn ghim lại đọc paths một nguồn, truyền cây cho bộ lọc (AC-5–AC-8)`

---

### Task 4: Tài liệu theo mã lý do (AC-9)

**Phục vụ:** E9 · **independent:** false (cần khối `PATHS-LY-DO` của Task 1)

**Files:**
- Modify: `GUIDE.md` (đoạn `risk_tiers.stale_scope: paths`, ~dòng 1321–1330)
- Modify: `CHANGELOG.md` (mục mới `## Chưa phát hành` trên `## 2.23.0`)
- Modify: `commands/acceptance-init.md` (ba dòng chú thích `stale_scope`, ~dòng 85)
- Create: `_acceptance/loc-paths-dong-mac-dinh/rang/chan-tai-lieu.mjs`

- [ ] **Step 1: Viết chân `tai-lieu`** — rút `PATHS_LY_DO` từ khối marker `PATHS-LY-DO` của lib (regex trên tệp, không `require`); rút đoạn GUIDE từ dòng bắt đầu `` `risk_tiers.stale_scope: paths` `` tới dòng trống kế; assert mọi mã có trong đoạn, đoạn không chứa `Chưa bật \`stale_scope: paths\` ở kho nào`; CHANGELOG có `## Chưa phát hành` đứng trên `## 2.23.0` và mục đó chứa `stale_scope`. Chiều đỏ: bản sao lib thêm `'ma-thu'` vào khối → ghim «mã thiếu trong GUIDE: ma-thu».
- [ ] **Step 2: Chạy ĐỎ** — `rang.sh --chan tai-lieu` · Expected: FAIL «mã thiếu trong GUIDE: dang-khai-la».
- [ ] **Step 3: Viết đoạn GUIDE** — thay câu «Chưa bật…» bằng: điều kiện bật (kho đã ở bản mang vòng này) + bảng bốn mã · kho gặp mã làm gì (`dang-khai-la` → viết lại mục: bỏ `./` `/` đầu, `/` cuối, `\`, khoảng trắng; glob khớp thư mục → thêm `/**`; `paths-khong-tro-toi-tep` → trỏ lại tệp đã dời hoặc bỏ mục; `evals-hong` → sửa mục rỗng; `thieu-cay` → bên gọi đời cũ hoặc `git ls-files` lỗi, cập nhật lớp chép). CHANGELOG `## Chưa phát hành`: một mục nêu hành vi mới, kho không bật khoá không đổi, crm gỡ lưới tạm `kiem-paths-dong.mjs` + bước CI «Paths đóng mặc định» khi nhận. `acceptance-init.md`: đổi «optional (2.21)» thành «optional (2.24)…mục khai lạ → hồ sơ giữ luật cũ, NOTE gọi tên».
- [ ] **Step 4: Chạy xanh** — `rang.sh --chan tai-lieu` · Expected: PASS.
- [ ] **Step 5: Commit** `docs(loc-paths-dong-mac-dinh): GUIDE §7.1 nêu bốn mã lý do và điều kiện bật; CHANGELOG chưa phát hành (AC-9)`

---

### Task 5: Chốt S3

**independent:** false

- [ ] **Step 1:** Chạy chín chân: `for c in ma-tran doi-chung-crm truoc-merge cay mot-nguon lan-mot-bo-doc doc-cu bo-may-cu tai-lieu; do bash _acceptance/loc-paths-dong-mac-dinh/rang.sh --chan $c || echo "DO $c"; done` · Expected: không `DO`.
- [ ] **Step 2:** Chạy mười chân vòng `lan-ghim-lai-theo-paths` (lệnh ở Task 2 Step 7 + Task 3 Step 8) · Expected: không `DO`.
- [ ] **Step 3:** `node scripts/product-map.mjs --root . --check` và `bash scripts/pre-merge-check.sh --base origin/main` · Expected: khớp · `clean`.
- [ ] **Step 4:** Đặt contract `status: implemented`, commit `acceptance(loc-paths-dong-mac-dinh): hồ sơ implemented`, rồi vào S4.
