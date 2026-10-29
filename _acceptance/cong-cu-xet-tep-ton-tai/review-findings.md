# Review findings: cong-cu-xet-tep-ton-tai (round 2)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Đối chứng «bản tiêm chết» của NEN-TT5 không kiểm thông điệp lỗi, chỉ kiểm việc không có tệp**
  Người dùng thấy gì: Bộ kiểm của đường nền có một ca đối chứng phụ có thể báo xanh dù bản tiêm lỗi chết vì lý do khác chứ không đúng vì nhát tiêm. Người dùng kit không thấy khác biệt nào: phép kiểm chính vẫn đúng và toàn bộ bộ kiểm đang xanh.
  Căn cứ: Hậu quả nhẹ: chỉ làm một ca đối chứng phụ kém chặt, không làm mất hay lộ dữ liệu của ai, và phép kiểm chính vẫn bắt đúng lỗi; ghi lại làm giới hạn đã biết là đủ, sửa chỉ khi có lượt chấm sai thật theo ngưỡng đang đếm.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Bảng «Bốn chân» của khuôn đường nền vẫn mô tả luật cũ của chân cong_cu (mọi tên chương trình đều tra bằng command -v); luật đường tệp mới không được ghi (r1)**
  Người dùng thấy gì: Tài liệu đi kèm bản kit vẫn mô tả cách kiểm tra công cụ theo luật cũ. Người đọc ở kho khác có thể hiểu sai vì sao một tệp kịch bản không có quyền chạy nay lại được coi là có mặt, hoặc vì sao một thư mục lại bị báo thiếu.
  Căn cứ: Chỉ là lời mô tả lệch, không làm kết quả kiểm sai và không mất dữ liệu; người đọc tự tra lại được, và sửa chữ về sau rẻ nên ghi hạn chế đã biết rồi ship.
  file: `skills/acceptance/references/duong-nen-template.md`
  severity: low
  Đề xuất: known-limits

- **A bare script name in the repo root is marked green even though bash cannot run it (exit 127) (r1)**
  Người dùng thấy gì: Nếu một lệnh công cụ bắt đầu bằng tên tệp kịch bản trần nằm ở gốc kho, bước kiểm báo xanh là công cụ có mặt, nhưng khi chạy thật lệnh đó không tìm thấy và hỏng. Người ký sẽ tin nhầm là công cụ dùng được.
  Căn cứ: Gây báo xanh giả ở một ca hẹp, lỗi chỉ lộ khi lệnh chạy thật chứ không mất dữ liệu; sửa thuộc về đổi chính điều hợp đồng đã chốt nên cần một việc riêng có người quyết.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
