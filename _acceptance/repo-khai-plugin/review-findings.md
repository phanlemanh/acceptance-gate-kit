## Trong hợp đồng

- **readMarketplace silently falls back to a hardcoded marketplace name — breaks the script's own fail-loud posture and the «một nguồn tên» promise**
  file: `scripts/plugin-declare.mjs:47`
  severity: low
  AC: AC-1
  `return { names, mk: j.name || MARKETPLACE_NAME }` — when marketplace.json lacks `name`, the plugin suffix and the `extraKnownMarketplaces` key are quietly taken from the `MARKETPLACE_NAME` constant, i.e. a second source guessed without any message. Every other marketplace defect in the same function (unreadable, not JSON, no plugins) exits 4 with the path tried, and AC-1 states the name is one source read from marketplace.json. A nameless marketplace should exit 4 with the path like its siblings; PD1b only covers the rename case, not the missing-name case.

- **readMarketplace còn fallback ẩn `j.name || MARKETPLACE_NAME` — tên marketplace vẫn có nguồn thứ hai, trái vế «một nguồn» của AC-1 vừa vá ở S4-r1**
  file: `scripts/plugin-declare.mjs:47`
  severity: low
  AC: AC-1
  Đã thử: bản sao marketplace.json xoá khoá `name` → script exit 0, ghi `@acceptance-gate-kit` cho cả hậu tố lẫn khoá extraKnownMarketplaces, không một dòng cảnh báo. Tên đó lấy từ hằng trong mã, không từ file — nếu Claude Code đọc marketplace không có `name` thì bộ plugin đã khai trỏ tới một marketplace không đăng ký được. Các lối thiếu-khác (không có plugins, không phải JSON) đều fail-loud exit 4; riêng thiếu `name` thì im lặng. Đường rẻ: `if (!j.name) { console.error(...); return null; }` và PD1b thêm chiều đỏ «xoá name → exit 4».

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **README/QUICKSTART still mark required plugins as conditional — contradicts owner's «bắt buộc» decision and the new text 15 lines above**
  Người dùng thấy gì: Tài liệu hướng dẫn cài đặt vẫn còn chỗ gợi ý một plugin bắt buộc là có thể bỏ qua, dễ khiến người mở dự án sau này thiếu mất một plugin cần thiết.
  file: `README.md`
  severity: medium
  Đề xuất: known-limits

- **feature-loop/README.md is a third copy of the install procedure, left untouched and stale**
  Người dùng thấy gì: Có một bản hướng dẫn cài đặt riêng nằm trong thư mục plugin feature-loop chưa được cập nhật cùng các bản khác, nên có thể chỉ sai hoặc thiếu plugin cần cài khi ai đó đọc đúng bản này.
  file: `feature-loop/README.md`
  severity: medium
  Đề xuất: known-limits

- **PD7/PD7b regex pins one Vietnamese spelling («tuỳ chọn») — the repo's own docs use the other («tùy chọn»)**
  Người dùng thấy gì: Bài kiểm tra tự động chỉ nhận ra một cách viết của cụm từ 'tuỳ chọn', nên nếu sau này ai đó viết lại bằng cách viết khác, một lỗi tài liệu tương tự có thể lọt qua mà không ai phát hiện.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **PD9 copied-script fixture has no positive control — eval E9 promises one**
  Người dùng thấy gì: Một phép kiểm tự động thiếu bước đối chứng để chắc chắn nó thật sự phát hiện được lỗi, nên có rủi ro báo 'đạt' ngay cả khi phép kiểm chưa từng chạy đúng cách.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Repo đã init không có đường nào tới bước 5b — GUIDE/README hứa «/acceptance-init ghi .claude/settings.json» nhưng init STOP ở bước 1 khi config.yaml đã tồn tại**
  Người dùng thấy gì: Với những dự án đã khởi tạo từ trước, chạy lại lệnh khởi tạo sẽ không nhắc khai báo bộ plugin cần thiết cho máy mở lại dự án, nên bước cài plugin bắt buộc có thể bị bỏ sót hoàn toàn ở những dự án này.
  file: `commands/acceptance-init.md`
  severity: medium
  Đề xuất: new-contract

- **Hợp nhất ghi đè im lặng giá trị đội đã đặt trong chính khoá của kit: `false` bị lật thành `true`, source marketplace tuỳ chỉnh bị thay bằng github**
  Người dùng thấy gì: Khi đồng bộ lại cấu hình, công cụ có thể âm thầm đổi những lựa chọn đội đã cố ý đặt trước đó (ví dụ tắt hẳn một plugin hoặc trỏ tới bản cài đặt nội bộ riêng) mà không báo cho người dùng biết điều gì vừa bị thay đổi.
  file: `scripts/plugin-declare.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai lối vỡ hợp đồng mã thoát: settings.json là thư mục → EISDIR exit 1; `.claude` là file thường → EEXIST exit 1 (stack trace thay vì exit 3/4)**
  Người dùng thấy gì: Trong một số tình huống cấu hình bị đặt sai kiểu tệp một cách bất thường, công cụ dừng lại với thông báo lỗi kỹ thuật khó hiểu thay vì một lời giải thích rõ ràng, gây khó khăn khi người dùng cố tự khắc phục.
  file: `scripts/plugin-declare.mjs`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính thiếu ghim thông điệp (hình 4b): chiều đỏ PD8 chỉ so mã thoát 4, trong khi exit 4 của script dùng chung cho ba lối khác nhau**
  Người dùng thấy gì: Một phép kiểm tự động chỉ xác nhận công cụ dừng lại nhưng không xác nhận đúng lý do dừng lại, nên có thể không phát hiện được nếu công cụ dừng vì một lý do sai.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
