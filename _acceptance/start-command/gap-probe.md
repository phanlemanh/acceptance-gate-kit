---
slug: start-command
at: 2026-08-03T03:44:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Gap-probe — start-command

Critic fresh-context, 5 input (design + contract + evals + ledger + claims xuyên feature).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Không có phép đo round-trip seam script-viết→lệnh-đọc (E1–E6 đo JSON trên fixture riêng, E5/E6 grep chữ trong lệnh — không case nào nối hai đầu). Đúng lớp [findings-section-boundary#F1]. | S3 đổi tên key `skipped` trong script hoặc lệnh viết nhầm key; mọi eval XANH nhưng runtime thẻ im lặng mất mục skip/broken — chính chế độ hỏng AC-5 cấm. | Case kiểu P55: rút key từ khối marker của commands/start.md, assert có mặt trong output script thật; bản đổi-tên-key phải ĐỎ. | fixed: thêm AC-13 + E13 |
| P1 | contract | Không AC nào buộc con trỏ file trong thân lệnh 2 harness giải được BÊN TRONG gói mirror — [ngon-ngu-mat-nguoi#F1] là đúng lỗ này ở feature trước (đã vá bằng AC-6+E7+P95) nhưng bộ artifact này không kế thừa. | Lệnh viết path đúng trên cây nguồn; E12 sync XANH; consumer cài plugin gõ /start → exit 127. | Mở rộng họ P95 cho start. | fixed: thêm AC-14 + E14 |
| P1 | contract | Hành vi thiết kế 2 (nạp human-facing-language.md TRƯỚC khi viết) không có AC; Coverage trỏ AC-11 nhưng AC-11 chỉ đo GUIDE/README. | Implementer bỏ bước nạp; E1–E12 XANH; thẻ đầy tiếng máy — trái đích danh spec §Hành vi 2. | AC mới + grep đối chứng âm + câu (4) trong E7. | fixed: thêm AC-15 + E15, mở rộng E7 (input + câu 4) |
| P2 | evals | E2 fixture "đủ 8 trạng thái" trong khi bảng phân ô spec có 10 nhánh (thiếu opportunity-thiếu-decision, PENDING-JUDGMENT, iterate). | Script xử lý sai nhánh PENDING-JUDGMENT; E2 vẫn XANH vì chỉ đếm trên trạng thái có mặt — cổng chờ ký biến mất khỏi thẻ. | Fixture phủ đủ MỌI hàng bảng, liệt kê theo bảng không theo số. | fixed: sửa expected E2 |
| P2 | evals | E6 chỉ dựng since bằng mtime — nhánh ưu-tiên-frontmatter của spec không có đối chứng. | approved_at cũ nhưng file bị chạm lại (mtime mới) → cổng chờ lâu nhất KHÔNG lên đầu, eval của chính nó không bắt. | Fixture 2 cổng frontmatter/mtime mâu thuẫn; xoá frontmatter → rơi về mtime. | fixed: sửa expected E6 |

Ghi chú: không finding nào lật 2 quyết định ledger (approach script-hoá, descope PRODUCT-MAP/UAT). Finding 1–2 dựa claim advisory có cite id.
