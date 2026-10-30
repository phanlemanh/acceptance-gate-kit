---
slug: lenh-dot-ghi-dung-hang
at: 2026-10-29T09:05:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Phản biện context sạch — lenh-dot-ghi-dung-hang

Một tác tử tươi đọc design, contract, evals, decisions, bài học xuyên hồ sơ (claim-scan) và ô cơ hội; không đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | Luật «từ hai ứng viên thì từ chối» không tính ca thường của khoảng ký→gộp: A đã ký chưa gộp cùng B implemented, tiep trỏ B | Mọi xin s4 không cờ của B thoát 1 trong lúc A chờ gộp — lùi hành vi trên đường chính, thợ phải gõ --slug thường hơn trước | Hàng (e) trong ma trận AC-1 + mutant gộp bậc nêu đúng (e) | fixed: luật theo bậc của loại lượt (s4: đang chấm rồi đã thông; ghim-lai, merge: chỉ đã thông) ở design §2.1 và sổ d-2; AC-1 hàng (e), AC-2 hàng (e) cho ghim-lai/merge; ca TC2-01-do gop-bac |
| P1 | evals | E8 chỉ so bằng nhau, không chiều đỏ; không chứng bản cũ thật sự được chạy | Cả hai phía chạy gói hiện tại thì năm hàng luôn giống, lời hứa kho cũ không đổi được ký mà chưa đo | TC2-08-do tiêm bản sao gói hiện tại, lệch BẰNG đúng hàng bị chạm; ghi đường CLI bản cũ | fixed: TC2-08-do doi-su-kien-nghi (lệch BẰNG ["nghi"]); ca assert bản ở sha ghim chưa có choChayLai và in đường CLI bản cũ |
| P2 | contract | Bộ lọc hàng của dãy không có ô cô lập | Mã quét mọi contract trong worktree thì một hồ sơ phụ đã ký làm đơn mang slug lạ | Hàng (f) hồ sơ ngoài dãy + mutant gỡ bộ lọc | fixed: AC-1 hàng (f); ca TC2-01-do bo-loc-day nêu đúng (f) |
| P2 | evals | E9 đo chuỗi có mặt, chiều đỏ một lần trên cả tệp, không biến thể từng câu | Câu thứ tự nguồn slug thiếu mà E9 vẫn xanh vì bản cũ thiếu câu khác | Ba biến thể README, mỗi biến thể gỡ một câu, lỗi nêu đúng câu ấy | fixed: TC2-09 thêm ba biến thể; câu thứ tự ghim trọn chuỗi --slug → hồ sơ đang chấm → hồ sơ đã thông chưa gộp → tiep |
| P2 | design | Không ô cho --ranh-gioi cùng hàng lộ trình có vung | vung của lộ trình đè --ranh-gioi giám sát truyền | Ca hang them F12 --ranh-gioi app/khac/** | fixed: AC-3 và TC2-03 thêm ca --ranh-gioi thắng, slug và mã vẫn của lộ trình |
