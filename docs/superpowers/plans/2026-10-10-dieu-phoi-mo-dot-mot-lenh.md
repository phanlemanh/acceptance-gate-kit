# dieu-phoi-mo-dot-mot-lenh — kế hoạch thực thi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mở và đóng một đợt Điều phối – Thợ bằng một lệnh, kèm vòng đời đợt, đổi kế hoạch trong đợt, nguồn hàng từ lộ trình, khoá S4 cấp máy, `start` biết đợt và lệnh đếm đợt.

**Architecture:** Mỗi tệp trạng thái mới có đúng một mô-đun viết (`pha.mjs`, `vai.mjs`, `hang.mjs`); CLI `dieu-phoi.mjs` chỉ phân lệnh. Bộ phát lịch đọc `pha` và khoá máy ở đầu `capPhat`. Lệnh người là ba tệp `dieu-phoi/commands/*.md` gọi CLI qua `${CLAUDE_PLUGIN_ROOT}`. Phần `start` sống ở acceptance-gate, đọc thư mục đợt bằng mã của chính nó (không nạp gói `dieu-phoi`).

**Tech Stack:** Node ≥ 22 ESM, `node:test`, không phụ thuộc npm.

**Spec:** `docs/superpowers/specs/2026-10-10-dieu-phoi-mo-dot-mot-lenh-design.md` (năm chỗ chọn §3) · thiết kế chung `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` · hợp đồng `_acceptance/dieu-phoi-mo-dot-mot-lenh/contract.md` · `evals.yaml`.

## Global Constraints

- Gói `dieu-phoi` không import gì ngoài `dieu-phoi/` và `node:*` (ca DP1-06 giữ).
- Không sửa thân ca nào của `tests/dieu-phoi/dong-goi.test.mjs` và `tests/dieu-phoi/loi/` (AC-15); 118 ca phải xanh.
- `mo` không gói → đợt dựng tay, `pha` `dang-chay`; đợt không `dieu-khien.json` → đọc `dang-chay`; `dong` không đòi `dang-dong` (design §3).
- Khoá máy ở `process.env.DIEU_PHOI_MAY_DIR ?? ~/.claude/dieu-phoi/may`, chỉ áp cho đợt có `nguon_goi`.
- Mã không đặt vào `lib/**` hay `hooks/**` (giữ T2).
- Mỗi phép đo mới: cặp hai chiều trên cùng fixture, ghim thông điệp; kho thử code sinh; đường suy từ vị trí tệp.
- Chữ trong tài liệu: không «N phút», không dòng `claude plugin install` ở GUIDE (LB9), không sửa bên trong khối marker có sẵn.

## Review Focus

1. **Chạy lại lệnh người giữa chừng** (giám sát chết sau `mo`, trước `chay`): `mo` lần hai là no-op, `pha dang-chay` khi đã `dang-chay` là no-op — Task 1, Task 4 ghim.
2. **Gói đợt có `hang-viec.json` sai khuôn**: `mo` từ chối TRƯỚC khi dựng thư mục, nêu trường sai — Task 1 thêm ca.
3. **Tên đợt trùng một đợt đã đóng** (thư mục `dieu-phoi-<tên>` còn, symlink gỡ): `mo` mở lại không xoá sổ cũ, báo đợt cũ còn thư mục — Task 1 ghim «thư mục đợt đã tồn tại» thoát 1 nêu đường.
4. **Hai `xin/` cùng s4 ở cùng nhịp ở hai kho** (tranh khoá máy): chỉ một kho thắng `mkdir` — Task 7 dùng `mkdirSync` nguyên tử.
5. **`dieu_phoi.goi_dot` có `{ten}` nhưng tên đợt có ký tự lạ**: tên đã bị chặn bởi `^[\w-]+$` của `moDot` trước khi ghép đường — Task 1 giữ thứ tự kiểm.

---

### Task 1: Gói đợt, `vai`, `pha` và `mo` mở từ gói

**Phục vụ:** E2, E3, E4 · **independent:** false

**Files:** Create `dieu-phoi/scripts/pha.mjs`, `dieu-phoi/scripts/vai.mjs`, `dieu-phoi/scripts/goi-dot.mjs`, `tests/dieu-phoi/mo-dot.test.mjs`; Modify `dieu-phoi/scripts/dieu-phoi.mjs`, `dieu-phoi/scripts/hinh-dang.mjs` (khoá cấu hình `nguon_hang`; khoá dãy `nghi`).

**Interfaces — Produces:**
- `pha.mjs`: `PHA = ['nhap','dang-chay','tam-dung','dang-dong']`; `CHUYEN = {nhap:['dang-chay'], 'dang-chay':['tam-dung','dang-dong'], 'tam-dung':['dang-chay','dang-dong'], 'dang-dong':[]}`; `docPha(thuMuc) → {pha, nguon_goi, …}` (vắng tệp → `{pha:'dang-chay', nguon_goi:null, cu:true}`); `datPha(thuMuc, sang, {boi, lyDo}) → {doi:boolean}` — cùng pha → `{doi:false}` không ghi; ngoài bảng → `throw Error('pha: <từ> → <sang> không có trong bảng chuyển')`; `khoiTaoPha(thuMuc, {pha, nguonGoi, boi})`.
- `vai.mjs`: `ghiVai(thuMuc, {phien, worktree, day})`; `docVai(thuMuc)`.
- `goi-dot.mjs`: `timGoi(gocKho, ten, coGoi) → string|null` (cờ thắng; khoá `dieu_phoi.goi_dot` đọc theo dòng, `{ten}` thay tên); `docGoi(dir) → {cfg, hangViec, luatRieng}` ném `goi-dot: thiếu <tệp> trong <dir>` hoặc lỗi khuôn của `kiemCauHinh`/`kiemHangViec`; `ghepLuat(khuon, rieng)`.
- `dieu-phoi.mjs`: `moDot(cwd, ten, {goi, phien} = {})` trả `{thuMuc, daMo:boolean}`; CLI `mo <tên> [--goi <dir>] [--phien <id>]`; CLI `pha <trạng thái> [--ly-do <s>]`.

- [ ] **Bước 1 — ca đỏ:** trong `mo-dot.test.mjs` dựng hàm `khoThu()`, `goiThu(kho, {ten})` (ghi `goi/dot-<ten>/` ba tệp: cấu hình từ `mau/` của gói + `nhanh_chinh: 'main'`; `hang-viec.json` hai dãy P1, P2 worktree thư mục tạm, hai hàng A (P1), B (P2); `LUAT-rieng.md` = `# riêng\n- luật 1\n`), `khaiGoi(kho, mau)` (thêm khối `dieu_phoi:\n  goi_dot: goi/dot-{ten}\n` vào `_acceptance/config.yaml`). Viết ca DP2-02 mo-tu-goi, chay-lai, co-goi-thang, DP2-02-do thieu-tep, DP2-03 dung-tay, DP2-04 bang-chuyen (ma trận 16 ô viết sẵn), DP2-04-do bo-bang. Chạy → đỏ.
- [ ] **Bước 2 — `pha.mjs`, `vai.mjs`, `goi-dot.mjs`** theo Interfaces. `datPha` ghi `{pha, nguon_goi, dat_boi, dat_luc, ly_do, lich_su:[…cũ, {pha, dat_boi, dat_luc, ly_do}]}` bằng `ghiJsonNguyenTu`. Đọc khoá `goi_dot`: tìm dòng `^dieu_phoi:\s*$` rồi dòng thụt `^\s+goi_dot:\s*(.+)$` ngay trong khối.
- [ ] **Bước 3 — `moDot`:** kiểm tên → tìm gói → (có gói) `docGoi` hết TRƯỚC khi tạo thư mục; symlink đang trỏ đợt cùng tên → `{daMo:true}` không ghi; symlink trỏ đợt khác → ném như cũ; thư mục `dieu-phoi-<tên>` đã có mà không symlink → ném `đợt <tên> còn thư mục cũ: <đường> — đổi tên hoặc dọn`. Có gói: chép cấu hình + `goc_kho`, hang-viec + `dot`, `LUAT.md = ghepLuat(mau/LUAT.md, luatRieng)`, `ghiVai`, `khoiTaoPha({pha:'nhap', nguonGoi:dir})`. Không gói: đường cũ (chép `mau/`) + `khoiTaoPha({pha:'dang-chay', nguonGoi:null})`. CLI in `đợt <tên> đã mở` khi `daMo`.
- [ ] **Bước 4 — `hinh-dang.mjs`:** `KHOA_CAU_HINH` thêm `nguon_hang` (danh sách chuỗi), `KHOA_DAY` thêm `nghi` (boolean). Chạy 84 ca lõi + DP1 + DP2 Task 1 → xanh. Commit `dieu-phoi: mở đợt từ gói, vai, pha (DP2 AC-2..4)`.

### Task 2: Bộ phát lịch theo pha; sự kiện gộp và chờ người

**Phục vụ:** E5, E13 (bên viết) · **independent:** false

**Files:** Modify `dieu-phoi/scripts/phat-lich.mjs`; Test `tests/dieu-phoi/mo-dot.test.mjs`.

- [ ] **Bước 1 — ca đỏ:** DP2-05 cap-theo-pha (4 pha × đơn merge + s4, mỗi pha một thư mục đợt dựng bằng `moDot` từ gói rồi `datPha`), DP2-05 dot-cu (fixture `dot-crm-0910` của DP1, dựng như `dungDotCu` của dong-goi.test — chép lại hàm, không import tệp test kia), DP2-05-do bo-pha.
- [ ] **Bước 2:** trong `motNhip`: `const pha = docPha(thuMuc).pha`; `capPhat` nhận `choPhep(taiNguyen)`: `dang-chay` → mọi; `dang-dong` → chỉ `merge`; còn lại → không. `tt.pha = pha`.
- [ ] **Bước 3 — sự kiện cho `dem`:** `capNhatHangKe` so `tienDo` với `tt` cũ (`trang-thai.json.gop_da_bao`): hàng mới sang `gop` → `ghiSuKien({loai:'hang-gop', hang, phien})` một lần, lưu vào `gop_da_bao`. `cho-nguoi/*.json` mới (khoá `phien|luc` chưa có trong `tt.cho_nguoi_da_bao`) → `ghiSuKien({loai:'cho-nguoi', phien, hang})` một lần.
- [ ] **Bước 4:** chạy lõi + DP1 + DP2 → xanh. Commit `dieu-phoi: bộ phát lịch theo pha; sự kiện hang-gop, cho-nguoi (DP2 AC-5)`.

### Task 3: Chẩn đoán

**Phục vụ:** E6, E3 (mục goi-dot) · **independent:** false

**Files:** Create `dieu-phoi/scripts/chan-doan.mjs`; Modify `dieu-phoi.mjs` (CLI `chan-doan [--json]`).

**Interfaces — Produces:** `chanDoan(cwd) → [{muc, trang_thai, viec}]` với `muc` ∈ `co-dot, pha, phat-lich, goi-dot, hang-viec, vai` (đủ cả khi không đợt: các mục sau `co-dot` mang `khong-ap`).

- [ ] **Bước 1 — ca đỏ:** DP2-06 khung, khong-dot (băm cây trước/sau), DP2-06-do hang-viec-hong; DP2-03 dùng `chanDoan` cho mục `goi-dot`.
- [ ] **Bước 2:** cài: `co-dot` (symlink); `pha` (`du` khi `dang-chay`/`tam-dung`, `thieu` khi `nhap` với việc «duyệt thẻ khởi tạo rồi `pha dang-chay`»); `phat-lich` (pid sống); `goi-dot` (`nguon_goi` null → `thieu`, việc «khai `dieu_phoi.goi_dot` trong `_acceptance/config.yaml` hoặc gọi với `--goi`»); `hang-viec` (`kiemHangViec`, lỗi → `thieu` + thông điệp); `vai` (có giám sát). Không ghi tệp.
- [ ] **Bước 3:** xanh → commit `dieu-phoi: chẩn đoán đợt (DP2 AC-6)`.

### Task 4: Đổi kế hoạch trong đợt

**Phục vụ:** E7 · **independent:** false

**Files:** Create `dieu-phoi/scripts/hang.mjs`; Modify `dieu-phoi.mjs` (CLI `hang …`), `dieu-phoi/scripts/lich.mjs` (`chonHangKe` bỏ qua dãy `nghi`).

**Interfaces — Produces:** `dayLen(thuMuc, ma, truocMa)` (gán `uu_tien` của `ma` = `uu_tien(truocMa) - 1`; đã đứng trước → no-op); `themHang(thuMuc, {ma|viec, day})` (đã có cùng `ma`/`slug` ở dãy đó → no-op); `choNghi(thuMuc, day)` (đã nghỉ → no-op); mỗi lần đổi thật: `ghiNhatKy(thuMuc, dong)` (chèn một dòng `- <ISO> <câu>` dưới `## Nhật ký` của `LUAT.md`) + `ghiSuKien({loai:'doi-ke-hoach', …})`. `pha` CLI cũng ghi Nhật ký khi đổi thật.

- [ ] **Bước 1 — ca đỏ:** DP2-07 doi-ke-hoach, ap-nhip-ke, chay-lai, DP2-07-do ma-la.
- [ ] **Bước 2:** cài. `lich.chonHangKe`: dãy có `nghi: true` → `{hang:null, cho:'nghi'}`.
- [ ] **Bước 3:** lõi 84 ca + DP1 + DP2 xanh → commit `dieu-phoi: đổi kế hoạch trong đợt (DP2 AC-7)`.

### Task 5: Nguồn hàng từ lộ trình

**Phục vụ:** E8 · **independent:** false

**Files:** Create `dieu-phoi/scripts/nguon-hang.mjs`; Modify `dieu-phoi/scripts/goi-dot.mjs` (gọi khi cấu hình đợt có `nguon_hang`).

**Interfaces — Produces:** `suySlug(cauGiao)` (bản chép đúng luật của `scripts/lo-trinh.mjs`); `docHangLoTrinh(gocKho, nguon) → {hang:[{ma, slug}], loi:string|null}` — `nguon` là `["<tệp>:<mã>", …]` hoặc `["<tệp>@<ngày>"]`; `docNhomKeHoach(gocKho) → Map<ma, nhom_trang_thai>` dùng `docDuLieu` chép nguyên văn từ `scripts/lo-trinh.mjs` (khối có marker `DOC-DU-LIEU-CHEP`).

- [ ] **Bước 1 — ca đỏ:** DP2-08 round-trip (import `kiemKhuon`, `suySlug`, `docDuLieu` từ `scripts/lo-trinh.mjs` CỦA CÂY qua đường suy từ vị trí tệp test; dựng trang bằng `node scripts/product-map.mjs --root <kho thử>`), mo-tu-lo-trinh, theo-moc, DP2-08-do vang-tep, DP2-08-do lech-slug.
- [ ] **Bước 2:** cài. Trong `moDot` có gói: `nguon_hang` có → hàng của gói được lọc/bổ sung: mỗi `ma` của nguồn thành `{ma, slug, ...phần thi công của gói theo ma}`; lỗi đọc → giữ hàng khai tay và `process.stderr.write('mo: <lý do> — dùng hàng khai tay của gói\n')` đúng một dòng.
- [ ] **Bước 3:** xanh → commit `dieu-phoi: nguồn hàng từ lộ trình (DP2 AC-8)`.

### Task 6: Thẻ khởi tạo và thẻ đóng đợt

**Phục vụ:** E9 · **independent:** false

**Files:** Create `dieu-phoi/scripts/the.mjs`; Modify `dieu-phoi.mjs` (CLI `the khoi-tao|dong [--json]`).

**Interfaces — Produces:** `theKhoiTao(cwd) → {dot, day, hang, hoi:[…], may_di_tiep:['uu-tien','lan-v'], cho_cong_dang:[slug], canh_bao:[…]}` — `hoi` = `['quyen-tu-merge', …cho_cong_dang.map(s => 'build:'+s)]`; trạng thái quyết của một slug đọc `_acceptance/<slug>/opportunity.md` (`decision:`) và `contract.md`. `theDong(cwd) → {dot, hang_phat_sinh:[slug], lop_phu:[sự kiện doi-ke-hoach day-len]}`.

- [ ] **Bước 1 — ca đỏ:** DP2-09 khoi-tao (ma trận 5 hàng), dong, DP2-09-do, DP2-09-do thu-muc.
- [ ] **Bước 2:** cài; xanh → commit `dieu-phoi: thẻ khởi tạo, thẻ đóng đợt (DP2 AC-9)`.

### Task 7: Khoá S4 cấp máy

**Phục vụ:** E10 · **independent:** false

**Files:** Create `dieu-phoi/scripts/may.mjs`; Modify `phat-lich.mjs` (`capPhat` cho `s4`), `dieu-phoi.mjs` (`dongDot` gỡ khoá máy).

**Interfaces — Produces:** `thuMucMay()`; `giuMay(thuMuc, {kho, phien}) → {duoc:boolean, chu}` (`mkdirSync(<may>/s4)` nguyên tử; đã của chính `thuMuc` → `duoc:true`); `nhaMay(thuMuc)` (chỉ gỡ khi chủ là `thuMuc`); `thuHoiMayChet() → chu|null` (chủ có `dot` vắng, hoặc symlink `<kho>/.acceptance-runs/dieu-phoi-hien-tai` không trỏ `dot` → gỡ, trả chủ cũ).

- [ ] **Bước 1 — ca đỏ:** DP2-10 hai-kho, thu-hoi, dong-khi-giu (+ biến thể gỡ symlink, đối chứng), dung-tay-khong-cham, DP2-10-do bo-khoa-may. Mọi ca đặt `process.env.DIEU_PHOI_MAY_DIR` = thư mục tạm TRƯỚC khi import.
- [ ] **Bước 2:** `capPhat`: đợt có `nguon_goi` và tài nguyên `s4` → `thuHoiMayChet()` (có → sự kiện `thu-hoi-may`), rồi `giuMay`; không được → đơn ở lại, `tt.cho_may = chu.kho`. Mỗi nhịp: khoá local `s4` vắng mà khoá máy là của mình → `nhaMay`. `dongDot` gọi `nhaMay` trước khi gỡ symlink.
- [ ] **Bước 3:** lõi 84 ca + DP1 + DP2 xanh (ca lõi không đặt biến môi trường — đợt của chúng không có `nguon_goi`) → commit `dieu-phoi: khoá S4 cấp máy (DP2 AC-10)`.

### Task 8: Một hàm mô hình cho `xem` và bảng đợt

**Phục vụ:** E12 · **independent:** false

**Files:** Create `dieu-phoi/scripts/mo-hinh.mjs`; Modify `dieu-phoi/scripts/bang.mjs`, `dieu-phoi.mjs` (`xem`).

**Interfaces — Produces:** `moHinh(tt, {nhom}) → {dot, pha, trang_thai, nhip_cuoi, khoa:[{tai_nguyen, phien, han}], hang_cho, cho_nguoi, day:[{id, hang, tien_do, nhom_ke_hoach}], canh_bao}`; `veXem(m) → string`; `veBang(tt)` dựng từ `moHinh(tt)`.

- [ ] **Bước 1 — ca đỏ:** DP2-12 mot-ham, DP2-12-do lech. Ca DP1-04 doc-cu, DP1-05 (chuỗi `đợt <dot>`, `<tn>:<phien>`, `chờ lượt <n>`) phải còn xanh — `veXem` giữ ba chuỗi ấy.
- [ ] **Bước 2:** cài; lõi `bang.test.mjs` xanh → commit `dieu-phoi: xem và bảng đợt vẽ từ một hàm (DP2 AC-12)`.

### Task 9: Lệnh đếm đợt

**Phục vụ:** E13 · **independent:** false

**Files:** Create `dieu-phoi/scripts/dem.mjs`; Modify `dieu-phoi.mjs` (CLI `dem [--json]`).

**Interfaces — Produces:** `demDot(thuMuc) → {gop_theo_ngay:{YYYY-MM-DD:n}, goi_chu_kho:{tong, theo_hang:{slug:n}}}` từ `su-kien.jsonl` (`hang-gop`, `cho-nguoi`, `can-nguoi` có `dich:'owner'`).

- [ ] **Bước 1 — ca đỏ:** DP2-13 round-trip (hook thật + nhịp thật), DP2-13-do doi-ten.
- [ ] **Bước 2:** cài; xanh → commit `dieu-phoi: lệnh đếm đợt (DP2 AC-13)`.

### Task 10: Ba lệnh người

**Phục vụ:** E1, E1b, E1c · **independent:** false

**Files:** Create `dieu-phoi/commands/mo-dot.md`, `dong-dot.md`, `xem.md`.

- [ ] **Bước 1 — ca đỏ:** DP2-01 ba-lenh, DP2-01-do khoa-xem.
- [ ] **Bước 2:** viết ba lệnh. Frontmatter: `description`, `argument-hint` (mo-dot: `<tên> [--goi <thư mục>]`). Thân mo-dot đúng trình tự AC-1, mọi lời gọi `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" …`; khối `<!-- <<<CHU-QUYET-CUA-NGUOI -->…<!-- CHU-QUYET-CUA-NGUOI>>> -->` khai: chữ duyệt thẻ, chữ `build` cho từng hàng chờ, quyền tự merge chỉ nhận từ người gõ; máy CHÉP chữ đó vào `decided_by`/`pha --ly-do`, không tự sinh. Hàng chờ Cổng Đáng: mở ô bằng `lo-trinh.mjs --hang <tệp>:<mã> --mo-o` của acceptance-gate qua `resolve-plugin.mjs` của feature-loop. dong-dot: `the dong` → chờ duyệt → `pha dang-dong` → `dong` → dọn (xoá lịch 30′, lưu trữ phiên thợ, kiểm `git status --porcelain` trước khi dọn worktree, báo cáo đợt).
- [ ] **Bước 3:** `node tests/dieu-phoi/kiem-validate.mjs` xanh; DP2-01 xanh → commit `dieu-phoi: ba lệnh người mo-dot, dong-dot, xem (DP2 AC-1)`.

### Task 11: `start` biết đợt

**Phục vụ:** E11 · **independent:** false

**Files:** Modify `scripts/start-scan.mjs`, `scripts/lo-trinh.mjs` (`loTrinhThe` nhận `slugGiu`), `commands/start.md` (khối START-SCAN-KEYS + một dòng in).

- [ ] **Bước 1 — ca đỏ:** DP2-11 start-biet-dot, khong-dot (so sâu với start-scan của merge-base: `git archive <merge-base> scripts lib skills` vào thư mục tạm), start-md.
- [ ] **Bước 2:** `start-scan`: hàm `docDotDangChay(root)` — gốc checkout chính qua `git rev-parse --path-format=absolute --git-common-dir`, `realpath` symlink, đọc `hang-viec.json` (slug), `dieu-khien.json` (pha, vắng → `dang-chay`); lỗi đọc → null. Khoá `dotDangChay` CHỈ thêm vào đầu ra khi khác null (đầu ra không đợt byte-bằng bản cũ). `loTrinhThe({…, slugGiu})`: `hangKe.thamSo = null` khi slug của hàng kế thuộc `slugGiu`.
- [ ] **Bước 3:** start.md: thêm `dotDangChay` vào START-SCAN-KEYS; dòng «Có `dotDangChay` → in đúng một dòng `đợt <ten> đang chạy → /dieu-phoi:xem`». Chạy `ONLY_BLOCK=P99`, P98, P102–P104, P121, RT13, `tests/scripts/lo-trinh.test.mjs` → xanh. Commit `start: biết đợt đang chạy, bỏ lối mở hàng dãy đang giữ (DP2 AC-11)`.

### Task 12: Từ điển, GUIDE, QUICKSTART, bảng tên lệnh

**Phục vụ:** E14, E14b · **independent:** false

**Files:** Modify `CONTEXT.md` (bảy mục), `GUIDE.md` (§6.6), `QUICKSTART.md` (khối ngắn trong «Dùng hằng ngày»), `skills/acceptance/references/human-facing-language.md` (ba dòng COMMAND-NAMES), `tests/plugins/lenh-bam-duoc.test.mjs` (`defaultPluginNameOf` thêm `'dieu-phoi'`).

- [ ] **Bước 1 — ca đỏ:** DP2-14 tu-dien, DP2-14-do thieu-muc, DP2-14-do-lb.
- [ ] **Bước 2:** viết. Ba dòng COMMAND-NAMES: `| mo-dot | /dieu-phoi:mo-dot | command |` · `| dong-dot | /dieu-phoi:dong-dot | command |` · `| xem | /dieu-phoi:xem | command |`. GUIDE §6.6 «Chạy đợt Điều phối – Thợ (gói dieu-phoi)»: cài theo kho (chữ, không dòng lệnh cài), gói đợt, ba lệnh, lệnh nào mở, chữ quyết chỉ từ người gõ.
- [ ] **Bước 3:** `LB_CASES=LB1,LB2,LB9 node tests/plugins/lenh-bam-duoc.test.mjs`, `node tests/plugins/plugin-declare.test.mjs`, P86, P101 xanh → commit `docs: từ điển, GUIDE §6.6, QUICKSTART cho đợt Điều phối – Thợ (DP2 AC-14)`.

### Task 13: Executor, chốt DP1 nguyên vẹn, lưới cả kho

**Phục vụ:** E15 + mọi eval · **independent:** false

- [ ] Thêm `executors.test.dieu_phoi_dp2` (dòng gộp lọc `DP[12]-`, như khoá `dieu_phoi`) và `executors.test.dieu_phoi_lb` (`LB_CASES=LB1,LB2 node tests/plugins/lenh-bam-duoc.test.mjs`) — ghi tay kiểu nháy kép, kiểm bằng `resolveConfigKey` và PyYAML.
- [ ] Ca DP2-15 dp1-nguyen: `git diff --quiet <merge-base> -- tests/dieu-phoi/dong-goi.test.mjs tests/dieu-phoi/loi` thoát 0.
- [ ] Suite `tests/dieu-phoi/**` 0 fail; `tests/scripts` và `tests/plugins` trọn (nền); `hooks`, `workflows`; `product-map --check`; vẽ lại nếu lệch. Hồ sơ đã ký bị chạm (ra-co-ten nếu `signed-off` xuất hiện trong tệp mới) → theo RT13 vế 2.
- [ ] Đặt `status: implemented`, commit, vào S4.
