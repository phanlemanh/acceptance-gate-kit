## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A third copy of the glob matcher, globToRe in acceptance-verify.js, still reads [[] literally, so the s4-args writer and the acceptance-verify reader now disagree**
  Người dùng thấy gì: Khi một eval khai đường dẫn kiểu thư mục [slug] bằng cách viết thoát ngoặc, bước kiểm S4 có thể coi các tệp lỗi nằm ngoài phần thay đổi là «ngoài vùng phủ». Hệ quả là nó có thể báo nhầm một cụm lỗi và gọi người ở Cổng Bằng chứng một lần thừa.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Third globToRe copy in acceptance-verify.js was not given the [[]/[]] idioms, so the S4 writer and reader now give different answers**
  Người dùng thấy gì: Với đường dẫn viết thoát ngoặc, hai nửa của bước kiểm S4 có thể cho hai đáp án khác nhau về một tệp có thuộc vùng đã khai hay không. Kết quả là người có thể bị gọi thêm một lần vì cảnh báo cụm lỗi không có thật, và các tệp lẽ ra được miễn thì lại không được miễn.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 2/2 lỗi rơi vào file không bộ đo nào phủ (feature-loop/workflows/acceptance-verify.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
