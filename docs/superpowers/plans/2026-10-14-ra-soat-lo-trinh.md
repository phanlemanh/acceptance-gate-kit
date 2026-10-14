# Rà soát lộ trình trên thẻ (RM1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chủ kho mở thẻ khởi động thấy hàng lộ trình nào cần rà soát (dời mốc · chờ điều kiện · bác) kèm căn cứ; một lệnh chỉ đọc in trọn danh sách; gói `road-map` có lệnh xem; cắt lượt cờ việc gắn mốc đang chạy; chữ «chờ điều kiện» thay «chân trời».

**Architecture:** Một hàm `raSoat` trong `scripts/lo-trinh.mjs` đọc kết quả `phanTichKho` (trạng thái từng hàng đã suy) + chính sách ở đầu tệp lộ trình + tuổi hàng từ `git log` của tệp, trả đề xuất theo thứ tự luật cố định. Thẻ khởi động (`loTrinhThe`) và CLI `--ra-soat` đều gọi đúng hàm đó. Trang lộ trình không đổi (rà soát phụ thuộc hôm nay).

**Tech Stack:** Node ESM (`.mjs`), git CLI, ca test tự chạy in `PASS:`/`FAIL:`.

**Spec:** `docs/superpowers/specs/2026-10-14-ra-soat-lo-trinh-design.md` · hợp đồng `_acceptance/ra-soat-lo-trinh/contract.md` · bộ đo `evals.yaml`.

## Global Constraints

- Thứ tự luật: `xep-lai` → `ho-so-bac` → `moc-qua-ngay` → `tuoi` → `tran`; luật đầu khớp thắng.
- Mốc chiến dịch CHỈ là `loai: phat-hanh`.
- Hàng đã giao, «không suy được», hàng có hồ sơ đang mở (ô thuộc `NHOM_MO`) không nhận đề xuất.
- `chinh_sach.tuoi_ngay` nguyên dương; `chinh_sach.tran_ke_tiep` nguyên ≥ 0; sai kiểu → một cờ khuôn, không luật chính sách nào chạy.
- 0 đề xuất → thẻ start giống từng byte bộ máy gốc: KHÔNG thêm khoá `raSoat`, KHÔNG thêm dòng.
- Trang `LO-TRINH.html` và khối dữ liệu KHÔNG đổi vì rà soát.
- Lệnh `--ra-soat` không ghi tệp; `--ra-soat` + `--hang` → thoát 2; kho chưa khai → thoát 1.
- «Hôm nay» = `ACCEPTANCE_TODAY` nếu có, không thì ngày UTC hiện tại.
- Khoá `chan_troi` không đổi; chỉ chữ cho người đổi sang «chờ điều kiện».
- Mọi việc nặng (cả bộ test, S4) chạy qua khoá máy `chay-nang.sh`.

## Review Focus

- Kho clone nông: `git log` cụt — tuổi phải là tuổi tối thiểu kèm một cờ `lich_su_cut`, không ném. → Task 3 thêm ca RS-3-cut.
- Tệp lộ trình chưa từng commit (mới tạo, chưa add): `tuoiHang` trả Map rỗng, luật `tuoi` bỏ qua hàng không có tuổi (không coi là tuổi 0, không ném). → Task 3 ca RS-3-chua-commit.
- Hai lộ trình trong một kho: đề xuất mỗi lộ trình riêng, dòng thẻ dưới đúng tiêu đề «Lộ trình X:». → Task 4 ca RS-4-hai.
- Mốc có ngày sai dạng: không kích hoạt `moc-qua-ngay` (không so chuỗi rác). → Task 2 thêm hàng mốc ngày sai vào ma trận phụ RS-1-ngay-sai.
- `ACCEPTANCE_TODAY` sai dạng: lệnh thoát 2 nêu biến, không ra đề xuất sai. → Task 2 ca RS-5-loi mở rộng.

---

### Task 1: Khung ca đo + ca gác RS-0

**Files:**
- Create: `tests/scripts/ra-soat-lo-trinh.test.mjs`
- Modify: `_acceptance/config.yaml` (khoá đã có: `executors.test.ra_soat_lo_trinh`)

**Interfaces:**
- Produces (trong tệp test): `kho({tep, cfg, hoSo, lichSu})`, `banSao(tiem, goc)`, `gocMay()` (bung `git archive <goc-so>`), `chayRaSoat(kitRoot, khoRoot, {today, json})`, `HO_SO` (thêm `sap-mo`, `xep-lai`, `da-bac`, `hong` như `moc-chien-dich.test.mjs`).

- [ ] **Step 1: Viết khung + RS-0**

```js
// ra-soat-lo-trinh.test.mjs — hồ sơ ra-soat-lo-trinh (hàng RM1), ca RS-<n> = AC-n (AC-9 ở ra-soat-lo-trinh-crm.mjs).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = readFileSync(path.join(KIT, '_acceptance', 'ra-soat-lo-trinh', 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ra-soat-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 << 20, ...o });
// RS-0: mọi commit chạm mã trong GOC..HEAD phải thuộc vòng.
function rs0() {
  const ds = git(KIT, 'log', '--format=%h %s', `${GOC}..HEAD`, '--', 'scripts', 'lib', 'skills', 'commands').split('\n').filter(Boolean);
  const la = ds.filter(l => !l.includes('ra-soat-lo-trinh'));
  if (la.length) { bad('RS-0', `gốc so thiếu nền — commit chạm mã không thuộc vòng: ${la.join(' | ')}`); return false; }
  ok('RS-0', `${ds.length} commit chạm mã sau gốc ${GOC.slice(0, 8)}, đều thuộc vòng`); return true;
}
const GOC_XANH = rs0();
```

Kèm `kho`, `banSao`, `HO_SO` chép theo khuôn `tests/scripts/moc-chien-dich.test.mjs` dòng 33–80 (thêm tham số `lichSu: [{ngay, tep}]` — mỗi phần tử một commit với `GIT_COMMITTER_DATE`/`GIT_AUTHOR_DATE` = `<ngay>T12:00:00Z`), và cuối tệp:

```js
console.log(`\nResults: ${pass} passed, ${fail} failed (ra-soat-lo-trinh)`);
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: Chạy** `node tests/scripts/ra-soat-lo-trinh.test.mjs` → `PASS: RS-0` (chưa có commit mã nào của vòng).
- [ ] **Step 3: Commit** `test(ra-soat-lo-trinh): khung ca đo + ca gác RS-0`.

**Phục vụ:** E1, E4, E6 (RS-0). **independent:** false.

---

### Task 2: Ba luật sự thật + lệnh `--ra-soat`

**Files:**
- Modify: `scripts/lo-trinh.mjs` (thêm khối «Rà soát» sau `mocKhongHang`; CLI ở cuối tệp)
- Test: `tests/scripts/ra-soat-lo-trinh.test.mjs` (RS-1, RS-1-do, RS-1-do2, RS-1-ngay-sai, RS-5, RS-5-loi, RS-5-do)

**Interfaces:**
- Produces: `export const LUAT_RA_SOAT = ['xep-lai','ho-so-bac','moc-qua-ngay','tuoi','tran']`; `export function raSoat({ root, cacTep, sections, today })` → `[{ tep, ten, de_xuat: [{ ma, cau_giao, de_xuat, luat, can_cu }] }]`; `export function dongRaSoat(muc)` → chuỗi `  · <mã> — <đề xuất>: <căn cứ>`; CLI `--ra-soat [--json]`.

- [ ] **Step 1: Ca đỏ trước** — RS-1 dựng kho 48 hàng: vị trí `['ph-qua','khong-loai-qua','ph-toi','ngoai-qua','han-cung-qua','ngoai-moc']` × trạng thái `['chua-ho-so','dang-mo','da-giao','xep-lai-ho-so','xep-lai-tu-khai','da-bac','hong','khong-suy']`; mã `RS1-<vị trí>-<trạng thái>`; hồ sơ: `dang-mo`→`dang-dung`, `da-giao`→`da-ship`, `xep-lai-ho-so`→`xep-lai`, `da-bac`→`da-bac`, `hong`→`hong`, `khong-suy` = hai hồ sơ `sap-mo` cùng ghi `lo_trinh_ma`; `xep-lai-tu-khai` = hàng không slug có `trang_thai: "Xếp lại sau"`. Mốc: `ph-qua` `{loai:'phat-hanh', ngay:'2026-09-01'}`, `khong-loai-qua` `{ngay:'2026-09-01'}`, `ph-toi` `{loai:'phat-hanh', ngay:'2026-12-01'}`, `ngoai-qua` `{loai:'ngoai', ngay:'2026-09-01', ai:'M'}`, `han-cung-qua` `{loai:'han-cung', ngay:'2026-09-01', ai:'M'}`. Tập mong đợi viết tay:

```js
const VT = ['ph-qua','khong-loai-qua','ph-toi','ngoai-qua','han-cung-qua','ngoai-moc'];
const MONG1 = new Set([
  'RS1-ph-qua-chua-ho-so|doi-moc|moc-qua-ngay',
  ...VT.flatMap(v => [`RS1-${v}-xep-lai-ho-so|cho-dieu-kien|xep-lai`, `RS1-${v}-xep-lai-tu-khai|cho-dieu-kien|xep-lai`, `RS1-${v}-da-bac|bac|ho-so-bac`]),
]); // 19 phần tử
```

RS-1-do: `banSao([['scripts/lo-trinh.mjs', "const MOC_CHIEN_DICH = m => chuoi(m.loai) === 'phat-hanh';", "const MOC_CHIEN_DICH = m => ['phat-hanh','ngoai'].includes(chuoi(m.loai));"]])` → ghim «hàng mốc ngoài nhận đề xuất: RS1-ngoai-qua-chua-ho-so». RS-1-do2: tiêm bỏ dòng `if (d.coHoSo && mo.has(d.chu)) continue;` → ghim «hàng có hồ sơ đang mở nhận đề xuất: RS1-ph-qua-dang-mo».

- [ ] **Step 2: Chạy** — FAIL «tham số lạ --ra-soat».
- [ ] **Step 3: Mã** (trong `scripts/lo-trinh.mjs`):

```js
// ── Rà soát (hồ sơ ra-soat-lo-trinh, hàng RM1) ─────────────────────────────────
// Chỉ đọc. Phụ thuộc HÔM NAY nên chỉ ra thẻ start và lệnh --ra-soat, KHÔNG vào trang (trang tất định).
export const LUAT_RA_SOAT = ['xep-lai', 'ho-so-bac', 'moc-qua-ngay', 'tuoi', 'tran'];
const DE_XUAT_CHU = { 'doi-moc': 'dời mốc', 'cho-dieu-kien': 'chờ điều kiện', bac: 'bác' };
const MOC_CHIEN_DICH = m => chuoi(m.loai) === 'phat-hanh';
const ddmmyyyy = s => (NGAY_RE.test(s) ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : s);
export function dongRaSoat(m) {
  const c = m.can_cu;
  const cc = m.luat === 'moc-qua-ngay' ? `mốc «${c.moc}» đã qua ngày ${ddmmyyyy(c.ngay)}`
    : m.luat === 'xep-lai' ? (c.nguon === 'ho-so' ? `hồ sơ ${c.ho_so} đã xếp lại` : `kế hoạch tự khai «${c.chu}»`)
    : m.luat === 'ho-so-bac' ? `hồ sơ ${c.ho_so} đã bác`
    : m.luat === 'tuoi' ? `${c.tuoi} ngày chưa ai sửa (lần cuối ${ddmmyyyy(c.cham_cuoi.ngay)})`
    : `«Kế tiếp» có ${c.k} việc, trần ${c.tran}`;
  return `  · ${m.ma} — ${DE_XUAT_CHU[m.de_xuat]}: ${cc}`;
}
export function raSoat({ root, cacTep, sections, today }) {
  const TEN = Object.fromEntries(sections);
  const daGiao = new Set(DA_GIAO_O.map(k => TEN[k]));
  const mo = new Set(NHOM_MO.map(k => TEN[k]));
  const chuaLam = new Set([CHUA_MO, ...CHUA_LAM_O.map(k => TEN[k])]);
  return cacTep.map(t => {
    if (!t.kq) return { tep: t.tep, ten: null, de_xuat: [] };
    const kq = t.kq; const out = []; const keTiep = [];
    const mocCD = kq.moc.filter(MOC_CHIEN_DICH);
    const qua = mocCD.filter(m => NGAY_RE.test(chuoi(m.ngay)) && chuoi(m.ngay) < today);
    const trongCD = new Set(mocCD.flatMap(ganMoc));
    for (const d of kq.dong) {
      const ma = String(d._nhan);
      if (daGiao.has(d.chu) || d.chu === KHONG_SUY) continue;
      if (d.coHoSo && mo.has(d.chu)) continue;
      const g = { ma, cau_giao: chuoi(d.cau_giao) };
      if (d.chu === TEN['xep-lai']) { out.push({ ...g, de_xuat: 'cho-dieu-kien', luat: 'xep-lai', can_cu: d.coHoSo ? { nguon: 'ho-so', ho_so: d.hoSo } : { nguon: 'tu-khai', chu: d.tuKhai } }); continue; }
      if (d.chu === TEN['da-bac'] && d.coHoSo) { out.push({ ...g, de_xuat: 'bac', luat: 'ho-so-bac', can_cu: { ho_so: d.hoSo, o: d.chu } }); continue; }
      if (d.coHoSo || !chuaLam.has(d.chu)) continue;
      const m = qua.find(x => ganMoc(x).includes(ma));
      if (m) { out.push({ ...g, de_xuat: 'doi-moc', luat: 'moc-qua-ngay', can_cu: { moc: tenNganMoc(m).ten || chuoi(m.ten), ngay: chuoi(m.ngay) } }); continue; }
      if (!trongCD.has(ma)) keTiep.push(g);
    }
    // Task 3 nối luật tuoi/tran vào đây.
    const thuTu = new Map(kq.dong.map((d, i) => [String(d._nhan), i]));
    out.sort((a, b) => thuTu.get(a.ma) - thuTu.get(b.ma));
    return { tep: t.tep, ten: kq.ten || null, de_xuat: out };
  });
}
```

(`tenNganMoc` của MC1 trả `{ten, ...}` — kiểm hình trả về khi viết; nếu trả chuỗi thì dùng thẳng.)

CLI: thêm cờ `--ra-soat`, `--json`; khi `--ra-soat`: có `--hang` → `bail('--ra-soat không đi cùng --hang')`; `today = process.env.ACCEPTANCE_TODAY || new Date().toISOString().slice(0,10)`, sai dạng → `bail('ACCEPTANCE_TODAY phải dạng YYYY-MM-DD')`; `khai == null` → `thoat(1, \`kho chưa khai ${KHOA} trong _acceptance/config.yaml\`)`; `PM = await import(product-map.mjs)`; `k = phanTichKho(...)`; `rs = raSoat({ root, cacTep: k.cacTep, sections: PM.SECTIONS, today })`; `--json` → `JSON.stringify(rs)`; chữ → mỗi mục `dongRaSoat(m)` một dòng (nhiều lộ trình: tiền tố `<tep>: `).

- [ ] **Step 4: Chạy** → RS-1, RS-1-do, RS-1-do2, RS-1-ngay-sai, RS-5, RS-5-loi, RS-5-do xanh. RS-5 kiểm `git status --porcelain` rỗng + mtime tệp lộ trình bằng trước lệnh; RS-5-do tiêm `writeFileSync(path.join(root, '.ra-soat-tam'), '')` ngay đầu nhánh `--ra-soat` → ghim «lệnh rà soát ghi tệp: .ra-soat-tam».
- [ ] **Step 5: Commit** `feat(ra-soat-lo-trinh): ba luật sự thật + lệnh --ra-soat`.

**Phục vụ:** E1, E5. **independent:** false.

---

### Task 3: Chính sách, tuổi hàng, trần

**Files:**
- Modify: `scripts/lo-trinh.mjs` (`kiemKhuon` đọc `chinh_sach`; `CO_DICH` thêm 3 dòng; `tuoiHang`; nối luật `tuoi`/`tran` trong `raSoat`)
- Modify: `tests/scripts/lo-trinh.test.mjs` (ma trận LT-97 thêm 3 dạng cờ)
- Test: RS-2, RS-2-khong-chinh-sach, RS-2-sai-kieu, RS-2-do, RS-2-do2, RS-3, RS-3-do, RS-3-cut, RS-3-chua-commit

**Interfaces:**
- Consumes: `raSoat` (Task 2).
- Produces: `kq.chinhSach` = `{ tuoi_ngay: number|null, tran_ke_tiep: number|null } | null`; `export function tuoiHang(root, tep)` → `{ cut: boolean, theoMa: Map<ma, {ngay:'YYYY-MM-DD', sha}> }`.

- [ ] **Step 1: Ca đỏ** — RS-3 dựng sáu commit đúng AC-3 (ngày c1..c6), đọc sha bằng `git rev-list` theo thứ tự, mong đợi `{X:[13,c5], Y:[34,c2], Z2:[43,c1], W2:[9,c6]}`; RS-3-do tiêm đổi bộ so danh tính về chỉ-mã (thay hàm `khopHang` thành `(p, r) => p.ma === r.ma`) → ghim «Z2: tuổi 24, cần 43». RS-2 dựng kho có lịch sử để tuổi {10,29,30,45} + 3 hàng đã giao tuổi 100 (tự khai «Đã giao»), chính sách `{tuoi_ngay:30, tran_ke_tiep:1}`.
- [ ] **Step 2: Chạy** — FAIL.
- [ ] **Step 3: Mã**

```js
// kiemKhuon: sau khối tu_vung
let chinhSach = null;
if (data.chinh_sach !== undefined) {
  const cs = data.chinh_sach;
  if (!cs || typeof cs !== 'object' || Array.isArray(cs)) co.push('khối chinh_sach phải là một object');
  else {
    const t = cs.tuoi_ngay; const n = cs.tran_ke_tiep; let sai = false;
    if (t !== undefined && !(Number.isInteger(t) && t > 0)) { co.push('chinh_sach.tuoi_ngay phải là số nguyên dương'); sai = true; }
    if (n !== undefined && !(Number.isInteger(n) && n >= 0)) { co.push('chinh_sach.tran_ke_tiep phải là số nguyên không âm'); sai = true; }
    if (!sai) chinhSach = { tuoi_ngay: t ?? null, tran_ke_tiep: n ?? null };
  }
}
// trả thêm chinhSach trong object của kiemKhuon; suyTrangThai chuyển kq.chinhSach = khuon.chinhSach
```

```js
// CO_DICH thêm:
{ ten: 'chinh-sach-object', re: /^khối chinh_sach phải là một object$/, ra: () => ({ ma: null, chu: 'chính sách rà soát phải là một object' }) },
{ ten: 'chinh-sach-tuoi', re: /^chinh_sach\.tuoi_ngay phải là số nguyên dương$/, ra: () => ({ ma: null, chu: 'chính sách tuoi_ngay phải là số nguyên dương' }) },
{ ten: 'chinh-sach-tran', re: /^chinh_sach\.tran_ke_tiep phải là số nguyên không âm$/, ra: () => ({ ma: null, chu: 'chính sách tran_ke_tiep phải là số nguyên không âm' }) },
```

```js
const khopHang = (p, r) => (p.ma === r.ma && p.cau === r.cau) ? 3 : (p.cau === r.cau ? 2 : (p.ma === r.ma ? 1 : 0));
export function tuoiHang(root, tep) {
  const theoMa = new Map(); let cut = false;
  let log = '';
  try {
    cut = execFileSync('git', ['-C', root, 'rev-parse', '--is-shallow-repository'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === 'true';
    log = execFileSync('git', ['-C', root, 'log', '--reverse', '--format=%H %cI', '--', tep], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch { return { cut, theoMa }; }
  let truoc = [];
  for (const dong of log.split('\n').filter(Boolean)) {
    const [sha, iso] = dong.split(' '); const ngay = iso.slice(0, 10);
    let data; try { data = JSON.parse(execFileSync('git', ['-C', root, 'show', `${sha}:${tep}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 })); } catch { continue; }
    const moc = Array.isArray(data.moc) ? data.moc : [];
    const mocCua = ma => moc.filter(m => Array.isArray(m.hang) && m.hang.map(chuoi).includes(ma)).map(m => chuoi(m.ten)).sort().join('|');
    const conLai = [...truoc]; const nay = [];
    for (const r of (Array.isArray(data.hang) ? data.hang : []).filter(x => x && typeof x === 'object')) {
      const { ma: _m, ...than } = r; const ma = chuoi(r.ma); const cau = chuoi(r.cau_giao);
      const sig = JSON.stringify(Object.keys(than).sort().map(k => [k, than[k]])); const ms = mocCua(ma);
      let best = -1; let diem = 0;
      conLai.forEach((p, i) => { const s = khopHang(p, { ma, cau }); if (s > diem) { diem = s; best = i; } });
      const p = best >= 0 ? conLai.splice(best, 1)[0] : null;
      const cham = !p || p.sig !== sig || p.ms !== ms ? { ngay, sha } : p.cham;
      nay.push({ ma, cau, sig, ms, cham });
    }
    truoc = nay;
  }
  for (const p of truoc) theoMa.set(p.ma, p.cham);
  return { cut, theoMa };
}
const soNgay = (tu, den) => Math.round((Date.UTC(+den.slice(0, 4), +den.slice(5, 7) - 1, +den.slice(8, 10)) - Date.UTC(+tu.slice(0, 4), +tu.slice(5, 7) - 1, +tu.slice(8, 10))) / 86400000);
```

Nối trong `raSoat` thay dòng «Task 3 nối…»:

```js
const cs = kq.chinhSach;
let cut = false;
if (cs && keTiep.length) {
  const { cut: c, theoMa } = tuoiHang(root, t.tep); cut = c;
  const conLai = [];
  for (const g of keTiep) {
    const ch = theoMa.get(g.ma); const tuoi = ch ? soNgay(ch.ngay, today) : null;
    if (cs.tuoi_ngay != null && tuoi != null && tuoi >= cs.tuoi_ngay) out.push({ ...g, de_xuat: 'cho-dieu-kien', luat: 'tuoi', can_cu: { tuoi, cham_cuoi: ch } });
    else conLai.push({ g, tuoi });
  }
  if (cs.tran_ke_tiep != null && conLai.length > cs.tran_ke_tiep) {
    const thu = new Map(keTiep.map((g, i) => [g.ma, i]));
    conLai.sort((a, b) => (b.tuoi ?? -1) - (a.tuoi ?? -1) || thu.get(a.g.ma) - thu.get(b.g.ma));
    for (const { g } of conLai.slice(0, conLai.length - cs.tran_ke_tiep)) out.push({ ...g, de_xuat: 'cho-dieu-kien', luat: 'tran', can_cu: { k: keTiep.length, tran: cs.tran_ke_tiep } });
  }
}
// trả thêm `...(cut ? { lich_su_cut: true } : {})`
```

- [ ] **Step 4: Chạy** RS-2*, RS-3* xanh; `LT_CASES=LT-97 node tests/scripts/lo-trinh.test.mjs` xanh sau khi ma trận LT-97 thêm ba dạng `chinh-sach-object`, `chinh-sach-tuoi`, `chinh-sach-tran` (câu đích viết tay như bảng trên). RS-2-do tiêm bỏ điều kiện chưa giao khi đếm K (đếm `kq.dong` ngoài mốc chiến dịch) → ghim «K = 7, cần 4»; RS-2-do2 tiêm `tuoi >= cs.tuoi_ngay` → `tuoi > cs.tuoi_ngay` → ghim «hàng tuổi 30 thiếu đề xuất tuoi».
- [ ] **Step 5: Commit** `feat(ra-soat-lo-trinh): chính sách tuổi/trần + tuổi hàng theo lịch sử`.

**Phục vụ:** E2, E3. **independent:** false.

---

### Task 4: Thẻ khởi động

**Files:**
- Modify: `scripts/lo-trinh.mjs` (`loTrinhThe`), `commands/start.md` (danh sách khoá dòng 45: thêm `loTrinh.ds[].raSoat`)
- Test: RS-4, RS-4-byte, RS-4-do, RS-4-hai

**Interfaces:**
- Consumes: `raSoat`, `dongRaSoat`.
- Produces: `ds[i].raSoat` (CHỈ khi khác rỗng); dòng thẻ.

- [ ] **Step 1: Ca đỏ** — RS-4 kho 8 đề xuất; RS-4-byte ba kho 0 đề xuất so stdout `node <goc>/scripts/start-scan.mjs --root <kho>` với bản cây (env `ACCEPTANCE_TODAY=2026-10-14`); RS-4-do tiêm in «Rà soát: 0 đề xuất» khi rỗng.
- [ ] **Step 2: Mã** — trong `loTrinhThe`, sau khi dựng `ds`:

```js
const rs = raSoat({ root, cacTep: k.cacTep, sections, today });
ds.forEach((t, i) => { if (rs[i] && rs[i].de_xuat.length) t.raSoat = rs[i].de_xuat; });
const LENH_RA_SOAT = 'node scripts/lo-trinh.mjs --root . --ra-soat';
const dongRs = t => {
  if (!t.raSoat) return [];
  const dem = x => t.raSoat.filter(m => m.de_xuat === x).length;
  const ra = [`Rà soát: ${t.raSoat.length} đề xuất — ${dem('doi-moc')} dời mốc · ${dem('cho-dieu-kien')} chờ điều kiện · ${dem('bac')} bác`];
  ra.push(...t.raSoat.slice(0, 5).map(dongRaSoat));
  if (t.raSoat.length > 5) ra.push(`  … còn ${t.raSoat.length - 5} — xem: ${LENH_RA_SOAT}`);
  return ra;
};
// trong vòng dựng `dong`: ngay trước `if (t.co.length) dong.push(...)` thêm `dong.push(...dongRs(t));`
```

- [ ] **Step 3: Chạy** → xanh. **Step 4: Commit** `feat(ra-soat-lo-trinh): đề xuất rà soát trên thẻ khởi động`.

**Phục vụ:** E4. **independent:** false.

---

### Task 5: Trang tất định (RS-6)

**Files:** Test only: RS-6, RS-6-do (tiêm vào `veHtml` một dòng `<p>Rà soát</p>`).

- [ ] **Step 1:** Vẽ trang kho RS-1 và RS-2 bằng `node <cây>/scripts/product-map.mjs --root <kho>` hai lần với `ACCEPTANCE_TODAY` 2026-10-14 và 2026-12-31; so byte với nhau và với `<goc>/scripts/product-map.mjs`; `--check` thoát 0.
- [ ] **Step 2: Chạy** → xanh (mã không đổi trang). **Step 3: Commit** `test(ra-soat-lo-trinh): trang lộ trình tất định`.

**Phục vụ:** E6. **independent:** false.

---

### Task 6: Cắt lượt — cờ `gan-moc-dang-chay`

**Files:**
- Modify: `scripts/cat-luot.mjs` (`kiemCo(pv, data, k, homNay = null)`; CLI `--hom-nay <ngày>`, mặc định `ACCEPTANCE_TODAY` rồi ngày UTC; `CO_TEN` thêm `gan-moc-dang-chay`), `skills/cat-luot/SKILL.md` (bảng cờ thêm dòng `gan-moc-dang-chay` — cảnh báo)
- Test: RS-7, RS-7-do

- [ ] **Step 1: Mã** — trong `kiemCo`, sau vòng cờ của từng hàng trong đợt:

```js
if (homNay) {
  const dotCua = new Map(hang.map(({ r }) => [chuoi(r.ma), chuoi(r.dot)]));
  for (const { r, nhan } of trongDot) {
    for (const m of moc.filter(x => chuoi(x.loai) === 'phat-hanh' && /^\d{4}-\d{2}-\d{2}$/.test(chuoi(x.ngay)) && chuoi(x.ngay) >= homNay)) {
      const ds = (Array.isArray(m.hang) ? m.hang : []).map(chuoi);
      if (!ds.includes(chuoi(r.ma)) || !ds.some(x => dotCua.get(x) !== pv.dot)) continue;
      canhBao.push(`hàng ${nhan} [gan-moc-dang-chay]: gắn vào mốc «${nhanMoc(m)}» đang chạy (ngày ${chuoi(m.ngay)}) — đổi đích chiến dịch giữa chừng; gắn sang mốc kế hoặc để «Kế tiếp», chủ ý thì ghi vì sao vào mô tả PR`);
    }
  }
}
```

- [ ] **Step 2:** RS-7 kho bốn mốc A/B/C/N; RS-7-do tiêm bỏ `|| !ds.some(...)` → ghim «hàng gắn mốc mới bị cờ: <mã B>». **Step 3: Commit** `feat(ra-soat-lo-trinh): cắt lượt cờ việc gắn mốc đang chạy`.

**Phục vụ:** E7. **independent:** false.

---

### Task 7: Chữ «chờ điều kiện»

**Files:** `scripts/cat-luot.mjs`, `scripts/lo-trinh.mjs`, `scripts/tin-hieu.mjs`, `skills/cat-luot/SKILL.md`, `skills/gom-tin-hieu/SKILL.md`, `skills/acceptance/references/{pham-vi-template,tin-hieu-template,lo-trinh-du-lieu}.md`, `CONTEXT.md` (mục «Chân trời» → «Chờ điều kiện», _Avoid_ thêm «chân trời (trong chữ cho người)»), `tests/scripts/lo-trinh.test.mjs` + `tests/scripts/tin-hieu.test.mjs` (12 + 1 câu ghim cũ — mỗi chỗ đổi ghi con trỏ thay thế ở Notes của hợp đồng).
- Test: RS-8, RS-8-quet, RS-8-do

- [ ] **Step 1:** `grep -n "chân trời" <các tệp>` → đổi mọi chuỗi thông báo / văn bản người đọc; giữ chú thích mã và khoá `chan_troi`.
- [ ] **Step 2:** RS-8 chạy ba lệnh phát thông báo; RS-8-quet quét chuỗi (bỏ dòng bắt đầu `//`, `#`, và chuỗi `chan_troi`) — đối chứng trên bộ máy gốc > 0. RS-8-do tiêm trả một câu về chữ cũ.
- [ ] **Step 3: Chạy** RS-8* + `node tests/scripts/lo-trinh.test.mjs` + `node tests/scripts/tin-hieu.test.mjs` xanh. **Step 4: Commit** `feat(ra-soat-lo-trinh): chữ «chờ điều kiện» cho mục chan_troi`.

**Phục vụ:** E8. **independent:** false.

---

### Task 8: Dữ liệu thật crm + kit (RS-9)

**Files:** Create `tests/scripts/ra-soat-lo-trinh-crm.mjs` (ngoài suite; khoá `executors.test.ra_soat_lo_trinh_crm`).

- [ ] **Step 1:** Tìm crm ở `../crm` cạnh kho kit chính (`git rev-parse --git-common-dir` của KIT → cha); không có hoặc `git cat-file -e d0351bcd` lỗi → thoát 2 nêu đường. `git archive d0351bcd docs/plan _acceptance` bung vào tạm; `ACCEPTANCE_TODAY=2026-10-14 node <cây>/scripts/lo-trinh.mjs --root <tạm> --ra-soat --json`; so viết sẵn: okr `[]`, kho-tai-lieu `[]`, viec-du-an DA6/DA7/DA8 `cho-dieu-kien/xep-lai` nguồn `tu-khai`. Kit: bung `git archive 1baceb96 docs/plans _acceptance` + config, chạy tương tự → A3, DP8 `doi-moc/moc-qua-ngay`.
- [ ] **Step 2: Chạy** → `PASS: RS-9-crm`, `PASS: RS-9-kit`. **Step 3: Commit**.

**Phục vụ:** E9. **independent:** false.

---

### Task 9: Gói `road-map` + P200

**Files:**
- Create: `road-map/.claude-plugin/plugin.json` (`name: road-map`, `version` = số của `acceptance-gate`), `road-map/commands/xem.md`, `road-map/README.md`
- Modify: `.claude-plugin/marketplace.json` (mục thứ năm, `tags: ["bat-theo-lua-chon"]`), `tests/plugins/run-tests.sh` (P200: đọc thêm manifest road-map, khoá cùng số, thêm một đột biến lệch số road-map, `MUT_KY_VONG` 6 → 7)
- Test: RS-10, RS-10-do; P200 qua `executors.test.plugins_vung_3`

- [ ] **Step 1:** `xem.md`:

````markdown
---
description: Xem rà soát lộ trình của kho hiện tại — hàng nào nên dời mốc, chờ điều kiện hay bác, kèm căn cứ. Chỉ đọc.
argument-hint: (không đối số)
---

Chỉ đọc. Giải `$AG` bằng `resolve-plugin.mjs` của feature-loop (`--plugin acceptance-gate --require scripts/lo-trinh.mjs`),
rồi chạy đúng dòng trong khối dưới và in nguyên văn kết quả. Kho chưa khai lộ trình thì nói đúng một dòng như vậy.

<!-- <<<RM-XEM-LENH -->
```
node "$AG/scripts/lo-trinh.mjs" --root . --ra-soat
```
<!-- RM-XEM-LENH>>> -->
````

- [ ] **Step 2:** RS-10 rút dòng trong khối `RM-XEM-LENH`, thay `$AG` bằng KIT, chạy trong kho RS-5, so stdout với lệnh lõi; kiểm manifest + marketplace + frontmatter không có `disable-model-invocation`. RS-10-do: bản sao marketplace bỏ mục.
- [ ] **Step 3:** Sửa P200 + chạy `bash tests/plugins/run-tests.sh --manh vung:3` QUA khoá máy → 0 FAIL. **Step 4: Commit** `feat(ra-soat-lo-trinh): gói road-map với lệnh xem rà soát`.

**Phục vụ:** E10, E10b. **independent:** true (chỉ chạm tệp gói và P200).

---

### Task 10: Đóng S3

- [ ] Chạy trọn `node tests/scripts/ra-soat-lo-trinh.test.mjs`, `node tests/scripts/ra-soat-lo-trinh-crm.mjs`, `node tests/scripts/lo-trinh.test.mjs`, `node tests/scripts/tin-hieu.test.mjs`, `node scripts/product-map.mjs --root . --check`.
- [ ] Con trỏ thay thế cho các ca cũ bị đổi chữ vào `## Notes` của hợp đồng (trước khi đổi `status`).
- [ ] `status: implemented` → S4 (qua khoá máy).
