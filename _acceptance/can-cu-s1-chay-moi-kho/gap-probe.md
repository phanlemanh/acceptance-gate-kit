---
slug: can-cu-s1-chay-moi-kho
at: 2026-10-11T15:02:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

# Gap-probe — can-cu-s1-chay-moi-kho

Phản biện context sạch một lượt (tác tử tươi, chỉ đọc design + contract + evals + sổ + bài học cũ + ô cơ hội).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Mục Đường đo thiếu đường đo cho chiều CHẾT «dừng Cổng Phạm vi vì đọc lỗi hạ tầng thành sổ đỏ»; dòng hai gộp lỗi thẻ với dòng sổ thiếu giá | Vòng crm đầu sau mốc: bộ xếp in câu hỏi 0 · đỏ 0 mà phiên vẫn dừng — hai dòng đo đều đọc SỐNG | Thêm dòng đối chiếu N, K với việc vòng dừng hay đi làn V; dòng thiếu giá đếm riêng | fixed: Đường đo thêm dòng đối chiếu N, K với veto_state + sổ của vòng crm; dòng hai đổi thành «dòng có giá thì bản rút mang đúng giá, dòng thiếu giá đếm riêng» |
| P1 | contract | Ma trận khối máy đã quyết (nguồn × loại) thiếu ô descope nguồn mục-tiêu; fixture không round-trip từ sổ thật | Thẻ in sai dòng descope mục-tiêu — loại dòng hay gặp nhất — mà KK-6 vẫn xanh | Thêm dòng descope mục-tiêu; ca vòng tròn trên sổ thật của chính hồ sơ | fixed: AC-6 + E6 phủ đủ bốn ô nguồn × loại; thêm ca KK-6 so-that dựng thẻ --gate 1 trên sổ thật của hồ sơ, đếm dòng bằng bộ xếp |
| P1 | design | Câu trích của d-4 không quyết việc mở quét ra bốn gói; quét tay §3.5 chưa phủ mọi tiền tố gói và vỏ | Một lời gọi trong gói điều phối làm KK-4 đỏ trên cây lành mà vòng không được sửa tệp — kẹt | Dòng S1 mới mang supersedes hoặc thu phạm vi; quét lại với mọi tiền tố và vỏ | fixed: quét lại 110 tệp, mọi vỏ và tiền tố — 10 lời gọi, 8 đúng chủ đích; d-20261011T150339Z-8 thay d-4 (quét trọn SKILL feature-loop, ma trận bốn hình); d-20261011T150339Z-9 descope tệp khác |
| P2 | design | Kho tự host không có ca và §4 không ngưỡng; câu «thêm --root .» dễ nhầm với cờ của bộ xếp | Vòng ở kho kit dừng S1 vì bản cài thiếu bộ xếp mà E3 vẫn PASS | Ngưỡng đếm ở §4 hoặc ca tự host | fixed: §4 khai hai gói đi cùng mốc + ngưỡng ≥ 1 vòng kho kit dừng S1 vì bản cài thiếu bộ xếp; lời dặn ghi «ngay sau --plugin acceptance-gate» |
| P2 | evals | Gốc vòng của KK-8 lấy merge-base — trước A2 nếu A2 chưa gộp; bộ thư mục lưu trữ là danh sách tay | KK-8 đỏ vì vật của A2 hoặc vì bản gốc thiếu tệp | Neo gốc vào cha commit mở ô; lưu trữ trọn cây; đối chứng dương | fixed (một phần): thêm đối chứng dương lưu trữ HEAD so cây làm việc → 0 lệch; rejected phần neo: lượt chấm chỉ chạy sau khi A2 lên main và nhánh cập nhật từ main, còn neo vào cha commit mở ô kéo theo thay đổi thẻ của vòng khác gộp vào main |
