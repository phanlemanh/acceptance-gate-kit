---
slug: lo-trinh-tren-du-lieu-that
at: 2026-10-03T02:12:51Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Thứ tự ưu tiên AC-2 và AC-4 cho ca hàng «1» (slug vắng hồ sơ, tự khai đã giao, hồ sơ khác nhận mã); hàng có slug mà nhiều hồ sơ nhận chưa định nghĩa; `--mo-o` và bộ vẽ có thể nói khác nhau | crm sửa đúng đường bằng `lo_trinh_ma` mà hàng ra hai cờ hoặc vẫn «Không suy được» | ca gộp so đẳng thức trạng thái và mảng cờ; `--mo-o` cùng kho trả hoSo C | fixed: design §2 thêm thứ tự ưu tiên (hồ sơ nhận qua mã thắng lời khai, một cờ); AC-2 thêm điều kiện không hồ sơ nào nhận; AC-4 tách S-co và S-vang, thêm ca gộp và ca `--mo-o`; hai bên đọc chung một hàm |
| P1 | evals | E7 chỉ chạy nhánh vui của S0; thoát 3, hoSo, không slug chưa chạy; «dừng ở Cổng Đáng» đo bằng chữ | mã ở hai lộ trình rơi về nhánh mô tả và bỏ Cổng Đáng; hàng không slug thoát 2 ở lối chính | ma trận năm ca chạy nguyên văn khối S0, mutant gộp thoát 3 | fixed: CLI tự suy slug từ câu giao; bảng mã thoát thành khối marker S0-MO-O-THOAT do test parse; LT-76 thành năm ca có tên + bang-thoat + LT-76-do |
| P1 | evals | `_nguon.co_that` do máy viết nên E3 so vật với thước cùng một tay; E12 đọc bản chép tay; vế owner xác nhận cờ không có đường đo; bộ chuyển chưa commit | co_that chép từ đầu ra mã mới mà E3 vẫn xanh; chữ ký «0 cờ nhiễu» không ai xác nhận | neo vào số ghi ở opportunity.md trước khi có mã; E12 đọc trang máy sinh; vế owner thành dòng Đường đo | fixed: AC-3/E3 so thành phần theo loại với số của opportunity.md (4·1·2 ở 9c, D·1 ở «1», tổng 8); E12 đọc do-crm-onehub.html chép nguyên từ bộ vẽ; vế owner xác nhận thành dòng Đường đo ở phiên nghiệm thu; bộ chuyển chưa commit ghi thành giới hạn mang sang ở Notes |
| P2 | evals | So byte «bản trước vòng» không có chiều đỏ; không assert bên cũ chạy từ thư mục giải nén | bên cũ thật ra gọi bộ vẽ của cây đang kiểm nên luôn bằng | mutant tiêm một byte, assert đường bên cũ | fixed: thêm LT-77-do, LT-80-do, LT-73-khong-truong-do và assert tiền tố đường bên cũ |
| P2 | evals | Trục hồ sơ của E1 là ô HO_SO dựng được, tự quy chiếu; thiếu trục tu_vung | xep-lai xếp nhầm vào chưa làm mà E1 vẫn xanh | trục hồ sơ == khoá SECTIONS + danh sách loại trừ; trục tu_vung; mutant xep-lai | fixed: E1 đổi trục, thêm tu_vung và LT-70-do2 |
