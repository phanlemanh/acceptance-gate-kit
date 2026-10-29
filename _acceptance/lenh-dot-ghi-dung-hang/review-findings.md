# Review findings: lenh-dot-ghi-dung-hang (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **`hang them <mã|slug lộ trình>` now writes `ma` onto the added hàng, so the bộ phát lịch holds it at Cổng Đáng instead of delivering it (breaks the T15 invariant in the.mjs)**
  Người dùng thấy gì: Khi giám sát thêm giữa đợt một hàng lấy từ lộ trình, hàng đó có thể bị lịch giữ lại chờ duyệt thay vì được giao cho thợ, và trên thẻ không có dòng nào nói vì sao. Dãy cứ đứng yên cho tới khi có người để ý.
  Căn cứ: Hậu quả khá nặng vì việc thêm xong mà không được giao và không báo lý do, nhưng không mất dữ liệu và giám sát gỡ được bằng cách duyệt hàng thủ công; sửa đúng cách phải quyết lại luật đọc chung của lịch nên đáng một việc riêng chứ không nên nhét thêm vào vòng này.
  file: `dieu-phoi/scripts/hang.mjs`
  severity: high
  Đề xuất: new-contract

- **Phép đọc risk_tier T1 của bộ phát lịch chặt hơn cổng: T1 có ngoặc kép hoặc chữ thường không được tính là đã gộp**
  Người dùng thấy gì: Ở kho nào ghi mức rủi ro T1 kiểu có ngoặc kép hoặc chữ thường, hàng đã gộp vẫn bị lịch coi là đang làm nên dãy không tiến tiếp, và không có cảnh báo. Kho viết đúng dạng chuẩn thì không bị.
  Căn cứ: Chỉ ảnh hưởng kho viết khác dạng chuẩn, không mất dữ liệu, và chủ kho tự gỡ được bằng cách sửa dòng mức rủi ro về dạng chuẩn; ghi thành hạn chế đã biết là đủ cho tới khi có kho gặp thật.
  file: `dieu-phoi/scripts/phat-lich.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
