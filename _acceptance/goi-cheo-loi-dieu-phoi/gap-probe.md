---
slug: goi-cheo-loi-dieu-phoi
at: 2026-11-14T11:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap-probe — goi-cheo-loi-dieu-phoi

Phản biện context sạch, một lượt, trên design + contract + evals + decisions (+ bài học hồ sơ trước, ô cơ hội).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | AC-1 cho một bảng khác biệt máy tự khai, nới ngưỡng CHẾT chủ kho đã chốt | đổi chữ stderr của khởi tạo lộ trình, máy thêm dòng bảng, E1 vẫn PASS | bảng khác biệt rỗng hoặc trỏ quyết định người | fixed: AC-1 đòi bằng nhau từng byte, không bảng; kho tiêu thụ chép lớp CI của đúng bản đang chạy |
| P0 | design | Dòng sổ d-4 và d-7 ghi nguồn mục tiêu với câu trích là nguyên lý chung, lối khác còn sống | người ký tưởng mục tiêu đã chọn «mặc định đọc bảng» | dòng mới nguồn một-lối hoặc câu hỏi | fixed: hai dòng mới supersedes d-4, d-7, nguồn mot-loi; plugin-declare và khởi tạo lộ trình đổi sang hai nhánh |
| P1 | evals | Ma trận vi phân thiếu bản cài từ chợ fork | chợ my-fork: bản gốc in @my-fork, bản mới in @acceptance-gate-kit, E1 xanh | kho fixture chợ đổi tên trên cả hai cây | fixed: E1 thêm kho chợ fork; vật đi hai nhánh nên giữ từng byte |
| P1 | contract | Ô dò kho kit × cũ không có AC; không eval chạy ba tệp ca cửa tín hiệu đã đổi | bộ dò mới lệch đếm vòng meta ở kho kit; một tệp ca quên trỏ hộp thư, nhát phá chết lặng | start-scan vào vi phân; eval chạy ba tệp ca; nhát phá hộp thư | fixed: AC-1 và E1 thêm start-scan + ca VP-HT; thêm E13, E14, E15 |
| P1 | contract | Giả định 4 (bộ dựng đại diện cây kịch bản) chỉ đo ngoài hồ sơ | kịch bản có mẫu đổi chữ mới, bộ dựng xanh, cây thật treo | eval ghi lệnh đếm hạt giống, hoặc ô not-run có tên | fixed: E16 khai not-run có tên; đo chéo chạy tay cuối vòng, số ghi vào Notes |
