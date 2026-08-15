# ADR 0008 — Lưu kho harness Codex (gỡ khỏi cây, giữ trong mốc git)

Kit nuôi hai harness song sinh từ 2026-07-13: cây nguồn cho Claude, cộng một
lớp phủ `codex/` và một bản `plugins/` phẳng máy sinh để manifest Codex đọc
được. Cái giá không nằm ở dung lượng mà ở **nhịp làm việc**: mọi thay đổi lõi
phải sửa hai lần, chạy `sync-plugin-packages.sh`, commit bản sao cùng lượt, và
một lưới riêng (P30) canh sự khớp giữa hai bản — chi phí trả cho MỌI feature,
kể cả feature không ai chạy trên Codex. Owner tuyên 2026-08-12: *đội chủ yếu
dùng Claude*, đồng ý bỏ, mở lại khi cần. Chúng tôi gỡ `codex/`, `tests/codex/`,
`scripts/codex-self-script-refs.tsv`, `.agents/`, `.codex-plugin/`, bản mirror
`plugins/` cùng script sync và các lưới canh nó — tổng ~194 file — thay vì để
chúng nằm chết trong cây: cây còn thì luật «sửa hai lần» còn hiệu lực, và một
bản sao không ai đọc vẫn bắt người sau phải hiểu nó trước khi dám sửa gì. Đây
là đường đạt mục tiêu M4 của bản neo *người về biên, máy đi trước*
([kế hoạch](../plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)): số nơi phải
sửa-hai-lần về **0**. Trade-off nhận về: repo mất khả năng phát hành cho Codex
NGAY LẬP TỨC — muốn có lại phải trả một lượt cập nhật theo diff kit tích luỹ từ
ngày lưu kho, và cái giá đó tăng dần theo thời gian. Chấp nhận vì nó là chi phí
**có điều kiện** (chỉ trả khi có người dùng thật), còn chi phí sửa-hai-lần là
chi phí **vô điều kiện** (trả mỗi feature).

Đường đảo là mốc git `truoc-luu-kho-2026-08`, trỏ commit
`1df86adb7da1a013adad9a4c2f14cd62a4ac9c39`, đã đẩy lên remote — mốc chỉ nằm
local thì sau merge không ai ngoài máy tác giả hoàn tác được, nên «đã push» là
một phần của quyết định này chứ không phải thao tác phụ. **Trigger mở lại:** có
một người trong đội dùng Codex thật (tên cụ thể) — lúc đó `git checkout` từ mốc,
chạy suite `tests/codex/` bằng tay, rồi cập nhật lớp phủ theo diff kit kể từ
`1df86ad`. Không mở lại vì lý do «cho đủ bộ».

Thay thế ADR 0001 (commit `plugins/` như build mirror): lý do tồn tại của bản
mirror là manifest Codex không trỏ được vào cây đa-edition, nên nó chết cùng
Codex. Xem [ADR 0009](0009-khai-tu-nghi-le-design-loop.md) cho nhánh design-loop
đi cùng lượt gỡ này.
