## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Con dấu bằng chứng ghim commit cũ — PASS 11/11 không được sinh bởi evals/phép đo đang ở HEAD**
  Người dùng thấy gì: Bằng chứng đã ghi PASS đang chứng nhận cho một phiên bản mã cũ hơn phiên bản đang có mặt bây giờ — nếu ký duyệt Cổng 2 lúc này, người duyệt đang ký cho một bản đã lỗi thời mà không hề biết.
  file: `_acceptance/hinh-theo-mat-phang/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Tiêu chí AC-1/AC-2 không được nâng theo khi phép đo siết sang ràng buộc quan hệ**
  Người dùng thấy gì: Tiêu chí đang hiển thị cho người duyệt đọc mô tả yêu cầu lỏng hơn những gì hệ thống kiểm tra tự động thực sự đang bắt buộc — người duyệt có thể ký mà không biết máy đang đòi hỏi chặt hơn văn bản họ vừa đọc.
  file: `_acceptance/hinh-theo-mat-phang/contract.md`
  severity: medium
  Đề xuất: new-contract

- **Hai đối chứng âm mới của P90 chỉ kiểm truthiness, không ghim thông điệp mong đợi**
  Người dùng thấy gì: Một phần kiểm tra tự động hiện chỉ xác nhận 'có báo lỗi hay không', chưa chắc báo đúng loại lỗi — nếu về sau ai đó vô tình làm hỏng phần liên kết tên trong tài liệu luật, hệ thống kiểm tra vẫn có thể báo nhầm là ổn.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Đối chứng âm hằng-đúng còn sót trong P88 — cùng lớp mà chính diff này tuyên bố đã quét**
  Người dùng thấy gì: Một phép kiểm tra số phiên bản phần mềm hiện không thực sự so sánh với dữ liệu thật của kho — nó luôn cho kết quả 'đúng' bất kể tình trạng thực tế, nên sẽ không phát hiện được nếu số phiên bản bị đặt sai.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **P97's new "quan hệ" constraint is permutation-invariant — the exact mermaid-into-terminal state the fix claims to block is still GREEN**
  Người dùng thấy gì: Bảng tra cách-vẽ có thể bị ghép sai (một mặt phẳng lại mang cách vẽ của mặt phẳng khác) mà hệ thống kiểm tra tự động vẫn báo đạt — nếu lỗi ghép sai đó lọt vào tài liệu thật sau này, máy sẽ không bắt được, dù bảng đang hướng dẫn sai cho người dùng.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: new-contract

- **Evidence report certifies a commit 2 behind HEAD, and the gate's stale-evidence check never prints because the empty-signoff branch `continue`s first**
  Người dùng thấy gì: Bằng chứng trình cho người duyệt ở Cổng 2 đang chứng cho một bản mã cũ hơn bản hiện tại, và lời cảnh báo 'bằng chứng cũ' đáng lẽ phải hiện ra lại không xuất hiện trong trường hợp này — người ký duyệt không được cảnh báo về việc đó trước khi ký.
  file: `_acceptance/hinh-theo-mat-phang/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **P97 pins only the `hội thoại` row by name while the table has 4 rows and the floor is 3 — any other surface can be deleted and the suite stays green (and line 2753 asserts it must)**
  Người dùng thấy gì: Trong bốn cách trình bày hình mà tài liệu liệt kê, hệ thống kiểm tra tự động chỉ thực sự đảm bảo có mặt đúng một cách (khung hội thoại); ba cách còn lại có thể bị xoá khỏi tài liệu mà không bị phát hiện, dù nơi khác của kit vẫn nói có đủ bốn cách.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **P90's two cited-marker negative controls assert truthiness only, so they cannot distinguish which failure branch fired**
  Người dùng thấy gì: Một phần kiểm tra tự động khác cũng chỉ xác nhận 'có báo lỗi', chưa chắc báo đúng loại lỗi — cùng rủi ro: một thay đổi vô tình về sau có thể khiến hệ thống báo nhầm là ổn dù lỗi thật đã xảy ra.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/hinh-theo-mat-phang/evidence-report.md, _acceptance/hinh-theo-mat-phang/contract.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.