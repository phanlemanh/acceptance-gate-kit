## Trong hợp đồng

(rỗng — không có phát hiện nào map được vào AC ở round này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **`product-map.mjs --check` fail-open khi `--root` trỏ sai — cổng duy nhất biện minh cho miễn trừ t1 xanh mà không so byte nào**
  Người dùng thấy gì: Nếu đường dẫn tới kho lặp bị gõ sai, công cụ kiểm tra bản đồ sản phẩm vẫn báo 'ổn' dù chưa thực sự so sánh gì — người dùng có thể tin bản đồ luôn đúng trong khi nó đã lệch từ lâu mà không hay biết.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: known-limits

- **Skill `uat-session` phát vào gói Codex với `${CLAUDE_PLUGIN_ROOT}` — hai con trỏ chết, trong khi `start` bản Codex đã trỏ người dùng tới nó**
  Người dùng thấy gì: Trên phiên bản Codex, bước hướng dẫn chép khuôn và làm mới bản đồ trong nghi thức nghiệm thu sẽ trỏ tới một đường dẫn không hoạt động, khiến người dùng Codex phải tự đoán cách làm thay vì được dẫn dắt đúng — ngay trên đường dẫn mà lệnh /start vừa mở ra cho họ.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Chốt `PLUGIN_ROOT` của P122 là phép đo từ vựng — `CLAUDE_PLUGIN_ROOT` lọt qua vì là chuỗi con**
  Người dùng thấy gì: Phép kiểm tự động cho loại đường dẫn này chỉ tìm đúng một cụm chữ, nên nếu sau này ai đó đổi sang một cách viết khác không hoạt động trên Codex, hệ thống kiểm tra tự động vẫn báo xanh — không bắt được lỗi cùng dạng với lỗi đã nêu ở trên.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Cổng Giá trị là cổng người thứ 7 nhưng nghi thức để MỞ model-invocation; CLAUDE.md và ADR 0002 không đổi cùng PR**
  Người dùng thấy gì: Cổng phê duyệt 'Giá trị' mới cho phiên nghiệm thu hiện không bị khoá chặt như các cổng người khác — về lý thuyết trợ lý AI có thể tự điền thay vì luôn chờ người quyết định, và tài liệu chính sách nội bộ chưa được cập nhật để ghi nhận sự tồn tại của cổng này.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **contract.md nói `skipped[]` GIỮ trong schema start-scan, code gỡ hẳn và 2 test assert nó phải VẮNG**
  Người dùng thấy gì: Tài liệu mô tả tính năng vẫn ghi rằng một trường dữ liệu cũ (danh sách nguồn bị bỏ qua) sẽ tiếp tục xuất hiện trong kết quả, nhưng bản cài đặt thực tế đã bỏ hẳn trường đó — người đọc tài liệu có thể hiểu sai những gì hệ thống thực sự đưa ra.
  file: `_acceptance/product-map-uat-session/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Hai reader vẫn bất đồng về "hồ sơ hỏng": 3 luật broken chỉ sống trong start-scan, bản đồ không thấy**
  Người dùng thấy gì: Nếu một hồ sơ tự nhận đã 'nghiệm thu xong' nhưng bằng chứng ký duyệt bị thiếu hoặc không đọc được, bản đồ sản phẩm vẫn hiển thị nó như một việc đang làm bình thường thay vì cảnh báo đây là hồ sơ có vấn đề — người xem bản đồ để chọn việc tiếp theo có thể bỏ sót nó.
  file: `lib/workspace-record.js`
  severity: high
  Đề xuất: new-contract

- **Cổng `gia-tri` xếp thứ tự bằng mtime — nhánh timestamp frontmatter không bao giờ chạy được**
  Người dùng thấy gì: Trong nghi thức thật, thứ tự chờ duyệt ở cổng 'Giá trị' hiện dựa vào thời điểm file được chạm gần nhất (ví dụ do định dạng lại hay đồng bộ) thay vì thời điểm hồ sơ thực sự bắt đầu chờ — một hồ sơ chờ lâu có thể bị trôi xuống cuối danh sách chỉ vì file bị chạm vào, không phải vì nó mới.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **`--check` fail-open ở hai cửa: git không trả lời được, và thiếu `_acceptance/config.yaml`**
  Người dùng thấy gì: Có thêm hai tình huống khác (công cụ quản lý mã nguồn báo lỗi bất thường, hoặc thư mục cấu hình bị thiếu) mà công cụ kiểm tra bản đồ vẫn âm thầm báo 'ổn' thay vì báo lỗi rõ ràng — cùng rủi ro như vấn đề đường dẫn sai đã nêu, chỉ khác nguyên nhân kỹ thuật.
  file: `scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).