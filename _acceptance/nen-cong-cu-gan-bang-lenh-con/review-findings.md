## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **quet-kho.mjs resolves lib/evidence-core.cjs from the current directory, not from the script's location**
  Người dùng thấy gì: Nếu ai đó tính lại con số 5.113 khoá từ một thư mục khác, kết quả có thể sai mà không báo lỗi, khiến người đọc tin nhầm vào bằng chứng của hồ sơ này.
  file: `_acceptance/nen-cong-cu-gan-bang-lenh-con/quet-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Magic number 8 for tuDau recursion depth**
  Người dùng thấy gì: Với lệnh gán lồng rất sâu (trường hợp hiếm gặp), công cụ có thể lặng lẽ bỏ qua khoá đó mà không báo lý do, khiến người dùng tưởng khoá đã được kiểm xong.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **NEN-TD5/TD6 still pin the 'truncated string', but the new parser returns the whole word**
  Người dùng thấy gì: Chú thích trong test không khớp hành vi thật nữa, có thể khiến người bảo trì sau này hiểu sai điều công cụ đang bảo vệ, dù kết quả kiểm tra hiện tại vẫn đúng.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Lệnh con bắt đầu bằng chuyển hướng bị gọi tên như chương trình: báo THIEU giả, và là hồi quy so với bản trước vá**
  Người dùng thấy gì: Một số lệnh gán hợp lệ như `X=$(<file)` hoặc `X=$(2>/dev/null git ...)` có thể bị báo nhầm là 'thiếu chương trình' dù chương trình thật vẫn có trên máy — đúng loại báo động giả mà tính năng này được làm ra để sửa.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lệnh chỉ-gán mang `$((…))` số học làm mất phát hiện chương trình vắng ở lệnh đơn kế (hồi quy)**
  Người dùng thấy gì: Lệnh gán dùng phép toán như `N=$((1+2)); lenh-ke` sẽ không được kiểm chương trình `lenh-ke` tiếp theo nữa — công cụ lặng lẽ bỏ qua thay vì báo thiếu, dù bản trước từng báo đúng.
  file: `feature-loop/scripts/duong-nen.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay cho quan hệ) — NEN-TD5/TD6 vẫn tự nhận «ghim chuỗi cụt», nhưng sau bản vá đó không còn là chuỗi cụt**
  Người dùng thấy gì: Chú thích và thông điệp PASS của hai ca test mô tả một chuỗi không còn đúng với bản vá hiện tại, có thể gây hiểu nhầm khi đọc lại test sau này, dù kết quả kiểm tra vẫn đúng.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6 (đường dẫn suy từ cwd, không từ vị trí script/cây đo) — quet-kho.mjs nạp bộ đọc từ `path.resolve('lib/evidence-core.cjs')`**
  Người dùng thấy gì: Nếu script đo được chạy từ một thư mục khác, nó có thể âm thầm dùng nhầm bộ đọc của cây khác, làm sai số liệu bằng chứng — dù với cặp phiên bản đang dùng trong hồ sơ này kết luận vẫn đúng.
  file: `_acceptance/nen-cong-cu-gan-bang-lenh-con/quet-kho.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nen-cong-cu-gan-bang-lenh-con/quet-kho.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.