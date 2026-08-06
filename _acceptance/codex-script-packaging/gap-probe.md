---
slug: codex-script-packaging
at: 2026-08-06T06:20:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals + contract | E2 tuyên quét cả LỚP nhưng không có ma trận toàn phần: 6 tham chiếu không được liệt kê đích danh ở đâu, thước phạm vi duy nhất là bộ đếm "> 0" — đếm-rồi-vứt | Chỉ dẫn sau này viết lại theo dạng khác, hoặc glob trượt một gói: biểu thức rút được 2 thay vì 6, counter vẫn > 0 nên XANH; con trỏ chết mới không hề được đối chiếu — đúng lớp feature này sinh ra để đóng | Ghim bảng vào contract; tập rút được BẰNG ĐÚNG bảng (thừa đỏ, thiếu đỏ); tập tệp chỉ dẫn đã quét phủ cả 3 gói | fixed: marker `CODEX-SELF-SCRIPT-REFS` 7 dòng + AC-2/E2 đổi sang quan hệ tập hợp |
| P0 | evals + sổ | E5 fail-open ở nhánh bản-cũ: không assert bản cũ dựng thành công và không rỗng; danh sách base rỗng thì "không mất file nào" luôn đúng vô nghĩa | Cây kiểm là bản sao nông hoặc một hàm dựng khác lỗi trong thư mục tạm → base rỗng → E5 XANH; bản sửa làm rơi file của gói khác ship trót lọt. Mutant hiện có không chặn vì nó nhắm đúng gói Codex | Assert trước: lấy được commit đã ghim (không thì ĐỎ thông điệp riêng) + đúng 3 gói, mỗi gói > 0 file; thêm ca đổi mã commit thành mã không tồn tại | fixed: AC-5/E5 viết lại, 2 đối chứng |
| P1 | evals + contract | AC-2 khai HAI hình dạng tham chiếu nhưng mutant chỉ tiêm MỘT, và không có ca âm chứng minh dạng trỏ-sang-gói-bạn không bị rút nhầm | Nhánh biểu thức cho hình dạng thứ hai viết sai; E2 vẫn rút được hình dạng thứ nhất nên qua, E3 tiêm đúng hình dạng đang chạy nên đỏ như kỳ vọng — cả hai XANH trong khi một công cụ mới ghi theo dạng thứ hai vẫn lọt | Mỗi hình dạng một ca tiêm riêng (2 dương) + 1 ca âm trỏ gói bạn phải XANH | fixed: AC-3/E3 thành ma trận 2 dương + 1 âm |
| P1 | evals + contract | E4 dựng hồ sơ đầu vào theo khuôn BÊN ĐỌC, assert chỉ là "có khoá trong kết quả" — chuỗi-có-mặt trong khi lời hứa là công cụ dùng được thật | Đường ghi thật xuất trường ở dạng khác khuôn test tự dựng: E4 XANH, nhưng người dùng Codex chạy trên hồ sơ thật nhận danh sách rỗng — con trỏ hết chết mà lệnh vẫn vô dụng | Lấy hồ sơ THẬT đã niêm trong repo; assert quan hệ tập mã-hạng-mục bằng đúng tập tính độc lập | fixed: AC-4/E4 đổi sang hồ sơ thật + quan hệ tập hợp |
| P2 | evals + contract | E6 ghim số cứng 6 lệnh kiểm; không AC nào assert chốt MỚI thật sự nằm trong lưới thường trực | Chốt mới viết vào chỗ nằm ngoài đường quét của lưới: 6 lệnh cũ vẫn xanh nên E6 XANH, nhưng lần thêm công cụ kế tiếp không có gì đỏ — trở lại đúng trạng thái trước feature | Đọc danh sách lệnh từ cấu hình đã khai; ca âm đổi tên khối chốt → lưới phải ĐỎ | fixed: AC-6/E6 đọc từ config + ca âm |
