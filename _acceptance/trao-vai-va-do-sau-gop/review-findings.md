# Review findings: trao-vai-va-do-sau-gop (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **TC1b-05 chỉ chặn sha chấm vắng; SHA_MOC vắng thì ca đỏ thay vì bỏ qua có tên**
  Người dùng thấy gì: Trên một bản sao kho cắt ngắn lịch sử ở đúng khoảng giữa hai mốc, phép kiểm này báo đỏ với thông báo khó hiểu thay vì ghi rõ là bỏ qua. Người dùng không mất dữ liệu và bản dựng của kho bình thường không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ: chỉ xảy ra ở bản sao lịch sử bị cắt ngắn, kho dùng bản sao đầy đủ thì không gặp, không mất dữ liệu và chạy lại trên bản sao đầy đủ là hết.
  file: `tests/dieu-phoi/trao-vai.test.mjs`
  severity: low
  Đề xuất: known-limits

- **TC1b-05 khong-doc-cay chỉ chặn sha chấm vắng; SHA_MOC vắng thì đỏ giả thay vì bỏ qua có tên**
  Người dùng thấy gì: Trên một bản sao kho cắt ngắn lịch sử ở đúng khoảng giữa hai mốc, phép kiểm báo đỏ giả thay vì ghi là bỏ qua. Người dùng chỉ thấy một cảnh báo gây nhầm, không mất gì.
  Căn cứ: Hậu quả nhẹ và hẹp: hệ thống kiểm của kho lấy lịch sử đầy đủ nên không gặp, không mất dữ liệu, và người dùng tự gỡ bằng cách lấy lại lịch sử đầy đủ rồi chạy lại.
  file: `tests/dieu-phoi/trao-vai.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
