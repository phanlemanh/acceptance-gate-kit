## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

- **verified_at bịa số tròn, đứng SAU cả run-log lẫn commit chứa nó — tái phát lần 4**
  Người dùng thấy gì: Báo cáo bằng chứng ghi thời điểm xác nhận không đúng thật — thời điểm đó đứng trước cả lúc việc kiểm tra thực sự chạy xong và đứng sau cả thời điểm lưu hồ sơ, nên người đọc không biết chính xác khi nào việc kiểm tra thật sự hoàn tất.
  file: `_acceptance/release-2-8-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Trường output của 4 eval ĐỎ chứa lời thuật máy viết, không chứa thông điệp đỏ**
  Người dùng thấy gì: Với bốn phần việc bị đánh dấu thất bại, báo cáo không ghi lại đúng dòng lỗi thật mà chỉ chép một đoạn tóm tắt do máy tự viết, nên người đọc không thấy được lý do thất bại thật sự.
  file: `_acceptance/release-2-8-0/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **Known limits + Ngoài hợp đồng rỗng ⇒ máy tự tuyên xanh-sạch, giấu 3 mục ngoài hợp đồng khỏi người ký**
  Người dùng thấy gì: Hai mục ghi hạn chế và các phát hiện ngoài phạm vi trong báo cáo đang để trống dù các phát hiện đó đã tồn tại ở nơi khác trong hồ sơ — nếu để nguyên vậy khi một lượt phát hành sau này không còn lỗi chặn, hệ thống có thể tự coi báo cáo là sạch và bỏ qua bước mời người quyết định trên các phát hiện đó.
  file: `_acceptance/release-2-8-0/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **review-findings.md có finding trùng lặp — thẻ Cổng 2 sẽ in Ngoài-1 và Ngoài-3 y hệt nhau**
  Người dùng thấy gì: Danh sách các phát hiện ngoài phạm vi có hai mục trùng nhau, chỉ khác cách diễn đạt, khiến người duyệt bị hỏi quyết định hai lần cho cùng một vấn đề.
  file: `_acceptance/release-2-8-0/review-findings.md`
  severity: medium
  Đề xuất: known-limits

- **E3e viết thẳng lệnh thay vì khoá config — lệch nếp của 7 eval còn lại, tái phát lần 3**
  Người dùng thấy gì: Một trong các phép kiểm ghi thẳng câu lệnh thay vì dùng cấu hình dùng chung như các phép kiểm khác, nên nếu lệnh đó đổi sau này, phép kiểm sẽ không tự cập nhật theo — vấn đề này đã được ghi nhận từ hai lần phát hành trước mà chưa xử lý.
  file: `_acceptance/release-2-8-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — E1/E2/E3c/E6 hứa "ghim dòng vế của P200" nhưng phép đo thật chỉ là exit code của cả suite plugins**
  Người dùng thấy gì: Bốn tiêu chí chấp nhận về số phiên bản, dòng khớp phiên bản và mô tả phát hành đang được xác nhận chỉ bằng kết quả tổng của một bộ kiểm thử lớn, chứ không phải bằng đúng nội dung mà mỗi tiêu chí yêu cầu — nếu nội dung đó biến mất hay sai trong tương lai mà bộ kiểm thử tổng vẫn qua, các tiêu chí này vẫn có thể được báo là đạt dù thực chất sai.
  file: `_acceptance/release-2-8-0/evals.yaml`
  severity: high
  Đề xuất: known-limits
