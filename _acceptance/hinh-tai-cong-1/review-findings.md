## Trong hợp đồng

Không có finding nào ánh xạ vào AC trong round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Engine text (feature-loop SKILL.md) cites maintainer-only DIAGRAM-RULE as a source term**
  Người dùng thấy gì: Trong bước hướng dẫn máy đếm điểm cần vẽ hình, tài liệu quy trình nhắc tới một khái niệm nội bộ dành riêng cho người bảo trì kit mà không giải thích ở chỗ người đọc thấy nó — người dùng đọc quy trình vòng lặp có thể gặp một cụm từ không rõ nghĩa.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **rang.sh chỉ ghim 16/21 thông điệp đỏ mà evals E3/E4/E5/E6 khai — 5 thông điệp không được răng bảo vệ**
  Người dùng thấy gì: Một lớp kiểm tra phụ dùng để bắt sớm lỗi cấu hình chỉ khai đủ 16 trên 21 thông điệp cảnh báo có thể xảy ra; nếu sau này ai đó vô tình làm yếu bài kiểm tra chính cho 5 trường hợp còn lại, lớp kiểm tra phụ này sẽ không kịp cảnh báo (bài kiểm tra chính vẫn còn chặn đủ, đây chỉ là lớp dự phòng bị hở).
  file: `_acceptance/hinh-tai-cong-1/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert quan hệ cùng-đoạn (has_unit) nhưng chiều đỏ «tách đoạn» thực chất là XOÁ needle: m_split đổi hoa-thường 'bỏ qua'→'Bỏ qua' nên phép đo trình-diện đơn thuần cũng đỏ y hệt**
  Người dùng thấy gì: Một số phép kiểm tra dùng để đảm bảo hai ý bắt buộc phải nằm chung một đoạn văn thật ra chưa chứng minh được điều đó — chúng cũng báo lỗi giống hệt khi chữ chỉ đơn thuần bị xoá đi. Nếu sau này nội dung bị tách sai đoạn nhưng vẫn giữ đủ chữ, hệ thống có thể không phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «ma trận TOÀN PHẦN đo bằng máy» nhưng tập EXPECTED tự thu hẹp theo đúng những đột biến đã chạy (nhãn nở 1/5)**
  Người dùng thấy gì: Một bài kiểm tra tự nhận là kiểm tra 'toàn phần' cho năm bước của quy trình, nhưng trên thực tế mới chỉ thử nghiệm với một trong năm bước đó; nếu bốn bước còn lại bị hỏng trong tương lai, bài kiểm tra này sẽ không phát hiện ra.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có finding nào trong mục này round này.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
