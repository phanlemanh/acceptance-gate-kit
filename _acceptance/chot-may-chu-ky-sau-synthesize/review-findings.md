## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lượt 4 mở verified_at lồng trong frontmatter đóng rào nhưng không tìm run_id ở đó: bản ghi carry bị ép giờ invokedAt thay vì giờ carry**
  Người dùng thấy gì: Nếu một báo cáo có bằng chứng cũ (đo từ trước) bị đặt lồng bên trong phần đầu đóng khung của báo cáo thay vì phần thân, hệ thống có thể ghi nhầm nó là vừa đo ngay lúc chốt thay vì giữ đúng thời điểm đo gốc — người đọc có thể tin bằng chứng mới hơn thực tế.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **Vòng đột biến CTN-AC8-vi-phan (thêm M10/M11) không tự kiểm đối chứng dương trong ca**
  Người dùng thấy gì: Nếu sau này ai đó vô tình làm hỏng đúng phần logic mà hai ca kiểm thử này nhắm tới, bộ kiểm thử phòng vệ có thể không báo động, vì nó không tự xác nhận trước rằng bản gốc (chưa lỗi) chắc chắn xanh.
  file: `tests/workflows/chot-truong-nguoi.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: trục B tự xưng quét «mọi hình dạng L3 đếm» nhưng chỉ là danh sách điểm viết tay; các hình dạng L3 vẫn đếm mà không có ô và không khai giới hạn**
  Người dùng thấy gì: Một báo cáo giả có thể chèn dòng kiểu gạch đầu dòng markdown ("* human_override: ...") mà cổng chốt hiện chưa nhận ra là chữ ký giả — nghĩa là một số hình dạng chèn chữ ký giả có thể lọt qua khỏi tầm kiểm soát của bước chốt này và cần một vòng riêng để xử lý phần đọc.
  file: `tests/workflows/chot-truong-nguoi.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 2 (thước viết cùng khuôn với vật): kiemIm chuyển sang dùng đúng RE_TRUONG của chốt nên chiều im trên corpus thật hết thấy việc chạm vào nội dung khối vô hướng (r3)**
  Người dùng thấy gì: Bài kiểm chất lượng dùng để phát hiện khi máy tự làm giả kết quả kiểm thử hiện không còn bắt được kiểu làm giả đó trên báo cáo thật, nên một lỗi loại này có nguy cơ lọt qua mà không ai cảnh báo.
  file: `tests/workflows/chot-truong-nguoi-corpus.mjs`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).