# Đường nền không tính tệp của vòng — kế hoạch thực thi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dòng `CAY BAN SAU SUITE` mang đường của chính vòng và `VIOLATION [<slug>]` của chính hồ sơ ghi vào mục mới «Dòng vàng» của `duong-nen.md`, không lật nền sang đỏ.

**Architecture:** Vị từ «tệp của vòng» sống ở một mô-đun riêng (`feature-loop/scripts/lib/tep-cua-vong.mjs`) để script và ca phát lại lịch sử gọi cùng một hàm. `duong-nen.mjs` phân loại dòng mới của chân suite và dòng VIOLATION của chân lưới qua vị từ đó; khuôn mục «Dòng vàng» và mã dòng vàng rút từ marker mới trong `duong-nen-template.md`. `gate-card.js` đọc thêm mục vàng và in nó dưới nhãn riêng trong khối «Nền hạ tầng».

**Tech Stack:** Node ≥ 20 (ESM `.mjs` cho script feature-loop, CJS cho `gate-card.js`), bash, git. Không phụ thuộc mới.

**Spec:** `docs/superpowers/specs/2026-10-14-nen-khong-tinh-tep-cua-vong-design.md` · hợp đồng `_acceptance/nen-khong-tinh-tep-cua-vong/contract.md` · `evals.yaml` cùng thư mục.

## Global Constraints

- Không worktree, không khoá cấu hình mới, không đổi mã thoát (0 xanh · 1 đỏ · 2 không chạy được).
- Đánh đổi chiều đỏ DUY NHẤT: `_acceptance/config.yaml` thành vàng. Mọi thứ khác không của vòng giữ đỏ như 2.30.0.
- Khuôn tệp và mã dòng một nguồn ở `skills/acceptance/references/duong-nen-template.md`; mã vắng → thoát 2, không ghi tệp.
- Mọi ca đo: fixture do code sinh trong lượt (`tests/scripts/duong-nen-fixture.mjs`), đối chứng dương chạy trước, thông điệp ghim; bản base so sánh rút bằng `git archive v2.30.0 <trọn thư mục>`.
- Đường dẫn trong test suy từ vị trí script (`KIT` của fixture), không hardcode.
- Không sửa khoá executor có từ trước vòng (`ncb_cay_ban`, `nme_moi_truong`, `ndk_nen_dieu_kien`, `tcc_the_nen`) — AC-9 chạy chúng nguyên trạng.

## Review Focus

1. Slug chứa `.` (slug hợp lệ `[A-Za-z0-9._-]`) — vị từ phải thoát regex; `a.b` không được khớp `aXb`. Ca thêm vào Task 1.
2. Đường porcelain đổi tên `R  cu -> moi` — script đã cắt lấy đường MỚI trước khi gọi vị từ, nên vị từ chỉ nhận đường đơn; ca NEN-TV8b thêm một ô `tepCuaVong('_acceptance/<slug>/a.md', …)` cho chắc đường đã cắt khớp vế 1 (suite không đổi tên tệp đã theo dõi trong fixture nào, nên không dựng ca đổi tên đầu-cuối).
3. Lưới in VIOLATION với chữ `[<slug>]` ở GIỮA dòng (vd `VIOLATION [demo]: … _acceptance/<slug>/ …`) — chỉ tiền tố `VIOLATION [<slug>]:` mới là của vòng. Ca TV5 (b) có slug trong thân dòng.
4. Mục «Dòng vàng» vắng ở tệp đời trước — mọi bên đọc (gate-card Cổng 1, Cổng 2, hàm `bullets` của test) phải coi là rỗng, không lỗi. Ca GN-TV2.
5. Hàm `bullets()` hiện có của `duong-nen.test.mjs` đọc từ «## Dòng đỏ» tới HẾT tệp — tệp mới có thêm bullet «không có» của mục vàng làm ca cũ đếm sai. Sửa hàm dừng ở tiêu đề kế (Task 2), chạy lại toàn bộ ca cũ.

---

### Task 1: Vị từ «tệp của vòng» + ca phát lại lịch sử (AC-10)

**Phục vụ:** E10 · **independent:** false (Task 3, 4, 5 dùng)

**Files:**
- Create: `feature-loop/scripts/lib/tep-cua-vong.mjs`
- Test: `tests/scripts/duong-nen.test.mjs` (ca NEN-TV8, đặt cuối tệp trước `donDep()`)
- Data: `tests/scripts/fixtures/duong-nen-cay-ban-lich-su.tsv` (đã có từ S1, 230 dòng)

**Interfaces:**
- Produces: `export function tepCuaVong(duong, slug, coOHead) → boolean` — `duong` tương đối gốc kho, dấu `/`; `coOHead(thuMuc) → boolean` cho vế 4. `export function viPhamCuaVong(dong, slug) → boolean` — dòng bắt đầu đúng `VIOLATION [${slug}]:`.

- [ ] **Step 1: Viết ca NEN-TV8 (đỏ vì mô-đun chưa có)**

```js
// ── NEN-TV8 — phát lại 230 dòng CAY BAN lịch sử thật qua CHÍNH vị từ (hồ sơ nen-khong-tinh-tep-cua-vong AC-10) ──
{
  const TSV = path.join(KIT, 'tests', 'scripts', 'fixtures', 'duong-nen-cay-ban-lich-su.tsv');
  let mod = null;
  try { mod = await import(path.join(KIT, 'feature-loop', 'scripts', 'lib', 'tep-cua-vong.mjs')); } catch (e) { bad('NEN-TV8 khong nap duoc lib/tep-cua-vong.mjs', String(e.message || e)); }
  const dong = existsSync(TSV) ? readFileSync(TSV, 'utf8').split('\n').filter(l => l && !l.startsWith('#')) : [];
  if (mod && dong.length !== 230) bad('NEN-TV8 tep du lieu phai co dung 230 dong', `${dong.length}`);
  else if (mod) {
    const dem = {};
    const goc = [];
    for (const l of dong) {
      const [slug, lop, duong] = l.split('\t');
      const v = mod.tepCuaVong(duong, slug, () => false);
      const k = `${lop}:${v ? 'vang' : 'do'}`; dem[k] = (dem[k] || 0) + 1;
      if (slug === 'dai-luu-tru-dung-chung') goc.push(v);
    }
    const bang = JSON.stringify(dem);
    const mong = { 'GIA-S1:vang': 197, 'KHAC:vang': 3, 'KHAC:do': 26, 'CAT:do': 4 };
    const lech = Object.entries(mong).filter(([k, n]) => dem[k] !== n).concat(Object.keys(dem).filter(k => !(k in mong)).map(k => [k, 0]));
    if (lech.length) bad('NEN-TV8 dem lop lech', `${bang} — mong ${JSON.stringify(mong)}`);
    else if (goc.length !== 7 || goc.some(x => !x)) bad('NEN-TV8 ca Goc dai-luu-tru-dung-chung phai 7/7 vang', JSON.stringify(goc));
    else ok(`NEN-TV8 phat lai 230 dong lich su — ${bang}, ca Goc 7/7 vang`);
  }
}
// ── NEN-TV8b — slug có dấu chấm thoát regex; tiền tố VIOLATION phải có «]:» ──
{
  const mod = await import(path.join(KIT, 'feature-loop', 'scripts', 'lib', 'tep-cua-vong.mjs')).catch(() => null);
  const loi = !mod ? 'khong nap duoc' : [
    [mod.tepCuaVong('docs/superpowers/specs/2026-10-14-a.b-design.md', 'a.b', () => false), true, 'a.b khop chinh no'],
    [mod.tepCuaVong('docs/superpowers/specs/2026-10-14-aXb-design.md', 'a.b', () => false), false, 'a.b khong khop aXb'],
    [mod.tepCuaVong('_acceptance/a.b-2/x.md', 'a.b', () => false), false, 'tien to thu muc'],
    [mod.tepCuaVong('apps/api/x.ts', 'api', d => d === 'apps/api'), false, 'thu muc co san o HEAD'],
    [mod.tepCuaVong('apps/proto/api/x.ts', 'api', d => d === 'apps/api'), true, 'thu muc moi bang slug'],
    [mod.viPhamCuaVong('VIOLATION [a.b]: x', 'a.b'), true, 'vi pham cua vong'],
    [mod.viPhamCuaVong('VIOLATION [a.b-2]: x', 'a.b'), false, 'vi pham tien to slug'],
    [mod.viPhamCuaVong('VIOLATION [demo]: … _acceptance/a.b/ …', 'a.b'), false, 'slug giua dong'],
  ].filter(([got, want]) => got !== want).map(([, , ten]) => ten).join(', ');
  if (loi) bad('NEN-TV8b vi tu sai o', loi); else ok('NEN-TV8b slug co dau cham, thu muc co san, tien to VIOLATION — 8/8 o dung');
}
```

- [ ] **Step 2: Chạy, thấy đỏ** — `node tests/scripts/duong-nen.test.mjs 2>&1 | grep -E "NEN-TV8"` → `FAIL: NEN-TV8 khong nap duoc lib/tep-cua-vong.mjs`.

- [ ] **Step 3: Viết mô-đun**

```js
// tep-cua-vong.mjs — vị từ «tệp của chính vòng» của đường nền (hồ sơ nen-khong-tinh-tep-cua-vong).
// MỘT chỗ: duong-nen.mjs và ca phát lại lịch sử (NEN-TV8) nhập cùng hàm. Vì sao không mất chiều đỏ:
// suite không biết slug (slug sinh ở S0, sau mọi suite đã viết), nên không thể ghi vào đường mang slug —
// trừ trùng tên với một thư mục có sẵn, vế 4 loại bằng câu hỏi «thư mục có ở HEAD không».
const thoat = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function tepCuaVong(duong, slug, coOHead) {
  const p = String(duong);
  if (p.startsWith(`_acceptance/${slug}/`)) return true;                       // 1. hồ sơ của vòng
  const ten = p.split('/').pop();
  if (new RegExp(`^\\d{4}-\\d{2}-\\d{2}-${thoat(slug)}(-design)?\\.md$`).test(ten)) return true; // 2. khuôn tên S1/S2
  if (p === '_acceptance/config.yaml') return true;                            // 3. khoá executor của vòng
  const doan = p.split('/').slice(0, -1);                                       // 4. thư mục MỚI bằng slug
  for (let i = 0; i < doan.length; i += 1) {
    if (doan[i] === slug && !coOHead(doan.slice(0, i + 1).join('/'))) return true;
  }
  return false;
}
export const viPhamCuaVong = (dong, slug) => String(dong).startsWith(`VIOLATION [${slug}]:`);
```

- [ ] **Step 4: Chạy, thấy xanh** — cùng lệnh → `PASS: NEN-TV8 …` và `PASS: NEN-TV8b …`.
- [ ] **Step 5: Commit** — `git add feature-loop/scripts/lib/tep-cua-vong.mjs tests/scripts/duong-nen.test.mjs && git commit -m "feat(duong-nen): vị từ tệp của vòng + ca phát lại 230 dòng lịch sử (NEN-TV8)"`

### Task 2: Khuôn mục «Dòng vàng» + bên viết theo mục (AC-6)

**Phục vụ:** E6, E1 (NEN0) · **independent:** false

**Files:**
- Modify: `skills/acceptance/references/duong-nen-template.md` (khối `DUONG-NEN-TEMPLATE` thêm mục; khối mới `DUONG-NEN-DONG-VANG`; một đoạn văn)
- Modify: `feature-loop/scripts/duong-nen.mjs` (đọc khối vàng, `dongVang()`, bên viết điền bullet theo mục)
- Modify: `tests/scripts/duong-nen.test.mjs` (hàm `bullets` dừng ở tiêu đề kế; thêm `bulletsVang`; ca NEN-TV7)

**Interfaces:**
- Produces: mảng `VANG` (chuỗi dòng vàng) trong `duong-nen.mjs`; hàm `dongVang(ma, vals)` cùng khuôn `dongDo`. Tệp ghi ra có `## Dòng vàng` sau `## Dòng đỏ`.

- [ ] **Step 1: Sửa `bullets` + thêm `bulletsVang` + ca NEN-TV7 (đỏ)**

```js
const muc = (tep, ten) => {
  const d = String(tep || '').split('\n'); const i = d.findIndex(l => l === `## ${ten}`);
  if (i < 0) return null;
  const sau = d.slice(i + 1); const j = sau.findIndex(l => /^#{1,6}\s/.test(l));
  return (j < 0 ? sau : sau.slice(0, j)).filter(l => l.startsWith('- ')).map(l => l.slice(2));
};
const bullets = tep => muc(tep, 'Dòng đỏ');
const bulletsVang = tep => muc(tep, 'Dòng vàng');
```

Ca NEN-TV7 (a) kho lành: `bulletsVang(r0.tep)` == `['không có']`, không dòng chứa `DUONG-NEN-`; (b)(d) bản sao ag-root (`tamDir` + `cpSync` trọn `skills`, `commands`, `lib` của KIT) gỡ đúng một dòng `- suite-tep-cua-vong:` / `- luoi-cua-vong:` (đếm số lần khớp = 1 trước khi gỡ, khác 1 → `bad('NEN-TV7 cho tiem lech')`) → mã 2, stderr chứa `khuôn dòng vàng thiếu mã «<mã>»`, `existsSync(r.tepPath) === false`; (c) gỡ trọn khối `<!-- <<<DUONG-NEN-DONG-VANG -->…<!-- DUONG-NEN-DONG-VANG>>> -->` → mã 2, stderr chứa `DUONG-NEN-DONG-VANG`, không tệp. Mỗi lượt dùng kho lành MỚI (`dungKho()`), đối chứng dương là lượt (a) trên cùng ag-root bản sao chưa gỡ → mã 0.

- [ ] **Step 2: Chạy, thấy đỏ** — NEN-TV7 FAIL (`bulletsVang` null: tệp chưa có mục).
- [ ] **Step 3: Sửa khuôn** — trong `DUONG-NEN-TEMPLATE`, sau bullet giữ chỗ dòng đỏ:

```
## Dòng vàng

- {nguyên văn một dòng của chính vòng — tệp vòng viết trong lúc nền chạy, vi phạm lưới của chính hồ sơ; không lật nền; không có thì đúng một bullet «không có»}
```

Khối mới sau `DUONG-NEN-DONG-DO`:

```
<!-- <<<DUONG-NEN-DONG-VANG -->
- suite-tep-cua-vong: `nen suite: TEP CUA VONG {tep} (khong tinh)`
- luoi-cua-vong: `nen luoi: {k} vi pham cua chinh vong (khong tinh)`
<!-- DUONG-NEN-DONG-VANG>>> -->
```

Một đoạn văn dưới khối: tệp nào là của vòng (bốn vế, trỏ `feature-loop/scripts/lib/tep-cua-vong.mjs`), chân lưới chỉ xanh khi mã 1 + dòng tóm `pre-merge-check: <N> violation(s) — merge blocked` + N bằng số dòng VIOLATION.

- [ ] **Step 4: Sửa bên viết** — `duong-nen.mjs`: rút `khuonDongVang = khoiMarker(templateText, 'DUONG-NEN-DONG-VANG')`; vắng → `die('khuôn ${TEMPLATE_REL} thiếu marker DUONG-NEN-DONG-VANG')`; dựng `DONG_VANG` Map cùng regex; kiểm hai mã, vắng → `die('khuôn dòng vàng thiếu mã «${ma}» trong ${TEMPLATE_REL}')`. Mảng `VANG = []`. Vòng ghi tệp: nhớ mục hiện tại (`## Dòng đỏ` / `## Dòng vàng`), bullet giữ chỗ `^- \{.*\}$` điền `DO` hoặc `VANG` theo mục, rỗng → `không có`.
- [ ] **Step 5: Chạy trọn `node tests/scripts/duong-nen.test.mjs`** → NEN-TV7 PASS, mọi ca cũ PASS (Review Focus 5).
- [ ] **Step 6: Commit** — `feat(duong-nen): mục Dòng vàng một nguồn (NEN-TV7)`.

### Task 3: Chân suite phân loại dòng của vòng (AC-1..AC-4)

**Phục vụ:** E1, E2, E3, E4 · **independent:** false

**Files:**
- Modify: `feature-loop/scripts/duong-nen.mjs` (khối chân suite)
- Modify: `tests/scripts/duong-nen-fixture.mjs` (`chayNen` nhận `o.slug`, mặc định `'demo'`; `dungKho` nhận `o.coSan: [<đường>]` commit sẵn ở nhánh gốc)
- Test: `tests/scripts/duong-nen.test.mjs` (NEN-TV1…NEN-TV4)

**Interfaces:**
- Consumes: `tepCuaVong` (Task 1), `dongVang`, `VANG` (Task 2).

- [ ] **Step 1: Mở rộng fixture** — `chayNen`: `const slug = o.slug || 'demo'`, truyền `--slug slug`, `p = path.join(root, '_acceptance', slug, 'duong-nen.md')`. `dungKho`: `for (const f of opts.coSan || []) { mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); writeFileSync(path.join(dir, f), 'co san\n'); }` trước `git add -A` của nhánh gốc.
- [ ] **Step 2: Viết bốn ca (slug `vong-thu`), mỗi ca ghim tập bằng đẳng thức**

```js
const SL = 'vong-thu';
const tap = a => JSON.stringify([...(a || [])].sort());
const cb = t => `nen suite: CAY BAN SAU SUITE ${t}`;
const tv = t => `nen suite: TEP CUA VONG ${t} (khong tinh)`;
const ghi = (...ds) => ds.map(d => `mkdir -p "$(dirname '${d}')" && echo x > '${d}'\n`).join('');
// NEN-TV1
{ const k = dungKho({ giuaA: ghi(`_acceptance/${SL}/contract.md`, `_acceptance/${SL}/decisions.jsonl`) });
  const r = chayNen(k, { cache: CACHE, slug: SL });
  const want = [tv(`_acceptance/${SL}/contract.md`), tv(`_acceptance/${SL}/decisions.jsonl`)];
  if (r.code !== 0 || fm(r.tep, 'nen') !== 'xanh' || fm(r.tep, 'suite') !== 'xanh') bad('NEN-TV1 tep cua vong phai xanh', tomTat(r));
  else if (tap(bullets(r.tep)) !== tap(['không có'])) bad('NEN-TV1 dong do phai «không có»', JSON.stringify(bullets(r.tep)));
  else if (tap(bulletsVang(r.tep)) !== tap(want)) bad('NEN-TV1 tap dong vang', JSON.stringify(bulletsVang(r.tep)));
  else ok('NEN-TV1 hai tep moi duoi _acceptance/<slug>/ — nen xanh, hai dong TEP CUA VONG'); }
```

NEN-TV2: `giuaA` ghi `docs/superpowers/specs/2026-10-14-${SL}-design.md`, `docs/superpowers/plans/2026-10-14-${SL}.md`, và `printf 'them: 1\n' >> _acceptance/config.yaml` → mã 0, tập vàng == ba dòng `tv(...)`.
NEN-TV3 (hai dòng PASS): (i) `giuaA` ghi `apps/proto/${SL}/index.tsx` → mã 0, tập vàng == {tv(...)}; (ii) `dungKho({ coSan: [`goi/${SL}/giu.txt`], giuaA: ghi(`goi/${SL}/rac.txt`) })` → mã 1, tập đỏ == {cb(`goi/${SL}/rac.txt`)}, vàng == ['không có'].
NEN-TV4: `giuaA` = `echo sua >> README.md\n` + ghi `_acceptance/${SL}/a.md`, `_acceptance/demo/rac.md`, `_acceptance/${SL}-2/a.md`, `docs/superpowers/specs/2026-10-14-${SL}x-design.md` → mã 1, `suite: do`, tập đỏ == {cb('README.md'), cb('_acceptance/demo/rac.md'), cb(`_acceptance/${SL}-2/a.md`), cb(`docs/superpowers/specs/2026-10-14-${SL}x-design.md`)}, tập vàng == {tv(`_acceptance/${SL}/a.md`)}.
Mỗi ca thêm chiều đỏ bản gốc: chạy cùng kho với `script` = `duong-nen.mjs` của `git archive v2.30.0 feature-loop` (giải nén một lần vào `tamDir`, kèm `--ag-root` là bản archive `skills commands lib scripts`) → TV1/TV2/TV3(i) mã 1 có dòng `cb(...)` — in một dòng bảng `gốc · sau`; bản gốc không đỏ được thì `bad('NEN-TVn ban goc khong do — phep do khong phan biet')`.

- [ ] **Step 3: Chạy, thấy đỏ** — TV1/TV2/TV3(i) FAIL (dòng vào mục đỏ); TV4 FAIL ở tập vàng.
- [ ] **Step 4: Sửa chân suite**

```js
import { tepCuaVong, viPhamCuaVong } from './lib/tep-cua-vong.mjs';
const coOHead = d => gitTry('cat-file', '-e', `HEAD:${d}`) !== null;
// trong vòng `for (const dong of trangThai())`:
if (tepCuaVong(tep, flags.slug, coOHead)) { VANG.push(dongVang('suite-tep-cua-vong', { tep })); continue; }
chan.suite = 'do'; DO.push(dongDo('suite-cay-ban', { tep }));
```
(dời `chan.suite = 'do'` xuống sau phép phân loại; giữ cắt `' -> '` trước.)

- [ ] **Step 5: Chạy trọn** → TV1–TV4 PASS (TV3 hai dòng), ca cũ PASS.
- [ ] **Step 6: Commit** — `feat(duong-nen): chân suite đưa tệp của vòng sang Dòng vàng (NEN-TV1…TV4)`.

### Task 4: Chân lưới phân loại vi phạm của vòng (AC-5)

**Phục vụ:** E5 · **independent:** false

**Files:**
- Modify: `feature-loop/scripts/duong-nen.mjs` (khối chân lưới)
- Modify: `tests/scripts/duong-nen-fixture.mjs` (`dungKho` nhận `o.noLuoiSlug` — tên hồ sơ vi phạm trên nhánh gốc, mặc định `no-cu` khi `noLuoi`)
- Test: `tests/scripts/duong-nen.test.mjs` (NEN-TV5 a–e)

- [ ] **Step 1: Viết năm ca.** Hồ sơ vi phạm do suite ghi: `giuaA` ghi `_acceptance/${SL}/contract.md` với frontmatter `status: verified` thiếu evidence (cùng chữ hồ sơ `no-cu` của fixture, đổi slug). (a) chỉ hồ sơ của vòng → mã 0, `luoi: xanh`, vàng chứa `nen luoi: 1 vi pham cua chinh vong (khong tinh)` và một dòng bắt đầu `VIOLATION [${SL}]:`, đỏ không chứa `LOI CHAY`. (b) `noLuoi` (đối chứng dương của lưới) → mã 1, đỏ chứa `nen luoi: 1 vi pham co san` + một dòng `VIOLATION [no-cu]:`. (c) cả hai → mã 1, đỏ có đúng `nen luoi: 1 vi pham co san`, không dòng `VIOLATION [${SL}]:` nào trong đỏ, có trong vàng. (d) kho lành, thay `scripts/pre-merge-check.sh` của kho thử TRƯỚC commit gốc bằng `#!/usr/bin/env bash\necho "VIOLATION [${SL}]: gia"\nkhong-co-lenh-nay\nexit 1\n` → mã 1, `luoi: do`, đỏ chứa `nen luoi: LOI CHAY ma 1`. (e) `noLuoi` với `noLuoiSlug: `${SL}-2`` → mã 1, đỏ `nen luoi: 1 vi pham co san` + `VIOLATION [${SL}-2]:`, vàng == ['không có']. Ca (a) trước tiên kiểm lưới thật thấy hồ sơ chưa theo dõi: nếu `pre-merge-check.sh` kho thử không in `VIOLATION [${SL}]` (chạy trực tiếp sau suite) → `bad('NEN-TV5 fixture: luoi khong thay ho so cua vong')`.
- [ ] **Step 2: Chạy, thấy đỏ** — (a) FAIL (vi phạm của vòng đang đỏ), (c) FAIL.
- [ ] **Step 3: Sửa chân lưới**

```js
const tatCa = `${r.stdout || ''}\n${r.stderr || ''}`.split('\n');
const viPham = tatCa.filter(l => l.startsWith('VIOLATION '));
const cuaVong = viPham.filter(l => viPhamCuaVong(l, flags.slug));
const khac = viPham.filter(l => !viPhamCuaVong(l, flags.slug));
const tom = tatCa.map(l => l.match(/^pre-merge-check: (\d+) violation\(s\) — merge blocked$/)).find(Boolean);
const tuGiai = r.status === 1 && tom && Number(tom[1]) === viPham.length;
if (cuaVong.length) VANG.push(dongVang('luoi-cua-vong', { k: cuaVong.length }), ...cuaVong);
if (khac.length) { chan.luoi = 'do'; DO.push(dongDo('luoi-co-san', { k: khac.length }), ...khac); }
else if (r.status !== 0 && !(cuaVong.length && tuGiai)) { chan.luoi = 'do'; DO.push(dongDo('luoi-loi-chay', { ma: r.status === null ? `tin-hieu-${r.signal}` : r.status })); }
```

- [ ] **Step 4: Chạy trọn** → năm dòng `PASS: NEN-TV5 `, ca cũ (NEN5, NEN5-IM) PASS.
- [ ] **Step 5: Commit** — `feat(duong-nen): chân lưới đưa vi phạm của chính hồ sơ sang Dòng vàng khi lưới tự giải thích mã (NEN-TV5)`.

### Task 5: Bốn đột biến trên bản sao (AC-8)

**Phục vụ:** E8 · **independent:** false

**Files:** Test: `tests/scripts/duong-nen.test.mjs` (NEN-TV6)

- [ ] **Step 1: Viết ca.** Bản sao: `tamDir` + chép trọn `feature-loop/scripts` của KIT; tiêm vào `lib/tep-cua-vong.mjs` của bản sao (đếm khớp = 1, khác → `bad('NEN-TV6 cho tiem lech <x>')`): (a) `export function tepCuaVong(duong, slug, coOHead) {` → thêm `return false;` ngay sau; (b) thêm `return true;`; (c) `!coOHead(` → `!false && (`… đơn giản hơn: thay `&& !coOHead(doan.slice(0, i + 1).join('/'))` bằng chuỗi rỗng; (d) `` `VIOLATION [${slug}]:` `` → `` `VIOLATION [${slug}` ``. Chạy đúng phép kiểm của TV1 (a), TV4 (b), TV3(ii) (c), TV5(e) (d) — gói phép kiểm của các ca ấy thành hàm `kiemTV1(r)`… trả chuỗi lỗi hoặc null, dùng chung ở Task 3/4 và ở đây. Bản lành (bản sao chưa tiêm) chạy trước, bốn hàm phải trả null; bản tiêm: (a) lỗi chứa `_acceptance/vong-thu/contract.md`, (b) chứa `README.md`, (c) chứa `goi/vong-thu/rac.txt`, (d) chứa `[vong-thu-2]`.
- [ ] **Step 2: Chạy** → `PASS: NEN-TV6 …` (ca này xanh ngay vì Task 3/4 đã xong — chiều đỏ của nó nằm trong chính ca).
- [ ] **Step 3: Commit** — `test(duong-nen): bốn đột biến vị từ và mẫu VIOLATION (NEN-TV6)`.

### Task 6: Thẻ đọc mục «Dòng vàng» (AC-7)

**Phục vụ:** E7 · **independent:** false

**Files:**
- Modify: `scripts/gate-card.js` (`docNen` thêm `vang`; hằng `NEN_VANG_LAB`; khối «Nền hạ tầng» Cổng 1)
- Test: `tests/scripts/gate-card-duong-nen.test.mjs` (GN-TV1, GN-TV2, GN-TV3)

- [ ] **Step 1: Viết ca.** GN-TV1: kho của TV1 và TV4 (dựng lại bằng fixture, slug `demo` để dùng `hoSo()` sẵn có — TV-style ghi `_acceptance/demo/a.md`), sau đường nền gọi `hoSo(dir)` rồi `the(dir)`; rút nhãn bằng `hang('NEN_VANG_LAB')`; tách các `<p class="li">` sau nhãn tới `</div>` kế, bỏ thoát HTML, tập == `bulletsVang(tep)`; TV1 không chứa `NEN_DO`, TV4 chứa. GN-TV2: bản gốc v2.30.0 (`git archive v2.30.0 feature-loop skills scripts lib commands`) ghi `duong-nen.md` trên kho lành, rồi dựng thẻ bằng gate-card bản vòng VÀ gate-card bản gốc; khối từ `LAB` tới `</div></div>` kế bằng nhau từng byte và không chứa nhãn vàng. GN-TV3: theo mẫu ca `NC-AC5-nen` của `tests/scripts/ntr-the-canh-gay.test.mjs` (hồ sơ kèm `evidence-report.md` REJECT có eval `SUITE-1` đỏ) dựng thẻ Cổng 2 trên tệp của TV4 → có «đỏ từ trước vòng»; trên tệp của TV1 → không có; HTML cả hai không chứa `TEP CUA VONG`.
- [ ] **Step 2: Chạy, thấy đỏ** — `hang('NEN_VANG_LAB')` die.
- [ ] **Step 3: Sửa gate-card**

```js
const NEN_VANG_LAB = 'Tệp của chính vòng — nền không tính';
// docNen: cắt mục theo cả dòng tiêu đề, dùng chung cho hai mục
const mucNen = (dongs, ten) => { const i = dongs.findIndex(l => new RegExp(`^##\\s+${ten}\\s*$`).test(l)); if (i < 0) return []; const sau = dongs.slice(i + 1); const j = sau.findIndex(l => /^#{1,6}\s/.test(l)); return bullets(j < 0 ? sau : sau.slice(0, j)).filter(l => l.trim() && l.trim() !== 'không có'); };
// return { …, do: mucNen(dongs, 'Dòng đỏ'), vang: mucNen(dongs, 'Dòng vàng') };
// Cổng 1, ngay sau các dòng đỏ trong khối Nền hạ tầng:
//   ${nen.vang.length ? `<p class="li"><b>${esc(NEN_VANG_LAB)} (${nen.vang.length})</b></p>${nen.vang.map(l => `<p class="li">${esc(l)}</p>`).join('')}` : ''}
```

- [ ] **Step 4: Chạy** `node tests/scripts/gate-card-duong-nen.test.mjs` → GN1…GN5 + GN-TV1…TV3 PASS; `node tests/scripts/ntr-the-canh-gay.test.mjs` xanh.
- [ ] **Step 5: Commit** — `feat(gate-card): khối Nền hạ tầng in Dòng vàng dưới nhãn riêng (GN-TV1…TV3)`.

### Task 7: Lời trong SKILL / GUIDE / ghi chú đầu tệp

**Phục vụ:** (không eval — tài liệu) · **independent:** true

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` S1#0 — thêm một câu: «Mục «Dòng vàng» là tệp hay vi phạm của chính vòng (đường mang slug, `_acceptance/config.yaml`) — không phải lý do chạy lại nền.»
- Modify: `GUIDE.md` đoạn «Đường nền hạ tầng» — một câu tương đương.
- Modify: đầu `feature-loop/scripts/duong-nen.mjs` — ghi chú khối mục vàng; đầu `tests/scripts/duong-nen.test.mjs` — dòng nêu NEN-TV1…TV8 thuộc hồ sơ này.

- [ ] **Step 1: Sửa ba tệp; chạy** `node tests/scripts/duong-nen.test.mjs` (không ca nào đọc câu này — chỉ bảo đảm không vỡ) và ca P85/P-thẻ không liên quan.
- [ ] **Step 2: Commit** — `docs(duong-nen): một câu cho Dòng vàng ở S1#0 và GUIDE`.

### Kết S3

- [ ] Chạy hai khoá mới: `bash -c "$(node -e '…resolveConfigKey executors.script.ntv_tep_cua_vong…')"` và `ntv_the_nen` — cả hai mã 0.
- [ ] `node scripts/product-map.mjs --root .` rồi `--check` mã 0; commit bản đồ nếu đổi.
- [ ] Đặt `status: implemented`, commit, xin Điều phối M5 lượt `s4`.
