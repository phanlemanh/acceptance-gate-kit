## Trong hợp đồng

_(không có finding nào ánh xạ được vào AC ở round này)_

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Guard fail-closed chặn đúng bộ design eval mà chính kit hướng dẫn viết — không có đường đọc-cũ**
  Người dùng thấy gì: Nếu một tính năng làm giao diện web được viết đúng theo hướng dẫn có sẵn của bộ công cụ, bước kiểm tra tự động sẽ chặn đứng ngay cả khi mọi thứ đúng chuẩn tài liệu, và người dùng phải tự sửa tay mới chạy tiếp được — không có cách nào để bỏ qua tạm thời.
  file: `feature-loop/workflows/acceptance-verify.js:250`
  severity: high
  Đề xuất: new-contract

- **Bản "trước guard" của W-G6b là chương trình hỏng — xanh nhờ may, một sửa nhỏ là thành ReferenceError**
  Người dùng thấy gì: Bài kiểm thử dùng để chứng minh phiên bản chưa có lớp bảo vệ mới thực sự có lỗi hiện đang báo kết quả đúng một phần là do may mắn (một lỗi gõ trong dữ liệu thử), không phải vì nó kiểm tra đúng cơ chế. Nếu sau này ai mở rộng bài kiểm thử này sang tình huống khác, nó có thể báo kết quả sai lệch hoặc dừng đột ngột khó hiểu, khiến người xem không còn tin được kết quả kiểm thử này.
  file: `tests/workflows/acceptance-verify.test.mjs:899`
  severity: medium
  Đề xuất: known-limits

- **Guard hard-BLOCKS the kit's own documented ui-check / design eval shape (no read-old path)**
  Người dùng thấy gì: Đường sinh kiểm tra giao diện web mặc định mà chính bộ công cụ khuyến nghị dùng hiện đang bị hệ thống kiểm tra tự động của cùng bộ công cụ đó từ chối chạy, không có cách nào bỏ qua tạm thời — người dùng phải tự sửa tay file kiểm tra trước khi có thể tiếp tục.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/feature-loop/workflows/acceptance-verify.js:250`
  severity: high
  Đề xuất: new-contract

- **`criterion` required for test/script executors contradicts SKILL.md 2b and is not used by the machine fan-out prompt**
  Người dùng thấy gì: Một loại mục kiểm tra mà chính bộ công cụ khuyến nghị tạo ra (kiểm tra thiết kế giao diện, áp dụng ngay cả khi tiêu chí không nhắc tới thiết kế) bị buộc phải khai thêm một nội dung mà bộ công cụ không thật sự cần tới — nếu thiếu, việc kiểm tra bị chặn hoàn toàn dù mục đó vốn không sai.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/feature-loop/workflows/acceptance-verify.js:247`
  severity: medium
  Đề xuất: new-contract

- **nothing-to-verify reason message hides ungrounded judgments when carry-forward is also present**
  Người dùng thấy gì: Khi một vòng kiểm tra vừa có phần được giữ nguyên từ vòng trước vừa có một câu hỏi đánh giá chưa được cấp đủ dữ liệu, thông báo hiển thị cho người vận hành chỉ nhắc tới phần giữ nguyên và im lặng bỏ qua câu hỏi thiếu dữ liệu — người đọc thông báo không biết cần bổ sung gì, dễ sửa nhầm chỗ.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/feature-loop/workflows/acceptance-verify.js:367`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).