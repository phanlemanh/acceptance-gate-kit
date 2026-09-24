## Trong hợp đồng

Không có phát hiện nào ánh xạ được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khuôn /goal mới không có điểm kết cho lối đi thẳng của làn V (xanh-sạch → machine-cleared → S5)**
  Người dùng thấy gì: Khi một tính năng tự chạy xong theo đường tự động (không cần người duyệt), hệ thống có thể không nhận ra là đã xong và treo phiên làm việc chờ vô ích thay vì dừng gọn gàng.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **Thẻ Cổng 1 của hồ sơ đã khép vẫn in nút «Sửa lại / Duyệt, cho code»**
  Người dùng thấy gì: Trên một hồ sơ đã coi là khép, màn hình quyết định vẫn hiện nút Duyệt và Sửa lại như thể vẫn cần bấm, có thể khiến người dùng bấm nhầm vào một việc không còn cần làm.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Nhánh Cổng 1 bỏ qua lỗi và kết quả «hỏng» của bộ quét, không bật cờ như nhánh Cổng 2**
  Người dùng thấy gì: Nếu công cụ tự động kiểm tra trạng thái hồ sơ bị lỗi ngầm, màn hình quyết định vẫn hỏi duyệt hay sửa như bình thường mà không báo cho người biết kết quả kiểm tra có thể không đáng tin.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **GUIDE còn một câu cũ: «chỉ đặt goal tới transcript xác nhận verified hoặc trạng thái escalate»**
  Người dùng thấy gì: Tài liệu hướng dẫn nội bộ còn sót một câu chỉ dẫn cũ, mâu thuẫn với quy tắc mới về khi nào một vòng làm việc được coi là xong, có thể khiến người đọc làm theo hướng dẫn sai.
  file: `GUIDE.md`
  severity: low
  Đề xuất: known-limits

- **s4-args treats an in-contract finding that the engine itself refuses to REJECT on as disqualifying, so the round is counted toward the cap**
  Người dùng thấy gì: Khi công cụ chấm điểm tự động gặp trục trặc nội bộ giữa chừng, hệ thống có thể vẫn tính đó là một lượt cần sửa và tốn thêm một vòng thử, đúng kiểu lãng phí mà cải tiến này vốn để khắc phục.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: new-contract

- **Gate 1 card silently drops a scanner failure and falls back to asking «duyệt hay sửa» with no warning**
  Người dùng thấy gì: Nếu công cụ tự động kiểm tra trạng thái hồ sơ gặp lỗi ngầm, màn hình quyết định của một nhánh cổng vẫn lặng lẽ quay về hỏi duyệt hay sửa như bình thường, không có cảnh báo nào cho người biết kết quả kiểm tra có thể sai.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): vế «SKILL không còn coi chờ input người là hoàn thành» của HT-AC6 không có chiều đỏ**
  Người dùng thấy gì: Bộ kiểm tra tự động cho một quy tắc tài liệu có thể không phát hiện được nếu sau này ai đó vô tình đưa lại một câu hướng dẫn sai, dù quy tắc đó hiện đang đúng.
  file: `tests/scripts/htkd.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không đối chứng dương): hàng g1-nghi-chua-ky của AC-7 không đo vị từ hoSoDaKhep mà nó tuyên đo**
  Người dùng thấy gì: Một trong các phép kiểm tra tự động cho việc hồ sơ đã khép thì thôi hỏi có thể không thực sự chạm đúng phần nó tuyên bố kiểm tra, nên nếu logic đó bị hỏng sau này, bộ kiểm tra có thể không bắt được.
  file: `tests/scripts/htkd.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: HT-AC5-dot-bien và P85 chỉ phá hai trong các tính chất âm của khuôn /goal, các tính chất âm còn lại chưa từng đỏ**
  Người dùng thấy gì: Một số ràng buộc về nội dung khuôn mẫu mục tiêu hiện chưa có phép thử tự động xác nhận nó thực sự bị bắt lỗi khi vi phạm, dù hiện tại nội dung đang đúng.
  file: `tests/scripts/htkd.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim đúng thông điệp): HT-AC1-dot-bien không assert tên tệp bị sót, chỉ assert tiền tố**
  Người dùng thấy gì: Phép thử cho việc chia nhỏ tệp kiểm thử có thể báo đạt ngay cả khi tệp bị bỏ sót không phải là tệp thực sự cần được phát hiện, miễn là có bất kỳ tệp nào bị bỏ sót.
  file: `tests/scripts/htkd.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
