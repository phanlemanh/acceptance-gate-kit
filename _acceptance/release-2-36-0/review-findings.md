## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 3 — lời hứa «mốc thời gian của lời nhắn <synthetic> vẫn vào giờ máy» không được đo: fixture đặt lời nhắn ở chỗ không phân biệt được**
  Người dùng thấy gì: Báo cáo giờ máy đã bỏ đúng phần lượng dùng của lời nhắn tự sinh. Nhưng nếu sau này có người lỡ bỏ luôn cả mốc thời gian của lời nhắn đó, bộ kiểm tra vẫn báo xanh, nên giờ máy có thể lệch nhẹ mà không ai hay.
  Căn cứ: Hậu quả nhẹ: chỉ có thể làm lệch nhẹ số giờ máy trong báo cáo, không mất dữ liệu, và sai lệch chỉ xuất hiện nếu có người sửa nhầm sau này. Ghi thành giới hạn đã biết thì rẻ, còn bổ sung ca kiểm thì để vòng sau.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2/3: E4 (AC-4) so tập rút từ kho với danh sách slug chép tay vào config, không phải với Context của hợp đồng (r1)**
  Người dùng thấy gì: Danh sách sáu hồ sơ của bản phát hành được kiểm theo một bản chép riêng, không theo đúng chỗ ghi trong hợp đồng. Nếu sau này ai sửa một bên mà quên bên kia thì phép kiểm vẫn báo xanh, nên người ký có thể tin nhầm là danh sách khớp.
  Căn cứ: Hôm nay hai bản trùng nhau nên người dùng không bị ảnh hưởng gì; rủi ro chỉ xuất hiện khi sau này có người sửa lệch một bên, và lúc đó chỉ cần đối chiếu lại bằng tay, sửa sau không đắt.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
