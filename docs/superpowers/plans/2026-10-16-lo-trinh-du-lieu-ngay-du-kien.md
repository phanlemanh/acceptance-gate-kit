# Kế hoạch thi công — lo-trinh-du-lieu-ngay-du-kien (RM6c)

Design: `docs/superpowers/specs/2026-10-16-lo-trinh-du-lieu-ngay-du-kien-design.md` · hợp đồng đã duyệt 16/10 (giữ phiên
bản khuôn 2, CỘNG bốn khoá đã phê). Hạng T2 — đi thẳng S3, tuần tự (mọi task chạm cùng `scripts/lo-trinh.mjs`).

| Thay đổi người dùng thấy | Chỗ chạm | Tiêu chí phục vụ |
|---|---|---|
| Có ca đo đỏ trước cho mọi lời hứa của vòng | `tests/scripts/lo-trinh-du-lieu-ngay.test.mjs` | AC-1…AC-8 (E1…E8) |
| Dữ liệu trang mang giờ máy từng việc, đúng chữ trang | `scripts/lo-trinh.mjs` (`duLieuTrang`, `KHUON_DU_LIEU`) | AC-1, AC-2 (giờ máy việc, cờ chưa đủ đo) |
| Dữ liệu trang mang giờ máy, ngày dự kiến, cờ quá tải từng mốc | `scripts/lo-trinh.mjs` (tách `gioMayMoc`) | AC-3, AC-4, AC-5 (mốc, tất định) |
| Bộ đọc mẫu đọc được trang đời trước kèm một cờ, bộ đọc cũ không vỡ | `scripts/lo-trinh.mjs` (`docDuLieu`) | AC-6, AC-7 (đọc-cũ hai chiều) |
| Kỹ sư kho tiêu thụ đọc tài liệu là đủ | `skills/acceptance/references/lo-trinh-du-lieu.md` | AC-8 (tài liệu khớp mã) |

## Task 1 — ca đo trước (independent: false)

Tệp ca mới, mẫu theo `tests/scripts/lo-trinh-gio-may.test.mjs`. Verify: `node tests/scripts/lo-trinh-du-lieu-ngay.test.mjs`
trên cây CHƯA sửa mã → đỏ ở ND-1…ND-8 (chiều đỏ của lời hứa có trong lịch sử). Phục vụ E1–E8.

## Task 2 — khối mang giờ máy (independent: false)

`gioMayChu(u)` (chữ thô, `gioMayO` = `esc(gioMayChu)`), `gioMayHangDuLieu(u)`; `mocGioMay(kq, m)` trả `{ tg, chu, duKien,
quaTai }` dùng chung cho dòng mốc của trang và khối — trang không đổi byte. `KHUON_DU_LIEU` thêm `hang.gio_may`,
`moc.gio_may|du_kien|qua_tai`, ba cấp con. Verify: ND-1…ND-5 xanh; `node tests/scripts/lo-trinh.test.mjs` xanh.

## Task 3 — bộ đọc mẫu (independent: false)

`docDuLieu`: bảng khoá thêm ba cấp con, `NUL` thêm bốn khoá, ô cấp con vắng → `null`, cảnh báo trang đời trước khi có
hàng thiếu khoá `gio_may`. Verify: ND-6, ND-7, ND-8 (phần bộ đọc) xanh; LT-118 xanh.

## Task 4 — tài liệu (independent: false)

Dòng khoá vào `LO-TRINH-DU-LIEU-KHOA`, mục «Giờ máy và ngày dự kiến», dòng bảng «Đọc khoan dung». Verify: ND-8, LT-119.

## Task 5 — bộ kiểm kit qua khoá máy

`bash tests/scripts/run-tests.sh` + `bash tests/plugins/run-tests.sh` qua `chay-nang.sh`, rồi S4.
