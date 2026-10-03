# Kế hoạch — trang-lo-trinh-doc-mot-phut

Hợp đồng: `_acceptance/trang-lo-trinh-doc-mot-phut/contract.md` (12 AC, Cổng Phạm vi làn V).
Thiết kế: `docs/superpowers/specs/2026-10-03-trang-lo-trinh-doc-mot-phut-design.md`.
Bản mẫu S1-D: bộ vẽ thử trên lớp phân tích thật, 30/30 ô đo xanh.

Thứ tự TDD: commit ca đo (đỏ) trước commit vật.

1. **Công cụ đo Chrome** — `tests/scripts/lo-trinh-do-trang.mjs`: mở Chrome không giao diện qua
   CDP, ngày đóng băng, ma trận khổ × màu, `--khong-script`, `--chup <thư mục>` và `--ghi-anh
   <json>` (băm HTML nguồn + băm từng PNG). Hàm đo trong trang nằm trong cùng tệp. Đường Chrome:
   `CHROME_BIN` hoặc đường chuẩn mac/ubuntu; không có thì exit 3 nêu tên.
2. **Ca đo đỏ** — `tests/scripts/lo-trinh.test.mjs` thêm LT-90…LT-100 (+ `-do`), sửa LT-05,
   LT-05-the, LT-11, LT-73 khong-truong, LT-77 mot-tep-byte, LT-78 và LT-06 sang trang mới (lớp
   phân tích so bằng `phanTichKho` với bộ máy gốc thay cho so HTML); `tests/scripts/xem-trang-lo-trinh.test.mjs`
   mới: LTT-san, LTT-san-do, LTT-san-im, LTT-moc, LTT-moc-khong-script, LTT-hanh-vi, LTT-hanh-vi-do.
   Năm trạng thái dựng từ fixture crm-okr + crm-kho-tai-lieu với hồ sơ sinh từ `_nguon.ho_so`.
3. **Bộ vẽ** — `scripts/lo-trinh.mjs`: thay `CSS`/`khung`/`renderTrang`/`renderNhieu`/`renderLoi`
   bằng bộ vẽ mới (thẻ · chỗ lệch · bảng mở/đã giao · dải mốc · ngoài kế hoạch một lần); xuất
   `CO_DICH` (bảng dịch, một dòng mỗi dạng cờ) và `dichCo`. `veTrang` giữ chữ ký; lớp phân tích,
   thẻ start, `--hang`, `--mo-o` không đổi.
4. **Trang mẫu hội đồng** — `tests/scripts/lo-trinh-mau.mjs` sinh thêm
   `_acceptance/trang-lo-trinh-doc-mot-phut/mau/hai-lo-trinh.html` (+ `--check`), chụp hai ảnh
   bằng công cụ bước 1 và ghi `mau/anh.json`; vẽ lại trang mẫu cũ của `viec-ke-theo-plan`.
5. **Xanh toàn bộ** — suite scripts · plugins · hooks · workflows, `product-map --check`; ghim lại
   `viec-ke-theo-plan` và `lo-trinh-tren-du-lieu-that` bằng làn ghim lại (một lượt, hai chữ ký).
6. **S4** rồi Cổng Bằng chứng.
