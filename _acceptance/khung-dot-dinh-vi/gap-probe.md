---
slug: khung-dot-dinh-vi
at: 2026-10-28T07:52:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Thiết kế thêm tên việc, mục tiêu và số đã gộp vào `xem --json`, trong khi AC-4 và dòng sổ d-4 hứa kho không có câu giám sát thì `xem --json` không đổi một byte | Làm đúng thiết kế thì KD-4 đỏ ở mọi kho có hàng mang mã; chọn kho thử không lộ trình để KD-4 xanh thì chữ ký tin rằng không đổi gì trong khi mọi kho nhận `xem --json` đổi khuôn | Dòng sổ cho ba khoá mới hoặc trình chủ kho; KD-4 chạy trên kho thử có lộ trình, hàng mang `tep`+`ma`, `gop_da_bao`, kèm đối chứng tên việc có thật trên khung | fixed: dữ liệu riêng của khung đi qua cờ mới `xem --json --khung` mà mod gọi, `xem --json` giữ khuôn cũ (dòng sổ thay d-4); AC-4 và E4 thêm kho thử thứ năm có lộ trình thật của kit, `nguon_hang`, `tep`+`ma`, `muc_tieu`, `gop_da_bao`, đối chứng tên việc và ca đỏ KD-4-do2 |
| P1 | evals | Không eval nào đo tuổi câu trên dòng CẦN ANH — lưới duy nhất đỡ quyết định bỏ tự đóng | Khung vẽ câu treo không có tuổi, hoặc lấy giờ lần đọc thay cho lúc ghi; E3 và E8 vẫn xanh; chủ kho thấy CẦN ANH: 1 mãi mà không biết câu đã cũ | Câu ghi lùi 3 giờ thì dòng mục kết bằng «3 giờ trước»; ca đỏ bỏ phần tuổi ghim «câu treo không có tuổi» | fixed: AC-3 thêm vế tuổi câu; E3 thêm câu ghi bằng CLI với giờ lùi 3 giờ và ca đỏ KD-3-do2; trục B của Coverage trỏ AC-3 |
| P1 | evals | Chiều «Sẽ KHÔNG» của AC-5 đo bằng danh sách đóng 5 chuỗi viết tay, trong khi lời hứa là cả lớp; cờ mục tiêu của thiết kế tự in tên khoá `muc_tieu` | Bảng trạng thái rơi về giá trị không dấu («dang») hoặc dòng CẦN ANH in khoá `can_nguoi`; E5 vẫn xanh | Danh sách chữ cấm do code sinh từ khoá của object `xem --json` thật và bảng giá trị trạng thái; đối chứng dương bằng chuỗi tiêm; một dòng sổ cho cách viết cờ | fixed: E5 sinh chữ cấm trong lượt từ khoá đệ quy của `xem --json --khung` thật và bảng nguồn của gói, loại trừ đóng «xong», «cho» (in ra), đối chứng dương hai chuỗi tiêm, ca đỏ KD-5-do2; cờ mục tiêu viết bằng tiếng người (dòng sổ mới) |
| P1 | design | Dòng sổ d-8 trích chân 1 của ADR «tên + một câu» nhưng chỉ dựng phần tên, không khai lệch [design-floor-vendor-va-ban-va-a#F1] | Cổng ký d-8 tin việc bám đúng ADR; dòng CẦN ANH chỉ có tên việc, chủ kho vẫn phải hỏi giám sát | Dòng sổ thay d-8 khai lệch, hoặc giữ vế một câu và đo | fixed: dòng sổ thay d-8 trích đúng câu của bước (b) «mỗi việc mang tên từ tệp lộ trình»; vế «+ một câu» thuộc lời mời cổng ở bước (c), khai ở thiết kế §3 |
| P1 | contract | Giả định #2 và dòng đường đo «0 dòng chỉ có mã» đo trên lộ trình tạm viết tay đúng khuôn bên đọc; điều kiện CHẾT «thêm cổng người hay lượt gọi» không có đường đo | Lộ trình thật dùng khoá khác hay hàng thật không mang mã, khung thật đầy cờ mà E7 vẫn xanh; thực tế đẻ thêm lượt hỏi chủ kho mà không thước nào bắt | Ca round-trip trên lộ trình do bên viết thật sinh, in tỉ lệ k/N vào giả định #2; một dòng đường đo cho lượt gọi người | fixed: E7 thêm KD-6b chạy trên lộ trình thật của kit (`docs/plans/lo-trinh-kit.json`) với `nguon_hang`, in «hàng có mã có ten_ngan k/N» (số vào giả định #2); Đường đo thêm dòng lượt gọi người đếm tay theo luật (c) |
