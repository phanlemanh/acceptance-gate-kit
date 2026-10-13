## Trong hợp đồng

Không có finding nào trong hợp đồng ở round 2.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Assertion âm-tính-một-mình (hình dạng 4), mới vá một nửa: ba ca đỏ KH-04-do chỉ ghim nhãn hàng, không ghim thông điệp**
  Người dùng thấy gì: Bài kiểm tra bảo vệ dải trạng thái đợt có ba ca thử lỗi chỉ kiểm tra là hàng đúng bị báo đỏ, chưa kiểm tra lý do đỏ là đúng. Nếu bộ vẽ dải hỏng hẳn, ba ca này vẫn báo đỏ như thể đã bắt đúng lỗi. Người dùng không thấy gì khác đi, nhưng thước đo kém chặt hơn so với vẻ ngoài.
  file: `tests/dieu-phoi/khung.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Mod giờ import mo-hinh.mjs nhưng điều kiện «không import gì» chỉ có răng cho khung.mjs; mo-hinh.mjs không có răng, cũng không có lời nhắc (r1)**
  Người dùng thấy gì: Hôm nay dải trạng thái đợt vẫn chạy đúng. Nhưng nếu sau này ai đó sửa một tệp lõi dùng chung mà không biết mod phụ thuộc vào nó, dải có thể ngừng hiện. Bộ kiểm tự động sẽ không báo, chỉ đến lượt chấm có Claude Code mới lộ ra.
  file: `dieu-phoi/hooks/mod/khung.ts`
  severity: medium
  Đề xuất: known-limits

- **Ca đỏ KH-05/06/07 trong kiem-khung.mjs không đợi bản lành xanh, trái với KH-08/KH-09 cùng tệp và với invariant đối chứng dương (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi bộ kiểm tra tự hỏng, một số dòng báo «đã bắt đúng lỗi» vẫn có thể hiện màu xanh dù chưa thật sự chạy. Kết luận tổng vẫn đỏ, nhưng người đọc từng dòng riêng lẻ có thể bị đánh lừa.
  file: `tests/dieu-phoi/kiem-khung.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca đỏ KH-05/06/07 không gác bằng đối chứng dương: dòng PASS «-do» vẫn in ra khi bản lành cũng fail đúng ca đó (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một dòng chứng minh «bắt đúng lỗi» có thể hiện xanh dù ca đó vốn chưa bao giờ chạy đúng. Phán quyết cuối vẫn đúng, chỉ có dòng bằng chứng lẻ là không đáng tin.
  file: `tests/dieu-phoi/kiem-khung.mjs`
  severity: low
  Đề xuất: known-limits

- **Vòng nhịp của mod tự tắt mà không báo khi bước ngoài try ném lỗi; dải giữ dữ liệu cũ vô hạn (r1)**
  Người dùng thấy gì: Nếu có một lỗi hiếm xảy ra trong vòng làm mới, dải trạng thái sẽ đứng yên ở số liệu cũ mà không báo gì. Người dùng có thể tưởng đó là trạng thái hiện tại của đợt.
  file: `dieu-phoi/hooks/mod/khung.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim là chữ test tự in): dòng KH-06-do chu-ky «nêu 120000» là hằng chuỗi, không lấy từ đầu ra plugin test (r1 · tệp đã đổi)**
  Người dùng thấy gì: Dòng chứng minh rằng việc đổi chu kỳ sẽ bị bắt có thể luôn hiện cùng một con số, kể cả khi ca đỏ vì lý do khác. Người đọc khó biết đó là bằng chứng thật hay chữ in sẵn.
  file: `tests/dieu-phoi/kiem-khung.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
