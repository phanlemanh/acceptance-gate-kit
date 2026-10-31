# Review findings: pre-merge-doc-lib-theo-kit (round 2)

## Trong hợp đồng

(không có finding nào map vào AC ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bản tiếng người trên thẻ (card-plain) vẫn nói «sáu cách viết» trong khi hợp đồng, evals và test đã lên bảy hình dạng (r1)**
  Người dùng thấy gì: Thẻ người đọc ở cổng cuối còn ghi «sáu cách viết» trong khi phép kiểm thật đã chạy bảy cách. Người ký thấy một con số cũ hơn thực tế, nhưng kết luận đạt hay không không đổi.
  Căn cứ: Chỉ là một con số chữ lệch trên thẻ, không làm mất hay sai dữ liệu của ai, người ký đọc kết quả kiểm bên cạnh là thấy số đúng, và sửa sau rất rẻ khi sinh lại thẻ.
  file: `_acceptance/pre-merge-doc-lib-theo-kit/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Thẻ người đọc vẫn ghi «sáu cách viết», trong khi hợp đồng và thước nay là bảy hình dạng (r1)**
  Người dùng thấy gì: Thẻ người đọc hứa «sáu cách viết» còn hợp đồng và phép kiểm đã là bảy, nên thẻ nói ít hơn thực tế. Kết quả kiểm vẫn đúng, chỉ lời mô tả trên thẻ cũ.
  Căn cứ: Hậu quả nhẹ vì chỉ lời mô tả trên thẻ cũ, phép kiểm thật đã xanh đủ, không ai mất dữ liệu, và có thể cập nhật thẻ bất cứ lúc nào mà không đụng tới sản phẩm.
  file: `_acceptance/pre-merge-doc-lib-theo-kit/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng ma trận thiếu phần tử): nhánh `scripts/` của ba mẫu quét không có hình dạng nào trong ma trận (r1)**
  Người dùng thấy gì: Phép kiểm chưa từng thử cố ý làm hỏng nửa «scripts» của lớp lỗi này, nên nếu sau này nửa đó bị lỏng đi thì phép kiểm vẫn báo xanh. Hôm nay mã thật không có chỗ nào sai kiểu đó, nên người dùng chưa gặp gì.
  Căn cứ: Rủi ro chỉ xuất hiện nếu về sau ai đó vô tình viết sai kiểu này ở nhánh còn lại, hiện chưa có ca nào, người dùng không mất dữ liệu, và thêm ca thử sau khá rẻ nên ghi lại là đủ.
  file: `tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (điểm-case thay cho ma trận): mẫu 3 khai năm vị trí lệnh mà ma trận chỉ thử `$(`; còn chiều im «không khớp lời báo lỗi» không có ca riêng (r1)**
  Người dùng thấy gì: Phép kiểm mới thử một trong năm chỗ có thể viết lệnh sai, và chưa có ca riêng chứng minh nó không báo oan khi chỉ gặp chữ trong một lời báo lỗi. Người dùng không thấy gì hôm nay; rủi ro là về sau phép kiểm bỏ sót hoặc báo thừa mà không ai hay.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra với ai, chỉ làm phép kiểm kém chặt hơn mức tuyên bố, người dùng không mất dữ liệu, và bổ sung thêm ca thử sau này không đắt.
  file: `tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
