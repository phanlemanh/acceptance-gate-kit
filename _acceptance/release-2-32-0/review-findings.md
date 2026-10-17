## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

(không có mục mới ở round này; hai mục mang từ round trước do máy tự chèn)

- **Hình dạng 3 (và 2): AC-7 hứa quan hệ «tập tệp đổi = tập CHANGELOG kể», nhưng phép đo so với một danh sách gõ tay (r1)**
  Người dùng thấy gì: Lời kể trong ghi chú phát hành về các tệp đã đổi hiện khớp với thực tế. Nhưng nếu sau này ai sửa lời kể mà quên sửa danh sách đối chiếu, phép kiểm vẫn báo đạt dù hai bên đã lệch nhau.
  Căn cứ: Hậu quả nhẹ: ghi chú hiện đúng, chỉ có nguy cơ lệch về sau, người đọc ghi chú không mất dữ liệu và việc siết lại phép kiểm có thể làm ở mốc sau mà không ảnh hưởng người dùng hôm nay.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: AC-4 hứa so với danh sách «được ký» trong Context, nhưng tập mong đợi là tám slug chép tay vào config, không rút từ hợp đồng (r1)**
  Người dùng thấy gì: Danh sách tám vòng đã ký trong phần mô tả hiện khớp với thực tế của kho. Nếu về sau mô tả hoặc danh sách đối chiếu bị sửa lệch nhau, phép kiểm vẫn không báo lỗi.
  Căn cứ: Hậu quả rất nhẹ: hai danh sách hiện trùng nhau, mức độ chỉ là rủi ro lệch trong tương lai, không ảnh hưởng người dùng nhận bản phát hành này và sửa sau không tốn kém.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
