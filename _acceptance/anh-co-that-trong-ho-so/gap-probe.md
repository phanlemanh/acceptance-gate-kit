---
slug: anh-co-that-trong-ho-so
at: 2026-10-22T08:54:30Z
verdict: findings
p0: 1
p1: 3
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ không có dòng cho lựa chọn hạ ca ảnh có thật ngoài hồ sơ (thư mục lượt chấm, worktree máy chấm) xuống «KHÔNG có» thay vì «đạt kèm cờ vàng» — đổi kết luận trên mọi kho mà vật không đổi | Người ký Cổng Phạm vi không thấy đánh-đổi; sau phát hành kho tiêu thụ thấy hồ sơ đã ký đổi cờ, chủ kho phản đối ngoài thiết kế | Dòng sổ S1 cho lựa chọn này; số hồ sơ đổi kết luận từ AC-9 | fixed: dòng sổ 9 (một-lối — «đạt kèm cờ» vẫn in «xem frame ở trang bằng chứng» cho ảnh trang không hiện được, .acceptance-runs/ nằm trong .gitignore; đổi chỉ chạm dòng cờ, không chạm approvable) + đoạn «Vì sao» trong design; giá người ký thấy = số AC-9 in ở báo cáo |
| P1 | evals | KHO_DO mặc định trỏ đường máy của kho tiêu thụ riêng tư, commit vào kho công khai; nhánh thoát 2 không đỏ được trên máy chủ kho | Cùng lệnh hai màu theo máy; tên kho riêng tư trong tệp công khai | KHO_DO bắt buộc; ca thiếu KHO_DO → thoát 2 ghim chuỗi | fixed: KHO_DO bắt buộc (AC-9, E9), ca thiếu KHO_DO trong LNT10 (E10), chú thích evals bỏ tên kho |
| P1 | contract | AC-9 định nghĩa «đổi» và «dự kiến» mơ hồ; phép đếm độc lập chỉ statSync, không có chiều đỏ trong suite | Hồ sơ trộn làm hai số lệch, hoặc định nghĩa chỉnh sau khi thấy số | Ghim kết luận = ui_observed.present; kho tổng hợp ba hồ sơ trong suite | fixed: AC-9 ghim doi = cũ true → mới false, du-kien = cũ true mà không eval exit 0 nào có ảnh thật; E10 (LNT10) kho tổng hợp đủ/trộn/hết ảnh + mutant du-kien đếm cả hồ sơ trộn |
| P1 | contract | Ma trận thiếu hàng nháy bao, ~/… và C:\… | Kho lành ghi screenshot có nháy bị hạ «KHÔNG có»; C:\ trên macOS in sai lý do | Thêm 2 hàng đạt + 2 hàng thiếu, cập nhật số hàng | fixed: AC-1 thêm nháy kép/đơn (6 hàng), AC-2 thêm ~/ và C:\ (13/13), E5 21/21; design xét tuyệt đối bằng mẫu, không path.isAbsolute |
| P2 | evals | E5 kiểm vắng câu «downgrade sang judgment» mà không đối chứng dương | Xoá hẳn nhánh câu ấy mà E5 vẫn xanh | Hàng không khai screenshot: → trang có câu ấy | fixed: AC-5 + E5 thêm hàng đối chứng «không khai» |
