---
slug: vung-giao-viec-tu-cat-luot
at: 2026-10-27T23:18:00Z
verdict: findings
p0: 1
p1: 2
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Xét lại ở Cổng Phạm vi là một CỘNG riêng (lệnh hang vung, bước TRONG-DOT, sự kiện cong-pham-vi) mà sổ ghi máy quyết; lời phê chép ở ô chỉ gọi tên vòng; dòng d-10 tự vòng; lối «xét lại thành hạt giống» còn sống. Tiền lệ [design-gate-che-do-chat#F1] · [thiet-ke-nap-tri-thuc#F2] · [vong-don-le-tra-tri-thuc#F1] | Thẻ Cổng Phạm vi xếp AC-7, AC-8 vào máy đã quyết; chủ kho ký mà không thấy một lệnh và một loại sự kiện mới phát hành tới mọi kho | Dòng S1 chi-nguoi supersedes d-6 + mục CỘNG trong design | human-gate1: Hỏi-1 (dòng chi-nguoi supersedes d-6, máy khuyên làm), dòng mới supersedes d-10; design thêm mục «CỘNG cần chủ kho phê» |
| P1 | evals | E8 đo ngưỡng chết bằng 0 < k < 91 — chấp nhận cả mức 78/91 mà thiết kế đã loại; không trần viết trước | Luật màn đẩy phần lớn hàng thành khu/**, k = 85/91, VG-6 vẫn xanh | Trần có căn cứ + danh sách cặp viết trước + ca đỏ đổi mọi vùng thành cấp khu | fixed: E8 so bằng danh sách 25 cặp viết trước, trần 45 (một nửa 91), VG-6-do đổi mọi vùng thành app/khu/** phải đỏ |
| P1 | evals | AC-6 «không mang chuỗi riêng» đo bằng danh sách cấm DP1-07 trên không gian mở | Bản phát lại giữ một slug hay tên màn thật chưa có trong danh sách cấm; E9 xanh, dữ liệu kho tiêu thụ ra kho công khai | Danh sách cho phép (khuôn tên tổng hợp) + đối chứng dương + ca đỏ ghim | fixed: bản phát lại đổi sang tên tổng hợp (H<số>, hang-<số>, man-<chữ>); VG-6-an-danh kiểm mọi chuỗi bằng khuôn cho phép, VG-6-an-danh-do tiêm một slug ngoài khuôn; E9 (DP1-07) giữ làm lưới thứ hai |
| P2 | evals | Ma trận CV-2 chỉ có mảng một phần tử; mutant «chỉ xét phần tử đầu» và «có một phần tử _acceptance/ là cảnh báo» sống | Lượt cắt ghi ["app/khu/man-a/**","**"] không bị cờ; lịch thấy hàng ấy chồng mọi hàng | Ba hàng mảng trộn + CV-2-do2 | fixed: E4 thêm ["app/x/**","**"], ["_acceptance/x/**","app/y/**"], ["app/x/**",""] và CV-2-do2 |
| P2 | contract | Trục D «đã chọn làm hàng kế» không có thước khi vùng mới khai ở Cổng Phạm vi | Hàng z đã nằm trong tiep/P2.json, x khai vùng chồng; không sau, không sự kiện | Một hàng VG-7 cho hàng kế đã chọn + đối chứng | fixed: AC-7 nói rõ hàng đã chọn làm hàng kế mà chưa mở; E10 thêm z2 (tiep/P2.json, chưa hợp đồng) phải nhận sau và rời tiep, đối chứng vùng khác giữ nguyên |
