---
slug: t3-can-ho-so-arm
at: 2026-11-09T13:40:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Định nghĩa «hồ sơ được chấm» là lựa chọn chỉ người có mà sổ không ghi ở cả hai chiều: máy-thông và làn V bị tính là không có hồ sơ; «cho code đó» hứa quan hệ tệp–hồ sơ mà luật không có | PR làn V chạm T3 bị chặn ngoài ý người duyệt; hồ sơ PASS của việc khác thoả luật cho code không liên quan | Dòng sổ chỉ-người, ca làn V riêng, bỏ «cho code đó» hoặc AC âm | human-gate1: Hỏi-2 và Hỏi-3; fixed: thêm HA23, đổi thông điệp thành `no record in it is judged by the gate` |
| P0 | design | Căn cứ ARM12 chỉ liên quan, không quyết phạm vi code thường | Người duyệt tưởng ràng buộc có sẵn, không cân nhắc lối siết cả code thường | Dòng chỉ-người với giá 27 PR | human-gate1: Hỏi-1; dòng sổ cũ bị thay bằng supersedes; design bỏ dẫn ARM12 |
| P0 | contract | Miễn PR cài kit ghi một lối, lối miễn hẹp còn sống; sổ nói nhánh đích, design nói merge-base | Nhánh cắt trước lần cài tự thêm config vẫn được miễn; PR cài gộp thêm code T3 vẫn qua | Dòng chỉ-người, hai ca đỏ, một điều kiện duy nhất | fixed: điều kiện đọc đỉnh nhánh đích, ca HA24-do; human-gate1: lối miễn hẹp ở Hỏi-3 |
| P1 | evals | E8 không có mẫu số, không ghim danh sách PR | Nhóm rỗng vẫn xanh; chặn oan từ 7 lên 30 PR vẫn thoả | Sàn từng nhóm, danh sách PR chốt trước | fixed: rang/ds-pr.json chốt từng PR và kết quả, sàn nhóm, dưới 5 kho thì exit 2 |
| P1 | evals | Thiếu ma trận: nghỉ, opportunity.md, nháp và đã duyệt đúng hạng; chiều đỏ và GPM13 chỉ là lời khai | Bỏ nhánh «đã cho nghỉ» mà E1–E8 vẫn xanh | Mỗi dòng bảng một ca, đột biến, eval chiều đỏ | fixed: HA21–HA26, đột biến cho sáu nhánh lý do, E9 chiều đỏ và GPM13; deferred: báo cáo và chữ ký trong fixture viết tay, E8 phủ bằng hồ sơ thật do bộ ghi của kit sinh |
