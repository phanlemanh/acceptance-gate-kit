---
slug: dieu-phoi-khoa-day-giu-nhip
at: 2026-10-13T08:45:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Chiều đỏ AC-1 chỉ chèn lại dòng loại dãy, trong khi design gỡ tham số hangViec khỏi hai chữ ký — dòng tiêm tham chiếu định danh ngoài phạm vi | Bản tiêm ném ReferenceError; ca đỏ xanh vì sập chứ không vì bộ phát lịch phát sự kiện | Bản tiêm luồn lại hangViec qua ba chỗ (kiểm từng lần áp); kết quả so bằng đúng hai thông điệp, thông điệp chỉ sinh khi có sự kiện thật | fixed: AC-1 + E1 + design chỗ chọn 2 — ba lần thay, danh sách lỗi BẰNG đúng hai hàng 0 của nửa P1 |
| P1 | evals | README đỏ của AC-5 rút ở merge-base trôi theo trạng thái gộp [dieu-phoi-on-dinh-r2#F1] | Sau khi gộp, merge-base với origin/main là HEAD; README rút ra trùng README hiện tại, DP10-05-do đỏ trên main | Mốc ghim cứng | fixed: AC-5 + E5 dùng sha ghim e76684fd51ee1e737329ff7d56465d5fef0018a2 (hằng trong tệp test) |
| P2 | evals | Hàng P1 «chạm chamNhip» không đối chứng vắng nhịp phiên; hàng ra 0 có thể nhờ nhịp phiên | Hàng xanh vì nhịp phiên, lời hứa «nhịp khoá cứu khoá dãy» không được đo ở hàng ấy | Mỗi hàng assert song/ vắng nhịp của worktree người giữ; ma trận trên bản tiêm so bằng | fixed: AC-2 + E2 thêm đối chứng đầu vào từng hàng; E1 chạy trọn ma trận trên bản tiêm |
| P2 | design | Nhịp khoá gắn với tài nguyên — nguồn nhịp thứ năm «worktree khác chạm sau cấp» vắng khỏi trục D | Lệnh bọc còn sót của người giữ cũ làm sống khoá của người giữ mới | Hàng ma trận «worktree khác chạm → 1» cho cả hai người giữ | fixed: chamNhip đã kiểm trongWorktree(chu.worktree); thêm hàng thứ năm cho cả hai người giữ (ma trận 10 hàng), design nêu căn cứ |
| P2 | contract | Chưa ghi đã soát DP8-10 có ghim câu README bị sửa hay không | DP8-10 đỏ khi sửa README, tập khai AC-6 sai | Soát thân DP8-10 trước Cổng 1 | fixed: đã soát — DP8-10 chỉ kiểm «ngoài dãy» + chamNhip/giu-nhip.mjs, không ghim «vẫn đòi nhịp phiên»; ghi ở design, tập khai giữ nguyên |
