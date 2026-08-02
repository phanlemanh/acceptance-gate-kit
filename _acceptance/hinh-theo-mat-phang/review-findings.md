## Trong hợp đồng

(Không có finding nào ánh xạ được vào AC trong round 5 — toàn bộ 11/11 eval máy đạt, 0 lỗi trong hợp đồng.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Con dấu bằng chứng cũ 4 commit — ba bản vá sau S4-r2 chưa có vòng chấm nào**
  Người dùng thấy gì: Báo cáo bằng chứng đang xác nhận kết quả PASS cho một phiên bản mã cũ hơn phiên bản sắp được duyệt — ba lần sửa gần nhất chưa được chấm lại lần nào. Người ký Cổng 2 có thể ký duyệt một trạng thái không còn đúng với mã hiện tại mà không được cảnh báo.
  file: `_acceptance/hinh-theo-mat-phang/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Bảng tra mặt phẳng có thể gộp về MỘT cơ chế vẽ mà suite vẫn xanh — phép đo không ràng buộc đúng thứ feature sinh ra để chặn**
  Người dùng thấy gì: Cách kiểm tra máy hiện tại không phát hiện được nếu ai đó vô tình gán CÙNG một cách vẽ cho mọi nơi hiển thị khác nhau trong bảng tra, dù mục tiêu của tính năng là mỗi nơi phải có cách vẽ phù hợp riêng. Nếu lỗi đó lọt qua sau này, người dùng ở một số nơi có thể lại nhận được hình không xem được, giống sự cố ban đầu khiến tính năng này ra đời.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: known-limits

- **Đối chứng âm của P88 là hằng-đúng trên literal — không bao giờ đỏ được**
  Người dùng thấy gì: Một phép kiểm tra an toàn phiên bản trong bộ máy chỉ tự so sánh với chính nó nên không bao giờ có thể phát hiện lỗi thật — nếu cách đọc phiên bản bị hỏng ở nơi khác, hệ thống vẫn báo mọi thứ ổn.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Thân luật N5 vẫn ghim định dạng "sơ đồ" — đúng câu chữ mà feature này sinh ra để gỡ**
  Người dùng thấy gì: Phần hướng dẫn khi nào cần vẽ hình vẫn còn dùng từ ngữ ngầm chỉ định đúng một kiểu vẽ (sơ đồ), dù tính năng này đã đổi sang cho phép chọn cách vẽ theo nơi hiển thị — người đọc bản hướng dẫn có thể vẫn hiểu nhầm là chỉ được vẽ sơ đồ.
  file: `skills/acceptance/references/human-facing-language.md`
  severity: medium
  Đề xuất: known-limits

- **review-findings.md ở HEAD liệt kê lỗi ĐÃ SỬA và trùng lặp một lỗi — thẻ Cổng 2 trình cho người trạng thái sai**
  Người dùng thấy gì: Tài liệu tóm tắt lỗi trình cho người duyệt ở Cổng 2 đang liệt kê một số lỗi đã được sửa xong từ trước và có một mục bị lặp lại hai lần, khiến người duyệt nhìn thấy số lượng và danh sách việc cần quyết định nhiều hơn thực tế.
  file: `_acceptance/hinh-theo-mat-phang/review-findings.md`
  severity: medium
  Đề xuất: new-contract

- **verified_commit của bằng chứng đã cũ 4 commit, và luật chặn bằng-chứng-cũ không bao giờ chạy tới vì rule signoff `continue` trước**
  Người dùng thấy gì: Báo cáo bằng chứng ghi nhận đã kiểm tra ở một phiên bản mã cũ hơn phiên bản hiện tại, và cơ chế lẽ ra phải cảnh báo điều này cho người ký lại không hiển thị cảnh báo đúng lúc cần quyết định — nghĩa là người ký có thể ký mà không biết bằng chứng đã lỗi thời.
  file: `_acceptance/hinh-theo-mat-phang/evidence-report.md`
  severity: medium
  Đề xuất: new-contract

- **Hai đối chứng âm con-trỏ-tên của P90 chỉ khẳng định truthiness, không ghim thông điệp**
  Người dùng thấy gì: Một phép kiểm tra không phân biệt được giữa hai loại lỗi khác nhau khi trích dẫn tên bảng tra trong bản luật, nên nếu lỗi thật xảy ra ở loại thứ nhất, phép kiểm tra vẫn có thể báo đạt vì nhầm sang loại thứ hai.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(Không có finding nào với `unverified=true` trong round 5.)

⚠ Cụm ngoài vùng phủ: 3/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/hinh-theo-mat-phang/evidence-report.md, _acceptance/hinh-theo-mat-phang/review-findings.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.