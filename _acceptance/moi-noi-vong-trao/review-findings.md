## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Placeholder `{n}` lệch quy ước `{tên_khoá}` của mọi khuôn frontmatter khác**
  Người dùng thấy gì: Một ô trong mẫu ghi nhật-ký-vấp dùng cách trình bày khác các ô còn lại; nếu sau này có công cụ tự động đọc mẫu này, nó có thể đọc nhầm ô đó mà không báo lỗi.
  file: `skills/acceptance/references/stranger-drive-template.md`
  severity: low
  Đề xuất: known-limits

- **Nhãn ca P197 khai «3 mutant» trong khi code chạy và in «4 mutant»**
  Người dùng thấy gì: Nhãn mô tả của một bài kiểm nội bộ ghi sai số lượng phép-kiểm nhỏ mà nó thực sự chạy, có thể khiến người đọc báo cáo kiểm thử hiểu nhầm mức độ đã được kiểm tra.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Tuyên ma trận toàn phần nhưng thiếu ô cho một trạng thái có thật của vật (readable=false)**
  Người dùng thấy gì: Có một tình huống hồ sơ cơ hội bị hỏng theo cách khác (ví dụ rỗng hoàn toàn hoặc quá lớn) mà bộ kiểm hiện tại chưa có phép kiểm riêng; một lỗi chỉ xảy ra ở đúng tình huống đó có thể không bị phát hiện.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: hai kiểm «khuôn cũ KHÔNG còn» không có đối chứng dương / không đi qua check()**
  Người dùng thấy gì: Một bước kiểm tra nội bộ dùng để soát lại chính hồ sơ này có hai điều kiện chưa được xác nhận là sẽ bắt lỗi khi cần; nếu định dạng tài liệu liên quan đổi nhẹ sau này, sai sót ở đúng hai điều kiện đó có thể lọt qua mà không ai biết.
  file: `_acceptance/moi-noi-vong-trao/rang-mnvt.sh`
  severity: medium
  Đề xuất: known-limits

- **Ô có-ngưỡng/html không ghim quan hệ «có khối ⇒ KHÔNG cờ vàng» — nửa ma trận chỉ đo một chiều**
  Người dùng thấy gì: Khi ngưỡng nghiệm thu hiển thị đầy đủ trên thẻ, bộ kiểm hiện tại không xác nhận rằng cờ cảnh báo không xuất hiện đồng thời; nếu logic sau này đổi sai, thẻ có thể hiện cả nội dung ngưỡng lẫn cảnh báo cùng lúc mà không bị bắt.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
