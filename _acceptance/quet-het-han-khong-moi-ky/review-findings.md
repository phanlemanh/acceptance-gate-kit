# Review findings: quet-het-han-khong-moi-ky

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Cờ vàng bảo «chạy lại với hạn dài hơn» cả khi bộ quét không hết hạn (thoát mã lỗi, bị ngắt, JSON hỏng)**
  Người dùng thấy gì: Khi bộ quét hỏng vì lý do khác hết hạn, thẻ vẫn khuyên chạy lại với thời gian chờ dài hơn, nên người đọc có thể thử một cách sửa không có tác dụng. Thẻ vẫn không mời ký nhầm, chỉ là lời chỉ đường kém chính xác.
  Căn cứ: Hậu quả nhẹ: không mất dữ liệu, không ký nhầm, người dùng thử lại một lần thấy lỗi y cũ là biết; sửa sau cũng rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Câu cờ cũ vẫn nói «hoặc bộ quét lỗi» dù giờ nó chỉ bật khi KHÔNG có lỗi quét**
  Người dùng thấy gì: Một câu cảnh báo trên thẻ còn nhắc đến «bộ quét lỗi» dù trường hợp đó nay có cảnh báo riêng, nên người đọc có thể hơi khó hiểu vì chữ thừa.
  Căn cứ: Chỉ là chữ thừa trên một cảnh báo, không đổi quyết định ký hay không; người đọc không bị hại và sửa sau rất rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Cờ bộ quét lỗi luôn bảo «chạy lại với hạn dài hơn», kể cả khi bộ quét không hết hạn**
  Người dùng thấy gì: Với các lỗi bộ quét không phải do hết giờ, thẻ vẫn chỉ sang hướng nới thời gian chờ nên người đọc mất công thử một lần vô ích.
  Căn cứ: Hậu quả nhẹ, người dùng tự nhận ra khi chạy lại, không có rủi ro mất dữ liệu hay ký nhầm; sửa sau không đắt.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 + 2: kiểu hỏng (ii) thoát mã 3 và (iii) SIGKILL chỉ được kiểm bằng phép âm «không có exit null» trên thẻ thật; câu lý do bằng chữ chỉ được ghim trên kết quả tiến trình con viết tay**
  Người dùng thấy gì: Với hai kiểu bộ quét hỏng (thoát lỗi, bị ngắt), bộ kiểm chưa chứng minh được thẻ thật in đúng câu lý do, nên nếu sau này câu đó mất thì có thể không ai biết ngay.
  Căn cứ: Hiện thẻ vẫn chạy đúng và không mời ký nhầm; rủi ro chỉ là lỗi chữ có thể lọt về sau, người dùng không mất gì và bổ sung ca đo sau rẻ.
  file: `tests/scripts/quet-het-han-khong-moi-ky.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
