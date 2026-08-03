## Trong hợp đồng

Không có finding nào map được vào AC round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **acceptance-init ships consumer repos a config without the PRODUCT-MAP.md t1 exemption — the exact merge deadlock ADR 0007 says is unescapable**
  Người dùng thấy gì: Nếu dùng bộ khởi tạo nghiệm thu cho một dự án khác ngoài kit, lần ký cổng đầu tiên có thể bị kẹt vòng lặp: máy tự vẽ lại bản đồ sản phẩm nhưng hệ thống chặn merge lại coi bản đồ mới là bằng chứng lỗi thời, buộc ký lại — cứ thế không dứt.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/commands/acceptance-init.md`
  severity: high
  Đề xuất: new-contract

- **The two workspace readers still disagree on a corrupt evidence-report.md — the exact class lib/workspace-record.js was created to eliminate**
  Người dùng thấy gì: Khi hồ sơ bằng chứng của một tính năng bị hỏng, lệnh /start có thể báo 'hồ sơ hỏng' trong khi bản đồ sản phẩm lại xếp tính năng đó vào mục đang làm bình thường — hai nơi cho hai câu trả lời khác nhau về cùng một việc.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/lib/workspace-record.js`
  severity: medium
  Đề xuất: known-limits

- **A tracked-but-deleted PRODUCT-MAP.md is reported to the human as "never built yet" while CI reports it as a deletion**
  Người dùng thấy gì: Nếu ai đó lỡ xoá bản đồ sản phẩm đã lưu trong git, thẻ /start vẫn báo yên tâm 'chưa có bản đồ, sẽ tự vẽ ở lần sau' đúng lúc kiểm tra tự động đang báo đỏ vì mất file — người xem /start không biết đang có sự cố.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/scripts/start-scan.mjs`
  severity: medium
  Đề xuất: new-contract

- **CONTEXT.md not updated for the new gate and artifact vocabulary the diff introduces across 8 source files**
  Người dùng thấy gì: Tài liệu thuật ngữ nội bộ của kit chưa được cập nhật với các khái niệm mới (Cổng Giá trị, phiên nghiệm thu, bản đồ sản phẩm) — người viết tài liệu sau này có thể dùng từ không thống nhất.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/CONTEXT.md`
  severity: medium
  Đề xuất: known-limits

- **Dead re-export of NAV_RULES from product-map.mjs**
  Người dùng thấy gì: Một đoạn mã nội bộ xuất lại một bảng quy tắc ở nơi thứ hai dù không ai dùng tới — không ảnh hưởng người dùng, chỉ là rủi ro bảo trì nhỏ về sau.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai reader trái kết luận: contract `verified` thiếu evidence-report.md → start-scan gọi HỎNG, bản đồ xếp "Đang làm"**
  Người dùng thấy gì: Khi một tính năng đã đánh dấu 'đã duyệt xong' nhưng thiếu báo cáo bằng chứng, lệnh /start cảnh báo hồ sơ hỏng còn bản đồ sản phẩm lại xếp nó vào mục đang làm bình thường — hai nơi không khớp nhau.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **Bản Codex: `uat-session` dùng `${CLAUDE_PLUGIN_ROOT}` (không tồn tại ở Codex) trong khi codex `start` vừa được nối tới nó**
  Người dùng thấy gì: Nếu chạy nghi thức phiên nghiệm thu trong môi trường Codex, bước chép mẫu hồ sơ và cập nhật bản đồ sản phẩm có thể lặng lẽ thất bại vì thiếu đường dẫn đúng — đây là hạn chế đã biết và đã được ghi nhận trước.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **`stage: archived` không có ô nào tiêu thụ — cơ hội đã đóng hiện mãi là cổng người đang chờ**
  Người dùng thấy gì: Một cơ hội sản phẩm đã được đóng lại (lưu trữ, không theo đuổi nữa) vẫn hiện mãi trong danh sách 'đang chờ anh quyết' trên /start và trong mục 'đang cân nhắc' trên bản đồ — không có cách nào gỡ nó khỏi danh sách chờ.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: new-contract

- **`product-map --check` exit 0 khi thiếu `_acceptance/config.yaml`, kể cả lúc PRODUCT-MAP.md đã được git theo dõi**
  Người dùng thấy gì: Nếu ai đó lỡ đổi tên hay xoá file cấu hình gốc của nghiệm thu, phép kiểm tra bản đồ sản phẩm trên CI vẫn báo ổn (xanh) dù bản đồ có thể đang sai lệch thật — kiểm tra tự động không phát hiện được sự cố này.
  file: `scripts/product-map.mjs`
  severity: low
  Đề xuất: known-limits

- **frontmatterField: `#` trong giá trị có nháy vẫn cắt cụt, và luật bóc-cặp-mới để lại nháy mở lơ lửng**
  Người dùng thấy gì: Nếu tên tính năng trong hồ sơ có chứa dấu # (ví dụ số issue) và được viết trong ngoặc kép, bản đồ sản phẩm có thể hiển thị tên đó bị cắt cụt và còn sót dấu ngoặc kép thừa — chữ hiển thị cho người đọc bị lỗi định dạng nhẹ.
  file: `lib/evidence-core.js`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có finding nào ở trạng thái này round này.

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (commands/acceptance-init.md, CONTEXT.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.