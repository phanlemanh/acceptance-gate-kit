---
slug: cham-lai-khong-tu-doi
at: 2026-10-16T14:45:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design (sổ d-20261016T143720Z-1) | Sổ ghi một-lối cho «đọc định nghĩa từ git», nhưng lối «ghi vân tay vào dòng eval lúc chấm» kèm fail-closed vẫn sống — chỉ đắt hơn. Đây là đánh đổi chỉ người có. [cua-tin-hieu-giua-chien-dich#F1] | Chủ kho ký Cổng Phạm vi mà không thấy đánh đổi; ca eval sửa chưa commit rồi hoàn lại mang xanh sai sau khi nhận | Dòng sổ mới thay d-…-1 thành câu hỏi chỉ-người kèm giá từng lối | human-gate1: dòng sổ mới mang supersedes thành Hỏi-2 trên thẻ (khuyến: đọc git) |
| P0 | design (sổ d-20261016T143721Z-2) | Câu trích chỉ loại «dặn --args trong SKILL», không quyết vế «dừng mã 2 khi không tệp nào thuộc lượt cuối»; lối ghi nhãn không-đọc-được không gọi người vẫn sống. [lo-trinh-gio-may#F1] | Kho lưu args ngoài hồ sơ: mỗi lượt dừng mã 2, phiên gọi người | Tách vế dừng thành dòng sổ riêng | rejected: tiền đề sai — SKILL xếp lỗi của thuoc-vat --write vào «WARN một dòng, không chặn vòng», nên mã 2 không gọi người; thông điệp nêu đúng lệnh tự gỡ (--args) và SKILL nay dặn máy chạy lại với --args. Nhãn không-đọc-được khi đã biết tệp đúng là bỏ phép so có sẵn |
| P1 | contract AC-6 + evals E6 | Không ca nào có cùng lúc tệp khớp tally và tệp mới hơn (hình dạng thật khung-man-chung -r2/-r3) | Lượt 3 chết: bản sửa chọn -r2, dòng cay-doi mồ côi round 3 mất, răng hoàn lại mù | Mũi (e): -r2 khớp + -r3 mới hơn, mong chọn -r3, một cay-doi round 3 | fixed: vật đổi sang chọn tệp hợp lệ MỚI NHẤT; thêm mũi (e) vào AC-6/E6/CL6 (đỏ trên bản chọn-tệp-khớp trước đó, đã quan sát) |
| P1 | contract Đường đo | Đường đo ngưỡng thiếu cay-doi; ngưỡng một dùng chính carry-plan làm thước (vật đo vật) | Bộ so hỏng cả hai phía → 0 dòng đổi, đọc SỐNG khi là CHẾT | Thước git show độc lập + jq cho cay-doi | fixed: Đường đo dùng git show ở hai sha độc lập carry-plan, thêm dòng jq cho cay-doi (khớp round-tally cùng round hoặc mồ côi mới hơn) |
| P2 | evals E1, E2, E4 | Kho thử không có id trùng tiền tố (E1/E10, AC-1/AC-10) như neo DA3b | Bộ tra khớp tiền tố gán đổi AC-10 cho AC-1 | Thêm E10/AC-10, đổi AC-10 thì E1 im | fixed: fixture có E10/AC-10; CL2 thêm mũi tiền tố (E10 chạy lại, E1 mang sang và im; bản trước vòng mang E10) |
