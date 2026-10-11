# Hình tại điểm quyết định — Cổng Phạm vi

| Điểm | Đếm | Hình |
|---|---|---|
| d-20261011T144808Z-1 bên ghi ở scripts/, khoá `may`, bên đọc lib giữ nguyên | 4 bước nối tiếp (S4 PASS → bên ghi → sổ → bộ đọc làn V/thẻ) | `luong-dinh-tuyen.html` |
| d-20261011T144808Z-2 không định tuyến hồ sơ T3/UNCERTAIN/≠PASS | dưới ngưỡng: 1 điều kiện | — |
| d-20261011T144808Z-3 khoá mặc định tắt | dưới ngưỡng: 1 nhánh | — |
| d-20261011T144808Z-4 bỏ đặc-tả-UX | dưới ngưỡng: 0 bước | — |
| d-20261011T144808Z-5 đảo qua signoff có Ký | 2 nhánh rẽ (machine-cleared · máy-đi-trước) + 3 bước | `duong-dao.html` |

## Đề bài `luong-dinh-tuyen`
- Loại: flowchart ngang, một nhánh rẽ.
- Nút: «S4 PASS · hồ sơ verified» → «bên ghi dinh-tuyen-may (khoá kho bật?)» → rẽ «tắt → 0 byte, như hôm nay» / «bật + hồ sơ đủ điều kiện» → «mục known-limits / wont-fix → dòng sổ gate2 khoá `may` (+ gạch Notes)»; «mục new-contract → để người» → «bộ đọc làn V (lib, KHÔNG đổi)» → rẽ «mọi mục đã định tuyến → làn V, không mời ký» / «còn mục của người → mời ký Cổng 2, mục máy là dòng báo».
- AC: AC-1, AC-2, AC-4, AC-5, AC-7.

## Đề bài `duong-dao`
- Loại: flowchart dọc, hai nhánh hợp lại.
- Nút: «dòng máy: Ngoài-3 ghi Known limits» → «thẻ / dòng báo in lệnh đảo» → «người gõ `/acceptance-gate:signoff <slug> Ngoài-3: mở hợp đồng mới; Ký`» → rẽ «hồ sơ machine-cleared» / «hồ sơ máy-đi-trước (veto mở)» → cả hai «đường ký thường bước 3–7» → «dòng người MỚI sau dòng máy — người thắng» → «thẻ: Ngoài-3 người định tuyến; status signed-off».
- AC: AC-7, AC-9.
