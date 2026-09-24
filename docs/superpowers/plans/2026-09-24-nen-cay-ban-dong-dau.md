# Chân suite đọc đúng dòng trạng thái đầu tiên — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (feature-loop T2: tuần tự trong phiên chính). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chân `suite` của đường nền gọi đúng tên tệp đã theo dõi mà suite làm bẩn, và không đổ cho suite tệp đã bẩn sẵn.

**Architecture:** Lời đọc `git status --porcelain` của chân suite tách khỏi `gitTry()` (vốn `trim()` cả đầu ra) sang một lời gọi đọc thô trong khối marker `SUITE-TRANG-THAI`; mọi lời gọi `gitTry()` khác giữ nguyên.

**Tech Stack:** Node ESM thuần; ca kiểm trong `tests/scripts/duong-nen.test.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-24-nen-cay-ban-dong-dau-design.md` · hợp đồng `_acceptance/nen-cay-ban-dong-dau/contract.md`

## Global Constraints

- Không đổi khuôn dòng đỏ, không đổi luật đỏ; `gitTry()` giữ nguyên.
- Fixture do `dungKho()` sinh; mọi lượt truyền `--cache-root` do ca dựng.
- Khối ca mới đặt ngay sau NEN3, KHÔNG sửa dòng đầu tệp ca (PR #216 đang sửa vùng đó).

## Review Focus

- Kho mà `git status` lỗi (không phải kho git giữa chừng): lời đọc thô trả tập rỗng như `gitTry()` trả null — giữ nguyên hành vi (Task 2 bước 1).
- Tệp đổi tên (`R  a -> b`): dòng không mở bằng dấu cách, nhánh ` -> ` giữ nguyên — không thêm ca (Never trong Coverage).
- Dòng `?? …` (NEN3) phải còn xanh sau vá (Task 2 bước 2).
- Kho có dòng porcelain chứa CRLF: ngoài phạm vi, không ca.
- Ca đột biến khớp marker khác 1/1 thì ném → ca đỏ có tên (Task 1).

---

### Task 1: Ca NEN-CB1..5 (đỏ trên bản chưa vá)

**Files:** Modify `tests/scripts/duong-nen.test.mjs` (khối mới sau NEN3) · phục vụ E1–E5 · `independent: false`

- [ ] **Step 1:** chèn khối ca dưới đây ngay trước dòng `// ── NEN4 — tuần tự`:

```js

// ── NEN-CB* — chân suite gọi đúng tên TỆP ĐÃ THEO DÕI mà suite làm bẩn ──────────
// Hồ sơ nen-cay-ban-dong-dau. NEN3 chỉ đo tệp chưa theo dõi (`?? …`, không dấu cách đầu) nên
// không chạm lỗi trim() dòng đầu. Mỗi ca tự chụp porcelain THÔ trước/sau lượt và kiểm tiền điều
// kiện «dòng đích đứng đầu» — thiếu nó thì ca xanh cả trên bản chưa vá (gap-probe F1).
const porcelainTho = dir => execFileSync('git', ['-C', dir, 'status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const dongCayBan = tep => (bullets(tep) || []).filter(x => x.startsWith('nen suite: CAY BAN SAU SUITE '));
const CAN_README = JSON.stringify(['nen suite: CAY BAN SAU SUITE README.md']);
const VAT_BAN_SAN = 'vat cua vong\nban san truoc luot\n';

/** chayCB({ giuaA, banSan, script }) — kho lành của NEN0; banSan làm bẩn `vat.txt` TRƯỚC lượt. */
function chayCB({ giuaA = '', banSan = false, script } = {}) {
  const k = dungKho({ giuaA });
  if (banSan) writeFileSync(path.join(k.dir, 'vat.txt'), VAT_BAN_SAN);
  const truoc = porcelainTho(k.dir);
  const r = chayNen(k, { cache: CACHE, script });
  return { r, truoc, sau: porcelainTho(k.dir), b: dongCayBan(r.tep) };
}
// Kiểm chung cho ca «suite làm bẩn README.md»: tiền điều kiện rồi tập dòng BẰNG ĐÚNG mong đợi.
// Trả null khi đạt, hoặc chuỗi lỗi có tên ca.
function kiemReadme(ten, x, truocCan, dongDauCan) {
  if (JSON.stringify(x.truoc) !== JSON.stringify(truocCan)) return `${ten} fixture khong ${truocCan.length ? 'ban san' : 'sach'} truoc luot (${JSON.stringify(x.truoc)})`;
  if (x.sau[0] !== dongDauCan) return `${ten} dong dau sau luot khong phai «${dongDauCan}» — ca khong cham duoc loi (${JSON.stringify(x.sau)})`;
  if (JSON.stringify(x.b) !== CAN_README) return `${ten} tap dong cay ban khac mong doi (${JSON.stringify(x.b)})`;
  if (x.r.code !== 1 || fm(x.r.tep, 'suite') !== 'do') return `${ten} chan suite phai do, ma 1 (${tomTat(x.r)})`;
  return null;
}
const KB_CB1 = { giuaA: 'echo x >> README.md\n' };
const KB_CB2 = { giuaA: 'echo x >> README.md\n', banSan: true };

// ── NEN-CB1 / NEN-CB4 — suite SỬA / XOÁ tệp đã theo dõi, cây sạch trước lượt ──
{
  const loi = kiemReadme('NEN-CB1', chayCB(KB_CB1), [], ' M README.md');
  if (loi) bad(loi); else ok('NEN-CB1 suite sua README.md — dung mot dong «nen suite: CAY BAN SAU SUITE README.md»');
}
{
  const loi = kiemReadme('NEN-CB4', chayCB({ giuaA: 'rm README.md\n' }), [], ' D README.md');
  if (loi) bad(loi); else ok('NEN-CB4 suite xoa README.md — dung mot dong «nen suite: CAY BAN SAU SUITE README.md»');
}

// ── NEN-CB2 — vat.txt bẩn SẴN, suite sửa README.md (sắp trước) → không đổ oan vat.txt ──
{
  const loi = kiemReadme('NEN-CB2', chayCB(KB_CB2), [' M vat.txt'], ' M README.md');
  if (loi) bad(loi); else ok('NEN-CB2 tep ban san khong bi do cho suite — chi README.md duoc goi ten');
}

// ── NEN-CB3 — chiều im: vat.txt bẩn sẵn, suite không ghi gì → chân suite XANH ──
{
  const x = chayCB({ banSan: true });
  const bSuite = (bullets(x.r.tep) || []).filter(l => l.startsWith('nen suite:'));
  if (JSON.stringify(x.truoc) !== JSON.stringify([' M vat.txt'])) bad('NEN-CB3 fixture khong ban san truoc luot', JSON.stringify(x.truoc));
  else if (bSuite.length) bad('NEN-CB3 tep ban san bi goi ten du suite khong ghi gi', JSON.stringify(bSuite));
  else if (fm(x.r.tep, 'suite') !== 'xanh') bad('NEN-CB3 chan suite phai xanh', tomTat(x.r));
  else ok('NEN-CB3 tep ban san, suite khong ghi — chan suite xanh, 0 dong');
}

/** banDotBienCB() — bản chép `feature-loop` với khối SUITE-TRANG-THAI đọc lại qua gitTry() (có trim). */
function banDotBienCB() {
  const d = tamDir('duong-nen-cb-mut-');
  cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
  const f = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
  const src = readFileSync(f, 'utf8');
  const MO = '// <<<SUITE-TRANG-THAI', DONG = '// SUITE-TRANG-THAI>>>';
  const nMo = src.split(MO).length - 1, nDong = src.split(DONG).length - 1;
  if (nMo !== 1 || nDong !== 1) throw new Error(`marker SUITE-TRANG-THAI khop ${nMo}/${nDong} lan (can dung 1/1)`);
  const i = src.indexOf('\n', src.indexOf(MO)) + 1, j = src.lastIndexOf('\n', src.indexOf(DONG)) + 1;
  const thay = "  const trangThai = () => new Set((gitTry('status', '--porcelain', '--untracked-files=all') || '').split('\\n').filter(Boolean));\n";
  writeFileSync(f, src.slice(0, i) + thay + src.slice(j));
  if (readFileSync(f, 'utf8') === src) throw new Error('ban dot bien TRUNG ban goc — buoc tiem chua chay');
  return f;
}

// ── NEN-CB5 — chiều đỏ trong lượt: đặt lại trim() thì CB1 và CB2 phải ĐỎ đúng dấu vết ──
{
  try {
    const d = tamDir('duong-nen-cb-base-');
    cpSync(path.join(KIT, 'feature-loop'), path.join(d, 'feature-loop'), { recursive: true });
    const fSach = path.join(d, 'feature-loop', 'scripts', 'duong-nen.mjs');
    const loiSach = kiemReadme('NEN-CB5', chayCB({ ...KB_CB1, script: fSach }), [], ' M README.md')
      || kiemReadme('NEN-CB5', chayCB({ ...KB_CB2, script: fSach }), [' M vat.txt'], ' M README.md');
    if (loiSach) bad('NEN-CB5 ban chep hong — luot CHUA TIEM khong xanh, ket luan do cua luot tiem vo nghia', loiSach);
    else {
      const fMut = banDotBienCB();
      const m1 = chayCB({ ...KB_CB1, script: fMut }), m2 = chayCB({ ...KB_CB2, script: fMut });
      if (!m1.b.some(l => l.endsWith(' EADME.md'))) bad('NEN-CB5 dot bien: CB1 khong do voi «EADME.md» — phep do khong treo vao ban va', JSON.stringify(m1.b));
      else if (!m2.b.some(l => l.endsWith(' vat.txt'))) bad('NEN-CB5 dot bien: CB2 khong do oan «vat.txt» — phep do khong treo vao ban va', JSON.stringify(m2.b));
      else ok('NEN-CB5 dot bien dat lai trim() — luot chua tiem xanh, CB1 do «EADME.md», CB2 do oan «vat.txt»');
    }
  } catch (e) { bad('NEN-CB5 khong dung duoc ban dot bien', String(e.message || e)); }
}
```

- [ ] **Step 2:** `node tests/scripts/duong-nen.test.mjs 2>&1 | grep -E 'NEN-CB|^Results'` — Expected: FAIL NEN-CB1 (`EADME.md`), NEN-CB4 (`EADME.md`), NEN-CB2 (`vat.txt` bị đổ); PASS NEN-CB3; FAIL NEN-CB5 (khối marker chưa có — «khop 0/0 lan»).
- [ ] **Step 3:** commit `test(duong-nen): ca NEN-CB1..5 — chân suite gọi tên tệp đã theo dõi (đỏ trên bản chưa vá)`; ghi sổ.

### Task 2: Lời đọc trạng thái thô

**Files:** Modify `feature-loop/scripts/duong-nen.mjs` (dòng `const trangThai = …` của chân suite) · phục vụ E1–E5 · `independent: false`

- [ ] **Step 1:** thay dòng `const trangThai = () => new Set((gitTry('status', …`, giữ thụt lề hai dấu cách, bằng:

```js
  // <<<SUITE-TRANG-THAI
  // Trạng thái cây ĐỌC THÔ, KHÔNG qua gitTry(): dòng porcelain mở bằng dấu cách khi cột X trống
  // (` M a.txt`, ` D a.txt`), và trim() cắt dấu cách ấy ở ĐÚNG dòng đầu — tên tệp mất một ký tự
  // và một tệp bẩn sẵn bị đổ cho suite khi thứ tự dòng đổi (hồ sơ nen-cay-ban-dong-dau).
  const trangThai = () => {
    try {
      const o = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=all'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return new Set(o.split('\n').filter(Boolean));
    } catch { return new Set(); }
  };
  // SUITE-TRANG-THAI>>>
```

- [ ] **Step 2:** `node tests/scripts/duong-nen.test.mjs` — Expected: `Results: 24 passed, 0 failed`.
- [ ] **Step 3:** chạy lệnh eval `ncb_cay_ban` — exit 0.
- [ ] **Step 4:** commit `fix(duong-nen): chân suite đọc trạng thái cây thô, không trim dòng đầu`.
