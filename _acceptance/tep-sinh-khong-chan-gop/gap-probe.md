---
slug: tep-sinh-khong-chan-gop
at: 2026-10-30T00:12:00Z
verdict: findings
p0: 2
p1: 0
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Đường đo lặng lẽ đổi vế reality của ngưỡng ô («không lần gộp lại nào vì tệp sinh» thành «không gộp nào có xung đột»), sổ không ghi lựa chọn đó; git log không lưu chuyện từng xung đột | PR chạm hồ sơ vẫn phải gộp nhánh chính vào và vẽ lại mỗi lần nhánh chính dời, nên theo chữ gốc ngưỡng chết ngay từ thiết kế; Cổng Phạm vi ký trên ngưỡng không đạt được | Một câu hỏi người ở Cổng Phạm vi kèm khuyến nghị và giá; đường đo đếm từ thứ phát lại được | human-gate1: Hỏi-2 (dòng sổ d-20261029T235119Z-9); Đường đo viết lại bằng phát lại `git merge-tree` kèm chiều đỏ trên bản clone chưa cấu hình |
| P0 | design | Dòng sổ d-2 khẳng định union làm GitHub thôi báo xung đột, trong khi chưa kiểm GitHub | Nếu GitHub bỏ qua union thì union là lối sống không cần cấu hình máy — lựa chọn thành khẩu vị rủi ro | Kiểm GitHub thật, hoặc đổi căn cứ | fixed: căn cứ mới không dựa vào hành vi GitHub — union đổi hành vi tuỳ công cụ gộp mà kit không kiểm được cho mọi kho, còn driver tên riêng rơi về dừng ở mọi công cụ chưa cấu hình nên tín hiệu xung đột `gop.mjs` đọc không đổi (luật 26/09); dòng mới supersedes d-2; design §3 sửa chữ |
| P2 | design | Trục D thiếu thư mục chỉ chứa tệp bị bỏ qua (`.DS_Store`) | Máy macOS có thư mục sót chứa `.DS_Store` bị bỏ qua → bản vẽ vẫn lệch bản clone sạch, AC-6 vẫn xanh | Thêm trạng thái vào trục D, hoặc khai giới hạn | deferred: khai giới hạn ở design §4 và Notes của hợp đồng, kèm ngưỡng mở (một lần CI đỏ vì thư mục như vậy) |
| P2 | evals | Ca git thật không ghim cô lập khỏi cấu hình máy chấm | Máy chấm có driver ở cấu hình toàn cục → TS-3 «chưa cấu hình» thoát 0, đỏ vì hạ tầng | GIT_CONFIG_GLOBAL tệp rỗng, GIT_CONFIG_NOSYSTEM, danh tính tường minh; ca chứng cô lập | fixed: đầu evals.yaml khai lớp cô lập; E3 ghi driver vào một cấu hình toàn cục giả rồi assert kho thử không thấy nó |
