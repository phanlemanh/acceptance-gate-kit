# Thước sức khoẻ đo chỗ trống và tốc độ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (T2 feature-loop, tuần tự trong phiên chính). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bộ phát lịch giảm tải chỉ theo áp lực bộ nhớ, cấp lượt nặng theo chỗ trống so với nhu cầu đã hiệu chuẩn, gắn nhãn lượt chạy dưới tải, và ghi một sổ đo cấp máy cho mỗi lượt.

**Architecture:** Hàm thuần đọc số đo và đánh giá nằm ở `suc-khoe.mjs`; sổ đo cấp máy, theo dõi lượt đang chạy và nhu cầu p95 nằm ở mô-đun mới `do-lan.mjs`; `phat-lich.mjs` chỉ nối dây trong `motNhip`/`capPhat`/`xuLyKhoa`. Mỗi ca đo «-do» chạy chính hàm đo trên bản sao trọn `dieu-phoi/` bị tiêm.

**Tech Stack:** Node ESM, `node:test`, không phụ thuộc mới.

**Spec:** `docs/superpowers/specs/2026-10-21-suc-khoe-cho-trong-va-toc-do-design.md` · hợp đồng `_acceptance/suc-khoe-cho-trong-va-toc-do/contract.md` · `evals.yaml`.

## Global Constraints

- Không chú thích trong `dieu-phoi/scripts/*.mjs` ngoài nếp đầu mô-đun đang có; không chuỗi riêng kho tiêu thụ (DP1-07: `onehub`, `crm`, `prisma`, `bunx`, `bun run`, `:3000`, `5432`…).
- Hằng mặc định sống trong `cau-hinh.mjs`: `SUC_KHOE_MAC_DINH = { he_so_cho: 1.5, duoi_tai_phut: 2, mau_hieu_chuan: 5 }`.
- Chuỗi người đọc ghim nguyên văn: `áp lực bộ nhớ mức <N>` · `thiếu chỗ: cần <a.toFixed(1)> GB, trống <b.toFixed(1)> GB` · `swapin <x.toFixed(1)> MB/phút` · thông điệp cấu hình ở AC-10.
- Đọc-cũ: `swap_gb`, `rss_gb` tuỳ chọn; `canNguoi` luôn `null` nhưng khoá vẫn có trong kết quả.
- Đường dẫn trong test suy từ `import.meta.url`; thư mục máy qua `DIEU_PHOI_MAY_DIR`.
- TDD: commit test đỏ TRƯỚC commit mã (chiều đỏ nằm trong lịch sử).

## Review Focus

1. Lệnh nhả xoá thư mục khoá cùng lúc nhịp đang cập nhật → mọi ghi của nhịp nằm ở `do-dang-chay/`, không ghi vào `khoa/<tn>/` (SK-07 hàng nhả giữa hai nhịp).
2. Đợt nâng gói khi đang giữ khoá (không có `do-dang-chay`) → khép không lỗi, không dòng sổ (SK-07 hàng cuối).
3. Mẫu `vm_stat` nhịp trước vắng hoặc bộ đếm tụt (khởi động lại máy) → tốc độ `null`, không âm (SK-05 thêm assert).
4. Số đo hỏng → `null` và đi về phía hiện trạng (SK-09 hàng nhịp chỗ trống null).
5. Sổ đo máy có dòng hỏng hay của kho khác → bỏ qua dòng hỏng, lọc theo kho (SK-08 hàng kho khác + một dòng rác).

---

### Task 1: Đọc số đo + cấu hình

**Files:**
- Create: `tests/dieu-phoi/fixtures/suc-khoe/mbp-2110.txt` (đầu ra nguyên văn bốn lệnh, chụp 21/10)
- Modify: `dieu-phoi/scripts/suc-khoe.mjs`, `dieu-phoi/scripts/hinh-dang.mjs:50-72`, `dieu-phoi/scripts/cau-hinh.mjs`, `dieu-phoi/scripts/mau/dieu-phoi.config.json`
- Test: `tests/dieu-phoi/loi/suc-khoe.test.mjs` (viết lại), `tests/dieu-phoi/loi/hinh-dang.test.mjs` (ma trận 16 → bỏ hai hàng swap_gb/rss_gb, còn 14)

**Interfaces — Produces:**
- `docMucTrong(text): number|null` (0–100, ngoài khoảng → null) · `docRamGb(text): number|null` · `docVmStat(text): {coTrang: number|null, swapins: number|null}` · `tocDoSwapinMbPhut(truoc, sau): number|null` với `{luc, swapins, coTrang}`, Δ âm hay thiếu → null.
- `nguongSucKhoe(cfg): {ap_luc_muc, he_so_cho, duoi_tai_phut, mau_hieu_chuan, dinh_lan_gb, swapin_mb_phut}`.

- [ ] Step 1: viết ca `SK-09 doc-van-ban-that` (sáu hàng hỏng, in ra), `SK-05 toc-do-vm-stat` (fixture + bản Swapins +6400, 60 giây → 100), `SK-10 cau-hinh` (ma trận viết sẵn: 3 đời trước + thiếu ap_luc_muc + 6 khoá mới sai + mẫu; regex neo đầu-cuối) và `SK-10-do bat-buoc-swap` — chạy, thấy đỏ vì hàm chưa có.
- [ ] Step 2: commit test đỏ.
- [ ] Step 3: hiện thực các hàm đọc + `nguongSucKhoe` + kiểm cấu hình mới; mẫu chỉ còn `ap_luc_muc: 2`.
- [ ] Step 4: `node --test tests/dieu-phoi/loi/suc-khoe.test.mjs tests/dieu-phoi/loi/hinh-dang.test.mjs` xanh; commit.

### Task 2: Đánh giá + cấp làn theo chỗ (AC-1–AC-4)

**Files:** Modify `dieu-phoi/scripts/suc-khoe.mjs`, `dieu-phoi/scripts/phat-lich.mjs` (`motNhip`, `capPhat`), `dieu-phoi/scripts/mo-hinh.mjs`, `dieu-phoi/scripts/bang.mjs` · Create `dieu-phoi/scripts/do-lan.mjs` (chỉ `LOAI_NANG`, `nhuCau` bản nguồn cấu hình) · Test `tests/dieu-phoi/loi/suc-khoe-nhip.test.mjs`.

**Interfaces — Produces:**
- `danhGiaSucKhoe({swap, apLuc, load, rssLonNhat, mucTrong, ramGb, tocDo}, cfg) → {giamTai, lyDo, canNguoi: null, load, choTrongGb, apLuc, tocDoSwapinMbPhut, ghi: {swap: string|null, rss_lon_nhat: {lenh, gb}|null}}`.
- `vuaLan(loai, sk, nhuCau, cfg) → {duoc: boolean, ly_do: string|null}` — `merge` hay `nhuCau.gb == null` hay `sk.choTrongGb == null` → vừa.
- `hang_cho[]` thêm `cho` (chuỗi «thiếu chỗ…» hoặc null); `trang-thai.json` thêm `chua_hieu_chuan`, `thieu_cho_da_bao`, `mau_swapin`.
- `moHinh().hang_cho[].cho`; `veXem` in một dòng `  <phiên> <loại> chờ: <cho>` mỗi đơn có `cho`; bảng thêm cột «Chờ».

- [ ] Step 1: hàm đo `doNhip(goi, kichBan)` dựng thư mục đợt tạm + `io` giả từ số kịch bản, import `phat-lich.mjs` TỪ `goi`; ca SK-01, SK-02 (ba hàng), SK-03 (ba hàng + bang/xem), SK-04 và bốn ca «-do» tương ứng (tiêm: dòng swap 8 GB; bỏ điều kiện áp lực; `vuaLan` luôn vừa; nhánh canNguoi theo `rss_gb` 8). Chạy → đỏ. Commit test đỏ.
- [ ] Step 2: hiện thực; gỡ sự kiện `can-nguoi` ở `motNhip`; `thieu-cho` ghi một lần mỗi «phiên-loại» cho tới khi đơn được cấp hay biến mất.
- [ ] Step 3: `node --test tests/dieu-phoi/loi/` xanh (sửa `phat-lich.test.mjs`/`bang.test.mjs` chỉ nơi chúng ghim hành vi cũ đã bị hợp đồng đổi); commit.

### Task 3: Theo dõi lượt, nhãn dưới tải, sổ đo, thử lại (AC-5–AC-7)

**Files:** Modify `dieu-phoi/scripts/do-lan.mjs`, `dieu-phoi/scripts/phat-lich.mjs` (`capPhat` gọi `batDauLuot`, `xuLyKhoa` đánh dấu thu hồi, `motNhip` gọi `capNhatLuot`/`khepLuot`), `dieu-phoi/scripts/ghi.mjs` (`nhaKhoa(cwd, tn, {ma, haTang})`), `dieu-phoi/scripts/dieu-phoi.mjs` (`nha --ma --ha-tang`) · Test `suc-khoe-nhip.test.mjs`.

**Interfaces — Produces (`do-lan.mjs`):**
- `LOAI_NANG = ['s4','ghim-lai','duong-nen']` · `tepSoMay(): string` (= `<thuMucMay()>/do-lan.jsonl`) · `docSo(): object[]` (bỏ dòng hỏng).
- `batDauLuot(thuMuc, tn, chu, {sk, nguon, commit, nowMs})` → ghi `do-dang-chay/<tn>.json` `{phien, slug, loai, commit, cap_luc, trong_luc_cap_gb, nguon_nhu_cau, trong_min_gb, ap_luc_max, swapin_mb_phut_max, chong:false, dong_ho_tu:null, duoi_tai:null}`.
- `capNhatLuot(thuMuc, tn, {sk, nowMs, cfg, chong})` — đồng hồ dưới tải: điều kiện đúng ở nhịp này → `dong_ho_tu ??= nowMs`; sai → `dong_ho_tu = null` (nhãn đã có thì giữ); `nowMs − dong_ho_tu ≥ duoi_tai_phut` phút → `duoi_tai = {tu: ISO(dong_ho_tu), ly_do}`.
- `ghiKetQuaNha(thuMuc, tn, {ma, haTang})`, `danhDauThuHoi(thuMuc, tn)`.
- `khepLuot(thuMuc, tn, {kho, nowMs}) → row` — nối dòng sổ, xoá tệp, trả dòng; `ha_tang = ket_thuc==='thu-hoi' || [137,143].includes(ma) || !!ha_tang_ly_do`.
- `duocThuLai(row, so) → boolean` — `true` khi trong `so` (trước dòng này) không có dòng `duoi_tai` cùng phien, slug, loai, commit.

- [ ] Step 1: ca SK-05 (năm hàng, đồng hồ giả 30″/nhịp), SK-06 (bốn lượt, worktree là kho git tạm có commit A rồi B), SK-07 (năm hàng + chồng + khoá có từ trước) và «-do»: `bo-dong-ho`, `thu-lai-mai`, `bo-commit`, `bo-ghi-so`. Đỏ → commit.
- [ ] Step 2: hiện thực; commit lấy bằng `io.chay('git', ['-C', worktree, 'rev-parse', 'HEAD'])`, lỗi → null.
- [ ] Step 3: xanh; commit.

### Task 4: Hiệu chuẩn + lệnh `hieu-chuan` + luật thợ (AC-6 lời, AC-8)

**Files:** Modify `dieu-phoi/scripts/do-lan.mjs` (`p95`, `nhuCau` đủ ba nguồn, `baoCaoHieuChuan`), `dieu-phoi/scripts/dieu-phoi.mjs` (lệnh `hieu-chuan`), `dieu-phoi/scripts/mau/LUAT.md` (mục «Lượt chạy dưới tải») · Test `suc-khoe.test.mjs` + `suc-khoe-nhip.test.mjs`.

**Interfaces — Produces:** `p95(ds: number[]): number|null` (phần tử thứ ⌈0,95·n⌉ sau khi sắp) · `nhuCau({kho, loai, cfg, so}) → {gb: number|null, nguon: 'so'|'cau-hinh'|'chua'}` (chỉ dòng sạch cùng kho, loại; ≥ `mau_hieu_chuan`) · `baoCaoHieuChuan({kho, cfg, so}) → string[]` dòng `"<loại> · <n> lượt · p95 <x> GB · nguồn <sổ|cấu hình|chưa hiệu chuẩn>"` + `"hạ tầng đốt: <phiên> <slug> · trống <x> GB · áp lực <n>"`.

- [ ] Step 1: ca SK-08 (năm hàng + một dòng rác), `SK-08 lenh-hieu-chuan` (CLI thật qua `spawnSync(process.execPath, [<goi>/scripts/dieu-phoi.mjs, 'hieu-chuan'])` trong worktree giả của đợt), `SK-08-do p95-thanh-max`. Đỏ → commit.
- [ ] Step 2: hiện thực + LUAT.md bốn điều của E6b.
- [ ] Step 3: xanh; commit.

### Task 5: Khoá executor + hồi quy toàn gói

**Files:** Modify `_acceptance/config.yaml` (thêm `executors.test.dieu_phoi_suc_khoe`, cùng khuôn gộp TAP một dòng của `dieu_phoi_tin_gd`).

- [ ] Step 1: thêm khoá; chạy nó → một dòng có mọi «ok … SK-», không «not ok».
- [ ] Step 2: `node --test "tests/dieu-phoi/**/*.test.mjs"` xanh (trừ ca chập chờn GT-07 đã biết — chạy lại riêng nếu đỏ); `node --test --test-name-pattern=DP1-07 tests/dieu-phoi/dong-goi.test.mjs` xanh.
- [ ] Step 3: vẽ lại bản đồ, commit, đặt `status: implemented`.

Không task nào `independent: true` — cả năm cùng chạm `suc-khoe.mjs`/`phat-lich.mjs`.
