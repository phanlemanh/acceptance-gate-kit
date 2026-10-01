# Review findings: luot-cham-ghi-vao-cay (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **s4-args băm tệp bằng một bản sao riêng (bamTep), không gọi bam() của cay-doi.mjs, và hai bên tính khác nhau với liên kết mềm**
  Người dùng thấy gì: Nếu kho có một liên kết mềm đã bẩn từ trước và bị sửa trong lượt chấm, dù phiên chính hoàn lại đúng như cũ, hệ thống vẫn báo cây chưa hoàn lại. Người dùng chỉ thoát được bằng cách xác nhận một thay đổi có chủ đích không có thật. Ca này hiếm và chỉ làm kẹt lượt chấm, không làm sai kết quả.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **recheck-evidence chặn «cây đổi» TRƯỚC lối miễn của hồ sơ nghỉ, ngược thứ tự với lưới trước-merge**
  Người dùng thấy gì: Với một hồ sơ đã ký rồi cho nghỉ mà lượt chấm cuối từng bị cây đổi, kiểm tra trước khi gộp cho qua còn công cụ kiểm lại thì báo lỗi. Hai nơi cho hai phán quyết khác nhau trên cùng một hồ sơ cũ, gây khó hiểu nhưng không làm lọt lỗi.
  file: `scripts/recheck-evidence.cjs`
  severity: low
  Đề xuất: known-limits

- **A thước-lệch line hides the cây-đổi line from the pre-merge check and from recheck-evidence**
  Người dùng thấy gì: Khi một lượt chấm vừa có thước bị đổi vừa có mã sản phẩm bị đổi, kiểm tra trước khi gộp vẫn báo ổn và cho qua. Hồ sơ như vậy có thể được ký và gộp dù lượt chấm cuối không dùng được.
  file: `lib/nhan-canh-gay.cjs`
  severity: medium
  Đề xuất: new-contract

- **The hoàn-lại check passes when HEAD moved back to an ancestor (reset/checkout with no new commit)**
  Người dùng thấy gì: Nếu tác tử chấm lùi nhánh về một commit cũ trong lúc chấm, lần chấm lại sẽ lặng lẽ chấm một phiên bản khác với bản đã định mà không có dấu hiệu nào báo. Kết quả chấm lại có thể không ứng với bản người định ký.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: new-contract

- **bamTep in s4-args and bam in cay-doi hash symlinks differently, so a symlink that was dirty before the lượt is never seen as reverted**
  Người dùng thấy gì: Với liên kết mềm đã bẩn từ trước, hệ thống không bao giờ nhận ra là đã hoàn lại và cứ chặn lượt chấm kế tiếp. Chỉ có thể đi tiếp bằng cách xác nhận một thay đổi có chủ đích không có thật.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: kiểm âm tính đơn lẻ — nhánh «lib vắng» của LC7 không có đối chứng dương, không ghim thông điệp**
  Người dùng thấy gì: Một bài thử an toàn có thể vẫn xanh dù công cụ kiểm tra sập hẳn trên bản kit thiếu thư viện, nên người xem màu xanh có thể tin nhầm là đã chạy hết. Rủi ro nằm ở độ tin của bài thử, không làm sai kết quả cho người dùng.
  file: `tests/scripts/cay-doi-trong-luot.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1: đo chỉ dẫn thay vì đầu ra — JI11 grep mã nguồn acceptance-verify.js thay vì đọc lời giao việc thật mà judge nhận**
  Người dùng thấy gì: Bài thử khẳng định hội đồng chấm không đọc mã chỉ kiểm văn bản trong tệp nguồn, không kiểm lời giao việc thật. Nếu lời giao việc thật bị mở quyền đọc mã, bài thử vẫn có thể xanh.
  file: `tests/scripts/s4-args-judgment-inputs.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
