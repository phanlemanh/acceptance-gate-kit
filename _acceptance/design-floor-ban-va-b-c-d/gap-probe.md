---
slug: design-floor-ban-va-b-c-d
at: 2026-10-27T09:30:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract AC-8 · evals E8 | Đột biến bỏ-một-bản-vá chỉ đòi dòng FAIL có mặt, không đối chứng dương, không chiều im; C trả 4 nhờ bảng của B nên bỏ B làm DF-03 đỏ theo | Dựng bản bỏ-C hỏng thì mọi phép đo đỏ, FAIL: DF-03 vẫn có mặt nên E8 xanh rỗng; AC-8 hứa độc lập chưa ai đo | In tập FAIL/PASS mỗi ca bỏ-X, so BẰNG tập viết độc lập; đối chứng dương bản áp đủ dựng cùng đường mã phải xanh | fixed: AC-8 + E8 so tập bằng nhau, đối chứng dương bản áp đủ, tập bỏ B gồm DF-03 |
| P1 | evals E5 | AC-5 hứa bốn lời gọi thoát 4, E5 chỉ ghim PASS: DF-03; vế --file mới không có chiều đỏ | DF-03 chỉ gọi gate thì reuse-plan check thiếu --file vẫn tự dò mà E5 xanh | Dòng đo từng lời gọi; đột biến gỡ riêng vế --file → DF-03 đỏ nêu reuse-plan check | fixed: DF-03 in đủ bốn lời gọi kèm mã; đột biến gỡ vế --file trong bản sao |
| P2 | design · sổ d-8 · opportunity | D chép thay vì dời mà sổ trích «dời»; ngưỡng «bốn cặp figma» lệch ba cặp đã đo ở FL2 | Cổng Phạm vi ký theo câu dời trong khi vật có hai bản chép; ngưỡng bốn cặp không phân biệt đạt hay bị hạ | Dòng sổ supersede d-8; mục Lệch kế hoạch; AC-6 nói ba cặp kèm con trỏ | fixed: dòng sổ mới supersedes d-8, mục «Lệch kế hoạch» trong design, AC-6 trỏ sổ FL2 d-20261027T055346Z-18 |
| P2 | design · contract Notes | Vỏ đổi cờ lạ chế độ chữ → 4 mà không phép đo; Known limit nói chế độ chữ trả 1 cho sai cú pháp | Lượt chấm gọi cờ lạ không --json nhận 4, mâu thuẫn lời khai | Sửa Known limit; thêm phép đo chế độ chữ cờ lạ 4 | fixed: Known limit viết lại; ca tu-thu VO cờ lạ không --json → 4 |
| P2 | design · AC-7 · E7 | Sổ thật hết dòng cho-va và gioi_han rỗng; đột biến tự viết dòng cho-va theo khuôn bên đọc; E7 không đo đủ trường từng dòng | Bên đọc dòng cho-va trôi khỏi bên ghi mà đột biến vẫn xanh; dòng C thiếu trường vẫn qua E7 | Dòng cho-va nhân bản từ dòng thật của sổ; E7 in đủ trường + đột biến xoá trường của dòng C | fixed: dòng cho-va nhân bản dòng A thật rồi đổi trạng thái; E7 in «đủ trường», đột biến xoá lam_xanh dòng C · deferred: mục gioi_han của đột biến vẫn dựng tay — không còn bên ghi nào trong cây (khối máy là văn bản người sửa; bản có giới hạn chỉ còn trong lịch sử git, CI clone nông không đọc được) |
