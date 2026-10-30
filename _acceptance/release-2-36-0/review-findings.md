# Review findings: release-2-36-0 (round 1)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2/3: E4 (AC-4) so tập rút từ kho với danh sách slug chép tay vào config, không phải với Context của hợp đồng**
  Người dùng thấy gì: Danh sách sáu hồ sơ của bản phát hành được kiểm theo một bản chép riêng, không theo đúng chỗ ghi trong hợp đồng. Nếu sau này ai sửa một bên mà quên bên kia thì phép kiểm vẫn báo xanh, nên người ký có thể tin nhầm là danh sách khớp.
  Căn cứ: Hôm nay hai bản trùng nhau nên người dùng không bị ảnh hưởng gì; rủi ro chỉ xuất hiện khi sau này có người sửa lệch một bên, và lúc đó chỉ cần đối chiếu lại bằng tay, sửa sau không đắt.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
