# Review findings: nen-dieu-kien-va-static-khong-do-duoc (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): NEN-DK6 tuyên «không mục KHÔNG thẻ nào nạp TĨNH tệp mang thẻ», nhưng bộ dò chỉ bắt dạng import một dòng, và đột biến duy nhất cũng là dạng một dòng**
  Người dùng thấy gì: Máy kiểm tự động chỉ nhận ra một kiểu viết lệnh nạp tệp. Nếu sau này có người viết theo kiểu khác (xuống dòng hoặc xuất lại), một tệp có thể nạp nhầm tệp tuỳ chọn mà máy vẫn báo xanh, và kho không dùng tính năng đó sẽ bị lỗi khi chạy. Hiện chưa có chỗ nào viết như vậy nên chưa ai bị ảnh hưởng.
  file: `tests/scripts/duong-nen.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
