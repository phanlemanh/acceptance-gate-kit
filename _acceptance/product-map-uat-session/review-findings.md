## Trong hợp đồng

(rỗng — không có phát hiện nào map được vào AC ở round này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Codex edition: executor `product_map` được phát cho consumer là lệnh BLOCKED — cổng canh duy nhất của ADR 0007 chết ở harness Codex**
  Người dùng thấy gì: Ở các dự án dùng Codex, bước tự động kiểm tra bản đồ sản phẩm khi ký cổng người sẽ báo lỗi thay vì chạy được — cổng canh giữ cho bản đồ luôn khớp hồ sơ coi như không hoạt động ở nhóm dùng Codex.
  file: `codex/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs`
  severity: high
  Đề xuất: known-limits

- **Không có đường nâng cấp cho repo tiêu thụ đã init trước 1.31.0 — chính commit chữ ký Cổng 2 sẽ chặn merge**
  Người dùng thấy gì: Các dự án đã khởi tạo cổng nghiệm thu trước bản cập nhật này sẽ bị chặn không gộp được nhánh ngay tại bước ký duyệt, vì bản đồ sản phẩm mới bị hệ thống hiểu nhầm là bằng chứng đã cũ.
  file: `commands/signoff.md`
  severity: high
  Đề xuất: new-contract

- **GUIDE.md mô tả sai hành vi /start đã bị gỡ, và không có mục nào cho bản đồ sản phẩm / Cổng Giá trị**
  Người dùng thấy gì: Tài liệu hướng dẫn vẫn mô tả một cơ chế cũ đã bị gỡ bỏ, và không hề nhắc tới bản đồ sản phẩm hay phiên nghiệm thu mới — người đọc hướng dẫn sẽ không biết các tính năng này tồn tại hoặc bị hiểu nhầm thông tin lỗi thời.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **Notes của contract mâu thuẫn với AC-10 và với code đã ship về `skipped[]`**
  Người dùng thấy gì: Một dòng ghi chú cuối hợp đồng nói sai về một cơ chế cũ đã bị gỡ bỏ, có thể khiến người đọc sau hiểu nhầm là hệ thống vẫn còn giữ cơ chế đó.
  file: `_acceptance/product-map-uat-session/contract.md`
  severity: low
  Đề xuất: known-limits

- **`product-map.mjs --check` exits 0 on a wrong/uninitialised `--root` — the one gate ADR 0007 relies on fails open**
  Người dùng thấy gì: Nếu đường dẫn thư mục bị gõ sai trong hệ thống kiểm tra tự động, công cụ vẽ bản đồ sẽ báo yên tâm "chưa có gì để kiểm" thay vì báo lỗi — nghĩa là một đường dẫn sai có thể khiến cổng kiểm tra luôn xanh mà chưa thực sự so sánh gì.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: known-limits

- **Copying `uat-session-template.md` as the skill instructs produces a record both readers call broken**
  Người dùng thấy gì: Nếu ai đó nhân bản đúng theo hướng dẫn sao chép cho phiên nghiệm thu mới, kết quả tạo ra sẽ bị cả hai hệ thống đọc coi là hồ sơ hỏng — phiên nghiệm thu đó biến mất khỏi hàng chờ duyệt mà không có cảnh báo nào.
  file: `skills/acceptance/references/uat-session-template.md`
  severity: high
  Đề xuất: known-limits

- **A deleted PRODUCT-MAP.md reads as "never built" to /start while `--check` calls it a deletion**
  Người dùng thấy gì: Khi bản đồ sản phẩm bị xoá khỏi kho, người mở phiên làm việc được báo yên tâm là bản đồ sẽ tự vẽ lại, trong khi hệ thống kiểm tra tự động lại báo lỗi ngay cho đúng sự việc đó — hai nơi nói hai điều trái ngược về cùng một tình huống.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: new-contract

- **`evidence-report.md` rules live only in start-scan, so the product map never flags them — the two readers disagree**
  Người dùng thấy gì: Nếu hồ sơ bằng chứng bị lỗi định dạng, bản đồ sản phẩm không phát hiện ra và vẫn hiển thị như đang tiến triển bình thường, trong khi công cụ quét khác cùng lúc báo hồ sơ đó hỏng — hai công cụ cho hai kết luận trái ngược về cùng một việc.
  file: `lib/workspace-record.js`
  severity: medium
  Đề xuất: new-contract

- **Unpaired quote-stripping still live in `resolveConfigKey`, 15 lines above the same bug this diff fixed**
  Người dùng thấy gì: Nếu một dòng cấu hình lệnh kiểm tra được viết thiếu dấu ngoặc kép bao quanh nhưng có dấu nháy ở cuối, hệ thống có thể cắt mất ký tự cuối khi hiển thị — chỉ ảnh hưởng phần hiển thị, không ảnh hưởng việc chạy kiểm tra thật.
  file: `lib/evidence-core.js`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/9 lỗi rơi vào file không bộ đo nào phủ (codex/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs, GUIDE.md, _acceptance/product-map-uat-session/contract.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.