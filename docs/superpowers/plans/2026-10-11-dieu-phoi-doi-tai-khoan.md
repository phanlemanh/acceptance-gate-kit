# DP4 `dieu-phoi-doi-tai-khoan` — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (vòng T2 của kit chạy S3 tuần tự
> trong phiên chính). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** đổi tài khoản giữa đợt Điều phối – Thợ không mất việc: đọc mức dùng, báo trước / tự chờ / tự bàn giao theo
ngưỡng, hai pha ★, `ban-giao.json` dựng từ git, tiếp tục dưới tài khoản kia bằng một lệnh, lưới cuối `StopFailure`,
mod đọc mức dùng và răng an toàn của lớp mod.

**Architecture:** mọi luật ở Node trong gói `dieu-phoi/scripts/` (một bên viết cho mỗi tệp trao tay); bộ phát lịch
gọi các hàm thuần qua `motNhip`; lệnh người chỉ làm việc của app. Mod TypeScript chỉ chuyển `rateLimits` cho CLI.

**Tech Stack:** Node ≥ 20 ESM (`node:test`), git, Claude Code 2.1.295 (`plugin test`, `plugin validate --strict`).

**Spec:** `docs/superpowers/specs/2026-10-11-dieu-phoi-doi-tai-khoan-design.md` (mười hai chỗ chọn) · hợp đồng
`_acceptance/dieu-phoi-doi-tai-khoan/contract.md` (15 AC) · evals `_acceptance/dieu-phoi-doi-tai-khoan/evals.yaml`.

## Global Constraints

- Gói không ghi cứng gì của một kho (DP1 AC-7): không chuỗi `crm`, `onehub`, cổng, đường người dùng.
- Mỗi tệp trao tay có ĐÚNG MỘT bên viết; khuôn ở `dieu-phoi/scripts/mau/`.
- Kho không có đợt: mọi CLI mới thoát 0 không ghi gì (`han-muc`), mọi hook mới im (thoát 0, không stdout, không tệp).
- Đồng hồ: `bayGio(nowMs)` của `song.mjs` (tham số trước, rồi `DIEU_PHOI_NOW_MS`, rồi `Date.now()`).
- Ngưỡng mặc định của khuôn đợt `han_muc = {bao_truoc_pct: 80, ban_giao_pct: 90, cho_ban_giao_phut: 20, cho_dat_lai_phut: 45}`.
- Lần đọc hết hiệu lực sau 35′; giữ tối đa 20 lần đọc; nhắc bàn giao tối đa một lần mỗi 5′ mỗi phiên.
- Commit WIP luôn bằng `git commit` thường — KHÔNG `--no-verify`, không đẩy nhánh.
- Mod không bao giờ trả lời «cho phép»; mod đọc mức dùng chỉ nghe `session.measure`.
- Ca đo: tên «DP4-…», kho thử do mã sinh, đường suy từ vị trí tệp; mỗi phép đo mới có cặp hai chiều trên cùng fixture
  (MEASURE-BIRTH-CLAUSE): vật lành xanh, bản sao bị tiêm đỏ với thông điệp ghim, kiểm bước tiêm đã áp.
- Không sửa tệp nguồn khi `repin-lane-noi-ra.test.mjs` đang chạy (GN13).

## Review Focus

1. **Đổi tài khoản trong vòng 10′ sau lời gọi công cụ cuối của thợ** → `tiep-tuc` vẫn mở chip cho dãy đã bàn giao
   (Task 6, ca DP4-08).
2. **Dấu «thợ chết vì hạn mức» của tài khoản cũ** sau khi tiếp tục → không kéo đợt vào bàn giao lần nữa (Task 6, DP4-07 hàng c).
3. **Đợt crm đang chạy (không khoá `han_muc`, không `dieu-khien.json`)** → bộ phát lịch đọc được, không sự kiện hạn mức,
   bàn giao tay vẫn có đồng hồ 20′ (Task 3 DP4-04, Task 4 hàng l, Task 5 DP4-06 hàng f).
4. **Kho có hook pre-commit chặn** → lưới cuối không bỏ hook, cây giữ nguyên, dấu ghi lý do (Task 8, DP4-10 hàng g).
5. **Cửa sổ đã qua giờ đặt lại mà số chưa mới** → cửa sổ coi như đã đặt lại, không giữ «chờ đặt lại» dính (Task 4, hàng o).

---

## Bản đồ tệp

| Tệp | Trách nhiệm | Task |
|---|---|---|
| `dieu-phoi/scripts/pha.mjs` | bảng chuyển 6 pha, khối `ban_giao`, `nowMs` | 1 |
| `dieu-phoi/scripts/han-muc.mjs` (mới) | MỘT bên viết `han-muc.json`, ba bộ chuẩn hoá, lần đọc hiệu lực, đánh giá ngưỡng, xét hạn mức mỗi nhịp | 2, 4 |
| `dieu-phoi/scripts/mau/han-muc.json`, `mau/ban-giao.json` (mới) | khuôn hai tệp trao tay | 2, 5 |
| `dieu-phoi/scripts/hinh-dang.mjs` | khoá cấu hình `han_muc` | 3 |
| `dieu-phoi/scripts/the.mjs` | thẻ khởi tạo hỏi khẩu vị hạn mức | 3 |
| `dieu-phoi/scripts/phat-lich.mjs` | nhịp: xét hạn mức, chờ đặt lại, bước bàn giao | 4, 5 |
| `dieu-phoi/scripts/muc-day.mjs` (mới) | MỘT hàm dựng mục dãy từ git + thư mục đợt | 5 |
| `dieu-phoi/scripts/ban-giao.mjs` (mới) | `ban-giao`, `ban-giao-xong`, `buocBanGiao`, `roiBanGiao`, `banGiaoGanNhat` | 5, 6 |
| `dieu-phoi/scripts/tiep-tuc.mjs`, `song.mjs` | bước 1/6, loại phiên đã bàn giao, lời ghi danh dùng mục dãy | 6 |
| `dieu-phoi/scripts/chan-doan.mjs` | mục `han-muc` | 2 |
| `dieu-phoi/scripts/hook-nhip.mjs` | lời nhắc bàn giao | 7 |
| `dieu-phoi/scripts/hook-het-han-muc.mjs` (mới) | lưới cuối StopFailure | 8 |
| `dieu-phoi/hooks/hooks.json` | khối StopFailure, khoá `modules` | 8, 10 |
| `dieu-phoi/hooks/mod/register.ts`, `dieu-phoi/hooks/mod/doc-muc-dung.ts` (mới) | module mod duy nhất + phần đọc mức dùng | 10 |
| `dieu-phoi/scripts/mod-luat.mjs` (mới) | khung mod MOD-SU-KIEN + quét chữ | 10 |
| `dieu-phoi/scripts/dieu-phoi.mjs` | nối `han-muc`, `ban-giao`, `ban-giao-xong` | 2, 5 |
| `dieu-phoi/commands/ban-giao.md` (mới), `commands/tiep-tuc.md` | lệnh người | 11 |
| `tests/dieu-phoi/doi-tai-khoan.test.mjs` (mới) | mọi ca «DP4-» chạy bằng node | 1–12 |
| `tests/dieu-phoi/kiem-mod.mjs` (mới), `tests/dieu-phoi/mod/doc-muc-dung.test.ts` (mới) | `plugin test` + validate | 10 |
| `tests/dieu-phoi/fixtures/rate-limits-mod.json` (mới) | fixture chung mod ↔ CLI | 2, 10 |
| `tests/dieu-phoi/dong-goi.test.mjs` (DP1-01), `tests/dieu-phoi/mo-dot.test.mjs` (DP2-01) | hai ca đã ký đổi kỳ vọng | 8, 11 |
| `_acceptance/config.yaml` | khoá `executors.test.dieu_phoi_dp4`, `executors.script.dieu_phoi_mod` | 1, 10 |
| `skills/acceptance/references/human-facing-language.md`, `CONTEXT.md`, `GUIDE.md`, `QUICKSTART.md`, `dieu-phoi/README.md` | tài liệu | 11 |

Mọi task `independent: false` — cùng chạm `dieu-phoi.mjs`, `phat-lich.mjs` và cùng một tệp test; chạy tuần tự.

---

### Task 0: Gộp origin/main (có DP3) vào nhánh

**Files:** không tệp mới. **Evals:** — (tiền đề của mọi task). **independent:** false.

- [ ] **Step 1:** `git fetch origin && git merge-base --is-ancestor origin/vong/dieu-phoi-tiep-tuc-mot-lenh origin/main`
  — thoát 0 mới đi tiếp (DP3 đã vào main); không thì DỪNG, báo Điều phối «S3 chờ DP3 vào main».
- [ ] **Step 2:** `git merge --no-edit origin/main` (merge, KHÔNG rebase — rebase giết pin). Xung đột ở `PRODUCT-MAP.md`,
  `LO-TRINH.html` → lấy bên main rồi `node scripts/product-map.mjs --root .`.
- [ ] **Step 3:** Verify: `node --test tests/dieu-phoi/` → mọi ca DP1/DP2/DP3 (và DP7 nếu đã gộp) «ok».
- [ ] **Step 4:** Commit merge (git tự tạo). Báo Điều phối một dòng.

### Task 1: Hai pha ★ trong bảng chuyển (AC-1 · E1)

**Files:** Modify `dieu-phoi/scripts/pha.mjs`; Create `tests/dieu-phoi/doi-tai-khoan.test.mjs`; Modify
`_acceptance/config.yaml` (khoá `dieu_phoi_dp4`). **independent:** false.

**Interfaces — Produces:** `PHA` (6 pha), `PHA_SAO = ['dang-ban-giao','cho-tiep-tuc']`, `CHUYEN`,
`datPha(thuMuc, sang, {boi, lyDo, nowMs})` → `{doi, pha, tu}`; khi `sang === 'dang-ban-giao'` ghi
`ban_giao: {ma: 'bg-<YYYYMMDDTHHMMSSZ>', pha_truoc, vao_luc, ly_do, boi}`; rời pha ★ sang pha thường đặt `ban_giao: null`.

- [ ] **Step 1: Khung tệp test + ca DP4-01 bang-chuyen (đỏ trước).** Đầu tệp chép các hàm khung của
  `tests/dieu-phoi/tiep-tuc.test.mjs` (KHÔNG import tệp test đã ký — import sẽ chạy lại ca của nó): `tam`, `docJ`, `ghiJ`,
  `ENV`, `bamCay`, `nap`, `git`, `chayCli`, `khoLienKet`, `lenhHook`, `ioGia`. Ma trận viết sẵn:

```js
const PHA6 = ['nhap', 'dang-chay', 'tam-dung', 'dang-dong', 'dang-ban-giao', 'cho-tiep-tuc'];
// Chép từ AC-1 — KHÔNG rút từ CHUYEN của mã.
const CANH_AC1 = new Set([
  'nhap>dang-chay', 'dang-chay>tam-dung', 'dang-chay>dang-dong', 'tam-dung>dang-chay', 'tam-dung>dang-dong',
  'dang-chay>dang-ban-giao', 'tam-dung>dang-ban-giao', 'dang-ban-giao>cho-tiep-tuc',
  'cho-tiep-tuc>dang-chay', 'cho-tiep-tuc>tam-dung', 'cho-tiep-tuc>dang-dong',
]);
const datTruc = (dot, pha) => { // đặt thẳng tệp để dựng ô xuất phát của ma trận (fixture, không phải vật đo)
  const p = path.join(dot, 'dieu-khien.json');
  const dk = docJ(p);
  ghiJ(p, { ...dk, pha, ban_giao: pha === 'dang-ban-giao' || pha === 'cho-tiep-tuc' ? { ma: 'bg-20261011T000000Z', pha_truoc: 'dang-chay', vao_luc: '2026-10-11T00:00:00.000Z', ly_do: 't', boi: 't' } : null });
};
test('DP4-01 bang-chuyen', () => {
  const dong = [];
  for (const tu of PHA6) for (const sang of PHA6) {
    const { kho, dot } = khoLienKet();
    datTruc(dot, tu);
    const p = path.join(dot, 'dieu-khien.json');
    const bam = bamTep(p), dai = docJ(p).lich_su.length;
    const r = chayCli(kho, ['pha', sang, '--boi', 't']);
    const mong = tu === sang ? 'cheo' : CANH_AC1.has(`${tu}>${sang}`) ? 'hop-le' : 'tu-choi';
    const thuc = r.ma === 0 ? (docJ(p).lich_su.length === dai + 1 ? 'hop-le' : docJ(p).lich_su.length === dai ? 'cheo' : 'la') : (bamTep(p) === bam ? 'tu-choi' : 'tu-choi-nhung-ghi');
    dong.push(`${tu}>${sang} · ${mong} · ${thuc}`);
  }
  console.log(dong.map((d) => `  ${d}`).join('\n'));
  assert.equal(dong.length, 36);
  assert.deepEqual(dong.filter((d) => { const [, m, t] = d.split(' · '); return m !== t; }), []);
});
```
  (`bamTep(p)` = sha256 nội dung tệp.) Ca thứ hai «DP4-01 vao-ban-giao»: `pha dang-ban-giao` từ `dang-chay` → `ban_giao.ma`
  khớp `/^bg-\d{8}T\d{6}Z$/`, `pha_truoc === 'dang-chay'`. Để kho thử rẻ: dựng MỘT kho rồi sao chép thư mục đợt cho mỗi
  ô (36 lần `khoLienKet` quá chậm) — `khoMau()` một lần, mỗi ô `fs.cpSync` thư mục kho sang thư mục tạm mới.
- [ ] **Step 2:** `node --test --test-name-pattern 'DP4-01' tests/dieu-phoi/doi-tai-khoan.test.mjs` → FAIL (pha `dang-ban-giao` không phải một pha).
- [ ] **Step 3: Sửa `pha.mjs`.**

```js
import { bayGio } from './song.mjs';
export const PHA = ['nhap', 'dang-chay', 'tam-dung', 'dang-dong', 'dang-ban-giao', 'cho-tiep-tuc'];
export const PHA_SAO = ['dang-ban-giao', 'cho-tiep-tuc'];
export const CHUYEN = {
  nhap: ['dang-chay'],
  'dang-chay': ['tam-dung', 'dang-dong', 'dang-ban-giao'],
  'tam-dung': ['dang-chay', 'dang-dong', 'dang-ban-giao'],
  'dang-dong': [],
  // DP4 (design chỗ chọn 1): mọi lối rời đi qua cho-tiep-tuc — một chỗ dựng và lưu bàn giao.
  'dang-ban-giao': ['cho-tiep-tuc'],
  'cho-tiep-tuc': ['dang-chay', 'tam-dung', 'dang-dong'],
};
const maBanGiao = (ms) => `bg-${new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')}`;
export function datPha(thuMuc, sang, { boi = 'cli', lyDo = '', nowMs = null } = {}) {
  if (!PHA.includes(sang)) throw new Error(`pha: «${sang}» không phải một pha (${PHA.join(', ')})`);
  const cu = docPha(thuMuc);
  if (cu.pha === sang) return { doi: false, pha: sang };
  if (!(CHUYEN[cu.pha] ?? []).includes(sang)) throw new Error(`pha: ${cu.pha} → ${sang} không có trong bảng chuyển`);
  const ms = bayGio(nowMs);
  const luc = new Date(ms).toISOString();
  let banGiao = cu.ban_giao ?? null;
  if (sang === 'dang-ban-giao') banGiao = { ma: maBanGiao(ms), pha_truoc: cu.pha, vao_luc: luc, ly_do: lyDo, boi };
  else if (!PHA_SAO.includes(sang)) banGiao = null;
  ghiJsonNguyenTu(path.join(thuMuc, TEP_DIEU_KHIEN), {
    pha: sang, nguon_goi: cu.nguon_goi ?? null, dat_boi: boi, dat_luc: luc, ly_do: lyDo,
    ...(banGiao ? { ban_giao: banGiao } : {}),
    lich_su: [...(cu.lich_su ?? []), { pha: sang, dat_boi: boi, dat_luc: luc, ly_do: lyDo }],
  });
  return { doi: true, pha: sang, tu: cu.pha };
}
```
- [ ] **Step 4: Ca DP4-01 khong-cap + DP4-01-do cap-o-ban-giao.** Với mỗi pha ★: kho thử, đơn `xin/P1-s4.json` lành (ghi
  bằng CLI `xin s4` từ worktree P1), `datTruc(dot, pha)`, `taoVong(dot, ioGia(T), () => T)()` → không có `khoa/s4`, băm
  `xin/` trước == sau; đối chứng: cùng fixture ở `dang-chay` → `khoa/s4/chu.json` có. Ca đỏ: chép gói vào thư mục tạm,
  thay trong `phat-lich.mjs` dòng `choPhepTheoPha` bằng bản trả `true` cho `dang-ban-giao` (kiểm chuỗi thay có mặt), chạy
  nhịp từ gói sao → `khoa/s4` có; assert thông điệp ca nêu «dang-ban-giao».
- [ ] **Step 5:** Thêm khoá vào `_acceptance/config.yaml` ngay sau `dieu_phoi_dp3`:

```yaml
    # Hồ sơ dieu-phoi-doi-tai-khoan: như khoá `dieu_phoi_dp3` nhưng ghim cả «ok … DP4-».
    dieu_phoi_dp4: "bash -c 'set -o pipefail; node --test --test-reporter=tap \"tests/dieu-phoi/**/*.test.mjs\" 2>&1 | grep -E \"^ *(not )?ok [0-9]+ - DP[1234]-|^ *not ok|^#   |^# (pass|fail|skipped|todo) \" | paste -sd\"|\" -'"
```
- [ ] **Step 6:** Verify `node --test tests/dieu-phoi/` → DP4-01 ×3 ok, DP1–DP3 nguyên. Commit
  `dieu-phoi: hai pha bàn giao trong bảng chuyển (DP4 AC-1)`.

### Task 2: CLI `han-muc`, khuôn, chuẩn hoá, mục chẩn đoán (AC-2 · E2)

**Files:** Create `dieu-phoi/scripts/han-muc.mjs`, `dieu-phoi/scripts/mau/han-muc.json`,
`tests/dieu-phoi/fixtures/rate-limits-mod.json`; Modify `dieu-phoi/scripts/dieu-phoi.mjs`, `dieu-phoi/scripts/chan-doan.mjs`.
**independent:** false.

**Interfaces — Produces:** `TEP_HAN_MUC`, `GIU_TOI_DA = 20`, `TUOI_TOI_DA_MS = 35′`, `CUA_SO = ['five_hour','seven_day']`,
`MAC_DINH_HAN_MUC`, `chuanHoa(nguon, du)` → `{five_hour?:{pct,dat_lai}, seven_day?:…}` (ném khi rỗng/nguồn lạ),
`ghiLanDoc(cwd, {nguon, phien, doc, nowMs})` → `{ghi:false, ly_do:'khong-co-dot'} | {ghi:true, lan}`,
`docLanDoc(thuMuc)` → lần đọc hợp lệ theo thứ tự ghi, `lanDocHieuLuc(thuMuc, {nowMs, vai})` → `{lan, tuoi}`.

- [ ] **Step 1: Fixture chung** `tests/dieu-phoi/fixtures/rate-limits-mod.json`:

```json
{ "rateLimits": [ { "kind": "five_hour", "percentUsed": 23.5, "resetsAt": "2026-10-11T03:09:59.919Z" },
                  { "kind": "seven_day", "percentUsed": 12, "resetsAt": "2026-10-12T23:59:59.919Z" } ],
  "mong_doi": { "five_hour": { "pct": 23.5, "dat_lai": "2026-10-11T03:09:59.919Z" },
                "seven_day": { "pct": 12, "dat_lai": "2026-10-12T23:59:59.919Z" } } }
```
- [ ] **Step 2: Ca DP4-02 chuan-hoa (đỏ trước)** — ma trận 6 đầu vào viết sẵn:

```js
const FX = docJ(path.join(DAY, 'fixtures', 'rate-limits-mod.json'));
const MA_TRAN_DOC = [
  ['mod', FX.rateLimits, FX.mong_doi],
  ['get-usage', { windows: [
      { label: '5-hour limit', percentUsed: 23, resetsAt: '2026-10-11T03:09:59.919Z' },
      { label: 'Weekly · all models', percentUsed: 12, resetsAt: '2026-10-12T23:59:59.919Z' },
      { label: 'Weekly · Fable', percentUsed: 0, resetsAt: '2026-10-13T00:00:00.000Z' } ] },
    { five_hour: { pct: 23, dat_lai: '2026-10-11T03:09:59.919Z' }, seven_day: { pct: 12, dat_lai: '2026-10-12T23:59:59.919Z' } }],
  ['statusline', { rate_limits: { five_hour: { used_percentage: 41, resets_at: 1760151600 } } },
    { five_hour: { pct: 41, dat_lai: new Date(1760151600 * 1000).toISOString() } }],
  ['mod', [], null], ['mod', '{hỏng', null], ['la', FX.rateLimits, null],
];
test('DP4-02 chuan-hoa', () => {
  const { kho, dot } = khoLienKet();
  const p = path.join(dot, 'han-muc.json');
  const dong = MA_TRAN_DOC.map(([nguon, du, mong], i) => {
    const truoc = fs.existsSync(p) ? bamTep(p) : null;
    const r = chayCli(kho, ['han-muc', '--nguon', nguon, '--phien', 's-gs', '--doc', typeof du === 'string' ? du : JSON.stringify(du)]);
    if (mong === null) {
      assert.equal(r.ma, 1, `hàng ${i}: ${r.out}`);
      assert.match(r.err, new RegExp(nguon === 'la' ? 'nguồn «la»' : `nguồn ${nguon}`));
      assert.equal(fs.existsSync(p) ? bamTep(p) : null, truoc, `hàng ${i}: tệp đổi`);
      return `${i} ${nguon} · từ chối`;
    }
    assert.equal(r.ma, 0, r.err);
    assert.deepEqual(docJ(p).doc.at(-1).cua_so, mong);
    return `${i} ${nguon} · ${JSON.stringify(mong)}`;
  });
  console.log(dong.map((d) => `  ${d}`).join('\n'));
  assert.equal(dong.length, 6);
});
```
  Thêm ca «DP4-02 hai-muoi» (25 lần gọi → 20 lần đọc, `luc` đầu là lần thứ 6), «DP4-02 khuon» (tập khoá sâu của lần đọc ==
  tập khoá sâu của `mau/han-muc.json`, hàm `khoaSau(o)` liệt `a.b.c`), «DP4-02 round-trip» (`lanDocHieuLuc` của mô-đun nạp
  từ gói trả đúng lần đọc vừa ghi), «DP4-02-do khong-dot» (kho git trống, cùng lệnh → thoát 0, stdout `khong-co-dot`,
  `bamCay` trước == sau; đối chứng: kho có đợt → tệp có), «DP4-02 chan-doan-han-muc» (bốn hàng + đợt không khai).
- [ ] **Step 3:** chạy → FAIL (lệnh `han-muc` không có).
- [ ] **Step 4: `han-muc.mjs` (phần ghi/đọc):**

```js
// Mức dùng hạn mức (spec workflow §4.5, design DP4 chỗ chọn 2–5) — MỘT bên viết của `han-muc.json`.
import path from 'node:path';
import { PHUT_MS } from './cau-hinh.mjs';
import { docJson, ghiJsonNguyenTu, timThuMucDot } from './dot.mjs';
import { bayGio } from './song.mjs';
import { docVai } from './vai.mjs';

export const TEP_HAN_MUC = 'han-muc.json';
export const GIU_TOI_DA = 20;
export const TUOI_TOI_DA_MS = 35 * PHUT_MS;
export const CUA_SO = ['five_hour', 'seven_day'];
export const NGUON = ['mod', 'get-usage', 'statusline'];
export const MAC_DINH_HAN_MUC = { bao_truoc_pct: 80, ban_giao_pct: 90, cho_ban_giao_phut: 20, cho_dat_lai_phut: 45 };

const pct = (x) => (Number.isFinite(x) && x >= 0 ? Math.round(x * 10) / 10 : null);
const iso = (v) => {
  if (typeof v === 'number' && Number.isFinite(v)) return new Date(v < 1e12 ? v * 1000 : v).toISOString();
  if (typeof v === 'string' && Number.isFinite(Date.parse(v))) return new Date(Date.parse(v)).toISOString();
  return null;
};
const muc = (p, d) => ({ pct: p, dat_lai: iso(d) });
const CHUAN_HOA = {
  mod: (du) => (Array.isArray(du) ? Object.fromEntries(du.filter((r) => CUA_SO.includes(r?.kind) && pct(r.percentUsed) != null).map((r) => [r.kind, muc(pct(r.percentUsed), r.resetsAt)])) : null),
  'get-usage': (du) => {
    const ws = Array.isArray(du) ? du : du?.windows ?? du?.plan?.windows;
    if (!Array.isArray(ws)) return null;
    const ra = {};
    for (const w of ws) {
      const nhan = String(w?.label ?? '');
      const k = /^5-hour\b/i.test(nhan) ? 'five_hour' : /^weekly\s*·\s*all models$/i.test(nhan) ? 'seven_day' : null;
      if (k && pct(w.percentUsed) != null) ra[k] = muc(pct(w.percentUsed), w.resetsAt);
    }
    return ra;
  },
  statusline: (du) => {
    const rl = du?.rate_limits ?? du;
    if (!rl || typeof rl !== 'object') return null;
    const ra = {};
    for (const k of CUA_SO) {
      const w = rl[k];
      const p = pct(w?.used_percentage ?? w?.percentUsed ?? w?.percent);
      if (p != null) ra[k] = muc(p, w.resets_at ?? w.resetsAt);
    }
    return ra;
  },
};

export function chuanHoa(nguon, du) {
  if (!CHUAN_HOA[nguon]) throw new Error(`han-muc: nguồn «${nguon}» không thuộc ${NGUON.join(', ')}`);
  const cs = CHUAN_HOA[nguon](du);
  if (!cs || Object.keys(cs).length === 0) throw new Error(`han-muc: đầu vào nguồn ${nguon} không ra cửa sổ nào (${CUA_SO.join(', ')})`);
  return cs;
}

export function ghiLanDoc(cwd, { nguon, phien, doc, nowMs = null }) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) return { ghi: false, ly_do: 'khong-co-dot' };
  if (typeof phien !== 'string' || phien === '') throw new Error('han-muc: cần --phien <mã phiên đọc>');
  let du;
  try {
    du = typeof doc === 'string' ? JSON.parse(doc) : doc;
  } catch {
    throw new Error(`han-muc: --doc của nguồn ${nguon} không phải JSON`);
  }
  const lan = { nguon, phien, luc: new Date(bayGio(nowMs)).toISOString(), cua_so: chuanHoa(nguon, du) };
  const p = path.join(thuMuc, TEP_HAN_MUC);
  const cu = docJson(p, { doc: [] });
  ghiJsonNguyenTu(p, { doc: [...(Array.isArray(cu?.doc) ? cu.doc : []), lan].slice(-GIU_TOI_DA) });
  return { ghi: true, lan };
}

const hopLe = (l) => l && NGUON.includes(l.nguon) && typeof l.phien === 'string' && Number.isFinite(Date.parse(l.luc)) && l.cua_so && typeof l.cua_so === 'object';
export function docLanDoc(thuMuc) {
  let du = null;
  try { du = docJson(path.join(thuMuc, TEP_HAN_MUC), null); } catch { du = null; }
  return Array.isArray(du?.doc) ? du.doc.filter(hopLe) : [];
}

// Lần đọc còn tươi (≤ 35′) của tài khoản hiện tại: đọc sau nhan_luc của giám sát, hoặc do chính giám sát đọc
// (design chỗ chọn 3). `lan` là lần mới nhất trong số đó.
export function lanDocHieuLuc(thuMuc, { nowMs = null, vai = docVai(thuMuc) } = {}) {
  const now = bayGio(nowMs);
  const gs = vai?.giam_sat ?? null;
  const nhan = gs?.nhan_luc ? Date.parse(gs.nhan_luc) : null;
  const tuoi = docLanDoc(thuMuc)
    .filter((l) => now - Date.parse(l.luc) <= TUOI_TOI_DA_MS)
    .filter((l) => nhan == null || Date.parse(l.luc) >= nhan || l.phien === gs?.phien)
    .sort((a, b) => Date.parse(a.luc) - Date.parse(b.luc));
  return { lan: tuoi.at(-1) ?? null, tuoi };
}
```
  `mau/han-muc.json`: `{"doc":[{"nguon":"mod","phien":"<mã phiên>","luc":"<ISO>","cua_so":{"five_hour":{"pct":0,"dat_lai":"<ISO>"},"seven_day":{"pct":0,"dat_lai":"<ISO>"}}}]}`.
- [ ] **Step 5: Nối CLI** trong `dieu-phoi.mjs` (trước khối `try`, vì kho không đợt phải thoát 0):

```js
'han-muc': () => {
  const kq = ghiLanDoc(cwd, { nguon: co.nguon, phien: typeof co.phien === 'string' ? co.phien : null, doc: typeof co.doc === 'string' ? co.doc : '' });
  return kq.ghi ? `han-muc: ${kq.lan.nguon} ${Object.entries(kq.lan.cua_so).map(([k, v]) => `${k} ${v.pct}%`).join(' · ')}` : kq.ly_do;
},
```
  và dòng dùng thêm `han-muc --nguon <mod|get-usage|statusline> --phien <id> --doc '<json>'`.
- [ ] **Step 6: Mục `han-muc` của `chan-doan`** (sau mục `vai`, chỉ khi `docCauHinh(thuMuc).han_muc` có):

```js
let cfg = null;
try { cfg = docCauHinh(thuMuc); } catch { cfg = null; }
if (cfg?.han_muc) {
  const { lan } = lanDocHieuLuc(thuMuc, { nowMs });
  them('han-muc', lan ? 'du' : 'thieu', lan
    ? `${lan.nguon} lúc ${lan.luc}: ${Object.entries(lan.cua_so).map(([k, v]) => `${k} ${v.pct}%`).join(' · ')}`
    : 'không có lần đọc hạn mức còn hiệu lực — gọi `get_usage` rồi `han-muc --nguon get-usage --phien <mã phiên> --doc <kết quả>`');
}
```
- [ ] **Step 7:** Verify `node --test --test-name-pattern 'DP4-02' tests/dieu-phoi/doi-tai-khoan.test.mjs` → ok ×6; suite
  dieu-phoi nguyên. Commit `dieu-phoi: CLI han-muc ghi mức dùng từ ba nguồn (DP4 AC-2)`.

### Task 3: Khoá cấu hình `han_muc` và thẻ khởi tạo (AC-4 · E4)

**Files:** Modify `dieu-phoi/scripts/hinh-dang.mjs`, `dieu-phoi/scripts/mau/dieu-phoi.config.json`, `dieu-phoi/scripts/the.mjs`.
**independent:** false.

- [ ] **Step 1: Ca DP4-04 cau-hinh (đỏ trước):** `kiemCauHinh` nạp từ gói; khuôn và `tests/dieu-phoi/fixtures/dot-crm-0910/dieu-phoi.config.json`
  qua; khuôn `han_muc` deepEqual `{80, 90, 20, 45}`; bốn cấu hình sai (bỏ `cho_dat_lai_phut` · `ban_giao_pct: 120` ·
  `{bao_truoc_pct: 90, ban_giao_pct: 90}` · thêm `han_muc.x: 1`) ném lỗi chứa đúng `han_muc.cho_dat_lai_phut`,
  `han_muc.ban_giao_pct`, `han_muc.bao_truoc_pct`, `han_muc.x`; biên `{89, 90}` qua. Ca «DP4-04 the-khoi-tao»: gói đợt thử
  khai `han_muc {70, 85, 15, 30}` → `the khoi-tao --json` có `hoi` chứa `khau-vi-han-muc`, `han_muc` deepEqual bốn số.
- [ ] **Step 2:** chạy → FAIL (khoá lạ `han_muc`).
- [ ] **Step 3: `hinh-dang.mjs`:** thêm `'han_muc'` vào `KHOA_CAU_HINH` và sau kiểm `kiem_moi_truong`:

```js
const KHOA_HAN_MUC = ['bao_truoc_pct', 'ban_giao_pct', 'cho_ban_giao_phut', 'cho_dat_lai_phut'];
if (du.han_muc !== undefined) {
  const h = du.han_muc;
  if (!laObject(h)) sai('han_muc phải là object');
  kiemKhoaLa(h, KHOA_HAN_MUC, TEP_CAU_HINH, 'han_muc.');
  for (const k of ['bao_truoc_pct', 'ban_giao_pct']) if (!(Number.isFinite(h[k]) && h[k] >= 1 && h[k] <= 100)) sai(`han_muc.${k} phải là phần trăm 1–100`);
  for (const k of ['cho_ban_giao_phut', 'cho_dat_lai_phut']) if (!laSoDuong(h[k])) sai(`han_muc.${k} phải là số phút dương`);
  if (h.bao_truoc_pct >= h.ban_giao_pct) sai('han_muc.bao_truoc_pct phải nhỏ hơn han_muc.ban_giao_pct');
}
```
  (`kiemKhoaLa` báo `khoá lạ han_muc.x` — đúng tên khoá.) Khuôn `mau/dieu-phoi.config.json` thêm
  `"han_muc": { "bao_truoc_pct": 80, "ban_giao_pct": 90, "cho_ban_giao_phut": 20, "cho_dat_lai_phut": 45 }`.
- [ ] **Step 4: `the.mjs`:** đọc `docCauHinh(thuMuc)` (lỗi → null); `hoi: ['quyen-tu-merge', 'khau-vi-han-muc', ...build]`,
  thêm trường `han_muc: cfg?.han_muc ?? null`. Kiểm ca DP2 của thẻ (`tests/dieu-phoi/mo-dot.test.mjs` tìm `hoi`) — nếu ca
  DP2 so `hoi` bằng nhau thì đó là ca đã ký thứ ba đổi kỳ vọng: DỪNG, ghi dòng sổ `revisit` ở hồ sơ DP2 cùng lượt với DP2-01.
- [ ] **Step 5:** Verify DP4-04 ok ×2; suite dieu-phoi nguyên. Commit `dieu-phoi: ngưỡng hạn mức của đợt và thẻ khởi tạo (DP4 AC-4)`.

### Task 4: Xét hạn mức trong nhịp bộ phát lịch (AC-3 · E3)

**Files:** Modify `dieu-phoi/scripts/han-muc.mjs`, `dieu-phoi/scripts/phat-lich.mjs`. **independent:** false.

**Interfaces — Produces:** `tocDoDot(tuoi, cuaSo)` → điểm/phút | null; `danhGiaHanMuc({hanMuc, tuoi, lan, nowMs})` →
`{co_mod, cua_so: [{ten, pct, dat_lai, nguong_ban_giao, toc_do, muc: 'duoi'|'gan'|'cham'}]}`;
`xetHanMucNhip(thuMuc, {cfg, cu, nowMs, pha})` → `{trang_thai: object|null, da_bao: string[], cho_dat_lai: {cua_so, den}|null, vao_ban_giao: boolean}`.

- [ ] **Step 1: Ca DP4-03 ma-tran (đỏ trước)** — 15 hàng viết sẵn. Mỗi hàng: `khoLienKet()`, ghi đè cấu hình đợt
  (`han_muc` hoặc không), ghi `han-muc.json` bằng CLI thật với `DIEU_PHOI_NOW_MS` (lần đọc «tuổi 2′» = `T − 2′`), `vai.json`
  có `nhan_luc` khai theo hàng, rồi `taoVong(dot, ioGia(T), () => T)()`; hàng (c) và (o) chạy hai nhịp. So:
  `suKienCua(dot).filter(e => ['gan-han-muc','cham-han-muc','cho-dat-lai'].includes(e.loai)).map(e => e.loai)` == mảng viết
  sẵn; `docJ(dieu-khien.json).pha` == pha viết sẵn; hàng (i) và (m): `trang-thai.json` `han_muc.cua_so[five_hour].nguong_ban_giao`
  == 80 / 84 (số viết tay). Dòng in: `(x) · mong · thực`. Ca đỏ «DP4-03-do bo-ve-giam-sat»: bản sao gói xoá vế
  `|| l.phien === gs?.phien` (kiểm chuỗi có mặt trước khi xoá) → chỉ hàng (h) lệch, ca nêu «(h)».
  Giờ đặt lại «sau 30′» = `T + 30′`, «sau 3 giờ» = `T + 180′`; (i): ba lần đọc `get-usage` tại `T−30′, T−15′, T` với 37, 59,5,
  82; (m): 79, 82, 85; (n): 77, 80, 83; (o) nhịp 2 ở `T + 31′` có lần đọc 10 % đặt lại `T + 330′`.
- [ ] **Step 2:** chạy → FAIL.
- [ ] **Step 3: phần đánh giá trong `han-muc.mjs`:**

```js
import { datPha } from './pha.mjs';
import { ghiSuKien } from './dot.mjs';
import fs from 'node:fs';

const lam1 = (x) => Math.round(x * 10) / 10;
export function tocDoDot(tuoi, cuaSo) {
  const ds = tuoi.filter((l) => l.cua_so?.[cuaSo]);
  const moi = ds.at(-1);
  if (!moi) return null;
  const cung = ds.filter((l) => l.cua_so[cuaSo].dat_lai === moi.cua_so[cuaSo].dat_lai);
  if (cung.length < 2) return null;
  const phut = (Date.parse(moi.luc) - Date.parse(cung[0].luc)) / PHUT_MS;
  return phut > 0 ? (moi.cua_so[cuaSo].pct - cung[0].cua_so[cuaSo].pct) / phut : null;
}
export function danhGiaHanMuc({ hanMuc, tuoi, lan, nowMs }) {
  const now = bayGio(nowMs);
  const coMod = tuoi.some((l) => l.nguon === 'mod');
  const ra = [];
  for (const ten of CUA_SO) {
    const w = lan?.cua_so?.[ten];
    if (!w) continue;
    if (w.dat_lai && Date.parse(w.dat_lai) <= now) continue; // cửa sổ đã đặt lại — số này hết nghĩa
    const toc = coMod ? null : tocDoDot(tuoi, ten);
    const nguong = toc != null && toc > 0 ? lam1(Math.max(hanMuc.bao_truoc_pct, hanMuc.ban_giao_pct - toc * 30)) : hanMuc.ban_giao_pct;
    ra.push({ ten, pct: w.pct, dat_lai: w.dat_lai, toc_do: toc, nguong_ban_giao: nguong, muc: w.pct >= nguong ? 'cham' : w.pct >= hanMuc.bao_truoc_pct ? 'gan' : 'duoi' });
  }
  return { co_mod: coMod, cua_so: ra };
}

// Một nhịp (design chỗ chọn 4–6): MỘT sự kiện cho mức cao nhất mới đạt mỗi cửa sổ mỗi giờ đặt lại; chạm mà đặt lại
// gần → chờ đặt lại (không cấp lượt, không đổi pha); chạm mà đặt lại xa, hoặc có dấu thợ chết vì hạn mức → vào bàn giao.
export function xetHanMucNhip(thuMuc, { cfg, cu = {}, nowMs, pha }) {
  const hanMuc = cfg?.han_muc;
  if (!hanMuc) return { trang_thai: null, da_bao: cu.han_muc_da_bao ?? [], cho_dat_lai: null, vao_ban_giao: false };
  const now = bayGio(nowMs);
  const daBao = new Set(cu.han_muc_da_bao ?? []);
  const { lan, tuoi } = lanDocHieuLuc(thuMuc, { nowMs: now });
  const dg = danhGiaHanMuc({ hanMuc, tuoi, lan, nowMs: now });
  let choDatLai = null;
  let vao = null;
  for (const w of dg.cua_so) {
    const k = `${w.ten}@${w.dat_lai}`;
    if (w.muc === 'cham') {
      const gan = w.dat_lai && Date.parse(w.dat_lai) - now <= hanMuc.cho_dat_lai_phut * PHUT_MS;
      if (gan) {
        choDatLai = { cua_so: w.ten, den: w.dat_lai };
        if (!daBao.has(`cho:${k}`)) ghiSuKien(thuMuc, { loai: 'cho-dat-lai', cua_so: w.ten, pct: w.pct, den: w.dat_lai, ly_do: `${w.ten} ${w.pct}% chạm ngưỡng ${w.nguong_ban_giao}%, đặt lại lúc ${w.dat_lai} — tự chờ`, can_phan: true });
        daBao.add(`cho:${k}`).add(`gan:${k}`);
      } else {
        vao ??= `chạm ngưỡng ${w.ten} ${w.pct}% (ngưỡng ${w.nguong_ban_giao}%)`;
        if (!daBao.has(`cham:${k}`)) ghiSuKien(thuMuc, { loai: 'cham-han-muc', cua_so: w.ten, pct: w.pct, nguong: w.nguong_ban_giao, viec: '/dieu-phoi:ban-giao', can_phan: true });
        daBao.add(`cham:${k}`).add(`gan:${k}`);
      }
    } else if (w.muc === 'gan' && !daBao.has(`gan:${k}`)) {
      ghiSuKien(thuMuc, { loai: 'gan-han-muc', cua_so: w.ten, pct: w.pct, nguong: hanMuc.bao_truoc_pct, can_phan: true });
      daBao.add(`gan:${k}`);
    }
  }
  const dDau = path.join(thuMuc, 'ban-giao', 'dau');
  const dau = fs.existsSync(dDau) ? fs.readdirSync(dDau).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort() : [];
  if (!vao && dau.length) vao = `thợ ${dau.join(', ')} chết vì hạn mức`;
  let vaoBanGiao = false;
  if (vao && (pha === 'dang-chay' || pha === 'tam-dung') && !choDatLai) {
    datPha(thuMuc, 'dang-ban-giao', { boi: 'phat-lich', lyDo: vao, nowMs: now });
    if (dau.length && !dg.cua_so.some((w) => w.muc === 'cham')) ghiSuKien(thuMuc, { loai: 'cham-han-muc', ly_do: vao, viec: '/dieu-phoi:ban-giao', can_phan: true });
    vaoBanGiao = true;
  }
  return { trang_thai: { lan_doc: lan ? { nguon: lan.nguon, luc: lan.luc } : null, co_mod: dg.co_mod, cua_so: dg.cua_so }, da_bao: [...daBao], cho_dat_lai: choDatLai, vao_ban_giao: vaoBanGiao };
}
```
- [ ] **Step 4: `phat-lich.mjs` `motNhip`:** sau `const dk = docPha(thuMuc)` và TRƯỚC `capPhat`:

```js
const hm = xetHanMucNhip(thuMuc, { cfg, cu, nowMs, pha: dk.pha });
const pha = hm.vao_ban_giao ? docPha(thuMuc).pha : dk.pha;
```
  `capPhat(…, pha, may, hm.cho_dat_lai)` — tham số mới `choDatLai`: khác null thì `continue` mọi đơn. `tt` thêm
  `han_muc: hm.trang_thai, han_muc_da_bao: hm.da_bao, cho_dat_lai: hm.cho_dat_lai` (vắng khoá khi null để ca (o) đọc «không
  còn `cho_dat_lai`»: `...(hm.cho_dat_lai ? { cho_dat_lai: hm.cho_dat_lai } : {})`).
- [ ] **Step 5:** Verify DP4-03 ×2 ok; DP1–DP3 nguyên. Commit `dieu-phoi: bộ phát lịch xét hạn mức mỗi nhịp (DP4 AC-3)`.

### Task 5: Mục dãy, `ban-giao`, `ban-giao-xong`, đồng hồ bàn giao (AC-5, AC-6 · E5, E6)

**Files:** Create `dieu-phoi/scripts/muc-day.mjs`, `dieu-phoi/scripts/ban-giao.mjs`, `dieu-phoi/scripts/mau/ban-giao.json`;
Modify `dieu-phoi/scripts/dieu-phoi.mjs`, `dieu-phoi/scripts/phat-lich.mjs`. **independent:** false.

**Interfaces — Produces:**
`mucDay(thuMuc, d, {hangViec, khoaS4, maBanGiao})` → `{id, hang, slug, trang_thai_ho_so, nhanh, dinh, da_day, co_wip, cay_ban, ban_giao, cham_lai_cung_round, viec_cho_nguoi, phien_cu}`;
`batDauBanGiao(cwd, {lyDo, boi, nowMs})`; `banGiaoXong(cwd, {wip, nowMs})`;
`buocBanGiao(thuMuc, {nowMs, cuongBuc})` → `{pha, dung, ban_giao?}`; `TEP_BAN_GIAO`, `DIR_BAN_GIAO = 'ban-giao'`.

- [ ] **Step 1: Ca DP4-05 (đỏ trước):** «DP4-05 ban-giao» (CLI hai lần, ba pha cấm) và «DP4-05 ban-giao-xong» ma trận (a)–(f).
  Kho thử: `khoLienKet()`, `git config user.*` cục bộ ở từng worktree, remote giả `git init --bare` + `git push -u` nhánh
  `p1` lúc dựng (để `da_day` đo được), ghi `ref` của remote trước/sau ca để chứng «0 lần đẩy». Hàng (c): dựng
  `khoa/s4/chu.json` `{phien:'P1', worktree:w1, …}` bằng nhịp thật (đơn `xin s4` + `taoVong`). `phien_cu`: một nhịp sống do
  hook thật ghi trên worktree P1 với `session_id: 's-cu'`.
- [ ] **Step 2:** FAIL. **Step 3: `muc-day.mjs`:**

```js
// MỘT hàm dựng mục dãy (design DP4 chỗ chọn 9) — cho ban-giao.json và lời ghi danh của tiep-tuc. Mọi trường suy từ
// git của worktree dãy và thư mục đợt; không trường nào cho model điền.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { docJson } from './dot.mjs';

const git = (cwd, ...a) => {
  const r = spawnSync('git', a, { cwd, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
};
export const trangThaiHoSo = (worktree, slug) => {
  try { return /^status:\s*(\S+)/m.exec(fs.readFileSync(path.join(worktree, '_acceptance', slug, 'contract.md'), 'utf8'))?.[1] ?? null; } catch { return null; }
};
export function slugCuaDay(thuMuc, hangViec, id) {
  const tiep = docJson(path.join(thuMuc, 'tiep', `${id}.json`), null);
  if (tiep?.hang) return tiep.hang;
  return (hangViec.hang ?? []).filter((h) => h.day === id).sort((a, b) => (a.uu_tien ?? 99) - (b.uu_tien ?? 99))[0]?.slug ?? null;
}
export function mucDay(thuMuc, d, { hangViec, khoaS4 = null, maBanGiao = null }) {
  const slug = slugCuaDay(thuMuc, hangViec, d.id);
  const hang = (hangViec.hang ?? []).find((h) => h.slug === slug)?.ma ?? null;
  const conWt = fs.existsSync(d.worktree);
  const dinh = conWt ? git(d.worktree, 'rev-parse', 'HEAD') : null;
  const xong = docJson(path.join(thuMuc, 'ban-giao', 'xong', `${d.id}.json`), null);
  const xongMa = xong && (!maBanGiao || xong.ma === maBanGiao) ? xong : null;
  const ttHoSo = conWt && slug ? trangThaiHoSo(d.worktree, slug) : null;
  const giuS4 = khoaS4 === d.id;
  const choNguoi = docJson(path.join(thuMuc, 'cho-nguoi', `${d.id}.json`), null);
  return {
    id: d.id, hang, slug, trang_thai_ho_so: ttHoSo,
    nhanh: conWt ? git(d.worktree, 'rev-parse', '--abbrev-ref', 'HEAD') : null,
    dinh,
    da_day: conWt ? git(d.worktree, 'rev-parse', '@{u}') === dinh && dinh != null : false,
    co_wip: conWt ? (git(d.worktree, 'log', '-1', '--format=%s') ?? '').startsWith('wip(ban-giao)') : false,
    cay_ban: conWt ? (git(d.worktree, 'status', '--porcelain') ?? '') !== '' : false,
    ban_giao: !conWt ? 'worktree-mat' : d.nghi === true ? 'nghi' : giuS4 ? 'dang-xong' : xongMa ? 'xong' : 'do',
    cham_lai_cung_round: giuS4 && ttHoSo === 'implemented',
    viec_cho_nguoi: choNguoi?.tin ?? null,
    phien_cu: xongMa?.phien_cu ?? [],
  };
}
```
- [ ] **Step 4: `ban-giao.mjs`:**

```js
// Bàn giao tài khoản (spec workflow §4.3, design DP4 chỗ chọn 8, 10, 12).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PHUT_MS } from './cau-hinh.mjs';
import { docJson, ghiJsonNguyenTu, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docCauHinh, docHangViec } from './hinh-dang.mjs';
import { MAC_DINH_HAN_MUC } from './han-muc.mjs';
import { mucDay } from './muc-day.mjs';
import { datPha, docPha } from './pha.mjs';
import { bayGio, docNhipSong } from './song.mjs';

export const TEP_BAN_GIAO = 'ban-giao.json';
export const DIR_BAN_GIAO = 'ban-giao';
const can = (cwd, lenh) => { const t = timThuMucDot(cwd); if (!t) throw new Error(`${lenh}: không có đợt nào đang chạy`); return t; };
const cfgCua = (thuMuc) => { try { return docCauHinh(thuMuc); } catch { return {}; } };
const khoaS4Cua = (thuMuc) => docJson(path.join(thuMuc, 'khoa', 's4', 'chu.json'), null);
const khoaSong = (thuMuc, cfg, now) => {
  const p = path.join(thuMuc, 'khoa', 's4', 'nhip');
  if (!khoaS4Cua(thuMuc)) return false;
  try { return now - fs.statSync(p).mtimeMs < (cfg.nhip_cu_phut ?? 10) * PHUT_MS; } catch { return true; } // khoá chưa có nhịp: coi như còn sống
};

export function batDauBanGiao(cwd, { lyDo = '', boi = 'cli', nowMs = null } = {}) {
  const thuMuc = can(cwd, 'ban-giao');
  const pha = docPha(thuMuc).pha;
  if (pha === 'dang-ban-giao') return { ...buocBanGiao(thuMuc, { nowMs }), ma: docPha(thuMuc).ban_giao?.ma ?? null };
  if (pha !== 'dang-chay' && pha !== 'tam-dung') throw new Error(`ban-giao: đợt đang ở pha ${pha} — chỉ bàn giao từ dang-chay hoặc tam-dung`);
  datPha(thuMuc, 'dang-ban-giao', { boi, lyDo, nowMs });
  ghiSuKien(thuMuc, { loai: 'ban-giao', ma: docPha(thuMuc).ban_giao.ma, ly_do: lyDo });
  const hv = docHangViec(thuMuc);
  return { pha: 'dang-ban-giao', ma: docPha(thuMuc).ban_giao.ma, can_nhan: hv.day.filter((d) => d.nghi !== true).map((d) => d.id) };
}

export function banGiaoXong(cwd, { wip = null, nowMs = null } = {}) {
  const thuMuc = can(cwd, 'ban-giao-xong');
  const dk = docPha(thuMuc);
  if (dk.pha !== 'dang-ban-giao') throw new Error(`ban-giao-xong: đợt không đang bàn giao (pha ${dk.pha})`);
  const hv = docHangViec(thuMuc);
  const id = phienCuaCwd(hv, cwd);
  if (!id) throw new Error('ban-giao-xong: cwd không thuộc dãy nào của đợt — chạy từ worktree của dãy');
  const d = hv.day.find((x) => x.id === id);
  if (khoaS4Cua(thuMuc)?.phien === id) throw new Error(`ban-giao-xong: ${id} đang giữ khoá s4 — đang xong; chạy lại sau khi lượt chấm hết và nhả khoá`);
  if (typeof wip === 'string' && wip.trim()) {
    const st = spawnSync('git', ['status', '--porcelain'], { cwd: d.worktree, encoding: 'utf8' }).stdout;
    if (st.trim()) {
      spawnSync('git', ['add', '-A'], { cwd: d.worktree });
      const c = spawnSync('git', ['commit', '-q', '-m', `wip(ban-giao): ${wip.trim()}`], { cwd: d.worktree, encoding: 'utf8' });
      if (c.status !== 0) throw new Error(`ban-giao-xong: commit WIP lỗi — ${`${c.stderr}${c.stdout}`.split('\n').find((x) => x.trim()) ?? `mã ${c.status}`}`);
    }
  }
  const loi = [];
  const ban = spawnSync('git', ['status', '--porcelain'], { cwd: d.worktree, encoding: 'utf8' }).stdout.split('\n').filter(Boolean);
  for (const dong of ban) loi.push(`chưa commit: ${dong.slice(3)}`);
  const dXin = path.join(thuMuc, 'xin');
  for (const f of fs.existsSync(dXin) ? fs.readdirSync(dXin).filter((x) => x.startsWith(`${id}-`) && x.endsWith('.json')) : []) loi.push(`còn đơn: xin/${f}`);
  if (loi.length) throw new Error(`ban-giao-xong: ${id} chưa xong — ${loi.join(' · ')}`);
  const m = mucDay(thuMuc, d, { hangViec: hv, maBanGiao: dk.ban_giao.ma });
  const phienCu = docNhipSong(thuMuc).filter((n) => n.worktree === d.worktree).map((n) => n.phien).sort();
  const ghi = { day: id, ma: dk.ban_giao.ma, luc: new Date(bayGio(nowMs)).toISOString(), nhanh: m.nhanh, dinh: m.dinh, da_day: m.da_day, co_wip: m.co_wip, phien_cu: phienCu };
  ghiJsonNguyenTu(path.join(thuMuc, DIR_BAN_GIAO, 'xong', `${id}.json`), ghi);
  ghiSuKien(thuMuc, { loai: 'ban-giao-xong', phien: id, ma: ghi.ma });
  return ghi;
}

const shaNhanhChinh = (cfg) => {
  if (!cfg.goc_kho) return null;
  for (const ref of [`origin/${cfg.nhanh_chinh}`, cfg.nhanh_chinh]) {
    const r = spawnSync('git', ['rev-parse', ref], { cwd: cfg.goc_kho, encoding: 'utf8' });
    if (r.status === 0) return r.stdout.trim();
  }
  return null;
};
const XONG = new Set(['xong', 'dang-xong', 'nghi', 'worktree-mat']);
const khongLuc = (o) => JSON.stringify({ ...o, luc: undefined });

// Bước bàn giao — MỘT hàm cho nhịp bộ phát lịch, CLI `ban-giao` và `tiep-tuc` (cưỡng bức).
export function buocBanGiao(thuMuc, { nowMs = null, cuongBuc = false } = {}) {
  const dk = docPha(thuMuc);
  if (dk.pha !== 'dang-ban-giao' || !dk.ban_giao) return { pha: dk.pha, dung: false };
  const now = bayGio(nowMs);
  const cfg = cfgCua(thuMuc);
  const hv = docHangViec(thuMuc);
  const khoa = khoaS4Cua(thuMuc);
  const day = hv.day.map((d) => mucDay(thuMuc, d, { hangViec: hv, khoaS4: khoa?.phien ?? null, maBanGiao: dk.ban_giao.ma }));
  const hanMs = (cfg.han_muc?.cho_ban_giao_phut ?? MAC_DINH_HAN_MUC.cho_ban_giao_phut) * PHUT_MS;
  const quaHan = now - Date.parse(dk.ban_giao.vao_luc) >= hanMs;
  if (!(cuongBuc || quaHan || day.every((m) => XONG.has(m.ban_giao)))) return { pha: dk.pha, dung: false };
  const dXin = path.join(thuMuc, 'xin');
  const bg = {
    ma: dk.ban_giao.ma, trang_thai: 'mo', dot: hv.dot, luc: new Date(now).toISOString(),
    vao_luc: dk.ban_giao.vao_luc, ly_do: dk.ban_giao.ly_do, boi: dk.ban_giao.boi, sha_nhanh_chinh: shaNhanhChinh(cfg),
    day,
    khoa: ['s4', 'duong-nen', 'merge'].flatMap((tn) => { const c = docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'), null); return c ? [{ tai_nguyen: tn, phien: c.phien }] : []; }),
    don: fs.existsSync(dXin) ? fs.readdirSync(dXin).filter((f) => f.endsWith('.json')).sort() : [],
  };
  const p = path.join(thuMuc, TEP_BAN_GIAO);
  if (khongLuc(docJson(p, null) ?? {}) !== khongLuc(bg)) ghiJsonNguyenTu(p, bg);
  if (cuongBuc || !khoaSong(thuMuc, cfg, now)) {
    datPha(thuMuc, 'cho-tiep-tuc', { boi: cuongBuc ? 'tiep-tuc' : 'phat-lich', lyDo: 'bàn giao đã dựng', nowMs: now });
    const gio = new Date(now).toISOString().slice(11, 16);
    ghiSuKien(thuMuc, { loai: 'ban-giao-dung', ma: bg.ma, dich: 'owner', can_phan: true,
      tin: `Đã bàn giao đợt ${hv.dot} lúc ${gio}Z. Đổi tài khoản, rồi mở một phiên trong kho và gõ /dieu-phoi:tiep-tuc (không có lệnh đó → node ${path.join(thuMuc, 'loi', 'dieu-phoi.mjs')} tiep-tuc --phien <mã phiên>).` });
    return { pha: 'cho-tiep-tuc', dung: true, ban_giao: bg };
  }
  return { pha: dk.pha, dung: true, ban_giao: bg };
}
```
  `mau/ban-giao.json`: một ví dụ đầy đủ đúng khoá của `bg` và một mục `day` đúng khoá của `mucDay`.
- [ ] **Step 5: CLI** `ban-giao` (`--ly-do`, `--json`) và `ban-giao-xong` (`--wip <mô tả>`) trong `dieu-phoi.mjs`; `kiemGiamSat(thuMuc, co.phien, 'ban-giao')` cho `ban-giao`.
- [ ] **Step 6: Nhịp:** trong `motNhip`, sau `xuLyKhoa` và xét hạn mức: `if (pha === 'dang-ban-giao') { const b = buocBanGiao(thuMuc, { nowMs }); pha = b.pha; }` rồi mới `capPhat`.
- [ ] **Step 7: Ca DP4-06** dong-ho (6 hàng + đối chứng 19′), tu-git, khuon, cung-ham (Task 6 bổ sung vế ghi danh).
- [ ] **Step 8:** Verify DP4-05, DP4-06 ok; DP1–DP3 nguyên. Commit `dieu-phoi: bàn giao từ git, đồng hồ trong bộ phát lịch (DP4 AC-5, AC-6)`.

### Task 6: Tiếp tục sau bàn giao + phiên đã bàn giao (AC-7, AC-8 · E7, E8)

**Files:** Modify `dieu-phoi/scripts/ban-giao.mjs` (thêm `roiBanGiao`, `banGiaoGanNhat`), `dieu-phoi/scripts/tiep-tuc.mjs`,
`dieu-phoi/scripts/song.mjs`. **independent:** false.

**Interfaces — Produces:** `banGiaoGanNhat(thuMuc)` → `{ma, day[]} | null` (ban-giao.json mở, không thì tệp mới nhất trong
`lich-su/` theo `tiep_tuc_luc`); `roiBanGiao(thuMuc, {phien, nowMs})` → `{can_doc_han_muc?, khuyen_cho?, ban_giao?, pha}`;
`nhipMoiNhatCua(thuMuc, worktree, {boQua})` (tham số thứ ba tuỳ chọn, `Set` mã phiên bỏ qua).

- [ ] **Step 1: Ca DP4-07 tiep-tuc (8 hàng) + DP4-07-do goi-thang; DP4-08 phien-cu + DP4-08-do bo-loai** (đỏ trước). Kho thử
  dựng bàn giao bằng CLI thật (`ban-giao`, `ban-giao-xong` từ worktree, nhịp thật); hàng (a)–(h) như evals E7.
- [ ] **Step 2:** FAIL. **Step 3: `roiBanGiao`:**

```js
export function roiBanGiao(thuMuc, { phien, nowMs = null }) {
  const now = bayGio(nowMs);
  const dk = docPha(thuMuc);
  if (!PHA_SAO.includes(dk.pha)) return { pha: dk.pha };
  const cfg = cfgCua(thuMuc);
  const hanMuc = cfg.han_muc ?? MAC_DINH_HAN_MUC;
  const cuaPhien = lanDocHieuLuc(thuMuc, { nowMs: now }).tuoi.filter((l) => l.phien === phien).at(-1);
  if (!cuaPhien) return { pha: dk.pha, can_doc_han_muc: true };
  const vuot = Object.entries(cuaPhien.cua_so).find(([, w]) => w.pct >= hanMuc.bao_truoc_pct && !(w.dat_lai && Date.parse(w.dat_lai) <= now));
  if (vuot) return { pha: dk.pha, khuyen_cho: { cua_so: vuot[0], pct: vuot[1].pct, dat_lai: vuot[1].dat_lai } };
  if (dk.pha === 'dang-ban-giao') buocBanGiao(thuMuc, { nowMs: now, cuongBuc: true });
  const phaTruoc = docPha(thuMuc).ban_giao?.pha_truoc ?? 'dang-chay';
  const p = path.join(thuMuc, TEP_BAN_GIAO);
  const bg = docJson(p, null);
  const dDau = path.join(thuMuc, DIR_BAN_GIAO, 'dau');
  const dau = fs.existsSync(dDau) ? fs.readdirSync(dDau).filter((f) => f.endsWith('.json')).sort().map((f) => docJson(path.join(dDau, f), null)) : [];
  if (bg) {
    ghiJsonNguyenTu(path.join(thuMuc, DIR_BAN_GIAO, 'lich-su', `${bg.ma}.json`), { ...bg, trang_thai: 'da-tiep-tuc', tiep_tuc_luc: new Date(now).toISOString(), tiep_tuc_boi: phien, dau });
    fs.rmSync(p, { force: true });
  }
  fs.rmSync(dDau, { recursive: true, force: true });
  fs.rmSync(path.join(thuMuc, DIR_BAN_GIAO, 'xong'), { recursive: true, force: true });
  datPha(thuMuc, phaTruoc, { boi: 'tiep-tuc', lyDo: `tiếp tục sau bàn giao ${bg?.ma ?? ''}`.trim(), nowMs: now });
  ghiSuKien(thuMuc, { loai: 'tiep-tuc-ban-giao', ma: bg?.ma ?? null, phien });
  return { pha: phaTruoc, ban_giao: { ma: bg?.ma ?? null, trang_thai: 'da-tiep-tuc' } };
}
```
  (`buocBanGiao` cưỡng bức đã chuyển sang `cho-tiep-tuc`, nên `datPha(…, phaTruoc)` đi đúng cạnh `cho-tiep-tuc → pha trước`.)
- [ ] **Step 4: `tiep-tuc.mjs`:** trong `tiepTuc` (không `nhe`), sau `nhanVaiGiamSat`: `const roi = roiBanGiao(thuMuc, { phien, nowMs })`;
  `pha` đọc lại sau đó; kết quả trả thêm `can_doc_han_muc`, `khuyen_cho`, `ban_giao` (chỉ khi có). `keHoachDay`: `const bgGan =
  banGiaoGanNhat(thuMuc)`; mỗi dãy `phienCu = new Set((bgGan?.day.find((m) => m.id === d.id && m.ban_giao === 'xong')?.phien_cu) ?? [])`;
  `nhipMoiNhatCua(thuMuc, d.worktree, { boQua: phienCu })`; dãy `mo-chip` có `da_ban_giao: phienCu.size > 0`; lời ghi danh dựng
  từ `mucDay` (nhánh, đỉnh 7 ký tự, `trang_thai_ho_so`) cộng lớp phủ `bàn giao <ma>: <ban_giao>` khi có `bgGan`, vẫn chứa thư mục
  đợt, «LUAT.md», `/feature-loop:feature-loop <slug>` (ca DP3-03 giữ nguyên).
- [ ] **Step 5: `song.mjs`:** `nhipMoiNhatCua(thuMuc, worktree, { boQua = new Set() } = {})` — bỏ nhịp có `phien` trong `boQua`.
- [ ] **Step 6:** Verify DP4-06 cung-ham, DP4-07 ×2, DP4-08 ×2 ok; DP3 nguyên. Commit `dieu-phoi: tiếp tục sau bàn giao, phiên đã bàn giao không tính sống (DP4 AC-7, AC-8)`.

### Task 7: Lời nhắc bàn giao qua hook nhịp (AC-9 · E9)

**Files:** Modify `dieu-phoi/scripts/hook-nhip.mjs`. **independent:** false.

- [ ] **Step 1: Ca DP4-09 nhac** (6 hàng, CHÍNH lệnh PostToolUse rút từ `hooks.json`, đồng hồ giả qua `DIEU_PHOI_NOW_MS`). FAIL.
- [ ] **Step 2: Hàm** trong `hook-nhip.mjs`:

```js
import { docPha } from './pha.mjs';
import { bayGio } from './song.mjs';
const NHAC_LAI_MS = 5 * 60_000;
export function nhacBanGiao(dauVao, { timDot = timThuMucDot, nowMs = null } = {}) {
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return null;
  const dk = docPha(thuMuc);
  if (dk.pha !== 'dang-ban-giao' || !dk.ban_giao) return null;
  let hv; try { hv = docHangViec(thuMuc); } catch { return null; }
  const day = phienCuaCwd(hv, dauVao.cwd);
  if (!day) return null;
  if (docJson(path.join(thuMuc, 'ban-giao', 'xong', `${day}.json`), null)?.ma === dk.ban_giao.ma) return null;
  const now = bayGio(nowMs);
  const pNhac = path.join(thuMuc, 'ban-giao', 'nhac', `${String(dauVao.session_id ?? 'x').replace(/[^\w.-]/g, '_')}.json`);
  const lan = docJson(pNhac, null);
  if (lan?.luc && now - Date.parse(lan.luc) < NHAC_LAI_MS) return null;
  ghiJsonNguyenTu(pNhac, { luc: new Date(now).toISOString() });
  return `Đợt ${hv.dot} đang bàn giao tài khoản (${dk.ban_giao.ma}): dừng ở ranh giới gần nhất, commit WIP, rồi chạy \`node ${path.join(thuMuc, 'loi', 'dieu-phoi.mjs')} ban-giao-xong\` từ worktree này (có thể kèm \`--wip "<mô tả>"\`). Đang chạy lượt chấm thì cứ để lượt chạy hết — dãy được xếp «đang xong».`;
}
```
  Trong khối chính, sau `ghiSong`: `const nhac = nhacBanGiao(dauVao); if (nhac) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: nhac } }))` — bọc try, hook luôn thoát 0.
- [ ] **Step 3:** Verify DP4-09 ok; DP1-02 (chiều im) và DP3-02 nguyên. Commit `dieu-phoi: hook nhịp nhắc thợ bàn giao (DP4 AC-9)`.

### Task 8: Lưới cuối StopFailure (AC-10 · E10) + ca đã ký DP1-01

**Files:** Create `dieu-phoi/scripts/hook-het-han-muc.mjs`; Modify `dieu-phoi/hooks/hooks.json`,
`tests/dieu-phoi/dong-goi.test.mjs` (DP1-01: `BANG_HOOK`, `DAU_VAO_MAU`), `_acceptance/dieu-phoi-dong-goi-loi/decisions.jsonl`
(dòng `revisit`). **independent:** false.

- [ ] **Step 1: Ca DP4-10 luoi-cuoi** (7 hàng). Kho thử: `git config user.name/email` cục bộ; hàng (g) `git config
  core.hooksPath .hooks-thu` cục bộ (đè cấu hình hệ thống) và `.hooks-thu/pre-commit` = `#!/bin/sh\necho chan-boi-kho >&2\nexit 1`
  (chmod 755). FAIL.
- [ ] **Step 2: `hook-het-han-muc.mjs`:**

```js
#!/usr/bin/env node
// Lưới cuối của bàn giao tài khoản (spec workflow §4.3, §16 T9, design DP4 chỗ chọn 11): một thợ chết vì hạn mức
// (StopFailure, error rate_limit) → commit WIP thường ở worktree của dãy, TRỪ khi còn lượt chấm/đường nền mở (khoá
// s4 hoặc duong-nen trỏ worktree đó) — khi ấy chỉ ghi dấu «lượt dở». Không bao giờ bỏ hook của kho. Luôn thoát 0.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docJson, ghiJsonNguyenTu, ghiSuKien, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { bayGio } from './song.mjs';

export function xuLyHetHanMuc(dauVao, { timDot = timThuMucDot, nowMs = null } = {}) {
  if (dauVao?.error !== 'rate_limit') return 'bo-qua';
  const thuMuc = timDot(dauVao.cwd);
  if (!thuMuc) return 'ngoai-dot';
  const hv = docHangViec(thuMuc);
  const id = phienCuaCwd(hv, dauVao.cwd);
  if (!id) return 'khong-phai-tho';
  const wt = hv.day.find((d) => d.id === id).worktree;
  const luc = new Date(bayGio(nowMs)).toISOString();
  const dau = { day: id, phien: dauVao.session_id ?? null, luc, loi: 'rate_limit', wip: null, luot_do: false };
  const giuLuot = ['s4', 'duong-nen'].some((tn) => docJson(path.join(thuMuc, 'khoa', tn, 'chu.json'), null)?.worktree === wt);
  const ban = (spawnSync('git', ['status', '--porcelain'], { cwd: wt, encoding: 'utf8' }).stdout ?? '').trim() !== '';
  if (giuLuot) dau.luot_do = true;
  else if (ban) {
    spawnSync('git', ['add', '-A'], { cwd: wt });
    const c = spawnSync('git', ['commit', '-q', '-m', `wip(ban-giao): lưới cuối — rate_limit ${luc}`], { cwd: wt, encoding: 'utf8' });
    if (c.status === 0) dau.wip = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: wt, encoding: 'utf8' }).stdout.trim();
    else {
      spawnSync('git', ['reset', '-q'], { cwd: wt }); // gỡ stage, cây giữ nguyên
      dau.loi_commit = `${c.stderr ?? ''}${c.stdout ?? ''}`.split('\n').map((x) => x.trim()).find(Boolean) ?? `mã ${c.status}`;
    }
  }
  ghiJsonNguyenTu(path.join(thuMuc, 'ban-giao', 'dau', `${id}.json`), dau);
  ghiSuKien(thuMuc, { loai: 'tho-het-han-muc', phien: id, wip: dau.wip, luot_do: dau.luot_do, ly_do: `${id} dừng vì hạn mức`, can_phan: true });
  return 'ghi';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  let raw = '';
  for await (const m of process.stdin) raw += m;
  try { xuLyHetHanMuc(JSON.parse(raw)); } catch {}
  process.exit(0);
}
```
  `hooks.json` thêm khối `"StopFailure": [{ "hooks": [{ "type": "command", "timeout": 60, "command": "f=\"${CLAUDE_PLUGIN_ROOT}/scripts/hook-het-han-muc.mjs\"; [ -f \"$f\" ] || exit 0; exec node \"$f\"" }] }]`.
- [ ] **Step 3: Ca đã ký DP1-01:** `BANG_HOOK` thêm `['StopFailure', '—', 'hook-het-han-muc.mjs']`; `DAU_VAO_MAU` thêm
  `StopFailure: (cwd) => ({ hook_event_name: 'StopFailure', session_id: 's', cwd, error: 'rate_limit' })`. Dòng sổ `revisit`
  ở `_acceptance/dieu-phoi-dong-goi-loi/decisions.jsonl` (khuôn DEC-ID-RECIPE, `stage: "S3"` của DP4, trỏ hồ sơ DP4 AC-10,
  AC-14, sổ d-…-23).
- [ ] **Step 4:** Verify DP4-10, DP1-01, DP1-02 ok. Commit `dieu-phoi: lưới cuối StopFailure khi thợ chết vì hạn mức (DP4 AC-10)`.

### Task 9: Lượt chết giữa chừng ra cùng round (AC-11 · E11)

**Files:** Modify `tests/dieu-phoi/doi-tai-khoan.test.mjs`. **independent:** false.

- [ ] **Step 1: Ca DP4-11 cung-round:** hồ sơ thử do mã sinh trong kho git tạm (`_acceptance/config.yaml` với
  `feature_loop.suite_keys: [executors.test.x]`, `executors.test.x: "true"`, hợp đồng `status: implemented`, `evals.yaml` một
  eval `script` `cmd: config:executors.test.x`, `evidence-report.md` có `## Iterations` một mục `- Round 1 — REJECT`). Chạy
  `node feature-loop/scripts/s4-args.mjs --slug thu --root <kho> --no-carry --diff-base HEAD --ag-root <KIT> --out <a1>`; ghi
  `<kho>/_acceptance/thu/s4-args.json` (không run-log, không báo cáo) rồi chạy lại ra `<a2>` → `round` của a1 và a2 cùng là 2.
  Kiểm thêm tập khoá của `ban-giao.json` (dựng bằng `buocBanGiao` ở một kho đợt) không có khoá nào khớp `/round/i` ngoài
  `cham_lai_cung_round`. Nếu `s4-args.mjs` thoát khác 0 trên fixture: in nguyên stderr, sửa FIXTURE (không sửa s4-args).
- [ ] **Step 2:** Verify ok. Commit `test(dieu-phoi): lượt chấm chết giữa chừng ra cùng round (DP4 AC-11)`.

### Task 10: Mod đọc mức dùng + khung mod + răng T11 (AC-12, AC-13 · E12, E13, E13b)

**Files:** Create `dieu-phoi/hooks/mod/register.ts`, `dieu-phoi/hooks/mod/doc-muc-dung.ts`, `dieu-phoi/scripts/mod-luat.mjs`, `tests/dieu-phoi/mod/doc-muc-dung.test.ts`,
`tests/dieu-phoi/kiem-mod.mjs`; Modify `dieu-phoi/hooks/hooks.json` (`modules`), `_acceptance/config.yaml`
(`executors.script.dieu_phoi_mod: node tests/dieu-phoi/kiem-mod.mjs`). **independent:** false.

- [ ] **Step 1: Mod** — Claude Code nhận ĐÚNG MỘT module mỗi gói (đo 11/10), nên `hooks.json` → `"modules": ["./mod/register.ts"]`;
  `register.ts` chỉ gọi các phần: `import { dangKyDocMucDung } from './doc-muc-dung'` · `export const register: Register = (on) => { dangKyDocMucDung(on) }`
  (DP6 thêm dòng gọi phần của nó). Phần `hooks/mod/doc-muc-dung.ts`:

```ts
import type { On } from 'claude-code'

// Phần mod đọc mức dùng (spec workflow §12.2, design DP4): mỗi khi một cửa sổ hạn mức nhích một điểm, chuyển rateLimits
// cho CLI han-muc của gói. Chỉ quan sát: không nghe sự kiện cổng nào, luôn trả next(e) nguyên (§12.1, bảng MOD-SU-KIEN).
export const dangKyDocMucDung = (on: On) => {
  on('session.measure', async ($, e, next) => {
    try {
      if (e.changed.includes('rateLimits') && e.rateLimits.length > 0) {
        await $.process.run(
          ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'han-muc', '--nguon', 'mod', '--phien', await $.session.id(), '--doc', JSON.stringify(e.rateLimits)],
          { cwd: await $.session.cwd() },
        )
      }
    } catch {}
    return next(e)
  })
}
```
  `hooks.json` thêm `"modules": ["./mod/register.ts"]` (cùng cấp `hooks`).
- [ ] **Step 2: Khung `mod-luat.mjs`:**

```js
// Khung mod của gói (spec workflow §12.1, design DP4 chỗ chọn — khung cho DP6). Mỗi mod khai ĐÚNG các sự kiện nó được
// nghe; răng T11 (tests/dieu-phoi/kiem-mod.mjs, ca DP4-13) đối chiếu bảng với `modules` của hooks.json và với sự kiện
// mà `claude plugin validate` thấy mod nghe. Mod mới (DP6) thêm một dòng vào khối dưới.
export const SU_KIEN_CONG = ['tool.call', 'tool.check', 'classic.PreToolUse', 'classic.PermissionRequest'];
// <<<MOD-SU-KIEN
export const SU_KIEN_MOD = {
  './mod/doc-muc-dung.ts': ['session.measure'],
};
export const MODULE_MOD = './mod/register.ts';
// MOD-SU-KIEN>>>

// Quét chữ «cho phép»: bỏ chú thích, tìm `allow` ở dạng chuỗi hay khoá đối tượng. Trả [{tep, dong, chu}].
export function quetChoPhep(tep, nguon) {
  const ra = [];
  const boCt = nguon.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  boCt.split('\n').forEach((d, i) => {
    const dong = d.replace(/\/\/.*$/, '');
    if (/(['"`])allow\1|\ballow\s*:|\{\s*result\s*[,}]|[{,]\s*result\s*:/.test(dong)) ra.push({ tep, dong: i + 1, chu: d.trim() });
  });
  return ra;
}
```
- [ ] **Step 3: Tệp ca mod** `tests/dieu-phoi/mod/doc-muc-dung.test.ts` (ba ca của AC-12; bên dưới mock `session.measure`
  `({changed})`, `session.id` `{value:'ses-1'}`, `session.cwd` `{value:<cwd>}`, `process.run` ghi argv ra mảng và trả
  `{value:{exitCode:0,stdout:'',stderr:''}}`; `rateLimits` đọc từ `../fixtures/rate-limits-mod.json` bằng `$.fs` không có
  — nên `kiem-mod.mjs` chép fixture thành `fixture.json` cạnh tệp ca trong bản sao, và tệp ca nhúng bằng `import FX from './fixture.json'`
  (bun nạp JSON); ca (a) in argv bằng `console.log('ARGV', JSON.stringify(goi[0].argv))`.
- [ ] **Step 4: `kiem-mod.mjs`** (một script, in `PASS:`/`FAIL:` từng dòng, thoát 1 khi có FAIL):
  - tìm Claude Code có lệnh `test`: thử `claude`, rồi mọi `~/Library/Application Support/Claude/claude-code/<bản>/*/claude.app/Contents/MacOS/claude` (sắp theo semver giảm dần, KHÔNG theo chữ), chọn cái đầu tiên mà `plugin --help` có dòng `test`; không có → `FAIL: DP4-12 plugin-test · không có Claude Code có lệnh test`.
  - `DP4-12 modules` (== `['./mod/register.ts']`, register gọi `dangKyDocMucDung`); `DP4-12 plugin-test` (chép gói vào thư mục tạm, chép tệp ca vào `hooks/mod/`, chép fixture; `plugin test` → đòi `3 pass` và ` 0 fail`); `DP4-12 round-trip` (rút argv từ dòng `ARGV`, thay `$.plugin.root` bằng GỐC GÓI THẬT và chạy `node` với argv đó trong một kho thử có đợt dựng bằng CLI thật → `han-muc.json` một lần đọc `nguon: mod`, `cua_so` deepEqual `mong_doi` của fixture); `DP4-12-do bo-dieu-kien` (bản sao bỏ `e.changed.includes('rateLimits') && ` → `plugin test` báo ca «khong goi khi chi context doi» fail); `DP4-12-do boc-mang` (bản sao gửi `JSON.stringify({ rateLimits: e.rateLimits })` → round-trip thoát 1 và in «mod»).
  - `DP4-13 validate` (`claude plugin validate --strict --json` gói: `success` và 0 lỗi); `DP4-13 su-kien` (rút dòng notes `./mod/register.ts hooks: a, b{…}` → tập tên sự kiện bỏ phần `{…}`; quét chữ `on('<sự kiện>'` từng tệp phần; HỢP quét chữ == tập validate; mỗi phần ⊆ `SU_KIEN_MOD[phần]`; dòng `./mod/doc-muc-dung.ts` không giao `SU_KIEN_CONG`; `register.ts` không có `on(`); ba ca đỏ `allow`, `ngoai-bang`, `phan-la` trên bản sao, mỗi ca SAU khi gói lành xanh.
- [ ] **Step 5: Ca node DP4-13 bang-mod + DP4-13-do quet-chu** trong `doi-tai-khoan.test.mjs` (rút khối MOD-SU-KIEN bằng marker từ
  nguồn `mod-luat.mjs`, so với `hooks.json` `modules`; `quetChoPhep` trên nguồn lành → []; bản sao thêm `behavior: 'allow'` → một mục đúng dòng).
- [ ] **Step 6:** Verify `node tests/dieu-phoi/kiem-mod.mjs` → mọi PASS; `node --test --test-name-pattern 'DP4-13'`; `node
  tests/dieu-phoi/kiem-validate.mjs` (DP1-01b) vẫn PASS. Commit `dieu-phoi: mod đọc mức dùng, khung mod và răng an toàn (DP4 AC-12, AC-13)`.

### Task 11: Lệnh người, tài liệu, ca đã ký DP2-01 (AC-14 · E14, E14b, E14c, E14d)

**Files:** Create `dieu-phoi/commands/ban-giao.md`; Modify `dieu-phoi/commands/tiep-tuc.md`, `tests/dieu-phoi/mo-dot.test.mjs`
(`BA_LENH`), `_acceptance/dieu-phoi-mo-dot-mot-lenh/decisions.jsonl` (dòng `revisit`),
`skills/acceptance/references/human-facing-language.md` (COMMAND-NAMES), `CONTEXT.md`, `GUIDE.md` §6.6, `QUICKSTART.md`,
`dieu-phoi/README.md`. **independent:** false.

- [ ] **Step 1: Ca DP4-14 ban-giao-md, tiep-tuc-md, tai-lieu, -do dao-buoc, -do bo-nhe** (đỏ trước). Vị trí đo bằng `indexOf` trên
  thân sau dòng «Các bước»: CLI `dieu-phoi.mjs" ban-giao` < câu «Nhắn từng phiên thợ» < câu «Báo chủ kho»; câu báo chứa
  `/dieu-phoi:tiep-tuc` và `loi/dieu-phoi.mjs tiep-tuc`. `tiep-tuc.md`: `han-muc --nguon get-usage` < `dieu-phoi.mjs" tiep-tuc --phien`;
  đoạn `**Dạng \`--nhe\`**` chứa `han-muc`; trong đoạn lịch 30′: `han-muc` < `danh-thuc`; có `` `can_doc_han_muc` `` và `` `khuyen_cho` ``.
- [ ] **Step 2: `commands/ban-giao.md`:**

```markdown
---
description: Bàn giao đợt Điều phối – Thợ trước khi đổi tài khoản — ngừng cấp lượt mới, nhắc thợ commit WIP và báo xong, máy dựng hồ sơ bàn giao từ git, rồi báo câu để tài khoản kia tiếp tục bằng một lệnh.
argument-hint: [lý do]
---

Chạy ở phiên giám sát. Phần tính được do CLI làm; phiên chỉ nhắn thợ và báo người — không tự commit, đẩy hay
chuyển pha thay ai. CLI: `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" <lệnh con>`.

Các bước, đúng thứ tự:

1. **CLI bàn giao.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" ban-giao --ly-do "$ARGUMENTS" --phien <mã phiên này> --json`.
   Đợt sang «đang bàn giao»: bộ phát lịch ngừng cấp lượt mới, kể cả đơn đã nằm trong hàng chờ. Thoát 1 → nói nguyên
   lý do một dòng và DỪNG. Chạy lại khi đợt đã đang bàn giao thì chỉ cập nhật hồ sơ bàn giao.
2. **Nhắn từng phiên thợ** trong `can_nhan` (tin liên phiên, cùng tài khoản): «bàn giao: dừng ở ranh giới gần nhất,
   commit WIP, rồi chạy `node <thư mục đợt>/loi/dieu-phoi.mjs ban-giao-xong` từ worktree của dãy». Tin chỉ là lời nhắc
   phụ — lời nhắc chính tự hiện trong phiên thợ qua hook của gói. Dãy đang chấm thì để lượt chạy hết.
3. **Chờ.** Giăng Monitor như thường; bộ phát lịch tự dựng hồ sơ bàn giao khi mọi dãy đã báo xong (hoặc hết hạn chờ)
   rồi phát sự kiện `ban-giao-dung`. Không tự quyết dãy nào xong.
4. **Báo chủ kho** đúng một câu, nguyên văn trường `tin` của sự kiện `ban-giao-dung` — câu đó mang `/dieu-phoi:tiep-tuc`
   và đường lùi `node <thư mục đợt>/loi/dieu-phoi.mjs tiep-tuc --phien <mã phiên>` cho trường hợp lệnh chưa nạp sau khi đổi.
   Đẩy kèm một thông báo nếu chủ kho không ngồi trước máy.
```
- [ ] **Step 3: `tiep-tuc.md`:** thêm bước 0 trước «CLI tiếp tục»: «**Đọc mức dùng.** Gọi `get_usage` (công cụ phiên của app),
  rồi `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" han-muc --nguon get-usage --phien <mã phiên này> --doc '<kết quả>'`.»;
  sau bước 2 thêm hai dòng xử lý: `` `can_doc_han_muc`: `` đọc mức dùng rồi gọi lại bước 1 · `` `khuyen_cho`: `` báo chủ kho
  một dòng «tài khoản này đã dùng <pct>% cửa sổ <tên>, đặt lại lúc <giờ> — chờ đặt lại hoặc đổi tài khoản khác», KHÔNG chuyển gì.
  Dòng `mo-chip` thêm: «dãy có `da_ban_giao: true` mà không đổi tài khoản và phiên cũ của dãy còn trong nhóm thanh bên → nhắn
  phiên đó «tiếp tục» thay vì mở chip». Đoạn lịch 30′: «gọi `get_usage` rồi `han-muc --nguon get-usage` của phiên ngắn, rồi
  `danh-thuc --json`». Đoạn `--nhe`: thêm «bước đọc mức dùng». GIỮ các câu mà DP3-01 ghim (vị trí CLI < thoi_vai < Monitor, CLI < chip;
  mỗi hành động một dòng `` `<hd>`: ``) — không viết chữ «mở chip» trước lời gọi CLI.
- [ ] **Step 4: Tài liệu:** COMMAND-NAMES thêm `| ban-giao | /dieu-phoi:ban-giao | command |`; CONTEXT.md mục **Bàn giao tài khoản**
  (nghĩa theo spec §15, `_Avoid_: «vật tạo ra bàn giao» — sáu thứ vật tự phát ra, nghĩa khác`); GUIDE §6.6 và QUICKSTART một
  dòng `/dieu-phoi:ban-giao`; README gói mục «Đổi tài khoản».
- [ ] **Step 5: Ca đã ký DP2-01:** `BA_LENH = ['ban-giao.md', 'dong-dot.md', 'mo-dot.md', 'tiep-tuc.md', 'xem.md']`; dòng sổ `revisit` ở
  `_acceptance/dieu-phoi-mo-dot-mot-lenh/decisions.jsonl`.
- [ ] **Step 6:** Verify DP4-14 ×5, DP2-01, DP3-01, `LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs`,
  `node tests/dieu-phoi/kiem-validate.mjs`. Commit `dieu-phoi: lệnh bàn giao, tiếp tục đọc mức dùng, tài liệu (DP4 AC-14)`.

### Task 12: Đối chiếu nhánh DP0 (AC-15 · E15)

**Files:** Modify `tests/dieu-phoi/doi-tai-khoan.test.mjs`. **independent:** false.

- [ ] **Step 1: Ca DP4-15 nhanh-dp0 + DP4-15-do doi-cau-6:**

```js
const KHOI = (t, mk) => new RegExp(`<!-- <<<${mk} -->\\n([\\s\\S]*?)<!-- ${mk}>>> -->`).exec(t)?.[1] ?? null;
const bang = (khoi) => khoi.split('\n').filter((d) => /^\|\s*\d/.test(d)).map((d) => d.split('|').slice(1, -1).map((x) => x.trim()));
export function kiemNhanhDp0(hopDong, ketQua) {
  const loi = [];
  const anh = new Map(bang(KHOI(hopDong, 'NHANH-DP0')).map(([c, ...v]) => [c, { 'còn': v[0], 'mất': v[1], 'khác': v[2], 'chưa-đo': v[3] }]));
  const chon = new Map(bang(KHOI(hopDong, 'NHANH-DP0-CHON')).map(([c, g, n]) => [c, { g, n }]));
  const kq = new Map(bang(KHOI(ketQua, 'KET-QUA-DP0')).map(([c, , g]) => [c, g]));
  const notes = hopDong.slice(hopDong.indexOf('## Notes'));
  for (const c of ['1', '2', '3', '5', '6']) {
    const g = kq.get(c);
    if (!['còn', 'mất', 'khác', 'chưa-đo'].includes(g)) { loi.push(`câu ${c}: ket-qua.md mang «${g}»`); continue; }
    if (chon.get(c)?.g !== g) loi.push(`câu ${c}: hợp đồng chọn giá trị «${chon.get(c)?.g}», ket-qua.md «${g}»`);
    if (chon.get(c)?.n !== anh.get(c)?.[g]) loi.push(`câu ${c}: nhánh «${chon.get(c)?.n}» khác ánh xạ «${anh.get(c)?.[g]}»`);
    if (g === 'chưa-đo' && !new RegExp(`câu ${c}[^\\n]*ngưỡng|ngưỡng[^\\n]*câu ${c}`).test(notes) && !/câu 2 và 6 rơi về nhánh an toàn/.test(notes)) loi.push(`câu ${c}: chưa-đo mà Notes không có ngưỡng`);
  }
  return loi;
}
test('DP4-15 nhanh-dp0', () => {
  const hd = fs.readFileSync(path.join(KIT, '_acceptance', 'dieu-phoi-doi-tai-khoan', 'contract.md'), 'utf8');
  const kq = fs.readFileSync(path.join(KIT, '_acceptance', 'dieu-phoi-tho-trong-kit', 'discovery', 'do-tai-khoan', 'ket-qua.md'), 'utf8');
  assert.deepEqual(kiemNhanhDp0(hd, kq), []);
});
test('DP4-15-do doi-cau-6', () => {
  const hd = fs.readFileSync(path.join(KIT, '_acceptance', 'dieu-phoi-doi-tai-khoan', 'contract.md'), 'utf8');
  const kq = fs.readFileSync(path.join(KIT, '_acceptance', 'dieu-phoi-tho-trong-kit', 'discovery', 'do-tai-khoan', 'ket-qua.md'), 'utf8');
  assert.deepEqual(kiemNhanhDp0(hd, kq), [], 'đối chứng dương');
  const dong6 = kq.split('\n').find((d) => /^\|\s*6\s*\|/.test(d));
  const giaTri = dong6.split('|')[3].trim();
  const moi = giaTri === 'còn' ? 'mất' : 'còn';
  const tiem = kq.replace(dong6, dong6.replace(`| ${giaTri} |`, `| ${moi} |`));
  assert.notEqual(tiem, kq, 'bước tiêm không áp được');
  const loi = kiemNhanhDp0(hd, tiem);
  assert.ok(loi.some((l) => l.startsWith('câu 6')), loi.join(' | '));
});
```
  Ghi chú: «chưa-đo» của câu 2, 6 rơi về nhánh an toàn (S2, M2) theo dòng Notes cuối — hàm chấp nhận dòng đó làm «ngưỡng».
- [ ] **Step 2:** Verify ok ×2. Commit `test(dieu-phoi): đối chiếu nhánh DP0 (DP4 AC-15)`.

### Task 13: Toàn suite, đặt `implemented`, chuyển S4

- [ ] **Step 1:** `node --test tests/dieu-phoi/` (mọi DP1–DP4 ok); `node tests/dieu-phoi/kiem-mod.mjs`; `node tests/dieu-phoi/kiem-validate.mjs`;
  `node scripts/eval-coverage-lint.js .`; `node scripts/product-map.mjs --root . --check`.
- [ ] **Step 2:** Bốn suite_keys của kho chạy tự do (luật M5: suite tự chạy, chỉ báo): `bash tests/scripts/run-tests.sh --manh bash`,
  ba mảnh mjs, `bash tests/hooks/run-tests.sh`, ba vùng plugins, `bash tests/workflows/run-tests.sh` — đỏ nào thuộc vật thì sửa.
- [ ] **Step 3:** contract `status: implemented`; commit; báo Điều phối «S3 xong · xin lượt S4».
