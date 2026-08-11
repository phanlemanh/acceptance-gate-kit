## Trong hợp đồng

Findings: []

## Ngoài hợp đồng — người quyết ở Gate 2

Mục dưới đây là việc THẬT đã làm trong vòng nghiệm thu nhưng nằm ngoài danh
sách vật-giao đã khai ở Cổng 1 — người quyết, máy không tự cho là đã duyệt.

<<<OOC-ITEM-TEMPLATE
- **Skill nghiệm thu (cả hai harness) vẫn hỏi số phút cho đúng ô mà sáu lệnh cổng vừa thôi hỏi**
  Người dùng thấy gì: Anh vẫn bị hỏi "mất bao nhiêu phút" ở đường đi phổ biến nhất — khi vòng làm việc chạy bước Cổng 1 qua skill nghiệm thu thay vì gõ thẳng lệnh — nên lời hứa "không bao giờ bị hỏi phút nữa" chỉ đúng một nửa. Sau sửa: không lối nào còn hỏi; ô ghi vẫn nguyên, máy điền số anh khai hoặc 0.
  file: `skills/acceptance/SKILL.md`
  severity: medium
  Đề xuất: nâng phạm vi sửa ngay
OOC-ITEM-TEMPLATE>>>

Phạm vi diff của mục này: ĐÚNG HAI file (`skills/acceptance/SKILL.md` và bản
song sinh `codex/acceptance-gate/skills/acceptance/SKILL.md`), mỗi file đổi
đúng một đoạn 2 dòng thành 5 dòng — bỏ "ask the user how many minutes", trỏ
danh tính/ngày về bậc thang, và ghi phút không hỏi. Không chạm file nào khác.
Phép đo kèm theo: MUT-15 chèn lại câu hỏi cũ vào bản đọc giả lập → đỏ đích
danh «duong khac van hoi phut».

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
