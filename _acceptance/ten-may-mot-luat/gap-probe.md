---
slug: ten-may-mot-luat
at: 2026-10-31T15:55:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Dòng sổ bỏ đường đo nói ô không có ngưỡng số, trong khi ngưỡng reality là một số đếm (bình luận bộ đọc trả null = 0) và va với việc không dọn tin chết 31/10 | Sau khi nhận 2.36.2 tin 31/10 vẫn trả null, người đọc reality thấy ngưỡng đỏ dù vật đúng | Ngưỡng tính tin MỚI sau ngày nhận bản, có lệnh đếm tái lập, tin 31/10 là ngoại lệ có tên | fixed: ô cơ hội ghi ngưỡng «đăng sau ngày nhận bản» + ngoại lệ có tên; hợp đồng có mục Đường đo (lệnh tin so --kenh … --tu, trường bo_qua); dòng sổ mới thay dòng bỏ đường đo |
| P0 | design | Dòng sổ giữ bộ đọc khoan dung trích quyết định của hồ sơ khác — chỉ liên quan, không quyết; dòng kiểm trước nơi chứa trích một chú thích mã | Cổng Phạm vi tưởng có mục tiêu chống lưng cho bộ đọc khoan dung | Trích luật 26/09 của CLAUDE.md hoặc căn cứ một-lối | fixed: dòng thay trích luật 26/09 (bộ đọc khoan dung trước đổi mặc định) và khai giá: bình luận gõ tay tới tên sai vẫn đọc được; dòng kiểm trước nơi chứa đổi sang một-lối (AC-3 đòi 0 lời gọi gh) |
| P0 | contract | Ma trận bên viết thiếu hai ô khoảng trắng cuối và rỗng; lý do bỏ quét độ phủ vòng tròn [kiem-ban-cai-loi-sua-chay-duoc#F2] | Bên viết trim đối số hay rơi vào nhánh thiếu đích, tin GIAO «MBP » đăng dòng bộ đọc trả null mà E3 vẫn xanh | Thêm «MBP » và chuỗi rỗng vào AC-3/E3 với thông điệp ghim | fixed: AC-3/E3/TM-3 thành 15 lời gọi (5 đích × 3 khẩu lệnh), «MBP » ghim vế «thử «MBP»»; dòng sổ bỏ quét mới căn cứ lượt phản biện đã bổ sung ô |
| P1 | evals | Vế «vai sai không tạo tệp kênh» là assertion âm tính đứng một mình | Vật ghi tệp chỗ khác, ca dò sai thư mục vẫn xanh | Sau vai hợp lệ, assert tệp CÓ ở đúng đường đã dò | fixed: TM-4 vai assert tệp kênh có mặt sau --may MacStudio; mutant «ghi trước kiểm» deferred: đối chứng dương đủ phân biệt dò sai chỗ |
| P1 | evals | E6 ghim cứng «# pass 69» và paths thiếu hai tệp ca | Vòng anh em thêm ca vào tin.test.mjs rồi gộp, E6 đỏ oan sau chữ ký | Đo theo tên/không not ok; thêm tệp ca vào paths | fixed: E6 ghim «# fail 0», không «not ok», số qua ≥ 69 (cận dưới); paths thêm tin.test.mjs, tin-khong-mat-dau.test.mjs, tin-kho-thu.mjs |
