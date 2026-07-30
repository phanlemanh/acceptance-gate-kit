## Trong hợp đồng

(không có phát hiện nào map được vào AC ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **In-plugin sample command uses cross-plugin placeholder instead of ${CLAUDE_PLUGIN_ROOT}**
  Người dùng thấy gì: Lệnh mẫu hướng dẫn thêm cấu hình trong tài liệu có thể không chạy ngay được vì dùng cách ghi đường dẫn khác với quy ước còn lại của bộ công cụ, người dùng có thể phải tự sửa lại đường dẫn trước khi chạy được.
  file: `skills/design-pass/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Branch not mergeable as-is: round-1 evidence stale + human_signoff empty (expected mid-loop state)**
  Người dùng thấy gì: Nhánh hiện tại chưa sẵn sàng để gộp vào chính vì bằng chứng kiểm thử ở vòng trước đã lỗi thời và bước ký duyệt cuối cùng của người phụ trách chưa hoàn tất — đây là trạng thái đang xử lý dở đã được biết trước, chưa phải vấn đề mới cần chặn.
  file: `_acceptance/design-pass-skill/evidence-report.md`
  severity: low
  Đề xuất: known-limits

- **P66 region-truncation guard can never fail — anchor literal matches its own source**
  Người dùng thấy gì: Một phép kiểm tự động dùng để cảnh báo khi tài liệu kiểm thử bị cắt xén, sót phần thực ra không có khả năng phát hiện đúng lỗi đó — nếu sau này phần kiểm thử liên quan bị cắt bớt, hệ thống sẽ không báo động như kỳ vọng.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/design-pass-skill/tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có mục nào)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
