---
slug: vong-la-mot-ket-qua
at: 2026-10-11T00:33:00Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Ngưỡng SỐNG/CHẾT của ô 04/09 không có đường đo, cũng không có dòng bỏ có tên; Đường đo chỉ đọc ngưỡng hàng S3 | Ô mở lại không ký lại nên ngưỡng ô còn treo; phiên nghiệm thu đặt số cạnh ngưỡng ô thì vế SỐNG không thể đạt vì vòng cố ý không dựng dòng Kết quả người thấy | Dòng sổ nêu bat_khi hàng S3 thay SỐNG/CHẾT của ô, cửa veto ở Cổng Phạm vi | fixed: dòng sổ d-20261011T003334Z-5 + đoạn đầu mục Đường đo + design §3 «Ngưỡng của ô nhường cho ngưỡng hàng» |
| P1 | contract | Mẫu số của tỉ lệ trong khoảng loại vòng chưa giao — đếm kiểu sống sót | Ngày 30: vòng 13+ tiêu chí nổ trần chậm giao nhất, rơi khỏi mẫu; ba vòng 8–12 đã giao + hai vòng 15 đang chạy ra 100 % ĐẠT mà vật không đổi | Phân bố cỡ tính trên mọi vòng đã chốt phạm vi; chạm trần chỉ trên vòng đã giao; ca đo có vòng approved cỡ 15 | fixed: design §4.4 hai mẫu số (n_chot · n); AC-7/AC-8 và E7/E8 thêm ca approved chưa giao cỡ 15 + đột biến LT-148-do-song-sot |
| P1 | contract | Cỡ do chính phiên cắt tự khai; không phép đo nào nối tieu_chi đã khai với số tiêu chí thật; E10 chỉ chấm «có chỉ dẫn» | Câu giao gói ba kết quả khai tieu_chi 9, răng 0 cờ, Đường đo ghi ĐẠT; vòng mở ra 16 tiêu chí, 4 lượt chấm | Đồng hồ so tieu_chi khai với tiêu chí thật của hợp đồng hàng trỏ tới; E10 giám khảo tự cắt rồi chấm hàng mình cắt | fixed: `--co --lo-trinh` in du_kien cạnh that + vuot_cho_phep (AC-8, E8, đột biến LT-149-do-du-kien); Đường đo thêm dòng «cỡ khai khớp vật»; E10 đổi câu hỏi |
| P2 | evals | Ma trận khối hỏng của E1 thiếu cho_phep_den < cuối mục tiêu, số không nguyên dương ở khoá khác, khoảng chồng; E4 thiếu ca NFD/NFC | Vật bỏ kiểm một nhánh mà E1 vẫn xanh; vai NFD bị lỗi oan trên đợt crm | Thêm phần tử, số ca in ra bằng số phần tử | fixed: E1 9 → 13 ca; E4 8 → 9 ca (nfd-nfc); AC-1, AC-4 viết lại ma trận |
| P2 | evals | Vế «chỉ đọc» của E7 là khẳng định âm tính không chiều đỏ [d-20261010T135556Z-8] | Băm rỗng hai đầu hoặc tệp ghi ngoài danh sách băm vẫn xanh | Đột biến ghi một tệp trước khi in JSON phải đỏ nêu tệp; số tệp băm > 0 | fixed: LT-148-do-ghi + «số tệp băm > 0» trong E7 và AC-7 |
