## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2/3 — AC-4 (E4) so tập rút từ kho với một danh sách CHÉP TAY trong config.yaml, không rút từ Context mà lời hứa trỏ tới**
  Người dùng thấy gì: Bản phát hành này vẫn đúng: danh sách hồ sơ đã ký trong mô tả khớp với thực tế trong kho. Nhưng nếu sau này ai đó sửa danh sách ở một nơi mà quên nơi kia, bước kiểm vẫn báo xanh nên sẽ không ai biết hai nơi đã lệch nhau.
  Căn cứ: Hậu quả nhẹ vì hôm nay hai danh sách đang khớp và chỉ ảnh hưởng ghi chú phát hành chứ không ảnh hưởng người dùng cuối; người dùng không mất dữ liệu nào, và nếu lệch thì người đọc phát hiện và sửa lại được; sửa sau cũng rẻ.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
