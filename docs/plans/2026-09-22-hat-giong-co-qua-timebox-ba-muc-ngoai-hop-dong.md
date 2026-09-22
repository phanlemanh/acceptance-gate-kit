# Hạt giống — ba mục «mở hợp đồng mới» của co-qua-timebox-nhom-da-xong

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: _acceptance/co-qua-timebox-nhom-da-xong — Ngoài-1, Ngoài-4, Ngoài-5 của `review-findings.md`; owner quyết «mở hợp đồng mới» (theo đề xuất) ở Cổng Phạm vi của vòng `ho-so-khep-thoi-hoi`, 22/09.

Bảy mục ngoài hợp đồng của hồ sơ này chưa ai quyết cho tới khi vòng `ho-so-khep-thoi-hoi`
vá lỗ làn V đọc thiếu `review-findings.md`. Ba mục owner chọn «mở hợp đồng mới»; theo luật «Ô
chỉ mở khi có NEO NGOÀI» lối ấy ghi hạt giống, không tạo ô.

| Mục | Người dùng thấy gì | Mức |
|---|---|---|
| Ngoài-1 | Executor thường trực `itgk_lane_doc_khong_doi` mã hoá cấu trúc nhánh lúc viết, đã đỏ trên nhánh này và sẽ đỏ vĩnh viễn trên nhánh chính | cao |
| Ngoài-4 | Cùng eval `itgk_lane_doc_khong_doi` (răng AC-6) là ảnh chụp một PR, đỏ ngay trên HEAD; `check_lane` còn neo vào `main` cục bộ cũ | vừa |
| Ngoài-5 | Phép kiểm ngân sách 3/4/1 đo chuỗi-có-mặt trong khi lời hứa là quan hệ giá trị | cao |

Ngoài-1 và Ngoài-4 là cùng một vật. Ngưỡng mở ô: một lượt CI hoặc làn ghim lại đỏ vì
`itgk_lane_doc_khong_doi` (cho Ngoài-1/4); một lần con số ngân sách đổi mà phép kiểm vẫn xanh
(cho Ngoài-5).
