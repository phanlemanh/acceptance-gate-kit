## Trong hợp đồng

(không có phát hiện trong hợp đồng ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **BC1b reimplements BC1's check instead of calling it, and prints its own «ma trận hụt» message**
  Người dùng thấy gì: Phép thử kiểm tra việc bộ đọc có đánh rơi trường hay không có một ca "thử cho đỏ" chưa chắc chắn. Nếu ai đó vô tình gỡ chốt chặn kiểm tra số lượng, cả hai ca đều vẫn xanh nên sẽ không ai biết. Hôm nay chốt đó còn nguyên và ca chính vẫn chạy được.
  file: `tests/scripts/evals-sat-le.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **BC1b's red check never runs BC1, so it cannot catch BC1 losing its guard**
  Người dùng thấy gì: Ca "thử cho đỏ" của phép kiểm tra đủ trường tự in dòng báo lỗi của riêng nó chứ không do phép kiểm tra thật in ra. Nếu phép kiểm tra thật bị gỡ nhầm trong tương lai, hệ thống vẫn báo xanh và sẽ không cảnh báo người dùng việc trường danh sách bị rơi mất.
  file: `tests/scripts/evals-sat-le.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — ma trận BC1 «viết trước» chỉ ghim SỐ LƯỢNG (18), không ghim TẬP phần tử; thay một trường giữ nguyên 18 thì BC1 vẫn xanh**
  Người dùng thấy gì: Phép thử chỉ đếm tổng số mục cần đọc đủ chứ chưa đối chiếu từng tên trường. Nếu có người thay một trường danh sách bằng trường khác mà tổng không đổi, hệ thống có thể vẫn báo đủ trong khi một loại thông tin thật sự không còn được đọc.
  file: `tests/scripts/evals-sat-le.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **A multi-line flow list is flagged as "khai mà rỗng" on both gate cards and at S4 (r1)**
  Người dùng thấy gì: Nếu một hồ sơ viết danh sách tệp bằng ngoặc vuông trải nhiều dòng, thẻ và lượt chấm vẫn đọc như trước nhưng báo cờ vàng rằng danh sách «rỗng», dù thật ra có mục. Người viết có thể sửa nhầm chỗ, nhưng kết quả chấm không đổi.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **args.canhBaoDanhSach is written but nothing reads it, and it is missing from the workflow's args header (r1)**
  Người dùng thấy gì: Cảnh báo về danh sách không đọc được hiện chỉ đến người duyệt qua thẻ ở hai cổng, chưa đi vào báo cáo bằng chứng của lượt chấm. Người duyệt vẫn thấy cờ, chỉ thiếu một chỗ nhắc nữa.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **evalListsOf treats a `- id:` line inside a block scalar as a new eval, so the real eval's list fields are silently dropped (regression in s4-args) (r1)**
  Người dùng thấy gì: Nếu một tiêu chí có đoạn văn nhiều dòng mà bên trong có dòng trông như khai báo tiêu chí mới, các danh sách đầu vào và vùng tệp của tiêu chí thật sẽ bị bỏ qua mà không có cảnh báo. Hiện chưa kho nào viết như vậy nên chưa ai bị ảnh hưởng.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
