---
slug: suc-khoe-cho-trong-va-toc-do
at: 2026-10-21T00:07:55Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ d-20261021T000455Z-2 ghi máy tự quyết bỏ mặc định 16 GB mà chủ kho chuyển nguyên trong vế 1; câu trích chỉ bác con số 16, không quyết giữa «không số», tỉ lệ RAM hay số nhỏ hơn — đây là khẩu vị rủi ro (báo chặn giả so với lượt bị giết trước khi sổ đủ mẫu), cùng lớp `[moi-cong-khong-qua-nut#F1]` | Chủ kho ký Cổng Phạm vi tưởng vế 1 đã làm như lời giao; thật ra mọi loại làn chạy «không xét chỗ» tới khi sổ đủ 5 lượt; một lượt s4 cỡ 20 GB được cấp trên máy 36 GB còn 16,6 GB và bị giết (137) mà chủ kho chưa từng được hỏi | Dòng sổ mới thay d-2 thành câu hỏi thật trên thẻ; giới hạn kèm ngưỡng: ≥1 lượt `ha_tang: true` cấp lúc nhu cầu `null` trong 14 ngày | human-gate1: dòng d-20261021T001030Z-9 (thay d-2) thành Hỏi-1 trên thẻ Cổng Phạm vi, khuyến nghị «không số» kèm ngưỡng mở lại đúng như thước đề xuất |
| P1 | design | Khoá thử lại là (phiên, slug, loại), không có commit — một lần cho cả vòng thay vì mỗi commit được chấm; E6 ghim đúng hành vi ấy | Lượt 1 commit A dưới tải đỏ, được thử lại; thợ sửa thành B; lượt trên B dưới tải đỏ trả `duoc_thu_lai: false`, đỏ của máy bị tính thành đỏ của vật | E6 thêm hàng commit khác → `true`; khoá thử lại mang sha | fixed: khoá thử lại mang commit lúc cấp (git trong worktree), AC-6 và E6 thêm hàng commit B → true và ca đỏ «bo-commit»; sổ d-20261021T001030Z-11 |
| P1 | design | Nhu cầu đo bằng hụt chỗ trống cả máy lẫn làn chạy song song và tải ngoài; p95 lấy cả dòng dưới tải và `ha_tang`; lối chết của d-3 chưa chứng (PID cây vẫn sống), cùng lớp `[cham-lai-khong-tu-doi#F1]` | s4 và đường nền chồng thời gian, mỗi dòng ghi 16 GB thay vì ~8; p95 × 1,5 = 24 > 16,6 → s4 «thiếu chỗ» hàng giờ ở áp lực 1, đúng sự cố 20/10 đổi tên | E7 hàng hai lượt chồng; E8 hàng có dòng bẩn, p95 loại chúng | fixed: cờ `chong` trên dòng sổ, p95 chỉ lấy dòng sạch (không nhãn, không `ha_tang`, không `chong`); AC-7, AC-8, E7, E8 thêm hàng; d-3 thay bằng d-20261021T001030Z-10 nêu vì sao cây PID không tách được phần của làn (tác tử chấm chạy trong chính tiến trình app của phiên) |
| P1 | contract | Thước 1 của Đường đo bằng 0 do cấu trúc; vế «còn đủ chỗ cho làn» không có đường đo; thước 2 có lối thoát «quyết định có ghi» không ai đếm được | Nhu cầu thổi phồng giữ s4 «thiếu chỗ» nhiều giờ; thước 1 đọc 0 → SỐNG, chủ kho ký đạt khi cơn đau còn | Thêm dòng đếm phút chờ «thiếu chỗ» oan kèm ngưỡng; thước 2 thay bằng con trỏ máy đọc được | fixed: thước 1 nói rõ chiều đỏ (máy còn chạy gói cũ thì lý do swap hiện ra); thêm thước «chờ thiếu chỗ oan» (lượt được cấp sau đó có nhu cầu nhỏ hơn chỗ trống lúc chờ, ≤5 % phút chờ — đề xuất); thước 2 đếm số đợt có khoá khác mẫu, trừ hai khoá hiệu chuẩn |
| P2 | evals | Không AC hay eval ghim rằng bảng đợt và `xem` hiện lý do chờ «thiếu chỗ» | s4 chờ hai giờ, bảng chỉ thấy đơn trong hàng chờ mà không lý do; chủ kho phải hỏi | E3 thêm assert bang.html và `xem` chứa chuỗi ở hàng level 46, vắng ở level 51 | fixed: AC-3 và E3 thêm đúng hai assert ấy |
