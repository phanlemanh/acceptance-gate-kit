---
slug: nguon-di-cung-luot-cat
at: 2026-10-23T23:40:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ «bỏ đường-đo» ghi một-lối với lối chết vòng tròn; bỏ căn cứ Cổng Giá trị là việc người | Sau phát hành không ai đo ô mở từ hàng có mang dòng Nguồn không, lỗi lặng có thể quay lại | Ngưỡng có ngày đọc, lệnh đếm | fixed: dòng sổ mới thay dòng 10 — giữ đường đo; thêm mục Đường đo và AC-10 (lệnh đếm của bộ đọc) |
| P0 | design | Dòng sổ «trỏ theo mã» ghi một-lối mà lối trỏ theo tiêu đề markdown còn sống | Đợt có tài liệu lớn bắt mỗi hàng nạp trọn — token nhân theo số hàng | Cỡ tệp nguồn lớn nhất nhân số hàng | fixed: dòng sổ mới thay dòng 5, nguồn chỉ-người (Hỏi trên thẻ), khuyến nghị theo mã, trỏ theo tiêu đề để hạt giống |
| P1 | contract | nguon.chan chỉ đo trong JSON và chữ SKILL, không đo quan hệ «chặn thì không mời duyệt» | Thẻ ghi chan mà dòng duyệt vẫn điền sẵn, hồ sơ chưa nạp vẫn được mời | Ca chạy thẻ thật, mutant bỏ chan khỏi điều kiện chặn | fixed: AC-6 ghim dòng duyệt để «___» và dòng CHƯA vào được khi chan, mutant (b) ở E6 |
| P1 | contract | Ba đầu ra biên của AC-5 không qua bộ đọc thẻ; chữ đời trước có backtick bị đọc thành tệp | Thẻ chặn mãi vì đòi băm một «tệp» không có | Ba hàng thêm vào ma trận AC-6 từ ô do bên ghi thật sinh | fixed: AC-6 bảy hàng, hàng 5 ghim tep chỉ gồm bản phạm vi khi chữ đời trước có backtick |
| P2 | contract | Design hứa khoá nguon vắng, AC-7 cho khoá co_dong false và bỏ khoá trước khi so | Bên đọc hạ nguồn so JSON chặt thấy khoá lạ trên mọi kho | So từng byte toàn JSON | fixed: AC-7 và E7 so từng byte toàn JSON, không khoá nguon khi không có dòng Nguồn |
