## Trong hợp đồng

(rỗng)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Khuôn uat-session chép nguyên văn theo đúng chỉ dẫn của SKILL.md → hồ sơ HỎNG ở cả hai reader**
  Người dùng thấy gì: Nếu người dùng làm đúng theo hướng dẫn của skill để tạo phiên nghiệm thu, hồ sơ tạo ra có thể bị đánh dấu "hỏng" trên bản đồ sản phẩm và trên thẻ /start, dù người dùng không làm gì sai.
  file: `skills/acceptance/references/uat-session-template.md`
  severity: high
  Đề xuất: known-limits

- **CONTEXT.md không được cập nhật: khoá `verdict` bị tái dùng với enum thứ hai, và bảng liệt kê Gate đã cũ**
  Người dùng thấy gì: Tài liệu thuật ngữ dùng chung của nhóm không được cập nhật theo tính năng mới, có thể khiến người đọc sau này hiểu nhầm ý nghĩa của một số nhãn trạng thái hoặc số lượng cổng duyệt.
  file: `CONTEXT.md`
  severity: medium
  Đề xuất: known-limits

- **Nghi thức cổng người thứ bảy (`uat-session`) để MỞ model-invocation, không ADR, chỉ chốt bằng một assert trong test**
  Người dùng thấy gì: Quyết định để ngỏ quyền tự gọi cho nghi thức nghiệm thu mới chưa được ghi lại lý do chính thức, có thể gây khó hiểu hoặc tranh cãi khi có người hỏi lại vì sao tính năng này khác các cổng duyệt khác.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Hai reader vẫn cho hai kết luận trái nhau khi evidence-report.md hỏng**
  Người dùng thấy gì: Khi kết quả kiểm thử của một tính năng bị lỗi hoặc thiếu, bản đồ tổng quan sản phẩm vẫn hiển thị tính năng đó như đang chạy bình thường thay vì cảnh báo, có thể khiến người xem bản đồ chọn nhầm việc tiếp theo.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **`--check` exit 0 khi `--root` trỏ sai chỗ — cổng CI xanh mà chưa kiểm gì**
  Người dùng thấy gì: Nếu người vận hành gõ sai đường dẫn khi chạy kiểm tra bản đồ sản phẩm trong CI, hệ thống báo "đạt" mà thực chất chưa kiểm tra gì, tạo cảm giác an toàn giả.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **front_field của pre-merge-check.sh không còn khớp frontmatterField sau bản vá bóc-nháy-theo-cặp**
  Người dùng thấy gì: Một vài giá trị đặc biệt trong hồ sơ (ví dụ tên có dấu ngoặc kép) có thể được hai công cụ trong hệ thống đọc ra hai kết quả khác nhau, tuy ảnh hưởng thực tế nhỏ vì các trường hay dùng hiếm khi rơi vào tình huống này.
  file: `lib/evidence-core.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).