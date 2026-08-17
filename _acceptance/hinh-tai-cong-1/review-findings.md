## Trong hợp đồng

(không có finding nào map được vào AC ở vòng này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Đột biến m_cond nối lại khối bằng "\n" nên gộp các đoạn còn lại thành một đơn vị — mutant không đúng hình «chỉ xoá một đoạn»**
  Người dùng thấy gì: Phép đo tự động dùng để bắt lỗi thiếu điều kiện dừng-chờ-người hiện gộp nhầm nhiều đoạn văn bản lại làm một khi kiểm tra; nếu sau này có ai thêm nội dung mới vào cạnh đoạn đó, phép đo có thể không còn phát hiện đúng lỗi mà không ai nhận ra.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — P90 assert 'clause có mặt trong file' trong khi lời hứa (và chính comment mới) là 'MỌI bản chép khớp khuôn'**
  Người dùng thấy gì: Nếu sau này có người chỉnh sai riêng bản mô tả bước hình ở mục lập kế hoạch (mà không đụng tới bản ở Cổng 1), hệ thống hiện tại sẽ không phát hiện ra sự sai khác giữa hai bản, dù mục tiêu là mọi bản chép phải khớp nhau.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — E8 tuyên «TOÀN BỘ ma trận needle→đột biến» nhưng 4 nhánh đỏ của check không có đột biến, và không có assert số-đột-biến = số-needle**
  Người dùng thấy gì: Tài liệu mô tả phép đo tuyên bố đã kiểm tra toàn bộ các tình huống thiếu sót có thể xảy ra ở Cổng 1, nhưng thực tế chỉ kiểm tra khoảng 4 phần 5 số đó; nếu sau này có ai vô tình xoá mất phần khối hình, tên bước, giới hạn vẽ lại một lần, hoặc dòng đếm điểm chưa vượt ngưỡng, không có báo động nào bắt được, và khoảng trống này cũng không tự lộ ra.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
