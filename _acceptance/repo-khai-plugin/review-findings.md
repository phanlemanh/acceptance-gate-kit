## Trong hợp đồng

(không có finding nào ánh xạ được vào AC ở vòng này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **README.md và QUICKSTART.md vẫn là bản sao lỗi thời của thủ tục cài — diagram-design «optional», 5 lệnh — trái quyết định owner và GUIDE §5.1 mới**
  Người dùng thấy gì: Tài liệu README và QUICKSTART vẫn ghi plugin thiết kế là tuỳ chọn với năm bước cài thủ công, trong khi hướng dẫn chính thức mới đã đổi thành bắt buộc và chỉ một bước — người đọc theo tài liệu khác nhau sẽ nhận chỉ dẫn cài đặt mâu thuẫn nhau.
  file: `README.md`
  severity: medium
  Đề xuất: new-contract

- **`--root` không kiểm tồn tại — gõ nhầm đường dẫn thì script tự mkdir cây mới và báo «đã khai» exit 0, trái pattern --root fail-loud của các script anh em**
  Người dùng thấy gì: Nếu gõ nhầm đường dẫn thư mục đích, công cụ sẽ tự tạo một thư mục mới ở nơi đó và báo đã hoàn tất thành công, khiến người dùng tưởng đã cấu hình đúng chỗ trong khi file thực ra nằm ở một nơi không ai theo dõi hay đưa vào commit.
  file: `scripts/plugin-declare.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thiếu validation ở biên đọc settings.json: JSON hợp lệ nhưng sai hình (gốc là mảng/chuỗi; `enabledPlugins` là mảng) bị lặng lẽ thay thế hoặc sinh khoá rác**
  Người dùng thấy gì: Nếu file cấu hình có nội dung sai định dạng thông thường (ví dụ là một danh sách thay vì một bản ghi), công cụ có thể âm thầm ghi đè mất toàn bộ cấu hình cũ hoặc chèn thêm các mục dữ liệu rác vào file, mà vẫn báo là đã hoàn tất thành công.
  file: `scripts/plugin-declare.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tên marketplace có hai nguồn: hậu tố plugin lấy từ marketplace.json `name`, còn khoá `extraKnownMarketplaces` lấy từ hằng hardcode**
  Người dùng thấy gì: Tên nguồn dùng để bật plugin và tên nguồn dùng để khai báo marketplace hiện lấy từ hai chỗ khác nhau trong mã nguồn; nếu một trong hai đổi mà cái kia không đổi theo, plugin có thể được bật nhưng trỏ tới một nguồn chưa từng được khai báo, khiến việc kích hoạt thất bại.
  file: `scripts/plugin-declare.mjs`
  severity: low
  Đề xuất: known-limits

- **PD_CASES với id không tồn tại → exit 0 không in gì (xanh im lặng)**
  Người dùng thấy gì: Bộ kiểm thử nội bộ có thể báo hoàn tất mà không báo lỗi ngay cả khi một số phép kiểm thực ra chưa từng được chạy, do đó một lỗi thật trong tính năng có nguy cơ không bị phát hiện trước khi phát hành.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: low
  Đề xuất: known-limits

- **settings.json parse được nhưng không phải object → bị thay trọn im lặng**
  Người dùng thấy gì: Nếu file cấu hình hiện tại có định dạng bất thường (không phải một bản ghi thông thường), công cụ có thể âm thầm thay thế toàn bộ nội dung cũ mà không cảnh báo, dù vẫn báo là đã hoàn tất thành công.
  file: `scripts/plugin-declare.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (biến thể): chiều đỏ của PD2 là tautology — không phá vật, không chạy lại cùng phép so**
  Người dùng thấy gì: Phép kiểm nội bộ dùng để đảm bảo cấu hình cũ của người dùng luôn được giữ nguyên khi cập nhật có một lỗ hổng khiến nó không thực sự chứng minh được điều đó — nếu hành vi này bị hỏng trong tương lai, bộ kiểm thử có thể không phát hiện ra.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (biến thể): file ca exit 0 im lặng khi PD_CASES không khớp ca nào — xanh-không-chạy**
  Người dùng thấy gì: Bộ kiểm thử nội bộ có thể báo hoàn tất mà không có cảnh báo dù một số phép kiểm chưa từng được chạy do tên bị đổi hoặc gõ sai, làm tăng nguy cơ lỗi thật lọt qua trước khi phát hành.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
