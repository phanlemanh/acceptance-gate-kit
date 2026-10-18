# Road-map dễ dùng (RD1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (feature-loop S3 tuần tự, main loop). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cắt lượt theo luật 17/10 (không mốc ngoài), luật «chỉ việc phát triển» chạy ở mọi lần đọc tệp, một mô hình hiển thị
chung trong khối dữ liệu mà trang kit + `--xem` chỉ vẽ từ đó (tên = câu giao đầy đủ), rà soát mốc qua ngày chưa khép, giờ máy
xếp nối tiếp theo làn.

**Architecture:** Mọi luật nằm trong `scripts/lo-trinh.mjs` (bộ đọc chung) — `cat-luot.mjs` đã import từ đó, nên KHÔNG thêm tệp
mới vào lớp chép CI của kho tiêu thụ. Khối dữ liệu thêm năm khoá trong phiên bản 2; HTML và `--xem` đọc cùng một hàm dựng mô
hình. `gio-may.mjs` đổi `duBao` sang hàng đợi một làn mỗi lộ trình.

**Tech Stack:** Node ESM, ca đo `tests/scripts/*.test.mjs` (dòng `PASS: <id>`/`FAIL: <id> — …`), Chrome qua CDP (`lo-trinh-do-trang.mjs`).

**Spec:** `docs/superpowers/specs/2026-10-17-road-map-de-dung-design.md` · hợp đồng `_acceptance/road-map-de-dung/contract.md` · phép đo `evals.yaml`.

## Global Constraints

- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2).
- Không thêm tệp mới mà `lo-trinh.mjs` hay `product-map.mjs` import (lớp chép CI của crm không đổi).
- Khối dữ liệu giữ `phien_ban: 2`; chỉ THÊM khoá: `hang[].ten_hien_thi`, `moc[].viec_hien`, `moc[].hien`, `moc[].con_lai`, `chua_hen_moc`.
- `ten_hien_thi` = `HS.boNgoacNgoai(cau_giao)` khi có câu giao; vắng → `ten_ngan` → `ten` → mã.
- Trang tất định từng byte (`product-map --check`); mọi thứ phụ thuộc hôm nay chỉ ở `--xem` / thẻ khởi động.
- Mọi ca đỏ: bản sao trọn `scripts lib skills`, nhát tiêm khớp ĐÚNG một lần, chạy SAU khi bản lành xanh, ghim thông điệp.
- Fixture do code sinh: bản chụp crm chụp bằng lệnh `tests/scripts/chup-crm-onehub.mjs` từ git của crm (sha ghi trong tệp).
- Chữ người đọc tiếng Việt, đúng từ vựng `CONTEXT.md`; «Chờ điều kiện» (không «chân trời»).

## Review Focus

- Tệp lộ trình KHÔNG có khối `moc` → mô hình hiển thị: `chua_hen_moc` = mọi việc, không lỗi (thêm vế vào RD-11).
- Việc liệt ở mốc mà mã không có trong `hang` → không vào `viec_hien`, không ném (thêm vào RD-11).
- Mốc `ngay` sai định dạng / vắng trong hàng đợi giờ máy → đứng cuối, không NaN (thêm vào RD-10).
- Hai mốc cùng ngày → thứ tự theo tệp, ổn định giữa hai lần vẽ (RD-10, so hai lần chạy).
- Cờ chỉ-việc-phát-triển trên tệp có mã trùng → mỗi cờ một dòng gom, không nhân đôi theo mã trùng (RD-8).

---

### Task 1: Cắt lượt theo luật 17/10 (A — AC-1, AC-3, AC-4)

**Files:**
- Modify: `scripts/cat-luot.mjs` (bỏ chỗ phủ mốc ngoài, luật `ai`/`lap`/`tu_phuc_vu`, cờ `van-hanh-lap-chua-tu-phuc-vu`; thêm `moc-ngoai-da-bo`)
- Modify: `skills/cat-luot/SKILL.md` (bước 1, khối `CAT-LUOT-VAN-HANH`, `CAT-LUOT-BANG-CO`, bước 4 «Ra khỏi kho» ở mô tả PR, description frontmatter)
- Modify: `skills/acceptance/references/lo-trinh-template.json` (bỏ mốc V1), `skills/acceptance/references/pham-vi-template.md` (bỏ `C1`)
- Modify: `CONTEXT.md` (mục «Mốc ngoài» → đã bỏ, trỏ ADR 0026); Create: `docs/adr/0026-bo-moc-ngoai-viec-cua-nguoi-ra-khoi-kho.md`
- Create: `_acceptance/road-map-de-dung/mau/dau-vao-crm.md`, `mau/dap-an.json` (đáp án: `pham_vi`, `lo_trinh`, `ra_khoi_kho[]`, `moc_nhan_han[]`)
- Test: `tests/scripts/road-map-de-dung.test.mjs` (tạo — ca RD-1, RD-1-do, RD-1-do2, RD-3, RD-3-do, RD-4-dap-an, RD-4-dap-an-do); sửa ca cũ LT-163, LT-166, LT-169, LT-171 trong `tests/scripts/lo-trinh.test.mjs` theo luật mới (ghi con trỏ thay thế trong chú thích ca)

**Interfaces:**
- Produces: `CO_TEN` (không còn `van-hanh-lap-chua-tu-phuc-vu`, có `moc-ngoai-da-bo`); `export const BON_CHO_DEN` (mảng 4 câu, MỘT nguồn cho dòng lỗi của răng và cờ của Task 2).

- [ ] Viết RD-1 (ma trận 7 ca của E1), RD-3, RD-4-dap-an theo `expected` của E1/E3/E11; chạy → FAIL.
- [ ] Sửa `kiemPhu`/`kiemCo`; SKILL + khuôn + CONTEXT + ADR; tạo `mau/` (đáp án viết trước, từ việc thật crm `onehub`).
- [ ] Ba ca xanh; hai ca đỏ RD-1-do/RD-1-do2/RD-3-do/RD-4-dap-an-do đỏ đúng thông điệp ghim; `node tests/scripts/lo-trinh.test.mjs` xanh sau khi sửa ca cũ.
- [ ] Commit.

### Task 2: Luật chỉ-việc-phát-triển trong bộ đọc chung (C — AC-8)

**Files:**
- Modify: `scripts/lo-trinh.mjs` — `export function luatChiPhatTrien(data): string[]` (câu cờ gom, toàn tệp); gọi trong `phanTichKho` → nối vào `kq.co`; `CO_DICH` thêm năm mẫu; `xemBanDo` in mỗi câu của `kq.co` thuộc năm cờ thành `  ! <chữ đã dịch>`
- Modify: `scripts/cat-luot.mjs` — `kiemCo` dùng chung bộ khớp `dung_tren` → mốc và luật `du_lieu` từ `lo-trinh.mjs` (một nguồn)
- Create: `tests/scripts/chup-crm-onehub.mjs` + fixture `tests/scripts/fixtures/lo-trinh/crm-onehub-1017/{okr,kho-tai-lieu,viec-du-an,okr-55811c635p}.json` (+ `nguon.json` ghi sha)
- Test: RD-8, RD-8-im, RD-8-crm, RD-8-do

**Interfaces:**
- Consumes: `BON_CHO_DEN` (Task 1).
- Produces: năm tên cờ `moc-ngoai-da-bo`, `moc-chua-khai-loai`, `dung-tren-moc`, `du-lieu-sai-gia-tri`, `thieu-hang-sinh-gia`; mỗi cờ tối đa một dòng/lộ trình, liệt ≤ 8 tên rồi «…».

- [ ] Viết bốn ca theo E8; chạy → FAIL. Chụp fixture bằng lệnh (crm b74ec7eae + 55811c635^).
- [ ] Cài `luatChiPhatTrien` + dịch + in ở `--xem`; chữ ba mặt BẰNG nhau (trang «Cần sửa», `--xem`, thẻ khởi động).
- [ ] Xanh; RD-8-do đỏ đúng «luật chỉ việc phát triển không chạy khi đọc tệp». Commit.

### Task 3: Mô hình hiển thị chung + khối Mốc tên trước mã (B — AC-5, AC-6, AC-7, AC-11)

**Files:**
- Modify: `scripts/lo-trinh.mjs` — `export function moHinhHienThi(kq, nhom): { hang: Map<ma, ten_hien_thi>, moc: [{ i, hien, viec_hien, con_lai }], chua_hen_moc }`; `duLieuTrang` ghi năm khoá; `KHUON_DU_LIEU` thêm khoá; `docDuLieu` đọc-cũ (khoá vắng → rỗng/`null` + cờ «khối chưa mang mô hình hiển thị»); `mucLoTrinh` vẽ khối Mốc + nhóm «chưa hẹn mốc» TỪ mô hình (bản mẫu design-pass, lối câu giao); dòng gom «<k> việc chưa có tên ngắn — tên phiên đang rút gọn câu giao: …» trong «Cần sửa»; `xemBanDo` thêm khối «Mốc:» đọc cùng `moHinhHienThi`
- Modify: `skills/acceptance/references/lo-trinh-du-lieu.md` (bảng khoá + dòng đọc khoan dung mới)
- Modify: `tests/scripts/xem-trang-lo-trinh.test.mjs` (LTT-ten, LTT-ten-do; LTT-san giữ xanh)
- Create: `_acceptance/road-map-de-dung/mau/{trang-moi.txt,cau-hoi-trang.md,dap-an-trang.json}` do lệnh `node tests/scripts/road-map-de-dung.test.mjs --xuat-mau` sinh
- Test: RD-5 (+kho-thu, cu-do, ten-ngan, ten-ngan-im, do), RD-7-tuoi (+do), RD-11 (+ba-mat, crm, doc-cu, do, do2)

**Interfaces:**
- Consumes: `kq.co` có cờ Task 2.
- Produces: bộ đọc chữ nhìn thấy `chuNhinThayMoc(html): [{ ten, ngay, con, tong, viec: [{ ten, tt, ma }] }]` (trong tệp ca) dùng chung RD-5/RD-7/RD-11.

- [ ] Viết ca RD-5, RD-11, RD-7-tuoi, LTT-ten theo E5/E6/E12/E13; chạy → FAIL.
- [ ] Nạp skill `ux-ui-craft`; cài mô hình + vẽ; xuất `mau/`.
- [ ] Xanh; các ca đỏ đúng thông điệp; LTT-san ≤ 1/3 trang 2.21.0. Commit.

### Task 4: Rà soát mốc đã qua ngày chưa khép (C hạt giống — AC-9)

**Files:** Modify `scripts/lo-trinh.mjs` (`raSoat` thêm luật `moc-chua-khep` gom một dòng/lộ trình vào `canh_bao`; `LUAT_RA_SOAT` thêm tên); Test RD-9, RD-9-trang, RD-9-crm, RD-9-do (36 ô viết sẵn).

- [ ] Ca → FAIL; cài; xanh + đỏ đúng «mốc đã khép vẫn bị báo»; commit.

### Task 5: Giờ máy nối tiếp theo làn + cân mọi kho (D — AC-10)

**Files:** Modify `scripts/gio-may.mjs` (`duBao`: mốc sắp theo `ngay` hợp lệ rồi thứ tự tệp; `batDau(k) = max(today, hoanTatGio(k−1), ràng buộc dung_tren)`; `dongMoc` thêm « (máy chạy 24/24 — chưa đo nhịp ngày)»); `scripts/lo-trinh.mjs` (`dongGioMayXem` một dòng «mỗi lộ trình một làn, tính riêng» khi kho nhiều lộ trình); sửa ca cũ `tests/scripts/lo-trinh-gio-may.test.mjs` bị thay (con trỏ). Test RD-10 (+mot-moc, hai-lo-trinh, do, kho).

- [ ] Ca → FAIL; cài; RD-10-kho so bộ máy v2.32.0 trên năm kho với tập khác biệt kỳ vọng; xanh; commit.

### Task 6: Nối dây + bản đồ + trạng thái

**Files:** `_acceptance/config.yaml` (khoá `executors.test.road_map_de_dung: node tests/scripts/road-map-de-dung.test.mjs`); vẽ lại `PRODUCT-MAP.md` + `LO-TRINH.html`; chạy trọn `bash tests/scripts/run-tests.sh` và ba vùng plugins; contract `status: implemented`.

- [ ] Suite xanh (sửa ca cũ vỡ theo luật mới, ghi con trỏ thay thế); commit; vào S4 sau khi gộp `main` có VA2.
