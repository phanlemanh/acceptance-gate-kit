# Review findings: release-2-29-0 (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The new 'reinstall the package' reason hides the real reason a record still needs a person**
  Người dùng thấy gì: Khi kho có khai luật sản phẩm, bản cài thiếu mô-đun luật và hồ sơ vẫn còn lỗi thật, người dùng chỉ thấy lời dặn cài lại gói mà không thấy lỗi thật của hồ sơ. Kết luận vẫn đúng là hồ sơ còn cần người, nhưng sau khi cài lại họ sẽ bị chặn tiếp bởi một lý do khác.
  file: `scripts/khong-can-nguoi.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (danh sách mong đợi viết tay, không rút từ bên viết): AC-4 so tập rút từ kho với sáu slug gõ tay trong config, không đọc Context của contract**
  Người dùng thấy gì: Phép kiểm xem mốc này ký đúng những hồ sơ nào đang so với một danh sách gõ tay riêng, không so với danh sách ghi trong hợp đồng. Hôm nay hai danh sách khớp, nhưng nếu sau này ai đó sửa một bên mà quên bên kia thì phép kiểm vẫn báo xanh.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (sửa trên hai bộ đọc, đo một điểm): LS-13 chỉ chạy khong-can-nguoi.mjs, đường ctxLuatHoSo của start-scan.mjs không có ca**
  Người dùng thấy gì: Máy quét lúc bắt đầu vòng đã được sửa để không lặng lẽ coi hồ sơ là không cần người khi thiếu mô-đun luật, nhưng chưa có phép thử nào giữ chỗ sửa này. Nếu sau này ai đó vô tình hoàn lại cách cũ thì bộ kiểm vẫn xanh và lỗi cũ quay lại mà không ai biết.
  file: `tests/scripts/luat-san-pham.ca.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
