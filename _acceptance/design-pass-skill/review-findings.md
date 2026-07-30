## Trong hợp đồng

(không có phát hiện nào map được vào AC ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **SKILL.md claims Gate-1 card displays material: but no reader exists (writer→reader seam drift)**
  Người dùng thấy gì: Tài liệu hướng dẫn nói thẻ duyệt ở Gate 1 sẽ hiện rõ bậc vật liệu (material) đang dùng để người duyệt biết mình duyệt trên cái gì, nhưng phần hiển thị đó chưa được xây — người duyệt sẽ không thấy thông tin này trên thẻ như tài liệu mô tả, dù bản ghi thiết kế vẫn lưu đúng thông tin đó ở nơi khác.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/design-pass-skill/skills/design-pass/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Codex plugin descriptions advertise design-pass while the Codex package ships no such skill (declared out of scope)**
  Người dùng thấy gì: Mô tả giới thiệu của gói dành cho Codex nói rằng bản cập nhật này thêm một nghi thức thiết kế mới, nhưng gói Codex thực tế không chứa tính năng đó — người dùng Codex đọc mô tả có thể tưởng nhầm là mình dùng được, trong khi tính năng này hiện chỉ có ở Claude Code.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/design-pass-skill/.codex-plugin/plugin.json`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).