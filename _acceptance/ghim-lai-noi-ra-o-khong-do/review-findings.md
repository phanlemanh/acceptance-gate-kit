## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **`--skip-unchanged` bỏ qua đúng lượt mà `evals_not_machine_touched` vừa được dựng để nói ra — hai vị từ mâu thuẫn trong CÙNG một tệp**
  Người dùng thấy gì: Chế độ ghim lại nhanh (dùng khi làm nhiều lô phát hành) có thể không phát hiện được các thay đổi giao diện người dùng chưa được kiểm tra lại, khiến bản chốt cũ vẫn được giữ mà không có cảnh báo nào.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: high
  Đề xuất: known-limits

- **E12 chép lại nguyên năm lệnh của `feature_loop.suite_keys` vào một eval, vô hiệu hoá dedupe của làn; GN13 một mình 67 s vào mọi lượt chạy suite scripts**
  Người dùng thấy gì: Một số bước kiểm tra tự động có thể bị chạy lại nhiều lần không cần thiết trong mỗi lượt ghim lại, làm tốn thêm thời gian máy mà không ảnh hưởng đến kết quả đúng hay sai.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Cờ `evals_not_machine_touched` ở thẻ Cổng Bằng chứng bị XOÁ bởi lượt ghim kế — không cần chứng lại gì**
  Người dùng thấy gì: Cảnh báo 'còn thay đổi giao diện chưa được kiểm chứng lại' có thể tự biến mất sau một lượt ghim sạch tiếp theo, dù chưa ai thực sự xem lại thay đổi đó — đây là hành vi đã được biết và ghi nhận từ trước, không phải lỗi mới phát sinh.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Gộp AC theo `criterion` THÔ (không strip comment/nháy) → tách một AC thành hai nhóm, báo sai «AC không có chốt máy»**
  Người dùng thấy gì: Nếu tiêu chí chấp nhận trong hồ sơ có kèm chú thích hoặc dấu nháy, công cụ có thể báo sai rằng tiêu chí đó chưa có kiểm tra máy — đây là hạn chế đã được ghi nhận trước đó, chưa từng gặp trong dữ liệu thực tế.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Assert chuỗi-vắng-mặt trong khi lời hứa là QUAN HỆ mã-thoát (GN08 bỏ cả `exit 0` lẫn «không NOTE mới»)**
  Người dùng thấy gì: Một bài kiểm tra tự động cho một tiêu chí chấp nhận chỉ kiểm một phần lời hứa (không kiểm đầy đủ việc thoát đúng mã và không có cảnh báo mới), nên trong một số tình huống lỗi thật ở tầng đọc kết quả có thể lọt qua mà không bị phát hiện.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Assert «chuỗi có mặt» trong khi lời hứa là cờ CÓ HẠNG (`finfo`) — GN09/GN10 không đo hạng cờ**
  Người dùng thấy gì: Một số bài kiểm tra chỉ so khớp nội dung chữ trên thẻ mà không kiểm mức độ nghiêm trọng của cảnh báo (thông tin thường hay cảnh báo cần chú ý), nên nếu công cụ vô tình đổi mức độ cảnh báo, bài kiểm tra sẽ không phát hiện ra.
  file: `tests/scripts/repin-lane-noi-ra.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Eval khai một phép đo KHÔNG tồn tại trong ca: E7 nói GN07 «kiểm làn import globToRe từ ./carry-plan.mjs»**
  Người dùng thấy gì: Mô tả của một bài kiểm tra tự nhận là kiểm cách viết mã nguồn, nhưng thực tế chỉ kiểm kết quả đầu ra — đây là hạn chế đã được ghi nhận trước đó.
  file: `_acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, _acceptance/ghim-lai-noi-ra-o-khong-do/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.