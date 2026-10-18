# Review findings: release-2-33-0 (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2 (danh sách mong đợi viết tay, không rút từ bên viết): E4 hứa so với tập kể trong Context nhưng lệnh so với danh sách slug gõ tay trong khoá config**
  Người dùng thấy gì: Kiểm tra danh sách hồ sơ được ký trong bản phát hành này đang so với một danh sách gõ tay, không đọc lại phần kể trong hợp đồng. Hôm nay hai danh sách khớp nhau. Nếu sau này ai sửa phần kể mà quên sửa danh sách gõ tay, kiểm tra vẫn báo xanh và có thể che một chỗ lệch.
  Căn cứ: Kết quả hôm nay đúng và không ảnh hưởng người dùng; chỉ là một chỗ kiểm tra có thể bỏ sót lệch trong tương lai, ghi lại làm giới hạn đã biết là đủ.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (danh sách mong đợi viết tay, không rút từ bên viết): E7 hứa «như CHANGELOG 2.33.0 kể» nhưng so với chuỗi hằng trong lệnh**
  Người dùng thấy gì: Kiểm tra hai gói chỉ đổi số phiên bản không đối chiếu với lời kể trong ghi chú phát hành, chỉ đối chiếu với một chuỗi viết sẵn. Nếu ghi chú kể khác đi, kiểm tra vẫn xanh. Người dùng hôm nay không bị ảnh hưởng vì thực tế hai gói chỉ đổi số.
  Căn cứ: Mức nhẹ, không làm mất hay sai gì cho người dùng, và dựng thêm phép đối chiếu cho một lời kể ngắn tốn hơn nhiều so với rủi ro nó chặn.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
