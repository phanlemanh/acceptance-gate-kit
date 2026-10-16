---
slug: du-bao-dong-bang-theo-ma-moc
at: 2026-10-16T02:05:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | Thiết kế và hợp đồng không nói máy dựa vào đâu để biết «hồ sơ là hồ sơ của một hàng trong chính lộ trình». Cả bảy kho thử dựng hồ sơ và du-bao.json bằng tay đúng khuôn bên đọc, không ca nào lấy dữ liệu từ bên ghi thật (--mo-o) [lo-trinh-gio-may#F2] | Bộ đọc xét thành viên theo một trường mà ca dựng tay có, còn --mo-o thật ghi liên kết ở chỗ khác — ca xanh, nhưng ở kho thật đường khớp theo mã không chạy và lúc cắt mốc --do-lech lại in «chưa đóng băng» | Ghi rõ cơ chế thành viên; thêm ca dựng hồ sơ bằng chính --mo-o rồi ghi đè ngày và đo --do-lech; AC-8 chép đủ tệp mang liên kết hàng–hồ sơ | fixed: thiết kế và Context hợp đồng ghi cơ chế (đúng phép gắn hàng ↔ hồ sơ của cột trạng thái: slug hoặc lo_trinh_ma); thêm vế DB-3-mo-o (hàng không slug, --mo-o thật ghi ô cơ hội + du-bao.json, ghi đè ngày, --do-lech); AC-8 chép cả thư mục hồ sơ. Vế --do-lech trên dữ liệu thật: deferred — mốc thật chưa khép, đó là việc của ngưỡng lúc cắt mốc |
| P1 | design | Thiết kế tự mâu thuẫn về thứ tự phân xử (tên bỏ ngày trước số mã chung, nhưng mục Giới hạn nói về mốc giữ nhiều mã nhất); dòng sổ d-…-4 ghi một-lối trong khi lối «mã trước tên» vẫn sống; không AC nào tách hạng 2 với hạng 3 | Chủ kho tách mốc X: chuyển hai trong ba hàng sang W, X giữ một hàng và giữ tên — bản dựng gắn dự báo vào X, trái điều mục Giới hạn nói; mutant đảo hạng vẫn qua mọi eval | Chọn một thứ tự, sửa thiết kế cho khớp, ghi lại dòng sổ với căn cứ ý định đã ký, thêm vế AC-6 tách hai hạng kèm chiều đỏ đảo hạng | fixed: thứ tự = tên nguyên văn > chung nhiều mã > tên bỏ ngày > đứng trước (căn cứ: câu Ý định của ô cơ hội); dòng sổ mới thay d-20261016T014840Z-4; thêm DB-6-thu-tu và chiều đỏ DB-6-do2 |
| P2 | evals | Vế trang của AC-4 chỉ là khẳng định âm, không đối chứng dương rằng dòng Y tìm thấy được và dòng X có dự báo | Hàm tìm dòng Y trả rỗng hay dòng dự báo bị tắt cả trang — vế trang vẫn xanh | Đối chứng dương trước khẳng định âm; mutant chỉ tiêm đường trang | fixed: DB-4 đòi dòng Y tìm thấy và dòng X có «dự báo lúc bắt đầu (15/10)» trước khẳng định âm. Mutant riêng đường trang: rejected — trang và --do-lech gọi cùng MỘT bộ tìm dự báo, không có đường trang riêng để tiêm |
| P2 | evals | Thiết kế hứa JSON các lệnh khác không đổi byte nhưng AC-7 chỉ so trang và --do-lech | Mảng dự báo gán thành thuộc tính liệt kê được trên lộ trình — JSON xuất cho kho tiêu thụ đổi byte mà mọi eval xanh | So từng byte mọi lệnh có đầu ra JSON với bộ máy gốc, có đối chứng dương | fixed: AC-7 so thêm --ra-soat --json, --ap --json và --xem với bộ máy gốc, đối chứng dương từng lệnh; vùng nhớ đặt BÊN TRONG đối tượng giờ máy đã không liệt kê, chiều đỏ chung DB-7-do |
| P2 | design | Dòng sổ lấy căn cứ «bộ đọc khoan dung + cờ vàng» nhưng thiết kế bỏ vế cờ vàng không lý do | Hàng dời mốc sau đóng băng, dự báo gắn mốc giữ nhiều mã nhất, trang in như mốc bình thường — chủ kho đọc như đường cơ sở của mốc hiện tại | Khai rõ «không cờ» kèm lý do loại, hoặc ghim dấu trên dòng mốc | fixed: dòng sổ descope «KHÔNG thêm cờ» (ghi đè ngày là thường lệ của mọi mốc phát hành → cờ thành nhiễu; trang còn ~2 % lề trước trần độ dài LTT-san); lý do ghi vào thiết kế §Phương án |
