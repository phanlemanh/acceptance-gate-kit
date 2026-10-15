---
slug: lo-trinh-gio-may
at: 2026-10-15T07:52:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ bật giờ máy mặc định ở mọi kho ghi máy quyết theo nguồn mục tiêu, nhưng câu trích chỉ là dòng Gốc của ô — không quyết «mặc định» hay «bật theo lựa chọn»; luật kho 26/09 xếp bật theo lựa chọn trước đổi mặc định [dinh-tuyen-theo-ma-muc#F2] | crm nâng kit, trang vẽ lại khác byte, lưới so trang đỏ dù kho không đổi gì; Cổng Phạm vi đọc lựa chọn ấy là máy đã có căn cứ | Dòng sổ thay mang nguồn chỉ-người + ca nâng kit có đối chứng dương | fixed: dòng sổ mới thay d-…-10 thành câu hỏi chỉ-người (khuyến nghị bật mặc định, lối khác bật bằng khoá); AC-1 thêm ca nâng kit — trang cũ + bộ máy mới thì kiểm trang báo lệch đúng câu có sẵn, vẽ lại thì xanh (GM-1-nang-kit) |
| P0 | evals | Đo vòng chỉ chạy trên bản ghi phiên giả do ca dựng đúng khuôn bên đọc; không round-trip với bản ghi thật của Claude Code | Bản ghi tác tử con thật ở chỗ khác hay mã lời nhắn ở trường khác — ca giả xanh, đo thật ở S4 bỏ sót hay đếm gấp đôi mà không cờ | Ca chạy trên bản ghi thật của chính vòng, bỏ qua có tên khi máy không có bản ghi | fixed: AC-6 thêm vế bản ghi thật (GM-6-that) — nguồn có phiên chính và tác tử con, giờ và token > 0, mọi model có lời nhắn đều có token; máy không có bản ghi thì SKIP có tên, không xanh |
| P0 | design | Câu trích bảng luật không quyết hai vế máy thêm: hàng không hạng ước như T2, và hàng nhóm phat-hanh ước 1,5–2 ở cấp hàng trong khi luật dùng con số ấy cho cắt bản cấp mốc | Mốc phát hành có hàng cắt bản bị đếm cắt bản hai lần và cộng gộp cho chính hàng cắt bản — trễ 3–5 giờ máy, đúng mốc ngưỡng đọc | Tách dòng sổ theo vế + ca mốc có hàng cắt bản kèm chiều đỏ | fixed: ba dòng sổ thay d-…-3 (luật trích nguyên · hàng không hạng trích luật xếp hạng của SKILL · hàng cắt bản là phần cắt bản, một lối); AC-3 thêm ca M′ ~7,5–8,5 giờ máy và chiều đỏ «cắt bản đếm hai lần: M′» |
| P1 | contract | Không ghim cách gộp bản ghi chạy song song (hợp khoảng hay cộng) và cắt cửa sổ vòng | Năm tác tử phản biện song song 20 phút thành 100 phút giờ máy; phiên điều phối dài đổ token việc khác vào vòng | Ca chồng giờ + sự kiện ngoài cửa sổ, hai chiều đỏ | fixed: AC-6 ghim hợp khoảng trên dòng thời gian gộp và cắt cửa sổ từ ngày quyết của ô; GM-6-song-song + chiều đỏ «giờ máy cộng trùng tác tử song song» và «sự kiện ngoài cửa sổ vào phép đo»; dòng sổ mới ghi lựa chọn |
| P1 | contract | Nhánh ITERATE (lệch do giờ máy hay giờ chờ) và nhánh CHẾT (vòng thiếu số đo) của ngưỡng chưa có đường đo | Mốc đầu đóng băng với giờ chờ 0, lệch 2 ngày mà không tách được nguyên nhân; vòng chạy ở máy khác không có số đo bị bỏ lặng, ngưỡng 100 % đọc thành SỐNG | du-bao ghi giờ chờ + cờ đo; đo lệch in giờ chờ và dòng thiếu số đo | fixed: AC-5 thêm moc.gio_cho và gio_cho_do; AC-8 in dòng giờ chờ ước so với đo, «<mã>: thiếu số đo», «k/N vòng có số đo», chiều đỏ «vòng thiếu số đo bị giấu» |
