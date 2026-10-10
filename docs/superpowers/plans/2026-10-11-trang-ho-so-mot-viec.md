# Kế hoạch — trang-ho-so-mot-viec (X2)

Hồ sơ `_acceptance/trang-ho-so-mot-viec/` · T2 · design `docs/superpowers/specs/2026-10-11-trang-ho-so-mot-viec-design.md`.
Ca đo mới: `tests/scripts/lo-trinh.test.mjs` LT-150…LT-160 (executor `executors.test.lo_trinh`).
Mỗi phép đo mới đi kèm cặp hai chiều trên cùng kho thử (bản lành xanh → bản sao bị tiêm đỏ, thông
điệp ghim). Bốn task phụ thuộc nối tiếp (cùng tệp test, mô-đun chung) — `independent: false` cả bốn,
chạy tuần tự trong phiên chính.

| # | Task | Tệp | Verify per-task | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Mô-đun đọc hồ sơ: `boNgoacNgoai`, luật người/máy, `tomTatHoSo(dir,{trangThai})` → `{dai, chiTiet, thieu}`; bộ dựng kho thử (hồ sơ «đủ» qua `--mo-o` thật, sổ hình dạng LT1, usage-report ba khối) | `scripts/ho-so-tom-tat.cjs` (mới), `tests/scripts/lo-trinh.test.mjs` | `node tests/scripts/lo-trinh.test.mjs` — LT-159 ham (+do), LT-152 lt1, LT-153 lt1 xanh; phá-thử luật seal → đỏ ghim id | E3, E4, E10 | false |
| 2 | Trang hồ sơ: `evidence-page.js` gọi mô-đun (+ `classify` của bản đồ qua `import()`), dải chín ô + dòng chủ kho, sáu mục gập, dòng thời gian lọc được, tài nguyên, giao (PR qua git, lỗi git → «chưa gộp»), giá trị; phần bằng chứng cũ giữ nguyên thành một mục; tiêu đề bỏ «» | `scripts/evidence-page.js`, test | LT-150…LT-155 xanh (+ chiều đỏ); `node scripts/evidence-page.js` trên 126 hồ sơ kit 0 lỗi | E1, E2, E3, E4, E5, E6 | false |
| 3 | Khối bản 2: `PHIEN_BAN_DU_LIEU = 2`, khoá `tom_tat` (gọi mô-đun, `trang_thai` = chữ hàng), `docDuLieu` đọc bản 1 + cảnh báo «khuôn bản 1»; bỏ «» ở ô câu giao, «làm tiếp», `hang.cau_giao`, `hang_ke.cau_giao`, `feature` của `--mo-o`; chuẩn hoá ca LT-112 của X1 (bên cũ cũng qua phép bỏ ngoặc) | `scripts/lo-trinh.mjs`, test | LT-156, LT-157, LT-159 cho-in xanh; LT-110…LT-120 của X1 vẫn xanh | E7, E8, E10 | false |
| 4 | Tài liệu bản 2 + khuôn mẫu hàng không «» + GUIDE/CHANGELOG một dòng; vẽ lại `LO-TRINH.html`/`PRODUCT-MAP.md` | `skills/acceptance/references/lo-trinh-du-lieu.md`, `skills/acceptance/references/lo-trinh-template.json`, `GUIDE.md`, `CHANGELOG.md`, test | LT-158, LT-160 xanh (+ đỏ); `node scripts/product-map.mjs --root . --check` thoát 0 | E9, E11 | false |

Sau task 4: chạy trọn `node tests/scripts/lo-trinh.test.mjs` + `bash tests/scripts/run-tests.sh --manh mjs:1/3`
(qua khoá máy) rồi đặt `implemented` và dispatch S4.

Không đụng: `dieu-phoi/`, `skills/cat-luot/`, `scripts/cat-luot.mjs` (S3 đang sửa), `lib/**`.
