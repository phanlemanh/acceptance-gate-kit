# Review Findings: dac-ta-ux-vat-hoa-cau-truc (round 1)

## Trong hợp đồng

(không có — không finding nào map được vào AC nào trong round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Evals E1/E3 khai chiều đỏ mà test không hề chạy — evidence hứa mutant không tồn tại**
  Người dùng thấy gì: Hồ sơ bằng chứng của hai ca kiểm ghi rằng đã thử xoá một phần nội dung để kiểm tra phép kiểm có bắt được lỗi không, nhưng thực tế phép kiểm chưa từng thử tình huống đó — nên chưa ai chứng minh được phép kiểm thực sự phát hiện ra khi nội dung bị thiếu.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **W8 câm với states: dạng block-list YAML — cờ W8b oan kèm thông điệp dẫn sai đường, không có cánh parse**
  Người dùng thấy gì: Khi khai trạng thái theo một cách viết hợp lệ nhưng ít gặp, công cụ kiểm coi như chưa khai và báo cảnh báo thiếu đo — dù trạng thái đó đã được đo đầy đủ, khiến thẻ cổng hiện cảnh báo oan và gợi ý sửa sai chỗ.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **E6/E7/E9 tuyên «CÙNG hàm trích-từ-khuôn của E2» nhưng suite scripts tự cài extractor thứ hai bằng shell**
  Người dùng thấy gì: Bằng chứng ghi rằng ba phép kiểm dùng chung đúng một cách trích dữ liệu với phép kiểm gốc, nhưng thực ra có một cách trích thứ hai được cài riêng — hiện kết quả vẫn khớp nhau, song lời ghi trong bằng chứng không đúng sự thật và hai cách có thể lệch nhau về sau mà không phép đo nào báo.
  file: `tests/scripts/run-tests.sh`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **YAML block-list `states:` is silently parsed as empty, producing a FALSE W8b and flipping lint exit to 1**
  Người dùng thấy gì: Khi khai trạng thái theo một cách viết hợp lệ nhưng ít gặp, công cụ kiểm coi như chưa khai và báo cảnh báo thiếu đo — dù trạng thái đó đã được đo đầy đủ, khiến thẻ cổng hiện cảnh báo oan và gợi ý sửa sai chỗ.
  file: `scripts/eval-coverage-lint.js`
  severity: medium
  Đề xuất: new-contract
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **--files mode resolves `design_doc:` against process.cwd(), so a healthy pair lints red with a false 'con trỏ đặc tả UX chết' from any other directory**
  Người dùng thấy gì: Khi chạy công cụ kiểm theo một cách gọi khác (không phải cách dùng chính), một hồ sơ hoàn toàn lành mạnh bị báo sai là mất liên kết tới đặc tả UX, dù đường liên kết vẫn còn nguyên — chỉ vì công cụ tìm nhầm vị trí thư mục.
  file: `scripts/eval-coverage-lint.js`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 4 (ghim thông điệp) — chuỗi ghim "PASS: [UX1]"…"[UX4]" không bao giờ xuất hiện trong đầu ra thật**
  Người dùng thấy gì: Bốn phép kiểm khẳng định sẽ nhìn thấy một dòng thông báo cụ thể trong kết quả chạy để coi là đạt, nhưng dòng thông báo đó không bao giờ xuất hiện đúng nguyên văn trong thực tế — nên phép kiểm có thể báo trượt oan cho một tính năng vốn lành mạnh, hoặc bị nới lỏng tới mức không còn tác dụng canh gác.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 3 (assert chuỗi-có-mặt thay vì quan hệ) — UX3a: cụm "TRƯỚC khi sinh 3 artifact" khớp vào câu ui_standards_skill CÓ SẴN, không đo chỉ dẫn mới**
  Người dùng thấy gì: Phép kiểm được lập ra để xác nhận có hướng dẫn bắt điền đặc tả UX trước khi tạo tài liệu, nhưng khi thử xoá hẳn câu hướng dẫn đó đi, phép kiểm vẫn báo đạt như thường — nghĩa là nếu sau này hướng dẫn đó vô tình bị mất, phép kiểm hiện tại sẽ không phát hiện ra.
  file: `tests/plugins/ux-spec.test.mjs`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 4 (chiều đỏ chỉ có trên giấy) — E3 tuyên «gỡ câu (a) → đỏ ghim…» nhưng UX3 KHÔNG có mutation nào; chữ «đỏ:» nằm ngay TRONG nhãn PASS**
  Người dùng thấy gì: Bằng chứng ghi rằng đã thử xoá một câu hướng dẫn quan trọng và bắt được lỗi thiếu hướng dẫn, nhưng thực tế phép kiểm này không hề thử xoá gì cả — dòng chữ 'đã thử và bắt lỗi' chỉ là mô tả suông nằm trong nhãn báo đạt, khiến người đọc tưởng đã kiểm kỹ hơn thực tế.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Hình dạng 4 (chiều đỏ chỉ có trên giấy) — E1 tuyên chiều đỏ thứ hai «gỡ mục Khuôn IA → đỏ ghim tên mục thiếu» không tồn tại trong code**
  Người dùng thấy gì: Bằng chứng khai đã thử hai tình huống lỗi khác nhau để chứng minh phép kiểm đáng tin, nhưng một trong hai tình huống đó chưa từng được thử trong thực tế — người đọc bằng chứng có thể tin nhầm mức độ chắc chắn của phép kiểm.
  file: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

## Chưa adversarial-verify (refuter chết)

(không có — không finding nào có unverified=true trong round này)

⚠ Cụm ngoài vùng phủ: 4/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/dac-ta-ux-vat-hoa-cau-truc/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
