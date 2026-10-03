# Review findings: lo-trinh-tren-du-lieu-that (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A one-line change to the signed viec-ke-theo-plan dossier puts it in this PR's diff, so the CI gate now blocks the merge**
  Người dùng thấy gì: Một dòng sửa vào hồ sơ của vòng trước (đã được ký) khiến cổng kiểm tra trước khi gộp coi bằng chứng cũ là hết hạn và chặn gộp. Chừng nào chưa chứng lại hồ sơ cũ đó hoặc đưa phép kiểm sang hồ sơ mới, thay đổi này chưa thể đi vào bản chính.
  file: `_acceptance/viec-ke-theo-plan/mau/lo-trinh-crm-okr.html`
  severity: high
  Đề xuất: known-limits

- **New lo_trinh.tep reader stops at a column-0 comment, so the setting is silently treated as absent (regression from the shared reader)**
  Người dùng thấy gì: Nếu người dùng viết một dòng ghi chú sát lề trái ngay trong phần khai lộ trình của cấu hình, hệ thống coi như kho chưa khai lộ trình: thẻ bắt đầu không hiện gì, trang lộ trình không còn được vẽ hay kiểm, và không có cảnh báo nào.
  file: `scripts/lo-trinh-khoa.cjs`
  severity: medium
  Đề xuất: new-contract

- **Judgment eval E12 reads a manually copied snapshot, not a page generated in the same run**
  Người dùng thấy gì: Bản đánh giá bằng mắt người của trang lộ trình trên dữ liệu crm chấm trên một ảnh chụp đã lưu; nếu bộ vẽ đổi sau này, bản chấm vẫn xanh dù trang thật có thể đã khác.
  file: `_acceptance/lo-trinh-tren-du-lieu-that/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **No writer→reader round-trip test for lo_trinh_ma; tests hand-write the field in the reader's format**
  Người dùng thấy gì: Chưa có phép thử tự động kiểm rằng việc mở một việc từ hàng lộ trình rồi đọc lại cho ra cùng một liên kết; nếu hai phía lệch nhau sau này, phép thử hiện có sẽ không bắt được.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **LT-76 'ma-khong-ton-tai' checks only exit 1, without pinning the message**
  Người dùng thấy gì: Phép thử cho trường hợp nhập mã hàng không tồn tại chỉ kiểm kết quả là lỗi chứ không kiểm lời báo; nếu lỗi đến từ nguyên nhân khác, phép thử vẫn xanh.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **--mo-o creates yet another hồ sơ when a row already has ≥2 receivers, and the row stays the next row (hàng kế)**
  Người dùng thấy gì: Khi hai hồ sơ cùng nhận một hàng lộ trình, bấm mở việc cho hàng đó vẫn tạo thêm một hồ sơ thứ ba, và hàng đó vẫn hiện là việc kế tiếp, khiến chuyện chồng chéo tệ hơn.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Duplicate row code: the start card shows one row but thamSo and --mo-o open a different one**
  Người dùng thấy gì: Khi hai hàng lộ trình trùng mã, thẻ bắt đầu có thể nêu hàng thứ hai làm việc kế tiếp nhưng bấm làm việc đó lại mở ra việc của hàng đầu, là hàng đang bị chặn.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **A column-0 comment inside the `lo_trinh:` block makes the roadmap socket silently disappear (regression from the old reader)**
  Người dùng thấy gì: Một dòng ghi chú sát lề trái trong phần khai lộ trình làm toàn bộ tính năng lộ trình biến mất khỏi kho đó mà không có thông báo: không có dòng trên thẻ, không có trang, không cảnh báo khi trang cũ.
  file: `scripts/lo-trinh-khoa.cjs`
  severity: low
  Đề xuất: new-contract

- **S0-MO-O stops feature-loop with exit 2 when git user.email is empty**
  Người dùng thấy gì: Trên máy chưa khai email git, việc mở việc từ một hàng lộ trình luôn dừng với một lỗi cú pháp không liên quan tới hàng đó, nên người dùng không thể mở việc theo cách này tới khi khai email.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN, không đo đầu ra): LT-18-luat ghim token mà chính khối marker và bảng đã chứa sẵn, nên ca này không thể đỏ**
  Người dùng thấy gì: Phép thử kiểm câu hướng dẫn về cách ứng xử theo kết quả mở việc luôn xanh dù câu đó bị xoá hay sửa sai, nên hướng dẫn có thể lệch mà không ai biết.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính đứng một mình, không ghim thông điệp): LT-73-do chấp nhận BẤT KỲ lỗi nào ở ca mot-nguoi-nhan, kể cả lỗi crash**
  Người dùng thấy gì: Phép thử chứng minh việc kiểm hồ sơ nhận hàng biết bắt lỗi lại coi mọi lỗi, kể cả chương trình hỏng, là đã bắt đúng, nên có thể báo xanh khi thực ra phép kiểm chưa chạy.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN, không đo đầu ra): LT-79 than-start chỉ kiểm hai chuỗi có mặt trong thân lệnh /start, không có chiều đỏ**
  Người dùng thấy gì: Phép thử kiểm lệnh bắt đầu có in nguyên các dòng lộ trình chỉ nhìn sự có mặt của vài chữ, nên một câu hướng dẫn nói ngược lại vẫn qua; các dòng thật in ra đã được kiểm riêng.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture cho judge không do code trong lượt chạy sinh ra): E12 chấm một bản chụp HTML tĩnh đã commit**
  Người dùng thấy gì: Trang lộ trình mà người chấm đọc là một ảnh chụp lưu sẵn, không được sinh lại mỗi lượt, nên nếu cách vẽ đổi thì bản chấm vẫn dựa vào trang cũ.
  file: `_acceptance/lo-trinh-tren-du-lieu-that/evals.yaml`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/13 lỗi rơi vào file không bộ đo nào phủ (_acceptance/viec-ke-theo-plan/mau/lo-trinh-crm-okr.html, _acceptance/lo-trinh-tren-du-lieu-that/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
