# Hạt giống: khoá lộ trình có mặt mà không đọc ra tệp nào thì phải cờ, không được im

Ngày: 2026-10-03 · Nguồn: Cổng Bằng chứng lượt 2 của `_acceptance/lo-trinh-tren-du-lieu-that/`
(owner ký, Ngoài-2 và Ngoài-3: «mở hợp đồng mới») · Đây là SỔ, không phải ô — ô chỉ mở khi có neo
ngoài (luật 18/09).

## Ngoài-2 — lớp lỗi «khai đúng mà kit im lặng coi như chưa khai», lần thứ hai

- Lượt 1 bắt: dòng chú thích sát lề trong khối `lo_trinh:` làm bộ đọc trả «vắng». Đã sửa bằng cách bỏ
  qua chú thích (AC-13 của hồ sơ trên).
- Lượt 2 bắt: danh sách YAML hợp lệ viết sát dưới `tep:` (`  tep:\n  - docs/a.json`, kiểu mặc định của
  PyYAML) cũng làm bộ đọc trả «vắng». Thẻ start, bản đồ và S0 đều coi như kho chưa khai, không cảnh báo.
- Hai lần cùng một lớp: vá thêm từng kiểu viết là đi tiếp một khuôn giải sai (luật dừng-vá). Nghiệm
  đúng tầng: **khoá `lo_trinh.tep` có mặt trong config mà bộ đọc không rút ra được tệp nào → trạng thái
  «khai mà không đọc được» kèm một dòng cờ trên thẻ và trang**, không bao giờ «vắng». Chiều đỏ: bảng
  hình dạng YAML hợp lệ (chuỗi · khối thụt · khối sát · dòng · rỗng · null) — mỗi hình dạng hoặc ra
  danh sách đúng, hoặc ra cờ; không hình dạng nào ra «vắng» khi khoá có mặt.

## Ngoài-3 — hàng slug sai dạng + nhiều hồ sơ nhận vẫn được gợi ý làm việc kế

- Nhánh «slug không hợp lệ» của bộ đọc đặt «Chưa mở» trước khi xét người nhận, nên hàng ấy vẫn có thể
  là hàng kế; bấm mở thì lệnh từ chối vì nhiều hồ sơ nhận — lý do mà trang và thẻ chưa từng in.
- Nghiệm: xét người nhận trước nhánh slug sai dạng, cùng thứ tự ưu tiên ở design §2 của hồ sơ trên.

## Ngưỡng mở ô

Một kho tiêu thụ khai lộ trình thật mà gặp một trong hai ca (đếm ở phiên nghiệm thu hoặc báo cáo của
kho). Chưa có kho nào khai lộ trình trước mốc 2.21.0.
