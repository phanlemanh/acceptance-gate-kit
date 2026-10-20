# Review findings: release-2-33-1

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **dieu-phoi manifest description still says five hook blocks, but the 2.33.1 package ships six**
  Người dùng thấy gì: Người cài gói điều phối ở bản 2.33.1 vẫn đọc dòng giới thiệu cũ, nói năm khối hook và không nhắc lệnh «tin» mới. Gói chạy đúng, chỉ phần mô tả lúc cài đặt nói thiếu so với thực tế.
  Căn cứ: Hậu quả nhẹ: chỉ lệch chữ giới thiệu, không mất dữ liệu, không ảnh hưởng hành vi, và sửa ở bản sau rất rẻ.
  file: `dieu-phoi/.claude-plugin/plugin.json`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay thay cho round-trip từ bên viết): E4/AC-4 so với bản chép tay danh sách trong Context, không đọc chính Context**
  Người dùng thấy gì: Bước kiểm danh sách hồ sơ của bản phát hành so với một bản chép tay, nên nếu mô tả trong hợp đồng bị sửa lệch sau này thì bước kiểm vẫn báo xanh. Hiện tại hai bên đang khớp nhau nên người dùng chưa gặp sai lệch nào.
  Căn cứ: Không ảnh hưởng người dùng cuối hôm nay vì số liệu đang khớp; rủi ro chỉ xuất hiện nếu ai đó sửa một bên mà quên bên kia, và đây là lớp lỗi cũ đã khai ở các mốc trước.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
