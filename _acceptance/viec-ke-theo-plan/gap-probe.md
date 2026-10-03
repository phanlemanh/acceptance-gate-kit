---
slug: viec-ke-theo-plan
at: 2026-10-02T21:26:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

> Lượt phản biện thứ hai, chạy trên phần mở rộng sau quyết định «trả» ở Cổng Bằng chứng 02/10. Lượt
> thứ nhất (5 finding, 0 P0, đã sửa hết) nằm trong lịch sử git của tệp này.

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | AC-18 coi nháy kép là đủ bọc mô tả việc; trong nháy kép shell vẫn chạy backtick và $(...) | mô tả có backtick git reset --hard được thay vào --hang và chạy thật trong kho trước khi node nhận đối số; lệnh vẫn thoát khác 0 nên S0 đi tiếp như không có gì | ca có backtick và $(...) tạo tệp canh; tệp canh không được tồn tại; bản sao nháy kép trần phải tạo tệp canh | fixed: S0 chỉ đưa vào shell đối số là MỘT mã khớp mẫu S0-MA-HANG-RE, trong nháy đơn; chữ tự do không bao giờ vào lệnh; AC-18, E18, design viết lại; LT-18-do là bản sao mẫu nhận-mọi-thứ cộng nháy kép tạo tệp canh |
| P1 | evals | LT-18-do ghim exit 2 và tham số lạ trong khi shell báo lỗi cú pháp trước khi node chạy | ca đỏ đốt vòng chấm hoặc tự gán thông điệp | ghim đầu ra thật của bản sao | fixed: LT-18-do nay ghim một đầu ra thật — tệp canh có mặt sau lệnh của bản sao |
| P1 | evals | E16 chỉ rút dòng git add, ca test tự vẽ lại; không đo thứ tự vẽ lại sau khi ghi trạng thái | một thân vẽ lại trước bước ghi trạng thái, commit mang trang cũ, LT-16 vẫn xanh | khối gồm cả vẽ lại; kiểm vị trí khối sau mốc ghi trường; mutant dời khối | fixed: khối MAP-STAGE gồm vẽ lại + đưa vào commit; LT-16-thu-tu kiểm khối đứng sau mốc ghi trường của từng thân và bản sao dời khối lên đầu phải đỏ nêu tên thân |
| P1 | evals | design hứa mọi ca đỏ chạy lại hàm đo; E12 vẫn ghim chuỗi tự gán; không thước kiểm lời hứa quét lớp | người ký tin lớp lỗi đã đóng trong khi một ca đỏ vẫn tự gán | viết lại E12, E4; thêm thước kiểm khuôn ca đỏ | fixed: E12 ghim stderr thật Cannot find module; E4 nói LT-04-do chạy lại lt04; design thu lời hứa về danh sách đã quét. rejected phần thước kiểm khuôn của chính bộ đo: luật chiều rộng (a) không mở đo thước của thước |
| P2 | evals | luật miễn trừ chỉ thử chuỗi y hệt, chưa thử glob tương đương | kho khai **/*.html bị --check đỏ oan ở mọi commit | glob tương đương phải xanh, dùng chính bộ khớp của nhánh tính độ cũ | fixed: khớp bằng đúng glob_variants/match_globs của lưới trước-merge; LT-16-mien-tru thử LO-TRINH.html, **/LO-TRINH.html, *.html xanh và docs/*.html đỏ; design ghi luật mới |
