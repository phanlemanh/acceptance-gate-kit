## Trong hợp đồng

(không có finding nào ánh xạ được vào AC ở vòng này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Tải gửi triage được viết HAI lần — lượt hỏi lại vỡ theo đường LẶNG khi hai bản trôi khỏi nhau**
  Người dùng thấy gì: Nội dung gửi cho bước hỏi-lại đang được viết trùng ở hai nơi trong code; nếu sau này có người sửa một nơi mà quên sửa nơi kia, bước hỏi-lại có thể âm thầm gửi lại toàn bộ danh sách thay vì chỉ phần còn thiếu, làm tốn thêm chi phí xử lý mà không ai nhận ra.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: known-limits

- **Bộ lọc dòng `"kind":"triage"` còn sót sau khi THU PHẠM VI AC-7 — nới vĩnh viễn khẳng định đếm-chính-xác của W03/W12**
  Người dùng thấy gì: Một bộ lọc trong bài kiểm thử đang âm thầm loại bỏ một loại dòng nhật ký không còn được hệ thống tạo ra nữa; nếu loại dòng đó xuất hiện trở lại sau này do một thay đổi khác, bài kiểm thử sẽ không phát hiện ra.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Văn đầu tệp của răng và bảng mã thoát còn mô tả AC-7 đã bị thu phạm vi**
  Người dùng thấy gì: Một số ghi chú mô tả trong bài kiểm thử vẫn nhắc tới một cơ chế đã bị bỏ khỏi hệ thống, khiến người đọc sau này có thể đi tìm một thứ không còn tồn tại.
  file: `tests/workflows/triage-do-tin.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Trường nội bộ `tid` rò vào lời nhắc soạn báo cáo và bản review-findings**
  Người dùng thấy gì: Một mã nội bộ chỉ dùng riêng cho bước phân loại đang bị lọt vào nội dung soạn báo cáo cho người duyệt, làm tốn thêm chi phí xử lý và có nguy cơ một mã vô nghĩa với người đọc lọt vào văn bản trình lên Cổng 2.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Lượt hỏi lại khai `contractUnreadable` bị nuốt — đặt triageFailed mà KHÔNG có dòng log gọi tên nguyên nhân**
  Người dùng thấy gì: Khi bước hỏi-lại tự báo không đọc được hợp đồng, hệ thống vẫn xử lý đúng nhưng không ghi lại rõ lý do, khiến người xem nhật ký sau này khó phân biệt các nguyên nhân lỗi khác nhau khi cần tra cứu.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Bộ lọc `"kind":"triage"` trong acceptance-verify.test.mjs đã CHẾT — bên sinh dòng sổ bị gỡ trong cùng dải diff, lọc còn lại làm yếu vĩnh viễn hai khẳng định đếm run-log**
  Người dùng thấy gì: Một điều kiện lọc trong bài kiểm thử vẫn tồn tại để loại trừ một loại dòng nhật ký đã bị bỏ khỏi hệ thống; nó khiến phép đếm trong bài kiểm thử mất khả năng phát hiện nếu loại dòng đó xuất hiện lại.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình: đối chứng dương của chân chu-ky-kiem KHÔNG gắn vào mã thoát**
  Người dùng thấy gì: Một phần kiểm chứng trong bài kiểm thử — trường hợp đối chứng dùng để đảm bảo phép đo không tự đánh lừa chính nó — không thực sự được tính vào kết quả đạt/không đạt cuối cùng, nên nếu phần đó âm thầm hỏng, bài kiểm thử vẫn báo đạt như bình thường.
  file: `tests/workflows/triage-do-tin.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bộ lọc chết: assert đếm run-log được nới cho dòng `kind:"triage"` mà bản cài KHÔNG hề sinh**
  Người dùng thấy gì: Một điều kiện kiểm tra trong bài kiểm thử được nới lỏng để bỏ qua một loại dòng nhật ký mà hệ thống hiện không còn tạo ra; nếu loại dòng đó vô tình xuất hiện lại sau này, phép đếm sẽ không còn chính xác nữa.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).