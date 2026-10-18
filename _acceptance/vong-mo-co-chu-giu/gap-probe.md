---
slug: vong-mo-co-chu-giu
at: 2026-10-18T02:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

Lượt 2, trên bản viết lại «nghi thức do máy gánh» (chủ kho 18/10). Năm phát hiện của lượt 1 (17/10) đã xử lý và ở trong lịch sử git của tệp này.

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Báo xong tự đính sha HEAD ghi là máy quyết theo «Kit render, không soạn», nhưng câu ấy không quyết vế «sha HEAD của chỗ đang đứng là vật của việc»; phép so sha với HEAD của chính cwd tự đúng [cham-lai-khong-tu-doi#F2]. | Phiên giữ kênh gõ XONG ở worktree điều phối, hoặc thợ gõ XONG khi cây bẩn hay chưa commit — vòng đóng bằng một sha không chứa việc, mọi hàng vẫn xanh. | Dòng sổ cho nguồn của vật; AC-2 thêm hàng chưa commit mới, cây bẩn, kho lệch trên kênh, mỗi hàng có chiều đỏ. | fixed: dòng sổ mới thay d-20261018T015059Z-20 — tự đính chỉ khi kho khớp, cây sạch, HEAD khác sha máy ghi lúc NHẬN; thiếu một điều thì đòi --vat. AC-2 (c) so sha với sha lúc NHẬN, (e) ba hàng con, GT-02-do bo-commit-moi. |
| P0 | design | Câu hỏi bỏ đọc lại ba dòng hứa «bắt được ca mở nhầm kho mà không cần ai đọc», nhưng trong đợt danh tính đã chặn kho lệch từ trước, trên kênh Ranh giới suy thành kho của người giao, còn ca chip sai kho nằm ngoài phạm vi; AC-2 (b) không đo đúng bước so kho; NHẬN kho lệch không có lối gỡ. | Người ký tin đã có lưới thay cho đọc lại mà lưới gần như không bao giờ nổ; M5 làm đúng ở crm bị từ chối NHẬN, vòng kẹt tới khi bị huỷ. | Sửa khuyến nghị cho khớp thực tế; hai hàng kênh với --kho; đối chứng bỏ kiểm danh tính mà (b) vẫn đỏ. | human-gate1: dòng sổ mới thay d-20261018T015059Z-19 nói đúng phạm vi bắt được (chỉ kênh, khi khai --kho), khai giới hạn ở Notes. fixed: GIAO trên kênh có --kho; NHẬN kho lệch in lệnh KẸT chép được; AC-2 (b) viết lại hai hàng kênh + đối chứng bỏ kiểm danh tính. |
| P1 | design | Hook tin xác định «mình» chỉ bằng cwd; tác tử con (S4, hội đồng chấm) chạy cùng cwd sẽ nhận tin và sổ ghi «đã đến»; stdin của ca viết tay [lo-trinh-gio-may#F2]. | Tác tử con chấm gọi Bash, hook đưa GIAO vào tác tử con, phiên chính không bao giờ thấy, hook dừng không chặn vì sổ ghi đã đến. | AC-7 thêm hàng stdin tác tử con; ca phát lại stdin thật; chiều đỏ. | fixed: dòng sổ mới — hook không làm gì khi lời gọi đến từ tác tử con; AC-7 (g) + GT-07-do tac-tu-con. deferred: phát lại stdin thật của Claude Code cần engine trên máy — khai giới hạn có ngưỡng ở Notes (≥ 1 ca tin bị đưa vào tác tử con). |
| P1 | contract | Trong đợt, Kết quả và Ranh giới lấy từ «hàng kế» mà không nói khi dãy đang giữa một hàng, cũng không nói --ket-qua có ghi đè không. | Giám sát nhắn thợ đang làm dở hang-a; lời giao ghi Kết quả và Ranh giới của hang-b mà không ai gõ, thợ làm theo ranh giới sai. | Ma trận nguồn suy trong AC-1 + dòng sổ + chiều đỏ. | fixed: dòng sổ mới — hàng đang chạy trước hàng kế, --hang chọn tường minh, --ket-qua/--ranh-gioi ghi đè; AC-1 (j) năm hàng + GT-01-do luon-hang-ke. |
| P1 | contract | Đường đo ngưỡng 2 không ghim nghĩa: «có mã» đọc được như số bình luận có mã; SỐNG đòi bo_qua bằng 0 trong khi bo_qua là chỗ người lọc văn xuôi. | co_ma = 40 nên ngưỡng đọc CHẾT dù mọi vòng đã đóng; hoặc một lời «ok» văn xuôi làm ngưỡng CHẾT dù không yêu cầu nào bị bỏ. | Ma trận cửa sổ bảy loại bình luận, mỗi trường một nghĩa, lệnh in thẳng phán quyết, chiều đỏ. | fixed: design §3.2 và Đường đo — năm trường một nghĩa, phán quyết CHẾT · cần đếm tay k · SỐNG · VÔ HIỆU in thẳng; AC-5 ma trận cửa sổ + GT-05-do dem-moi-ma. |
