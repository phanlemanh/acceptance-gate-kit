---
slug: ha-tang-khong-dot-luot
at: 2026-09-24T00:31:08Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Hàng «không run-log» của ma trận AC-4 kỳ vọng round 1 trái với luật đánh số của design §2.B (Iterations có Round 1 thì base = 1, không tally BLOCKED thì ra 2) | Làm đúng design thì E4 đỏ ở hàng 1 và cháy một round; làm theo eval thì hồ sơ đời trước có Iterations mà không có run-log bị chấm đè lên round 1 | Tách hai hàng: trống hoàn toàn → 1; chỉ Iterations Round 1 → 2; số assert thành 9 | fixed: ma trận AC-4/E4 chín hàng [1,2,2,2,1,1,2,2,2] |
| P1 | evals | Dòng finding inContract và khoá ts của hàng chet+finding do fixture tự dựng, không round-trip từ bên viết thật [nhan-trang-thai-va-reality#F1] | Bên viết ghi finding ở mốc giờ khác tally thì một lượt agent-chết-kèm-finding-trong-hợp-đồng bị đọc thành thử-lại-cùng-round mà E4 vẫn xanh | Ca round-trip: workflow chấm thật chạy qua harness sinh run-log, s4-args đọc ra 1 và 2 | fixed: thêm HT-AC4-khu-hoi vào AC-4/E4 |
| P1 | contract | Mảnh bash không có chiều đỏ và không phép đo nào so số ca giữa các mảnh | Mảnh bash thoát 0 trước bước gộp mã thoát thì ca bash đỏ vẫn cho khoá scripts_bash thoát 0 | Bản ghép tệp chạy suite theo marker, tiêm ca bash đỏ; quan hệ passed tất cả = tổng các mảnh trừ n−1 | fixed: AC-2/E2 thêm HT-AC2-do-bash và quan hệ cộng số ca |
| P1 | evals | Không hàng nào ở base ≥ 2 cho lượt BLOCKED hạ tầng; ca hình crm kiem-auth ở trần không được xếp vào ngưỡng | Bản cài chỉ đúng khi base = 1 thì crm round 3 lại hỏi người mà E4 xanh; owner không phân xử được ngưỡng | Hàng trần: Iterations 1–3 + tally round 3 BLOCKED chet → 3 với --no-carry, thiếu cờ thì thông điệp carry; Đường đo nói rõ ca kiem-auth | fixed: HT-AC4-tran + một dòng Đường đo xếp ca kiem-auth là REJECT về bản chất, câu hỏi ở trần là lượt trong thiết kế |
| P2 | evals | Vế «dừng mà không nêu lối để người chọn = chưa hoàn thành» không có assert vắng mặt và không có đột biến | Khuôn mới vẫn giữ vế ấy mà P85 và HT-AC5 xanh, phiên crm tiếp tục dựng lối cho người | Tính chất không chứa «người chọn», «nêu lối» + đột biến chèn lại vế cũ | fixed: AC-5/E5 thêm hai tính chất và đột biến |
