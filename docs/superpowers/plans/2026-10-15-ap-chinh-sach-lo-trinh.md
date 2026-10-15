# RM2 · Máy tự áp chính sách lộ trình — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (main loop, tuần tự). Steps dùng checkbox (`- [ ]`).

**Goal:** Máy tự dời hàng lộ trình theo chính sách chiến dịch: báo trước một ngày, ghi sổ, trả lại hay ghim được bằng một
lệnh, và giữ tệp lộ trình nguyên từng byte ngoài phần bị dời.

**Architecture:** Mọi mã nằm trong `scripts/lo-trinh.mjs` (bộ đọc + bộ ghi cùng tệp, B′ §11 ràng buộc (i)). Sổ tự áp là
`<tệp>.so.jsonl` cạnh tệp lộ trình; trạng thái báo trước / ghim / trả lại có được bằng cách phát lại sổ. Ba lệnh khoá
nằm ở `road-map/commands/`. Thẻ khởi động và lệnh xem chỉ đọc.

**Tech Stack:** Node ≥ 20 (ESM), không thêm phụ thuộc; ca đo là script node in «PASS:/FAIL:» như `ra-soat-lo-trinh.test.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-15-ap-chinh-sach-lo-trinh-design.md` · hợp đồng
`_acceptance/ap-chinh-sach-lo-trinh/contract.md` · evals `…/evals.yaml`.

## Global Constraints

- Mọi commit sửa `scripts/ lib/ skills/ commands/` mang chuỗi `ap-chinh-sach-lo-trinh` trong tiêu đề (gác gốc so, Task 1).
- Kho không bật tự áp (không chiến dịch đang chạy nào khai `chinh_sach.tu_ap: true`): `--ra-soat`, thẻ khởi động, `--mo-o`,
  trang lộ trình giống TỪNG BYTE bộ máy gốc `d01df558` (`_acceptance/ap-chinh-sach-lo-trinh/goc-so`).
- Bộ ghi chỉ ghi khi `JSON.stringify(JSON.parse(gốc), null, 2) + '\n' === gốc`; ghi bằng đúng biểu thức ấy; thao tác chỉ
  gỡ/chèn phần tử mảng; ghi tệp tạm rồi `renameSync`.
- Dòng sổ: `ngay` dạng `YYYY-MM-DD` không giờ; không chứa đường dẫn tuyệt đối; `lenh_tra_lai` = `/road-map:tra-lai <mã>`.
  Dòng sổ ghi TRƯỚC, tệp lộ trình đổi SAU.
- Chữ hiển thị «chờ điều kiện», không «chân trời» (ca LT/RS-8 của RM1 quét).
- Mặc định chính sách: `nhip_ngay: 1`, `tran_ap: 5`.
- Câu thông điệp ghim nguyên văn theo hợp đồng (bảng ở Task 2–10).
- Mỗi phép đo mới có cặp hai chiều trên cùng kho thử: bản lành xanh trước, bản sao bị tiêm đỏ với thông điệp ghim; nhát tiêm
  khớp đúng một lần (khuôn `banSao` của `ra-soat-lo-trinh.test.mjs`).

## Review Focus

1. Hai mốc `phat-hanh` cùng ngày gần nhất → chiến dịch đang chạy là mốc đứng trước trong tệp (Task 2, ca AP-1-cung-ngay).
2. Một mã nằm trong `hang` của HAI mốc → dời mốc gỡ khỏi mọi mốc đã qua chứa nó, trả lại khôi phục cả hai (Task 5/6, ca
   AP-3-hai-moc).
3. Sổ có dòng hỏng (không phải JSON) → phát lại bỏ dòng ấy, in một cảnh báo «sổ tự áp có N dòng không đọc được», không áp
   gì của mã có dòng hỏng gần nhất (Task 4, ca AP-5-so-hong).
4. Hàng bị xoá tay khỏi tệp sau khi báo trước → ngày áp ghi `huy` (đề xuất biến mất), không lỗi (Task 5, nằm trong AP-2).
5. `ACCEPTANCE_TODAY` sai dạng khi `--ap` → thoát 2 như `--ra-soat` (Task 5, ca AP-2-ngay-sai).

---

## Bảng tóm tắt cho người

| Sau việc này, người dùng thấy | Chạm vào | Tiêu chí |
|---|---|---|
| Ca gác của hồ sơ RM1 thôi đỏ oan với mọi PR sửa mã sau khi RM1 đã ký (kể cả PR của máy M5) | `tests/scripts/ra-soat-lo-trinh.test.mjs` (RS-0) | — (giữ suite xanh) |
| Chính sách khai trên mốc chiến dịch được đọc đúng | `scripts/lo-trinh.mjs` | AC-1 (đọc chính sách) |
| Tệp kế hoạch được ghi mà không lệch byte | `scripts/lo-trinh.mjs` | AC-4 (bộ ghi giữ byte) |
| Mỗi lần dời có dòng sổ, hai máy ra cùng sổ | `scripts/lo-trinh.mjs` | AC-5 (sổ tất định) |
| Máy báo trước rồi dời đúng chỗ, có trần | `scripts/lo-trinh.mjs` | AC-2 (nhịp), AC-3 (dời đúng chỗ) |
| Chủ kho trả lại, ghim, bỏ ghim | `scripts/lo-trinh.mjs` | AC-6 (trả lại, ghim) |
| Ba lệnh chỉ người gõ được | `road-map/commands/`, ADR 0002, P32 | AC-7 (lệnh khoá) |
| Lệnh xem thành bản đồ | `scripts/lo-trinh.mjs`, `road-map/commands/xem.md` | AC-8 (bản đồ) |
| Thẻ khởi động có dòng «Tự áp» | `scripts/lo-trinh.mjs` (`loTrinhThe`) | AC-9 (thẻ) |
| Mở việc thì máy tự áp; thước dời tay trừ phần máy | `scripts/lo-trinh.mjs`, SKILL feature-loop, `nen/do-nen.mjs` | AC-10 (điểm chạy) |
| Chạy đúng trên kế hoạch thật của crm | `tests/scripts/ap-chinh-sach-lo-trinh-crm.mjs` | AC-11 (dữ liệu thật) |

Mọi task `independent: false`: chúng cùng sửa `scripts/lo-trinh.mjs` và cùng tệp ca, nên làm tuần tự trong main loop.

---

### Task 1: Khung ca đo + gác gốc so của RM1 chỉ áp khi hồ sơ RM1 chưa ký

> **Cập nhật 15/10 (điều phối):** phần sửa RS-0 (Step 1, 2, 5) đã RÚT ra PR riêng, nhánh `claude/rs0-chi-gac-khi-chua-ky`,
> gộp trước PR 2.31 của M5. Ở vòng RM2, Task 1 chỉ còn Step 3–4 (khung ca đo). Trước Task 2 thì nhận nền main có PR ấy,
> dời `goc-so` của RM2 sang commit nhận nền, và ghi một dòng sổ `fix`.

**Files:**
- Create: `tests/scripts/ap-chinh-sach-lo-trinh.test.mjs`
- Modify: `tests/scripts/ra-soat-lo-trinh.test.mjs` (hàm `gocLech`, lời gọi `gocLech(KIT, GOC, 'ra-soat-lo-trinh')`)
- Modify: `_acceptance/ap-chinh-sach-lo-trinh/contract.md` (Notes — con trỏ thay thế), sổ quyết định (dòng `fix` stage S3)

**Vì sao:** RS-0 (hồ sơ đã ký `ra-soat-lo-trinh`) đòi MỌI commit sửa mã sau `59ab26e7` mang tên RM1. Hồ sơ đã ký và gộp
(#355), nên từ nay mọi PR sửa `scripts/ lib/ skills/ commands/` đều làm RS-0 đỏ: commit đầu của RM2, và cả PR của máy M5
cho bản 2.31. Vai của RS-0 là trong lúc vòng RM1 còn mở: giữ các ca so byte với bộ máy gốc có nghĩa (mọi thay đổi mã đều có
chủ). Hồ sơ đã ký thì mỗi ca so byte vẫn tự gọi tên chỗ lệch, nên lời hứa gốc không mất.
Sửa: RS-0 đọc `status` trong contract của RM1. Ở `signed-off` hoặc `machine-cleared` → in
`PASS: RS-0 — hồ sơ đã ký: gác gốc so chỉ áp lúc vòng còn mở`, không kiểm commit. Trạng thái khác → kiểm như cũ.
`RS-0-do` (ba chiều đỏ của `gocLech`) giữ nguyên. Thêm `RS-0-ky`: contract tạm `verified` + một commit lạ → đỏ như cũ;
`signed-off` → xanh.

**Interfaces:**
- Produces: khung `ap-chinh-sach-lo-trinh.test.mjs` với `ok/bad/want` (biến lọc `AP_CASES`), `kho({phienBan, data, hoSo,
  cfg, chuaCommit})`, `banSao(tiem)`, `banGoc()` (archive `scripts lib skills commands road-map` ở `goc-so` của RM2),
  `apJson(kit, r, today, extra=[])`, `apGhi(kit, r, today, extra=[])` → `{status, stdout, stderr}`, `docSoTep(r)` → mảng dòng.

- [ ] **Step 1:** Trong `ra-soat-lo-trinh.test.mjs`, thêm `const daKy = txt => /^status:\s*(signed-off|machine-cleared)\b/m.test(txt.split('\n---')[0]);`.
  Viết ca `RS-0-ky` (contract tạm `verified` + commit lạ → `gocLech` khác rỗng và RS-0 phải kiểm; `signed-off` → bỏ kiểm).
  Rồi trong `rs0()`, trước lời gọi `gocLech(KIT, GOC, 'ra-soat-lo-trinh')`: contract RM1 đã ký → `ok('RS-0', 'hồ sơ đã ký:
  gác gốc so chỉ áp lúc vòng còn mở')` và trả `true`.
- [ ] **Step 2:** Chạy `RS_CASES=RS-0 node tests/scripts/ra-soat-lo-trinh.test.mjs` → `PASS: RS-0-do`, `PASS: RS-0-ky`,
  `PASS: RS-0 — hồ sơ đã ký: …`.
- [ ] **Step 3:** Tạo `ap-chinh-sach-lo-trinh.test.mjs`: chép nguyên khối khung của `ra-soat-lo-trinh.test.mjs` (dòng 9–30 và
  90–170: `ok/bad/want/git/node/kho/banSao/banGoc/nap/chayCa`), đổi `GOC` sang
  `_acceptance/ap-chinh-sach-lo-trinh/goc-so`, `TMP` tiền tố `ap-`, biến lọc `AP_CASES`, `banGoc` archive thêm `road-map`.
  Thêm:

```js
const apChay = (kit, r, today, extra = []) => node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--ap', ...extra],
  { env: { ...process.env, ACCEPTANCE_TODAY: today } });
const apJson = (kit, r, today) => { const x = apChay(kit, r, today, ['--json']);
  if (x.status !== 0) throw new Error(`--ap --json thoát ${x.status}: ${x.stderr.slice(0, 200)}`); return JSON.parse(x.stdout); };
const apGhi = (kit, r, today) => apChay(kit, r, today, ['--write']);
const tepSo = r => path.join(r, TEP.replace(/\.json$/, '.so.jsonl'));
const docSoTep = r => existsSync(tepSo(r)) ? readFileSync(tepSo(r), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
const commitNgay = (r, ngay, tin) => { const env = { ...process.env, GIT_AUTHOR_DATE: `${ngay}T12:00:00Z`, GIT_COMMITTER_DATE: `${ngay}T12:00:00Z` };
  execFileSync('git', ['-C', r, 'add', '-A'], { env }); execFileSync('git', ['-C', r, 'commit', '-qm', tin, '--allow-empty'], { env }); };
console.log(`Results: ${pass} passed, ${fail} failed (ap-chinh-sach-lo-trinh)`); process.exit(fail ? 1 : 0); // cuối tệp
```

- [ ] **Step 4:** Chạy `node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs` → `Results: 0 passed, 0 failed`, thoát 0.
- [ ] **Step 5:** Notes của contract thêm con trỏ thay thế: «RS-0 (hồ sơ `ra-soat-lo-trinh`) chỉ gác gốc so khi hồ sơ ấy chưa
  ký — lời hứa gốc giữ nguyên trong lúc vòng mở; sau ký mỗi ca so byte tự gọi tên chỗ lệch.» Ghi một dòng sổ `fix` stage `S3`
  (khối `DEC-ID-RECIPE`). Commit `test(ap-chinh-sach-lo-trinh): khung ca đo + RS-0 chỉ gác khi hồ sơ RM1 chưa ký`.

**Verify:** `RS_CASES=RS-0 node tests/scripts/ra-soat-lo-trinh.test.mjs && node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs`
**Phục vụ:** hạ tầng của E1–E10.

### Task 2: Đọc chính sách của mốc chiến dịch (AC-1)

**Files:** Modify `scripts/lo-trinh.mjs` (`kiemKhuon`, `CO_DICH`, `raSoat`, khối CLI); Test: tệp ca của Task 1.

**Interfaces:**
- Produces:
  - `export function chienDichDangChay(moc, today) → { m, i } | null` — mốc `loai: 'phat-hanh'`, `ngay` hợp lệ `>= today`,
    ngày nhỏ nhất; cùng ngày → chỉ số nhỏ hơn.
  - `export function chinhSachHieuLuc(khuon, today) → { tu_ap, tuoi_ngay, tran_ke_tiep, nhip_ngay, tran_ap, moc } | null` —
    null khi không lớp nào khai. `tu_ap` chỉ từ mốc (mặc định false). `tuoi_ngay`/`tran_ke_tiep`: mốc thắng tệp.
    `nhip_ngay` mặc định 1, `tran_ap` mặc định 5. `moc` = tên mốc đang chạy hoặc null.
  - `kiemKhuon(data)` thêm `mocChinhSach: Map<chỉ số mốc, cs đã kiểm>`. Bốn cờ mới đúng chữ:
    `chính sách chỉ khai ở mốc phát hành: <tên ngắn mốc>` · `chinh_sach.tu_ap phải là true hoặc false (mốc <tên>)` ·
    `chinh_sach.nhip_ngay phải là số nguyên dương (mốc <tên>)` · `chinh_sach.tran_ap phải là số nguyên dương (mốc <tên>)`;
    dòng `CO_DICH` tương ứng dịch ra «chính sách chỉ khai ở mốc phát hành» / «chính sách tu_ap phải là true hoặc false» /…
  - `raSoat` dùng `chinhSachHieuLuc(kq, today)` thay `kq.chinhSach`. Kho không khai mốc chính sách → đối tượng bằng
    `kq.chinhSach` cũ, nên byte không đổi.
  - CLI `--ap [--json] [--write]`: không có `--write` thì chỉ tính (Task 5 điền phần áp); `--json` in
    `[{tep, chien_dich, chinh_sach, ...}]`.

- [ ] **Step 1 (đỏ trước):** Ca `AP-1`: kho thử bốn mốc A/B/C/N như hợp đồng, `chinh_sach` tệp `{tuoi_ngay:30, tran_ke_tiep:2}`,
  hàng `K25` ngoài mốc tuổi 25 (commit 2026-09-20, hôm nay `2026-10-15`). Mong đợi viết sẵn:
  `chien_dich === tenNganMoc(B)`, `chinh_sach` deepEqual `{tu_ap:true,tuoi_ngay:20,tran_ke_tiep:2,nhip_ngay:1,tran_ap:5}`;
  `rsJson` có `{ma:'K25',luat:'tuoi'}`; trang có đúng một mục `coTrang` = «chính sách chỉ khai ở mốc phát hành: N…».
  Chạy → FAIL (`--ap` là tham số lạ).
- [ ] **Step 2:** Viết `chienDichDangChay`, `chinhSachHieuLuc`, kiểm khuôn mốc, `CO_DICH`, nối vào `raSoat`, khung CLI `--ap`.
- [ ] **Step 3:** Thêm `AP-1-cung-ngay` (Review Focus 1), `AP-1-sai-kieu`, `AP-1-khong-bat` (ba kho, so byte `--ra-soat`
  chữ + JSON với `banGoc()`, đối chứng dương: hai bên thoát 0). Hai ca đỏ:
  - `AP-1-do`: tiêm vào bản sao đổi so sánh chọn gần nhất thành xa nhất → ghim «chiến dịch đang chạy: C, cần B».
  - `AP-1-do2`: tiêm `tu_ap` đọc từ khối tệp → ghim «kho không bật tự áp mà máy ghi sổ».
  `AP-1-do2` cần Task 5 mới ghi sổ, nên viết ca ở đây, dời nhát kiểm sang cuối Task 5.
- [ ] **Step 4:** `AP_CASES=AP-1 node tests/scripts/ap-chinh-sach-lo-trinh.test.mjs` → mọi `PASS: AP-1…` (trừ `AP-1-do2`, chờ Task 5).
  Chạy lại `node tests/scripts/ra-soat-lo-trinh.test.mjs` và `node tests/scripts/lo-trinh.test.mjs` → xanh.
- [ ] **Step 5:** Commit `feat(ap-chinh-sach-lo-trinh): chính sách đọc từ mốc chiến dịch đang chạy`.

**Phục vụ:** E1.

### Task 3: Bộ ghi giữ byte (AC-4)

**Files:** Modify `scripts/lo-trinh.mjs`; Test: tệp ca.

**Interfaces:**
- Produces:
  - `export function dangChuan(txt) → boolean` = `JSON.stringify(JSON.parse(txt), null, 2) + '\n' === txt` (parse lỗi → false).
  - `export function ghiLoTrinh(duongTep, data)` — ghi `JSON.stringify(data, null, 2) + '\n'` vào `<tệp>.tam-<pid>` rồi
    `renameSync`.
  - `export const LOI_DANG = tep => \`tệp lộ trình không ở dạng chuẩn — máy không ghi: ${tep}\``.

```js
export function dangChuan(txt) { try { return JSON.stringify(JSON.parse(txt), null, 2) + '\n' === txt; } catch { return false; } }
export function ghiLoTrinh(p, data) { const t = `${p}.tam-${process.pid}`; writeFileSync(t, JSON.stringify(data, null, 2) + '\n'); renameSync(t, p); }
```

- [ ] **Step 1:** Ca `AP-4-tu-choi` (đỏ trước): bốn tệp không chuẩn × `--ap --write` trên kho bật có đề xuất → thoát 2, stderr
  chứa `LOI_DANG`, băm + mtime tệp và sổ không đổi; đối chứng dương: cùng nội dung ở dạng chuẩn thì thoát 0 và tệp đổi.
- [ ] **Step 2:** Viết `dangChuan`, `ghiLoTrinh`. Điều kiện trước chạy trong `--ap --write` cho từng tệp sẽ bị ghi, TRƯỚC mọi
  dòng sổ. Ca này xanh sau Task 5.
- [ ] **Step 3:** Ca `AP-4`: bản sao byte `git show <goc-so>:docs/plans/lo-trinh-kit.json` + khoá lạ (`_x_goc` ở gốc, `x_la` ở
  một hàng, `x_moc` ở một mốc, `{a:{b:1}}` lồng), thêm mốc `phat-hanh` tương lai `tu_ap: true`, một hàng chờ điều kiện vì
  `xep-lai` tự khai. Sau D/D+1: diff dòng tự viết (LCS đơn giản trên mảng dòng) — mọi dòng khác nằm trong đoạn của hàng bị
  dời; `Object.keys` đệ quy của mọi object không dời bằng bản trước; tệp kết bằng đúng một `\n`.
  Đỏ:
  - `AP-4-do`: tiêm `null, 2)` → `null, 4)` ở `ghiLoTrinh`, ghim «byte ngoài phần dời đổi».
  - `AP-4-do2`: tiêm `if (!dangChuan(` → `if (false && !dangChuan(`, ghim «ghi đè tệp không chuẩn: <ca>».
- [ ] **Step 4:** Chạy `AP_CASES=AP-4`, chấp nhận còn đỏ tới Task 5; commit `feat(ap-chinh-sach-lo-trinh): bộ ghi giữ byte + điều kiện dạng chuẩn`.

**Phục vụ:** E4.

### Task 4: Sổ tự áp — đọc, ghi, phát lại (AC-5 nền)

**Files:** Modify `scripts/lo-trinh.mjs`.

**Interfaces:**
- Produces:
  - `export const tepSo = tep => tep.replace(/\.json$/, '') + '.so.jsonl'` (đường tương đối gốc kho).
  - `export function docSo(root, tep) → { dong: object[], hong: number }`.
  - `export function ghiSo(root, tep, dongMoi)` — nối mỗi dòng `JSON.stringify(d) + '\n'`, thứ tự khoá cố định theo `KHOA_SO`.
  - `export function phatLai(dong) → { cho: Map<ma, dòng bao-truoc>, daAp: Map<ma, dòng ap cuối chưa trả>, traLai: Map<ma, {de_xuat, luat}>, ghim: Set<ma> }`.
  - `KHOA_SO = ['ngay','loai','ma','de_xuat','luat','can_cu','ap_tu','vi_tri','dich','hang_goc','lenh_tra_lai','boi']` —
    dòng ghi theo đúng thứ tự này, bỏ khoá vắng.
- [ ] **Step 1:** Ca `AP-5-so-hong` (Review Focus 3): sổ có một dòng `{bad` giữa hai dòng tốt → `--ap --json` mang
  `canh_bao` «sổ tự áp có 1 dòng không đọc được», thoát 0.
- [ ] **Step 2:** Viết bốn hàm. Phát lại theo thứ tự dòng: `bao-truoc` đặt `cho[ma]`; `huy` xoá `cho[ma]`; `ap` xoá `cho[ma]`,
  đặt `daAp[ma]`; `tra-lai` xoá `daAp[ma]`, đặt `traLai[ma]`; `ghim`/`bo-ghim` thêm/bớt `ghim`.
- [ ] **Step 3:** Commit `feat(ap-chinh-sach-lo-trinh): sổ tự áp đọc/ghi/phát lại`.

**Phục vụ:** E5 (nền), E2.

### Task 5: Nhịp báo trước → áp, ba hành động, trần (AC-2, AC-3, AC-5)

**Files:** Modify `scripts/lo-trinh.mjs` (`apChinhSach`, CLI `--ap`).

**Interfaces:**
- Consumes: `chinhSachHieuLuc`, `raSoat`, `dangChuan`, `ghiLoTrinh`, `docSo/ghiSo/phatLai`.
- Produces: `export function apChinhSach({ root, cacTep, sections, today, ghi = false, hangMo = null }) →
  [{ tep, chien_dich, chinh_sach, bao_truoc: [], da_ap: [], huy: [], canh_bao?: [] }]`. `hangMo` là mã đang được mở
  (Task 10). CLI `--ap`: thoát 0 · 1 (kho chưa khai, tệp không đọc được) · 2 (dùng sai, `ACCEPTANCE_TODAY` sai dạng, tệp
  không chuẩn khi `--write`).

Thuật toán, mỗi tệp có `chinh_sach.tu_ap`:
1. `rs = raSoat(...)` của tệp; `P = phatLai(docSo(...).dong)`.
2. Với mỗi đề xuất `e` theo thứ tự hàng trong tệp:
   - `e.ma === hangMo` → nếu có `P.cho[e.ma]` thì `huy`; bỏ qua.
   - `P.ghim.has(e.ma)` → nếu có `P.cho` thì `huy`; bỏ qua.
   - `P.traLai[e.ma]` cùng `de_xuat` + `luat` → bỏ qua.
   - Không có `P.cho[e.ma]` → `bao-truoc` với `ap_tu = today + nhip_ngay`.
   - Có `P.cho[e.ma]`, cùng `de_xuat` + `luat`, `today >= ap_tu`, còn trần → `ap`.
   - Có `P.cho[e.ma]` mà khác → `huy` cũ + `bao-truoc` mới.
3. Mỗi `P.cho[ma]` không còn trong `rs` → `huy`.
4. `ap`: dời mốc — gỡ `ma` khỏi mọi mốc `phat-hanh` đã qua chứa nó (nhớ `{ten, chi_so}`), chèn cuối `hang` của chiến dịch
   đang chạy; không có chiến dịch phía trước → không `bao-truoc`, cảnh báo «không có mốc chiến dịch phía trước».
   Chờ điều kiện / bác — gỡ hàng khỏi `hang` (nhớ `chi_so`), gỡ mã khỏi mọi mốc, nối cuối `chan_troi` / `da_bac`:
   `{...hang, ly_do|ly_do_may: dongRaSoat-căn-cứ, mo_lai_khi: 'chủ kho trả lại, hoặc căn cứ đổi' (chỉ chan_troi), tu_ap: {ngay: today}}`.
5. `--write`: kiểm `dangChuan` → ghi sổ (mọi dòng mới) → ghi tệp (nếu có `ap`). Dòng `ap` đã có trong sổ mà hàng vẫn ở chỗ
   cũ (đứt giữa chừng) → làm lại thay đổi, không thêm dòng.

- [ ] **Step 1:** Ca `AP-2`, `AP-2-tran-1`, `AP-2-doi`, `AP-2-ngay-sai` (Review Focus 5) với dãy sổ viết sẵn như evals.yaml.
- [ ] **Step 2:** Ca `AP-3`, `AP-3-khong-moc`, `AP-3-hai-moc` (Review Focus 2), đối tượng mong đợi viết tay trong ca.
- [ ] **Step 3:** Ca `AP-5` (hai clone, băm bằng nhau, `git merge` thoát 0), `AP-5-gop`, `AP-5-dut` (bản sao tiêm
  `process.exit(0)` ngay sau `ghiSo(` trong nhánh `--write`).
- [ ] **Step 4:** Viết `apChinhSach` + CLI. Chạy `AP_CASES=AP-1,AP-2,AP-3,AP-4,AP-5` → xanh cả, kể cả `AP-1-do2` và `AP-4*`.
- [ ] **Step 5:** Đỏ:
  - `AP-2-do`: `today >= ap_tu` → `true`, ghim «áp trước nhịp: X».
  - `AP-2-do2`: bỏ nhánh so `de_xuat`/`luat` lúc áp, ghim «áp hàng đã có hồ sơ mở: Y».
  - `AP-2-do3`: bỏ trần, ghim «áp 3, trần 2».
  - `AP-2-do4`: so chỉ mã, ghim «áp đề xuất chưa báo trước: X bac».
  - `AP-3-do`: xoá thay vì chuyển, ghim «hàng biến mất: T».
  - `AP-3-do2`: `push` → `unshift`, ghim «mục máy không ở cuối chan_troi».
  - `AP-5-do`: `ngay: today` → `ngay: new Date().toISOString()`, ghim «sổ hai máy khác byte».
- [ ] **Step 6:** `node tests/scripts/ra-soat-lo-trinh.test.mjs` + `node tests/scripts/lo-trinh.test.mjs` vẫn xanh. Commit
  `feat(ap-chinh-sach-lo-trinh): báo trước một nhịp → áp, ba hành động, trần, sổ tất định`.

**Phục vụ:** E2, E3, E5 (và hoàn tất E1, E4).

### Task 6: Trả lại · ghim · bỏ ghim (AC-6)

**Files:** Modify `scripts/lo-trinh.mjs` (CLI `--tra-lai <mã>`, `--ghim <mã>`, `--bo-ghim <mã>`, đều cần `--write`).

**Interfaces:**
- Produces: `export function traLai({ root, tep, ma, today, boi })`, `export function ghimHang({ root, tep, ma, today, boi, bo })`.
  Hai hàm trả `{ thoat, thong_diep }`. `boi` = `git config user.name` (vắng → chuỗi rỗng). Mã có ở nhiều tệp → thoát 3 như
  `--hang`; nhận `<tệp>:<mã>`.
- Thông điệp ghim: «không có lần áp nào của <mã> để trả lại» · «hàng đã đổi sau khi máy áp — trả lại bằng tay».
- Kiểm «đã đổi»: dựng lại mục máy đã chuyển từ `hang_goc` + `dich` + `ngay` của dòng `ap` (cùng hàm dựng của Task 5), so
  JSON với mục đang có ở khối đích.

- [ ] **Step 1:** Ca `AP-6`, `AP-6-doi`, `AP-6-ghim`, `AP-6-tu-choi`; mỗi lệnh `--write` theo sau bởi `commitNgay`.
- [ ] **Step 2:** Viết hai hàm + CLI. Trả lại: chèn `hang_goc` về `vi_tri.chi_so`, chèn mã về từng `vi_tri.moc[].chi_so`,
  gỡ mã khỏi mốc đích (dời mốc) hoặc gỡ mục khỏi khối đích → ghi dòng `tra-lai` → ghi tệp. Ghim / bỏ ghim chỉ ghi sổ.
- [ ] **Step 3:** Đỏ:
  - `AP-6-do`: bỏ nhánh `traLai` ở bước 2 của Task 5, ghim «máy báo trước lại đề xuất vừa trả: T tuoi».
  - `AP-6-do2`: ghim viết khoá lên hàng, ghim «lệnh ghim đổi tệp lộ trình».
- [ ] **Step 4:** Commit `feat(ap-chinh-sach-lo-trinh): trả lại · ghim · bỏ ghim`.

**Phục vụ:** E6.

### Task 7: Ba lệnh khoá — CỘNG đã duyệt ở Cổng Phạm vi (AC-7)

**Files:**
- Create: `road-map/commands/ghim.md`, `road-map/commands/bo-ghim.md`, `road-map/commands/tra-lai.md`.
- Modify: `tests/plugins/run-tests.sh` (P32), `docs/adr/0002-human-gate-invocation-lock.md`, `road-map/README.md`.

Khuôn mỗi tệp lệnh (ví dụ `ghim.md`):

````markdown
---
description: Ghim một hàng lộ trình — máy không tự áp lên hàng ấy cho tới khi bỏ ghim. Chỉ người gõ.
argument-hint: <mã> hoặc <tệp>:<mã>
disable-model-invocation: true
---

Chạy đúng dòng trong khối dưới, thay `<mã>` bằng đối số (chỉ khi đối số khớp `^([A-Za-z0-9][A-Za-z0-9_./-]*:)?[A-Za-z0-9][A-Za-z0-9_.-]*$`;
không khớp thì dừng, không đưa đối số vào shell). Bản chép trong kho (`scripts/lo-trinh.mjs`) thắng bản cài: bộ ghi phải
cùng phiên bản với bộ đọc CI của kho. In nguyên văn kết quả; thoát khác 0 thì in nguyên văn dòng lỗi.

<!-- <<<RM-GHIM-LENH -->
```
L=scripts/lo-trinh.mjs; [ -f "$L" ] || L="$AG/scripts/lo-trinh.mjs"; node "$L" --root . --ghim '<mã>' --write
```
<!-- RM-GHIM-LENH>>> -->
````

(`bo-ghim.md` khối `RM-BO-GHIM-LENH` với `--bo-ghim`; `tra-lai.md` khối `RM-TRA-LAI-LENH` với `--tra-lai`. `$AG` giải như
`xem.md`.)

- [ ] **Step 1:** Ca `AP-7` (frontmatter, `LOCKED_ROAD_MAP` rút từ khối P32, `LOCKED` bằng bảy tên bộ máy gốc, ADR 0002 chứa
  ba tên) và `AP-7-lenh` (rút khối lệnh, thay `<mã>`, chạy trên kho AP-6 với `AG` trỏ KIT, so băm tệp + sổ với lời gọi
  thẳng). Chạy → FAIL.
- [ ] **Step 2:** Tạo ba tệp lệnh. P32 thêm sau vòng `LOCKED`:

```python
LOCKED_ROAD_MAP = ["ghim", "bo-ghim", "tra-lai"]
for name in LOCKED_ROAD_MAP:
    t = (root / "road-map" / "commands" / f"{name}.md").read_text()
    assert "disable-model-invocation: true" in t, f"road-map/commands/{name}.md lacks lock"
xem = (root / "road-map/commands/xem.md").read_text()
assert "disable-model-invocation" not in xem, "road-map/commands/xem.md must stay model-invocable (chỉ đọc)"
```

  ADR 0002 thêm đoạn: «Từ 2.31 (hồ sơ `ap-chinh-sach-lo-trinh`, chủ kho duyệt CỘNG 15/10): gói `road-map` có ba lệnh khoá
  `ghim`, `bo-ghim`, `tra-lai` — quyết của người lên lộ trình (miễn trừ tự áp, phủ quyết một lần áp). Danh sách
  `LOCKED_ROAD_MAP` của P32 giữ chúng; `xem` giữ mở vì chỉ đọc.» README road-map: khối chính sách trên mốc, ba lệnh, sổ.
- [ ] **Step 3:** Đỏ:
  - `AP-7-do`: chạy khối P32 (rút từ `run-tests.sh` bằng marker `run "P32 `… `PY`) bằng `python3` trên bản sao gỡ khoá
    `ghim.md`, ghim thông điệp chứa `road-map/commands/ghim.md`. Đối chứng dương: bản lành thoát 0.
  - `AP-7-do2`: khoá `xem.md`, ghim chứa `xem.md`.
- [ ] **Step 4:** `bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:"` (bọc
  `chay-nang.sh`) → `Results: all plugin tests passed`; `node tests/plugins/ntr-observed.test.mjs` xanh (NO-AC11 không đổi).
  Commit `feat(ap-chinh-sach-lo-trinh): ba lệnh khoá road-map + P32 LOCKED_ROAD_MAP + ADR 0002`.

**Phục vụ:** E7, E7b.

### Task 8: Lệnh xem thành bản đồ + Ngoài-3 (AC-8)

**Files:** Modify `scripts/lo-trinh.mjs` (CLI `--xem`, `tuoiHang`), `road-map/commands/xem.md` (khối `RM-XEM-LENH` →
`--xem`, lời dặn).

**Interfaces:** `export function xemBanDo({ root, classify, sections, today }) → string[]`. Mỗi lộ trình in, theo thứ tự:
1. `Xong <a> · Đang dở <b> · Kế <c>` — đếm theo `nhomTienDo`: đã giao / đang làm / chưa làm;
2. `Đang dở:` rồi mỗi hàng một dòng `  · <mã> — <câu giao> (<chữ ô>)`;
3. `Kế: <mã> — <câu giao>` rồi tối đa 3 dòng `  · <mã> — <câu giao>`;
4. khối rà soát (dòng của `dongRaSoat`; hàng ghim thêm « (ghim — máy không tự áp)»);
5. khối «Tự áp» chỉ khi `tu_ap` — `Tự áp — chiến dịch <tên>: tuổi <n> · trần kế tiếp <n> · nhịp <n> ngày · trần áp <n>/ngày`,
   rồi `  · <mã> — sẽ <đề xuất> từ <dd/mm/yyyy>` và `  · <mã> — đã <đề xuất> <dd/mm/yyyy> — trả lại: /road-map:tra-lai <mã>` (7 ngày).
`tuoiHang`: tệp tồn tại, kho git, `soCommit === 0` → `hong: 'tệp lộ trình chưa từng commit'`.

- [ ] **Step 1:** Ca `AP-8` (khối dòng mong đợi viết tay), `AP-8-khong-bat`, `AP-8-chua-commit` (dùng `kho({chuaCommit:true})`).
  Chạy → FAIL.
- [ ] **Step 2:** Viết. `--ra-soat` không đổi.
- [ ] **Step 3:** Đỏ:
  - `AP-8-do`: tiêm ghi một tệp `_xem.tmp` trong `--xem`, ghim «lệnh xem ghi tệp: _xem.tmp».
  - `AP-8-do2`: bỏ nhánh `soCommit === 0`, ghim «tệp chưa commit mà không cảnh báo».
- [ ] **Step 4:** Commit `feat(ap-chinh-sach-lo-trinh): lệnh xem thành bản đồ + cảnh báo tệp chưa commit`.

**Phục vụ:** E8.

### Task 9: Thẻ khởi động — dòng «Tự áp» (AC-9)

**Files:** Modify `scripts/lo-trinh.mjs` (`loTrinhThe`).

**Interfaces:** `loTrinhThe` gọi `apChinhSach({ghi:false})` CHỈ khi tệp có `tu_ap`. Ngay sau khối rà soát, chèn:
- `Tự áp: <n> báo trước (áp từ <dd/mm/yyyy sớm nhất>) · <m> đã áp 7 ngày qua`;
- tối đa 3 dòng chi tiết (cùng câu với `--xem`).
Kho có chiến dịch đang chạy, không `tu_ap`, và có ≥ 1 đề xuất → một dòng
`  ! chiến dịch <tên ngắn> chưa khai chính sách tự áp — chỉ cờ`. Khoá `ds[].tuAp` chỉ có khi khác rỗng.

- [ ] **Step 1:** Ca `AP-9`, `AP-9-byte` (ba kho, `quet` so byte với `banGoc()`, đối chứng dương), `AP-9-nhac`. Chạy → FAIL.
- [ ] **Step 2:** Viết.
- [ ] **Step 3:** Đỏ `AP-9-do`: in dòng tổng không điều kiện, ghim tên kho lệch byte.
- [ ] **Step 4:** Commit `feat(ap-chinh-sach-lo-trinh): thẻ khởi động in dòng Tự áp`.

**Phục vụ:** E9.

### Task 10: Mở việc thì áp + thước dời tay trừ theo sổ (AC-10)

**Files:**
- Modify: `scripts/lo-trinh.mjs` (nhánh `--mo-o`).
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (sau khối `S0-MO-O-THOAT`).
- Modify: `_acceptance/ap-chinh-sach-lo-trinh/nen/do-nen.mjs`.

**Interfaces:**
- `--mo-o`: trước khi dựng ô, nếu tệp của hàng có `tu_ap` → `apChinhSach({ghi:true, hangMo: ma})`; JSON in thêm
  `ap: {bao_truoc, da_ap, huy}` (số) CHỈ khi khác 0. Lỗi dạng chuẩn → bỏ áp, in cảnh báo ra stderr, vẫn mở ô (mở việc
  không bị chặn bởi tự áp).
- SKILL — khối mới:

```
<!-- <<<S0-AP-COMMIT -->
JSON của S0-MO-O có khoá `ap` → commit RIÊNG tệp lộ trình + sổ tự áp TRƯỚC commit mở ô, tiêu đề đúng:
lo-trinh(may-ap): <n> hàng — <YYYY-MM-DD>
(<n> = ap.da_ap; 0 thì «0 hàng» vẫn commit dòng báo trước/huỷ). Không hỏi người.
<!-- S0-AP-COMMIT>>> -->
```

- `do-nen.mjs`: commit chạm tệp `X.json` → đọc `X.so.jsonl` ở commit đó và ở commit cha; dòng `ap` mới trong commit (có ở
  con, không ở cha) cho tập `{ma, dich}`. Thay đổi lớp «dời» của mã thuộc tập ấy là của máy. Lớp «doi» của commit chỉ
  tính khi còn ít nhất một thay đổi dời của mã KHÔNG thuộc tập. Hằng `TIEU_DE_MAY = 'lo-trinh(may-ap)'` được export để
  `AP-10-skill` so với khối SKILL.

- [ ] **Step 1:** Ca `AP-10`, `AP-10-byte`, `AP-10-skill`, `AP-10-thuoc`, `AP-10-tron`. Chạy → FAIL.
- [ ] **Step 2:** Viết ba phần.
- [ ] **Step 3:** Đỏ:
  - `AP-10-do`: bỏ `hangMo`, ghim «áp hàng đang mở: H».
  - `AP-10-do2`: thước trừ theo tiêu đề commit, ghim «lớp dời 2, cần 1».
- [ ] **Step 4:** Commit `feat(ap-chinh-sach-lo-trinh): mở việc thì tự áp + thước trừ theo sổ`.

**Phục vụ:** E10.

### Task 11: Dữ liệu thật crm (AC-11) + chạy đủ bộ

**Files:** Create `tests/scripts/ap-chinh-sach-lo-trinh-crm.mjs`.

- [ ] **Step 1:** Ca `AP-11`:
  - bung `git -C $KHO_CRM archive 3818ad4e docs/plan _acceptance` (`KHO_CRM` mặc định `~/dev/crm`; vắng → thoát 2 nêu
    đường) cùng `_acceptance/config.yaml` của crm;
  - thêm chính sách như hợp đồng, rồi chạy `--ap --write` ngày 15/10 và 16/10;
  - tập mong đợi tính bằng hàm đếm ĐỘC LẬP viết trong ca: mốc `phat-hanh` đã qua × hàng chưa giao không hồ sơ mở; tuổi theo
    `git log` của crm ≥ 14; trần 5 theo tuổi giảm dần; tự khai «xếp lại»; hồ sơ `decision: kill`;
  - so tập (tệp, mã, đề xuất); bất biến: `dangChuan` mọi tệp sau ghi, tập mã ba khối không đổi, `product-map.mjs --check`
    thoát 0 sau khi vẽ lại.
- [ ] **Step 2:** Chạy `node tests/scripts/ap-chinh-sach-lo-trinh-crm.mjs` → `PASS: AP-11`.
- [ ] **Step 3:** Chạy cả bộ (bọc `chay-nang.sh "RM2 cả bộ"`): `bash tests/scripts/run-tests.sh`, `bash tests/hooks/run-tests.sh`,
  ba vùng plugin, `node scripts/product-map.mjs --root . --check`.
- [ ] **Step 4:** Commit `test(ap-chinh-sach-lo-trinh): dữ liệu thật crm`. Contract `status: implemented`.

**Phục vụ:** E11.

---

## Thứ tự và phụ thuộc

Task 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11. Task 7 và Task 11 có thể đổi chỗ, nhưng vẫn làm tuần tự vì chung tệp ca.
