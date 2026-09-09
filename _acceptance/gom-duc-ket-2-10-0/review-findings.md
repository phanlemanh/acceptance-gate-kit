# Review Findings: gom-duc-ket-2-10-0 (round 6)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **loop-health.mjs đọc `human_calls` không cắt chú thích — số «lượt gọi người» của luật (c) bị bịa**
  Người dùng thấy gì: Số lượt gọi người mà công cụ đo tự động báo cáo có thể bị thổi phồng nếu ghi chú trong hồ sơ chứa chữ số — vòng phát hành này đã quyết định đếm số đó bằng tay thay vì tin công cụ tự động.
  file: `scripts/loop-health.mjs`
  severity: high
  Đề xuất: known-limits

- **`--all` suy dev-root bằng dirname(ROOT) — chạy từ worktree thì bảng «mốc cùng hạng» chỉ còn một kho**
  Người dùng thấy gì: Khi dùng công cụ để so sánh nhiều dự án cùng lúc, nó có thể chỉ đang so với chính nó mà không cảnh báo — bảng so sánh nhiều dự án của công cụ này chưa dùng được, cần đối chiếu thủ công.
  file: `scripts/loop-health.mjs`
  severity: medium
  Đề xuất: known-limits

- **loop-health.mjs tự viết luật cắt `#` thứ ba — trái nguồn-duy-nhất mà chính diff này vừa lập**
  Người dùng thấy gì: Công cụ đo nội bộ có thể đọc sai một trường phân loại khi giá trị đó có ký tự '#' đi kèm ngay sau — mốc này không dựa vào số đo tự động của công cụ đó nên chưa cần sửa ngay.
  file: `scripts/loop-health.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khối S5-SHIP-DEFAULT tự mâu thuẫn: `merge` cho máy gộp thẳng, câu kế nói bấm merge là của người**
  Người dùng thấy gì: Hướng dẫn cho máy có thể khiến máy tự động gộp thẳng thay đổi vào nhánh chính mà không dừng lại hỏi người trước — trong khi đây là một hành động khó có thể đảo ngược.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **loop-health.mjs: num() strips non-digits, so `human_calls:` silently reports a fabricated number (verified)**
  Người dùng thấy gì: Số lượt gọi người mà công cụ đo tự động báo cáo có thể bị thổi phồng khi ghi chú trong hồ sơ chứa chữ số — mốc phát hành này đếm số đó bằng tay, không tin công cụ tự động.
  file: `scripts/loop-health.mjs`
  severity: high
  Đề xuất: known-limits

- **loop-health.mjs --check-hand silently PASSes when a hand-counted value is not numeric (verified)**
  Người dùng thấy gì: Bước đối chiếu số máy đo với số đếm tay có thể báo 'khớp' ngay cả khi số đếm tay ghi sai định dạng — kết quả đối chiếu tự động này chưa đáng tin, mốc này dùng cách đối chiếu thủ công.
  file: `scripts/loop-health.mjs`
  severity: medium
  Đề xuất: known-limits

- **acceptance-verify: provenance-death path returns `report: ''`, which the documented main-loop step writes over the existing evidence-report.md**
  Người dùng thấy gì: Khi bước ghi nhận nguồn gốc bằng chứng gặp sự cố hạ tầng, báo cáo bằng chứng và nhận xét review của vòng chấm trước có thể bị ghi đè thành file trống — làm mất đúng bằng chứng cần cho người quyết định.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 — chiều đỏ tự-lặp: mutant của S5D3 chỉ chứng minh regex thay-rồi-đọc-lại, không bao giờ đỏ được**
  Người dùng thấy gì: Bài kiểm giấu mặt cho quy tắc «mặc định mở PR» của máy chưa thật sự có khả năng bắt lỗi nếu quy tắc đó bị sửa sai — nếu sau này có ai vô tình phá quy tắc, bài kiểm này sẽ không cảnh báo.
  file: `tests/scripts/s5-ship-default.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — «chiều đỏ của phép quét» ở PV5 là tautology, xây bản sao bằng đúng bộ lọc rồi tự soi lại bộ lọc**
  Người dùng thấy gì: Một phép tự-kiểm cho công cụ quét từ ngữ được dựng theo cách không bao giờ có thể báo lỗi — nếu phần phát hiện bên trong công cụ đó bị hỏng, sẽ không có cảnh báo nào; đây là giới hạn đã biết và đã ghi nhận của mốc phát hành này.
  file: `tests/scripts/w6-w8-pham-vi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — neo âm chết trong W39: cụm chữ ghim không tồn tại ở bất kỳ đường sinh nào**
  Người dùng thấy gì: Một bài kiểm hồi quy giữ lại một câu chữ mà hệ thống không còn tạo ra ở bất kỳ đâu nữa — nếu lỗi cũ (bỏ sót góp ý khi vòng sửa chỉ đổi mã, không đổi tài liệu) quay lại, bài kiểm này sẽ không phát hiện được.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 5/10 lỗi rơi vào file không bộ đo nào phủ (scripts/loop-health.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
