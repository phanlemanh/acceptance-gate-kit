## Trong hợp đồng

(Rỗng round này — finding medium/AC-13b của round 5, `lib/evidence-core.js:96` bóc nháy đầu/cuối độc lập khiến `frontmatterField` cắt nhầm dấu nháy cuối, đã được vá bởi verified_commit 48e2239eb36904fb20882e14d1fe54970054240f và không còn phát hiện nào map được vào AC. Bản vá không trọn vẹn — xem finding "Ngoài hợp đồng" bên dưới.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **product-map.mjs không kiểm mode/thứ tự tham số — đúng lớp fail-open mà sync-plugin-packages.sh đã dựng chốt chặn**
  Người dùng thấy gì: Nếu ai đó gõ sai lệnh kiểm tra bản đồ sản phẩm (ví dụ gõ nhầm cờ), công cụ có thể âm thầm GHI ĐÈ bản đồ thay vì chỉ kiểm tra, hoặc báo 'ổn' dù chưa kiểm gì thật — rủi ro chỉ xảy ra khi gõ lệnh sai tay.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: known-limits

- **`--check` xanh khi PRODUCT-MAP.md bị XOÁ — cộng miễn trừ t1 thì việc xoá bản đồ không còn cổng nào canh**
  Người dùng thấy gì: Một thay đổi chỉ xoá file bản đồ sản phẩm có thể lọt qua kiểm tra tự động mà không bị chặn lại — bản đồ có thể biến mất khỏi kho mà không ai được cảnh báo ngay lúc đó.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: known-limits

- **Contract Notes (đã duyệt Cổng 1) nói giữ `skipped[]` trong schema — code gỡ hẳn nó, schema_version vẫn là 1**
  Người dùng thấy gì: Nếu có công cụ nào khác từng dựa vào trường 'skipped' trong dữ liệu quét, trường đó nay biến mất hoàn toàn mà không báo hiệu — công cụ đó có thể đọc thiếu dữ liệu mà không nhận ra.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **CONTEXT.md không được cập nhật cho "Cổng Giá trị" — cổng người thứ tư, dùng khắp commands/skills/script**
  Người dùng thấy gì: Tài liệu thuật ngữ nội bộ dùng để hướng dẫn người viết tính năng tiếp theo tạm thời thiếu một mục — không ảnh hưởng người dùng cuối, chỉ gây nhầm lẫn nhỏ cho người phát triển kit sau này.
  file: `CONTEXT.md`
  severity: medium
  Đề xuất: known-limits

- **Hai reader VẪN cho hai kết luận trái nhau — start-scan bắt hồ sơ hỏng theo evidence-report.md, bản đồ thì không**
  Người dùng thấy gì: Cùng một hồ sơ có thể được bản đồ sản phẩm coi là 'đang làm bình thường' trong khi công cụ quét khác coi là 'hồ sơ hỏng' — người xem hai màn hình khác nhau có thể thấy hai câu chuyện khác nhau về cùng một việc.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **frontmatterField để lọt dấu nháy mở khi giá trị trong nháy có chứa ` #` — hồi quy do bản vá S4-r5**
  Người dùng thấy gì: Nếu tên tính năng trong hồ sơ có chứa dấu # bên trong dấu nháy kép, tên đó có thể hiện sai (thừa một dấu nháy) trên bản đồ sản phẩm và trên thẻ quyết định.
  file: `lib/evidence-core.js`
  severity: low
  Đề xuất: known-limits

- **Bản vá bóc-nháy-theo-cặp chỉ áp cho 1 trong 4 chỗ cùng hình dạng trong chính file đó**
  Người dùng thấy gì: Hai chỗ khác nhau đọc cùng một hồ sơ có thể hiểu giá trị hơi khác nhau khi giá trị đó kết thúc bằng dấu nháy — sai lệch nhỏ, khó nhận ra bằng mắt thường.
  file: `lib/evidence-core.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).