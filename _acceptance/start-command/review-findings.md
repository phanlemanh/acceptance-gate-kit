## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Chân đột biến E11 (GUIDE) trong P101 là phép đo không thể đỏ**
  Người dùng thấy gì: Có một bài kiểm chưa bao giờ thật sự có khả năng phát hiện lỗi tài liệu liên quan — dù tài liệu đó sai thế nào, báo cáo kiểm vẫn luôn báo "qua", nên một sai sót tài liệu ở đây có thể không được cảnh báo.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:3103`
  severity: low
  Đề xuất: known-limits

- **read() nuốt mọi lỗi I/O — contract.md unreadable bị coi là 'không tồn tại', slug bị phân ô sai hoàn toàn im lặng**
  Người dùng thấy gì: Nếu file hợp đồng của một tính năng bị mất quyền đọc, lệnh có thể lặng lẽ bỏ nó ra khỏi danh sách đang chờ chữ ký, hoặc báo sai lý do (nói là không có file dù file vẫn ở đó) — người dùng có thể không biết có việc đang chờ mình quyết định.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/start-scan.mjs:27`
  severity: medium
  Đề xuất: known-limits

- **Nhánh status=implemented nhận verdict ngoài từ vựng im lặng (FAIL → S4), trong khi nhánh verified cùng verdict thì flag broken**
  Người dùng thấy gì: Khi báo cáo bằng chứng ghi một kết quả không hợp lệ, có tình huống lệnh vẫn lặng lẽ đề nghị bước kế tiếp như bình thường thay vì báo cho người dùng biết có gì đó bất thường cần xem lại trước.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/start-scan.mjs:77`
  severity: low
  Đề xuất: known-limits

- **--root thiếu giá trị hoặc trỏ đường dẫn sai âm thầm rơi về hành vi khác — không phân biệt được với repo chưa acceptance-init**
  Người dùng thấy gì: Nếu gõ sai đường dẫn khi gọi lệnh quét, người dùng có thể nhận thông báo "repo này chưa dựng cổng nghiệm thu" dù repo thật ra có đầy đủ, gây hiểu lầm về trạng thái dự án.
  file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/start-scan.mjs:21`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).