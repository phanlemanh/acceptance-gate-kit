# Review findings: lo-trinh-tren-du-lieu-that (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hai lối thoát mới của lệnh mở việc nằm ngoài bảng S0-MO-O-THOAT, và bảng cho người đọc sai cách gỡ**
  Người dùng thấy gì: Khi một mã hàng bị trùng ngay trong cùng một tệp lộ trình, hướng dẫn kèm theo bảo người dùng gọi lại bằng «tệp:mã», nhưng cách đó vẫn báo lỗi; cách gỡ đúng là sửa tệp lộ trình. Người dùng có thể làm theo chỉ dẫn mà không đi được tới đâu, nhưng không mất dữ liệu nào.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **A YAML list written flush under `tep:` makes the roadmap setting vanish without any warning**
  Người dùng thấy gì: Nếu kho viết danh sách tệp lộ trình theo kiểu YAML hợp lệ nhưng không thụt vào, kit coi như kho chưa khai lộ trình: thẻ start và bản đồ không hiện gì và cũng không có cảnh báo nào. Người dùng sẽ thấy lộ trình biến mất mà không biết vì sao.
  file: `scripts/lo-trinh-khoa.cjs`
  severity: medium
  Đề xuất: known-limits

- **Row with an invalid slug and two or more receiving dossiers is still offered as the next row; opening it then fails**
  Người dùng thấy gì: Một hàng khai tên thư mục sai chỗ, đồng thời có hai hồ sơ cùng nhận, vẫn được gợi ý làm việc kế tiếp; khi người dùng chọn mở thì bị từ chối với lý do mà trang và thẻ chưa từng nêu. Người dùng mất một lượt chọn vô ích và khó hiểu vì sao.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: new-contract

- **Assertion âm-tính-một-mình (hình 4): LT-81 so đẳng thức hai đầu ra của cùng bộ đọc mà không neo bản sạch, nên bộ đọc trả null cho mọi đầu vào vẫn xanh**
  Người dùng thấy gì: Phép kiểm tra việc đọc cấu hình lộ trình có thể vẫn báo xanh ngay cả khi phần đọc hỏng và trả về rỗng cho mọi kho. Sản phẩm hiện đang đúng, nhưng nếu sau này hỏng theo kiểu đó thì phép kiểm tra sẽ không báo.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình 4, vế b): LT-84-do chỉ ghim mã thoát 2, không ghim thông điệp**
  Người dùng thấy gì: Phép kiểm tra việc từ chối giá trị owner rỗng chỉ xác nhận lệnh bị từ chối, không xác nhận đúng lý do. Nếu lệnh bị từ chối vì lý do khác, phép kiểm tra vẫn báo là đã bắt đúng lỗi.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **A one-line change to the signed viec-ke-theo-plan dossier puts it in this PR's diff, so the CI gate now blocks the merge (r1)**
  Người dùng thấy gì: Một dòng sửa vào hồ sơ của vòng trước (đã được ký) khiến cổng kiểm tra trước khi gộp coi bằng chứng cũ là hết hạn và chặn gộp. Chừng nào chưa chứng lại hồ sơ cũ đó hoặc đưa phép kiểm sang hồ sơ mới, thay đổi này chưa thể đi vào bản chính.
  file: `_acceptance/viec-ke-theo-plan/mau/lo-trinh-crm-okr.html`
  severity: high
  Đề xuất: known-limits

- **S0-MO-O stops feature-loop with exit 2 when git user.email is empty (r1)**
  Người dùng thấy gì: Trên máy chưa khai email git, việc mở việc từ một hàng lộ trình luôn dừng với một lỗi cú pháp không liên quan tới hàng đó, nên người dùng không thể mở việc theo cách này tới khi khai email.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
